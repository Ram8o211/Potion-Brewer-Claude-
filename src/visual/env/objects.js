// Scenery models for the wild environments: trees of several growth habits,
// shrubs, boulders, reeds, ferns, logs, clouds and the quarry's timberwork.
// Each is a geometry Model (visual/geometry.js) standing on its foot at
// (0, 0), built from a random stream and painted in the region's ramps by
// Canvas.stamp — the same rasterizer and shading as the species.

import { Model, blade, PROFILES, bezier, lumpy, ellipse, polygon } from '../geometry.js';

/** @param {any} rng */
const R = (rng) => () => rng.next();

/**
 * A block of leaves: a rectangle with its corners cut in a step, its sides
 * nudged in and out a little (the crown is built of these, not of discs).
 * @param {number} x @param {number} y @param {number} hw @param {number} hh @param {() => number} rnd
 */
export function leafBlock(x, y, hw, hh, rnd) {
  const c = Math.max(1, Math.round(Math.min(hw, hh) * 0.4)), j = () => Math.round((rnd() - 0.5) * 2);
  const x0 = Math.round(x - hw) + j(), x1 = Math.round(x + hw) + j(), y0 = Math.round(y - hh) + j(), y1 = Math.round(y + hh) + j();
  return /** @type {import('../geometry.js').Pt[]} */ ([
    [x0 + c, y0], [x1 - c, y0], [x1 - c, y0 + c], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1 - c], [x1 - c, y1],
    [x0 + c, y1], [x0 + c, y1 - c], [x0, y1 - c], [x0, y0 + c], [x0 + c, y0 + c],
  ]);
}

/**
 * A crown of foliage built of blocks: dark inner masses, mid blocks, lit
 * blocks toward the upper left and a ragged rim of small square tufts.
 */
export function crown(m, rng, cx, cy, rx, ry, mat = 'leaf', o = {}) {
  const n = o.n ?? Math.max(5, Math.round((rx + ry) / 3.5)), rnd = R(rng);
  const blobs = [];
  for (let i = 0; i < n; i++) {
    const a = rng.next() * Math.PI * 2, q = Math.sqrt(rng.next());
    blobs.push([cx + Math.cos(a) * rx * 0.62 * q, cy + Math.sin(a) * ry * 0.55 * q, (0.38 + rng.next() * 0.25) * Math.min(rx, ry * 1.4)]);
  }
  // smaller blocks heaped on the outside of the crown, so its edge steps in leafy squares
  for (let i = 0; i < n * 2; i++) {
    const a = rng.next() * Math.PI * 2, q = 0.75 + rng.next() * 0.3;
    blobs.push([cx + Math.cos(a) * rx * 0.8 * q, cy + Math.sin(a) * ry * 0.72 * q, (0.16 + rng.next() * 0.12) * Math.min(rx, ry * 1.4)]);
  }
  // back to front: the lower, darker blocks behind the lit upper ones
  blobs.sort((p, q) => q[1] - p[1] + (q[0] - p[0]) * 0.2);
  // the crown is lit as one mass (upper left bright, underside in shade), each block only a little rounded
  for (const [x, y, r] of blobs) m.poly(leafBlock(x, y, r * (0.95 + rng.next() * 0.25), r * (0.7 + rng.next() * 0.2), rnd), mat, { shade: 'round', tex: 1.8, tone: ((cy - y) / ry) * 0.28 + ((cx - x) / rx) * 0.1 - 0.08 });
  // square tufts of leaves breaking the rim
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (0.9 + rng.next() * 1.2), t = 1.5 + rng.next() * 1.5;
    const x = cx + Math.cos(a) * rx * 0.85, y = cy + Math.sin(a) * ry * 0.8;
    m.poly([[x - t, y - t], [x + t, y - t], [x + t, y + t], [x - t, y + t]], mat, { shade: 'flat', tex: 1.2, tone: Math.sin(a) < 0 ? 0.1 : -0.12 });
  }
  // shadowed hollows between blocks
  for (let i = 0; i < n; i++) {
    const x = cx + (rng.next() - 0.5) * rx * 1.2, y = cy + rng.next() * ry * 0.5;
    m.dot(x, y, mat, { lum: 0.05 }); m.dot(x + 1, y, mat, { lum: 0.12 });
  }
  // leaf clumps catching the light on the upper left
  for (let i = 0; i < n * 2; i++) {
    const a = Math.PI + rng.next() * Math.PI * 0.9, q = 0.3 + rng.next() * 0.6;
    const x = cx + Math.cos(a) * rx * q * 0.8 - rx * 0.1, y = cy + Math.sin(a) * ry * q * 0.7;
    m.dot(x, y, mat, { lum: 0.92 });
    if (i % 2) m.dot(x + 1, y, mat, { lum: 0.8 });
  }
  return m;
}

/**
 * A tree. kind: oak (broad crown), pine (tiers), willow (weeping fronds),
 * birch (pale, slender), dead (bare branches). Height h, trunk width tw.
 */
export function tree(rng, kind, h, tw, o = {}) {
  const m = new Model(), lean = (o.lean ?? (rng.next() - 0.5) * 0.15) * h;
  const trunkTop = kind === 'pine' ? h * 0.95 : kind === 'willow' ? h * 0.6 : kind === 'dead' ? h * 0.75 : h * 0.55;
  const spine = bezier([0, 0], [0, -trunkTop * 0.4], [lean * 0.6, -trunkTop * 0.75], [lean, -trunkTop], 12);
  const ws = spine.map((_, i) => tw * (1 - (i / spine.length) * (kind === 'pine' ? 0.8 : 0.45)) * (i === 0 ? 1.25 : 1));
  // root flares
  for (const s of [-1, 1]) m.stroke([[s * tw * 0.2, -tw * 0.6], [s * tw * 0.9, -1], [s * tw * 1.5, 1]], [tw * 0.45, tw * 0.25, 1.2], o.bark || 'bark', { tone: s > 0 ? -0.08 : 0 });
  m.stroke(spine, ws, o.bark || 'bark', { tex: 1.5 });
  // bark fissures
  for (let k = 0; k < Math.max(1, Math.round(tw / 3)); k++) {
    const f = (k + 0.5) / Math.max(1, Math.round(tw / 3)) - 0.5, pts = [];
    for (let i = 1; i < spine.length - 1; i += 1) pts.push([spine[i][0] + f * ws[i] * 0.7 + (rng.next() - 0.5) * 0.8, spine[i][1]]);
    m.line(/** @type {any} */ (pts), o.bark || 'bark', { lum: 0.12 });
  }
  const top = spine[spine.length - 1];
  if (kind === 'dead') {
    branch(m, rng, top[0], top[1], -Math.PI / 2, h * 0.3, tw * 0.6, 3, o.bark || 'bark');
    branch(m, rng, spine[6][0], spine[6][1], -Math.PI / 2 - 0.9, h * 0.25, tw * 0.45, 2, o.bark || 'bark');
    branch(m, rng, spine[8][0], spine[8][1], -Math.PI / 2 + 0.8, h * 0.22, tw * 0.4, 2, o.bark || 'bark');
    return m;
  }
  if (kind === 'pine') {
    const tiers = Math.max(4, Math.round(h / 9));
    for (let i = 0; i < tiers; i++) {
      const t = i / (tiers - 1), y = -h * 0.28 - t * h * 0.7, w = h * 0.3 * (1 - t * 0.85) + 2;
      const pts = [[lean * (0.3 + t * 0.7) - w, y + h * 0.06], [lean * (0.3 + t * 0.7), y - h * 0.12], [lean * (0.3 + t * 0.7) + w, y + h * 0.06]];
      // a jagged lower edge
      for (let k = 5; k >= 1; k--) pts.push([lean * (0.3 + t * 0.7) - w + (k / 6) * w * 2, y + h * 0.06 - (k % 2) * h * 0.025]);
      m.poly(/** @type {any} */ (pts), o.leaf || 'leaf', { shade: 'fold', tex: 1.4, tone: -0.04 + t * 0.06 });
    }
    return m;
  }
  // limbs reaching into the crown
  const cw = kind === 'birch' ? h * 0.28 : kind === 'willow' ? h * 0.42 : h * 0.45;
  for (const s of [-1, 1]) m.stroke([[top[0], top[1] + 3], [top[0] + s * cw * 0.35, top[1] - h * 0.08], [top[0] + s * cw * 0.6, top[1] - h * 0.18]], [tw * 0.5, tw * 0.25], o.bark || 'bark', {});
  const cy = top[1] - h * (kind === 'willow' ? 0.12 : 0.2);
  crown(m, rng, top[0], kind === 'willow' ? cy - h * 0.06 : cy, kind === 'willow' ? cw * 0.75 : cw, h * (kind === 'birch' ? 0.32 : kind === 'willow' ? 0.17 : 0.26), o.leaf || 'leaf');
  if (kind === 'oak') { crown(m, rng, top[0] - cw * 0.5, cy + h * 0.06, cw * 0.55, h * 0.16, o.leaf || 'leaf'); crown(m, rng, top[0] + cw * 0.55, cy + h * 0.08, cw * 0.5, h * 0.15, o.leaf || 'leaf'); }
  if (kind === 'willow') {
    // fronds weeping from the crown: leafy curtains, darker toward their tips
    for (let i = 0; i < Math.round(cw * 0.9); i++) {
      const x0 = top[0] + (rng.next() - 0.5) * cw * 1.8, y0 = cy + (rng.next() - 0.2) * h * 0.12, len = h * (0.18 + rng.next() * 0.28);
      const pts = [];
      for (let k = 0; k <= 6; k++) pts.push([x0 + Math.sin(k * 0.6 + i) * 0.7 + (x0 - top[0]) * k * 0.025, y0 + (k / 6) * len]);
      m.stroke(/** @type {any} */ (pts), [3.2, 2.2, 1.2], o.leaf || 'leaf', { tone: -0.12 + (i % 3) * 0.08, tex: 2 });
    }
  }
  if (kind === 'birch') for (let i = 2; i < spine.length - 1; i += 2) m.line([[spine[i][0] - ws[i] * 0.4, spine[i][1]], [spine[i][0] + ws[i] * 0.1, spine[i][1]]], o.bark || 'bark', { lum: 0.08 });
  return m;
}

/** A forking bare branch. */
export function branch(m, rng, x, y, ang, len, w, depth, mat) {
  const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
  m.stroke([[x, y], [(x + ex) / 2 + (rng.next() - 0.5) * len * 0.2, (y + ey) / 2], [ex, ey]], [w, w * 0.6], mat, { noOutline: w < 2.5 });
  if (depth > 0) for (const s of [-1, 1]) branch(m, rng, ex, ey, ang + s * (0.35 + rng.next() * 0.35), len * (0.55 + rng.next() * 0.2), Math.max(1, w * 0.6), depth - 1, mat);
  return m;
}

/** A shrub: a mound of foliage, optionally hung with berries or flowers. */
export function bush(rng, rx, ry, o = {}) {
  const m = new Model();
  crown(m, rng, 0, -ry * 0.7, rx, ry, o.leaf || 'leaf', { n: Math.max(4, Math.round(rx / 2.5)) });
  if (o.dots) for (let i = 0; i < rx * 0.8; i++) {
    const a = Math.PI + rng.next() * Math.PI, q = Math.sqrt(rng.next()) * 0.8;
    m.dot(Math.cos(a) * rx * q, -ry * 0.7 + Math.sin(a) * ry * q * 0.8, o.dots, { lum: rng.next() < 0.5 ? 0.85 : 0.55 });
  }
  return m;
}

/** A boulder, optionally mossed on top. */
export function boulder(rng, rx, ry, o = {}) {
  const m = new Model();
  m.poly(lumpy(0, -ry * 0.8, rx, ry, R(rng), 0.2, 6), o.rock || 'rock', { shade: 'round', tex: 1.4 });
  for (let i = 0; i < Math.max(1, rx / 5); i++) {
    const x = (rng.next() - 0.5) * rx * 1.2, y = -ry * (0.4 + rng.next() * 0.6);
    m.line([[x, y], [x + (rng.next() - 0.5) * 3, y + ry * 0.3], [x + (rng.next() - 0.5) * 3, y + ry * 0.55]], o.rock || 'rock', { lum: 0.1 });
  }
  if (o.moss) for (let i = 0; i < rx * 1.5; i++) {
    const x = (rng.next() - 0.5) * rx * 1.4, y = -ry * 1.6 + rng.next() * ry * 0.7;
    m.dot(x, y, o.moss, { lum: 0.4 + rng.next() * 0.5 });
  }
  return m;
}

/** A clump of reeds or grass blades, some with cattail heads. */
export function reeds(rng, h, n, o = {}) {
  const m = new Model();
  for (let i = 0; i < n; i++) {
    const x = (i / Math.max(1, n - 1) - 0.5) * n * 1.3 + (rng.next() - 0.5);
    const L = h * (0.55 + rng.next() * 0.45), a = -Math.PI / 2 + (x / (n * 1.3)) * 0.8 + (rng.next() - 0.5) * 0.2;
    m.poly(blade([x, 0], a, L, Math.max(0.8, L * 0.05), PROFILES.linear, { curl: (rng.next() - 0.5) * 0.5 }), o.leaf || 'reed', { shade: 'fold', tone: i % 2 ? -0.06 : 0.04 });
    if (o.heads && rng.next() < o.heads) {
      const tx = x + Math.cos(a) * L * 0.92, ty = Math.sin(a) * L * 0.92;
      m.ellipse(tx, ty + 2, 1.3, 3, o.head || 'cattail', { shade: 'round' });
    }
  }
  return m;
}

/** A fern: arching fronds of paired leaflets. */
export function fern(rng, size, o = {}) {
  const m = new Model(), n = 5 + Math.round(rng.next() * 2);
  for (let f = 0; f < n; f++) {
    const a = -Math.PI / 2 + (f / (n - 1) - 0.5) * 2.6;
    const pts = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8, bend = t * t * 0.9 * Math.sign(a + Math.PI / 2 || 1); pts.push([Math.cos(a + bend) * size * t, Math.sin(a + bend) * size * t * 0.85]); }
    m.stroke(/** @type {any} */ (pts), [1.4, 0.8], o.leaf || 'leaf', { noOutline: true, tone: -0.1 });
    for (let i = 2; i < 8; i++) {
      const q = /** @type {[number, number]} */ (pts[i]), s = 1.8 * (1 - i / 10);
      m.poly(blade(q, a - 1.2, size * 0.18 * (1 - i / 10) + 1, s, PROFILES.lance), o.leaf || 'leaf', { shade: 'fold', tone: 0.04 });
      m.poly(blade(q, a + 1.2, size * 0.18 * (1 - i / 10) + 1, s, PROFILES.lance), o.leaf || 'leaf', { shade: 'fold', tone: -0.04 });
    }
  }
  return m;
}

/** A tuft of grass. */
export function tuft(rng, h, o = {}) {
  const m = new Model();
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI / 2 + (i - 1.5) * 0.35 + (rng.next() - 0.5) * 0.2;
    m.line([[i - 1.5, 0], [i - 1.5 + Math.cos(a) * h, Math.sin(a) * h * (0.7 + rng.next() * 0.3)]], o.leaf || 'leaf', { clip: false, lum: i % 2 ? 0.88 : 0.18 });
  }
  return m;
}

/** A fallen log lying across the ground. */
export function log(rng, len, r, o = {}) {
  const m = new Model();
  m.stroke([[-len / 2, -r], [len / 2, -r - (rng.next() - 0.5) * 2]], r * 2, o.bark || 'bark', { tex: 1.5 });
  for (let i = 0; i < 3; i++) m.line([[-len / 2 + 2, -r * (0.5 + i * 0.4)], [len / 2 - 2, -r * (0.5 + i * 0.4)]], o.bark || 'bark', { lum: 0.15 });
  m.ellipse(len / 2, -r, r * 0.5, r, o.wood || 'wood', { shade: 'flat' });
  m.ellipse(len / 2, -r, r * 0.25, r * 0.5, o.wood || 'wood', { shade: 'flat', tone: -0.2 });
  if (o.moss) for (let i = 0; i < len; i++) m.dot(-len / 2 + rng.next() * len, -r * 2 + rng.next() * 2, o.moss, { lum: 0.4 + rng.next() * 0.5 });
  return m;
}

/** A cut stump with growth rings. */
export function stump(rng, w, h, o = {}) {
  const m = new Model();
  m.poly([[-w / 2 - 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2 + 2, 0]], o.bark || 'bark', { shade: 'round', tex: 1.5 });
  m.ellipse(0, -h, w / 2, Math.max(1.5, w * 0.18), o.wood || 'wood', { shade: 'flat' });
  m.ellipse(0, -h, w / 4, Math.max(0.8, w * 0.09), o.wood || 'wood', { shade: 'flat', tone: -0.2 });
  return m;
}

/** A cloud: soft heaped puffs, lit on top. */
export function cloud(rng, w, h, mat = 'cloud') {
  const m = new Model(), n = Math.max(3, Math.round(w / 9));
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1) - 0.5) * w * 0.8, r = h * (0.45 + Math.sin((i / (n - 1)) * Math.PI) * 0.45) * (0.8 + rng.next() * 0.3);
    m.poly(lumpy(x, -r * 0.8, r * 1.2, r, R(rng), 0.12, 6), mat, { shade: 'round', tex: 0.5, noOutline: true });
  }
  m.poly(ellipse(0, -h * 0.25, w * 0.5, h * 0.25), mat, { shade: 'round', tone: -0.1, noOutline: true });
  return m;
}

/** Beams: a straight timber from a to b. */
export function beam(m, a, b, w, mat = 'timber') {
  m.stroke([a, b], w, mat, { shade: 'cyl', tex: 1.2 });
  return m;
}

/** A timber crane with a jib, rope and a hanging stone. */
export function crane(rng, h) {
  const m = new Model();
  beam(m, [0, 0], [0, -h], 3);
  beam(m, [-4, 0], [0, -h * 0.4], 2);
  beam(m, [-h * 0.15, -h + 1], [h * 0.55, -h - 3], 2.5);
  beam(m, [0, -h * 0.75], [h * 0.3, -h - 1], 1.6);
  m.line([[h * 0.5, -h - 2], [h * 0.5, -h * 0.45]], 'rope', { clip: false, lum: 0.4 });
  m.poly(polygon(h * 0.5, -h * 0.4, 3.2, 5, 0.3, R(rng), 0.3, 0.8), 'rock', { shade: 'round' });
  return m;
}

/** A ladder leaning back at angle `lean`. */
export function ladder(h, lean = 0.12) {
  const m = new Model(), dx = h * lean;
  beam(m, [-3, 0], [-3 + dx, -h], 1.4);
  beam(m, [3, 0], [3 + dx, -h], 1.4);
  for (let y = 3; y < h; y += 4) m.stroke([[-3 + dx * (y / h), -y], [3 + dx * (y / h), -y]], 1, 'timber', { noOutline: true });
  return m;
}

/** A mine cart heaped with ore. */
export function cart(rng, w) {
  const m = new Model();
  m.poly([[-w / 2, -w * 0.55], [w / 2, -w * 0.55], [w / 2 - 2, -w * 0.18], [-w / 2 + 2, -w * 0.18]], 'timber', { shade: 'round' });
  for (let i = 1; i < 4; i++) m.line([[-w / 2 + (i * w) / 4, -w * 0.53], [-w / 2 + (i * w) / 4, -w * 0.2]], 'timber', { lum: 0.1 });
  m.poly(lumpy(0, -w * 0.58, w * 0.45, w * 0.16, R(rng), 0.4, 6), 'ore', { shade: 'round', tex: 2 });
  for (const s of [-1, 1]) { m.ellipse(s * w * 0.3, -w * 0.14, w * 0.13, w * 0.13, 'metal', {}); m.dot(s * w * 0.3, -w * 0.14, 'metal', { lum: 0.95 }); }
  return m;
}

/** A crate. */
export function crate(s) {
  const m = new Model();
  m.poly([[-s / 2, 0], [-s / 2, -s], [s / 2, -s], [s / 2, 0]], 'timber', { shade: 'round' });
  m.line([[-s / 2 + 1, -1], [s / 2 - 1, -s + 1]], 'timber', { lum: 0.15 });
  m.line([[-s / 2 + 1, -s / 2], [s / 2 - 1, -s / 2]], 'timber', { lum: 0.85 });
  return m;
}

/** A post-and-rail fence over `len` pixels. */
export function fence(len, h, gap = 14) {
  const m = new Model();
  for (const y of [-h * 0.75, -h * 0.4]) beam(m, [-len / 2, y], [len / 2, y + 1], 1.8);
  for (let x = -len / 2; x <= len / 2; x += gap) beam(m, [x, 1], [x, -h], 2.4);
  return m;
}

/** A straw beehive (skep) on a little stand. */
export function skep(s) {
  const m = new Model();
  beam(m, [-s * 0.6, 0], [s * 0.6, 0], 2);
  m.poly(lumpy(0, -s * 0.6, s * 0.5, s * 0.62, () => 0.5, 0, 3), 'straw', { shade: 'round' });
  for (let i = 1; i < 4; i++) m.line([[-s * 0.48, -s * 0.2 * i - 1], [s * 0.48, -s * 0.2 * i - 1]], 'straw', { lum: 0.2 });
  m.ellipse(0, -s * 0.2, 1.2, 1, 'straw', { shade: 'flat', tone: -0.5 });
  return m;
}

/** A column of hexagonal basalt. */
export function basalt(rng, w, h) {
  const m = new Model();
  const x0 = -w / 2, x1 = w / 2;
  m.poly([[x0, 0], [x0, -h], [x0 + w * 0.3, -h - w * 0.2], [x1, -h], [x1, 0]], 'rock', { shade: 'facet', lum: 0.42 });
  m.poly([[x0, 0], [x0, -h], [x0 + w * 0.3, -h + w * 0.05], [x0 + w * 0.3, 0]], 'rock', { shade: 'facet', lum: 0.62 });
  m.poly([[x0, -h], [x0 + w * 0.3, -h - w * 0.2], [x1, -h], [x0 + w * 0.3, -h + w * 0.05]], 'rock', { shade: 'facet', lum: 0.78 });
  for (let i = 0; i < 2; i++) { const y = -h * (0.3 + rng.next() * 0.5); m.line([[x0 + 1, y], [x1 - 1, y + 1]], 'rock', { lum: 0.1 }); }
  return m;
}

/** A spire of scenery crystals (not a harvest): a few faceted columns. */
export function spire(rng, h, mat = 'gem') {
  const m = new Model(), n = 2 + Math.round(rng.next() * 2);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.35, L = h * (i === Math.floor(n / 2) ? 1 : 0.6), w = L * 0.28;
    const c = Math.cos(a), s = Math.sin(a), px = -s, py = c, x = (i - (n - 1) / 2) * 2;
    const at = (u, v) => /** @type {[number, number]} */ ([x + c * u + px * v, s * u + py * v]);
    m.poly([at(0, -w / 2), at(L * 0.75, -w / 2), at(L, 0), at(L * 0.75, 0), at(0, 0)], mat, { shade: 'facet', lum: 0.8 });
    m.poly([at(0, 0), at(L * 0.75, 0), at(L, 0), at(L * 0.75, w / 2), at(0, w / 2)], mat, { shade: 'facet', lum: 0.42 });
  }
  return m;
}

/** A stone cairn or marker. */
export function cairn(rng, s) {
  const m = new Model();
  for (let i = 0; i < 3; i++) m.poly(lumpy(0, -s * 0.3 - i * s * 0.55, s * (0.7 - i * 0.15), s * 0.32, R(rng), 0.2, 5), 'rock', { shade: 'round', tone: i * 0.04 });
  return m;
}
