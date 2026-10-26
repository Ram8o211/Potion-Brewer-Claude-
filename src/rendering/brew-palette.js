// A brew takes its colours from the painted pieces of what went into it.
// Every species that comes from a painted ingredient — the ingredient
// itself, its awakened form, and what it is steeped, infused or extracted
// into — dyes the liquid with its painting's own palette rather than its
// plain base colour: the mean of the painting sets the dye (mixed with the
// rest of the brew by Beer–Lambert, as derived.js mixes colours), and each
// particle carries one of the painting's shades, so a fresh dose shows the
// ingredient's light and dark tones and softens into gradients as it
// diffuses through the brew.
//
// Render-side only: the painting's pixels exist once the atlas has loaded
// (rendering/pieces-art.js); until then particles keep their own colour.

import { MAX_SPECIES } from '../reactions/species.js';
import { srgbToLinear, linearToSrgb } from '../core/color.js';
import { PIECE_ART, piecePalette } from './pieces-art.js';
import { grainSkinOf } from '../materials/shapes.js';

/**
 * @typedef {object} SpeciesPalette
 * @property {number[]} abs    absorbance of the painting's mean colour (r, g, b)
 * @property {Float32Array} shades  per-shade colour factors relative to the mean (r, g, b triples)
 * @property {number} n        number of shades
 */

/** @type {WeakMap<object, SpeciesPalette|null>} */
const bySpecies = new WeakMap();
/** @type {Map<number, {mean:number[], shades:Float32Array, n:number}|null>} */
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

/** Mean colour and shades of all four pieces of a painted ingredient. */
function skinPalette(base) {
  let got = bySkin.get(base);
  if (got !== undefined) return got;
  /** @type {number[]} */
  const px = [];
  for (let v = 0; v < 4; v++) {
    const pal = piecePalette(base + v);
    if (!pal) continue;
    for (let i = 0; i < pal.length; i++) px.push(pal[i]);
  }
  if (!px.length) { bySkin.set(base, null); return null; }
  // the outline is ink, not the ingredient: leave the darkest pixels out
  const cols = px.map((c) => [(c & 255) / 255, ((c >>> 8) & 255) / 255, ((c >>> 16) & 255) / 255]);
  const lum = (c) => 0.3 * c[0] + 0.55 * c[1] + 0.15 * c[2];
  const body = cols.filter((c) => lum(c) > 0.14);
  const use = body.length > cols.length * 0.3 ? body : cols;
  const mean = [0, 0, 0];
  for (const c of use) for (let k = 0; k < 3; k++) mean[k] += srgbToLinear(c[k]);
  for (let k = 0; k < 3; k++) mean[k] = linearToSrgb(mean[k] / use.length);
  // up to 32 shades spread over the painting, as factors on the mean
  const n = Math.min(32, use.length);
  const shades = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const c = use[Math.floor(((i + 0.5) / n) * use.length)];
    for (let k = 0; k < 3; k++) shades[i * 3 + k] = Math.max(0.55, Math.min(1.5, (c[k] + 0.04) / (mean[k] + 0.04)));
  }
  got = { mean, shades, n };
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
  const sk = src ? skinPalette(grainSkinOf(src, 0)) : null;
  if (sk) {
    // a product is a little darker than what it was made from, as its own colour is
    const dim = src === def || def.awakened ? 1 : 0.85;
    const tint = def.tint ?? 1;
    got = { abs: sk.mean.map((c) => -Math.log(Math.max(0.003, srgbToLinear(c * dim))) * tint), shades: sk.shades, n: sk.n };
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

/** The colour of particle i with its painted species' palettes. */
export const pc = [0, 0, 0];

/**
 * Colour of particle i in pc (sRGB): Beer–Lambert over its composition with
 * painted species dyed by their painting, then shaded by the painting's
 * tone this particle carries, as strongly as the painted share of it.
 * Returns false (pc untouched) when the particle holds nothing painted.
 * @param {import('../simulation/world.js').Simulation} sim @param {number} i
 */
export function paletteColour(sim, i) {
  const p = sim.p, sp = sim.species, comp = p.comp, off = i * MAX_SPECIES;
  let tot = 0, aR = 0, aG = 0, aB = 0, pw = 0, best = -1, bestF = 0;
  for (let s = 0; s < sp.count; s++) {
    const f = comp[off + s];
    if (f <= 0) continue;
    tot += f;
    const pl = slots[s];
    if (pl) {
      aR += f * pl.abs[0]; aG += f * pl.abs[1]; aB += f * pl.abs[2];
      pw += f;
      if (f > bestF) { bestF = f; best = s; }
    } else {
      aR += f * sp.absR[s]; aG += f * sp.absG[s]; aB += f * sp.absB[s];
    }
  }
  if (pw <= 0 || tot <= 1e-6) return false;
  const inv = 1 / tot;
  let r = linearToSrgb(Math.exp(-aR * inv)), g = linearToSrgb(Math.exp(-aG * inv)), b = linearToSrgb(Math.exp(-aB * inv));
  const pl = /** @type {SpeciesPalette} */ (slots[best]);
  const sd = p.seed[i];
  const h = (Math.imul(sd ^ (sd >>> 16), 0x45d9f3b) >>> 0) % pl.n;
  const t = Math.min(1, pw * inv * 1.6) * 0.6;
  r *= 1 + (pl.shades[h * 3] - 1) * t; g *= 1 + (pl.shades[h * 3 + 1] - 1) * t; b *= 1 + (pl.shades[h * 3 + 2] - 1) * t;
  pc[0] = Math.min(1, r); pc[1] = Math.min(1, g); pc[2] = Math.min(1, b);
  return true;
}
