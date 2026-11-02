// The Shifting Reef (exotic, transformation): a seabed under deep, glowing
// water — shafts of light falling from far above, a far forest of coral
// fans in the blue, and in front the reef in cross-section: pale sand over
// coral-pink rock, branching corals in vivid colours, kelp swaying up,
// giant clams, starfish and glowing polyps. Its anemones (wild-scene.js)
// close at a touch and open again in another colour.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, fillSolid, ledges, paintTerrain, markOpen, glow } from './side.js';
import { fog, moss, glowShrooms } from './cave.js';
import { boulder } from './objects.js';
import { coral, kelp, clam, farShapes, openSpots } from './exotic.js';
import { hash2 } from '../noise.js';
import { pack } from '../color.js';

const CORALS = [
  ['#7a1e3a', '#e04a7a', '#ff9ac0', '#fff0f4'], ['#8a3a10', '#f08a2a', '#ffc070', '#fff4d0'], ['#3a1e7a', '#8a5ae0', '#c8a8ff', '#f4eaff'],
  ['#7a6a10', '#e8c83a', '#fff08a', '#ffffff'], ['#0e5a5a', '#2ac8b0', '#8af0e0', '#eafffa'], ['#7a1414', '#e03a3a', '#ff8a7a', '#ffe0d8'],
];

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'reef', p);
  const pal = vary(palette({ rock: ['#b08080', { spread: 0.4 }], leaf: '#2a8a6a', bark: '#4a3a2a' }), s('pal'), 0.8);
  // deep or shallow water: deeper is bluer and darker
  const deep = s('depth').next() < 0.4;
  sky(cv, 0, H, deep ? ['#061a30', '#0a2a48', '#124062', '#1a5a7a'] : ['#0a3a52', '#145a70', '#2a8a96', '#4ab0aa'], 10);
  // shafts of light falling from the surface far above
  const sh = s('shafts');
  for (let i = 0; i < 4; i++) {
    const x0 = sh.int(0, W), w = sh.int(10, 26), lean = sh.range(0.25, 0.5);
    cv.light([0.6, 1, 0.95], (x, y) => { const u = Math.abs(x - x0 - y * lean) / w; return u < 1 ? (1 - u) * 0.16 * Math.max(0, 1 - y / 200) : 0; }, 0, 200);
  }
  // the far coral forest, two rows in the blue
  farShapes(cv, { n: 7, base: 156, h: [30, 60], fill: deep ? '#0e3450' : '#16506a', rim: deep ? '#164662' : '#1e6880', seed: s('far1').int(0, 1e9), kind: 'coral' });
  fog(cv, deep ? '#1a4a6a' : '#3a8a96', 110, 170, 0.3, s('fog').int(0, 1e9));
  farShapes(cv, { n: 9, base: 166, h: [20, 40], fill: deep ? '#164a62' : '#1e6878', rim: deep ? '#1e5e78' : '#2a8090', seed: s('far2').int(0, 1e9), kind: 'coral' });
  // the seabed: sand dunes, a rock arch or two
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: ts.int(160, 172), amp: ts.int(6, 12), freq: 0.01 + ts.next() * 0.008 });
  if (ts.next() < 0.5) dip(top, ts.int(60, W - 60), ts.int(24, 40), ts.int(6, 12));
  fillSolid(cv, top);
  ledges(cv, top, ts, ts.int(5, 8), { rise: [28, 44] });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#a07070', b: '#b48080', grain: '#e0b0a0', dark: '#3a1a22', deep: '#1a0c14', cave: '#12080e',
    crust: ['#fff0c0', '#f0dca0', '#d8c088', '#b8a070'], crustH: 4, seed: ss,
    cobble: { stones: ['#b47e7a', '#9e6a6a', '#c48e86', '#8a5e60', '#ac7672', '#946666'], mortar: '#1a0c12', s: 10 },
    grass: { cols: ['#2a9a7a', '#4ac898', '#1e7a5e'], tall: 5, rate: 0.35, flowers: ['#ff9ac0', '#fff08a', '#8af0e0'] },
    layers: [
      { kind: 'sand', cols: ['#fff0c4', '#f0dca8', '#d4bc88', '#9a8460'], h: [8, 14] },
      { kind: 'band', cols: ['#c48a80', '#d49a90', '#e8b8a8', '#4a2a2a'], h: [3, 5] },
    ],
  });
  moss(cv, { cols: ['#4ac898', '#2a9a7a', '#1e7a5e', '#14584a'], seed: ss + 1, drape: 8, rate: 0.22, len: 12 });
  markOpen(cv);
  // corals, kelp, clams and starfish, each set down where it fits
  const cs = s('corals'), spots = openSpots(cv, 60);
  const used = [];
  const free = (x, y, r) => !used.some(([a, b, q]) => Math.abs(a - x) < r + q && Math.abs(b - y) < 26) && cv.clear(x - r, y - 30, x + r, y - 1);
  for (let i = 0; i < 60 && used.length < cs.int(5, 8); i++) {
    const [x, y] = spots[cs.int(0, spots.length - 1)] || [0, 0];
    const h = cs.int(14, 30);
    if (!free(x, y, 10)) continue;
    coral(cv, x, y, h, CORALS[cs.int(0, CORALS.length - 1)], cs.int(0, 1e9));
    used.push([x, y, 10]);
  }
  const kr = s('kelp');
  for (let i = 0; i < 40 && used.length < 16; i++) {
    const [x, y] = spots[kr.int(0, spots.length - 1)] || [0, 0];
    if (!free(x, y, 5)) continue;
    kelp(cv, x, y, kr.int(26, 54), kr.next() < 0.5 ? ['#0e4a2a', '#2a8a4a', '#5ac06a'] : ['#3a3a10', '#7a7a2a', '#b0b04a'], kr.int(0, 100));
    used.push([x, y, 5]);
  }
  const cl = s('clams');
  for (let i = 0; i < 20 && used.length < 19; i++) {
    const [x, y] = spots[cl.int(0, spots.length - 1)] || [0, 0];
    if (!free(x, y, 7)) continue;
    clam(cv, x, y, cl.int(5, 7), cl.next() < 0.5 ? ['#4a2a5a', '#a87ac8', '#e0c8f4', '#fff8ff'] : ['#5a3a2a', '#c89a7a', '#f4dcc4', '#ffffff']);
    used.push([x, y, 7]);
  }
  const sf = s('stars');
  for (let i = 0; i < 6; i++) {
    const [x, y] = spots[sf.int(0, spots.length - 1)] || [0, 0];
    if (!cv.clear(x - 2, y - 3, x + 2, y - 1)) continue;
    const c = [0xff3a5aff, 0xff2a9aff, 0xff7a3ae0][i % 3];
    for (const [dx, dy] of [[0, -1], [-2, -1], [2, -1], [-1, -2], [1, -2], [0, -3], [-1, 0], [1, 0]]) cv.setThing(x + dx, y + dy, c);
  }
  const br = s('rocks');
  for (let i = 0; i < 2; i++) cv.place(boulder(br, br.int(4, 7), br.int(3, 4)), pal, br.int(10, W - 10), { foot: [5, 1], range: 30 });
  const glows = glowShrooms(cv, { n: 6, cap: '#6af0e0', lit: '#e0fffa', stem: '#3a8a8a', rgb: [0.4, 1, 0.9], seed: s('polyps').int(0, 1e9) });
  // the anemones that answer the finger: where they grow
  const an = s('anemones'), anem = [];
  for (let i = 0; i < 60 && anem.length < an.int(4, 7); i++) {
    const [x, y] = spots[an.int(0, spots.length - 1)] || [0, 0];
    if (!x || anem.some((q) => Math.abs(q[0] - x) < 18) || !cv.clear(x - 5, y - 12, x + 5, y - 1)) continue;
    anem.push([x, y, an.int(0, 1e9)]);
    cv.claim(x - 5, y - 12, x + 5, y - 1);
    cv.block(x - 6, y - 13, x + 6, y + 1);
  }
  cv.meta.anemones = anem;
  cv.meta.glows = glows;
  cv.meta.water = true;
  cv.meta.vignette = deep ? 0.5 : 0.35;
  cv.meta.wind = 0.4;
  cv.meta.horizon = 150;
  void hash2; void pack; void glow;
}
