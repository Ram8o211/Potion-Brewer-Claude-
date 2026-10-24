// Wild sprites (Whisperwood and the Sunlit Meadow): each atlas and its frame
// map agree, every forest and meadow ingredient (and only those) has
// gatherable art with all its states, the meadow's dawn and dusk plants have
// closed frames and every meadow ingredient an icon, and hit testing picks
// deposits — never the scenery — at any scene size.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as WOOD from '../src/rendering/whisperwood-atlas.js';
import * as FIELD from '../src/rendering/meadow-atlas.js';
import { GATHERABLES, MIN_HIT, WOODLAND, MEADOW, REGION_ATLAS, gatherFrameName, depositBox, hitDeposit } from '../src/rendering/wild-sprites.js';
import { WILD_SPECS } from '../src/materials/wild.js';
import { GameState } from '../src/game/state.js';
import { SCENE_W, SCENE_H } from '../src/rendering/regions.js';

const FRAMES = WOOD.FRAMES;

test('each atlas file exists and matches its generated frame map', () => {
  for (const { ATLAS_URL, ATLAS_SIZE, FRAMES: frames } of [WOOD, FIELD]) {
    const png = fs.readFileSync(new URL('../' + ATLAS_URL, import.meta.url));
    assert.equal(png.toString('ascii', 1, 4), 'PNG');
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], ATLAS_SIZE, 'IHDR size');
    for (const [name, [x, y, w, h]] of Object.entries(frames)) {
      assert.ok(w > 0 && h > 0 && x >= 0 && y >= 0 && x + w <= ATLAS_SIZE[0] && y + h <= ATLAS_SIZE[1], `${name} lies inside ${ATLAS_URL}`);
    }
  }
  assert.equal(REGION_ATLAS.forest, WOODLAND);
  assert.equal(REGION_ATLAS.meadow, MEADOW);
});

test('every Whisperwood and Meadow ingredient has gatherable art; nothing else does', () => {
  const real = WILD_SPECS.filter((s) => s.region === 'forest' || s.region === 'meadow').map((s) => s.key).sort();
  assert.deepEqual(Object.keys(GATHERABLES).sort(), real, 'one sprite set per real ingredient, no invented ones');
  for (const [key, g] of Object.entries(GATHERABLES)) {
    assert.equal(g.region, WILD_SPECS.find((s) => s.key === key)?.region, `${key} is drawn in its own region`);
    assert.equal(g.atlas, REGION_ATLAS[g.region], `${key} comes from its region's atlas`);
    const frames = g.atlas.frames;
    for (const state of ['idle', 'hover', 'card', 'depleted']) assert.ok(frames[g[state]], `${key} ${state}`);
    // the states of one gatherable share a canvas, so they swap in place
    const [, , w, h] = frames[g.idle];
    for (const name of [g.hover, g.harvesting, g.closed, g.closedHover, g.atlas === MEADOW ? g.depleted : null].filter(Boolean)) assert.deepEqual(frames[name].slice(2), [w, h], `${name} shares ${key}'s canvas`);
  }
  assert.ok(GATHERABLES.silverleaf.harvesting, 'the herb sequence keeps its harvesting frame');
  // Ironroot grows half buried in the scene; its card shows the whole root
  assert.equal(GATHERABLES.ironroot.card, 'ironroot_card');
  assert.ok(FRAMES.ironroot_card[3] > FRAMES.ironroot_idle[3]);
  assert.equal(GATHERABLES.owlberry.card, 'owlberry_idle');
  for (let i = 0; i < 4; i++) assert.ok(FRAMES['glint_' + i]);
  // the pack's oaks stand both behind the clearing and, larger, in front of it
  for (const n of ['oak_round_01', 'oak_round_02', 'oak_wide_03']) {
    assert.ok(FRAMES[n + '_far'] && FRAMES[n + '_near'], n);
    assert.ok(FRAMES[n + '_near'][3] > FRAMES[n + '_far'][3], `${n}: the near oak is the finer, larger reduction`);
  }
  // the right-hand oaks are mirrored in the atlas (not at draw time), so their shaded bark is lit from the left
  for (const n of ['oak_round_01', 'oak_wide_03']) assert.deepEqual(FRAMES[n + '_near_m'].slice(2), FRAMES[n + '_near'].slice(2), n);
});

test('the meadow has its layers, its plants their closed hours and their icons', () => {
  const F = FIELD.FRAMES;
  // a layered scene: sky, clouds, mountains, treeline, fence, the oak and the field's props
  for (const n of ['sky', 'far_mountains', 'near_mountains', 'treeline', 'fence', 'oak', 'bush_pink', 'rock_big', 'bird_1', 'bird_3']) assert.ok(F[n], n);
  for (const n of ['sky', 'far_mountains', 'near_mountains', 'treeline']) assert.equal(F[n][2], SCENE_W, `${n} spans the scene`);
  assert.ok(Object.keys(F).some((n) => n.startsWith('cloud_')) && Object.keys(F).some((n) => n.startsWith('flowers_')) && Object.keys(F).some((n) => n.startsWith('grass_')));
  // the dawn clover and the dusk hemlock show closed frames out of their hour; the others never close
  for (const s of WILD_SPECS.filter((x) => x.region === 'meadow')) {
    const g = GATHERABLES[s.key];
    assert.equal(!!g.closed, !!(s.dawn || s.dusk), `${s.key} closes only if it keeps an hour`);
    // a 16 px icon for the shelf and the book, a 24 px one for its card
    assert.ok(g.icon && F[g.icon][2] <= 16 && F[g.icon][3] <= 16, `${s.key} icon`);
    assert.equal(g.card, s.key + '_card');
    assert.equal(Math.max(F[g.card][2], F[g.card][3]), 24, `${s.key} card is 24 px`);
    // a gatherable stands out from the 8-14 px decorative clumps
    assert.ok(F[g.idle][3] >= 20, `${s.key} is drawn larger than the flower clumps`);
  }
  for (const [n, f] of Object.entries(F)) if (n.startsWith('flowers_')) assert.ok(f[3] <= 14, `${n} stays a small clump`);
  assert.equal(gatherFrameName('dreamclover', { can: true, closed: true }), 'dreamclover_closed');
  assert.equal(gatherFrameName('dreamclover', { can: true, closed: true, hover: true }), 'dreamclover_closed_hover');
  assert.equal(gatherFrameName('dreamclover', { can: true }), 'dreamclover_idle');
  assert.equal(gatherFrameName('hemlock', { can: false, closed: true }), 'hemlock_depleted');
  assert.equal(gatherFrameName('heartpetal', { can: true, closed: true }), 'heartpetal_idle', 'a plant with no hour never shows closed');
  assert.equal(gatherFrameName('heartpetal', { can: true, card: true }), 'heartpetal_card');
});

test('a gatherable shows what can be done with it', () => {
  assert.equal(gatherFrameName('ironroot', { can: true }), 'ironroot_idle');
  assert.equal(gatherFrameName('ironroot', { can: true, hover: true }), 'ironroot_hover');
  assert.equal(gatherFrameName('ironroot', { can: false }), 'ironroot_depleted');
  assert.equal(gatherFrameName('ironroot', { can: false, hover: true }), 'ironroot_depleted', 'no highlight on what cannot be gathered');
  assert.equal(gatherFrameName('owlberry', { can: false }), 'picked');
  assert.equal(gatherFrameName('silverleaf', { can: true, harvesting: true }), 'silverleaf_harvesting');
  assert.equal(gatherFrameName('owlberry', { can: true, harvesting: true }), 'owlberry_idle');
  assert.equal(gatherFrameName('ironroot', { can: true, card: true }), 'ironroot_card');
  assert.equal(gatherFrameName('ironroot', { can: false, card: true }), 'ironroot_depleted');
  assert.equal(gatherFrameName('heartpetal', { can: true }), 'heartpetal_idle');
  assert.equal(gatherFrameName('frostcap', { can: true }), null, 'other regions keep their procedural sprites');
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

test('without a DOM the atlases never load and the procedural scenes stay', async () => {
  for (const atlas of [WOODLAND, MEADOW]) {
    assert.equal(await atlas.load(), false);
    assert.equal(atlas.ready, false);
  }
});
