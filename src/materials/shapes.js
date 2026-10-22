// Shapes of whole solid ingredients.
//
// A root, a stone or a crystal enters the cauldron as one rigid object made
// of particles (simulation/rigid.js). Its *template* — the arrangement of
// those particles — gives it a recognisable silhouette (a long forked root,
// a round pebble, a pointed prism, a capped mushroom, a knobbed bone), and
// its *look* tells the renderer which surface to draw on it (fibres,
// speckles, facets, veins…). Crushing removes particles from the object, so
// the silhouette breaks down exactly as the simulated damage does.

/** Surface looks of solid matter (renderer codes). */
export const LOOK = Object.freeze({ ICE: 0, FIBRE: 1, LEAF: 2, STONE: 3, CRYSTAL: 4, CAP: 5, GLOSSY: 6, BONE: 7, FUR: 8, LUMP: 9 });

const SHAPE_LOOK = {
  root: LOOK.FIBRE, pepper: LOOK.FIBRE, leaf: LOOK.LEAF, petal: LOOK.LEAF, flower: LOOK.LEAF, clover: LOOK.LEAF, moss: LOOK.LEAF,
  stone: LOOK.STONE, crystal: LOOK.CRYSTAL, cap: LOOK.CAP, bean: LOOK.GLOSSY, scale: LOOK.GLOSSY, bone: LOOK.BONE, fur: LOOK.FUR, lump: LOOK.LUMP,
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
};

/**
 * Particle offsets (in particle spacings) of one whole object of a solid
 * material, at most `max` of them (a part-dose takes the compact core).
 * @param {any} def @param {number} max
 * @returns {number[][]}
 */
export function chunkTemplate(def, max) {
  const t = TEMPLATES[shapeOf(def)] || TEMPLATES.stone;
  return t.slice(0, Math.max(1, Math.min(max, t.length)));
}

/** Largest object size of a material (particles). @param {any} def */
export function chunkSize(def) {
  return (TEMPLATES[shapeOf(def)] || TEMPLATES.stone).length;
}
