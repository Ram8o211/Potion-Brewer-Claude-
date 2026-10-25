// Wild sprites: one atlas per region — the Sunlit Meadow
// (assets/meadow/atlas.png, built by scripts/make-meadow.py) and Whisperwood,
// Willow Bank, Ironstone Quarry, Moonfen and the Ember Crags
// (assets/wilds/<region>.png, scripts/make-wilds.py) — of decorative world
// objects and the gatherables that stand for the region's real ingredients,
// keyed by the ingredient's wild key (materials/wild.js).
// Each gatherable has idle, hover and depleted frames and, where the art
// exists, harvesting and closed ones (a dawn or dusk plant out of its
// hour); all frames of one gatherable share a canvas anchored at its bottom
// centre, so states swap in place. A `card` frame is the picture on its
// deposit card (the ingredient's single flower, root, crystal…) and an
// `icon` frame the 16 px picture on the shelf and in the book. The plants of
// a deposit beyond the player's guild rank are not drawn in the scene at
// all; its card says what rank opens it.
//
// What grows on the ground is drawn from one more atlas, the growth atlas
// (assets/growth/atlas.png, scripts/make-growth.py): every ingredient as a
// sprout, ripe and mature plant, plus a hover frame for the mature one, all
// on one bottom-centre anchor so a plant grows in place.
//
// Each atlas loads once, in the background; until it has (and in Node, where
// there is no Image), callers fall back to the procedural painting. Layout
// and hit testing are pure functions of the frame sizes so they can be tested
// without a browser.

import { ATLASES } from './wilds-atlas.js';
import * as FIELD from './meadow-atlas.js';
import * as GROW from './growth-atlas.js';
import { rawSprite } from './scenes.js';

/** One sprite sheet and its frame rectangles [x, y, w, h]. */
export class SpriteAtlas {
  /** @param {string} url @param {Record<string, [number, number, number, number]>} frames */
  constructor(url, frames) {
    this.url = url;
    this.frames = frames;
    /** @type {HTMLImageElement | null} */
    this.img = null;
    this.ready = false;
    /** @type {Promise<boolean> | null} */
    this.loading = null;
    /** the sheet's RGBA pixels, read once for the frames' masks (set directly where there is no canvas) @type {{width:number, data:ArrayLike<number>} | null} */
    this.pixels = null;
    /** @type {Record<string, Uint8Array>} */
    this.masks = {};
  }

  /** Start loading (once). Resolves true when it can be drawn, false without a DOM or on error. */
  load() {
    if (this.loading) return this.loading;
    if (typeof Image === 'undefined') return (this.loading = Promise.resolve(false));
    this.loading = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { this.img = img; this.ready = true; resolve(true); };
      img.onerror = () => resolve(false);
      img.src = this.url;
    });
    return this.loading;
  }

  /** @param {string} name */
  frame(name) {
    return this.frames[name] || null;
  }

  /**
   * Which pixels of a frame are opaque, row by row (w × h, 1 for opaque), or
   * null until the sheet's pixels can be read.
   * @param {string} name
   */
  mask(name) {
    const f = this.frames[name];
    if (!f) return null;
    if (this.masks[name]) return this.masks[name];
    if (!this.pixels && this.img && typeof document !== 'undefined') {
      const cv = document.createElement('canvas');
      cv.width = this.img.width; cv.height = this.img.height;
      const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d', { willReadFrequently: true }));
      ctx.drawImage(this.img, 0, 0);
      this.pixels = { width: cv.width, data: ctx.getImageData(0, 0, cv.width, cv.height).data };
    }
    if (!this.pixels) return null;
    const [x, y, w, h] = f, { width, data } = this.pixels, m = new Uint8Array(w * h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) m[j * w + i] = data[((y + j) * width + x + i) * 4 + 3] > 0 ? 1 : 0;
    return (this.masks[name] = m);
  }

  /**
   * Draw a frame with its bottom centre at (x, y), at an integer scale.
   * @param {CanvasRenderingContext2D} ctx @param {string} name @param {number} x @param {number} y @param {number} [scale] @param {boolean} [flip] mirror horizontally
   */
  draw(ctx, name, x, y, scale = 1, flip = false) {
    const f = this.frames[name];
    if (!f || !this.img) return;
    const w = f[2] * scale, h = f[3] * scale, left = Math.round(x - w / 2), top = Math.round(y - h);
    if (flip) {
      ctx.save();
      ctx.translate(left + w, top);
      ctx.scale(-1, 1);
      ctx.drawImage(this.img, f[0], f[1], f[2], f[3], 0, 0, w, h);
      ctx.restore();
    } else ctx.drawImage(this.img, f[0], f[1], f[2], f[3], left, top, w, h);
  }

  /**
   * A small square canvas of one frame, centred (a deposit card's picture).
   * @param {string} name
   */
  canvas(name) {
    const f = this.frames[name];
    const cv = document.createElement('canvas');
    const s = f ? Math.max(f[2], f[3]) : 16;
    cv.width = s; cv.height = s;
    const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
    if (f) this.draw(ctx, name, s / 2, s - Math.floor((s - f[3]) / 2));
    return cv;
  }
}

export const MEADOW = new SpriteAtlas(FIELD.ATLAS_URL, FIELD.FRAMES);

/** The atlas each region's scene is composed from. @type {Record<string, SpriteAtlas>} */
export const REGION_ATLAS = {
  meadow: MEADOW,
  ...Object.fromEntries(Object.entries(ATLASES).map(([region, a]) => [region, new SpriteAtlas(a.url, a.frames)])),
};

/**
 * @typedef {{region:string, atlas:SpriteAtlas, idle:string, hover:string, card:string, depleted:string,
 *   harvesting?:string, closed?:string, closedHover?:string, icon?:string}} Gatherable
 */

/** @param {string} region @param {SpriteAtlas} atlas @param {string} k @returns {[string, Gatherable]} */
function gatherable(region, atlas, k) {
  const has = (/** @type {string} */ n) => !!atlas.frames[k + '_' + n];
  return [k, {
    region, atlas, idle: k + '_idle', hover: k + '_hover', card: has('card') ? k + '_card' : k + '_idle',
    depleted: k + '_depleted',
    ...(has('harvesting') ? { harvesting: k + '_harvesting' } : {}),
    ...(has('closed') ? { closed: k + '_closed', closedHover: k + '_closed_hover' } : {}),
    ...(has('icon') ? { icon: k + '_icon' } : {}),
  }];
}

/** Which frames each sprite-drawn ingredient uses. @type {Record<string, Gatherable>} */
export const GATHERABLES = Object.fromEntries(Object.entries({
  forest: ['ironroot', 'silverleaf', 'nightshade', 'owlberry', 'emberbark', 'witchear', 'mandrake'],
  meadow: ['heartpetal', 'sunthistle', 'nettle', 'dreamclover', 'beebalm', 'hemlock'],
  river: ['riverchalk', 'frostcap', 'bogbean', 'willowbark', 'reedmace', 'riverpearl'],
  quarry: ['emberflint', 'mica', 'saltpetre', 'sulfur', 'lodestone', 'cinnabar', 'stormglass'],
  moonfen: ['gravemoss', 'starquartz', 'wisplichen', 'moonlily', 'toadstool', 'sirenreed'],
  crags: ['dragonpepper', 'cinderscale', 'ashbloom', 'obsidian'],
}).flatMap(([region, keys]) => keys.map((k) => gatherable(region, REGION_ATLAS[region], k))));

/** Every wild ingredient as a sprout, ripe and mature plant. */
export const GROWTH = new SpriteAtlas(GROW.ATLAS_URL, GROW.FRAMES);

/**
 * The growth frame of a plant at a stage (the hover frame only for a mature
 * one, the only stage that can be harvested), or null without art for it.
 * @param {string} key wild key @param {string} stage sprout | ripe | mature @param {boolean} [hover]
 */
export function growthFrame(key, stage, hover = false) {
  const name = `${key}_${stage}${hover && stage === 'mature' ? '_hover' : ''}`;
  return GROWTH.frames[name] ? name : null;
}

/** Smallest tap target around a deposit, in art pixels (≈ 30 CSS px on a phone). */
export const MIN_HIT = 20;

/**
 * The frame a gatherable shows. `can` is whether it can be harvested now;
 * `closed` a dawn or dusk plant out of its hour; `harvesting` a moment after
 * a harvest; `card` for the deposit card's picture.
 * @param {string} key wild key @param {{can:boolean, hover?:boolean, harvesting?:boolean, card?:boolean, closed?:boolean}} s
 */
export function gatherFrameName(key, s) {
  const g = GATHERABLES[key];
  if (!g) return null;
  if (s.harvesting && g.harvesting) return g.harvesting;
  if (!s.can) return g.depleted;
  if (s.card) return g.card;
  if (s.closed && g.closed) return s.hover ? /** @type {string} */ (g.closedHover) : g.closed;
  return s.hover ? g.hover : g.idle;
}

/**
 * Where a plant stands in the scene and what can be tapped: its growth
 * frame's box anchored at its spot on the ground (bottom centre), grown to
 * at least MIN_HIT square. A plant without growth art (the procedural scene)
 * keeps a 16 px icon box.
 * @param {{x:number, y:number}} p @param {string | null} name its growth frame @param {number} W scene width @param {number} H scene height
 */
export function plantBox(p, name, W, H) {
  const f = name ? GROWTH.frames[name] : null;
  const ax = Math.round(p.x * W), ay = Math.round(p.y * H);
  const w = f ? f[2] : 16, h = f ? f[3] : 16, bottom = f ? ay : ay + 2;
  const hw = Math.max(w, MIN_HIT) / 2, hh = Math.max(h, MIN_HIT);
  return { ax, ay, w, h, x0: ax - hw, x1: ax + hw, y0: bottom - hh, y1: bottom + 2 };
}

/**
 * The plant under a scene point: the front-most (lowest on screen) box that
 * contains it, else the nearest box within `slop` art pixels. Only plants
 * are ever hit — the scenery is painted into the background and never takes a tap.
 * @template {{x:number, y:number}} P
 * @param {P[]} plants @param {(p:P)=>string|null} frameOf @param {number} px @param {number} py @param {number} W @param {number} H @param {number} [slop]
 * @returns {P | null}
 */
export function hitPlant(plants, frameOf, px, py, W, H, slop = 4) {
  /** @type {P | null} */
  let best = null, bestY = -Infinity, near = null, nearD = slop * slop;
  for (const p of plants) {
    const b = plantBox(p, frameOf(p), W, H);
    if (px >= b.x0 && px <= b.x1 && py >= b.y0 && py <= b.y1) {
      if (b.ay > bestY) { bestY = b.ay; best = p; }
      continue;
    }
    const dx = Math.max(b.x0 - px, 0, px - b.x1), dy = Math.max(b.y0 - py, 0, py - b.y1), dd = dx * dx + dy * dy;
    if (dd <= nearD) { nearD = dd; near = p; }
  }
  return best || near;
}

/**
 * A 16×16 picture of a raw ingredient for the shelf and the book: its icon
 * frame where the region's art has one (drawn as soon as the atlas is in),
 * else the procedural sprite of its shape.
 * @param {any} m material @param {number} [fill] 0..1
 */
export function ingredientSprite(m, fill = 1) {
  const cv = rawSprite(m.wild ? m.wild.shape : m.shape || 'stone', m.look || m.color, fill);
  const g = m.wild ? GATHERABLES[m.wild.key] : null;
  const f = g && g.icon ? g.atlas.frames[g.icon] : null;
  if (!g || !f) return cv;
  const paint = () => {
    const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
    ctx.clearRect(0, 0, cv.width, cv.height);
    g.atlas.draw(ctx, /** @type {string} */ (g.icon), cv.width / 2, cv.height - Math.floor((cv.height - f[3]) / 2));
  };
  if (g.atlas.ready) paint();
  else g.atlas.load().then((ok) => { if (ok) paint(); });
  return cv;
}
