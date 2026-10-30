// Shapes of whole solid ingredients.
//
// A root, a stone or a crystal enters the cauldron as one rigid object made
// of particles (simulation/rigid.js). Its *template* — the arrangement of
// those particles — gives it a recognisable silhouette (a long forked root,
// a round pebble, a pointed prism, a capped mushroom, a knobbed bone), and
// its *look* tells the renderer which surface to draw on it (fibres,
// speckles, facets, veins…). Crushing removes particles from the object, so
// the silhouette breaks down exactly as the simulated damage does.
//
// A wild ingredient has four pieces, drawn procedurally from its visual
// identity (visual/pieces.js); every object poured takes one of them at
// random, and its particles are laid out over that piece's silhouette (as
// many as its template has, so a dose weighs the same), so what tumbles and
// collides is the piece the cauldron draws on it (rendering/fluid.js).

/** Surface looks of solid matter (renderer codes). */
export const LOOK = Object.freeze({
  ICE: 0, FIBRE: 1, LEAF: 2, STONE: 3, CRYSTAL: 4, CAP: 5, GLOSSY: 6, BONE: 7, FUR: 8, LUMP: 9,
  BARK: 10, BERRY: 11, GILLS: 12, SEED: 13, SHELL: 14, METAL: 15, GLASS: 16, SPOTS: 17, REED: 18, FLORET: 19,
});

import { PIECE_KEYS, PIECE_CELL, PIECE_MASK, pieceMask, skinCell, onPiecesChanged, registerSpecies } from '../visual/pieces.js';
import { WILD_BY_KEY } from './wild.js';

const SHAPE_LOOK = {
  root: LOOK.FIBRE, pepper: LOOK.FIBRE, leaf: LOOK.LEAF, petal: LOOK.LEAF, flower: LOOK.LEAF, clover: LOOK.LEAF, moss: LOOK.LEAF, sprig: LOOK.LEAF,
  stone: LOOK.STONE, crust: LOOK.STONE, crystal: LOOK.CRYSTAL, cap: LOOK.CAP, bean: LOOK.GLOSSY, scale: LOOK.GLOSSY, bone: LOOK.BONE, fur: LOOK.FUR, lump: LOOK.LUMP,
  bark: LOOK.BARK, berry: LOOK.BERRY, bracket: LOOK.GILLS, seed: LOOK.SEED, shell: LOOK.SHELL, nugget: LOOK.METAL, shard: LOOK.GLASS,
  toadstool: LOOK.SPOTS, reed: LOOK.REED, spike: LOOK.FLORET, lily: LOOK.FLORET,
};

/**
 * The template name of a solid material: its wild sprite shape, or one
 * chosen from its archetype for shop solids.
 * @param {any} def
 */
export function shapeOf(def) {
  if (!def) return 'stone';
  if (def.shape) return def.shape;
  if (def.wild && def.wild.shape) return def.wild.shape;
  switch (def.archetype) {
    case 'crystal': case 'frost': return 'crystal';
    case 'resin': return 'lump';
    default: return 'stone';
  }
}

/** Render look of a solid material (frozen liquids are ICE). @param {any} def */
export function solidLook(def) {
  if (!def || def.form !== 'solid') return LOOK.ICE;
  if (def.archetype === 'frost') return LOOK.CRYSTAL;
  return SHAPE_LOOK[shapeOf(def)] ?? LOOK.STONE;
}

/** Hex lattice point (spacing 1) for column a, row b. */
const hex = (a, b) => [a + (b & 1) * 0.5, b * 0.866];

/** Particle layouts (spacing units), ordered from the core outward. */
const TEMPLATES = {
  // a knotted root: a long body with two rootlets
  root: [[0, 0], [1, 0.2], [-1, -0.1], [2, 0.35], [-2, -0.15], [3, 0.6], [-3, -0.1], [0.5, 0.9], [-1.5, 0.75], [4, 0.95], [2.4, -0.7], [-3.9, 0.4]],
  // a tapered pepper with a stalk
  pepper: [[0, 0], [1, 0.1], [-1, 0], [2, 0.3], [0.5, 0.86], [-0.5, 0.86], [3, 0.6], [1.5, 0.95], [-2, -0.3]],
  // a flat leaf blade with a midrib
  leaf: [[0, 0], [1, 0], [-1, 0], [0.5, 0.86], [-0.5, 0.86], [0.5, -0.86], [-0.5, -0.86], [2, 0], [-2, 0.1], [1.5, 0.7], [1.5, -0.7]],
  petal: [[0, 0], [1, 0], [0.5, 0.86], [-0.5, 0.86], [-1, 0], [-0.5, -0.86], [0.5, -0.86]],
  flower: [[0, 0], [1, 0], [0.5, 0.86], [-0.5, 0.86], [-1, 0], [-0.5, -0.86], [0.5, -0.86], [0, 1.73], [0, 2.6]],
  clover: [[0, 0], [0.8, -0.6], [-0.8, -0.6], [0, 0.9], [1.6, -0.5], [-1.6, -0.5], [0, 1.8]],
  moss: [[0, 0], [1, 0], [-1, 0], [0.5, 0.86], [-0.5, 0.86], [1.5, 0.86], [-1.5, 0.86], [0, -0.86], [2, 0.2]],
  // a rounded pebble
  stone: [[0, 0], ...[0, 1, 2, 3, 4, 5].map((k) => [Math.cos((k * Math.PI) / 3), Math.sin((k * Math.PI) / 3)]),
    ...[0, 1, 2, 3, 4, 5].map((k) => [1.732 * Math.cos((k * Math.PI) / 3 + Math.PI / 6), 1.732 * Math.sin((k * Math.PI) / 3 + Math.PI / 6)])],
  // a pointed hexagonal prism
  crystal: [[0, 0], [0, 1], [0.866, 0.5], [0.866, -0.5], [0, -1], [0, 2], [0.866, 1.5], [0.866, -1.5], [0.43, -2.25], [0.43, 2.75]],
  // a domed mushroom cap on a stem
  cap: [[0, 0], [1, 0], [-1, 0], [2, 0.25], [-2, 0.25], [0.5, -0.8], [-0.5, -0.8], [0, 1], [0, 2]],
  bean: [[0, 0], [1, 0.15], [-1, 0.15], [0.5, -0.8], [-0.5, -0.8], [2, 0.5], [-2, 0.5]],
  scale: [[0, 0], [1, 0], [-1, 0], ...[hex(0, 1), hex(-1, 1), hex(0, -1), hex(-1, -1)].map(([x, y]) => [x, y]), [0, 1.73]],
  // a long bone with knobbed ends
  bone: [[0, 0], [1, 0], [-1, 0], [2, 0], [-2, 0], [3, 0.5], [3, -0.5], [-3, 0.5], [-3, -0.5], [3.8, 0], [-3.8, 0]],
  fur: [[0, 0], [1, 0.2], [-1, 0.1], [0.4, 0.9], [-0.6, 0.9], [0.5, -0.85], [-0.4, -0.8], [1.5, -0.6]],
  lump: [[0, 0], [1, 0], [-1, 0.1], [0.5, 0.86], [-0.5, 0.9], [0.4, -0.85], [-0.6, -0.8], [1.6, 0.6]],
  // a curled strip of bark
  bark: [[0, 0], [1, 0], [-1, 0], [2, 0.1], [-2, 0.1], [0.5, 0.86], [-0.5, 0.86], [1.5, 0.95], [-1.5, 0.95], [2.8, 0.6]],
  // a bunch of berries on a stalk
  berry: [[0, 0], [1, 0], [0.5, 0.86], [-0.5, 0.86], [-1, 0], [0, 1.73], [1, 1.73], [0.5, -0.9]],
  // a half-moon shelf fungus
  bracket: [[0, 0], [1, 0], [-1, 0], [2, 0], [-2, 0], [0.5, -0.86], [-0.5, -0.86], [1.5, -0.86], [-1.5, -0.86], [0, -1.73]],
  // a stem with jagged paired leaves
  sprig: [[0, 0], [0, 1], [0, -1], [0.9, 0.5], [-0.9, -0.5], [0.9, -1.3], [-0.9, 1.3], [0, 2], [0, -2]],
  // a tall flower spike
  spike: [[0, 0], [0, 1], [0, -1], [0, 2], [0, -2], [0.8, 0.5], [-0.8, 0.5], [0.8, -0.5], [-0.8, -0.5], [0, 3]],
  // a small ribbed seed head
  seed: [[0, 0], [1, 0], [-1, 0], [0.5, 0.8], [-0.5, 0.8], [0.5, -0.8]],
  // a dense heavy nugget
  nugget: [[0, 0], [1, 0], [0.5, 0.86], [-0.5, 0.86], [-1, 0], [-0.5, -0.86], [0.5, -0.86], [1.4, 0.9]],
  // a long thin glassy blade
  shard: [[0, 0], [0.9, 0.25], [-0.9, -0.25], [1.8, 0.5], [-1.8, -0.5], [2.7, 0.6], [0.4, -0.7], [-2.6, -0.4]],
  // a trumpet-shaped bloom
  lily: [[0, 0], [1, 0], [-1, 0], [0.5, 0.86], [-0.5, 0.86], [1.6, -0.6], [-1.6, -0.6], [0, 1.73], [0, 2.6]],
  // a wide spotted cap on a stout stem
  toadstool: [[0, 0], [1, 0], [-1, 0], [2, 0.15], [-2, 0.15], [0.5, -0.86], [-0.5, -0.86], [1.5, -0.7], [-1.5, -0.7], [0, 1], [0, 2]],
  // a reed stem with its velvet head
  reed: [[0, 0], [0, 1], [0, 2], [0, -1], [0, -2], [0, 3], [0.8, -1.5], [0.8, -2.5], [0, -3]],
  // a ribbed fan-shaped shell
  shell: [[0, 0], [1, 0], [-1, 0], [0.5, -0.86], [-0.5, -0.86], [1.5, -0.86], [-1.5, -0.86], [0, -1.73], [1, -1.73], [-1, -1.73]],
};
// the hanging vines' pieces are cut like their families'
for (const [k, v] of Object.entries({ icicle: 'crystal', bellbloom: 'flower', bluebell: 'flower', puffbloom: 'flower', orb: 'stone', teardrop: 'stone', netpod: 'stone', jelly: 'moss', apple: 'stone', pear: 'stone', plum: 'stone' })) TEMPLATES[k] = TEMPLATES[v];

/**
 * Particle offsets (in particle spacings) of one whole object of a solid
 * material, at most `max` of them (a part-dose takes the compact core): its
 * procedural piece `variant` (0..3) where it has pieces, else its template.
 * @param {any} def @param {number} max @param {number} [variant]
 * @returns {number[][]}
 */
export function chunkTemplate(def, max, variant = -1) {
  if (variant >= 0) registerSpecies(def);
  const pc = variant >= 0 ? piece(skinOf(def, variant)) : null;
  const t = pc ? pc.pts : TEMPLATES[shapeOf(def)] || TEMPLATES.stone;
  return t.slice(0, Math.max(1, Math.min(max, t.length)));
}

// ------------------------------------------------------------ pieces

/** The first skin id of each species: four per ingredient, in key order. */
const SKIN_BASE = Object.fromEntries(PIECE_KEYS.map((key, n) => [key, 1 + n * 4]));

/** Whether whole objects of a material are drawn as its procedural pieces. @param {any} def */
export function hasPieces(def) {
  return !!def && def.form === 'solid' && !def.shape && !!def.wild && def.wild.key in SKIN_BASE;
}

/**
 * Skin id (1..) whose palette a material's grains are drawn in — a powder
 * ingredient's (mica, sulphur…) or a solid's ground in the mortar — 0 if it
 * has no pieces. @param {any} def @param {number} variant
 */
export function grainSkinOf(def, variant) {
  return def && !def.shape && def.wild && def.wild.key in SKIN_BASE ? SKIN_BASE[def.wild.key] + (variant & 3) : 0;
}

/** Skin id (1..) of a material's piece `variant`, 0 if it has none. @param {any} def @param {number} variant */
export function skinOf(def, variant) {
  return hasPieces(def) ? SKIN_BASE[def.wild.key] + (variant & 3) : 0;
}

/**
 * @typedef {object} Piece
 * @property {number[][]} pts  particle offsets (spacings) from the piece's centre, core first
 * @property {number} ax       atlas x of that centre (px)
 * @property {number} ay       atlas y of that centre (px)
 * @property {number} ppu      atlas px per particle spacing
 * @property {number} cx       atlas x of the piece's cell (px)
 * @property {number} cy       atlas y of the piece's cell (px)
 */
/** @type {(Piece|null|undefined)[]} */
const fitted = [];
onPiecesChanged((key) => { const b = SKIN_BASE[key]; for (let v = 0; v < 4; v++) fitted[b + v] = undefined; });

/**
 * A piece fitted with particles: hex lattices of every spacing and
 * offset are laid over its silhouette, and of those holding exactly as many
 * particles as the material's template, the one whose rendered blob best
 * matches the silhouette wins (computed once per piece, on first use).
 * @param {number} skin
 * @returns {Piece|null}
 */
export function piece(skin) {
  if (!skin) return null;
  const sk = skinCell(skin);
  if (!sk) return null;
  // (drawing the species' pieces first: a change of look drops what was fitted to the old ones)
  const mask = /** @type {Uint8Array} */ (pieceMask(sk.key, sk.v));
  if (fitted[skin] !== undefined) return /** @type {Piece|null} */ (fitted[skin]);
  const M = PIECE_MASK, fx = sk.cx, fy = sk.cy;
  let area = 0;
  for (const m of mask) area += m;
  const spec = WILD_BY_KEY[sk.key];
  const n = (TEMPLATES[spec ? spec.shape : 'stone'] || TEMPLATES.stone).length;
  const inside = (x, y) => x >= 0 && y >= 0 && x < M && y < M && mask[(y | 0) * M + (x | 0)] === 1;
  /** @type {number[][]|null} */
  let best = null;
  let bestScore = -1, bestK = 1;
  for (let k = 1.5; k <= M / 1.5; k += 0.05) {
    // the drawn blob reaches about 0.65 spacings beyond each particle
    const rr = (0.65 * k) ** 2;
    for (let oy = 0; oy < 4; oy++) for (let ox = 0; ox < 4; ox++) {
      const pts = [];
      const x0 = (ox / 4) * k, y0 = (oy / 4) * k * 0.866;
      for (let b = -1; b * k * 0.866 + y0 < M + k; b++) {
        for (let a = -1; a * k + x0 < M + k; a++) {
          const x = (a + (b & 1) * 0.5) * k + x0, y = b * k * 0.866 + y0;
          if (inside(x, y)) pts.push([x, y]);
        }
      }
      if (pts.length !== n) continue;
      let both = 0, blob = 0;
      for (let cy = 0; cy < M; cy++) for (let cx = 0; cx < M; cx++) {
        let hit = false;
        for (const [x, y] of pts) if ((x - cx - 0.5) ** 2 + (y - cy - 0.5) ** 2 < rr) { hit = true; break; }
        if (hit) { blob++; if (mask[cy * M + cx]) both++; }
      }
      const score = both / (area + blob - both);
      if (score > bestScore) { bestScore = score; best = pts; bestK = k; }
    }
  }
  if (!best) return (fitted[skin] = null);
  let mx = 0, my = 0;
  for (const [x, y] of best) { mx += x; my += y; }
  mx /= n; my /= n;
  const pts = best.map(([x, y]) => [(x - mx) / bestK, (y - my) / bestK]).sort((p, q) => Math.hypot(p[0], p[1]) - Math.hypot(q[0], q[1]));
  const r = PIECE_CELL / M;
  return (fitted[skin] = { pts, ax: fx + mx * r, ay: fy + my * r, ppu: bestK * r, cx: fx, cy: fy });
}

/** Largest object size of a material (particles). @param {any} def */
export function chunkSize(def) {
  return (TEMPLATES[shapeOf(def)] || TEMPLATES.stone).length;
}
