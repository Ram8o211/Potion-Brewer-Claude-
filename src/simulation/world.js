// The unified particle simulation that drives the whole game.
//
// One fixed-timestep, position-based loop advances every material (after
// Macklin et al., "Unified Particle Physics for Real-Time Applications").
// Each particle is solved in one of five *modes*, chosen from its phase and
// rheology every step:
//
//   PBF    thin liquids — position-based fluid density constraints keep them
//          incompressible; pressure corrections are mass weighted, so heavy
//          liquids sink and light ones float (plus a Boussinesq term).
//   GRAN   powders and crushed grains — hard non-penetration contacts with
//          static/kinetic Coulomb friction at the position level: stable
//          piles with an angle of repose, perfectly inelastic (no rebound),
//          mass scaling for stacking stability, sleeping of resting grains.
//   COH    pastes, doughs and very viscous liquids — the same contacts plus
//          cohesion (attraction just beyond contact) and dashpot damping of
//          relative motion. Pastes additionally carry Coulomb friction, which
//          is their yield stress: they hold folds and mounds until the spoon
//          pushes harder (Bingham-like plastic flow, no springs, no rebound).
//   RIGID  frozen material — contacts + shape matching of rigid bodies.
//   GAS    weak purely repulsive pressure, buoyancy against air, thermal
//          jitter and drag; contained by the lid.
//
// Thermal conduction, phase changes, diffusion/mixing and reactions run on
// the same neighbour pairs every other step.

import { PHASE, SIM, TUNE, formPhase } from './constants.js';
import { Particles } from './particles.js';
import { NeighborGrid } from './grid.js';
import { Cauldron, COLUMN } from './cauldron.js';
import { SpeciesTable, MAX_SPECIES } from '../reactions/species.js';
import { refreshParticle } from './derived.js';
import { RigidBodies } from './rigid.js';
import { thermalStep } from './thermal.js';
import { phaseStep, classifyFluid } from './phase.js';
import { diffusionStep } from '../reactions/diffusion.js';
import { ReactionSystem } from '../reactions/reactions.js';
import { ToolState, toolForces, toolConstraints } from './tools.js';
import { Emitter } from './emitter.js';
import { electricStep } from './electric.js';
import { magicStep } from './magic.js';

const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
export const MODE = Object.freeze({ PBF: 0, GRAN: 1, COH: 2, RIGID: 3, GAS: 4 });
const M_PBF = 0, M_GRAN = 1, M_COH = 2, M_RIGID = 3, M_GAS = 4;

const H = SIM.H;
const H2 = H * H;
const R = SIM.RADIUS;
const D = 2 * R;
const POLY6 = 4 / (Math.PI * Math.pow(H, 8));
const SPIKY = 30 / (Math.PI * Math.pow(H, 5));
export const SLEEP_STEPS = 50;
const SLEEP_V = 0.09;
const MASS_SCALE = 1.4;
/** liquids thicker than this (cP) are solved as cohesive viscous matter */
const VISC_COH = 150;
const LN_VISC_COH = Math.log(VISC_COH);
/** reach of cohesion beyond contact */
const COH_REACH = 1.3 * D;

const W = (r2) => {
  const t = H2 - r2;
  return t > 0 ? POLY6 * t * t * t : 0;
};

/** Rest number density for a hexagonal packing at the rest spacing. */
function restDensity(spacing) {
  let n = 0;
  for (let a = -5; a <= 5; a++) {
    for (let b = -5; b <= 5; b++) {
      const x = (a + b * 0.5) * spacing;
      const y = b * spacing * Math.sqrt(3) * 0.5;
      n += W(x * x + y * y);
    }
  }
  return n;
}

export class Simulation {
  /**
   * @param {{size?: string, lookup?: (id:string)=>any, reactions?: any[], capacity?: number}} [opts]
   */
  constructor(opts = {}) {
    this.cauldron = new Cauldron(/** @type {any} */ (opts.size || 'small'));
    // headroom above the fill line: old snapshots from the great vessels can
    // be larger than a small game pot holds
    const cap = opts.capacity || Math.max(this.cauldron.capacity + 400, 1800);
    this.capacity = cap;
    this.maxParticles = this.cauldron.capacity;
    this.p = new Particles(cap);
    this.species = new SpeciesTable();
    /** @type {(id:string)=>any} */
    this.lookup = opts.lookup || (() => undefined);
    const c = this.cauldron;
    this.grid = new NeighborGrid(c.minX, c.minY, c.maxX, c.maxY, H + 0.02, cap);
    const f32 = () => new Float32Array(cap);
    this.colR = f32();
    this.colG = f32();
    this.colB = f32();
    /** fluid number density (also used for free-surface detection) */
    this.dens = f32();
    this.lambda = f32();
    this.gradX = f32();
    this.gradY = f32();
    this.sumG2 = f32();
    this.tmpA = f32();
    this.tmpB = f32();
    this.tmpC = f32();
    this.tmpD = f32();
    this.dmg = f32();
    this.compChange = f32();
    /** density of the surrounding fluid and immersion depth (buoyancy) */
    this.envRho = f32();
    this.immersion = f32();
    /** pressure-solve weights */
    this.fw = f32();
    /** contact parameters for GRAN/COH particles */
    this.fric = f32();
    this.coh = f32();
    this.damp = f32();
    /** share of the fluid pressure solve (1 thin liquid, <1 viscous liquid, 0 otherwise) */
    this.pbf = f32();
    this.mode = new Uint8Array(cap);
    this.nCond = new Uint8Array(cap);
    this.nGas = new Uint8Array(cap);
    this.touchWall = new Uint8Array(cap);
    /** mean density of the fluid body (Boussinesq reference) */
    this.rhoRef = 1;
    this.n0 = restDensity(SIM.SPACING);
    this.n0Gas = this.n0 * 0.32;
    /** @type {Float32Array|null} */
    this._wallFlow = null;
    this._pairCap = 0;
    /** @type {Int32Array} */ this.actK = null;
    /** @type {Float32Array} */ this.actGm = null;
    /** @type {Float32Array} */ this.actUx = null;
    /** @type {Float32Array} */ this.actUy = null;
    /** @type {Float32Array} */ this.actSc = null;
    /** @type {Int32Array} */ this.cK = null;
    this.cN = 0;
    this.rigid = new RigidBodies(this);
    this.tool = new ToolState();
    this.emitter = new Emitter(this);
    this.reactions = new ReactionSystem(this, opts.reactions || []);
    this.furnace = { setting: 0, maxFlame: 340, heatPower: 3.5, minCool: 4, coolPower: 6 };
    this.oxygen = 1;
    /** @type {any[]} */
    this.events = [];
    this.time = 0;
    this.steps = 0;
    this.accumulator = 0;
    this.energyIn = 0;
    this.energyOut = 0;
    /** volume (particles) of each material vented through an open lid */
    this.vented = /** @type {Record<string, number>} */ ({});
    this._rng = 12345;
    this.stats = { stepMs: 0, steps: 0, pairs: 0, awake: 0, faded: 0 };
    this.paused = false;
  }

  // ---------------------------------------------------------------- utilities
  rand() {
    this._rng = (Math.imul(this._rng, 1664525) + 1013904223) >>> 0;
    return this._rng / 4294967296;
  }

  /** @param {any} e */
  emit(e) {
    if (this.events.length < 400) this.events.push(e);
  }

  get count() {
    return this.p.count;
  }

  /** Ensure a material has a species slot. Returns slot or -1. @param {any} def */
  slotFor(def) {
    return this.species.ensure(def, this.lookup);
  }

  /**
   * Add a particle made of a single material.
   * @param {any} def @param {number} x @param {number} y
   * @param {number} [phase] @param {number} [temp]
   */
  addParticle(def, x, y, phase, temp) {
    const slot = this.slotFor(def);
    if (slot < 0) return -1;
    if (this.p.count >= this.maxParticles) return -1;
    const ph = phase !== undefined ? phase : formPhase(def.form);
    const i = this.p.add(x, y, ph, temp !== undefined ? temp : def.storeTemp ?? SIM.AMBIENT);
    if (i < 0) return -1;
    this.p.comp[i * MAX_SPECIES + slot] = 1;
    this.p.q[i] = def.charge || 0;
    refreshParticle(this, i);
    this.envRho[i] = this.p.rho[i];
    this.immersion[i] = 0;
    return i;
  }

  /** Remove a particle, waking neighbours that may have rested on it. @param {number} i */
  removeParticle(i) {
    const p = this.p;
    this.wakeAround(p.x[i], p.y[i], 0.3);
    if (p.group[i] >= 0) this.rigid.markDirty(p.group[i]);
    p.remove(i);
    const last = p.count;
    if (i !== last) {
      for (const arr of [this.colR, this.colG, this.colB, this.dmg, this.dens, this.compChange, this.envRho, this.immersion, this.fric, this.coh, this.damp, this.pbf]) arr[i] = arr[last];
      for (const arr of [this.touchWall, this.nCond, this.nGas, this.mode]) arr[i] = arr[last];
    }
  }

  /** @param {number} x @param {number} y @param {number} r */
  wakeAround(x, y, r) {
    const p = this.p, r2 = r * r;
    for (let k = 0; k < p.count; k++) {
      const dx = p.x[k] - x, dy = p.y[k] - y;
      if (dx * dx + dy * dy < r2) p.sleep[k] = 0;
    }
  }

  /** @param {number} i */
  isAsleep(i) {
    return this.p.sleep[i] >= SLEEP_STEPS;
  }

  /** Total composition (particle volumes per species id). */
  inventory() {
    const p = this.p, sp = this.species, S = MAX_SPECIES;
    const tot = new Float64Array(S);
    for (let i = 0; i < p.count; i++) for (let s = 0; s < sp.count; s++) tot[s] += p.comp[i * S + s];
    /** @type {Record<string, number>} */
    const out = {};
    for (let s = 0; s < sp.count; s++) if (sp.defs[s] && tot[s] > 1e-6) out[sp.defs[s].id] = tot[s];
    return out;
  }

  /** Total mass (Σ density·volume) of all particles. */
  totalMass() {
    const p = this.p, sp = this.species, S = MAX_SPECIES;
    let m = 0;
    for (let i = 0; i < p.count; i++) for (let s = 0; s < sp.count; s++) m += p.comp[i * S + s] * sp.density[s];
    return m;
  }

  /** Total thermal energy including latent stores and the iron wall. */
  totalEnergy() {
    const p = this.p;
    let e = 0;
    for (let i = 0; i < p.count; i++) e += p.rhoCp[i] * p.temp[i] + p.lat[i] + p.eph[i];
    const c = this.cauldron;
    for (let k = 0; k < c.cellT.length; k++) e += c.cellC[k] * c.cellT[k];
    return e;
  }

  // ---------------------------------------------------------------- stepping
  /**
   * Advance by wall-clock frame time; runs whole fixed steps.
   * @param {number} frameDt seconds @param {number} [speed] time multiplier
   * @param {number} [maxSteps] cap per call (avoids a spiral of death; time then dilates)
   */
  advance(frameDt, speed = 1, maxSteps = 6) {
    if (this.paused) return 0;
    this.accumulator += Math.min(frameDt, 0.1) * speed;
    let n = Math.floor(this.accumulator / SIM.DT);
    if (n > maxSteps) {
      n = maxSteps;
      this.accumulator = 0;
    } else {
      this.accumulator -= n * SIM.DT;
    }
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    this.tool.beginFrame();
    for (let k = 0; k < n; k++) {
      this.tool.substep(k, n);
      this.step();
    }
    if (n > 0 && typeof performance !== 'undefined') {
      const ms = (performance.now() - t0) / n;
      this.stats.stepMs = this.stats.stepMs * 0.9 + ms * 0.1;
    }
    this.stats.steps = n;
    return n;
  }

  /** One fixed physics step. */
  step() {
    const dt = SIM.DT;
    const p = this.p;
    this.time += dt;
    this.steps++;

    this.emitter.step(dt);
    this._refreshDerived();
    this._computeModes();
    this._applyForces(dt);
    toolForces(this, dt);
    this._predict(dt);

    this.stats.pairs = this.grid.buildPairs(p.x, p.y, p.count, H + 0.012);
    this.rigid.update();
    this._buildContactList();

    for (let it = 0; it < TUNE.iterations; it++) {
      this._fluidConstraints(it);
      this._contacts();
      toolConstraints(this, dt);
      this._boundary();
      this.rigid.shapeMatch();
    }

    this._updateVelocities(dt);
    this._viscosity();
    this._viscousSmoothing();
    this._sleepUpdate();
    this._percolate();

    if (this.steps % 2 === 0) {
      const dt2 = dt * 2;
      thermalStep(this, dt2);
      electricStep(this, dt2);
      diffusionStep(this, dt2);
      this.reactions.step(dt2);
      phaseStep(this, dt2);
      magicStep(this, dt2);
      this._oxygen(dt2);
    }
    this._vent();
  }

  _refreshDerived() {
    const p = this.p, n = p.count;
    // dirty particles every step, plus a rolling refresh for temperature-dependent values
    const chunk = Math.max(48, Math.ceil(n / 12));
    const start = (this.steps * chunk) % Math.max(1, n);
    for (let k = 0; k < chunk && k < n; k++) p.dirty[(start + k) % n] = 1;
    for (let i = 0; i < n; i++) {
      if (!p.dirty[i]) continue;
      const before = p.phase[i];
      refreshParticle(this, i);
      if (p.phase[i] !== GAS && p.phase[i] !== SOLID) classifyFluid(this, i);
      if (p.phase[i] !== before) p.sleep[i] = 0;
    }
  }

  /** Choose the solver mode and contact parameters of every particle. */
  _computeModes() {
    const p = this.p, n = p.count;
    const mode = this.mode, fric = this.fric, coh = this.coh, damp = this.damp, pbf = this.pbf;
    for (let i = 0; i < n; i++) {
      const ph = p.phase[i];
      pbf[i] = 0;
      if (ph === GAS) { mode[i] = M_GAS; continue; }
      if (ph === SOLID) { mode[i] = M_RIGID; fric[i] = 0.45; coh[i] = 0; damp[i] = 0; continue; }
      if (ph === POWDER) {
        mode[i] = M_GRAN;
        const g = p.gran[i];
        const wet = g < 0.97 && g > 0.5 ? Math.min(1, (0.97 - g) * 5) : 0; // damp grains clump
        fric[i] = p.friction[i] + wet * 0.25;
        coh[i] = wet * 0.3;
        damp[i] = wet * 0.1;
        continue;
      }
      if (ph === PASTE) {
        // paste rheology from its solids content and binder
        mode[i] = M_COH;
        const s = Math.max(0, Math.min(1, (p.gran[i] - 0.34) / 0.42));
        const b = p.binder[i];
        fric[i] = 0.22 + 0.85 * s * (0.45 + 0.55 * b);
        coh[i] = 0.1 + 0.3 * s * (0.4 + 0.6 * b);
        damp[i] = 0.12 + 0.2 * s;
        continue;
      }
      // liquid
      if (p.lnMu[i] >= LN_VISC_COH) {
        mode[i] = M_COH;
        const l10 = p.lnMu[i] / Math.LN10;
        fric[i] = 0;
        coh[i] = 0.05;
        damp[i] = Math.max(0.02, Math.min(TUNE.viscDampMax, (l10 - 2.1) * TUNE.viscDampSlope));
        // a softened share of the pressure solve keeps viscous liquids levelling (no yield stress)
        pbf[i] = TUNE.viscPressure;
      } else {
        mode[i] = M_PBF;
        fric[i] = 0; coh[i] = 0; damp[i] = 0;
        pbf[i] = 1;
      }
    }
  }

  _applyForces(dt) {
    const p = this.p, n = p.count;
    const g = SIM.GRAVITY;
    const nCond = this.nCond;
    const buoy = TUNE.buoyancy;
    for (let i = 0; i < n; i++) {
      if (p.sleep[i] >= SLEEP_STEPS) {
        p.vx[i] = 0;
        p.vy[i] = 0;
        continue;
      }
      if (p.phase[i] === GAS) {
        // buoyancy relative to air (ideal-gas temperature dependence)
        const rhoG = (p.gasRho[i] * 293) / (p.temp[i] + 273);
        let ay = (g * 0.22 * (rhoG - 1)) / Math.max(0.4, rhoG);
        // bubbles trapped in liquid rise quickly
        if (nCond[i] >= 3) ay = -g * 1.6;
        p.vy[i] += ay * dt;
        // gentle thermal (Brownian) agitation, stronger when hot
        const jit = 0.066 * Math.sqrt(Math.max(30, p.temp[i] + 273) / 373);
        p.vx[i] += (this.rand() - 0.5) * jit;
        p.vy[i] += (this.rand() - 0.5) * jit;
        const drag = Math.exp(-2.6 * dt);
        p.vx[i] *= drag;
        p.vy[i] *= drag;
      } else {
        // gravity + Archimedes (Boussinesq form: body force relative to the
        // mean fluid density; hot fluid expands and rises → convection)
        const b = (this.immersion[i] * (p.rho[i] - this.rhoRef)) / this.rhoRef;
        p.vy[i] += g * Math.max(0.3, 1 + b * buoy) * dt;
      }
    }
  }

  _predict(dt) {
    const p = this.p, n = p.count;
    const vmax = SIM.MAX_SPEED;
    for (let i = 0; i < n; i++) {
      p.px[i] = p.x[i];
      p.py[i] = p.y[i];
      if (p.sleep[i] >= SLEEP_STEPS) continue;
      let vx = p.vx[i], vy = p.vy[i];
      const sp2 = vx * vx + vy * vy;
      if (sp2 > vmax * vmax) {
        const s = vmax / Math.sqrt(sp2);
        vx *= s; vy *= s;
        p.vx[i] = vx; p.vy[i] = vy;
      }
      p.x[i] += vx * dt;
      p.y[i] += vy * dt;
    }
  }

  /**
   * Inverse-mass weight of a particle in constraint projection (mass
   * contrast slightly exaggerated for faster, robust stratification);
   * sleeping grains are immovable.
   * @param {number} i
   */
  _invm(i) {
    if (this.p.sleep[i] >= SLEEP_STEPS) return 0;
    if (this.p.phase[i] === GAS) return 1;
    const r = this.p.rho[i];
    return TUNE.massPow === 2 ? 1 / (r * r) : Math.pow(r, -TUNE.massPow);
  }

  _fluidConstraints(iter) {
    const p = this.p, n = p.count;
    const { pairI, pairJ, pairCount } = this.grid;
    const dens = this.dens, gx = this.gradX, gy = this.gradY, s2 = this.sumG2, lam = this.lambda;
    const nCond = this.nCond, nGas = this.nGas;
    const xs = p.x, ys = p.y, mode = this.mode, pbf = this.pbf;
    const W0 = POLY6 * H2 * H2 * H2;
    const n0 = this.n0, n0g = this.n0Gas;
    const fw = this.fw;
    const sleep = p.sleep, phase = p.phase, rho = p.rho, mp = TUNE.massPow;
    for (let i = 0; i < n; i++) {
      // inverse mass weighting ρ^-massPow (inlined: this runs every iteration)
      const r = rho[i];
      fw[i] = sleep[i] >= SLEEP_STEPS ? 0 : phase[i] === GAS ? 1 : mp === 2 ? 1 / (r * r) : Math.pow(r, -mp);
      dens[i] = W0;
      gx[i] = 0; gy[i] = 0; s2[i] = 0;
      if (iter === 0) { nCond[i] = 0; nGas[i] = 0; }
    }
    if (this._pairCap !== this.grid.pairCap) {
      this._pairCap = this.grid.pairCap;
      this.actK = new Int32Array(this._pairCap);
      this.actGm = new Float32Array(this._pairCap);
      this.actUx = new Float32Array(this._pairCap);
      this.actUy = new Float32Array(this._pairCap);
      this.actSc = new Float32Array(this._pairCap);
    }
    const actK = this.actK, actGm = this.actGm, actUx = this.actUx, actUy = this.actUy, actSc = this.actSc;
    const kCorr = TUNE.kCorr;
    const Wdq = W(0.3 * H * (0.3 * H));
    // Pass 1: densities and constraint gradients; per-pair geometry is cached
    // so the correction pass needs no square roots (Jacobi-style PBF).
    let na = 0;
    for (let k = 0; k < pairCount; k++) {
      const i = pairI[k], j = pairJ[k];
      const dx = xs[i] - xs[j], dy = ys[i] - ys[j];
      const r2 = dx * dx + dy * dy;
      if (r2 >= H2 || r2 < 1e-12) continue;
      const mi = mode[i], mj = mode[j];
      const gi = mi === M_GAS, gj = mj === M_GAS;
      if (iter === 0) {
        if (gi && !gj) nCond[i]++;
        else if (gj && !gi) nCond[j]++;
        else if (gi && gj) { nGas[i]++; nGas[j]++; }
        else { nCond[i]++; nCond[j]++; }
      }
      if (gi !== gj) continue;
      const fi = gi || pbf[i] > 0;
      const fj = gj || pbf[j] > 0;
      if (!fi && !fj) continue;
      const r = Math.sqrt(r2);
      const t = H2 - r2;
      const w = POLY6 * t * t * t;
      const hr = H - r;
      const gm = (SPIKY * hr * hr) / (gi ? n0g : n0); // |∇W| / n0
      const ux = dx / r, uy = dy / r;
      if (fi) {
        dens[i] += w;
        gx[i] -= gm * ux; gy[i] -= gm * uy;
        s2[i] += fw[j] * gm * gm;
      }
      if (fj) {
        dens[j] += w;
        gx[j] += gm * ux; gy[j] += gm * uy;
        s2[j] += fw[i] * gm * gm;
      }
      actK[na] = k;
      actGm[na] = gm;
      actUx[na] = ux;
      actUy[na] = uy;
      if (!gi && fi && fj) {
        const q = w / Wdq;
        actSc[na] = kCorr * q * q * q * q; // artificial pressure (anti-clumping)
      } else actSc[na] = 0;
      na++;
    }
    // λ per fluid particle
    const cohL = TUNE.cohesionLiquid, eps = TUNE.epsilon;
    for (let i = 0; i < n; i++) {
      const m = mode[i];
      if (pbf[i] > 0) {
        let C = dens[i] / n0 - 1;
        if (C < 0) C *= cohL; // mild surface tension
        const den = fw[i] * (gx[i] * gx[i] + gy[i] * gy[i]) + s2[i] + eps;
        lam[i] = (-C / den) * pbf[i];
      } else if (m === M_GAS) {
        let C = dens[i] / n0g - 1;
        if (C < 0) C = 0;
        const den = fw[i] * (gx[i] * gx[i] + gy[i] * gy[i]) + s2[i] + 40;
        lam[i] = (-C / den) * 0.25;
      } else {
        lam[i] = 0;
      }
    }
    // Pass 2: position corrections
    //   ∇_i W/n0 = −gm·u ;  Δx_i = w_i·s·∇_i W/n0 ,  Δx_j = −w_j·s·∇_i W/n0
    const mc = TUNE.maxCorr;
    for (let a = 0; a < na; a++) {
      const k = actK[a];
      const i = pairI[k], j = pairJ[k];
      let s = lam[i] + lam[j] - actSc[a];
      if (s === 0) continue;
      // non-fluid partners are only pushed, never pulled, by liquid pressure
      if (s > 0 && (pbf[i] === 0 || pbf[j] === 0) && mode[i] !== M_GAS) s = 0;
      const mag = -s * actGm[a];
      const ux = actUx[a], uy = actUy[a];
      let di = mag * fw[i], dj = mag * fw[j];
      if (di > mc) di = mc; else if (di < -mc) di = -mc;
      if (dj > mc) dj = mc; else if (dj < -mc) dj = -mc;
      xs[i] += ux * di; ys[i] += uy * di;
      xs[j] -= ux * dj; ys[j] -= uy * dj;
    }
  }

  /** Pairs that need contact handling this step. */
  _buildContactList() {
    const p = this.p;
    const { pairI, pairJ, pairCount } = this.grid;
    if (!this.cK || this.cK.length < pairCount) this.cK = new Int32Array(this.grid.pairCap);
    const mode = this.mode, xs = p.x, ys = p.y, grp = p.group;
    let nc = 0;
    const lim2 = (COH_REACH + 0.01) * (COH_REACH + 0.01);
    for (let k = 0; k < pairCount; k++) {
      const i = pairI[k], j = pairJ[k];
      const mi = mode[i], mj = mode[j];
      if (mi === M_PBF && mj === M_PBF) continue;
      if (mi === M_GAS && mj === M_GAS) continue;
      if (mi === M_RIGID && mj === M_RIGID && grp[i] === grp[j] && grp[i] >= 0) continue;
      const dx = xs[j] - xs[i], dy = ys[j] - ys[i];
      if (dx * dx + dy * dy > lim2) continue;
      this.cK[nc++] = k;
    }
    this.cN = nc;
  }

  _contacts() {
    const p = this.p;
    const { pairI, pairJ } = this.grid;
    const cK = this.cK, cN = this.cN;
    const xs = p.x, ys = p.y, pxs = p.px, pys = p.py;
    const mode = this.mode, fric = this.fric, coh = this.coh, damp = this.damp;
    const sleep = p.sleep;
    for (let a = 0; a < cN; a++) {
      const k = cK[a];
      const i = pairI[k], j = pairJ[k];
      const mi = mode[i], mj = mode[j];
      const gi = mi === M_GAS, gj = mj === M_GAS;
      const solidI = mi === M_GRAN || mi === M_COH || mi === M_RIGID;
      const solidJ = mj === M_GRAN || mj === M_COH || mj === M_RIGID;
      const both = solidI && solidJ;
      const pbf = this.pbf;
      if (pbf[i] > 0 && pbf[j] > 0) {
        // two viscous-liquid particles: pressure is the fluid solve's job; only viscous damping here
        const dp = Math.max(damp[i], damp[j]);
        if (dp <= 0) continue;
        const dx = xs[j] - xs[i], dy = ys[j] - ys[i];
        const d2 = dx * dx + dy * dy;
        if (d2 >= COH_REACH * COH_REACH) continue;
        const imi = sleep[i] >= SLEEP_STEPS ? 0 : p.invMass[i];
        const imj = sleep[j] >= SLEEP_STEPS ? 0 : p.invMass[j];
        const nm = imi + imj;
        if (nm <= 0) continue;
        const rx = (xs[i] - pxs[i]) - (xs[j] - pxs[j]);
        const ry = (ys[i] - pys[i]) - (ys[j] - pys[j]);
        const f = dp * (1 - Math.sqrt(d2) / COH_REACH);
        xs[i] -= rx * f * (imi / nm); ys[i] -= ry * f * (imi / nm);
        xs[j] += rx * f * (imj / nm); ys[j] += ry * f * (imj / nm);
        continue;
      }
      let dmin;
      if (both) dmin = D;
      else if (gi || gj) dmin = 0.082;
      else dmin = 0.09;
      const dx = xs[j] - xs[i], dy = ys[j] - ys[i];
      const d2 = dx * dx + dy * dy;
      if (d2 < 1e-12) continue;
      // cohesion (pastes, viscous liquids, damp grains) reaches slightly beyond contact
      let cp = 0;
      if (both) {
        cp = Math.min(coh[i], coh[j]);
        if (cp === 0 && (mi === M_COH || mj === M_COH)) cp = 0.5 * Math.max(coh[i], coh[j]);
      }
      const reach = cp > 0 ? COH_REACH : dmin;
      if (d2 >= reach * reach) continue;
      const d = Math.sqrt(d2);
      const nx = dx / d, ny = dy / d;
      const aslI = sleep[i] >= SLEEP_STEPS, aslJ = sleep[j] >= SLEEP_STEPS;
      let imi = aslI ? 0 : p.invMass[i];
      let imj = aslJ ? 0 : p.invMass[j];
      if (both) {
        // mass scaling: lower particles act heavier → stable stacking with few iterations
        imi *= Math.exp(-MASS_SCALE * ys[i]);
        imj *= Math.exp(-MASS_SCALE * ys[j]);
      }
      const norm = imi + imj;
      if (norm <= 0) continue;
      const wi = imi / norm, wj = imj / norm;
      if (d >= dmin) {
        const pull = (d - dmin) * cp;
        xs[i] += nx * pull * wi; ys[i] += ny * pull * wi;
        xs[j] -= nx * pull * wj; ys[j] -= ny * pull * wj;
      } else {
        const C = dmin - d;
        // wake a sleeping particle on a real impact
        if (aslJ && !aslI && (C > 0.012 || Math.abs(p.vx[i]) + Math.abs(p.vy[i]) > 1.2)) sleep[j] = 0;
        if (aslI && !aslJ && (C > 0.012 || Math.abs(p.vx[j]) + Math.abs(p.vy[j]) > 1.2)) sleep[i] = 0;
        xs[i] -= nx * C * wi; ys[i] -= ny * C * wi;
        xs[j] += nx * C * wj; ys[j] += ny * C * wj;
        if (both) {
          // position-based Coulomb friction (static & kinetic)
          const mus = mi === M_RIGID || mj === M_RIGID ? 0.45 : mi === mj ? Math.min(fric[i], fric[j]) : 0.5 * (fric[i] + fric[j]);
          if (mus > 0) {
            const rx = (xs[i] - pxs[i]) - (xs[j] - pxs[j]);
            const ry = (ys[i] - pys[i]) - (ys[j] - pys[j]);
            const rn = rx * nx + ry * ny;
            const tx = rx - rn * nx, ty = ry - rn * ny;
            const tl = Math.sqrt(tx * tx + ty * ty);
            if (tl > 1e-9) {
              const f = tl < mus * C ? 1 : Math.min((mus * 0.78 * C) / tl, 1);
              xs[i] -= tx * f * wi; ys[i] -= ty * f * wi;
              xs[j] += tx * f * wj; ys[j] += ty * f * wj;
            }
          }
        }
      }
      // viscous dashpot between cohesive matter (and its drag on touching liquid)
      let dp = 0;
      if (mi === M_COH || mj === M_COH) dp = Math.max(damp[i], damp[j]) * (both ? 1 : 0.5);
      else if (both) dp = Math.min(damp[i], damp[j]);
      if (dp > 0) {
        const rx = (xs[i] - pxs[i]) - (xs[j] - pxs[j]);
        const ry = (ys[i] - pys[i]) - (ys[j] - pys[j]);
        const f = dp * (1 - Math.max(0, d - dmin) / (COH_REACH - dmin + 1e-6));
        xs[i] -= rx * f * wi; ys[i] -= ry * f * wi;
        xs[j] += rx * f * wj; ys[j] += ry * f * wj;
      }
    }
  }

  _boundary() {
    const p = this.p, n = p.count, c = this.cauldron;
    const xs = p.x, ys = p.y, pxs = p.px, pys = p.py;
    const mode = this.mode;
    const lidClosed = c.lidClosed;
    const tw = this.touchWall;
    for (let i = 0; i < n; i++) {
      if (p.sleep[i] >= SLEEP_STEPS) continue;
      let x = xs[i], y = ys[i];
      tw[i] = 0;
      if (c.roughDist(x, y) < -0.12 && y > 0.12) continue; // far from every wall and the lid
      const m = mode[i];
      const r = m === M_GAS ? 0.045 : R;
      const d = c.sample(x, y);
      if (d > -r) {
        const pen = d + r;
        const nx = c.nx, ny = c.ny;
        x -= nx * pen;
        y -= ny * pen;
        tw[i] = 1;
        // wall friction
        const rx = x - pxs[i], ry = y - pys[i];
        const rn = rx * nx + ry * ny;
        const tx = rx - rn * nx, ty = ry - rn * ny;
        const tl = Math.sqrt(tx * tx + ty * ty);
        if (tl > 1e-9) {
          let f = 0;
          if (m === M_GRAN || m === M_COH) {
            const mus = Math.max(0.1, this.fric[i] * 0.85);
            f = tl < mus * pen ? 1 : Math.min((mus * 0.75 * pen) / tl, 1);
            if (m === M_COH) f = Math.max(f, this.damp[i]);
          } else if (m === M_RIGID) {
            f = tl < 0.4 * pen ? 1 : Math.min((0.3 * pen) / tl, 1);
          } else if (m === M_PBF) {
            f = Math.min(0.5, 0.012 * Math.max(0, p.lnMu[i] - 2.3));
          }
          x -= tx * f;
          y -= ty * f;
        }
      } else if (d > -r - 0.02) {
        tw[i] = 1;
      }
      if (lidClosed && y < r && Math.abs(x) <= c.mouth + 0.05) {
        y = r; // lid underside
        tw[i] = 2;
        if (m !== M_GAS && m !== M_PBF) x -= (x - pxs[i]) * 0.5;
      } else if (y < -COLUMN + r) {
        y = -COLUMN + r;
      }
      xs[i] = x;
      ys[i] = y;
    }
  }

  _updateVelocities(dt) {
    const p = this.p, n = p.count;
    const inv = 1 / dt;
    const vmax = SIM.MAX_SPEED;
    for (let i = 0; i < n; i++) {
      if (p.sleep[i] >= SLEEP_STEPS) {
        p.x[i] = p.px[i];
        p.y[i] = p.py[i];
        p.vx[i] = 0; p.vy[i] = 0;
        continue;
      }
      let vx = (p.x[i] - p.px[i]) * inv;
      let vy = (p.y[i] - p.py[i]) * inv;
      const s2 = vx * vx + vy * vy;
      if (s2 > vmax * vmax) {
        const s = vmax / Math.sqrt(s2);
        vx *= s; vy *= s;
      }
      p.vx[i] = vx;
      p.vy[i] = vy;
    }
  }

  /**
   * Velocity-level passes: XSPH viscosity between thin liquids, drag
   * between liquid and grains, agitation (local shear) measurement and the
   * buoyancy environment.
   */
  _viscosity() {
    const p = this.p, n = p.count;
    const { pairI, pairJ, pairCount } = this.grid;
    const xs = p.x, ys = p.y, vx = p.vx, vy = p.vy, mode = this.mode;
    const sumW = this.tmpA, shear = this.lambda, envW = this.gradX, envR = this.gradY;
    for (let i = 0; i < n; i++) { sumW[i] = 0; shear[i] = 0; envW[i] = 0; envR[i] = 0; }
    const LN10 = Math.LN10;
    const vb = TUNE.viscBase, vs = TUNE.viscSlope;
    for (let k = 0; k < pairCount; k++) {
      const i = pairI[k], j = pairJ[k];
      const mi = mode[i], mj = mode[j];
      if (mi === M_GAS || mj === M_GAS) continue;
      const dx = xs[i] - xs[j], dy = ys[i] - ys[j];
      const r2 = dx * dx + dy * dy;
      if (r2 >= H2) continue;
      const w = 1 - Math.sqrt(r2) / H;
      const dvx = vx[j] - vx[i], dvy = vy[j] - vy[i];
      const dvl = Math.abs(dvx) + Math.abs(dvy);
      shear[i] += dvl * w; shear[j] += dvl * w;
      sumW[i] += w; sumW[j] += w;
      const fi = mi === M_PBF || mi === M_COH, fj = mj === M_PBF || mj === M_COH;
      if (fj) { envW[i] += w; envR[i] += w * p.rho[j]; }
      if (fi) { envW[j] += w; envR[j] += w * p.rho[i]; }
      let c;
      if (mi === M_PBF && mj === M_PBF) {
        const lnMu = 0.5 * (p.lnMu[i] + p.lnMu[j]);
        c = vb + vs * Math.max(0, lnMu / LN10);
        if (c > 0.6) c = 0.6;
      } else if (mi === M_PBF || mj === M_PBF) {
        // drag between grains / pastes / solids and the surrounding liquid
        const lnMu = mi === M_PBF ? p.lnMu[i] : p.lnMu[j];
        c = 0.08 + 0.07 * Math.max(0, lnMu / LN10);
        // fast-flowing liquid erodes resting grains
        if (dvl > 1.4) { wakeIfAsleep(p, i); wakeIfAsleep(p, j); }
      } else continue;
      const kk = (c * w) / 4.2;
      const ri = p.rho[i], rj = p.rho[j];
      const sm = 2 / (ri + rj);
      const ai = p.sleep[i] >= SLEEP_STEPS ? 0 : kk * rj * sm;
      const aj = p.sleep[j] >= SLEEP_STEPS ? 0 : kk * ri * sm;
      vx[i] += dvx * ai; vy[i] += dvy * ai;
      vx[j] -= dvx * aj; vy[j] -= dvy * aj;
    }
    let refW = 0, refR = 0;
    for (let i = 0; i < n; i++) {
      const sw = sumW[i];
      p.agit[i] = p.agit[i] * 0.92 + (sw > 0 ? shear[i] / sw : 0) * 0.08;
      const ew = envW[i];
      if (ew > 0.05) {
        this.envRho[i] = envR[i] / ew;
        this.immersion[i] = Math.min(1, ew / 2.5);
        refW += this.immersion[i];
        refR += this.immersion[i] * p.rho[i];
      } else {
        this.envRho[i] = p.rho[i];
        this.immersion[i] = 0;
      }
    }
    if (refW > 1) this.rhoRef = refR / refW;
  }

  /**
   * Implicit-style viscosity for cohesive (viscous / paste) matter: Jacobi
   * sweeps pull each particle's velocity toward its neighbours' mean with a
   * strength set by its damping, so shear in honey or dough decays quickly.
   */
  _viscousSmoothing() {
    const p = this.p, n = p.count;
    const { pairI, pairJ, pairCount } = this.grid;
    const mode = this.mode, xs = p.x, ys = p.y;
    const alpha = this.tmpA, sx = this.tmpB, sy = this.tmpC, sw = this.tmpD;
    let any = false;
    for (let i = 0; i < n; i++) {
      alpha[i] = mode[i] === M_COH ? Math.min(0.9, this.damp[i] * 2.5) : 0;
      if (alpha[i] > 0) any = true;
    }
    if (!any) return;
    const vx = p.vx, vy = p.vy;
    const tw = this.touchWall;
    for (let sweep = 0; sweep < 2; sweep++) {
      for (let i = 0; i < n; i++) { sx[i] = 0; sy[i] = 0; sw[i] = 0; }
      for (let k = 0; k < pairCount; k++) {
        const i = pairI[k], j = pairJ[k];
        if (alpha[i] === 0 && alpha[j] === 0) continue;
        if (mode[i] === M_GAS || mode[j] === M_GAS) continue;
        const dx = xs[i] - xs[j], dy = ys[i] - ys[j];
        const r2 = dx * dx + dy * dy;
        if (r2 >= H2) continue;
        const w = 1 - Math.sqrt(r2) / H;
        sx[i] += vx[j] * w; sy[i] += vy[j] * w; sw[i] += w;
        sx[j] += vx[i] * w; sy[j] += vy[i] * w; sw[j] += w;
      }
      for (let i = 0; i < n; i++) {
        const a = alpha[i];
        if (a === 0) continue;
        let Wt = sw[i];
        if (tw[i]) Wt += 1.2; // no-slip iron wall
        if (Wt <= 0) continue;
        vx[i] += (sx[i] / Wt - vx[i]) * a;
        vy[i] += (sy[i] / Wt - vy[i]) * a;
      }
    }
  }

  /**
   * Steam and gas caught inside paste or a powder bed work their way up by
   * trading places with the matter just above them (a yield-stress paste
   * gives no buoyant path otherwise). Swaps move whole particles, so mass,
   * composition and heat all travel with them.
   */
  _percolate() {
    const p = this.p, n = p.count, mode = this.mode, nCond = this.nCond;
    const R = 0.085, R2 = R * R;
    for (let i = 0; i < n; i++) {
      if (mode[i] !== M_GAS || nCond[i] < 3 || this.rand() > 0.2) continue;
      const x = p.x[i], y = p.y[i];
      let best = -1, by = y - 0.015;
      this.grid.query(x, y, R, (j) => {
        const mj = mode[j];
        if (mj !== M_COH && mj !== M_GRAN) return;
        if (p.y[j] >= by) return;
        const dx = p.x[j] - x, dy = p.y[j] - y;
        if (dx * dx + dy * dy > R2 || Math.abs(dx) > 0.6 * -dy + 0.02) return;
        best = j; by = p.y[j];
      });
      if (best < 0) continue;
      const j = best;
      p.x[i] = p.x[j]; p.y[i] = p.y[j];
      p.x[j] = x; p.y[j] = y;
      p.sleep[j] = 0;
    }
  }

  _sleepUpdate() {
    const p = this.p, n = p.count;
    const check = this.steps % 30 === 0;
    const mode = this.mode;
    for (let i = 0; i < n; i++) {
      const m = mode[i];
      // grains and stiff pastes may rest perfectly still
      const canSleep = m === M_GRAN || (m === M_COH && this.fric[i] > 0.35);
      if (!canSleep) { p.sleep[i] = 0; continue; }
      if (p.sleep[i] >= SLEEP_STEPS) {
        if (check && !this._supported(i)) p.sleep[i] = 0;
        continue;
      }
      const v2 = p.vx[i] * p.vx[i] + p.vy[i] * p.vy[i];
      if (v2 < SLEEP_V * SLEEP_V && this.nCond[i] >= 2) p.sleep[i]++;
      else p.sleep[i] = 0;
    }
  }

  /** Does a resting particle still have something underneath it? @param {number} i */
  _supported(i) {
    const p = this.p;
    if (this.touchWall[i]) return true;
    const x = p.x[i], y = p.y[i];
    let below = 0;
    this.grid.query(x, y, 0.12, (j) => {
      if (j === i || p.phase[j] === GAS) return;
      const dx = p.x[j] - x, dy = p.y[j] - y;
      if (dy > 0.025 && dx * dx + dy * dy < 0.0135) below++;
    });
    return below > 0;
  }

  _oxygen(dt) {
    const c = this.cauldron;
    const rate = c.lidClosed ? 0.004 : 0.6;
    this.oxygen += (1 - this.oxygen) * Math.min(1, rate * dt);
  }

  _vent() {
    const p = this.p, c = this.cauldron;
    if (c.lidClosed) return;
    for (let i = p.count - 1; i >= 0; i--) {
      if (p.phase[i] === GAS && p.y[i] < -COLUMN + 0.12) {
        const sp = this.species;
        for (let s = 0; s < sp.count; s++) {
          const f = p.comp[i * MAX_SPECIES + s];
          if (f > 0 && sp.defs[s]) this.vented[sp.defs[s].id] = (this.vented[sp.defs[s].id] || 0) + f;
        }
        this.removeParticle(i);
      }
    }
  }

  /** Release species slots no particle uses any more. */
  compactSpecies() {
    const p = this.p, sp = this.species, S = MAX_SPECIES;
    for (let s = 0; s < sp.count; s++) {
      if (!sp.defs[s]) continue;
      let used = false;
      for (let i = 0; i < p.count && !used; i++) if (p.comp[i * S + s] > 1e-7) used = true;
      if (!used && !this.reactions.needsSlot(sp.defs[s].id)) sp.release(s);
    }
  }

  /** Remove everything (cleaning the cauldron). */
  clear() {
    this.p.count = 0;
    this.rigid.reset();
    this.emitter.stop();
    for (let s = 0; s < MAX_SPECIES; s++) if (this.species.defs[s]) this.species.release(s);
    this.vented = {};
  }
}

/** @param {Particles} p @param {number} i */
function wakeIfAsleep(p, i) {
  if (p.sleep[i] >= SLEEP_STEPS) p.sleep[i] = 0;
}

export { formPhase };
