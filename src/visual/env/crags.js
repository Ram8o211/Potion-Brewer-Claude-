// Ember Crags: volcanic slopes under an ash-red sky — a smoking cone with a
// glowing crater and lava runs down its flank, black basalt ridges, a field
// of dark rock cracked with glowing seams, a lava flow crusted with cooling
// plates, ash drifts, clusters of hexagonal basalt columns, fire-glass
// outcrops, charred brush and the steaming vents.

import { sky, ridge, ground, shadeOf } from './paint.js';
import { palette, vary, streamOf, scaleAt, hazeAt, band, fbm2, hash2, noise2 } from './kit.js';
import { tree, boulder, cloud, basalt, spire } from './objects.js';
import { Model, lumpy } from '../geometry.js';
import { hex, pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'crags', p);
  const pal = vary(palette({
    rock: ['#3a2e34', { spread: 0.5 }], basalt: ['#2e262c', { spread: 0.5, n: 7 }], ash: ['#6a5e5a', { spread: 0.35, n: 5 }], lava: ['#e05a18', { spread: 0.7, n: 7, warm: 0.6 }],
    cone: ['#3e2a2a', { spread: 0.45, n: 6 }], ridge: ['#24181c', { spread: 0.3, n: 5 }], cloud: ['#4a3a3e', { spread: 0.4 }], bark: ['#2a1e1a', { spread: 0.35 }],
    gem: ['#ff8a3a', { spread: 0.55 }], wood: '#3a2a20',
  }), s('pal'), 0.6);
  sky(cv, 0, 110, ['#140608', '#2e0e10', '#6a2216', '#b84a22', '#e07a34'], 14);
  // ash clouds lit from below
  const cr = s('clouds');
  for (let i = 0; i < 5; i++) cv.stamp(cloud(cr, cr.int(40, 90), cr.int(8, 16)), pal, cr.int(0, W), cr.int(10, 50), { outline: false, texture: 0.3 });
  // the cone, its crater glowing and lava running down
  const vx = s('cone').int(110, 270);
  const cone = new Float32Array(W);
  for (let x = 0; x < W; x++) { const d = Math.abs(x - vx); cone[x] = d < 14 ? 40 + d * 0.15 : 42 + (d - 14) * 0.62 + (fbm2(x * 0.05, 0, 5, 3) - 0.5) * 6; }
  for (let x = 0; x < W; x++) for (let y = Math.max(0, Math.round(cone[x])); y < 104; y++) {
    const slope = x < vx ? 0.12 : -0.12, l = 0.42 + slope - (y - cone[x]) / 260 + (fbm2(x * 0.08, y * 0.06, 7, 3) - 0.5) * 0.4;
    cv.set(x, y, shadeOf(pal.cone, l, x, y));
  }
  const lv = s('lavaruns');
  for (let k = 0; k < 3; k++) {
    let x = vx + lv.int(-10, 10);
    for (let y = 42; y < 100; y++) { x += lv.range(-0.8, 0.8) + (x < vx ? -0.35 : 0.35); if (y < cone[Math.round(x)] + 1) continue; cv.set(Math.round(x), y, pal.lava[5 - (y % 3 === 0 ? 1 : 0)]); cv.set(Math.round(x) + 1, y, pal.lava[3]); }
  }
  cv.light([1, 0.45, 0.15], (x, y) => Math.max(0, 0.4 - Math.hypot(x - vx, (y - 40) * 1.5) / 60), 0, 80);
  for (let x = vx - 12; x <= vx + 12; x++) cv.set(x, 41, pal.lava[6]);
  cv.meta.crater = [vx, 40];
  ridge(cv, { base: 92, amp: 10, freq: 0.02, bottom: 116, ramp: pal.ridge, seed: s('r1').int(0, 1e9), tex: 0.3, rough: 5, rim: 1 });
  // the rock field, cracked with glowing seams; a lava flow crusted with plates
  const hz = new Float32Array(W), hs = s('hz').int(0, 1e9);
  for (let x = 0; x < W; x++) hz[x] = 108 + (fbm2(x * 0.02, 0, hs, 3) - 0.5) * 6;
  const flip = s('flip').next() < 0.5;
  const flow = band(s('flow'), 108, H, { x0: flip ? 300 : 90, x1: flip ? 110 : 280, w0: 3, w1: 30, wander: 30 });
  const gs = s('field').int(0, 1e9);
  const inLava = (x, y) => y >= 108 && y < H && Math.abs(x - flow[y].c) - flow[y].hw - (noise2(x * 0.12, y * 0.25, gs + 1) - 0.5) * 5 < 0;
  ground(cv, hz, (x, y, depth, n) => {
    if (inLava(x, y)) {
      // molten rock under a skin of cooling plates
      const crust = fbm2(x * (0.08 - depth * 0.03), y * (0.2 - depth * 0.1), gs + 3, 2);
      if (crust > 0.58) return shadeOf(pal.basalt, 0.15 + (crust - 0.58) * 2, x, y);
      return shadeOf(pal.lava, 0.55 + n * 0.45 - (crust > 0.55 ? 0.25 : 0), x, y);
    }
    const ash = fbm2(x * 0.025, y * 0.07, gs + 7, 3);
    const crack = Math.abs(noise2(x * 0.04, y * 0.1, gs + 9) - 0.5) < (0.004 + depth * 0.006) * (fbm2(x * 0.02, y * 0.04, gs + 13, 2) > 0.5 ? 2.2 : 0.4);
    if (crack) return pal.lava[4 + (hash2(x, y, gs) > 0.6 ? 1 : 0)];
    if (ash > 0.6) return shadeOf(pal.ash, 0.25 + n * 0.5, x, y);
    return shadeOf(pal.basalt, 0.2 + n * 0.45 + (hash2(x >> 1, y >> 1, gs) > 0.85 ? 0.18 : 0), x, y);
  }, gs);
  for (let y = 108; y < H; y++) for (let x = 0; x < W; x++) if (inLava(x, y) || inLava(x - 2, y) || inLava(x + 2, y) || inLava(x, y + 2)) cv.open[y * W + x] = 0;
  // the lava's glow on everything near it
  cv.light([0.9, 0.35, 0.08], (x, y) => {
    if (y < 108) return 0;
    const d = Math.abs(x - flow[y].c) - flow[y].hw;
    return d > 0 && d < 24 ? 0.18 * (1 - d / 24) : 0;
  }, 108, H);
  cv.meta.flow = flow.map((r) => [Math.round(r.c), Math.round(r.hw)]);
  // basalt columns, fire-glass outcrops, boulders, charred brush
  const br = s('basalt');
  for (let g = 0; g < 3; g++) {
    const gx = br.int(10, W - 10), gy = br.int(116, H - 8);
    if (inLava(gx, gy)) continue;
    const k = scaleAt(gy, 108, H);
    for (let i = 0; i < br.int(3, 5); i++) cv.stamp(basalt(br, 5 * k + 3, (10 + br.int(0, 14)) * k + 4), pal, gx + (i - 2) * (5 * k + 3), gy + (i % 2), { foot: [4 * k + 2, 2], haze: hazeAt(gy, 108, H, pack(hex('#5a2a22')), 0.4) });
  }
  const gr = s('glass');
  for (let i = 0; i < 3; i++) { const y = gr.int(118, H - 6), x = gr.int(10, W - 10); if (inLava(x, y)) continue; cv.stamp(spire(gr, 5 + scaleAt(y, 108, H) * 9), pal, x, y, { foot: [4, 2] }); }
  for (let i = 0; i < 6; i++) { const y = gr.int(116, H - 3), x = gr.int(0, W); if (inLava(x, y)) continue; const k = scaleAt(y, 108, H); cv.stamp(boulder(gr, 4 + k * 8, 3 + k * 5), pal, x, y, { foot: [4 + k * 7, 2 + k * 3] }); }
  const dr = s('brush');
  for (let i = 0; i < 3; i++) { const y = dr.int(118, H - 4), x = dr.int(0, W); if (inLava(x, y)) continue; cv.stamp(tree(dr, 'dead', 14 + scaleAt(y, 108, H) * 18, 1.6), pal, x, y, { foot: [3, 2] }); }
  // the vents: rock mounds with glowing throats (their steam is animated)
  const vr = s('vents'), vents = [];
  for (let i = 0; i < 2; i++) {
    const y = vr.int(122, 170), x = vr.int(30, W - 30);
    if (inLava(x, y)) continue;
    const k = scaleAt(y, 108, H), m = new Model();
    m.poly(lumpy(0, -4 * k - 1, 9 * k + 3, 4 * k + 2, () => vr.next(), 0.2, 6), 'rock', { shade: 'round' });
    m.ellipse(0, -8 * k - 2, 2.5 * k + 1, 1, 'lava', { shade: 'flat', tone: 0.3 });
    cv.stamp(m, pal, x, y, { foot: [9 * k + 3, 3] });
    vents.push({ x, y: Math.round(y - 8 * k - 3), r: Math.round(2 + k * 3) });
  }
  cv.meta.vents = vents;
  cv.meta.horizon = 108;
}
