// The house style of the procedural pixel art, after Noita: everything is
// painted as a material, like the wilds' ground — a flat body colour (and a
// shadow where it turns away from the light), broad blotches a step
// lighter, a few grains, a bright crust along edges open to the sky and
// dark rims elsewhere — with no dither, and crisp near-black outlines round
// everything that can be picked up, so an ingredient reads against the
// ground at a glance.

import { Pixels } from './pixels.js';

/** The near-black, faintly violet ink of outlines. */
export const INK = 0xff1a1016;

/** Lightness bands (upper bounds) and where in a ramp each band's tone sits. */
const BANDS = [0.3, 0.6, 0.9, Infinity];
const AT = [0.1, 0.45, 0.78, 1];

/**
 * The ramp index of a lightness (0..1), reduced to the style's tones.
 * @param {number} n ramp length @param {number} l lightness
 */
export function toneOf(n, l) {
  let b = 0;
  while (l >= BANDS[b]) b++;
  return Math.round(AT[b] * (n - 1));
}

/**
 * The ramp index of a pixel painted as a material: its lightness picks the
 * shadow, the body or (only for real highlights) the light; a blotch
 * (blot > 0.56) lifts the body a step; a grain (h near 0 or 1) darkens or
 * lightens it. `g` (0..1+) scales blotches and grains (0: plain).
 * @param {number} n ramp length @param {number} l lightness @param {number} blot 0..1 @param {number} h 0..1 @param {number} g
 */
export function materialTone(n, l, blot, h, g) {
  const top = n - 1;
  let i = l < 0.36 ? Math.round(top * 0.15) : l < 0.84 ? Math.round(top * 0.45) : Math.round(top * 0.85);
  if (l >= 0.36 && l < 0.84 && blot > 0.56 && g > 0) i++;
  if (g > 0 && h > 1 - 0.035 * g) i += 2;
  else if (g > 0 && h < 0.03 * g) i -= 2;
  return Math.max(0, Math.min(top, i));
}

/**
 * The same pixels framed one pixel wider on every side and ringed with ink
 * wherever they border the empty background.
 * @param {Pixels} src @returns {Pixels}
 */
export function inked(src) {
  const w = src.w + 2, h = src.h + 2, p = new Pixels(w, h);
  const op = (x, y) => x >= 0 && y >= 0 && x < src.w && y < src.h && src.px[y * src.w + x] >>> 24;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (op(x - 1, y - 1)) continue;
    if (op(x - 2, y - 1) || op(x, y - 1) || op(x - 1, y - 2) || op(x - 1, y)) p.px[y * w + x] = INK;
  }
  p.draw(src, 1, 1);
  return p;
}
