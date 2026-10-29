// Sunlit Meadow, seen from the side: a bright banded sky and sun, rolling
// hills and far trees as flat silhouettes, and in front a cross-section of
// the field — dark loam under a thick grass crust dotted with flowers,
// rising into a grassy knoll, an oak or two, and what the world's meadow
// holds: a fence with straw beehives, a ring of standing stones, or a pond.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, raise, fillSolid, blob, paintTerrain, pool, markOpen, surfaceAt, silhouette, treeShape, glow, drips, ledges } from './side.js';
import { tree, cloud, fence, skep, boulder } from './objects.js';
import { Model, lumpy } from '../geometry.js';
import { pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'meadow', p);
  const pal = vary(palette({
    leaf: ['#3f7a2c', { spread: 0.6 }], bark: '#5a3c24', rock: '#8a8a84', cloud: ['#e8eef4', { spread: 0.3, cool: 0.5 }],
    timber: '#7a5432', straw: ['#c8a050', { spread: 0.45 }], moss: '#6a9a3a',
  }), s('pal'), 1);
  sky(cv, 0, 150, ['#3466b4', '#5a92d4', '#9cc6e8', '#d8ecdc'], 10);
  const sx = 290 + s('sun').int(-60, 40), sy = 26;
  for (let y = sy - 9; y <= sy + 9; y++) for (let x = sx - 9; x <= sx + 9; x++) if (Math.hypot(x - sx, y - sy) <= 8.5) cv.set(x, y, Math.hypot(x - sx, y - sy) < 6.5 ? pack([1, 0.99, 0.9]) : pack([1, 0.94, 0.7]));
  glow(cv, sx, sy, 60, [1, 0.95, 0.75], 0.3);
  const cr = s('clouds');
  for (let i = 0; i < 3 + cr.int(0, 2); i++) cv.stamp(cloud(cr, cr.int(30, 70), cr.int(8, 14)), pal, cr.int(0, W), cr.int(18, 60), { outline: false, texture: 0 });
  // the distance: two rows of hills, the far one bluest, trees along the near one
  silhouette(cv, { base: 96, amp: 16, freq: 0.007, seed: s('h1').int(0, 1e9), fill: '#86b0a4', rim: '#a4c8b4' });
  const near = silhouette(cv, { base: 116, amp: 12, freq: 0.011, seed: s('h2').int(0, 1e9), fill: '#5f9a5a', rim: '#7ab26a' });
  const tr = s('far');
  for (let x = 4; x < W; x += tr.int(9, 22)) if (tr.next() < 0.6) treeShape(cv, x, near[x] + 2, tr.int(10, 18), tr.next() < 0.3 ? 'pine' : 'oak', '#4a8248', tr.int(0, 1e9));
  // the field: rolling ground, a grassy knoll, sometimes a pond in a hollow
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 160, amp: 12, freq: 0.01 });
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
  // a little cave under the knoll, and grassy ledges jutting out over the field
  if (ts.next() < 0.6) blob(cv, kx + 20, top[kx + 20] + 18, 12, 6, ts.int(0, 1e9), 0);
  ledges(cv, top, ts, 6, { keep: pond ? [[pond.x - pond.hw, pond.x + pond.hw]] : [] });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#6a4a30', b: '#7e5a3a', grain: '#a08060', dark: '#3a2618', deep: '#2a1a12', cave: '#140c08',
    crust: ['#8ccf4a', '#5ea83a', '#3f7e2c', '#4a6a2c'], crustH: 4, seed: ss,
    grass: { cols: ['#6ab83e', '#8ccf4a', '#4e9a34'], tall: 4, rate: 0.7, flowers: ['#fff4c0', '#ffe066', '#ff9fc7', '#c9b0ff', '#ffffff', '#ff7a6a'] },
  });
  if (pond) {
    cv.meta.pond = pool(cv, pond.x - pond.hw, pond.x + pond.hw, pond.level, { surface: '#cfe8ff', body: ['#5a8ac8', '#4a74b0', '#3a5e94', '#2e4a78'], see: 0.2, bed: ['#4a3a26', '#5a4630', '#3a2a1c'] });
  }
  markOpen(cv);
  // the oaks
  const or = s('oaks'), left = or.next() < 0.5;
  const ox = left ? or.int(16, 50) : or.int(334, 368);
  cv.stamp(tree(or, 'oak', or.int(100, 120), or.int(9, 12)), pal, ox, surfaceAt(cv, ox) + 2, { roots: [14, 3] });
  if (or.next() < 0.7) { const o2 = left ? or.int(250, 320) : or.int(70, 130); cv.stamp(tree(or, 'oak', or.int(60, 80), or.int(5, 7)), pal, o2, surfaceAt(cv, o2) + 1, { roots: [8, 2] }); }
  if (feature === 'hives') {
    const fx = fr.int(70, 300), fy = surfaceAt(cv, fx) + 1;
    cv.stamp(fence(fr.int(50, 80), 14), pal, fx, fy, { foot: [40, 2] });
    const bx = fr.int(20, W - 60);
    for (let i = 0; i < 2 + fr.int(0, 1); i++) cv.stamp(skep(9), pal, bx + i * 13, surfaceAt(cv, bx + i * 13) + 1, { foot: [6, 2] });
    cv.meta.hives = [bx + 6, surfaceAt(cv, bx) - 8];
  } else if (feature === 'stones') {
    const cx = fr.int(80, 300);
    for (let i = 0; i < 4; i++) {
      const x = cx + i * fr.int(12, 18), m = new Model(), hh = fr.int(10, 18);
      m.poly(lumpy(0, -hh / 2, 3 + fr.next() * 1.5, hh / 2, () => fr.next(), 0.12, 5), 'rock', { shade: 'round' });
      cv.stamp(m, pal, x, surfaceAt(cv, x) + 2, { foot: [4, 2] });
    }
  }
  const rr = s('rocks');
  for (let i = 0; i < 2; i++) { const x = rr.int(10, W - 10); cv.stamp(boulder(rr, rr.int(5, 9), rr.int(3, 5), { moss: 'moss' }), pal, x, surfaceAt(cv, x) + 2, { foot: [8, 2] }); }
  cv.meta.sun = [sx, sy];
  cv.meta.trickles = drips(cv, ss, 3);
  cv.meta.horizon = 120;
}
