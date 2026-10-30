// Painting helpers for the procedural wild environments: the canvas they
// compose into (a Pixels buffer, the side view's ground, liquid and cave
// maps and the map of where a plant's foot may rest), banded skies, flat
// washes of light, and the stamping of rasterized scenery models
// (visual/raster.js), so scenery and species share one pixel scale and one
// flat style (visual/style.js).

import { Pixels } from '../pixels.js';
import { rasterize } from '../raster.js';
import { Model } from '../geometry.js';
import { ramp, hex, mixPacked, pack, unpack } from '../color.js';

/** Scene size in art pixels. */
export const SCENE_W = 384;
export const SCENE_H = 216;

/**
 * The scenery's pixel, in art pixels: trees, rocks, timberwork and the
 * ground's shapes and texture are drawn in squares this big, on one grid
 * across the scene, so the painting has Noita's chunky pixels.
 */
export const CELL = 1;


/**
 * @typedef {{haze?:[number, number], outline?:boolean, foot?:[number, number], roots?:[number, number], seed?:number, texture?:number, dark?:number, cell?:number,
 *   claim?:number, sway?:number, test?:(p:import('../pixels.js').Pixels, X:number, Y:number)=>boolean}} StampOptions
 */

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
    /** 1 where there is ground (the side view's terrain), liquid, or a cave hollowed out of the ground */
    this.solid = new Uint8Array(SCENE_W * SCENE_H);
    this.liquid = new Uint8Array(SCENE_W * SCENE_H);
    this.cave = new Uint8Array(SCENE_W * SCENE_H);
    /** 1 where the cave's roof or walls are painted (cave.js caveFrame) */
    this.rock = new Uint8Array(SCENE_W * SCENE_H);
    /** 1 where a tree standing on the terrain is drawn (trees.js) */
    this.trees = new Uint8Array(SCENE_W * SCENE_H);
    /** which prop (a piece of scenery set down by `place`, numbered from 1) covers each pixel (0: none) */
    this.props = new Uint16Array(SCENE_W * SCENE_H);
    this.nprops = 0;
    /** the main ground's surface row in each column (side.js fillSolid), if the scene has one @type {Float32Array | null} */
    this.ground = null;
    this.seed = seed >>> 0;
    /** things the animation overlay needs (vents, pools, lights…) */
    this.meta = /** @type {Record<string, any>} */ ({});
    /** lights to add when the scene is finished: [x, y, r, rgb, strength] @type {[number, number, number, number[], number][]} */
    this.pending = [];
    /**
     * The foliage that sways in the wind, kept apart from the rest of the
     * painting from the first swaying piece on (null till then): `bare` is
     * the painting with none of it (what shows through where a leaf moves
     * off), `layer` the stamp that last painted each pixel of the rest (a
     * leaf only ever moves over what was painted before it, never in front
     * of what stands in front of it), and per swaying pixel its home pixel,
     * colour, stamp and group (the clump or strand it moves with).
     * @type {null | {bare:Uint32Array, layer:Uint32Array, seq:number, k:number[], c:number[], s:number[], g:number[],
     *   amp:number[], hang:number[], gx:number[], gn:number[], y0:number[], y1:number[]}}
     */
    this.sw = null;
  }

  /** @param {number} x @param {number} y @param {number} c */
  set(x, y, c) {
    this.pix.set(x, y, c);
    const s = this.sw;
    x |= 0; y |= 0;
    if (s && x >= 0 && y >= 0 && x < this.W && y < this.H) { const k = y * this.W + x; s.bare[k] = c; s.layer[k] = ++s.seq; }
  }

  /** Paint pixel k (an index into the scene) outright. @param {number} k @param {number} c */
  paint(k, c) {
    this.pix.px[k] = c;
    const s = this.sw;
    if (s) { s.bare[k] = c; s.layer[k] = ++s.seq; }
  }

  /** Start keeping the swaying foliage apart (see `sw`). */
  swayStart() {
    if (!this.sw) this.sw = { bare: this.pix.px.slice(), layer: new Uint32Array(this.W * this.H), seq: 0, k: [], c: [], s: [], g: [], amp: [], hang: [], gx: [], gn: [], y0: [], y1: [] };
    return this.sw;
  }

  /**
   * A group of swaying pixels moving together: `amp` how far (pixels) the
   * whole of it moves in a full gust, `hang` how much further its lowest
   * pixels swing than its top (a strand hanging from its top).
   * @param {number} amp @param {number} [hang]
   */
  swayGroup(amp, hang = 0) {
    const s = this.swayStart();
    s.amp.push(amp); s.hang.push(hang); s.gx.push(0); s.gn.push(0); s.y0.push(this.H); s.y1.push(0);
    return s.amp.length - 1;
  }

  /**
   * Paint a swaying pixel of group g (what was there stays in the bare painting).
   * @param {number} x @param {number} y @param {number} c @param {number} g @param {number} [seq] the stamp it belongs to (default: a stamp of its own)
   */
  swaySet(x, y, c, g, seq) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.W || y >= this.H) return;
    const s = this.swayStart(), k = y * this.W + x;
    this.pix.px[k] = c;
    s.k.push(k); s.c.push(c); s.s.push(seq ?? ++s.seq); s.g.push(g);
    s.gx[g] += x; s.gn[g]++;
    if (y < s.y0[g]) s.y0[g] = y;
    if (y > s.y1[g]) s.y1[g] = y;
  }

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
   * mirrors it; `foot` blocks the ground under it (an ellipse rx × ry) and
   * keeps plants from standing behind it; `roots` only blocks the ground at
   * its foot, so plants may stand in front of it (a tree in the side view).
   * It is drawn in `cell`-pixel squares (default CELL) on the scene's grid.
   * @param {import('../geometry.js').Model} model @param {Record<string, number[]>} pal
   * @param {number} x @param {number} y
   * `test(pixels, X, Y)` may refuse the placement (nothing is drawn, null returned).
   * @param {StampOptions} [o]
   */
  stamp(model, pal, x, y, o = {}) {
    const r = this.raster(model, pal, o);
    if (!r) return null;
    const X = Math.round(x) + r.left, Y = Math.round(y) + r.top;
    if (o.test && !o.test(r.raster.pix, X, Y)) return null;
    return this.put(r, x, y, o);
  }

  /**
   * A scenery model rasterized once, its frame on the scene's grid: what
   * `stamp` draws, and what `place` tries at several spots.
   * @param {import('../geometry.js').Model} model @param {Record<string, number[]>} pal @param {StampOptions} [o]
   */
  raster(model, pal, o = {}) {
    const b = model.bounds(), cell = o.cell ?? CELL, mod = (v) => ((v % cell) + cell) % cell;
    // with CELL = 1 the frame is the same wherever the model is set down
    let left = Math.floor(b.x0) - 1, top = Math.floor(b.y0) - 1;
    left -= mod(left); top -= mod(top);
    let w = Math.ceil(b.x1) + 2 - left, h = Math.ceil(b.y1) + 2 - top;
    w += mod(-w); h += mod(-h);
    if (w <= 0 || h <= 0 || w > 2000 || h > 2000) return null;
    model.transform(1, 0, 0, 1, -left, -top, 1);
    const ro = { seed: o.seed ?? this.seed, outline: o.outline, texture: o.texture, cell, grain: cell };
    const r = rasterize(model, w, h, pal, ro);
    tint(r.pix, o);
    return { raster: r, left, top, w, h, model, pal, ro, tint: { haze: o.haze, dark: o.dark } };
  }

  /**
   * Draw a rasterized model with its foot at (x, y) and mark what it covers.
   * @param {{raster:any, left:number, top:number, w:number, h:number, model?:any, pal?:any, ro?:any, tint?:any}} r @param {number} x @param {number} y @param {StampOptions} [o]
   */
  put(r, x, y, o = {}) {
    const p = r.raster.pix, w = r.w, h = r.h, X = Math.round(x) + r.left, Y = Math.round(y) + r.top;
    const parts = r.model ? r.model.parts : [], sways = o.sway !== 0 && parts.some((q) => q.sa !== undefined);
    if (sways || this.sw) this.putSway(r, X, Y, sways ? o.sway ?? 1 : 0);
    else this.pix.draw(p, X, Y);
    if (o.roots) this.blockEllipse(Math.round(x), Math.round(y) - 1, o.roots[0], o.roots[1]);
    if (o.foot) this.blockEllipse(Math.round(x), Math.round(y), o.foot[0], o.foot[1]);
    const fy = Math.round(y), id = o.claim ?? 0;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      if (!(p.px[j * w + i] >>> 24)) continue;
      const xx = X + i, yy = Y + j;
      if (xx < 0 || yy < 0 || xx >= this.W || yy >= this.H) continue;
      const k = yy * this.W + xx;
      // a prop's pixels are its own: nothing else is set down on them
      if (id) this.props[k] = id;
      if (!o.foot) continue;
      // the scenery covers what stands behind it; and nothing grows out of it
      if (fy > this.depth[k]) this.depth[k] = fy;
      this.open[k] = 0;
    }
    return { x: X, y: Y, w, h, raster: r.raster };
  }

  /**
   * Draw a rasterized model keeping its swaying parts apart (see `sw`):
   * each of its sway groups (parts sharing `sg`) moves as one, `sa` and `sh`
   * (times `mult`) giving its sway and its hang; what lies under the leaves
   * of the model itself (its branches) goes into the bare painting.
   * @param {{raster:any, w:number, h:number, model?:any, pal?:any, ro?:any, tint?:any}} r @param {number} X @param {number} Y @param {number} mult
   */
  putSway(r, X, Y, mult) {
    const p = r.raster.pix, part = r.raster.part, w = r.w, h = r.h, W = this.W, px = this.pix.px;
    const s = this.swayStart(), seq = ++s.seq, parts = r.model ? r.model.parts : [];
    let under = null;
    if (mult) {
      const bm = new Model();
      bm.parts = parts.filter((q) => q.sa === undefined);
      under = rasterize(bm, w, h, r.pal, r.ro).pix;
      tint(under, r.tint);
    }
    // the foliage's own pixels: deep inside it, what shows through a gap between
    // two clusters moving apart is the crown's shade, not the sky behind it
    const leafy = new Uint8Array(w * h);
    if (mult) for (let k = 0; k < w * h; k++) { const q = part && part[k] >= 0 ? parts[part[k]] : null; if (p.px[k] >>> 24 && q && q.sa !== undefined) leafy[k] = 1; }
    const inside = (/** @type {number} */ i, /** @type {number} */ j) => {
      for (let b = -2; b <= 2; b++) for (let a = -2; a <= 2; a++) {
        const ii = i + a, jj = j + b;
        if (ii < 0 || jj < 0 || ii >= w || jj >= h || !leafy[jj * w + ii]) return false;
      }
      return true;
    };
    /** @type {Map<number, number>} */
    const groups = new Map();
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      let c = p.px[j * w + i];
      const a = c >>> 24, xx = X + i, yy = Y + j;
      if (!a || xx < 0 || yy < 0 || xx >= W || yy >= this.H) continue;
      const k = yy * W + xx;
      if (a < 255) c = mixPacked(px[k] | 0xff000000, c | 0xff000000, a / 255);
      const q = part ? parts[part[j * w + i]] : null;
      if (mult && q && q.sa !== undefined) {
        const key = q.sg ?? 0;
        let g = groups.get(key);
        if (g === undefined) { g = this.swayGroup(q.sa * mult, (q.sh || 0) * mult); groups.set(key, g); }
        const u = /** @type {any} */ (under).px[j * w + i];
        if (u >>> 24) { s.bare[k] = u; s.layer[k] = seq; }
        else if (inside(i, j)) { s.bare[k] = mixPacked(c, 0xff000000, 0.5); s.layer[k] = seq; }
        this.swaySet(xx, yy, c, g, seq);
      } else { px[k] = c; s.bare[k] = c; s.layer[k] = seq; }
    }
  }

  /**
   * The swaying foliage, done: per pixel its home, colour, stamp, how far it
   * hangs below its group's top (0..1), and per group its sway, hang and
   * centre column — or null if nothing in the scene sways.
   */
  swayData() {
    const s = this.sw;
    if (!s || !s.k.length) return null;
    const n = s.k.length, f = new Float32Array(n), home = new Uint8Array(this.W * this.H);
    // (the bare painting is the painting itself wherever no leaf sits)
    for (let i = 0; i < n; i++) home[s.k[i]] = 1;
    for (let k = 0; k < home.length; k++) if (!home[k]) s.bare[k] = this.pix.px[k];
    for (let i = 0; i < n; i++) { const g = s.g[i], y = Math.floor(s.k[i] / this.W); f[i] = s.hang[g] ? (y - s.y0[g]) / Math.max(1, s.y1[g] - s.y0[g]) : 0; }
    return {
      bare: s.bare, layer: s.layer, k: Int32Array.from(s.k), c: Uint32Array.from(s.c), s: Uint32Array.from(s.s), g: Int32Array.from(s.g), f,
      amp: Float32Array.from(s.amp), hang: Float32Array.from(s.hang), gx: Float32Array.from(s.gx, (v, g) => v / Math.max(1, s.gn[g])), gy: Float32Array.from(s.y0),
    };
  }

  /**
   * Apply op(colour, t) to every pixel of rows [y0, y1) where f(x, y) is
   * above nothing — to the painting, the bare painting and the swaying
   * pixels alike (light and haze fall on the leaves wherever they move).
   * @param {(x:number, y:number) => number} f @param {(c:number, t:number) => number} op
   */
  each(f, op, y0 = 0, y1 = this.H) {
    const W = this.W, px = this.pix.px, s = this.sw, a = Math.max(0, y0), b = Math.min(this.H, y1);
    for (let y = a; y < b; y++) for (let x = 0; x < W; x++) {
      const t = f(x, y);
      if (t <= 0.004) continue;
      const k = y * W + x;
      px[k] = op(px[k], t);
      if (s) s.bare[k] = op(s.bare[k], t);
    }
    if (s) for (let i = 0; i < s.k.length; i++) {
      const y = Math.floor(s.k[i] / W);
      if (y < a || y >= b) continue;
      const t = f(s.k[i] - y * W, y);
      if (t > 0.004) s.c[i] = op(s.c[i], t);
    }
  }

  /**
   * Set a piece of scenery down where it fits, near column x: on the main
   * ground (or, with `y`, on the surface nearest that row — a ledge's top),
   * its foot sunk `sink` rows into the ground. A spot fits when nothing of
   * the piece runs into the terrain above its foot, the cave's rock, a
   * liquid, a tree or another prop, and the ground under its whole base is
   * solid (it neither overhangs an edge nor bridges a hollow). The spots
   * tried step outward from x up to `range` pixels either side; where none
   * fits, nothing is drawn and null is returned.
   * @param {import('../geometry.js').Model} model @param {Record<string, number[]>} pal @param {number} x
   * @param {StampOptions & {y?:number, sink?:number, range?:number, step?:number, group?:number, x?:[number, number], free?:boolean}} [o]
   */
  place(model, pal, x, o = {}) {
    const r = this.raster(model, pal, o);
    if (!r) return null;
    const W = this.W, H = this.H, p = r.raster.pix, sink = o.sink ?? 1, range = o.range ?? 40, step = o.step ?? 3;
    const [xa, xb] = o.x || [2, W - 3], id = o.group ?? ++this.nprops;
    // the piece's base: the lowest opaque row of each of its columns; the low
    // columns (near its bottom) are what it stands on
    /** @type {[number, number][]} */
    const base = [];
    for (let i = 0; i < r.w; i++) for (let j = r.h - 1; j >= 0; j--) if (p.px[j * r.w + i] >>> 24) { base.push([i, j]); break; }
    const bottom = Math.max(...base.map(([, j]) => j)), low = base.filter(([, j]) => j >= bottom - 3);
    /** the surface row in a column: the main ground, or with `y` the surface nearest that row (-1: none) */
    const surfaceAt = (/** @type {number} */ cx) => {
      if (cx < 0 || cx >= W) return -1;
      if (o.y === undefined) return this.ground ? Math.round(this.ground[cx]) : -1;
      for (let d = 0; d <= 6; d++) for (const yy of [o.y + d, o.y - d]) {
        const k = yy * W + cx;
        if (yy > 0 && yy < H && this.solid[k] && !this.solid[k - W]) return yy;
      }
      return -1;
    };
    // on uneven ground it rests on the highest ground under its base
    const surface = (/** @type {number} */ cx) => {
      let top = H;
      for (const [i] of low) { const y = surfaceAt(cx + r.left + i); if (y >= 0) top = Math.min(top, y); }
      return top < H ? top : -1;
    };
    const fits = (/** @type {number} */ cx, /** @type {number} */ fy) => {
      const X = cx + r.left, Y = fy + r.top;
      for (let j = 0; j < r.h; j++) for (let i = 0; i < r.w; i++) {
        if (!(p.px[j * r.w + i] >>> 24)) continue;
        const xx = X + i, yy = Y + j;
        if (xx < 0 || xx >= W || yy < 1) return false;
        if (yy >= H) continue;
        const k = yy * W + xx;
        if (this.rock[k] || this.liquid[k] || this.trees[k] || (this.props[k] && this.props[k] !== id)) return false;
        if (this.solid[k] && yy < fy - sink) return false;
      }
      // standing on ground across its whole base: no gap under it deeper than a few rows
      for (const [i, j] of low) {
        const xx = X + i, yy = Math.max(Y + j, fy - sink);
        let under = false;
        for (let d = 0; d <= 4 && !under; d++) { const k = (yy + d) * W + xx; under = yy + d < H && !!this.solid[k] && !this.liquid[k]; }
        if (!under) return false;
      }
      return true;
    };
    for (let d = 0; d <= range; d += step) for (const s of d ? [1, -1] : [1]) {
      const cx = Math.round(x) + s * d;
      if (cx < xa || cx > xb) continue;
      const fy0 = surface(cx);
      if (fy0 < 0) continue;
      const fy = fy0 + sink;
      if (!o.free && !fits(cx, fy)) continue;
      return { ...this.put(r, cx, fy, { ...o, claim: id }), fx: cx, fy };
    }
    return null;
  }

  /** Whether a rectangle is free of terrain, rock, liquid, trees and props (for pieces drawn pixel by pixel). */
  clear(x0, y0, x1, y1) {
    for (let y = Math.max(0, y0); y <= Math.min(this.H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(this.W - 1, x1); x++) {
      const k = y * this.W + x;
      if (this.solid[k] || this.rock[k] || this.liquid[k] || this.trees[k] || this.props[k]) return false;
    }
    return x0 >= 0 && y0 >= 0 && x1 < this.W && y1 < this.H;
  }

  /** Claim a rectangle for a prop drawn pixel by pixel (where air is), so nothing else is set down on it. */
  claim(x0, y0, x1, y1) {
    const id = ++this.nprops;
    for (let y = Math.max(0, y0); y <= Math.min(this.H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(this.W - 1, x1); x++) {
      const k = y * this.W + x;
      if (!this.solid[k]) this.props[k] = id;
    }
  }

  /**
   * A light from a source: a disc fading smoothly out to radius r, added
   * when the scene is finished (cave.js finish), so it lights what is
   * painted after it too. Recorded in meta.lights for the animation.
   * @param {number} x @param {number} y @param {number} r @param {number[]} rgb @param {number} k
   */
  glow(x, y, r, rgb, k) {
    this.pending.push([x, y, r, rgb, k]);
    (this.meta.lights ||= []).push([Math.round(x), Math.round(y), r, rgb]);
  }

  /** Mix a colour over every painted pixel in a band, fading smoothly with `f(x, y)` (0..1). */
  wash(c, f, y0 = 0, y1 = this.H) {
    this.each(f, (q, t) => mixPacked(q, c, Math.min(1, t)), y0, y1);
  }

  /** Brighten pixels additively by colour c × t(x, y) (light, glow), smoothly. */
  light(rgb, f, y0 = 0, y1 = this.H) {
    this.each(f, (c, t) => {
      const r = Math.min(255, (c & 255) + rgb[0] * 255 * t), g = Math.min(255, ((c >>> 8) & 255) + rgb[1] * 255 * t), b = Math.min(255, ((c >>> 16) & 255) + rgb[2] * 255 * t);
      return ((255 << 24) | (Math.round(b) << 16) | (Math.round(g) << 8) | Math.round(r)) >>> 0;
    }, y0, y1);
  }
}

/** Fade a raster's pixels into the distance (haze) and darken them (dark). @param {Pixels} p @param {StampOptions} o */
function tint(p, o) {
  if (o.haze || o.dark) for (let k = 0; k < p.px.length; k++) {
    const c = p.px[k];
    if (!(c >>> 24)) continue;
    let q = c;
    if (o.haze) q = mixPacked(q, o.haze[0], o.haze[1]);
    if (o.dark) q = mixPacked(q, 0xff000000, o.dark);
    p.px[k] = q;
  }
}

/**
 * A sky (or a cave's back wall): a smooth vertical gradient through the
 * colour stops, a faint ordered dither keeping it free of banding.
 * @param {Canvas} cv @param {number} y0 @param {number} y1 @param {string[]} stops @param {number} [_bands] (unused: the gradient is smooth)
 */
export function sky(cv, y0, y1, stops, _bands) {
  const cols = stops.map(hex);
  const at = (t) => {
    const f = Math.min(cols.length - 1.0001, Math.max(0, t) * (cols.length - 1)), i = Math.floor(f), u = f - i;
    return cols[i].map((v, k) => v + (cols[i + 1][k] - v) * u);
  };
  const B = [0, 0.5, 0.125, 0.625, 0.75, 0.25, 0.875, 0.375];
  for (let y = y0; y < y1; y++) {
    const c = at(Math.pow((y - y0) / Math.max(1, y1 - y0 - 1), 0.9));
    for (let x = 0; x < cv.W; x++) {
      const d = (B[(x & 3) + ((y & 1) << 2)] - 0.5) / 255;
      cv.set(x, y, pack([c[0] + d, c[1] + d, c[2] + d]));
    }
  }
}

export { ramp, hex, mixPacked, pack, unpack };
