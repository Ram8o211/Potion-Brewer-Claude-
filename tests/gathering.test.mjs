// Gathering depth: methods and tools, the hour, the weather, careful or
// thorough harvests.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { gatherPlan, dayPart, weatherOn, WEATHERS, depositStatus, normalizeGathering, SCAR_SLOWDOWN, weatherRegrowth, harvestable, CAREFUL_RESERVE } from '../src/game/gathering.js';

const fresh = (seed = 'gather-1') => GameState.create(seed, { tutorial: false });
const depositOf = (st, key) => st.deposits.find((d) => st.lookup(d.materialId).wild.key === key);

test('the Forager’s Kit doubles every harvest that is not simply picked; picking needs nothing', () => {
  const st = fresh();
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
  const shade = depositOf(st, 'nightshade');
  const m = st.lookup(shade.materialId);
  assert.ok(m.wild.dusk);
  const atDusk = gatherPlan(st, shade, m);
  st.customerIndex = 1; st.opened = true;
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
  st.customerIndex = 1; st.opened = true;
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

test('what spoils is cut all the same, and careful hands leave a reserve to regrow', () => {
  const st = fresh('gather-2');
  st.customerIndex = 1; st.opened = true;
  const chalk = depositOf(st, 'riverchalk');
  const now = 2_000_000;
  const plan = gatherPlan(st, chalk, st.lookup(chalk.materialId));
  assert.equal(plan.eff, 0.5, 'by hand, half of what is dug is lost');
  assert.equal(plan.reserve, Math.round(chalk.capacity * CAREFUL_RESERVE));
  let got = 0, last;
  for (let k = 0; k < 50; k++) {
    st.inventory[chalk.materialId] = 0; // shelf room is not what is tested
    const can = harvestable(st.gathering, chalk, plan, now);
    last = st.gather(chalk.id, { now });
    if (!last.ok) { assert.equal(can, 0, 'the button agreed nothing was left'); break; }
    assert.equal(last.amount, can, 'the button promised what was gathered');
    got += last.amount;
  }
  assert.equal(last.ok, false);
  assert.equal(last.reason, 'reserve');
  const left = depositStatus(st.gathering, chalk, now).stock;
  assert.ok(left >= plan.reserve - 1e-6, 'the reserve stands');
  assert.ok(got <= (chalk.capacity - plan.reserve) * plan.eff + 1e-6, 'no more than the deposit gave, after spoilage');
  // a thorough harvest may take the reserve
  const r = st.gather(chalk.id, { now, thorough: true });
  assert.ok(r.ok);
  // with the Forager's Kit, nothing is spoiled
  const st2 = fresh('gather-2');
  st2.customerIndex = 1; st2.opened = true;
  st2.equipment.push('kit');
  assert.equal(gatherPlan(st2, chalk, st2.lookup(chalk.materialId)).eff, 1);
});

test('the night after a rainy day regrows the plants', () => {
  const st = fresh('gather-rain');
  let day = 1;
  while (day < 200 && weatherOn(st.seed, day).id !== 'rain') day++;
  assert.ok(day < 200);
  st.day = day;
  const leaf = depositOf(st, 'silverleaf');
  st.gathering.nodes[leaf.id] = { stock: 0, at: Date.now() };
  st.current = null;
  st.endDay();
  assert.equal(st.gathering.nodes[leaf.id], undefined, 'the rain that fell today fills the plants tonight');
});
