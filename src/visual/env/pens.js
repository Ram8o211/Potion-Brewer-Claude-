// The enclosures of the farm: one for every kind of animal caught in the
// wilds (the Moon Rabbits keep their painted hutch, rendering/hutch-scene.js),
// each a 224 × 92 scene painted procedurally — pure functions of a seed,
// no picture files — in the farm's own look: dusky skies over layered
// tree lines, timber frames with braced posts, lanterns glowing warm,
// heaps of hay, rail fences, open thatched shelters, stone and brick laid in
// courses with moss and vines over their tops. Colour is laid in flat
// tones, a lit edge along the top or left of every piece and a shade along
// the other, with a little texture in broad patches, so each piece reads at
// a glance.
//
// Every pen is a wall or a view behind, things set against it on its back
// line (BACK), and the ground the animals walk on below — their feet on the
// rows GROUND_Y0.. (`ground`, as hutch-ground.js's runs) — with a fringe of
// it in front of their feet (`front`, transparent elsewhere). A kind
// always gets the same pixels (cached).

import { Canvas } from './paint.js';
import { col, silhouette, treeShape } from './side.js';
import { finish } from './cave.js';
import { cobble } from './stone.js';
import { fbm1, fbm2, hash2, noise2 } from '../noise.js';
import { mixPacked } from '../color.js';
import { Rng, hashString } from '../../core/rng.js';

export const PEN_W = 224;
export const PEN_H = 92;
/** Where things stand against the back, and the rows a foot may rest on. */
export const BACK = 67;
export const GROUND_Y0 = 69;
const GROUND_Y1 = 86;

/** Version of the pens' painting (names caches only). */
export const PENS_VERSION = 3;

/**
 * @typedef {Object} Pen
 * @property {string} kind
 * @property {string} title
 * @property {import('../pixels.js').Pixels} back   everything behind the animals
 * @property {import('../pixels.js').Pixels} front  what is drawn over them (transparent elsewhere)
 * @property {number} y0          first row of `ground`
 * @property {number[][][]} ground  per row from y0, the [x0, x1) runs a foot may rest on
 * @property {{x:number, y:number}} rack  where an animal stands to eat (facing left)
 * @property {[number, number][]} slots   where the bodies lie
 * @property {[number, number, number, number]} cloth  the cloth they lie on (x, y, w, h)
 * @property {[number, number, number, number]} nest   where nest straw goes while a female is expecting (x0, y0, x1, y1)
 */

/** Ramps of the farm's materials, darkest first. */
const P = {
  wood: ['#1e1018', '#40241a', '#68401f', '#8e5c2c', '#b88242', '#e0b070'].map(col),
  oak: ['#160c14', '#2e1c1a', '#4a3020', '#684828', '#8c6a3c', '#b4945c'].map(col),
  straw: ['#4a2a12', '#82561a', '#b8862a', '#e0ae3a', '#f6d260', '#fff2b0'].map(col),
  thatch: ['#3a2414', '#6e4c22', '#9c7432', '#c49e48', '#e2c46a', '#f8e4a0'].map(col),
  stone: ['#1a1a24', '#363844', '#525460', '#6e7078', '#92929a', '#bcbcc0'].map(col),
  brick: ['#1e0e10', '#42201a', '#6a3224', '#8a4630', '#ae6242', '#d08a60'].map(col),
  plaster: ['#3a2c3c', '#584658', '#766676', '#968696', '#b4a8b2', '#d2c8cc'].map(col),
  lime: ['#6e6a66', '#948e84', '#b4ac9e', '#cec6b4', '#e4dccc', '#f8f4e8'].map(col),
  earth: ['#180c0c', '#301c14', '#4c3020', '#6a462a', '#8a6238', '#ae8450'].map(col),
  dirt: ['#2a1a1a', '#4a3226', '#6a4c34', '#8a6644', '#ac8656', '#cca870'].map(col),
  grass: ['#122a1c', '#1e4a24', '#30682a', '#4a8a30', '#6eae3a', '#9ccc52'].map(col),
  leaf: ['#0e2218', '#183a22', '#265630', '#3a7438', '#5a9840', '#88bc56'].map(col),
  moss: ['#1e3a1a', '#336022', '#4e862a', '#72aa34', '#9ccc44', '#ccec6c'].map(col),
  snow: ['#6a7a98', '#94a4c0', '#bccadc', '#dae2ee', '#eef2f8', '#ffffff'].map(col),
  water: ['#0c1c3a', '#16305c', '#22487e', '#36649e', '#6a9ccc', '#c8e6fa'].map(col),
  tile: ['#2a0c0e', '#521a16', '#7a2a20', '#9c3e2a', '#c05a3a', '#e08458'].map(col),
  iron: ['#0c0c12', '#1e1e28', '#34343e', '#52525e'].map(col),
  red: ['#2e0a0e', '#5a1418', '#8e2622', '#c4402e'].map(col),
  ink: col('#100810'),
};

const clampI = (v, a, b) => (v < a ? a : v > b ? b : v);

/** Paint every pixel of a rectangle with fn(x, y) (a colour, or 0 to leave it). */
function fill(cv, x0, y0, x1, y1, fn) {
  for (let y = Math.max(0, Math.floor(y0)); y < Math.min(cv.H, Math.ceil(y1)); y++) for (let x = Math.max(0, Math.floor(x0)); x < Math.min(cv.W, Math.ceil(x1)); x++) {
    const c = fn(x, y);
    if (c) cv.set(x, y, c);
  }
}
const rect = (cv, x0, y0, x1, y1, c) => fill(cv, x0, y0, x1, y1, () => c);
/** A broad patch pattern, sampled on 2-pixel blocks so it steps chunkily. */
const patch = (x, y, seed, f = 0.09) => fbm2((x >> 1) * f * 2, (y >> 1) * f * 2.6, seed, 2);

// ------------------------------------------------------------------ skies and views

/** A smooth sky down to row y1, faintly dithered. @param {number[]} a @param {number[]} b */
function sky(cv, y1, a, b) {
  for (let y = 0; y < y1; y++) {
    const t = y / Math.max(1, y1 - 1);
    for (let x = 0; x < cv.W; x++) {
      const d = (((x & 1) ^ (y & 1)) - 0.5) * 0.012;
      const c = a.map((v, k) => clampI(v + (b[k] - v) * t + d, 0, 1));
      cv.set(x, y, ((255 << 24) | (Math.round(c[2] * 255) << 16) | (Math.round(c[1] * 255) << 8) | Math.round(c[0] * 255)) >>> 0);
    }
  }
}
const rgb = (h) => { const c = col(h); return [(c & 255) / 255, ((c >>> 8) & 255) / 255, ((c >>> 16) & 255) / 255]; };

/** A line of trees against the sky: pines and round crowns, filled down to `bottom`. */
function treeline(cv, base, colour, seed, o = {}) {
  const r = new Rng(seed), c = col(colour), before = o.snow ? cv.pix.px.slice() : null;
  const h = o.h ?? [10, 18];
  for (let x = -4; x < cv.W + 4; x += r.int(4, 9)) {
    treeShape(cv, x, base + r.int(0, 2), r.int(h[0], h[1]), r.next() < (o.pines ?? 0.55) ? 'pine' : 'oak', colour, seed + x);
  }
  rect(cv, 0, base, cv.W, o.bottom ?? base + 6, c);
  if (before) {
    // snow lying along the tops of the trees' tiers
    const sn = col(o.snow), px = cv.pix.px, W = cv.W, tree = (k) => px[k] !== before[k];
    for (let k = px.length - 1; k >= W; k--) if (tree(k) && !tree(k - W) && hash2(k % W, (k / W) | 0, seed) > 0.25) { cv.paint(k, sn); if (tree(k + W)) cv.paint(k + W, mixPacked(sn, c, 0.4)); }
  }
}

/** Far hills, flat, a little lighter along their crest. */
function hills(cv, base, amp, fill_, rim, seed) {
  silhouette(cv, { base, amp, freq: 0.018, seed, fill: fill_, rim, bottom: base + amp + 20 });
}

/** Falling snow: flakes a pixel (or two) across. */
function flakes(cv, y1, seed, n) {
  const r = new Rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r.int(0, cv.W - 2), y = r.int(0, y1);
    cv.set(x, y, P.snow[5]);
    if (r.next() < 0.25) cv.set(x + 1, y, P.snow[4]);
  }
}

// ------------------------------------------------------------------ separation

/**
 * Draw a piece of the scene so it stands apart from what is behind it:
 * whatever `draw` paints is outlined — a dark contour on what lies round it,
 * deeper below and to the right where its shadow falls (the light comes
 * from the upper left), fainter above and to the left — so wood against
 * wood, hay against earth or stone against stone never run together.
 * @param {Canvas} cv @param {() => void} draw
 */
function layer(cv, draw) {
  const px = cv.pix.px, W = cv.W, H = cv.H, before = px.slice();
  draw();
  const m = new Uint8Array(W * H);
  for (let k = 0; k < m.length; k++) if (px[k] !== before[k]) m[k] = 1;
  const shade = col('#0c0610');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = y * W + x;
    if (m[k]) continue;
    // its shadow, cast down and to the right
    if ((x > 0 && m[k - 1]) || (y > 0 && m[k - W]) || (x > 0 && y > 0 && m[k - W - 1])) cv.paint(k, mixPacked(px[k], shade, 0.5));
    else if ((x < W - 1 && m[k + 1]) || (y < H - 1 && m[k + W])) cv.paint(k, mixPacked(px[k], shade, 0.28));
  }
}

/** A drawing function made into one that draws a piece standing apart (layer). @template {Function} F @param {F} fn @returns {F} */
const prop = (fn) => /** @type {any} */ ((cv, ...a) => { let out; layer(cv, () => { out = fn(cv, ...a); }); return out; });

// ------------------------------------------------------------------ timber

/**
 * A piece of wood: its body, a lit edge (top, or left when upright), a
 * shaded edge, and grain running along it.
 * @param {number[]} R ramp @param {{vertical?:boolean, seed?:number}} [o]
 */
function wood(cv, x0, y0, x1, y1, R, o = {}) {
  const v = !!o.vertical, seed = o.seed ?? 7, th = Math.round(v ? x1 - x0 : y1 - y0);
  // each piece its own shade of the wood, a little lighter or darker than the next
  const tone = Math.floor(hash2(Math.round(x0), Math.round(y0), seed + 77) * 3) - 1;
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const along = v ? y : x, across = Math.floor(v ? x - x0 : y - y0);
    if (across === 0) return R[5];
    if (across === th - 1) return R[0];
    let i = 2 + (tone > 0 && th > 2 ? 1 : 0);
    if (across === 1 && th > 3) i = 4;
    else {
      // grain: dark streaks and pale ones running along it
      const g = noise2(along * 0.2, (across + seed) * 1.9, seed);
      if (g > 0.68) i = 1; else if (g < 0.2) i = Math.min(4, i + 1);
      if (tone < 0 && i > 1) i--;
    }
    // a knot now and then: a dark eye ringed lighter
    const kn = hash2(Math.floor(along / 9), Math.floor(across / 4), seed + 3);
    if (kn > 0.93 && th > 3 && across > 0 && across < th - 1 && along % 9 === 4) return R[0];
    if (i >= 2 && hash2(x, y, seed) > 0.975) i = 1;
    return R[i];
  });
}

/** A diagonal brace of width w from (ax, ay) to (bx, by), lit along its upper side. */
function brace(cv, ax, ay, bx, by, w, R) {
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  fill(cv, Math.min(ax, bx) - w, Math.min(ay, by) - w, Math.max(ax, bx) + w + 1, Math.max(ay, by) + w + 1, (x, y) => {
    const px = x + 0.5 - ax, py = y + 0.5 - ay, t = (px * dx + py * dy) / (L * L);
    if (t < 0 || t > 1) return 0;
    const d = px * nx + py * ny;
    if (Math.abs(d) > w / 2) return 0;
    const up = ny < 0 ? -d : d;
    return R[up > w / 2 - 1 ? 4 : up < -w / 2 + 1 ? 0 : noise2(t * L * 0.2, d, 3) > 0.65 ? 1 : 2];
  });
}

/** A timber frame across the top: a beam, posts down to the back line, knee braces. */
function frame_(cv, beamY, posts, R, o = {}) {
  wood(cv, 0, beamY, cv.W, beamY + 5, R, { seed: 11 });
  for (const x of posts) {
    wood(cv, x - 2, beamY + 5, x + 3, o.foot ?? BACK, R, { vertical: true, seed: x });
    for (const s of [-1, 1]) {
      const bx = x + s * 12;
      if (bx < -2 || bx > cv.W + 2) continue;
      brace(cv, x + s * 2, beamY + 15, bx, beamY + 4, 3, R);
    }
  }
}

/** A lantern hanging on a chain from row y0, its glass at (x, y), its light on everything round it. */
function lantern_(cv, x, y0, y) {
  for (let j = y0; j < y - 3; j++) cv.set(x, j, (j & 1) ? P.iron[2] : P.iron[1]);
  rect(cv, x - 2, y - 3, x + 3, y - 1, P.iron[1]);
  cv.set(x - 1, y - 3, P.iron[3]);
  rect(cv, x - 3, y - 1, x + 4, y, P.iron[2]);
  for (let j = 0; j < 6; j++) for (let i = -2; i <= 2; i++) {
    const edge = Math.abs(i) === 2;
    cv.set(x + i, y + j, edge ? P.iron[1] : j > 0 && j < 5 ? col(i === 0 && j > 1 && j < 4 ? '#fff4c0' : '#ffbe48') : col('#e08a2a'));
  }
  rect(cv, x - 3, y + 6, x + 4, y + 7, P.iron[2]);
  cv.glow(x, y + 3, 40, [1, 0.72, 0.36], 0.42);
}

/** A rail fence along the back: posts with caps lit, `rails` rails between them. */
function railFence_(cv, x0, x1, base, h, R, o = {}) {
  const gap = o.gap ?? 26, rails = o.rails ?? 2;
  for (let r = 0; r < rails; r++) {
    const y = base - h + 4 + Math.round((r * (h - 9)) / Math.max(1, rails - 1));
    wood(cv, x0, y, x1, y + 3, R, { seed: r + 3 });
  }
  for (let x = x0; x <= x1; x += gap) {
    const px = Math.min(x, x1 - 4);
    wood(cv, px, base - h, px + 4, base, R, { vertical: true, seed: px });
    rect(cv, px, base - h, px + 4, base - h + 1, R[5]);
  }
}

/** A tall fence of boards side by side, on posts and two rails. */
function boardFence_(cv, x0, x1, top, base, R, seed) {
  for (let x = x0; x < x1; x += 6) {
    const t = top + (hash2(x, 1, seed) > 0.6 ? 1 : 0);
    wood(cv, x, t, x + 6, base, R, { vertical: true, seed: x + seed });
    rect(cv, x, t, x + 6, t + 1, R[3]);
  }
  for (const y of [top + 6, base - 10]) wood(cv, x0, y, x1, y + 3, R.map((c) => mixPacked(c, 0xff000000, 0.08)), { seed: y });
  for (let x = x0 + 14; x < x1; x += 40) { wood(cv, x, top - 2, x + 5, base, R, { vertical: true, seed: x * 3 }); rect(cv, x, top - 2, x + 5, top - 1, R[5]); }
}

/** A board wainscot: upright boards of uneven height along the wall's foot. */
function wainscot(cv, x0, x1, top, base, R, seed) {
  // it is the wall: a shade deeper than the furniture standing against it
  const D = R.map((c) => mixPacked(c, col('#140a14'), 0.3));
  for (let x = x0; x < x1; x += 5) {
    const t = top + Math.floor(hash2(x, 2, seed) * 3);
    wood(cv, x, t, x + 5, base, D, { vertical: true, seed: x + seed });
  }
}

/** A post wound with rope. */
function ropePost_(cv, x, top, base) {
  wood(cv, x - 2, top, x + 3, base, P.wood, { vertical: true, seed: x });
  for (let y = top + 2; y < base - 1; y += 3) for (let i = -2; i < 3; i++) { cv.set(x + i, y, P.straw[i < 0 ? 4 : 3]); cv.set(x + i, y + 1, P.straw[2]); }
}

/** A table: a top of planks on legs. */
function table_(cv, x0, x1, top, base, R) {
  for (const lx of [x0 + 2, x1 - 6]) wood(cv, lx, top + 3, lx + 4, base, R, { vertical: true, seed: lx });
  wood(cv, x0, top, x1, top + 4, R, { seed: 21 });
  rect(cv, x0, top + 4, x1, top + 5, R[0]);
}

/** A shelf on two brackets. */
function shelf_(cv, x0, x1, y, R) {
  wood(cv, x0, y, x1, y + 3, R, { seed: x0 });
  for (const bx of [x0 + 4, x1 - 8]) wood(cv, bx, y + 3, bx + 3, y + 9, R, { vertical: true, seed: bx });
}

/** A bundle of red cloth, a loaf, a pot: small things on a shelf or a table. @param {'cloth'|'bread'|'pot'} what */
function item_(cv, x, y, what) {
  if (what === 'cloth') { rect(cv, x, y - 3, x + 10, y, P.red[2]); rect(cv, x, y - 3, x + 10, y - 2, P.red[3]); rect(cv, x, y - 1, x + 10, y, P.red[1]); }
  else if (what === 'bread') { for (let i = 0; i < 6; i++) { cv.set(x + i, y - 1, P.straw[3]); if (i > 0 && i < 5) cv.set(x + i, y - 2, P.straw[4]); } }
  else { rect(cv, x, y - 5, x + 6, y, P.iron[2]); rect(cv, x + 1, y - 5, x + 5, y - 4, P.iron[3]); rect(cv, x - 1, y - 5, x + 7, y - 4, P.iron[1]); }
}

/** An upright barrel: staves rounded by the light, two iron hoops. */
function barrel_(cv, cx, base, w, h) {
  fill(cv, cx - w / 2, base - h, cx + w / 2, base, (x, y) => {
    const u = (x + 0.5 - cx) / (w / 2), j = base - y;
    let i = u < -0.5 ? 3 : u < 0.1 ? 4 : u < 0.6 ? 2 : 1;
    if ((x - Math.round(cx - w / 2)) % 3 === 0) i = Math.max(0, i - 1);
    if (j === Math.round(h * 0.25) || j === Math.round(h * 0.75)) return P.iron[u < 0 ? 3 : 1];
    if (y === base - h) i = 5;
    return P.wood[i];
  });
}

/** A crate: a frame of boards with a cross brace. */
function crate_(cv, x0, base, s, R = P.wood) {
  const y0 = base - s;
  fill(cv, x0, y0, x0 + s, base, (x, y) => {
    const e = Math.min(x - x0, x0 + s - 1 - x, y - y0, base - 1 - y);
    if (e < 2) return R[e === 0 ? (y === y0 || x === x0 ? 4 : 1) : 3];
    const d = Math.abs((x - x0) - (y - y0));
    if (d < 2) return R[d === 0 ? 4 : 3];
    return R[(y - y0) % 4 === 0 ? 1 : 2];
  });
}

/** A heap of hay: a lumpy mound of strands, lit on top, a few loose wisps round it. */
function hay_(cv, cx, base, w, h, seed) {
  const hw = w / 2;
  for (let x = Math.floor(cx - hw - 3); x <= cx + hw + 3; x++) {
    const u = (x + 0.5 - cx) / hw;
    if (Math.abs(u) <= 1) {
      const top = Math.round(base - h * Math.sqrt(1 - u * u) * (0.82 + 0.3 * fbm1(x * 0.3, seed, 2)));
      for (let y = top; y < base; y++) {
        const s = noise2(x * 0.7 + y * 0.6, y * 0.5, seed);
        let i = s > 0.62 ? 4 : s > 0.42 ? 3 : 2;
        if (y === top) i = 5; else if (y === top + 1) i = 4;
        if (base - y < 2) i -= 1;
        if (hash2(x, y, seed) > 0.94) i = 1;
        cv.set(x, y, P.straw[clampI(i, 0, 5)]);
      }
    }
    if (hash2(x, 3, seed) > 0.55) cv.set(x, base - (hash2(x, 4, seed) > 0.7 ? 1 : 0), P.straw[hash2(x, 5, seed) > 0.5 ? 4 : 2]);
  }
}

/** A thatch: straw laid in rows down a slope from (x0, y0) to (x1, y1), `t` thick, lit along its top. */
function thatch(cv, x0, y0, x1, y1, t, seed) {
  for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
    const u = (x - x0) / (x1 - x0 || 1), top = Math.round(y0 + (y1 - y0) * u);
    // a ragged lower edge where the bundles end
    const th = t + Math.floor(hash2(x >> 1, 1, seed) * 3);
    for (let j = -1; j < th; j++) {
      if (j === -1 && hash2(x >> 1, 2, seed) < 0.5) continue;
      // the straw runs down the slope in strands
      const s = noise2(x * 0.9 + j * 0.35, j * 0.25, seed);
      let i = j <= 0 ? 5 : j === 1 ? 4 : s > 0.62 ? 4 : s > 0.36 ? 3 : 2;
      if (j === th - 1) i = 1; else if (j === th - 2) i = Math.min(i, 2);
      if (hash2(x, j, seed) > 0.95) i = 1;
      cv.set(x, top + j, P.thatch[clampI(i, 0, 5)]);
    }
  }
}

/** An open-fronted shelter: a thatched roof sloping one way, posts, a dark plank back, hay inside. */
function shelter_(cv, x0, x1, base, h, seed, o = {}) {
  const top = base - h;
  // the inside: a dark plank back wall and its shade
  fill(cv, x0 + 3, top + 4, x1 - 3, base, (x, y) => {
    const board = Math.floor((x - x0) / 7), bx = (x - x0) % 7;
    const c = bx === 0 ? P.oak[0] : P.oak[1 + (hash2(board, 1, seed) > 0.6 ? 1 : 0)];
    return mixPacked(c, 0xff000000, Math.max(0, 0.45 - (y - top) * 0.012));
  });
  wood(cv, x0 + 3, base - 14, x1 - 3, base - 11, P.oak, { seed: 5 });
  hay(cv, (x0 + x1) / 2 + 3, base, (x1 - x0) * 0.5, 9, seed + 1);
  // posts at the corners, a brace in the open front
  wood(cv, x0, top + 2, x0 + 4, base, P.wood, { vertical: true, seed: x0 });
  wood(cv, x1 - 4, top + 6, x1, base, P.wood, { vertical: true, seed: x1 });
  brace(cv, x0 + 3, top + 14, x0 + 13, top + 5, 3, P.wood);
  // the roof, overhanging, sloping down to the right
  thatch(cv, x0 - 6, top - 5, x1 + 6, top + 5, o.roof ?? 8, seed + 2);
}

/** A water trough: a box of planks, the water's surface catching the sky. */
function trough_(cv, x0, x1, base, h) {
  wood(cv, x0, base - h, x1, base, P.wood, { seed: 9 });
  rect(cv, x0 + 2, base - h, x1 - 2, base - h + 2, P.water[3]);
  rect(cv, x0 + 3, base - h, x1 - 6, base - h + 1, P.water[5]);
  for (const x of [x0, x1 - 3]) wood(cv, x, base - h - 2, x + 3, base, P.wood, { vertical: true, seed: x });
}

/** A dog house: plank walls, a pitched roof (snowed on, or tiled), an arched dark door. */
function doghouse_(cv, cx, base, w, h, o = {}) {
  const x0 = cx - w / 2, x1 = cx + w / 2, top = base - h;
  fill(cv, x0, top, x1, base, (x, y) => P.dirt[(y - top) % 4 === 0 ? 3 : (x - x0) > w * 0.7 ? 4 : 5]);
  // the door
  fill(cv, cx - 4, base - 10, cx + 5, base, (x, y) => {
    const u = (x - cx) / 4.5, v = (y + 0.5 - (base - 6)) / 4.5;
    return y < base - 6 && u * u + v * v > 1 ? 0 : P.ink;
  });
  // the roof
  const half = w / 2 + 4;
  for (let i = 0; i <= half; i++) for (let j = 0; j < 4; j++) {
    for (const s of [-1, 1]) cv.set(Math.round(cx + s * i), Math.round(top - (half - i) * 0.7 + j), o.snow ? P.snow[j === 0 ? 5 : j === 1 ? 4 : 2] : P.tile[j === 0 ? 5 : j > 2 ? 2 : 3]);
  }
}

// ------------------------------------------------------------------ masonry and earth

/** Stone laid in courses: big rounded stones in a dark mortar, each lit on top. */
function stonewall(cv, x0, y0, x1, y1, R, seed, s = 9) {
  const t = { stones: [R[2], R[3], R[2], R[4], R[3]], mortar: R[0], s, seed, flat: 1.9 };
  fill(cv, x0, y0, x1, y1, (x, y) => cobble(x, y, t));
}

/** Bricks in courses: each its own tone, lit along its top, a mortar line under each course. */
function bricks(cv, x0, y0, x1, y1, R, seed, o = {}) {
  const bh = o.h ?? 4, bw = o.w ?? 9, mortar = o.mortar ?? R[0];
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const row = Math.floor((y - y0) / bh), at = (y - y0) % bh, sx = x + (row & 1) * Math.floor(bw / 2), b = Math.floor(sx / bw), bx = sx % bw;
    if (at === bh - 1 || bx === 0) return mortar;
    const t = hash2(b, row, seed);
    let i = t < 0.25 ? 1 : t > 0.8 ? 3 : 2;
    if (at === 0 && bx < bw - 1) i++;
    // the brick's own grain: a few flecks lighter and darker
    const g = hash2(x, y, seed + 4);
    if (g > 0.93) i++; else if (g < 0.06) i--;
    return R[clampI(i, 0, 5)];
  });
}

/** A wall's top grown over: a mat of moss with tufts, and strands of vine hanging down its face. */
function overgrowth(cv, x0, x1, y, R, seed, o = {}) {
  const len = o.len ?? [3, 14], rate = o.rate ?? 0.18;
  for (let x = x0; x < x1; x++) {
    const d = 2 + Math.floor(patch(x, 0, seed, 0.2) * 4);
    for (let j = -1; j < d; j++) {
      if (j === -1 && hash2(x >> 1, 9, seed) < 0.6) continue;
      cv.set(x, y + j, R[j <= 0 ? 5 : j === 1 ? 4 : j > 3 ? 2 : 3]);
    }
    // a strand of vine, leaves on alternate sides, darker down to its tip
    if (hash2(x, 3, seed) < rate * fbm1(x * 0.08, seed, 2) * 2) {
      const L = len[0] + Math.floor(hash2(x, 4, seed) * (len[1] - len[0]));
      for (let j = d; j < d + L; j++) {
        cv.set(x, y + j, R[clampI(4 - Math.floor(((j - d) / L) * 3), 1, 5)]);
        if ((j - d) % 3 === 1) cv.set(x + ((Math.floor((j - d) / 3) & 1) ? 1 : -1), y + j, R[3]);
      }
      if (o.flower && hash2(x, 6, seed) > 0.7) { cv.set(x, y + d + L, col(o.flower)); cv.set(x + 1, y + d + L, col(o.flower)); }
    }
  }
}

/** Snow lying on a top: a lumpy white cap, icicles below it. */
function snowcap(cv, x0, x1, y, seed) {
  for (let x = x0; x < x1; x++) {
    const up = Math.round(patch(x, 0, seed, 0.25) * 3), d = 4;
    for (let j = -up; j < d; j++) cv.set(x, y + j, P.snow[j === -up ? 5 : j < d - 1 ? 4 : 2]);
    if (hash2(x, 1, seed) > 0.72) {
      const L = 2 + Math.floor(hash2(x, 2, seed) * 6);
      for (let j = 0; j < L; j++) cv.set(x, y + d + j, P.snow[j < L - 2 ? 3 : 1]);
      if (L > 4) cv.set(x + 1, y + d, P.snow[3]);
    }
  }
}

/** A bank of earth: the ground's own material in broad patches, stones in it, darker deeper in. */
function earthbank(cv, x0, y0, x1, y1, R, seed) {
  fill(cv, x0, y0, x1, y1, (x, y) => {
    const m = patch(x, y, seed, 0.07);
    let i = m > 0.58 ? 3 : m < 0.38 ? 1 : 2;
    if (hash2(x >> 1, y >> 1, seed + 2) > 0.988) return P.stone[3];
    if (y - y0 < 3) i++;
    return R[clampI(i + 1 - Math.floor((y - y0) / 22), 0, 5)];
  });
}

/** A burrow into a bank: a dark rounded mouth, its rim worn, hay in its floor. */
function burrow(cv, cx, base, w, h, seed) {
  const r = w / 2, cy = base - h + r;
  fill(cv, cx - r - 2, base - h - 2, cx + r + 2, base, (x, y) => {
    const u = (x + 0.5 - cx) / r, v = (y + 0.5 - cy) / r;
    const inside = y >= cy ? Math.abs(u) <= 1 : u * u + v * v <= 1;
    if (inside) return mixPacked(col('#1a100a'), col('#06040a'), clampI((y - (base - h)) / h, 0, 1) * 0.8);
    const uo = (x + 0.5 - cx) / (r + 2), vo = (y + 0.5 - cy) / (r + 2);
    const rim = y >= cy ? Math.abs(uo) <= 1 : uo * uo + vo * vo <= 1;
    return rim ? P.earth[y < cy ? 1 : 0] : 0;
  });
  hay(cv, cx, base, w * 0.75, 4, seed);
}

/** A pond in a basin of stone blocks, its water still. */
function pond_(cv, x0, x1, top, base, seed) {
  fill(cv, x0, top, x1, base, (x, y) => {
    const d = y - top;
    let i = d === 0 ? 4 : d < 3 ? 3 : d < 6 ? 2 : 1;
    if (noise2(x * 0.25, y * 1.4, seed) > 0.72) i = 5;
    return P.water[i];
  });
  for (const bx of [x0 - 10, x1 - 2]) stonewall(cv, bx, top - 6, bx + 12, base, P.stone, seed + bx, 7);
}

/** A hand pump on a post, spout and handle, a bucket under it. */
function pump_(cv, x, base) {
  wood(cv, x, base - 22, x + 4, base, P.wood, { vertical: true, seed: x });
  rect(cv, x - 1, base - 23, x + 5, base - 21, P.iron[2]);
  rect(cv, x - 8, base - 21, x, base - 19, P.iron[2]);
  rect(cv, x - 8, base - 19, x - 6, base - 16, P.iron[1]);
  rect(cv, x + 4, base - 24, x + 10, base - 23, P.iron[3]);
  wood(cv, x - 11, base - 7, x - 3, base, P.oak, { vertical: true, seed: 3 });
  rect(cv, x - 11, base - 5, x - 3, base - 4, P.iron[2]);
  rect(cv, x - 10, base - 7, x - 4, base - 6, P.water[4]);
}

/** Flowers on short stems. */
function flowers(cv, x0, x1, base, colours, seed, n) {
  const r = new Rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r.int(x0, x1), h = r.int(2, 5), c = col(r.pick(colours));
    for (let j = 1; j <= h; j++) cv.set(x, base - j, P.grass[3]);
    cv.set(x, base - h - 1, c); cv.set(x - 1, base - h, c); cv.set(x + 1, base - h, c); cv.set(x, base - h, col('#ffe680'));
  }
}

/** Grass tufts standing up from a line. */
function tufts(cv, x0, x1, base, seed, rate = 0.5, R = P.grass) {
  for (let x = x0; x < x1; x++) {
    if (hash2(x, 7, seed) > rate) continue;
    const h = 1 + Math.floor(hash2(x, 8, seed) * 4);
    for (let j = 1; j <= h; j++) cv.set(x, base - j, R[clampI(2 + j, 0, 5)]);
  }
}

/** A bank of foliage: clumps of leaves layered back to front, each lit on its upper left. */
function foliage(cv, y0, y1, seed) {
  const r = new Rng(seed);
  for (let layer = 0; layer < 3; layer++) {
    const dark = 2 - layer;
    for (let x = -8; x < cv.W + 8; x += r.int(10, 16)) {
      const rx = r.int(9, 15), ry = r.int(7, 11), cy = y0 + 6 + layer * 9 + r.int(-2, 3);
      fill(cv, x - rx, cy - ry, x + rx, y1, (px, py) => {
        const u = (px + 0.5 - x) / rx, v = (py + 0.5 - cy) / ry;
        if (py < cy && u * u + v * v + (hash2(px >> 1, py >> 1, seed + layer) - 0.5) * 0.35 > 1) return 0;
        if (Math.abs(u) > 1.05) return 0;
        const lit = -u * 0.5 - v * 0.8, n = noise2(px * 0.45, py * 0.45, seed + layer);
        const i = 2 + (lit > 0.45 ? 2 : lit > 0 ? 1 : 0) + (n > 0.68 ? 1 : n < 0.25 ? -1 : 0) - dark;
        return P.leaf[clampI(i, 0, 5)];
      });
    }
  }
}

/** A raised planter of boards with greens growing in it. */
function planter_(cv, x0, x1, base, h, seed) {
  const r = new Rng(seed);
  for (let x = x0 + 2; x < x1 - 2; x += 4) {
    const ph = r.int(7, 13);
    for (let j = 0; j < ph; j++) {
      cv.set(x, base - h - j, P.grass[3]);
      // leaves in pairs up the stem, lighter at the top
      if (j > 1 && j % 2 === 0) for (const s2 of [-1, 1]) { cv.set(x + s2, base - h - j, P.moss[j > ph - 4 ? 5 : 3]); cv.set(x + 2 * s2, base - h - j + 1, P.moss[j > ph - 4 ? 4 : 2]); }
    }
    cv.set(x, base - h - ph, P.moss[5]);
  }
  wood(cv, x0, base - h, x1, base, P.brick.map((c) => mixPacked(c, col('#8a4a32'), 0.3)), { seed: 13 });
  rect(cv, x0, base - h, x1, base - h + 1, P.earth[2]);
}

/** A bench of planks. */
function bench_(cv, x0, x1, base) {
  wood(cv, x0, base - 8, x1, base - 5, P.wood, { seed: 17 });
  for (const lx of [x0 + 2, x1 - 5]) wood(cv, lx, base - 5, lx + 3, base, P.wood, { vertical: true, seed: lx });
  wood(cv, x0 + 1, base - 13, x0 + 4, base - 8, P.wood, { vertical: true, seed: 2 });
  wood(cv, x0 + 1, base - 14, x1 - 1, base - 12, P.wood, { seed: 19 });
}

/** A roof of red tiles along the top: rows of round-ended tiles, the eaves' shadow under them. */
function tiles(cv, y1, seed) {
  for (let y = 0; y < y1; y++) for (let x = 0; x < cv.W; x++) {
    const row = Math.floor(y / 4), at = y % 4, tx = (x + (row & 1) * 3) % 6, t = hash2(Math.floor((x + (row & 1) * 3) / 6), row, seed);
    let i = t < 0.3 ? 2 : t > 0.8 ? 4 : 3;
    if (at === 3 && (tx === 0 || tx === 5)) i = 0; else if (at === 3) i = 1; else if (tx === 0) i = 1; else if (at === 0 && tx < 4) i = 5;
    cv.set(x, y, P.tile[i]);
  }
  rect(cv, 0, y1, cv.W, y1 + 2, mixPacked(P.lime[1], 0xff000000, 0.5));
}

/** Rows of pigeonholes: arched niches, each with a wooden ledge, some with nest hay. */
function pigeonholes(cv, x0, x1, y0, rows, seed) {
  for (let r = 0; r < rows; r++) for (let x = x0 + (r & 1) * 9; x + 9 < x1; x += 18) {
    const y = y0 + r * 17;
    fill(cv, x, y, x + 9, y + 10, (xx, yy) => {
      const u = (xx + 0.5 - (x + 4.5)) / 4.5, v = (yy + 0.5 - (y + 4.5)) / 4.5;
      if (yy < y + 4.5 && u * u + v * v > 1) return 0;
      return yy - y < 3 ? col('#140c10') : col('#22161a');
    });
    wood(cv, x - 2, y + 10, x + 11, y + 12, P.wood, { seed: x + r });
    wood(cv, x, y + 12, x + 2, y + 14, P.wood, { vertical: true, seed: 1 });
    wood(cv, x + 7, y + 12, x + 9, y + 14, P.wood, { vertical: true, seed: 2 });
    if (hash2(x, r, seed) > 0.65) hay(cv, x + 4.5, y + 10, 7, 2, seed + x);
  }
}

/** A vaulted arch in a brick wall: a ring of stone voussoirs round a dark hollow. */
function arch(cv, cx, base, r, legs, seed) {
  const cy = base - legs;
  fill(cv, cx - r - 6, cy - r - 6, cx + r + 6, base, (x, y) => {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = y < cy ? Math.hypot(dx, dy) : Math.abs(dx);
    if (d <= r) return mixPacked(col('#1e1418'), col('#0a0608'), clampI((y - (cy - r)) / (r + legs), 0, 1) * 0.5 + 0.3);
    if (d <= r + 6) {
      // the voussoirs: wedges round the arch (blocks down its legs), each its own tone, joints dark
      const a = y < cy ? Math.atan2(dy, dx) + Math.PI : 100 + Math.floor(dy / 6);
      const k = y < cy ? Math.floor(a / 0.3) : a, joint = (y < cy ? (a / 0.3) % 1 < 0.14 : (dy | 0) % 6 === 5) || d > r + 5;
      if (joint) return P.stone[0];
      const t = hash2(k, dx > 0 ? 1 : 0, seed);
      return P.stone[d < r + 2 ? 4 : t > 0.6 ? 3 : 2];
    }
    return 0;
  });
}

// ------------------------------------------------------------------ the ground

/**
 * The ground from row y0 down: style dirt, flags, cobble, grass, snow,
 * soil — darkest in the shade of the back, in broad patches, a few stones
 * and bits of straw in it.
 */
function ground(cv, y0, style, seed, o = {}) {
  const R = style === 'grass' ? P.grass : style === 'snow' ? P.snow : style === 'soil' ? P.earth : style === 'flags' || style === 'cobble' ? P.stone : P.dirt;
  const s = { stones: [P.stone[2], P.stone[3], P.stone[2], P.stone[4]], mortar: P.stone[0], s: 6, seed, flat: 1.4 };
  fill(cv, 0, y0, cv.W, cv.H, (x, y) => {
    const d = y - y0, m = patch(x, y, seed, 0.08);
    let c;
    if (style === 'cobble') c = cobble(x, y, s);
    else if (style === 'flags') {
      const rh = 5 + Math.floor(d / 9), row = Math.floor(d / rh), at = d % rh, w = 14 + rh * 2, v = x + Math.floor(hash2(row, 1, seed) * w);
      if (at === rh - 1 || v % w === 0) c = o.joint ? col(o.joint) : R[0];
      else c = R[(hash2(Math.floor(v / w), row, seed) > 0.6 ? 3 : 2) + (at === 0 ? 1 : 0)];
    } else {
      let i = m > 0.6 ? 3 : m < 0.36 ? 1 : 2;
      if (style === 'grass') {
        // blades: short upright strokes, lighter at their tips
        const b = hash2(x, Math.floor(y / 3), seed + 1);
        if (b > 0.7) i = y % 3 === 0 ? 4 : 3; else if (b < 0.12) i = 1;
      } else if (style === 'snow') i += 2;
      if (style === 'soil' && d % 5 === 0) i = Math.max(0, i - 1);
      if (style === 'soil') i++;
      // single-pixel specks of lighter and darker, so the ground reads as a texture
      const g = hash2(x, y, seed + 2);
      if (g > 0.955) i += 2; else if (g < 0.04) i -= 2;
      c = R[clampI(i, 0, 5)];
      if (style !== 'snow' && style !== 'grass') {
        // pebbles: two pixels, lit above, dark below
        const pb = hash2(x >> 1, (y - 1) >> 1, seed + 4);
        if (pb > 0.975) c = (y & 1) ? P.stone[1] : P.stone[pb > 0.9875 ? 5 : 4];
      }
      if (o.straw && hash2(x, y, seed + 6) > 0.972) c = P.straw[hash2(x, y, seed + 7) > 0.5 ? 5 : 3];
    }
    // in the shade of the back
    if (d < 5) c = mixPacked(c, 0xff000000, (5 - d) * 0.07);
    return c;
  });
}

/** What stands in front of the feet: a fringe along the bottom edge (grass blades, snow, or nothing). */
function fringe(fg, style, seed) {
  if (style === 'grass') tufts(fg, 0, fg.W, fg.H, seed, 0.55);
  else if (style === 'snow') for (let x = 0; x < fg.W; x++) { const h = 1 + Math.floor(patch(x, 0, seed, 0.3) * 3); for (let j = 1; j <= h; j++) fg.set(x, fg.H - j, P.snow[j === h ? 5 : 4]); }
}

// each piece of furniture and scenery drawn standing apart from what is behind it
const frame = prop(frame_);
const lantern = prop(lantern_);
const railFence = prop(railFence_);
const boardFence = prop(boardFence_);
const ropePost = prop(ropePost_);
const table = prop(table_);
const shelf = prop(shelf_);
const item = prop(item_);
const barrel = prop(barrel_);
const crate = prop(crate_);
const hay = prop(hay_);
const shelter = prop(shelter_);
const trough = prop(trough_);
const doghouse = prop(doghouse_);
const pump = prop(pump_);
const planter = prop(planter_);
const bench = prop(bench_);
const pond = prop(pond_);

// ------------------------------------------------------------------ the pens

/** @typedef {{cv:Canvas, fg:Canvas, seed:number, block:(x0:number, y0:number, x1:number, y1:number)=>void}} Ctx */

/** @type {Record<string, {title:string, fringe?:string, compose:(c:Ctx)=>{rack:{x:number,y:number}, nest:[number,number,number,number]}}>} */
const PENS = {
  cat: {
    title: 'The cattery',
    compose({ cv, seed }) {
      // a loft: a plastered wall under the dark of the roof, a frame of beams
      fill(cv, 0, 0, cv.W, BACK, (x, y) => {
        // plaster in patches, flecked, a hairline crack here and there
        const m = patch(x, y, seed, 0.06), g = hash2(x, y, seed + 5);
        let i = m > 0.6 ? 4 : m > 0.42 ? 3 : 2;
        if (g > 0.95) i++; else if (g < 0.05) i--;
        if (Math.abs(noise2(x * 0.05, y * 0.2, seed + 9) - 0.5) < 0.004 && hash2(x >> 3, y >> 3, seed) > 0.5) i = 1;
        return P.plaster[clampI(i, 0, 5)];
      });
      fill(cv, 0, 0, cv.W, 24, (x, y) => (y < 7 + Math.floor(patch(x, 0, seed + 3, 0.2) * 16 * (hash2(x >> 2, 1, seed) > 0.4 ? 1 : 0.4)) ? col('#24181e') : 0));
      wainscot(cv, 0, cv.W, 40, BACK, P.oak, seed);
      frame(cv, 4, [30, 120, 210], P.wood);
      lantern(cv, 82, 9, 20);
      table(cv, 40, 98, 40, BACK, P.wood); item(cv, 54, 40, 'pot'); item(cv, 80, 40, 'bread');
      shelf(cv, 150, 196, 28, P.wood); item(cv, 168, 28, 'cloth'); item(cv, 156, 28, 'bread');
      ropePost(cv, 120, 9, BACK);
      railFence(cv, 130, 222, BACK, 16, P.wood, { gap: 30, rails: 3 });
      ground(cv, BACK - 1, 'dirt', seed + 2, { straw: true });
      hay(cv, 18, BACK + 1, 30, 10, seed + 1);
      return { rack: { x: 36, y: GROUND_Y0 + 1 }, nest: [8, BACK - 4, 28, BACK] };
    },
  },
  toad: {
    title: 'The toad pond',
    compose({ cv, seed, block }) {
      sky(cv, 36, rgb('#2a3a6a'), rgb('#4a6a9a'));
      treeline(cv, 28, '#1e3226', seed, { h: [8, 18], bottom: 36 });
      stonewall(cv, 0, 26, cv.W, BACK, P.stone, seed + 1, 9);
      overgrowth(cv, 0, cv.W, 25, P.moss, seed + 2, { rate: 0.2, len: [3, 16], flower: '#e86a8a' });
      flowers(cv, 60, 80, 25, ['#d84a6a', '#f07aa0'], seed + 3, 4);
      ground(cv, BACK, 'flags', seed + 7, { joint: '#26301e' });
      pond(cv, 92, 178, BACK - 7, BACK + 3, seed + 4);
      block(80, GROUND_Y0 - 3, 190, GROUND_Y0 + 2);
      pump(cv, 204, BACK);
      flowers(cv, 6, 26, BACK, ['#f0a0c0', '#ffffff', '#e86a8a'], seed + 5, 6);
      return { rack: { x: 40, y: GROUND_Y0 + 1 }, nest: [30, BACK - 3, 50, BACK] };
    },
  },
  salamander: {
    title: 'The hearth pit',
    compose({ cv, seed }) {
      bricks(cv, 0, 0, cv.W, BACK, P.brick.map((c) => mixPacked(c, 0xff000000, 0.3)), seed, { h: 5, w: 11 });
      frame(cv, 2, [8, 150], P.oak);
      // the fireplace: an arch of brick round a fire on its hearth
      const cx = 66;
      bricks(cv, cx - 30, 14, cx + 30, BACK, P.brick, seed + 1, { h: 4, w: 8 });
      fill(cv, cx - 22, 22, cx + 22, BACK - 3, (x, y) => {
        const u = (x + 0.5 - cx) / 22, v = (y + 0.5 - 42) / 20;
        if (y < 42 && u * u + v * v > 1) return 0;
        return mixPacked(col('#3a1a10'), col('#0e0606'), clampI((BACK - y) / 30, 0, 1));
      });
      // the fire: tongues of flame over a bed of embers
      for (let x = cx - 16; x < cx + 16; x++) {
        const h = Math.round(4 + 10 * Math.pow(Math.max(0, 1 - Math.abs(x - cx) / 16), 0.8) * (0.5 + noise2(x * 0.4, 0, seed)));
        for (let j = 0; j < h; j++) cv.set(x, BACK - 5 - j, col(j < h * 0.3 ? '#fff0a0' : j < h * 0.6 ? '#ffb43a' : j < h - 1 ? '#f0641e' : '#a02a10'));
      }
      fill(cv, cx - 22, BACK - 5, cx + 22, BACK - 3, (x, y) => col(noise2(x * 0.6, y, seed) > 0.5 ? '#ff9a3a' : '#7a2410'));
      rect(cv, cx - 30, BACK - 3, cx + 30, BACK, P.stone[3]);
      rect(cv, cx - 30, BACK - 3, cx + 30, BACK - 2, P.stone[5]);
      cv.glow(cx, BACK - 10, 70, [1, 0.5, 0.2], 0.6);
      barrel(cv, 14, BACK, 12, 16); crate(cv, 22, BACK, 11);
      lantern(cv, 186, 7, 18);
      railFence(cv, 110, 222, BACK, 15, P.oak, { gap: 24, rails: 2 });
      barrel(cv, 168, BACK - 3, 10, 13);
      ground(cv, BACK, 'cobble', seed + 2);
      return { rack: { x: 40, y: GROUND_Y0 + 1 }, nest: [196, BACK - 3, 216, BACK] };
    },
  },
  deer: {
    title: 'The paddock',
    fringe: 'grass',
    compose({ cv, seed, block }) {
      sky(cv, 50, rgb('#4a6ab0'), rgb('#8aa4d4'));
      hills(cv, 26, 6, '#5a6e9e', '#6a80ae', seed);
      treeline(cv, 40, '#3a5868', seed + 1, { h: [8, 14], bottom: 46 });
      treeline(cv, 48, '#2a4434', seed + 2, { h: [6, 12], bottom: 58 });
      ground(cv, 54, 'grass', seed + 3);
      railFence(cv, 0, cv.W, BACK - 4, 20, P.wood, { gap: 34 });
      shelter(cv, 150, 210, BACK - 2, 34, seed + 4);
      trough(cv, 86, 122, GROUND_Y0 + 4, 7);
      block(84, GROUND_Y0 - 3, 124, GROUND_Y0 + 5);
      flowers(cv, 10, 30, GROUND_Y0 + 2, ['#ffffff', '#f4e4a0'], seed + 5, 4);
      return { rack: { x: 40, y: GROUND_Y0 + 2 }, nest: [168, BACK - 6, 196, BACK - 2] };
    },
  },
  badger: {
    title: 'The sett',
    compose({ cv, seed }) {
      sky(cv, 24, rgb('#2e4474'), rgb('#5a72a0'));
      treeline(cv, 16, '#1e3424', seed, { h: [8, 16], bottom: 24 });
      earthbank(cv, 0, 18, cv.W, BACK + 2, P.earth, seed + 1);
      overgrowth(cv, 0, cv.W, 17, P.moss, seed + 2, { rate: 0.22, len: [3, 18] });
      burrow(cv, 64, BACK, 30, 22, seed + 3);
      burrow(cv, 162, BACK, 26, 19, seed + 4);
      for (const [x, y] of [[30, 56], [112, 40], [200, 50]]) { rect(cv, x, y, x + 4, y + 3, P.stone[3]); rect(cv, x, y, x + 4, y + 1, P.stone[5]); }
      ground(cv, BACK, 'soil', seed + 5);
      tufts(cv, 0, cv.W, BACK + 1, seed + 6, 0.22);
      return { rack: { x: 40, y: GROUND_Y0 + 1 }, nest: [56, BACK - 3, 72, BACK] };
    },
  },
  dove: {
    title: 'The dovecote',
    compose({ cv, seed }) {
      fill(cv, 0, 0, cv.W, BACK, (x, y) => {
        // whitewash, worn through to the bricks toward the sides
        const edge = Math.min(x, cv.W - 1 - x) / 40;
        if (patch(x, y, seed, 0.07) - edge * 0.5 > 0.42) return 0;
        const m = patch(x, y, seed + 1, 0.05);
        return P.lime[m > 0.62 ? 4 : m > 0.4 ? 3 : 2];
      });
      const under = new Canvas(seed, cv.W, BACK);
      bricks(under, 0, 0, cv.W, BACK, P.brick, seed + 2, { h: 4, w: 9, mortar: P.lime[1] });
      for (let k = 0; k < cv.W * BACK; k++) if (!(cv.pix.px[k] >>> 24)) cv.paint(k, under.pix.px[k]);
      tiles(cv, 10, seed + 3);
      overgrowth(cv, 0, 40, 12, P.moss, seed + 4, { rate: 0.4, len: [6, 20] });
      overgrowth(cv, 190, cv.W, 12, P.moss, seed + 5, { rate: 0.4, len: [6, 18] });
      pigeonholes(cv, 34, 196, 18, 2, seed + 6);
      bench(cv, 18, 46, BACK);
      hay(cv, 150, BACK, 26, 7, seed + 7);
      crate(cv, 176, BACK, 13);
      ground(cv, BACK, 'flags', seed + 8, { joint: '#3a3638' });
      return { rack: { x: 52, y: GROUND_Y0 + 1 }, nest: [140, BACK - 3, 160, BACK] };
    },
  },
  fox: {
    title: 'The fox run',
    compose({ cv, seed, block }) {
      sky(cv, 34, rgb('#a85a50'), rgb('#e8a070'));
      treeline(cv, 26, '#3a2a30', seed, { h: [10, 18], bottom: 36 });
      boardFence(cv, 0, cv.W, 30, BACK, P.oak, seed + 1);
      shelter(cv, 142, 204, BACK, 36, seed + 2);
      ground(cv, BACK, 'dirt', seed + 3, { straw: true });
      trough(cv, 90, 120, GROUND_Y0 + 3, 6);
      block(88, GROUND_Y0 - 3, 122, GROUND_Y0 + 4);
      hay(cv, 26, GROUND_Y0 + 2, 18, 3, seed + 4);
      return { rack: { x: 44, y: GROUND_Y0 + 1 }, nest: [160, BACK - 4, 188, BACK] };
    },
  },
  ermine: {
    title: 'The snow run',
    fringe: 'snow',
    compose({ cv, seed, block }) {
      sky(cv, 34, rgb('#5a6a8a'), rgb('#9aa8c0'));
      treeline(cv, 26, '#3a4858', seed, { h: [10, 18], bottom: 34, pines: 0.85, snow: '#c8d4e4' });
      stonewall(cv, 0, 30, cv.W, BACK, P.stone, seed + 1, 9);
      snowcap(cv, 0, cv.W, 29, seed + 2);
      ground(cv, BACK - 2, 'snow', seed + 3);
      doghouse(cv, 160, BACK + 2, 30, 18, { snow: true });
      crate(cv, 30, BACK + 1, 13);
      snowcap(cv, 30, 43, BACK - 12, seed + 4);
      wood(cv, 104, BACK - 4, 132, BACK + 1, P.wood, { seed: 5 });
      snowcap(cv, 104, 132, BACK - 5, seed + 5);
      block(102, GROUND_Y0 - 3, 134, GROUND_Y0 - 1);
      flakes(cv, BACK, seed + 6, 70);
      return { rack: { x: 52, y: GROUND_Y0 + 1 }, nest: [152, BACK - 3, 168, BACK + 1] };
    },
  },
  snail: {
    title: 'The snail garden',
    compose({ cv, seed }) {
      sky(cv, 16, rgb('#5a8aa8'), rgb('#9ab8c8'));
      foliage(cv, 4, BACK, seed);
      railFence(cv, 0, cv.W, BACK, 18, P.wood, { gap: 36, rails: 2 });
      planter(cv, 150, 196, BACK, 9, seed + 2);
      ground(cv, BACK, 'soil', seed + 3);
      tufts(cv, 0, cv.W, BACK + 1, seed + 4, 0.3);
      return { rack: { x: 40, y: GROUND_Y0 + 1 }, nest: [160, BACK - 2, 186, BACK] };
    },
  },
  rat: {
    title: 'The cellar',
    compose({ cv, seed }) {
      bricks(cv, 0, 0, cv.W, BACK, P.brick.map((c) => mixPacked(c, 0xff000000, 0.2)), seed, { h: 4, w: 10 });
      for (const cx of [62, 166]) arch(cv, cx, BACK, 36, 18, seed + cx);
      // in the vaults: crates, hay, a low fence
      crate(cv, 34, BACK, 13); crate(cv, 82, BACK, 10); hay(cv, 62, BACK, 20, 5, seed + 1);
      railFence(cv, 140, 190, BACK, 11, P.oak, { gap: 16, rails: 2 });
      crate(cv, 190, BACK, 12); hay(cv, 150, BACK, 16, 4, seed + 2);
      lantern(cv, 114, 0, 14);
      overgrowth(cv, 98, 132, 0, P.moss, seed + 3, { rate: 0.3, len: [4, 12] });
      ground(cv, BACK, 'cobble', seed + 4);
      return { rack: { x: 44, y: GROUND_Y0 + 1 }, nest: [54, BACK - 3, 70, BACK] };
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
  // the ground a foot may rest on, less what was set down on it
  const walk = new Uint8Array(PEN_W * PEN_H);
  for (let y = GROUND_Y0; y <= GROUND_Y1; y++) for (let x = 12; x < PEN_W - 12; x++) walk[y * PEN_W + x] = 1;
  const block = (x0, y0, x1, y1) => { for (let y = Math.max(0, y0); y < Math.min(PEN_H, y1); y++) for (let x = Math.max(0, x0); x < Math.min(PEN_W, x1); x++) walk[y * PEN_W + x] = 0; };
  const out = def.compose({ cv, fg, seed, block });
  finish(cv, 0.3);
  fringe(fg, def.fringe || '', seed + 9);
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
    cloth: [160, 80, 46, 11],
    slots: [[170, 86], [190, 87], [180, 89]],
  };
  cache.set(kind, p);
  return p;
}
