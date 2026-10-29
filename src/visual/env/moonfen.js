// Moonfen, seen from the side: a starry night and a haloed moon over a
// black treeline, and in front the bog in cross-section — black peat under
// a crust of moss, low tussocks and a barrow, still pools of black water
// in its hollows holding the moon's light, willows hung with moss, a dead
// tree, a cairn, crystals glowing in the dark and banks of mist.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, raise, fillSolid, ledges, paintTerrain, pool, markOpen, surfaceAt, silhouette, treeShape, glow } from './side.js';
import { tree, reeds, spire, cairn } from './objects.js';
import { fbm2 } from '../noise.js';
import { pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'moonfen', p);
  const pal = vary(palette({
    leaf: ['#1e3e34', { spread: 0.45 }], moss: ['#2e5a46', { spread: 0.5 }], bark: ['#2a2420', { spread: 0.4 }], wood: '#5a4a3a', rock: ['#3e4250', { spread: 0.45 }],
    reed: ['#2e4a34', { spread: 0.45 }], cattail: '#3a2a1e', gem: ['#9a7ae0', { spread: 0.6 }],
  }), s('pal'), 0.8);
  sky(cv, 0, H, ['#04050e', '#0a0f2a', '#18204a', '#2a2e5e'], 10);
  // stars, a few bright ones crossed
  const st = s('stars');
  for (let i = 0; i < 140; i++) { const x = st.int(0, W - 1), y = st.int(0, 110), b = st.next(); cv.set(x, y, pack(b > 0.8 ? [0.95, 0.95, 1] : b > 0.4 ? [0.7, 0.72, 0.95] : [0.45, 0.48, 0.75])); }
  for (let i = 0; i < 5; i++) { const x = st.int(4, W - 4), y = st.int(4, 70), c = pack([0.85, 0.9, 1]); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]) cv.set(x + dx, y + dy, c); }
  // the moon and its halo
  const mx = s('moon').int(40, W - 40), my = s('moon2').int(22, 40), mr = 12;
  glow(cv, mx, my, 70, [0.45, 0.5, 0.75], 0.35);
  const ms = s('craters').int(0, 1e9);
  for (let y = my - mr; y <= my + mr; y++) for (let x = mx - mr; x <= mx + mr; x++) {
    if (Math.hypot(x - mx, y - my) > mr + 0.3) continue;
    const l = fbm2(x * 0.25, y * 0.25, ms, 2) > 0.58 ? 0.8 : 0.95;
    cv.set(x, y, pack([0.86 * l + 0.1, 0.9 * l + 0.08, l]));
  }
  // black treelines and dead trees against the sky
  const far = silhouette(cv, { base: 112, amp: 8, freq: 0.03, seed: s('t1').int(0, 1e9), fill: '#141a34', rough: 4 });
  const tl = s('tl');
  for (let x = 2; x < W; x += tl.int(7, 15)) treeShape(cv, x, far[x] + 2, tl.int(12, 26), tl.next() < 0.25 ? 'dead' : 'oak', '#141a34', tl.int(0, 1e9));
  silhouette(cv, { base: 126, amp: 5, freq: 0.04, seed: s('t2').int(0, 1e9), fill: '#0c1022', rough: 3 });
  // the bog: low ground, tussocks and a barrow, pools in its hollows
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 160, amp: 8, freq: 0.02 });
  const bx = ts.int(40, W - 100);
  raise(top, bx, bx + ts.int(30, 50), Math.min(...top) - ts.int(10, 16), 4);
  const pools = [];
  for (let i = 0; i < 6 && pools.length < 3; i++) {
    const px = ts.int(30, W - 30), hw = ts.int(18, 30);
    if (px + hw > bx - 8 && px - hw < bx + 60) continue;
    if (pools.some((q) => Math.abs(q.x - px) < q.hw + hw + 16)) continue;
    pools.push({ x: px, hw, level: Math.round(top[px]) + 2 });
    dip(top, px, hw, ts.int(10, 16));
  }
  fillSolid(cv, top);
  ledges(cv, top, ts, 7, { keep: pools.map((p) => [p.x - p.hw - 4, p.x + p.hw + 4]) });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#1e1a18', b: '#2a2420', grain: '#4a4038', dark: '#0a0808', deep: '#060505', cave: '#030303',
    crust: ['#3e7a5e', '#2e5a46', '#1e3e30'], crustH: 3, seed: ss,
    grass: { cols: ['#2e5a46', '#3e7a5e', '#1e4a36'], tall: 4, rate: 0.55, flowers: ['#d8ff8a'] },
    rocks: { cols: ['#5a5e6e', '#3e4250', '#1e2028'], n: 18, r: 5 },
  });
  cv.meta.pools = pools.map((p) => pool(cv, p.x - p.hw, p.x + p.hw, p.level, { surface: '#b0c0f0', body: ['#2a3a70', '#22305e', '#1a264c', '#121c3a'], see: 0.1, bed: ['#0e1a14', '#16261e', '#0a0e0c'] }));
  markOpen(cv);
  // willows hung with moss, a dead tree, reeds at the pools
  const wr = s('willows');
  for (const x of [wr.int(4, 40), wr.int(344, 380)]) cv.stamp(tree(wr, 'willow', wr.int(100, 124), wr.int(8, 11)), pal, x, surfaceAt(cv, x) + 2, { roots: [12, 3], dark: 0.25 });
  const dx = wr.int(120, 260);
  cv.stamp(tree(wr, 'dead', wr.int(50, 70), wr.int(4, 6)), pal, dx, surfaceAt(cv, dx) + 1, { roots: [5, 2] });
  const rr = s('reeds');
  for (const p of pools) for (const side of [-1, 1]) {
    let x = p.x + side * p.hw;
    while (x > 0 && x < W - 1 && cv.liquid[(surfaceAt(cv, x) - 1) * W + x]) x += side;
    cv.stamp(reeds(rr, rr.int(10, 18), rr.int(3, 5), { heads: 0.4 }), pal, x + side * 2, surfaceAt(cv, x + side * 2) + 1);
  }
  // a cairn on the barrow, crystals glowing in the dark
  const sr = s('stones'), cx = bx + sr.int(5, 25);
  cv.stamp(cairn(sr, 6), pal, cx, surfaceAt(cv, cx) + 1, { foot: [6, 2] });
  const glows = [];
  for (let i = 0; i < 3; i++) {
    const x = sr.int(16, W - 16), y = surfaceAt(cv, x);
    if (cv.liquid[(y - 1) * W + x]) continue;
    cv.stamp(spire(sr, sr.int(8, 14)), pal, x, y + 1, { foot: [4, 2] });
    glow(cv, x, y - 6, 30, [0.35, 0.25, 0.75], 0.3);
    glows.push([x, y - 6]);
  }
  // banks of mist lying low over the bog, in flat bands
  const fs = s('mist').int(0, 1e9), mist = pack([0.48, 0.54, 0.72]);
  cv.wash(mist, (x, y) => {
    const band = Math.exp(-(((y - 150) / 8) ** 2)) * 0.45 + Math.exp(-(((y - 124) / 6) ** 2)) * 0.3;
    return band * (fbm2(x * 0.02, y * 0.05, fs, 3) > 0.5 ? 1 : 0.5);
  }, 100, H);
  cv.meta.glows = glows;
  cv.meta.moon = [mx, my];
  cv.meta.horizon = 124;
}
