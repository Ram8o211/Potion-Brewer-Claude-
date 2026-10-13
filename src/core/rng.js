// Deterministic, seedable pseudo-random number generation.
// All procedural content (ingredients, customers, commissions) derives from
// these generators so a world seed always reproduces the same ecosystem.

/**
 * Hash an arbitrary string into a 32-bit unsigned integer (FNV-1a + avalanche).
 * @param {string} str
 * @returns {number}
 */
export function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Small fast PRNG (sfc32) with helper methods. */
export class Rng {
  /** @param {number|string} seed */
  constructor(seed) {
    const s = typeof seed === 'string' ? hashString(seed) : seed >>> 0;
    this.a = s ^ 0x9e3779b9;
    this.b = Math.imul(s, 0x85ebca6b) ^ 0x243f6a88;
    this.c = Math.imul(s ^ 0x13198a2e, 0xc2b2ae35);
    this.d = 1;
    for (let i = 0; i < 16; i++) this.next();
  }
  /** @returns {number} float in [0,1) */
  next() {
    let a = this.a, b = this.b, c = this.c, d = this.d;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    this.a = a; this.b = b; this.c = c; this.d = d;
    return (t >>> 0) / 4294967296;
  }
  /** @param {number} lo @param {number} hi */
  range(lo, hi) { return lo + (hi - lo) * this.next(); }
  /** @param {number} lo @param {number} hi inclusive */
  int(lo, hi) { return lo + Math.floor(this.next() * (hi - lo + 1)); }
  /** @template T @param {T[]} arr @returns {T} */
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  /** @param {number} p */
  chance(p) { return this.next() < p; }
  /** Approximately normal(0,1). */
  gauss() {
    let u = 0, v = 0;
    while (u === 0) u = this.next();
    v = this.next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  /** @template T @param {T[]} arr @returns {T[]} shuffled copy */
  shuffle(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }
  /** Weighted pick. @template T @param {T[]} items @param {number[]} weights @returns {T} */
  weighted(items, weights) {
    let total = 0;
    for (const w of weights) total += w;
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
  /** Derive an independent child generator. @param {string} label */
  fork(label) {
    return new Rng((hashString(label) ^ Math.floor(this.next() * 4294967296)) >>> 0);
  }
}
