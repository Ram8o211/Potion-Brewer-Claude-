// The quick shelf at the cauldron and the inventory behind it (game/bench.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBench, benchIds, setOnBench, inventoryGroups, mainEffect, rarityRank } from '../src/game/bench.js';
import { GameState } from '../src/game/state.js';
import { EFFECT_KEYS } from '../src/alchemy/effects.js';

test('a new find is put on the shelf once; taken off, it stays in the storeroom', () => {
  const b = normalizeBench(null);
  const stock = { a: 10, b: 0, c: 5 };
  const s = (id) => stock[id] || 0;
  assert.deepEqual(benchIds(b, ['a', 'b', 'c'], s), ['a', 'c'], 'only what is in stock is put out');
  setOnBench(b, 'a', false);
  assert.deepEqual(benchIds(b, ['a', 'b', 'c'], s), ['c'], 'a jar taken off does not come back by itself');
  stock.b = 3;
  assert.deepEqual(benchIds(b, ['a', 'b', 'c'], s), ['c', 'b'], 'something newly in stock joins the end');
  setOnBench(b, 'a', true);
  assert.deepEqual(benchIds(b, ['a', 'b', 'c'], s), ['c', 'b', 'a']);
  setOnBench(b, 'a', true);
  assert.equal(b.ids.filter((x) => x === 'a').length, 1, 'never twice');
  assert.deepEqual(benchIds(b, ['b', 'c'], s), ['c', 'b'], 'only what the storeroom can show');
  const back = normalizeBench(JSON.parse(JSON.stringify(b)));
  assert.deepEqual(back, b, 'the shelf survives a save');
});

test('a new game: the shelf starts with what the shop holds, and is saved', () => {
  const st = GameState.create('bench-1', { tutorial: false });
  const pool = st.world.ingredients.filter((id) => st.knows(id) && (st.lookup(id).tier <= st.rank || st.stock(id) > 0));
  const ids = benchIds(st.bench, pool, (id) => st.stock(id));
  assert.ok(ids.length >= 6, 'solvents and starter herbs');
  for (const id of ids) assert.ok(st.stock(id) > 0);
  setOnBench(st.bench, ids[0], false);
  const re = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.deepEqual(re.bench.ids, st.bench.ids);
  assert.deepEqual(benchIds(re.bench, pool, (id) => re.stock(id)), ids.slice(1));
});

test('the inventory groups by strongest effect or by rarity, rarest and strongest first', () => {
  const st = GameState.create('bench-2', { tutorial: false });
  const ids = st.world.ingredients;
  const byFx = inventoryGroups(ids, st.lookup, 'effect');
  assert.equal(byFx.reduce((n, g) => n + g.ids.length, 0), ids.length, 'each ingredient listed once');
  for (const g of byFx) {
    for (const id of g.ids) {
      const fx = mainEffect(st.lookup(id));
      assert.equal(fx ? fx.key : 'none', g.key === 'remains' ? 'none' : g.key);
    }
    for (let i = 1; i < g.ids.length; i++) assert.ok(rarityRank(st.lookup(g.ids[i - 1])) >= rarityRank(st.lookup(g.ids[i])), `${g.key} rarest first`);
  }
  const keys = byFx.map((g) => g.key).filter((k) => EFFECT_KEYS.includes(k));
  assert.deepEqual(keys, EFFECT_KEYS.filter((k) => keys.includes(k)), 'sections in the effects’ order');
  const byRar = inventoryGroups(ids, st.lookup, 'rarity');
  assert.equal(byRar.reduce((n, g) => n + g.ids.length, 0), ids.length);
  const ranks = byRar.map((g) => (g.ids.length ? rarityRank(st.lookup(g.ids[0])) : -1));
  for (let i = 1; i < ranks.length; i++) assert.ok(ranks[i - 1] >= ranks[i], 'Legendary first');
});
