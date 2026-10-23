// Analytic prediction of a brewing plan's outcome, using exactly the same
// mixture laws and reaction stoichiometry as the live simulation. The
// commission generator uses it to set achievable targets; the recipe book
// uses it to describe recipes. It assumes the brewer actually performs the
// plan (mixing thoroughly, reaching the temperatures) — the real result
// still comes from the simulation.

import { SpeciesTable, MAX_SPECIES } from '../reactions/species.js';
import { mixtureProps } from '../reactions/mixture.js';
import { compositionEffects, extractedEffects, NE } from '../alchemy/effects.js';
import { isMagical, awakenedId, thresholdToCelsius } from '../alchemy/arcane.js';

/** degrees past (or short of) a threshold a plan keeps, so the brew is unambiguous */
export const ACTIVATION_MARGIN = 6;

/**
 * @typedef {Object} BrewPlan
 * @property {{id:string, n:number, ground?:boolean}[]} ingredients particle counts, in pouring order (ground = milled in the mortar first)
 * @property {number} heatTo     hottest temperature reached during the brew (°C)
 * @property {number} coolTo     coldest temperature reached (°C)
 * @property {number} serveTemp  temperature at bottling (°C)
 * @property {boolean} [knead]   needs thorough stirring/kneading (doughs)
 * @property {boolean} [crush]   solid ingredients must be crushed first
 * @property {number} [hold]     seconds held at the reaction temperature
 * @property {boolean} [activate] the plan means to awaken its magic (alchemy/arcane.js)
 * @property {{T:number, hold:number}} [steep] an extraction stage before anything else (°C, seconds)
 * @property {{frac:number}} [reduce] boil off this share of the brew's volume with the lid open
 *           (the most volatile solvents go first: spirit before water); what does not boil stays
 * @property {{id:string, n:number, ground?:boolean}[]} [late] added after the heat stages, at serving
 *           temperature (they never see the steep, so they react only as they would cold)
 */

/** Species tables by world lookup (predictPlan). @type {WeakMap<Function, SpeciesTable>} */
const tables = new WeakMap();

/**
 * @param {{reactions: import('../reactions/reactions.js').ReactionRule[], laws?: any[]}} world
 * @param {(id:string)=>any} lookup
 * @param {BrewPlan} plan
 */
export function predictPlan(world, lookup, plan) {
  // totals per species id
  /** @type {Map<string, number>} */
  const vol = new Map();
  let total = 0;
  for (const ing of plan.ingredients) {
    vol.set(ing.id, (vol.get(ing.id) || 0) + ing.n);
    total += ing.n;
  }
  const fired = [];
  const st = plan.steep ? plan.steep.T : 20;
  const lo = Math.min(20, plan.coolTo ?? 20, plan.serveTemp ?? 20, st);
  const hi = Math.max(20, plan.heatTo ?? 20, plan.serveTemp ?? 20, st, plan.reduce ? reduceTemp(plan, lookup) : 20);
  for (let pass = 0; pass < 3; pass++) {
    for (const r of world.reactions) {
      const a = vol.get(r.a) || 0;
      const b = r.b ? vol.get(r.b) || 0 : Infinity;
      if (a <= 0 || b <= 0) continue;
      if (r.maxT < lo || r.minT > hi) continue;
      // a reaction only happens if the brew is held inside its window
      const held = (plan.hold ?? 0) >= 8 || (!!plan.steep && plan.steep.hold >= 8 && plan.steep.T >= r.minT && plan.steep.T <= r.maxT);
      if (r.wet && !held && r.minT > (plan.serveTemp ?? 20)) continue;
      const yieldF = r.kind === 'decompose' ? (r.wet ? 0.85 : 0.55) : 0.88;
      const ext = Math.min(a / r.ra, r.b ? b / r.rb : Infinity) * yieldF;
      if (ext <= 0.01) continue;
      vol.set(r.a, a - ext * r.ra);
      if (r.b) vol.set(r.b, b - ext * r.rb);
      const used = ext * (r.ra + (r.b ? r.rb : 0));
      for (const pr of r.products) vol.set(pr.id, (vol.get(pr.id) || 0) + used * pr.frac);
      fired.push(r.id);
    }
  }
  // arcane activation: the well-mixed blend has one threshold; if the plan's
  // heat (or cold) passes it, all its magic awakens — in the simulation the
  // same happens particle by particle (simulation/arcane.js)
  let wMag = 0, tMag = 0;
  for (const [id, v] of vol) {
    const d = lookup(id);
    if (v > 1e-6 && isMagical(d)) { wMag += v; tMag += v * d.arcane.thr; }
  }
  const threshold = wMag > 0 ? tMag / wMag : null;
  let awakened = false;
  if (threshold !== null) {
    const Ta = thresholdToCelsius(threshold);
    awakened = threshold >= 0 ? hi >= Ta : lo <= Ta;
    if (awakened) {
      for (const [id, v] of [...vol]) {
        const d = lookup(id);
        if (v <= 1e-6 || !isMagical(d) || !lookup(awakenedId(id))) continue;
        vol.set(id, 0);
        vol.set(awakenedId(id), (vol.get(awakenedId(id)) || 0) + v);
      }
    }
  }
  // reduction: the lid is off and the brew boils; the most volatile liquid
  // goes first and leaves as vapour, everything that cannot boil stays
  if (plan.reduce && plan.reduce.frac > 0) {
    let left = plan.reduce.frac * total;
    const vols = [...vol].map(([id, v]) => ({ id, v, d: lookup(id) })).filter((x) => x.v > 1e-6 && x.d && x.d.form === 'liquid' && isFinite(x.d.boil) && x.d.boil < 150)
      .sort((a, b) => a.d.boil - b.d.boil);
    for (const x of vols) {
      if (left <= 0) break;
      const take = Math.min(x.v, left);
      vol.set(x.id, x.v - take);
      total -= take;
      left -= take;
    }
  }
  // late additions: cold, after the stages (only reactions that run at serving temperature)
  if (plan.late && plan.late.length) {
    const T = plan.serveTemp ?? 20;
    for (const ing of plan.late) { vol.set(ing.id, (vol.get(ing.id) || 0) + ing.n); total += ing.n; }
    for (const r of world.reactions) {
      if (!plan.late.some((i) => i.id === r.a || i.id === r.b)) continue;
      const a = vol.get(r.a) || 0, b = r.b ? vol.get(r.b) || 0 : Infinity;
      if (a <= 0 || b <= 0 || r.minT > T || r.maxT < T) continue;
      const ext = Math.min(a / r.ra, r.b ? b / r.rb : Infinity) * (r.kind === 'decompose' ? 0.55 : 0.88);
      if (ext <= 0.01) continue;
      vol.set(r.a, a - ext * r.ra);
      if (r.b) vol.set(r.b, b - ext * r.rb);
      const used = ext * (r.ra + (r.b ? r.rb : 0));
      for (const pr of r.products) vol.set(pr.id, (vol.get(pr.id) || 0) + used * pr.frac);
      fired.push(r.id);
    }
  }
  // gaseous products escape the liquid (they bubble out)
  for (const [id, v] of vol) {
    const d = lookup(id);
    if (d && d.form === 'gas' && d.boil < (plan.serveTemp ?? 20)) {
      total -= v;
      vol.set(id, 0);
    }
  }
  // the species table is kept per world between predictions (planning probes
  // thousands of plans); a full one starts afresh
  let sp = tables.get(lookup);
  const comp = new Float32Array(MAX_SPECIES);
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!sp || attempt) { sp = new SpeciesTable(); tables.set(lookup, sp); }
    comp.fill(0);
    let full = false;
    for (const [id, v] of vol) {
      if (v <= 1e-6) continue;
      const def = lookup(id);
      if (!def) continue;
      const s = sp.ensure(def);
      if (s >= 0) comp[s] += v / total;
      else full = true;
    }
    if (!full) break;
  }
  const props = mixtureProps(sp, comp, 0, plan.serveTemp ?? 20);
  const effects = compositionEffects(sp, comp, 0, plan.serveTemp ?? 20, world.laws || [], new Array(NE).fill(0));
  // what is extracted before laws and oppositions act (the planner balances on it)
  const raw = new Array(NE).fill(0);
  extractedEffects(sp, comp, 0, plan.serveTemp ?? 20, raw);
  /** @type {Record<string, number>} */
  const composition = {};
  for (let s = 0; s < sp.count; s++) if (sp.defs[s] && comp[s] > 1e-5) composition[sp.defs[s].id] = comp[s];
  return { ...props, effects, raw, composition, reactions: fired, totalParticles: total, threshold, awakened };
}

/**
 * The temperature a reducing brew boils at: its most volatile solvent's
 * boiling point while that lasts (spirit before water).
 * @param {BrewPlan} plan @param {(id:string)=>any} lookup
 */
export function reduceTemp(plan, lookup) {
  let b = Infinity;
  for (const ing of plan.ingredients) {
    const d = lookup(ing.id);
    if (d && d.form === 'liquid' && isFinite(d.boil) && d.boil < 150) b = Math.min(b, d.boil);
  }
  // a brew that loses all of a low-boiling spirit goes on to the water's boil
  let water = Infinity;
  for (const ing of plan.ingredients) { const d = lookup(ing.id); if (d && d.form === 'liquid' && isFinite(d.boil) && d.boil < 150 && d.boil > b + 10) water = Math.min(water, d.boil); }
  return isFinite(water) && plan.reduce && plan.reduce.frac > spiritShare(plan, lookup, b) ? water : isFinite(b) ? b : 100;
}

/** Share of the plan that is the solvent boiling at b. */
function spiritShare(plan, lookup, b) {
  let s = 0, t = 0;
  for (const ing of plan.ingredients) { const d = lookup(ing.id); t += ing.n; if (d && d.boil === b) s += ing.n; }
  return t ? s / t : 0;
}

/**
 * Can these temperatures awaken any part of a brew made of these materials,
 * however well or badly it is mixed? Local mixtures have thresholds anywhere
 * between those of their magical ingredients.
 *   'quiet' — no local mixture can awaken;
 *   'full'  — every local mixture awakens;
 *   'mixed' — it depends on how mixed the brew is (ambiguous).
 * Ingredients of both signs blend toward threshold 0 (≈20 °C), so such a
 * brew is quiet only at room temperature.
 * @param {string[]} ids @param {(id:string)=>any} lookup @param {number[]} temps °C
 */
export function arcaneRegime(ids, lookup, temps) {
  const ths = [];
  for (const id of ids) {
    const d = lookup(id);
    if (isMagical(d)) ths.push(d.arcane.thr);
  }
  if (!ths.length) return 'quiet';
  const hi = Math.max(20, ...temps), lo = Math.min(20, ...temps);
  const M = ACTIVATION_MARGIN;
  const pos = ths.filter((t) => t >= 0), neg = ths.filter((t) => t < 0);
  if (pos.length && neg.length) return hi <= 21 && lo >= 19 ? 'quiet' : 'mixed';
  if (pos.length) {
    if (hi <= thresholdToCelsius(Math.min(...pos)) - M) return 'quiet';
    if (hi >= thresholdToCelsius(Math.max(...pos)) + M) return 'full';
    return 'mixed';
  }
  if (lo >= thresholdToCelsius(Math.max(...neg)) + M) return 'quiet';
  if (lo <= thresholdToCelsius(Math.min(...neg)) - M) return 'full';
  return 'mixed';
}

/**
 * How far the plan's extreme temperatures are from the blend's threshold
 * (positive = past it, negative = short of it), in °C; null without magic.
 * @param {BrewPlan} plan @param {number|null} threshold
 */
export function activationMargin(plan, threshold) {
  if (threshold === null) return null;
  const Ta = thresholdToCelsius(threshold);
  const lo = Math.min(20, plan.coolTo ?? 20, plan.serveTemp ?? 20);
  const hi = Math.max(20, plan.heatTo ?? 20, plan.serveTemp ?? 20);
  return threshold >= 0 ? hi - Ta : Ta - lo;
}

/** Total coin cost of a plan's ingredients. */
export function planCost(plan, priceOf) {
  let c = 0;
  for (const ing of plan.ingredients) c += (ing.n * 5 / 100) * priceOf(ing.id);
  return c;
}
