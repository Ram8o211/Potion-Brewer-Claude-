// Analytic prediction of a brewing plan's outcome, using the same mixture and
// magic laws as the live simulation (extraction at the steeping temperature,
// fading above the blend's fading threshold, the super transition when the
// plan's heat or cold crosses the blend's threshold). The commission
// generator uses it to set achievable requests. It assumes the brewer
// actually performs the plan (stirring thoroughly, reaching the
// temperatures) — the real result still comes from the simulation.

import { SpeciesTable, MAX_SPECIES } from '../reactions/species.js';
import { mixtureProps } from '../reactions/mixture.js';
import { particleMagic, thresholds, beyondSuper, FADE_RATE, NP } from '../alchemy/magic.js';

/**
 * @typedef {Object} BrewPlan
 * @property {{id:string, n:number, ground?:boolean}[]} ingredients particle counts, in pouring order (ground = smashed in the mortar first)
 * @property {number} heatTo     hottest temperature reached during the brew (°C)
 * @property {number} coolTo     coldest temperature reached (°C)
 * @property {number} serveTemp  temperature at bottling (°C)
 * @property {boolean} [knead]   needs thorough stirring
 * @property {boolean} [crush]   whole stones must be crushed in the pot
 * @property {number} [hold]     seconds held at the hottest (or coldest) temperature
 * @property {number} [stir]     seconds of stirring before heating or chilling
 */

/**
 * @param {any} world
 * @param {(id:string)=>any} lookup
 * @param {BrewPlan} plan
 */
export function predictPlan(world, lookup, plan) {
  /** @type {Map<string, number>} */
  const vol = new Map();
  let total = 0;
  for (const ing of plan.ingredients) {
    vol.set(ing.id, (vol.get(ing.id) || 0) + ing.n);
    total += ing.n;
  }
  const sp = new SpeciesTable();
  const comp = new Float32Array(MAX_SPECIES);
  for (const [id, v] of vol) {
    if (v <= 1e-6) continue;
    const def = lookup(id);
    if (!def) continue;
    const s = sp.ensure(def);
    if (s >= 0) comp[s] += v / total;
  }
  const serve = plan.serveTemp ?? 20;
  const hi = Math.max(20, plan.heatTo ?? 20, serve);
  const lo = Math.min(20, plan.coolTo ?? 20, serve);
  const thr = thresholds(sp, comp, 0);
  // seconds spent near the hottest temperature (ramp + hold, as the homunculus brews)
  const hot = (plan.hold ?? 6) + 10;
  const vig = thr.fade < hi ? Math.exp(-FADE_RATE * (hi - thr.fade) * hot) : 1;
  const ss = beyondSuper(hi, thr.super) || beyondSuper(lo, thr.super) ? 1 : 0;
  const steep = (plan.hold ?? 0) >= 6 ? hi : Math.max(serve, Math.min(hi, 40));
  const magic = particleMagic(sp, comp, 0, serve, steep, vig, ss, thr.key, new Array(NP).fill(0));
  const props = mixtureProps(sp, comp, 0, serve);
  /** @type {Record<string, number>} */
  const composition = {};
  for (let s = 0; s < sp.count; s++) if (sp.defs[s] && comp[s] > 1e-5) composition[sp.defs[s].id] = comp[s];
  void world;
  return { ...props, magic, composition, totalParticles: total, thresholds: { ...thr }, vig, ss };
}
