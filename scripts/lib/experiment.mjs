// Controlled brewing experiments in the real simulation: the same problem
// prepared with and without a technique, measured the way the counter and
// the rabbits would see it. Shared by scripts/experiments.mjs (the evidence
// behind docs/GAMEPLAY_PURPOSE_AUDIT.md) and the test-suite.
//
// Nothing here is a shortcut through the engine: pours go through the
// emitter, heat through the furnace, stirring through the spoon tool and
// bottling through the tap, exactly as in the shop.

import { Simulation } from '../../src/simulation/world.js';
import { PHASE, SIM } from '../../src/simulation/constants.js';
import { MAX_SPECIES } from '../../src/reactions/species.js';
import { AutoBrewer, condensedCount } from '../../src/game/autobrew.js';
import { measureParticles, tapSelection } from '../../src/game/measure.js';
import { EFFECT_INDEX, EFFECT_KEYS } from '../../src/alchemy/effects.js';
import { capabilities } from '../../src/game/equipment.js';

/**
 * A cauldron with the furnace of a given set of equipment (`fire` overrides
 * the flame, to compare the furnaces the refactor retired).
 * @param {any} st @param {string[]} [equipment] @param {{maxFlame:number, heatPower:number}} [fire]
 */
export function cauldron(st, equipment = st.equipment, fire) {
  const cap = capabilities(equipment);
  const sim = new Simulation({ size: cap.size, lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
  Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower }, fire || {});
  return sim;
}

/** The furnaces the gameplay refactor retired, as they were sold (equipment.js before v6). */
export const RETIRED_FIRES = { bellows: { maxFlame: 520, heatPower: 5.5 }, athanor: { maxFlame: 800, heatPower: 8 } };

/** Run seconds of physics. */
export function run(sim, seconds) {
  for (let k = 0, n = Math.round(seconds / SIM.DT); k < n; k++) sim.step();
}

/** Mean temperature of the condensed brew. */
export function meanT(sim) {
  const p = sim.p;
  let s = 0, n = 0;
  for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { s += p.temp[i]; n++; }
  return n ? s / n : SIM.AMBIENT;
}

/** Pour an ingredient through the emitter (n particles) and let it land. */
export function pour(st, sim, id, n, { x = 0, ground = false } = {}) {
  const def = st.lookup(id);
  sim.emitter.start(def, { x, amount: n, ground: ground && def.form === 'solid' });
  for (let g = 0; sim.emitter.pouring && g < 40 / SIM.DT; g++) sim.step();
  run(sim, 0.5);
}

/**
 * Hold the brew at T for `hold` seconds (counted once within 4 °C), with
 * the furnace's proportional control. `stir`: 'none' | 'hand' | 'clockwork'.
 */
export function hold(sim, T, holdS, stir = 'none', maxS = 160) {
  let held = 0, t = 0;
  while (held < holdS && t < maxS) {
    const err = T - meanT(sim);
    sim.furnace.setting = Math.max(-1, Math.min(1, err / 12));
    if (Math.abs(err) < 4) held += SIM.DT;
    stirStep(sim, stir, t);
    sim.step();
    t += SIM.DT;
  }
  sim.furnace.setting = 0;
  releaseTool(sim);
  return t;
}

/** Bring back to a temperature without holding. */
export function settleTo(sim, T, maxS = 90, stir = 'none') {
  let t = 0;
  while (Math.abs(T - meanT(sim)) > 2.5 && t < maxS) {
    sim.furnace.setting = Math.max(-1, Math.min(1, (T - meanT(sim)) / 12));
    stirStep(sim, stir, t);
    sim.step();
    t += SIM.DT;
  }
  sim.furnace.setting = 0;
  releaseTool(sim);
  return t;
}

/**
 * One physics step of stirring: the hand spoon circles near the bottom
 * (what holding the stir button does without the upgrade); the clockwork
 * paddle sweeps the whole depth (lab.js aimStirrer).
 */
export function stirStep(sim, mode, t) {
  if (mode === 'none') return;
  const tool = sim.tool, c = sim.cauldron;
  tool.type = 'spoon';
  tool.auto = true;
  tool.autoCenterX = 0;
  if (mode === 'clockwork') {
    let top = c.depth;
    for (let i = 0; i < sim.p.count; i += 3) if (sim.p.phase[i] !== PHASE.GAS) top = Math.min(top, sim.p.y[i]);
    tool.autoCenterY = (top + c.depth) / 2;
    tool.autoRadius = c.belly * 0.55;
    tool.autoSpan = Math.max(0, (c.depth - top) / 2 - 0.2);
  } else {
    tool.autoCenterY = c.depth - Math.min(0.75, c.depth * 0.3);
    tool.autoRadius = c.belly * 0.32;
    tool.autoSpan = 0;
  }
  tool.beginFrame();
  tool.substep(0, 1);
  void t;
}

export function releaseTool(sim) {
  const t = sim.tool;
  t.auto = false;
  t.setTarget(t.x, t.y, false);
}

/** Stir for seconds at the current temperature. */
export function stirFor(sim, seconds, mode) {
  for (let k = 0, n = Math.round(seconds / SIM.DT); k < n; k++) { stirStep(sim, mode, k * SIM.DT); sim.step(); }
  releaseTool(sim);
  run(sim, 0.5);
}

/** Boil down with the lid open until `frac` of the condensed brew has gone. Returns seconds. */
export function boilDown(sim, frac, maxS = 240) {
  const c = sim.cauldron;
  const from = condensedCount(sim), goal = Math.round(from * (1 - frac));
  c.lidClosed = false;
  let t = 0;
  while (condensedCount(sim) > goal && t < maxS) {
    sim.furnace.setting = 0.7;
    if ((t % 3) < 1.2) stirStep(sim, 'hand', t); else releaseTool(sim);
    sim.step();
    t += SIM.DT;
  }
  sim.furnace.setting = 0;
  releaseTool(sim);
  // let the steam out before closing
  let v = 0;
  while (sim.p.count - condensedCount(sim) > 0 && v < 25) { sim.step(); v += SIM.DT; }
  c.lidClosed = true;
  return t + v;
}

/**
 * Distil with the alembic: the lid stays closed, the furnace boils the brew
 * and vapour under the lid is drawn into a receiver (lab.js collectVapour,
 * three particles per frame at 60 frames a second).
 */
export function distil(sim, frac, maxS = 300) {
  const c = sim.cauldron, p = sim.p, sp = sim.species;
  const goal = Math.round(condensedCount(sim) * frac);
  c.lidClosed = true;
  /** @type {Record<string, number>} */
  const receiver = {};
  let count = 0, t = 0, frameAcc = 0;
  while (count < goal && t < maxS) {
    sim.furnace.setting = 0.7;
    sim.step();
    t += SIM.DT;
    frameAcc += SIM.DT;
    if (frameAcc >= 1 / 60) {
      frameAcc = 0;
      let took = 0;
      for (let i = p.count - 1; i >= 0 && took < 3; i--) {
        if (p.phase[i] !== PHASE.GAS || p.y[i] > 0.25 || p.x[i] < c.mouth * 0.3) continue;
        for (let s = 0; s < sp.count; s++) {
          const f = p.comp[i * MAX_SPECIES + s];
          if (f > 0 && sp.defs[s]) receiver[sp.defs[s].id] = (receiver[sp.defs[s].id] || 0) + f;
        }
        count++;
        sim.removeParticle(i);
        took++;
      }
    }
  }
  sim.furnace.setting = 0;
  return { seconds: t, receiver, count };
}

/** What the tap would bottle (n particles), measured. */
export function tap(sim, n = 20) {
  return measureParticles(sim, tapSelection(sim, n));
}

/** Measured condensed particles in a horizontal band (0 top … 1 bottom of the brew). */
export function band(sim, from, to) {
  const p = sim.p;
  let top = Infinity, bot = -Infinity;
  for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { top = Math.min(top, p.y[i]); bot = Math.max(bot, p.y[i]); }
  const sel = [];
  for (let i = 0; i < p.count; i++) {
    if (p.phase[i] === PHASE.GAS) continue;
    const f = (p.y[i] - top) / Math.max(1e-6, bot - top);
    if (f >= from && f <= to) sel.push(i);
  }
  return measureParticles(sim, sel);
}

/** Remove condensed particles from the top layer (the skimmer's reach), up to n. */
export function skimTop(sim, n) {
  const p = sim.p;
  const idx = [];
  for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS && p.phase[i] !== PHASE.SOLID) idx.push(i);
  idx.sort((a, b) => p.y[a] - p.y[b]);
  const take = idx.slice(0, n).sort((a, b) => b - a);
  for (const i of take) sim.removeParticle(i);
  return take.length;
}

/** Discard n particles drawn from the bottom tap. */
export function drainBottom(sim, n) {
  const sel = tapSelection(sim, n).sort((a, b) => b - a);
  for (const i of sel) sim.removeParticle(i);
  return sel.length;
}

/** Effects of a measurement as a short record (rounded). */
export function fx(m, keys = EFFECT_KEYS) {
  /** @type {Record<string, number>} */
  const o = {};
  for (const k of keys) { const v = m ? m.effects[EFFECT_INDEX[k]] : 0; if (Math.abs(v) >= 0.05) o[k] = Math.round(v * 10) / 10; }
  return o;
}

/** The strongest effect other than the wanted ones. */
export function worstUnwanted(m, wanted) {
  let v = 0, key = '';
  for (const k of EFFECT_KEYS) {
    if (wanted.includes(k)) continue;
    const a = Math.abs(m.effects[EFFECT_INDEX[k]]);
    if (a > v) { v = a; key = k; }
  }
  return { key, v: Math.round(v * 10) / 10 };
}

/** Run an AutoBrewer plan to completion. */
export function runPlan(st, sim, plan) {
  const ab = new AutoBrewer(sim, plan, st.lookup);
  for (let g = 0; !ab.done && g < 120 * 900; g++) { ab.tick(); sim.step(); }
  return ab;
}

/** Spread of an effect across the brew: sd of per-band means (top, middle, bottom thirds). */
export function bandSpread(sim, key) {
  const vals = [band(sim, 0, 0.33), band(sim, 0.33, 0.67), band(sim, 0.67, 1)].filter(Boolean).map((m) => m.effects[EFFECT_INDEX[key]]);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length) * 10) / 10;
}

export { condensedCount, SIM };
