// Whisperwood sprites: the atlas and its frame map agree, every forest
// ingredient (and only those) has gatherable art with all its states, and
// hit testing picks deposits — never the scenery — at any scene size.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ATLAS_URL, ATLAS_SIZE, FRAMES } from '../src/rendering/whisperwood-atlas.js';
import { GATHERABLES, MIN_HIT, gatherFrameName, depositBox, hitDeposit, loadWhisperwood, whisperwoodReady } from '../src/rendering/whisperwood.js';
import { WILD_SPECS } from '../src/materials/wild.js';
import { GameState } from '../src/game/state.js';
import { SCENE_W, SCENE_H } from '../src/rendering/regions.js';

test('the atlas file exists and matches the generated frame map', () => {
  const png = fs.readFileSync(new URL('../' + ATLAS_URL, import.meta.url));
  assert.equal(png.toString('ascii', 1, 4), 'PNG');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], ATLAS_SIZE, 'IHDR size');
  for (const [name, [x, y, w, h]] of Object.entries(FRAMES)) {
    assert.ok(w > 0 && h > 0 && x >= 0 && y >= 0 && x + w <= ATLAS_SIZE[0] && y + h <= ATLAS_SIZE[1], `${name} lies inside the atlas`);
  }
});

test('every Whisperwood ingredient has gatherable art; nothing else does', () => {
  const forest = WILD_SPECS.filter((s) => s.region === 'forest').map((s) => s.key).sort();
  assert.deepEqual(Object.keys(GATHERABLES).sort(), forest, 'one sprite set per real forest ingredient, no invented ones');
  for (const [key, g] of Object.entries(GATHERABLES)) {
    for (const state of ['idle', 'hover', 'locked', 'depleted']) assert.ok(FRAMES[g[state]], `${key} ${state}`);
    // the states of one gatherable share a canvas, so they swap in place
    const [, , w, h] = FRAMES[g.idle];
    for (const name of [g.hover, g.locked, g.harvesting].filter(Boolean)) assert.deepEqual(FRAMES[name].slice(2), [w, h], `${name} shares ${key}'s canvas`);
  }
  assert.ok(GATHERABLES.silverleaf.harvesting, 'the herb sequence keeps its harvesting frame');
  for (let i = 0; i < 4; i++) assert.ok(FRAMES['glint_' + i]);
});

test('a gatherable shows what can be done with it', () => {
  assert.equal(gatherFrameName('ironroot', { can: true }), 'ironroot_idle');
  assert.equal(gatherFrameName('ironroot', { can: true, hover: true }), 'ironroot_hover');
  assert.equal(gatherFrameName('ironroot', { can: false }), 'ironroot_depleted');
  assert.equal(gatherFrameName('ironroot', { can: false, hover: true }), 'ironroot_depleted', 'no highlight on what cannot be gathered');
  assert.equal(gatherFrameName('owlberry', { can: false }), 'picked');
  assert.equal(gatherFrameName('silverleaf', { can: true, harvesting: true }), 'silverleaf_harvesting');
  assert.equal(gatherFrameName('owlberry', { can: true, harvesting: true }), 'owlberry_idle');
  assert.equal(gatherFrameName('mandrake', { can: true, hover: true, locked: true }), 'mandrake_locked');
  assert.equal(gatherFrameName('heartpetal', { can: true }), null, 'other regions keep their procedural sprites');
});

test('deposit boxes sit on the deposit spot and are never smaller than a tap', () => {
  for (const key of [...Object.keys(GATHERABLES), null]) {
    const b = depositBox({ x: 0.5, y: 0.7 }, key, SCENE_W, SCENE_H);
    assert.equal(b.ax, 128); assert.equal(b.ay, Math.round(0.7 * SCENE_H));
    assert.ok(b.x1 - b.x0 >= MIN_HIT && b.y1 - b.y0 >= MIN_HIT, `${key} hit box`);
    assert.ok(b.y1 >= b.ay && b.y0 < b.ay, 'the box stands on the ground point');
  }
  // positions are fractions of the scene: a larger scene scales them
  const big = depositBox({ x: 0.25, y: 0.5 }, 'owlberry', SCENE_W * 3, SCENE_H * 3);
  assert.equal(big.ax, SCENE_W * 0.75); assert.equal(big.ay, SCENE_H * 1.5);
});

test('hit testing finds deposits, prefers the front one and ignores the scenery', () => {
  const st = GameState.create('whisper-hit', { tutorial: false });
  const deps = st.deposits.filter((d) => d.region === 'forest');
  const keyOf = (d) => st.lookup(d.materialId).wild.key;
  assert.ok(deps.length >= 5);
  for (const d of deps) {
    // the point the browser test taps: just above the deposit's ground spot
    const hit = hitDeposit(deps, keyOf, d.x * SCENE_W, d.y * SCENE_H - 8, SCENE_W, SCENE_H);
    assert.equal(hit && hit.id, d.id, `tapping ${d.id}`);
  }
  // the sky and the canopy hold no deposits (they grow between 0.5 and 0.88 of the height)
  for (let x = 0; x < SCENE_W; x += 8) assert.equal(hitDeposit(deps, keyOf, x, 4, SCENE_W, SCENE_H), null, `sky at ${x}`);
  // two overlapping deposits: the one nearer the viewer (lower) wins
  const a = { id: 'a', x: 0.5, y: 0.6 }, b = { id: 'b', x: 0.52, y: 0.66 };
  const both = [a, b], k = () => 'silverleaf';
  assert.equal(hitDeposit(both, k, 0.51 * SCENE_W, 0.6 * SCENE_H - 2, SCENE_W, SCENE_H)?.id, 'b');
  // a near miss within the slop still counts; a far one does not
  const box = depositBox(a, 'silverleaf', SCENE_W, SCENE_H);
  assert.equal(hitDeposit([a], k, box.x1 + 3, box.y0 + 5, SCENE_W, SCENE_H)?.id, 'a');
  assert.equal(hitDeposit([a], k, box.x1 + 12, box.y0 + 5, SCENE_W, SCENE_H), null);
});

test('without a DOM the atlas never loads and the procedural scene stays', async () => {
  assert.equal(await loadWhisperwood(), false);
  assert.equal(whisperwoodReady(), false);
});
