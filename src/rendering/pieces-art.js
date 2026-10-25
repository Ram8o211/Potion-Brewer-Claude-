// The painted pieces of the wild ingredients (assets/icons/pieces.png,
// scripts/make-ingredient-pieces.py) as raw pixels: the cauldron's renderer
// (fluid.js) paints every poured whole object pixel by pixel from its piece,
// so it needs the atlas readable, not just drawable. Loads once, on first
// use; until then (and with no DOM) objects keep their procedural surface.

import { PIECES_URL, PIECE_CELL } from '../materials/pieces.js';
import { piece } from '../materials/shapes.js';

export const PIECE_ART = {
  ready: false,
  width: 0,
  height: 0,
  /** packed ABGR pixels (little-endian RGBA bytes) @type {Uint32Array | null} */
  px: null,
  /** @type {Promise<boolean> | null} */
  loading: null,
};

/** Start loading the atlas (once). Resolves true when its pixels can be read. */
export function loadPieceArt() {
  if (PIECE_ART.loading) return PIECE_ART.loading;
  if (typeof Image === 'undefined' || typeof document === 'undefined') return (PIECE_ART.loading = Promise.resolve(false));
  PIECE_ART.loading = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = img.width; cv.height = img.height;
      const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d', { willReadFrequently: true }));
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
      PIECE_ART.px = new Uint32Array(data.buffer, data.byteOffset, data.byteLength / 4);
      PIECE_ART.width = cv.width;
      PIECE_ART.height = cv.height;
      PIECE_ART.ready = true;
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = PIECES_URL;
  });
  return PIECE_ART.loading;
}

/** @type {Map<number, Uint32Array>} */
const palettes = new Map();

/**
 * Every opaque pixel of a piece, its palette for grains whose own spot in
 * it falls outside the painting (null until the atlas is in).
 * @param {number} skin
 */
export function piecePalette(skin) {
  const px = PIECE_ART.px;
  if (!px) return null;
  let pal = palettes.get(skin);
  if (pal) return pal;
  const pc = piece(skin);
  if (!pc) return null;
  const out = [];
  for (let y = pc.cy; y < pc.cy + PIECE_CELL; y++) {
    for (let x = pc.cx; x < pc.cx + PIECE_CELL; x++) {
      const c = px[y * PIECE_ART.width + x];
      if (c >>> 31) out.push(c);
    }
  }
  pal = Uint32Array.from(out.length ? out : [0xff808080]);
  palettes.set(skin, pal);
  return pal;
}
