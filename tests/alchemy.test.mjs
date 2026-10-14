// Magic — measured on the real simulation, never on labels: proportions,
// extraction and steeping, fading, super transitions and their averaged
// thresholds, heat-assisted mixing.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWorld, makeLookup, INGREDIENT_SPECS } from '../src/materials/generator.js';
import { Simulation } from '../src/simulation/world.js';
import { PHASE } from '../src/simulation/constants.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { PROP_INDEX, NP, magicVector, magicWeight, thresholds, SUPER_GAIN } from '../src/alchemy/magic.js';
import { SpeciesTable, MAX_SPECIES } from '../src/reactions/species.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { compatFactorT, fullMixTemperature } from '../src/reactions/compatibility.js';
import { predictPlan } from '../src/game/predict.js';

const SEED = 'magic-tests-1';
const world = generateWorld(SEED);
const lookup = makeLookup(world);
const P = PROP_INDEX;

function sim() {
  const s = new Simulation({ size: 'pot', lookup });
  Object.assign(s.furnace, { maxFlame: 520, heatPower: 5.5, minCool: -70, coolPower: 9 });
  return s;
}
function pour(s, id, n, opts = {}) {
  s.emitter.start(lookup(id), { x: opts.x ?? 0, amount: n, ground: opts.ground });
  let g = 0;
  while (s.emitter.pouring && g++ < 20000) s.step();
}
function stir(s, sec) {
  const t = s.tool; t.type = 'spoon';
  const c = s.cauldron, cy = c.depth - 0.45;
  for (let k = 0; k < Math.round(sec * 120); k++) {
    const a = (k / 120) * 2.6;
    t.setTarget(Math.cos(a) * c.halfWidth(cy) * 0.6, cy + Math.sin(a) * 0.25, true);
    s.advance(1 / 120, 1, 2);
  }
  t.setTarget(0, cy, false);
  s.advance(1 / 120, 1, 2);
}
function meanT(s) {
  let T = 0, n = 0;
  for (let i = 0; i < s.p.count; i++) if (s.p.phase[i] !== PHASE.GAS) { T += s.p.temp[i]; n++; }
  return n ? T / n : 20;
}
/**
 * Heat (or chill) while stirring until the brew's mean temperature reaches a
 * target. Like a careful alchemist, the flame is kept near the target so the
 * iron at the bottom does not scorch the brew.
 */
function bring(s, target, maxSec = 90) {
  for (let t = 0; t < maxSec; t += 1) {
    const T = meanT(s);
    if (Math.abs(T - target) < 2) break;
    let set = Math.max(-1, Math.min(1, (target - T) / 12));
    if (set > 0) set = Math.min(set, Math.max(0.05, (target + 40 - 20) / (s.furnace.maxFlame - 20)));
    s.furnace.setting = set;
    stir(s, 1);
  }
  s.furnace.setting = 0;
}
function tap(s, n = 30) {
  return measureParticles(s, tapSelection(s, n));
}

test('the garden world: water has no magic, every other ingredient has a magic vector and two thresholds; most transitions are out of reach', () => {
  assert.equal(world.ingredients.length, INGREDIENT_SPECS.length);
  const water = lookup(world.roles.water);
  assert.equal(magicWeight(water), 0);
  assert.equal(water.form, 'liquid');
  const liquids = world.ingredients.map(lookup).filter((m) => m.kind === 'liquid');
  const stones = world.ingredients.map(lookup).filter((m) => m.kind === 'stone');
  assert.ok(liquids.length >= 3 && stones.length >= 5, 'a few magical liquids and several stones');
  for (const m of [...liquids, ...stones]) {
    assert.ok(magicWeight(m) > 40, `${m.name} carries magic`);
    assert.ok(Number.isFinite(m.fadeT) && Number.isFinite(m.superT) && P[m.superKey] !== undefined, `${m.name} has its thresholds`);
    // the description is magic, not chemistry
    assert.ok(!/densit|viscos|boil|melt|g\/ml|cP/i.test(m.description), m.description);
  }
  for (const s of stones) assert.ok(s.form === 'solid' && s.crushable, 'stones are gathered whole');
  const reachable = [...liquids, ...stones].filter((m) => m.superT > -75 && m.superT < 130);
  assert.ok(reachable.length >= 1 && reachable.length <= 3, 'only a few transitions are reachable alone');
  // same seed, same world; another seed, other numbers
  assert.deepEqual(generateWorld(SEED), world);
  assert.notDeepEqual(generateWorld('other-seed').materials.map((m) => m.magic), world.materials.map((m) => m.magic));
});

test('proportions: a 1:1 blend of dew and water carries half the dew’s magic', () => {
  const s = sim();
  pour(s, world.roles.water, 30);
  pour(s, world.roles.dew, 30);
  stir(s, 8);
  const m = tap(s, 40);
  const dew = magicVector(lookup(world.roles.dew));
  for (let k = 0; k < NP; k++) assert.ok(Math.abs(m.magic[k] - dew[k] / 2) <= Math.max(1.5, dew[k] * 0.08), `property ${k}: ${m.magic[k]} vs ${dew[k] / 2}`);
});

test('extraction: a whole stone does nothing, powder gives a little, a hot steep draws much more — and keeps it once cooled', () => {
  const sun = lookup(world.roles.sunstone);
  const whole = sim();
  pour(whole, world.roles.water, 45);
  pour(whole, sun.id, 12);
  stir(whole, 6);
  const w = tap(whole, 40);
  assert.ok(w.magic[P.ardor] < 1, `a whole stone stays in its chunk (${w.magic[P.ardor]})`);
  const ground = sim();
  pour(ground, world.roles.water, 45);
  pour(ground, sun.id, 12, { ground: true });
  stir(ground, 8);
  const cold = tap(ground, 40).magic[P.ardor];
  bring(ground, 85);
  bring(ground, 22);
  const steeped = tap(ground, 40);
  const full = (12 / 57) * sun.magic.ardor;
  assert.ok(cold > 1 && cold < full * 0.75, `cold powder gives some (${cold.toFixed(1)} of ${full.toFixed(1)})`);
  assert.ok(steeped.magic[P.ardor] > cold * 1.4, `a hot steep draws more (${steeped.magic[P.ardor].toFixed(1)} vs ${cold.toFixed(1)})`);
  assert.ok(steeped.temperature < 30, 'measured after cooling');
});

test('overheating fades magic; the same brew kept below its fading point keeps it', () => {
  const dew = lookup(world.roles.dew);
  const make = () => { const s = sim(); s.cauldron.lidClosed = true; pour(s, world.roles.water, 25); pour(s, dew.id, 25); stir(s, 6); return s; };
  const safe = make();
  bring(safe, dew.fadeT - 15);
  bring(safe, 25);
  const hot = make();
  hot.furnace.maxFlame = 340;
  bring(hot, 96, 120);
  stir(hot, 12);
  bring(hot, 25);
  const a = tap(safe, 30), b = tap(hot, 30);
  assert.ok(a.vig > 0.97, `kept below its fading point (${a.vig.toFixed(3)})`);
  assert.ok(b.vig < 0.85 && b.magic[P.vitality] < a.magic[P.vitality] * 0.9, `overheated: ${b.magic[P.vitality].toFixed(1)} vs ${a.magic[P.vitality].toFixed(1)} (vigour ${b.vig.toFixed(2)})`);
});

test('the super transition: past its threshold, witch oil’s whole magic pours into one property', () => {
  const oil = lookup(world.roles.witchoil);
  assert.ok(oil.superT > 50 && oil.superT < 110);
  const s = sim();
  s.cauldron.lidClosed = true;
  pour(s, oil.id, 30);
  stir(s, 4);
  const before = tap(s, 25);
  assert.ok(before.magic[P.bane] > 20 && before.ss < 0.01);
  bring(s, oil.superT + 8, 120);
  stir(s, 10);
  bring(s, 25, 120);
  const after = tap(s, 25);
  const key = P[oil.superKey];
  const sum = magicWeight(oil);
  assert.ok(after.ss > 0.9, `transmuted (${after.ss.toFixed(2)})`);
  assert.ok(after.magic[key] > Math.min(95, sum * SUPER_GAIN) * 0.85, `${oil.superKey} soars: ${after.magic[key].toFixed(1)}`);
  for (let k = 0; k < NP; k++) if (k !== key) assert.ok(after.magic[k] < 4, `property ${k} emptied (${after.magic[k].toFixed(1)})`);
});

test('mixing averages the thresholds (by magic): two unreachable transitions make a reachable one', () => {
  const dew = lookup(world.roles.dew), heart = lookup(world.roles.heartstone);
  assert.ok(dew.superT < -300 && heart.superT > 500, 'neither can transmute alone');
  // the share of heartstone magic that puts the blend's threshold at -12°C
  const target = -12;
  const wd = magicWeight(dew), wh = magicWeight(heart);
  const x = (target - dew.superT) / (heart.superT - dew.superT); // heart's share of the magic weight
  const nTotal = 36;
  const nHeart = Math.round((x / wh) / (x / wh + (1 - x) / wd) * nTotal);
  const plan = { ingredients: [{ id: dew.id, n: nTotal - nHeart }, { id: heart.id, n: nHeart, ground: true }], heatTo: 55, coolTo: target - 10, serveTemp: 20, knead: true, stir: 16, hold: 30 };
  const sp = new SpeciesTable();
  const comp = new Float32Array(MAX_SPECIES);
  comp[sp.ensure(dew)] = (nTotal - nHeart) / nTotal;
  comp[sp.ensure(heart)] = nHeart / nTotal;
  const thr = thresholds(sp, comp, 0);
  assert.ok(Math.abs(thr.super - target) < 6, `the blend's threshold is ${thr.super.toFixed(1)}°C`);
  const s = sim();
  runPlanHeadless(s, plan, lookup);
  const m = tap(s, 25);
  const key = thr.key;
  assert.ok(m.ss > 0.6, `the blend transmuted when chilled (${m.ss.toFixed(2)})`);
  const others = m.magic.reduce((a, v, k) => (k === key ? a : a + v), 0);
  assert.ok(m.magic[key] > others * 2, `${m.magic.map((v) => v.toFixed(0))} concentrates in property ${key}`);
  // and the prediction agrees on what it becomes
  const pred = predictPlan(world, lookup, plan);
  assert.equal(pred.magic.indexOf(Math.max(...pred.magic)), key);
});

test('heat helps mixing: witch oil keeps apart from water while cold, blends when hot, and stays blended', () => {
  const oil = lookup(world.roles.witchoil), water = lookup(world.roles.water);
  assert.equal(compatFactorT(oil.compat[0], oil.compat[1], water.compat[0], water.compat[1], 20), 0, 'immiscible at room temperature');
  const tMix = fullMixTemperature(oil.compat, water.compat);
  assert.ok(tMix > 40 && tMix < oil.superT, `blends fully at ${tMix.toFixed(0)}°C, below its transition`);
  const blended = (s) => {
    const sw = s.species.slotOf.get(water.id), so = s.species.slotOf.get(oil.id);
    let both = 0;
    for (let i = 0; i < s.p.count; i++) if (s.p.comp[i * MAX_SPECIES + sw] > 0.2 && s.p.comp[i * MAX_SPECIES + so] > 0.2) both++;
    return both / s.p.count;
  };
  const s = sim();
  s.cauldron.lidClosed = true;
  pour(s, water.id, 30);
  pour(s, oil.id, 30);
  stir(s, 12);
  const cold = blended(s);
  bring(s, Math.min(oil.superT - 6, tMix + 4), 120);
  stir(s, 14);
  bring(s, 22, 120);
  stir(s, 4);
  const after = blended(s);
  assert.ok(cold < 0.15, `cold and stirred, they keep apart (${cold.toFixed(2)})`);
  assert.ok(after > 0.5, `heated, they blend — and stay blended once cooled (${after.toFixed(2)})`);
});

test('the magic state travels with the matter: stirring evens out a partly faded brew without creating magic', () => {
  const s = sim();
  pour(s, world.roles.water, 20);
  pour(s, world.roles.dew, 30);
  stir(s, 6);
  // fade half of the particles by hand, then stir
  const p = s.p;
  let before = 0;
  for (let i = 0; i < p.count; i++) { if (i % 2) p.vig[i] = 0.4; before += p.vig[i] * p.mw[i]; }
  stir(s, 10);
  let after = 0, lo = 1, hi = 0;
  for (let i = 0; i < p.count; i++) { after += p.vig[i] * p.mw[i]; if (p.phase[i] !== PHASE.GAS) { lo = Math.min(lo, p.vig[i]); hi = Math.max(hi, p.vig[i]); } }
  assert.ok(Math.abs(after - before) / before < 0.03, `faded magic is conserved (${before.toFixed(2)} → ${after.toFixed(2)})`);
  assert.ok(hi - lo < 0.25, `and evened out (${lo.toFixed(2)}–${hi.toFixed(2)})`);
});
