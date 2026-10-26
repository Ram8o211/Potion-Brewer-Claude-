// A brew takes its colour from the painted pieces of what went into it.
// Every species that comes from a painted ingredient — the ingredient
// itself, its awakened form, and what it is steeped, infused or extracted
// into — dyes the liquid with its painting's dominant colour (the shade
// that covers most of the painting, not an average of all its textures)
// rather than its plain base colour, mixed with the rest of the brew by
// Beer–Lambert, as derived.js mixes colours.
//
// Render-side only: the painting's pixels exist once the atlas has loaded
// (rendering/pieces-art.js); until then particles keep their own colour.

import { MAX_SPECIES } from '../reactions/species.js';
import { srgbToLinear, linearToSrgb } from '../core/color.js';
import { PIECE_ART, piecePalette } from './pieces-art.js';
import { grainSkinOf } from '../materials/shapes.js';

/**
 * @typedef {object} SpeciesPalette
 * @property {number[]} abs    absorbance of the painting's dominant colour (r, g, b)
 */

/** @type {WeakMap<object, SpeciesPalette|null>} */
const bySpecies = new WeakMap();
/** @type {Map<number, number[]|null>} */
const bySkin = new Map();

/** The painted ingredient a material's colours come from, or null. */
function paintedSource(def, sim, depth = 0) {
  if (!def || depth > 3) return null;
  if (grainSkinOf(def, 0)) return def;
  // the awakened form of an ingredient is the same substance
  if (def.awakened && def.base) return paintedSource(sim.lookup(def.base), sim, depth + 1);
  // a single product made from one ingredient (an infusion, a tincture…)
  const rules = sim.reactions && sim.reactions.rules;
  if (rules) {
    for (const r of rules) {
      if (r.products && r.products.length === 1 && r.products[0].id === def.id && !r.b) {
        const src = paintedSource(sim.lookup(r.a), sim, depth + 1);
        if (src) return src;
      }
    }
  }
  return null;
}

/**
 * Dominant colour (sRGB) of all four pieces of a painted ingredient: the
 * painting's pixels are sorted into hue families (plus one for greys), and
 * the family covering the most of it gives the colour, as its mean.
 * @param {number[][]} cols sRGB pixels
 */
export function dominantColour(cols) {
  // the outline is ink, not the ingredient: leave the darkest pixels out
  const lum = (c) => 0.3 * c[0] + 0.55 * c[1] + 0.15 * c[2];
  const body = cols.filter((c) => lum(c) > 0.14);
  const use = body.length > cols.length * 0.3 ? body : cols;
  const BINS = 12, GREY = BINS;
  const bin = new Array(BINS + 1).fill(0);
  const key = use.map((c) => {
    const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]), d = mx - mn;
    if (d < 0.08 || d < mx * 0.15) return GREY;
    let hue = mx === c[0] ? ((c[1] - c[2]) / d + 6) % 6 : mx === c[1] ? (c[2] - c[0]) / d + 2 : (c[0] - c[1]) / d + 4;
    return Math.floor((hue / 6) * BINS + 0.5) % BINS;
  });
  for (const k of key) bin[k]++;
  // a family split across a bin edge still counts as one: score each bin with half its neighbours
  let best = 0, bestS = -1;
  for (let k = 0; k <= BINS; k++) {
    const sc = k === GREY ? bin[k] : bin[k] + 0.5 * (bin[(k + 1) % BINS] + bin[(k + BINS - 1) % BINS]);
    if (sc > bestS) { bestS = sc; best = k; }
  }
  const near = (k) => (best === GREY ? k === GREY : k !== GREY && Math.min((k - best + BINS) % BINS, (best - k + BINS) % BINS) <= 1);
  const mean = [0, 0, 0];
  let n = 0;
  for (let i = 0; i < use.length; i++) {
    if (!near(key[i])) continue;
    for (let c = 0; c < 3; c++) mean[c] += srgbToLinear(use[i][c]);
    n++;
  }
  return mean.map((v) => linearToSrgb(v / Math.max(1, n)));
}

/** Dominant colour of all four pieces of a painted ingredient. */
function skinColour(base) {
  let got = bySkin.get(base);
  if (got !== undefined) return got;
  /** @type {number[][]} */
  const cols = [];
  for (let v = 0; v < 4; v++) {
    const pal = piecePalette(base + v);
    if (!pal) continue;
    for (let i = 0; i < pal.length; i++) { const c = pal[i]; cols.push([(c & 255) / 255, ((c >>> 8) & 255) / 255, ((c >>> 16) & 255) / 255]); }
  }
  got = cols.length ? dominantColour(cols) : null;
  bySkin.set(base, got);
  return got;
}

/** @param {any} def @param {import('../simulation/world.js').Simulation} sim @returns {SpeciesPalette|null} */
function speciesPalette(def, sim) {
  if (!def || typeof def !== 'object') return null;
  let got = bySpecies.get(def);
  if (got !== undefined) return got;
  got = null;
  const src = paintedSource(def, sim);
  const sk = src ? skinColour(grainSkinOf(src, 0)) : null;
  if (sk) {
    // a product is a little darker than what it was made from, as its own colour is
    const dim = src === def || def.awakened ? 1 : 0.85;
    const tint = def.tint ?? 1;
    got = { abs: sk.map((c) => -Math.log(Math.max(0.003, srgbToLinear(c * dim))) * tint) };
  }
  bySpecies.set(def, got);
  return got;
}

/** Per-slot palettes for the current species table (rebuilt when it changes). */
const slots = /** @type {(SpeciesPalette|null)[]} */ (new Array(MAX_SPECIES).fill(null));
const slotDef = new Array(MAX_SPECIES).fill(null);
let any = false;

/**
 * Refresh the slot palettes; false when no species in the brew is painted
 * (or the atlas is not in yet), so the caller can skip the per-particle work.
 * @param {import('../simulation/world.js').Simulation} sim
 */
export function preparePalettes(sim) {
  if (!PIECE_ART.ready) return false;
  const sp = sim.species;
  any = false;
  for (let s = 0; s < sp.count; s++) {
    const d = sp.defs[s];
    if (d !== slotDef[s]) { slotDef[s] = d; slots[s] = speciesPalette(d, sim); }
    if (slots[s]) any = true;
  }
  return any;
}

/** The colour of particle i with its painted species' colours. */
export const pc = [0, 0, 0];

/**
 * Colour of particle i in pc (sRGB): Beer–Lambert over its composition with
 * painted species dyed by their painting's dominant colour.
 * Returns false (pc untouched) when the particle holds nothing painted.
 * @param {import('../simulation/world.js').Simulation} sim @param {number} i
 */
export function paletteColour(sim, i) {
  const p = sim.p, sp = sim.species, comp = p.comp, off = i * MAX_SPECIES;
  let tot = 0, aR = 0, aG = 0, aB = 0, pw = 0;
  for (let s = 0; s < sp.count; s++) {
    const f = comp[off + s];
    if (f <= 0) continue;
    tot += f;
    const pl = slots[s];
    if (pl) {
      aR += f * pl.abs[0]; aG += f * pl.abs[1]; aB += f * pl.abs[2];
      pw += f;
    } else {
      aR += f * sp.absR[s]; aG += f * sp.absG[s]; aB += f * sp.absB[s];
    }
  }
  if (pw <= 0 || tot <= 1e-6) return false;
  const inv = 1 / tot;
  pc[0] = Math.min(1, linearToSrgb(Math.exp(-aR * inv)));
  pc[1] = Math.min(1, linearToSrgb(Math.exp(-aG * inv)));
  pc[2] = Math.min(1, linearToSrgb(Math.exp(-aB * inv)));
  return true;
}
