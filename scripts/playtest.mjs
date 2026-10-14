// Automated balancing playthrough. A simulated shopkeeper plays the real game
// rules for several days: tends and harvests the garden (with simulated
// wall-clock time passing, so beds deplete, dry out and regrow), brews each
// request's hidden reference plan in the real physics simulation (with
// skill-dependent mistakes: wrong amounts, wrong temperatures), tests doses
// on creatures that show the requested properties, writes a Potion ID from
// what they showed, sometimes has the vial certified, haggles, sells, deals
// with returning customers, and buys equipment and new garden beds. Reports
// the economy and progression curve.
//
//   node scripts/playtest.mjs [days=10] [seeds=3]
// Results: docs/playtest-results.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameState } from '../src/game/state.js';
import { EQUIPMENT, RANKS } from '../src/game/equipment.js';
import { BEDS } from '../src/game/garden.js';
import { CREATURES } from '../src/game/testing.js';
import { Simulation } from '../src/simulation/world.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { ask, acceptOffer } from '../src/game/haggle.js';
import { Rng } from '../src/core/rng.js';
import { blendOf, PROP_KEYS, PROP_INDEX } from '../src/alchemy/magic.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DAYS = Number(process.argv[2] || 10);
const SEEDS = Number(process.argv[3] || 3);
const PROFILES = [
  { name: 'careful', skill: 0.95, certify: true },
  { name: 'casual', skill: 0.7, certify: false },
];

/** Apply a player's imprecision to a reference plan. */
function humanise(plan, skill, rng) {
  const err = 1 - skill;
  return {
    ...plan,
    ingredients: plan.ingredients.map((i) => ({ ...i, n: Math.max(1, Math.round(i.n * (1 + rng.range(-0.4, 0.4) * err))) })),
    heatTo: (plan.heatTo ?? 20) + rng.range(-12, 12) * err,
  };
}

function playRun(seed, profile) {
  const st = GameState.create(seed, { tutorial: false });
  const rng = new Rng(`${seed}:${profile.name}`);
  const days = [];
  const t0 = Date.now();
  // simulated wall clock: each visitor takes about ten minutes of play
  let clock = Date.now();
  let harvested = 0, tests = 0, certified = 0;
  /** Tend the garden: water dry plant beds, harvest what is ripe. */
  const tend = () => {
    for (const b of BEDS) {
      const s = st.bed(b.id, clock);
      if (!s || !s.owned) continue;
      if (b.kind === 'plant' && !s.moist) st.water(b.id, clock);
      if (s.ready) { const r = st.harvest(b.id, clock); if (r.ok && b.kind !== 'well') harvested += r.amount; }
    }
  };
  for (let d = 0; d < DAYS; d++) {
    let declined = 0, refunds = 0;
    const bought = [];
    for (;;) {
      clock += 10 * 60_000;
      tend();
      const com = st.nextCustomer();
      if (!com) break;
      if (com.type === 'complaint') {
        const r = st.resolveComplaint(com.certified ? 'certificate' : 'refund');
        if (r.outcome !== 'caught') refunds += r.amount || 0;
        continue;
      }
      const plan = humanise(com.reference, profile.skill, rng);
      if (!plan.ingredients.every((i) => st.stock(i.id) >= i.n * 5)) { st.declineCustomer(); declined++; continue; }
      for (const ing of plan.ingredients) st.consume(ing.id, ing.n * 5);
      const cap = st.cap;
      const sim = new Simulation({ size: cap.size, lookup: st.lookup });
      Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
      st.newBatch();
      runPlanHeadless(sim, plan, st.lookup);
      // test on creatures that show what the request is about
      const wanted = new Set(com.requirements.map((r) => r.key));
      /** @type {Record<string, number[]>} */
      const seen = {};
      for (const c of CREATURES) {
        if (!st.creatureAvailable(c.id) || !c.shows.some((k) => wanted.has(k))) continue;
        if (!st.lab.creatures[c.id].alive && !st.replaceCreature(c.id).ok) continue;
        const sel = tapSelection(sim, 2);
        if (sel.length < 2 || sim.p.count - 2 < com.bottleN * 0.9) break;
        const dose = measureParticles(sim, sel);
        for (const i of sel.sort((a, b) => b - a)) sim.removeParticle(i);
        try {
          const { record } = st.recordTrial(c.id, dose, { ml: 10, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, now: clock });
          for (const [k, v] of Object.entries(record.levels)) (seen[k] ||= []).push(v);
          tests++;
        } catch { /* a dead creature */ }
      }
      // the Potion ID: what the creatures showed, the paper blend for the rest
      const paper = blendOf(plan.ingredients.map((i) => ({ id: i.id, ml: i.n * 5 })), st.lookup);
      const values = Object.fromEntries(PROP_KEYS.map((k) => [k, seen[k] ? seen[k].reduce((a, b) => a + b, 0) / seen[k].length : paper[PROP_INDEX[k]]]));
      const m = measureParticles(sim, tapSelection(sim, com.bottleN));
      st.vial = { id: 'v', ml: m.ml, m, batchId: st.batch.id, rev: st.batch.rev, label: null, certified: null };
      st.writeId('vial', values);
      if (!st.labelMatches(com)) { st.vial = null; st.declineCustomer(); declined++; continue; }
      if (profile.certify && com.value * 1.25 > st.certifyFee * 2 && st.coins > st.certifyFee * 3) { st.certifyVial(); certified++; }
      if (!st.labelMatches(com)) { st.vial = null; st.declineCustomer(); declined++; continue; }
      // haggle: the careful seller pushes for more, the casual one takes the second offer
      const h = st.beginHaggle();
      let r = ask(h, Math.round(h.offer * (profile.certify ? 1.6 : 1.3)));
      while (r.result === 'counter' && profile.certify) r = ask(h, Math.round((h.lastAsk + r.offer) / 2 + 1));
      if (r.result !== 'deal' && h.state !== 'walked') r = acceptOffer(h);
      if (h.state === 'walked') { st.vial = null; st.declineCustomer(); declined++; continue; }
      st.stats.brews++;
      st.completeSale();
    }
    clock += 60 * 60_000;
    const summary = st.endDay();
    // evening shopping: new beds first, then the cheapest useful equipment, keeping a reserve
    for (;;) {
      const bed = BEDS.find((b) => b.price > 0 && b.rank <= st.rank && !(st.garden.beds[b.id] && st.garden.beds[b.id].owned) && b.price <= st.coins - 60);
      if (bed) { st.plant(bed.id, clock); bought.push('bed:' + bed.id); continue; }
      const options = EQUIPMENT.filter((e) => !st.has(e.id) && e.rank <= st.rank && (!e.requires || e.requires.every((x) => st.has(x))) && e.price <= st.coins - 60)
        .sort((a, b) => a.price - b.price);
      if (!options.length) break;
      st.buyEquipment(options[0].id);
      bought.push(options[0].id);
    }
    days.push({
      day: summary.day, served: summary.served, declined, earned: Math.round(summary.earned), refunds: Math.round(summary.refunds), spent: Math.round(summary.spent),
      coins: Math.round(st.coins), reputation: st.reputation, rank: RANKS[st.rank].name, bought,
    });
  }
  const outcome = { kept: 0, refunded: 0, caught: 0, pending: 0 };
  for (const s of st.sales) { if (s.resolved === 'refunded') outcome.refunded++; else if (s.resolved === 'caught') outcome.caught++; else if (s.complaint) outcome.pending++; else outcome.kept++; }
  return { seed, profile: profile.name, skill: profile.skill, wallSeconds: +((Date.now() - t0) / 1000).toFixed(1), days, final: { coins: Math.round(st.coins), reputation: st.reputation, rank: RANKS[st.rank].name, equipment: st.equipment.length, beds: Object.keys(st.garden.beds).length, served: st.stats.served, declined: st.stats.declined, harvestedMl: harvested, tests, certified, sales: outcome } };
}

const runs = [];
for (const profile of PROFILES) {
  for (let k = 0; k < SEEDS; k++) {
    const run = playRun(`playtest-${k}`, profile);
    runs.push(run);
    const f = run.final;
    console.log(`\n${run.seed} · ${profile.name} (skill ${profile.skill}) — ${run.wallSeconds}s · harvested ${f.harvestedMl} ml · ${f.tests} tests · ${f.certified} certified · sales kept ${f.sales.kept}, refunded ${f.sales.refunded}, bluffs caught ${f.sales.caught}`);
    console.log('  day  served  earned  refunds  spent  coins  rep  rank         bought');
    for (const d of run.days) {
      console.log(`  ${String(d.day).padStart(3)}  ${String(d.served).padStart(3)}${d.declined ? `(-${d.declined})` : '    '}  ${String(d.earned).padStart(6)}  ${String(d.refunds).padStart(7)}  ${String(d.spent).padStart(5)}  ${String(d.coins).padStart(5)}  ${String(d.reputation).padStart(3)}  ${d.rank.padEnd(11)}  ${d.bought.join(', ')}`);
    }
  }
}
const file = path.join(ROOT, 'docs', 'playtest-results.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify({ date: new Date().toISOString(), days: DAYS, runs }, null, 2) + '\n');
console.log('\nWrote docs/playtest-results.json');
