// The procedural taxonomy: which natural family each wild ingredient belongs
// to (from its sprite shape in materials/wild.js), which families are living
// plants that drink and grow, and the habitat traits of each region that
// shape both its scenery and the species growing in it.

/** Wild shape → natural family. Each family has its own morphology module (visual/families). */
export const FAMILY_OF = Object.freeze({
  petal: 'flower', flower: 'flower', clover: 'flower', spike: 'flower', lily: 'flower',
  leaf: 'herb', sprig: 'herb',
  root: 'root',
  cap: 'fungus', toadstool: 'fungus', bracket: 'fungus',
  moss: 'moss',
  berry: 'fruit', bean: 'fruit', pepper: 'fruit', seed: 'fruit',
  reed: 'reed',
  bark: 'bark',
  crystal: 'crystal', shard: 'crystal',
  stone: 'mineral', nugget: 'mineral', powder: 'mineral', crust: 'mineral',
  shell: 'shell', scale: 'shell',
  // hanging vines (visual/growth.js DANGLERS)
  icicle: 'crystal', bellbloom: 'flower', bluebell: 'flower', puffbloom: 'flower',
  // tree-borne (visual/growth.js TREEBORN)
  orchid: 'flower', lichen: 'moss', trunkfruit: 'fruit',
  orb: 'fruit', teardrop: 'fruit', netpod: 'fruit', jelly: 'fruit',
});

/** Families of living plants: they drink, and grow with the moisture of their soil. */
export const BOTANICAL = new Set(['flower', 'herb', 'root', 'fungus', 'moss', 'fruit', 'reed', 'bark']);

/** @param {string} shape */
export const familyOf = (shape) => FAMILY_OF[shape] || 'mineral';

/** Whether an ingredient of this shape is a living plant. @param {string} shape */
export const isBotanical = (shape) => BOTANICAL.has(familyOf(shape));

/**
 * @typedef {Object} Habitat
 * @property {number} wet      soil moisture the ground keeps without watering (0..1)
 * @property {number} retain   hours watered soil takes to lose about two thirds of its extra water
 * @property {number[]} light  colour of the region's light (sRGB 0..1)
 * @property {number} lightK   how strongly the light tints what grows there
 * @property {number} sat      chroma scale of its living things
 * @property {number} dark     lightness offset of its living things
 * @property {number} wear     weathering of stone and wood (0..1)
 * @property {number} crystal  how readily minerals crystallise there (0..1)
 * @property {number} lush     leafiness of its plants (0..1)
 * @property {number[]} leaf   the base green of its foliage (sRGB)
 * @property {number[]} rock   its stone
 * @property {number[]} soil   its soil
 */

/** @type {Record<string, Habitat>} */
export const HABITATS = {
  forest: { wet: 0.5, retain: 3, light: [1, 0.93, 0.7], lightK: 0.1, sat: 0.95, dark: -0.03, wear: 0.5, crystal: 0.1, lush: 0.8, leaf: [0.2, 0.42, 0.16], rock: [0.42, 0.44, 0.44], soil: [0.32, 0.22, 0.13] },
  netherwood: { wet: 0.62, retain: 5, light: [0.75, 0.6, 1], lightK: 0.16, sat: 0.85, dark: -0.07, wear: 0.6, crystal: 0.2, lush: 0.6, leaf: [0.12, 0.3, 0.28], rock: [0.3, 0.29, 0.34], soil: [0.2, 0.15, 0.16] },
  meadow: { wet: 0.38, retain: 2, light: [1, 0.95, 0.72], lightK: 0.12, sat: 1.1, dark: 0.03, wear: 0.3, crystal: 0.05, lush: 0.7, leaf: [0.3, 0.55, 0.18], rock: [0.55, 0.54, 0.5], soil: [0.4, 0.28, 0.16] },
  river: { wet: 0.78, retain: 6, light: [0.85, 0.95, 1], lightK: 0.08, sat: 0.9, dark: 0, wear: 0.7, crystal: 0.15, lush: 0.6, leaf: [0.28, 0.45, 0.2], rock: [0.62, 0.64, 0.64], soil: [0.36, 0.3, 0.2] },
  quarry: { wet: 0.25, retain: 1.5, light: [1, 0.92, 0.8], lightK: 0.08, sat: 0.85, dark: 0, wear: 0.6, crystal: 0.6, lush: 0.3, leaf: [0.36, 0.45, 0.22], rock: [0.55, 0.5, 0.45], soil: [0.5, 0.4, 0.28] },
  moonfen: { wet: 0.85, retain: 8, light: [0.62, 0.75, 1], lightK: 0.2, sat: 0.75, dark: -0.08, wear: 0.8, crystal: 0.7, lush: 0.55, leaf: [0.14, 0.33, 0.27], rock: [0.3, 0.32, 0.38], soil: [0.15, 0.17, 0.14] },
  crags: { wet: 0.18, retain: 1, light: [1, 0.6, 0.35], lightK: 0.18, sat: 0.95, dark: -0.05, wear: 0.4, crystal: 0.8, lush: 0.25, leaf: [0.32, 0.33, 0.16], rock: [0.2, 0.17, 0.2], soil: [0.22, 0.14, 0.12] },
};

/** @param {string} region */
export const habitatOf = (region) => HABITATS[region] || HABITATS.forest;

/** Hue (OKLCh degrees) and chroma that each effect lends an ingredient's markings. */
export const EFFECT_TINT = {
  vitality: { h: 25, c: 0.17, L: 0.62 },
  strength: { h: 70, c: 0.12, L: 0.6 },
  love: { h: 355, c: 0.16, L: 0.7 },
  arcana: { h: 295, c: 0.16, L: 0.6 },
  transformation: { h: 185, c: 0.12, L: 0.7 },
  fire: { h: 45, c: 0.19, L: 0.68 },
  frost: { h: 230, c: 0.08, L: 0.86 },
  acidity: { h: 115, c: 0.17, L: 0.82 },
  toxicity: { h: 125, c: 0.16, L: 0.62 },
  death: { h: 300, c: 0.03, L: 0.35 },
};
