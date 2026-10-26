// Contact diffusion — the visible mixing model.
//
// Composition (volume fractions) is exchanged only between touching,
// compatible particles, symmetrically, so total species volume (and mass)
// is conserved exactly. Mixing therefore starts at contact interfaces and
// spreads through connected material; anything that moves particles
// (convection, pouring, the spoon) carries partially mixed matter along.
// Local shear ("agitation", measured from real particle velocities)
// multiplies the exchange rate, which is why stirring homogenises a brew
// dramatically faster and leaves swirling colour gradients on the way.
//
// Pair rules:
//   liquid/paste ↔ liquid/paste : molecular diffusion ∝ T/√μ, boosted by shear
//   … and with a paste      : the liquid between its grains (liquids and
//                             dissolved solute) also exchanges at the rate of
//                             that carrier liquid, not the paste's stiffness,
//                             so a paste takes on the colour of the brew around
//                             it while its undissolved grains stay put
//   powder ↔ liquid/paste       : surface wetting only (capped) unless agitated;
//                                 soluble powders also dissolve slowly at rest
//   damp powder ↔ powder        : moisture spreads only when kneaded
//   gas ↔ gas                   : fast diffusion
//   anything else (solids, gas↔condensed) : no exchange

import { PHASE } from '../simulation/constants.js';
import { MAX_SPECIES } from './species.js';
import { compatFactor } from './compatibility.js';

const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
const RD = 0.16;

/** @param {import('../simulation/world.js').Simulation} sim @param {number} dt */
export function diffusionStep(sim, dt) {
  const p = sim.p, comp = p.comp, S = MAX_SPECIES;
  const ns = sim.species.count;
  const sp = sim.species;
  const { pairI, pairJ, pairCount } = sim.grid;
  const RD2 = RD * RD;
  const chg = sim.tmpA;
  const n = p.count;
  for (let i = 0; i < n; i++) chg[i] = 0;
  const ph = p.phase;
  for (let k = 0; k < pairCount; k++) {
    const i = pairI[k], j = pairJ[k];
    const pi = ph[i], pj = ph[j];
    if (pi === SOLID || pj === SOLID) continue;
    const gi = pi === GAS, gj = pj === GAS;
    if (gi !== gj) continue;
    // identical compositions → nothing to exchange (cheap proxy test)
    if (
      Math.abs(p.rho20[i] - p.rho20[j]) < 1e-5 &&
      Math.abs(p.colL[i] - p.colL[j]) < 1e-5 &&
      Math.abs(p.colA[i] - p.colA[j]) < 1e-5 &&
      Math.abs(p.colB[i] - p.colB[j]) < 1e-5 &&
      Math.abs(p.cA[i] - p.cA[j]) < 1e-5 &&
      Math.abs(p.gran[i] - p.gran[j]) < 1e-5 &&
      Math.abs(p.auraI[i] - p.auraI[j]) < 1e-5 &&
      Math.abs(p.arcT[i] - p.arcT[j]) < 1e-3
    ) continue;
    const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
    const r2 = dx * dx + dy * dy;
    if (r2 >= RD2) continue;
    const c = compatFactor(p.cA[i], p.cB[i], p.cA[j], p.cB[j]);
    if (c <= 0) continue;
    const w = 1 - Math.sqrt(r2) / RD;
    const agit = Math.max(p.agit[i], p.agit[j]);
    let rate;
    const fi = pi === LIQUID || pi === PASTE, fj = pj === LIQUID || pj === PASTE;
    if (gi) {
      rate = 2.4;
    } else if (fi && fj) {
      const lnMu = Math.min(p.lnMu[i], p.lnMu[j]);
      const Tm = 0.5 * (p.temp[i] + p.temp[j]);
      const fD = Math.max(0.03, Math.min(1, Math.exp(-0.5 * Math.max(0, lnMu)))) * Math.max(0.3, (Tm + 273) / 293);
      rate = 0.5 * fD + 11 * agit * Math.max(0.35, fD);
    } else if (fi || fj) {
      // wetting / dissolution of grains by a liquid or paste. Only binding
      // powders (flour, clay…) absorb liquid into a paste and only soluble
      // ones dissolve; inert grains (sand, ash) stay grains and simply settle.
      const g = fi ? j : i;
      const q = p.gran[g];
      const sol = solubilityOf(sim, g);
      const bind = p.binder[g];
      const frozen = q < 0.5; // crushed frozen liquid grains mix like the liquid they are
      if (bind < 0.05 && sol <= 0 && !frozen) continue;
      const Tg = p.temp[g];
      // kneading needs both sides sheared: a grain merely falling through still liquid does not count
      const knead = Math.min(p.agit[i], p.agit[j]);
      let base = q > 0.8 ? 0.5 * bind : 0; // contact surfaces wet, the bulk does not
      base += sol * 0.9 * Math.max(0.3, 1 + (Tg - 20) / 40); // soluble grains dissolve slowly at rest
      rate = base + 8 * knead * Math.max(bind, sol * 2, frozen ? 1 : 0);
    } else {
      // powder ↔ powder: dry grains never exchange; damp ones only when kneaded
      if (p.gran[i] > 0.97 && p.gran[j] > 0.97) continue;
      rate = 2.2 * agit;
    }
    const oi = i * S, oj = j * S;
    let m = 0;
    if (fi && fj && (pi === PASTE || pj === PASTE)) m += carrierExchange(sim, i, j, agit, c * w * dt);
    let kx = rate * c * w * dt;
    if (kx > 0.45) kx = 0.45;
    if (kx < 1e-5) {
      if (m > 0) { chg[i] += m; chg[j] += m; }
      continue;
    }
    for (let s = 0; s < ns; s++) {
      const a = comp[oi + s], b = comp[oj + s];
      if (a === b) continue;
      const d = (b - a) * kx;
      comp[oi + s] = a + d;
      comp[oj + s] = b - d;
      m += d < 0 ? -d : d;
    }
    chg[i] += m;
    chg[j] += m;
    void sp;
  }
  for (let i = 0; i < n; i++) {
    const m = chg[i];
    if (m <= 0) continue;
    p.wet[i] = Math.min(1, p.wet[i] * 0.96 + m * 12);
    sim.compChange[i] += m;
    if (sim.compChange[i] > 0.004) {
      sim.compChange[i] = 0;
      p.dirty[i] = 1;
    }
  }
}

const liqI = new Float64Array(MAX_SPECIES), liqJ = new Float64Array(MAX_SPECIES);

/**
 * Liquid phase of particle i into out: its liquid-form species and the
 * dissolved share of its powders (as granularFraction splits them).
 * Returns the liquid phase's volume.
 * @param {import('../simulation/world.js').Simulation} sim @param {number} i @param {Float64Array} out
 */
function liquidPhase(sim, i, out) {
  const p = sim.p, sp = sim.species, comp = p.comp, off = i * MAX_SPECIES, n = sp.count, T = p.temp[i];
  let L = 0;
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    const liq = f > 0 && !(sp.isPowder[s] && T < sp.melt[s]) ? f : 0;
    out[s] = liq;
    L += liq;
  }
  let tot = L;
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    if (f <= 0 || out[s] > 0) continue;
    const sol = Math.min(0.9, Math.max(0, sp.solubility[s] + sp.solTemp[s] * (T - 20)));
    const d = Math.min(f, sol * L * 1.2);
    out[s] = d;
    tot += d;
  }
  return tot;
}

/**
 * Exchange the liquid phases of two touching particles, at least one a
 * paste, at the rate of their carrier liquid (its viscosity without the
 * grains' thickening). Each particle keeps its volume and its undissolved
 * grains; only what fills the space between them moves. Returns the volume
 * moved.
 * @param {import('../simulation/world.js').Simulation} sim
 * @param {number} i @param {number} j @param {number} agit @param {number} k compatibility × proximity × dt
 */
function carrierExchange(sim, i, j, agit, k) {
  const p = sim.p, comp = p.comp, n = sim.species.count;
  const Li = liquidPhase(sim, i, liqI), Lj = liquidPhase(sim, j, liqJ);
  if (Li < 1e-4 || Lj < 1e-4) return 0;
  const lnMu = Math.min(carrierLnMu(p, i), carrierLnMu(p, j));
  const Tm = 0.5 * (p.temp[i] + p.temp[j]);
  const fD = Math.max(0.03, Math.min(1, Math.exp(-0.5 * Math.max(0, lnMu)))) * Math.max(0.3, (Tm + 273) / 293);
  // capillary wicking: a paste draws the liquid around it in faster than plain diffusion
  let kx = (1.5 * fD + 22 * agit * Math.max(0.35, fD)) * k;
  if (kx > 0.45) kx = 0.45;
  if (kx < 1e-5) return 0;
  // move toward each other's liquid-phase make-up, as much as the leaner side holds
  const amt = kx * Math.min(Li, Lj), ii = 1 / Li, ij = 1 / Lj;
  const oi = i * MAX_SPECIES, oj = j * MAX_SPECIES;
  let m = 0;
  for (let s = 0; s < n; s++) {
    const d = (liqJ[s] * ij - liqI[s] * ii) * amt;
    if (d === 0) continue;
    comp[oi + s] += d;
    comp[oj + s] -= d;
    m += d < 0 ? -d : d;
  }
  return m;
}

/** ln viscosity of a particle's carrier liquid, without its grains' thickening. */
function carrierLnMu(p, i) {
  return p.lnMu20[i] - p.viscT[i] * (Math.min(p.temp[i], 300) - 20);
}

/** Mean solubility of the undissolved powder in a particle. */
function solubilityOf(sim, i) {
  const p = sim.p, sp = sim.species, off = i * MAX_SPECIES;
  let s = 0, w = 0;
  for (let k = 0; k < sp.count; k++) {
    const f = p.comp[off + k];
    if (f > 0 && sp.isPowder[k]) {
      s += f * sp.solubility[k];
      w += f;
    }
  }
  return w > 0 ? s / w : 0;
}
