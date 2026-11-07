// Biome runes (game/cellar.js, game/gathering.js wardStones): one per biome,
// of its effect, found underground in the wilds; set in an aging bottle it
// hastens the extraction of what carries its effect, as quickly in the cold
// as at room temperature, and never moves the ceiling.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWorld, makeLookup } from '../src/materials/generator.js';
import { BIOMES } from '../src/game/biomes.js';
import { yieldAt } from '../src/alchemy/extraction.js';
import { BIOME_RUNES, WARD_LIFE, WARD_BOOST, newVessel, fillVessel, advanceVessel, setWard, vesselReport, normalizeCellar, wardHastens } from '../src/game/cellar.js';
import { wardStones } from '../src/game/gathering.js';
import { GameState } from '../src/game/state.js';
import { makeVialFromComposition } from '../src/game/vial.js';

const world = generateWorld('ward-tests');
const lookup = makeLookup(world);
const R = world.roles;
const HYDRO = 'wild-sp-silverleaf';
const T0 = 1_700_000_000_000;

/** A vessel of spirit and ground silverleaf at a steady temperature (no charge: the cellar's own, or held by hand). */
function vessel(T, effect) {
  const v = newVessel(T0);
  fillVessel(v, { [R.spirit]: 200, [HYDRO]: 60 }, T, T0);
  if (effect) setWard(v, effect, T0);
  return v;
}
/** Advance a vessel, keeping it at T (as a rune-held charge would), and give the silverleaf's extracted share. */
function age(v, T, hours) {
  for (let k = 1; k <= hours * 6; k++) { v.T = T; advanceVessel(v, lookup, T0 + k * 600_000); }
  const it = vesselReport(v, lookup).items.find((x) => x.id === HYDRO);
  return it ? it.share : 0;
}

test('one rune for every biome, of its own effect', () => {
  assert.equal(BIOME_RUNES.length, BIOMES.length);
  for (const b of BIOMES) {
    const r = BIOME_RUNES.find((x) => x.biome === b.id);
    assert.ok(r && r.effect === b.effect && /Rune$/.test(r.name), `${b.name} has the ${r && r.name}`);
  }
  assert.ok(wardHastens(lookup(HYDRO), 'vitality'), 'silverleaf carries vitality');
  assert.ok(!wardHastens(lookup(HYDRO), 'love'), 'and no love');
});

test('a biome rune hastens extraction in the cold, never moving the ceiling; a rune of another effect does nothing', () => {
  const T = -10;
  const plain = age(vessel(T), T, 1 / 6), fast = age(vessel(T, 'vitality'), T, 1 / 6), other = age(vessel(T, 'love'), T, 1 / 6);
  assert.ok(fast > plain * 2.5, `the Vitality Rune is much quicker in the cold (${plain.toFixed(3)} → ${fast.toFixed(3)} in 10 min)`);
  assert.ok(Math.abs(other - plain) < 1e-9, 'the Love Rune does nothing for silverleaf');
  // it never goes past the ceiling, which stays what it was
  const ceil = yieldAt(lookup(HYDRO).extraction, T);
  const v = vessel(T, 'vitality');
  const end = age(v, T, 11);
  assert.ok(end <= ceil + 1e-6 && end > ceil - 0.03, `it comes to the very ceiling of ${T}°C (${end.toFixed(3)} of ${ceil.toFixed(3)}), never past it`);
  const rep = vesselReport(v, lookup);
  assert.equal(rep.items.find((x) => x.id === HYDRO).ceiling, yieldAt(lookup(HYDRO).extraction, rep.T), 'the ceiling is untouched');
  assert.ok(rep.items.find((x) => x.id === HYDRO).fast, 'the report marks what the rune hastens');
  // as quick in the cold as at room temperature
  const warm = age(vessel(20, 'vitality'), 20, 0.5), cold = age(vessel(-10, 'vitality'), -10, 0.5);
  assert.ok(cold >= warm * 0.9, `the cold no longer slows it (${cold.toFixed(3)} at −10 °C, ${warm.toFixed(3)} at 20 °C)`);
  assert.ok(WARD_BOOST > 1);
});

test('a biome rune wears out with use, and is saved', () => {
  const v = vessel(-10, 'vitality');
  age(v, -10, WARD_LIFE / 3600 / 2);
  assert.ok(v.ward && v.ward.life > 0 && v.ward.life < WARD_LIFE, 'half worn');
  const back = normalizeCellar(JSON.parse(JSON.stringify({ vessels: [v], runes: 0, wards: { vitality: 2, nonsense: 4 } })), 1);
  assert.deepEqual(back.vessels[0].ward, v.ward, 'the rune in its slot is saved');
  assert.deepEqual(back.wards, { vitality: 2 }, 'runes in hand are saved (only real ones)');
  age(v, -10, WARD_LIFE / 3600);
  assert.equal(v.ward, null, 'worn out');
});

test('each biome keeps its rune underground every day: dug out once, into the hand, then into a bottle', () => {
  const st = GameState.create('ward-stones', { tutorial: false });
  // (one rune slot of every bottle comes with the Aging Cellar)
  for (const b of BIOMES) {
    const s = st.wardStones(b.id);
    assert.equal(s.length, 1, `${b.name}: one stone today`);
    assert.equal(s[0].effect, b.effect);
  }
  assert.deepEqual(wardStones('forest', st.sceneSeed('forest'), st.day), wardStones('forest', st.sceneSeed('forest'), st.day), 'the same every time');
  assert.notDeepEqual(wardStones('forest', st.sceneSeed('forest'), st.day + 1)[0].id, st.wardStones('forest')[0].id, 'a new one tomorrow');
  const id = st.wardStones('forest')[0].id;
  assert.equal(st.wardsOf('vitality'), 0);
  const r = st.digWard(id);
  assert.ok(r.ok, r.reason);
  assert.equal(st.wardsOf('vitality'), 1, 'a Vitality Rune in hand');
  assert.equal(st.digWard(id).ok, false, 'dug once only');
  assert.ok(st.wardStones('forest')[0].dug);
  // saved
  const back = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.equal(back.wardsOf('vitality'), 1);
  assert.ok(back.wardStones('forest')[0].dug);
  // into an aging bottle: the rune is used
  const vial = makeVialFromComposition({ [R.water]: 150, [HYDRO]: 50 }, 20, { batchId: 'w1', day: st.day, parts: [] }, st.lookup, st.world.laws || []);
  assert.ok(vial);
  st.bottles.push(vial);
  st.equipment.push('cellar');
  assert.equal(st.wardBottle(vial.id, 'love').ok, false, 'no Love Rune in hand');
  const set = st.wardBottle(vial.id, 'vitality');
  assert.ok(set.ok, set.reason);
  assert.equal(st.wardsOf('vitality'), 0, 'used');
  assert.equal(vial.aging.ward.effect, 'vitality', 'set in the bottle’s third slot');
});
