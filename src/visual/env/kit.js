// Shared building blocks of the region composers: their palettes (ramps by
// material name, for the scenery models stamped into a scene), the world's
// variation of them, and the random streams each part is drawn from. The
// side-view terrain, liquids and lights are in side.js.

import { ramp, hex } from './paint.js';
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
