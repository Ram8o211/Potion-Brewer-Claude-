// Ember Crags: a volcanic cavern (red-black gloom, far pillars in a haze
// of heat, a roof of stalactites with glowing tips, lava pouring from it)
// or the open slopes under a smoking cone. Lava falls from the edges of
// the ledges, and in front the volcanic ground in cross-section — dark
// cobbled basalt with glowing veins seeping from the lava pool into the
// rock under a crust of ash and scorched moss, pillars dripping moss, a
// lava tube, the pool lighting everything round it, basalt columns,
// fire-glass, charred brush and the steaming vents.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, raise, fillSolid, blob, ledges, paintTerrain, pool, markOpen, surfaceAt, glow, drips, silhouette, col, far } from './side.js';
import { caveFrame, farPillars, fog, moss, fall, ledgeTops, veins, LAVA_VEINS } from './cave.js';
import { basalt, spire, cloud } from './objects.js';
import { terrainTrees } from './trees.js';
import { fbm1 } from '../noise.js';
import { Model, lumpy } from '../geometry.js';

const LAVA = ['#fff0a0', '#ffc040', '#ff8a2a', '#e05a18', '#a8320e'];

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'crags', p);
  const pal = vary(palette({
    rock: ['#3a2e34', { spread: 0.5 }], lava: ['#e05a18', { spread: 0.7, n: 7, warm: 0.6 }], bark: ['#2a1e1a', { spread: 0.35 }],
    gem: ['#ff8a3a', { spread: 0.55 }], wood: '#3a2a20', cloud: ['#4a3a3e', { spread: 0.4 }],
  }), s('pal'), 0.6);
  // a volcanic cavern, or the open slopes under a smoking cone
  const fs = s('frame'), cave = fs.next() < 0.5;
  let frame = null;
  if (cave) {
    sky(cv, 0, H, ['#080303', '#120505', '#1c0807', '#260c08']);
    farPillars(cv, { n: 8, fill: '#1a0a08', rim: '#2a0e0a', seed: s('far1').int(0, 1e9), w: [10, 22], floor: 180 });
    fog(cv, '#5a180c', 80, 210, 0.35, s('fog1').int(0, 1e9));
    farPillars(cv, { n: 5, fill: '#24100c', rim: '#381610', seed: s('far2').int(0, 1e9), w: [18, 30], floor: 185, caps: true });
    fog(cv, '#6a2210', 130, 216, 0.25, s('fog2').int(0, 1e9));
    frame = caveFrame(cv, {
      seed: fs.int(0, 1e9), stones: ['#2e2220', '#3a2a26', '#24191a'], mortar: '#080404', dark: 0.35, roof: [10, 32], walls: [10, 12],
      stal: { n: 18, len: [6, 34], w: [3, 7], tip: '#ff6a20' }, lip: ['#5a2a1a', '#3a1a12'],
    });
    for (const [x, y] of cv.meta.tips) glow(cv, x, y, 10, [1, 0.4, 0.12], 0.4);
  } else {
    sky(cv, 0, H, ['#1a080a', '#3a1010', '#7a2a18', '#c8582a', '#e88a40']);
    const cr = s('clouds');
    for (let i = 0; i < 4; i++) cv.stamp(cloud(cr, cr.int(40, 90), cr.int(8, 16)), pal, cr.int(0, W), cr.int(10, 50), { outline: false, texture: 0 });
    // the cone: a dark silhouette, its crater glowing, lava running down its flanks
    const vx = s('cone').int(110, 270), coneC = col('#3a2226'), rim = col('#5a3030'), lavaC = col('#ff8a2a'), lavaL = col('#ffd060');
    const cone = new Float32Array(W);
    for (let x = 0; x < W; x++) {
      const d = Math.abs(x - vx);
      cone[x] = Math.round(d < 12 ? 44 : 44 + (d - 12) * 0.6 + (fbm1(x * 0.1, 5, 2) - 0.5) * 4);
      for (let y = Math.max(0, cone[x]); y < 140; y++) cv.set(x, y, y === cone[x] ? rim : far(coneC, x, y, vx));
    }
    const lv = s('lavaruns');
    for (let k = 0; k < 3; k++) {
      let x = vx + lv.int(-8, 8);
      for (let y = 45; y < 130; y++) { x += lv.range(-0.8, 0.8) + (x < vx ? -0.4 : 0.4); const xi = Math.round(x); if (xi < 0 || xi >= W || y < cone[xi] + 1) continue; cv.set(xi, y, lavaC); if (y % 3 === 0) cv.set(xi, y, lavaL); }
    }
    for (let x = vx - 11; x <= vx + 11; x++) cv.set(x, 44, lavaL);
    glow(cv, vx, 42, 60, [1, 0.45, 0.15], 0.5);
    cv.meta.crater = [vx, 42];
    silhouette(cv, { base: 124, amp: 10, freq: 0.02, seed: s('r1').int(0, 1e9), fill: '#24161a', rim: '#3a2024', rough: 4, peaks: 0.4 });
    fog(cv, '#8a3a1a', 100, 170, 0.25, s('haze').int(0, 1e9));
  }
  // the ground: ash slopes, a lava tube, lava in a hollow, pillars of basalt
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 168, amp: 10, freq: 0.014 });
  const px = ts.int(90, W - 90), hw = ts.int(30, 46);
  dip(top, px, hw, 22, 0.3);
  const kx = px < W / 2 ? ts.int(230, 300) : ts.int(30, 90);
  raise(top, kx, kx + ts.int(30, 50), Math.min(...top) - ts.int(10, 16), 2);
  fillSolid(cv, top);
  ledges(cv, top, ts, 6, { keep: [[px - hw - 6, px + hw + 6]] });
  blob(cv, kx + 20, Math.round(top[kx + 20]) + 22, ts.int(16, 24), 7, ts.int(0, 1e9), 0);
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#2a2228', b: '#352a30', grain: '#5a3a36', dark: '#100a0a', deep: '#060304', cave: '#040203',
    crust: ['#6a6a2e', '#4e4e24', '#3a3a1e', '#2a2418'], crustH: 4, seed: ss,
    cobble: { stones: ['#3e2e2a', '#32241f', '#4a3630', '#2a1e1c', '#3a2a2a', '#4e2a1e'], mortar: '#0c0606', s: 4 },
    grass: { cols: ['#5a5a26', '#6a6a2e', '#4a4420'], tall: 3, rate: 0.45, flowers: ['#ff5a2a', '#ff8a3a', '#e0302a'] },
  });
  moss(cv, { cols: ['#6a6a2e', '#4e4e24', '#3a3a1e', '#2a2418'], seed: ss + 1, drape: 8, rate: 0.18, len: 10 });
  const level = Math.round(Math.max(top[px - hw], top[px + hw])) + 4;
  cv.meta.lava = pool(cv, px - hw, px + hw, level, { surface: '#ffe680', body: ['#ffb040', '#ff8a2a', '#e05a18', '#b03a10'], see: 0, bed: ['#ffd060', '#e05a18', '#5a2a1a'] });
  veins(cv, cv.meta.lava, LAVA_VEINS(ss + 4));
  glow(cv, px, level, hw + 50, [1, 0.42, 0.12], 0.6);
  markOpen(cv);
  // lava falls: from the roof into the pool, and from the edges of ledges
  const lf = s('falls'), falls = [];
  const fx = px + lf.int(-hw + 8, hw - 8);
  if (frame) falls.push(fall(cv, fx, Math.max(0, frame.roof[fx]) + 1, { w: 2, cols: LAVA, rgb: [1, 0.45, 0.12], seed: lf.int(0, 1e9) }));
  for (const [x0, y0] of ledgeTops(cv, 2, lf.int(0, 1e9), 16)) {
    // walk to the cap's edge and pour over it
    const dir = lf.next() < 0.5 ? -1 : 1;
    let x = x0;
    while (x > 2 && x < W - 3 && cv.solid[(y0 + 1) * W + x + dir]) x += dir;
    fall(cv, x + dir * 3, y0 + 2, { w: 1, cols: LAVA, rgb: [1, 0.45, 0.12], seed: lf.int(0, 1e9) });
  }
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
  terrainTrees(cv, dr, pal, { n: 3, kinds: ['dead'], h: [18, 34], gap: 30, ledges: true });
  // the vents: rock mounds with glowing throats (their steam is animated)
  const vr = s('vents'), vents = [];
  for (let i = 0; i < 2; i++) {
    const x = vr.int(30, W - 30);
    if (Math.abs(x - px) < hw + 12) continue;
    const y = surfaceAt(cv, x) + 1, m = new Model();
    m.poly(lumpy(0, -4, 9, 5, () => vr.next(), 0.2, 6), 'rock', { shade: 'round' });
    m.ellipse(0, -9, 2.5, 1, 'lava', { shade: 'flat', tone: 0.3 });
    cv.stamp(m, pal, x, y, { foot: [9, 2] });
    glow(cv, x, y - 9, 16, [1, 0.5, 0.2], 0.4);
    vents.push({ x, y: y - 10, r: 4 });
  }
  cv.meta.vents = vents;
  cv.meta.trickles = drips(cv, ss, 4);
  cv.meta.vignette = cave ? 0.55 : 0.35;
  cv.meta.horizon = 120;
}
