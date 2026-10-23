// Potion measurement — everything is computed from the actual simulated
// matter (particles drawn from the cauldron), never from recipe labels:
//   colour      mean perceived colour of the sample (OKLab)
//   density     mass / volume of the sample (with thermal expansion)
//   viscosity   effective rheology (log-mean of particle viscosities, with
//               paste and grains counted at their real stiffness)
//   temperature mean particle temperature
//   effects     magical & chemical effects of what is actually in solution,
//               with this world's resonance laws (alchemy/effects.js) —
//               hidden from the player until a trial measures them
//   stability   homogeneity of composition, phase compatibility, sediment
//   volatility  tendency to evaporate / react (volatile species, dissolved gas)
//   quantity    millilitres actually bottled
//
// Customers only ever judge the effects, the quantity and (if asked) the
// temperature. Colour, density, thickness and evenness are what the eye sees
// (the words below); their numbers, with stability, volatility and charge,
// are physics shown in the Free Experiment and used internally (the brew
// advice reads stability to tell an uneven brew).

import { MAX_SPECIES } from '../reactions/species.js';
import { PHASE, SIM } from '../simulation/constants.js';
import { compatFactor } from '../reactions/compatibility.js';
import { oklabToRgb } from '../core/color.js';
import { sampleEffects } from '../alchemy/effects.js';


/**
 * @typedef {Object} Measurement
 * @property {number} count
 * @property {number} ml
 * @property {Record<string, number>} composition  species id → volume fraction
 * @property {number[]} color   sRGB
 * @property {number[]} lab     OKLab
 * @property {number} density
 * @property {number} viscosity cP
 * @property {number} temperature
 * @property {number[]} effects  NE effect channels (alchemy/effects.js EFFECT_KEYS order)
 * @property {number[]} resonance how much each world law contributed (for discovery)
 * @property {number} charge    mean electric charge per particle (shown in the Free Experiment)
 * @property {number} stability 0..100
 * @property {number} volatility 0..100
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
  let L = 0, A = 0, B = 0, rho = 0, T = 0, lnMu = 0, glow = 0, q = 0;
  const charge = p.q;
  const phases = [0, 0, 0, 0, 0];
  for (const i of indices) {
    let tot = 0;
    for (let s = 0; s < ns; s++) tot += p.comp[i * S + s];
    tot = tot || 1;
    for (let s = 0; s < ns; s++) comp[s] += p.comp[i * S + s] / tot;
    L += p.colL[i]; A += p.colA[i]; B += p.colB[i];
    rho += p.rho[i];
    T += p.temp[i];
    glow += p.glow[i];
    if (charge) q += charge[i];
    const ph = p.phase[i];
    phases[ph]++;
    // rheology: grains and frozen bits are effectively solid in a potion
    let lm = p.lnMu[i];
    if (ph === PHASE.POWDER) lm = Math.max(lm, Math.log(2e5));
    if (ph === PHASE.SOLID) lm = Math.log(1e7);
    if (ph === PHASE.GAS) lm = Math.log(0.02);
    lnMu += lm;
  }
  for (let s = 0; s < ns; s++) comp[s] /= n;
  /** @type {Record<string, number>} */
  const composition = {};
  let volat = 0;
  for (let s = 0; s < ns; s++) {
    const def = sp.defs[s];
    if (!def || comp[s] < 1e-5) continue;
    composition[def.id] = comp[s];
    volat += comp[s] * (sp.volatility[s] * 70 + sp.reactivity[s] * 30);
  }
  const lab = [L / n, A / n, B / n];
  // ---- stability
  // composition heterogeneity: RMS deviation of each particle's fractions from the mean
  let het = 0;
  for (const i of indices) {
    let tot = 0;
    for (let s = 0; s < ns; s++) tot += p.comp[i * S + s];
    tot = tot || 1;
    let d2 = 0;
    for (let s = 0; s < ns; s++) {
      const d = p.comp[i * S + s] / tot - comp[s];
      d2 += d * d;
    }
    het += Math.sqrt(d2);
  }
  het /= n;
  // immiscible blend: share of particles incompatible with the majority
  let cA = 0, cB = 0;
  for (const i of indices) { cA += p.cA[i]; cB += p.cB[i]; }
  cA /= n; cB /= n;
  let incompatible = 0;
  for (const i of indices) if (compatFactor(p.cA[i], p.cB[i], cA, cB) < 0.35) incompatible++;
  const immiscible = Math.min(incompatible, n - incompatible) / n;
  const sediment = (phases[PHASE.POWDER] + phases[PHASE.SOLID]) / n;
  const gasFrac = phases[PHASE.GAS] / n;
  const stability = clamp(100 - het * 240 - immiscible * 160 - sediment * 70 - gasFrac * 60, 0, 100);
  volat += gasFrac * 40;
  const fx = sampleEffects(sim, indices);
  return {
    count: n,
    ml: n * SIM.ML_PER_PARTICLE,
    composition,
    color: oklabToRgb(lab[0], lab[1], lab[2]),
    lab,
    density: rho / n,
    viscosity: Math.exp(lnMu / n),
    temperature: T / n,
    effects: Array.from(fx.effects, (v) => Math.round(v * 100) / 100),
    resonance: Array.from(fx.resonance),
    charge: q / n,
    stability,
    volatility: clamp(volat, 0, 100),
    phases: { liquid: phases[0] / n, powder: phases[1] / n, paste: phases[2] / n, solid: phases[3] / n, gas: phases[4] / n },
    glow: glow / n,
  };
}

/** @param {number} v @param {number} a @param {number} b */
function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
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

/** Particles within a radius (analysis probe). */
export function probeSelection(sim, x, y, r) {
  const p = sim.p, out = [];
  const r2 = r * r;
  for (let i = 0; i < p.count; i++) {
    const dx = p.x[i] - x, dy = p.y[i] - y;
    if (dx * dx + dy * dy < r2) out.push(i);
  }
  return out;
}

/** Human-readable viscosity class. @param {number} cP */
export function viscosityClass(cP) {
  if (cP < 3) return 'watery';
  if (cP < 30) return 'thin';
  if (cP < 400) return 'syrupy';
  if (cP < 8000) return 'thick';
  if (cP < 120000) return 'paste';
  return 'stiff dough';
}

/** What the eye and the hand tell of a brew's weight. @param {number} rho g/ml */
export function densityWord(rho) {
  return rho > 1.3 ? 'heavy' : rho < 0.9 ? 'light' : 'like water';
}

/** Whether a brew looks evenly mixed (from its stability). @param {number} stability 0..100 */
export function evennessWord(stability) {
  return stability >= 90 ? 'evenly mixed' : stability >= 70 ? 'a little uneven' : 'uneven — stir it';
}
