// Whisperwood, a forest grown into a cave: a dark green gloom of far
// pillars and mist, a roof of mossy rock hung with stalactites and ivy,
// and in front the forest floor in cross-section — dark cobbled stone
// threaded with roots under a crust of moss, mossy pillars dripping moss,
// a great gnarled oak reaching up into the roof, a fallen log and a stump,
// ferns, and mushrooms glowing ember-orange in the dark.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, raise, fillSolid, blob, paintTerrain, markOpen, surfaceAt, col, drips, ledges } from './side.js';
import { caveFrame, farPillars, fog, vines, moss, glowShrooms } from './cave.js';
import { tree, fern, log, stump } from './objects.js';
import { hash2 } from '../noise.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'forest', p);
  // some worlds' woods are in their autumn
  const autumn = s('season').next() < 0.3;
  const pal = vary(palette({
    leaf: [autumn ? '#7a5220' : '#2e5426', { spread: 0.6 }], bark: ['#4a3422', { spread: 0.55 }], wood: '#a87a48', rock: '#5e625c',
    moss: ['#4e7a30', { spread: 0.5 }], fern: [autumn ? '#8a6a26' : '#4e8a34', { spread: 0.55 }],
  }), s('pal'), 1);
  sky(cv, 0, H, ['#050806', '#08100a', '#0c160e', '#101c12'], 10);
  farPillars(cv, { n: 8, fill: '#0f1a10', rim: '#152416', seed: s('far1').int(0, 1e9), w: [10, 22], floor: 180, caps: true });
  fog(cv, '#24402a', 80, 200, 0.3, s('fog1').int(0, 1e9));
  farPillars(cv, { n: 5, fill: '#14221a', rim: '#1e3222', seed: s('far2').int(0, 1e9), w: [18, 30], floor: 185 });
  fog(cv, '#2a4a2e', 110, 210, 0.2, s('fog2').int(0, 1e9));
  const fs = s('frame');
  const frame = caveFrame(cv, {
    seed: fs.int(0, 1e9), stones: ['#3a3428', '#2e2a22', '#3e4430'], mortar: '#0c0a08', dark: 0.4, roof: [12, 36], walls: [10, 12],
    stal: { n: 14, len: [8, 30], w: [3, 7] }, lip: [autumn ? '#9a6a22' : '#4e8a2e', '#2e5a22'],
  });
  vines(cv, frame.roof, { cols: autumn ? ['#9a6a22', '#6a4a1a', '#3e2e14'] : ['#4a8a2a', '#30601e', '#1e3e16'], leaf: autumn ? '#c88a2a' : '#5e9a32', flower: '#e86a9a', seed: fs.int(0, 1e9), rate: 0.25, len: [4, 44] });
  // the forest floor: a low rise, mossy pillars and a hollow under the roots
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 172, amp: 8, freq: 0.012 });
  const kx = ts.int(60, W - 140);
  raise(top, kx, kx + ts.int(30, 60), Math.min(...top) - ts.int(8, 14), 3);
  fillSolid(cv, top);
  ledges(cv, top, ts, 6);
  const hx = ts.int(60, W - 60);
  blob(cv, hx, top[hx] + 20, ts.int(14, 22), 8, ts.int(0, 1e9), 0);
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#3e2a1c', b: '#4c3422', grain: '#6e5034', dark: '#1a120c', deep: '#0a0806', cave: '#070605',
    crust: [autumn ? '#c88a2a' : '#6aa83a', autumn ? '#9a6a22' : '#4a8a2c', '#2e5a22', '#22401a'], crustH: 4, seed: ss,
    cobble: { stones: ['#5e584a', '#4e4a3e', '#6a6250', '#44483a', '#56604a', '#3e3a30'], mortar: '#16120c', s: 4 },
    grass: { cols: autumn ? ['#b07a24', '#8a5a1e'] : ['#4e9a34', '#6ab83e', '#3a7a2a'], tall: 3, rate: 0.5, flowers: ['#f08ab0', '#e85a8a', '#f0e0a0'] },
  });
  moss(cv, { cols: autumn ? ['#c88a2a', '#9a6a22', '#6a4a1a', '#3e2e14'] : ['#6aa83a', '#4a8a2c', '#30601e', '#1e3e16'], seed: ss + 1, drape: 10, rate: 0.25, len: 14 });
  // roots threading the ground under the surface
  const rt = s('roots'), root = col('#4a3020'), rootLit = col('#6a4630');
  for (let i = 0; i < 14; i++) {
    let x = rt.int(0, W - 1), y = surfaceAt(cv, x) + rt.int(3, 8);
    const dx = rt.next() < 0.5 ? -1 : 1;
    for (let k = 0; k < rt.int(12, 30); k++) {
      if (x < 0 || x >= W || y >= H) break;
      if (cv.solid[y * W + x] || cv.cave[y * W + x]) { cv.set(x, y, k % 5 ? root : rootLit); if (y + 1 < H) cv.set(x, y + 1, root); }
      x += dx; if (hash2(x, y, i) < 0.45) y++;
    }
  }
  markOpen(cv);
  // the great gnarled oak reaching into the roof, and a lesser one
  const or = s('oaks'), left = or.next() < 0.6;
  const lx = left ? or.int(14, 40) : or.int(344, 370);
  cv.stamp(tree(or, 'oak', or.int(170, 190), or.int(16, 22), { lean: left ? 0.06 : -0.06 }), pal, lx, surfaceAt(cv, lx) + 3, { roots: [22, 4] });
  const rx = left ? or.int(330, 372) : or.int(12, 50);
  cv.stamp(tree(or, 'oak', or.int(100, 130), or.int(9, 12), { lean: left ? -0.04 : 0.04 }), pal, rx, surfaceAt(cv, rx) + 2, { roots: [12, 3], dark: 0.25 });
  // a fallen log, a stump, ferns
  const lr = s('logs'), gx = lr.int(90, 290);
  cv.stamp(log(lr, lr.int(40, 60), lr.int(5, 7), { moss: 'moss' }), pal, gx, surfaceAt(cv, gx) + 2, { foot: [26, 3] });
  const sx = lr.int(60, 320);
  cv.stamp(stump(lr, lr.int(10, 14), lr.int(7, 10)), pal, sx, surfaceAt(cv, sx) + 1, { foot: [8, 2] });
  const fr = s('ferns');
  for (let i = 0; i < 6; i++) { const x = fr.int(10, W - 10); cv.stamp(fern(fr, fr.int(8, 13), { leaf: 'fern' }), pal, x, surfaceAt(cv, x) + 1); }
  // a pale shaft from a crack in the roof, and mushrooms glowing in the dark
  const shafts = s('shafts'), sx0 = shafts.int(110, 230);
  cv.light([0.7, 0.9, 0.6], (x, y) => {
    const u = x - sx0 - y * 0.3, v = ((u % 30) + 30) % 30, k = Math.floor(u / 30);
    return k >= 0 && k < 2 && v < 8 - k * 3 ? 0.1 * (1 - y / H) : 0;
  }, 0, H);
  cv.meta.shaft = sx0;
  cv.meta.glows = glowShrooms(cv, { n: 9, cap: '#e8642a', lit: '#ffc070', stem: '#e0d0b0', rgb: [1, 0.5, 0.18], seed: s('shrooms').int(0, 1e9) });
  cv.meta.trickles = drips(cv, ss, 4);
  cv.meta.vignette = 0.6;
  cv.meta.horizon = 120;
}
