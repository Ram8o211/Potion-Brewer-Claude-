// Foliage after the pixel artist's recipe: a small set of simple leaf
// shapes, each one varied (turned, scaled, its outline nudged pixel by
// pixel, now and then cropped), coloured with a little jitter from a few
// of the region's leaf ramps, and laid together at slightly different
// offsets into clusters — a dark mass in shade, the leaves over it lit
// from the upper left, lit flecks, loose leaves at the fringe and the
// region's blossoms. Clusters at the tips of a gnarled tree's branches
// make its crown; strands of leaves (moss, willow fronds, blossoms) hang
// from their undersides.
//
// Every foliage part carries its sway for the wind (wild-scene.js): `sa`
// how far its group moves in a full gust, `sg` the group (a cluster, or a
// strand, moves as one) and `sh` how much further a hanging strand's tip
// swings than its top.

import { Model, bezier } from '../geometry.js';

/** @typedef {{mats?:string[], bloom?:{mat:string, rate:number}, hang?:{mat?:string, rate:number, len:[number, number], bloom?:string}}} Look */

/** Sway groups are told apart by number (only within one model). */
let groups = 0;
/** A new sway group. */
export const swayGroup = () => ++groups;

/** The base leaf shapes: an outline's radius at angle a (a round leaf, three lobes, a bean, a clover, a teardrop). */
const SHAPES = [
  (a) => 1 + 0.08 * Math.sin(a * 5),
  (a) => 0.8 + 0.28 * Math.abs(Math.cos(a * 1.5)),
  (a) => 0.85 + 0.2 * Math.cos(a * 2),
  (a) => 0.78 + 0.26 * Math.abs(Math.cos(a * 2)),
  (a) => 1 - 0.28 * Math.cos(a + Math.PI / 2),
];

/**
 * One leaf: a base shape turned, stretched and scaled, each point nudged,
 * and sometimes cropped flat along one side.
 * @param {() => number} rnd @param {number} x @param {number} y @param {number} r
 */
export function leaf(rnd, x, y, r) {
  const f = SHAPES[Math.floor(rnd() * SHAPES.length)], rot = rnd() * Math.PI * 2, sy = 0.7 + rnd() * 0.45, n = 10;
  const crop = rnd() < 0.2 ? 0.35 + rnd() * 0.4 : 2, ca = rnd() * Math.PI * 2, cx = Math.cos(ca), cy = Math.sin(ca);
  /** @type {[number, number][]} */
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, rr = r * f(a) * (1 + (rnd() - 0.5) * 0.25);
    let u = Math.cos(a) * rr, v = Math.sin(a) * rr * sy;
    // cropped: nothing beyond a line across the leaf
    const d = u * cx + v * cy - crop * r;
    if (d > 0) { u -= d * cx; v -= d * cy; }
    pts.push([x + u * Math.cos(rot) - v * Math.sin(rot), y + u * Math.sin(rot) + v * Math.cos(rot)]);
  }
  return pts;
}

/** A ragged oval (the shade inside a cluster). @param {number} x @param {number} y @param {number} rx @param {number} ry @param {() => number} rnd */
function oval(x, y, rx, ry, rnd) {
  const n = Math.max(10, Math.round((rx + ry) * 1.5)), ph = rnd() * 6;
  /** @type {[number, number][]} */
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, r = 1 + 0.12 * Math.sin(a * 3 + ph) + (rnd() - 0.5) * 0.16;
    pts.push([x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r]);
  }
  return pts;
}

/** @param {() => number} rnd @param {string[]} mats the first most often */
const pick = (rnd, mats) => (mats.length < 2 || rnd() < 0.6 ? mats[0] : mats[1 + Math.floor(rnd() * (mats.length - 1))]);

/**
 * A cluster of leaves round (x, y), rx × ry: a dark mass in shade, leaves
 * laid over it lower ones first, lit flecks on the upper leaves, loose
 * leaves round its fringe and blossoms dotted over it. Returns its sway group.
 * @param {Model} m @param {any} rng @param {number} x @param {number} y @param {number} rx @param {number} ry
 * @param {Look & {amp?:number, tone?:number, leaf?:number, dense?:number, flat?:boolean}} [o]
 */
export function cluster(m, rng, x, y, rx, ry, o = {}) {
  const rnd = () => rng.next(), mats = o.mats || ['leaf'], tone = o.tone ?? 0, sw = { sa: o.amp ?? 1, sg: swayGroup() };
  const lr = o.leaf ?? Math.max(1.4, Math.min(2.9, Math.min(rx, ry) * 0.34));
  m.poly(oval(x, y + ry * 0.12, rx * 0.74, ry * (o.flat ? 0.62 : 0.72), rnd), mats[0], { shade: 'flat', tex: 1.2, tone: tone - 0.26, ...sw });
  const n = Math.max(3, Math.round(((rx * ry) / (lr * lr)) * 1.25 * (o.dense ?? 1)));
  /** @type {[number, number][]} */
  const at = [];
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, q = Math.sqrt(rnd());
    let ly = y + Math.sin(a) * ry * q * 0.9 - ry * 0.05;
    // a flat underside
    if (o.flat) ly = Math.min(ly, y + ry * 0.35);
    at.push([x + Math.cos(a) * rx * q * 0.92, ly]);
  }
  at.sort((p, q) => q[1] - p[1]);
  for (const [lx, ly] of at) {
    const up = (y - ly) / ry, left = (x - lx) / rx, mat = pick(rnd, mats);
    m.poly(leaf(rnd, lx, ly, lr * (0.7 + rnd() * 0.6)), mat, { shade: 'round', soft: true, tex: 0.8, tone: tone - 0.06 + up * 0.17 + left * 0.06 + (rnd() - 0.5) * 0.14, ...sw });
    if (up > 0.05 && rnd() < 0.4) m.dot(lx - lr * 0.3, ly - lr * 0.35, mat, { lum: 0.78 + rnd() * 0.17, ...sw });
  }
  // loose leaves at the fringe
  for (let i = 0; i < n * 0.45; i++) {
    const a = rnd() * Math.PI * 2, q = 0.92 + rnd() * 0.22;
    m.dot(x + Math.cos(a) * rx * q, y + Math.sin(a) * ry * q * (o.flat && Math.sin(a) > 0 ? 0.6 : 1), pick(rnd, mats), { clip: false, lum: 0.3 + rnd() * 0.35, ...sw });
  }
  if (o.bloom) for (let i = 0; i < n * o.bloom.rate; i++) {
    const a = rnd() * Math.PI * 2, q = Math.sqrt(rnd()) * 0.85, bx = x + Math.cos(a) * rx * q, by = y + Math.sin(a) * ry * q * 0.85 - ry * 0.1;
    m.dot(bx, by, o.bloom.mat, { clip: false, lum: 0.62 + rnd() * 0.33, ...sw });
    if (rnd() < 0.35) m.dot(bx + 1, by, o.bloom.mat, { clip: false, lum: 0.5, ...sw });
  }
  return sw.sg;
}

/**
 * A strand of leaves hanging from (x, y), `len` long: a thin stem waving a
 * little as it falls, small leaves along it on alternate sides, and with
 * `bloom` a drooping head of blossoms at its end (wisteria).
 * @param {Model} m @param {any} rng @param {number} x @param {number} y @param {number} len
 * @param {{mat?:string, amp?:number, bloom?:string, leaves?:number, tone?:number}} [o]
 */
export function strand(m, rng, x, y, len, o = {}) {
  const rnd = () => rng.next(), mat = o.mat || 'leaf', sw = { sa: o.amp ?? 1, sh: 1.2 + len * 0.07, sg: swayGroup() };
  const ph = rnd() * 6, wv = 0.4 + rnd() * 0.6, tone = o.tone ?? 0;
  /** @type {[number, number][]} */
  const pts = [];
  for (let k = 0; k <= Math.ceil(len / 3); k++) { const t = Math.min(1, (k * 3) / len); pts.push([x + Math.sin(ph + t * 4) * wv * t, y + t * len]); }
  m.stroke(pts, [1.3, 1], mat, { tone: tone - 0.12, noOutline: true, tex: 0.5, ...sw });
  const step = o.leaves ?? 2.2;
  for (let d = 1.5, s = rnd() < 0.5 ? -1 : 1; d < len - (o.bloom ? len * 0.35 : 0); d += step + rnd(), s = -s) {
    const t = d / len, lx = x + Math.sin(ph + t * 4) * wv * t + s * 0.9, ly = y + d;
    m.poly(leaf(rnd, lx, ly, 0.9 + rnd() * 0.6 * (1 - t * 0.5)), mat, { shade: 'round', soft: true, noOutline: true, tex: 0.6, tone: tone + 0.02 - t * 0.14 + (rnd() - 0.5) * 0.1, ...sw });
  }
  if (o.bloom) {
    // a head of blossoms tapering down to the strand's end
    const b0 = len * 0.6;
    for (let d = b0; d <= len + 1; d += 1) {
      const t = (d - b0) / Math.max(1, len + 1 - b0), w = 1.6 * (1 - t) + 0.4, cx = x + Math.sin(ph + (d / len) * 4) * wv * (d / len);
      for (let i = -Math.round(w); i <= Math.round(w); i++) if (rnd() < 0.8) m.dot(cx + i, y + d, o.bloom, { clip: false, lum: 0.5 + rnd() * 0.4 - t * 0.12, ...sw });
    }
  }
  return sw.sg;
}

/**
 * A gnarled tree: a sinuous trunk twisting up off its foot, branches
 * forking from its upper half, a crown of leaf clusters at their tips and
 * strands hanging below them. style: 'dome' (a broad crown of many
 * clusters), 'tiers' (flat layered clusters on long level branches),
 * 'weep' (a willow: a crown hung all round with long fronds), 'wisteria'
 * (drooping heads of blossom among the clusters), 'sparse' (a few small
 * clusters with the sky showing through: a dusty, wind-bitten tree).
 * The clusters sway more the higher they are.
 * @param {any} rng @param {number} h @param {number} tw
 * @param {Look & {style?:string, dir?:number, bark?:string}} [o]
 */
export function grove(rng, h, tw, o = {}) {
  const m = new Model(), rnd = () => rng.next(), bark = o.bark || 'bark', style = o.style || 'dome';
  const dir = o.dir ?? (rnd() < 0.5 ? -1 : 1), mats = o.mats || ['leaf'];
  const th = h * (style === 'weep' ? 0.62 : style === 'tiers' ? 0.66 : style === 'sparse' ? 0.7 : 0.6);
  // the trunk: an S off its foot, twisting back over it
  const sw1 = (0.1 + rnd() * 0.1) * h, sw2 = (0.06 + rnd() * 0.1) * h;
  const spine = bezier([0, 0], [dir * sw1, -th * 0.35], [-dir * sw2, -th * 0.7], [dir * (rnd() - 0.3) * h * 0.12, -th], 14);
  const ws = spine.map((_, i) => Math.max(1.2, tw * (1 - (i / (spine.length - 1)) * 0.55) * (i === 0 ? 1.25 : 1)));
  for (const s of [-1, 1]) m.stroke([[s * tw * 0.2, -tw * 0.7], [s * tw * 0.9, -1], [s * tw * 1.7, 1]], [tw * 0.45, tw * 0.25, 1.2], bark, { tone: s > 0 ? -0.08 : 0 });
  m.stroke(spine, ws, bark, { tex: 0.8 });
  m.line(/** @type {any} */ (spine.slice(1, -2).map((q, i) => [q[0] - ws[i + 1] * 0.25, q[1]])), bark, { lum: 0.78 });
  m.line(/** @type {any} */ (spine.slice(2, -3).map((q, i) => [q[0] + ws[i + 2] * 0.3, q[1]])), bark, { lum: 0.14 });
  /** @type {[number, number, number, number][]} clusters: x, y, rx, ry */
  const tops = [];
  const nb = style === 'sparse' ? 2 + Math.round(rnd()) : style === 'tiers' ? 3 + Math.round(rnd()) : 3 + Math.round(rnd() * 2);
  for (let b = 0; b < nb; b++) {
    const t = 0.5 + (b / Math.max(1, nb - 1)) * 0.42, i = Math.min(spine.length - 2, Math.round(t * (spine.length - 1))), [sx, sy] = spine[i];
    const side = (b % 2 ? 1 : -1) * dir, L = h * (style === 'tiers' ? 0.26 + rnd() * 0.14 : style === 'sparse' ? 0.2 + rnd() * 0.1 : 0.2 + rnd() * 0.14);
    const a = style === 'tiers' ? 0.12 + rnd() * 0.25 : 0.35 + rnd() * 0.5, ex = sx + side * L * Math.cos(a), ey = sy - L * Math.sin(a);
    // a kinked limb: out, a dip, then up to its tip
    m.stroke([[sx, sy], [sx + side * L * 0.4, sy - L * 0.08 + (rnd() - 0.3) * L * 0.2], [ex, ey]], [ws[i] * 0.6, Math.max(1, ws[i] * 0.3)], bark, { tex: 0.6 });
    const r = h * (style === 'sparse' ? 0.1 + rnd() * 0.04 : style === 'tiers' ? 0.13 + rnd() * 0.04 : 0.12 + rnd() * 0.05);
    tops.push([ex, ey - r * 0.2, r * (style === 'tiers' ? 1.3 : 1), r * (style === 'tiers' ? 0.5 : 0.72)]);
    if (L > h * 0.24 && style !== 'sparse') {
      // a long limb forks once, rising
      const fx = sx + side * L * 0.55, fy = sy - L * 0.25, gx = fx + side * L * 0.18, gy = fy - L * 0.45;
      m.stroke([[fx, fy], [gx, gy]], [Math.max(1, ws[i] * 0.32), 1], bark, {});
      tops.push([gx, gy - r * 0.2, r * 0.75, r * 0.55]);
    }
  }
  const top = spine[spine.length - 1], tr = h * (style === 'sparse' ? 0.12 : style === 'tiers' ? 0.15 : 0.17 + rnd() * 0.04);
  tops.push([top[0], top[1] - tr * 0.3, tr * (style === 'tiers' ? 1.3 : 1.1), tr * (style === 'tiers' ? 0.55 : 0.75)]);
  if (style === 'dome' || style === 'weep' || style === 'wisteria') {
    // filling out the crown between the tips
    const xs = tops.map((q) => q[0]), ys = tops.map((q) => q[1]), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const cw = (Math.max(...xs) - Math.min(...xs)) / 2 + 1, ch = (Math.max(...ys) - Math.min(...ys)) / 2 + 1;
    for (let i = 0; i < 2 + Math.round(rnd() * 2); i++) {
      const a = rnd() * Math.PI * 2, q = Math.sqrt(rnd()) * 0.8;
      tops.push([cx + Math.cos(a) * cw * q, cy + Math.sin(a) * ch * q, h * (0.1 + rnd() * 0.05), h * (0.08 + rnd() * 0.03)]);
    }
  }
  // the sway of a cluster at height y: the higher, the more
  const amp = (/** @type {number} */ y) => 0.7 + Math.min(1, -y / h) * 0.5;
  // strands hanging from the clusters' undersides, behind them
  const hang = o.hang || (style === 'weep' ? { rate: 1, len: /** @type {[number, number]} */ ([h * 0.12, h * 0.4]) } : style === 'wisteria' ? { rate: 0.8, len: /** @type {[number, number]} */ ([6, 18]) } : null);
  if (hang) for (const [x, y, rx, ry] of tops) {
    const n = Math.round(rx * 0.7 * hang.rate);
    for (let i = 0; i < n; i++) {
      // in bunches: a few strands side by side, then a gap
      const u = style === 'weep' ? (Math.floor(rnd() * 4) / 3 - 0.5) * 1.5 + (rnd() - 0.5) * 0.3 : (rnd() - 0.5) * 1.7;
      const sx = x + u * rx, sy = y + ry * (0.3 + rnd() * 0.4), L = hang.len[0] + rnd() * (hang.len[1] - hang.len[0]);
      const bloom = style === 'wisteria' && o.bloom && rnd() < 0.7 ? o.bloom.mat : hang.bloom;
      strand(m, rng, sx, sy, L, { mat: hang.mat || mats[0], amp: amp(y), bloom, tone: style === 'weep' ? 0.04 : -0.04 });
    }
  }
  tops.sort((p, q) => q[1] - p[1]);
  const bloom = style === 'wisteria' ? undefined : o.bloom;
  for (const [x, y, rx, ry] of tops) cluster(m, rng, x, y, rx, ry, { mats, bloom, amp: amp(y), flat: style === 'tiers', dense: style === 'sparse' ? 0.7 : 1 });
  return m;
}
