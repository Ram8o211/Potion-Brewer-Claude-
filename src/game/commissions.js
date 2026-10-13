// Commission generation.
//
// Each request is derived from a hidden *reference plan* assembled only from
// reagents the player can currently buy and equipment they own. The plan's
// outcome is predicted with the simulation's own mixture laws and reaction
// stoichiometry, and the customer's targets are placed around that outcome
// with tolerances that tighten with difficulty — so every commission is
// achievable by construction (and the test-suite verifies this by actually
// brewing reference plans in the simulation).

import { Rng } from '../core/rng.js';
import { describeColor } from '../core/color.js';
import { predictPlan, planCost } from './predict.js';
import { ARCHETYPES, makeCustomer, archetypeOf } from './customers.js';
import { viscosityClass } from './measure.js';
import { SIM } from '../simulation/constants.js';

/**
 * @typedef {Object} Requirement
 * @property {string} key        color | density | viscosity | temperature | vitality | ardor | arcana | fortitude | stability | volatility
 * @property {'target'|'min'|'max'} kind
 * @property {number|number[]} target   number, or OKLab triple for colour
 * @property {number} tol        perfect-match tolerance
 * @property {number} zero       distance at which the score reaches zero
 * @property {number[]} [rgb]    colour swatch
 * @property {string} label
 */

const STYLE_NOUN = {
  tonic: 'Tonic', syrup: 'Cordial', warm: 'Hot Toddy', salve: 'Salve', elixir: 'Elixir', ardent: 'Warming Draught', arcane: 'Arcane Philtre',
  fizzy: 'Fizzing Brew', frost: 'Frost Draught', heavy: 'Heavy Draught', lumen: 'Glowing Philtre', panacea: 'Panacea', phoenix: 'Phoenix Brew', varnish: 'Protective Varnish',
};

const STYLE_TIER = { tonic: 0, syrup: 0, warm: 0, salve: 0, elixir: 1, ardent: 1, fizzy: 2, frost: 2, heavy: 1, arcane: 2, lumen: 3, varnish: 3, panacea: 4, phoenix: 4 };

/**
 * @typedef {Object} CommissionContext
 * @property {import('../materials/generator.js').World} world
 * @property {(id:string)=>any} lookup
 * @property {Set<string>} available     purchasable/owned ingredient ids
 * @property {ReturnType<import('./equipment.js').capabilities>} cap
 * @property {number} rank
 * @property {(id:string)=>number} priceOf coins per 100 ml
 * @property {string} [event]           active market event key
 */

/**
 * Build the reference plan for a style, or null if not possible now.
 * @param {string} style @param {CommissionContext} ctx @param {Rng} rng @param {number} n total particles
 * @returns {import('./predict.js').BrewPlan|null}
 */
function buildPlan(style, ctx, rng, n) {
  const R = ctx.world.roles;
  const has = (role) => R[role] && ctx.available.has(R[role]);
  const rx = (id) => ctx.world.reactions.find((r) => r.id === id);
  const essences = ['essenceA', 'essenceB', 'essenceC'].filter(has);
  const parts = (weights) => {
    const sum = weights.reduce((a, [, w]) => a + w, 0);
    return weights.map(([id, w]) => ({ id, n: Math.max(2, Math.round((w / sum) * n)) }));
  };
  const room = 20;
  switch (style) {
    case 'tonic':
    case 'warm': {
      if (!has('water') || essences.length === 0) return null;
      const e1 = R[rng.pick(essences)];
      const w = [[R.water, rng.range(1, 3)], [e1, rng.range(0.6, 1.6)]];
      if (essences.length > 1 && rng.chance(0.55)) {
        let e2 = R[rng.pick(essences)];
        if (e2 !== e1) w.push([e2, rng.range(0.3, 1.2)]);
      }
      const serve = style === 'warm' ? Math.round(rng.range(50, Math.min(85, ctx.cap.maxFlame - 40))) : rng.chance(0.25) ? Math.round(rng.range(35, 55)) : room;
      return { ingredients: parts(w), heatTo: serve, coolTo: room, serveTemp: serve };
    }
    case 'syrup': {
      if (!has('syrup') || !has('water')) return null;
      const w = [[R.syrup, rng.range(1, 2.4)], [R.water, rng.range(0.8, 2)]];
      if (essences.length && rng.chance(0.7)) w.push([R[rng.pick(essences)], rng.range(0.3, 0.9)]);
      const serve = rng.chance(0.4) ? Math.round(rng.range(35, 55)) : room;
      return { ingredients: parts(w), heatTo: serve, coolTo: room, serveTemp: serve, knead: true };
    }
    case 'salve': {
      if (!has('binder')) return null;
      const liquid = has('syrup') && rng.chance(0.3) ? R.syrup : R.water;
      const w = [[R.binder, rng.range(1.1, 1.5)], [liquid, 1]];
      if (essences.length && rng.chance(0.6)) w.push([R[rng.pick(essences)], rng.range(0.2, 0.4)]);
      return { ingredients: parts(w), heatTo: room, coolTo: room, serveTemp: room, knead: true };
    }
    case 'elixir': {
      if (!has('essenceA') || !has('salt') || !has('water')) return null;
      const r = rx('r_elixir');
      if (r.minT + 5 > ctx.cap.maxFlame - 60) return null;
      const w = [[R.essenceA, rng.range(1.6, 2.4)], [R.salt, 1], [R.water, rng.range(0.4, 1.5)]];
      const heat = Math.min(r.minT + rng.range(10, 25), 95);
      const serve = rng.chance(0.5) ? Math.round(rng.range(40, heat)) : room;
      return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: serve, hold: 15 };
    }
    case 'ardent': {
      if (!has('essenceB') || !has('ember')) return null;
      const r = rx('r_ardent');
      const w = [[R.essenceB, rng.range(1.8, 2.6)], [R.ember, 1]];
      if (has('water') && rng.chance(0.5)) w.push([R.water, rng.range(0.3, 1)]);
      const heat = Math.min(r.minT + rng.range(10, 25), 90);
      return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: Math.round(rng.range(45, heat)), hold: 12 };
    }
    case 'arcane': {
      if (!has('spirit') || !has('crystal') || !ctx.cap.has('pestle')) return null;
      const r = rx('r_arcane');
      const w = [[R.spirit, rng.range(2.6, 3.4)], [R.crystal, 1]];
      if (has('water') && rng.chance(0.4)) w.push([R.water, rng.range(0.4, 1)]);
      const heat = Math.min(r.minT + 8, r.maxT - 5, 66);
      return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: room, crush: true, hold: 20 };
    }
    case 'fizzy': {
      if (!has('fizz') || !has('essenceB')) return null;
      const w = [[R.fizz, 1], [R.essenceB, rng.range(1.5, 2.5)]];
      if (has('water') && rng.chance(0.5)) w.push([R.water, rng.range(0.5, 1.5)]);
      return { ingredients: parts(w), heatTo: room, coolTo: room, serveTemp: room, hold: 8 };
    }
    case 'frost': {
      if (!has('frost') || !has('essenceC')) return null;
      const w = [[R.frost, 1], [R.essenceC, rng.range(0.9, 1.4)]];
      return { ingredients: parts(w), heatTo: room, coolTo: Math.max(ctx.cap.minCool, -10), serveTemp: Math.round(rng.range(0, 8)), hold: 15 };
    }
    case 'heavy': {
      if (!has('metal')) return null;
      const w = [[R.metal, 3]];
      let crush = false;
      if (has('crystal') && ctx.cap.has('pestle') && rng.chance(0.6)) { w.push([R.crystal, 1]); crush = true; }
      return { ingredients: parts(w), heatTo: room, coolTo: room, serveTemp: room, crush, knead: crush, hold: crush ? 30 : 5 };
    }
    case 'lumen': {
      if (!has('spores') || !has('starlight')) return null;
      const r = rx('r_lumen');
      const w = [[R.spores, 1], [R.starlight, rng.range(1.2, 1.8)]];
      const heat = Math.min(r.minT + 10, r.maxT - 5);
      return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: room, knead: true, hold: 15 };
    }
    case 'varnish': {
      if (!has('resin') || !has('oil')) return null;
      const r = rx('r_varnish');
      if (r.minT + 20 > ctx.cap.maxFlame - 40) return null;
      const w = [[R.resin, 1], [R.oil, rng.range(1, 1.4)]];
      return { ingredients: parts(w), heatTo: r.minT + 20, coolTo: room, serveTemp: Math.round(rng.range(40, 70)), hold: 20 };
    }
    case 'panacea': {
      if (!['essenceA', 'salt', 'spirit', 'crystal'].every(has) || !ctx.cap.has('pestle')) return null;
      const e = rx('r_elixir'), a = rx('r_arcane'), pa = rx('r_panacea');
      const heat = Math.min(a.maxT - 5, pa.maxT - 5, Math.max(e.minT + 5, a.minT + 5, pa.minT + 5));
      if (heat < e.minT) return null;
      const w = [[R.essenceA, 2], [R.salt, 1], [R.spirit, 3], [R.crystal, 1]];
      return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: Math.round(rng.range(30, 50)), crush: true, hold: 30 };
    }
    case 'phoenix': {
      if (!has('phoenix') || !has('water')) return null;
      const w = [[R.phoenix, 1], [R.water, rng.range(2.5, 3.5)]];
      return { ingredients: parts(w), heatTo: 60, coolTo: room, serveTemp: Math.round(rng.range(40, 60)), hold: 10 };
    }
  }
  return null;
}

const ASPECT_KEYS = ['vitality', 'ardor', 'arcana', 'fortitude'];

/** Main property a style is about. */
const STYLE_PROPS = {
  tonic: ['color'], warm: ['color', 'temperature'], syrup: ['viscosity', 'density'], salve: ['viscosity'],
  elixir: ['vitality'], ardent: ['ardor'], arcane: ['arcana'], fizzy: ['volatility'], frost: ['temperature', 'fortitude'],
  heavy: ['density'], lumen: ['arcana'], varnish: ['fortitude', 'viscosity'], panacea: ['vitality', 'arcana'], phoenix: ['vitality', 'ardor'],
};

/**
 * Turn a predicted property into a requirement around it.
 * @param {string} key @param {any} pred @param {number} tier @param {number} strict @param {Rng} rng @param {import('./predict.js').BrewPlan} plan
 * @returns {Requirement|null}
 */
function makeRequirement(key, pred, tier, strict, rng, plan, style) {
  const s = strict;
  switch (key) {
    case 'color': {
      const tol = Math.max(5, (13 - 1.8 * tier) * s);
      return { key, kind: 'target', target: pred.lab, rgb: pred.color, tol, zero: tol * 3.2, label: describeColor(pred.color) };
    }
    case 'density': {
      const tol = Math.max(0.025, (0.075 - 0.01 * tier) * s);
      const t = Math.round((pred.density + rng.range(-0.3, 0.3) * tol) * 100) / 100;
      return { key, kind: 'target', target: t, tol, zero: tol * 3, label: `${(t - tol).toFixed(2)}–${(t + tol).toFixed(2)} g/ml` };
    }
    case 'viscosity': {
      // only where the outcome is predictable: plain liquids, or deliberate doughs/pastes
      if (pred.granular > 0.02 && style !== 'salve') return null;
      // log-space tolerance (factor); pastes get more room because their
      // viscosity climbs steeply with tiny changes in solids content
      const f = Math.max(1.6, (3.2 - 0.3 * tier) * s);
      const steep = 1 + Math.max(0, (Math.log(pred.viscosity) - Math.log(3000)) / 2.5);
      const tol = Math.log(f) * steep;
      const t = Math.log(pred.viscosity) + rng.range(-0.3, 0.3) * tol;
      return { key, kind: 'target', target: t, tol, zero: tol * 3, label: viscosityClass(Math.exp(t)) };
    }
    case 'temperature': {
      const tol = Math.max(5, (12 - 1.5 * tier) * s);
      const t = Math.round(plan.serveTemp ?? 20);
      return { key, kind: 'target', target: t, tol, zero: tol * 3, label: `${Math.round(t - tol)}–${Math.round(t + tol)}°C` };
    }
    case 'stability': {
      const min = Math.round(Math.min(85, 50 + 8 * tier) * (s < 1 ? 1.05 : 1));
      return { key, kind: 'min', target: min, tol: 0, zero: 35, label: `at least ${min}` };
    }
    case 'volatility': {
      const v = pred.volatility * 100 + (plan.ingredients.some((i) => /fizz/.test(i.id)) ? 25 : 0);
      if (v > 30) {
        const min = Math.round(Math.max(20, v * 0.6));
        return { key, kind: 'min', target: min, tol: 0, zero: Math.max(10, min * 0.6), label: `at least ${min}` };
      }
      const max = Math.round(Math.max(15, v + 12));
      return { key, kind: 'max', target: max, tol: 0, zero: 30, label: `at most ${max}` };
    }
    default: {
      const k = ASPECT_KEYS.indexOf(key);
      if (k < 0) return null;
      const v = pred.aspects[k];
      if (v < 6) return null;
      const min = Math.max(5, Math.round(v * (0.62 + 0.04 * tier)));
      return { key, kind: 'min', target: min, tol: 0, zero: Math.max(8, min * 0.6), label: `at least ${min}` };
    }
  }
}

/** Which styles a tier may request. */
function stylesFor(arch, tier, event) {
  let styles = arch.styles.filter((s) => STYLE_TIER[s] <= tier);
  if (event === 'winter') styles = styles.concat(['warm', 'ardent']).filter((s) => STYLE_TIER[s] <= tier);
  if (event === 'plague') styles = styles.concat(['elixir', 'salve']).filter((s) => STYLE_TIER[s] <= tier);
  if (event === 'conclave') styles = styles.concat(['arcane', 'lumen']).filter((s) => STYLE_TIER[s] <= tier);
  if (event === 'festival') styles = styles.concat(['tonic', 'fizzy']).filter((s) => STYLE_TIER[s] <= tier);
  if (!styles.length) styles = ['tonic'];
  return styles;
}

/**
 * Generate a commission.
 * @param {CommissionContext} ctx
 * @param {Rng} rng
 * @param {{tier?: number, archetype?: string, style?: string, contract?: boolean}} [opts]
 */
export function generateCommission(ctx, rng, opts = {}) {
  const tier = Math.max(0, Math.min(4, opts.tier ?? Math.min(4, ctx.rank)));
  const archetypes = ARCHETYPES.filter((a) => a.minRank <= ctx.rank);
  for (let attempt = 0; attempt < 40; attempt++) {
    const arch = opts.archetype ? archetypeOf(opts.archetype) : rng.pick(archetypes);
    const styles = opts.style ? [opts.style] : stylesFor(arch, tier, ctx.event);
    const style = rng.pick(styles);
    const bottleMl = [100, 150, 200, 250, 300][tier] * (opts.contract ? 1.5 : 1);
    const bottleN = Math.round(bottleMl / SIM.ML_PER_PARTICLE);
    const totalN = Math.min(Math.round(bottleN * rng.range(1.7, 2.3)), Math.floor(ctx.cap.size === 'small' ? 900 : 1300));
    const plan = buildPlan(style, ctx, rng, totalN);
    if (!plan) continue;
    if (plan.coolTo < ctx.cap.minCool - 2 && style !== 'frost') continue;
    const pred = predictPlan(ctx.world, ctx.lookup, plan);
    // choose required properties
    const want = new Set(STYLE_PROPS[style] || ['color']);
    if (style !== 'salve' && style !== 'heavy' && style !== 'varnish') want.add('color');
    const nReq = [2, 3, 3, 4, 4][tier] + (opts.contract ? 1 : 0);
    const extras = arch.props.filter((p) => !want.has(p));
    const shuffled = rng.shuffle(extras);
    for (const p of shuffled) {
      if (want.size >= nReq) break;
      if (p === 'quantity' || p === 'color') continue;
      if (tier === 0 && (p === 'stability' || p === 'volatility' || ASPECT_KEYS.includes(p))) continue;
      want.add(p);
    }
    if (tier >= 1 && want.size < nReq && !want.has('stability')) want.add('stability');
    /** @type {Requirement[]} */
    const reqs = [];
    const strict = arch.strict * (opts.contract ? 0.8 : 1);
    for (const key of want) {
      if (key === 'temperature' && Math.abs((plan.serveTemp ?? 20) - 20) < 6 && style !== 'warm' && style !== 'frost') continue;
      const r = makeRequirement(key, pred, tier, strict, rng, plan, style);
      if (r) reqs.push(r);
    }
    if (reqs.length < 1) continue;
    const customer = makeCustomer(rng, arch);
    const cost = planCost(plan, ctx.priceOf) * (bottleN / pred.totalParticles) * 1.6;
    const eventBonus = ctx.event && styles.includes(style) && ['winter', 'plague', 'conclave', 'festival'].includes(ctx.event) ? 1.25 : 1;
    const budget = Math.round((14 + cost * (2.6 + 0.45 * tier) + 9 * tier + reqs.length * 5) * arch.budget * eventBonus * (opts.contract ? 2.2 : 1));
    const colorWord = pred.color ? describeColor(pred.color) : '';
    const potionName = `${style === 'salve' || style === 'heavy' ? '' : capitalize(colorWord) + ' '}${STYLE_NOUN[style]}`.trim();
    const greet = rng.pick(arch.greet).replace('{potion}', aOrAn(potionName.toLowerCase()) + ' ' + potionName.toLowerCase());
    return {
      id: 'q' + Math.floor(rng.next() * 1e9).toString(36),
      tier,
      style,
      contract: !!opts.contract,
      potionName,
      customer,
      dialogue: greet,
      requirements: reqs,
      bottleMl,
      bottleN,
      budget: Math.max(12, budget),
      reference: plan,
      predicted: { density: pred.density, viscosity: pred.viscosity, aspects: pred.aspects, color: pred.color, reactions: pred.reactions },
      hintCost: Math.max(3, Math.round(budget * 0.12)),
    };
  }
  return null;
}

/** Fixed, gentle first commission used by the tutorial. */
export function tutorialCommission(ctx, rng) {
  const R = ctx.world.roles;
  const plan = { ingredients: [{ id: R.water, n: 30 }, { id: R.essenceA, n: 14 }], heatTo: 45, coolTo: 20, serveTemp: 45 };
  const pred = predictPlan(ctx.world, ctx.lookup, plan);
  const arch = archetypeOf('farmer');
  const customer = makeCustomer(rng, arch);
  customer.name = 'Old Mabry Hollins';
  const colorWord = describeColor(pred.color);
  return {
    id: 'q-tutorial',
    tier: 0,
    style: 'warm',
    contract: false,
    tutorial: true,
    potionName: `${capitalize(colorWord)} Tonic`,
    customer,
    dialogue: `Ah, a new alchemist! My old joints ache. Could you brew me a warm ${colorWord} tonic? Just ${ctx.lookup(R.essenceA).name} thinned with ${ctx.lookup(R.water).name}, served warm.`,
    requirements: [
      { key: 'color', kind: 'target', target: pred.lab, rgb: pred.color, tol: 14, zero: 44, label: colorWord },
      { key: 'temperature', kind: 'target', target: 45, tol: 12, zero: 36, label: '33–57°C' },
    ],
    bottleMl: 100,
    bottleN: 20,
    budget: 30,
    reference: plan,
    predicted: { density: pred.density, viscosity: pred.viscosity, aspects: pred.aspects, color: pred.color, reactions: [] },
    hintCost: 0,
  };
}

/** @param {string} s */
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
/** @param {string} w */
function aOrAn(w) {
  return /^[aeiou]/i.test(w) ? 'an' : 'a';
}

export { STYLE_NOUN };
