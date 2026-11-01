// The enclosures of the farm: one for every kind of animal caught in the
// wilds (the Moon Rabbits keep their painted hutch, rendering/hutch-scene.js),
// each a 224 × 92 scene painted procedurally in the wilds' own style
// (side.js, paint.js): materials in broad blotches and grains, a bright crust
// along lit edges, dark rims, ink round what stands in front, scenery stamped
// from the same models (objects.js). Unlike the wilds they are *built*:
// level floors, walls laid in courses, boards, flags and mown stripes in
// regular rows, and what the kind needs set down where a keeper would put
// it — a pond for the toads, a hearth for the salamanders, a hay rack for
// the deer, pigeonholes for the doves.
//
// Every pen is seen like the hutch: its back (sky, wall or bank) above
// FLOOR, the floor the animals walk on below it — feet on the rows
// GROUND_Y0.. (`ground`, as hutch-ground.js's runs) — and a front barrier
// drawn over the animals. Pure and deterministic: a kind always gets the same
// pixels (cached).

import { Canvas } from './paint.js';
import { palette } from './kit.js';
import { col, silhouette, treeShape } from './side.js';
import { finish } from './cave.js';
import { cobble } from './stone.js';
import { boulder, crate, fence, fern, log, reeds, stump, tuft } from './objects.js';
import { Model, lumpy } from '../geometry.js';
import { fbm2, hash2, noise2 } from '../noise.js';
import { mixPacked, ramp, hex } from '../color.js';
import { INK } from '../style.js';
import { Rng, hashString } from '../../core/rng.js';

export const PEN_W = 224;
export const PEN_H = 92;
/** The floor's back edge, and the rows a foot may rest on (as the hutch's). */
export const FLOOR = 52;
export const GROUND_Y0 = 56;
const GROUND_Y1 = 75;
/** Top of the front barrier. */
const FRONT = 77;

/** Version of the pens' painting (names caches only). */
export const PENS_VERSION = 1;

/**
 * @typedef {Object} Pen
 * @property {string} kind
 * @property {string} title
 * @property {import('../pixels.js').Pixels} back   everything behind the animals
 * @property {import('../pixels.js').Pixels} front  the barrier drawn over them (transparent elsewhere)
 * @property {number} y0          first row of `ground`
 * @property {number[][][]} ground  per row from y0, the [x0, x1) runs a foot may rest on
 * @property {{x:number, y:number}} rack  where an animal stands to eat (facing left)
 * @property {[number, number][]} slots   where the bodies lie
 * @property {[number, number, number, number]} cloth  the cloth they lie on (x, y, w, h)
 * @property {[number, number, number, number]} nest   where nest straw goes while a female is expecting (x0, y0, x1, y1)
 */

const R6 = (h, o = {}) => ramp(hex(h), { n: 6, ...o });
const clampI = (v, a, b) => (v < a ? a : v > b ? b : v);

/**
 * A pixel of a built material: its body tone, a step lighter in broad
 * blotches, a step darker in their gaps, a rare grain — as the wilds' ground.
 * @param {number[]} R ramp, darkest first @param {number} x @param {number} y @param {number} seed
 * @param {{base?:number, f?:number, fy?:number}} [o]
 */
function tex(R, x, y, seed, o = {}) {
  const b = fbm2(x * (o.f ?? 0.08), y * (o.fy ?? o.f ?? 0.08) * 1.3, seed, 2);
  let i = o.base ?? 2;
  if (b > 0.57) i++; else if (b < 0.37) i--;
  const g = hash2(x, y, seed + 3);
  if (g > 0.968) i += 2; else if (g < 0.028) i -= 2;
  return R[clampI(i, 0, R.length - 1)];
}

/** Paint every pixel of a rectangle with fn(x, y) (a colour, or 0 to leave it). */
function fill(cv, x0, y0, x1, y1, fn) {
  for (let y = Math.max(0, y0); y < Math.min(cv.H, y1); y++) for (let x = Math.max(0, x0); x < Math.min(cv.W, x1); x++) {
    const c = fn(x, y);
    if (c) cv.set(x, y, c);
  }
}

// ------------------------------------------------------------------ backs

/** An open sky with far hills (and a far wood), down to row y1. */
function outdoors(cv, y1, o) {
  const top = hex(o.sky[0]), bot = hex(o.sky[1]);
  for (let y = 0; y < y1; y++) {
    const t = y / Math.max(1, y1 - 1);
    for (let x = 0; x < cv.W; x++) {
      const d = ((x & 1) + 2 * (y & 1)) / 4 - 0.4;
      cv.set(x, y, pack3(top.map((v, k) => v + (bot[k] - v) * t + d / 255)));
    }
  }
  if (o.hills) silhouette(cv, { base: o.hills[0], amp: 5, freq: 0.02, seed: o.seed, fill: o.hills[1], rim: o.hills[2], bottom: y1 });
  if (o.wood) {
    const r = new Rng(o.seed + 7);
    for (let x = 2; x < cv.W; x += r.int(5, 10)) treeShape(cv, x, o.wood[0] + r.int(0, 2), r.int(10, 18), r.next() < 0.5 ? 'pine' : 'oak', o.wood[1], o.seed + x);
  }
}
/** @param {number[]} rgb */
const pack3 = (rgb) => ((255 << 24) | (Math.round(clampI(rgb[2], 0, 1) * 255) << 16) | (Math.round(clampI(rgb[1], 0, 1) * 255) << 8) | Math.round(clampI(rgb[0], 0, 1) * 255)) >>> 0;

/** Boards laid in courses (horizontal) or side by side (vertical), staggered joints, nails, grain. */
function boards(cv, x0, y0, x1, y1, R, seed, o = {}) {
  const vert = !!o.vertical, bh = o.size ?? 7;
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const u = vert ? x - x0 : y - y0, v = vert ? y - y0 : x - x0;
    const row = Math.floor(u / bh), at = u - row * bh;
    // the joints of a course, staggered from the course above
    const len = 30 + Math.floor(hash2(row, 1, seed) * 18), off = Math.floor(hash2(row, 2, seed) * len);
    const piece = Math.floor((v + off) / len), jv = (v + off) % len;
    const tone = hash2(row, piece, seed + 5);
    let i = tone < 0.3 ? 1 : tone > 0.75 ? 3 : 2;
    if (noise2(v * 0.07, u * 0.9 + row * 3, seed + piece) > 0.62) i++;
    let c = R[clampI(i, 0, 5)];
    if (at === 0) c = R[clampI(i + 1, 0, 5)];
    if (at === bh - 1) c = R[0];
    if (jv === 0) c = R[0]; else if (jv === 1) c = R[clampI(i + 1, 0, 5)];
    if ((jv === 3 || jv === len - 3) && at === 2) c = R[5];
    return c;
  });
}

/** Bricks in courses: a mortar line under each course and between bricks, each brick its own tone, lit on top. */
function bricks(cv, x0, y0, x1, y1, R, mortar, seed, o = {}) {
  const bh = o.h ?? 5, bw = o.w ?? 11;
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const row = Math.floor((y - y0) / bh), at = (y - y0) % bh, sx = x + (row & 1) * Math.floor(bw / 2), b = Math.floor(sx / bw), bx = sx % bw;
    if (at === bh - 1 || bx === 0) return mortar;
    const t = hash2(b, row, seed);
    let i = t < 0.25 ? 1 : t > 0.8 ? 3 : 2;
    if (at === 0) i++;
    if (hash2(x, y, seed + 9) > 0.95) i--;
    return R[clampI(i, 0, 5)];
  });
}

/** A wall of cobbled stone (the caverns' own texture), courses of it laid level. */
function stonewall(cv, x0, y0, x1, y1, stones, mortar, seed, s = 6) {
  const t = { stones: stones.map(col), mortar: col(mortar), s, seed, flat: 1.6 };
  fill(cv, x0, y0, x1, y1, (x, y) => cobble(x, y, t));
}

/** A crust along the top of a wall or bank: a few rows of moss, grass or snow, lit on top, ragged below. */
function crust(cv, x0, x1, y, cols, seed, depth = 3) {
  const C = cols.map(col);
  for (let x = x0; x < x1; x++) {
    const d = depth + Math.floor(hash2(x >> 1, 0, seed) * 2.5);
    for (let j = 0; j < d; j++) cv.set(x, y + j, C[Math.min(C.length - 1, j)]);
    if (hash2(x, 1, seed) > 0.7) cv.set(x, y - 1, C[0]);
  }
}

/** A clipped hedge: dense leaves, a flat lit top, darker at its foot. */
function hedge(cv, x0, y0, x1, y1, R, seed) {
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const n = noise2(x * 0.45, y * 0.45, seed), m = fbm2(x * 0.1, y * 0.1, seed + 1, 2);
    let i = 2 + (n > 0.6 ? 1 : n < 0.3 ? -1 : 0) + (m > 0.58 ? 1 : 0);
    if (y - y0 < 2) i = 4 + (y - y0 === 0 ? 1 : 0);
    if (y1 - y < 4) i -= 1;
    if (hash2(x, y, seed + 4) > 0.97) i = 5;
    return R[clampI(i, 0, 5)];
  });
}

/** Wattle hurdles: upright stakes with withies woven in and out between them. */
function wattle(cv, x0, y0, x1, y1, R, stake, seed) {
  const S = 9;
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const sx = (x - x0) % S, si = Math.floor((x - x0) / S), row = Math.floor((y - y0) / 3), at = (y - y0) % 3;
    if (sx === 0 || sx === 1) return sx === 0 ? stake[1] : stake[3];
    // the withy passes in front of this stake's gap or behind it, alternately
    const front = (si + row) & 1;
    let i = front ? 3 : 1;
    if (at === 0) i++; else if (at === 2) i--;
    if (hash2(x, y, seed) > 0.95) i--;
    return R[clampI(i, 0, 5)];
  });
  for (let x = x0; x < x1; x += S) cv.set(x, y0 - 1, stake[4]), cv.set(x + 1, y0 - 1, stake[3]);
}

/** An earth bank: the ground's own material (blotches, stones), a level grassy top. */
function earthbank(cv, x0, y0, x1, y1, R, seed) {
  fill(cv, x0, y0, x1, y1, (x, y) => {
    let c = tex(R, x, y, seed, { f: 0.07 });
    if (hash2(x >> 1, y >> 1, seed + 2) > 0.985) c = R[5];
    // darker deeper in, in steps
    return mixPacked(c, 0xff000000, Math.min(3, Math.floor((y - y0) / 12)) * 0.07);
  });
}

// ------------------------------------------------------------------ floors

/**
 * A floor seen from above at a slant, from row y0 down: courses that grow
 * deeper toward the front, as built floors read. style: boards, flags,
 * grass, sand, gravel, snow, earth, ash, soil, straw.
 */
function floor(cv, y0, style, R, seed, o = {}) {
  const H = cv.H, W = cv.W;
  // the courses: each a little deeper than the one behind it
  const rows = [];
  for (let y = y0, h = o.row ?? 4; y < H; y += Math.round(h), h += 0.55) rows.push([y, Math.round(h)]);
  const rowAt = (y) => { let r = 0; while (r + 1 < rows.length && rows[r + 1][0] <= y) r++; return r; };
  fill(cv, 0, y0, W, H, (x, y) => {
    const r = rowAt(y), [ry, rh] = rows[r], at = y - ry;
    let c;
    switch (style) {
      case 'boards': {
        const len = 40 + Math.floor(hash2(r, 1, seed) * 26), v = x + Math.floor(hash2(r, 2, seed) * len), jv = v % len;
        const t = hash2(r, Math.floor(v / len), seed);
        let i = t < 0.3 ? 1 : t > 0.75 ? 3 : 2;
        if (noise2(x * 0.06, y * 0.8, seed + r) > 0.64) i++;
        if (at === 0) i++;
        if (at === rh - 1 || jv === 0) i = 0;
        c = R[clampI(i, 0, 5)];
        break;
      }
      case 'flags': {
        const w = 12 + Math.round(rh * 1.6), v = x + Math.floor(hash2(r, 3, seed) * w), b = Math.floor(v / w), jv = v % w;
        if (at === rh - 1 || jv === 0) { c = o.joint ? col(o.joint) : R[0]; if (o.moss && hash2(x, y, seed + 6) > 0.4) c = col(o.moss); break; }
        const t = hash2(b, r, seed + 4);
        let i = t < 0.3 ? 1 : t > 0.78 ? 3 : 2;
        if (at === 0 || jv === 1) i++;
        if (hash2(x, y, seed + 2) > 0.96) i--;
        c = R[clampI(i, 0, 5)];
        break;
      }
      case 'grass': {
        // mown in stripes, slanting toward the front
        const stripe = Math.floor((x + (y - y0) * 0.35) / 16) & 1;
        let i = 2 + stripe;
        const n = fbm2(x * 0.09, y * 0.15, seed, 2);
        if (n > 0.6) i++; else if (n < 0.34) i--;
        const g = hash2(x, y, seed + 1);
        if (g > 0.94) i += 1; else if (g < 0.05) i -= 1;
        c = R[clampI(i, 0, 5)];
        break;
      }
      case 'sand': case 'earth': case 'snow': case 'ash': {
        // raked smooth: faint even furrows across, the course lines
        let i = 2;
        const n = fbm2(x * 0.07, y * 0.12, seed, 2);
        if (n > 0.6) i++; else if (n < 0.34) i--;
        if (at === 0 && ((x >> 2) + r) % 3 !== 0) i++;
        if (at === rh - 1) i--;
        const g = hash2(x, y, seed + 1);
        if (style === 'snow' && g > 0.985) i = 5;
        else if (g > 0.965) i += 2; else if (g < 0.03) i -= 2;
        c = R[clampI(i, 0, 5)];
        if (style === 'ash' && o.embers && hash2(x, y, seed + 8) > 0.992) c = col(hash2(x, y, seed + 9) > 0.5 ? '#ff9a3a' : '#e0541c');
        break;
      }
      case 'gravel': {
        const g = hash2(x, y, seed), h2 = hash2(x >> 1, y, seed + 1);
        let i = h2 < 0.25 ? 1 : h2 > 0.7 ? 3 : 2;
        if (g > 0.9) i = 4; else if (g < 0.1) i = 0;
        if (at === 0 && (x + r) % 5 === 0) i = 1;
        c = R[clampI(i, 0, 5)];
        break;
      }
      case 'soil': {
        // tilled in neat rows: a ridge lit on top, a furrow in shade
        let i = at === 0 ? 3 : at === rh - 1 ? 0 : at < rh / 2 ? 2 : 1;
        if (hash2(x, y, seed) > 0.95) i++;
        c = R[clampI(i, 0, 5)];
        break;
      }
      default: { // straw
        const n = noise2(x * 0.5 + y * 0.9, y * 0.4, seed);
        let i = n > 0.62 ? 4 : n > 0.4 ? 3 : 2;
        if (hash2(x, y, seed) > 0.93) i = 5; else if (hash2(x, y, seed + 1) < 0.08) i = 1;
        c = R[clampI(i, 0, 5)];
      }
    }
    // in the wall's shade at the back
    const d = y - y0;
    if (d < 4) c = mixPacked(c, 0xff000000, (4 - d) * 0.09);
    return c;
  });
}

// ------------------------------------------------------------------ fronts

/** A post-and-rail front: two rails, stout posts. */
function railFront(fg, R, o = {}) {
  const W = fg.W, H = fg.H, posts = o.posts ?? [3, 58, 113, 168, 220];
  const t = (x, y, i) => R[clampI(i + (noise2(x * 0.1, y * 0.8, 3) > 0.6 ? 1 : 0), 0, 5)];
  for (const [ya, yb] of [[FRONT + 1, FRONT + 5], [FRONT + 9, FRONT + 13]]) fill(fg, 0, ya, W, yb, (x, y) => t(x, y, y === ya ? 4 : y === yb - 1 ? 1 : 2));
  for (const px of posts) fill(fg, px - 3, FRONT - 4, px + 3, H, (x, y) => t(x, y, x === px - 3 ? 4 : x === px + 2 ? 1 : y === FRONT - 4 ? 5 : 3));
}

/** A low wall of brick or stone along the front, its coping lit. */
function wallFront(fg, paint, cap) {
  const W = fg.W, H = fg.H, y0 = H - 11;
  paint(fg, 0, y0 + 2, W, H);
  fill(fg, 0, y0, W, y0 + 2, (x, y) => (y === y0 ? cap[4] : cap[3]));
  fill(fg, 0, y0 + 2, W, y0 + 3, () => cap[0]);
  if (paint.snow) crust(fg, 0, W, y0 - 1, paint.snow, 5, 2);
}

/** Palings along the front: pointed pales on two rails. */
function palingFront(fg, R) {
  const W = fg.W, H = fg.H, top = FRONT - 1;
  fill(fg, 0, FRONT + 4, W, FRONT + 7, (x, y) => R[y === FRONT + 4 ? 3 : 1]);
  for (let x = 1; x < W; x += 6) {
    const tip = top - (x % 12 === 1 ? 2 : 0);
    fill(fg, x, tip, x + 4, H, (xx, y) => {
      if (y === tip && (xx === x || xx === x + 3)) return 0;
      return R[xx === x ? 4 : xx === x + 3 ? 1 : 3 - (hash2(xx, y, 2) > 0.9 ? 1 : 0)];
    });
  }
}

/** Logs laid along the front, ends showing their rings. */
function logFront(fg, bark, wood) {
  const W = fg.W, H = fg.H;
  for (const [ya, r] of [[H - 12, 4]]) {
    fill(fg, 4, ya, W - 4, ya + r * 2 + 1, (x, y) => {
      const d = y - ya;
      let i = d < 2 ? 4 : d > r * 2 - 2 ? 1 : 2 + (noise2(x * 0.15, y * 0.9, 4) > 0.58 ? 1 : 0);
      if (hash2(x, y, 1) > 0.95) i--;
      return bark[clampI(i, 0, 5)];
    });
    for (const ex of [4, W - 5]) for (let j = 0; j <= r * 2; j++) for (let i = -2; i <= 2; i++) {
      const dx = i / 2.5, dy = (j - r) / r;
      if (dx * dx + dy * dy <= 1) fg.set(ex + i, ya + j, wood[dx * dx + dy * dy < 0.3 ? 2 : 4]);
    }
  }
}

/** Wattle hurdle along the front, low. */
function hurdleFront(fg, R, stake) {
  wattle(fg, 0, FRONT + 2, fg.W, fg.H, R, stake, 9);
}

/** Ink round the front's pieces where they meet what lies behind (the wilds' outline). */
function inkFront(fg) {
  const W = fg.W, H = fg.H, px = fg.pix.px, out = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (px[y * W + x] >>> 24) continue;
    const op = (i, j) => i >= 0 && j >= 0 && i < W && j < H && px[j * W + i] >>> 24 && px[j * W + i] !== INK;
    if (op(x, y + 1) || op(x - 1, y) || op(x + 1, y)) out.push(y * W + x);
  }
  for (const k of out) px[k] = INK;
}

// ------------------------------------------------------------------ props

/** A shallow bowl or dish (food), at its foot. */
function bowl(pal, w = 9, mat = 'clay', food = 'food') {
  const m = new Model();
  m.poly([[-w / 2, -3], [w / 2, -3], [w / 2 - 1.5, 0], [-w / 2 + 1.5, 0]], mat, { shade: 'round' });
  m.ellipse(0, -3, w / 2 - 1, 1.2, food, { shade: 'flat', noOutline: true });
  return m;
}

/** A box shelter with a dark arched door: a den, a hide, a hutch. */
function denBox(w, h, o = {}) {
  const m = new Model(), mat = o.mat || 'timber';
  m.poly([[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], mat, { shade: 'round', tex: 1.3 });
  for (let y = -h + 4; y < -1; y += 4) m.line([[-w / 2 + 1, y], [w / 2 - 1, y]], mat, { lum: 0.15 });
  if (o.roof) m.poly([[-w / 2 - 3, -h + 1], [0, -h - o.roof], [w / 2 + 3, -h + 1]], o.roofMat || 'straw', { shade: 'round', tex: 1.5 });
  const dw = o.door ?? w * 0.32, dx = o.doorX ?? w * 0.15;
  /** @type {[number, number][]} */
  const arch = [[dx - dw / 2, 0], [dx - dw / 2, -h * 0.45]];
  for (let i = 0; i <= 6; i++) { const a = Math.PI + (i / 6) * Math.PI; arch.push([dx + Math.cos(a) * dw / 2, -h * 0.45 + Math.sin(a) * dw * 0.5]); }
  arch.push([dx + dw / 2, 0]);
  m.poly(arch, 'shadow', { shade: 'flat', noOutline: true });
  return m;
}

/** A hay rack: a slatted wooden frame heaped with hay. */
function hayRack(w, h) {
  const m = new Model();
  m.poly([[-w / 2, -h], [w / 2, -h], [w / 2, -h * 0.25], [-w / 2, -h * 0.25]], 'straw', { shade: 'round', tex: 2 });
  m.poly(lumpy(0, -h, w / 2 + 1, 3, () => 0.5, 0.2, 5), 'straw', { shade: 'round', tex: 2 });
  for (let x = -w / 2; x <= w / 2; x += 3) m.stroke([[x, 0], [x, -h]], 1.2, 'timber', { noOutline: true });
  for (const y of [-h, -h * 0.25]) m.stroke([[-w / 2 - 1, y], [w / 2 + 1, y]], 1.8, 'timber', {});
  for (const s of [-1, 1]) m.stroke([[s * (w / 2 + 1), 1], [s * (w / 2 + 1), -h - 2]], 2.2, 'timber', {});
  return m;
}

/** A trough or a pond's kerb with water in it: a level rectangle of water inside a rim. */
function water(cv, x0, y0, x1, y1, rim, body, seed) {
  const B = body.map(col);
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const e = Math.min(x - x0, x1 - 1 - x, y - y0, y1 - 1 - y);
    if (e < 2) {
      // the rim: lit along its top and left, in shade below
      const lit = y - y0 < 1 || x - x0 < 1;
      return rim[clampI((e === 0 ? (lit ? 4 : 1) : 2) + (hash2(x, y, seed) > 0.9 ? 1 : 0), 0, 5)];
    }
    // the water: deeper toward the middle, a ripple of light here and there
    const d = Math.min(1, Math.min(y - y0 - 2, y1 - 3 - y) / 4);
    let c = B[clampI(Math.round(1 + d * 2 - (y - y0 < 4 ? 1 : 0)), 0, B.length - 1)];
    const ripple = noise2(x * 0.3, y * 1.2, seed + 3);
    if (ripple > 0.74) c = B[0];
    return c;
  });
  for (let x = x0; x < x1; x++) cv.set(x, y1, INK);
}

/** A cushion or a nest bed: a round soft heap. */
function cushion(w, mat) {
  const m = new Model();
  m.poly(lumpy(0, -2.5, w / 2, 3, () => 0.5, 0.1, 7), mat, { shade: 'round', tex: 0.8 });
  return m;
}

/** A wicker basket with a cushion in it. */
function basket(w) {
  const m = new Model();
  m.poly([[-w / 2, -6], [w / 2, -6], [w / 2 - 2, 0], [-w / 2 + 2, 0]], 'straw', { shade: 'round', tex: 2 });
  for (let x = -w / 2 + 2; x < w / 2; x += 2) m.line([[x, -6], [x * 0.9, 0]], 'straw', { lum: 0.2 });
  m.ellipse(0, -6, w / 2 - 1, 2.2, 'cloth', { shade: 'round' });
  return m;
}

/** A barrel lying on its side, its mouth dark (a rat's nest). */
function barrel(r, len) {
  const m = new Model();
  m.poly([[-len / 2, 0], [-len / 2, -r * 2], [len / 2, -r * 2], [len / 2, 0]], 'timber', { shade: 'cyl', tex: 1.4 });
  for (const x of [-len / 2 + 3, len / 2 - 6]) m.stroke([[x, 0], [x, -r * 2]], 1.6, 'metal', { noOutline: true });
  m.ellipse(len / 2, -r, r * 0.55, r, 'timber', { shade: 'flat' });
  m.ellipse(len / 2, -r, r * 0.38, r * 0.75, 'shadow', { shade: 'flat', noOutline: true });
  return m;
}

/** A flower pot on its side (a snail's shelter). */
function pot(r, len) {
  const m = new Model();
  m.poly([[-len / 2, -r * 0.4], [-len / 2, -r * 1.6], [len / 2, -r * 2], [len / 2, 0]], 'clay', { shade: 'round', tex: 1 });
  m.ellipse(len / 2, -r, r * 0.5, r, 'clay', { shade: 'flat', tone: 0.1 });
  m.ellipse(len / 2, -r, r * 0.35, r * 0.8, 'shadow', { shade: 'flat', noOutline: true });
  return m;
}

/** A lettuce: a rosette of round leaves. */
function lettuce(rng, r) {
  const m = new Model();
  for (let i = 0; i < 6; i++) { const a = Math.PI + (i / 5) * Math.PI; m.ellipse(Math.cos(a) * r * 0.6, -r * 0.5 + Math.sin(a) * r * 0.35, r * 0.55, r * 0.4, 'leaf', { shade: 'round', tone: (rng.next() - 0.5) * 0.15 }); }
  m.ellipse(0, -r * 0.6, r * 0.45, r * 0.4, 'leaf2', { shade: 'round' });
  return m;
}

/** A flat basking stone. */
function slab(rng, w) {
  const m = new Model();
  m.poly(lumpy(0, -2, w / 2, 2.4, () => rng.next(), 0.15, 6), 'rock', { shade: 'round', tex: 1.2 });
  return m;
}

/** A fireplace: an arched brick opening, its hollow dark with a bed of embers. */
function hearth(cv, cx, y1, w, h, R, mortar, seed) {
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = y1 - h;
  bricks(cv, x0 - 5, y0 - 6, x1 + 5, y1, R, mortar, seed + 1, { h: 4, w: 7 });
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const u = (x - cx) / (w / 2), v = (y - (y0 + w / 2)) / (w / 2);
    if (y < y0 + w / 2 && u * u + v * v > 1) return 0;
    const deep = Math.min(1, (y1 - y) / h);
    return mixPacked(col('#3a1a10'), col('#0c0606'), deep);
  });
  // the embers
  fill(cv, x0 + 1, y1 - 4, x1 - 1, y1, (x, y) => {
    const g = noise2(x * 0.5, y * 0.9, seed);
    return col(g > 0.66 ? '#ffd27a' : g > 0.5 ? '#ff9a3a' : g > 0.32 ? '#c8401a' : '#5a1a0c');
  });
  cv.glow(cx, y1 - 2, 46, [1, 0.5, 0.18], 0.55);
}

/** Pigeonholes: rows of arched niches in the wall, each with a little ledge. */
function pigeonholes(cv, x0, x1, y0, rows, R, seed) {
  for (let r = 0; r < rows; r++) for (let x = x0 + (r & 1) * 7; x + 9 < x1; x += 14) {
    const y = y0 + r * 13;
    fill(cv, x, y, x + 9, y + 9, (xx, yy) => {
      const u = (xx + 0.5 - (x + 4.5)) / 4.5, v = (yy + 0.5 - (y + 4.5)) / 4.5;
      if (yy < y + 4.5 && u * u + v * v > 1) return 0;
      return yy - y < 2 ? col('#1a1014') : col('#2a1c18');
    });
    fill(cv, x - 1, y + 9, x + 10, y + 11, (xx, yy) => R[yy === y + 9 ? 5 : 2]);
    if (hash2(x, r, seed) > 0.6) cv.set(x + 2 + Math.floor(hash2(x, r, seed + 1) * 5), y + 8, col('#f0ece4'));
  }
}

/** A shelf on brackets along the wall. */
function shelf(cv, x0, x1, y, R) {
  fill(cv, x0, y, x1, y + 2, (x, yy) => R[yy === y ? 5 : 3]);
  fill(cv, x0, y + 2, x1, y + 3, () => INK);
  for (const bx of [x0 + 3, x1 - 5]) fill(cv, bx, y + 3, bx + 2, y + 7, (x) => R[x === bx ? 3 : 1]);
}

// ------------------------------------------------------------------ the pens

const PAL = palette({
  timber: '#7a5434', wood: ['#b88a58', { spread: 0.4 }], bark: '#5a3e28', rock: '#8a8478', moss: '#5a8a34', leaf: ['#4e8a2e', { spread: 0.6 }], leaf2: ['#8ab83e', { spread: 0.5 }],
  reed: '#6a8a3a', cattail: '#5a3a20', straw: ['#c8a050', { spread: 0.45 }], clay: '#a85a34', food: '#c89a5a', cloth: ['#a84a3a', { spread: 0.45 }], shadow: '#1a1014',
  metal: '#4a4a52', snow: ['#e8eef8', { spread: 0.3, cool: 0.6 }], stone: '#9a9488',
});
const pal = (over) => ({ ...PAL, ...palette(over) });

/** @typedef {{cv:Canvas, fg:Canvas, rng:Rng, seed:number, block:(x0:number, y0:number, x1:number, y1:number)=>void}} Ctx */

/** @type {Record<string, {title:string, compose:(c:Ctx)=>{rack:{x:number,y:number}, nest:[number,number,number,number], cloth?:[number,number,number,number]}}>} */
const PENS = {
  cat: {
    title: 'The cattery',
    compose({ cv, fg, rng, seed, block }) {
      const plaster = R6('#c8b49a', { spread: 0.35 }), panel = R6('#7a4a2a'), boardsR = R6('#8a5a34');
      fill(cv, 0, 0, cv.W, 30, (x, y) => tex(plaster, x, y, seed, { f: 0.05, base: 3 }));
      boards(cv, 0, 30, cv.W, FLOOR, panel, seed + 1, { vertical: true, size: 6 });
      fill(cv, 0, 29, cv.W, 31, (x, y) => panel[y === 29 ? 5 : 2]);
      shelf(cv, 30, 80, 12, panel); shelf(cv, 120, 176, 20, panel);
      cv.stamp(cushion(14, 'cloth'), PAL, 46, 12);
      cv.stamp(cushion(12, 'cloth'), PAL, 150, 20);
      floor(cv, FLOOR, 'boards', boardsR, seed + 2);
      // a scratching post wound with rope, a basket to sleep in, a bowl
      const post = new Model();
      post.stroke([[0, 0], [0, -26]], 4, 'straw', { shade: 'cyl', tex: 2 });
      for (let y = -24; y < -2; y += 2) post.line([[-2, y], [2, y + 1]], 'straw', { lum: 0.15 });
      post.poly([[-7, 0], [7, 0], [7, -2], [-7, -2]], 'timber', { shade: 'round' });
      post.poly([[-6, -26], [6, -26], [6, -29], [-6, -29]], 'cloth', { shade: 'round' });
      cv.stamp(post, PAL, 112, 60);
      block(104, 56, 121, 61);
      cv.stamp(basket(22), PAL, 190, 62);
      block(178, 56, 203, 63);
      cv.stamp(bowl(PAL, 9), PAL, 26, 62);
      railFront(fg, R6('#6a3e22'));
      return { rack: { x: 34, y: 62 }, nest: [182, 54, 199, 58] };
    },
  },
  toad: {
    title: 'The toad pond',
    compose({ cv, fg, rng, seed, block }) {
      outdoors(cv, 18, { sky: ['#5a8ab8', '#b8d4dc'], hills: [14, '#3e6a44', '#4e7e50'], seed });
      stonewall(cv, 0, 14, cv.W, FLOOR, ['#7a7666', '#6a6658', '#86806e', '#5e5a4c'], '#2a281e', seed + 1, 6);
      crust(cv, 0, cv.W, 14, ['#8ccf4a', '#5ea83a', '#3f7e2c'], seed + 2, 3);
      for (const x of [14, 60, 96, 150, 206]) cv.stamp(fern(rng, rng.int(9, 13), {}), PAL, x, FLOOR + 1, { sway: 0 });
      floor(cv, FLOOR, 'flags', R6('#8a8676', { spread: 0.35 }), seed + 3, { joint: '#2e3a22', moss: '#4e7a2e', row: 5 });
      // the pond: a stone-kerbed basin of still water, reeds at its corners
      water(cv, 70, 55, 150, 70, R6('#8a8070'), ['#cfe8ff', '#4a7a9a', '#2e5a78', '#1e4260'], seed + 4);
      block(68, 54, 152, 72);
      cv.stamp(reeds(rng, 16, 6, { heads: 0.5 }), PAL, 74, 57);
      cv.stamp(reeds(rng, 13, 5, { heads: 0.3 }), PAL, 146, 57);
      // a half log to hide under; a dish of worms
      cv.stamp(log(rng, 26, 5, { moss: 'moss' }), PAL, 190, 62);
      block(176, 55, 204, 63);
      cv.stamp(bowl(PAL, 9, 'clay', 'cattail'), PAL, 28, 62);
      wallFront(fg, (c, x0, y0, x1, y1) => stonewall(c, x0, y0, x1, y1, ['#7a7666', '#6a6658', '#86806e'], '#2a281e', seed + 5, 5), R6('#8a8676'));
      return { rack: { x: 36, y: 62 }, nest: [180, 54, 200, 58] };
    },
  },
  salamander: {
    title: 'The hearth pit',
    compose({ cv, fg, rng, seed, block }) {
      const brick = R6('#8a4a34', { spread: 0.4 }), dark = '#2a1610';
      bricks(cv, 0, 0, cv.W, FLOOR, R6('#6a3a2c', { spread: 0.35 }), col(dark), seed);
      hearth(cv, 112, FLOOR, 52, 34, brick, col(dark), seed + 1);
      floor(cv, FLOOR, 'ash', R6('#6a625e', { spread: 0.4 }), seed + 2, { embers: true });
      // flat basking stones in a row, warm from the fire
      for (const x of [62, 112, 162]) { cv.stamp(slab(rng, 16), PAL, x, 66); }
      cv.stamp(bowl(PAL, 9, 'metal', 'food'), PAL, 28, 62);
      // a niche of warm bricks to curl up in
      const nook = denBox(26, 14, { mat: 'clay', door: 10, doorX: 3 });
      cv.stamp(nook, PAL, 192, 58);
      block(178, 53, 206, 59);
      wallFront(fg, (c, x0, y0, x1, y1) => bricks(c, x0, y0, x1, y1, brick, col(dark), seed + 3, { h: 4, w: 9 }), brick);
      return { rack: { x: 36, y: 62 }, nest: [190, 54, 200, 58] };
    },
  },
  deer: {
    title: 'The paddock',
    compose({ cv, fg, rng, seed, block }) {
      outdoors(cv, 40, { sky: ['#4a7ab8', '#d4e4e8'], hills: [24, '#5a7a9a', '#7a96b0'], wood: [38, '#2e5032'], seed });
      floor(cv, 36, 'grass', R6('#5a9a3a', { spread: 0.45 }), seed + 1, { row: 3 });
      cv.stamp(fence(cv.W + 20, 16, 22), PAL, cv.W / 2, FLOOR + 1);
      // the hay rack, the water trough, a shelter against the weather
      cv.stamp(hayRack(20, 22), PAL, 24, 58);
      block(12, 54, 37, 59);
      water(cv, 86, 55, 132, 61, R6('#7a5434'), ['#cfe8ff', '#4a7a9a', '#2e5a78'], seed + 2);
      block(84, 54, 134, 62);
      cv.stamp(denBox(34, 24, { roof: 9, door: 16, doorX: 2 }), PAL, 190, 58);
      block(171, 53, 209, 59);
      for (let i = 0; i < 6; i++) cv.stamp(tuft(rng, 3, { leaf: 'leaf2' }), PAL, rng.int(40, 200), rng.int(66, 74));
      railFront(fg, R6('#7a5434'));
      return { rack: { x: 40, y: 60 }, nest: [182, 53, 198, 58] };
    },
  },
  badger: {
    title: 'The sett',
    compose({ cv, fg, rng, seed, block }) {
      outdoors(cv, 16, { sky: ['#3a5a8a', '#9ab4c8'], wood: [16, '#1e3424'], seed });
      const earth = R6('#6a4a30', { spread: 0.4 });
      earthbank(cv, 0, 14, cv.W, FLOOR, earth, seed + 1);
      crust(cv, 0, cv.W, 14, ['#6ab83e', '#4e9a34', '#3a7428', '#2e5a22'], seed + 2, 4);
      // the sett's tunnel mouths, lined with timber like a mine's
      for (const [cx, w] of [[64, 16], [188, 18]]) {
        fill(cv, cx - w / 2 - 2, FLOOR - 16, cx + w / 2 + 2, FLOOR, (x, y) => {
          const u = (x + 0.5 - cx) / (w / 2), v = (y + 0.5 - (FLOOR - 16 + w / 2)) / (w / 2);
          const inside = y >= FLOOR - 16 + w / 2 ? Math.abs(u) <= 1 : u * u + v * v <= 1;
          if (!inside) { const uo = (x + 0.5 - cx) / (w / 2 + 2), vo = (y + 0.5 - (FLOOR - 16 + w / 2)) / (w / 2 + 2); return (y >= FLOOR - 16 + w / 2 ? Math.abs(uo) <= 1 : uo * uo + vo * vo <= 1) ? earth[0] : 0; }
          return mixPacked(col('#2a1a10'), col('#0a0604'), Math.min(1, (y - (FLOOR - 16)) / 10));
        });
      }
      floor(cv, FLOOR, 'earth', R6('#7a5a3a', { spread: 0.35 }), seed + 3);
      cv.stamp(log(rng, 40, 5, { moss: 'moss' }), PAL, 120, 66);
      block(100, 58, 141, 67);
      cv.stamp(stump(rng, 10, 7), PAL, 150, 58);
      block(144, 54, 157, 59);
      cv.stamp(bowl(PAL, 10), PAL, 26, 62);
      logFront(fg, R6('#5a3e28'), R6('#b88a58', { spread: 0.4 }));
      return { rack: { x: 34, y: 62 }, nest: [180, 52, 196, 56] };
    },
  },
  dove: {
    title: 'The dovecote',
    compose({ cv, fg, rng, seed, block }) {
      const lime = R6('#e2dccc', { spread: 0.25 });
      fill(cv, 0, 0, cv.W, FLOOR, (x, y) => {
        // whitewash, worn through to the bricks in places
        if (fbm2(x * 0.05, y * 0.08, seed, 2) > 0.66) return 0;
        return tex(lime, x, y, seed + 1, { f: 0.06, base: 3 });
      });
      const under = new Canvas(seed, cv.W, FLOOR);
      bricks(under, 0, 0, cv.W, FLOOR, R6('#9a5a44', { spread: 0.35 }), col('#c8bca8'), seed + 2, { h: 4, w: 9 });
      for (let k = 0; k < cv.W * FLOOR; k++) if (!(cv.pix.px[k] >>> 24)) cv.paint(k, under.pix.px[k]);
      pigeonholes(cv, 12, cv.W - 10, 6, 3, R6('#a89a86'), seed + 3);
      fill(cv, 0, FLOOR - 4, cv.W, FLOOR, (x, y) => R6('#8a7a66')[y === FLOOR - 4 ? 4 : 2]);
      floor(cv, FLOOR, 'gravel', R6('#a89a84', { spread: 0.4 }), seed + 4);
      // a perch, a seed tray, a nesting basket
      const perch = new Model();
      for (const s of [-1, 1]) perch.stroke([[s * 14, 0], [s * 14, -12]], 1.8, 'timber', {});
      perch.stroke([[-18, -12], [18, -12]], 2, 'timber', { shade: 'cyl' });
      cv.stamp(perch, PAL, 112, 60);
      block(96, 57, 129, 61);
      cv.stamp(bowl(PAL, 14, 'timber', 'straw'), PAL, 28, 62);
      cv.stamp(basket(18), PAL, 190, 62);
      block(180, 56, 201, 63);
      palingFront(fg, R6('#d8d0bc', { spread: 0.35 }));
      return { rack: { x: 38, y: 62 }, nest: [183, 54, 197, 58] };
    },
  },
  fox: {
    title: 'The fox run',
    compose({ cv, fg, rng, seed, block }) {
      outdoors(cv, 26, { sky: ['#c86a3a', '#f0c88a'], hills: [18, '#7a4a3a', '#8a5a44'], wood: [26, '#3a2a22'], seed });
      wattle(cv, 0, 22, cv.W, FLOOR, R6('#8a6a3e', { spread: 0.45 }), R6('#5a3e28'), seed + 1);
      floor(cv, FLOOR, 'sand', R6('#c8a070', { spread: 0.35 }), seed + 2);
      // a den half sunk in a bank of earth, a log to leap on, a bowl
      const den = denBox(30, 16, { door: 11, doorX: -2 });
      den.poly(lumpy(0, -16, 19, 6, () => 0.5, 0.15, 7), 'bark', { shade: 'round', tex: 1.6 });
      cv.stamp(den, PAL, 190, 59);
      block(174, 53, 207, 60);
      cv.stamp(log(rng, 30, 4), PAL, 112, 64);
      block(96, 58, 128, 65);
      cv.stamp(bowl(PAL, 9), PAL, 26, 62);
      hurdleFront(fg, R6('#8a6a3e', { spread: 0.45 }), R6('#5a3e28'));
      return { rack: { x: 34, y: 62 }, nest: [182, 54, 194, 58] };
    },
  },
  ermine: {
    title: 'The snow run',
    compose({ cv, fg, rng, seed, block }) {
      outdoors(cv, 22, { sky: ['#8aa4c4', '#e4ecf4'], hills: [16, '#c8d4e4', '#e8eef8'], wood: [22, '#4a5a6a'], seed });
      const stones = ['#7a7e86', '#6a6e78', '#868a92', '#5e626a'];
      stonewall(cv, 0, 22, cv.W, FLOOR, stones, '#2a2c32', seed + 1, 6);
      crust(cv, 0, cv.W, 21, ['#ffffff', '#e8eef8', '#c8d4e8'], seed + 2, 3);
      floor(cv, FLOOR, 'snow', R6('#dce6f4', { spread: 0.3, cool: 0.6 }), seed + 3);
      // a cairn of rocks to run in and out of, a stone hut
      const cairn = [[96, 64, 9, 6], [112, 66, 11, 7], [127, 64, 8, 5], [111, 59, 7, 5]];
      for (const [x, y, rx, ry] of cairn) cv.stamp(boulder(rng, rx, ry, { moss: 'snow' }), PAL, x, y);
      block(86, 54, 137, 67);
      cv.stamp(denBox(28, 16, { mat: 'stone', roof: 7, roofMat: 'snow', door: 10, doorX: 3 }), PAL, 190, 59);
      block(174, 53, 207, 60);
      cv.stamp(bowl(PAL, 9, 'metal', 'food'), PAL, 26, 62);
      const paint = (c, x0, y0, x1, y1) => stonewall(c, x0, y0, x1, y1, stones, '#2a2c32', seed + 4, 5);
      paint.snow = ['#ffffff', '#e8eef8', '#c8d4e8'];
      wallFront(fg, paint, R6('#868a92'));
      return { rack: { x: 34, y: 62 }, nest: [186, 54, 198, 58] };
    },
  },
  snail: {
    title: 'The snail garden',
    compose({ cv, fg, rng, seed, block }) {
      outdoors(cv, 12, { sky: ['#6a9ac8', '#c8dce4'], seed });
      hedge(cv, 0, 10, cv.W, FLOOR, R6('#3e7a2a', { spread: 0.55 }), seed + 1);
      floor(cv, FLOOR, 'soil', R6('#5a3e2a', { spread: 0.4 }), seed + 2, { row: 4 });
      // lettuces in a row along the back, the pot to shelter in
      for (let x = 50; x < 170; x += 16) cv.stamp(lettuce(rng, 6), PAL, x + rng.int(-1, 1), 55);
      block(42, 52, 176, 56);
      cv.stamp(pot(6, 20), PAL, 192, 62);
      block(180, 55, 205, 63);
      cv.stamp(lettuce(rng, 5), PAL, 26, 63);
      // the bed's edging board
      boards(fg, 0, fg.H - 9, fg.W, fg.H, R6('#7a5434'), seed + 3, { size: 9 });
      return { rack: { x: 33, y: 63 }, nest: [186, 56, 196, 59] };
    },
  },
  rat: {
    title: 'The cellar',
    compose({ cv, fg, rng, seed, block }) {
      const brick = R6('#6a4a3e', { spread: 0.35 });
      bricks(cv, 0, 0, cv.W, FLOOR, brick, col('#1e1612'), seed, { h: 4, w: 10 });
      // the vault's arches springing from piers, dark in their depth
      for (const cx of [56, 168]) fill(cv, cx - 34, 6, cx + 34, FLOOR - 2, (x, y) => {
        const u = (x + 0.5 - cx) / 34, v = (y + 0.5 - 40) / 34;
        if (y < 40 && u * u + v * v > 1) return 0;
        const rim = y < 40 ? 1 - Math.sqrt(u * u + v * v) : 1 - Math.abs(u);
        return rim < 0.06 ? 0 : mixPacked(cv.pix.px[y * cv.W + x], 0xff000000, 0.45 + (rim > 0.3 ? 0.15 : 0));
      });
      floor(cv, FLOOR, 'flags', R6('#6a645c', { spread: 0.35 }), seed + 1, { joint: '#1e1a16', row: 5 });
      cv.stamp(crate(14), PAL, 100, 60); cv.stamp(crate(11), PAL, 116, 60); cv.stamp(crate(10), PAL, 104, 46);
      block(92, 55, 123, 61);
      cv.stamp(barrel(8, 26), PAL, 188, 61);
      block(174, 52, 206, 62);
      cv.stamp(bowl(PAL, 9, 'metal', 'food'), PAL, 26, 62);
      wallFront(fg, (c, x0, y0, x1, y1) => bricks(c, x0, y0, x1, y1, brick, col('#1e1612'), seed + 3, { h: 4, w: 10 }), brick);
      return { rack: { x: 34, y: 62 }, nest: [196, 54, 204, 58] };
    },
  },
};

/** Kinds with a pen of their own. */
export const PEN_KINDS = Object.keys(PENS);

/** The title of a kind's enclosure. @param {string} kind */
export const penTitle = (kind) => (PENS[kind] ? PENS[kind].title : 'The hutch');

/** @type {Map<string, Pen>} */
const cache = new Map();

/**
 * A kind's enclosure (cached), or null for a kind that has none (the
 * rabbits keep their hutch).
 * @param {string} kind @returns {Pen|null}
 */
export function penOf(kind) {
  const def = PENS[kind];
  if (!def) return null;
  let p = cache.get(kind);
  if (p) return p;
  const seed = hashString(`pen:${PENS_VERSION}:${kind}`);
  const cv = new Canvas(seed, PEN_W, PEN_H), fg = new Canvas(seed + 1, PEN_W, PEN_H);
  // the floor a foot may rest on, less what was set down on it
  const walk = new Uint8Array(PEN_W * PEN_H);
  for (let y = GROUND_Y0; y <= GROUND_Y1; y++) for (let x = 16; x < PEN_W - 14; x++) walk[y * PEN_W + x] = 1;
  const block = (x0, y0, x1, y1) => { for (let y = Math.max(0, y0); y < Math.min(PEN_H, y1); y++) for (let x = Math.max(0, x0); x < Math.min(PEN_W, x1); x++) walk[y * PEN_W + x] = 0; };
  const out = def.compose({ cv, fg, rng: new Rng(seed + 2), seed, block });
  finish(cv, 0.22);
  inkFront(fg);
  /** @type {number[][][]} */
  const ground = [];
  for (let y = GROUND_Y0; y <= GROUND_Y1; y++) {
    const runs = [];
    let start = -1;
    for (let x = 0; x <= PEN_W; x++) {
      const on = x < PEN_W && walk[y * PEN_W + x];
      if (on && start < 0) start = x;
      if (!on && start >= 0) { runs.push([start, x]); start = -1; }
    }
    ground.push(runs);
  }
  p = {
    kind, title: def.title, back: cv.pix, front: fg.pix, y0: GROUND_Y0, ground,
    rack: out.rack, nest: out.nest,
    cloth: out.cloth || [150, 66, 44, 12],
    slots: [[160, 72], [180, 74], [170, 76]],
  };
  cache.set(kind, p);
  return p;
}

