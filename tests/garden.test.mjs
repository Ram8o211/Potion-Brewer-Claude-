// The personal garden: seed drops by rarity, seeds that keep their species
// and form, plots by bed and grade, watering, growth through saved time,
// harvests that consume the crop, no duplication.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { createGarden, rollSeed, giveSeed, plant, waterPlots, cropState, harvestPlot, upgrade, seedId, normalizeGarden, OFFLINE_CAP_MS, growHours, gradeNeeded } from '../src/game/garden.js';
import { RARITIES, seedChance } from '../src/materials/rarity.js';
import { SPECIES, materialIdOf } from '../src/materials/catalog.js';

const H = 3600000;

test('seed drops follow rarity, and Arcane forms drop less', () => {
  for (const r of RARITIES) {
    const sp = SPECIES.find((s) => s.rarity === r.id);
    for (const arcane of [false, true]) {
      const g = createGarden();
      let n = 0;
      const N = 4000;
      for (let k = 0; k < N; k++) if (rollSeed(g, 'drops', sp.key, arcane)) n++;
      const want = seedChance(r.id, arcane);
      assert.ok(Math.abs(n / N - want) < Math.max(0.02, want * 0.35), `${r.id}${arcane ? ' Arcane' : ''}: ${(n / N).toFixed(3)} vs ${want}`);
      assert.equal(g.rolls, N, 'every roll advances the saved counter');
      if (n) assert.equal(g.seeds[seedId(sp.key, arcane)], n, 'the seed is of the species and form harvested');
    }
  }
  assert.deepEqual(RARITIES.map((r) => r.seedDrop), [0.35, 0.22, 0.1, 0.04, 0.01]);
});

test('a seed grows its own species and form; nothing changes its rarity or magic', () => {
  const st = GameState.create('garden-1', { tutorial: false });
  const t0 = Date.now();
  st.garden.plots.push({ id: 'g1', bed: 'soil', grade: 1, crop: null });
  giveSeed(st.garden, 'silverleaf', true);
  assert.equal(plant(st.garden, 'p1', seedId('silverleaf', true), t0).ok, false, 'an Arcane seed needs a greenhouse plot');
  assert.ok(plant(st.garden, 'g1', seedId('silverleaf', true), t0).ok);
  assert.equal(st.garden.seeds[seedId('silverleaf', true)], undefined, 'the seed is used up');
  const later = t0 + OFFLINE_CAP_MS;
  const r = st.harvestGarden('g1', later);
  assert.ok(r.ok, r.reason);
  assert.equal(r.material, materialIdOf('silverleaf', true), 'Arcane Silverleaf grew from it');
  assert.equal(st.lookup(r.material).wild.rarity, 'common');
  assert.ok(st.lookup(r.material).arcane, 'still Arcane');
  assert.equal(st.garden.plots.find((p) => p.id === 'g1').crop, null, 'the harvest consumed the plant');
  assert.equal(st.harvestGarden('g1', later).ok, false, 'nothing left to harvest twice');
});

test('beds and grades: each kind of species needs its bed, rare tiers better plots', () => {
  const g = createGarden();
  const crystal = SPECIES.find((s) => s.bed === 'crystal' && s.rarity === 'common');
  giveSeed(g, crystal.key, false);
  assert.match(plant(g, 'p1', seedId(crystal.key, false)).reason, /mineral bed/);
  assert.equal(upgrade(g, 'plot-crystal', 0).ok, false, 'mineral beds come with rank');
  assert.ok(upgrade(g, 'plot-crystal', 1).ok);
  const bed = g.plots.find((p) => p.bed === 'crystal');
  assert.ok(plant(g, bed.id, seedId(crystal.key, false)).ok);
  const legend = SPECIES.find((s) => s.rarity === 'legendary');
  assert.equal(gradeNeeded(legend.key, false), 2);
  assert.ok(growHours(legend.key, false) > growHours(crystal.key, false), 'rarer species take longer');
});

test('watering speeds growth, the soil dries back, and growth is deterministic and survives a save', () => {
  const t0 = 1_700_000_000_000;
  const dry = createGarden(), wet = createGarden();
  for (const g of [dry, wet]) { giveSeed(g, 'silverleaf', false); plant(g, 'p1', 'silverleaf', t0); }
  assert.equal(waterPlots(wet, 'p1', t0), 1);
  assert.equal(waterPlots(dry, 'p2', t0), 0, 'an empty plot drinks nothing');
  const half = t0 + growHours('silverleaf', false) * H * 0.5;
  const a = cropState(dry.plots[0].crop, dry.can, half), b = cropState(wet.plots[0].crop, wet.can, half);
  assert.ok(b.g > a.g, `watered grows faster (${b.g.toFixed(2)} vs ${a.g.toFixed(2)})`);
  assert.ok(cropState(wet.plots[0].crop, wet.can, t0 + 10 * H).w < 0.4, 'the soil dries back');
  // the same however often it is asked, and the same after a save
  assert.deepEqual(cropState(wet.plots[0].crop, wet.can, half), cropState(wet.plots[0].crop, wet.can, half));
  const back = normalizeGarden(JSON.parse(JSON.stringify(wet)), half);
  assert.deepEqual(cropState(back.plots[0].crop, back.can, half), b);
  // a clock set back grows nothing
  assert.equal(cropState(wet.plots[0].crop, wet.can, t0 - H).g, 0);
  // stages pass in order
  const stages = Array.from({ length: 30 }, (_, k) => k * 0.05).map((f) => cropState(dry.plots[0].crop, dry.can, t0 + f * growHours('silverleaf', false) * H * 2.5).stage);
  assert.deepEqual([...new Set(stages)], ['seed', 'sprout', 'young', 'developing', 'mature']);
});

test('no duplication: a garden harvest drops a seed at half the wilds’ chance, and only once', () => {
  const st = GameState.create('garden-dup', { tutorial: false });
  let seeds = 0, crops = 0;
  const t0 = Date.now();
  for (let k = 0; k < 300; k++) {
    giveSeed(st.garden, 'silverleaf', false);
    assert.ok(plant(st.garden, 'p1', 'silverleaf', t0).ok);
    st.inventory[materialIdOf('silverleaf')] = 0;
    const r = harvestPlot(st.garden, 'p1', { inventory: st.inventory, cap: st.cap, seed: st.seed }, t0 + OFFLINE_CAP_MS);
    assert.ok(r.ok);
    crops++;
    if (r.seed) { seeds++; st.garden.seeds.silverleaf--; }
  }
  assert.ok(seeds / crops < seedChance('common', false) * 0.75, `a crop gives back fewer than one seed (${seeds}/${crops})`);
});

test('the tutorial’s first seed grows in minutes', () => {
  const st = GameState.create('garden-tut', { tutorial: true });
  st.tutorial.active = true;
  giveSeed(st.garden, 'silverleaf', false);
  const t0 = Date.now();
  assert.ok(st.sow('p1', 'silverleaf', t0).ok);
  st.waterGarden('p1', t0);
  const s = cropState(st.garden.plots[0].crop, st.garden.can, t0 + 2 * 60000);
  assert.equal(s.stage, 'mature');
});
