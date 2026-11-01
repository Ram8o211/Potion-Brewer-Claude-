// Kinds of animal: cats, toads and fire salamanders live in the wilds beside
// the rabbits, each moving in its own way; caught, they join the hutch, breed
// only with their own kind, and each reads one effect almost exactly alike
// from one animal to the next (a cat's arcana), so that effect is pinned
// down in a few trials.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Warren } from '../src/game/wild-rabbits.js';
import { KINDS, HABITAT, kindOf, biasSpread, pickKind, kindLook, STEADY_SPREAD } from '../src/game/kinds.js';
import { createColony, addWildRabbit, rabbitSensitivity, inheritLook, normalizeColony, colonyDay, rollLook } from '../src/game/colony.js';
import { rabbitReading, summarize } from '../src/game/experiments.js';
import { NE, EFFECT_INDEX } from '../src/alchemy/effects.js';
import { Rng } from '../src/core/rng.js';
import { rabbitAnchors, RABBIT_W, RABBIT_H } from '../src/rendering/rabbit.js';

const W = 400, H = 120, FLOOR = 100;
const field = (kind) => new Warren('meadow', `kinds-${kind}`, {
  W, H, solid: (x, y) => y >= FLOOR, liquid: () => false,
  spots: Array.from({ length: 30 }, (_, i) => [40 + i * 10, FLOOR - 1]),
  habitat: [[kind, 1]],
});

/** Watch a warren for `sec` seconds: time spent in the air, walking, the longest flight, the ground speed. */
function watch(w, sec, alarm = false) {
  if (alarm) for (const r of w.rabbits) w.scare(r, r.x - 20);
  let air = 0, walk = 0, steps = 0, dist = 0, maxFlight = 0;
  const flight = new Map();
  const last = new Map(w.rabbits.map((r) => [r, r.x]));
  for (let t = 0; t < sec; t += 1 / 60) {
    w.step(1 / 60);
    for (const r of w.rabbits) {
      assert.ok(r.y <= FLOOR - 1 + 1e-6, `${r.kind} never sinks into the ground`);
      steps++;
      if (r.air) { air++; flight.set(r, (flight.get(r) || 0) + 1 / 60); } else { maxFlight = Math.max(maxFlight, flight.get(r) || 0); flight.set(r, 0); }
      if (r.walking) walk++;
      dist += Math.abs(r.x - /** @type {number} */ (last.get(r)));
      last.set(r, r.x);
    }
  }
  return { air: air / steps, walk: walk / steps, maxFlight, speed: dist / (sec * w.rabbits.length) };
}

test('every kind lives where its habitat says, and the wilds hold more than rabbits', () => {
  const rng = new Rng(5);
  for (const [region, h] of Object.entries(HABITAT)) {
    const seen = new Set();
    for (let i = 0; i < 200; i++) seen.add(pickKind(region, rng));
    assert.deepEqual([...seen].sort(), h.map((x) => x[0]).sort(), region);
  }
  const all = new Set(Object.values(HABITAT).flatMap((h) => h.map((x) => x[0])));
  for (const k of Object.keys(KINDS)) assert.ok(all.has(k), `${k} lives somewhere`);
  assert.ok(HABITAT.river.some(([k]) => k === 'toad') && HABITAT.quarry.some(([k]) => k === 'salamander'));
});

test('each kind moves in its own way: rabbits bound, cats stroll and pounce, toads squat and hop short, salamanders creep', () => {
  const rabbit = watch(field('rabbit'), 30), cat = watch(field('cat'), 30), toad = watch(field('toad'), 30), sal = watch(field('salamander'), 30);
  assert.equal(rabbit.walk, 0, 'rabbits never walk: they hop');
  assert.ok(rabbit.air > 0.05);
  assert.ok(cat.walk > 0.2, `cats stroll about (${cat.walk.toFixed(2)})`);
  assert.ok(cat.air < rabbit.air, 'and leap less than rabbits hop');
  assert.equal(toad.walk, 0, 'toads hop, never walk');
  assert.ok(toad.air > 0 && toad.air < rabbit.air, `toads sit more than they hop (${toad.air.toFixed(3)} vs ${rabbit.air.toFixed(3)})`);
  assert.ok(toad.maxFlight < rabbit.maxFlight, 'and their hops are shorter');
  assert.equal(sal.air, 0, 'salamanders never leave the ground');
  assert.ok(sal.walk > 0.2, `salamanders creep along (${sal.walk.toFixed(2)})`);
  assert.ok(sal.speed < cat.speed, 'slower than a strolling cat');
  // frightened, each makes off far faster than it moved calmly
  for (const [k, calm] of [['cat', cat], ['toad', toad], ['salamander', sal]]) {
    const fled = watch(field(/** @type {any} */ (k)), 3, true);
    assert.ok(fled.speed > calm.speed * 3, `${k} flees (${fled.speed.toFixed(1)} vs ${calm.speed.toFixed(1)} px/s)`);
  }
});

test('a walking animal follows small steps of ground and turns back at a drop or water', () => {
  const step = (x, y) => y >= (x > 200 ? FLOOR - 2 : FLOOR) || (x > 300 && x < 320);
  const w = new Warren('meadow', 'steps', { W, H, solid: step, liquid: (x, y) => x > 340 && y >= FLOOR - 1, spots: [[180, FLOOR - 1]], habitat: [['salamander', 1]] });
  for (const r of w.rabbits) { r.face = 1; r.walkT = 30; r.walkV = 8; }
  for (let t = 0; t < 30; t += 1 / 60) {
    w.step(1 / 60);
    for (const r of w.rabbits) {
      assert.ok(!step(Math.round(r.x), Math.round(r.y)), 'its feet are never inside the ground');
      assert.ok(r.x < 341, 'it never walks into the water');
    }
  }
});

test('caught, a cat stays a cat: in the hutch, through a save, and in its kittens', () => {
  const rng = new Rng(9);
  const c = createColony('kinds');
  const tom = addWildRabbit(c, { day: 10, look: kindLook('cat', rng), sex: 'm', health: 90 });
  const queen = addWildRabbit(c, { day: 10, look: kindLook('cat', rng), sex: 'f', health: 90 });
  const toad = addWildRabbit(c, { day: 10, look: kindLook('toad', rng), sex: 'm', health: 90 });
  assert.equal(kindOf(tom.look), 'cat');
  assert.equal(kindOf(toad.look), 'toad');
  const back = normalizeColony(JSON.parse(JSON.stringify(c)));
  assert.deepEqual(back.rabbits.map((r) => kindOf(r.look)), c.rabbits.map((r) => kindOf(r.look)), 'the kind survives a save');
  assert.equal(back.rabbits.find((r) => r.id === tom.id).look.ear, 'cat');
  for (let i = 0; i < 20; i++) {
    assert.equal(kindOf(inheritLook(queen.look, tom.look, rng)), 'cat', 'a cat has kittens');
    assert.equal(kindOf(inheritLook(queen.look, toad.look, rng)), 'cat', 'the mother decides');
  }
  // only matching kinds conceive overnight: a doe rabbit with a buck rabbit does, with a buck toad never
  const pairing = (buckLook) => {
    const c2 = createColony('kinds-2');
    c2.rabbits = c2.rabbits.filter((r) => r.sex === 'f');
    addWildRabbit(c2, { day: 20, look: buckLook, sex: 'm', health: 100 });
    let conceived = 0;
    for (let d = 21; d < 40; d++) { conceived += colonyDay(c2, { day: d, cap: 20 }).conceived; for (const r of c2.rabbits) if (r.alive) r.health = 100; }
    return conceived;
  };
  assert.ok(pairing(rollLook(new Rng(9))) > 0, 'a rabbit pair breeds');
  assert.equal(pairing(kindLook('toad', new Rng(9))), 0, 'no rabbit-toad young');
});

test('cats read arcana almost exactly alike, rabbits do not; on other channels a cat is an ordinary animal', () => {
  const rng = new Rng(21);
  const c = createColony('steady');
  const cats = [], buns = [];
  for (let i = 0; i < 40; i++) {
    cats.push(addWildRabbit(c, { day: 10, look: kindLook('cat', rng), sex: 'f', health: 100 }));
    buns.push(addWildRabbit(c, { day: 10, look: { ...kindLook('cat', rng), kind: undefined, ear: 'upright', pattern: 'solid', eye: 'dark' }, sex: 'f', health: 100 }));
  }
  const sd = (xs) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length; return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1)) / m; };
  const catArc = sd(cats.map((r) => rabbitSensitivity(r, 'arcana'))), bunArc = sd(buns.map((r) => rabbitSensitivity(r, 'arcana')));
  const catVit = sd(cats.map((r) => rabbitSensitivity(r, 'vitality')));
  assert.ok(catArc < 0.025, `cats' arcana sensitivity barely varies (${catArc.toFixed(3)})`);
  assert.ok(bunArc > 0.06, `rabbits' does (${bunArc.toFixed(3)})`);
  assert.ok(catVit > 0.06, `cats' vitality varies like anyone's (${catVit.toFixed(3)})`);
  assert.equal(biasSpread({ kind: 'toad' }, 'toxicity'), STEADY_SPREAD);
  assert.equal(biasSpread({ kind: 'salamander' }, 'fire'), STEADY_SPREAD);
  for (const k of Object.values(KINDS)) if (k.steady) assert.ok(biasSpread({ kind: k.id }, k.steady) < biasSpread({}, k.steady) / 5, `${k.id} is steady on ${k.steady}`);
  // readings of one potion over many cats and doses: tight; over rabbits: loose
  const e = new Array(NE).fill(0); e[EFFECT_INDEX.arcana] = 20;
  const read = (rs) => rs.map((r, i) => rabbitReading(r, e, { ml: 10, day: 30, salt: `s${i}` })[EFFECT_INDEX.arcana]);
  const rc = sd(read(cats)), rb = sd(read(buns));
  assert.ok(rc < rb / 3, `cat readings spread ${rc.toFixed(3)}, rabbit readings ${rb.toFixed(3)}`);
});

test('arcana measured on cats is certified sooner, and with a narrower margin', () => {
  const s = (v, r, b) => ({ v, r, rec: `${r}${v}`, e: 1, ...(b ? { b, f: 0.3 } : {}) });
  const onCat = summarize({ arcana: [s(20.1, 'c1', STEADY_SPREAD), s(19.9, 'c1', STEADY_SPREAD), s(20, 'c1', STEADY_SPREAD)] });
  const onBun = summarize({ arcana: [s(21, 'b1'), s(18.5, 'b1'), s(20.4, 'b1')] });
  assert.equal(onBun.level.arcana, 'repeated', 'one rabbit\'s bias stays in the mean');
  assert.equal(onCat.level.arcana, 'certified', 'one cat is as good as many for arcana');
  assert.ok(onCat.unc.arcana < onBun.unc.arcana / 2, `margin ${onCat.unc.arcana} vs ${onBun.unc.arcana}`);
});

test('every kind is drawn inside its frame in every pose', () => {
  const rng = new Rng(3);
  const snap = (alive) => ({ stage: 'adult', hp: 0, alive, preg: false, lv: new Array(11).fill(0), sc: [0, 0, 0, 0, 0], traits: [], cause: alive ? null : 'hunted' });
  for (const kind of ['cat', 'toad', 'salamander']) {
    for (let n = 0; n < 6; n++) {
      const look = { ...kindLook(/** @type {any} */ (kind), rng), size: n % 2 ? 1.15 : 0.85 };
      for (const pose of ['idle', 'walk1', 'walk2', 'eat', 'rear', 'loaf', 'hop', 'hurt', undefined]) {
        const a = rabbitAnchors(look, snap(pose !== undefined), pose);
        assert.equal(a.kind, kind);
        assert.ok(a.box.x0 >= -1 && a.box.x1 <= RABBIT_W && a.box.y0 >= -1 && a.box.y1 <= RABBIT_H, `${kind} ${pose} ${JSON.stringify(a.box)}`);
      }
    }
  }
});
