// Gathering depth: methods and tools, the hour, the weather, careful or
// thorough harvests.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { gatherPlan, dayPart, weatherOn, WEATHERS, depositStatus, normalizeGathering, SCAR_SLOWDOWN, weatherRegrowth } from '../src/game/gathering.js';

const fresh = (seed = 'gather-1') => GameState.create(seed, { tutorial: false });
const depositOf = (st, key) => st.deposits.find((d) => st.lookup(d.materialId).wild.key === key);

test('the right tool doubles a harvest; picking needs none', () => {
  const st = fresh();
  const chalk = depositOf(st, 'riverchalk');
  const leaf = depositOf(st, 'silverleaf');
  const byHand = gatherPlan(st, chalk, st.lookup(chalk.materialId));
  assert.equal(byHand.method.tool, 'trowel');
  assert.equal(byHand.hasTool, false);
  st.equipment.push('trowel');
  const withTool = gatherPlan(st, chalk, st.lookup(chalk.materialId));
  assert.equal(withTool.take, byHand.take * 2);
  assert.equal(gatherPlan(st, leaf, st.lookup(leaf.materialId)).hasTool, true, 'leaves are picked by hand');
});

test('dawn and dusk follow the customers; twilight plants give a few sprigs out of their hour', () => {
  const st = fresh();
  st.customerIndex = 0;
  assert.equal(dayPart(st), 'dawn');
  st.customerIndex = 1;
  assert.equal(dayPart(st), 'day');
  st.customerIndex = st.customersPerDay - 1;
  assert.equal(dayPart(st), 'dusk');
  const shade = depositOf(st, 'nightshade');
  const m = st.lookup(shade.materialId);
  assert.ok(m.wild.dusk);
  const atDusk = gatherPlan(st, shade, m);
  st.customerIndex = 1;
  const atNoon = gatherPlan(st, shade, m);
  assert.ok(atDusk.open && !atNoon.open);
  assert.ok(atNoon.take >= 5, 'never completely out of reach');
  assert.ok(atNoon.take < atDusk.take);
});

test('weather is deterministic per world and day, and acts on regrowth', () => {
  assert.equal(weatherOn('w', 1).id, 'clear', 'the first day is always fair');
  const seen = new Set();
  for (let d = 2; d < 80; d++) {
    assert.equal(weatherOn('w', d).id, weatherOn('w', d).id);
    seen.add(weatherOn('w', d).id);
  }
  assert.ok(seen.size >= 5, `varied weather (${[...seen]})`);
  const st = fresh();
  const leaf = depositOf(st, 'silverleaf');
  const stone = depositOf(st, 'emberflint');
  st.gathering.nodes[leaf.id] = { stock: 0, at: Date.now() };
  st.gathering.nodes[stone.id] = { stock: 0, at: Date.now() };
  weatherRegrowth(st.gathering, st.deposits, WEATHERS.find((w) => w.id === 'rain'), st.lookup);
  assert.equal(st.gathering.nodes[leaf.id], undefined, 'rain regrows the plants');
  assert.ok(st.gathering.nodes[stone.id], 'but not the stones');
});

test('a thorough harvest takes twice as much and scars the deposit until it is full', () => {
  const st = fresh();
  st.equipment.push('trowel');
  st.customerIndex = 1;
  const root = depositOf(st, 'ironroot');
  const careful = gatherPlan(st, root, st.lookup(root.materialId)).take;
  const now = 1_000_000;
  const r = st.gather(root.id, { thorough: true, now });
  assert.ok(r.ok);
  assert.equal(r.amount, Math.min(careful * 2, root.capacity));
  const s = depositStatus(st.gathering, root, now);
  assert.ok(s.scarred);
  // regrowth runs at half speed
  const later = depositStatus(st.gathering, root, now + root.regrowMs * 0.25);
  assert.ok(Math.abs((later.stock - s.stock) - root.capacity * 0.25 / SCAR_SLOWDOWN) < 1e-6);
  // the scar is saved
  const g = normalizeGathering(JSON.parse(JSON.stringify(st.gathering)), now);
  assert.equal(g.nodes[root.id].scar, true);
  // fully regrown, the scar is gone
  assert.equal(depositStatus(st.gathering, root, now + root.regrowMs * SCAR_SLOWDOWN * 2).scarred, false);
});
