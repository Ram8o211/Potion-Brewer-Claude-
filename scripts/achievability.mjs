// Brews generated commissions' hidden reference plans in the real simulation
// (with the equipment a player of that rank would own) and reports the
// quality the counter would award. This is the feasibility simulation: every
// commission must be brewable with what the player has.
// Usage: node scripts/achievability.mjs [perTier] [seedPrefix] [request]
import { generateCommission } from '../src/game/commissions.js';
import { EQUIPMENT, RANKS } from '../src/game/equipment.js';
import { Simulation } from '../src/simulation/world.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { evaluatePotion } from '../src/game/evaluate.js';
import { GameState } from '../src/game/state.js';
import { Rng } from '../src/core/rng.js';

const perTier = Number(process.argv[2] || 4);
const prefix = process.argv[3] || 'ach';
const only = process.argv[4];

/**
 * A shop of a given rank that owns everything that rank may buy.
 * @param {string} seed @param {number} rank
 */
export function shopAtRank(seed, rank) {
  const st = GameState.create(seed, { tutorial: false });
  st.reputation = RANKS[rank].rep;
  st.equipment = EQUIPMENT.filter((e) => e.rank <= rank && e.category !== 'vessel').map((e) => e.id).concat(['pot']);
  return st;
}

const results = [];
let failed = 0;
for (let tier = 0; tier < 5; tier++) {
  for (let k = 0; k < perTier; k++) {
    const seed = `${prefix}${tier}-${k}`;
    const st = shopAtRank(seed, tier);
    const ctx = st.commissionContext();
    const com = generateCommission(ctx, new Rng(seed + 'c'), { tier, request: only });
    if (!com) { console.log(`tier ${tier} no commission`); continue; }
    const cap = st.cap;
    const sim = new Simulation({ size: cap.size, lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
    Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
    const t0 = Date.now();
    const ab = runPlanHeadless(sim, com.reference, st.lookup);
    const m = measureParticles(sim, tapSelection(sim, com.bottleN));
    const ev = evaluatePotion(com, m);
    const fails = ev.rows.filter((r) => r.score < 0.999).map((r) => `${r.req.key}:${r.score.toFixed(2)}(${r.text} vs ${r.req.label})`);
    results.push(ev.quality);
    if (ev.quality < 0.8) failed++;
    console.log(`tier ${tier} ${com.style.padEnd(11)} ${com.activation ? 'AWAKEN' : '      '} q=${ev.quality.toFixed(2)} ${ab.failed ? 'STOPPED ' : ''}${((Date.now() - t0) / 1000).toFixed(1)}s ${fails.join(' ')}`);
  }
}
const mean = results.reduce((a, b) => a + b, 0) / Math.max(1, results.length);
console.log(`${results.length} brewed · mean quality ${mean.toFixed(3)} · min ${Math.min(...results).toFixed(2)} · below 0.8: ${failed}`);
