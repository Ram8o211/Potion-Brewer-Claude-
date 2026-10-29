// Roots and tubers (root).
//
// Grammar: a tapering body — a knotted taproot, a forked mandrake-like
// tuber with arms, or a gnarled rhizome — banded with skin rings, knots and
// hair-fine rootlets, under a tuft of leaves. On the ground its leafy crown
// shows with the shoulder of the root breaking the soil; the icon and the
// cauldron pieces show the root itself.

import { Model, stream, pick, leaf, sprout, mound, marks, LEAF_SHAPES, bezier } from './common.js';

export function params(rng, d) {
  const t = d.tr;
  return {
    kind: rng.weighted(['taproot', 'forked', 'rhizome'], [1, 1 + t.asym * 2, 0.8]),
    girth: rng.range(0.24, 0.36) * (1 + t.thick * 0.35),
    bend: (rng.next() - 0.5) * 0.7,
    knots: rng.int(2, 4),
    rings: rng.int(3, 6),
    rootlets: rng.int(3, 6),
    leafShape: rng.weighted(LEAF_SHAPES, [1, 1.2, 0.8, 0.6, 1, 0.8]),
    teeth: rng.next() < 0.4 ? rng.int(3, 6) : 0,
    tuft: rng.int(4, 7) + Math.round(t.lush * 2),
  };
}

export function size(d) { return { w: 22, h: 20 }; }

/**
 * The root itself, crown at (x, y), hanging down `len` (positive y).
 * @param {Model} m @param {any} d @param {any} rng @param {number} x @param {number} y @param {number} len @param {number} [ang] direction (radians, down = π/2)
 */
export function rootBody(m, d, rng, x, y, len, ang = Math.PI / 2) {
  const P = d.m, c = Math.cos(ang), s = Math.sin(ang), px = -s, py = c;
  const g = len * P.girth;
  const end = [x + c * len + px * P.bend * len * 0.4, y + s * len + py * P.bend * len * 0.4];
  const spine = bezier([x, y], [x + c * len * 0.35, y + s * len * 0.35], [x + c * len * 0.7 - px * P.bend * len * 0.3, y + s * len * 0.7 - py * P.bend * len * 0.3], /** @type {any} */ (end), 12);
  const widths = spine.map((_, i) => {
    const t = i / (spine.length - 1);
    return Math.max(0.8, g * (P.kind === 'rhizome' ? 0.8 + 0.25 * Math.sin(t * 9) : (1 - t * 0.85) * (t < 0.15 ? 0.85 + t : 1)));
  });
  // rootlets behind the body
  for (let i = 0; i < P.rootlets; i++) {
    const k = 3 + Math.floor((i / P.rootlets) * (spine.length - 4)), q = spine[k], side = i % 2 ? 1 : -1;
    const a = ang + side * (0.8 + rng.next() * 0.5), L = len * (0.18 + rng.next() * 0.15);
    m.stroke([[q[0], q[1]], [q[0] + Math.cos(a) * L * 0.6, q[1] + Math.sin(a) * L * 0.6 + 1], [q[0] + Math.cos(a) * L, q[1] + Math.sin(a) * L + 2]], [1.2, 0.6], 'main', { noOutline: true, tone: -0.15 });
  }
  if (P.kind === 'forked') {
    // two legs from the middle, and stubby arms
    const q = spine[6];
    for (const side of [-1, 1]) {
      const a = ang + side * 0.5;
      m.stroke([[q[0], q[1]], [q[0] + Math.cos(a) * len * 0.5, q[1] + Math.sin(a) * len * 0.5]], [g * 0.65, 1], 'main', { tone: side > 0 ? -0.05 : 0 });
    }
    const a2 = spine[3];
    for (const side of [-1, 1]) m.stroke([[a2[0], a2[1]], [a2[0] + px * side * g * 1.6, a2[1] + py * side * g * 1.6 + 1]], [g * 0.45, 0.9], 'main', { tone: -0.05 });
    m.stroke(spine.slice(0, 8), widths.slice(0, 8), 'main', {});
  } else m.stroke(spine, widths, 'main', {});
  // skin rings and knots
  for (let i = 0; i < P.rings; i++) {
    const k = 1 + Math.floor((i / P.rings) * (spine.length - 3)), q = spine[k], w = widths[k] * 0.45;
    m.line([[q[0] - px * w, q[1] - py * w], [q[0] + px * w * 0.8, q[1] + py * w * 0.8 + 0.6]], 'main', { lum: 0.15 });
  }
  for (let i = 0; i < P.knots; i++) {
    const q = spine[2 + Math.floor(rng.next() * (spine.length - 5))];
    m.dot(q[0] + (rng.next() - 0.5) * g * 0.6, q[1], 'main', { lum: 0.05 });
    m.dot(q[0] + (rng.next() - 0.5) * g * 0.6 - 1, q[1] - 1, 'main', { lum: 0.9 });
  }
  marks(m, d, rng, spine[4][0], spine[4][1], g * 0.4, len * 0.3);
  return spine;
}

/** The leafy crown. */
function tuft(m, d, rng, x, y, len, n) {
  const P = d.m;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + ((i + 0.5) / n - 0.5) * 2.2 + (rng.next() - 0.5) * 0.2;
    leaf(m, x, y, a + d.tr.droop * 0.4 * Math.sign(a + Math.PI / 2), len * (0.75 + rng.next() * 0.35), len * 0.28, { shape: P.leafShape, teeth: P.teeth, tone: i % 2 ? -0.05 : 0.03 });
  }
}

export function plant(d, stage, o = {}) {
  const m = new Model(), P = d.m, rng = stream(d, 'plant' + stage), H = d.size.h, W = d.size.w;
  if (stage === 0) { mound(m, W * 0.5, stream(d, 'mound')); return sprout(m, d, Math.max(4, H * 0.3), { shape: P.leafShape, teeth: P.teeth }); }
  const g = stage === 1 ? 0.7 : 1;
  mound(m, W * 0.85 * g, stream(d, 'mound'));
  tuft(m, d, rng, 0, -H * 0.22 * g, H * 0.6 * g, Math.round(P.tuft * g));
  // the shoulder of the root standing out of the soil, in its own colour, ringed like the root itself
  const rx = W * Math.max(0.24, P.girth) * g, ry = H * 0.34 * g;
  m.poly(ellipseTop(0, 0.5, rx, ry), 'main', { shade: 'round' });
  for (let k = 1; k <= 2; k++) m.line([[-rx * 0.7, -ry * k * 0.3], [rx * 0.6, -ry * k * 0.3 + 0.6]], 'main', { lum: 0.15 });
  return m;
}

/** The top half of an ellipse standing on y. */
function ellipseTop(cx, cy, rx, ry) {
  const out = [];
  for (let i = 0; i <= 12; i++) { const a = Math.PI + (i / 12) * Math.PI; out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return /** @type {[number, number][]} */ (out);
}

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  tuft(m, d, rng, -2, -14, 11, 3);
  rootBody(m, d, rng, -2, -14, 30, Math.PI / 2 - 0.1);
  return m.rotate(-0.5, 0, 0);
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  if (v === 3) { tuft(m, d, rng, 0, 4, 12, 3); rootBody(m, d, rng, 0, 4, 10); return m; }
  // root sections of different lengths, cut across
  const len = [22, 16, 12][v];
  const spine = rootBody(m, d, rng, 0, 0, len, Math.PI / 2 + (v - 1) * 0.5);
  m.ellipse(spine[0][0], spine[0][1], len * d.m.girth * 0.45, len * d.m.girth * 0.3, 'pale', { shade: 'flat' });
  return m;
}
