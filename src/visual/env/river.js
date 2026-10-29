// Willow Bank: a slow river winding out of a pine-dark valley under blue
// mountains, its water clearly apart from the land — chalky banks and wet
// mud at its edges, reeds and cattails along the shore, stones and a gravel
// bar in the stream, and great willows trailing their fronds over it.

import { sky, ridge, ground, shadeOf, blades } from './paint.js';
import { palette, vary, streamOf, scaleAt, hazeAt, band, speckle, fbm2, hash2, noise2 } from './kit.js';
import { tree, bush, boulder, cloud, reeds, tuft, fern } from './objects.js';
import { hex, pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'river', p);
  const pal = vary(palette({
    leaf: ['#4a7a34', { spread: 0.55 }], willow: ['#5a8a3a', { spread: 0.55 }], bark: ['#4a3a2e', { spread: 0.5 }], wood: '#a88a5a', rock: '#7a7e80',
    cloud: ['#eef2f4', { spread: 0.28, cool: 0.5 }], grass: ['#527a30', { spread: 0.55, n: 7 }], mud: ['#5a4a36', { spread: 0.35, n: 5 }], chalk: ['#c8c0a8', { spread: 0.3, n: 5 }],
    water: ['#3a6e9a', { spread: 0.45, n: 7, cool: 0.2 }], reed: ['#6a8a3a', { spread: 0.5 }], cattail: '#6a4428', mount: ['#7a8eae', { spread: 0.35, n: 5 }],
    pine: ['#2e4e3e', { spread: 0.4 }], moss: '#6a8a3a',
  }), s('pal'), 0.8);
  const haze = pack(hex('#c0d4e4'));
  sky(cv, 0, 100, ['#4a7cbc', '#7aa6d6', '#b8d2e8', '#e4ecec'], 12);
  const cr = s('clouds');
  for (let i = 0; i < 3 + cr.int(0, 2); i++) cv.stamp(cloud(cr, cr.int(30, 60), cr.int(7, 12)), pal, cr.int(0, W), cr.int(14, 46), { outline: false, texture: 0.1 });
  ridge(cv, { base: 66, amp: 22, freq: 0.01, bottom: 104, ramp: pal.mount, seed: s('m').int(0, 1e9), tex: 0.3, peaks: 0.6, rim: 2 });
  // snow on the high peaks
  const hz0 = 92;
  // the pine-dark valley wall
  const pr = s('pines');
  for (let x = -6; x < W + 6; x += pr.int(5, 9)) cv.stamp(tree(pr, 'pine', pr.int(14, 24), 1.4), pal, x, hz0 + pr.int(-2, 3), { haze: [haze, 0.35], outline: false });
  const hz = new Float32Array(W), hs = s('hz').int(0, 1e9);
  for (let x = 0; x < W; x++) hz[x] = 96 + (fbm2(x * 0.012, 0, hs, 3) - 0.5) * 6;
  // the river, from the far left to the near right (or mirrored)
  const flip = s('flip').next() < 0.5;
  const riv = band(s('band'), 96, H, { x0: flip ? 250 : 130, x1: flip ? 120 : 270, w0: 5, w1: 46, wander: 26 });
  const gs = s('ground').int(0, 1e9), ws = gs + 77;
  /** distance outside the water's edge on a row (negative inside) */
  const edge = (x, y) => Math.abs(x - riv[y].c) - riv[y].hw - (noise2(x * 0.15, y * 0.3, ws) - 0.5) * 3;
  ground(cv, hz, (x, y, depth, n) => {
    const e = edge(x, y);
    if (e < 0) {
      // water: deeper in the middle, broken by ripples and sky reflections
      const mid = Math.min(1, -e / Math.max(2, riv[y].hw));
      const rip = noise2(x * 0.08, y * 0.9, ws + 3);
      let l = 0.62 - mid * 0.35 + (rip > 0.72 ? 0.3 : rip < 0.25 ? -0.08 : 0) + (1 - depth) * 0.18;
      return shadeOf(pal.water, l, x, y);
    }
    if (e < 2 + depth * 3) return shadeOf(pal.mud, 0.25 + n * 0.4, x, y);
    if (e < 4 + depth * 6) return shadeOf(pal.chalk, 0.3 + n * 0.5 + (hash2(x >> 1, y >> 1, gs) > 0.95 ? 0.2 : 0), x, y);
    return shadeOf(pal.grass, 0.2 + n * 0.45 + blades(x, y, depth, gs + 5) * (0.25 + depth * 0.35) + (fbm2(x * 0.02, y * 0.05, gs + 9, 2) - 0.5) * 0.4, x, y);
  }, gs);
  // water is not ground; neither is the wet edge
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (edge(x, y) < 2.5 + (y > 96 ? (y - 96) / (H - 96) * 4 : 0)) cv.open[y * W + x] = 0;
  cv.meta.river = { rows: riv.map((r) => [Math.round(r.c), Math.round(r.hw)]) };
  // in some worlds a plank footbridge crosses the stream
  const fb = s('bridge');
  if (fb.next() < 0.5) {
    const y = fb.int(130, 170), r = riv[y], x0 = Math.round(r.c - r.hw - 6), x1 = Math.round(r.c + r.hw + 6);
    for (let x = x0; x <= x1; x++) {
      const plank = Math.floor((x - x0) / 4) % 2;
      for (let j = 0; j < 4; j++) cv.set(x, y - 4 + j, pal.timber ? pal.timber[2] : (j === 0 ? pal.wood[4] : plank ? pal.wood[2] : pal.wood[3]));
      cv.set(x, y, pal.bark[0]);
      if ((x - x0) % 10 === 0) for (let j = 0; j < 9; j++) { cv.set(x, y - 12 + j, pal.bark[2]); cv.set(x + 1, y - 12 + j, pal.bark[0]); }
      cv.set(x, y - 10, pal.wood[3]);
    }
    cv.block(x0 - 1, y - 13, x1 + 2, y + 2);
  }
  // stones in the stream, a gravel bar
  const sr = s('stones');
  for (let i = 0; i < 4; i++) {
    const y = sr.int(130, H - 6), r = riv[y], x = r.c + sr.range(-0.6, 0.6) * r.hw, k = scaleAt(y, 96, H);
    cv.stamp(boulder(sr, 4 * k + 2, 2.5 * k + 1.5), pal, x, y, { haze: hazeAt(y, 96, H, haze, 0.3) });
  }
  // reeds and cattails along both shores
  const rr = s('reeds');
  for (let i = 0; i < 26; i++) {
    const y = rr.int(104, H - 2), r = riv[y], side = rr.next() < 0.5 ? -1 : 1, x = r.c + side * (r.hw + rr.range(1, 6));
    if (x < 0 || x >= W) continue;
    const k = scaleAt(y, 96, H);
    cv.stamp(reeds(rr, 10 + k * 14, rr.int(3, 6), { heads: 0.5 }), pal, x, y, { haze: hazeAt(y, 96, H, haze, 0.35), foot: [4 * k, 2] });
  }
  // willows over the water, bushes on the banks
  const wr = s('willows');
  const wx = flip ? wr.int(250, 330) : wr.int(30, 120), wy = wr.int(150, 175);
  cv.stamp(tree(wr, 'willow', wr.int(110, 135), wr.int(10, 13), { leaf: 'willow' }), pal, wx, wy, { foot: [16, 5] });
  const w2x = flip ? wr.int(20, 90) : wr.int(300, 370), w2y = wr.int(108, 118);
  cv.stamp(tree(wr, 'willow', wr.int(60, 75), wr.int(5, 7), { leaf: 'willow' }), pal, w2x, w2y, { haze: hazeAt(w2y, 96, H, haze, 0.35), foot: [8, 3] });
  for (let i = 0; i < 5; i++) {
    const y = wr.int(104, 200), x = wr.int(0, W);
    if (edge(x, y) < 12) continue;
    cv.stamp(bush(wr, 6 + scaleAt(y, 96, H) * 7, 5 + scaleAt(y, 96, H) * 4), pal, x, y, { haze: hazeAt(y, 96, H, haze, 0.3), foot: [8, 3] });
  }
  const tf = s('tufts');
  for (let i = 0; i < 50; i++) { const y = tf.int(104, H - 1), x = tf.int(0, W - 1); if (edge(x, y) > 6) cv.stamp(tuft(tf, 2 + scaleAt(y, 96, H) * 4, { leaf: 'grass' }), pal, x, y); }
  speckle(cv, s('flowers'), 300, 104, H, [pack(hex('#ffe58a')), pack(hex('#ffffff'))], { onOpen: true, cluster: s('fc').int(0, 1e9) });
  cv.meta.horizon = 96;
}
