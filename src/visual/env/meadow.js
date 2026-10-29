// Sunlit Meadow: an open, warm hillside field — rolling hills fading into a
// blue distance, a hedgerow and far trees, an oak or two, a post-and-rail
// fence with straw beehives along it, a worn path, and grass thick with
// clustered wild flowers.

import { sky, ridge, ground, shadeOf, blades } from './paint.js';
import { palette, vary, streamOf, scaleAt, hazeAt, band, speckle, fbm2, hash2 } from './kit.js';
import { tree, bush, boulder, cloud, fence, skep, tuft } from './objects.js';
import { hex, pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'meadow', p);
  const pal = vary(palette({
    leaf: ['#3f7a2c', { spread: 0.6 }], bark: '#5a3c24', wood: '#b88a52', rock: '#8a8a84', cloud: ['#e8eef4', { spread: 0.3, cool: 0.5 }],
    hedge: ['#2f6428', { spread: 0.55 }], timber: '#7a5432', straw: ['#c8a050', { spread: 0.45 }], grass: ['#5a9a34', { spread: 0.55, n: 7 }],
    soil: ['#8a6440', { spread: 0.35, n: 5 }], hill: ['#6a9a7a', { spread: 0.3, n: 5 }], hill2: ['#4f8a48', { spread: 0.35, n: 5 }], moss: '#6a9a3a',
  }), s('pal'), 1);
  const haze = pack(hex('#b8d4e4'));
  sky(cv, 0, 112, ['#3466b4', '#5a92d4', '#9cc6e8', '#e0ecdc'], 14);
  // the sun and its glow
  const sx = 290 + s('sun').int(-40, 40), sy = 28;
  cv.light([1, 0.95, 0.75], (x, y) => Math.max(0, 0.32 - Math.hypot(x - sx, y - sy) / 140), 0, 112);
  for (let y = sy - 9; y <= sy + 9; y++) for (let x = sx - 9; x <= sx + 9; x++) if (Math.hypot(x - sx, y - sy) <= 8.5) cv.set(x, y, Math.hypot(x - sx, y - sy) < 6.5 ? pack([1, 0.99, 0.9]) : pack([1, 0.94, 0.7]));
  const cr = s('clouds');
  for (let i = 0; i < 4 + cr.int(0, 2); i++) cv.stamp(cloud(cr, cr.int(30, 70), cr.int(8, 14)), pal, cr.int(0, W), cr.int(18, 60), { outline: false, texture: 0.1 });
  // rolling hills, the far ones bluest
  ridge(cv, { base: 84, amp: 12, freq: 0.008, bottom: 120, ramp: pal.hill, seed: s('h1').int(0, 1e9), tex: 0.25 });
  const far = ridge(cv, { base: 96, amp: 7, freq: 0.012, bottom: 130, ramp: pal.hill2, seed: s('h2').int(0, 1e9), tex: 0.35 });
  // far trees along the far hill
  const tr = s('far');
  for (let x = -10; x < W + 10; x += tr.int(6, 16)) {
    if (tr.next() < 0.35) continue;
    const y = far[Math.max(0, Math.min(W - 1, x))] + 2;
    cv.stamp(tree(tr, tr.next() < 0.3 ? 'pine' : 'oak', tr.int(10, 18), 1.5), pal, x, y, { haze: [haze, 0.45], outline: false });
  }
  // the field
  const hz = new Float32Array(W);
  const hs = s('hz').int(0, 1e9);
  for (let x = 0; x < W; x++) hz[x] = 104 + (fbm2(x * 0.01, 0, hs, 3) - 0.5) * 10;
  const path = band(s('path'), 104, H, { x0: s('px').range(150, 240), x1: s('px2').range(110, 280), w0: 1.5, w1: 16, wander: 22 });
  const gs = s('grass').int(0, 1e9);
  ground(cv, hz, (x, y, depth, n) => {
    const r = path[y], dp = Math.abs(x - r.c) - r.hw + (hash2(x, y, gs) - 0.5) * 2.5;
    if (dp < 0) return shadeOf(pal.soil, 0.45 + n * 0.4 + (dp > -1.5 ? -0.15 : 0), x, y);
    const patch = fbm2(x * 0.02, y * 0.05, gs + 5, 2);
    return shadeOf(pal.grass, 0.22 + n * 0.4 + (patch - 0.5) * 0.55 + blades(x, y, depth, gs + 9) * (0.3 + depth * 0.35) + (dp < 1.5 ? -0.15 : 0), x, y);
  }, gs);
  // the hedgerow along the field's far edge
  const hr = s('hedge');
  for (let x = -8; x < W + 8; x += hr.int(10, 18)) {
    const y = hz[Math.max(0, Math.min(W - 1, x))] + 1;
    cv.stamp(bush(hr, hr.int(7, 12), hr.int(5, 8), { leaf: 'hedge', dots: hr.next() < 0.3 ? 'straw' : undefined }), pal, x, y, { haze: [haze, 0.2], foot: [9, 3] });
  }
  // fence and beehives
  const fr = s('fence'), fx = fr.int(60, 180), fy = fr.int(112, 120);
  cv.stamp(fence(fr.int(70, 110), 14), pal, fx, fy, { haze: hazeAt(fy, 104, H, haze, 0.3) });
  cv.block(fx - 55, fy - 2, fx + 55, fy + 2);
  const bx = fr.next() < 0.5 ? fr.int(250, 330) : fr.int(20, 60);
  for (let i = 0; i < 2 + fr.int(0, 1); i++) { cv.stamp(skep(9), pal, bx + i * 13, 116 + i, { foot: [7, 3] }); }
  // oaks: one near, maybe one further off
  const or = s('oaks'), left = or.next() < 0.5;
  const ox = left ? or.int(18, 60) : or.int(324, 366), oy = or.int(150, 172);
  cv.stamp(tree(or, 'oak', or.int(110, 140), or.int(10, 14)), pal, ox, oy, { foot: [16, 5] });
  const o2x = left ? or.int(250, 340) : or.int(40, 120), o2y = or.int(112, 120);
  cv.stamp(tree(or, 'oak', or.int(55, 75), or.int(5, 7)), pal, o2x, o2y, { haze: hazeAt(o2y, 104, H, haze, 0.35), foot: [8, 3] });
  // boulders and grass tufts
  const rr = s('rocks');
  for (let i = 0; i < 2; i++) { const x = rr.int(10, W - 10), y = rr.int(170, 210); cv.stamp(boulder(rr, rr.int(8, 14), rr.int(5, 8), { moss: 'moss' }), pal, x, y, { foot: [12, 5] }); }
  const tf = s('tufts');
  for (let i = 0; i < 70; i++) { const y = tf.int(112, H - 1), x = tf.int(0, W - 1); cv.stamp(tuft(tf, 2 + scaleAt(y, 104, H) * 4, { leaf: 'grass' }), pal, x, y); }
  // wild flowers in drifts
  const fl = s('flowers');
  const petals = ['#fff4c0', '#ffe066', '#ff9fc7', '#c9b0ff', '#ffffff', '#ff7a6a'].map((c) => pack(hex(c)));
  for (let k = 0; k < 6; k++) speckle(cv, fl, 700, 110, H, [petals[k]], { onOpen: true, cluster: fl.int(0, 1e9), big: true, stem: pal.grass[1] });
  // warm afternoon light from the upper right, a soft shade at the bottom corners
  cv.light([1, 0.85, 0.55], (x, y) => Math.max(0, 0.08 - Math.hypot(x - sx, y - sy) / 4000), 0, H);
  cv.wash(pack([0.1, 0.16, 0.08]), (x, y) => Math.max(0, (y - 170) / 46) * 0.25 * (Math.abs(x - W / 2) / (W / 2)), 170, H);
  cv.meta.horizon = 104;
  cv.meta.sun = [sx, sy];
}
