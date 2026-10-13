// Physical tools: spoon, pestle and skimmer.
//
// The pointer target is interpolated across the physics substeps of a frame
// and each substep sweeps a capsule from the previous to the current tool
// position, so even very fast touch strokes push matter instead of
// tunnelling through it. Inside the spoon's stirring radius particles are
// entrained toward the spoon's *velocity* (fluid advection), never pulled
// toward its position — there is no remote attraction.

import { PHASE, SIM } from './constants.js';
import { MAX_SPECIES } from '../reactions/species.js';

const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;

export const TOOL_SPECS = {
  spoon: { core: SIM.SPOON_CORE, reach: SIM.SPOON_RADIUS, entrain: [0.2, 0.09, 0.3, 0.035, 0.12], drag: 0.55 },
  pestle: { core: SIM.PESTLE_RADIUS, reach: 0.26, entrain: [0.12, 0.12, 0.2, 0.08, 0.06], drag: 0.35 },
  skimmer: { core: 0.08, reach: 0.24, entrain: [0.05, 0.05, 0.05, 0.02, 0.05], drag: 0.2 },
};

export class ToolState {
  constructor() {
    /** @type {'none'|'spoon'|'pestle'|'skimmer'} */
    this.type = 'spoon';
    this.active = false;
    this.tx = 0; this.ty = 1.5;
    this.x = 0; this.y = 1.5;
    this.x0 = 0; this.y0 = 1.5;
    this.fsx = 0; this.fsy = 1.5;
    this.vx = 0; this.vy = 0;
    /** automatic stirring helper (hold-to-stir) */
    this.auto = false;
    this.autoPhase = 0;
    this.autoCenterX = 0;
    this.autoCenterY = 2.2;
    this.autoRadius = 0.9;
    this.speed = 0;
    /** volume removed by the skimmer per species id */
    this.skimmed = /** @type {Record<string, number>} */ ({});
    /** nearly pure skimmed matter (particles per species id) that can go back on the shelf */
    this.recovered = /** @type {Record<string, number>} */ ({});
    this._skimAcc = 0;
    this.stirDistance = 0;
  }

  /** @param {number} x @param {number} y @param {boolean} active */
  setTarget(x, y, active) {
    this.tx = x;
    this.ty = y;
    if (active && !this.active) {
      // touching down: start the stroke where the finger is
      this.x = x; this.y = y; this.x0 = x; this.y0 = y; this.fsx = x; this.fsy = y;
    }
    this.active = active;
  }

  beginFrame() {
    this.fsx = this.x;
    this.fsy = this.y;
  }

  /** @param {number} k @param {number} n */
  substep(k, n) {
    if (this.auto && this.type === 'spoon') {
      this.active = true;
      this.autoPhase += SIM.DT * 2.1;
      this.tx = this.autoCenterX + Math.cos(this.autoPhase) * this.autoRadius;
      this.ty = this.autoCenterY + Math.sin(this.autoPhase) * this.autoRadius * 0.45;
      this.fsx = this.x; this.fsy = this.y;
      k = 0; n = 1;
    }
    const t = (k + 1) / n;
    this.x0 = this.x;
    this.y0 = this.y;
    this.x = this.fsx + (this.tx - this.fsx) * t;
    this.y = this.fsy + (this.ty - this.fsy) * t;
    let vx = (this.x - this.x0) / SIM.DT, vy = (this.y - this.y0) / SIM.DT;
    const s = Math.hypot(vx, vy);
    const vmax = 5.5;
    if (s > vmax) { vx *= vmax / s; vy *= vmax / s; }
    this.vx = vx; this.vy = vy;
    this.speed = Math.min(vmax, s);
    if (this.active) this.stirDistance += Math.hypot(this.x - this.x0, this.y - this.y0);
  }

  endFrame() {}
}

/**
 * Keep a tool point inside the vessel.
 * @param {import('./world.js').Simulation} sim @param {number} x @param {number} y @param {number} r
 */
export function clampToInterior(sim, x, y, r) {
  const c = sim.cauldron;
  for (let it = 0; it < 3; it++) {
    const d = c.sample(x, y);
    if (d <= -r) break;
    x -= c.nx * (d + r);
    y -= c.ny * (d + r);
  }
  if (c.lidClosed && y < r) y = r;
  return [x, y];
}

/** Velocity entrainment inside the tool's reach (applied before prediction). */
export function toolForces(sim, dt) {
  const t = sim.tool;
  if (!t.active || t.type === 'none') return;
  const spec = TOOL_SPECS[t.type];
  const p = sim.p, n = p.count;
  const R = spec.reach, R2 = R * R;
  const sf = Math.min(1, t.speed / 0.35);
  for (let i = 0; i < n; i++) {
    const dx = p.x[i] - t.x, dy = p.y[i] - t.y;
    const d2 = dx * dx + dy * dy;
    if (d2 >= R2) continue;
    p.sleep[i] = 0;
    if (sf <= 0) continue;
    const f = 1 - Math.sqrt(d2) / R;
    const k = spec.entrain[p.phase[i]] * f * f * sf;
    p.vx[i] += (t.vx - p.vx[i]) * k;
    p.vy[i] += (t.vy - p.vy[i]) * k;
  }
  if (t.type === 'skimmer') skim(sim, dt);
}

/** Capsule collider sweep (inside the constraint iterations). */
export function toolConstraints(sim, dt) {
  const t = sim.tool;
  if (!t.active || t.type === 'none') return;
  const spec = TOOL_SPECS[t.type];
  const p = sim.p, n = p.count;
  const ax = t.x0, ay = t.y0, bx = t.x, by = t.y;
  const ex = bx - ax, ey = by - ay;
  const el2 = ex * ex + ey * ey;
  const rr = spec.core + SIM.RADIUS * 0.9;
  const pestle = t.type === 'pestle';
  // tool displacement this substep (for tangential drag)
  const mvx = ex, mvy = ey;
  const minX = Math.min(ax, bx) - rr, maxX = Math.max(ax, bx) + rr;
  const minY = Math.min(ay, by) - rr, maxY = Math.max(ay, by) + rr;
  for (let i = 0; i < n; i++) {
    const x = p.x[i], y = p.y[i];
    if (x < minX || x > maxX || y < minY || y > maxY) continue;
    let s = el2 > 1e-12 ? ((x - ax) * ex + (y - ay) * ey) / el2 : 1;
    if (s < 0) s = 0; else if (s > 1) s = 1;
    const cx = ax + ex * s, cy = ay + ey * s;
    const dx = x - cx, dy = y - cy;
    const d2 = dx * dx + dy * dy;
    if (d2 >= rr * rr) continue;
    let d = Math.sqrt(d2);
    let nx, ny;
    if (d < 1e-6) {
      // dead centre: push away from the direction of motion
      const ml = Math.hypot(mvx, mvy) || 1;
      nx = mvx / ml; ny = mvy / ml; d = 0;
    } else { nx = dx / d; ny = dy / d; }
    const pen = rr - d;
    const ph = p.phase[i];
    if (ph === GAS) {
      p.x[i] += nx * pen; p.y[i] += ny * pen;
      continue;
    }
    p.x[i] += nx * pen;
    p.y[i] += ny * pen;
    // tangential drag with the moving tool surface
    const tn = mvx * nx + mvy * ny;
    const tx = mvx - tn * nx, ty = mvy - tn * ny;
    const drag = ph === PASTE ? spec.drag * 1.3 : ph === POWDER ? spec.drag * 0.8 : spec.drag;
    p.x[i] += tx * drag;
    p.y[i] += ty * drag;
    if (pestle && (ph === SOLID || ph === POWDER)) crush(sim, i, pen, t.speed, dt);
  }
}

/**
 * Pestle crushing: frozen blocks and solid chunks break into grains.
 * Material and its properties are conserved — only the phase changes.
 */
function crush(sim, i, pen, speed, dt) {
  const p = sim.p;
  if (p.phase[i] !== SOLID) return;
  const hard = 0.25 + p.hardness[i] * 1.5;
  sim.dmg[i] += (pen * 40 + speed * 1.2) * dt * 3;
  if (sim.dmg[i] < hard) return;
  sim.dmg[i] = 0;
  const g = p.group[i];
  if (g >= 0) sim.rigid.markDirty(g);
  p.group[i] = -1;
  p.phase[i] = POWDER;
  p.sleep[i] = 0;
  p.dirty[i] = 1;
  p.vx[i] += (sim.rand() - 0.5) * 0.8;
  p.vy[i] -= sim.rand() * 0.6;
  sim.emit({ type: 'crush', x: p.x[i], y: p.y[i] });
  // the crack propagates a little: weaken bonded neighbours
  sim.grid.query(p.x[i], p.y[i], 0.14, (j) => {
    if (p.phase[j] === SOLID && p.group[j] === g) sim.dmg[j] += hard * 0.35;
  });
}

/** Skimmer: scoop surface material out of the cauldron. */
function skim(sim, dt) {
  const t = sim.tool, p = sim.p;
  t._skimAcc += dt * 45;
  if (t._skimAcc < 1) return;
  const R2 = 0.22 * 0.22;
  const victims = [];
  for (let i = 0; i < p.count && victims.length < t._skimAcc; i++) {
    if (p.phase[i] === SOLID) continue;
    const dx = p.x[i] - t.x, dy = p.y[i] - t.y;
    if (dx * dx + dy * dy < R2) victims.push(i);
  }
  t._skimAcc -= Math.max(1, victims.length);
  if (t._skimAcc < 0) t._skimAcc = 0;
  victims.sort((a, b) => b - a);
  const sp = sim.species;
  for (const i of victims) {
    let best = -1, bf = 0, tot = 0;
    for (let s = 0; s < sp.count; s++) {
      const f = p.comp[i * MAX_SPECIES + s];
      if (f > 0 && sp.defs[s]) t.skimmed[sp.defs[s].id] = (t.skimmed[sp.defs[s].id] || 0) + f;
      tot += f;
      if (f > bf) { bf = f; best = s; }
    }
    // a skimmed-off layer of one substance (oil, a floating powder) can be
    // jarred again; mixtures and anything frozen or burning are waste
    if (best >= 0 && bf >= 0.92 * tot && p.burn[i] < 0.05 && sp.defs[best]) {
      const id = sp.defs[best].id;
      t.recovered[id] = (t.recovered[id] || 0) + 1;
    }
    sim.removeParticle(i);
  }
  if (victims.length) sim.emit({ type: 'skim', count: victims.length, x: t.x, y: t.y });
}

export { LIQUID };
