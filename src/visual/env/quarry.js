// Ironstone Quarry, seen from the side: a pale sky over flat far cliffs,
// and in front the worked rock in cross-section — benches cut down in
// steps, banded with strata and run through with seams of rust, quartz and
// sulphur, under a skin of gravel; a mine adit framed in timber, a crane
// on the top bench, a ladder against a face, a cart on its rails, crates,
// and a lantern burning on its post.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { fillSolid, blob, ledges, paintTerrain, markOpen, surfaceAt, silhouette, glow, drips } from './side.js';
import { cloud, crane, ladder, cart, crate, beam, boulder } from './objects.js';
import { Model } from '../geometry.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'quarry', p);
  const pal = vary(palette({
    rock: ['#7a7068', { spread: 0.55 }], timber: ['#7a5232', { spread: 0.5 }], rope: '#4a3a2a', ore: ['#5a4a46', { spread: 0.5 }], metal: '#5a5a62',
    cloud: ['#eef0f0', { spread: 0.3 }], seamC: ['#e8c040', { spread: 0.4, n: 4 }],
  }), s('pal'), 0.8);
  sky(cv, 0, 140, ['#6a96c8', '#a8c4dc', '#e0dccc'], 8);
  const cr = s('clouds');
  for (let i = 0; i < 3; i++) cv.stamp(cloud(cr, cr.int(26, 50), cr.int(6, 10)), pal, cr.int(0, W), cr.int(10, 34), { outline: false });
  silhouette(cv, { base: 70, amp: 14, freq: 0.012, seed: s('far').int(0, 1e9), fill: '#b8aca0', rim: '#d4cabc', peaks: 0.3 });
  silhouette(cv, { base: 96, amp: 8, freq: 0.02, seed: s('far2').int(0, 1e9), fill: '#9a8e82', rim: '#b0a496', rough: 3 });
  // the benches: steps cut down from one side, each a level shelf over a sheer face
  const ts = s('terrain'), top = new Float32Array(W), right = ts.next() < 0.5;
  const steps = [ts.int(92, 104), ts.int(116, 126), ts.int(138, 148), ts.int(160, 172)];
  let x = 0;
  const edges = [];
  for (let k = 0; k < steps.length; k++) {
    const w = k === steps.length - 1 ? W - x : ts.int(64, 96);
    for (let i = x; i < Math.min(W, x + w); i++) top[right ? W - 1 - i : i] = steps[k] + (i - x < 2 ? -1 : 0);
    x += w;
    edges.push(right ? W - x : x);
  }
  fillSolid(cv, top);
  // rock shelves left jutting from the faces
  ledges(cv, top, ts, 6, { rise: [26, 34] });
  // a mine adit cut into one of the faces
  const ak = ts.int(0, 2), ax = right ? edges[ak] - 14 : edges[ak] + 14, ay = steps[ak + 1] - 8;
  blob(cv, ax, ay, 9, 7, ts.int(0, 1e9), 0, 0.1);
  for (let yy = ay; yy < steps[ak + 1]; yy++) for (let xx = ax - 9; xx <= ax + 9; xx++) if (cv.solid[yy * W + xx] && yy < steps[ak + 1] - 0) { cv.solid[yy * W + xx] = 0; cv.cave[yy * W + xx] = 1; }
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#8a7e70', b: '#7a6e62', grain: '#b0a494', dark: '#3e362e', deep: '#2a241e', cave: '#0c0a08',
    crust: ['#b8a688', '#9a8a6e'], crustH: 2, seed: ss, strata: true, blot: 0.05,
    seams: { cols: ['#c0602a', '#ece8d8', '#d8c040', '#7a9ab0'], n: 22 },
    rocks: { cols: ['#c4bcb0', '#9a9086', '#5a524a'], n: 18, r: 6 },
  });
  markOpen(cv);
  // the adit's timber frame
  const fm = new Model();
  beam(fm, [-9, 0], [-9, -15], 2.4); beam(fm, [9, 0], [9, -15], 2.4); beam(fm, [-11, -15], [11, -15], 2.6);
  cv.stamp(fm, pal, ax, steps[ak + 1], {});
  cv.meta.adit = [ax, ay];
  // timber: the crane on the top bench, a ladder up a face, crates, the cart on its rails
  const tm = s('timber');
  const cx = right ? tm.int(W - 50, W - 20) : tm.int(20, 50);
  cv.stamp(crane(tm, tm.int(70, 84)), pal, cx, surfaceAt(cv, cx) + 1, { roots: [6, 2] });
  const lk = tm.int(1, 2), lxx = right ? edges[lk] - 6 : edges[lk] + 6;
  cv.stamp(ladder(steps[lk + 1] - steps[lk] + 6, 0.05), pal, lxx, steps[lk + 1] + 1, {});
  for (let i = 0; i < 2; i++) { const xx = tm.int(30, W - 30); cv.stamp(crate(tm.int(8, 11)), pal, xx, surfaceAt(cv, xx) + 1, { foot: [6, 2] }); }
  // rails along the lowest bench and a cart on them
  const r0 = right ? 0 : edges[2], r1 = right ? edges[2] : W, ry = steps[3] - 1;
  for (let i = r0; i < r1; i++) { cv.set(i, ry, pal.metal[4]); if (i % 6 === 0) { cv.set(i, ry, pal.timber[1]); cv.set(i + 1, ry, pal.timber[1]); } }
  const tcx = Math.round((r0 + r1) / 2) + tm.int(-30, 30);
  cv.stamp(cart(tm, 24), pal, tcx, ry, { foot: [13, 2] });
  const br = s('rubble');
  for (let i = 0; i < 4; i++) { const xx = br.int(10, W - 10); cv.stamp(boulder(br, br.int(3, 6), br.int(2, 4)), pal, xx, surfaceAt(cv, xx) + 1, { foot: [5, 1] }); }
  // a lantern on its post, glowing
  const lx = tm.int(40, W - 40), ly = surfaceAt(cv, lx) + 1;
  const lp = new Model();
  beam(lp, [0, 0], [0, -26], 2.4); beam(lp, [0, -26], [6, -26], 1.6);
  lp.poly([[4, -24], [8, -24], [8, -18], [4, -18]], 'seamC', { shade: 'flat', tone: 0.3 });
  cv.stamp(lp, pal, lx, ly, { foot: [3, 2] });
  glow(cv, lx + 6, ly - 21, 34, [1, 0.75, 0.35], 0.45);
  glow(cv, ax, ay, 16, [1, 0.6, 0.25], 0.25);
  cv.meta.lantern = [lx + 6, ly - 21];
  cv.meta.trickles = drips(cv, ss, 5);
  cv.meta.horizon = 100;
}
