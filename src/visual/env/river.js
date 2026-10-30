// Willow Bank, a river cave: dark teal water running along the cave floor
// under chalky pillars of cobbled stone, their mossy caps hung with moss
// and crowned with cattails; mushrooms glowing cyan in the dark, a
// weeping willow on the bank, a roof of stalactites dripping vines, and
// far pillars fading into the river mist. In some worlds a footbridge
// crosses the stream.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, raise, fillSolid, ledges, paintTerrain, pool, markOpen, surfaceAt } from './side.js';
import { caveFrame, farPillars, fog, vines, moss, glowShrooms, ledgeTops } from './cave.js';
import { tree, reeds, beam } from './objects.js';
import { Model } from '../geometry.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'river', p);
  const pal = vary(palette({
    leaf: ['#4a7a2a', { spread: 0.55 }], bark: ['#4a3a2a', { spread: 0.5 }], reed: ['#4e7a2e', { spread: 0.5 }],
    cattail: '#7a3a22', timber: '#6a4a2e',
  }), s('pal'), 1);
  // the cave's depths: a dark teal back wall, far pillars in two rows with mist between
  sky(cv, 0, H, ['#05090c', '#08121a', '#0c1c20', '#102624'], 10);
  farPillars(cv, { n: 8, fill: '#0f1e1e', rim: '#162a28', seed: s('far1').int(0, 1e9), w: [10, 20], floor: 180, caps: true });
  fog(cv, '#1e4040', 90, 200, 0.35, s('fog1').int(0, 1e9));
  farPillars(cv, { n: 5, fill: '#142824', rim: '#1e3a32', seed: s('far2').int(0, 1e9), w: [16, 28], floor: 185, caps: true });
  fog(cv, '#24504a', 120, 210, 0.25, s('fog2').int(0, 1e9));
  const fs = s('frame');
  const frame = caveFrame(cv, {
    seed: fs.int(0, 1e9), stones: ['#3e443c', '#4a4c40', '#343a34'], mortar: '#101412', dark: 0.42, roof: [10, 30], walls: [8, 12],
    stal: { n: 18, len: [8, 36], w: [3, 7] }, lip: ['#4e8a2e', '#2e5a22'],
  });
  vines(cv, frame.roof, { cols: ['#4e8a2a', '#34621e', '#22401a'], leaf: '#5e9a32', seed: fs.int(0, 1e9), rate: 0.22, len: [4, 50] });
  // the banks, the river bed between them, pillars rising from both
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 168, amp: 8, freq: 0.012 });
  const rx = ts.int(150, 240), hw = ts.int(48, 64);
  dip(top, rx, hw, 28, 0.45);
  const bank = ts.next() < 0.5 ? ts.int(20, 90) : ts.int(300, 360);
  raise(top, bank, bank + ts.int(20, 40), Math.min(...top) - ts.int(6, 12), 3);
  fillSolid(cv, top);
  ledges(cv, top, ts, 7, { keep: [[rx - hw - 6, rx + hw + 6]] });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#8a7a62', b: '#c8c0a8', grain: '#e8e4d4', dark: '#2a2a22', deep: '#141612', cave: '#0a0c0a',
    crust: ['#7ac04a', '#5a9a3a', '#3e7a2e', '#2e5a26'], crustH: 4, seed: ss,
    cobble: { stones: ['#9a9684', '#7e7a68', '#aaa692', '#66645a', '#8a8a78', '#74786a'], mortar: '#2a2a22', s: 4 },
    grass: { cols: ['#5a9a3a', '#7ac04a', '#4a8a30'], tall: 4, rate: 0.6, flowers: ['#ffe58a', '#ffffff'] },
  });
  moss(cv, { cols: ['#7ac04a', '#4e8a34', '#3a6e2a', '#2a5020'], seed: ss + 1, drape: 9, rate: 0.22, len: 12 });
  const level = Math.round(Math.max(top[rx - hw], top[rx + hw])) + 5;
  cv.meta.river = pool(cv, rx - hw, rx + hw, level, { surface: '#8ae0d8', body: ['#2a6a68', '#1e5654', '#164442', '#0e3232', '#0a2424'], see: 0.3, bed: ['#2a3a2e', '#34463a', '#1e2a22'] });
  markOpen(cv);
  // cattails on the pillars and at the water's edge
  const rr = s('reeds');
  for (const [x, y] of ledgeTops(cv, 5, rr.int(0, 1e9))) cv.stamp(reeds(rr, rr.int(10, 16), rr.int(3, 5), { heads: 0.7 }), pal, x, y + 1);
  for (const side of [-1, 1]) {
    let x = rx + side * (hw - rr.int(2, 10));
    while (cv.liquid[(surfaceAt(cv, x) - 1) * W + x] && x > 0 && x < W - 1) x += side;
    cv.stamp(reeds(rr, rr.int(12, 20), rr.int(4, 7), { heads: 0.6 }), pal, x, surfaceAt(cv, x) + 1);
  }
  // the weeping willow on the far bank
  const wr = s('willow'), wx = rx < W / 2 ? wr.int(320, 366) : wr.int(18, 64);
  cv.stamp(tree(wr, 'willow', wr.int(110, 130), wr.int(9, 12)), pal, wx, surfaceAt(cv, wx) + 2, { roots: [12, 3], dark: 0.15 });
  if (wr.next() < 0.5) {
    // a footbridge from bank to bank
    const y = level - 4, m = new Model(), x0 = rx - hw - 4, x1 = rx + hw + 4;
    beam(m, [x0, y], [x1, y], 3);
    for (let x = x0 + 8; x < x1; x += 16) beam(m, [x, y - 8], [x, y + 1], 1.6);
    beam(m, [x0, y - 8], [x1, y - 8], 1.4);
    cv.stamp(m, pal, 0, 0, { dark: 0.2 });
    cv.meta.bridge = [x0, x1, y];
  }
  cv.meta.glows = glowShrooms(cv, { n: 9, cap: '#2ab8d8', lit: '#b0f4ff', stem: '#c8dcd4', rgb: [0.25, 0.75, 0.95], seed: s('shrooms').int(0, 1e9) });
  cv.meta.vignette = 0.6;
  cv.meta.horizon = 116;
}
