// Whisperwood: a wood of many trees in the open air, under a pale green
// sky and a canopy closing over the top. Rows of trees fade into the mist
// behind; in front the forest floor in cross-section — dark cobbled stone
// threaded with roots under a crust of moss, mossy pillars dripping moss,
// trees standing among them, a fallen log and a stump, ferns, and
// mushrooms glowing ember-orange in the shade. (Its underground twin is
// the Netherwood, netherwood.js.)

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, raise, fillSolid, blob, paintTerrain, markOpen, surfaceAt, col, drips, ledges, hanging } from './side.js';
import { fog, moss, glowShrooms } from './cave.js';
import { fern, log, stump } from './objects.js';
import { treeRow, terrainTrees } from './trees.js';
import { hash2 } from '../noise.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'forest', p);
  // some worlds' woods are in their autumn
  const autumn = s('season').next() < 0.3;
  const pal = vary(palette({
    leaf: [autumn ? '#8a5a20' : '#2e6a2a', { spread: 0.6 }], leaf2: [autumn ? '#9a4a1e' : '#1e5a3a', { spread: 0.55 }], bark: ['#4a3422', { spread: 0.5 }], wood: '#a87a48', rock: '#5e625c',
    moss: ['#4e7a30', { spread: 0.5 }], fern: [autumn ? '#8a6a26' : '#4e8a34', { spread: 0.55 }],
  }), s('pal'), 1);
  const back = '#9ab8a0';
  sky(cv, 0, H, ['#c8dcc0', '#b0ccb0', '#90b49c', '#78a088']);
  // the ground line the trees stand on
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 172, amp: 8, freq: 0.012 });
  // the background wood: rows of alike trees, the far row smaller and paler
  const rows = s('rows'), far = top.map((v) => v - 14), mid = top.map((v) => v - 6);
  const look = { mats: ['leaf', 'leaf2'], hang: { mat: 'moss', rate: 0.6, len: /** @type {[number, number]} */ ([4, 16]) } };
  treeRow(cv, rows, pal, { line: far, gap: [20, 26], h: [50, 58], haze: back, fade: 0.68, shape: 'tall', look });
  fog(cv, '#b8d0b8', 60, 190, 0.3, rows.int(0, 1e9));
  treeRow(cv, rows, pal, { line: mid, gap: [26, 34], h: [64, 74], haze: back, fade: 0.45, shape: 'tall', look });
  fog(cv, '#b8d0b8', 80, 200, 0.2, rows.int(0, 1e9));
  // the canopy closing over the top
  hanging(cv, { base: 14, amp: 10, freq: 0.03, seed: s('canopy').int(0, 1e9), fill: autumn ? '#5a3e1a' : '#1e3e22', rim: autumn ? '#7a5422' : '#2a5230', rough: 4 });
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
  roots(cv, s('roots'), '#4a3020', '#6a4630');
  markOpen(cv);
  // the wood's own trees, growing on the ground and the ledges where they fit
  litter(cv, s, pal);
  terrainTrees(cv, s('oaks'), pal, { n: 8, kinds: ['oak', 'gnarl', 'gnarl', 'tiers'], shapes: ['tall', 'spread', 'lean'], h: [44, 116], gap: 22, ledges: true, look });
  ferns(cv, s, pal);
  // soft shafts of light through the leaves, and mushrooms glowing in the shade
  const shafts = s('shafts'), sx0 = shafts.int(110, 230);
  cv.light([1, 0.95, 0.7], (x, y) => {
    const u = x - sx0 - y * 0.35, c = 14 + (y / H) * 10;
    let t = 0;
    for (let k = 0; k < 3; k++) { const d = Math.abs(u - k * 34) / c; if (d < 1) t = Math.max(t, (1 - d * d) * (1 - k * 0.25)); }
    return t * 0.16 * (1 - y / H);
  }, 0, H);
  cv.meta.shaft = sx0;
  cv.meta.glows = glowShrooms(cv, { n: 5, cap: '#e8642a', lit: '#ffc070', stem: '#e0d0b0', rgb: [1, 0.5, 0.18], seed: s('shrooms').int(0, 1e9) });
  cv.meta.trickles = drips(cv, ss, 4);
  cv.meta.vignette = 0.35;
  cv.meta.wind = 0.9;
  cv.meta.horizon = 120;
}

/** Roots threading the ground (and the cave hollows) under the surface. */
export function roots(cv, rt, dark, lit) {
  const W = cv.W, H = cv.H, root = col(dark), rootLit = col(lit);
  for (let i = 0; i < 14; i++) {
    let x = rt.int(0, W - 1), y = surfaceAt(cv, x) + rt.int(3, 8);
    const dx = rt.next() < 0.5 ? -1 : 1;
    for (let k = 0; k < rt.int(12, 30); k++) {
      if (x < 0 || x >= W || y >= H) break;
      if (cv.solid[y * W + x] || cv.cave[y * W + x]) { cv.set(x, y, k % 5 ? root : rootLit); if (y + 1 < H) cv.set(x, y + 1, root); }
      x += dx; if (hash2(x, y, i) < 0.45) y++;
    }
  }
}

/**
 * The litter of a wood's floor, each piece set down where it fits (before
 * the trees, which then grow round it): a fallen log and a stump.
 * @param {any} cv @param {(p:string) => any} s @param {Record<string, number[]>} pal
 */
export function litter(cv, s, pal) {
  const lr = s('logs');
  cv.place(log(lr, lr.int(30, 44), lr.int(4, 6), { moss: 'moss' }), pal, lr.int(90, 290), { sink: 2, foot: [20, 3], range: 200 });
  cv.place(stump(lr, lr.int(9, 12), lr.int(6, 9)), pal, lr.int(60, 320), { foot: [7, 2], range: 120 });
}

/**
 * Ferns in the gaps the trees and the litter leave.
 * @param {any} cv @param {(p:string) => any} s @param {Record<string, number[]>} pal
 */
export function ferns(cv, s, pal) {
  const W = cv.W, fr = s('ferns');
  for (let i = 0, n = 0; i < 14 && n < 6; i++) if (cv.place(fern(fr, fr.int(8, 13), { leaf: 'fern' }), pal, fr.int(10, W - 10), { roots: [5, 1], range: 24 })) n++;
}
