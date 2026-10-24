// Whisperwood sprites: one atlas (assets/whisperwood/atlas.png, built by
// scripts/make-whisperwood.py) of decorative world objects and the
// gatherables that stand for the forest's real ingredients, keyed by the
// ingredient's wild key (materials/wild.js). Each gatherable has idle and
// hover frames and, where the art exists, harvesting and depleted ones; all
// frames of one gatherable share a canvas anchored at its bottom centre (the
// deposit's spot on the ground), so states swap in place. A `card` frame is
// the whole plant for its deposit card (Ironroot is half buried in the scene).
// Deposits beyond the player's guild rank are not drawn in the scene at all;
// their cards say what rank opens them.
//
// The atlas loads once, in the background; until it has (and in Node, where
// there is no Image), callers fall back to the procedural painting. Layout
// and hit testing are pure functions of the frame sizes so they can be tested
// without a browser.

import { ATLAS_URL, FRAMES } from './whisperwood-atlas.js';

/** Which frames each forest ingredient uses. @type {Record<string, {idle:string, hover:string, card:string, depleted:string, harvesting?:string}>} */
export const GATHERABLES = Object.fromEntries(['ironroot', 'silverleaf', 'nightshade', 'owlberry', 'emberbark', 'witchear', 'mandrake'].map((k) => [k, {
  idle: k + '_idle', hover: k + '_hover', card: FRAMES[k + '_card'] ? k + '_card' : k + '_idle',
  // own depleted / harvesting art where the pack has it, else a picked-over patch
  depleted: FRAMES[k + '_depleted'] ? k + '_depleted' : 'picked',
  ...(FRAMES[k + '_harvesting'] ? { harvesting: k + '_harvesting' } : {}),
}]));

/** Smallest tap target around a deposit, in art pixels (≈ 30 CSS px on a phone). */
export const MIN_HIT = 20;

/** @type {HTMLImageElement | null} */
let atlas = null;
let ready = false;
/** @type {Promise<boolean> | null} */
let loading = null;

/** Start loading the atlas (once). Resolves true when it can be drawn, false without a DOM or on error. */
export function loadWhisperwood() {
  if (loading) return loading;
  if (typeof Image === 'undefined') return (loading = Promise.resolve(false));
  loading = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { atlas = img; ready = true; resolve(true); };
    img.onerror = () => resolve(false);
    img.src = ATLAS_URL;
  });
  return loading;
}

export const whisperwoodReady = () => ready;

/** @param {string} name */
export const frame = (name) => FRAMES[name] || null;

/**
 * Draw a frame with its bottom centre at (x, y), at an integer scale.
 * @param {CanvasRenderingContext2D} ctx @param {string} name @param {number} x @param {number} y @param {number} [scale] @param {boolean} [flip] mirror horizontally
 */
export function drawFrame(ctx, name, x, y, scale = 1, flip = false) {
  const f = FRAMES[name];
  if (!f || !atlas) return;
  const w = f[2] * scale, h = f[3] * scale, left = Math.round(x - w / 2), top = Math.round(y - h);
  if (flip) {
    ctx.save();
    ctx.translate(left + w, top);
    ctx.scale(-1, 1);
    ctx.drawImage(atlas, f[0], f[1], f[2], f[3], 0, 0, w, h);
    ctx.restore();
  } else ctx.drawImage(atlas, f[0], f[1], f[2], f[3], left, top, w, h);
}

/**
 * The frame a gatherable shows. `can` is whether it can be harvested now;
 * `harvesting` a moment after a harvest; `card` for the deposit card's picture.
 * @param {string} key wild key @param {{can:boolean, hover?:boolean, harvesting?:boolean, card?:boolean}} s
 */
export function gatherFrameName(key, s) {
  const g = GATHERABLES[key];
  if (!g) return null;
  if (s.harvesting && g.harvesting) return g.harvesting;
  if (!s.can) return g.depleted;
  if (s.card) return g.card;
  return s.hover ? g.hover : g.idle;
}

/**
 * Where a deposit sits in the scene and what can be tapped: the frame's box
 * anchored at the deposit's bottom centre, grown to at least MIN_HIT square.
 * Deposits without sprite art keep the 16 px icon box of the procedural scene.
 * @param {{x:number, y:number}} d @param {string | null} key @param {number} W scene width @param {number} H scene height
 */
export function depositBox(d, key, W, H) {
  const g = key ? GATHERABLES[key] : null;
  const f = g ? FRAMES[g.idle] : null;
  const ax = Math.round(d.x * W), ay = Math.round(d.y * H);
  const w = f ? f[2] : 16, h = f ? f[3] : 16, bottom = f ? ay : ay + 2;
  const hw = Math.max(w, MIN_HIT) / 2, hh = Math.max(h, MIN_HIT);
  return { ax, ay, w, h, x0: ax - hw, x1: ax + hw, y0: bottom - hh, y1: bottom + 2 };
}

/**
 * The deposit under a scene point: the front-most (lowest on screen) box that
 * contains it, else the nearest box within `slop` art pixels. Only deposits
 * are ever hit — the scenery is painted into the background and never takes a tap.
 * @template {{x:number, y:number}} D
 * @param {D[]} deps @param {(d:D)=>string|null} keyOf @param {number} px @param {number} py @param {number} W @param {number} H @param {number} [slop]
 * @returns {D | null}
 */
export function hitDeposit(deps, keyOf, px, py, W, H, slop = 4) {
  /** @type {D | null} */
  let best = null, bestY = -Infinity, near = null, nearD = slop * slop;
  for (const d of deps) {
    const b = depositBox(d, keyOf(d), W, H);
    if (px >= b.x0 && px <= b.x1 && py >= b.y0 && py <= b.y1) {
      if (b.ay > bestY) { bestY = b.ay; best = d; }
      continue;
    }
    const dx = Math.max(b.x0 - px, 0, px - b.x1), dy = Math.max(b.y0 - py, 0, py - b.y1), dd = dx * dx + dy * dy;
    if (dd <= nearD) { nearD = dd; near = d; }
  }
  return best || near;
}

/**
 * A small canvas of one gatherable frame (the deposit card's picture).
 * @param {string} name
 */
export function frameCanvas(name) {
  const f = FRAMES[name];
  const cv = document.createElement('canvas');
  const s = f ? Math.max(f[2], f[3]) : 16;
  cv.width = s; cv.height = s;
  const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  if (f) drawFrame(ctx, name, s / 2, s - Math.floor((s - f[3]) / 2));
  return cv;
}
