// The flourish on a wild region's painting, after its composition and the
// legibility pass (legible.js), before the lights are added: what makes a
// side view look lived in rather than drawn.
//
//   - the ground's own flora: tufts of grass, daisies, spikes of lavender,
//     little ferns and mushrooms, cattails by the water, puffballs and
//     pale crystals by night — each region its own, small enough that the
//     ingredients standing among them still read at a glance;
//   - creepers climbing the rock faces of the ledges and pillars from the
//     crust down, a leaf or a berry now and then;
//   - the odd glow of what shines in the dark (glowing caps, crystals).
//
// Scenery only: nothing here is open or closed ground, a prop or a tree;
// the swaying foliage's pixels are left alone (they keep their colours).

import { hash2 } from '../noise.js';
import { col } from './side.js';

/**
 * @typedef {{kinds:[string, number][], rate:number, cols:Record<string, string[]>, creep?:{cols:string[], leaf:string, berry?:string, rate:number}, glow?:number[]}} Flora
 */

/** Each region's flora: which plants, how many, in which colours. @type {Record<string, Flora>} */
const FLORA = {
  meadow: {
    kinds: [['tuft', 4], ['daisy', 3], ['spike', 1.6], ['bloom', 2], ['fern', 0.8]], rate: 0.22,
    cols: { blade: ['#2e6a22', '#4e9a34', '#7ac046', '#a8dc5a'], petal: ['#ffffff', '#fff4c0', '#ffd8e8'], eye: ['#ffd040', '#f0a020'], spike: ['#5a3a9a', '#8a62d0', '#b898f0'], bloom: ['#ff7a8a', '#ffb0c8', '#ffe066', '#c9b0ff'] },
    creep: { cols: ['#6a1e1a', '#9a2e22', '#c04a30'], leaf: '#4e9a34', berry: '#e8403a', rate: 0.5 },
  },
  forest: {
    kinds: [['tuft', 3], ['fern', 3], ['bloom', 1.4], ['cap', 1.2], ['daisy', 1]], rate: 0.14,
    cols: { blade: ['#1e4a1e', '#2e6a2a', '#4e8a34', '#78ac48'], petal: ['#f4ecd8', '#f0c8d8'], eye: ['#e8b040'], bloom: ['#f08ab0', '#e85a8a', '#f0e0a0'], cap: ['#8a4a2a', '#b8683a', '#e0c8a0'] },
    creep: { cols: ['#2a4a1e', '#3e6a2a', '#5a8a34'], leaf: '#6aa83a', berry: '#c03a3a', rate: 0.45 },
  },
  netherwood: {
    kinds: [['tuft', 3], ['glowcap', 1.6], ['spike', 1.6], ['daisy', 1.2], ['fern', 1.2]], rate: 0.13,
    cols: { blade: ['#14302a', '#1e4a3e', '#3e7a6a', '#5aa08a'], petal: ['#e8e0ff', '#c8f0ff'], eye: ['#a080ff'], spike: ['#4a2a7a', '#7a4ac0', '#b088ff'], cap: ['#5a2a8a', '#a060f0', '#e0c0ff'] },
    creep: { cols: ['#4a1414', '#7a1e1a', '#a83020'], leaf: '#3e7a6a', berry: '#ff5a6a', rate: 0.55 },
    glow: [0.7, 0.4, 1],
  },
  river: {
    kinds: [['tuft', 4], ['daisy', 2.4], ['cattail', 1.6], ['fern', 1.4], ['bloom', 1]], rate: 0.15,
    cols: { blade: ['#2a5a26', '#4a8a30', '#6ab040', '#98d05a'], petal: ['#ffffff', '#fff4c0'], eye: ['#ffd040'], bloom: ['#ffe58a', '#c9b0ff', '#ffffff'], cat: ['#3a2414', '#6a4024', '#8a5a34'] },
    creep: { cols: ['#2a4a1e', '#3e6a2a', '#5a8a34'], leaf: '#7ac04a', rate: 0.3 },
  },
  quarry: {
    kinds: [['tuft', 4], ['daisy', 1]], rate: 0.07,
    cols: { blade: ['#5a5a2a', '#7a7a34', '#a09a48', '#c8bc6a'], petal: ['#ffffff', '#f4ecd8'], eye: ['#e8b040'] },
  },
  moonfen: {
    kinds: [['tuft', 3], ['puff', 1.8], ['shard', 1.2], ['glowcap', 1.2], ['cattail', 1]], rate: 0.13,
    cols: { blade: ['#14322a', '#1e4a3c', '#2e6a52', '#4a9a78'], puff: ['#c8d8f0', '#ffffff'], shard: ['#3a6ab0', '#6ab0f0', '#c8f0ff'], cap: ['#1e5a8a', '#4ab0f0', '#c0f0ff'], cat: ['#1a1e2a', '#2e3446', '#464e66'] },
    creep: { cols: ['#14322a', '#1e4a3c', '#2e6a52'], leaf: '#4a9a78', berry: '#8ff0ff', rate: 0.4 },
    glow: [0.45, 0.8, 1],
  },
  crags: {
    kinds: [['tuft', 4], ['bloom', 1.4], ['cap', 0.6]], rate: 0.08,
    cols: { blade: ['#3a3418', '#5a5a26', '#7a7a34', '#a09a48'], bloom: ['#ff5a2a', '#ff8a3a', '#ffd060'], cap: ['#6a2a14', '#c04a1e', '#ffb060'] },
  },
};

/**
 * Give a composed region its flourish (see the head of the file).
 * @param {any} cv the region's Canvas (paint.js) @param {string} region
 */
export function flourish(cv, region) {
  const f = FLORA[region];
  if (!f) return;
  const W = cv.W, H = cv.H, seed = cv.seed ^ 0x6f1a;
  // the swaying foliage's home pixels: never painted over
  const swaying = new Uint8Array(W * H);
  if (cv.sw) for (const k of cv.sw.k) swaying[k] = 1;
  const cols = Object.fromEntries(Object.entries(f.cols).map(([k, v]) => [k, v.map(col)]));
  /** whether (x, y) is empty air a plant may be drawn into */
  const air = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return false;
    const k = y * W + x;
    return !cv.solid[k] && !cv.liquid[k] && !cv.rock[k] && !cv.trees[k] && !cv.things[k] && !cv.props[k] && !swaying[k];
  };
  const put = (x, y, c) => { if (air(x, y)) cv.set(x, y, c); };
  const total = f.kinds.reduce((t, [, w]) => t + w, 0);
  const pick = (r) => { let a = r * total; for (const [k, w] of f.kinds) { if ((a -= w) < 0) return k; } return f.kinds[0][0]; };
  const glows = [];
  let last = -9;
  for (let x = 3; x < W - 3; x++) {
    if (x - last < 3) continue;
    for (let y = 2; y < H - 2; y++) {
      const k = y * W + x;
      // the dry surface: ground under air, in the open (not under a prop, never in a liquid)
      if (!cv.solid[k] || cv.liquid[k] || cv.solid[k - W] || cv.liquid[k - W] || !cv.open[k] || !air(x, y - 1)) continue;
      if (hash2(x, y, seed) > f.rate) continue;
      // near the water a reed is likelier
      const kind = pick(hash2(x, y, seed + 1)), r = (/** @type {number} */ i) => hash2(x * 31 + i, y, seed + 2 + i);
      const fx = r(9) < 0.5 ? -1 : 1;
      const drawn = PLANTS[kind]?.(put, x, y - 1, r, cols, fx);
      if (drawn && f.glow && (kind === 'glowcap' || kind === 'shard')) glows.push([x, y - 3]);
      last = x;
      break;
    }
  }
  for (const [x, y] of glows) cv.glow(x, y, 9, f.glow, 0.35);
  if (f.creep) creepers(cv, f.creep, seed + 7, swaying);
}

/**
 * The little plants, each drawn upward from its foot (x, y) — the air just
 * above the ground — with `put` (which leaves anything solid alone).
 * @type {Record<string, (put:(x:number, y:number, c:number) => void, x:number, y:number, r:(i:number) => number, cols:Record<string, number[]>, fx:number) => boolean>}
 */
const PLANTS = {
  // a tuft of blades fanning out, dark at the foot, bright at the tips
  tuft(put, x, y, r, c, fx) {
    const B = c.blade, h = 3 + Math.floor(r(1) * 4);
    for (const [dx, k] of [[0, 1], [-1, 0.75], [1, 0.8], [-2, 0.45], [2, 0.5]]) {
      if (Math.abs(dx) === 2 && r(2 + dx) < 0.4) continue;
      const hh = Math.max(1, Math.round(h * k * (0.8 + r(5 + dx) * 0.4)));
      for (let j = 0; j < hh; j++) {
        const lean = Math.abs(dx) && j > hh * 0.5 ? Math.sign(dx) : j > hh * 0.7 && !dx ? fx : 0;
        put(x + dx + lean, y - j, B[Math.min(B.length - 1, Math.floor((j / hh) * B.length + (dx ? 0 : 0.6)))]);
      }
    }
    return true;
  },
  // daisies: two or three heads on thin stems
  daisy(put, x, y, r, c) {
    const n = 1 + Math.floor(r(1) * 3);
    put(x - 1, y, c.blade[1]); put(x + 1, y, c.blade[1]);
    for (let i = 0; i < n; i++) {
      const dx = (i - (n - 1) / 2) * 3 + Math.round((r(2 + i) - 0.5) * 2), h = 2 + Math.floor(r(5 + i) * 4), p = c.petal[Math.floor(r(8 + i) * c.petal.length)];
      for (let j = 0; j < h; j++) put(x + dx, y - j, c.blade[j ? 2 : 1]);
      const hy = y - h - 1;
      put(x + dx - 1, hy, p); put(x + dx + 1, hy, p); put(x + dx, hy - 1, p); put(x + dx, hy + 1, p);
      put(x + dx, hy, c.eye[Math.floor(r(11 + i) * c.eye.length)]);
    }
    return true;
  },
  // a spike of lavender (or its night kin) rising from a few leaves
  spike(put, x, y, r, c) {
    const S = c.spike, n = 1 + Math.floor(r(1) * 3);
    put(x - 1, y, c.blade[1]); put(x + 1, y, c.blade[1]); put(x, y, c.blade[0]);
    for (let i = 0; i < n; i++) {
      const dx = (i - (n - 1) / 2) * 2, h = 5 + Math.floor(r(2 + i) * 5), head = 3 + Math.floor(r(5 + i) * 2);
      for (let j = 1; j < h - head; j++) put(x + dx, y - j, c.blade[2]);
      for (let j = h - head; j < h; j++) {
        put(x + dx, y - j, S[(j + i) % 2 ? 1 : 2]);
        if ((j - (h - head)) % 2 === 0 && j < h - 1) { put(x + dx - 1, y - j, S[0]); put(x + dx + 1, y - j, S[1]); }
      }
      put(x + dx, y - h, S[2]);
    }
    return true;
  },
  // a bloom: a round flower head on a leafy stem
  bloom(put, x, y, r, c) {
    const B = c.bloom, p = B[Math.floor(r(1) * B.length)], h = 3 + Math.floor(r(2) * 4);
    for (let j = 0; j < h; j++) put(x, y - j, c.blade[1 + (j > 1 ? 1 : 0)]);
    put(x - 1, y - 1, c.blade[2]); put(x + 1, y - 2, c.blade[3] ?? c.blade[2]);
    const hy = y - h;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 0], [-1, -1], [1, -1], [0, -2]]) put(x + dx, hy + dy, p);
    put(x, hy - 1, 0xffffffff);
    return true;
  },
  // a little fern: fronds curving out either side
  fern(put, x, y, r, c, fx) {
    const B = c.blade, n = 3 + Math.floor(r(1) * 2);
    for (let i = 0; i < n; i++) {
      const s = i % 2 ? 1 : -1, len = 4 + Math.floor(r(2 + i) * 4), ang = 0.35 + (i / n) * 0.9;
      for (let j = 0; j < len; j++) {
        const t = j / len, px = x + Math.round(s * Math.sin(ang) * j * (1 + t * 0.6)), py = y - Math.round(Math.cos(ang) * j - t * t * len * 0.35);
        put(px, py, B[Math.min(B.length - 1, 1 + Math.floor(t * (B.length - 1)))]);
        if (j % 2 && j < len - 1) put(px, py - 1, B[B.length - 1]);
      }
    }
    put(x, y, B[0]);
    put(x + fx, y - 1, B[1]);
    return true;
  },
  // small mushrooms: a pale stem and a capped head, one or two
  cap(put, x, y, r, c) {
    const C = c.cap, n = 1 + Math.floor(r(1) * 2);
    for (let i = 0; i < n; i++) {
      const dx = i ? (r(2) < 0.5 ? -3 : 3) : 0, h = 1 + Math.floor(r(3 + i) * 3) - i;
      for (let j = 0; j < Math.max(1, h); j++) put(x + dx, y - j, C[2]);
      const cy = y - Math.max(1, h);
      for (let d = -1; d <= 1; d++) put(x + dx + d, cy, C[0]);
      put(x + dx, cy - 1, C[1]); put(x + dx - 1, cy - 1, C[1]);
      if (r(6 + i) < 0.5) put(x + dx + 1, cy - 1, C[0]);
    }
    return true;
  },
  // glowing caps: as the mushrooms, a bright rim and a lit top
  glowcap(put, x, y, r, c) {
    const C = c.cap, n = 1 + Math.floor(r(1) * 3);
    for (let i = 0; i < n; i++) {
      const dx = (i - (n - 1) / 2) * 3, h = 2 + Math.floor(r(2 + i) * 3), w = i === Math.floor(n / 2) ? 2 : 1;
      for (let j = 0; j < h; j++) put(x + dx, y - j, 0xffe0e8f0);
      const cy = y - h;
      for (let d = -w; d <= w; d++) put(x + dx + d, cy, C[1]);
      for (let d = -w + 1; d <= w - 1; d++) put(x + dx + d, cy - 1, C[2]);
      if (w > 1) { put(x + dx - w + 1, cy - 1, C[1]); put(x + dx + w - 1, cy - 1, C[1]); }
    }
    return true;
  },
  // cattails: tall stalks with a brown head, a blade or two beside them
  cattail(put, x, y, r, c) {
    const C = c.cat, n = 1 + Math.floor(r(1) * 2);
    for (let i = 0; i < n; i++) {
      const dx = i * 2 - (n - 1), h = 9 + Math.floor(r(2 + i) * 6);
      for (let j = 0; j < h; j++) put(x + dx, y - j, c.blade[j < 2 ? 1 : 2]);
      for (let j = h - 6; j < h - 1; j++) { put(x + dx, y - j, C[1]); put(x + dx + 1, y - j, j === h - 6 ? C[0] : C[j < h - 3 ? 0 : 2]); }
      put(x + dx, y - h - 1, c.blade[3] ?? c.blade[2]);
    }
    for (let j = 0; j < 6; j++) put(x - n - (j > 3 ? 1 : 0), y - j, c.blade[Math.min(3, 1 + (j >> 1))]);
    return true;
  },
  // puffballs: a white seed head on a thin stem
  puff(put, x, y, r, c) {
    const P = c.puff, n = 1 + Math.floor(r(1) * 2);
    for (let i = 0; i < n; i++) {
      const dx = i ? 3 : 0, h = 4 + Math.floor(r(2 + i) * 4);
      for (let j = 0; j < h; j++) put(x + dx, y - j, c.blade[2]);
      const hy = y - h - 1;
      for (const [a, b] of [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]) put(x + dx + a, hy + b, P[a || b ? 0 : 1]);
      put(x + dx - 1, hy - 1, P[1]);
    }
    return true;
  },
  // pale crystals pushing out of the ground
  shard(put, x, y, r, c) {
    const S = c.shard, n = 2 + Math.floor(r(1) * 2);
    for (let i = 0; i < n; i++) {
      const dx = i - Math.floor(n / 2), h = (i === Math.floor(n / 2) ? 5 : 3) + Math.floor(r(2 + i) * 2);
      for (let j = 0; j < h; j++) put(x + dx, y - j, j === h - 1 ? S[2] : S[dx < 0 ? 0 : 1]);
    }
    return true;
  },
};

/**
 * Creepers climbing down the rock faces from the crust: a wavering line
 * of stem along the face of a ledge or a pillar, a leaf or a berry out
 * from it now and then.
 * @param {any} cv @param {{cols:string[], leaf:string, berry?:string, rate:number}} o @param {number} seed @param {Uint8Array} swaying
 */
function creepers(cv, o, seed, swaying) {
  const W = cv.W, H = cv.H, S = cv.solid, C = o.cols.map(col), leaf = col(o.leaf), berry = o.berry ? col(o.berry) : 0;
  const ground = (x, y) => x >= 0 && y >= 0 && x < W && y < H && S[y * W + x] === 1 && !cv.liquid[y * W + x];
  const free = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !S[y * W + x] && !cv.liquid[y * W + x] && !cv.things[y * W + x] && !cv.trees[y * W + x] && !swaying[y * W + x] && !cv.props[y * W + x];
  const done = new Uint8Array(W);
  for (let y = 4; y < H - 8; y++) for (let x = 2; x < W - 2; x++) {
    // where the crust turns down a face: the top of a ground column with air beside it
    if (!ground(x, y) || ground(x, y - 1) || done[x]) continue;
    const side = !ground(x - 1, y + 2) && free(x - 1, y + 2) ? -1 : !ground(x + 1, y + 2) && free(x + 1, y + 2) ? 1 : 0;
    if (!side || hash2(x, y, seed) > o.rate * 0.25) continue;
    done[x] = 1;
    const len = 10 + Math.floor(hash2(x, y, seed + 1) * 34);
    let cx = x, inward = 0;
    for (let j = 2; j < len; j++) {
      const yy = y + j;
      // follow the face: the outermost ground pixel of this row on the creeper's side
      let fx = cx;
      if (!ground(fx, yy)) { if (ground(fx - side, yy)) fx -= side; else if (ground(fx - 2 * side, yy)) fx -= 2 * side; else break; }
      while (ground(fx + side, yy) && Math.abs(fx + side - cx) <= 1) fx += side;
      if (free(fx + side, yy) === false && ground(fx + side, yy)) break;
      cx = fx;
      if (hash2(x, j, seed + 2) < 0.3) inward = inward ? 0 : 1;
      const px = cx - side * inward;
      cv.set(px, yy, C[(j >> 1) % 3 === 0 ? 2 : (j % 3 ? 1 : 0)]);
      const h = hash2(x, j, seed + 3);
      if (h < 0.16 && free(cx + side, yy)) cv.set(cx + side, yy, leaf);
      else if (berry && h > 0.95 && free(cx + side, yy)) cv.set(cx + side, yy, berry);
    }
  }
}
