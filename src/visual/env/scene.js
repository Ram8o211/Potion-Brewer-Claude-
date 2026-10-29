// A wild region's environment, generated from the world seed: the painted
// scene (SCENE_W × SCENE_H art pixels) and the map of open ground where
// plants may grow. Pure and deterministic — the same world seed always
// yields the same pixels — and cached, since a region is composed once and
// then only drawn.

import { Canvas, SCENE_W, SCENE_H } from './paint.js';
import { hashString } from '../../core/rng.js';
import * as meadow from './meadow.js';
import * as forest from './forest.js';
import * as river from './river.js';
import * as quarry from './quarry.js';
import * as moonfen from './moonfen.js';
import * as crags from './crags.js';

/** Version of the environment generator (scenes are not saved; this only names caches). */
export const ENV_VERSION = 1;

const COMPOSERS = { meadow, forest, river, quarry, moonfen, crags };

/**
 * @typedef {Object} Scene
 * @property {import('../pixels.js').Pixels} pix
 * @property {Uint8Array} open     1 where a plant's foot may rest
 * @property {Uint16Array} depth  foot row of the scenery covering each pixel (0: none)
 * @property {number} top          first row with open ground
 * @property {Record<string, any>} meta  what the animation needs (horizon, vents, pools…)
 */

/** @type {Map<string, Scene>} */
const cache = new Map();

/**
 * The scene of a region in a world.
 * @param {string} region @param {string} seed @returns {Scene}
 */
export function sceneOf(region, seed) {
  const id = COMPOSERS[region] ? region : 'forest';
  const key = `${ENV_VERSION}:${id}:${seed}`;
  let s = cache.get(key);
  if (s) return s;
  const cv = new Canvas(hashString(`scene:${seed}:${id}`));
  COMPOSERS[id].compose(cv, String(seed));
  // the frame line along the top and bottom edges, as on the old paintings
  for (let x = 0; x < SCENE_W; x++) { cv.open[x] = 0; cv.open[(SCENE_H - 1) * SCENE_W + x] = 0; cv.open[(SCENE_H - 2) * SCENE_W + x] = 0; }
  let top = SCENE_H;
  for (let k = 0; k < cv.open.length; k++) if (cv.open[k]) { top = Math.floor(k / SCENE_W); break; }
  s = { pix: cv.pix, open: cv.open, depth: cv.depth, top, meta: cv.meta };
  // a handful of worlds' regions at most: keep the last dozen
  if (cache.size >= 12) cache.delete(/** @type {string} */ (cache.keys().next().value));
  cache.set(key, s);
  return s;
}

export { SCENE_W, SCENE_H };
