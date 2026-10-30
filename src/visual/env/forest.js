// Whisperwood: a wood of many trees, in some worlds open under a pale
// green sky and a canopy, in others grown into a cave under a roof of
// mossy rock hung with stalactites and ivy. Rows of trees fade into the
// mist behind; in front the forest floor in cross-section — dark cobbled
// stone threaded with roots under a crust of moss, mossy pillars dripping
// moss, trees standing among them, a fallen log and a stump, ferns, and
// mushrooms glowing ember-orange in the shade.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, raise, fillSolid, blob, paintTerrain, markOpen, surfaceAt, col, drips, ledges, hanging } from './side.js';
import { caveFrame, farPillars, fog, vines, moss, glowShrooms } from './cave.js';
import { tree, fern, log, stump } from './objects.js';
import { hash2 } from '../noise.js';
import { hex, pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'forest', p);
  // some worlds' woods are in their autumn; some grow in a cave
  const autumn = s('season').next() < 0.3, cave = s('kind').next() < 0.35;
  const pal = vary(palette({
    leaf: [autumn ? '#8a5a20' : '#2e6a2a', { spread: 0.6 }], bark: ['#4a3422', { spread: 0.5 }], wood: '#a87a48', rock: '#5e625c',
    moss: ['#4e7a30', { spread: 0.5 }], fern: [autumn ? '#8a6a26' : '#4e8a34', { spread: 0.55 }],
  }), s('pal'), 1);
  const back = cave ? '#0e1a12' : '#9ab8a0';
  if (cave) {
    sky(cv, 0, H, ['#050806', '#08100a', '#0c160e', '#101c12']);
    farPillars(cv, { n: 8, fill: '#0f1a10', rim: '#152416', seed: s('far1').int(0, 1e9), w: [10, 22], floor: 180, caps: true });
    fog(cv, '#24402a', 80, 200, 0.3, s('fog1').int(0, 1e9));
  } else {
    sky(cv, 0, H, ['#c8dcc0', '#b0ccb0', '#90b49c', '#78a088']);
  }
  // the ground line the trees stand on
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 172, amp: 8, freq: 0.012 });
  // rows of trees fading into the mist, the far rows smallest and palest
  const rows = s('rows');
  for (const [k, h, haze] of /** @type {[number, number[], number][]} */ ([[0, [40, 56], 0.7], [1, [50, 70], 0.45]])) {
    for (let x = rows.int(-6, 6); x < W + 10; x += rows.int(16, 26)) {
      const m = tree(rows, rows.next() < 0.2 ? 'pine' : 'oak', rows.int(h[0], h[1]), rows.int(3, 5));
      cv.stamp(m, pal, x, Math.round(top[Math.max(0, Math.min(W - 1, x))]) - 14 + k * 8, { haze: [pack(hex(back)), haze], outline: false });
    }
    fog(cv, cave ? '#24402a' : '#b8d0b8', 60, 190, cave ? 0.2 : 0.3, rows.int(0, 1e9));
  }
  if (cave) {
    const fs = s('frame');
    const frame = caveFrame(cv, {
      seed: fs.int(0, 1e9), stones: ['#3a3428', '#2e2a22', '#3e4430'], mortar: '#0c0a08', dark: 0.4, roof: [12, 36], walls: [10, 12],
      stal: { n: 14, len: [8, 30], w: [3, 7] }, lip: [autumn ? '#9a6a22' : '#4e8a2e', '#2e5a22'],
    });
    vines(cv, frame.roof, { cols: autumn ? ['#9a6a22', '#6a4a1a', '#3e2e14'] : ['#4a8a2a', '#30601e', '#1e3e16'], leaf: autumn ? '#c88a2a' : '#5e9a32', flower: '#e86a9a', seed: fs.int(0, 1e9), rate: 0.25, len: [4, 44] });
  } else {
    // the canopy closing over the top
    hanging(cv, { base: 14, amp: 10, freq: 0.03, seed: s('canopy').int(0, 1e9), fill: autumn ? '#5a3e1a' : '#1e3e22', rim: autumn ? '#7a5422' : '#2a5230', rough: 4 });
  }
  // the forest floor: a low rise, mossy pillars and a hollow under the roots
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
  // the wood itself: many modest trees across the floor, a larger one at an edge
  const or = s('oaks'), n = or.int(5, 7);
  for (let i = 0; i < n; i++) {
    const x = Math.round(((i + 0.5) / n) * W + or.int(-14, 14)), kind = or.next() < 0.25 ? 'pine' : or.next() < 0.2 ? 'birch' : 'oak';
    cv.stamp(tree(or, kind, or.int(60, 88), or.int(4, 6)), pal, x, surfaceAt(cv, x) + 2, { roots: [7, 2] });
  }
  const left = or.next() < 0.5, ex = left ? or.int(10, 30) : or.int(354, 374);
  cv.stamp(tree(or, 'oak', or.int(104, 120), or.int(8, 10), { lean: left ? 0.05 : -0.05 }), pal, ex, surfaceAt(cv, ex) + 2, { roots: [11, 3] });
  // a fallen log, a stump, ferns
  const lr = s('logs'), gx = lr.int(90, 290);
  cv.stamp(log(lr, lr.int(34, 48), lr.int(4, 6), { moss: 'moss' }), pal, gx, surfaceAt(cv, gx) + 2, { foot: [22, 3] });
  const sx = lr.int(60, 320);
  cv.stamp(stump(lr, lr.int(9, 12), lr.int(6, 9)), pal, sx, surfaceAt(cv, sx) + 1, { foot: [7, 2] });
  const fr = s('ferns');
  for (let i = 0; i < 6; i++) { const x = fr.int(10, W - 10); cv.stamp(fern(fr, fr.int(8, 13), { leaf: 'fern' }), pal, x, surfaceAt(cv, x) + 1); }
  // soft shafts of light through the leaves, and mushrooms glowing in the shade
  const shafts = s('shafts'), sx0 = shafts.int(110, 230);
  cv.light(cave ? [0.7, 0.9, 0.6] : [1, 0.95, 0.7], (x, y) => {
    const u = x - sx0 - y * 0.35, c = 14 + (y / H) * 10;
    let t = 0;
    for (let k = 0; k < 3; k++) { const d = Math.abs(u - k * 34) / c; if (d < 1) t = Math.max(t, (1 - d * d) * (1 - k * 0.25)); }
    return t * (cave ? 0.09 : 0.16) * (1 - y / H);
  }, 0, H);
  cv.meta.shaft = sx0;
  cv.meta.glows = glowShrooms(cv, { n: cave ? 9 : 5, cap: '#e8642a', lit: '#ffc070', stem: '#e0d0b0', rgb: [1, 0.5, 0.18], seed: s('shrooms').int(0, 1e9) });
  cv.meta.trickles = drips(cv, ss, 4);
  cv.meta.vignette = cave ? 0.6 : 0.35;
  cv.meta.horizon = 120;
}
