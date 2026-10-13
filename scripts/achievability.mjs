// Brews generated commissions' reference plans in the real simulation and
// reports the resulting quality. Usage: node scripts/achievability.mjs [count] [seedPrefix]
import { generateWorld, makeLookup } from '../src/materials/generator.js';
import { generateCommission } from '../src/game/commissions.js';
import { capabilities, EQUIPMENT } from '../src/game/equipment.js';
import { Simulation } from '../src/simulation/world.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { evaluatePotion } from '../src/game/evaluate.js';
import { Rng } from '../src/core/rng.js';

const count = Number(process.argv[2] || 12);
const prefix = process.argv[3] || 'ach';
const onlyStyle = process.argv[4];
const results = [];
for (let k = 0; k < count; k++) {
  const world = generateWorld(prefix + k);
  const lookup = makeLookup(world);
  const cap = capabilities(EQUIPMENT.map((e) => e.id));
  cap.size = 'small';
  const ctx = { world, lookup, available: new Set(world.ingredients), cap, rank: 4, priceOf: (id) => lookup(id).price || 1 };
  const rng = new Rng(prefix + 'c' + k);
  const tier = k % 5;
  const com = generateCommission(ctx, rng, { tier, style: onlyStyle });
  if (!com) { console.log('no commission'); continue; }
  const sim = new Simulation({ size: 'small', lookup, reactions: world.reactions });
  Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
  const t0 = Date.now();
  const ab = runPlanHeadless(sim, com.reference, lookup);
  const sel = tapSelection(sim, com.bottleN);
  const m = measureParticles(sim, sel);
  const ev = evaluatePotion(com, m);
  const fails = ev.rows.filter((r) => r.score < 0.999).map((r) => `${r.req.key}:${r.score.toFixed(2)}(${r.text} vs ${r.req.label})`);
  results.push(ev.quality);
  console.log(`tier ${tier} ${com.style.padEnd(8)} q=${ev.quality.toFixed(2)} stars=${ev.stars} ${ab.failed ? 'FAILED ' : ''}${((Date.now() - t0) / 1000).toFixed(1)}s ${fails.join(' ')}`);
}
const mean = results.reduce((a, b) => a + b, 0) / results.length;
console.log('mean quality', mean.toFixed(3), 'min', Math.min(...results).toFixed(2));
