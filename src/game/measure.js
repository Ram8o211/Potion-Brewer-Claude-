// What is actually in a bottle — computed from the simulated matter drawn
// from the cauldron, never from recipe labels. The player never reads these
// numbers directly: magic is learned from the creatures in the testing room
// (or from an expert's certificate); colour and temperature are what anyone
// can see.
//   colour      mean perceived colour of the sample (OKLab)
//   temperature mean particle temperature
//   magic       the six magical properties of what is drunk (alchemy/magic.js)
//   quantity    millilitres actually bottled

import { MAX_SPECIES } from '../reactions/species.js';
import { PHASE, SIM } from '../simulation/constants.js';
import { oklabToRgb } from '../core/color.js';
import { sampleMagic } from '../alchemy/magic.js';

/**
 * @typedef {Object} Measurement
 * @property {number} count
 * @property {number} ml
 * @property {Record<string, number>} composition  species id → volume fraction
 * @property {number[]} color   sRGB
 * @property {number[]} lab     OKLab
 * @property {number} temperature
 * @property {number[]} magic    NP magical properties (alchemy/magic.js PROP_KEYS order)
 * @property {number} vig        magic-weighted vigour (1 = nothing faded)
 * @property {number} ss         magic-weighted transmuted share
 * @property {number} steep      magic-weighted steeping temperature
 * @property {Record<string, number>} phases fraction of particles per phase name
 * @property {number} glow
 */

/**
 * Measure a set of particles.
 * @param {import('../simulation/world.js').Simulation} sim
 * @param {number[]} indices
 * @returns {Measurement|null}
 */
export function measureParticles(sim, indices) {
  const n = indices.length;
  if (!n) return null;
  const p = sim.p, sp = sim.species, S = MAX_SPECIES;
  const ns = sp.count;
  const comp = new Float64Array(ns);
  let L = 0, A = 0, B = 0, T = 0, glow = 0;
  const phases = [0, 0, 0, 0, 0];
  for (const i of indices) {
    let tot = 0;
    for (let s = 0; s < ns; s++) tot += p.comp[i * S + s];
    tot = tot || 1;
    for (let s = 0; s < ns; s++) comp[s] += p.comp[i * S + s] / tot;
    L += p.colL[i]; A += p.colA[i]; B += p.colB[i];
    T += p.temp[i];
    glow += p.glow[i];
    phases[p.phase[i]]++;
  }
  /** @type {Record<string, number>} */
  const composition = {};
  for (let s = 0; s < ns; s++) {
    const def = sp.defs[s];
    if (!def || comp[s] / n < 1e-5) continue;
    composition[def.id] = comp[s] / n;
  }
  const lab = [L / n, A / n, B / n];
  const mg = sampleMagic(sim, indices);
  return {
    count: n,
    ml: n * SIM.ML_PER_PARTICLE,
    composition,
    color: oklabToRgb(lab[0], lab[1], lab[2]),
    lab,
    temperature: T / n,
    magic: Array.from(mg.magic, (v) => Math.round(v * 100) / 100),
    vig: mg.vig,
    ss: mg.ss,
    steep: mg.steep,
    phases: { liquid: phases[0] / n, powder: phases[1] / n, paste: phases[2] / n, solid: phases[3] / n, gas: phases[4] / n },
    glow: glow / n,
  };
}

/**
 * Which particles the bottling tap would draw, in order: the flowable matter
 * nearest the tap at the bottom of the cauldron (layered brews therefore
 * bottle their lowest layer first).
 * @param {import('../simulation/world.js').Simulation} sim
 * @param {number} count
 */
export function tapSelection(sim, count) {
  const p = sim.p;
  const tx = 0, ty = sim.cauldron.depth;
  const cand = [];
  for (let i = 0; i < p.count; i++) {
    const ph = p.phase[i];
    if (ph === PHASE.GAS || ph === PHASE.SOLID) continue;
    const dx = p.x[i] - tx, dy = p.y[i] - ty;
    cand.push([dx * dx * 0.35 + dy * dy, i]);
  }
  cand.sort((a, b) => a[0] - b[0]);
  return cand.slice(0, count).map((c) => c[1]);
}
