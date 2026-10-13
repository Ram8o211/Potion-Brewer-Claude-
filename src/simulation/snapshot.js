// Serialisation of the complete cauldron state (particles, composition,
// temperatures, latent progress, rigid bodies, iron wall temperatures,
// lid/furnace/oxygen) to a compact JSON-safe object, and restoration.
// Reloading reproduces the same material behaviour: composition slots are
// restored to their original indices and derived properties recomputed.

import { MAX_SPECIES } from '../reactions/species.js';
import { refreshParticle } from './derived.js';
import { Simulation } from './world.js';

const F32_FIELDS_V1 = ['x', 'y', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet'];
/** v2 adds electric charge */
const F32_FIELDS = [...F32_FIELDS_V1, 'q'];
export const SNAPSHOT_VERSION = 2;

/** @param {ArrayBufferView} view */
export function toBase64(view) {
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  let bin = '';
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, /** @type {any} */ (bytes.subarray(i, i + CH)));
  return btoa(bin);
}

/** @param {string} b64 @returns {Uint8Array} */
export function fromBase64(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * @param {Simulation} sim
 * @param {string} sizeKey
 */
export function snapshotSim(sim, sizeKey) {
  const p = sim.p, n = p.count;
  const f = new Float32Array(n * F32_FIELDS.length);
  F32_FIELDS.forEach((name, k) => {
    const src = /** @type {Float32Array} */ (/** @type {any} */ (p)[name]);
    for (let i = 0; i < n; i++) f[k * n + i] = src[i];
  });
  const S = MAX_SPECIES;
  const used = sim.species.count;
  const comp = new Float32Array(n * used);
  for (let i = 0; i < n; i++) for (let s = 0; s < used; s++) comp[i * used + s] = p.comp[i * S + s];
  const c = sim.cauldron;
  return {
    v: SNAPSHOT_VERSION,
    size: sizeKey,
    n,
    used,
    time: sim.time,
    lid: c.lidClosed,
    furnace: { ...sim.furnace },
    oxygen: sim.oxygen,
    rng: sim._rng,
    species: sim.species.defs.slice(0, used).map((d) => (d ? d.id : null)),
    f32: toBase64(f),
    comp: toBase64(comp),
    group: toBase64(p.group.slice(0, n)),
    phase: toBase64(p.phase.slice(0, n)),
    seed: toBase64(p.seed.slice(0, n)),
    walls: Array.from(c.cellT, (t) => Math.round(t * 100) / 100),
    vented: { ...sim.vented },
    progress: { ...sim.reactions.progress },
  };
}

/**
 * Rebuild a simulation from a snapshot.
 * @param {any} snap
 * @param {{lookup:(id:string)=>any, reactions?:any[]}} env
 * @returns {Simulation}
 */
export function restoreSim(snap, env) {
  const sim = new Simulation({ size: snap.size, lookup: env.lookup, reactions: env.reactions || [] });
  applySnapshot(sim, snap, env);
  return sim;
}

/** @param {Simulation} sim @param {any} snap @param {{lookup:(id:string)=>any}} env */
export function applySnapshot(sim, snap, env) {
  sim.clear();
  const used = snap.used;
  const slotMap = new Int32Array(used).fill(-1);
  snap.species.forEach((id, s) => {
    if (!id) return;
    const def = env.lookup(id);
    if (def) slotMap[s] = sim.species.assign(s, def, env.lookup);
  });
  const n = Math.min(snap.n, sim.capacity);
  const fb = fromBase64(snap.f32);
  const f = new Float32Array(fb.buffer, fb.byteOffset, fb.byteLength / 4);
  const cb = fromBase64(snap.comp);
  const comp = new Float32Array(cb.buffer, cb.byteOffset, cb.byteLength / 4);
  const gb = fromBase64(snap.group);
  const group = new Int32Array(gb.buffer, gb.byteOffset, gb.byteLength / 4);
  const phase = fromBase64(snap.phase);
  const sb = fromBase64(snap.seed);
  const seed = new Uint32Array(sb.buffer, sb.byteOffset, sb.byteLength / 4);
  const p = sim.p;
  const S = MAX_SPECIES;
  const fields = (snap.v || 1) >= 2 ? F32_FIELDS : F32_FIELDS_V1;
  p.count = n;
  for (let i = 0; i < n; i++) {
    p.q[i] = 0;
    fields.forEach((name, k) => {
      /** @type {any} */ (p)[name][i] = f[k * snap.n + i];
    });
    p.px[i] = p.x[i];
    p.py[i] = p.y[i];
    p.group[i] = group[i];
    p.phase[i] = phase[i];
    p.seed[i] = seed[i];
    p.sleep[i] = 0;
    p.comp.fill(0, i * S, (i + 1) * S);
    for (let s = 0; s < used; s++) {
      const v = comp[i * used + s];
      if (v > 0 && slotMap[s] >= 0) p.comp[i * S + slotMap[s]] += v;
    }
    refreshParticle(sim, i);
    sim.envRho[i] = p.rho[i];
  }
  const c = sim.cauldron;
  c.lidClosed = snap.lid;
  if (Array.isArray(snap.walls) && snap.walls.length === c.cellT.length) c.cellT.set(snap.walls);
  Object.assign(sim.furnace, snap.furnace || {});
  sim.oxygen = snap.oxygen ?? 1;
  if (snap.rng) sim._rng = snap.rng;
  sim.time = snap.time || 0;
  sim.vented = { ...(snap.vented || {}) };
  sim.reactions.progress = { ...(snap.progress || {}) };
  for (let i = 0; i < n; i++) if (p.group[i] >= 0) sim.rigid.used[p.group[i]] = 1;
}
