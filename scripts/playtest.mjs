// Realistic balancing playthrough. Automated shopkeepers of five kinds
// (scripts/lib/player.mjs) play the real loop for several shop days on
// several worlds: gather or legally buy → formulate from public knowledge →
// brew in the real simulation → test on their own rabbits → interpret and
// adjust → bottle → label → bargain and sell through the commerce code →
// settle the next day's verdicts → buy equipment → progress. None of them
// ever reads an order's hidden reference plan, and the market refuses them
// exactly what it refuses a player.
//
//   node scripts/playtest.mjs [days=8] [seeds=3] [profiles=all]
// Results: docs/playtest-results.json (and a summary on stdout)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameState } from '../src/game/state.js';
import { EQUIPMENT, RANKS } from '../src/game/equipment.js';
import { Rng } from '../src/core/rng.js';
import { PROFILES, newMetrics, serveOrder, evening } from './lib/player.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DAYS = Number(process.argv[2] || 8);
const SEEDS = Number(process.argv[3] || 3);
const ONLY = process.argv[4] ? process.argv[4].split(',') : Object.keys(PROFILES);

/** @param {number[]} a */
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const r2 = (v) => (v === null ? null : Math.round(v * 100) / 100);

function playRun(seed, prof) {
  const t0 = Date.now();
  const st = GameState.create(seed, { tutorial: false });
  const rng = new Rng(`${seed}:${prof.name}`);
  const met = newMetrics();
  // simulated wall clock (deposits regrow with it): a shop day takes about half an hour
  const clock = { t: 1_700_000_000_000 };
  for (let d = 0; d < DAYS; d++) {
    const day = { day: st.day, sold: 0, refused: 0, abandoned: 0, coins0: st.coins, rep0: st.reputation };
    for (let guard = 0; guard < 12; guard++) {
      const com = st.nextCustomer();
      if (!com) break;
      clock.t += 6 * 60_000;
      const out = serveOrder(st, prof, rng, clock, met);
      if (process.env.PLAYTEST_DEBUG) console.log(`  day ${st.day} ${prof.name} ${com.style} tier ${com.tier} → ${out}`);
      if (out === 'sold') day.sold++;
      else { if (out === 'refused') day.refused++; else day.abandoned++; met.declined++; st.declineCustomer(); }
    }
    if (!st.dayOver) met.noCustomer++;
    clock.t += 20 * 60_000;
    st.claimRelief();
    const sum = st.endDay();
    evening(st, prof, met);
    met.perDay.push({ ...day, earned: Math.round(sum.earned), spent: Math.round(sum.spent), coins: Math.round(st.coins), reputation: st.reputation, rank: RANKS[st.rank].name });
  }
  met.wallSeconds = Math.round((Date.now() - t0) / 100) / 10;
  return {
    seed, profile: prof.name, wallSeconds: met.wallSeconds,
    final: { coins: Math.round(st.coins), reputation: st.reputation, rank: RANKS[st.rank].name, equipment: Object.keys(met.equipment), lawsFound: st.knownLaws.length, livingRabbits: st.colony.rabbits.filter((r) => r.alive).length, recipes: st.recipes.length, journal: Object.keys(st.journal).length },
    metrics: { ...met, quality: undefined, meanQuality: r2(mean(met.quality)), lowQuality: met.quality.filter((q) => q < 0.6).length, theoryError: r2(mean(met.theoryError)), meanUncAtSale: r2(mean(met.uncAtSale)), uncAtSale: undefined },
  };
}

const runs = [];
for (const key of ONLY) {
  const prof = PROFILES[key];
  for (let k = 0; k < SEEDS; k++) {
    const run = playRun(`playtest-${k}`, prof);
    runs.push(run);
    const m = run.metrics;
    console.log(`${run.seed} · ${prof.name.padEnd(11)} ${String(run.wallSeconds).padStart(5)}s  sold ${m.sold}/${m.orders}  q̄ ${m.meanQuality}  abandoned ${m.abandoned}  trials ${m.trials}  deaths ${m.rabbitDeaths}  gathered ${m.gatheredMl} ml  bought ${Math.round(m.boughtCoins)}c  coins ${run.final.coins}  rep ${run.final.reputation} (${run.final.rank})  praise/complaints ${m.praise}/${m.complaints}  shelf sales ${m.shelfSales}  recipe reuse ${m.recipeReuse}`);
  }
}

// ---- the questions the balancing asks
/** @type {Record<string, any>} */
const summary = {};
for (const key of ONLY) {
  const rs = runs.filter((r) => r.profile === key);
  const sum = (f) => rs.reduce((a, r) => a + f(r), 0);
  summary[key] = {
    completion: r2(sum((r) => r.metrics.sold) / Math.max(1, sum((r) => r.metrics.orders))),
    meanQuality: r2(mean(rs.map((r) => r.metrics.meanQuality).filter((v) => v !== null))),
    abandoned: sum((r) => r.metrics.abandoned), shortages: sum((r) => r.metrics.shortages), failedBrews: sum((r) => r.metrics.failedBrews),
    trialsPerOrder: r2(sum((r) => r.metrics.trials) / Math.max(1, sum((r) => r.metrics.orders))), rabbitDeaths: sum((r) => r.metrics.rabbitDeaths),
    meanUncAtSale: r2(mean(rs.map((r) => r.metrics.meanUncAtSale).filter((v) => v !== null))), theoryError: r2(mean(rs.map((r) => r.metrics.theoryError).filter((v) => v !== null))),
    gatheredMlPerDay: Math.round(sum((r) => r.metrics.gatheredMl) / (rs.length * DAYS)), boughtCoinsPerDay: r2(sum((r) => r.metrics.boughtCoins) / (rs.length * DAYS)),
    praise: sum((r) => r.metrics.praise), complaints: sum((r) => r.metrics.complaints), legitComplaints: sum((r) => r.metrics.legitComplaints),
    finalCoins: Math.round(mean(rs.map((r) => r.final.coins))), finalReputation: Math.round(mean(rs.map((r) => r.final.reputation))), ranks: rs.map((r) => r.final.rank),
    shelfSales: sum((r) => r.metrics.shelfSales), recipeReuse: sum((r) => r.metrics.recipeReuse), homunculus: sum((r) => r.metrics.homunculus),
  };
}
// technique and process variety, equipment bought vs used, dominant orders
const agg = (field) => { const o = {}; for (const r of runs) for (const [k, v] of Object.entries(r.metrics[field])) o[k] = (o[k] || 0) + v; return o; };
const styles = agg('styles');
const totalSold = Object.values(styles).reduce((a, b) => a + b, 0);
const dominant = Object.entries(styles).sort((a, b) => b[1] - a[1])[0] || ['', 0];
const bought = {};
for (const r of runs) for (const id of r.final.equipment) bought[id] = (bought[id] || 0) + 1;
const used = agg('used');
const neverUsed = Object.keys(bought).filter((id) => !used[id] && !['trowel', 'rockhammer', 'brush', 'sickle', 'satchel', 'pestle', 'rack1', 'rack2', 'rack3', 'kennel', 'warren', 'bellows', 'athanor', 'frostrune', 'glacial', 'copper', 'grand', 'charter', 'still', 'lens', 'thermal', 'shelf1', 'shelf2'].includes(id));
const report = {
  date: new Date().toISOString(), days: DAYS, seeds: SEEDS, summary,
  techniquesSold: agg('techniques'), processesUsed: agg('processes'), styles, dominantOrder: { style: dominant[0], share: r2(dominant[1] / Math.max(1, totalSold)) },
  evidenceAtSale: agg('levelsAtSale'), equipmentBought: bought, equipmentUsed: used, instrumentsBoughtButUnused: neverUsed,
  equipmentNeverBought: EQUIPMENT.map((e) => e.id).filter((id) => !bought[id] && !['hearth', 'basin', 'pot', 'spoon', 'mortar', 'thermometer'].includes(id)),
  runs,
};
console.log('\n' + JSON.stringify({ summary, techniquesSold: report.techniquesSold, processesUsed: report.processesUsed, dominantOrder: report.dominantOrder, evidenceAtSale: report.evidenceAtSale, instrumentsBoughtButUnused: neverUsed, equipmentNeverBought: report.equipmentNeverBought }, null, 1));
const file = path.join(ROOT, 'docs', 'playtest-results.json');
fs.writeFileSync(file, JSON.stringify(report, null, 1) + '\n');
console.log('\nWrote docs/playtest-results.json');
