// Ember Crags, seen from the side: an ash-red sky in bands, a smoking cone
// with a glowing crater and lava running down its flank, black ridges, and
// in front the volcanic ground in cross-section — basalt veined with
// glowing cracks under a crust of ash, broken ledges and a lava tube, a
// pool of lava in a hollow lighting everything round it, basalt columns,
// fire-glass, charred brush and the steaming vents.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, raise, fillSolid, blob, ledges, paintTerrain, pool, markOpen, surfaceAt, silhouette, glow, drips, col } from './side.js';
import { tree, cloud, basalt, spire } from './objects.js';
import { Model, lumpy } from '../geometry.js';
import { hash2 } from '../noise.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'crags', p);
  const pal = vary(palette({
    rock: ['#3a2e34', { spread: 0.5 }], lava: ['#e05a18', { spread: 0.7, n: 7, warm: 0.6 }], cloud: ['#4a3a3e', { spread: 0.4 }], bark: ['#2a1e1a', { spread: 0.35 }],
    gem: ['#ff8a3a', { spread: 0.55 }], wood: '#3a2a20',
  }), s('pal'), 0.6);
  sky(cv, 0, H, ['#140608', '#2e0e10', '#6a2216', '#b84a22', '#e07a34'], 10);
  const cr = s('clouds');
  for (let i = 0; i < 4; i++) cv.stamp(cloud(cr, cr.int(40, 90), cr.int(8, 16)), pal, cr.int(0, W), cr.int(10, 50), { outline: false });
  // the cone: a flat dark silhouette, its crater glowing, lava running down
  const vx = s('cone').int(110, 270), coneC = col('#3a2226'), rim = col('#5a3030'), lavaC = col('#ff8a2a'), lavaL = col('#ffd060');
  const cone = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    const d = Math.abs(x - vx);
    cone[x] = Math.round(d < 12 ? 44 : 44 + (d - 12) * 0.6 + (hash2(x >> 2, 0, 5) - 0.5) * 3);
    for (let y = Math.max(0, cone[x]); y < 130; y++) cv.set(x, y, y === cone[x] ? rim : coneC);
  }
  const lv = s('lavaruns');
  for (let k = 0; k < 3; k++) {
    let x = vx + lv.int(-8, 8);
    for (let y = 45; y < 120; y++) { x += lv.range(-0.8, 0.8) + (x < vx ? -0.4 : 0.4); const xi = Math.round(x); if (y < cone[Math.max(0, Math.min(W - 1, xi))] + 1) continue; cv.set(xi, y, y % 4 ? lavaC : lavaL); }
  }
  for (let x = vx - 11; x <= vx + 11; x++) cv.set(x, 44, lavaL);
  glow(cv, vx, 42, 50, [1, 0.45, 0.15], 0.45);
  cv.meta.crater = [vx, 42];
  silhouette(cv, { base: 118, amp: 10, freq: 0.02, seed: s('r1').int(0, 1e9), fill: '#24161a', rim: '#3a2024', rough: 4, peaks: 0.4 });
  // the ground: ash slopes, a broken ledge, a lava tube, lava in a hollow
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 160, amp: 12, freq: 0.014 });
  const px = ts.int(90, W - 90), hw = ts.int(30, 46);
  dip(top, px, hw, 22, 0.3);
  const kx = px < W / 2 ? ts.int(230, 300) : ts.int(30, 90);
  raise(top, kx, kx + ts.int(30, 50), Math.min(...top) - ts.int(10, 16), 2);
  fillSolid(cv, top);
  ledges(cv, top, ts, 6, { keep: [[px - hw - 6, px + hw + 6]] });
  blob(cv, kx + 20, Math.round(top[kx + 20]) + 22, ts.int(16, 24), 7, ts.int(0, 1e9), 0);
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#2a2228', b: '#352a30', grain: '#5a3a36', dark: '#120c0e', deep: '#0a0608', cave: '#050304',
    crust: ['#7a6c68', '#5a4e4c', '#3e3438'], crustH: 3, seed: ss,
    seams: { cols: ['#e05a18', '#ff9a3a'], n: 14 },
    rocks: { cols: ['#4e4248', '#3a2e34', '#1e1418'], n: 22, r: 6 },
  });
  const level = Math.round(Math.max(top[px - hw], top[px + hw])) + 4;
  cv.meta.lava = pool(cv, px - hw, px + hw, level, { surface: '#ffe680', body: ['#ffb040', '#ff8a2a', '#e05a18', '#b03a10'], see: 0, bed: ['#ffd060', '#e05a18', '#5a2a1a'] });
  glow(cv, px, level, hw + 40, [1, 0.45, 0.12], 0.45);
  markOpen(cv);
  // basalt columns, fire-glass, charred brush
  const br = s('basalt');
  for (let g = 0; g < 2; g++) {
    const gx = br.int(20, W - 40);
    if (Math.abs(gx - px) < hw + 20) continue;
    for (let i = 0; i < br.int(3, 5); i++) { const x = gx + i * 6; cv.stamp(basalt(br, 6, br.int(10, 24)), pal, x, surfaceAt(cv, x) + 2, { foot: [3, 2] }); }
  }
  const gr = s('glass');
  for (let i = 0; i < 2; i++) { const x = gr.int(10, W - 10); if (cv.liquid[(surfaceAt(cv, x) - 1) * W + x]) continue; cv.stamp(spire(gr, gr.int(8, 13)), pal, x, surfaceAt(cv, x) + 1, { foot: [4, 2] }); }
  const dr = s('brush');
  for (let i = 0; i < 3; i++) { const x = dr.int(0, W); cv.stamp(tree(dr, 'dead', dr.int(16, 30), 1.6), pal, x, surfaceAt(cv, x) + 1, { roots: [3, 2] }); }
  // the vents: rock mounds with glowing throats (their steam is animated)
  const vr = s('vents'), vents = [];
  for (let i = 0; i < 2; i++) {
    const x = vr.int(30, W - 30);
    if (Math.abs(x - px) < hw + 12) continue;
    const y = surfaceAt(cv, x) + 1, m = new Model();
    m.poly(lumpy(0, -4, 9, 5, () => vr.next(), 0.2, 6), 'rock', { shade: 'round' });
    m.ellipse(0, -9, 2.5, 1, 'lava', { shade: 'flat', tone: 0.3 });
    cv.stamp(m, pal, x, y, { foot: [9, 2] });
    glow(cv, x, y - 9, 14, [1, 0.5, 0.2], 0.3);
    vents.push({ x, y: y - 10, r: 4 });
  }
  cv.meta.vents = vents;
  cv.meta.trickles = drips(cv, ss, 4);
  cv.meta.horizon = 120;
}
