// Wild sprites (every region): each atlas and its frame map agree, every
// wild ingredient has gatherable art with all its states in its own region's
// atlas, the dawn and dusk plants have closed frames and every ingredient an
// icon, every ingredient grows through sprout, ripe and mature frames, each
// region has its painted backdrop, plants grow on its open ground with room
// round them, and hit testing
// picks plants — never the scenery — at any scene size.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { ATLASES } from '../src/rendering/wilds-atlas.js';
import * as FIELD from '../src/rendering/meadow-atlas.js';
import * as GROW from '../src/rendering/growth-atlas.js';
import { GATHERABLES, GROWTH, MIN_HIT, MEADOW, REGION_ATLAS, gatherFrameName, growthFrame, plantBox, hitPlant } from '../src/rendering/wild-sprites.js';
import { REGIONS, STAGES, depositStatus } from '../src/game/gathering.js';
import { WILD_SPECS } from '../src/materials/wild.js';
import { GameState } from '../src/game/state.js';
import { SCENE_W, SCENE_H, PlantGround, BACKDROPS, GROUND_TOP } from '../src/rendering/regions.js';
import { GROUND } from '../src/rendering/backdrops-ground.js';


test('each atlas file exists and matches its generated frame map', () => {
  const all = [FIELD, GROW, ...Object.values(ATLASES).map((a) => ({ ATLAS_URL: a.url, ATLAS_SIZE: a.size, FRAMES: a.frames }))];
  for (const { ATLAS_URL, ATLAS_SIZE, FRAMES: frames } of all) {
    const png = fs.readFileSync(new URL('../' + ATLAS_URL, import.meta.url));
    assert.equal(png.toString('ascii', 1, 4), 'PNG');
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], ATLAS_SIZE, 'IHDR size');
    for (const [name, [x, y, w, h]] of Object.entries(frames)) {
      assert.ok(w > 0 && h > 0 && x >= 0 && y >= 0 && x + w <= ATLAS_SIZE[0] && y + h <= ATLAS_SIZE[1], `${name} lies inside ${ATLAS_URL}`);
    }
  }
  assert.equal(REGION_ATLAS.meadow, MEADOW);
  for (const r of REGIONS) assert.ok(REGION_ATLAS[r.id], `${r.id} has an atlas`);
  for (const [region, a] of Object.entries(ATLASES)) assert.equal(REGION_ATLAS[region].url, a.url);
});

test('every wild ingredient has gatherable art in its own region; nothing else does', () => {
  const real = WILD_SPECS.map((s) => s.key).sort();
  assert.deepEqual(Object.keys(GATHERABLES).sort(), real, 'one sprite set per real ingredient, no invented ones');
  for (const [key, g] of Object.entries(GATHERABLES)) {
    const spec = /** @type {any} */ (WILD_SPECS.find((s) => s.key === key));
    assert.equal(g.region, spec.region, `${key} is drawn in its own region`);
    assert.equal(g.atlas, REGION_ATLAS[g.region], `${key} comes from its region's atlas`);
    const frames = g.atlas.frames;
    for (const state of ['idle', 'hover', 'card', 'depleted']) assert.ok(frames[g[state]], `${key} ${state}`);
    // the states of one gatherable share a canvas, so they swap in place
    const [, , w, h] = frames[g.idle];
    for (const name of [g.hover, g.depleted, g.harvesting, g.closed, g.closedHover].filter(Boolean)) assert.deepEqual(frames[name].slice(2), [w, h], `${name} shares ${key}'s canvas`);
    // a dawn or dusk plant shows a closed frame out of its hour; the others never close
    assert.equal(!!g.closed, !!(spec.dawn || spec.dusk), `${key} closes only if it keeps an hour`);
    // a 16 px icon for the shelf and the book, a 24 px one for its card
    assert.ok(g.icon && frames[g.icon][2] <= 16 && frames[g.icon][3] <= 16, `${key} icon`);
    assert.equal(g.card, key + '_card');
    assert.equal(Math.max(frames[g.card][2], frames[g.card][3]), 24, `${key} card is 24 px`);
    // large enough to tap and to read, narrow enough to stand beside its neighbours
    assert.ok(frames[g.idle][3] >= 16 && frames[g.idle][2] <= 32, `${key} is ${frames[g.idle][2]}x${frames[g.idle][3]}`);
  }
  for (const a of [MEADOW, ...Object.values(REGION_ATLAS)]) for (let i = 0; i < 4; i++) assert.ok(a.frames['glint_' + i], `${a.url} glint ${i}`);
});

test('each sprite region has a layered scene spanning the frame', () => {
  const layers = {
    forest: ['sky', 'distant', 'mid', 'near', 'oaks', 'oak_small'],
    river: ['sky', 'mountains', 'pines', 'water', 'bank', 'willow_great', 'willow_second'],
    quarry: ['sky', 'far_cliffs', 'near_cliffs', 'crane', 'frame', 'cart'],
    moonfen: ['sky', 'hills', 'treeline', 'mist', 'water', 'willow_left', 'willow_center'],
    crags: ['sky', 'ridges', 'fissures', 'crag_large', 'lava_pool', 'gusher'],
  };
  for (const [region, names] of Object.entries(layers)) {
    const F = ATLASES[region].frames;
    for (const n of names) assert.ok(F[n], `${region} ${n}`);
    for (const n of names.slice(0, 3)) assert.equal(F[n][2], SCENE_W, `${region} ${n} spans the scene`);
  }
});

test('the meadow has its layers, its plants their closed hours and their icons', () => {
  const F = FIELD.FRAMES;
  // a layered scene: sky, clouds, mountains, treeline, fence, the oak and the field's props
  for (const n of ['sky', 'far_mountains', 'near_mountains', 'treeline', 'fence', 'oak', 'bush_pink', 'rock_big', 'bird_1', 'bird_3']) assert.ok(F[n], n);
  for (const n of ['sky', 'far_mountains', 'near_mountains', 'treeline']) assert.equal(F[n][2], SCENE_W, `${n} spans the scene`);
  assert.ok(Object.keys(F).some((n) => n.startsWith('cloud_')) && Object.keys(F).some((n) => n.startsWith('flowers_')) && Object.keys(F).some((n) => n.startsWith('grass_')));
  // a gatherable stands out from the 8-14 px decorative clumps
  for (const s of WILD_SPECS.filter((x) => x.region === 'meadow')) assert.ok(F[GATHERABLES[s.key].idle][3] >= 20, `${s.key} is drawn larger than the flower clumps`);
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
  assert.equal(gatherFrameName('owlberry', { can: true, harvesting: true }), 'owlberry_idle', 'no harvesting art: the idle frame hops');
  assert.equal(gatherFrameName('ironroot', { can: true, card: true }), 'ironroot_card');
  assert.equal(gatherFrameName('ironroot', { can: false, card: true }), 'ironroot_depleted');
  assert.equal(gatherFrameName('frostcap', { can: true }), 'frostcap_idle');
  assert.equal(gatherFrameName('moonlily', { can: true, closed: true }), 'moonlily_closed');
  assert.equal(gatherFrameName('gravemoss', { can: true, closed: true, hover: true }), 'gravemoss_closed_hover');
  assert.equal(gatherFrameName('obsidian', { can: true, closed: true }), 'obsidian_idle', 'a mineral never closes');
  assert.equal(gatherFrameName('nosuch', { can: true }), null);
});

test('every wild ingredient grows in place through sprout, ripe and mature frames', () => {
  for (const { key } of WILD_SPECS) {
    const names = STAGES.map((stage) => growthFrame(key, stage));
    for (const [i, n] of names.entries()) assert.equal(n, `${key}_${STAGES[i]}`, `${key} has a ${STAGES[i]} frame`);
    assert.equal(growthFrame(key, 'mature', true), `${key}_mature_hover`, 'a mature plant lights up under the pointer');
    assert.equal(growthFrame(key, 'ripe', true), `${key}_ripe`, 'a growing one does not (it cannot be harvested)');
    // every frame of a plant shares one canvas, so it grows in place on its foot
    const size = GROWTH.frames[`${key}_mature_hover`].slice(2);
    for (const n of names) assert.deepEqual(GROWTH.frames[/** @type {string} */ (n)].slice(2), size, `${n} shares ${key}'s canvas`);
    assert.ok(size[0] <= 34 && size[1] >= 12, `${key} is ${size[0]}x${size[1]}`);
  }
  assert.equal(growthFrame('nosuch', 'mature'), null);
});

test('plant boxes sit on the plant’s spot and are never smaller than a tap', () => {
  for (const name of [...WILD_SPECS.flatMap(({ key }) => STAGES.map((st) => growthFrame(key, st))), null]) {
    const b = plantBox({ x: 0.5, y: 0.7 }, name, SCENE_W, SCENE_H);
    assert.equal(b.ax, 128); assert.equal(b.ay, Math.round(0.7 * SCENE_H));
    assert.ok(b.x1 - b.x0 >= MIN_HIT && b.y1 - b.y0 >= MIN_HIT, `${name} hit box`);
    assert.ok(b.y1 >= b.ay && b.y0 < b.ay, 'the box stands on the ground point');
  }
  // positions are fractions of the scene: a larger scene scales them
  const big = plantBox({ x: 0.25, y: 0.5 }, 'owlberry_mature', SCENE_W * 3, SCENE_H * 3);
  assert.equal(big.ax, SCENE_W * 0.75); assert.equal(big.ay, SCENE_H * 1.5);
});

test('hit testing finds plants, prefers the front one and ignores the scenery', () => {
  const st = GameState.create('whisper-hit', { tutorial: false });
  const now = Date.now();
  const plants = st.deposits.filter((d) => d.region === 'forest').flatMap((d) => depositStatus(st.gathering, d, now).plants.map((p) => ({ ...p, key: st.lookup(d.materialId).wild.key })));
  const frameOf = (p) => growthFrame(p.key, p.stage);
  assert.ok(plants.length >= 8);
  // the sky and the canopy hold no plants (they grow between 0.56 and 0.9 of the height)
  for (let x = 0; x < SCENE_W; x += 8) assert.equal(hitPlant(plants, frameOf, x, 4, SCENE_W, SCENE_H), null, `sky at ${x}`);
  // two overlapping plants: the one nearer the viewer (lower) wins
  const a = { id: 'a', x: 0.5, y: 0.6 }, b = { id: 'b', x: 0.52, y: 0.66 };
  const both = [a, b], k = () => 'silverleaf_mature';
  assert.equal(hitPlant(both, k, 0.51 * SCENE_W, 0.6 * SCENE_H - 2, SCENE_W, SCENE_H)?.id, 'b');
  // a near miss within the slop still counts; a far one does not
  const box = plantBox(a, 'silverleaf_mature', SCENE_W, SCENE_H);
  assert.equal(hitPlant([a], k, box.x1 + 3, box.y0 + 5, SCENE_W, SCENE_H)?.id, 'a');
  assert.equal(hitPlant([a], k, box.x1 + 12, box.y0 + 5, SCENE_W, SCENE_H), null);
});

/** The RGBA pixels of an 8-bit, non-interlaced RGBA PNG (the atlases). @param {Buffer} png */
function decodePng(png) {
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  assert.deepEqual([png[24], png[25], png[28]], [8, 6, 0], 'RGBA, 8 bits, not interlaced');
  const idat = [];
  for (let o = 8; o < png.length;) {
    const len = png.readUInt32BE(o), type = png.toString('ascii', o + 4, o + 8);
    if (type === 'IDAT') idat.push(png.subarray(o + 8, o + 8 + len));
    o += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = width * 4, data = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), row = y * stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= 4 ? data[row + i - 4] : 0, b = y ? data[row - stride + i] : 0, c = y && i >= 4 ? data[row - stride + i - 4] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const pred = f === 1 ? a : f === 2 ? b : f === 3 ? (a + b) >> 1 : f === 4 ? (pa <= pb && pa <= pc ? a : pb <= pc ? b : c) : 0;
      data[row + i] = (src[i] + pred) & 255;
    }
  }
  return { width, data };
}

test('each region has its painted backdrop, the size of the scene, with open ground below its far scenery', () => {
  for (const r of REGIONS) {
    const png = fs.readFileSync(new URL('../' + BACKDROPS[r.id].url, import.meta.url));
    assert.equal(png.toString('ascii', 1, 4), 'PNG');
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [SCENE_W, SCENE_H], `${r.id} backdrop size`);
    const rows = GROUND[r.id];
    assert.equal(rows.length, SCENE_H, `${r.id} ground has a row per scene row`);
    for (const runs of rows) for (const [x0, x1] of runs) assert.ok(x0 >= 0 && x0 < x1 && x1 <= SCENE_W, `${r.id} run inside the scene`);
    const area = rows.reduce((n, runs) => n + runs.reduce((m, [x0, x1]) => m + x1 - x0, 0), 0);
    assert.ok(area > 2500, `${r.id} has room to grow (${area} px of ground)`);
    assert.ok(GROUND_TOP[r.id] > SCENE_H / 2, `${r.id} ground lies in the lower half`);
  }
});

test('every plant stands on its backdrop\'s ground, clear of the others, and keeps its spot as it grows', () => {
  const regions = REGIONS.map((r) => r.id);
  const unready = { id: 'x', x: 0.3, y: 0.6, key: 'silverleaf' };
  assert.deepEqual(new PlantGround('forest').place([unready], () => null), { x: { x: 0.3, y: 0.6 } }, 'without its shape a plant keeps its spot');
  GROWTH.pixels = decodePng(fs.readFileSync(new URL('../' + GROWTH.url, import.meta.url)));
  GROWTH.ready = true;
  /** a plant's full-grown silhouette: every frame of it */
  const shapeOf = (p) => {
    const [, , w, h] = GROWTH.frame(p.key + '_mature_hover'), m = new Uint8Array(w * h);
    for (const st of [...STAGES, 'mature_hover']) { const mm = GROWTH.mask(`${p.key}_${st}`); for (let k = 0; k < m.length; k++) m[k] |= mm[k]; }
    return { w, h, m };
  };
  try {
    for (const seed of ['whisper-hit', 'gather-seed-1', 'abc', 'zed9']) {
      const st = GameState.create(seed, { tutorial: false });
      // the region saturated: every stand's plants, several of them sprouted later at random spots
      const later = Date.now() + 1e9;
      for (const d of st.deposits) st.gathering.nodes[d.id] = { plants: [], due: Date.now(), seq: 0 };
      for (const region of regions) {
        const ground = new Uint8Array(SCENE_W * SCENE_H);
        GROUND[region].forEach((runs, y) => { for (const [x0, x1] of runs) ground.fill(1, y * SCENE_W + x0, y * SCENE_W + x1); });
        const plants = st.deposits.filter((d) => d.region === region)
          .flatMap((d) => depositStatus(st.gathering, d, later).plants.map((p) => ({ ...p, key: st.lookup(d.materialId).wild.key })))
          .sort((a, b) => a.born - b.born);
        const pg = new PlantGround(region);
        const spots = pg.place(plants, shapeOf);
        assert.deepEqual(pg.place(plants, shapeOf), spots, 'the same layout every time');
        // a plant harvested leaves the others where they stand
        const fewer = plants.slice(1);
        const after = pg.place(fewer, shapeOf);
        for (const p of fewer) assert.deepEqual(after[p.id], spots[p.id], 'neighbours do not move');
        assert.deepEqual(new PlantGround(region).place(plants, shapeOf), spots, 'deterministic for a seed');
        const placed = new Uint8Array(SCENE_W * SCENE_H);
        /** @type {{ax:number, ay:number}[]} */
        const feet = [];
        for (const p of plants) {
          const s = spots[p.id], name = `${p.key}_mature_hover`;
          const ax = Math.round(s.x * SCENE_W), ay = Math.round(s.y * SCENE_H);
          const where = `${seed} ${region} ${p.id} at ${ax},${ay}`;
          const [, , w, h] = GROWTH.frame(name), left = Math.round(ax - w / 2), top = ay - h;
          assert.ok(left >= 1 && left + w <= SCENE_W - 1 && top >= 1 && ay <= SCENE_H - 3, `${where} lies inside the frame`);
          // its foot and shadow rest on the ground (never in water, lava or on a rock)
          const sw = Math.max(4, Math.round(w * 0.5));
          for (let x = ax - Math.floor(sw / 2); x < ax - Math.floor(sw / 2) + sw; x++) assert.ok(ground[ay * SCENE_W + x], `${where}: its foot at ${x} is on the ground`);
          const m = /** @type {Uint8Array} */ (GROWTH.mask(name));
          for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
            if (!m[j * w + i]) continue;
            const k = (top + j) * SCENE_W + left + i;
            assert.ok(!placed[k], `${where} overlaps another plant`);
            placed[k] = 1;
          }
          feet.push({ ax, ay });
        }
        // not crowded: most plants keep a clear stride from their nearest neighbour
        const near = feet.filter((a) => feet.some((b) => b !== a && Math.abs(a.ax - b.ax) < 12 && Math.abs(a.ay - b.ay) < 6)).length;
        assert.ok(near <= Math.ceil(feet.length / 4), `${seed} ${region}: ${near} of ${feet.length} plants crowd a neighbour`);
      }
    }
  } finally {
    GROWTH.pixels = null; GROWTH.masks = {}; GROWTH.ready = false;
  }
});

test('without a DOM the atlases never load and the procedural scenes stay', async () => {
  for (const atlas of [MEADOW, ...Object.values(REGION_ATLAS), ...Object.values(BACKDROPS)]) {
    assert.equal(await atlas.load(), false);
    assert.equal(atlas.ready, false);
  }
});
