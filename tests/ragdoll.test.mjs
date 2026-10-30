// The wilds made physical: a shaken-loose ingredient falls as a ragdoll cut
// from its own sprite, and the finger's push on the scenery — leaves that
// bend and spring back, vines that swing on.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Ragdoll } from '../src/rendering/ragdoll.js';
import { SceneTouch, crosses, swayPixels } from '../src/rendering/wild-scene.js';
import { sceneOf, SCENE_W, SCENE_H } from '../src/visual/env/scene.js';

const W = 200, H = 120, FLOOR = 100;
const floor = (x, y) => y >= FLOOR;
const run = (doll, s, solid = floor) => { for (let t = 0; t < s && !doll.asleep; t += 1 / 60) doll.step(1 / 60, solid); };

test('a ragdoll falls, bounces and comes to rest on the ground, its pieces their own lengths', () => {
  const doll = new Ragdoll({ w: 9, h: 26, ax: 4, ay: 25 }, 60, 30, { W, H, vx: 0, vy: 0 });
  assert.equal(doll.len.length, 3, 'a tall plant is three pieces');
  const len0 = doll.len.slice();
  let lowest = 0;
  for (let t = 0; t < 6 && !doll.asleep; t += 1 / 60) { doll.step(1 / 60, floor); lowest = Math.max(lowest, ...doll.py); }
  assert.ok(doll.asleep, 'it comes to rest');
  for (let j = 0; j < doll.px.length; j++) assert.ok(doll.py[j] + doll.r <= FLOOR + 0.5, 'never sunk into the ground');
  assert.ok(lowest + doll.r <= FLOOR + 1.5);
  doll.pieces().forEach((p, i) => assert.ok(Math.abs(Math.hypot(doll.px[i + 1] - doll.px[i], doll.py[i + 1] - doll.py[i]) - len0[i]) < 0.6, 'each piece keeps its length'));
  assert.ok(doll.centre().y > FLOOR - 20, 'it lies on the ground');
});

test('thrown sideways it tumbles: it lands turned, and it can be kicked along again', () => {
  const doll = new Ragdoll({ w: 8, h: 24, ax: 4, ay: 23 }, 60, FLOOR, { W, H, vx: 40, vy: -50, spin: 60 });
  run(doll, 8);
  assert.ok(doll.asleep);
  const turned = doll.pieces().some((p) => Math.abs(p.ang) > 0.5);
  assert.ok(turned, 'it does not land standing as it grew');
  assert.ok(doll.centre().x > 62, 'it went the way it was thrown');
  const c0 = doll.centre();
  assert.ok(doll.kick(c0.x - 15, c0.y, c0.x + 15, c0.y, 3), 'a finger across it touches it');
  assert.equal(doll.asleep, false);
  run(doll, 8);
  assert.ok(doll.centre().x > c0.x + 1, 'and flicks it along');
});

test('a piece of fruit falls off a ledge and rests on what is below; a draw uses only its own pixels', () => {
  // a step: high ground left of x = 80, low ground right of it
  const step = (x, y) => (x < 80 ? y >= 60 : y >= FLOOR);
  const doll = new Ragdoll({ w: 6, h: 6, ax: 3, ay: 0 }, 78, 50, { W, H, vx: 30 });
  assert.equal(doll.len.length, 1, 'a berry is one stiff piece');
  run(doll, 8, step);
  assert.ok(doll.asleep);
  assert.ok(doll.centre().x > 80 && doll.centre().y > 85, 'it dropped to the low ground');
  // the pieces are slices of the sprite that together cover it exactly once (but for the overlap at the joints)
  const tall = new Ragdoll({ w: 7, h: 30, ax: 3, ay: 29 }, 50, 40, { W, H });
  const ps = tall.pieces();
  assert.equal(ps[0].sy, 0);
  assert.equal(ps[ps.length - 1].sy + ps[ps.length - 1].sh, 30);
  for (const p of ps) assert.equal(p.sw, 7);
});

test('the finger pushes the scenery: leaves spring back within a second or two, a hanging strand swings on', () => {
  const sw = { amp: Float32Array.from([1, 0]), hang: Float32Array.from([0, 1.2]), k: Int32Array.from([10 * SCENE_W + 20, 11 * SCENE_W + 21, 40 * SCENE_W + 100, 60 * SCENE_W + 100]), g: Int32Array.from([0, 0, 1, 1]) };
  const t = new SceneTouch(/** @type {any} */ (sw));
  assert.equal(t.push(0, 10, 60, 10), 1, 'only the clump it crossed');
  assert.ok(t.awake && t.vel[0] > 0 && t.vel[1] === 0);
  assert.equal(t.push(90, 50, 110, 50), 1, 'then the strand');
  let maxLeaf = 0, maxVine = 0, leafStill = -1, vineAt3 = 0, flips = 0, prev = 0;
  for (let k = 1; k <= 360; k++) {
    t.step(1 / 60);
    maxLeaf = Math.max(maxLeaf, Math.abs(t.pos[0])); maxVine = Math.max(maxVine, Math.abs(t.pos[1]));
    if (leafStill < 0 && t.pos[0] === 0) leafStill = k / 60;
    if (k === 180) vineAt3 = Math.abs(t.pos[1]) + Math.abs(t.vel[1]);
    if (Math.sign(t.pos[1]) && Math.sign(t.pos[1]) !== Math.sign(prev)) flips++;
    prev = t.pos[1] || prev;
  }
  assert.ok(maxLeaf > 0.8, 'the leaves bend visibly');
  assert.ok(leafStill > 0 && leafStill < 3, `and are still again (${leafStill}s)`);
  assert.ok(maxVine > 1, 'the strand swings');
  assert.ok(vineAt3 > 0.3, 'still swinging three seconds on');
  assert.ok(flips >= 3, 'back and forth');
  assert.ok(crosses(0, 0, 10, 10, 4, 4, 6, 6) && !crosses(0, 0, 10, 0, 4, 4, 6, 6));
});

test('a real scene: a swipe through its foliage moves those pixels, and only while it rings', () => {
  const sc = sceneOf('forest', 'touch-1');
  assert.ok(sc.sway, 'the Whisperwood sways');
  const t = new SceneTouch(sc.sway);
  const calm = new Uint32Array(SCENE_W * SCENE_H), pushed = new Uint32Array(SCENE_W * SCENE_H);
  swayPixels(sc.sway, calm, 5, sc.meta.wind ?? 1, 0, t);
  let n = 0;
  for (let y = 10; y < SCENE_H - 10 && !n; y += 6) n = t.push(0, y, SCENE_W, y);
  assert.ok(n > 0, 'a stroke across the scene meets some foliage');
  for (let k = 0; k < 6; k++) t.step(1 / 60);
  swayPixels(sc.sway, pushed, 5, sc.meta.wind ?? 1, 0, t);
  let diff = 0;
  for (let i = 0; i < calm.length; i++) if (calm[i] !== pushed[i]) diff++;
  assert.ok(diff > 20, `the pushed leaves moved (${diff} px)`);
  for (let k = 0; k < 60 * 12 && t.awake; k++) t.step(1 / 60);
  assert.equal(t.awake, false, 'and it all comes to rest');
  swayPixels(sc.sway, pushed, 5, sc.meta.wind ?? 1, 0, t);
  assert.deepEqual(pushed, calm, 'back exactly as the wind alone has it');
});

test('dropped straight down onto its foot, a long body does not stay standing on its end, nor any piece of it', () => {
  for (const x of [40, 41, 90, 133]) {
    const doll = new Ragdoll({ w: 8, h: 22, ax: 4, ay: 0 }, x, FLOOR - 30, { W, H });
    run(doll, 10);
    assert.ok(doll.asleep, 'it comes to rest');
    const rise = Math.max(...doll.py) - Math.min(...doll.py), span = Math.max(...doll.px) - Math.min(...doll.px);
    assert.ok(rise < span, `it lies down (rise ${rise.toFixed(1)}, span ${span.toFixed(1)})`);
    doll.pieces().forEach((p, i) => assert.ok(Math.abs(doll.py[i + 1] - doll.py[i]) <= Math.abs(doll.px[i + 1] - doll.px[i]) * 1.25 + 1, `piece ${i} lies down`));
  }
});
