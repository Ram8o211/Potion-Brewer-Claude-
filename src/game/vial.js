// Sealed vials: bottled potion that keeps its exact matter.
//
// A vial stores the particles that ran out of the tap — each one's
// composition (by species id, including reaction products and awakened
// forms), temperature, electric charge and phase — not a summary. So:
//   • a trial dose takes real particles out of it (spread through the vial,
//     as from a shaken bottle) and they never come back;
//   • pouring it back returns exactly that matter to the cauldron;
//   • its measurement is computed from what is left, with the same function
//     the cauldron tap uses (measure.js).
// A sealed vial is chemically and magically at rest: nothing reacts or
// awakens inside it; it only drifts toward room temperature.

import { Simulation } from '../simulation/world.js';
import { PHASE, SIM } from '../simulation/constants.js';
import { MAX_SPECIES } from '../reactions/species.js';
import { measureParticles } from './measure.js';
import { refreshParticle } from '../simulation/derived.js';

/**
 * @typedef {Object} VialParticle
 * @property {number[]} c   volume fractions, aligned with vial.species
 * @property {number} t     temperature °C
 * @property {number} [q]   electric charge
 * @property {number} ph    phase (constants.js PHASE)
 */

/**
 * @typedef {Object} Vial
 * @property {string} id
 * @property {string[]} species       species ids the particle compositions refer to
 * @property {VialParticle[]} particles
 * @property {number} ml
 * @property {any} m                  measurement of the current contents (cached)
 * @property {string} batchId
 * @property {number} rev
 * @property {Record<string, number>} cert   effect values verified for this vial
 * @property {Record<string, string>} [certRecords] trial record per verified effect
 * @property {{id:string, ml:number}[]} parts  ingredients the batch was made of (provenance)
 * @property {number} bottledMl
 * @property {number} day
 * @property {string|null} [commissionId]
 * @property {any} [recipe]
 * @property {any} [label]            the player's identification (commerce.js)
 * @property {{type:string, ml:number, day:number}[]} log
 */

/** Room temperature a sealed vial drifts toward, and its time constant (s). */
const ROOM = SIM.AMBIENT;
const COOL_TAU = 480;

/**
 * Copy particles out of a simulation into a new vial (the caller removes
 * them from the cauldron).
 * @param {import('../simulation/world.js').Simulation} sim
 * @param {number[]} indices
 * @param {Partial<Vial>} meta
 * @returns {Vial}
 */
export function makeVial(sim, indices, meta) {
  const sp = sim.species, p = sim.p, S = MAX_SPECIES;
  const used = [];
  for (let s = 0; s < sp.count; s++) {
    if (!sp.defs[s]) continue;
    let any = false;
    for (const i of indices) if (p.comp[i * S + s] > 1e-6) { any = true; break; }
    if (any) used.push(s);
  }
  const particles = indices.map((i) => ({
    c: used.map((s) => Math.round(p.comp[i * S + s] * 1e6) / 1e6),
    t: Math.round(p.temp[i] * 100) / 100,
    q: Math.round(p.q[i] * 1e4) / 1e4 || undefined,
    ph: p.phase[i] === PHASE.SOLID || p.phase[i] === PHASE.GAS ? PHASE.LIQUID : p.phase[i],
  }));
  const vial = /** @type {Vial} */ ({
    id: 'v' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
    species: used.map((s) => sp.defs[s].id),
    particles,
    ml: particles.length * SIM.ML_PER_PARTICLE,
    bottledMl: particles.length * SIM.ML_PER_PARTICLE,
    m: null,
    batchId: '', rev: 0, cert: {}, parts: [], day: 0, log: [],
    ...meta,
  });
  vial.log = [...(vial.log || []), { type: 'bottled', ml: vial.ml, day: vial.day }];
  return vial;
}

/**
 * Add particles from a simulation to a vial being filled (the caller
 * removes them from the cauldron).
 * @param {Vial} vial @param {import('../simulation/world.js').Simulation} sim @param {number[]} indices
 */
export function appendParticles(vial, sim, indices) {
  if (!indices.length) return vial;
  const part = makeVial(sim, indices, {});
  const map = part.species.map((id) => {
    let j = vial.species.indexOf(id);
    if (j < 0) {
      j = vial.species.length;
      vial.species.push(id);
      for (const vp of vial.particles) vp.c.push(0);
    }
    return j;
  });
  for (const vp of part.particles) {
    const c = new Array(vial.species.length).fill(0);
    vp.c.forEach((f, k) => { c[map[k]] = f; });
    vial.particles.push({ ...vp, c });
  }
  vial.ml = vial.particles.length * SIM.ML_PER_PARTICLE;
  vial.bottledMl = vial.ml;
  return vial;
}

/** One scratch simulation per world lookup, used only to measure vial contents. */
const scratch = new WeakMap();
function scratchSim(lookup, laws) {
  let s = scratch.get(lookup);
  if (!s) {
    s = new Simulation({ size: 'pot', lookup, reactions: [], laws, capacity: 900 });
    s.maxParticles = s.capacity;
    scratch.set(lookup, s);
  }
  s.laws = laws || [];
  return s;
}

/**
 * Load vial particles into the scratch simulation (in vial order).
 * @param {Vial} vial @param {(id:string)=>any} lookup @param {any[]} laws @param {number[]} [which]
 */
function load(vial, lookup, laws, which) {
  const sim = scratchSim(lookup, laws);
  sim.clear();
  const defs = vial.species.map((id) => lookup(id));
  const slots = defs.map((d) => (d ? sim.slotFor(d) : -1));
  const S = MAX_SPECIES;
  const list = which || vial.particles.map((_, k) => k);
  const idx = [];
  for (const k of list) {
    const vp = vial.particles[k];
    let first = vp.c.findIndex((f, j) => f > 0 && defs[j]);
    if (first < 0) first = 0;
    const i = sim.addParticle(defs[first] || defs.find(Boolean), 0, 1, vp.ph, vp.t);
    if (i < 0) break;
    sim.p.comp.fill(0, i * S, (i + 1) * S);
    vp.c.forEach((f, j) => { if (f > 0 && slots[j] >= 0) sim.p.comp[i * S + slots[j]] += f; });
    sim.p.q[i] = vp.q || 0;
    sim.p.phase[i] = vp.ph;
    sim.p.dirty[i] = 1;
    idx.push(i);
  }
  for (const i of idx) refreshParticle(sim, i);
  return { sim, idx };
}

/**
 * Measurement of the vial's contents (or a subset of its particles).
 * @param {Vial} vial @param {(id:string)=>any} lookup @param {any[]} laws @param {number[]} [which]
 */
export function measureVial(vial, lookup, laws, which) {
  if (!vial.particles.length) return null;
  const { sim, idx } = load(vial, lookup, laws, which);
  return measureParticles(sim, idx);
}

/** Refresh the cached measurement and volume. @param {Vial} vial @param {(id:string)=>any} lookup @param {any[]} laws */
export function updateVial(vial, lookup, laws) {
  vial.ml = vial.particles.length * SIM.ML_PER_PARTICLE;
  vial.m = measureVial(vial, lookup, laws);
  return vial;
}

/**
 * Take a dose out of the vial: real particles, spread evenly through it
 * (a shaken bottle). Returns the dose's measurement and volume.
 * @param {Vial} vial @param {number} ml @param {(id:string)=>any} lookup @param {any[]} laws @param {number} day
 */
export function takeDose(vial, ml, lookup, laws, day) {
  const N = vial.particles.length;
  const k = Math.min(N, Math.max(1, Math.round(ml / SIM.ML_PER_PARTICLE)));
  if (!N) return null;
  const which = [];
  for (let j = 0; j < k; j++) which.push(Math.min(N - 1, Math.floor(((j + 0.5) * N) / k)));
  const uniq = [...new Set(which)];
  const dose = measureVial(vial, lookup, laws, uniq);
  const take = new Set(uniq);
  vial.particles = vial.particles.filter((_, i) => !take.has(i));
  vial.log.push({ type: 'dose', ml: uniq.length * SIM.ML_PER_PARTICLE, day });
  updateVial(vial, lookup, laws);
  return { dose, ml: uniq.length * SIM.ML_PER_PARTICLE };
}

/**
 * Pour the vial back into a cauldron: exactly its particles, at the mouth.
 * Returns how many went in (all of them, or none if there is no room).
 * @param {Vial} vial @param {import('../simulation/world.js').Simulation} sim
 */
export function pourBack(vial, sim) {
  const n = vial.particles.length;
  if (sim.p.count + n > sim.maxParticles) return 0;
  const S = MAX_SPECIES;
  const defs = vial.species.map((id) => sim.lookup(id));
  let made = 0;
  const mouth = sim.cauldron.mouth;
  for (let k = 0; k < n; k++) {
    const vp = vial.particles[k];
    // spread across the mouth, a little below the lid, in tidy rows
    const col = k % 9, row = Math.floor(k / 9);
    const x = (-0.8 + (col / 8) * 1.6) * (mouth - 0.12) + (sim.rand() - 0.5) * 0.02;
    const y = 0.14 + row * 0.1 + (col % 2) * 0.05;
    let first = vp.c.findIndex((f, j) => f > 0 && defs[j]);
    if (first < 0) first = 0;
    const i = sim.addParticle(defs[first], x, Math.min(y, sim.cauldron.depth - 0.2), vp.ph, vp.t);
    if (i < 0) break;
    sim.p.comp.fill(0, i * S, (i + 1) * S);
    vp.c.forEach((f, j) => {
      if (f <= 0 || !defs[j]) return;
      const s = sim.slotFor(defs[j]);
      if (s >= 0) sim.p.comp[i * S + s] += f;
    });
    sim.p.q[i] = vp.q || 0;
    sim.p.vy[i] = 0.8;
    sim.p.dirty[i] = 1;
    made++;
  }
  return made;
}

/** A sealed vial drifts toward room temperature. @param {Vial} vial @param {number} dt seconds */
export function relaxVial(vial, dt) {
  const k = 1 - Math.exp(-dt / COOL_TAU);
  let moved = 0;
  for (const vp of vial.particles) {
    const d = (ROOM - vp.t) * k;
    vp.t += d;
    moved = Math.max(moved, Math.abs(d));
  }
  return moved;
}

/**
 * Total volume of each species in the vial (conservation checks, provenance).
 * @param {Vial} vial
 */
export function vialInventory(vial) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const vp of vial.particles) vp.c.forEach((f, j) => { if (f > 0) out[vial.species[j]] = (out[vial.species[j]] || 0) + f; });
  return out;
}

/**
 * Bring a vial from an older save (which kept only the mean composition and
 * its measurement) into the particle form: its volume is split into
 * particles of that mean composition, at its temperature.
 * @param {any} v
 */
export function migrateVial(v) {
  if (!v || typeof v !== 'object') return null;
  if (Array.isArray(v.particles) && Array.isArray(v.species)) return v;
  const m = v.m || {};
  const comp = m.composition || {};
  const species = Object.keys(comp);
  const tot = species.reduce((a, id) => a + comp[id], 0) || 1;
  const n = Math.max(0, Math.floor((v.ml || 0) / SIM.ML_PER_PARTICLE));
  const c = species.map((id) => comp[id] / tot);
  const particles = [];
  for (let k = 0; k < n; k++) particles.push({ c: c.slice(), t: m.temperature ?? ROOM, q: m.charge || undefined, ph: PHASE.LIQUID });
  return { ...v, species, particles, ml: n * SIM.ML_PER_PARTICLE, bottledMl: v.bottledMl ?? n * SIM.ML_PER_PARTICLE, log: v.log || [], cert: v.cert || {} };
}
