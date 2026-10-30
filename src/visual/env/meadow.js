// Sunlit Meadow, seen from a cave mouth: the rock arches over a view of
// the open sky — the sun, clouds, blue mountains and a dark wood — and in
// front the meadow's floor in cross-section: earthy cobbles under a thick
// crust of grass dotted with flowers, mossy pillars dripping moss, an oak
// or two, vines curtaining the mouth, and what the world's meadow holds: a
// fence with straw beehives, a ring of standing stones, or a pond.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, raise, fillSolid, blob, paintTerrain, pool, markOpen, silhouette, treeShape, glow, drips, ledges } from './side.js';
import { caveFrame, fog, vines, moss, veins, WATER_VEINS } from './cave.js';
import { cloud, fence, skep, boulder } from './objects.js';
import { terrainTrees } from './trees.js';
import { Model, lumpy } from '../geometry.js';
import { pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'meadow', p);
  const pal = vary(palette({
    leaf: ['#3e7a2a', { spread: 0.6 }], leaf2: ['#78a02e', { spread: 0.6 }], bloom: ['#f0d040', { spread: 0.4 }], bark: '#4e3420', rock: '#7a7a72', cloud: ['#c8d4e4', { spread: 0.3, cool: 0.5 }],
    timber: '#6a4a2e', straw: ['#c8a050', { spread: 0.45 }], moss: '#5a8a34',
  }), s('pal'), 1);
  sky(cv, 0, 160, ['#2a5aa0', '#4a82c4', '#86b4dc', '#cfe2e8'], 10);
  const sx = 230 + s('sun').int(-50, 50), sy = 34;
  for (let y = sy - 10; y <= sy + 10; y++) for (let x = sx - 10; x <= sx + 10; x++) if (Math.hypot(x - sx, y - sy) <= 9.5) cv.set(x, y, Math.hypot(x - sx, y - sy) < 7.5 ? pack([1, 0.98, 0.86]) : pack([1, 0.92, 0.66]));
  glow(cv, sx, sy, 70, [1, 0.92, 0.7], 0.35);
  const cr = s('clouds');
  for (let i = 0; i < 4 + cr.int(0, 2); i++) cv.stamp(cloud(cr, cr.int(30, 70), cr.int(8, 14)), pal, cr.int(40, W - 40), cr.int(26, 70), { outline: false, texture: 0 });
  // the view: blue mountains, then a dark wood, then nearer hills
  silhouette(cv, { base: 100, amp: 18, freq: 0.009, seed: s('h1').int(0, 1e9), fill: '#4a6a94', rim: '#6a8ab0', peaks: 0.5 });
  fog(cv, '#9ab8d0', 96, 140, 0.25, s('haze').int(0, 1e9));
  const wood = silhouette(cv, { base: 124, amp: 8, freq: 0.014, seed: s('h2').int(0, 1e9), fill: '#1e3e30', rim: '#2a5038' });
  const tr = s('far');
  for (let x = 4; x < W; x += tr.int(5, 12)) treeShape(cv, x, wood[x] + 2, tr.int(12, 24), tr.next() < 0.4 ? 'pine' : 'oak', tr.next() < 0.5 ? '#1e3e30' : '#24482f', tr.int(0, 1e9));
  silhouette(cv, { base: 140, amp: 6, freq: 0.02, seed: s('h3').int(0, 1e9), fill: '#2e5a32', rim: '#3e7238' });
  // most meadows lie open under the sky; some are seen from a cave mouth framing it
  const fs = s('frame'), cave = fs.next() < 0.25;
  if (cave) {
    const o0 = fs.int(40, 80), o1 = W - fs.int(30, 70);
    const frame = caveFrame(cv, {
      seed: fs.int(0, 1e9), stones: ['#4a3e30', '#3e3428', '#4a4a34'], mortar: '#140e0a', dark: 0.35, roof: [40, 70], walls: [26, 22], open: [o0, o1],
      stal: { n: 10, len: [4, 18], w: [2, 5] }, lip: ['#5a9a34', '#3a6e26'],
    });
    vines(cv, frame.roof, { cols: ['#5a9a30', '#3e7226', '#2a5020'], leaf: '#6ab83a', flower: '#ff9fc7', seed: fs.int(0, 1e9), rate: 0.3, len: [4, 50] });
  }
  // the field: rolling ground, a grassy knoll, sometimes a pond in a hollow
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 166, amp: 10, freq: 0.01 });
  const kx = ts.int(40, W - 120);
  raise(top, kx, kx + ts.int(40, 70), Math.min(...top) - ts.int(10, 18), 3);
  const fr = s('feature'), feature = fr.weighted(['hives', 'stones', 'pond'], [1.2, 0.8, 0.8]);
  let pond = null;
  if (feature === 'pond') {
    const px = kx < W / 2 ? fr.int(220, 320) : fr.int(70, 150), hw = fr.int(26, 40);
    pond = { x: px, hw, level: Math.round(top[px]) + 2 };
    dip(top, px, hw, 16);
  }
  fillSolid(cv, top);
  if (ts.next() < 0.6) blob(cv, kx + 20, top[kx + 20] + 18, 12, 6, ts.int(0, 1e9), 0);
  ledges(cv, top, ts, 6, { keep: pond ? [[pond.x - pond.hw, pond.x + pond.hw]] : [] });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#6a4a30', b: '#7e5a3a', grain: '#a08060', dark: '#2a1c12', deep: '#140c08', cave: '#100a06',
    crust: ['#8ccf4a', '#5ea83a', '#3f7e2c', '#2e5a22'], crustH: 4, seed: ss,
    cobble: { stones: ['#7a6a52', '#6a5a44', '#8a7a5e', '#5a4e3c', '#76705a', '#64604a'], mortar: '#2a2018', s: 4 },
    grass: { cols: ['#6ab83e', '#8ccf4a', '#4e9a34'], tall: 4, rate: 0.7, flowers: ['#fff4c0', '#ffe066', '#ff9fc7', '#c9b0ff', '#ffffff', '#ff7a6a'] },
  });
  moss(cv, { cols: ['#8ccf4a', '#5ea83a', '#3f7e2c', '#2e5a22'], seed: ss + 1, drape: 9, rate: 0.2, len: 10 });
  if (pond) {
    cv.meta.pond = pool(cv, pond.x - pond.hw, pond.x + pond.hw, pond.level, { surface: '#cfe8ff', body: ['#3a6a98', '#2e5a86', '#244a72', '#1a3a5e'], see: 0.2, bed: ['#3a2e20', '#4a3a28', '#2a2018'] });
    veins(cv, cv.meta.pond, WATER_VEINS(ss + 4, ['#7aa8d8', '#3a6a98', '#2e5a86', '#244a72']));
  }
  markOpen(cv);
  // each piece set down where it fits, clear of the pillars, the trees and the pond
  if (feature === 'hives') {
    const fx = fr.int(70, 300), len = fr.int(36, 60);
    cv.place(fence(len, 14), pal, fx, { foot: [len * 0.6, 2], range: 240, x: [6, W - len - 6] });
    let bx = fr.int(20, W - 60), hives = null;
    for (let i = 0; i < 2 + fr.int(0, 1); i++) {
      // the skeps in a row, each just past the last
      const at = cv.place(skep(9), pal, bx, { foot: [6, 2], range: 30, step: 2 });
      if (!at) continue;
      hives ||= [at.fx + 6, at.fy - 9];
      bx = at.fx + 13;
    }
    if (hives) cv.meta.hives = hives;
  } else if (feature === 'stones') {
    let x = fr.int(80, 300);
    const ring = ++cv.nprops;
    for (let i = 0; i < 4; i++) {
      const m = new Model(), hh = fr.int(10, 18);
      m.poly(lumpy(0, -hh / 2, 3 + fr.next() * 1.5, hh / 2, () => fr.next(), 0.12, 5), 'rock', { shade: 'round' });
      const at = cv.place(m, pal, x, { sink: 2, foot: [4, 2], range: 20, step: 2, group: ring });
      x = (at ? at.fx : x) + fr.int(12, 18);
    }
  }
  // the oaks: one framing the mouth, maybe another in the field
  terrainTrees(cv, s('oaks'), pal, {
    n: 3, kinds: ['gnarl', 'tiers', 'oak'], shapes: ['spread', 'lean'], h: [60, 130], gap: 60, ledges: true,
    look: { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.2 } },
  });
  const rr = s('rocks');
  for (let i = 0; i < 2; i++) cv.place(boulder(rr, rr.int(5, 9), rr.int(3, 5), { moss: 'moss' }), pal, rr.int(10, W - 10), { sink: 2, foot: [8, 2] });
  cv.meta.sun = [sx, sy];
  cv.meta.trickles = drips(cv, ss, 3);
  cv.meta.vignette = cave ? 0.45 : 0.3;
  cv.meta.wind = cave ? 0.8 : 1;
  cv.meta.horizon = 120;
}
