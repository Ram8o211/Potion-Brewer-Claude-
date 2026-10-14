// The testing room (creatures, readings, harm, the Potion ID) and the garden
// (growth with real time, watering, the well, harvests, planting).
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { Simulation } from '../src/simulation/world.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { CREATURES, CREATURE_BY_ID, DOSE_ML, FAINT, observe, healthNow, idComplete, idError } from '../src/game/testing.js';
import { BEDS, BED_BY_ID, MIN_HARVEST, WATER_COST, MOIST_MS } from '../src/game/garden.js';
import { PROP_KEYS, PROP_INDEX, NP } from '../src/alchemy/magic.js';
import { SIM } from '../src/simulation/constants.js';

const MIN = 60000;

/** A brewed batch in a real cauldron, from a recipe of the shop's own world. */
function brew(st, parts, heatTo = 20) {
  const sim = new Simulation({ size: 'pot', lookup: st.lookup });
  runPlanHeadless(sim, { ingredients: parts.map(([id, n, ground]) => ({ id, n, ground })), heatTo, coolTo: 20, serveTemp: 20, hold: 10, knead: true }, st.lookup);
  return sim;
}

test('every property can be read on at least two creatures, and each creature shows only some', () => {
  for (const key of PROP_KEYS) {
    const who = CREATURES.filter((c) => c.shows.includes(key));
    assert.ok(who.length >= 2, `${key} is shown by ${who.map((c) => c.id)}`);
  }
  for (const c of CREATURES) assert.ok(c.shows.length >= 2 && c.shows.length < NP, `${c.id} shows a subset`);
});

test('readings are honest but imperfect: near the truth, deterministic per trial, faint magic unseen, capped by the cage', () => {
  const truth = new Array(NP).fill(0);
  truth[PROP_INDEX.vitality] = 37; truth[PROP_INDEX.charm] = 2; truth[PROP_INDEX.bane] = 12;
  const toad = CREATURE_BY_ID.toad;
  const errs = [];
  for (let serial = 1; serial <= 50; serial++) {
    const o = observe(toad, truth, serial);
    assert.deepEqual(Object.keys(o.levels).sort(), toad.shows.slice().sort(), 'only what it shows');
    assert.equal(o.levels.charm, 0, `charm ${truth[PROP_INDEX.charm]} is below the faint limit ${FAINT}`);
    errs.push(Math.abs(o.levels.vitality - 37));
    assert.ok(Math.abs(o.levels.vitality - 37) <= 2 + 0.06 * 37 + 0.1);
    assert.deepEqual(observe(toad, truth, serial), o, 'same trial, same reading');
  }
  assert.ok(Math.max(...errs) > 0.5, 'readings wobble between trials');
  truth[PROP_INDEX.levity] = 100;
  assert.ok(observe(CREATURE_BY_ID.moth, truth, 3).levels.levity <= CREATURE_BY_ID.moth.max, 'the moth cannot rise beyond its cage');
});

test('a test uses a real dose from the cauldron tap, records what the creature showed, and Bane hurts', () => {
  const st = GameState.create('testing-1', { tutorial: false });
  st.harvest('well'); st.harvest('dew-a');
  const R = st.world.roles;
  const sim = brew(st, [[R.water, 14], [R.dew, 16]]);
  const before = sim.p.count;
  const sel = tapSelection(sim, DOSE_ML / SIM.ML_PER_PARTICLE);
  const dose = measureParticles(sim, sel);
  for (const i of sel.slice().sort((a, b) => b - a)) sim.removeParticle(i);
  assert.equal(sim.p.count, before - DOSE_ML / SIM.ML_PER_PARTICLE, 'the dose leaves the cauldron');
  const { record, events } = st.recordTrial('toad', dose, { ml: DOSE_ML, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev });
  assert.ok(Math.abs(record.levels.vitality - dose.magic[PROP_INDEX.vitality]) <= 2 + 0.06 * dose.magic[PROP_INDEX.vitality] + 0.1);
  assert.ok(events.some((e) => e.id === 'trial1'));
  assert.equal(st.lab.records[0], record);
  // a strong bane dose hurts the toad, and enough of them kill it
  const bane = new Array(NP).fill(0); bane[PROP_INDEX.bane] = 70;
  const now = Date.now();
  st.recordTrial('toad', { magic: bane }, { ml: DOSE_ML, source: 'cauldron', batchId: 'x', rev: 0, now });
  assert.ok(st.lab.creatures.toad.health < 50);
  st.recordTrial('toad', { magic: bane }, { ml: DOSE_ML, source: 'cauldron', batchId: 'x', rev: 0, now });
  assert.equal(st.lab.creatures.toad.alive, false, 'killed');
  assert.throws(() => st.recordTrial('toad', { magic: bane }, { ml: DOSE_ML, source: 'cauldron', batchId: 'x', rev: 0 }), /replaced/);
  // rest heals a living creature; a dead one must be replaced for coins
  const s = st.lab.creatures.salamander;
  s.health = 40; s.at = now - 10 * MIN;
  assert.ok(healthNow(s, now) > 55);
  const coins = st.coins;
  assert.ok(st.replaceCreature('toad').ok);
  assert.equal(st.coins, coins - CREATURE_BY_ID.toad.cost);
  assert.ok(st.lab.creatures.toad.alive);
  st.coins = 0;
  assert.equal(st.replaceCreature('toad').ok, false, 'replacement costs coins');
  // the wisp needs its lantern
  assert.equal(st.creatureAvailable('wisp'), false);
  st.equipment.push('lantern');
  assert.ok(st.creatureAvailable('wisp'));
});

test('the Potion ID: written per batch, outdated by a new pour, copied onto the vial, measurable against the truth', () => {
  const st = GameState.create('testing-2', { tutorial: false });
  assert.equal(idComplete(st.idCard), false);
  const vals = { vitality: 30, ardor: 0, frost: 0, levity: 4, charm: 7, bane: 0 };
  st.writeId('batch', vals);
  assert.ok(idComplete(st.idCard));
  assert.equal(st.idStale, false);
  st.touchBatch();
  assert.equal(st.idStale, true, 'pouring more makes the ID outdated');
  st.writeId('batch', { ...vals, vitality: 140, bane: -5 });
  assert.equal(st.idCard.values.vitality, 100, 'clamped');
  assert.equal(st.idCard.values.bane, 0);
  st.newBatch();
  assert.equal(idComplete(st.idCard), false, 'a new batch starts with a blank ID');
  const truth = [31, 0, 0, 4, 8, 0];
  assert.ok(idError(vals, truth) <= 1);
  assert.ok(idError({ ...vals, vitality: 10 }, truth) >= 20);
});

test('the garden grows with real time: plants only while moist, stones always; harvests take what has grown', () => {
  const t0 = 1_700_000_000_000;
  const st = GameState.create('garden-1', { tutorial: false });
  st.garden = /** @type {any} */ (JSON.parse(JSON.stringify(st.garden)));
  for (const b of Object.values(st.garden.beds)) { b.at = t0; b.wetUntil = t0 + MOIST_MS; }
  st.garden.well = { stock: 600, at: t0 };
  const R = st.world.roles;
  // the starting beds are ripe
  const h1 = st.harvest('dew-a', t0);
  assert.ok(h1.ok && h1.amount === BED_BY_ID['dew-a'].cap);
  assert.equal(st.stock(R.dew), h1.amount);
  // right after a harvest there is nothing to take
  const h2 = st.harvest('dew-a', t0 + 1000);
  assert.equal(h2.ok, false);
  assert.equal(h2.reason, 'unripe');
  // it regrows while moist...
  const half = BED_BY_ID['dew-a'].fullMin * MIN * 0.5;
  assert.ok(Math.abs(st.bed('dew-a', t0 + half).growth - 0.5) < 0.02);
  // ...and stops when the soil dries: harvest it again just before it dries out
  const dryAt = t0 + MOIST_MS;
  assert.ok(st.harvest('dew-a', dryAt - 5 * MIN).ok);
  const later = dryAt + 60 * MIN;
  assert.ok(st.bed('dew-a', dryAt).growth > 0.2 && st.bed('dew-a', dryAt).growth < 0.3);
  assert.equal(st.bed('dew-a', later).growth, st.bed('dew-a', dryAt).growth, 'a dry bed does not grow');
  assert.equal(st.bed('dew-a', later).moist, false);
  // watering costs well water and restarts growth
  const water = st.stock(R.water);
  assert.ok(st.water('dew-a', later).ok);
  assert.equal(st.stock(R.water), water - WATER_COST);
  assert.ok(st.bed('dew-a', later + 5 * MIN).growth > st.bed('dew-a', later).growth);
  // a crystal bed needs no water
  st.harvest('sunstone-a', t0);
  assert.ok(st.bed('sunstone-a', t0 + 120 * MIN).growth > 0.99);
  // a harvest is limited by the shelves
  st.inventory[R.sap] = st.cap.storage - 10;
  const h3 = st.harvest('sap-a', t0);
  assert.equal(h3.amount, 10);
  assert.ok(st.bed('sap-a', t0).growth > MIN_HARVEST, 'what the shelves could not hold stays on the plant');
});

test('the well refills slowly; new beds cost coins and rank; a new day gives the garden a push', () => {
  const t0 = 1_700_000_000_000;
  const st = GameState.create('garden-2', { tutorial: false });
  st.garden.well = { stock: 600, at: t0 };
  let drawn = 0;
  for (let k = 0; k < 6; k++) { const r = st.harvest('well', t0); if (r.ok) drawn += r.amount; }
  assert.equal(drawn, 600, 'the well runs dry');
  assert.equal(st.harvest('well', t0).ok, false);
  assert.ok(st.bed('well', t0 + 8 * MIN).amount >= 280, 'and refills with time');
  // planting
  const locked = BEDS.find((b) => b.rank > 0 && b.price > 0);
  assert.equal(st.plant(locked.id).ok, false, 'rank-locked');
  st.coins = 10;
  assert.equal(st.plant('glacite-a').ok, false, 'not enough coins');
  st.coins = 100;
  assert.ok(st.plant('glacite-a').ok);
  assert.equal(st.coins, 100 - BED_BY_ID['glacite-a'].price);
  assert.ok(st.availableSet().has(st.world.roles.glacite), 'a planted bed makes its ingredient available');
  assert.equal(st.bed('glacite-a').growth < 0.05, true, 'it starts from bare soil');
  // a new day: the well fills and the beds put on growth
  const g0 = st.bed('glacite-a').growth;
  st.endDay();
  assert.ok(st.bed('glacite-a').growth >= g0 + 0.1);
  assert.equal(st.bed('well').amount, 600);
});
