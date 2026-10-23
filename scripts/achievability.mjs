// Brews generated commissions' hidden reference plans in the real simulation
// and reports the quality the counter would award, per tier and per
// technique. This is the feasibility simulation: every commission must be
// brewable with what the player really has.
//
// Shops are *realistic*: a shop of a rank owns the starting kit plus the
// equipment a player of that rank typically has bought by then (REALISTIC),
// holds a modest purse and the starting shelf — not every upgrade its rank
// allows. `full` shops (every item of the rank) are brewed too for
// comparison. Commissions are generated with the state's own context, so
// they respect what can be gathered today and legally bought.
//
// Usage: node scripts/achievability.mjs [perCell=2] [seedPrefix=ach] [out]
//   out: a file to write the results to (JSON), e.g. docs/achievability-results.json
import fs from 'node:fs';
import { generateCommission, TECHNIQUES } from '../src/game/commissions.js';
import { EQUIPMENT, RANKS } from '../src/game/equipment.js';
import { Simulation } from '../src/simulation/world.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { evaluatePotion } from '../src/game/evaluate.js';
import { GameState } from '../src/game/state.js';
import { Rng } from '../src/core/rng.js';

/** Equipment a typical player owns by each rank (cumulative), beyond the starting kit. */
export const REALISTIC = [
  ['kit', 'rack1'],
  ['kennel', 'frostrune', 'satchel'],
  ['arcanometer', 'rack2', 'stirrer'],
  ['copper', 'charter'],
  ['homunculus', 'glacial'],
];

/**
 * A shop of a given rank.
 * @param {string} seed @param {number} rank @param {'realistic'|'full'} kind
 */
export function shopAtRank(seed, rank, kind = 'realistic') {
  const st = GameState.create(seed, { tutorial: false });
  st.reputation = RANKS[rank].rep;
  if (kind === 'full') st.equipment = EQUIPMENT.filter((e) => e.rank <= rank && e.category !== 'vessel').map((e) => e.id).concat(['pot']);
  else for (let r = 0; r <= rank; r++) for (const id of REALISTIC[r]) if (!st.equipment.includes(id)) st.equipment.push(id);
  st.coins = 60 + 120 * rank;
  return st;
}

/** Brew a commission's reference plan in the real simulation and score it. */
export function brewReference(st, com) {
  const cap = st.cap;
  const sim = new Simulation({ size: cap.size, lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
  Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
  const ab = runPlanHeadless(sim, com.reference, st.lookup);
  const m = measureParticles(sim, tapSelection(sim, com.bottleN));
  return { ab, m, ev: evaluatePotion(com, m) };
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop() || '');
if (isMain) {
  const per = Number(process.argv[2] || 2);
  const prefix = process.argv[3] || 'ach';
  const out = process.argv[4];
  const rows = [];
  const cells = [{ tech: null }, ...TECHNIQUES.map((t) => ({ tech: t.id }))];
  for (const kind of /** @type {const} */ (['realistic', 'full'])) {
    for (let tier = 0; tier < 5; tier++) {
      for (const cell of cells) {
        const t = cell.tech ? TECHNIQUES.find((x) => x.id === cell.tech) : null;
        if (t && t.minTier > tier) continue;
        if (kind === 'full' && cell.tech) continue;
        for (let k = 0; k < per; k++) {
          const seed = `${prefix}${tier}-${cell.tech || 'plain'}-${k}`;
          const st = shopAtRank(seed, tier, kind);
          const com = generateCommission(st.commissionContext(), new Rng(seed + 'c'), { tier, techniques: cell.tech ? [cell.tech] : [] });
          if (!com) { rows.push({ kind, tier, tech: cell.tech, generated: false }); console.log(`${kind} tier ${tier} ${cell.tech || 'plain'}: no commission`); continue; }
          if (cell.tech && !com.techniques.includes(cell.tech)) { rows.push({ kind, tier, tech: cell.tech, generated: false }); console.log(`${kind} tier ${tier} ${cell.tech}: technique not applicable`); continue; }
          const t0 = Date.now();
          const { ab, ev } = brewReference(st, com);
          const fails = ev.rows.filter((r) => r.score < 0.999).map((r) => `${r.req.key}:${r.score.toFixed(2)}(${r.text} vs ${r.req.label})`);
          rows.push({ kind, tier, tech: cell.tech, style: com.style, generated: true, quality: +ev.quality.toFixed(3), stopped: ab.failed, fails, seconds: +((Date.now() - t0) / 1000).toFixed(1) });
          console.log(`${kind} tier ${tier} ${com.style.padEnd(28)} ${com.activation ? 'AWAKEN' : '      '} q=${ev.quality.toFixed(2)} ${ab.failed ? 'STOPPED ' : ''}${((Date.now() - t0) / 1000).toFixed(1)}s ${fails.join(' ')}`);
        }
      }
    }
  }
  const brewed = rows.filter((r) => r.generated);
  const mean = brewed.reduce((a, r) => a + r.quality, 0) / Math.max(1, brewed.length);
  /** @type {Record<string, {n:number, pass:number, generated:number, tried:number}>} */
  const byTech = {};
  for (const r of rows) {
    const k = r.tech || 'plain';
    const b = (byTech[k] ||= { n: 0, pass: 0, generated: 0, tried: 0 });
    b.tried++;
    if (!r.generated) continue;
    b.generated++; b.n++;
    if (r.quality >= 0.85) b.pass++;
  }
  console.log(`\n${brewed.length} brewed · mean quality ${mean.toFixed(3)} · min ${Math.min(...brewed.map((r) => r.quality)).toFixed(2)} · below 0.85: ${brewed.filter((r) => r.quality < 0.85).length}`);
  for (const [k, b] of Object.entries(byTech)) console.log(`  ${k.padEnd(12)} generated ${b.generated}/${b.tried} · passed ${b.pass}/${b.n}`);
  if (out) fs.writeFileSync(out, JSON.stringify({ date: new Date().toISOString(), per, rows, byTech, mean }, null, 2) + '\n');
}
