// Commissions: customers come with a problem and ask for the magic that
// solves it, as ranges on the six magical properties ("Vitality at least
// 30, Bane at most 5"). Never colour, thickness or chemistry.
//
// Each request is built around a hidden reference plan made only from
// ingredients the shop can grow (or has in store) and equipment it owns.
// The plan's outcome is predicted with the simulation's own magic laws
// (predict.js) and every range is placed so that outcome sits comfortably
// inside it — so every request is achievable by construction (the test
// suite brews reference plans in the real simulation to check).

import { predictPlan } from './predict.js';
import { ARCHETYPES, makeCustomer, archetypeOf } from './customers.js';
import { SIM } from '../simulation/constants.js';
import { PROP_INDEX, PROP_KEYS, PROP_BY_KEY, NP, magicVector, magicWeight } from '../alchemy/magic.js';
import { compatFactorT } from '../reactions/compatibility.js';

/**
 * @typedef {Object} Requirement
 * @property {string} key        a property key (alchemy/magic.js)
 * @property {number} min
 * @property {number} max
 * @property {'want'|'range'|'limit'} kind   want: at least min · range: min..max · limit: at most max (a side effect)
 */

/** What people come in for, by the property that solves it. */
export const PROBLEMS = {
  vitality: [
    { title: 'Healing Draught', lines: ['A boar gored my leg. It has to mend.', 'My child has a fever that will not lift.', 'I need my strength back after the winter sickness.'], drunk: true },
    { title: 'Growth Tonic', lines: ['My orchard is wilting. Something to bring it back to life.', 'The old oak by the mill is dying.'], drunk: false },
  ],
  ardor: [
    { title: 'Warming Draught', lines: ['The pass is frozen and I must cross it tonight.', 'My bones ache with cold all winter.'], drunk: true, avoid: ['frost'] },
    { title: 'Forge Kindling', lines: ['My forge will not get hot enough for star-iron.', 'The kiln keeps going out.'], drunk: false, avoid: ['frost'] },
  ],
  frost: [
    { title: 'Fever Cooler', lines: ['A burning fever. Something cold, but gentle.', 'Dragon-burn on my arm. Cool it!'], drunk: true, avoid: ['ardor'] },
    { title: 'Larder Frost', lines: ['The summer heat spoils my larder.', 'I must keep the fish fresh to market.'], drunk: false, avoid: ['ardor'] },
  ],
  levity: [
    { title: 'Feather Draught', lines: ['I must cross the gorge where the bridge fell.', 'The bell is too heavy to hoist into the tower.'], drunk: true },
    { title: 'Floating Oil', lines: ['My barge is stuck on the shoal.', 'Make the cart light enough for the mud road.'], drunk: false },
  ],
  charm: [
    { title: 'Love Philtre', lines: ['There is someone at the mill I hope will notice me…', 'My husband has forgotten how to smile at me.'], drunk: true },
    { title: 'Calming Charm', lines: ['My bull has gone wild. Something to calm him.', 'Tomorrow I must win over the toll-master.'], drunk: true },
  ],
  bane: [
    { title: 'Pest Bane', lines: ['Rats in the granary. Deadly to them, please.', 'Slugs are eating every cabbage I grow.'], drunk: false },
    { title: 'Weed Killer', lines: ['Blightweed is choking the barley.', 'Thorns have overgrown the old chapel.'], drunk: false },
  ],
};

/**
 * @typedef {Object} CommissionContext
 * @property {any} world
 * @property {(id:string)=>any} lookup
 * @property {Set<string>} available     ingredient ids the shop can grow or has in store
 * @property {Record<string, number>} [stock] how much of each the shop has (to favour what is at hand)
 * @property {ReturnType<import('./equipment.js').capabilities>} cap
 * @property {number} rank
 * @property {string} [event]           active market event key
 */

const ROOM = 20;
const BOTTLE_ML = [100, 120, 150, 180, 200];

/** Are all liquids of a set fully blended at temperature T (and stones dissolvable in one of them)? */
function blendable(defs, T) {
  const liquids = defs.filter((d) => d.form === 'liquid');
  for (let a = 0; a < liquids.length; a++) for (let b = a + 1; b < liquids.length; b++) {
    if (compatFactorT(liquids[a].compat[0], liquids[a].compat[1], liquids[b].compat[0], liquids[b].compat[1], T) < 0.95) return false;
  }
  for (const d of defs) {
    if (d.form === 'liquid') continue;
    if (!liquids.some((l) => compatFactorT(d.compat[0], d.compat[1], l.compat[0], l.compat[1], T) > 0.8)) return false;
  }
  return true;
}

/**
 * A hidden plan for an ordinary request: the ingredient strongest in the
 * wanted property (sometimes a second one), well water, and the heat that
 * draws stones out without fading anything.
 * @param {string} key @param {string|null} key2 @param {CommissionContext} ctx @param {import('../core/rng.js').Rng} rng @param {number} n total particles
 */
function buildPlan(key, key2, ctx, rng, n) {
  const k = PROP_INDEX[key];
  const water = ctx.lookup(ctx.world.roles.water);
  const cands = [...ctx.available].map(ctx.lookup).filter((m) => m && m.kind !== 'water' && (m.magic?.[key] || 0) >= 25);
  if (!cands.length) return null;
  const stockOf = (m) => (ctx.stock ? ctx.stock[m.id] || 0 : 100);
  const main = rng.weighted(cands, cands.map((m) => (m.magic[key] || 0) * (0.6 + Math.min(1, stockOf(m) / 120))));
  const parts = [main];
  if (key2) {
    const c2 = [...ctx.available].map(ctx.lookup).filter((m) => m && m !== main && m.kind !== 'water' && (m.magic?.[key2] || 0) >= 25);
    if (!c2.length) return null;
    parts.push(rng.pick(c2));
  }
  // the hottest the blend may get without fading, and below any transmutation
  const fade = Math.min(...parts.map((m) => m.fadeT ?? 999));
  const supers = parts.map((m) => m.superT).filter((t) => Number.isFinite(t) && t > ROOM);
  const ceiling = Math.min(fade - 8, ...supers.map((t) => t - 12), ctx.cap.maxFlame - 40, 92);
  const hasStone = parts.some((m) => m.form === 'solid');
  const heatTo = hasStone ? Math.max(ROOM, Math.min(ceiling, rng.range(55, 75))) : ROOM;
  const useWater = parts.some((m) => m.form === 'solid') || rng.chance(0.85);
  const defs = useWater ? [...parts, water] : parts.slice();
  if (!blendable(defs, Math.max(heatTo, ROOM))) return null;
  // proportions: enough of the main ingredient for a clear reading, the rest water
  const share = rng.range(0.4, 0.75);
  const n1 = Math.max(3, Math.round(n * share * (key2 ? 0.7 : 1)));
  const n2 = key2 ? Math.max(3, Math.round(n * share * rng.range(0.3, 0.5))) : 0;
  /** @type {{id:string, n:number, ground?:boolean}[]} */
  const ingredients = [];
  const left = n - n1 - n2;
  if (useWater && left > 0) ingredients.push({ id: water.id, n: left });
  ingredients.push({ id: main.id, n: useWater ? n1 : n - n2, ground: main.form === 'solid' ? true : undefined });
  if (key2) ingredients.push({ id: parts[1].id, n: n2, ground: parts[1].form === 'solid' ? true : undefined });
  return { ingredients, heatTo: Math.round(heatTo), coolTo: ROOM, serveTemp: ROOM, knead: hasStone, hold: hasStone ? 16 : 6 };
}

/**
 * A plan that crosses a blend's super-transition threshold, for a request of
 * near-pure magic: searches the shop's ingredients (alone or in pairs) for a
 * blend whose averaged threshold the shop's fire or frost can reach, that
 * transmutes into `key`.
 * @param {string} key @param {CommissionContext} ctx @param {import('../core/rng.js').Rng} rng @param {number} n
 */
function buildSuperPlan(key, ctx, rng, n) {
  const k = PROP_INDEX[key];
  const mats = [...ctx.available].map(ctx.lookup).filter((m) => m && m.kind !== 'water' && Number.isFinite(m.superT));
  const water = ctx.lookup(ctx.world.roles.water);
  const hot = Math.min(ctx.cap.maxFlame - 30, 96);
  // a frozen brew cools slowly and unevenly: the threshold must be well within reach
  const cold = Math.max(ctx.cap.minCool + 20, ctx.cap.minCool * 0.45);
  /** @type {any[]} */
  const options = [];
  const tryBlend = (a, b, fa) => {
    const wa = magicWeight(a) * fa, wb = b ? magicWeight(b) * (1 - fa) : 0;
    const T = (wa * a.superT + (b ? wb * b.superT : 0)) / (wa + wb);
    const votes = new Array(NP).fill(0);
    votes[PROP_INDEX[a.superKey]] += wa;
    if (b) votes[PROP_INDEX[b.superKey]] += wb;
    if (votes.indexOf(Math.max(...votes)) !== k) return;
    const reach = T > ROOM ? T <= hot - 4 && T >= 35 : T >= cold + 4 && T <= 2;
    if (!reach) return;
    const defs = b ? [a, b] : [a];
    const target = T > ROOM ? Math.round(T + 6) : Math.round(T - 10);
    if (!blendable(defs, Math.max(ROOM, T > ROOM ? target : ROOM))) return;
    options.push({ a, b, fa, T, target });
  };
  for (const a of mats) {
    tryBlend(a, null, 1);
    for (const b of mats) if (b !== a) for (let f = 0.3; f <= 0.75; f += 0.05) tryBlend(a, b, f);
  }
  if (!options.length) return null;
  const o = rng.pick(options);
  // a little water keeps it drinkable only if everything blends with water
  const withWater = blendable(o.b ? [o.a, o.b, water] : [o.a, water], Math.max(ROOM, o.T > ROOM ? o.target : ROOM)) && rng.chance(0.5);
  const nw = withWater ? Math.round(n * 0.15) : 0;
  const na = Math.max(3, Math.round((n - nw) * o.fa));
  const nb = o.b ? Math.max(3, n - nw - na) : 0;
  /** @type {{id:string, n:number, ground?:boolean}[]} */
  const ingredients = [];
  if (nw) ingredients.push({ id: water.id, n: nw });
  ingredients.push({ id: o.a.id, n: o.b ? na : n - nw, ground: o.a.form === 'solid' ? true : undefined });
  if (o.b) ingredients.push({ id: o.b.id, n: nb, ground: o.b.form === 'solid' ? true : undefined });
  const defs = ingredients.map((i) => ctx.lookup(i.id));
  const hasStone = defs.some((d) => d.form === 'solid');
  if (o.T > ROOM) return { ingredients, heatTo: o.target, coolTo: ROOM, serveTemp: ROOM, knead: hasStone, stir: 16, hold: 12 };
  // stones dissolve warm first (below anything that fades), so the blend is one before it is chilled
  const steep = hasStone ? Math.max(ROOM, Math.min(70, ...defs.map((d) => (d.fadeT ?? 999) - 10))) : ROOM;
  return { ingredients, heatTo: steep > 30 ? Math.round(steep) : ROOM, coolTo: o.target, serveTemp: ROOM, knead: hasStone, stir: 16, hold: 30 };
}

/** Round to a multiple of 5. */
const r5 = (v) => Math.round(v / 5) * 5;

/**
 * Requirements around a predicted outcome.
 * @param {number[]} m predicted magic @param {string[]} wanted @param {any} problem @param {number} tier @param {boolean} superReq
 * @param {import('../core/rng.js').Rng} rng
 * @returns {Requirement[]}
 */
function requirementsFor(m, wanted, problem, tier, superReq, rng) {
  /** @type {Requirement[]} */
  const reqs = [];
  for (const key of wanted) {
    const v = m[PROP_INDEX[key]];
    if (v < 12) return [];
    if (superReq) { reqs.push({ key, min: Math.max(40, Math.floor((v - 12) / 5) * 5), max: 100, kind: 'want' }); continue; }
    if (tier >= 2 && rng.chance(0.55)) {
      const tol = Math.max(10, r5(v * 0.25));
      const c = r5(v);
      reqs.push({ key, min: Math.max(5, c - tol), max: Math.min(100, c + tol), kind: 'range' });
    } else {
      // at least: comfortably below what the plan yields
      const min = Math.max(5, Math.floor((v * rng.range(0.6, 0.75)) / 5) * 5);
      reqs.push({ key, min, max: 100, kind: 'want' });
    }
  }
  // side effects the customer will not stand for
  const limits = new Set();
  if (problem.drunk) limits.add('bane');
  for (const a of problem.avoid || []) limits.add(a);
  if (superReq) for (const k of PROP_KEYS) if (!wanted.includes(k)) limits.add(k);
  if (tier >= 2) {
    const extra = PROP_KEYS.filter((k) => !wanted.includes(k) && !limits.has(k) && m[PROP_INDEX[k]] >= 4);
    if (extra.length) limits.add(rng.pick(extra));
  }
  for (const key of limits) {
    if (wanted.includes(key)) continue;
    const v = m[PROP_INDEX[key]];
    const max = superReq ? Math.max(10, Math.ceil((v + 6) / 5) * 5) : Math.max(5, Math.ceil((v + 7 + (tier < 2 ? 5 : 0)) / 5) * 5);
    if (max >= 100) continue;
    reqs.push({ key, min: 0, max, kind: 'limit' });
  }
  return reqs;
}

/**
 * Generate a commission.
 * @param {CommissionContext} ctx
 * @param {import('../core/rng.js').Rng} rng
 * @param {{tier?: number, archetype?: string, key?: string, contract?: boolean, super?: boolean}} [opts]
 */
export function generateCommission(ctx, rng, opts = {}) {
  const tier = Math.max(0, Math.min(4, opts.tier ?? Math.min(4, ctx.rank)));
  const archetypes = ARCHETYPES.filter((a) => a.minRank <= ctx.rank);
  for (let attempt = 0; attempt < 40; attempt++) {
    const arch = opts.archetype ? archetypeOf(opts.archetype) : rng.pick(archetypes);
    let wants = arch.wants.slice();
    if (ctx.event === 'winter') wants.push('ardor', 'ardor');
    if (ctx.event === 'plague') wants.push('vitality', 'vitality');
    if (ctx.event === 'festival') wants.push('charm', 'charm');
    if (ctx.event === 'heatwave') wants.push('frost', 'frost');
    const key = opts.key || rng.pick(wants);
    const problem = rng.pick(PROBLEMS[key]);
    const bottleMl = BOTTLE_ML[tier] * (opts.contract ? 1.5 : 1);
    const bottleN = Math.round(bottleMl / SIM.ML_PER_PARTICLE);
    const vessel = { pot: 310, copper: 440, grand: 600 }[ctx.cap.size] || 310;
    // the bottle plus a little for the creatures
    const totalN = Math.min(bottleN + 5, Math.floor(vessel * 0.45));
    const superReq = !!opts.super || (tier >= 3 && attempt < 20 && rng.chance(0.3));
    let key2 = null;
    if (!superReq && tier >= 2 && rng.chance(0.4)) {
      const others = PROP_KEYS.filter((k) => k !== key && !(problem.avoid || []).includes(k) && k !== 'bane');
      key2 = rng.pick(others);
    }
    const plan = superReq ? buildSuperPlan(key, ctx, rng, totalN) : buildPlan(key, key2, ctx, rng, totalN);
    if (!plan) continue;
    const pred = predictPlan(ctx.world, ctx.lookup, plan);
    const wanted = key2 ? [key, key2] : [key];
    const reqs = requirementsFor(Array.from(pred.magic), wanted, problem, tier, superReq, rng);
    if (!reqs.length) continue;
    // every range must hold the predicted outcome with room to spare
    if (!reqs.every((r) => pred.magic[PROP_INDEX[r.key]] >= r.min + (r.min > 0 ? 3 : 0) && pred.magic[PROP_INDEX[r.key]] <= r.max - 3)) continue;
    const customer = makeCustomer(rng, arch);
    const eventBonus = ctx.event && ['winter', 'plague', 'festival', 'heatwave'].includes(ctx.event) && wants.slice(arch.wants.length).includes(key) ? 1.25 : 1;
    const value = Math.round((34 + 20 * tier + 7 * reqs.length + (superReq ? 50 : 0)) * arch.budget * Math.pow(bottleMl / 120, 0.7) * eventBonus * (opts.contract ? 1.8 : 1));
    return {
      id: 'q' + Math.floor(rng.next() * 1e9).toString(36),
      type: 'order',
      tier,
      key,
      problem: problem.title,
      contract: !!opts.contract,
      super: superReq,
      potionName: problem.title,
      customer,
      dialogue: rng.pick(problem.lines),
      requirements: reqs,
      bottleMl,
      bottleN,
      value: Math.max(15, value),
      bluff: arch.bluff,
      reference: plan,
      predicted: { magic: pred.magic.map((v) => Math.round(v * 10) / 10) },
      hintCost: Math.max(3, Math.round(value * 0.12)),
    };
  }
  return null;
}

/** The gentle first order of the tutorial: a healing draught of dew and water. */
export function tutorialCommission(ctx, rng) {
  const R = ctx.world.roles;
  const plan = { ingredients: [{ id: R.water, n: 10 }, { id: R.dew, n: 10 }], heatTo: ROOM, coolTo: ROOM, serveTemp: ROOM, hold: 6 };
  const pred = predictPlan(ctx.world, ctx.lookup, plan);
  const vit = Math.max(10, Math.floor((pred.magic[PROP_INDEX.vitality] * 0.6) / 5) * 5);
  const customer = makeCustomer(rng, archetypeOf('farmer'));
  customer.name = 'Old Mabry Hollins';
  return {
    id: 'q-tutorial',
    type: 'order',
    tier: 0,
    key: 'vitality',
    problem: 'Healing Draught',
    contract: false,
    super: false,
    tutorial: true,
    potionName: 'Healing Draught',
    customer,
    dialogue: 'My old joints ache. Something to heal them — and nothing that sickens me.',
    requirements: [
      { key: 'vitality', min: vit, max: 100, kind: 'want' },
      { key: 'bane', min: 0, max: 10, kind: 'limit' },
    ],
    bottleMl: 80,
    bottleN: 16,
    value: 44,
    bluff: 0,
    reference: plan,
    predicted: { magic: pred.magic.map((v) => Math.round(v * 10) / 10) },
    hintCost: 0,
  };
}

/** Does a magic vector (truth or label) fall inside every range? @param {any} com @param {ArrayLike<number>} v @param {number} [grace] */
export function meets(com, v, grace = 0) {
  return com.requirements.every((r) => {
    const x = v[PROP_INDEX[r.key]];
    return x >= r.min - grace && x <= r.max + grace;
  });
}

/** Which requirements a vector misses, and how. @returns {{key:string, kind:'weak'|'strong'|'side'}[]} */
export function failures(com, v, grace = 0) {
  const out = [];
  for (const r of com.requirements) {
    const x = v[PROP_INDEX[r.key]];
    if (x < r.min - grace) out.push({ key: r.key, kind: /** @type {'weak'} */ ('weak') });
    else if (x > r.max + grace) out.push({ key: r.key, kind: r.kind === 'limit' ? /** @type {'side'} */ ('side') : /** @type {'strong'} */ ('strong') });
  }
  return out;
}

/** A requirement in a few characters ("≥30", "≤5", "20–40"). @param {Requirement} r */
export function reqText(r) {
  if (r.kind === 'limit') return `≤${r.max}`;
  if (r.max >= 100) return `≥${r.min}`;
  return `${r.min}–${r.max}`;
}

export { magicVector, PROP_BY_KEY };
