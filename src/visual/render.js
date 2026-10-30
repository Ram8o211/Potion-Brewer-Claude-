// Rasterized pictures of a species, without any DOM: the plant on the ground
// at each growth stage, its icon and its four cauldron pieces. Pure functions
// of the descriptor (visual/descriptor.js), so Node and every browser paint
// the same pixels; visual/sprites.js caches them as canvases.

import { FAMILIES } from './families/index.js';
import { rasterize } from './raster.js';
import { Pixels } from './pixels.js';
import { inked } from './style.js';
import { growFrame } from './growth.js';

/** Icon size (art pixels, square). */
export const ICON_PX = 32;
/** A cauldron piece's cell (art pixels, square) and the silhouette grid it is fitted with. */
export const PIECE_PX = 40;
export const PIECE_GRID = 20;

/**
 * @typedef {Object} Frame
 * @property {Pixels} pix
 * @property {number} ax   foot (bottom centre) within the frame
 * @property {number} ay
 * @property {number[][]} glints  [x, y] pixels that may glimmer
 */

/**
 * The plant (or deposit) where it is found, at a stage: grown procedurally
 * (visual/growth.js) on its mount — the ground, hanging, or jutting from a
 * rock face or a trunk — in one of its variants.
 * @param {import('./descriptor.js').Descriptor} d @param {number} stage 0 sprout, 1 ripe, 2 mature
 * @param {{closed?:boolean, mount?:string, variant?:number, flip?:boolean}} [o]
 * @returns {Frame}
 */
export function plantFrame(d, stage, o = {}) {
  return growFrame(d, stage, o);
}

/** The ingredient's icon (ICON_PX square). @param {import('./descriptor.js').Descriptor} d @returns {Frame} */
export function iconFrame(d) {
  const model = FAMILIES[d.family].icon(d);
  model.fit(ICON_PX - 2, ICON_PX - 2, { margin: 0.5 });
  const r = rasterize(model, ICON_PX - 2, ICON_PX - 2, d.pal, { seed: d.seeds.surface ^ 0x1c0, outline: false });
  return { pix: inked(r.pix), ax: ICON_PX / 2, ay: ICON_PX, glints: r.glints.map(([x, y]) => [x + 1, y + 1]) };
}

/**
 * One of the four whole pieces poured into the cauldron (PIECE_PX square),
 * and its silhouette on the PIECE_GRID grid.
 * @param {import('./descriptor.js').Descriptor} d @param {number} v 0..3
 */
export function pieceFrame(d, v) {
  const model = FAMILIES[d.family].piece(d, v & 3);
  model.fit(PIECE_PX, PIECE_PX, { margin: 2 });
  const r = rasterize(model, PIECE_PX, PIECE_PX, d.pal, { seed: d.seeds.surface ^ (0x91ece + v) });
  const k = PIECE_PX / PIECE_GRID, mask = new Uint8Array(PIECE_GRID * PIECE_GRID);
  for (let y = 0; y < PIECE_GRID; y++) for (let x = 0; x < PIECE_GRID; x++) {
    let n = 0;
    for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) if (r.pix.px[(y * k + j) * PIECE_PX + x * k + i] >>> 24) n++;
    mask[y * PIECE_GRID + x] = n * 2 >= k * k ? 1 : 0;
  }
  return { pix: r.pix, mask };
}

export { Pixels };
