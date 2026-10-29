// Shared building blocks of the region composers: their palettes (ramps by
// material name), perspective (size and haze by distance below the
// horizon), river and pool shapes, and small scattered details.

import { ramp, hex, mixPacked, noise2, fbm2, bayer, hash2 } from './paint.js';
import { Rng, hashString } from '../../core/rng.js';
import { shift } from '../color.js';

/** Ramps from hex base colours: { name: '#rrggbb' | [hex, options] }. */
export function palette(spec) {
  /** @type {Record<string, number[]>} */
  const out = {};
  for (const [k, v] of Object.entries(spec)) out[k] = Array.isArray(v) ? ramp(hex(v[0]), v[1]) : ramp(hex(v));
  return out;
}

/** A palette whose every colour is shifted (world variation of a region's colours). */
export function vary(pal, rng, amt = 1) {
  const dh = (rng.next() - 0.5) * 16 * amt, cK = 1 + (rng.next() - 0.5) * 0.2 * amt, dL = (rng.next() - 0.5) * 0.04 * amt;
  /** @type {Record<string, number[]>} */
  const out = {};
  for (const [k, r] of Object.entries(pal)) out[k] = r.map((c) => {
    const rgb = [(c & 255) / 255, ((c >>> 8) & 255) / 255, ((c >>> 16) & 255) / 255];
    const s = shift(rgb, { dh, cK, dL });
    return ((255 << 24) | (Math.round(s[2] * 255) << 16) | (Math.round(s[1] * 255) << 8) | Math.round(s[0] * 255)) >>> 0;
  });
  return out;
}

/** A random stream for one part of a region's composition. */
export const streamOf = (seed, region, part) => new Rng(hashString(`env:${seed}:${region}:${part}`));

/** How near a ground row is (0 at the horizon, 1 at the bottom edge). */
export const nearness = (y, horizon, H) => Math.max(0, Math.min(1, (y - horizon) / (H - horizon)));

/** Scale of something standing at row y (distant things are smaller). */
export const scaleAt = (y, horizon, H, far = 0.45, near = 1.15) => far + (near - far) * nearness(y, horizon, H);

/** Haze toward the horizon: [colour, amount] for Canvas.stamp. */
export const hazeAt = (y, horizon, H, colour, max = 0.45) => /** @type {[number, number]} */ ([colour, max * Math.pow(1 - nearness(y, horizon, H), 2.2)]);

/**
 * A winding band across the ground (a river, a lava flow, a path): its
 * centre and half-width on each row from the horizon down.
 * @param {Rng} rng @param {number} horizon @param {number} H @param {{x0:number, x1:number, w0:number, w1:number, wander:number}} o
 */
export function band(rng, horizon, H, o) {
  const ph = rng.next() * 10, ph2 = rng.next() * 10;
  const rows = [];
  for (let y = 0; y < H; y++) {
    const t = Math.max(0, (y - horizon) / (H - horizon));
    const c = o.x0 + (o.x1 - o.x0) * t + Math.sin(t * 4.5 + ph) * o.wander * (0.4 + t) + Math.sin(t * 11 + ph2) * o.wander * 0.25;
    rows.push({ c, hw: o.w0 + (o.w1 - o.w0) * t });
  }
  return rows;
}

/** Whether (x, y) lies in a noise-shaped pool field (perspective flattened). */
export function inPool(x, y, horizon, H, seed, thr) {
  const t = nearness(y, horizon, H);
  if (t <= 0.02) return false;
  return fbm2(x * (0.025 + t * 0.012), y * (0.07 + t * 0.03), seed, 3) > thr;
}

/** Scattered single-pixel details over open ground: flowers, pebbles, sparkles. */
export function speckle(cv, rng, n, y0, y1, colours, o = {}) {
  // sparse: the ground stays plain, so what grows on it stands out
  n = Math.round(n * 0.3);
  for (let i = 0; i < n; i++) {
    const x = rng.int(0, cv.W - 1), y = rng.int(y0, y1 - 1);
    if (o.onOpen && !cv.open[y * cv.W + x]) continue;
    if (o.cluster && fbm2(x * 0.05, y * 0.09, o.cluster, 2) < 0.52) continue;
    const c = colours[Math.floor(rng.next() * colours.length)];
    cv.set(x, y, c);
    if (o.big && y > y0 + (y1 - y0) * 0.5) { cv.set(x + 1, y, c); if (o.stem) cv.set(x, y + 1, o.stem); }
  }
}

export { mixPacked, noise2, fbm2, bayer, hash2, Rng };
