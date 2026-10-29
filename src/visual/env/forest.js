// Whisperwood: deep old woodland — rows of trunks fading into a blue-green
// distance under a closed canopy, great oaks framing a clearing with roots
// spreading over a floor of moss and leaf litter, ferns, mossy logs and
// stones, and dappled light falling in shafts through the leaves.

import { sky, ground, shadeOf, blades } from './paint.js';
import { palette, vary, streamOf, scaleAt, hazeAt, speckle, fbm2, hash2 } from './kit.js';
import { tree, bush, boulder, fern, log, stump, crown, tuft } from './objects.js';
import { Model } from '../geometry.js';
import { hex, pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'forest', p);
  // some worlds' woods are in their autumn
  const autumn = s('season').next() < 0.3;
  const pal = vary(palette({
    leaf: [autumn ? '#8a5a1e' : '#2f5e26', { spread: 0.6 }], canopy: [autumn ? '#5a3418' : '#1f4220', { spread: 0.5 }], bark: ['#4e3622', { spread: 0.55 }], wood: '#a87a48', rock: '#6e7270',
    moss: ['#5a8a34', { spread: 0.5 }], floor: [autumn ? '#4a4a1f' : '#33501f', { spread: 0.55, n: 7 }], litter: [autumn ? '#8a4a1e' : '#6a4a28', { spread: 0.45, n: 5 }], fern: [autumn ? '#9a7a2a' : '#5e9e3c', { spread: 0.55 }],
    far: ['#4a7a6a', { spread: 0.3, n: 4 }], mid: ['#30574a', { spread: 0.35, n: 4 }],
  }), s('pal'), 1);
  const haze = pack(hex('#8ab8a8')), deep = pack(hex('#5c8a7c'));
  sky(cv, 0, 120, ['#a8d0e0', '#d8ecdc', '#b8d8c0'], 10);
  // three rows of distant trunks and crowns, each nearer one darker and sharper
  const rows = [{ y: 112, h: 90, w: 3, n: 26, hz: 0.62 }, { y: 116, h: 110, w: 5, n: 16, hz: 0.42 }, { y: 120, h: 130, w: 7, n: 10, hz: 0.22 }];
  rows.forEach((r, k) => {
    const rr = s('row' + k);
    for (let i = 0; i < r.n; i++) {
      const x = (i + rr.next() * 0.8) * (W / r.n), m = new Model(), hh = r.h * (0.8 + rr.next() * 0.3);
      m.stroke([[0, 0], [rr.range(-2, 2), -hh]], [r.w * 1.3, r.w], 'bark', { tex: 1.2 });
      cv.stamp(m, pal, x, r.y, { haze: [k ? deep : haze, r.hz], outline: k > 0 });
    }
    // their crowns close the sky
    const cm = new Model();
    for (let x = -20; x < W + 20; x += rr.int(16, 26)) crown(cm, rr, x, -r.h + rr.int(-8, 8), rr.int(16, 26), rr.int(14, 20), 'canopy', { n: 5 });
    cv.stamp(cm, pal, 0, r.y, { haze: [k ? deep : haze, r.hz * 0.9], outline: k > 0 });
  });
  // the forest floor: moss with drifts of leaf litter, roots and dappled light
  const hz = new Float32Array(W), hs = s('hz').int(0, 1e9);
  for (let x = 0; x < W; x++) hz[x] = 118 + (fbm2(x * 0.015, 0, hs, 3) - 0.5) * 8;
  const gs = s('floor').int(0, 1e9);
  const dapple = (x, y) => fbm2(x * 0.035, y * 0.08, gs + 33, 3);
  ground(cv, hz, (x, y, depth, n) => {
    const litter = fbm2(x * 0.03, y * 0.07, gs + 11, 3) + (hash2(x, y, gs + 2) - 0.5) * 0.08, lightSpot = dapple(x, y) > 0.6 ? 0.2 : dapple(x, y) > 0.56 ? 0.08 : 0;
    // fallen leaves: flecks of light and dark, thinning out at the litter's edge
    const fleck = hash2(x >> (depth > 0.5 ? 1 : 0), y, gs + 3);
    if (litter > 0.56) return shadeOf(pal.litter, 0.2 + n * 0.4 + lightSpot + (fleck > 0.8 ? 0.25 : fleck < 0.15 ? -0.2 : 0), x, y);
    return shadeOf(pal.floor, 0.12 + n * 0.45 + lightSpot + (fleck > 0.9 ? 0.2 : 0) + blades(x, y, depth, gs + 5) * depth * 0.25 - (1 - depth) * 0.1, x, y);
  }, gs);
  // a mid-distance trunk or two standing in the clearing's far side
  const mr = s('midtrees');
  for (let i = 0; i < 2; i++) {
    const x = mr.int(110, 280), y = mr.int(122, 130);
    cv.stamp(tree(mr, mr.next() < 0.3 ? 'birch' : 'oak', mr.int(80, 105), mr.int(6, 8)), pal, x, y, { haze: hazeAt(y, 118, H, deep, 0.3), foot: [8, 3] });
  }
  // bushes along the clearing's edge
  const br = s('bushes');
  for (let i = 0; i < 9; i++) { const x = br.int(0, W), y = br.int(120, 140); cv.stamp(bush(br, br.int(8, 16), br.int(6, 10)), pal, x, y, { haze: hazeAt(y, 118, H, deep, 0.25), foot: [10, 3] }); }
  // logs, a stump, mossy stones, ferns
  const lr = s('logs');
  cv.stamp(log(lr, lr.int(50, 70), lr.int(6, 8), { moss: 'moss' }), pal, lr.int(90, 300), lr.int(176, 200), { foot: [32, 8] });
  cv.stamp(stump(lr, lr.int(10, 14), lr.int(7, 10)), pal, lr.int(60, 320), lr.int(140, 170), { foot: [9, 4] });
  for (let i = 0; i < 3; i++) cv.stamp(boulder(lr, lr.int(7, 13), lr.int(5, 8), { moss: 'moss' }), pal, lr.int(10, W - 10), lr.int(150, 212), { foot: [11, 5] });
  const fr = s('ferns');
  for (let i = 0; i < 10; i++) { const y = fr.int(130, H - 2), x = fr.int(0, W); cv.stamp(fern(fr, 6 + scaleAt(y, 118, H) * 8, { leaf: 'fern' }), pal, x, y, { foot: [5, 2] }); }
  const tf = s('tufts');
  for (let i = 0; i < 50; i++) { const y = tf.int(122, H - 1); cv.stamp(tuft(tf, 2 + scaleAt(y, 118, H) * 4, { leaf: 'floor' }), pal, tf.int(0, W - 1), y); }
  // the great oaks framing the scene, their crowns meeting overhead
  const or = s('oaks');
  const lx = or.int(4, 34), rx = or.int(346, 378);
  cv.stamp(tree(or, 'oak', or.int(190, 215), or.int(20, 26), { lean: 0.03 }), pal, lx, or.int(198, 210), { foot: [26, 8] });
  cv.stamp(tree(or, 'oak', or.int(180, 205), or.int(18, 24), { lean: -0.03 }), pal, rx, or.int(194, 206), { foot: [24, 8] });
  const top = new Model();
  for (let x = -30; x < W + 30; x += or.int(22, 34)) crown(top, or, x, or.int(-14, 6) - (Math.abs(x - W / 2) < 80 ? -6 : 10), or.int(28, 40), or.int(18, 26), 'leaf', { n: 6 });
  cv.stamp(top, pal, 0, 0);
  // golden motes and light shafts through the gap in the canopy
  const shafts = s('shafts'), sx0 = shafts.int(110, 230);
  cv.light([1, 0.95, 0.7], (x, y) => {
    const u = x - sx0 - y * 0.45, k = Math.floor(u / 22);
    const v = ((u % 22) + 22) % 22;
    return k >= 0 && k < 3 && v < 9 - k * 2 ? 0.17 * (1 - y / H) : 0;
  }, 0, H);
  speckle(cv, s('motes'), 30, 60, 170, [pack(hex('#fff2b0'))]);
  // the edges of the wood fall into shadow
  cv.wash(pack([0.03, 0.06, 0.04]), (x) => Math.max(0, 1 - Math.min(x, W - x) / 70) * 0.3);
  cv.meta.horizon = 118;
}
