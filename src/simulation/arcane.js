// Awakening: the simulation side of arcane activation (alchemy/arcane.js).
//
// Every other step, each particle that holds unawakened magical matter
// compares its temperature with its own effective threshold — the
// volume-weighted mean threshold of the magical substances *in that
// particle*. Past it (above for a positive threshold, below for a negative
// one), the magical substances convert into their awakened forms like a
// first-order reaction whose rate grows with how far past the threshold the
// particle is. So activation starts where the heat or cold first reaches,
// spreads with the thermal field, and a badly mixed brew awakens unevenly.
//
// Awakening absorbs a little heat when driven by heating and gives a little
// back when driven by cold (stored in `eph`, like latent heat), which damps
// it instead of letting it run away. Conversion moves volume between slots
// of one particle, so every substance's total amount is conserved.

import { MAX_SPECIES } from '../reactions/species.js';
import { ARCANE_SCALE, ARCANE_ZERO, awakenedId } from '../alchemy/arcane.js';
import { ARC_NONE } from './particles.js';

/** conversion rate (1/s) one or more degrees past the threshold */
const RATE = 0.55;
/** heat exchanged per unit volume awakened (J/ml, game scaled) */
const HEAT = 24;
/** below this much unawakened magic left, a particle finishes at once */
const TAIL = 0.002;

/** @param {import('./world.js').Simulation} sim @param {number} dt */
export function arcaneStep(sim, dt) {
  const sp = sim.species;
  if (sp.magicCount <= 0) return;
  const p = sim.p, n = p.count, S = MAX_SPECIES, ns = sp.count;
  const comp = p.comp, T = p.temp;
  let woke = 0, wx = 0, wy = 0, wt = 0;
  const by = sim._awokeBy || (sim._awokeBy = new Float64Array(S));
  by.fill(0);
  for (let i = 0; i < n; i++) {
    const off = i * S;
    let w = 0, tw = 0;
    for (let s = 0; s < ns; s++) {
      if (!sp.arcMag[s]) continue;
      const f = comp[off + s];
      if (f <= 1e-6) continue;
      w += f;
      tw += f * sp.arcThr[s];
    }
    if (w <= 1e-4) { p.arcT[i] = ARC_NONE; continue; }
    const thr = tw / w;
    p.arcT[i] = thr;
    const Ta = ARCANE_ZERO + ARCANE_SCALE * thr;
    const past = thr >= 0 ? T[i] - Ta : Ta - T[i];
    if (past <= 0) continue;
    const k = RATE * Math.min(1.6, 0.2 + past / 6);
    let frac = 1 - Math.exp(-k * dt);
    if (w * (1 - frac) < TAIL) frac = 1;
    let moved = 0;
    for (let s = 0; s < ns; s++) {
      if (!sp.arcMag[s]) continue;
      const f = comp[off + s];
      if (f <= 1e-7) continue;
      const a = awakeSlot(sim, s);
      if (a < 0) continue;
      const amt = frac >= 1 ? f : f * frac;
      comp[off + s] = f - amt;
      comp[off + a] += amt;
      moved += amt;
      by[s] += amt;
    }
    if (moved <= 0) continue;
    // heating-driven awakening draws heat in, cold-driven gives heat back
    const Q = moved * HEAT * (thr >= 0 ? 1 : -1);
    T[i] -= Q / p.rhoCp[i];
    p.eph[i] += Q;
    p.dirty[i] = 1;
    p.wet[i] = Math.min(1, p.wet[i] + 0.25);
    woke += moved; wx += p.x[i] * moved; wy += p.y[i] * moved; wt += T[i] * moved;
  }
  if (woke > 0) {
    sim.awakened += woke;
    const last = sim._lastAwakenEvent ?? -99;
    if (sim.time - last > 1.5) {
      sim._lastAwakenEvent = sim.time;
      let best = 0;
      for (let s = 1; s < S; s++) if (by[s] > by[best]) best = s;
      const def = sp.defs[best];
      sim.emit({ type: 'awaken', x: wx / woke, y: wy / woke, amount: woke, species: def ? def.id : null, temp: wt / woke });
    }
  }
}

/**
 * Slot of the awakened form of a magical slot (allocated on first use).
 * Returns -1 when the lookup cannot resolve it or the table is full.
 * @param {import('./world.js').Simulation} sim @param {number} s
 */
export function awakeSlot(sim, s) {
  const sp = sim.species;
  let a = sp.awakeSlot[s];
  if (a >= 0) return a;
  const def = sp.defs[s];
  if (!def) return -1;
  const ad = sim.lookup(awakenedId(def.id));
  if (!ad) return -1;
  a = sim.slotFor(ad);
  if (a >= 0) sp.awakeSlot[s] = a;
  return a;
}
