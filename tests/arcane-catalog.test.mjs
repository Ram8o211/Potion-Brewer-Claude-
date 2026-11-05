// The revised arcane rule (spec §5.3): only Arcane ingredients awaken, and
// only the effects they carry; mixtures use the composition-weighted
// threshold of their Arcane parts alone; cold thresholds awaken by chilling;
// activation persists. Measured in the real simulation with catalog species.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Simulation } from '../src/simulation/world.js';
import { generateWorld, makeLookup } from '../src/materials/generator.js';
import { blendThreshold, thresholdToCelsius, awakenedId, isMagical, isAwakenedId } from '../src/alchemy/arcane.js';
import { MAX_SPECIES } from '../src/reactions/species.js';
import { SPECIES, materialIdOf } from '../src/materials/catalog.js';
import { snapshotSim, restoreSim } from '../src/simulation/snapshot.js';

const world = generateWorld('arcane-catalog-1');
const lookup = makeLookup(world);
const R = world.roles;
const sim = () => new Simulation({ size: 'small', lookup, reactions: world.reactions, laws: [] });
function pour(s, id, n) { s.emitter.start(lookup(id), { x: 0, amount: n }); let g = 0; while (s.emitter.pouring && g++ < 20000) s.step(); }
function run(s, sec) { for (let k = 0; k < Math.round(sec * 120); k++) s.step(); }
function stir(s, sec) {
  const t = s.tool; t.type = 'spoon';
  for (let k = 0; k < Math.round(sec * 120); k++) { const a = (k / 120) * 2.6; t.setTarget(Math.cos(a) * 0.9, 2.6 + Math.sin(a) * 0.35, true); s.advance(1 / 120, 1, 2); }
  t.setTarget(0, 2.6, false);
}
function crush(s) { const p = s.p; for (let i = 0; i < p.count; i++) if (p.phase[i] === 3) { p.phase[i] = 1; } }
function holdAt(s, T, sec) {
  for (let k = 0; k < Math.round(sec * 120); k++) {
    let t = 0; for (let i = 0; i < s.p.count; i++) t += s.p.temp[i];
    t /= Math.max(1, s.p.count);
    s.furnace.setting = Math.max(-1, Math.min(1, (T - t) * 0.08));
    s.step();
  }
  s.furnace.setting = 0;
}
const awakeIds = (s) => [...s.species.slotOf.keys()].filter((id) => isAwakenedId(id) && amountOf(s, id) > 0.01);
function amountOf(s, id) { const slot = s.species.slotOf.get(id); if (slot === undefined) return 0; let t = 0; for (let i = 0; i < s.p.count; i++) t += s.p.comp[i * MAX_SPECIES + slot]; return t; }

const hot = SPECIES.find((s) => s.arcane.thr > 0 && s.arcane.thr <= 450 && s.morph === 'flower');
const cold = SPECIES.find((s) => s.arcane.thr < 0 && s.arcane.thr >= -150);

test('an ordinary specimen never awakens, however hot it gets; its Arcane form does', () => {
  const ord = lookup(materialIdOf(hot.key)), arc = lookup(materialIdOf(hot.key, true));
  assert.equal(isMagical(ord), false, 'the ordinary form carries no threshold');
  assert.equal(isMagical(arc), true);
  assert.deepEqual(ord.effects, arc.effects, 'both forms carry the same magic');
  const Ta = thresholdToCelsius(arc.arcane.thr);
  for (const [id, wake] of [[ord.id, false], [arc.id, true]]) {
    const s = sim();
    pour(s, R.water, 40);
    pour(s, id, 10);
    crush(s);
    stir(s, 3);
    holdAt(s, Ta + 12, 25);
    assert.equal(awakeIds(s).length > 0, wake, `${lookup(id).name} ${wake ? 'awakens' : 'stays dormant'} at ${Math.round(Ta + 12)} °C`);
  }
});

test('awakening amplifies only the effects the Arcane ingredient carries', () => {
  for (const sp of SPECIES.slice(0, 40)) {
    const arc = lookup(materialIdOf(sp.key, true)), aw = lookup(awakenedId(arc.id));
    assert.ok(aw && aw.awakened, `${arc.name} has an awakened form`);
    assert.deepEqual(Object.keys(aw.effects).sort(), Object.keys(arc.effects).filter((k) => arc.effects[k]).sort(), `${arc.name}: no new effect appears`);
    for (const [k, v] of Object.entries(arc.effects)) assert.ok(Math.abs(aw.effects[k]) >= Math.abs(v) * 1.5 || Math.abs(aw.effects[k]) === 100, `${arc.name}: ${k} grows`);
  }
});

test('in a mixture the threshold is weighted over the Arcane parts alone; ordinary parts never count', () => {
  const a = lookup(materialIdOf(hot.key, true)), b = lookup(materialIdOf(cold.key, true)), plain = lookup(materialIdOf('silverleaf'));
  const t = blendThreshold([{ id: a.id, ml: 20 }, { id: b.id, ml: 10 }, { id: plain.id, ml: 500 }], lookup);
  assert.ok(Math.abs(/** @type {number} */ (t) - (a.arcane.thr * 20 + b.arcane.thr * 10) / 30) < 1e-6, 'the plain leaf adds no weight however much of it there is');
  assert.equal(blendThreshold([{ id: plain.id, ml: 100 }], lookup), null, 'a brew of ordinary ingredients has nothing to awaken');
  // in the real cauldron: the plain herb's effects are never amplified by its Arcane neighbour's awakening
  const s = sim();
  pour(s, R.water, 40);
  pour(s, plain.id, 10);
  pour(s, a.id, 6);
  crush(s);
  stir(s, 4);
  holdAt(s, thresholdToCelsius(/** @type {number} */ (blendThreshold([{ id: a.id, ml: 1 }], lookup))) + 12, 30);
  const awake = awakeIds(s);
  assert.ok(awake.length > 0, 'the Arcane part awoke');
  assert.ok(awake.every((id) => id.startsWith('wild-sp-' + hot.key) || id.startsWith('wild-p-sp-' + hot.key)), `only the Arcane species (and its extract) awoke: ${awake.join(', ')}`);
});

test('a cold threshold awakens by chilling, and the awakening persists through warming and a save', () => {
  const arc = lookup(materialIdOf(cold.key, true)), Ta = thresholdToCelsius(arc.arcane.thr);
  assert.ok(Ta < 20, `${arc.name} wakes in the cold (${Ta} °C)`);
  const s = sim();
  // (a shop with the frost rune: its cold reaches well below freezing)
  Object.assign(s.furnace, { minCool: -40, coolPower: 3 });
  pour(s, R.water, 40);
  pour(s, arc.id, 10);
  crush(s);
  stir(s, 3);
  holdAt(s, Ta - 8, 60);
  assert.ok(awakeIds(s).length > 0, 'chilled past its threshold, it awoke');
  holdAt(s, 40, 20);
  assert.ok(awakeIds(s).length > 0, 'warmed again, it stays awake');
  const back = restoreSim(snapshotSim(s, 'small'), { lookup, reactions: world.reactions });
  assert.ok(awakeIds(back).length > 0, 'and after a save');
});
