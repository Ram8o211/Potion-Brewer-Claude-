// Shared helpers for the headless physics scenarios.
import { Simulation } from '../src/simulation/world.js';
import { PHASE } from '../src/simulation/constants.js';
import { MAX_SPECIES } from '../src/reactions/species.js';
import { REF, refLookup } from '../src/materials/reference.js';

export { REF, refLookup, PHASE, MAX_SPECIES };

export function makeSim(size = 'small', reactions = []) {
  return new Simulation({ size, lookup: refLookup, reactions });
}

/** Pour `amount` particles of a reference material and wait until done. */
export function pour(sim, id, amount, x = 0, settle = 0, rate) {
  sim.emitter.start(REF[id], { x, amount, rate });
  let guard = 0;
  while (sim.emitter.pouring && guard++ < 20000) sim.step();
  run(sim, settle);
}

export function run(sim, seconds) {
  const n = Math.round(seconds * 120);
  for (let k = 0; k < n; k++) sim.step();
}

/** Stir in an ellipse for `seconds` using the real spoon tool path. */
export function stir(sim, seconds, cx = 0, cy = 2.6, rx = 0.9, ry = 0.35, speed = 2.6) {
  const t = sim.tool;
  t.type = 'spoon';
  const steps = Math.round(seconds * 120);
  for (let k = 0; k < steps; k++) {
    const a = (k / 120) * speed;
    t.setTarget(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, true);
    sim.advance(1 / 120, 1, 2);
  }
  t.setTarget(cx, cy, false);
  sim.advance(1 / 120, 1, 2);
}

export function slot(sim, id) {
  return sim.species.slotOf.get(id);
}

export function frac(sim, i, id) {
  const s = slot(sim, id);
  return s === undefined ? 0 : sim.p.comp[i * MAX_SPECIES + s];
}

export function countPhase(sim, ph) {
  let c = 0;
  for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === ph) c++;
  return c;
}

export function meanSpeed(sim, filter = () => true) {
  let s = 0, n = 0;
  for (let i = 0; i < sim.p.count; i++) if (filter(i)) { s += Math.hypot(sim.p.vx[i], sim.p.vy[i]); n++; }
  return n ? s / n : 0;
}

/** Variance of a species fraction across particles that contain any of the given species. */
export function fractionStats(sim, id, members) {
  const vals = [];
  for (let i = 0; i < sim.p.count; i++) {
    let has = false;
    for (const m of members) if (frac(sim, i, m) > 0.001) has = true;
    if (has) vals.push(frac(sim, i, id));
  }
  const mean = vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length);
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, vals.length));
  return { mean, sd, n: vals.length };
}

/** True if every particle is inside the vessel (and under a closed lid). */
export function allContained(sim) {
  const c = sim.cauldron;
  for (let i = 0; i < sim.p.count; i++) {
    const d = c.sample(sim.p.x[i], sim.p.y[i]);
    if (d > 0.005) return false;
    if (c.lidClosed && sim.p.y[i] < 0) return false;
  }
  return true;
}
