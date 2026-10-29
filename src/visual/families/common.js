// Shared construction rules for the family modules: random streams, stems,
// leaves, sprouts, the bit of ground a plant stands in, host rocks and the
// alchemical markings laid over a part.
//
// Every family module exports the same five functions:
//   params(rng, d)        its morphology parameters (stored in the descriptor)
//   size(d)               its mature size on the ground, in scene pixels
//   plant(d, stage, o)    a Model of the living plant or deposit at a growth
//                         stage (0 sprout, 1 ripe, 2 mature), its foot at
//                         (0, 0) and growing up (negative y); o.closed for a
//                         dawn or dusk plant out of its hour
//   icon(d)               a close-up composition of the ingredient itself
//   piece(d, v)           one of four whole pieces poured into the cauldron

import { Rng, hashString } from '../../core/rng.js';
import { Model, blade, PROFILES, bezier, lumpy, ellipse, polygon } from '../geometry.js';

export { Model, PROFILES };

/** A random stream for one purpose, derived from the species' morphology seed. @param {any} d @param {string} label */
export const stream = (d, label) => new Rng((d.seeds.morph ^ hashString(label)) >>> 0);

/** Pick one of a list. */
export const pick = (rng, arr) => arr[Math.floor(rng.next() * arr.length)];

/** Leaf shapes and their profiles. */
export const LEAF_SHAPES = ['ovate', 'lance', 'round', 'heart', 'linear', 'spoon'];

/**
 * A leaf on a short petiole, folded along its midrib, with a vein line and
 * the species' teeth.
 * @param {Model} m @param {number} x @param {number} y @param {number} ang @param {number} len @param {number} wid
 * @param {{shape?:string, teeth?:number, mat?:string, tone?:number, vein?:boolean, curl?:number, asym?:number}} [o]
 */
export function leaf(m, x, y, ang, len, wid, o = {}) {
  if (len < 1) return m;
  const prof = PROFILES[o.shape || 'ovate'] || PROFILES.ovate;
  const pts = blade([x, y], ang, len, wid, prof, { teeth: len > 4 ? o.teeth || 0 : 0, curl: o.curl || 0, asym: o.asym || 0 });
  m.poly(pts, o.mat || 'leaf', { shade: 'fold', tone: o.tone || 0 });
  if (o.vein !== false && len >= 5) {
    const c = Math.cos(ang), s = Math.sin(ang);
    m.line([[x + c * len * 0.15, y + s * len * 0.15], [x + c * len * 0.75, y + s * len * 0.75]], o.mat || 'leaf', { lum: 0.72, tone: 0 });
  }
  return m;
}

/** A curved stem from the foot up to (tx, ty). Returns its points. */
export function stemPts(x0, y0, tx, ty, bend = 0) {
  const dx = tx - x0, dy = ty - y0;
  return bezier([x0, y0], [x0 + dx * 0.1 + dy * bend * 0.3, y0 + dy * 0.35], [tx - dx * 0.2 - dy * bend * 0.3, y0 + dy * 0.72], [tx, ty], 10);
}

/**
 * A sprout: a seed-leaf pair on a short stem and, once it has begun, a
 * first true leaf in the species' own shape.
 * @param {Model} m @param {any} d @param {number} h height @param {{shape?:string, teeth?:number, mat?:string, true?:boolean}} [o]
 */
export function sprout(m, d, h, o = {}) {
  const lean = (stream(d, 'sprout').next() - 0.5) * 0.6;
  const top = /** @type {[number, number]} */ ([lean * h, -h]);
  m.stroke(stemPts(0, 0, top[0], top[1], lean), [1.6, 1.2], 'stem', { noOutline: true });
  const cot = Math.max(2.5, h * 0.42);
  leaf(m, top[0], top[1] + 0.5, -Math.PI + 0.45, cot, cot * 0.42, { shape: 'spoon', vein: false, mat: o.mat || 'leaf', tone: 0.04 });
  leaf(m, top[0], top[1] + 0.5, -0.45, cot, cot * 0.42, { shape: 'spoon', vein: false, mat: o.mat || 'leaf' });
  if (o.true !== false) leaf(m, top[0], top[1], -Math.PI / 2 - lean * 0.5, cot * 0.9, cot * 0.4, { shape: o.shape, teeth: o.teeth, mat: o.mat || 'leaf', vein: false, tone: 0.06 });
  return m;
}

/** The ground a plant stands in: a low mound of its habitat's soil (moss and grit on top). */
export function mound(m, w, rng, mat = 'soil') {
  m.poly(lumpy(0, 0.2, w / 2, Math.max(1.4, w * 0.1), () => rng.next(), 0.2, 5), mat, { shade: 'round', noOutline: true, tex: 1.4, tone: -0.1 });
  return m;
}

/** A host rock: a lumpy, lit boulder. */
export function rock(m, cx, cy, rx, ry, rng, mat = 'rock', tone = 0) {
  m.poly(lumpy(cx, cy, rx, ry, () => rng.next(), 0.18, 6), mat, { shade: 'round', tone, tex: 1.3 });
  // a crack or two
  if (rx > 4) {
    const x = cx + (rng.next() - 0.5) * rx, y = cy - ry * 0.2;
    m.line([[x, y], [x + (rng.next() - 0.5) * 3, y + ry * 0.5], [x + (rng.next() - 0.5) * 4, y + ry * 0.8]], mat, { lum: 0.08 });
  }
  return m;
}

/**
 * The alchemical markings on a body part: poison spots, death's dark veins,
 * acid blotches, arcane glimmer, iridescent streaks, frost or ember rims.
 * Each is drawn only over what is already painted (clipped), centred on
 * (cx, cy) within radius r.
 * @param {Model} m @param {any} d @param {Rng} rng @param {number} cx @param {number} cy @param {number} rx @param {number} ry
 */
export function marks(m, d, rng, cx, cy, rx, ry) {
  const t = d.tr, area = rx * ry;
  const n = (k) => Math.max(0, Math.round(k));
  for (let i = 0; i < n(t.spots * area * 0.12 + (t.spots > 0.3 ? 1 : 0)); i++) {
    const x = cx + (rng.next() - 0.5) * rx * 1.6, y = cy + (rng.next() - 0.5) * ry * 1.6;
    m.dot(x, y, 'accent', { lum: 0.7 });
    if (rx > 6 && rng.next() < 0.5) m.dot(x + 1, y, 'accent', { lum: 0.45 });
  }
  for (let i = 0; i < n(t.droop * 3); i++) {
    let x = cx + (rng.next() - 0.5) * rx, y = cy + (rng.next() - 0.5) * ry;
    const pts = [[x, y]];
    for (let k = 0; k < 3; k++) { x += (rng.next() - 0.5) * rx * 0.5; y += (rng.next() - 0.3) * ry * 0.4; pts.push([x, y]); }
    m.line(/** @type {any} */ (pts), 'mark', { lum: 0.1 });
  }
  for (let i = 0; i < n(t.corrode * area * 0.06); i++) {
    const x = cx + (rng.next() - 0.5) * rx * 1.4, y = cy + (rng.next() - 0.5) * ry * 1.4;
    m.line([[x, y], [x + 1 + rng.next() * 2, y]], 'accent', { lum: 0.85 });
  }
  for (let i = 0; i < n(t.irid * (2 + area * 0.04)); i++) {
    // short oily sheens, not stripes across the whole body
    const x = cx + (rng.next() - 0.5) * rx * 1.2, y = cy + (rng.next() - 0.5) * ry * 1.2, L = 1 + Math.min(3, rx * 0.3);
    m.line([[x, y], [x + L, y - L * 0.4]], 'iris', { lum: 0.7 });
  }
  if (t.glow > 0.2) for (let i = 0; i < n(1 + t.glow * 3); i++) {
    const x = cx + (rng.next() - 0.5) * rx * 1.2, y = cy + (rng.next() - 0.5) * ry * 1.2;
    m.dot(x, y, 'glow', { lum: 0.95, glow: true });
  }
  return m;
}

/** A soft round glimmer spot list (where magic glints). */
export function glintAt(m, x, y) { m.glints.push([x, y]); return m; }

export { ellipse, blade, lumpy, bezier, polygon };
