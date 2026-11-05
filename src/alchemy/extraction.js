// Continuous solvent extraction — the pure model.
//
// Every catalog ingredient is either *hydrosoluble* (its magic dissolves in
// water or spirit) or *liposoluble* (only oil takes it up). Its magic leaves
// the plant matter for the solvent as a first-order process toward a
// temperature-dependent ceiling:
//
//   rate      k(T) = k20 · 2^((T − 20) / Q)          faster when hot
//   ceiling   Y(T): 1 at Tfull and below, falling linearly to Y20 at room
//             temperature (20 °C), then on to Ymin at 20 + span, never below
//                                                  lower when hot
//   progress  dφ/dt = k(T) · m · (Y(T) − φ)  while φ < Y(T)
//
// Calibration. At room temperature an ingredient gives up only about 60 % of
// its magic (Y20, 52–68 % by species), and slowly: a ground, stirred herb
// takes one to four minutes to come most of the way (k20). Heat is the way
// to speed it up — the rate doubles every 12–16 °C — but the hotter the
// steep, the less of the magic can come out (about 45 % at 60 °C, 35 % near the boil).
// Cold draws more out, but even more slowly: that is the aging cellar's work.
//
// φ is the extracted share of the ingredient's magic. Heating lowers the
// ceiling but never takes back what is already dissolved (dφ/dt is never
// negative); cooling raises it again, so a cold steep can draw more out of
// ingredients a hot steep has already worked. `m` folds in grinding (a whole
// piece only gives at its surface), stirring, and an emulsion (a solvent
// already bound into an emulsion extracts badly).
//
// The extract is matter, not a multiplier: one volume of ingredient yields
// one volume of dissolved extract carrying exactly the ingredient's effects
// per volume, so a potion's strength follows from how much ingredient went
// in, how much of it was extracted and how much liquid dilutes it. A solvent
// can hold at most its own volume of extract (SOLVENT_CAPACITY).
//
// Full extraction needs cold: Tfull lies below water's freezing point for
// hydrosoluble ingredients — only spirit stays liquid there — and below the
// basin's reach (but above oil's melting point) for liposoluble ones, so
// only chilled oil gets everything out of them. A frozen solvent extracts
// nothing.
//
// Combustion: every ingredient has a hidden combustion threshold above
// water's boiling point (some below oil's). Above it the *unextracted*
// matter chars and its remaining magic is lost for good; what is already
// dissolved is thermally stable. The solvents never burn.
//
// Everything here is deterministic from the species' permanent data, so it
// is the same in every world and every save.

import { SPECIES_DATA } from '../materials/species-data.js';

/** @type {Record<string, typeof SPECIES_DATA[number]>} */
const SPECIES_BY_KEY = Object.fromEntries(SPECIES_DATA.map((s) => [s.key, s]));

/** @typedef {'hydro'|'lipo'} SolventClass */

/** Extract volume a solvent can hold, as a share of (solvent + extract). */
export const SOLVENT_CAPACITY = 0.5;
/** Rate factor of a whole piece (only its surface touches the solvent). */
export const WHOLE_FACTOR = 0.03;
/** Rate factor in a solution that is already emulsified. */
export const EMULSION_FACTOR = 0.1;
/** Rate factor of an aging-cellar vessel (unstirred, but given hours). */
export const CELLAR_FACTOR = 0.12;
/** Combustion thresholds lie in this band (°C): above water's boil, partly below oil's. */
export const COMBUST_RANGE = /** @type {[number, number]} */ ([115, 300]);
/** Emulsions: emulsifier volume needed per volume of the dispersed (minority) phase, at strength 1. */
export const EMULSIFIER_NEED = 0.06;
/** Emulsions: the dispersed phase may be at most this share of the liquid (beyond it the emulsion breaks). */
export const EMULSION_MAX_SHARE = 0.42;

/** compat coordinates of extracts of each class (watery / oily) */
export const CLASS_COMPAT = { hydro: [0.82, 0.14], lipo: [0.16, 0.11] };

/** Deterministic hash of a string to [0, 1). @param {string} s */
export function hash01(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

const SOFT = new Set(['flower', 'leaf', 'herb', 'grass', 'berry', 'fruit', 'fungus', 'moss', 'vine']);
const HARD = new Set(['stone', 'crystal', 'relic', 'shell', 'coral']);
const LIPO_MORPH = new Set(['bark', 'seedpod', 'root', 'vine', 'crystal', 'relic']);
const EMULSIFYING = new Set(['seedpod', 'fungus', 'shell', 'berry']);

/**
 * @typedef {Object} ExtractionProfile
 * @property {SolventClass} cls
 * @property {number} k20     rate (1/s) at 20 °C, ground and stirred
 * @property {number} Q       °C per doubling of the rate
 * @property {number} Tfull   at or below this every bit can be extracted (°C)
 * @property {number} Y20     the ceiling at room temperature (20 °C)
 * @property {number} Ymin    the ceiling far above room temperature
 * @property {number} span    °C above room temperature over which the ceiling falls from Y20 to Ymin
 * @property {number} combust combustion threshold of the raw matter (°C)
 * @property {number} emulsifier emulsifying strength 0..1
 */

/** @type {Map<string, ExtractionProfile>} */
const cache = new Map();

/**
 * The extraction profile of a catalog species (by key).
 * @param {string} key @returns {ExtractionProfile|null}
 */
export function speciesProfile(key) {
  if (cache.has(key)) return /** @type {ExtractionProfile} */ (cache.get(key));
  const s = SPECIES_BY_KEY[key];
  if (!s) return null;
  const h = (salt) => hash01(key + ':' + salt);
  const morph = s.morph;
  // liposoluble: resinous barks, oily seeds and roots, waxy vines, and the
  // crystals and relics whose magic sits in a fatty lattice; a few berries too
  const lipo = LIPO_MORPH.has(morph) || (s.steep && s.steep.into === 'spirit') || (morph === 'berry' && h('cls') < 0.3) || (morph === 'flower' && s.dominant === 'fire' && h('cls') < 0.5);
  const cls = lipo ? 'lipo' : 'hydro';
  // slow at room temperature: a soft herb about a minute and a half per e-fold, a stone four
  const k20 = Math.round((SOFT.has(morph) ? 0.0095 + 0.005 * h('k') : HARD.has(morph) ? 0.0042 + 0.002 * h('k') : 0.0062 + 0.003 * h('k')) * 1e5) / 1e5;
  const Q = Math.round((12 + 4 * h('q')) * 10) / 10;
  const Tfull = cls === 'hydro' ? Math.round(-16 + 8 * h('tf')) : Math.round(-6 + 7 * h('tf'));
  // about 60 % at room temperature: soft herbs give a little more, stones a little less
  const Y20 = Math.round((0.52 + 0.12 * h('y20') + (SOFT.has(morph) ? 0.04 : HARD.has(morph) ? -0.03 : 0)) * 100) / 100;
  const Ymin = Math.round((Y20 - 0.22 - 0.1 * h('ym')) * 100) / 100;
  const span = Math.round(70 + 30 * h('sp'));
  const mineral = HARD.has(morph) || !s.botanical;
  const combust = Math.round(mineral ? 180 + 120 * h('c') : 115 + 125 * h('c'));
  const emulsifier = EMULSIFYING.has(morph) && h('em') < 0.55 ? Math.round((0.3 + 0.5 * h('es')) * 100) / 100 : 0;
  const prof = { cls: /** @type {SolventClass} */ (cls), k20, Q, Tfull, Y20, Ymin, span, combust, emulsifier };
  cache.set(key, prof);
  return prof;
}

/** Rate constant (1/s) at T for a profile. @param {{k20:number, Q:number}} pr @param {number} T */
export function rateAt(pr, T) {
  return pr.k20 * Math.pow(2, (Math.max(-80, Math.min(400, T)) - 20) / pr.Q);
}

/**
 * Ceiling of the extracted share at T: 1 at Tfull and colder, Y20 at room
 * temperature, Ymin from 20 + span upward (linear in between).
 * @param {{Tfull:number, Y20?:number, Ymin:number, span:number}} pr @param {number} T
 */
export function yieldAt(pr, T) {
  return ceilingAt(pr.Tfull, pr.Y20 ?? 0.6, pr.Ymin, pr.span, T);
}

/** The ceiling from its four numbers (shared with the particle world). @param {number} Tfull @param {number} Y20 @param {number} Ymin @param {number} span @param {number} T */
export function ceilingAt(Tfull, Y20, Ymin, span, T) {
  if (T <= Tfull) return 1;
  if (T <= 20) return Tfull >= 20 ? Y20 : 1 - ((1 - Y20) * (T - Tfull)) / (20 - Tfull);
  const y = Y20 - ((Y20 - Ymin) * (T - 20)) / span;
  return y < Ymin ? Ymin : y;
}

/**
 * The extracted share after `t` seconds at a steady T, starting from φ0.
 * @param {ExtractionProfile} pr @param {number} T @param {number} t @param {number} [phi0] @param {number} [m] rate factor
 */
export function extractOver(pr, T, t, phi0 = 0, m = 1) {
  const Y = yieldAt(pr, T);
  if (phi0 >= Y) return phi0;
  return Y - (Y - phi0) * Math.exp(-rateAt(pr, T) * m * t);
}

/** Id of a raw ingredient's extract. @param {string} rawId */
export function extractIdOf(rawId) {
  let base = rawId, awake = '';
  if (base.endsWith('~a')) { base = base.slice(0, -2); awake = '~a'; }
  return base.replace(/^wild-sp-/, 'wild-p-sp-') + awake;
}

/**
 * The extraction profile carried on a material (raw catalog ingredients,
 * filled in by materials/catalog.js), or null.
 * @param {any} def
 */
export function profileOf(def) {
  return def && def.extraction ? def.extraction : null;
}

/** Solvent class a liquid material acts as (water, spirit: hydro; oil: lipo), or null. @param {any} def */
export function solventClassOf(def) {
  return def && (def.solvent === 'hydro' || def.solvent === 'lipo') ? def.solvent : null;
}

/**
 * Is an emulsion of these phases stable?
 * @param {number} hydro volume of watery liquid @param {number} lipo volume of oily liquid
 * @param {number} emul emulsifier volume × strength
 * @returns {number} 0 (separates) … 1 (fully stable)
 */
export function emulsionStability(hydro, lipo, emul) {
  const tot = hydro + lipo;
  if (tot <= 1e-9) return 0;
  const disp = Math.min(hydro, lipo);
  if (disp <= 1e-9) return 1;
  const share = disp / tot;
  if (share > EMULSION_MAX_SHARE + 0.04) return 0;
  const prop = share <= EMULSION_MAX_SHARE ? 1 : 1 - (share - EMULSION_MAX_SHARE) / 0.04;
  const need = EMULSIFIER_NEED * disp;
  const amt = Math.min(1, Math.max(0, (emul / need - 0.6) / 0.4));
  return prop * amt;
}

/** Words for a profile's solvent class. @param {SolventClass} cls */
export function classWords(cls) {
  return cls === 'lipo' ? { short: 'oil-soluble', solvents: 'oil' } : { short: 'water-soluble', solvents: 'water or spirit' };
}

/**
 * The guild theory's view of extraction: each catalog ingredient of a
 * batch's parts counts only with the share of it that is already dissolved
 * in what is measured (`comp`: volumes or fractions per material id, as the
 * brew panel's Extracted bars show it); the rest dilutes. Other parts pass
 * unchanged.
 * @param {{id:string, ml:number}[]} parts @param {Record<string, number>} comp @param {(id:string)=>any} lookup
 */
export function extractedParts(parts, comp, lookup) {
  const out = [];
  for (const p of parts) {
    const d = lookup(p.id);
    if (!d || !d.extraction) { out.push(p); continue; }
    const base = p.id.endsWith('~a') ? p.id.slice(0, -2) : p.id;
    const x = extractIdOf(base);
    const raw = (comp[base] || 0) + (comp[base + '~a'] || 0);
    const ext = (comp[x] || 0) + (comp[x + '~a'] || 0);
    const share = raw + ext > 1e-9 ? ext / (raw + ext) : 0;
    if (share > 0) out.push({ id: p.id, ml: p.ml * share });
    if (share < 1) out.push({ id: '__undissolved', ml: p.ml * (1 - share) });
  }
  return out;
}
