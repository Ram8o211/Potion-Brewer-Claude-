// Willow Bank, seen from the side: blue mountains and dark pines as flat
// silhouettes, and in front the river in cross-section — clear water lying
// in its bed between two banks of chalky clay and gravel under a crust of
// grass, reeds and cattails at the water's edge, weeping willows, and in
// some worlds a footbridge over the stream.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, raise, fillSolid, ledges, paintTerrain, pool, markOpen, surfaceAt, silhouette, treeShape } from './side.js';
import { tree, cloud, reeds, beam } from './objects.js';
import { Model } from '../geometry.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'river', p);
  const pal = vary(palette({
    leaf: ['#5a8a34', { spread: 0.55 }], bark: '#4a3826', cloud: ['#eef2f4', { spread: 0.3 }], reed: ['#6a8a3a', { spread: 0.5 }],
    cattail: '#6a4428', timber: '#7a5a3a',
  }), s('pal'), 1);
  sky(cv, 0, 150, ['#4a7cbc', '#7aa6d6', '#b8d2e8', '#e4ecec'], 10);
  const cr = s('clouds');
  for (let i = 0; i < 3 + cr.int(0, 2); i++) cv.stamp(cloud(cr, cr.int(30, 60), cr.int(7, 12)), pal, cr.int(0, W), cr.int(14, 50), { outline: false });
  silhouette(cv, { base: 78, amp: 24, freq: 0.01, seed: s('m').int(0, 1e9), fill: '#8a9ec0', rim: '#c8d4e4', peaks: 0.6 });
  const pines = silhouette(cv, { base: 116, amp: 8, freq: 0.02, seed: s('p').int(0, 1e9), fill: '#4e7a6a' });
  const pr = s('pines');
  for (let x = 2; x < W; x += pr.int(5, 11)) treeShape(cv, x, pines[x] + 2, pr.int(12, 22), 'pine', '#3e6a5a', pr.int(0, 1e9));
  // the banks and the river bed between them
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 156, amp: 10, freq: 0.012 });
  const rx = ts.int(140, 250), hw = ts.int(38, 50);
  dip(top, rx, hw, 34, 0.35);
  const bank = ts.next() < 0.5 ? ts.int(20, 90) : ts.int(300, 360);
  raise(top, bank, bank + ts.int(20, 40), Math.min(...top) - ts.int(6, 12), 3);
  fillSolid(cv, top);
  ledges(cv, top, ts, 7, { keep: [[rx - hw - 6, rx + hw + 6]] });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#8a7a62', b: '#c8c0a8', grain: '#e8e4d4', dark: '#3a3226', deep: '#2a261e', cave: '#12100c',
    crust: ['#7ab84a', '#5a9a3a', '#3e7a2e'], crustH: 3, seed: ss, blot: 0.08,
    grass: { cols: ['#5a9a3a', '#7ab84a', '#4a8a30'], tall: 4, rate: 0.6, flowers: ['#ffe58a', '#ffffff'] },
    rocks: { cols: ['#c8ccc8', '#8a8e8c', '#4a4e4c'], n: 26, r: 5 },
  });
  const level = Math.round(Math.max(top[rx - hw], top[rx + hw])) + 6;
  cv.meta.river = pool(cv, rx - hw, rx + hw, level, { surface: '#e4f4ff', body: ['#6aa4d8', '#5a90c8', '#4a7ab0', '#3a6496', '#2e5078'], see: 0.25, bed: ['#5a4a36', '#6e5e48', '#4a3e2e'] });
  markOpen(cv);
  // reeds at the water's edge, a willow on a bank
  const rr = s('reeds');
  for (const side of [-1, 1]) for (let i = 0; i < 2; i++) {
    let x = rx + side * (hw - rr.int(2, 12));
    while (cv.liquid[(surfaceAt(cv, x) - 1) * W + x] && x > 0 && x < W - 1) x += side;
    cv.stamp(reeds(rr, rr.int(12, 20), rr.int(4, 7), { heads: 0.5 }), pal, x, surfaceAt(cv, x) + 1);
  }
  const wr = s('willow'), wx = rx < W / 2 ? wr.int(300, 360) : wr.int(24, 80);
  cv.stamp(tree(wr, 'willow', wr.int(90, 110), wr.int(8, 11)), pal, wx, surfaceAt(cv, wx) + 2, { roots: [12, 3] });
  if (wr.next() < 0.6) {
    // a footbridge from bank to bank
    const y = level - 4, m = new Model(), x0 = rx - hw - 4, x1 = rx + hw + 4;
    beam(m, [x0, y], [x1, y], 3);
    for (let x = x0 + 8; x < x1; x += 16) beam(m, [x, y - 8], [x, y + 1], 1.6);
    beam(m, [x0, y - 8], [x1, y - 8], 1.4);
    cv.stamp(m, pal, 0, 0);
    cv.meta.bridge = [x0, x1, y];
  }
  cv.meta.horizon = 116;
}
