// Moonfen: a haunted bog at night — a starry sky and a haloed moon over a
// black treeline, old willows hung with moss and a dead tree, shallow black
// pools holding the moon's reflection between tussocks, reeds and stepping
// stones, faintly glowing crystals and a cairn on a barrow, and banks of
// mist lying low over the water.

import { sky, ridge, ground, shadeOf } from './paint.js';
import { palette, vary, streamOf, scaleAt, hazeAt, inPool, speckle, fbm2, hash2, noise2, mixPacked } from './kit.js';
import { tree, reeds, boulder, spire, cairn, crown, tuft } from './objects.js';
import { Model, lumpy } from '../geometry.js';
import { hex, pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'moonfen', p);
  const pal = vary(palette({
    leaf: ['#1e3e34', { spread: 0.45 }], moss: ['#2e5a46', { spread: 0.5 }], bark: ['#2a2420', { spread: 0.4 }], wood: '#5a4a3a', rock: ['#3e4250', { spread: 0.45 }],
    bog: ['#1a2a22', { spread: 0.35, n: 6 }], water: ['#0e1630', { spread: 0.35, n: 6 }], reed: ['#2e4a34', { spread: 0.45 }], cattail: '#3a2a1e',
    gem: ['#9a7ae0', { spread: 0.6 }], far: ['#141a34', { spread: 0.15, n: 4 }], far2: ['#0c1022', { spread: 0.12, n: 4 }],
  }), s('pal'), 0.8);
  const haze = pack(hex('#3a4a78'));
  sky(cv, 0, 118, ['#04050e', '#0a0f2a', '#18204a', '#2a2e5e'], 14);
  // stars, a few bright ones crossed
  const st = s('stars');
  for (let i = 0; i < 160; i++) { const x = st.int(0, W - 1), y = st.int(0, 100), b = st.next(); cv.set(x, y, pack(b > 0.8 ? [0.95, 0.95, 1] : b > 0.4 ? [0.7, 0.72, 0.95] : [0.45, 0.48, 0.75])); }
  for (let i = 0; i < 5; i++) { const x = st.int(4, W - 4), y = st.int(4, 70), c = pack([0.85, 0.9, 1]); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]) cv.set(x + dx, y + dy, c); }
  // the moon and its halo
  const mx = s('moon').int(40, W - 40), my = s('moon2').int(22, 40), mr = 13;
  cv.light([0.45, 0.5, 0.75], (x, y) => Math.max(0, 0.3 - Math.hypot(x - mx, y - my) / 120), 0, 120);
  const ms = s('craters').int(0, 1e9);
  for (let y = my - mr; y <= my + mr; y++) for (let x = mx - mr; x <= mx + mr; x++) {
    const d = Math.hypot(x - mx, y - my);
    if (d > mr + 0.3) continue;
    const l = 0.92 - (x - mx + y - my) / (mr * 6) - (fbm2(x * 0.25, y * 0.25, ms, 2) > 0.58 ? 0.12 : 0);
    cv.set(x, y, pack([0.86 * l + 0.1, 0.9 * l + 0.08, l + 0.05]));
  }
  // black treelines
  ridge(cv, { base: 92, amp: 10, freq: 0.03, bottom: 120, ramp: pal.far, seed: s('t1').int(0, 1e9), tex: 0.1, rough: 10 });
  const tl = s('tl');
  for (let x = -6; x < W + 6; x += tl.int(8, 16)) { const m = new Model(); crown(m, tl, 0, -tl.int(8, 16), tl.int(7, 12), tl.int(8, 13), 'far2', { n: 4 }); cv.stamp(m, pal, x, 112, { outline: false }); }
  ridge(cv, { base: 106, amp: 5, freq: 0.04, bottom: 120, ramp: pal.far2, seed: s('t2').int(0, 1e9), tex: 0.1, rough: 6 });
  // the bog and its pools
  const hz = new Float32Array(W).fill(112);
  const gs = s('bog').int(0, 1e9), ps = gs + 101;
  const pool = (x, y) => inPool(x, y, 112, H, ps, 0.58);
  ground(cv, hz, (x, y, depth, n) => {
    if (pool(x, y)) {
      // black water: the moon's broken reflection, scattered stars, a lighter rim
      const rim = !pool(x, y - 1) || !pool(x - 1, y) || !pool(x + 1, y);
      const refl = Math.abs(x - mx) < 3 + depth * 12 && noise2(x * 0.3, y * 0.6, gs + 5) > 0.45 ? 0.45 : 0;
      const star = hash2(x, y, gs + 9) > 0.993 ? 0.6 : 0;
      return shadeOf(pal.water, (rim ? 0.75 : 0.25 + n * 0.25) + refl + star, x, y);
    }
    const tussock = fbm2(x * 0.06, y * 0.14, gs + 3, 3);
    return shadeOf(pal.bog, 0.18 + n * 0.4 + (tussock > 0.6 ? 0.25 : 0) + (hash2(x, y, gs) > 0.9 ? 0.15 : 0), x, y);
  }, gs);
  for (let y = 112; y < H; y++) for (let x = 0; x < W; x++) if (pool(x, y) || pool(x, y + 1) || pool(x - 1, y) || pool(x + 1, y)) cv.open[y * W + x] = 0;
  cv.meta.pools = true;
  // willows hung with moss, and a dead tree
  const wr = s('willows');
  const sides = [[wr.int(0, 50), wr.int(160, 190)], [wr.int(320, 384), wr.int(150, 180)]];
  for (const [x, y] of sides) cv.stamp(tree(wr, 'willow', wr.int(110, 140), wr.int(9, 13)), pal, x, y, { foot: [14, 5], haze: [pack(hex('#16204a')), 0.35] });
  const dx = wr.int(140, 250), dy = wr.int(120, 132);
  cv.stamp(tree(wr, 'dead', wr.int(55, 75), wr.int(5, 7)), pal, dx, dy, { haze: hazeAt(dy, 112, H, haze, 0.35), foot: [6, 3] });
  // reeds, cattails and tussocks round the pools
  const rr = s('reeds');
  for (let i = 0; i < 40; i++) {
    const y = rr.int(116, H - 2), x = rr.int(0, W - 1);
    if (pool(x, y) || !(pool(x, y + 3) || pool(x + 4, y) || pool(x - 4, y))) continue;
    const k = scaleAt(y, 112, H);
    cv.stamp(reeds(rr, 8 + k * 12, rr.int(3, 5), { heads: 0.4 }), pal, x, y, { haze: hazeAt(y, 112, H, haze, 0.4), foot: [3 * k + 1, 2] });
  }
  // stepping stones, a cairn on the barrow, crystals glowing faintly
  const sr = s('stones');
  for (let i = 0; i < 6; i++) { const y = sr.int(124, H - 4), x = sr.int(20, W - 20); if (!pool(x, y)) continue; const k = scaleAt(y, 112, H); cv.stamp(boulder(sr, 3 + k * 5, 1.5 + k * 2, { moss: 'moss' }), pal, x, y); }
  const cx = sr.int(60, 320), cy = sr.int(126, 150);
  if (!pool(cx, cy)) cv.stamp(cairn(sr, 6), pal, cx, cy, { foot: [7, 3], haze: hazeAt(cy, 112, H, haze, 0.3) });
  const glows = [];
  for (let i = 0; i < 3; i++) {
    const y = sr.int(130, H - 10), x = sr.int(10, W - 10);
    if (pool(x, y)) continue;
    const k = scaleAt(y, 112, H);
    cv.stamp(spire(sr, 6 + k * 10), pal, x, y, { foot: [4, 2] });
    glows.push([x, y - 6 * k]);
  }
  for (const [gx, gy] of glows) cv.light([0.35, 0.25, 0.7], (x, y) => Math.max(0, 0.22 - Math.hypot(x - gx, (y - gy) * 1.4) / 60), gy - 40, gy + 30);
  const tf = s('tufts');
  for (let i = 0; i < 40; i++) { const y = tf.int(116, H - 1), x = tf.int(0, W - 1); if (!pool(x, y)) cv.stamp(tuft(tf, 2 + scaleAt(y, 112, H) * 4, { leaf: 'reed' }), pal, x, y); }
  // banks of mist lying over the bog
  const fs = s('mist').int(0, 1e9), mist = pack(hex('#7a8ab8'));
  cv.wash(mist, (x, y) => {
    const band = Math.exp(-(((y - 116) / 12) ** 2)) * 0.55 + Math.exp(-(((y - 158) / 9) ** 2)) * 0.3;
    return band * fbm2(x * 0.02, y * 0.05, fs, 3);
  }, 96, H);
  cv.meta.horizon = 112;
  cv.meta.glows = glows;
  cv.meta.moon = [mx, my];
}

export { mixPacked, lumpy };
