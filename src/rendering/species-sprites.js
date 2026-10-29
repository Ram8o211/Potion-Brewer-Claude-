// Species sprites for the interface: every wild ingredient's plant at each
// growth stage and its icon, rasterized once from its visual identity
// (visual/render.js) and cached. The same descriptor drives the plant in the
// wilds, its icon on the shelf, in the shop, the book and on its deposit
// card, and its pieces in the cauldron (visual/pieces.js), so an ingredient
// is recognisable wherever it appears.
//
// Frames and silhouettes are plain pixel buffers (usable in Node); canvases
// are made only where there is a DOM.

import { describe } from '../visual/descriptor.js';
import { plantFrame, iconFrame, ICON_PX } from '../visual/render.js';
import { identityKey, validIdentity } from '../visual/identity.js';
import { archetypeIdentity } from '../visual/pieces.js';
import { Pixels } from '../visual/pixels.js';
import { isBotanical } from '../visual/taxonomy.js';
import { rawSprite } from './scenes.js';

export { ICON_PX };

/** Smallest tap target around a plant, in scene pixels (≈ 30 CSS px on a phone). */
export const MIN_HIT = 26;

/** The growth stages and their frame index. */
const STAGE = { sprout: 0, ripe: 1, mature: 2 };

/** The visual identity of a material: its own, else its archetype's. @param {any} m */
export function identityOfMaterial(m) {
  if (m && validIdentity(m.vis)) return m.vis;
  return m && m.wild ? archetypeIdentity(m.wild.key) : null;
}

/** The descriptor a material is drawn from, or null for one that is not wild. @param {any} m */
export function speciesOf(m) {
  const id = identityOfMaterial(m);
  return id ? describe(id) : null;
}

/** @type {Map<string, any>} */
const cache = new Map();
const CACHE_MAX = 500;
function cached(k, make) {
  let v = cache.get(k);
  if (v) return v;
  v = make();
  if (cache.size >= CACHE_MAX) cache.delete(/** @type {string} */ (cache.keys().next().value));
  cache.set(k, v);
  return v;
}

/** A frame with a one-pixel glowing rim round its silhouette (the plant under the pointer). @param {import('../visual/render.js').Frame} f */
function rimmed(f) {
  const w = f.pix.w + 2, h = f.pix.h + 2, p = new Pixels(w, h), src = f.pix;
  const op = (x, y) => x >= 0 && y >= 0 && x < src.w && y < src.h && src.px[y * src.w + x] >>> 24;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (op(x - 1, y - 1)) continue;
    if (op(x - 2, y - 1) || op(x, y - 1) || op(x - 1, y - 2) || op(x - 1, y)) p.px[y * w + x] = 0xffa8f0ff;
  }
  p.draw(src, 1, 1);
  return { pix: p, ax: f.ax + 1, ay: f.ay + 1, glints: f.glints.map(([x, y]) => [x + 1, y + 1]) };
}

/**
 * A plant's frame at a stage (pure pixels), optionally closed (a dawn or dusk
 * plant out of its hour) or rimmed (under the pointer).
 * @param {any} m material @param {string} stage @param {{closed?:boolean, hover?:boolean}} [o]
 * @returns {import('../visual/render.js').Frame|null}
 */
export function plantFrameOf(m, stage, o = {}) {
  const id = identityOfMaterial(m);
  if (!id) return null;
  // stones, crystals and shells do not grow: one picture, whole, at every stage
  const st = isBotanical(id.shape) ? STAGE[stage] ?? 2 : 2, closed = !!o.closed && st === 2;
  const base = cached(`p|${identityKey(id)}|${st}|${closed ? 1 : 0}`, () => plantFrame(describe(id), st, { closed }));
  return o.hover ? cached(`h|${identityKey(id)}|${st}|${closed ? 1 : 0}`, () => rimmed(base)) : base;
}

/** The canvas of a plant frame (browser), cached with it. @param {any} m @param {string} stage @param {{closed?:boolean, hover?:boolean}} [o] */
export function plantCanvas(m, stage, o = {}) {
  const f = plantFrameOf(m, stage, o);
  if (!f) return null;
  const any = /** @type {any} */ (f);
  if (!any.cv) any.cv = f.pix.toCanvas();
  return { cv: /** @type {HTMLCanvasElement} */ (any.cv), ax: f.ax, ay: f.ay, w: f.pix.w, h: f.pix.h, glints: f.glints };
}

/**
 * Everything a plant may ever cover (all its stages, rimmed), relative to its
 * foot: what the ground keeps clear for it.
 * @param {any} m @returns {{w:number, h:number, ax:number, ay:number, m:Uint8Array}|null}
 */
export function silhouetteOf(m) {
  const id = identityOfMaterial(m);
  if (!id) return null;
  return cached(`s|${identityKey(id)}`, () => {
    const frames = ['sprout', 'ripe', 'mature'].flatMap((s) => [plantFrameOf(m, s, { hover: true }), plantFrameOf(m, s, { hover: true, closed: true })]).filter(Boolean);
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
    for (const f of frames) { x0 = Math.min(x0, -f.ax); y0 = Math.min(y0, -f.ay); x1 = Math.max(x1, f.pix.w - f.ax); y1 = Math.max(y1, f.pix.h - f.ay); }
    const w = x1 - x0, h = y1 - y0, mask = new Uint8Array(w * h);
    for (const f of frames) for (let y = 0; y < f.pix.h; y++) for (let x = 0; x < f.pix.w; x++) if (f.pix.px[y * f.pix.w + x] >>> 24) mask[(y - f.ay - y0) * w + x - f.ax - x0] = 1;
    return { w, h, ax: -x0, ay: -y0, m: mask };
  });
}

/** An ingredient's icon (pure pixels). @param {any} m */
export function iconFrameOf(m) {
  const id = identityOfMaterial(m);
  return id ? cached(`i|${identityKey(id)}`, () => iconFrame(describe(id))) : null;
}

/**
 * A square picture of a raw ingredient for every list it appears in (the
 * shelf, the shop, the book, recipes and its deposit card): its procedural
 * icon — a close-up of the same species that grows in the wilds — or, for
 * a rabbit's remains, its little sprite. A new canvas each call (it goes
 * into the page).
 * @param {any} m material @param {number} [fill] 0..1 (unused by icons; remains shrink with it)
 */
export function ingredientSprite(m, fill = 1) {
  const f = m && m.wild ? iconFrameOf(m) : null;
  if (!f) return rawSprite(m.shape || 'stone', m.look || m.color, fill);
  const cv = f.pix.toCanvas();
  cv.style.imageRendering = 'pixelated';
  return cv;
}
