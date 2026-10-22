// The rabbit renderer and the hutch scene, without a DOM: every visible
// state draws inside the frame, channels and levels are distinct, death
// keeps what the body bore, drawing is deterministic, and the hutch's
// behaviour machine is reproducible and never touches the colony.
import test from 'node:test';
import assert from 'node:assert/strict';
import { drawRabbit, rabbitAnchors, RABBIT_W, RABBIT_H } from '../src/rendering/rabbit.js';
import { HutchScene, HUTCH_W, HUTCH_H } from '../src/rendering/hutch-scene.js';
import { defaultSnap, RABBIT_MARKS, TRAITS, TRAIT_EXCLUSIVE, rollLook } from '../src/game/colony.js';
import { Rng } from '../src/core/rng.js';

/** A context that records what is drawn. */
function stub() {
  const calls = [];
  const ctx = {
    fillStyle: '', globalAlpha: 1,
    fillRect(x, y, w, h) { calls.push(['r', x, y, w, h, ctx.fillStyle]); },
    clearRect(x, y, w, h) { calls.push(['c', x, y, w, h]); },
    drawImage() { calls.push(['i']); },
    save() {}, restore() {}, translate() {}, scale() {},
    getContext() { return ctx; },
  };
  return { ctx, calls };
}
const look = { coat: [0.93, 0.89, 0.82], coat2: [0.36, 0.24, 0.18], pattern: 'solid', ear: 'upright', size: 1, eye: 'dark', tail: 1, seed: 1 };
const snap = (o = {}) => {
  const s = defaultSnap();
  if (o.L) s.lv = RABBIT_MARKS.map((k) => o.L[k] || 0);
  return { ...s, ...o, lv: s.lv };
};
const draw = (lk, sn, t = 1.3, react = 0, opts = {}) => {
  const { ctx, calls } = stub();
  drawRabbit(/** @type {any} */ (ctx), lk, sn, t, react, { cache: false, ...opts });
  return calls;
};
const inFrame = (calls) => calls.filter((c) => c[0] === 'r').every(([, x, y, w, h]) => x >= 0 && y >= 0 && x + w <= RABBIT_W && y + h <= RABBIT_H);
const nonExclusive = TRAITS.filter((t) => !TRAIT_EXCLUSIVE.some((g) => g.indexOf(t) > 0));

test('every state draws, and only inside its 48×40 frame', () => {
  const all3 = Object.fromEntries(RABBIT_MARKS.map((k) => [k, 3]));
  const cases = [
    snap(), snap({ stage: 'kit' }), snap({ stage: 'young' }), snap({ stage: 'elder' }), snap({ preg: true }), snap({ hp: 2 }), snap({ hp: 3 }),
    snap({ L: all3 }), snap({ traits: nonExclusive.slice(0, 5) }), snap({ traits: ['giant'], L: { strength: 3 } }), snap({ traits: ['tiny'] }),
    snap({ sc: [3, 3, 3, 3, 3] }),
  ];
  for (const cause of ['poison', 'death', 'fire', 'frost', 'acid', 'alkali', 'change', 'arcana', 'age', 'frail', 'unknown']) {
    cases.push(snap({ alive: false, hp: 3, cause, traits: ['horns', 'wings', 'tail-lizard'], sc: [2, 1, 0, 2, 1] }));
  }
  for (let i = 0; i < 20; i++) cases.push(snap({ L: Object.fromEntries(RABBIT_MARKS.map((k, j) => [k, (i + j) % 4])) }));
  for (const sn of cases) {
    for (const lk of [look, { ...look, size: 1.15, ear: 'lop' }, rollLook(new Rng('render-' + sn.stage))]) {
      for (const t of [0, 0.7, 2.9]) {
        const c = draw(lk, sn, t, 0.6, { react: ['love', 'fire'] });
        assert.ok(c.length > 20, 'something is drawn');
        assert.ok(inFrame(c), `inside the frame: ${JSON.stringify(sn)}`);
      }
    }
    const a = rabbitAnchors({ ...look, size: 1.15 }, sn);
    assert.ok(a.box.x0 >= 0 && a.box.x1 < RABBIT_W && a.box.y1 < RABBIT_H, 'the body fits');
  }
});

test('each channel looks different at each level, and channels add up', () => {
  for (const ch of RABBIT_MARKS) {
    const lv = [1, 2, 3].map((n) => JSON.stringify(draw(look, snap({ L: { [ch]: n } }))));
    assert.notEqual(lv[0], lv[1], `${ch} 1 vs 2`);
    assert.notEqual(lv[1], lv[2], `${ch} 2 vs 3`);
    assert.notEqual(JSON.stringify(draw(look, snap())), lv[0], `${ch} 1 is visible`);
  }
  const loveFire = draw(look, snap({ L: { love: 3, fire: 3 } })).length;
  const love = draw(look, snap({ L: { love: 3 } })).length;
  assert.ok(loveFire > love, 'fire adds to love');
});

test('death changes the pose but keeps the body; drawing is deterministic', () => {
  const alive = snap({ traits: ['horns'] });
  const dead = snap({ alive: false, hp: 3, cause: 'fire', traits: ['horns'] });
  assert.notEqual(JSON.stringify(draw(look, alive)), JSON.stringify(draw(look, dead)));
  assert.equal(rabbitAnchors(look, dead).pose, 'dead');
  assert.equal(JSON.stringify(draw(look, dead, 1.1)), JSON.stringify(draw(look, dead, 1.1)));
  assert.equal(JSON.stringify(draw(look, alive, 2.2, 0.5)), JSON.stringify(draw(look, alive, 2.2, 0.5)));
  // the horns are still drawn on the body
  const hornless = draw(look, snap({ alive: false, hp: 3, cause: 'fire' }));
  assert.notEqual(JSON.stringify(hornless), JSON.stringify(draw(look, dead, 1.3)));
});

test('the hutch: deterministic behaviour, hit-testing, nothing mutated, any number of rabbits', () => {
  const entries = [];
  for (let i = 0; i < 12; i++) {
    const L = {}; if (i === 1) L.love = 2; if (i === 2) L.fire = 3; if (i === 3) L.strength = 2; if (i === 4) L.arcana = 3; if (i === 5) L.toxicity = 3; if (i === 6) L.frost = 3;
    entries.push({ id: 'r' + i, look: rollLook(new Rng('hutch-' + i)), snap: snap({ L, stage: i > 8 ? 'kit' : 'adult', alive: i !== 11, hp: i === 11 ? 3 : 0, cause: i === 11 ? 'poison' : null }), mother: i > 8 ? 'r0' : undefined });
  }
  const frozen = JSON.stringify(entries);
  const run = (list) => {
    const sc = new HutchScene({ canvas: () => stub().ctx, sprites: false });
    sc.sync(list);
    for (let k = 0; k < 150; k++) sc.update(0.1);
    const { ctx, calls } = stub();
    sc.draw(/** @type {any} */ (ctx), 4.2, { selected: 'r1', hover: 'r2' });
    return { sc, calls };
  };
  const a = run(entries), b = run(entries);
  assert.equal(JSON.stringify(a.calls), JSON.stringify(b.calls), 'same inputs, same hutch');
  assert.equal(JSON.stringify(entries), frozen, 'entries untouched');
  for (const e of entries) {
    const w = a.sc.where(e.id);
    if (w.hidden) continue;
    assert.ok(w.x >= 0 && w.x < HUTCH_W && w.y >= 0 && w.y < HUTCH_H);
    const box = a.sc.boxOf(e.id);
    assert.ok(box);
  }
  // hit-testing finds a rabbit standing alone
  const solo = run([entries[0]]).sc;
  const w0 = solo.where('r0');
  assert.equal(solo.hit(w0.x, w0.y - 4), 'r0');
  assert.equal(solo.hit(2, 2), null);
  for (const n of [0, 1]) assert.doesNotThrow(() => run(entries.slice(0, n)));
});
