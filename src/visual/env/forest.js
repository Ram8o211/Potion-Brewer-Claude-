// Whisperwood, seen from the side: a pale green mist between rows of trunk
// silhouettes, each row nearer and darker, under a canopy that closes over
// the top of the scene; great oaks framing it, their crowns meeting the
// canopy; and in front the forest floor in cross-section — dark loam
// threaded with roots and stones under a crust of moss, mossy ledges and a
// root-hung hollow, a fallen log and a stump, and shafts of light falling
// through the leaves.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, raise, fillSolid, blob, paintTerrain, markOpen, surfaceAt, hanging, glow, col, drips, ledges, far } from './side.js';
import { tree, fern, log, stump, crown } from './objects.js';
import { Model } from '../geometry.js';
import { hash2 } from '../noise.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'forest', p);
  // some worlds' woods are in their autumn
  const autumn = s('season').next() < 0.3;
  const pal = vary(palette({
    leaf: [autumn ? '#8a5a1e' : '#2f5e26', { spread: 0.6 }], bark: ['#4e3622', { spread: 0.55 }], wood: '#a87a48', rock: '#6e7270',
    moss: ['#5a8a34', { spread: 0.5 }], fern: [autumn ? '#9a7a2a' : '#5e9e3c', { spread: 0.55 }],
  }), s('pal'), 1);
  sky(cv, 0, H, ['#c4dcc8', '#a8ccb4', '#88b49c'], 8);
  // rows of trunks, the far ones palest, under canopies hanging from the top
  const rows = [{ c: '#94bca4', w: 3, n: 22, can: 30 }, { c: '#6e9a82', w: 5, n: 14, can: 22 }, { c: '#4a7660', w: 8, n: 9, can: 14 }];
  rows.forEach((r, k) => {
    const rr = s('row' + k), fill = col(r.c);
    for (let i = 0; i < r.n; i++) {
      const x0 = Math.round((i + rr.next() * 0.7) * (W / r.n)), w = r.w + rr.int(0, 2);
      for (let y = 0; y < H; y++) for (let x = x0; x < x0 + w; x++) if (x >= 0 && x < W) cv.pix.px[y * W + x] = far(fill, x, y, k * 97 + i);
    }
    hanging(cv, { base: r.can, amp: 10, freq: 0.03, seed: rr.int(0, 1e9), fill: r.c, rough: 4 });
  });
  // the forest floor: a low rise, a mossy ledge or two and a hollow under the roots
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 168, amp: 10, freq: 0.012 });
  const kx = ts.int(60, W - 140);
  raise(top, kx, kx + ts.int(30, 60), Math.min(...top) - ts.int(8, 14), 3);
  fillSolid(cv, top);
  ledges(cv, top, ts, 6);
  const hx = ts.int(60, W - 60);
  blob(cv, hx, top[hx] + 20, ts.int(14, 22), 8, ts.int(0, 1e9), 0);
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#3e2a1c', b: '#4c3422', grain: '#6e5034', dark: '#1e140c', deep: '#120c08', cave: '#0a0806',
    crust: [autumn ? '#c88a2a' : '#6aa83a', autumn ? '#9a6a22' : '#4a8a2c', '#2e5a22'], crustH: 3, seed: ss,
    grass: { cols: autumn ? ['#b07a24', '#8a5a1e'] : ['#4e9a34', '#6ab83e', '#3a7a2a'], tall: 3, rate: 0.5, flowers: ['#f0e0a0', '#e88aa0'] },
    rocks: { cols: ['#9a9e98', '#6e7270', '#3e4240'], n: 30, r: 6 },
  });
  // roots threading the ground under the surface
  const rt = s('roots'), root = col('#5a3a24'), rootLit = col('#7a5232');
  for (let i = 0; i < 14; i++) {
    let x = rt.int(0, W - 1), y = surfaceAt(cv, x) + rt.int(3, 8);
    const dx = rt.next() < 0.5 ? -1 : 1;
    for (let k = 0; k < rt.int(12, 30); k++) {
      if (x < 0 || x >= W || y >= H) break;
      if (cv.solid[y * W + x]) cv.set(x, y, k % 5 ? root : rootLit);
      else if (cv.cave[y * W + x]) { cv.set(x, y, root); }
      x += dx; if (hash2(x, y, i) < 0.45) y++;
    }
  }
  markOpen(cv);
  // the great oaks framing the scene, their crowns meeting the canopy
  const or = s('oaks');
  const lx = or.int(4, 30), rx = or.int(350, 378);
  cv.stamp(tree(or, 'oak', or.int(170, 190), or.int(18, 24), { lean: 0.03 }), pal, lx, surfaceAt(cv, lx) + 3, { roots: [22, 4] });
  cv.stamp(tree(or, 'oak', or.int(165, 185), or.int(16, 22), { lean: -0.03 }), pal, rx, surfaceAt(cv, rx) + 3, { roots: [20, 4] });
  const canopy = new Model();
  for (let x = -30; x < W + 30; x += or.int(22, 34)) crown(canopy, or, x, or.int(-16, 0), or.int(26, 38), or.int(16, 22), 'leaf', { n: 6 });
  cv.stamp(canopy, pal, 0, 0);
  // a fallen log, a stump, ferns
  const lr = s('logs'), gx = lr.int(90, 290);
  cv.stamp(log(lr, lr.int(40, 60), lr.int(5, 7), { moss: 'moss' }), pal, gx, surfaceAt(cv, gx) + 2, { foot: [26, 3] });
  const sx = lr.int(60, 320);
  cv.stamp(stump(lr, lr.int(10, 14), lr.int(7, 10)), pal, sx, surfaceAt(cv, sx) + 1, { foot: [8, 2] });
  const fr = s('ferns');
  for (let i = 0; i < 6; i++) { const x = fr.int(10, W - 10); cv.stamp(fern(fr, fr.int(8, 13), { leaf: 'fern' }), pal, x, surfaceAt(cv, x) + 1); }
  // shafts of light through a gap in the canopy
  const shafts = s('shafts'), sx0 = shafts.int(110, 230);
  cv.light([1, 0.95, 0.7], (x, y) => {
    const u = x - sx0 - y * 0.45, k = Math.floor(u / 22), v = ((u % 22) + 22) % 22;
    return k >= 0 && k < 3 && v < 9 - k * 2 ? 0.21 * (1 - y / H) : 0;
  }, 0, H);
  glow(cv, sx0 + 30, 20, 50, [1, 0.95, 0.7], 0.2);
  cv.meta.shaft = sx0;
  cv.meta.trickles = drips(cv, ss, 4);
  cv.meta.horizon = 120;
}
