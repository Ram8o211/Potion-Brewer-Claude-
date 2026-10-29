// Colour for the procedural pixel art: OKLCh conversions and shading ramps.
//
// A ramp is a short list of colours from shadow to highlight, the way a pixel
// artist builds one: lightness steps evenly, the shadows lean toward a cool
// violet and lose a little chroma, the highlights lean toward warm light. Each
// colour is packed as a little-endian RGBA word (0xAABBGGRR) so it can be
// written straight into a Uint32Array view of image data.

import { rgbToOklab, oklabToRgb } from '../core/color.js';

/** sRGB 0..1 → [L, C, h°]. @param {number[]} rgb */
export function toLch(rgb) {
  const [L, a, b] = rgbToOklab(rgb[0], rgb[1], rgb[2]);
  return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
}

/** [L, C, h°] → sRGB 0..1 (chroma reduced until it fits the gamut). @param {number} L @param {number} C @param {number} h */
export function fromLch(L, C, h) {
  const r = (h * Math.PI) / 180;
  L = Math.max(0, Math.min(1, L));
  for (let k = 0; k < 8; k++) {
    const a = Math.cos(r) * C, b = Math.sin(r) * C;
    const rgb = oklabToRgb(L, a, b);
    // oklabToRgb clamps; test the gamut by converting back
    const back = rgbToOklab(rgb[0], rgb[1], rgb[2]);
    if (Math.abs(back[0] - L) < 0.02 && Math.hypot(back[1] - a, back[2] - b) < 0.02) return rgb;
    C *= 0.8;
  }
  return oklabToRgb(L, Math.cos(r) * C, Math.sin(r) * C);
}

/** Shortest signed hue difference b − a in degrees. */
export const hueDiff = (a, b) => ((((b - a) % 360) + 540) % 360) - 180;

/** Move hue `h` toward `target` by `t` (0..1) of the way. */
export const hueToward = (h, target, t) => (h + hueDiff(h, target) * t + 360) % 360;

/** Pack sRGB 0..1 (and alpha 0..1) into 0xAABBGGRR. @param {number[]} rgb @param {number} [a] */
export function pack(rgb, a = 1) {
  const r = Math.round(Math.max(0, Math.min(1, rgb[0])) * 255), g = Math.round(Math.max(0, Math.min(1, rgb[1])) * 255), b = Math.round(Math.max(0, Math.min(1, rgb[2])) * 255);
  return ((Math.round(a * 255) << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

/** Unpack 0xAABBGGRR to sRGB 0..1. @param {number} c */
export const unpack = (c) => [(c & 255) / 255, ((c >>> 8) & 255) / 255, ((c >>> 16) & 255) / 255];

/** Mix two packed colours (opaque result). @param {number} a @param {number} b @param {number} t */
export function mixPacked(a, b, t) {
  const r = (a & 255) + ((b & 255) - (a & 255)) * t, g = ((a >>> 8) & 255) + (((b >>> 8) & 255) - ((a >>> 8) & 255)) * t, bl = ((a >>> 16) & 255) + (((b >>> 16) & 255) - ((a >>> 16) & 255)) * t;
  return ((255 << 24) | (Math.round(bl) << 16) | (Math.round(g) << 8) | Math.round(r)) >>> 0;
}

/** Hex '#rrggbb' → sRGB 0..1. @param {string} hex */
export function hex(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/**
 * A shading ramp around a base colour.
 * @param {number[]} rgb base colour (sRGB 0..1), the ramp's middle
 * @param {{n?:number, spread?:number, cool?:number, warm?:number, sat?:number, lift?:number}} [o]
 *   n colours; spread of lightness from the darkest to the lightest; how far
 *   the shadows lean toward violet and the lights toward warm yellow; chroma
 *   scale; lightness offset of the whole ramp
 * @returns {number[]} packed colours, darkest first
 */
export function ramp(rgb, o = {}) {
  const n = o.n ?? 6, spread = o.spread ?? 0.5, cool = o.cool ?? 0.35, warm = o.warm ?? 0.25, sat = o.sat ?? 1, lift = o.lift ?? 0;
  const [L0, C0, h0] = toLch(rgb);
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const L = L0 + lift + (t - 0.55) * spread;
    // shadows cool and a little duller, lights warmer and paler at the very top
    const h = t < 0.55 ? hueToward(h0, 285, cool * (0.55 - t) * 1.6) : hueToward(h0, 75, warm * (t - 0.55) * 1.8);
    const C = C0 * sat * (t < 0.5 ? 0.75 + t * 0.5 : 1 - (t - 0.5) * 0.45) + (t < 0.3 ? 0.008 : 0);
    out.push(pack(fromLch(L, C, h)));
  }
  return out;
}

/** A colour shifted in OKLCh. @param {number[]} rgb @param {{dL?:number, dC?:number, cK?:number, dh?:number, h?:number, hT?:number}} d */
export function shift(rgb, d) {
  const [L, C, h] = toLch(rgb);
  const hh = d.h !== undefined ? hueToward(h, d.h, d.hT ?? 1) : h + (d.dh || 0);
  return fromLch(L + (d.dL || 0), Math.max(0, C * (d.cK ?? 1) + (d.dC || 0)), (hh + 360) % 360);
}
