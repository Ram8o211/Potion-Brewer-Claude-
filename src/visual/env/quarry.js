// Ironstone Quarry: a worked pit under a pale sky — terraced faces of cut
// rock stepping down to the floor, banded with strata and split by
// fractures, mineral seams of rust, quartz and sulphur showing in them;
// a timber crane, a ladder against the face, a cart on its track, crates,
// spoil heaps and rubble, and a lantern burning on its post.

import { sky, ridge, ground, shadeOf } from './paint.js';
import { palette, vary, streamOf, scaleAt, hazeAt, speckle, fbm2, hash2, noise2, mixPacked } from './kit.js';
import { boulder, cloud, crane, ladder, cart, crate, bush, beam } from './objects.js';
import { Model, lumpy } from '../geometry.js';
import { hex, pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'quarry', p);
  const pal = vary(palette({
    rock: ['#6e655c', { spread: 0.55 }], face: ['#7a6e62', { spread: 0.6, n: 7 }], face2: ['#6a6058', { spread: 0.6, n: 7 }], far: ['#a89c94', { spread: 0.3, n: 5 }],
    floor: ['#8a7458', { spread: 0.5, n: 7 }], timber: ['#7a5232', { spread: 0.5 }], rope: '#4a3a2a', ore: ['#5a4a46', { spread: 0.5 }], metal: '#5a5a62',
    cloud: ['#eef0f0', { spread: 0.3 }], leaf: ['#5a7a3a', { spread: 0.5 }], seamA: ['#b05a2a', { spread: 0.4, n: 4 }], seamB: ['#e8e4d0', { spread: 0.3, n: 4 }], seamC: ['#d8c040', { spread: 0.4, n: 4 }],
  }), s('pal'), 0.8);
  const haze = pack(hex('#d8d4cc'));
  sky(cv, 0, 70, ['#6a96c8', '#a8c4dc', '#e0dccc'], 10);
  const cr = s('clouds');
  for (let i = 0; i < 3; i++) cv.stamp(cloud(cr, cr.int(26, 50), cr.int(6, 10)), pal, cr.int(0, W), cr.int(10, 34), { outline: false, texture: 0.1 });
  ridge(cv, { base: 46, amp: 12, freq: 0.012, bottom: 80, ramp: pal.far, seed: s('far').int(0, 1e9), tex: 0.3, peaks: 0.3 });
  // the terraced faces: three benches, each a wall of cut blocks over a ledge
  const benches = [{ top: 44, bot: 76, ramp: pal.face2 }, { top: 66, bot: 100, ramp: pal.face }, { top: 88, bot: 124, ramp: pal.face }];
  const seams = [pal.seamA, pal.seamB, pal.seamC];
  const fs = s('faces').int(0, 1e9);
  const floorLine = new Float32Array(W);
  benches.forEach((b, k) => {
    const br = s('bench' + k);
    // the top edge of this bench, stepped where blocks were cut
    let x = 0;
    const tops = new Float32Array(W);
    while (x < W) { const w = br.int(14, 34), t = b.top + br.int(-5, 5); for (let i = x; i < Math.min(W, x + w); i++) tops[i] = t; x += w; }
    const hz = 0.22 * (2 - k);
    for (let x2 = 0; x2 < W; x2++) {
      const t0 = Math.round(tops[x2]);
      for (let y = t0; y < b.bot; y++) {
        const d = (y - t0) / Math.max(1, b.bot - t0);
        let l;
        if (y - t0 < 4) {
          // the ledge: a lit shelf of rubble on top of the bench
          l = 0.7 + (hash2(x2, y, fs + k) - 0.5) * 0.3;
        } else {
          // the face: strata, vertical drill marks, darker toward the shadowed foot
          const strata = noise2(x2 * 0.015, y * 0.28, fs + k) > 0.68 ? -0.14 : 0;
          const drill = hash2(Math.floor(x2 / 2), 0, fs + k * 7) > 0.93 && (y - t0) % 6 < 4 ? -0.22 : 0;
          const cut = tops[Math.max(0, x2 - 1)] > tops[x2] + 1 ? 0.18 : tops[Math.min(W - 1, x2 + 1)] > tops[x2] + 1 ? -0.3 : 0;
          l = 0.58 - d * 0.42 + strata + drill + cut + (fbm2(x2 * 0.05, y * 0.08, fs + 9 + k, 3) - 0.5) * 0.45;
          if (y - t0 === 4) l -= 0.3;
        }
        cv.set(x2, y, mixPacked(shadeOf(b.ramp, l, x2, y), haze, hz));
      }
    }
    // fractures running down the face
    for (let q = 0; q < 5; q++) {
      let fx = br.int(0, W), fy = b.top + br.int(5, 10);
      while (fy < b.bot - 2) {
        if (fy > tops[Math.max(0, Math.min(W - 1, fx))] + 4) { cv.set(fx, fy, b.ramp[0]); cv.set(fx + 1, fy, b.ramp[3]); }
        fy++; if (br.next() < 0.35) fx += br.next() < 0.5 ? 1 : -1;
      }
    }
    // mineral seams: broken bands of rust, quartz and sulphur, glinting
    for (let q = 0; q < 2; q++) {
      const R = seams[br.int(0, 2)], y0 = br.int(b.top + 8, b.bot - 5), ph = br.next() * 10, x0 = br.int(0, W / 2), len = br.int(80, 220);
      for (let x2 = x0; x2 < Math.min(W, x0 + len); x2++) {
        const th = 1 + Math.round(noise2(x2 * 0.08, q, fs + 3) * 2.2);
        if (noise2(x2 * 0.06, q + 5, fs + 4) < 0.3) continue;
        const y = Math.round(y0 + Math.sin(x2 * 0.04 + ph) * 3);
        for (let j = 0; j < th; j++) {
          if (y + j <= tops[x2] + 4 || y + j >= b.bot - 1) continue;
          cv.set(x2, y + j, R[j === 0 ? 3 : j === th - 1 ? 0 : 1 + (hash2(x2, y + j, fs) > 0.8 ? 2 : 0)]);
        }
      }
    }
    if (k === 2) for (let i = 0; i < W; i++) floorLine[i] = b.bot + (fbm2(i * 0.05, 0, fs, 2) - 0.5) * 6;
  });
  // the pit floor: dust and gravel, pebbles and rubble
  const gs = s('floor').int(0, 1e9);
  ground(cv, floorLine, (x, y, depth, n) => {
    const sc = depth > 0.55 ? 2 : 1, gx = Math.floor(x / sc), gy = Math.floor(y / sc), gravel = hash2(gx, gy, gs), above = hash2(gx, gy - 1, gs);
    // pebbles: a lit top and a shadow under each
    const peb = gravel > 0.9 ? 0.28 : above > 0.9 ? -0.3 : gravel < 0.06 ? -0.2 : 0;
    const wheel = fbm2(x * 0.012, y * 0.04, gs + 5, 2);
    return shadeOf(pal.floor, 0.24 + n * 0.4 + peb + (wheel - 0.5) * 0.5 - (1 - depth) * 0.04, x, y);
  }, gs);
  // the cart track: two rails converging toward the face
  const tr = s('track'), tx0 = tr.int(60, 320), tx1 = tr.int(120, 260);
  for (let y = Math.round(floorLine[tx1]) + 2; y < H; y++) {
    const t = (y - floorLine[tx1]) / (H - floorLine[tx1]), c = tx1 + (tx0 - tx1) * t, g = 3 + t * 14;
    for (const sd of [-1, 1]) { const x = Math.round(c + sd * g); cv.set(x, y, pal.metal[4]); cv.set(x + 1, y, pal.metal[1]); }
    if (y % Math.max(2, Math.round(2 + t * 6)) === 0) for (let x = Math.round(c - g - 1); x <= c + g + 1; x++) cv.set(x, y, pal.timber[1]);
  }
  // spoil heaps and rubble
  const sr = s('spoil');
  for (let i = 0; i < 2; i++) {
    const m = new Model(), w = sr.int(30, 50), x = sr.int(0, W), y = sr.int(140, 200);
    m.poly(lumpy(0, -w * 0.18, w / 2, w * 0.22, () => sr.next(), 0.15, 7), 'floor', { shade: 'round', tex: 2 });
    cv.stamp(m, pal, x, y, { foot: [w / 2, 4] });
  }
  for (let i = 0; i < 9; i++) { const y = sr.int(128, H - 3), k = scaleAt(y, 124, H); cv.stamp(boulder(sr, 3 + k * 7, 2 + k * 4), pal, sr.int(0, W), y, { foot: [4 + k * 6, 2 + k * 2] }); }
  // timber: the crane, a ladder against the face, a scaffold, the cart and crates
  const tm = s('timber');
  const cx = tm.next() < 0.5 ? tm.int(280, 350) : tm.int(30, 100);
  cv.stamp(crane(tm, tm.int(80, 100)), pal, cx, tm.int(130, 140), { foot: [6, 3] });
  cv.stamp(ladder(tm.int(34, 44)), pal, tm.int(100, 280), floorLine[150] + 1, {});
  const scaf = new Model(), sx = tm.int(150, 250);
  for (const dx of [0, 16]) beam(scaf, [dx, 0], [dx, -40], 2.2);
  for (let y = -10; y > -40; y -= 10) beam(scaf, [-2, y], [18, y], 1.8);
  cv.stamp(scaf, pal, sx, Math.round(floorLine[sx]) + 2, { foot: [10, 2] });
  const tc = Math.round(tx0 + (tx1 - tx0) * 0.35), ty = Math.round(floorLine[tx1] + (H - floorLine[tx1]) * 0.65);
  cv.stamp(cart(tm, 26), pal, tc, ty, { foot: [14, 4] });
  for (let i = 0; i < 3; i++) cv.stamp(crate(tm.int(8, 11)), pal, tm.int(20, 360), tm.int(132, 160), { foot: [6, 3] });
  // a lantern on its post, glowing
  const lx = tm.int(20, 360), ly = tm.int(130, 150);
  const lp = new Model();
  beam(lp, [0, 0], [0, -26], 2.4); beam(lp, [0, -26], [6, -26], 1.6);
  lp.poly([[4, -24], [8, -24], [8, -18], [4, -18]], 'seamC', { shade: 'flat', tone: 0.3 });
  cv.stamp(lp, pal, lx, ly, { foot: [3, 2] });
  cv.light([1, 0.75, 0.35], (x, y) => Math.max(0, 0.35 - Math.hypot(x - lx - 6, y - ly + 21) / 40), ly - 60, ly + 20);
  cv.meta.lantern = [lx + 6, ly - 21];
  // a few hardy shrubs in the corners
  const br = s('shrubs');
  for (let i = 0; i < 3; i++) { const y = br.int(128, H - 4); cv.stamp(bush(br, 6 + scaleAt(y, 124, H) * 6, 4 + scaleAt(y, 124, H) * 3), pal, br.next() < 0.5 ? br.int(0, 50) : br.int(330, W), y, { foot: [7, 3] }); }
  speckle(cv, s('glitter'), 120, 126, H, [pack(hex('#fff4d0')), pack(hex('#bfefff'))], { onOpen: true });
  cv.meta.horizon = 124;
}
