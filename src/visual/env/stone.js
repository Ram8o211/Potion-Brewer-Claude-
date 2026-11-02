// The cobbled stone the caverns are built of (cave.js): ground, pillars,
// roof and walls share this one texture, so they read as one rock.

import { hash2, noise2 } from '../noise.js';
import { mixPacked } from '../color.js';

/**
 * The cobbled stone texture: rounded stones of a few colours packed in a
 * darker mortar, each lit along its upper left and shaded underneath, with
 * a rare single-pixel speckle (the stones kept clean). A pure function of the pixel.
 * @param {number} x @param {number} y
 * @param {{stones:number[], mortar:number, s:number, seed:number, flat?:number, round?:boolean}} o
 *   round: the wilds' rounded pebbles (pebble below) instead of packed cobbles
 */
export function cobble(x, y, o) {
  if (o.round) return pebble(x, y, o);
  const s = o.s, gx = Math.floor(x / s), gy = Math.floor(y / s), fl = o.flat ?? 1.3;
  let d1 = 1e9, d2 = 1e9, bx = 0, by = 0, id = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = gx + i, cy = gy + j;
    const px = (cx + 0.15 + hash2(cx, cy, o.seed) * 0.7) * s, py = (cy + 0.15 + hash2(cx, cy, o.seed + 1) * 0.7) * s;
    const dx = x + 0.5 - px, dy = (y + 0.5 - py) * fl, d = dx * dx + dy * dy;
    if (d < d1) { d2 = d1; d1 = d; bx = dx; by = dy / fl; id = cx * 7919 + cy * 104729; }
    else if (d < d2) d2 = d;
  }
  const edge = Math.sqrt(d2) - Math.sqrt(d1);
  if (edge < 0.9) return o.mortar;
  let c = o.stones[Math.floor(hash2(id, 3, o.seed) * o.stones.length)];
  // each stone a low dome lit from the upper left: a bright cap, a lit
  // shoulder, a shaded underside and a dark rim where it beds into the mortar
  const r = s * 0.5, lit = -((bx / r) * 0.55 + (by / r) * 0.85);
  if (edge < 1.7 && by > -r * 0.2) c = mixPacked(c, 0xff000000, 0.32);
  else if (lit > 0.6) c = mixPacked(c, 0xffffffff, 0.24);
  else if (lit > 0.22) c = mixPacked(c, 0xffffffff, 0.11);
  else if (lit < -0.5) c = mixPacked(c, 0xff000000, 0.24);
  else if (lit < -0.15) c = mixPacked(c, 0xff000000, 0.1);
  const g = hash2(x, y, o.seed + 9);
  if (g > 0.993) c = mixPacked(c, 0xffffffff, 0.12); else if (g < 0.007) c = mixPacked(c, 0xff000000, 0.22);
  return c;
}

/** A stone's five tones, highlight to deep shade, by its base colour (cached). @type {Map<number, number[]>} */
const TONES = new Map();
/** @param {number} c */
function tones(c) {
  let t = TONES.get(c);
  if (!t) {
    t = [mixPacked(c, 0xffffffff, 0.42), mixPacked(c, 0xffffffff, 0.2), mixPacked(c, 0xffffffff, 0.04), mixPacked(c, 0xff000000, 0.24), mixPacked(c, 0xff000000, 0.48)];
    TONES.set(c, t);
  }
  return t;
}

/**
 * The wilds' stone, after the reference sheets: rounded stones of mixed
 * sizes — cobbles, and now and then a big stone among them — each an egg a
 * little wider than tall, set apart in a near-black mortar that shows round
 * every one, each shaded in five flat tones as a lit dome (a bright cap on
 * its upper left, a lit shoulder, its body, a shaded flank, a deep shadow
 * along its underside) and mottled in broad soft patches a tone lighter or
 * darker, as weathered stone is; a few with a crack across them, and with
 * `moss` a tuft of moss on the tops of some.
 * @param {number} x @param {number} y
 * @param {{stones:number[], mortar:number, s:number, seed:number, flat?:number, moss?:number[]}} o moss: [shade, lit] colours
 */
export function pebble(x, y, o) {
  const s = o.s, fl = o.flat ?? 1.3;
  // a big stone now and then, on a coarser grid, over the cobbles
  const big = o.s >= 6 ? stoneAt(x, y, s * 2.1, fl, o.seed + 77, 0.62, 0.12) : null;
  const st = big || stoneAt(x, y, s, fl, o.seed, 0.5, 1);
  if (!st) return o.mortar;
  const { bx, by, r, id, e } = st;
  const T = tones(o.stones[Math.floor(hash2(id, 3, o.seed) * o.stones.length)]);
  const u = bx / r, v = by / r, lit = -(u * 0.55 + v * 0.85);
  // moss on its top: a tuft of two greens on some of the stones
  if (o.moss && v < -0.22 && e > 0.3 && hash2(id, 11, o.seed) < 0.12) {
    const m = Math.abs(u - (hash2(id, 12, o.seed) - 0.5) * 0.8);
    if (m < 0.6 - (e - 0.3) * 0.25) return v < -0.55 || m < 0.2 ? o.moss[1] : o.moss[0];
  }
  // the underside's shadow, then the dome's light from the upper left
  let t;
  if (v > 0.38 && e > 0.74) t = 4;
  else if (lit > 0.42 && e < 0.8) t = 0;
  else if (lit > 0.02) t = 1;
  else if (lit > -0.4) t = 2;
  else t = lit > -0.72 ? 3 : 4;
  // weathering: broad soft patches a tone lighter or darker over its body (never its cap or its shadow)
  if (t >= 1 && t <= 3) {
    const n = noise2(x * 0.33, y * 0.4, o.seed + 31);
    if (n > 0.74) t--; else if (n < 0.2) t++;
  }
  // a crack across some of them
  if (hash2(id, 13, o.seed) < 0.1 && e < 0.85) {
    const ca = hash2(id, 14, o.seed) * Math.PI, d = Math.abs(u * Math.sin(ca) - v * Math.cos(ca) + (hash2(id, 15, o.seed) - 0.5) * 0.4);
    if (d < 0.07 + 0.04 * Math.abs(Math.sin(u * 9))) return T[4];
  }
  return T[t];
}

/**
 * The stone (if any) a pixel lies in on a jittered grid of cell size s: rows settled half a cell apart,
 * every cell with probability `p` holding a stone of radius rk·s (±18 %); null on the mortar.
 * @returns {{bx:number, by:number, r:number, id:number, e:number}|null}
 */
function stoneAt(x, y, s, fl, seed, rk, p) {
  const gx = Math.floor(x / s), gy = Math.floor((y * fl) / s);
  let d1 = 1e9, d2 = 1e9, bx = 0, by = 0, id = 0, r = 0, has = false;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = gx + i, cy = gy + j;
    if (p < 1 && hash2(cx, cy, seed + 9) > p) continue;
    const ox = (cy & 1) * 0.5;
    const px = (cx + ox + 0.25 + hash2(cx, cy, seed) * 0.5) * s, py = (cy + 0.25 + hash2(cx, cy, seed + 1) * 0.5) * s / fl;
    const dx = x + 0.5 - px, dy = (y + 0.5 - py) * fl, d = dx * dx + dy * dy;
    if (d < d1) { d2 = d1; d1 = d; bx = dx; by = dy; id = cx * 7919 + cy * 104729 + seed; r = s * rk * (0.82 + hash2(cx, cy, seed + 2) * 0.36); has = true; }
    else if (d < d2) d2 = d;
  }
  if (!has) return null;
  // between two stones, and in the corners where three meet: the mortar
  if (p >= 1 && Math.sqrt(d2) - Math.sqrt(d1) < 1.25) return null;
  const e = Math.sqrt(d1) / r;
  return e > 0.98 ? null : { bx, by, r, id, e };
}
