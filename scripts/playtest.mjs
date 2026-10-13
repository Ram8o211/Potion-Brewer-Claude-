// Automated balancing playthrough. A simulated shopkeeper plays the real
// game rules for several days: buys what each order needs, brews it in the
// real physics simulation (following the order's hidden reference plan with
// skill-dependent mistakes: wrong amounts, wrong serving temperature),
// bottles, sells, and buys equipment upgrades. Reports the economy and
// progression curve. 'spent' per day covers reagents bought during the day
// plus upgrades bought the evening before.
//
//   node scripts/playtest.mjs [days=12] [seeds=3]
// Results: docs/playtest-results.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameState } from '../src/game/state.js';
import { EQUIPMENT, RANKS } from '../src/game/equipment.js';
import { Simulation } from '../src/simulation/world.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { evaluatePotion } from '../src/game/evaluate.js';
import { Rng } from '../src/core/rng.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DAYS = Number(process.argv[2] || 12);
const SEEDS = Number(process.argv[3] || 3);
const PROFILES = [
  { name: 'careful', skill: 0.95 },
  { name: 'casual', skill: 0.7 },
];

/** Apply a player's imprecision to a reference plan. */
function humanise(plan, skill, rng) {
  const err = 1 - skill;
  return {
    ...plan,
    ingredients: plan.ingredients.map((i) => ({ ...i, n: Math.max(1, Math.round(i.n * (1 + rng.range(-0.45, 0.45) * err))) })),
    serveTemp: (plan.serveTemp ?? 20) + rng.range(-18, 18) * err,
    hold: plan.hold ? Math.max(0, plan.hold * (1 - rng.range(0, 0.8) * err)) : plan.hold,
  };
}

function playRun(seed, profile) {
  const st = GameState.create(seed, { tutorial: false });
  const rng = new Rng(`${seed}:${profile.name}`);
  const days = [];
  const t0 = Date.now();
  for (let d = 0; d < DAYS; d++) {
    const qualities = [];
    let declined = 0;
    const bought = [];
    let relief = 0;
    for (;;) {
      const com = st.nextCustomer();
      if (!com) break;
      const plan = humanise(com.reference, profile.skill, rng);
      // buy what is missing
      let ok = true;
      for (const ing of plan.ingredients) {
        const need = ing.n * 5 - st.stock(ing.id);
        if (need <= 0) continue;
        let r = st.buy(ing.id, Math.ceil(need / 100) * 100);
        if (!r.ok) { relief += st.claimRelief(); r = st.buy(ing.id, Math.ceil(need / 100) * 100); }
        if (!r.ok) { ok = false; break; }
      }
      if (!ok) { st.declineCustomer(); declined++; continue; }
      for (const ing of plan.ingredients) st.consume(ing.id, ing.n * 5);
      const cap = st.cap;
      const sim = new Simulation({ size: /** @type {'small'|'medium'|'large'} */ (cap.size), lookup: st.lookup, reactions: st.world.reactions });
      Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
      runPlanHeadless(sim, plan, st.lookup);
      const m = measureParticles(sim, tapSelection(sim, com.bottleN));
      const ev = evaluatePotion(com, m);
      qualities.push(ev.quality);
      st.stats.brews++;
      st.completeSale(ev, m);
    }
    const summary = st.endDay();
    // shopping for upgrades: cheapest useful item that leaves a reserve
    for (;;) {
      const options = EQUIPMENT.filter((e) => !st.has(e.id) && e.rank <= st.rank && (!e.requires || e.requires.every((r) => st.has(r))) && e.price <= st.coins - 40)
        .sort((a, b) => a.price - b.price);
      if (!options.length) break;
      st.buyEquipment(options[0].id);
      bought.push(options[0].id);
    }
    days.push({
      day: summary.day, served: summary.served, declined, earned: Math.round(summary.earned), spent: Math.round(summary.spent),
      meanQuality: qualities.length ? +(qualities.reduce((a, b) => a + b, 0) / qualities.length).toFixed(3) : null,
      coins: Math.round(st.coins), reputation: st.reputation, rank: RANKS[st.rank].name, upgrades: bought, relief,
    });
  }
  return { seed, profile: profile.name, skill: profile.skill, wallSeconds: +((Date.now() - t0) / 1000).toFixed(1), days, final: { coins: Math.round(st.coins), reputation: st.reputation, rank: RANKS[st.rank].name, equipment: st.equipment.length, served: st.stats.served, perfect: st.stats.perfect, declined: st.stats.declined } };
}

const runs = [];
for (const profile of PROFILES) {
  for (let k = 0; k < SEEDS; k++) {
    const run = playRun(`playtest-${k}`, profile);
    runs.push(run);
    console.log(`\n${run.seed} · ${profile.name} (skill ${profile.skill}) — ${run.wallSeconds}s`);
    console.log('  day  served  q̄     earned  spent  coins  rep  rank         upgrades');
    for (const d of run.days) {
      console.log(`  ${String(d.day).padStart(3)}  ${String(d.served).padStart(3)}${d.declined ? `(-${d.declined})` : '    '}  ${d.meanQuality === null ? '  –  ' : d.meanQuality.toFixed(2)}  ${String(d.earned).padStart(6)}  ${String(d.spent).padStart(5)}  ${String(d.coins).padStart(5)}  ${String(d.reputation).padStart(3)}  ${d.rank.padEnd(11)}  ${d.upgrades.join(', ')}${d.relief ? ` (stipend ${d.relief})` : ''}`);
    }
  }
}
const file = path.join(ROOT, 'docs', 'playtest-results.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify({ date: new Date().toISOString(), days: DAYS, runs }, null, 2) + '\n');
console.log('\nWrote docs/playtest-results.json');
