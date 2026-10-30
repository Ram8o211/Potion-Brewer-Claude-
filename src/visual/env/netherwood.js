// Netherwood: the wood gone underground, a forest grown in a cavern deep
// under the Whisperwood. A dark back wall with far pillars and ghostly
// rows of trees fading into the blue gloom; a roof of rock and
// stalactites, the roots of the wood above hanging through it; in front
// the cavern floor in cross-section — dark cobbles threaded with roots
// under a crust of pale moss, mossy pillars dripping moss, dark trees,
// giant mushrooms, in some worlds a still black pool, a fallen log and
// ferns, and fungi glowing violet in the dark.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, raise, fillSolid, blob, paintTerrain, pool, markOpen, drips, ledges, glow } from './side.js';
import { caveFrame, farPillars, fog, vines, moss, glowShrooms, veins, WATER_VEINS } from './cave.js';
import { mushroom } from './objects.js';
import { treeRow, terrainTrees } from './trees.js';
import { roots, litter, ferns } from './forest.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'netherwood', p);
  const pal = vary(palette({
    leaf: ['#1e4a46', { spread: 0.55 }], leaf2: ['#24405a', { spread: 0.5 }], bloom: ['#b080f0', { spread: 0.4 }], bark: ['#2e2630', { spread: 0.45 }], wood: '#7a6a5a', rock: '#4a4a56',
    moss: ['#2e6a5a', { spread: 0.5 }], fern: ['#2a6a5e', { spread: 0.5 }],
    stem: ['#c8c0d0', { spread: 0.4 }], cap: ['#6a3aa0', { spread: 0.6 }],
  }), s('pal'), 1);
  const back = '#0e1820';
  sky(cv, 0, H, ['#030408', '#060a10', '#0a1018', '#0e1620']);
  farPillars(cv, { n: 8, fill: '#0c141c', rim: '#121c26', seed: s('far1').int(0, 1e9), w: [10, 22], floor: 180, caps: true });
  fog(cv, '#1c2c40', 80, 200, 0.3, s('fog1').int(0, 1e9));
  // the ground line, and the ghostly wood behind
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 172, amp: 8, freq: 0.012 });
  const rows = s('rows'), far = top.map((v) => v - 14), mid = top.map((v) => v - 6);
  const look = { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.04 }, hang: { mat: 'moss', rate: 0.5, len: /** @type {[number, number]} */ ([4, 14]) } };
  treeRow(cv, rows, pal, { line: far, gap: [22, 30], h: [48, 58], haze: back, fade: 0.72, shape: 'tall', look });
  fog(cv, '#1c2c40', 60, 190, 0.22, rows.int(0, 1e9));
  treeRow(cv, rows, pal, { line: mid, gap: [28, 38], h: [60, 72], haze: back, fade: 0.55, shape: 'lean', look });
  fog(cv, '#24344a', 80, 200, 0.15, rows.int(0, 1e9));
  // the roof, the roots of the wood above hanging through it
  const fs = s('frame');
  const frame = caveFrame(cv, {
    seed: fs.int(0, 1e9), stones: ['#2e2a30', '#26222a', '#34343a'], mortar: '#08080a', dark: 0.42, roof: [12, 34], walls: [10, 12],
    stal: { n: 12, len: [8, 28], w: [3, 6] }, lip: ['#3e7a6a', '#24504a'],
  });
  vines(cv, frame.roof, { cols: ['#5a4232', '#46321f', '#2e2016'], leaf: '#6a4e3a', flower: '#c8a0ff', seed: fs.int(0, 1e9), rate: 0.22, len: [6, 48] });
  // the floor: a low rise, pillars, a hollow, and in some worlds a still pool
  const kx = ts.int(60, W - 140);
  raise(top, kx, kx + ts.int(30, 60), Math.min(...top) - ts.int(8, 14), 3);
  let still = null;
  if (ts.next() < 0.5) {
    const px = kx < W / 2 ? ts.int(230, 320) : ts.int(60, 140), hw = ts.int(22, 32);
    still = { x: px, hw, level: Math.round(top[px]) + 2 };
    dip(top, px, hw, 14);
  }
  fillSolid(cv, top);
  ledges(cv, top, ts, 6, { keep: still ? [[still.x - still.hw - 6, still.x + still.hw + 6]] : [] });
  const hx = ts.int(60, W - 60);
  if (!still || Math.abs(hx - still.x) > still.hw + 30) blob(cv, hx, top[hx] + 20, ts.int(14, 22), 8, ts.int(0, 1e9), 0);
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#2a2228', b: '#342a30', grain: '#54465a', dark: '#100c10', deep: '#060408', cave: '#040305',
    crust: ['#5aa08a', '#3e7a6a', '#2a5a4e', '#1e4038'], crustH: 4, seed: ss,
    cobble: { stones: ['#4a4652', '#3e3a46', '#54505c', '#36343e', '#464e52', '#3a3640'], mortar: '#0e0c12', s: 4 },
    grass: { cols: ['#3e7a6a', '#5aa08a', '#2a5a4e'], tall: 3, rate: 0.45, flowers: ['#c8a0ff', '#8ff0ff', '#f0c8ff'] },
  });
  moss(cv, { cols: ['#5aa08a', '#3e7a6a', '#2a5a4e', '#1e4038'], seed: ss + 1, drape: 10, rate: 0.25, len: 14 });
  roots(cv, s('roots'), '#3a2a24', '#5a4232');
  if (still) {
    cv.meta.pool = pool(cv, still.x - still.hw, still.x + still.hw, still.level, { surface: '#a8a0e0', body: ['#1e1e3a', '#16162e', '#101024', '#0a0a1a'], see: 0.15, bed: ['#1a1620', '#241e2a', '#120e16'] });
    veins(cv, cv.meta.pool, { ...WATER_VEINS(ss + 4, ['#6a5ab0', '#2e2a5a', '#1e1e3a', '#16162e']), to: '#100c1e', n: 4, reach: 44, rgb: [0.5, 0.4, 0.95] });
  }
  markOpen(cv);
  // a log and a stump, dark trees where they fit, then giant mushrooms between them, glowing under their caps
  litter(cv, s, pal);
  terrainTrees(cv, s('trees'), pal, { n: 5, kinds: ['oak', 'gnarl', 'willow'], shapes: ['tall', 'lean'], h: [44, 100], gap: 30, ledges: true, dark: 0.15, look });
  const mr = s('mushrooms'), glows = [];
  for (let i = 0; i < 3; i++) {
    const h = mr.int(18, 34), r = Math.round(h * mr.range(0.4, 0.55));
    const at = cv.place(mushroom(mr, h, r), pal, mr.int(30, W - 30), { sink: 2, roots: [r * 0.4, 2], range: 60 });
    if (!at) continue;
    glow(cv, at.fx, at.fy - h + r * 0.2, r * 2.4, [0.6, 0.35, 1], 0.35);
    glows.push([at.fx, Math.round(at.fy - h + r * 0.3)]);
  }
  ferns(cv, s, pal);
  glows.push(...glowShrooms(cv, { n: 9, cap: '#9a5ae8', lit: '#f0c8ff', stem: '#c8c0d0', rgb: [0.62, 0.38, 1], seed: s('shrooms').int(0, 1e9) }));
  cv.meta.glows = glows;
  cv.meta.trickles = drips(cv, ss, 4);
  cv.meta.vignette = 0.6;
  // only the cavern's draughts stir its leaves
  cv.meta.wind = 0.3;
  cv.meta.horizon = 120;
}
