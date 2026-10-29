// Painting helpers for the procedural wild environments: the canvas they
// compose into (a Pixels buffer plus the map of where a plant's foot may
// rest), banded skies, noise-built silhouettes, perspective ground in broad
// flat patches, and the stamping of rasterized scenery models
// (visual/raster.js), so scenery and species share one pixel scale and one
// flat style (visual/style.js).

import { Pixels } from '../pixels.js';
import { rasterize } from '../raster.js';
import { noise2, fbm1, fbm2, bayer, hash2 } from '../noise.js';
import { ramp, hex, mixPacked, pack, unpack } from '../color.js';
import { toneOf } from '../style.js';

/** Scene size in art pixels. */
export const SCENE_W = 384;
export const SCENE_H = 216;

/** A wash or light's strength in flat steps, so it falls off in hard-edged bands, not a gradient. @param {number} t */
const step = (t) => Math.floor(t / 0.07) * 0.07;

/**
 * The canvas a region is composed on.
 * pix: the painting; open: 1 where a plant's foot may rest (open ground);
 * floor: 1 where there is ground at all (not sky, water, lava or cliff).
 */
export class Canvas {
  constructor(seed) {
    this.W = SCENE_W; this.H = SCENE_H;
    this.pix = new Pixels(SCENE_W, SCENE_H);
    this.open = new Uint8Array(SCENE_W * SCENE_H);
    /** the foot row of the scenery covering each pixel (0: none): a plant standing above that row would be behind it */
    this.depth = new Uint16Array(SCENE_W * SCENE_H);
    this.seed = seed >>> 0;
    /** things the animation overlay needs (vents, pools, lights…) */
    this.meta = /** @type {Record<string, any>} */ ({});
  }

  /** @param {number} x @param {number} y @param {number} c */
  set(x, y, c) { this.pix.set(x, y, c); }

  /** Mark a rectangle as not open ground (or open, with v = 1). */
  block(x0, y0, x1, y1, v = 0) {
    for (let y = Math.max(0, Math.floor(y0)); y < Math.min(this.H, Math.ceil(y1)); y++) for (let x = Math.max(0, Math.floor(x0)); x < Math.min(this.W, Math.ceil(x1)); x++) this.open[y * this.W + x] = v;
  }

  /** Mark an ellipse as not open ground. */
  blockEllipse(cx, cy, rx, ry) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      if (x < 0 || y < 0 || x >= this.W || y >= this.H) continue;
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) this.open[y * this.W + x] = 0;
    }
  }

  /**
   * Rasterize a scenery model and stamp it with its foot (model origin) at
   * (x, y). `haze` [packed colour, amount] fades it into the distance; `flip`
   * mirrors it; `foot` blocks the ground under it (an ellipse rx × ry).
   * @param {import('../geometry.js').Model} model @param {Record<string, number[]>} pal
   * @param {number} x @param {number} y
   * @param {{haze?:[number, number], outline?:boolean, foot?:[number, number], seed?:number, texture?:number, dark?:number}} [o]
   */
  stamp(model, pal, x, y, o = {}) {
    const b = model.bounds();
    const left = Math.floor(b.x0) - 1, top = Math.floor(b.y0) - 1;
    const w = Math.ceil(b.x1) + 2 - left, h = Math.ceil(b.y1) + 2 - top;
    if (w <= 0 || h <= 0 || w > 2000 || h > 2000) return null;
    model.transform(1, 0, 0, 1, -left, -top, 1);
    const r = rasterize(model, w, h, pal, { seed: o.seed ?? this.seed, outline: o.outline, texture: o.texture });
    const p = r.pix;
    if (o.haze || o.dark) for (let k = 0; k < p.px.length; k++) {
      const c = p.px[k];
      if (!(c >>> 24)) continue;
      let q = c;
      if (o.haze) q = mixPacked(q, o.haze[0], o.haze[1]);
      if (o.dark) q = mixPacked(q, 0xff000000, o.dark);
      p.px[k] = q;
    }
    const X = Math.round(x) + left, Y = Math.round(y) + top;
    this.pix.draw(p, X, Y);
    if (o.foot) {
      this.blockEllipse(Math.round(x), Math.round(y), o.foot[0], o.foot[1]);
      // the scenery covers what stands behind it; and nothing grows out of it
      const fy = Math.round(y);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        if (!(p.px[j * w + i] >>> 24)) continue;
        const xx = X + i, yy = Y + j;
        if (xx < 0 || yy < 0 || xx >= this.W || yy >= this.H) continue;
        const k = yy * this.W + xx;
        if (fy > this.depth[k]) this.depth[k] = fy;
        this.open[k] = 0;
      }
    }
    return { x: X, y: Y, w, h, raster: r };
  }

  /** Mix a colour over every painted pixel in a band, fading with `f(x, y)` (0..1) in flat steps. */
  wash(c, f, y0 = 0, y1 = this.H) {
    for (let y = Math.max(0, y0); y < Math.min(this.H, y1); y++) for (let x = 0; x < this.W; x++) {
      const t = step(f(x, y));
      if (t <= 0.004) continue;
      const k = y * this.W + x;
      this.pix.px[k] = mixPacked(this.pix.px[k], c, Math.min(1, t));
    }
  }

  /** Brighten pixels additively by colour c × t(x, y) (light, glow), in flat steps. */
  light(rgb, f, y0 = 0, y1 = this.H) {
    for (let y = Math.max(0, y0); y < Math.min(this.H, y1); y++) for (let x = 0; x < this.W; x++) {
      const t = step(f(x, y));
      if (t <= 0.004) continue;
      const k = y * this.W + x, c = this.pix.px[k];
      const r = Math.min(255, (c & 255) + rgb[0] * 255 * t), g = Math.min(255, ((c >>> 8) & 255) + rgb[1] * 255 * t), b = Math.min(255, ((c >>> 16) & 255) + rgb[2] * 255 * t);
      this.pix.px[k] = ((255 << 24) | (Math.round(b) << 16) | (Math.round(g) << 8) | Math.round(r)) >>> 0;
    }
  }
}

/**
 * A sky: vertical colour stops quantised into a few flat bands with hard
 * edges, each band a little taller than the one above it.
 * @param {Canvas} cv @param {number} y0 @param {number} y1 @param {string[]} stops @param {number} [bands]
 */
export function sky(cv, y0, y1, stops, bands = 12) {
  const cols = stops.map(hex), n = Math.max(3, Math.min(6, Math.round(bands / 2)));
  const at = (t) => {
    const f = Math.min(cols.length - 1.0001, t * (cols.length - 1)), i = Math.floor(f), u = f - i;
    return cols[i].map((v, k) => v + (cols[i + 1][k] - v) * u);
  };
  const steps = Array.from({ length: n }, (_, i) => pack(at(i / (n - 1))));
  for (let y = y0; y < y1; y++) {
    const t = (y - y0) / Math.max(1, y1 - y0 - 1), b = Math.min(n - 1, Math.floor(Math.pow(t, 0.8) * n));
    for (let x = 0; x < cv.W; x++) cv.set(x, y, steps[b]);
  }
}

/**
 * A silhouette whose top follows fractal noise from `base` (± amp), filled
 * down to `bottom`, textured with clusters of its ramp and lit along its rim.
 * Returns its height line.
 * @param {Canvas} cv @param {{base:number, amp:number, freq:number, bottom:number, ramp:number[], seed:number, rough?:number, rim?:number, tex?:number, peaks?:number}} o
 */
export function ridge(cv, o) {
  const top = new Float32Array(cv.W);
  for (let x = 0; x < cv.W; x++) {
    let v = fbm1(x * o.freq, o.seed, 5);
    if (o.peaks) v = Math.pow(v, 1 / (1 + o.peaks));
    top[x] = o.base - (v - 0.5) * 2 * o.amp - (o.rough ? (fbm1(x * o.freq * 6, o.seed + 9, 2) - 0.5) * o.rough : 0);
  }
  const R = o.ramp, n = R.length;
  for (let x = 0; x < cv.W; x++) {
    const t0 = Math.round(top[x]);
    for (let y = Math.max(0, t0); y < Math.min(cv.H, o.bottom); y++) {
      const depth = (y - t0) / Math.max(1, o.bottom - t0);
      // slopes facing the light are lighter
      const slope = (top[Math.max(0, x - 2)] - top[Math.min(cv.W - 1, x + 2)]) * 0.25;
      let l = 0.5 - depth * 0.2 - slope * 0.25 + (fbm2(x * 0.04, y * 0.06, o.seed + 3, 2) - 0.5) * (o.tex ?? 0.5) * 0.6;
      if (y - t0 < (o.rim ?? 1)) l += 0.35;
      cv.set(x, y, R[toneOf(n, l)]);
    }
  }
  return top;
}

/**
 * Ground below a horizon line, textured in perspective: noise clusters are
 * stretched flat toward the horizon and grow toward the viewer.
 * @param {Canvas} cv @param {Float32Array|number[]} horizon y of the ground's top per column
 * @param {(x:number, y:number, depth:number, n:number)=>number} colour packed colour of a ground pixel (n: clustered noise 0..1)
 * @param {number} seed @param {boolean} [open] mark it as open ground
 */
export function ground(cv, horizon, colour, seed, open = true) {
  for (let x = 0; x < cv.W; x++) {
    const h0 = Math.round(horizon[x]);
    for (let y = Math.max(0, h0); y < cv.H; y++) {
      const depth = (y - h0 + 1) / (cv.H - h0 + 1);
      // broad patches: low-frequency noise, sampled on 2-pixel cells
      const cx = x & ~1, sx = cx * (0.03 + depth * 0.05), sy = y * (0.06 + depth * 0.08);
      const n = fbm2(sx, sy * 1.6, seed, 2);
      cv.set(x, y, colour(x, y, depth, n));
      if (open) cv.open[y * cv.W + x] = 1;
    }
  }
}

/**
 * Grass texture (−0.5..0.5): broad soft swells with, here and there, a
 * short vertical strand that lengthens toward the viewer.
 */
export function blades(x, y, depth, seed) {
  const L = 2 + Math.floor(depth * 4), strand = hash2(x >> 1, Math.floor((y + hash2(x >> 1, 0, seed) * 8) / L), seed);
  return (strand > 0.9 ? 0.3 : strand < 0.06 ? -0.3 : 0) + (noise2(x * 0.08, y * 0.06, seed + 1) - 0.5) * 0.35;
}

/** Pick a ramp colour from a lightness (0..1), reduced to the style's flat tones. */
export function shadeOf(R, l, x, y) {
  return R[toneOf(R.length, l)];
}

export { ramp, hex, mixPacked, pack, unpack, noise2, fbm1, fbm2, bayer, hash2 };
