// Thermal magic: overheating fades a particle's magic, and crossing its
// super-transition temperature transmutes it (see alchemy/magic.js).
// Both thresholds are cached per particle (derived.js) as the magic-weighted
// means of its ingredients' thresholds, so a blend can transmute at a
// temperature none of its ingredients could alone.
// Transmutation is not instant: it takes a few seconds beyond the threshold,
// so a blend that only brushes past it while being mixed barely changes.
//
// Runs on the "every other step" schedule with the other slow processes. It
// is one pass over the particles with a handful of arithmetic each.

import { PHASE } from './constants.js';
import { FADE_RATE, SUPER_RATE, beyondSuper } from '../alchemy/magic.js';

const { GAS, LIQUID, PASTE, POWDER } = PHASE;

/** @param {import('./world.js').Simulation} sim @param {number} dt */
export function magicStep(sim, dt) {
  const p = sim.p, n = p.count;
  const T = p.temp, mw = p.mw, vig = p.vig, ss = p.ss, stp = p.stp, tf = p.tf, ts = p.ts;
  let transmuted = 0, faded = 0;
  for (let i = 0; i < n; i++) {
    if (mw[i] <= 0) continue;
    const ph = p.phase[i];
    if (ph === GAS) continue;
    const t = T[i];
    // what a hot steep has drawn out stays drawn out (wet matter only)
    if (t > stp[i] && (ph === LIQUID || ph === PASTE || (ph === POWDER && p.gran[i] < 0.97))) stp[i] = t;
    // overheating burns magic away, faster the hotter it is
    const over = t - tf[i];
    if (over > 0 && vig[i] > 0) {
      vig[i] *= Math.exp(-FADE_RATE * over * dt);
      if (vig[i] < 1e-4) vig[i] = 0;
      faded++;
      if ((sim.steps + i) % 97 === 0) sim.emit({ type: 'fade', x: p.x[i], y: p.y[i] });
    }
    // the super transition: the whole magic of the particle concentrates
    // into one property
    if (ss[i] < 1 && beyondSuper(t, ts[i])) {
      ss[i] = Math.min(1, ss[i] + SUPER_RATE * dt * (1 + Math.abs(t - ts[i]) / 6));
      if (transmuted++ < 4 && (sim.steps + i) % 5 === 0) sim.emit({ type: 'transmute', x: p.x[i], y: p.y[i], key: p.sk[i], temp: t });
    }
  }
  sim.stats.faded = faded;
  return transmuted;
}
