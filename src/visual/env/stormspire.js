// Stormspire (exotic, storm): black crags under an endless thunderstorm —
// a bruised sky of heavy cloud, far spires of rock, rain sheeting across
// (wild-scene.js), and in front wet slate in cross-section: dark shale
// over slate cobbles, twisted dead trees, basalt columns and the lightning
// rods of blue crystal that crown the crags. A finger near a rod draws
// the lightning out of it (wild-scene.js); now and then two rods arc
// between themselves.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, fillSolid, ledges, paintTerrain, markOpen, glow, silhouette, mountains } from './side.js';
import { fog, moss, glowShrooms } from './cave.js';
import { cloud, basalt, boulder } from './objects.js';
import { terrainTrees } from './trees.js';
import { rod, farShapes, openSpots } from './exotic.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'stormspire', p);
  const pal = vary(palette({
    leaf: ['#2a4a4a', { spread: 0.4 }], leaf2: ['#3a5a5a', { spread: 0.4 }], bark: '#2a2628', rock: ['#3a4050', { spread: 0.4 }], cloud: ['#3a4256', { spread: 0.3 }], gem: ['#6ab0ff', { spread: 0.4 }],
  }), s('pal'), 0.8);
  // a violet storm or a green-grey one
  const hue = s('hue').weighted(['blue', 'violet', 'green'], [2, 1, 1]);
  const skies = { blue: ['#0a0c16', '#141a2a', '#222c42', '#36425a'], violet: ['#100a1a', '#1e142e', '#30244a', '#4a3a62'], green: ['#0a100e', '#141e1c', '#22302e', '#364644'] }[hue];
  sky(cv, 0, H, skies, 10);
  // heavy banks of cloud rolling over the top
  const cr = s('clouds');
  for (let i = 0; i < 9; i++) cv.stamp(cloud(cr, cr.int(40, 90), cr.int(10, 18)), pal, cr.int(0, W), cr.int(4, 40), { outline: false, texture: 0 });
  // far spires of rock, and a range behind them lit by the flashes
  mountains(cv, { base: 132, amp: 70, n: 9, seed: s('range').int(0, 1e9), fill: '#1e2432', lit: '#2c3446', dark: '#161a26', snow: '#3a4458', snowAt: 0.9 });
  farShapes(cv, { n: 6, base: 150, h: [40, 80], fill: '#141822', rim: '#222a3a', seed: s('spires').int(0, 1e9), kind: 'spire' });
  fog(cv, '#2a3446', 100, 170, 0.32, s('fog').int(0, 1e9));
  silhouette(cv, { base: 156, amp: 8, freq: 0.03, seed: s('crags').int(0, 1e9), fill: '#161a24', rim: '#262e3e', rough: 4 });
  // the crags: rugged ground, many ledges
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: ts.int(158, 168), amp: ts.int(10, 18), freq: 0.012 + ts.next() * 0.01 });
  fillSolid(cv, top);
  ledges(cv, top, ts, ts.int(7, 10), { high: ts.int(0, 1), rise: [30, 46] });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#2e3442', b: '#363c4c', grain: '#5a6478', dark: '#0a0c12', deep: '#06070a', cave: '#040506',
    crust: ['#6a7a90', '#4e5a6e', '#3a4456', '#2a3240'], crustH: 3, seed: ss,
    cobble: { stones: ['#323a4a', '#3a4254', '#444e62', '#2a303e', '#4a546a', '#343c4e'], mortar: '#05060a', s: 10, moss: ['#2a4a4a', '#4a7a7a'] },
    grass: { cols: ['#3a5a5a', '#4a7070', '#2a4444'], tall: 3, rate: 0.3 },
    layers: [
      { kind: 'banded', cols: ['#3e4658', '#323a4a', '#4a5468', '#2a3040', '#141820'], h: [8, 14] },
    ],
  });
  moss(cv, { cols: ['#4a7070', '#3a5a5a', '#2a4444', '#1e3232'], seed: ss + 1, drape: 6, rate: 0.15, len: 10 });
  markOpen(cv);
  // twisted dead trees, basalt columns, boulders
  terrainTrees(cv, s('trees'), pal, { n: s('trees').int(1, 3), kinds: ['dead', 'gnarl', 'dead'], shapes: ['lean'], h: [36, 70], gap: 60, ledges: true, look: { mats: ['leaf', 'leaf2'] } });
  const br = s('rocks');
  for (let i = 0; i < br.int(2, 4); i++) cv.place(basalt(br, br.int(6, 10), br.int(10, 22)), pal, br.int(10, W - 10), { foot: [5, 2], range: 40 });
  for (let i = 0; i < 3; i++) cv.place(boulder(br, br.int(3, 6), br.int(2, 4)), pal, br.int(10, W - 10), { foot: [5, 1], range: 30 });
  // the lightning rods of crystal, on the ground and the ledges
  const rs = s('rods'), spots = openSpots(cv, 50), rods = [];
  for (let i = 0; i < 80 && rods.length < rs.int(4, 6); i++) {
    const [x, y] = spots[rs.int(0, spots.length - 1)] || [0, 0];
    const h = rs.int(18, 34);
    if (!x || rods.some((q) => Math.abs(q[0] - x) < 34) || !cv.clear(x - 4, y - h - 2, x + 4, y - 1)) continue;
    const tip = rod(cv, x, y, h, ['#0e1a3a', '#3a6ad8', '#9ac8ff', '#ffffff']);
    glow(cv, tip[0], tip[1], 26, [0.4, 0.65, 1], 0.45);
    rods.push(tip);
  }
  const glows = glowShrooms(cv, { n: 3, cap: '#7ab0ff', lit: '#e0f0ff', stem: '#4a5a7a', rgb: [0.5, 0.7, 1], seed: s('caps').int(0, 1e9) });
  cv.meta.rods = rods;
  cv.meta.glows = glows;
  cv.meta.rain = true;
  cv.meta.vignette = 0.5;
  cv.meta.wind = 1.4;
  cv.meta.horizon = 140;
}
