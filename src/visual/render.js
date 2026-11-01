// Rasterized pictures of a species, without any DOM: the plant on the ground
// at each growth stage, its icon and its four cauldron pieces (shards
// broken from the icon). Pure functions
// of the descriptor (visual/descriptor.js), so Node and every browser paint
// the same pixels; visual/sprites.js caches them as canvases.

import { FAMILIES } from './families/index.js';
import { rasterize } from './raster.js';
import { Pixels } from './pixels.js';
import { inked } from './style.js';
import { growFrame } from './growth.js';
import { noise2, hash2 } from './noise.js';

/** Icon size (art pixels, square). */
export const ICON_PX = 32;
/** A cauldron piece's cell (art pixels, square) and the silhouette grid it is fitted with. */
export const PIECE_PX = 40;
export const PIECE_GRID = 20;

/**
 * @typedef {Object} Frame
 * @property {Pixels} pix
 * @property {number} ax   foot (bottom centre) within the frame
 * @property {number} ay
 * @property {number[][]} glints  [x, y] pixels that may glimmer
 * @property {number[][]} [glows]  [x, y] pixels that give light (glowing caps, berries, crystal tips)
 */

/**
 * The plant (or deposit) where it is found, at a stage: grown procedurally
 * (visual/growth.js) on its mount — the ground, hanging, or jutting from a
 * rock face or a trunk — in one of its variants.
 * @param {import('./descriptor.js').Descriptor} d @param {number} stage 0 sprout, 1 ripe, 2 mature
 * @param {{closed?:boolean, mount?:string, variant?:number, flip?:boolean}} [o]
 * @returns {Frame}
 */
export function plantFrame(d, stage, o = {}) {
  return growFrame(d, stage, o);
}

/** The ingredient's icon (ICON_PX square). @param {import('./descriptor.js').Descriptor} d @returns {Frame} */
export function iconFrame(d) {
  const model = FAMILIES[d.family].icon(d);
  model.fit(ICON_PX - 2, ICON_PX - 2, { margin: 0.5 });
  const r = rasterize(model, ICON_PX - 2, ICON_PX - 2, d.pal, { seed: d.seeds.surface ^ 0x1c0, outline: false });
  return { pix: inked(r.pix), ax: ICON_PX / 2, ay: ICON_PX, glints: r.glints.map(([x, y]) => [x + 1, y + 1]) };
}

/** The icon raster's inner square (art pixels) in iconFrame, which piece fragments are measured in. */
const ICON_IN = ICON_PX - 2;

/** descriptor → the four shards its icon breaks into @type {WeakMap<object, {sx:number[], sy:number[], seed:number}>} */
const shards = new WeakMap();

/**
 * The icon broken into four shards: four seed points spread over its drawn
 * pixels (farthest-point sampling from a seeded start, then evened out by
 * k-means), each shard the
 * pixels nearer its seed than any other, along break lines roughened by
 * noise. Coordinates are in the icon's inner square, 0..1.
 * @param {import('./descriptor.js').Descriptor} d
 */
function shardsOf(d) {
  let got = shards.get(d);
  if (got) return got;
  const lo = shardsLow(d);
  /** @type {number[][]} */
  const pts = [];
  for (let y = 0; y < ICON_IN; y++) for (let x = 0; x < ICON_IN; x++) if (lo[y * ICON_IN + x]) pts.push([x + 0.5, y + 0.5]);
  if (!pts.length) pts.push([ICON_IN / 2, ICON_IN / 2]);
  const seed = d.seeds.surface ^ 0x5ba7d;
  const sx = [], sy = [];
  const first = pts[Math.floor(hash2(1, 2, seed) * pts.length)];
  sx.push(first[0]); sy.push(first[1]);
  const dist = pts.map(([x, y]) => (x - first[0]) ** 2 + (y - first[1]) ** 2);
  while (sx.length < 4) {
    let bi = 0;
    for (let k = 1; k < pts.length; k++) if (dist[k] > dist[bi]) bi = k;
    const [x, y] = pts[bi];
    sx.push(x); sy.push(y);
    for (let k = 0; k < pts.length; k++) dist[k] = Math.min(dist[k], (pts[k][0] - x) ** 2 + (pts[k][1] - y) ** 2);
  }
  // then settled (a few k-means steps) so the shards share the icon about evenly
  for (let it = 0; it < 8; it++) {
    const ax = [0, 0, 0, 0], ay = [0, 0, 0, 0], an = [0, 0, 0, 0];
    for (const [x, y] of pts) {
      let b = 0, bd = Infinity;
      for (let i = 0; i < 4; i++) { const dd = (x - sx[i]) ** 2 + (y - sy[i]) ** 2; if (dd < bd) { bd = dd; b = i; } }
      ax[b] += x; ay[b] += y; an[b]++;
    }
    for (let i = 0; i < 4; i++) if (an[i]) { sx[i] = ax[i] / an[i]; sy[i] = ay[i] / an[i]; }
  }
  got = { sx: sx.map((x) => x / ICON_IN), sy: sy.map((y) => y / ICON_IN), seed };
  shards.set(d, got);
  return got;
}

/** Which shard (0..3) a point of the icon's inner square (0..1) falls in. @param {{sx:number[], sy:number[], seed:number}} sh @param {number} u @param {number} v */
function shardAt(sh, u, v) {
  // break lines wander: each seed's distance is nudged by its own noise
  let best = 0, bd = Infinity;
  for (let i = 0; i < 4; i++) {
    const n = noise2(u * 9, v * 9, sh.seed + i * 977) - 0.5;
    const dd = Math.hypot(u - sh.sx[i], v - sh.sy[i]) + n * 0.14;
    if (dd < bd) { bd = dd; best = i; }
  }
  return best;
}

/**
 * Piece v drawn size square (art pixels): a shard of the ingredient's icon,
 * its own pixels — the icon's model, palette and surface rasterized at the
 * scale that makes the shard fill the square, so it has the icons' grain —
 * cut along its break lines (its largest connected part kept) and ringed
 * with ink.
 * @param {import('./descriptor.js').Descriptor} d @param {number} v 0..3 @param {number} size
 * @returns {Pixels}
 */
function shardArt(d, v, size) {
  const sh = shardsOf(d), want = v & 3;
  // the shard's extent in the icon, from a fine sampling of the icon's square
  const lo = shardsLow(d);
  // (its largest connected part: the one that is kept)
  const part = new Pixels(ICON_IN, ICON_IN);
  for (let y = 0; y < ICON_IN; y++) for (let x = 0; x < ICON_IN; x++) {
    if (lo[y * ICON_IN + x] && shardAt(sh, (x + 0.5) / ICON_IN, (y + 0.5) / ICON_IN) === want) part.px[y * ICON_IN + x] = 0xffffffff;
  }
  keepLargest(part);
  let u0 = 1, u1 = 0, v0 = 1, v1 = 0;
  for (let y = 0; y < ICON_IN; y++) for (let x = 0; x < ICON_IN; x++) {
    if (!part.px[y * ICON_IN + x]) continue;
    u0 = Math.min(u0, x / ICON_IN); u1 = Math.max(u1, (x + 1) / ICON_IN);
    v0 = Math.min(v0, y / ICON_IN); v1 = Math.max(v1, (y + 1) / ICON_IN);
  }
  if (u1 <= u0) { u0 = 0; u1 = 1; v0 = 0; v1 = 1; }
  const inner = size - 2, mg = Math.max(1, Math.round(size / PIECE_PX));
  const R = Math.max(4, Math.round((inner - mg * 2) / Math.max(u1 - u0, v1 - v0)));
  const model = FAMILIES[d.family].icon(d);
  model.fit(R, R, { margin: (0.5 * R) / ICON_IN });
  const r = rasterize(model, R, R, d.pal, { seed: d.seeds.surface ^ 0x1c0, outline: false });
  // the shard's centre at the square's centre
  const ox = Math.round(((u0 + u1) / 2) * R - inner / 2), oy = Math.round(((v0 + v1) / 2) * R - inner / 2);
  const out = new Pixels(inner, inner);
  for (let y = 0; y < inner; y++) for (let x = 0; x < inner; x++) {
    const X = x + ox, Y = y + oy;
    if (X < 0 || Y < 0 || X >= R || Y >= R) continue;
    const c = r.pix.px[Y * R + X];
    if (!(c >>> 24) || shardAt(sh, (X + 0.5) / R, (Y + 0.5) / R) !== want) continue;
    out.px[y * inner + x] = c;
  }
  keepLargest(out);
  return inked(out);
}

/** descriptor → the icon's opaque pixels in its inner square @type {WeakMap<object, Uint8Array>} */
const lowMasks = new WeakMap();
/** @param {import('./descriptor.js').Descriptor} d */
function shardsLow(d) {
  let m = lowMasks.get(d);
  if (m) return m;
  const model = FAMILIES[d.family].icon(d);
  model.fit(ICON_IN, ICON_IN, { margin: 0.5 });
  m = rasterize(model, ICON_IN, ICON_IN, d.pal, { seed: d.seeds.surface ^ 0x1c0, outline: false }).pix.mask();
  lowMasks.set(d, m);
  return m;
}

/** Clear every opaque pixel outside the largest 4-connected part. @param {Pixels} p */
function keepLargest(p) {
  const { w, h, px } = p, lab = new Int32Array(w * h), stack = [];
  let next = 0, best = 0, bestN = 0;
  for (let k = 0; k < w * h; k++) {
    if (lab[k] || !(px[k] >>> 24)) continue;
    const id = ++next;
    let n = 0;
    lab[k] = id; stack.push(k);
    while (stack.length) {
      const q = /** @type {number} */ (stack.pop()), x = q % w, y = (q - x) / w;
      n++;
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const j = ny * w + nx;
        if (!lab[j] && px[j] >>> 24) { lab[j] = id; stack.push(j); }
      }
    }
    if (n > bestN) { bestN = n; best = id; }
  }
  for (let k = 0; k < w * h; k++) if (lab[k] !== best) px[k] = 0;
}

/**
 * A piece drawn at another size (size square, art pixels): the same shard
 * of the icon as pieceFrame, rasterized at the size it is shown at, so its
 * texture has the grain of the icons rather than their pixels blown up.
 * @param {import('./descriptor.js').Descriptor} d @param {number} v 0..3 @param {number} size
 */
export function pieceArt(d, v, size) {
  return shardArt(d, v, size);
}

/**
 * One of the four whole pieces poured into the cauldron (PIECE_PX square) —
 * a shard broken from the ingredient's icon — and its silhouette on the
 * PIECE_GRID grid.
 * @param {import('./descriptor.js').Descriptor} d @param {number} v 0..3
 */
export function pieceFrame(d, v) {
  const pix = shardArt(d, v, PIECE_PX);
  const k = PIECE_PX / PIECE_GRID, mask = new Uint8Array(PIECE_GRID * PIECE_GRID);
  for (let y = 0; y < PIECE_GRID; y++) for (let x = 0; x < PIECE_GRID; x++) {
    let n = 0;
    for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) if (pix.px[(y * k + j) * PIECE_PX + x * k + i] >>> 24) n++;
    mask[y * PIECE_GRID + x] = n * 2 >= k * k ? 1 : 0;
  }
  return { pix, mask };
}

export { Pixels };
