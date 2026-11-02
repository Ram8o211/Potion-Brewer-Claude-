// Dreamspire Hollow (exotic, dream): a twilight sky fading from deep
// violet to rose, stars and a ringed moon; far hills of lavender where
// giant flowers droop in sleep; and in front a soft hollow in cross-section
// — lilac moss over violet clay and lavender stones, wisteria in bloom,
// giant sleeping flowers, glowing mushrooms, a starry pool. Dreams float up
// from the flowers in bubbles (wild-scene.js) that pop at a touch.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, fillSolid, ledges, paintTerrain, pool, markOpen, glow, silhouette } from './side.js';
import { fog, moss, glowShrooms, veins, WATER_VEINS } from './cave.js';
import { cloud, mushroom } from './objects.js';
import { terrainTrees } from './trees.js';
import { sleeper, farShapes, mistBands, openSpots } from './exotic.js';
import { fbm2 } from '../noise.js';
import { pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'dreamspire', p);
  const pal = vary(palette({
    leaf: ['#c878d8', { spread: 0.6 }], leaf2: ['#e8a0d8', { spread: 0.6 }], bloom: ['#fff0ff', { spread: 0.3 }], bark: '#4a3058', rock: ['#6a5a80', { spread: 0.4 }],
    cloud: ['#f0b8d8', { spread: 0.3 }], cap: ['#ff8ad0', { spread: 0.4 }], stem: '#f4e0f0', moss: '#b878c8',
  }), s('pal'), 0.9);
  const late = s('tod').next() < 0.5;
  sky(cv, 0, H, late ? ['#0e0a24', '#2a1a4a', '#5a3a7a', '#a86a9a'] : ['#2a1e4e', '#5a3a7a', '#b06aa0', '#f4a8b8'], 10);
  // stars over the top, a ringed moon
  const st = s('stars');
  for (let i = 0; i < 90; i++) { const x = st.int(0, W - 1), y = st.int(0, 90), b = st.next(); if (b > 0.3) cv.set(x, y, pack(b > 0.85 ? [1, 0.95, 1] : [0.85, 0.75, 0.95])); }
  const mx = s('moon').int(50, W - 50), my = s('moon').int(26, 50), mr = s('moon').int(9, 14);
  glow(cv, mx, my, 70, [1, 0.8, 0.95], 0.35);
  for (let y = my - mr - 4; y <= my + mr + 4; y++) for (let x = mx - mr * 2; x <= mx + mr * 2; x++) {
    const d = Math.hypot(x - mx, y - my), ring = Math.abs(Math.hypot((x - mx) / 2, (y - my) * 1.6) - mr * 0.95);
    if (d <= mr) cv.set(x, y, pack(d > mr - 1 ? [0.95, 0.8, 0.95] : (x - mx) + (y - my) < -mr * 0.4 ? [1, 0.96, 1] : [0.96, 0.86, 0.98]));
    else if (ring < 0.9 && !(y < my && d < mr + 3)) cv.set(x, y, pack([1, 0.86, 0.7]));
  }
  const cr = s('clouds');
  for (let i = 0; i < 4; i++) cv.stamp(cloud(cr, cr.int(30, 60), cr.int(6, 12)), pal, cr.int(20, W - 20), cr.int(50, 100), { outline: false, texture: 0 });
  // far hills of lavender with giant flowers asleep on them
  const hl = silhouette(cv, { base: 134, amp: 10, freq: 0.012, seed: s('hills').int(0, 1e9), fill: '#7a4a8a', rim: '#9a6aaa' });
  farShapes(cv, { n: 6, base: 140, h: [30, 56], fill: '#6a3e7a', rim: '#b880c8', seed: s('blooms').int(0, 1e9), kind: 'bloom' });
  fog(cv, '#c890c0', 110, 170, 0.3, s('fog').int(0, 1e9));
  silhouette(cv, { base: 150, amp: 6, freq: 0.02, seed: s('hills2').int(0, 1e9), fill: '#8a5a98', rim: '#b07ac0' });
  void hl;
  // the hollow: soft rolling ground, a starry pool
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: ts.int(160, 170), amp: ts.int(6, 12), freq: 0.01 });
  const pools = [];
  if (ts.next() < 0.6) {
    const px = ts.int(60, W - 60), hw = ts.int(18, 30);
    pools.push({ x: px, hw, level: Math.round(top[px]) + 2 });
    dip(top, px, hw, ts.int(10, 14));
  }
  fillSolid(cv, top);
  ledges(cv, top, ts, ts.int(5, 8), { keep: pools.map((p) => [p.x - p.hw - 4, p.x + p.hw + 4]) });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#5e5070', b: '#685a7c', grain: '#9a88b0', dark: '#1e1428', deep: '#120c1a', cave: '#0c0812',
    crust: ['#f0b8f0', '#d090e0', '#a870c0', '#8456a0'], crustH: 4, seed: ss,
    cobble: { stones: ['#64567a', '#5a4c6e', '#6e6086', '#4e4262', '#786a90', '#5e5274'], mortar: '#0e0a16', s: 10, moss: ['#a870c0', '#f0b8f0'] },
    grass: { cols: ['#e0a0e8', '#f0b8f0', '#c080d0'], tall: 4, rate: 0.6, flowers: ['#ffffff', '#fff0a0', '#a0f0ff', '#ffd0f0'] },
    layers: [
      { kind: 'clay', cols: ['#9a6aaa', '#8a5a9a', '#aa7aba', '#7a4e8a'], h: [8, 12] },
      { kind: 'band', cols: ['#5a4470', '#6a5482', '#8a74a0', '#1e1428'], h: [3, 5] },
    ],
  });
  moss(cv, { cols: ['#f0b8f0', '#d090e0', '#a870c0', '#7a4e8a'], seed: ss + 1, drape: 10, rate: 0.28, len: 14 });
  cv.meta.pools = pools.map((p) => pool(cv, p.x - p.hw, p.x + p.hw, p.level, { surface: '#ffe0ff', body: ['#6a4a9a', '#523a82', '#3e2c6a', '#2c1e52'], see: 0.2, bed: ['#3a2a4a', '#4a3a5a', '#2a1e36'] }));
  cv.meta.pools.forEach((p, i) => veins(cv, p, { ...WATER_VEINS(ss + 4 + i, ['#c8a0f0', '#6a4a9a', '#523a82', '#3e2c6a']), n: 2, reach: 30 }));
  // stars reflected in the pool
  for (const p of cv.meta.pools) for (let i = 0; i < 6; i++) { const x = p.x0 + 3 + ((i * 37 + ss) % Math.max(1, p.x1 - p.x0 - 6)), y = p.level + 2 + (i % 3) * 2; if (cv.liquid[y * W + x]) cv.set(x, y, 0xfffff0ff); }
  markOpen(cv);
  // wisteria in bloom, giant sleeping flowers, glowing mushrooms
  const look = { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.15 }, hang: { mat: 'leaf2', rate: 0.3, len: /** @type {[number, number]} */ ([4, 16]) } };
  terrainTrees(cv, s('trees'), pal, { n: s('trees').int(2, 4), kinds: ['wisteria', 'gnarl', 'wisteria'], h: [50, 100], gap: 60, ledges: true, look });
  const fs = s('sleepers'), spots = openSpots(cv, 70), blooms = [];
  for (let i = 0; i < 60 && blooms.length < fs.int(3, 5); i++) {
    const [x, y] = spots[fs.int(0, spots.length - 1)] || [0, 0];
    const h = fs.int(26, 46);
    if (!x || blooms.some((q) => Math.abs(q[0] - x) < 30) || !cv.clear(x - 12, y - h - 8, x + 12, y - 1)) continue;
    blooms.push(sleeper(cv, x, y, h, { stem: ['#2e5a3a', '#4a8a4a', '#7ac06a'], petal: fs.next() < 0.5 ? ['#7a2a6a', '#c05aa0', '#f08ad0', '#ffd0f0'] : ['#3a3a8a', '#6a6ad8', '#a8a8ff', '#e8e8ff'], leaf: ['#2e5a3a', '#4a8a4a', '#7ac06a'] }, fs.int(0, 1e9)));
    glow(cv, blooms[blooms.length - 1][0], blooms[blooms.length - 1][1] - 6, 20, [1, 0.6, 0.9], 0.3);
  }
  const mr2 = s('shrooms');
  for (let i = 0; i < 2; i++) {
    const at = cv.place(mushroom(mr2, mr2.int(16, 26), mr2.int(8, 12)), pal, mr2.int(20, W - 20), { foot: [5, 2], range: 60 });
    if (at) glow(cv, at.fx, at.fy - 20, 30, [1, 0.55, 0.85], 0.4);
  }
  const glows = glowShrooms(cv, { n: 6, cap: '#ff8ad0', lit: '#ffe0f4', stem: '#d8b8e0', rgb: [1, 0.55, 0.85], seed: s('caps').int(0, 1e9) });
  mistBands(cv, pack([0.95, 0.8, 0.95]), [[156, 8, 0.2], [182, 7, 0.15]], s('mist').int(0, 1e9));
  cv.meta.blooms = blooms;
  cv.meta.glows = glows;
  cv.meta.vignette = 0.4;
  cv.meta.wind = 0.5;
  cv.meta.horizon = 140;
  void fbm2;
}
