// Brews generated requests' hidden reference plans in the real simulation and
// reports whether the result lands inside every range the customer set.
// Usage: node scripts/achievability.mjs [count] [seedPrefix] [super]
import { generateWorld, makeLookup } from '../src/materials/generator.js';
import { generateCommission, meets, failures, reqText } from '../src/game/commissions.js';
import { capabilities, EQUIPMENT } from '../src/game/equipment.js';
import { Simulation } from '../src/simulation/world.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { Rng } from '../src/core/rng.js';

const count = Number(process.argv[2] || 12);
const prefix = process.argv[3] || 'ach';
const superOnly = process.argv[4] === 'super';
let ok = 0, made = 0;
for (let k = 0; k < count; k++) {
  const world = generateWorld(prefix + k);
  const lookup = makeLookup(world);
  const cap = capabilities(EQUIPMENT.map((e) => e.id));
  cap.size = 'pot';
  const ctx = { world, lookup, available: new Set(world.ingredients), cap, rank: 4 };
  const tier = k % 5;
  const com = generateCommission(ctx, new Rng(prefix + 'c' + k), { tier, super: superOnly });
  if (!com) { console.log('no request'); continue; }
  made++;
  const sim = new Simulation({ size: cap.size, lookup });
  Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
  const t0 = Date.now();
  const ab = runPlanHeadless(sim, com.reference, lookup);
  const m = measureParticles(sim, tapSelection(sim, com.bottleN));
  const good = meets(com, m.magic);
  if (good) ok++;
  console.log(`tier ${tier} ${com.super ? 'super ' : ''}${com.potionName.padEnd(18)} ${com.requirements.map((r) => r.key + reqText(r)).join(' ').padEnd(60)} got ${m.magic.map(Math.round).join(',')} ${good ? 'OK' : 'MISS ' + JSON.stringify(failures(com, m.magic))} ${((Date.now() - t0) / 1000).toFixed(1)}s${ab.failed ? ' (stopped)' : ''}`);
}
console.log(`${ok} of ${made} requests brewed inside every range`);
