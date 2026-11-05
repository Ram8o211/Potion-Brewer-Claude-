// The wilds: biome generations, rarity-aware populations, harvests that take
// a specimen for good (no regrowth, no watering), Traveller Coins and biome
// regeneration, unlocks; and the gathering details that remain — methods
// and tools, the hour, the weather.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { gatherPlan, dayPart, weatherOn, WEATHERS, depositStatus, sandboxWilds, SANDBOX_PACE, REGIONS } from '../src/game/gathering.js';
import { populationOf, accrue, regenerate, createRegen, COIN_RULES, nextCoinIn, normalizeRegen, specimenCount } from '../src/game/regen.js';
import { BIOMES, BIOME_BY_ID } from '../src/game/biomes.js';
import { SPECIES, SPECIES_BY_KEY, parseCatalogId } from '../src/materials/catalog.js';
import { RARITY, ARCANE } from '../src/materials/rarity.js';

const fresh = (seed = 'gather-1') => GameState.create(seed, { tutorial: false });
const MIN = 60000;

test('twelve regions, and only the Whisperwood is open at the start', () => {
  assert.equal(REGIONS.length, 12);
  const st = fresh();
  assert.deepEqual(st.regen.unlocked, ['forest']);
  for (const b of BIOMES) assert.equal(st.biomeOpen(b.id), b.id === 'forest', b.id);
  // a locked biome cannot be harvested
  const far = st.deposits.find((d) => d.region !== 'forest');
  assert.ok(far);
  assert.equal(st.gather(far.id).reason, 'locked');
  // milestones open the next biomes
  st.stats.served = 3;
  const ev = st.checkUnlocks();
  assert.ok(ev.some((e) => e.id === 'meadow'), 'three customers served open the Sunlit Meadow');
  assert.ok(!st.biomeOpen('moonfen'), 'the exotic biomes wait for higher ranks');
});

test('populations: deterministic, from the biome’s own species, rarer species fewer and less often, Arcane forms the exception', () => {
  for (const b of BIOMES) {
    const a = populationOf('pop-1', b.id, 3), c = populationOf('pop-1', b.id, 3);
    assert.deepEqual(a, c, 'equal seeds give equal populations');
    for (const p of a) assert.equal(SPECIES_BY_KEY[p.key].biome, b.id, `${p.key} grows in ${b.id}`);
    assert.ok(a.length >= 3, `${b.id}: never a one-note biome`);
  }
  // over many generations the tiers appear as configured
  const seen = { common: 0, uncommon: 0, rare: 0, unique: 0, legendary: 0 }, slots = { ...seen };
  let ordinary = 0, arcane = 0;
  for (let g = 1; g < 400; g++) {
    const pop = populationOf('dist', 'forest', g);
    for (const s of SPECIES.filter((x) => x.biome === 'forest')) slots[s.rarity]++;
    for (const p of pop) { seen[SPECIES_BY_KEY[p.key].rarity]++; ordinary += p.ordinary; arcane += p.arcane; }
  }
  for (const r of Object.keys(seen)) {
    const f = seen[r] / slots[r];
    assert.ok(Math.abs(f - RARITY[r].presence) < 0.08, `${r}: present ${f.toFixed(2)} of the time (configured ${RARITY[r].presence})`);
  }
  assert.ok(seen.common > seen.uncommon && seen.uncommon > seen.rare && seen.rare > seen.unique && seen.unique > seen.legendary);
  assert.ok(arcane > 0 && arcane < ordinary * 0.15, `Arcane forms stay rare (${arcane} of ${ordinary + arcane})`);
  assert.ok(Object.values(ARCANE.spawnChance).every((p) => p < 0.15));
});

test('the first Whisperwood guarantees an Arcane Silverleaf for the tutorial', () => {
  for (let k = 0; k < 20; k++) {
    const pop = populationOf('tut-' + k, 'forest', 0);
    const sl = pop.find((p) => p.key === 'silverleaf');
    assert.ok(sl && sl.arcane >= 1 && sl.ordinary >= 2);
  }
});

test('every specimen of a species is the same material: one rarity, one magic', () => {
  const st = fresh('same-1');
  for (const d of st.deposits) {
    const m = st.lookup(d.materialId);
    const p = parseCatalogId(d.materialId);
    assert.ok(p, `${d.materialId} is a catalog species`);
    assert.equal(m.wild.rarity, p.species.rarity);
    assert.deepEqual(m.effects, p.species.fx, `${d.materialId}: the species' fixed effects`);
    assert.equal(!!m.arcane, p.arcane, 'only the Arcane form carries a threshold');
    assert.equal(d.arcane, p.arcane);
  }
});

test('a harvest takes a specimen for good: the wilds never grow back nor drink', () => {
  const st = fresh('take-1');
  const t0 = Date.now();
  const d = st.deposits.find((x) => x.region === 'forest' && x.slots >= 2);
  assert.ok(d);
  assert.equal(depositStatus(st.gathering, d, t0).mature, d.slots, 'a generation begins grown');
  const r = st.gather(d.id, { now: t0 });
  assert.ok(r.ok);
  assert.equal(depositStatus(st.gathering, d, t0).mature, d.slots - 1);
  // a day, a week, rain and new days bring nothing back
  for (const later of [t0 + 3600000, t0 + 7 * 86400000]) assert.equal(depositStatus(st.gathering, d, later).mature, d.slots - 1);
  st.endDay();
  assert.equal(depositStatus(st.gathering, st.deposits.find((x) => x.id === d.id), Date.now()).mature, d.slots - 1, 'a new day regrows nothing');
  assert.equal(st.water(d.id), 0, 'wild plants are not watered');
  assert.ok(st.deposits.every((x) => !x.botanical), 'no wild stand drinks');
  // take every specimen: the stand is empty until the biome is regenerated
  for (let k = 0; k < d.slots + 2; k++) st.gather(d.id, { now: t0 + k });
  assert.equal(depositStatus(st.gathering, d, t0 + 86400000).mature, 0);
});

test('regenerating a biome costs one Traveller Coin and brings new scenery and new populations; nothing owned changes', () => {
  const st = fresh('regen-1');
  const t0 = Date.now();
  const before = st.deposits.filter((d) => d.region === 'forest');
  const scene0 = st.sceneSeed('forest');
  const inv = JSON.stringify(st.inventory), coins = st.travellerCoins(t0).coins;
  const r = st.regenerate('forest', t0);
  assert.ok(r.ok);
  assert.equal(st.regen.coins, coins - 1, 'one coin spent');
  assert.notEqual(st.sceneSeed('forest'), scene0, 'new scenery');
  const after = st.deposits.filter((d) => d.region === 'forest');
  assert.ok(after.every((d) => d.gen === 1));
  assert.ok(after.every((d) => !before.some((b) => b.id === d.id)), 'new stands');
  assert.notDeepEqual(after.map((d) => `${d.materialId}×${d.slots}`), before.map((d) => `${d.materialId}×${d.slots}`), 'a different population');
  assert.equal(JSON.stringify(st.inventory), inv, 'the stores are untouched');
  // a locked biome cannot be regenerated, nor with an empty purse
  assert.equal(st.regenerate('moonfen', t0).ok, false);
  st.regen.coins = 0;
  assert.equal(st.regenerate('forest', t0).ok, false);
  // it survives a save
  const back = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.equal(back.regen.gens.forest, 1);
  assert.deepEqual(back.deposits.filter((d) => d.region === 'forest').map((d) => d.id), after.map((d) => d.id));
});

test('Traveller Coins recharge with time up to the cap, and a clock set back never gains or loses any', () => {
  const t0 = 1_700_000_000_000, per = COIN_RULES.rechargeMin * MIN;
  const r = createRegen(t0);
  assert.equal(r.coins, COIN_RULES.start);
  r.unlocked.push('meadow');
  assert.ok(regenerate(r, 'forest', t0).ok);
  assert.equal(r.coins, COIN_RULES.max - 1);
  assert.equal(nextCoinIn(r, t0), per);
  accrue(r, t0 + per - 1);
  assert.equal(r.coins, COIN_RULES.max - 1);
  accrue(r, t0 + per);
  assert.equal(r.coins, COIN_RULES.max, 'one coin per recharge period');
  // spend everything, then a week offline: back to the cap, no more
  r.coins = 0; r.at = t0;
  accrue(r, t0 + 7 * 86400000);
  assert.equal(r.coins, COIN_RULES.max);
  // the clock goes back: nothing changes, and counting restarts from there
  r.coins = 1; r.at = t0 + 10 * per;
  assert.equal(accrue(r, t0), 0);
  assert.equal(r.coins, 1);
  assert.equal(r.at, t0);
  // junk in a save is made safe
  const n = normalizeRegen({ coins: 'x', at: 'never', gens: { forest: -2, nowhere: 4, meadow: 2 }, unlocked: ['meadow', 'bogus'] }, t0);
  assert.deepEqual(n.unlocked.sort(), ['forest', 'meadow']);
  assert.deepEqual(n.gens, { meadow: 2 });
});

test('the Forager’s Kit doubles every harvest that is not simply picked; picking needs nothing', () => {
  const st = fresh();
  const all = st.deposits.map((d) => ({ d, m: st.lookup(d.materialId) }));
  const tooled = all.filter(({ m }) => m.wild.gather !== 'pick').slice(0, 4);
  const picked = all.find(({ m }) => m.wild.gather === 'pick');
  assert.ok(tooled.length >= 3, 'deposits that need the kit');
  const byHand = tooled.map(({ d, m }) => gatherPlan(st, d, m));
  for (const p of byHand) { assert.equal(p.method.tool, 'kit'); assert.equal(p.hasTool, false); }
  st.equipment.push('kit');
  tooled.forEach(({ d, m }, k) => assert.equal(gatherPlan(st, d, m).take, byHand[k].take * 2, `${d.materialId}: one kit serves every method`));
  assert.ok(picked && gatherPlan(st, picked.d, picked.m).hasTool, 'picking needs no tool');
});

test('the shop door is the clock; the weather is deterministic per world and day', () => {
  const st = fresh();
  st.opened = false;
  assert.equal(dayPart(st), 'dawn', 'before the door opens');
  st.nextCustomer();
  assert.equal(dayPart(st), 'day');
  assert.equal(weatherOn('w-1', 1).id, 'clear', 'the first day is always fair');
  const days = Array.from({ length: 60 }, (_, k) => weatherOn('w-1', k + 2).id);
  assert.deepEqual(days, Array.from({ length: 60 }, (_, k) => weatherOn('w-1', k + 2).id));
  assert.ok(new Set(days).size >= 4, 'the weather varies');
  for (const id of days) assert.ok(WEATHERS.some((w) => w.id === id));
});

test('harvests can drop seeds: one saved roll per harvest, so a reload never rerolls it', () => {
  const st = fresh('seeds-1');
  const t0 = Date.now();
  const d = st.deposits.find((x) => x.region === 'forest' && x.slots >= 3 && !x.arcane);
  const saved = JSON.parse(JSON.stringify(st.toJSON()));
  const r1 = st.gather(d.id, { now: t0 });
  // reload the same save and harvest the same plant: the same outcome
  const again = GameState.fromJSON(JSON.parse(JSON.stringify(saved)));
  const r2 = again.gather(d.id, { now: t0 });
  assert.equal(r1.seed ?? null, r2.seed ?? null, 'the same seed (or none) after a reload');
  assert.equal(st.garden.rolls, again.garden.rolls);
  assert.equal(st.garden.rolls, 1, 'every harvest draws once');
});

test('the Free Experiment’s wilds still grow back quickly, whatever its generation', () => {
  const t0 = Date.now();
  const st = fresh('sandbox-wilds-1');
  sandboxWilds(st.gathering, st.deposits, t0);
  const d = st.deposits.find((x) => x.region === 'forest' && x.slots >= 2);
  assert.ok(Number.isFinite(d.spawnMs) && d.spawnMs <= 6 * MIN / SANDBOX_PACE + 1, 'it sprouts again');
  for (const x of st.deposits) assert.equal(depositStatus(st.gathering, x, t0).mature, x.slots, `${x.id}: every plant stands grown`);
  st.inventory[d.materialId] = Infinity;
  const r = st.gather(d.id, { free: true, now: t0 });
  assert.ok(r.ok);
  assert.equal(depositStatus(st.gathering, d, t0).mature, d.slots - 1);
  assert.ok(depositStatus(st.gathering, d, t0 + 30 * MIN).mature === d.slots, 'back within minutes');
});

test('biome unlock milestones are ordered: natural before exotic', () => {
  const rankOf = (b) => (b.unlock.rank || 0) * 1000 + (b.unlock.served || 0);
  const nat = BIOMES.filter((b) => b.category === 'natural').map(rankOf), exo = BIOMES.filter((b) => b.category === 'exotic').map(rankOf);
  assert.ok(Math.max(...nat) < Math.min(...exo));
  assert.equal(BIOME_BY_ID.forest.unlock.rank, undefined);
  void specimenCount;
});
