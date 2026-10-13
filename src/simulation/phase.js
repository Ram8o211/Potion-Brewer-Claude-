// Phase transitions with latent heat.
//
// Each particle stores `lat`, the latent energy already moved toward a
// transition (+ toward melting/boiling, − toward freezing/condensing).
// Crossing a threshold does not flip the phase instantly: the excess heat is
// absorbed (or released) until the full latent heat has been exchanged, so
// boiling and freezing start where the temperature first crosses the
// threshold and spread as heat is conducted — never all at once.
// Energy is conserved: C·T + lat + eph stays constant through a transition.

import { PHASE, PHASE_NAMES } from './constants.js';
import { MAX_SPECIES, NO_BOIL } from '../reactions/species.js';
import { refreshParticle } from './derived.js';
import { FRESH } from './rigid.js';

const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
/** whole-particle boiling needs a mostly volatile composition */
const BOIL_VOLATILE = 0.8;

/**
 * Choose liquid / paste / powder for a condensed, non-frozen particle from
 * its undissolved-solids fraction (with hysteresis to avoid flicker).
 * @param {import('./world.js').Simulation} sim @param {number} i
 */
export function classifyFluid(sim, i) {
  const p = sim.p;
  const ph = p.phase[i];
  if (ph === GAS || ph === SOLID) return;
  if (ph === POWDER && isFrozenGrain(sim, i)) return;
  const g = p.gran[i];
  let np = ph;
  if (ph === POWDER) {
    if (g < 0.33) np = LIQUID;
    else if (g < 0.72) np = PASTE;
  } else if (ph === PASTE) {
    if (g > 0.78) np = POWDER;
    else if (g < 0.32) np = LIQUID;
  } else {
    if (g > 0.8) np = POWDER;
    else if (g > 0.37) np = PASTE;
  }
  if (np !== ph) {
    p.phase[i] = np;
    p.sleep[i] = 0;
    if (np === PASTE) sim.emit({ type: 'paste', x: p.x[i], y: p.y[i], species: dominantId(sim, i), binder: p.binder[i] });
    if (np === LIQUID && ph === POWDER) sim.emit({ type: 'dissolve', x: p.x[i], y: p.y[i], species: dominantPowderId(sim, i) });
  }
}

/** Crushed frozen liquid: granular, but made of liquid-form species below their melting point. */
export function isFrozenGrain(sim, i) {
  const p = sim.p;
  return p.phase[i] === POWDER && p.gran[i] < 0.5 && p.temp[i] < p.tm[i] + 0.5;
}

/** @param {import('./world.js').Simulation} sim @param {number} i */
export function dominantId(sim, i) {
  const sp = sim.species, off = i * MAX_SPECIES;
  let best = -1, bf = 0;
  for (let s = 0; s < sp.count; s++) {
    const f = sim.p.comp[off + s];
    if (f > bf) { bf = f; best = s; }
  }
  return best >= 0 && sp.defs[best] ? sp.defs[best].id : null;
}

function dominantPowderId(sim, i) {
  const sp = sim.species, off = i * MAX_SPECIES;
  let best = -1, bf = 0;
  for (let s = 0; s < sp.count; s++) {
    const f = sim.p.comp[off + s];
    if (sp.isPowder[s] && f > bf) { bf = f; best = s; }
  }
  return best >= 0 && sp.defs[best] ? sp.defs[best].id : null;
}

/** @param {import('./world.js').Simulation} sim @param {number} i @param {number} from @param {number} to */
function changed(sim, i, from, to) {
  const p = sim.p;
  p.sleep[i] = 0;
  p.dirty[i] = 1;
  refreshParticle(sim, i);
  sim.emit({ type: 'phase', from: PHASE_NAMES[from], to: PHASE_NAMES[to], x: p.x[i], y: p.y[i], species: dominantId(sim, i), temp: p.temp[i] });
}

/** @param {import('./world.js').Simulation} sim @param {number} dt */
export function phaseStep(sim, dt) {
  const p = sim.p, n = p.count;
  const T = p.temp, lat = p.lat, C = p.rhoCp;
  const n0 = sim.n0;
  for (let i = 0; i < n; i++) {
    const ph = p.phase[i];
    const Ci = C[i];
    if (ph === GAS) {
      const tb = p.tb[i];
      if (T[i] < tb) {
        // condensation needs a cool surface or saturated vapour
        const sat = Math.min(1, sim.nGas[i] / 5);
        const contact = sim.touchWall[i] ? 1 : 0;
        const cf = 0.08 + 0.92 * Math.max(sat * 0.55, contact);
        const e = (tb - T[i]) * Ci * cf;
        lat[i] -= e;
        T[i] += e / Ci;
        if (lat[i] <= -p.latV[i]) {
          lat[i] += p.latV[i];
          p.eph[i] -= p.latV[i];
          T[i] += lat[i] / Ci;
          lat[i] = 0;
          p.phase[i] = LIQUID;
          refreshParticle(sim, i);
          classifyFluid(sim, i);
          changed(sim, i, GAS, p.phase[i]);
        }
      } else if (lat[i] < 0) {
        const r = Math.min(-lat[i], (T[i] - tb) * Ci);
        lat[i] += r;
        T[i] -= r / Ci;
      }
      continue;
    }
    if (ph === SOLID || (ph === POWDER && p.gran[i] < 0.5 && T[i] < p.tm[i] + 0.5 + (lat[i] > 0 ? 1 : 0))) {
      // frozen material (block or crushed grains): melting
      const tm = p.tm[i];
      if (T[i] > tm) {
        const e = (T[i] - tm) * Ci;
        lat[i] += e;
        T[i] = tm;
        if (lat[i] >= p.latF[i]) {
          lat[i] -= p.latF[i];
          p.eph[i] += p.latF[i];
          T[i] += lat[i] / Ci;
          lat[i] = 0;
          if (p.group[i] >= 0) sim.rigid.markDirty(p.group[i]);
          p.group[i] = -1;
          p.phase[i] = LIQUID;
          refreshParticle(sim, i);
          classifyFluid(sim, i);
          changed(sim, i, ph, p.phase[i]);
        }
      } else if (lat[i] > 0) {
        const r = Math.min(lat[i], (tm - T[i]) * Ci);
        lat[i] -= r;
        T[i] += r / Ci;
      }
      continue;
    }
    // condensed, unfrozen: liquid, paste or (true) powder
    const tb = p.tb[i];
    const tm = p.tm[i];
    const volatile = p.volFrac[i];
    if (ph !== POWDER && volatile >= BOIL_VOLATILE && tb < NO_BOIL && T[i] > tb) {
      const e = (T[i] - tb) * Ci;
      lat[i] += e;
      T[i] = tb;
      if (lat[i] >= p.latV[i]) {
        lat[i] -= p.latV[i];
        p.eph[i] += p.latV[i];
        T[i] += lat[i] / Ci;
        lat[i] = 0;
        p.phase[i] = GAS;
        refreshParticle(sim, i);
        changed(sim, i, ph, GAS);
      }
      continue;
    }
    if (ph !== POWDER && T[i] < tm) {
      const e = (tm - T[i]) * Ci;
      lat[i] -= e;
      T[i] = tm;
      if (lat[i] <= -p.latF[i]) {
        lat[i] += p.latF[i];
        p.eph[i] -= p.latF[i];
        T[i] += lat[i] / Ci;
        lat[i] = 0;
        p.phase[i] = SOLID;
        p.group[i] = FRESH;
        p.vx[i] *= 0.3; p.vy[i] *= 0.3;
        changed(sim, i, ph, SOLID);
      }
      continue;
    }
    // relax partial progress back into sensible heat
    if (lat[i] > 0) {
      const r = Math.min(lat[i], Math.max(0, tb - T[i]) * Ci);
      lat[i] -= r;
      T[i] += r / Ci;
    } else if (lat[i] < 0) {
      const r = Math.min(-lat[i], Math.max(0, T[i] - tm) * Ci);
      lat[i] += r;
      T[i] -= r / Ci;
    }
    // surface evaporation of volatile liquids below the boiling point
    if (ph === LIQUID && volatile >= BOIL_VOLATILE && tb < NO_BOIL && T[i] > tb - 40 && sim.dens[i] < 0.7 * n0) {
      const e = 0.9 * ((T[i] - (tb - 40)) / 40) * Ci * dt;
      T[i] -= e / Ci;
      lat[i] += e;
      if (lat[i] >= p.latV[i]) {
        lat[i] -= p.latV[i];
        p.eph[i] += p.latV[i];
        T[i] += lat[i] / Ci;
        lat[i] = 0;
        p.phase[i] = GAS;
        refreshParticle(sim, i);
        changed(sim, i, ph, GAS);
      }
    }
  }
}
