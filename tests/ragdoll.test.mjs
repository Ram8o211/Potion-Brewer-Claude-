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
  const doll = new Ragdoll({ w: 6, h: 6, ax: 3, ay: 0 }, 76, 50, { W, H, vx: 90 });
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

/** A strand of the scenery: one column of pixels hanging from y0 to y1 at column x (and a leaf clump for contrast). */
const strand = (x, y0, y1) => {
  const k = [], g = [], f = [];
  for (let y = 0; y < 6; y++) for (let xx = 0; xx < 6; xx++) { k.push((10 + y) * SCENE_W + 20 + xx); g.push(0); f.push(0); }
  for (let y = y0; y <= y1; y++) { k.push(y * SCENE_W + x); g.push(1); f.push((y - y0) / (y1 - y0)); }
  return { amp: Float32Array.from([1, 0]), hang: Float32Array.from([0, 1.2]), k: Int32Array.from(k), g: Int32Array.from(g), f: Float32Array.from(f) };
};

test('a vine is a chain of links: touched at its middle it bends there, the wave runs down it and its end swings on; leaves are not pushed', () => {
  const sw = strand(100, 40, 88);
  const t = new SceneTouch(/** @type {any} */ (sw));
  assert.ok(t.links[1] >= 8, `a long vine has many links (${t.links[1]})`);
  assert.equal(t.links[0], 0, 'a leaf clump has none');
  assert.equal(t.push(0, 12, 60, 12), 0, 'a clump of leaves is not pushed');
  // a quick stroke across its middle, left to right
  assert.equal(t.push(96, 64, 104, 64), 1, 'the vine is');
  const mid = t.offset(1, 0.5), top = t.offset(1, 0.1), end = t.offset(1, 1);
  assert.ok(mid > 1, `it bends where it was touched (${mid.toFixed(2)})`);
  assert.ok(mid > top + 0.5 && mid > end, 'more there than above or below, at first');
  assert.equal(t.offset(1, 0), 0, 'its top stays where it hangs from');
  let endMax = 0, flips = 0, prev = 0, at3 = 0;
  for (let k = 1; k <= 60 * 4; k++) {
    t.step(1 / 60);
    const e = t.offset(1, 1);
    endMax = Math.max(endMax, Math.abs(e));
    if (Math.sign(e) && Math.sign(e) !== Math.sign(prev)) flips++;
    prev = e || prev;
    if (k === 180) at3 = t.moving(1) ? 1 : 0;
  }
  assert.ok(endMax > mid, `the wave reaches its end, which whips further (${endMax.toFixed(2)})`);
  assert.ok(flips >= 3, 'it swings back and forth');
  assert.equal(at3, 1, 'still swinging three seconds on');
  for (let k = 0; k < 60 * 30 && t.awake; k++) t.step(1 / 60);
  assert.equal(t.awake, false, 'and comes to rest');
  assert.equal(t.offset(1, 1), 0);
});

test('a slow finger drags a vine along; it never stretches apart', () => {
  const sw = strand(100, 40, 88);
  const t = new SceneTouch(/** @type {any} */ (sw));
  // a finger pressed into its lower part, moving slowly right, a frame at a time
  for (let x = 96; x < 112; x += 1) { t.push(x, 78, x + 1, 78); t.step(1 / 60); }
  assert.ok(t.offset(1, 0.8) > 6, `dragged along with the finger (${t.offset(1, 0.8).toFixed(1)} px)`);
  // no link is ever further sideways from the one above than it is long
  const N = t.links[1], lk = 49 / N;
  for (let i = 0; i < N; i++) assert.ok(Math.abs(t.offset(1, (i + 1) / N) - t.offset(1, i / N)) <= lk * 0.8, `link ${i} holds together`);
  assert.ok(crosses(0, 0, 10, 10, 4, 4, 6, 6) && !crosses(0, 0, 10, 0, 4, 4, 6, 6));
});

test('a real scene: a swipe through the cave’s hanging vines moves only them, and only while they swing', () => {
  const sc = sceneOf('netherwood', 'touch-1');
  assert.ok(sc.sway, 'the Netherwood sways');
  const t = new SceneTouch(sc.sway);
  const calm = new Uint32Array(SCENE_W * SCENE_H), pushed = new Uint32Array(SCENE_W * SCENE_H);
  swayPixels(sc.sway, calm, 5, sc.meta.wind ?? 1, 0, t);
  let n = 0;
  for (let y = 10; y < SCENE_H - 10 && !n; y += 6) for (let x = 0; x < SCENE_W - 6; x += 6) n += t.push(x, y, x + 6, y);
  assert.ok(n > 0, 'a stroke across the scene meets some vines');
  for (let k = 0; k < 6; k++) t.step(1 / 60);
  swayPixels(sc.sway, pushed, 5, sc.meta.wind ?? 1, 0, t);
  let diff = 0;
  for (let i = 0; i < calm.length; i++) if (calm[i] !== pushed[i]) diff++;
  assert.ok(diff > 20, `the pushed vines moved (${diff} px)`);
  for (const g of t.live) assert.ok(sc.sway.hang[g] > 0, 'only strands move');
  for (let k = 0; k < 60 * 40 && t.awake; k++) t.step(1 / 60);
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

/** A rugged scene: a floor, a thin ledge, a slope and a pillar. */
const rugged = (x, y) => y >= FLOOR || (y >= 60 && y < 63 && x > 40 && x < 90) || (x > 120 && y >= FLOOR - (x - 120) * 0.6) || (x >= 100 && x < 104 && y >= 50);
const inTerrain = (doll, solid) => {
  for (let j = 0; j < doll.px.length; j++) if (solid(Math.round(doll.px[j]), Math.round(doll.py[j]))) return true;
  for (let i = 0; i < doll.len.length; i++) for (let u = 0.1; u < 1; u += 0.1) if (solid(Math.round(doll.px[i] + (doll.px[i + 1] - doll.px[i]) * u), Math.round(doll.py[i] + (doll.py[i + 1] - doll.py[i]) * u))) return true;
  return false;
};

test('the terrain is impenetrable: thrown hard at a thin ledge, a pillar and a slope, no part of a body ever goes into it', () => {
  const shots = [
    { x: 60, y: 20, vx: 0, vy: 300, spin: 0 }, // straight down onto the thin ledge, fast
    { x: 70, y: 40, vx: 40, vy: 200, spin: 200 }, // tumbling onto it
    { x: 80, y: 30, vx: 400, vy: -50, spin: 100 }, // flung at the pillar
    { x: 150, y: 20, vx: -60, vy: 100, spin: -150 }, // onto the slope
    { x: 30, y: 85, vx: 0, vy: 0, spin: 0 }, // resting on the floor
  ];
  for (const s of shots) for (const sp of [{ w: 6, h: 6, ax: 3, ay: 0 }, { w: 8, h: 26, ax: 4, ay: 0 }]) {
    const doll = new Ragdoll(sp, s.x, s.y, { W, H, vx: s.vx, vy: s.vy, spin: s.spin });
    for (let t = 0; t < 6 && !doll.asleep; t += 1 / 60) {
      doll.step(1 / 60, rugged);
      assert.equal(inTerrain(doll, rugged), false, `${JSON.stringify(s)} ${sp.h} px tall: in the terrain at ${t.toFixed(2)} s`);
    }
    assert.ok(doll.asleep, `${JSON.stringify(s)}: it comes to rest`);
  }
});

test('a body made where it overlaps the terrain (a fruit hung in front of a ledge) is set down clear of it, then falls', () => {
  const doll = new Ragdoll({ w: 8, h: 20, ax: 4, ay: 0 }, 60, 50, { W, H, vy: 45 });
  assert.equal(inTerrain(doll, rugged), true, 'it began through the ledge');
  doll.settle(rugged);
  assert.equal(inTerrain(doll, rugged), false, 'set clear of it');
  run(doll, 8, rugged);
  assert.ok(doll.asleep);
  assert.equal(inTerrain(doll, rugged), false);
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
