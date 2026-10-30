// Ironstone Quarry, a mine worked deep in a cavern: brown gloom with far
// pillars of rock, a roof of stalactites dripping rusty water, and in
// front the worked rock in cross-section — benches cut down in steps, dark
// cobbled stone run through with seams of rust, quartz and sulphur and
// flecked with ore, pillars left standing; timber scaffolds and a winding
// wheel, a mine adit framed in timber, a crane, a ladder against a face, a
// cart on its rails, crates, and torches and a lantern burning in the dark.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { fillSolid, blob, ledges, paintTerrain, markOpen, surfaceAt, glow, drips } from './side.js';
import { caveFrame, farPillars, fog, moss, torch, ledgeTops } from './cave.js';
import { crane, ladder, cart, crate, beam, boulder, scaffold, wheel } from './objects.js';
import { Model } from '../geometry.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'quarry', p);
  const pal = vary(palette({
    rock: ['#5a5048', { spread: 0.55 }], timber: ['#6a4428', { spread: 0.5 }], rope: '#4a3a2a', ore: ['#5a4a46', { spread: 0.5 }], metal: '#5a5a62',
    seamC: ['#e8c040', { spread: 0.4, n: 4 }],
  }), s('pal'), 0.8);
  sky(cv, 0, H, ['#070504', '#0e0a08', '#16100c', '#1c140e'], 10);
  farPillars(cv, { n: 7, fill: '#1a130e', rim: '#241a12', seed: s('far1').int(0, 1e9), w: [12, 24], floor: 180 });
  fog(cv, '#3a2a1c', 80, 200, 0.3, s('fog1').int(0, 1e9));
  farPillars(cv, { n: 4, fill: '#22180f', rim: '#30221a', seed: s('far2').int(0, 1e9), w: [20, 34], floor: 185, caps: true });
  const fs = s('frame');
  caveFrame(cv, {
    seed: fs.int(0, 1e9), stones: ['#3a3028', '#2e2620', '#463a2e'], mortar: '#0c0806', dark: 0.4, roof: [10, 34], walls: [10, 12],
    stal: { n: 18, len: [6, 34], w: [3, 7], tip: '#c8702a' }, lip: ['#5a4a36', '#3a2e22'],
  });
  // the benches: steps cut down from one side, each a level shelf over a sheer face
  const ts = s('terrain'), top = new Float32Array(W), right = ts.next() < 0.5;
  const steps = [ts.int(108, 118), ts.int(128, 138), ts.int(148, 156), ts.int(166, 176)];
  let x = 0;
  const edges = [];
  for (let k = 0; k < steps.length; k++) {
    const w = k === steps.length - 1 ? W - x : ts.int(64, 96);
    for (let i = x; i < Math.min(W, x + w); i++) top[right ? W - 1 - i : i] = steps[k] + (i - x < 2 ? -1 : 0);
    x += w;
    edges.push(right ? W - x : x);
  }
  fillSolid(cv, top);
  // pillars of rock left standing, their shelves jutting from the faces
  ledges(cv, top, ts, 6, { rise: [26, 34] });
  // a mine adit cut into one of the faces
  const ak = ts.int(0, 2), ax = right ? edges[ak] - 14 : edges[ak] + 14, ay = steps[ak + 1] - 8;
  blob(cv, ax, ay, 9, 7, ts.int(0, 1e9), 0, 0.1);
  for (let yy = ay; yy < steps[ak + 1]; yy++) for (let xx = ax - 9; xx <= ax + 9; xx++) if (cv.solid[yy * W + xx]) { cv.solid[yy * W + xx] = 0; cv.cave[yy * W + xx] = 1; }
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#5a5048', b: '#4e463e', grain: '#8a7e70', dark: '#1e1812', deep: '#0e0a08', cave: '#060404',
    crust: ['#9a8a6e', '#7a6c56', '#5a4e40'], crustH: 3, seed: ss,
    cobble: { stones: ['#5e5246', '#4e443a', '#6a5c4c', '#463e36', '#584c40', '#6a5236'], mortar: '#16100c', s: 4 },
    seams: { cols: ['#a0502a', '#b8b0a0', '#c09a3a', '#c87a2a'], n: 14 },
  });
  moss(cv, { cols: ['#8a7a5e', '#6a5c48', '#4a4034'], seed: ss + 1, drape: 5, rate: 0.08, len: 6 });
  // flecks of ore glinting in the rock
  const fl = s('flecks');
  for (let i = 0; i < 160; i++) {
    const xx = fl.int(0, W - 1), yy = fl.int(0, H - 1);
    if (!cv.solid[yy * W + xx]) continue;
    cv.set(xx, yy, fl.next() < 0.6 ? 0xff3ab0e8 : 0xff2a7ad0);
  }
  markOpen(cv);
  // the adit's timber frame
  const fm = new Model();
  beam(fm, [-9, 0], [-9, -15], 2.4); beam(fm, [9, 0], [9, -15], 2.4); beam(fm, [-11, -15], [11, -15], 2.6);
  cv.stamp(fm, pal, ax, steps[ak + 1], {});
  cv.meta.adit = [ax, ay];
  // timber: the crane on the top bench, a ladder up a face, scaffolds, crates, the cart on its rails
  const tm = s('timber');
  const cx = right ? tm.int(W - 50, W - 24) : tm.int(24, 50);
  cv.stamp(crane(tm, tm.int(60, 72)), pal, cx, surfaceAt(cv, cx) + 1, { roots: [6, 2] });
  const lk = tm.int(1, 2), lxx = right ? edges[lk] - 6 : edges[lk] + 6;
  cv.stamp(ladder(steps[lk + 1] - steps[lk] + 6, 0.05), pal, lxx, steps[lk + 1] + 1, {});
  const wx = right ? tm.int(40, 120) : tm.int(W - 120, W - 40);
  cv.stamp(wheel(tm, tm.int(10, 14), tm.int(30, 40)), pal, wx, surfaceAt(cv, wx) + 1, { roots: [8, 2] });
  for (let i = 0; i < 2; i++) {
    const xx = tm.int(60, W - 60);
    cv.stamp(scaffold(tm, tm.int(16, 26), tm.int(16, 30)), pal, xx, surfaceAt(cv, xx) + 1, { foot: [12, 2] });
  }
  for (let i = 0; i < 2; i++) { const xx = tm.int(30, W - 30); cv.stamp(crate(tm.int(8, 11)), pal, xx, surfaceAt(cv, xx) + 1, { foot: [6, 2] }); }
  // rails along the lowest bench and a cart on them
  const r0 = right ? 0 : edges[2], r1 = right ? edges[2] : W, ry = steps[3] - 1;
  for (let i = r0; i < r1; i++) { cv.set(i, ry, pal.metal[4]); if (i % 6 === 0) { cv.set(i, ry, pal.timber[1]); cv.set(i + 1, ry, pal.timber[1]); } }
  const tcx = Math.round((r0 + r1) / 2) + tm.int(-30, 30);
  cv.stamp(cart(tm, 24), pal, tcx, ry, { foot: [13, 2] });
  const br = s('rubble');
  for (let i = 0; i < 4; i++) { const xx = br.int(10, W - 10); cv.stamp(boulder(br, br.int(3, 6), br.int(2, 4)), pal, xx, surfaceAt(cv, xx) + 1, { foot: [5, 1] }); }
  // a lantern on its post, and torches on the shelves
  const lx = tm.int(40, W - 40), ly = surfaceAt(cv, lx) + 1;
  const lp = new Model();
  beam(lp, [0, 0], [0, -26], 2.4); beam(lp, [0, -26], [6, -26], 1.6);
  lp.poly([[4, -24], [8, -24], [8, -18], [4, -18]], 'seamC', { shade: 'flat', tone: 0.3 });
  cv.stamp(lp, pal, lx, ly, { foot: [3, 2] });
  glow(cv, lx + 6, ly - 21, 40, [1, 0.7, 0.3], 0.55);
  glow(cv, ax, ay, 20, [1, 0.6, 0.25], 0.35);
  const tr = s('torches');
  for (const [x0, y0] of ledgeTops(cv, 3, tr.int(0, 1e9), 8)) { torch(cv, x0, y0, tr.int(8, 12)); cv.block(x0 - 3, y0 - 14, x0 + 4, y0 + 1); }
  cv.meta.lantern = [lx + 6, ly - 21];
  cv.meta.trickles = drips(cv, ss, 5);
  cv.meta.vignette = 0.6;
  cv.meta.horizon = 100;
}
