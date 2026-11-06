// The Free Experiment keeps the campaign's features: potion shelves, the
// aging cellar (unlimited runes, a quicker clock), the garden (every seed,
// every bed, quicker growth), and it saves them under its own key.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { prepareSandbox, sandboxSave, SANDBOX_CELLAR_PACE, SANDBOX_GARDEN_PACE } from '../src/game/sandbox.js';
import { advanceVessel, fillVessel, normalizeCellar, chargeVessel } from '../src/game/cellar.js';
import { makeVialFromComposition } from '../src/game/vial.js';
import { EFFECT_INDEX } from '../src/alchemy/effects.js';
import { growHours, seedId } from '../src/game/garden.js';
import { SPECIES } from '../src/materials/catalog.js';
import { EQUIPMENT } from '../src/game/equipment.js';

const T0 = 1_700_000_000_000;
const sandbox = (saved = null, seed = 'sandbox-sync') => prepareSandbox(GameState.create(seed, { tutorial: false }), saved, T0);
/** A bottle of this composition on the shelves. */
const shelve = (st, comp, T = 20) => { const v = makeVialFromComposition(comp, T, { batchId: 't' + st.bottles.length, day: 1 }, st.lookup, []); st.bottles.push(v); return v; };

test('the Free Experiment owns every piece of equipment, shelf and aging place', () => {
  const st = sandbox();
  assert.equal(st.equipment.length, EQUIPMENT.length);
  assert.ok(st.agingSlots > 0, 'bottles can age');
  assert.equal(st.cellar.vessels.length, 0, 'aging happens on the shelves');
  assert.ok(st.cap.bottles > 0 && st.bottleRoom === st.cap.bottles, 'empty potion shelves');
  assert.equal(st.cellar.runes, Infinity);
  assert.equal(st.cellar.pace, SANDBOX_CELLAR_PACE);
});

test('its runes never run out, and its cellar runs quicker than the shop’s', () => {
  const st = sandbox();
  const R = st.world.roles;
  const fire = new Array(15).fill(0); fire[EFFECT_INDEX.fire] = 15;
  const b = shelve(st, { [R.water]: 100 }, 12);
  assert.ok(st.startAging(b.id, T0).ok);
  assert.ok(chargeVessel(b.aging, fire, 50, T0).ok);
  for (let k = 0; k < 3; k++) assert.ok(st.runeBottle(b.id, 40, T0).ok);
  const c = shelve(st, { [R.water]: 50 });
  assert.ok(st.runeBottle(c.id, 40, T0).ok, 'a rune in another bottle: it starts aging');
  assert.equal(st.cellar.runes, Infinity);
  // one real minute is an hour of cellar time: the charge has warmed the bottle to the rune's lock
  st.tickCellar(T0 + 2 * 60000);
  assert.ok(Math.abs(b.aging.T - 40) < 0.01, `locked at 40°C (${b.aging.T.toFixed(1)})`);
  // the shop's cellar, for the same two minutes, barely moves
  const shop = normalizeCellar(null, 1, T0);
  fillVessel(shop.vessels[0], { [R.water]: 100 }, 12, T0);
  chargeVessel(shop.vessels[0], fire, 50, T0);
  advanceVessel(shop.vessels[0], st.lookup, T0 + 2 * 60000);
  assert.ok(shop.vessels[0].T < 17, `the shop warmed only to ${shop.vessels[0].T.toFixed(1)}`);
});

test('its garden holds every bed at the highest grade and every seed, never used up, growing quicker', () => {
  const st = sandbox();
  const g = st.garden;
  assert.deepEqual(new Set(g.plots.map((p) => p.bed)), new Set(['soil', 'fungal', 'crystal', 'tide']));
  assert.ok(g.plots.every((p) => p.grade === 2));
  assert.ok(g.plots.length <= 12, 'two rows of six in the scene');
  const legend = SPECIES.find((s) => s.rarity === 'legendary' && s.bed === 'soil');
  const id = seedId(legend.key, true);
  assert.equal(g.seeds[id], Infinity);
  const plot = g.plots.find((p) => p.bed === 'soil');
  assert.ok(st.sow(plot.id, id, T0).ok, 'an Arcane Legendary seed grows in the sandbox');
  assert.equal(g.seeds[id], Infinity, 'the seed is not used up');
  st.waterGarden(plot.id, T0);
  const ready = T0 + (growHours(legend.key, true) * 3600000) / SANDBOX_GARDEN_PACE * 1.2;
  const r = st.harvestGarden(plot.id, ready);
  assert.ok(r.ok, r.reason);
  assert.equal(st.inventory[r.material], Infinity, 'bottomless stores stay bottomless');
});

test('bottles on its shelves age and are unsealed in place', () => {
  const st = sandbox();
  const R = st.world.roles;
  const b = shelve(st, { [R.water]: 80 });
  assert.ok(st.startAging(b.id, T0).ok);
  assert.equal(st.bottles.length, 1, 'on the Free Experiment’s own shelves');
  const r = st.finishAging(b.id, T0 + 1000);
  assert.ok(r.ok && r.vial && !r.vial.aging && st.bottles.length === 1, 'unsealed where it stood');
});

test('its shelves, cellar and garden survive a reload of the same world only', () => {
  const st = sandbox();
  const R = st.world.roles;
  const kept = shelve(st, { [R.water]: 60 });
  st.runeBottle(kept.id, -5, T0);
  kept.aging.name = 'kept';
  shelve(st, { [R.water]: 40 });
  const plot = st.garden.plots[0];
  const seed = Object.keys(st.garden.seeds).find((s) => st.sow(plot.id, s, T0).ok);
  assert.ok(seed);
  const saved = JSON.parse(JSON.stringify(sandboxSave(st, null)));
  assert.ok(!('seeds' in saved.garden) && !('runes' in saved.cellar), 'the bottomless things are not saved');
  const back = sandbox(saved);
  assert.equal(back.bottles.length, 2);
  assert.equal(back.bottles[0].aging.name, 'kept');
  assert.equal(back.bottles[0].aging.rune.target, -5);
  assert.equal(back.cellar.runes, Infinity);
  assert.equal(back.garden.plots[0].crop.species, st.garden.plots[0].crop.species);
  assert.ok(Object.keys(back.garden.seeds).length > 0);
  const other = sandbox(saved, 'another-world');
  assert.equal(other.bottles.length, 0);
  assert.ok(other.garden.plots.every((p) => !p.crop));
});
