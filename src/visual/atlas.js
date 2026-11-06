// The ingredient texture atlases at runtime.
//
// Ingredients are drawn from authored PNG atlases (assets/atlases, built by
// scripts/build-atlases.mjs); the environments stay procedural. Frames are
// looked up synchronously from the generated frame table (atlas-frames.js)
// by asset id — never by raw index — and cut once into pixel buffers that
// every view shares: the plant in the wilds, the icon in the menus, the
// seed and crop in the garden and the pieces poured into the cauldron are
// the same pixels.
//
// Loading. In a browser the atlas images load asynchronously: the atlases
// a save needs (its open biomes, its stores) before play, the rest in the
// background, each once, then cached; listeners (onAtlasLoaded) redraw
// what was waiting. In Node (tests, scripts) an atlas is decoded from disk
// synchronously the first time a frame of it is asked for.

import { ATLASES, SPECIES_ASSETS, FRAMES } from './atlas-frames.js';
import { Pixels } from './pixels.js';
import { PLANT_SHEET, PLANT_BOXES } from './ingredient-icons.js';

// the plants of the ingredient icons (scripts/slice-ingredient-icons.py): one more atlas, needed
// wherever a species grows, so it loads before play; its frames stand on their bottom centre
ATLASES.push(/** @type {any} */ ({ id: 'ingredient-plants', image: PLANT_SHEET, width: 0, height: 0, eager: true, biomes: [] }));
for (const [key, st] of Object.entries(PLANT_BOXES)) {
  for (const [stage, [x, y, w, h]] of Object.entries(st)) FRAMES[`${key}@plant-${stage}`] = /** @type {any} */ (['ingredient-plants', x, y, w, h, w >> 1, h - 1]);
}

/** The asset id of a species' plant (from its icon) at a growth stage. @param {string} key @param {'sprout'|'ripe'|'mature'} stage */
export const plantAsset = (key, stage) => (PLANT_BOXES[key] ? `${key}@plant-${stage}` : null);

export { ATLASES, SPECIES_ASSETS, FRAMES };

/** atlas id → its pixels @type {Map<string, Pixels>} */
const loaded = new Map();
/** atlas id → its pending load @type {Map<string, Promise<void>>} */
const pending = new Map();
/** asset id → its cut frame @type {Map<string, AtlasFrame>} */
const cut = new Map();
/** @type {((atlas:string)=>void)[]} */
const listeners = [];

/**
 * @typedef {Object} AtlasFrame
 * @property {Pixels} pix
 * @property {number} ax   pivot (bottom centre: where it stands)
 * @property {number} ay
 * @property {string} id
 * @property {string} atlas
 */

/** the Node runtime (tests, scripts), reached without its type declarations @type {any} */
const NODE = typeof globalThis === 'object' && /** @type {any} */ (globalThis).process && /** @type {any} */ (globalThis).process.versions && /** @type {any} */ (globalThis).process.versions.node && typeof window === 'undefined' ? /** @type {any} */ (globalThis).process : null;
const isNode = !!NODE;

/** Be told when an atlas has loaded (to redraw what waited for it). @param {(atlas:string)=>void} fn */
export function onAtlasLoaded(fn) { listeners.push(fn); }

/** Is an atlas's pixel data here? @param {string} id */
export const atlasLoaded = (id) => loaded.has(id);

/** The atlas an asset lives in. @param {string} asset */
export const atlasOf = (asset) => (FRAMES[asset] ? FRAMES[asset][0] : null);

/** A species' asset ids (sprite, arcane, seed, seedArcane, stages, stagesArcane). @param {string} key */
export const assetsOf = (key) => SPECIES_ASSETS[key] || null;

/** The asset id of a species' sprite, in its ordinary or Arcane form. @param {string} key @param {boolean} arcane */
export function spriteAsset(key, arcane) {
  const a = SPECIES_ASSETS[key];
  return a ? (arcane ? a.arcane : a.sprite) : null;
}

/** The asset id of a seed. @param {string} key @param {boolean} arcane */
export function seedAsset(key, arcane) {
  const a = SPECIES_ASSETS[key];
  return a ? (arcane ? a.seedArcane : a.seed) : null;
}

/** The asset id of a growth stage (0 seed in its bed … 3 developing; 4 is the mature sprite). @param {string} key @param {boolean} arcane @param {number} stage */
export function stageAsset(key, arcane, stage) {
  const a = SPECIES_ASSETS[key];
  if (!a) return null;
  if (stage >= 4) return arcane ? a.arcane : a.sprite;
  return (arcane ? a.stagesArcane : a.stages)[Math.max(0, stage | 0)];
}

/** Decode a PNG synchronously in Node (zlib from the runtime; no DOM). @param {string} file */
function loadNodeSync(file) {
  const fs = NODE.getBuiltinModule('node:fs'), zlib = NODE.getBuiltinModule('node:zlib'), url = NODE.getBuiltinModule('node:url'), buffer = NODE.getBuiltinModule('node:buffer');
  const path = url.fileURLToPath(new URL(`../../assets/atlases/${file}`, import.meta.url));
  const buf = fs.readFileSync(path);
  let o = 8, w = 0, h = 0, type = 6;
  const idat = [];
  /** @type {Uint8Array|null} */ let plte = null;
  /** @type {Uint8Array|null} */ let trns = null;
  while (o < buf.length) {
    const len = buf.readUInt32BE(o), kind = buf.toString('latin1', o + 4, o + 8);
    if (kind === 'IHDR') {
      w = buf.readUInt32BE(o + 8); h = buf.readUInt32BE(o + 12); type = buf[o + 17];
      if (buf[o + 16] !== 8 || (type !== 6 && type !== 3)) throw new Error('atlas PNGs are 8-bit RGBA or 8-bit palette');
    } else if (kind === 'PLTE') plte = buf.subarray(o + 8, o + 8 + len);
    else if (kind === 'tRNS') trns = buf.subarray(o + 8, o + 8 + len);
    else if (kind === 'IDAT') idat.push(buf.subarray(o + 8, o + 8 + len));
    else if (kind === 'IEND') break;
    o += 12 + len;
  }
  const raw = zlib.inflateSync(buffer.Buffer.concat(idat));
  // (a palette image has one byte a pixel: its index into PLTE, its alpha from tRNS)
  const bpp = type === 6 ? 4 : 1;
  const pix = new Pixels(w, h), d = pix.data, stride = w * bpp;
  let prev = new Uint8Array(stride), cur = new Uint8Array(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = line[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[i] = v & 255;
    }
    if (bpp === 4) d.set(cur, y * stride);
    else {
      const P = /** @type {Uint8Array} */ (plte);
      for (let x = 0; x < w; x++) {
        const k = cur[x], q = (y * w + x) * 4;
        d[q] = P[k * 3]; d[q + 1] = P[k * 3 + 1]; d[q + 2] = P[k * 3 + 2]; d[q + 3] = trns && k < trns.length ? trns[k] : 255;
      }
    }
    [prev, cur] = [cur, prev];
  }
  return pix;
}

/** The pixels of an atlas, if available now (Node loads it on the spot). @param {string} id */
function pixelsOf(id) {
  let p = loaded.get(id);
  if (p) return p;
  if (!isNode) return null;
  const a = ATLASES.find((x) => x.id === id);
  if (!a) return null;
  p = loadNodeSync(a.image);
  loaded.set(id, p);
  return p;
}

/**
 * A frame cut from its atlas, or null while its atlas is still loading.
 * @param {string|null} asset @returns {AtlasFrame|null}
 */
export function atlasFrame(asset) {
  if (!asset) return null;
  const got = cut.get(asset);
  if (got) return got;
  const f = FRAMES[asset];
  if (!f) return null;
  const [atlas, x, y, w, h, px, py] = f;
  const src = pixelsOf(atlas);
  if (!src) return null;
  const pix = new Pixels(w, h);
  for (let j = 0; j < h; j++) pix.px.set(src.px.subarray((y + j) * src.w + x, (y + j) * src.w + x + w), j * w);
  const fr = { pix, ax: px, ay: py + 1, id: asset, atlas };
  cut.set(asset, fr);
  return fr;
}

/**
 * Load atlases in a browser (each once). `which` picks them: a list of ids,
 * or a predicate on the atlas entry. Resolves when they are all in.
 * @param {string[]|((a:typeof ATLASES[number])=>boolean)} [which]
 */
export function loadAtlases(which) {
  const list = ATLASES.filter((a) => (Array.isArray(which) ? which.includes(a.id) : which ? which(a) : true));
  return Promise.all(list.map((a) => loadOne(a)));
}

/** @param {typeof ATLASES[number]} a */
function loadOne(a) {
  if (loaded.has(a.id)) return Promise.resolve();
  if (isNode) { pixelsOf(a.id); return Promise.resolve(); }
  let p = pending.get(a.id);
  if (p) return p;
  p = new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d', { willReadFrequently: true }));
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, cv.width, cv.height);
      const pix = new Pixels(cv.width, cv.height);
      pix.data.set(data.data);
      loaded.set(a.id, pix);
      pending.delete(a.id);
      for (const fn of listeners) fn(a.id);
      resolve();
    };
    // a missing atlas never blocks the game: the frame simply stays unavailable
    img.onerror = () => { pending.delete(a.id); resolve(); };
    img.src = `assets/atlases/${a.image}`;
  });
  pending.set(a.id, p);
  return p;
}

/**
 * The atlases a save needs before play: the sprites and seeds of the
 * biomes it can reach and of everything in its stores (the rest load in
 * the background).
 * @param {string[]} biomes open biomes @param {string[]} species species keys held
 */
export function neededAtlases(biomes, species) {
  const need = new Set(ATLASES.filter((a) => a.eager).map((a) => a.id));
  for (const a of ATLASES) {
    if (a.id.startsWith('growth')) continue;
    if (a.biomes.some((b) => biomes.includes(b))) need.add(a.id);
  }
  for (const k of species) {
    const s = SPECIES_ASSETS[k];
    if (!s) continue;
    for (const id of [s.sprite, s.arcane, s.seed]) { const at = atlasOf(id); if (at) need.add(at); }
  }
  return [...need];
}

/** Forget cut frames (tests that swap atlas pixels). */
export function forgetAtlasFrames() { cut.clear(); }
