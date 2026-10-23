// An automated shopkeeper that plays the real game loop with only what a
// player can know: the public effects of each ingredient (the jar's
// long-press), the guild theory (alchemy/effects.js theoryOf, with the laws
// it has discovered), steeping temperatures read from each ingredient's lore
// until its journal records the extraction it has seen happen (with the
// window the journal states), awakening temperatures its journal recorded,
// the arcanometer's reading of the brew in its own cauldron, its trials on
// its own rabbits, and what it sees. It never reads the order's hidden
// reference plan, an ingredient's hidden arcane threshold or reaction
// window, the hidden laws or the true effects of a brew.
//
// One order: gather or (legally) buy → formulate → brew in the real
// simulation (AutoBrewer stages driven by the bot's own plan) → test doses
// on rabbits → interpret the estimate and adjust (more carrier, a
// neutraliser, boiling down) → bottle → label → bargain → sell through the
// commerce code → the customer's verdict the next day.

import { Simulation } from '../../src/simulation/world.js';
import { AutoBrewer, condensedCount } from '../../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../../src/game/measure.js';
import { processEvent } from '../../src/game/journal.js';
import { ARC_NONE } from '../../src/simulation/particles.js';
import { certification } from '../../src/game/experiments.js';
import { coldFloor } from '../../src/game/commissions.js';
import { draftLabel, openNegotiation, proposePrice, acceptOffer, proofGaps } from '../../src/game/commerce.js';
import { makeVial, updateVial } from '../../src/game/vial.js';
import { livingRabbits } from '../../src/game/colony.js';
import { theoryOf, EFFECT_KEYS, EFFECT_INDEX, NE } from '../../src/alchemy/effects.js';
import { isMagical, thresholdToCelsius } from '../../src/alchemy/arcane.js';
import { scoreRequirement } from '../../src/game/evaluate.js';
import { buildProcedure, traceSample } from '../../src/game/recipes.js';
import { PHASE, SIM } from '../../src/simulation/constants.js';
import { equipmentById } from '../../src/game/equipment.js';

/**
 * Player profiles. `shop` is the order in which equipment is bought when
 * the purse allows (after a reserve); `margin` the strength the formulation
 * aims above the asked target (theory is optimistic about extraction).
 */
export const PROFILES = {
  beginner: { name: 'beginner', trials: 1, rabbits: 1, iterate: 0, windows: false, lessons: false, recipes: false, batch: false, stir: 4, margin: 1.0, error: 0.3, helpers: 1,
    shop: ['kit', 'rack1'] },
  casual: { name: 'casual', trials: 1, rabbits: 1, iterate: 1, windows: false, lessons: true, recipes: false, batch: false, stir: 8, margin: 1.15, error: 0.15, helpers: 2,
    shop: ['kit', 'rack1', 'satchel', 'kennel', 'frostrune'] },
  careful: { name: 'careful', trials: 3, rabbits: 3, iterate: 3, windows: true, lessons: true, recipes: false, batch: false, stir: 14, margin: 1.3, error: 0.04, helpers: 4,
    shop: ['kit', 'kennel', 'frostrune', 'arcanometer', 'rack1', 'still', 'satchel', 'warren', 'charter', 'copper', 'glacial'] },
  experienced: { name: 'experienced', trials: 2, rabbits: 2, iterate: 2, windows: true, lessons: true, recipes: true, batch: false, stir: 12, margin: 1.3, error: 0.04, helpers: 4,
    shop: ['kit', 'frostrune', 'kennel', 'arcanometer', 'rack1', 'satchel', 'stirrer', 'charter', 'copper', 'homunculus', 'glacial'] },
  efficient: { name: 'efficient', trials: 2, rabbits: 2, iterate: 1, windows: true, lessons: true, recipes: true, batch: true, stir: 12, margin: 1.3, error: 0.06, helpers: 3,
    shop: ['kit', 'rack1', 'stirrer', 'frostrune', 'rack2', 'kennel', 'copper', 'satchel', 'arcanometer', 'charter', 'rack3', 'homunculus'] },
};

/** The guild's opposing pairs as net channels the bot balances on (theory is linear on them). */
const CH = (v) => [v[EFFECT_INDEX.fire] - v[EFFECT_INDEX.frost], v[EFFECT_INDEX.vitality] - v[EFFECT_INDEX.death] - 2 * v[EFFECT_INDEX.toxicity], v[EFFECT_INDEX.acidity],
  v[EFFECT_INDEX.strength], v[EFFECT_INDEX.love], v[EFFECT_INDEX.arcana], v[EFFECT_INDEX.transformation]];
const CHAN = { fire: [0, 1], frost: [0, -1], vitality: [1, 1], acidity: [2, 1], strength: [3, 1], love: [4, 1], arcana: [5, 1], transformation: [6, 1], toxicity: [1, -2], death: [1, -1] };

/**
 * A run's metrics (one per player and seed).
 */
export function newMetrics() {
  return {
    orders: 0, sold: 0, declined: 0, abandoned: 0, noCustomer: 0, failedBrews: 0, quality: [], gatheredMl: 0, harvests: 0, boughtCoins: 0, shortages: 0,
    trials: 0, rabbitDeaths: 0, purges: 0, uncAtSale: [], levelsAtSale: {}, theoryError: [], iterations: 0,
    equipment: {}, used: {}, recipeSaves: 0, recipeReuse: 0, homunculus: 0, shelfSales: 0, shelved: 0, discarded: 0,
    techniques: {}, styles: {}, processes: {}, praise: 0, complaints: 0, legitComplaints: 0, refunds: 0, disputes: 0, disputesWon: 0,
    perDay: [], wallSeconds: 0,
  };
}

/** @param {any} met @param {string} k */
const bump = (met, k, field = 'used') => { met[field][k] = (met[field][k] || 0) + 1; };

/** A cauldron simulation for the shop's current equipment. */
export function cauldronFor(st) {
  const cap = st.cap;
  const sim = new Simulation({ size: cap.size, lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
  Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
  return sim;
}

/**
 * The steeping window of an ingredient as the player knows it: the one the
 * journal states once the extraction has been seen happening in the shop's
 * cauldron, otherwise a guess from the lore's words ("ice-cold", "gentle
 * warmth", "near boiling", "warm spirits", "hot oil"…). Null for liquids
 * and for solids the lore gives no reason to steep.
 * @param {any} st @param {string} id
 */
export function windowOf(st, id) {
  const m = st.lookup(id);
  if (!m || m.form === 'liquid' || m.form === 'gas') return null;
  const lore = String(m.description || '').toLowerCase();
  const into = /spirit/.test(lore) ? 'spirit' : /hot oil|loves oil|into oil/.test(lore) ? 'oil' : 'water';
  // an extraction the journal has recorded (named an extract, infusion, tea… — not a spoiling)
  const seen = discovered(st, id).find((r) => EXTRACTION.test(r.id));
  if (seen) return { lo: seen.minT, hi: seen.maxT, into: seen.b === st.world.roles.spirit ? 'spirit' : seen.b === st.world.roles.oil ? 'oil' : 'water', known: true };
  const w = loreWindow(lore, into, m);
  // "strong heat spoils them": keep delicate petals well below a boil
  if (w && /spoil|wilt/.test(lore)) w.hi = Math.min(w.hi, 70);
  return w;
}

/** Extraction reactions (as their names in the journal tell): extracts, infusions, teas, tinctures. */
const EXTRACTION = /^rw_(extract|infuse|steep|mandrake|starquartz|dragonoil)/;

/** Reactions of an ingredient that the journal has recorded. @param {any} st @param {string} id */
function discovered(st, id) {
  return st.world.reactions.filter((r) => r.a === id && st.journal['reaction:' + r.id]);
}

/** A steeping window guessed from an ingredient's lore. */
function loreWindow(lore, into, m) {
  if (/ice-cold|near-freezing|freezing water/.test(lore)) return { lo: 0, hi: 10, into, known: false };
  if (/hot oil|fierce heat/.test(lore)) return { lo: 150, hi: 250, into: 'oil', known: false };
  if (/near boiling|near the boil|nearly boiling/.test(lore)) return { lo: 80, hi: 98, into, known: false };
  if (/lukewarm/.test(lore)) return { lo: 20, hi: 45, into, known: false };
  if (/gentle warmth|warm water|warm spirits|warmed/.test(lore)) return { lo: 35, hi: 60, into, known: false };
  if (/steeped hot|simmer|hot water/.test(lore)) return { lo: 50, hi: 85, into, known: false };
  if (m.form === 'solid' || m.form === 'powder') return { lo: 40, hi: 75, into, known: false };
  return null;
}

/** Feed the cauldron's events to the journal, as the lab does (what the player sees happen). */
function observe(st, sim) {
  if (!sim.events.length) return;
  for (const e of sim.events.splice(0)) processEvent(st, e);
}

/**
 * The arcanometer's reading of the brew: the mean arcane threshold of the
 * unawakened magic in the cauldron, to the nearest 50 (lab.js arcaneReading).
 * Null without magic.
 * @param {any} sim
 */
function arcanometerReading(sim) {
  const p = sim.p;
  let w = 0, t = 0;
  for (let i = 0; i < p.count; i++) if (p.arcT[i] < ARC_NONE) { w++; t += p.arcT[i]; }
  return w ? Math.round(t / w / 50) * 50 : null;
}

/**
 * Where the player expects magic to wake: the temperatures its journal
 * recorded for these ingredients (or the extracts it has seen them give),
 * else the region's lore (the Moonfen's magic wakes in the cold).
 */
function awakenGuess(st, mags) {
  const ids = (m) => [m.id, ...discovered(st, m.id).flatMap((r) => r.products.map((p) => p.id))];
  const seen = mags.flatMap((m) => ids(m).map((id) => st.knowledge[id] && st.knowledge[id].awaken)).filter((v) => v !== undefined);
  const cold = mags.some((m) => m.wild && m.wild.region === 'moonfen');
  return { seen, cold };
}

/** Ingredients the shop can get today: shelf, wilds, market. */
function obtainable(st, now) {
  const out = [];
  for (const id of st.world.ingredients) {
    const m = st.lookup(id);
    if (!m || !m.effects || m.remains || m.product || !Object.keys(m.effects).length) continue;
    const have = st.supplyOf(id, now);
    if (have >= 30 || st.canBuy(id).ok) out.push(m);
  }
  return out;
}

/**
 * Formulate a brew from public knowledge: least squares on the guild's
 * opposing channels with the theory's linear model, carriers of the wanted
 * effects and up to `helpers` neutralisers.
 * @returns {{parts:{id:string, ml:number}[], solvent:string}|null}
 */
export function formulate(st, com, prof, brewMl, now, rng) {
  const wanted = com.requirements.filter((r) => r.effect && r.key !== 'purity').map((r) => ({ key: r.key, sign: r.kind === 'max' ? -1 : 1, target: Math.abs(Number(r.target) || 0) }));
  if (!wanted.length) return null;
  const purity = com.requirements.find((r) => r.key === 'purity');
  const free = new Set([...(purity ? purity.exclude : wanted.map((w) => w.key))]);
  const pool = obtainable(st, now).filter((m) => Object.entries(m.effects).every(([k, v]) => Math.abs(Number(v)) < 1 || free.has(k) || CHAN[k]));
  const vec = (m) => { const e = new Array(NE).fill(0); for (const [k, v] of Object.entries(m.effects)) e[EFFECT_INDEX[k]] = Number(v) || 0; return CH(e); };
  const carriers = wanted.map((w) => pool.filter((m) => w.sign * (m.effects[w.key] || 0) >= 8).sort((a, b) => w.sign * (b.effects[w.key] || 0) - w.sign * (a.effects[w.key] || 0) || (st.stock(b.id) - st.stock(a.id)))[0]).filter(Boolean);
  if (carriers.length < wanted.length) return null;
  const tgt = new Array(7).fill(0), wt = new Array(7).fill(6);
  for (const w of wanted) {
    const [c, sg] = CHAN[w.key] || [null, 1];
    if (c === null) continue;
    tgt[c] = sg * w.sign * w.target * prof.margin;
    wt[c] = 40 / (w.target * w.target);
  }
  // helpers: what opposes the carriers' side effects, the strongest few
  const sideCh = new Set();
  for (const m of carriers) vec(m).forEach((v, c) => { if (Math.abs(v) > 1 && tgt[c] === 0) sideCh.add(c); });
  const helpers = pool.filter((m) => !carriers.includes(m)).map((m) => ({ m, v: vec(m) }))
    .filter((x) => [...sideCh].some((c) => Math.abs(x.v[c]) > 6))
    .sort((a, b) => Math.max(...[...sideCh].map((c) => Math.abs(b.v[c]))) - Math.max(...[...sideCh].map((c) => Math.abs(a.v[c]))))
    .slice(0, prof.helpers).map((x) => x.m);
  const cand = [...new Set([...carriers, ...helpers])];
  const M = cand.map(vec);
  const x = /** @type {number[]} */ (cand.map((m) => (carriers.includes(m) ? 0.2 : 0)));
  const solid = cand.map((m) => m.form !== 'liquid');
  for (let sweep = 0; sweep < 300; sweep++) {
    let change = 0;
    for (let j = 0; j < cand.length; j++) {
      const r = tgt.map((t, c) => cand.reduce((a, _, q) => a + M[q][c] * x[q], 0) - t);
      let g = 0.01, hh = 0;
      for (let c = 0; c < 7; c++) { g += 2 * wt[c] * M[j][c] * r[c]; hh += 2 * wt[c] * M[j][c] * M[j][c]; }
      if (hh <= 1e-12) continue;
      let used = 0, sol = 0;
      for (let q = 0; q < cand.length; q++) if (q !== j) { used += x[q]; if (solid[q]) sol += x[q]; }
      const nx = Math.max(0, Math.min(x[j] - g / hh, 0.85 - used, solid[j] ? 0.45 - sol : 1));
      change = Math.max(change, Math.abs(nx - x[j]));
      x[j] = nx;
    }
    if (change < 1e-5) break;
  }
  // the player's own imprecision with the measures
  const parts = [];
  cand.forEach((m, j) => {
    if (x[j] * brewMl < 4) return;
    const ml = Math.max(5, Math.round((x[j] * brewMl * (1 + rng.range(-prof.error, prof.error))) / 5) * 5);
    parts.push({ id: m.id, ml });
  });
  // tinctures go into spirit, everything else into water
  // only when a carrier of what is wanted gives itself up to spirit alone
  const spiritIn = parts.some((p) => { const w = windowOf(st, p.id); return w && w.into === 'spirit' && carriers.some((c) => c.id === p.id); });
  const solvent = spiritIn && st.stock(st.world.roles.spirit) >= 30 || spiritIn && st.canBuy(st.world.roles.spirit).ok ? st.world.roles.spirit : st.world.roles.water;
  const used = parts.reduce((a, p) => a + p.ml, 0);
  const rest = Math.max(30, Math.round((brewMl - used) / 5) * 5);
  return { parts: [{ id: solvent, ml: rest }, ...parts], solvent };
}

/** Gather (careful, or thorough when short) and buy what a formulation needs. */
export function provision(st, parts, prof, clock, met) {
  for (const p of parts) {
    if (!isFinite(st.stock(p.id))) continue;
    const need = p.ml * 1.1;
    const deps = st.deposits.filter((d) => d.materialId === p.id && d.rank <= st.rank);
    for (const d of deps) {
      for (let k = 0; k < 8 && st.stock(p.id) < need; k++) {
        clock.t += 60_000;
        let r = st.gather(d.id, { now: clock.t });
        if (!r.ok && prof.batch && r.reason === 'reserve') r = st.gather(d.id, { now: clock.t, thorough: true });
        if (!r.ok) break;
        met.gatheredMl += r.amount; met.harvests++;
      }
    }
    if (st.stock(p.id) < need) {
      const r = st.buy(p.id, Math.ceil((need - st.stock(p.id)) / 100) * 100);
      if (r.ok) met.boughtCoins += r.cost;
    }
    if (st.stock(p.id) + 1e-6 < p.ml) { met.shortages++; return false; }
  }
  return true;
}

/**
 * Turn a formulation into stages the AutoBrewer runs: grind every solid,
 * steep where the bot's knowledge puts the windows (the journal, else the
 * lore; a beginner just steeps at 60 °C), hold past the arcane threshold
 * when the order needs awakening (where the journal saw it wake, else the
 * arcanometer's reading of the brew — see brew() — else the boil), then the
 * techniques the order asks for, as the order card's lessons say.
 */
export function stagePlan(st, com, prof, parts, sim) {
  const plan = { ingredients: parts.map((p) => ({ id: p.id, n: Math.max(1, Math.round(p.ml / SIM.ML_PER_PARTICLE)), ground: st.lookup(p.id).form === 'solid' ? true : undefined })), heatTo: 20, coolTo: 20, serveTemp: 20, knead: true, hold: 8 };
  // extraction
  const wins = parts.map((p) => windowOf(st, p.id)).filter(Boolean);
  if (prof.windows && wins.length) {
    const hot = wins.filter((w) => w.lo > 15);
    // never above the solvent's boil: a steep that boils away is no steep
    const solv = st.lookup(parts[0].id);
    const boil = solv && isFinite(solv.boil) ? solv.boil - 5 : 95;
    const lo = Math.max(...hot.map((w) => w.lo), 20), hi = Math.min(...hot.map((w) => w.hi), 95, boil);
    if (hot.length) {
      const T = Math.min(boil, lo <= hi ? Math.round((lo + hi) / 2) : Math.round(Math.max(...hot.map((w) => (Math.max(w.lo, 20) + Math.min(w.hi, boil)) / 2))));
      plan.steep = { T: Math.min(T, st.cap.maxFlame - 40), hold: 24 };
      plan.heatTo = plan.steep.T;
    }
    // ice-cold steeps: as cold as the equipment holds a brew (the basin's description says about 9 °C), never frozen
    const cold = wins.filter((w) => w.hi <= 20);
    if (cold.length) { const T = Math.max(coldFloor(st.cap) + 1, Math.round((cold[0].lo + cold[0].hi) / 2)); if (T <= Math.min(...cold.map((w) => w.hi)) - 2) plan.coolTo = T; }
  } else if (wins.length) { plan.steep = { T: 60, hold: 20 }; plan.heatTo = 60; }
  // awakening: the order is beyond sleeping magic. The temperature comes from
  // the journal (where these ingredients awoke before), else from the
  // arcanometer read on the brew itself (brew()), else the boil or the
  // coldest the plate gives
  if (com.activation) {
    const mags = parts.map((p) => st.lookup(p.id)).filter(isMagical);
    const g = awakenGuess(st, mags);
    if (!g.cold) plan.heatTo = Math.max(plan.heatTo, g.seen.length ? Math.min(98, Math.max(...g.seen) + 8) : 98);
    else plan.coolTo = Math.min(plan.coolTo, g.seen.length ? Math.max(st.cap.minCool + 2, Math.min(...g.seen) - 8) : st.cap.minCool + 2);
    plan.hold = 18; plan.activate = true;
    plan.arcanometer = st.has('arcanometer') && !g.seen.length;
  }
  const temp = com.requirements.find((r) => r.key === 'temperature');
  if (temp) plan.serveTemp = Math.round(Number(temp.target));
  const techs = prof.lessons ? com.techniques || [] : [];
  if (techs.includes('strong')) plan.reduce = { frac: 0.25 };
  plan.knead = prof.stir >= 10;
  void sim;
  return plan;
}

/** Brew a plan in the real cauldron, recording the brew log (pours and a trace) as the lab does. */
export function brew(st, sim, plan, met, log) {
  // with the arcanometer, the awakening is planned from its reading of the poured, mixed brew
  if (plan.activate && plan.arcanometer) {
    const pre = { ...plan, heatTo: plan.steep ? plan.steep.T : 20, coolTo: Math.min(20, plan.steep ? plan.steep.T : 20, plan.coolTo > 0 ? plan.coolTo : 20), serveTemp: 20, activate: false, hold: 6, reduce: undefined };
    brew(st, sim, pre, met, log);
    const thr = arcanometerReading(sim);
    bump(met, 'arcanometer');
    const next = { ingredients: [], heatTo: 20, coolTo: 20, serveTemp: plan.serveTemp, hold: 18, activate: true, knead: plan.knead };
    if (thr !== null && thr >= 0) next.heatTo = Math.min(98, thresholdToCelsius(thr) + 8);
    else if (thr !== null) next.coolTo = Math.max(st.cap.minCool + 2, thresholdToCelsius(thr) - 8);
    return brew(st, sim, { ...next, reduce: plan.reduce }, met, log);
  }
  const ab = new AutoBrewer(sim, plan, st.lookup, {
    onPour: (id, n) => st.consume(id, n * SIM.ML_PER_PARTICLE),
    onPoured: (id, n, ground) => log.push({ type: 'pour', id, ml: n * SIM.ML_PER_PARTICLE, t: Math.round(sim.time), ...(ground ? { ground: true } : {}) }),
  });
  let next = sim.time;
  for (let g = 0; !ab.done && g < 120 * 900; g++) {
    ab.tick();
    sim.step();
    observe(st, sim);
    if (sim.time >= next) {
      next = sim.time + 1;
      let T = 0, n = 0;
      for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] !== PHASE.GAS) { T += sim.p.temp[i]; n++; }
      if (n) traceSample(log, { t: sim.time, T: T / n, stir: sim.tool.active && sim.tool.type === 'spoon', crush: sim.tool.active && sim.tool.type === 'pestle', lid: sim.cauldron.lidClosed, ml: n * SIM.ML_PER_PARTICLE });
    }
  }
  if (ab.failed) met.failedBrews++;
  // the processes this brew really used
  if (plan.ingredients.some((i) => i.ground) || (plan.steps || []).some((s) => s.ground)) bump(met, 'grinding', 'processes');
  if (plan.steep) bump(met, 'steeping', 'processes');
  if (plan.activate) bump(met, 'awakening', 'processes');
  if (plan.reduce) bump(met, 'boiling down', 'processes');
  if (plan.steep && plan.steep.T < 15 || (plan.coolTo ?? 20) <= 8 && !plan.activate) bump(met, 'cold steep', 'processes');
  if ((plan.coolTo ?? 20) < 15) bump(met, 'chilling', 'processes');
  if ((plan.steps || []).length) bump(met, 'recipe replay', 'processes');
  return ab;
}

/** Stir the brew (by hand, or with the clockwork stirrer sweeping it). */
export function stirFor(st, sim, secs, met) {
  const t = sim.tool, c = sim.cauldron;
  t.type = 'spoon'; t.auto = true; t.autoPhase = 0; t.autoCenterX = 0;
  if (st.has('stirrer')) {
    let top = c.depth;
    for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] !== PHASE.GAS) top = Math.min(top, sim.p.y[i]);
    t.autoCenterY = (top + c.depth) / 2; t.autoRadius = c.belly * 0.55; t.autoSpan = Math.max(0, (c.depth - top) / 2 - 0.2);
    bump(met, 'stirrer');
  } else { t.autoCenterY = c.depth - Math.min(0.75, c.depth * 0.3); t.autoRadius = c.belly * 0.32; t.autoSpan = 0; }
  for (let k = 0; k < secs * 120; k++) { t.beginFrame(); t.substep(0, 1); sim.step(); observe(st, sim); }
  t.auto = false; t.active = false;
  for (let k = 0; k < 60; k++) sim.step();
  observe(st, sim);
}

/** Test doses from the tap on `rabbits` different rabbits, `trials` doses in all. */
export function testBatch(st, sim, com, prof, parts, clock, met) {
  const live = livingRabbits(st.colony);
  if (live.length < Math.min(2, prof.rabbits)) for (let k = live.length; k < Math.min(2, prof.rabbits) && st.coins > 12; k++) st.buyRabbit();
  const pool = livingRabbits(st.colony).sort((a, b) => (a.trials || 0) - (b.trials || 0)).slice(0, prof.rabbits);
  if (!pool.length) return null;
  const theory = theoryOf(parts, st.lookup, st.knownLaws);
  for (let k = 0; k < prof.trials; k++) {
    // the trial replaces a rabbit's record: always look it up afresh
    const rb = st.colony.rabbits.find((r) => r.id === pool[k % pool.length].id);
    if (!rb || !rb.alive) continue;
    const sel = tapSelection(sim, 2);
    if (sel.length < 2 || sim.p.count - 2 < com.bottleN) break;
    const dose = measureParticles(sim, sel);
    for (const i of sel.sort((a, b) => b - a)) sim.removeParticle(i);
    const { record, events } = st.recordTrial('rabbit', dose, { ml: 10, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory, parts, now: clock.t, rabbitId: rb.id });
    met.trials++;
    if (events.some((e) => e.type === 'rabbit-died')) met.rabbitDeaths++;
    const after = st.colony.rabbits.find((r) => r.id === rb.id);
    if (after && after.alive && ((after.degen && after.degen.length) || Object.values(after.marks || {}).some((v) => Math.abs(Number(v)) > 45))) {
      const r = st.purgeRabbit(after.id);
      if (!r.ok && st.buyPurge().ok) st.purgeRabbit(after.id);
      met.purges++;
    }
    void record;
  }
  const m = measureParticles(sim, tapSelection(sim, com.bottleN));
  const cert = certification(st.trials, st.batch, m.effects);
  for (let k = 0; k < NE; k++) {
    const key = EFFECT_KEYS[k];
    if (cert.values[key] !== undefined && Math.abs(theory[k]) >= 3) met.theoryError.push(Math.abs(cert.values[key] - theory[k]) / Math.abs(theory[k]));
  }
  return { cert, m, theory };
}

/**
 * What the estimate says about the order: which wanted effects fall short,
 * which unwanted ones are too strong (judged on the trial means only, and
 * the physical readings the instruments give).
 */
export function judge(st, com, cert, m, prof) {
  const short = [], excess = [];
  // a thinking player reads the margin: half of it is benefit of the doubt (a beginner reads the bare mean)
  const slack = (k) => (prof && prof.windows ? 0.5 * ((cert.unc || {})[k] || 0) : 0);
  for (const r of com.requirements) {
    if (r.effect && r.key !== 'purity') {
      const v = cert.values[r.key];
      if (v === undefined) continue;
      const vv = r.kind === 'max' ? v - slack(r.key) : v + slack(r.key);
      const s = scoreRequirement(r, /** @type {any} */ ({ ...m, effects: Object.assign(new Array(NE).fill(0), { [EFFECT_INDEX[r.key]]: vv }) }));
      if (s.score < 0.999) short.push({ key: r.key, v, target: Math.abs(Number(r.target)), sign: r.kind === 'max' ? -1 : 1 });
    } else if (r.key === 'purity') {
      for (const k of EFFECT_KEYS) {
        if ((r.exclude || []).includes(k)) continue;
        const v = cert.values[k];
        if (v !== undefined && Math.abs(v) - slack(k) > r.target) excess.push({ key: k, v });
      }
    }
  }
  return { short, excess };
}

/**
 * A neutraliser for an unwanted effect from what the shop can get (public
 * opposites): strong on the opposite, steeping warm or dissolving as it is
 * (a cold-steeping herb would need a stage of its own), bringing little else.
 */
function neutraliser(st, key, sign, now, free) {
  const opp = { fire: ['frost', 1], frost: ['fire', 1], death: ['vitality', 1], toxicity: ['vitality', 1], acidity: ['acidity', -1], vitality: ['death', 1] }[key];
  if (!opp) return null;
  const [ok, s] = opp;
  const want = key === 'acidity' ? -sign : s;
  const score = (m) => {
    const pot = want * (m.effects[ok] || 0);
    if (pot < 8) return -1;
    const w = windowOf(st, m.id);
    const warm = !w || w.lo > 15 ? 1 : 0.15;
    let side = 0;
    for (const [k, v] of Object.entries(m.effects)) if (k !== ok && !free.has(k)) side += Math.abs(Number(v));
    return pot * warm / (1 + side / 10);
  };
  return obtainable(st, now).map((m) => ({ m, s: score(m) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s)[0]?.m || null;
}

/** Add an ingredient to the running brew (gathering or buying it first), steeping it in where it needs heat. */
function addMore(st, sim, id, ml, prof, clock, met, log) {
  if (!provision(st, [{ id, ml }], prof, clock, met)) return false;
  const plan = { ingredients: [{ id, n: Math.max(1, Math.round(ml / SIM.ML_PER_PARTICLE)), ground: st.lookup(id).form === 'solid' ? true : undefined }], heatTo: 20, coolTo: 20, serveTemp: 20, knead: true, hold: 6 };
  const w = windowOf(st, id);
  if (w && w.lo > 15) { const T = prof.windows ? Math.round((w.lo + Math.min(w.hi, 95)) / 2) : 60; plan.steep = { T, hold: 20 }; plan.heatTo = T; }
  brew(st, sim, plan, met, log);
  st.touchBatch();
  return true;
}

/** Bottle `n` particles into a sealed vial carrying the batch's evidence. */
export function bottle(st, sim, n, parts) {
  const sel = tapSelection(sim, n);
  if (!sel.length) return null;
  const m = measureParticles(sim, sel);
  const cert = certification(st.trials, st.batch, m.effects);
  const vial = makeVial(sim, sel, { batchId: st.batch.id, rev: st.batch.rev, cert: cert.values, certRecords: cert.records, samples: cert.samples, parts, day: st.day });
  for (const i of sel.slice().sort((a, b) => b - a)) sim.removeParticle(i);
  updateVial(vial, st.lookup, st.world.laws);
  return vial;
}

/** Offer a vial to the current customer: label, bargain, sell. Returns the sale, or null. */
export function sell(st, vial, prof, met, fromShelf = false) {
  const com = st.current;
  const theory = theoryOf(vial.parts || [], st.lookup, st.knownLaws);
  const label = draftLabel(vial, theory, st.day);
  if (proofGaps(com, label).length) return null;
  const n = openNegotiation(com, vial, label, st.rank);
  const first = n.offer;
  proposePrice(n, com, Math.round(n.offer * (prof.name === 'beginner' ? 1.05 : 1.25)));
  if (n.state === 'open') acceptOffer(n);
  if (n.state !== 'deal') return null;
  const truth = { ...vial.m, ml: Math.floor(vial.ml / SIM.ML_PER_PARTICLE) * SIM.ML_PER_PARTICLE };
  st.vial = vial;
  const { sale } = st.completeDeal(vial, label, n.price, truth, first);
  st.vial = null;
  met.sold++;
  if (fromShelf) met.shelfSales++;
  met.quality.push(sale.quality);
  for (const t of com.techniques || []) met.techniques[t] = (met.techniques[t] || 0) + 1;
  const style = (com.style || '').split('+')[0];
  met.styles[style] = (met.styles[style] || 0) + 1;
  for (const [k, c] of Object.entries(label.claims)) if (c.source === 'trial' && c.evidence && com.requirements.some((r) => r.key === k)) {
    met.levelsAtSale[c.evidence.level] = (met.levelsAtSale[c.evidence.level] || 0) + 1;
    met.uncAtSale.push(c.evidence.u);
  }
  return sale;
}

/** A shelved bottle whose own evidence and visible qualities meet the order. */
export function shelfMatch(st, com) {
  for (const b of st.bottles) {
    if (!b.m || b.ml < com.bottleMl) continue;
    const fx = new Array(NE).fill(0);
    let untested = false;
    for (const r of com.requirements) {
      if (r.key === 'purity') { for (const k of EFFECT_KEYS) if (!(r.exclude || []).includes(k) && (b.cert || {})[k] === undefined) untested = true; }
      else if (r.effect && (b.cert || {})[r.key] === undefined) untested = true;
    }
    if (untested) continue;
    for (const [k, v] of Object.entries(b.cert || {})) fx[EFFECT_INDEX[k]] = v;
    if (com.requirements.every((r) => scoreRequirement(r, /** @type {any} */ ({ ...b.m, effects: fx, ml: b.ml })).score >= 0.999)) return b;
  }
  return null;
}

/**
 * Serve the current customer: from the shelves if a tested bottle fits,
 * else brew (or replay a recipe), test, adjust, bottle and sell.
 */
export function serveOrder(st, prof, rng, clock, met) {
  const com = st.current;
  met.orders++;
  // a stocked bottle that already meets the order
  const shelf = shelfMatch(st, com);
  if (shelf) {
    st.removeBottle(shelf.id);
    updateVial(shelf, st.lookup, st.world.laws);
    if (sell(st, shelf, prof, met, true)) return 'sold';
    st.shelveBottle(shelf);
  }
  const batchK = prof.batch && st.bottleRoom > 0 ? 2 : 1;
  const brewMl = Math.min(com.bottleMl * 2 * batchK + (prof.trials + 1) * 10, st.cap.size === 'pot' ? 1400 : 2000);
  const sim = cauldronFor(st);
  const log = [];
  st.newBatch();
  /** @type {any} */
  let parts = null;
  /** @type {any} */
  let plan = null;
  // an experienced player brews a saved recipe for the same request again (the homunculus if owned)
  // …but only one whose tested values meet this order (a weaker order of the same kind is fine, a stronger one is not)
  const fits = (r) => com.requirements.filter((q) => q.effect && q.key !== 'purity').every((q) => r.verified[q.key] !== undefined && scoreRequirement(q, /** @type {any} */ ({ effects: Object.assign(new Array(NE).fill(0), { [EFFECT_INDEX[q.key]]: r.verified[q.key] }) })).score >= 0.999)
    && (!com.requirements.some((q) => q.key === 'temperature') || r.serveTemp !== undefined && Math.abs(r.serveTemp - Number(com.requirements.find((q) => q.key === 'temperature').target)) < 6);
  const recipe = prof.recipes ? st.recipes.find((r) => r.request === com.request && r.steps && !r.approx && (r.techniques || []).join() === (com.techniques || []).join() && fits(r)) : null;
  if (recipe) {
    const need = recipe.steps.filter((s) => s.op === 'pour').map((s) => ({ id: s.id, ml: s.ml }));
    if (provision(st, need, prof, clock, met)) {
      plan = { ingredients: [], heatTo: 20, coolTo: 20, serveTemp: 20, steps: recipe.steps };
      parts = need;
      met.recipeReuse++;
      if (st.has('homunculus')) { met.homunculus++; bump(met, 'homunculus'); }
    }
  }
  if (!plan) {
    const f = formulate(st, com, prof, brewMl, clock.t, rng);
    if (!f) { met.abandoned++; return 'abandoned'; }
    if (!provision(st, f.parts, prof, clock, met)) { met.abandoned++; return 'abandoned'; }
    parts = f.parts;
    plan = stagePlan(st, com, prof, parts, sim);
  }
  brew(st, sim, plan, met, log);
  st.touchBatch();
  stirFor(st, sim, prof.stir, met);
  // test, interpret, adjust
  let res = testBatch(st, sim, com, prof, parts, clock, met);
  for (let it = 0; res && it < prof.iterate; it++) {
    const j = judge(st, com, res.cert, res.m, prof);
    if (!j.short.length && !j.excess.length) break;
    met.iterations++;
    let acted = false;
    for (const s of j.short) {
      const car = parts.slice(1).map((p) => st.lookup(p.id)).filter((m) => s.sign * (m.effects[s.key] || 0) >= 8)[0];
      if (!car) continue;
      const cur = parts.find((p) => p.id === car.id).ml;
      const add = Math.round((cur * Math.min(1.5, Math.max(0.2, s.target * 1.2 / Math.max(1, Math.abs(s.v)) - 1))) / 5) * 5;
      if (add >= 5 && sim.p.count + add / 5 < sim.maxParticles && addMore(st, sim, car.id, add, prof, clock, met, log)) { parts.find((p) => p.id === car.id).ml += add; acted = true; }
    }
    // far stronger than asked and carrying side effects: dilute it first (water lowers both)
    const over = j.short.length ? 0 : Math.min(...com.requirements.filter((r) => r.effect && r.key !== 'purity').map((r) => Math.abs(res.cert.values[r.key] ?? 0) / Math.max(1, Math.abs(Number(r.target)))));
    if (j.excess.length && over >= 1.5) {
      const vol = condensedCount(sim) * SIM.ML_PER_PARTICLE;
      const add = Math.round((vol * Math.min(over / 1.25 - 1, 1.5)) / 5) * 5;
      const room = (sim.maxParticles - sim.p.count) * SIM.ML_PER_PARTICLE;
      if (add >= 10 && add <= room && addMore(st, sim, st.world.roles.water, add, prof, clock, met, log)) { parts[0].ml += add; acted = true; bump(met, 'dilution', 'processes'); }
    }
    const free = new Set(com.requirements.filter((r) => r.key === 'purity').flatMap((r) => r.exclude || []));
    for (const e of acted ? [] : j.excess) {
      const nm = neutraliser(st, e.key, Math.sign(e.v), clock.t, free);
      if (!nm) continue;
      const pot = Math.abs(nm.effects[e.key === 'acidity' ? 'acidity' : { fire: 'frost', frost: 'fire', death: 'vitality', toxicity: 'vitality', vitality: 'death' }[e.key]] || 10);
      const vol = condensedCount(sim) * SIM.ML_PER_PARTICLE;
      const add = Math.max(5, Math.round(((Math.abs(e.v) * vol) / pot / 5)) * 5);
      if (sim.p.count + add / 5 < sim.maxParticles && addMore(st, sim, nm.id, add, prof, clock, met, log)) { const p = parts.find((x) => x.id === nm.id); if (p) p.ml += add; else parts.push({ id: nm.id, ml: add }); acted = true; bump(met, 'neutralising', 'processes'); }
    }
    if (!acted) break;
    stirFor(st, sim, prof.stir, met);
    res = testBatch(st, sim, com, prof, parts, clock, met);
  }
  if (!res) { met.abandoned++; return 'abandoned'; }
  // a careful player who sees the order unmet does not sell it
  const j = judge(st, com, res.cert, res.m, prof);
  if (process.env.PLAYTEST_DEBUG) console.log(`  [${prof.name}] ${com.style} ${com.activation ? 'AWAKEN ' : ''}parts ${parts.map((p) => p.id.replace('wild-', '') + ':' + p.ml).join(' ')} steep ${JSON.stringify(plan.steep || null)} heat ${plan.heatTo} cool ${plan.coolTo} → est ${Object.entries(res.cert.values).filter(([, v]) => v).map(([k, v]) => k + ' ' + v).join(', ')} | theory ${Array.from(res.theory).map((v, k) => (Math.abs(v) >= 1 ? EFFECT_KEYS[k] + ' ' + v.toFixed(0) : '')).filter(Boolean).join(', ')} | short ${j.short.map((x) => x.key).join(',')} excess ${j.excess.map((x) => x.key + ' ' + x.v).join(',')}`);
  if ((j.short.length || j.excess.length) && prof.iterate >= 2) { met.abandoned++; return 'abandoned'; }
  const vial = bottle(st, sim, com.bottleN, parts);
  if (!vial) { met.abandoned++; return 'abandoned'; }
  const sale = sell(st, vial, prof, met);
  // the rest of a batch goes onto the shelves (with its evidence)
  if (prof.batch) for (let k = 0; k < 2 && st.bottleRoom > 0 && condensedCount(sim) >= com.bottleN; k++) {
    const extra = bottle(st, sim, com.bottleN, parts);
    if (extra) { st.shelveBottle(extra); met.shelved++; bump(met, 'shelves'); }
  }
  // remember how it was done
  if (sale && prof.recipes && sale.quality >= 0.85 && !recipe) {
    const steps = buildProcedure(log, vial.m.temperature);
    st.addRecipe({ name: com.potionName, request: com.request, techniques: com.techniques || [], ingredients: parts.map((p) => ({ ...p })), steps, verified: { ...(vial.cert || {}) }, result: { color: vial.m.color }, serveTemp: Math.round(vial.m.temperature), maxTemp: 20, minTemp: 20, brews: 1, reproduced: 0, mismatched: 0 });
    met.recipeSaves++;
  }
  return sale ? 'sold' : 'refused';
}

/** The evening: verdicts, rabbits, equipment. */
export function evening(st, prof, met) {
  for (const f of st.dueFollowUps()) {
    if (f.kind === 'praise') { met.praise++; st.settleFollowUp(f.id, 'thank'); continue; }
    met.complaints++;
    if (f.legit) met.legitComplaints++;
    const sale = st.sales.find((s) => s.id === f.saleId);
    const covered = sale && (f.cites || []).every((k) => k === 'quality' ? sale.evidence.length > 0 : sale.claims[k] && sale.claims[k].source === 'trial');
    if (covered && prof.name !== 'beginner') { met.disputes++; const r = st.settleFollowUp(f.id, 'dispute'); if (r && r.rep > 0) met.disputesWon++; }
    else if (st.coins >= (f.demand || 0)) { met.refunds++; st.settleFollowUp(f.id, 'refund'); }
    else st.settleFollowUp(f.id, 'dismiss');
  }
  if (st.coins > 5) st.feedRabbits();
  // the most of any one reagent ever on the shelf (does shelf space ever bind?)
  for (const v of Object.values(st.inventory)) if (Number.isFinite(v)) met.maxStock = Math.max(met.maxStock || 0, v);
  for (const id of prof.shop) {
    const e = equipmentById(id);
    if (!e || st.has(id) || e.rank > st.rank || (e.requires && !e.requires.every((r) => st.has(r)))) continue;
    if (st.coins - e.price < 40) break;
    if (st.buyEquipment(id).ok) met.equipment[id] = st.day;
  }
  // stale stock: bottles of shelved batches whose evidence went stale are poured away when the shelves fill
  while (st.bottleRoom <= 0 && st.bottles.length) { st.bottles.shift(); met.discarded++; }
}
