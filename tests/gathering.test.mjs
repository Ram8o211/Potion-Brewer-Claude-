// Gathering depth: methods and tools, the hour, the weather, careful or
// thorough harvests; plants that sprout, ripen and mature, the marks a
// harvest leaves and the stands growing back to saturation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { gatherPlan, dayPart, weatherOn, WEATHERS, depositStatus, normalizeGathering, SCAR_SLOWDOWN, weatherRegrowth, harvestable, standOf, plantStage, marksIn, MARK_MS, SPROUT_SHARE, REGIONS } from '../src/game/gathering.js';

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
  const now = Date.now();
  for (const d of [leaf, stone]) st.gathering.nodes[d.id] = { plants: [], due: now + d.spawnMs, seq: d.slots };
  weatherRegrowth(st.gathering, st.deposits, WEATHERS.find((w) => w.id === 'rain'), st.lookup, now);
  const wet = depositStatus(st.gathering, leaf, now);
  assert.equal(wet.mature, leaf.slots, 'rain grows the plants back, every one mature');
  assert.equal(depositStatus(st.gathering, stone, now).plants.length, 0, 'but not the stones');
});

test('a thorough harvest digs the plant out for twice as much and scars the stand until it is saturated', () => {
  const st = fresh();
  st.equipment.push('trowel');
  st.customerIndex = 1; st.opened = true;
  const root = depositOf(st, 'ironroot');
  const careful = gatherPlan(st, root, st.lookup(root.materialId)).take;
  const now = Date.now() + 60 * 60000;
  const r = st.gather(root.id, { thorough: true, now });
  assert.ok(r.ok);
  assert.equal(r.amount, careful * 2);
  const s = depositStatus(st.gathering, root, now);
  assert.ok(s.scarred);
  // the next sprout comes at half pace
  assert.equal(st.gathering.nodes[root.id].due, now + root.spawnMs * SCAR_SLOWDOWN);
  assert.equal(standOf(st.gathering, root, now + root.spawnMs * 1.5).plants.length, s.plants.length, 'not yet');
  assert.equal(standOf(st.gathering, root, now + root.spawnMs * SCAR_SLOWDOWN).plants.length, s.plants.length + 1);
  // the scar is saved
  const g = normalizeGathering(JSON.parse(JSON.stringify(st.gathering)), now);
  assert.equal(g.nodes[root.id].scar, true);
  // saturated again, the scar is gone
  assert.equal(depositStatus(st.gathering, root, now + root.spawnMs * SCAR_SLOWDOWN * root.slots).scarred, false);
});

test('plants sprout, ripen and mature; only a mature one can be harvested', () => {
  const st = fresh('gather-2');
  st.customerIndex = 1; st.opened = true;
  st.equipment.push('kit');
  const chalk = depositOf(st, 'riverchalk');
  const t0 = Date.now() + 60 * 60000;
  const s0 = depositStatus(st.gathering, chalk, t0);
  assert.equal(s0.plants.length, chalk.slots, 'an untouched stand is saturated');
  assert.ok(s0.mature >= 1, 'and something in it is mature');
  const plan = gatherPlan(st, chalk, st.lookup(chalk.materialId));
  assert.equal(plan.eff, 1, 'with the Forager’s Kit nothing is spoiled');
  // harvest every mature plant: each gives what the button promised
  let got = 0, last;
  for (let k = 0; k < 20; k++) {
    const can = harvestable(st.gathering, chalk, plan, t0);
    last = st.gather(chalk.id, { now: t0 });
    if (!last.ok) { assert.equal(can, 0, 'the button agreed nothing was mature'); break; }
    assert.equal(last.amount, can);
    got += last.amount;
  }
  assert.equal(last.ok, false);
  assert.equal(last.reason, 'depleted');
  assert.equal(got, s0.mature * plan.take, 'one harvest per mature plant');
  // a sprout comes up after spawnMs at a random spot, and cannot be taken until it matures
  const t1 = t0 + chalk.spawnMs;
  const s1 = standOf(st.gathering, chalk, t1);
  const kid = s1.plants.find((p) => p.born === t1);
  assert.ok(kid, 'a new sprout');
  assert.equal(plantStage(chalk, kid, t1).stage, 'sprout');
  assert.equal(plantStage(chalk, kid, t1 + chalk.growMs * SPROUT_SHARE + 1).stage, 'ripe');
  assert.equal(plantStage(chalk, kid, t1 + chalk.growMs).stage, 'mature');
  const early = st.gather(chalk.id, { now: t1 + chalk.growMs / 2, plant: kid.id });
  assert.equal(early.reason, 'growing', 'a ripe plant is not ready');
  assert.ok(Math.abs(early.nextIn - chalk.growMs / 2) < 2);
  const ok = st.gather(chalk.id, { now: t1 + chalk.growMs, plant: kid.id });
  assert.ok(ok.ok, 'a mature one is');
  assert.equal(ok.plant, kid.id);
  assert.equal(st.gather(chalk.id, { now: t1 + chalk.growMs, plant: kid.id }).reason, 'gone');
});

test('a harvest leaves a mark that fades; new sprouts grow back at random spots until the region is saturated', () => {
  const st = fresh('gather-3');
  st.customerIndex = 1; st.opened = true;
  const t0 = Date.now() + 60 * 60000;
  const forest = st.deposits.filter((d) => d.region === 'forest' && d.rank <= st.rank);
  const d = forest[0];
  const before = standOf(st.gathering, d, t0);
  const r = st.gather(d.id, { now: t0 });
  assert.ok(r.ok);
  const gone = before.plants.find((p) => p.id === r.plant);
  const marks = marksIn(st.gathering, 'forest', t0);
  assert.equal(marks.length, 1);
  assert.deepEqual([marks[0].x, marks[0].y], [gone.x, gone.y], 'the mark is where the plant stood');
  assert.equal(marks[0].key, st.lookup(d.materialId).wild.key);
  assert.ok(marksIn(st.gathering, 'forest', t0 + MARK_MS / 2)[0].faded > 0.4, 'it fades');
  assert.equal(marksIn(st.gathering, 'forest', t0 + MARK_MS).length, 0, 'and disappears');
  assert.equal(marksIn(st.gathering, 'meadow', t0).length, 0, 'only in its own region');
  // strip the stand, then let it grow back: never past its slots, at new spots
  while (st.gather(d.id, { now: t0 }).ok);
  const later = standOf(st.gathering, d, t0 + d.spawnMs * (d.slots + 5));
  assert.equal(later.plants.length, d.slots, 'saturated, and no further');
  assert.equal(later.due, null, 'it stops sprouting');
  const spots = new Set(later.plants.map((p) => `${p.x},${p.y}`));
  assert.equal(spots.size, d.slots, 'each sprout at its own spot');
  for (const p of later.plants) {
    assert.ok(!before.plants.some((q) => q.x === p.x && q.y === p.y), 'not where the old plants stood');
    assert.ok(p.x > 0 && p.x < 1 && p.y >= 0.5 && p.y <= 0.92, 'on the ground');
  }
  // the region's saturation is the sum of its stands' slots, with every ingredient represented
  for (const region of REGIONS) {
    const ds = st.deposits.filter((x) => x.region === region.id);
    const total = ds.reduce((a, x) => a + standOf(st.gathering, x, t0 + 1e9).plants.length, 0);
    assert.equal(total, ds.reduce((a, x) => a + x.slots, 0), `${region.id} saturates`);
    assert.ok(total <= 16, `${region.id}: no more than the ground holds (${total})`);
  }
  // harvested again, it starts growing back again
  const again = st.gather(d.id, { now: t0 + d.spawnMs * (d.slots + 5) + d.growMs * 2 });
  assert.ok(again.ok);
  assert.ok(st.gathering.nodes[d.id].due !== null, 'sprouting again');
  // plants and marks survive a save
  const back = normalizeGathering(JSON.parse(JSON.stringify(st.gathering)), t0 + 1e9);
  assert.deepEqual(back.nodes[d.id].plants, st.gathering.nodes[d.id].plants);
  assert.equal(back.created, st.gathering.created);
});

test('an old save’s stock-in-ml stands start afresh, saturated', () => {
  const g = normalizeGathering({ nodes: { 'forest:ironroot:0': { stock: 10, at: 5 } }, created: 100 }, 1000);
  assert.deepEqual(g.nodes, {});
  assert.equal(g.created, 100);
  assert.deepEqual(g.marks, []);
});

test('the night after a rainy day regrows the plants', () => {
  const st = fresh('gather-rain');
  let day = 1;
  while (day < 200 && weatherOn(st.seed, day).id !== 'rain') day++;
  assert.ok(day < 200);
  st.day = day;
  const leaf = depositOf(st, 'silverleaf');
  st.gathering.nodes[leaf.id] = { plants: [], due: Date.now() + leaf.spawnMs, seq: leaf.slots };
  st.current = null;
  st.endDay();
  assert.equal(depositStatus(st.gathering, leaf).mature, leaf.slots, 'the rain that fell today grows the plants back tonight');
});
