// Wild rabbits in the wilds: they hop about the ground; a blow wounds one,
// its blood stains what it lands on and it flees faster from then on; three
// bring it down, and it is caught alive or its body carried to the hutch.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Warren, warrenSpots, WILD_HP, BLEED_OUT } from '../src/game/wild-rabbits.js';
import { GameState } from '../src/game/state.js';
import { livingRabbits, causeWord } from '../src/game/colony.js';
import { sceneOf, SCENE_W, SCENE_H } from '../src/visual/env/scene.js';

const W = 300, H = 120, FLOOR = 100;
const flat = () => new Warren('meadow', 'test', {
  W, H, solid: (x, y) => y >= FLOOR, liquid: () => false,
  spots: Array.from({ length: 20 }, (_, i) => [40 + i * 10, FLOOR - 1]),
});
const run = (w, s) => { for (let t = 0; t < s; t += 1 / 60) w.step(1 / 60); };

test('wild rabbits hop about the ground and never sink into it', () => {
  const w = flat();
  assert.ok(w.rabbits.length >= 3, 'a region has its rabbits');
  const x0 = w.rabbits.map((r) => r.x);
  let hopped = false;
  for (let t = 0; t < 20; t += 1 / 60) {
    w.step(1 / 60);
    for (const r of w.rabbits) { assert.ok(r.y <= FLOOR - 1 + 1e-6, 'never in the ground'); assert.ok(r.x >= 0 && r.x <= W); if (r.air) hopped = true; }
  }
  assert.ok(hopped, 'they hop');
  assert.ok(w.rabbits.some((r, i) => Math.abs(r.x - x0[i]) > 3), 'and get somewhere');
});

test('a blow wounds a rabbit: its blood stains the ground, and it flees faster from then on', () => {
  const w = flat(), r = w.rabbits[0];
  run(w, 0.5);
  const calm = [];
  for (let t = 0; t < 10; t += 1 / 60) { w.step(1 / 60); if (r.air) calm.push(Math.abs(r.vx)); }
  const before = calm.reduce((a, b) => a + b, 0) / Math.max(1, calm.length);
  const x = r.x, y = r.y;
  assert.equal(w.strike(r, x - 3, y - 8), 'wounded');
  assert.ok(r.alarm && r.wounds.length === 1);
  assert.ok(w.drops.length > 10, 'blood bursts from it');
  let stained = 0, airborne = 0, moved = 0, last = r.x;
  for (let t = 0; t < 6; t += 1 / 60) {
    w.step(1 / 60);
    stained += w.takeStains().length;
    if (r.air) airborne++;
    moved += Math.abs(r.x - last); last = r.x;
  }
  assert.ok(stained > 20, `its blood colours the ground (${stained})`);
  assert.ok(moved > 6 * (before || 20), `it runs much faster than it hopped (${moved.toFixed(0)} px in 6 s, calm hops at ${before.toFixed(0)} px/s)`);
  assert.ok(airborne > 6 * 60 * 0.6, 'and hardly stops between bounds');
  // a tap that misses close by sets another one running too
  const o = w.rabbits[1];
  w.scare(o, o.x + 10);
  assert.ok(o.alarm);
});

test('three blows bring a rabbit down; it bleeds out where it lies; struck while down it dies', () => {
  const w = flat(), r = w.rabbits[0];
  for (let k = 1; k < WILD_HP; k++) assert.equal(w.strike(r, r.x, r.y - 6), 'wounded');
  assert.equal(w.strike(r, r.x, r.y - 6), 'down');
  assert.ok(r.down && !r.dead && !r.running);
  run(w, BLEED_OUT + 1);
  assert.ok(r.dead, 'left lying, it bleeds out');
  const q = w.rabbits[1];
  for (let k = 0; k < WILD_HP; k++) w.strike(q, q.x, q.y - 6);
  assert.equal(w.strike(q, q.x, q.y - 6), 'killed');
  assert.ok(q.dead);
  assert.equal(w.at(q.x, q.y - 3), q, 'its body can be tapped');
});

test('a rabbit from the wilds joins the hutch: alive and weak, or as a body for its remains', () => {
  const st = GameState.create('wild-hunt', { tutorial: false });
  const w = flat(), r = w.rabbits[0];
  const n = livingRabbits(st.colony).length;
  const caught = st.bringWildRabbit({ look: r.look, sex: r.sex, health: 30 });
  assert.ok(caught.ok);
  assert.equal(livingRabbits(st.colony).length, n + 1);
  assert.ok(caught.rabbit.alive && caught.rabbit.health <= 30);
  const body = st.bringWildRabbit({ look: w.rabbits[1].look, sex: 'm', dead: true });
  assert.ok(body.ok && !body.rabbit.alive);
  assert.equal(causeWord(body.rabbit.cause), 'killed in the wilds');
  assert.ok(st.processRemains(body.rabbit.id).ok, 'its remains can be recovered');
  // a full hutch takes no more living rabbits (bodies still come home)
  while (livingRabbits(st.colony).length < st.cap.hutch) st.bringWildRabbit({ look: r.look, sex: 'f' });
  assert.equal(st.bringWildRabbit({ look: r.look, sex: 'f' }).ok, false);
  assert.ok(st.bringWildRabbit({ look: r.look, sex: 'f', dead: true }).ok);
});

test('every region has open ground for its rabbits to start on', () => {
  for (const id of ['forest', 'netherwood', 'meadow', 'river', 'quarry', 'moonfen', 'crags']) {
    const sc = sceneOf(id, 'spots');
    const spots = warrenSpots(sc, SCENE_W, SCENE_H);
    assert.ok(spots.length > 20, `${id}: ${spots.length} spots`);
    for (const [x, y] of spots.slice(0, 50)) assert.ok(!sc.solid[y * SCENE_W + x] && sc.solid[(y + 1) * SCENE_W + x], `${id}: feet on the ground`);
  }
});
