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
  // the pestle grinds: it barely drags grains along and never lifts them
  pestle: { core: SIM.PESTLE_RADIUS, reach: 0.26, entrain: [0.12, 0.025, 0.2, 0.03, 0.06], drag: 0.35 },
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
    /** vertical sweep of the clockwork paddle (0: a circle at one depth) */
    this.autoSpan = 0;
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
      // the clockwork paddle also travels slowly up and down through the whole brew
      this.ty = this.autoCenterY + Math.sin(this.autoPhase) * this.autoRadius * 0.45 + Math.sin(this.autoPhase * 0.31) * (this.autoSpan || 0);
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
  const pestle = t.type === 'pestle', RB2 = (R * 1.8) ** 2;
  for (let i = 0; i < n; i++) {
    const dx = p.x[i] - t.x, dy = p.y[i] - t.y;
    const d2 = dx * dx + dy * dy;
    // grains around the pestle settle like sand: squeezed between it and
    // the iron they shift, they do not spray (the bed soaks up the blow)
    if (pestle && d2 < RB2 && p.phase[i] === POWDER) {
      const v = Math.hypot(p.vx[i], p.vy[i]);
      if (v > 0.7) { p.vx[i] *= 0.7 / v; p.vy[i] *= 0.7 / v; }
      if (p.vy[i] < -0.3) p.vy[i] = -0.3;
    }
    if (d2 >= R2) continue;
    p.sleep[i] = 0;
    if (sf <= 0) continue;
    const f = 1 - Math.sqrt(d2) / R;
    const k = spec.entrain[p.phase[i]] * f * f * sf;
    p.vx[i] += (t.vx - p.vx[i]) * k;
    // (a pestle drawn up out of grains leaves them lying)
    const tvy = t.type === 'pestle' && p.phase[i] === POWDER ? Math.max(0, t.vy) : t.vy;
    p.vy[i] += (tvy - p.vy[i]) * k;
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
    // the pestle ploughs grains aside like sand, it does not fling them:
    // most of the shove is not turned into speed
    if (pestle && ph === POWDER) {
      p.px[i] += (nx * pen + tx * drag) * 0.8;
      p.py[i] += (ny * pen + ty * drag) * 0.8;
    }
    if (pestle && (ph === SOLID || ph === POWDER)) crush(sim, i, pen, t.speed, dt);
  }
}

/**
 * Pestle crushing: grinding, more than smashing. Blows build up damage in the
 * particles they actually hit, scaled by the material's hardness, and the
 * struck surface is worn down into sand grain by grain (each grain left
 * where it was, at rest, and the blow bruising the particles bonded around
 * it so the grinding eats on into the body). Only a hard blow on a large
 * body cracks it, gently: a chip breaks off where it was struck (or a blow
 * to the middle splits it in two), the pieces rigid bodies of their own.
 * Only the contacted parts are affected; material and its properties are
 * always conserved (only the phase and body membership change).
 */
function crush(sim, i, pen, speed, dt) {
  const p = sim.p;
  if (p.phase[i] !== SOLID) return;
  const hard = p.hardness[i];
  const crackAt = 0.5 + hard * 1.8;
  const grindAt = 0.18 + hard * 0.9;
  sim.dmg[i] += (pen * 40 + speed * 1.2) * dt * 3;
  const g = p.group[i];
  const size = g >= 0 ? bodySize(sim, g) : 1;
  if (size >= 3 && sim.dmg[i] >= crackAt) {
    crack(sim, i, g);
    sim.dmg[i] = crackAt * 0.5;
    return;
  }
  if (sim.dmg[i] < (size <= 2 ? crackAt : grindAt)) return;
  // ground to grains
  sim.dmg[i] = 0;
  if (g >= 0) sim.rigid.markDirty(g);
  p.group[i] = -1;
  p.phase[i] = POWDER;
  p.sleep[i] = 0;
  p.dirty[i] = 1;
  // worn off where it was, at rest: sand, not shrapnel
  p.px[i] = p.x[i]; p.py[i] = p.y[i];
  p.vx[i] = 0; p.vy[i] = 0;
  sim.emit({ type: 'crush', x: p.x[i], y: p.y[i] });
  // the blow bruises the particles bonded to it
  sim.grid.query(p.x[i], p.y[i], 0.14, (j) => {
    if (p.phase[j] === SOLID && p.group[j] === g && g >= 0) sim.dmg[j] += grindAt * 0.35;
  });
}

/** Particles in a rigid body (counted over the particle list). */
function bodySize(sim, g) {
  const p = sim.p;
  let c = 0;
  for (let k = 0; k < p.count; k++) if (p.group[k] === g) c++;
  return c;
}

/**
 * Split a body where particle i was struck. Near an end a chip breaks off;
 * a blow near the middle splits it along the direction of the stroke.
 */
function crack(sim, i, g) {
  const p = sim.p, t = sim.tool;
  const idx = [];
  let cx = 0, cy = 0;
  for (let k = 0; k < p.count; k++) if (p.group[k] === g) { idx.push(k); cx += p.x[k]; cy += p.y[k]; }
  if (idx.length < 3) return;
  cx /= idx.length; cy /= idx.length;
  let rad = 0;
  for (const k of idx) rad = Math.max(rad, Math.hypot(p.x[k] - cx, p.y[k] - cy));
  let dx = p.x[i] - cx, dy = p.y[i] - cy;
  const d = Math.hypot(dx, dy);
  let cut;
  if (d > 0.45 * rad && d > 0.06) {
    // chip off the struck end
    dx /= d; dy /= d;
    cut = d - 0.11;
  } else {
    // split across the middle, along the stroke
    const vl = Math.hypot(t.vx, t.vy) || 1;
    dx = -t.vy / vl; dy = t.vx / vl;
    cut = 0;
  }
  const piece = [], rest = [];
  for (const k of idx) ((p.x[k] - cx) * dx + (p.y[k] - cy) * dy >= cut ? piece : rest).push(k);
  if (!piece.length || !rest.length) return;
  const ng = sim.rigid.alloc();
  if (ng < 0) return;
  sim.rigid.angle[ng] = sim.rigid.angle[g];
  for (const k of piece) {
    p.group[k] = ng;
    p.sleep[k] = 0;
    // the pieces part gently — a crack, not an explosion
    p.vx[k] += dx * 0.08;
    p.vy[k] += dy * 0.08;
  }
  for (const k of rest) p.sleep[k] = 0;
  sim.rigid.markDirty(g);
  sim.rigid.markDirty(ng);
  sim.emit({ type: 'crack', x: p.x[i], y: p.y[i], pieces: 2 });
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
