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

test('the finger sets a hanging strand swinging on and on; the trees and bushes behind stay as the wind has them', () => {
  const sw = { amp: Float32Array.from([1, 0]), hang: Float32Array.from([0, 1.2]), k: Int32Array.from([10 * SCENE_W + 20, 11 * SCENE_W + 21, 40 * SCENE_W + 100, 60 * SCENE_W + 100]), g: Int32Array.from([0, 0, 1, 1]) };
  const t = new SceneTouch(/** @type {any} */ (sw));
  assert.equal(t.push(0, 10, 60, 10), 0, 'a clump of leaves is not pushed');
  assert.equal(t.awake, false);
  assert.equal(t.push(90, 50, 110, 50), 1, 'a strand is');
  let maxVine = 0, vineAt3 = 0, flips = 0, prev = 0;
  for (let k = 1; k <= 360; k++) {
    t.step(1 / 60);
    assert.equal(t.pos[0], 0, 'the leaves never move');
    maxVine = Math.max(maxVine, Math.abs(t.pos[1]));
    if (k === 180) vineAt3 = Math.abs(t.pos[1]) + Math.abs(t.vel[1]);
    if (Math.sign(t.pos[1]) && Math.sign(t.pos[1]) !== Math.sign(prev)) flips++;
    prev = t.pos[1] || prev;
  }
  assert.ok(maxVine > 1, 'the strand swings');
  assert.ok(vineAt3 > 0.3, 'still swinging three seconds on');
  assert.ok(flips >= 3, 'back and forth');
  assert.ok(crosses(0, 0, 10, 10, 4, 4, 6, 6) && !crosses(0, 0, 10, 0, 4, 4, 6, 6));
});

test('a real scene: a swipe through the cave’s hanging vines moves only them, and only while they swing', () => {
  const sc = sceneOf('netherwood', 'touch-1');
  assert.ok(sc.sway, 'the Netherwood sways');
  const t = new SceneTouch(sc.sway);
  const calm = new Uint32Array(SCENE_W * SCENE_H), pushed = new Uint32Array(SCENE_W * SCENE_H);
  swayPixels(sc.sway, calm, 5, sc.meta.wind ?? 1, 0, t);
  let n = 0;
  for (let y = 10; y < SCENE_H - 10 && !n; y += 6) n = t.push(0, y, SCENE_W, y);
  assert.ok(n > 0, 'a stroke across the scene meets some vines');
  for (let k = 0; k < 6; k++) t.step(1 / 60);
  swayPixels(sc.sway, pushed, 5, sc.meta.wind ?? 1, 0, t);
  let diff = 0;
  for (let i = 0; i < calm.length; i++) if (calm[i] !== pushed[i]) diff++;
  assert.ok(diff > 20, `the pushed vines moved (${diff} px)`);
  // every pixel that moved belongs to a hanging strand
  const still = new Uint32Array(SCENE_W * SCENE_H), zero = new SceneTouch(sc.sway);
  for (let i = 0; i < sc.sway.k.length; i++) if (!(sc.sway.hang[sc.sway.g[i]] > 0)) assert.equal(t.pos[sc.sway.g[i]], 0);
  swayPixels(sc.sway, still, 5, sc.meta.wind ?? 1, 0, zero);
  assert.deepEqual(still, calm);
  for (let k = 0; k < 60 * 25 && t.awake; k++) t.step(1 / 60);
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

test('what is let go of drops briskly, not in slow motion', () => {
  // a fruit hanging 40 px above the ground, snapped off its hold
  const doll = new Ragdoll({ w: 6, h: 10, ax: 3, ay: 0 }, 60, FLOOR - 50, { W, H, vy: 45 });
  let t = 0;
  while (t < 2 && !doll.knock) { doll.step(1 / 60, floor); t += 1 / 60; }
  assert.ok(doll.knock > 0, 'it hit the ground');
  assert.ok(t < 0.35, `within a third of a second (${t.toFixed(2)} s)`);
});

test('a fruit hanging in front of a ledge falls on through it at full speed and lands on the ground below', () => {
  // a rock ledge from y = 60 to 80 the fruit overlaps; open ground at FLOOR
  const scene = (x, y) => y >= FLOOR || (y >= 60 && y < 80 && x > 40 && x < 80);
  const doll = new Ragdoll({ w: 8, h: 26, ax: 4, ay: 0 }, 60, 50, { W, H, vy: 45, front: true });
  let t = 0;
  while (t < 2 && Math.max(...doll.py) + doll.r < FLOOR - 1) { doll.step(1 / 60, scene); t += 1 / 60; }
  assert.ok(t < 0.4, `it reached the ground below quickly (${t.toFixed(2)} s)`);
  run(doll, 8, scene);
  assert.ok(doll.asleep && doll.centre().y > 85, 'and rests there');
});

test('a plant pulled up from the ground lands back on that ground, never through it', () => {
  const doll = new Ragdoll({ w: 9, h: 20, ax: 4, ay: 19 }, 60, FLOOR - 1, { W, H, vy: -75, vx: 20, spin: 40 });
  run(doll, 8);
  assert.ok(doll.asleep);
  for (let j = 0; j < doll.px.length; j++) assert.ok(doll.py[j] + doll.r <= FLOOR + 0.5, 'on the ground, not under it');
});

test('uneven frames do not slow it: it falls as fast whatever the frame rate', () => {
  // frames a little off 1/60 s (as they always are in a browser)
  const fall = (frames) => {
    const doll = new Ragdoll({ w: 6, h: 10, ax: 3, ay: 0 }, 60, 10, { W, H: 400, vy: 0 });
    let t = 0, k = 0;
    for (;;) { const dt = frames[k++ % frames.length]; if (t + dt > 0.5 + 1e-9) break; doll.step(dt, () => false); t += dt; }
    doll.step(0.5 - t, () => false);
    return doll.centre().y - 15;
  };
  const even = fall([1 / 60]), ragged = fall([0.0167, 0.0171, 0.0158, 0.0175, 0.0162]), slow = fall([1 / 30]);
  const free = 0.5 * 640 * 0.25;
  for (const [name, d] of /** @type {[string, number][]} */ ([['even', even], ['ragged', ragged], ['30 fps', slow]])) assert.ok(Math.abs(d - free) < free * 0.12, `${name} frames: ${d.toFixed(1)} px of ${free} in half a second`);
  assert.ok(Math.abs(ragged - even) < 2 && Math.abs(slow - even) < 2, 'the same however the frames fall');
});

test('a plant pulled up hops a little and keels over; it does not leap', () => {
  const doll = new Ragdoll({ w: 9, h: 20, ax: 4, ay: 19 }, 60, FLOOR, { W, H, vy: -75, spin: 110 });
  let top = FLOOR;
  for (let t = 0; t < 2; t += 1 / 60) { doll.step(1 / 60, floor); top = Math.min(top, ...doll.py); }
  assert.ok(top > FLOOR - 19 - 8, `it rose at most a few pixels (top ${top.toFixed(1)})`);
  assert.ok(doll.asleep, 'and lies down within two seconds');
});
