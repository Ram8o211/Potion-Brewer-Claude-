// Gathering: twelve biomes, each with its dominant effect and creature; only
// the Whisperwood open in a new shop, the others opened with a map; plants
// found grown that never grow back; a traveller coin buys a new expedition
// (new ground, a new selection of the biome's species); coins come back with
// real time and as gifts. Methods and tools, the hour and the weather still
// decide what one harvest brings.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState, TRAVEL_MAX, TRAVEL_REFILL_MS } from '../src/game/state.js';
import { gatherPlan, dayPart, weatherOn, WEATHERS, depositStatus, normalizeGathering, generateDeposits, REGIONS, REGION_BY_ID, FIRST_REGION, GATHER_VERSION, sandboxWilds, genOf } from '../src/game/gathering.js';
import { EFFECT_BY_KEY } from '../src/alchemy/effects.js';
import { KINDS } from '../src/game/kinds.js';
import { RANKS } from '../src/game/equipment.js';

const fresh = (seed = 'gather-1') => GameState.create(seed, { tutorial: false });
/** The deposit of an ingredient at its biome's current expedition (or, failing that, at any of the first ten). */
function depositOf(st, key) {
  for (let g = 0; g < 10; g++) {
    const d = st.deposits.find((x) => st.lookup(x.materialId).wild.key === key);
    if (d) return d;
    const region = st.world.materials.find((m) => m.wild && m.wild.key === key)?.wild.region;
    if (!region) return null;
    st.regenerateBiome(region, { free: true });
  }
  return null;
}

test('twelve biomes: six natural, six exotic, each with its own dominant effect and creature', () => {
  assert.equal(REGIONS.length, 12);
  assert.equal(REGIONS.filter((r) => r.realm === 'natural').length, 6);
  assert.equal(REGIONS.filter((r) => r.realm === 'exotic').length, 6);
  assert.equal(new Set(REGIONS.map((r) => r.effect)).size, 12, 'one dominant effect each');
  for (const r of REGIONS) {
    assert.equal(EFFECT_BY_KEY[r.effect].realm, r.realm, `${r.name}: ${r.effect} is ${r.realm}`);
    assert.ok(KINDS[r.creature], `${r.name}: its creature exists`);
  }
  assert.equal(REGION_BY_ID.forest.effect, 'vitality');
  assert.equal(REGION_BY_ID.forest.creature, 'fox');
  assert.equal(REGION_BY_ID.moonfen.realm, 'exotic');
  assert.equal(REGION_BY_ID.moonfen.effect, 'arcana');
});

test('every ingredient of a biome carries its dominant effect as its main effect, with minority side effects', () => {
  const st = fresh();
  for (const r of REGIONS) {
    const mats = st.world.wild.map(st.lookup).filter((m) => m.wild.region === r.id);
    assert.ok(mats.length >= 6, `${r.name} has a pool of species (${mats.length})`);
    for (const m of mats) {
      const fx = Object.entries(m.effects).filter(([, v]) => Math.abs(v) >= 1).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
      assert.equal(fx[0][0], r.effect, `${m.name} (${r.name}) is mainly ${r.effect}`);
      assert.ok(fx.length >= 2, `${m.name} has side effects`);
      for (const [k] of fx.slice(1)) assert.equal(EFFECT_BY_KEY[k].realm, 'natural', `${m.name}: its side effect ${k} is natural`);
    }
  }
});

test('a new shop knows only the Whisperwood; maps open the others by rank and coins', () => {
  const st = fresh();
  assert.deepEqual(st.biomes, [FIRST_REGION]);
  assert.ok(st.biomeOpen('forest') && !st.biomeOpen('meadow'));
  const meadow = st.deposits.find((d) => d.region === 'meadow');
  assert.equal(st.gather(meadow.id).reason, 'locked', 'no gathering without the map');
  st.coins = 0;
  assert.ok(st.mapBlocked('meadow'), 'a map costs coins');
  st.coins = 1000;
  assert.ok(/rank/.test(st.mapBlocked('moonfen') || ''), 'an exotic map needs a guild rank');
  const r = st.buyMap('meadow');
  assert.ok(r.ok);
  assert.equal(st.coins, 1000 - REGION_BY_ID.meadow.price);
  assert.ok(st.biomeOpen('meadow'));
  st.reputation = RANKS[4].rep; st.coins = 10000;
  for (const reg of REGIONS) if (!st.biomeOpen(reg.id)) assert.ok(st.buyMap(reg.id).ok, reg.name);
  assert.equal(st.biomes.length, 12);
  // the market sells only what grows in a land on the shop's maps
  const fresh2 = fresh('market');
  fresh2.reputation = RANKS[2].rep;
  assert.ok(fresh2.purchasable().every((id) => { const m = fresh2.lookup(id); return !m.wild || fresh2.biomeOpen(m.wild.region); }));
});

test('plants are found grown and never grow back; a traveller coin buys a new expedition with new ground and species', () => {
  const st = fresh();
  const forest = () => st.deposits.filter((d) => d.region === 'forest');
  const first = forest().map((d) => d.id);
  assert.ok(first.length >= 4, 'several species grow there');
  for (const d of forest()) assert.equal(depositStatus(st.gathering, d).mature, d.slots, 'found fully grown');
  const d = forest()[0];
  const t0 = Date.now();
  let got = 0;
  for (let n = 0; n < 20; n++) { const r = st.gather(d.id, { now: t0 }); if (!r.ok) { assert.equal(r.reason, 'depleted'); break; } got += r.amount; }
  assert.ok(got > 0);
  // a day, a week later: still nothing
  assert.equal(depositStatus(st.gathering, d, t0 + 7 * 86400000).mature, 0, 'nothing grows back with time');
  st.endDay();
  assert.equal(depositStatus(st.gathering, d).mature, 0, 'nor with a new day');
  // a new expedition: a coin is spent, the generation moves on, new deposits are found grown
  const coins = st.travelCoins();
  const res = st.regenerateBiome('forest');
  assert.ok(res.ok);
  assert.equal(st.travelCoins(), coins - 1);
  assert.equal(genOf(st.gathering, 'forest'), 1);
  const second = forest();
  assert.ok(second.every((x) => !first.includes(x.id)), 'new ground');
  for (const x of second) assert.equal(depositStatus(st.gathering, x).mature, x.slots);
  // other biomes are untouched by it
  assert.equal(genOf(st.gathering, 'meadow'), 0);
  // every expedition keeps the biome's theme
  for (let g = 0; g < 4; g++) {
    st.regenerateBiome('forest', { free: true });
    for (const x of forest()) assert.equal(st.lookup(x.materialId).wild.main, 'vitality');
  }
  // without a coin, no travel
  st.travel.coins = 0; st.travel.at = Date.now();
  assert.equal(st.regenerateBiome('forest').ok, false);
  // a biome without a map cannot be travelled to
  st.travel.coins = 3;
  assert.equal(st.regenerateBiome('reef').ok, false);
});

test('expeditions vary: different species, spots and amounts each time, deterministic per world', () => {
  const st = fresh('vary');
  const sel = new Set(), spots = new Set();
  for (let g = 0; g < 6; g++) {
    const ds = st.deposits.filter((d) => d.region === 'forest');
    sel.add(ds.map((d) => st.lookup(d.materialId).wild.key).sort().join(','));
    for (const d of ds) spots.add(`${d.x},${d.y}`);
    st.regenerateBiome('forest', { free: true });
  }
  assert.ok(sel.size >= 3, `the selection changes (${sel.size} different)`);
  assert.ok(spots.size >= 20, 'and the spots');
  const a = generateDeposits(st.world, st.lookup, { forest: 3 }), b = generateDeposits(st.world, st.lookup, { forest: 3 });
  assert.equal(JSON.stringify(a), JSON.stringify(b), 'deterministic');
});

test('traveller coins come back with real time, up to the purse, and as gifts', () => {
  const st = fresh();
  const t0 = Date.now();
  assert.equal(st.travelCoins(t0), TRAVEL_MAX);
  st.travel = { coins: 0, at: t0 };
  assert.equal(st.travelCoins(t0 + TRAVEL_REFILL_MS - 1), 0);
  assert.equal(st.travelCoins(t0 + TRAVEL_REFILL_MS), 1);
  assert.equal(st.travelCoins(t0 + TRAVEL_REFILL_MS * 10), TRAVEL_MAX, 'never past the purse');
  st.travel = { coins: 0, at: t0 };
  assert.ok(st.travelNextIn(t0 + 1000) > 0);
  st.giftTravelCoin();
  assert.ok(st.travel.coins >= 1, 'a gift');
  st.equipment.push('compass');
  st.travel = { coins: 0, at: t0 };
  assert.ok(st.travelCoins(t0 + TRAVEL_REFILL_MS * 10) > TRAVEL_MAX, 'the compass holds more');
  // the purse survives a save
  const back = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.deepEqual(back.travel, st.travel);
  assert.deepEqual(back.biomes, st.biomes);
});

test('the Forager’s Kit doubles every harvest that is not simply picked; picking needs nothing', () => {
  const st = fresh();
  st.reputation = RANKS[4].rep; st.coins = 5000;
  for (const r of REGIONS) if (!st.biomeOpen(r.id)) st.buyMap(r.id);
  const leaf = depositOf(st, 'silverleaf');
  const kinds = ['riverchalk', 'emberflint', 'emberbark', 'mica'].map((k) => depositOf(st, k)).filter(Boolean);
  assert.ok(kinds.length >= 3, 'deposits of roots, seams, bark and dust');
  const byHand = kinds.map((d) => gatherPlan(st, d, st.lookup(d.materialId)));
  for (const p of byHand) { assert.equal(p.method.tool, 'kit'); assert.equal(p.hasTool, false); }
  st.equipment.push('kit');
  kinds.forEach((d, k) => assert.equal(gatherPlan(st, d, st.lookup(d.materialId)).take, byHand[k].take * 2, `${d.materialId}: one kit serves every method`));
  assert.equal(gatherPlan(st, leaf, st.lookup(leaf.materialId)).hasTool, true, 'leaves are picked by hand');
});

test('the shop door is the clock: dawn before opening, dusk after the last customer; twilight plants give a few sprigs out of their hour', () => {
  const st = fresh();
  st.opened = false;
  assert.equal(dayPart(st), 'dawn', 'before the door opens');
  st.nextCustomer();
  assert.ok(st.opened, 'letting the first customer in opens the shop');
  assert.equal(dayPart(st), 'day');
  st.current = null; st.customerIndex = st.customersPerDay;
  assert.equal(dayPart(st), 'dusk', 'once the last customer has gone');
  st.endDay();
  assert.equal(dayPart(st), 'dawn', 'a new day starts closed');
  st.current = null; st.customerIndex = st.customersPerDay;
  const shade = depositOf(st, 'foxglove');
  const m = st.lookup(shade.materialId);
  assert.ok(m.wild.dusk);
  const atDusk = gatherPlan(st, shade, m);
  st.customerIndex = 1; st.opened = true;
  const atNoon = gatherPlan(st, shade, m);
  assert.ok(atDusk.open && !atNoon.open);
  assert.ok(atNoon.take >= 5, 'never completely out of reach');
  assert.ok(atNoon.take < atDusk.take);
});

test('weather is deterministic per world and day, and changes what a harvest brings', () => {
  const a = weatherOn('w', 5), b = weatherOn('w', 5);
  assert.equal(a.id, b.id);
  assert.equal(weatherOn('w', 1).id, 'clear', 'the first day is fair');
  const seen = new Set();
  for (let d = 2; d < 200; d++) seen.add(weatherOn('w', d).id);
  assert.equal(seen.size, WEATHERS.length, 'every weather happens');
  // a storm scatters a picked harvest
  const st = fresh();
  const d = depositOf(st, 'silverleaf'), m = st.lookup(d.materialId);
  let day = 2;
  while (weatherOn(st.seed, day).id !== 'storm') day++;
  st.day = day;
  const stormy = gatherPlan(st, d, m);
  st.day = 1;
  const fair = gatherPlan(st, d, m);
  assert.ok(stormy.take < fair.take, 'the wind scatters it');
});

test('storage caps what can be carried home; older saves start a fresh expedition', () => {
  const st = fresh();
  const d = st.deposits.find((x) => x.region === 'forest');
  st.inventory[d.materialId] = st.cap.storage;
  assert.equal(st.gather(d.id).reason, 'full');
  const old = normalizeGathering({ v: 2, nodes: { 'forest:silverleaf:0': { plants: [{ id: 'p', x: 0.5, y: 0.7, born: 0, g: 0.3, t: 0, w: 0.5 }], due: null, seq: 1 } }, total: 120 });
  assert.equal(old.v, GATHER_VERSION);
  assert.deepEqual(old.nodes, {}, 'the growing plants of a v2 save are dropped');
  assert.equal(old.total, 120, 'what was gathered is remembered');
});

test('the Free Experiment travels free and takes the plant', () => {
  const st = fresh('sandbox');
  sandboxWilds(st.gathering, st.deposits);
  const d = st.deposits.find((x) => x.region === 'reef');
  const r = st.gather(d.id, { free: true });
  assert.ok(r.ok && r.amount === d.take);
  assert.equal(depositStatus(st.gathering, d).mature, d.slots - 1);
  assert.ok(st.regenerateBiome('reef', { free: true }).ok, 'travel is free in the Free Experiment');
});
