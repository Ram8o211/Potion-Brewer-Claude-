// Deterministic integer hashing and smooth value noise for the procedural
// graphics. Everything is a pure function of its inputs (no global state, no
// Math.random), so a seed always paints the same pixels on every device.

/** 32-bit integer hash of up to three integers and a seed → [0, 1). */
export function hash3(x, y, z, seed) {
  let h = (seed ^ Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(z | 0, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/** @param {number} x @param {number} y @param {number} seed */
export const hash2 = (x, y, seed) => hash3(x, y, 0, seed);

const smooth = (t) => t * t * (3 - 2 * t);

/** Smooth 2D value noise in [0, 1). @param {number} x @param {number} y @param {number} seed */
export function noise2(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = smooth(x - xi), fy = smooth(y - yi);
  const a = hash3(xi, yi, 0, seed), b = hash3(xi + 1, yi, 0, seed), c = hash3(xi, yi + 1, 0, seed), d = hash3(xi + 1, yi + 1, 0, seed);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Smooth 1D value noise in [0, 1). @param {number} x @param {number} seed */
export function noise1(x, seed) {
  const xi = Math.floor(x), f = smooth(x - xi);
  const a = hash3(xi, 0, 7, seed), b = hash3(xi + 1, 0, 7, seed);
  return a + (b - a) * f;
}

/** Fractal 2D noise in about [0, 1). @param {number} x @param {number} y @param {number} seed @param {number} [oct] */
export function fbm2(x, y, seed, oct = 4) {
  let v = 0, amp = 0.5, tot = 0;
  for (let o = 0; o < oct; o++) {
    v += noise2(x, y, seed + o * 101) * amp;
    tot += amp;
    x *= 2.03; y *= 2.03; amp *= 0.5;
  }
  return v / tot;
}

/** Fractal 1D noise in about [0, 1). @param {number} x @param {number} seed @param {number} [oct] */
export function fbm1(x, seed, oct = 4) {
  let v = 0, amp = 0.5, tot = 0;
  for (let o = 0; o < oct; o++) {
    v += noise1(x, seed + o * 131) * amp;
    tot += amp;
    x *= 2.07; amp *= 0.5;
  }
  return v / tot;
}

/** 4×4 ordered dither threshold in [0, 1). */
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
/** @param {number} x @param {number} y */
export const bayer = (x, y) => (BAYER4[(x & 3) + (y & 3) * 4] + 0.5) / 16;
