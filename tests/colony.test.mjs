// The rabbit colony model: individuals, every effect visible and combinable,
// mortality, fading marks, permanent traits, growth, breeding within the
// hutch's room, legacy conversion and no numbers leaking into words.
import test from 'node:test';
import assert from 'node:assert/strict';
import { NE, EFFECT_INDEX, EFFECT_KEYS } from '../src/alchemy/effects.js';
import {
  createColony, normalizeColony, rabbitResponse, colonyDay, rabbitSnap, encodeSnap, decodeSnap, defaultSnap, stageOf, rabbitCondition,
  RABBIT_MARKS, MARK_INDEX, MARK_DECAY, TRAIT_AT, TRAIT_EXCLUSIVE, livingRabbits, findRabbit, makeRabbit, rollLook, addBoughtRabbit, retireRabbit,
  installRabbitAlias, related, trimMemorial, pickName, NAMES, MEMORIAL_LIMIT,
} from '../src/game/colony.js';
import { createTrials } from '../src/game/experiments.js';
import { Rng } from '../src/core/rng.js';

const fx = (o) => { const e = new Array(NE).fill(0); for (const [k, v] of Object.entries(o)) e[EFFECT_INDEX[k]] = v; return e; };

test('a new hutch: two founders, the same in every game; the old rabbit handle points at the selected one', () => {
  const a = createColony(), b = createColony();
  assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));
  assert.deepEqual(a.rabbits.map((r) => [r.id, r.name, r.sex]), [['r1', 'Clover', 'f'], ['r2', 'Bramble', 'm']]);
  assert.equal(stageOf(a.rabbits[0], 1), 'adult');
  const t = createTrials();
  assert.ok(!Object.keys(t.subjects).includes('rabbit'), 'not enumerable');
  assert.ok(!('rabbit' in JSON.parse(JSON.stringify(t)).subjects), 'never saved twice');
  assert.equal(t.subjects.rabbit.id, 'r1');
});

test('every channel acts on a rabbit and shows, and the response is pure', () => {
  for (const key of EFFECT_KEYS) {
    for (const sign of key === 'acidity' ? [1, -1] : [1]) {
      const r = createColony().rabbits[0];
      const before = JSON.stringify(r);
      const res = rabbitResponse(r, fx({ [key]: 20 * sign }), 10, { day: 1 });
      assert.equal(JSON.stringify(r), before, 'before is untouched');
      const ch = key === 'acidity' ? (sign > 0 ? 'acid' : 'alkali') : key;
      assert.ok(res.after.marks[ch] > r.marks[ch], `${ch} mark rises`);
      assert.ok(res.observations.some((o) => o.key === key), `${key} is observed`);
      assert.ok(res.react.includes(ch));
    }
  }
});

test('effects combine: love, fire and poison show at once; snapshots round-trip', () => {
  const r = createColony().rabbits[0];
  const res = rabbitResponse(r, fx({ love: 20, fire: 20, toxicity: 10 }), 10, { day: 1 });
  const s = rabbitSnap(res.after, 1);
  for (const k of ['love', 'fire', 'toxicity']) assert.ok(s.lv[MARK_INDEX[k]] >= 1, k);
  assert.deepEqual(decodeSnap(encodeSnap(s)), s);
  assert.deepEqual(decodeSnap('garbage'), defaultSnap());
  assert.deepEqual(decodeSnap(null), defaultSnap());
});

test('mortality: lethal doses kill with a cause, the body stays; lingering poison can kill overnight', () => {
  const c = createColony();
  const r = c.rabbits[0];
  const dead = rabbitResponse(r, fx({ toxicity: 40, death: 30 }), 25, { day: 3 }).after;
  assert.equal(dead.alive, false);
  assert.equal(dead.cause, 'death');
  assert.equal(dead.diedDay, 3);
  assert.equal(rabbitResponse(r, fx({ fire: 60 }), 25, { day: 3 }).after.cause, 'fire');
  assert.equal(rabbitResponse(r, fx({ frost: 60 }), 10, { day: 3 }).after.alive, true, 'deep cold hurts but this is survivable');
  assert.equal(rabbitResponse(r, fx({ frost: 60 }), 25, { day: 3 }).after.cause, 'frost', 'a mark driven to the top is always death');
  assert.equal(rabbitResponse(r, fx({ frost: 70 }), 25, { day: 3 }).after.cause, 'frost');
  assert.equal(rabbitResponse(dead, fx({ vitality: 20 }), 10).after.alive, false, 'the dead stay dead');
  // a sick rabbit with a heavy poison load declines over the days
  const c2 = createColony();
  const s = c2.rabbits[0];
  s.marks.toxicity = 100; s.health = 15;
  let day = 2, died = null;
  for (; day < 10 && s.alive; day++) { const rep = colonyDay(c2, { day, cap: 4 }); if (rep.died.length) died = rep.died[0]; }
  assert.equal(s.alive, false);
  assert.equal(died.cause, 'poison');
  assert.ok(s.scar > 0, 'poison leaves scars');
  assert.ok(c2.rabbits.includes(s), 'the body stays in the hutch');
});

test('marks fade nightly; exposure, scars and traits stay; bodies do not change', () => {
  const c = createColony();
  const [a, b] = c.rabbits;
  for (const k of RABBIT_MARKS) a.marks[k] = 30; // below the lingering-harm line
  a.exposure.fire = 77; a.scar = 12; a.traits = ['horns'];
  b.alive = false; b.marks.love = 50;
  colonyDay(c, { day: 2, cap: 4 });
  for (const k of RABBIT_MARKS) assert.equal(a.marks[k], Math.round(30 * MARK_DECAY[k] * 10) / 10, k);
  assert.equal(a.exposure.fire, 77);
  assert.equal(a.scar, 12);
  assert.deepEqual(a.traits, ['horns']);
  assert.equal(b.marks.love, 50);
});

test('transformation grows permanent traits at thresholds, deterministically, never exclusive pairs', () => {
  const r = createColony().rabbits[0];
  const once = rabbitResponse(r, fx({ transformation: 9 }), 25, { day: 1 }).after; // 22.5 exposure: crosses 20
  assert.equal(once.traits.length, 1);
  assert.deepEqual(rabbitResponse(r, fx({ transformation: 9 }), 25, { day: 1 }).after.traits, once.traits);
  const rng = new Rng('fuzz-traits');
  for (let n = 0; n < 200; n++) {
    let x = createColony().rabbits[rng.int(0, 1)];
    x.id = 'r' + rng.int(1, 999);
    x.look.seed = rng.int(1, 1e6);
    for (let d = 0; d < 12 && x.alive; d++) {
      const dose = {};
      for (const k of EFFECT_KEYS) if (rng.chance(0.4)) dose[k] = rng.range(0, 12);
      dose.transformation = rng.range(5, 12);
      x = rabbitResponse(x, fx(dose), 10, { day: 1 }).after;
    }
    assert.ok(x.traits.length <= TRAIT_AT.length);
    for (const g of TRAIT_EXCLUSIVE) assert.ok(g.filter((t) => x.traits.includes(t)).length <= 1, `exclusive ${g} in ${x.traits}`);
  }
});

test('kits grow up; the young feel doses more strongly', () => {
  const c = createColony();
  const kit = makeRabbit(c, { born: 10, sex: 'f', look: rollLook(new Rng('k')) }, new Rng('n'));
  assert.equal(stageOf(kit, 13), 'kit');
  assert.equal(stageOf(kit, 14), 'young');
  assert.equal(stageOf(kit, 18), 'adult');
  assert.equal(stageOf(kit, 60), 'elder');
  let grown = [];
  for (let d = 11; d <= 18; d++) grown = grown.concat(colonyDay(c, { day: d, cap: 10 }).grown.map((g) => g.id));
  assert.ok(grown.includes(kit.id));
  const adult = createColony().rabbits[0];
  const k2 = { ...adult, born: 10, id: 'r9' };
  const dose = fx({ love: 10 });
  assert.ok(rabbitResponse(k2, dose, 10, { day: 11 }).after.marks.love > rabbitResponse(adult, dose, 10, { day: 11 }).after.marks.love);
});

test('breeding: deterministic, never beyond the hutch, never when poisoned or switched off, never with kin', () => {
  const run = (cap, breed = true) => {
    const c = createColony('seed-x');
    c.breed = breed;
    let max = 0;
    for (let d = 2; d < 30; d++) {
      c.fedDay = d - 1;
      colonyDay(c, { day: d, cap });
      max = Math.max(max, livingRabbits(c).length);
      for (const r of c.rabbits) if (r.alive && r.health < 70) r.health = 90;
    }
    return { c, max };
  };
  const a = run(4), b = run(4);
  assert.equal(JSON.stringify(a.c), JSON.stringify(b.c));
  assert.ok(a.max <= 4);
  assert.ok(a.c.rabbits.length > 2, 'kits were born');
  assert.ok(run(10).max <= 10);
  assert.equal(run(10, false).c.rabbits.length, 2, 'no breeding when switched off');
  for (const r of a.c.rabbits) assert.ok(r.look.size >= 0.85 && r.look.size <= 1.15);
  // a poisoned doe never conceives
  const p = createColony('p');
  p.rabbits[0].marks.toxicity = 40;
  for (let d = 2; d < 12; d++) { colonyDay(p, { day: d, cap: 10 }); p.rabbits[0].marks.toxicity = 40; p.rabbits[0].health = 90; }
  assert.equal(p.rabbits[0].pregnant, null);
  // kin
  const kin = createColony();
  const kid = makeRabbit(kin, { born: -20, sex: 'm', look: rollLook(new Rng('q')), parents: ['r1', 'r2'] }, new Rng('z'));
  assert.ok(related(kin.rabbits[0], kid));
  assert.ok(!related(kin.rabbits[0], kin.rabbits[1]));
});

test('legacy: an old single rabbit becomes the founder, keeps its state and history; idempotent', () => {
  const records = [
    { id: 't2', serial: 2, subjectId: 'rabbit', ml: 10, day: 1, source: 'cauldron', values: { vitality: 12, love: 0, strength: 0, toxicity: 0, death: 0 }, observations: [{ key: 'vitality', tone: 'good', text: '' }] },
    { id: 't1', serial: 1, subjectId: 'beetle', ml: 5, day: 1, source: 'cauldron', values: { strength: 3 }, observations: [] },
  ];
  const c = normalizeColony(undefined, { health: 35, alive: true, trials: 2, marks: { love: 40, burn: 20, change: 30, vigor: 10 } }, records);
  const f = findRabbit(c, 'r1');
  assert.equal(f.health, 35);
  assert.equal(f.marks.love, 40);
  assert.equal(f.marks.fire, 20);
  assert.equal(f.marks.transformation, 30);
  assert.equal(f.doses.length, 1);
  assert.equal(records[0].rabbitId, 'r1');
  assert.equal(records[1].rabbitId, undefined);
  assert.ok(findRabbit(c, 'r2').alive, 'a companion joins');
  assert.equal(JSON.stringify(normalizeColony(JSON.parse(JSON.stringify(c)))), JSON.stringify(c), 'normalizing again changes nothing');
  const junk = normalizeColony(undefined, { health: 'x' });
  assert.equal(junk.rabbits[0].health, 100);
  const dead = normalizeColony(undefined, { health: 0, alive: false, trials: 3, marks: {} });
  assert.equal(dead.rabbits[0].alive, false, 'the dead founder is kept as a body');
  assert.equal(dead.focus, 'r2');
  assert.ok(normalizeColony({ rabbits: 'nope' }).rabbits.length === 2);
  // an empty hutch: the handle returns a dead placeholder instead of throwing
  const t = { subjects: {}, colony: normalizeColony({ rabbits: [] }) };
  installRabbitAlias(t);
  assert.equal(/** @type {any} */ (t.subjects).rabbit.alive, false);
});

test('buying keeps does and bucks balanced; retiring moves a body to the memorial', () => {
  const c = createColony('b');
  const r = addBoughtRabbit(c, { day: 5 });
  assert.equal(stageOf(r, 5), 'adult');
  c.rabbits[0].alive = false;
  const m = retireRabbit(c, 'r1', 'buried', [], 6);
  assert.equal(m.id, 'r1');
  assert.equal(c.memorial[0].how, 'buried');
  assert.ok(!findRabbit(c, 'r1'));
  assert.notEqual(c.focus, 'r1');
});

test('the condition of a rabbit is words, never numbers', () => {
  const c = createColony();
  const r = c.rabbits[0];
  let x = r;
  for (const dose of [{ love: 30 }, { fire: 15, frost: 5 }, { toxicity: 12 }, { transformation: 12 }, { arcana: 25 }, { strength: 30 }]) x = rabbitResponse(x, fx(dose), 10, { day: 2 }).after;
  for (const w of rabbitCondition(x, 2)) assert.ok(!/\d/.test(w), w);
  const dead = rabbitResponse(r, fx({ death: 50 }), 25, { day: 7 }).after;
  const words = rabbitCondition(dead, 8);
  assert.ok(words[0].startsWith('dead'));
  assert.ok(words.slice(1).every((w) => !/\d/.test(w)));
});

test('the memorial forgets old graves, never processed bodies, and their names stay taken', () => {
  /** @type {any[]} */
  const list = [];
  for (let k = 0; k < MEMORIAL_LIMIT + 10; k++) list.push({ id: 'b' + k, name: 'B' + k, how: k % 5 === 0 ? 'processed' : 'buried' });
  const kept = trimMemorial(list);
  const processed = list.filter((m) => m.how === 'processed');
  assert.ok(processed.every((m) => kept.includes(m)), 'remains must stay resolvable');
  assert.equal(kept.filter((m) => m.how === 'buried').length, MEMORIAL_LIMIT);
  // a processed rabbit's name is not given to a newcomer
  const c = createColony('names');
  c.memorial = /** @type {any[]} */ (NAMES.slice(0, NAMES.length - 1).map((name, i) => ({ id: 'm' + i, name, how: 'processed' })));
  const rng = new Rng(7);
  const n = pickName(c, rng);
  assert.ok(!c.memorial.some((m) => m.name === n) && !c.rabbits.some((r) => r.name === n));
});
