// The Skydrift Isles (exotic, levitation): a bright sky with a sun and
// heaped clouds, far isles floating in the haze trailing thin waterfalls,
// a sea of cloud far below, and in front the land itself — one great isle
// floating on nothing, its grassy top in cross-section over rich earth and
// warm stone, its underside tapering into the cloud sea with roots hanging
// from it; smaller isles float above it, unsupported, a waterfall pouring
// off one of them. The isles that bob in the sky (wild-scene.js) answer the
// finger: they spring back to where they float.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, fillSolid, paintTerrain, markOpen, glow, smoothTop } from './side.js';
import { fog, moss, fall } from './cave.js';
import { cloud, boulder } from './objects.js';
import { terrainTrees } from './trees.js';
import { farIsle, cloudSea, openSpots } from './exotic.js';
import { fbm1, fbm2 } from '../noise.js';
import { pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'skydrift', p);
  const pal = vary(palette({
    leaf: ['#4aa63a', { spread: 0.8, warm: 0.4 }], leaf2: ['#7ac44a', { spread: 0.7 }], bloom: ['#fff0a0', { spread: 0.5 }], bark: '#5a3e26', rock: '#8a8478', cloud: ['#f4f8ff', { spread: 0.2 }], moss: '#5a9a3a',
  }), s('pal'), 1);
  // the time of day of this expedition: morning blue, a golden afternoon or a rosy evening
  const tod = s('tod').weighted(['day', 'gold', 'rose'], [2, 1, 1]);
  const skies = { day: ['#3a78d0', '#5a9ce4', '#9cc8f0', '#dcefff'], gold: ['#4a76c4', '#7aa4d8', '#f0d0a0', '#fff0c8'], rose: ['#5a5ab0', '#8a7ac8', '#e8a8c0', '#ffe0d0'] }[tod];
  sky(cv, 0, H, skies, 10);
  const sx = s('sun').int(60, W - 60), sy = s('sun').int(22, 40);
  glow(cv, sx, sy, 80, tod === 'rose' ? [1, 0.8, 0.8] : [1, 0.95, 0.75], 0.4);
  for (let y = sy - 9; y <= sy + 9; y++) for (let x = sx - 9; x <= sx + 9; x++) if (Math.hypot(x - sx, y - sy) <= 8.5) cv.set(x, y, Math.hypot(x - sx, y - sy) < 6.5 ? pack([1, 0.99, 0.9]) : pack([1, 0.92, 0.7]));
  const cr = s('clouds');
  for (let i = 0; i < 5 + cr.int(0, 3); i++) cv.stamp(cloud(cr, cr.int(30, 70), cr.int(8, 14)), pal, cr.int(20, W - 20), cr.int(20, 96), { outline: false, texture: 0 });
  // far isles in the haze, a few trailing waterfalls
  const fr = s('far');
  for (let i = 0; i < 5 + fr.int(0, 3); i++) farIsle(cv, fr.int(10, W - 10), fr.int(70, 128), fr.int(16, 44), fr.int(10, 22), { grass: '#7ab88a', rock: '#7e8aa8', dark: '#66708e', lit: '#a8dca0', water: '#eaf6ff' }, fr.int(0, 1e9));
  fog(cv, '#dcefff', 110, 150, 0.22, s('haze').int(0, 1e9));
  // the sea of cloud far below
  cloudSea(cv, s('sea').int(170, 184), ['#ffffff', '#e4eefc', '#c4d6ee', '#a4bad8'], s('sea').int(0, 1e9));
  // the great isle: rolling grassy top, its underside tapering into the cloud sea
  const ts = s('terrain'), base = ts.int(148, 162), top = heights(W, ts.int(0, 1e9), { base, amp: ts.int(6, 14), freq: 0.008 + ts.next() * 0.01 });
  fillSolid(cv, top);
  const us = ts.int(0, 1e9), depth = ts.int(26, 40);
  // a gap in the isle now and then: two isles with a stretch of sky between (their ends still reach for each other)
  const gap = ts.next() < 0.45 ? [ts.int(W * 0.3, W * 0.6), ts.int(26, 40)] : null;
  for (let x = 0; x < W; x++) {
    let under = top[x] + depth + (fbm1(x * 0.03, us, 3) - 0.5) * 22 + Math.sin(x * 0.11 + us) * 3;
    if (gap) { const dx = Math.abs(x - gap[0]); if (dx < gap[1]) under = top[x] + Math.max(0, dx - gap[1] * 0.55) * 1.4; }
    for (let y = Math.max(0, Math.round(under)); y < H; y++) cv.solid[y * W + x] = 0;
  }
  // small isles floating above it, unsupported
  const isles = [];
  const ir = s('isles');
  for (let i = 0; i < 6 && isles.length < ir.int(2, 3); i++) {
    const cx = ir.int(40, W - 40), cy = ir.int(70, 108), rx = ir.int(18, 30);
    if (isles.some((q) => Math.abs(q[0] - cx) < q[2] + rx + 14)) continue;
    if (cy + 26 > Math.min(top[Math.max(0, cx - rx)], top[Math.min(W - 1, cx + rx)]) - 18) continue;
    isles.push([cx, cy, rx]);
    const line = new Float32Array(rx * 2 + 1);
    for (let k = 0; k <= rx * 2; k++) line[k] = cy + (fbm1((cx + k) * 0.1, ir.int(0, 1e9), 2) - 0.5) * 3;
    smoothTop(line, 0.5, 2);
    for (let k = 0; k <= rx * 2; k++) {
      const x = cx - rx + k, u = (k - rx) / rx, t = Math.round(line[k]), b = t + 4 + 20 * Math.pow(Math.max(0, 1 - u * u), 1.4) * (0.75 + fbm1(x * 0.2, i, 2) * 0.5);
      for (let y = t; y <= b; y++) if (x >= 0 && x < W && y >= 0 && y < H) cv.solid[y * W + x] = 1;
    }
  }
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#6a5040', b: '#7e604a', grain: '#a8886a', dark: '#2a1c14', deep: '#1a120c', cave: '#100a06',
    crust: ['#9ade5a', '#6ab83e', '#4a9a32', '#367a28'], crustH: 4, seed: ss,
    cobble: { stones: ['#8a7e72', '#7a6e64', '#9a8e80', '#6e645a', '#a49888', '#80766a'], mortar: '#1a120e', s: 10, moss: ['#4a9a32', '#9ade5a'] },
    grass: { cols: ['#7ac84a', '#9ade5a', '#5aaa3a'], tall: 4, rate: 0.7, flowers: ['#ffffff', '#fff4a0', '#ffd0e8', '#b8e0ff'] },
    layers: [{ kind: 'dirt', cols: ['#7a4a26', '#86542a', '#a8683a', '#c88448', '#d8c0a0', '#6a4e38'], h: [10, 16] }],
  });
  // roots and moss hanging from the undersides
  moss(cv, { cols: ['#9ade5a', '#6ab83e', '#4a9a32', '#2e6a22'], seed: ss + 1, drape: 12, rate: 0.3, len: 16 });
  const rt = s('roots'), root = pack([0.36, 0.26, 0.18]), rootL = pack([0.5, 0.38, 0.26]);
  for (let x = 2; x < W - 2; x++) for (let y = H - 2; y > 40; y--) {
    const k = y * W + x;
    if (!cv.solid[k] || cv.solid[k + W] || rt.next() > 0.05) continue;
    const len = rt.int(4, 18);
    for (let j = 1; j <= len && y + j < H; j++) { const xx = x + Math.round(Math.sin(j * 0.4 + x) * 0.8); if (!cv.solid[(y + j) * W + xx]) cv.set(xx, y + j, j % 4 ? root : rootL); }
    break;
  }
  markOpen(cv);
  // a waterfall pouring off a floating isle onto the land
  if (isles.length && s('falls').next() < 0.8) {
    const [ix, iy, irx] = isles[0], fx = ix + (s('falls').next() < 0.5 ? -1 : 1) * (irx - 4);
    fall(cv, fx, iy + 6, { w: 2, cols: ['#f4fbff', '#bfe4ff', '#7ab8e8', '#4a8ac8'], seed: s('falls').int(0, 1e9) });
  }
  // bright, blossoming trees on the land and the isles, a few boulders
  const look = { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.12 } };
  terrainTrees(cv, s('trees'), pal, { n: s('trees').int(2, 5), kinds: ['oak', 'tiers', 'gnarl', 'sparse'], h: [40, 96], gap: 60, ledges: true, look });
  const br = s('rocks');
  for (let i = 0; i < 3; i++) cv.place(boulder(br, br.int(3, 6), br.int(2, 4)), pal, br.int(10, W - 10), { foot: [5, 1], range: 30 });
  // the isles that bob in the sky (and spring back when pushed): where they float
  const bob = s('bob'), spots = [];
  for (let i = 0; i < 12 && spots.length < bob.int(3, 5); i++) {
    const x = bob.int(24, W - 24), y = bob.int(20, 78), r = bob.int(9, 15);
    if (Math.hypot(x - sx, y - sy) < 28 || spots.some((q) => Math.hypot(q[0] - x, q[1] - y) < q[2] + r + 16)) continue;
    if (isles.some((q) => Math.abs(q[0] - x) < q[2] + r + 6 && Math.abs(q[1] - y) < 34)) continue;
    spots.push([x, y, r, bob.int(0, 1e9)]);
  }
  cv.meta.isles = spots;
  cv.meta.open = openSpots(cv).length;
  // a breath of haze over the far side
  const hz = s('mist').int(0, 1e9), mist = pack([0.92, 0.96, 1]);
  cv.wash(mist, (x, y) => Math.exp(-(((y - 150) / 14) ** 2)) * 0.18 * (fbm2(x * 0.02, y * 0.05, hz, 3) > 0.5 ? 1 : 0.6), 100, H);
  cv.meta.vignette = 0.22;
  cv.meta.wind = 1;
  cv.meta.horizon = 140;
  cv.meta.tod = tod;
}
