// Wild sprites (every region): each atlas and its frame map agree, every
// wild ingredient has gatherable art with all its states in its own region's
// atlas, the dawn and dusk plants have closed frames and every ingredient an
// icon, every ingredient grows through sprout, ripe and mature frames, each
// region has its layered scene, plants grow on open ground, and hit testing
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
import { SCENE_W, SCENE_H, PlantGround, fixedOf, lavaStream, GROUND_TOP, animateRegion } from '../src/rendering/regions.js';


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

test('every plant rises out of open ground, clear of the scenery and of each other, and keeps its spot as it grows', () => {
  const regions = ['forest', 'meadow', 'river', 'quarry', 'moonfen', 'crags'];
  for (const r of regions) assert.ok(GROUND_TOP[r] > SCENE_H / 2, `${r} has open ground`);
  const unready = { id: 'x', x: 0.3, y: 0.6, key: 'silverleaf' };
  assert.deepEqual(new PlantGround('forest', 's').place([unready], () => null), { x: { x: 0.3, y: 0.6 } }, 'until the sheet can be read a plant keeps its spot');
  const atlases = [...new Set(regions.map((r) => REGION_ATLAS[r])), GROWTH];
  for (const a of atlases) { a.pixels = decodePng(fs.readFileSync(new URL('../' + a.url, import.meta.url))); a.ready = true; }
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
        const A = REGION_ATLAS[region];
        const plants = st.deposits.filter((d) => d.region === region)
          .flatMap((d) => depositStatus(st.gathering, d, later).plants.map((p) => ({ ...p, key: st.lookup(d.materialId).wild.key })))
          .sort((a, b) => a.born - b.born);
        const ground = new PlantGround(region, seed);
        const spots = ground.place(plants, shapeOf);
        assert.deepEqual(ground.place(plants, shapeOf), spots, 'the same layout every time');
        // a plant harvested leaves the others where they stand
        const fewer = plants.slice(1);
        const after = ground.place(fewer, shapeOf);
        for (const p of fewer) assert.deepEqual(after[p.id], spots[p.id], 'neighbours do not move');
        assert.deepEqual(new PlantGround(region, seed).place(plants, shapeOf), spots, 'deterministic for a seed');
        // the scenery's pixels: upright pieces, and the flat ones (pools) no foot may rest in
        const solid = new Uint8Array(SCENE_W * SCENE_H), flat = new Uint8Array(SCENE_W * SCENE_H);
        /** @param {Uint8Array} grid @param {any} atlas @param {string} name @param {number} x @param {number} y @param {boolean} [flip] */
        const paint = (grid, atlas, name, x, y, flip) => {
          const [, , w, h] = atlas.frame(name), m = atlas.mask(name), left = Math.round(x - w / 2), top = Math.round(y - h);
          let hit = false;
          for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
            const px = left + i, py = top + j;
            if (!m[j * w + (flip ? w - 1 - i : i)] || px < 0 || py < 0 || px >= SCENE_W || py >= SCENE_H) continue;
            if (grid[py * SCENE_W + px]) hit = true;
            grid[py * SCENE_W + px] = 1;
          }
          return { hit, left, top, w, h };
        };
        for (const [name, x, y, flip, isFlat] of fixedOf(region)) paint(isFlat ? flat : solid, A, name, x, y, flip);
        const lava = region === 'crags' ? lavaStream(seed) : [];
        const placed = new Uint8Array(SCENE_W * SCENE_H);
        for (const p of plants) {
          const s = spots[p.id], name = `${p.key}_mature_hover`;
          const ax = Math.round(s.x * SCENE_W), ay = Math.round(s.y * SCENE_H);
          const where = `${seed} ${p.id} at ${ax},${ay}`;
          assert.ok(ay >= GROUND_TOP[region] && ay <= SCENE_H - 3, `${where}: its foot is on the open ground, inside the frame`);
          const b = paint(placed, GROWTH, name, ax, ay);
          assert.ok(!b.hit, `${where} overlaps another plant`);
          assert.ok(b.left >= 1 && b.left + b.w <= SCENE_W - 1 && b.top >= 1, `${where} lies inside the frame`);
          const m = /** @type {Uint8Array} */ (GROWTH.mask(name));
          for (let j = 0; j < b.h; j++) for (let i = 0; i < b.w; i++) {
            if (!m[j * b.w + i]) continue;
            const k = (b.top + j) * SCENE_W + b.left + i;
            assert.ok(!solid[k], `${where} overlaps the scenery at ${b.left + i},${b.top + j}`);
            if (j === b.h - 1) assert.ok(!flat[k], `${where} stands in a pool`);
          }
          // the foot's row: on the near shore or the far meadow, never in the river; never in the lava
          if (region === 'river') assert.ok(ay < 89 || ay > 120, `${where} stands in the river`);
          const row = lava.find(([y]) => y === ay - 1);
          if (row) assert.ok(b.left + b.w <= row[1] - row[2] / 2 || b.left >= row[1] + row[2] / 2, `${where} stands in the lava`);
        }
      }
    }
  } finally {
    for (const a of atlases) { a.pixels = null; a.masks = {}; a.ready = false; }
  }
});

test('the Ember Crags breathe moving smoke, not smoke painted into the rocks', () => {
  const A = REGION_ATLAS.crags;
  // the vent and gusher frames end at their mouths: the pack's plumes are cleared
  assert.ok(A.frame('vent')[3] < 20 && A.frame('gusher')[3] < 36, 'no plume left on the vent or the gusher');
  /** what the overlay paints at time t above the plain: pixel → its last colour and opacity */
  const smoke = (t) => {
    /** @type {Map<string, string>} */
    const px = new Map();
    const ctx = /** @type {any} */ ({ fillStyle: '', globalAlpha: 1, fillRect(x, y, w, h) { if (y < 72 && this.globalAlpha > 0) for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) px.set(`${x + i},${y + j}`, this.fillStyle + this.globalAlpha); } });
    animateRegion(ctx, 'crags', t);
    return px;
  };
  A.ready = true;
  try {
    const a = smoke(1), b = smoke(2.5);
    assert.ok(a.size > 100 && b.size > 100, 'smoke rises over the vent and the gusher');
    const same = [...a].filter(([k, v]) => b.get(k) === v).length;
    assert.ok(same < a.size / 2, `and it moves (${same} of ${a.size} pixels unchanged)`);
  } finally {
    A.ready = false;
  }
});

test('without a DOM the atlases never load and the procedural scenes stay', async () => {
  for (const atlas of [MEADOW, ...Object.values(REGION_ATLAS)]) {
    assert.equal(await atlas.load(), false);
    assert.equal(atlas.ready, false);
  }
});
