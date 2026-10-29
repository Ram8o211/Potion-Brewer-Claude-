// Leaves and herb clusters (leaf, sprig).
//
// Grammar: a low rosette of broad leaves (silverleaf kinds), an upright stem
// with opposite or alternate leaf pairs (nettles), or a branching bush with
// small hanging bells or berries (nightshades). Leaf outline, teeth, vein
// colour, phyllotaxis and branching vary per world.

import { Model, stream, pick, leaf, stemPts, sprout, mound, marks, LEAF_SHAPES, ellipse } from './common.js';

export function params(rng, d) {
  const t = d.tr;
  const habit = d.form === 'sprig' ? rng.weighted(['upright', 'opposite'], [1, 1.2]) : rng.weighted(['rosette', 'bush', 'upright'], [1.3, 1 + t.spots + t.droop, 0.6]);
  return {
    habit,
    leafShape: rng.weighted(LEAF_SHAPES, [1.2, 1 + t.sharp * 2, 1 + t.round * 2, 0.8, 0.4, 0.6]),
    teeth: d.form === 'sprig' ? rng.int(5, 9) : rng.next() < 0.4 ? rng.int(3, 6) : 0,
    leaves: rng.int(5, 8) + Math.round(t.lush * 3),
    pairs: rng.int(3, 5),
    curl: (rng.next() - 0.5) * 0.6,
    veinMark: t.droop > 0.3 || rng.next() < 0.3,
    fruit: habit === 'bush' ? pick(rng, ['bell', 'berry']) : null,
    broad: rng.range(0.32, 0.45) * (1 + t.round * 0.25) * (d.form === 'sprig' ? 0.85 : 1),
  };
}

export function size(d) {
  if (d.m.habit === 'rosette') return { w: 24, h: 14 };
  if (d.m.habit === 'bush') return { w: 22, h: 22 };
  return { w: 16, h: 26 };
}

/** A herb leaf with its vein marks. */
function hleaf(m, d, x, y, ang, len, rng, tone = 0) {
  const P = d.m;
  leaf(m, x, y, ang, len, len * P.broad, { shape: P.leafShape, teeth: P.teeth, curl: P.curl, tone, asym: d.tr.asym * 0.3 });
  if (P.veinMark && len > 6) {
    const c = Math.cos(ang), s = Math.sin(ang);
    for (const f of [0.35, 0.55]) for (const side of [-1, 1]) {
      const bx = x + c * len * f, by = y + s * len * f, a = ang + side * 0.8;
      m.line([[bx, by], [bx + Math.cos(a) * len * 0.22, by + Math.sin(a) * len * 0.22]], d.tr.droop > 0.3 ? 'mark' : 'leaf', { lum: d.tr.droop > 0.3 ? 0.15 : 0.7 });
    }
  }
  if (len > 5) marks(m, d, rng, x + Math.cos(ang) * len * 0.5, y + Math.sin(ang) * len * 0.5, len * 0.3, len * 0.2);
}

export function plant(d, stage, o = {}) {
  const m = new Model(), P = d.m, rng = stream(d, 'plant' + stage), H = d.size.h, W = d.size.w;
  mound(m, W * 0.6, stream(d, 'mound'));
  if (stage === 0) return sprout(m, d, Math.max(5, H * 0.32), { shape: P.leafShape, teeth: P.teeth });
  const g = stage === 1 ? 0.65 : 1;
  if (P.habit === 'rosette') {
    const n = Math.round(P.leaves * (stage === 1 ? 0.6 : 1));
    const items = [];
    for (let i = 0; i < n; i++) items.push(-Math.PI / 2 + ((i + 0.5) / n - 0.5) * 3.1 + (rng.next() - 0.5) * 0.25);
    // the outer, flatter leaves first
    items.sort((a, b) => Math.abs(b + Math.PI / 2) - Math.abs(a + Math.PI / 2));
    for (const a of items) hleaf(m, d, 0, -1, a, W * 0.48 * g * (0.75 + rng.next() * 0.3) * (Math.abs(a + Math.PI / 2) > 1 ? 1 : 0.8), rng, Math.abs(a + Math.PI / 2) > 1 ? -0.06 : 0.04);
    return m;
  }
  if (P.habit === 'bush') {
    for (let b = 0; b < 3; b++) {
      const tx = (b - 1) * W * 0.32 * g, ty = -H * g * (b === 1 ? 1 : 0.75);
      const pts = stemPts(0, 0, tx, ty, (b - 1) * 0.3);
      m.stroke(pts, [1.8 + d.tr.thick, 1], 'stem', { noOutline: true });
      for (let j = 3; j < pts.length; j += 2) hleaf(m, d, pts[j][0], pts[j][1], -Math.PI / 2 + (j % 4 ? 1 : -1) * (1 + rng.next() * 0.4) + (b - 1) * 0.3, H * 0.3 * g, rng, j % 4 ? -0.04 : 0.03);
      if (stage === 2) {
        const q = pts[pts.length - 2];
        if (P.fruit === 'berry') for (let k = 0; k < 3; k++) m.ellipse(q[0] + (k - 1) * 2, q[1] + 2 + (k % 2) * 2, 1.6, 1.6, 'main');
        else { m.poly(ellipse(q[0] + 1, q[1] + 3, 1.8, 2.4), 'main', {}); m.dot(q[0] + 1, q[1] + 5, 'main', { lum: 0.1 }); }
      }
    }
    return m;
  }
  // upright: a stem with pairs (or alternate leaves) shrinking to the top
  const top = -H * g, pts = stemPts(0, 0, (rng.next() - 0.5) * 3, top, 0.15);
  m.stroke(pts, [2 + d.tr.thick, 1.2], 'stem', { noOutline: true });
  const pairs = stage === 1 ? P.pairs - 1 : P.pairs;
  for (let j = 0; j < pairs; j++) {
    const q = pts[Math.min(pts.length - 1, 2 + Math.round((j / pairs) * (pts.length - 3)))];
    const len = H * 0.3 * g * (1 - j / (pairs + 2));
    for (const side of P.habit === 'opposite' ? [-1, 1] : [j % 2 ? 1 : -1]) hleaf(m, d, q[0], q[1], -Math.PI / 2 + side * (1.05 + d.tr.droop * 0.4), len, rng, side > 0 ? -0.05 : 0.03);
  }
  hleaf(m, d, pts[pts.length - 1][0], pts[pts.length - 1][1] + 1, -Math.PI / 2, H * 0.18 * g, rng, 0.06);
  return m;
}

export function icon(d) {
  const m = new Model(), P = d.m, rng = stream(d, 'icon');
  // a bunch of three broad leaves on a cut stub
  m.stroke([[0, 14], [0, 8]], 2.4, 'stem');
  hleaf(m, d, 0, 9, -Math.PI + 0.75, 17, rng, -0.05);
  hleaf(m, d, 0, 9, -0.75, 17, rng, -0.02);
  hleaf(m, d, 0, 9, -Math.PI / 2 + 0.05, 20, rng, 0.05);
  if (P.fruit === 'berry') for (let k = 0; k < 3; k++) m.ellipse(-4 + k * 3, 10 + (k % 2) * 2, 2.2, 2.2, 'main');
  else if (P.fruit === 'bell') { m.poly(ellipse(-5, 10, 2.5, 3.2), 'main', {}); m.dot(-5, 13, 'main', { lum: 0.1 }); }
  return m;
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  if (v === 0) hleaf(m, d, 0, 0, -0.6, 22, rng);
  else if (v === 1) { hleaf(m, d, 0, 4, -1.2, 18, rng); hleaf(m, d, 0, 4, -0.2, 16, rng, -0.05); }
  else if (v === 2) { m.stroke([[0, 8], [0, -8]], 2, 'stem'); hleaf(m, d, 0, 2, -2.4, 14, rng); hleaf(m, d, 0, -2, -0.7, 14, rng, -0.05); }
  else { hleaf(m, d, 0, 0, -2.0, 18, rng); hleaf(m, d, 1, 1, -0.9, 18, rng, -0.06); hleaf(m, d, 0, 0, -1.5, 14, rng, 0.06); }
  return m;
}
