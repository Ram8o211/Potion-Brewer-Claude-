// The cobbled stone the caverns are built of (cave.js): ground, pillars,
// roof and walls share this one texture, so they read as one rock.

import { hash2 } from '../noise.js';
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
 * The wilds' stone: rounded pebbles and cobbles of uneven sizes, each an
 * egg a little wider than tall, set apart in a thick near-black mortar
 * that shows round every one, and each shaded in five flat tones as a lit
 * dome — a bright cap on its upper left, a lit shoulder, its body, a
 * shaded flank and a deep shadow along its underside. No speckle: every
 * stone reads clean at a glance.
 * @param {number} x @param {number} y @param {{stones:number[], mortar:number, s:number, seed:number, flat?:number}} o
 */
export function pebble(x, y, o) {
  const s = o.s, fl = o.flat ?? 1.3, gx = Math.floor(x / s), gy = Math.floor((y * fl) / s);
  let d1 = 1e9, d2 = 1e9, bx = 0, by = 0, id = 0, r = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = gx + i, cy = gy + j;
    // rows offset by half a stone, like stones settled on one another
    const ox = (cy & 1) * 0.5;
    const px = (cx + ox + 0.25 + hash2(cx, cy, o.seed) * 0.5) * s, py = (cy + 0.25 + hash2(cx, cy, o.seed + 1) * 0.5) * s / fl;
    const dx = x + 0.5 - px, dy = (y + 0.5 - py) * fl, d = dx * dx + dy * dy;
    if (d < d1) { d2 = d1; d1 = d; bx = dx; by = dy; id = cx * 7919 + cy * 104729; r = s * (0.5 + hash2(cx, cy, o.seed + 2) * 0.18); }
    else if (d < d2) d2 = d;
  }
  const mortar = o.mortar;
  // between two stones, and in the corners where three meet: the mortar
  if (Math.sqrt(d2) - Math.sqrt(d1) < 1.25) return mortar;
  const e = Math.sqrt(d1) / r;
  if (e > 0.98) return mortar;
  const T = tones(o.stones[Math.floor(hash2(id, 3, o.seed) * o.stones.length)]);
  const u = bx / r, v = by / r, lit = -(u * 0.55 + v * 0.85);
  // the underside's shadow, then the dome's light from the upper left
  if (v > 0.38 && e > 0.74) return T[4];
  if (lit > 0.42 && e < 0.8) return T[0];
  if (lit > 0.02) return T[1];
  if (lit > -0.4) return T[2];
  return lit > -0.72 ? T[3] : T[4];
}
