// Magic: the six magical properties every ingredient and potion carries.
//
// A potion's magic is never looked up from a recipe. It is the proportion-
// weighted blend of the magic of the ingredients the customer actually
// drinks, computed particle by particle from the simulated matter:
//
//   1. proportions  — every species brings its own magic vector (0..100 per
//                     property, as printed in the ingredient's card); a
//                     particle's magic is the volume-weighted mean, so water
//                     dilutes and a 1:1 blend sits half way between;
//   2. extraction   — stone powders act once dissolved. Undissolved grains
//                     in cold water leach a little, dry powder even less;
//                     steeping them hot draws their magic out (fully some
//                     70°C above room temperature) and what a hot steep drew
//                     out stays drawn out, so heat makes stones give up
//                     their magic;
//   3. overheating  — above a particle's fading threshold (the magic-weighted
//                     mean of its ingredients' thresholds) its magic burns
//                     away, faster the hotter it is (`vig`, 1 = intact);
//   4. transmutation— every ingredient also has a *super-transition*
//                     temperature, usually far beyond any fire or frost the
//                     shop can make. Mixing averages the thresholds (weighted
//                     by magic), so a blend of a "hot" and a "cold" ingredient
//                     can transmute in an ordinary cauldron. Crossing it
//                     concentrates the whole magic of the particle into one
//                     property (extremely high) and empties the rest (`ss`,
//                     the transmuted share, 1 = fully transmuted).
//
// The state that cannot be read from composition (vig, ss and the steeping
// temperature) is carried per particle and exchanged by diffusion weighted by
// the magic each particle holds, so stirring spreads it exactly like matter.

/**
 * @typedef {Object} PropDef
 * @property {string} key
 * @property {string} label
 * @property {string} icon     UI icon name
 * @property {number[]} color  sRGB 0..1 (bars, visual responses)
 */

/** @type {PropDef[]} */
export const PROPS = [
  { key: 'vitality', label: 'Vitality', icon: 'leaf', color: [0.42, 0.86, 0.38] },
  { key: 'ardor', label: 'Ardor', icon: 'flame', color: [1, 0.52, 0.2] },
  { key: 'frost', label: 'Frost', icon: 'snow', color: [0.55, 0.87, 1] },
  { key: 'levity', label: 'Levity', icon: 'feather', color: [0.8, 0.68, 1] },
  { key: 'charm', label: 'Charm', icon: 'heart', color: [1, 0.45, 0.7] },
  { key: 'bane', label: 'Bane', icon: 'skull', color: [0.76, 0.8, 0.22] },
];

export const NP = PROPS.length;
export const PROP_KEYS = PROPS.map((e) => e.key);
/** @type {Record<string, number>} */
export const PROP_INDEX = Object.fromEntries(PROP_KEYS.map((k, i) => [k, i]));
/** @type {Record<string, PropDef>} */
export const PROP_BY_KEY = Object.fromEntries(PROPS.map((e) => [e.key, e]));
export const P = Object.freeze({ VIT: 0, ARD: 1, FRO: 2, LEV: 3, CHA: 4, BAN: 5 });

/** Magic never exceeds this. */
export const MAX_MAGIC = 100;
/** Fraction of magic lost per second per °C above the fading threshold. */
export const FADE_RATE = 0.004;
/** Transmutation concentrates the whole magic into one property, amplified. */
export const SUPER_GAIN = 1.35;
/**
 * Transmutation takes a few seconds beyond the threshold (faster the further
 * beyond): a blend that only brushes past it while being mixed barely
 * changes, one held there transmutes completely.
 */
export const SUPER_RATE = 0.2;
/** "No threshold" (a particle without magic). */
export const NO_THRESHOLD = 1e6;
/** Leaching from undissolved grains that sit in liquid, and from dry powder. */
export const LEACH_WET = 0.12;
export const LEACH_DRY = 0.05;
/** Steeping: wet grains give up all their magic once steeped this far above room temperature. */
export const STEEP_SPAN = 70;

/**
 * Magic vector of a material definition (NP numbers).
 * @param {{magic?: Record<string, number>}|null|undefined} def
 * @returns {number[]}
 */
export function magicVector(def) {
  const v = new Array(NP).fill(0);
  if (def && def.magic) for (let k = 0; k < NP; k++) v[k] = Number(def.magic[PROP_KEYS[k]]) || 0;
  return v;
}

/** Total magic of a material (its weight when thresholds are averaged). @param {any} def */
export function magicWeight(def) {
  return magicVector(def).reduce((a, b) => a + Math.max(0, b), 0);
}

/** @param {ArrayLike<number>} vec @returns {Record<string, number>} */
export function toRecord(vec) {
  /** @type {Record<string, number>} */
  const o = {};
  for (let k = 0; k < NP; k++) o[PROP_KEYS[k]] = Math.round(vec[k] * 10) / 10;
  return o;
}

/** @param {Record<string, number>|undefined|null} rec @returns {number[]} */
export function fromRecord(rec) {
  const v = new Array(NP).fill(0);
  if (rec) for (let k = 0; k < NP; k++) v[k] = Number(rec[PROP_KEYS[k]]) || 0;
  return v;
}

/**
 * Natural (untransmuted, unfaded) magic of one composition: the volume-
 * weighted magic of what is extracted into solution.
 * @param {import('../reactions/species.js').SpeciesTable} sp
 * @param {ArrayLike<number>} comp @param {number} off
 * @param {number} T current temperature @param {number} steepT hottest wet temperature reached
 * @param {Float64Array|number[]} out length NP (overwritten)
 * @returns {number} total extracted magic (Σ out)
 */
export function naturalMagic(sp, comp, off, T, steepT, out) {
  for (let k = 0; k < NP; k++) out[k] = 0;
  const n = sp.count;
  let tot = 0, liquid = 0;
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    if (f <= 0) continue;
    tot += f;
    if (!sp.isPowder[s] || T >= sp.melt[s]) liquid += f;
  }
  if (tot <= 1e-9) return 0;
  const wet = liquid / tot > 0.05;
  // what a hot steep drew out stays drawn out
  const Te = wet && steepT > T ? steepT : T;
  const leach = wet ? LEACH_WET + (1 - LEACH_WET) * Math.min(1, Math.max(0, (Te - 20) / STEEP_SPAN)) : LEACH_DRY;
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    if (f <= 0 || sp.magW[s] <= 0) continue;
    let avail = f;
    if (sp.isPowder[s] && T < sp.melt[s]) {
      const sol = Math.min(0.9, Math.max(0, sp.solubility[s] + sp.solTemp[s] * (Te - 20)));
      const dissolved = Math.min(f, sol * liquid * 1.2);
      avail = dissolved + leach * (f - dissolved);
    }
    const base = s * NP;
    for (let k = 0; k < NP; k++) {
      const e = sp.mag[base + k];
      if (e !== 0) out[k] += avail * e;
    }
  }
  const inv = 1 / tot;
  let sum = 0;
  for (let k = 0; k < NP; k++) { out[k] *= inv; if (out[k] > 0) sum += out[k]; }
  return sum;
}

/**
 * Thresholds of a composition: the magic-weighted means of its species'
 * fading and super-transition temperatures, and the property it would
 * transmute into (the strongest vote, weighted by magic).
 * @param {import('../reactions/species.js').SpeciesTable} sp
 * @param {ArrayLike<number>} comp @param {number} off
 * @param {{fade:number, super:number, key:number, weight:number}} [out]
 */
export function thresholds(sp, comp, off, out = { fade: NO_THRESHOLD, super: NO_THRESHOLD, key: -1, weight: 0 }) {
  let w = 0, fade = 0, sup = 0;
  const votes = voteScratch;
  for (let k = 0; k < NP; k++) votes[k] = 0;
  for (let s = 0; s < sp.count; s++) {
    const f = comp[off + s];
    if (f <= 0) continue;
    const mw = f * sp.magW[s];
    if (mw <= 0) continue;
    w += mw;
    fade += mw * sp.fadeT[s];
    sup += mw * sp.superT[s];
    const key = sp.superK[s];
    if (key >= 0) votes[key] += mw;
  }
  if (w <= 1e-9) {
    out.fade = NO_THRESHOLD; out.super = NO_THRESHOLD; out.key = -1; out.weight = 0;
    return out;
  }
  let best = -1, bv = 0;
  for (let k = 0; k < NP; k++) if (votes[k] > bv) { bv = votes[k]; best = k; }
  out.fade = fade / w;
  out.super = sup / w;
  out.key = best;
  out.weight = w;
  return out;
}
const voteScratch = new Float64Array(NP);

/** Is temperature T beyond a super-transition threshold (crossed away from room temperature)? */
export function beyondSuper(T, ts) {
  if (ts >= NO_THRESHOLD * 0.5) return false;
  return ts >= 20 ? T >= ts : T <= ts;
}

/**
 * Full magic of one particle (or a homogeneous bulk) given its carried state.
 * @param {import('../reactions/species.js').SpeciesTable} sp
 * @param {ArrayLike<number>} comp @param {number} off
 * @param {number} T @param {number} steepT @param {number} vig @param {number} ss @param {number} key super property (-1 none)
 * @param {Float64Array|number[]} out
 */
export function particleMagic(sp, comp, off, T, steepT, vig, ss, key, out) {
  const sum = naturalMagic(sp, comp, off, T, steepT, out);
  if (ss > 1e-4 && key >= 0) {
    const c = Math.min(MAX_MAGIC, SUPER_GAIN * sum);
    for (let k = 0; k < NP; k++) out[k] = (1 - ss) * out[k] + (k === key ? ss * c : 0);
  }
  for (let k = 0; k < NP; k++) {
    let v = out[k] * vig;
    if (v < 0) v = 0; else if (v > MAX_MAGIC) v = MAX_MAGIC;
    out[k] = v;
  }
  return out;
}

const one = new Float64Array(NP);

/**
 * Mean magic of a set of particles in a simulation (what the customer
 * drinks), plus the magic-weighted mean of the carried state.
 * @param {import('../simulation/world.js').Simulation} sim
 * @param {ArrayLike<number>} indices
 */
export function sampleMagic(sim, indices) {
  const p = sim.p, sp = sim.species, S = p.S;
  const sum = new Float64Array(NP);
  let wv = 0, wsum = 0, ws = 0, wst = 0;
  const n = indices.length;
  for (let q = 0; q < n; q++) {
    const i = indices[q];
    particleMagic(sp, p.comp, i * S, p.temp[i], p.stp[i], p.vig[i], p.ss[i], p.sk[i], one);
    for (let k = 0; k < NP; k++) sum[k] += one[k];
    const w = p.mw[i];
    if (w > 0) { wsum += w; wv += w * p.vig[i]; ws += w * p.ss[i]; wst += w * p.stp[i]; }
  }
  if (n) for (let k = 0; k < NP; k++) sum[k] /= n;
  return {
    magic: sum,
    vig: wsum > 0 ? wv / wsum : 1,
    ss: wsum > 0 ? ws / wsum : 0,
    steep: wsum > 0 ? wst / wsum : -300,
  };
}

/**
 * The plain proportional blend of known ingredient magic (full extraction,
 * no heat): what a player can work out on paper from a recipe.
 * @param {{id:string, ml:number}[]} parts @param {(id:string)=>any} lookup
 */
export function blendOf(parts, lookup) {
  const v = new Float64Array(NP);
  let tot = 0;
  for (const p of parts) tot += p.ml;
  if (tot <= 0) return v;
  for (const p of parts) {
    const ev = magicVector(lookup(p.id));
    for (let k = 0; k < NP; k++) v[k] += (ev[k] * p.ml) / tot;
  }
  return v;
}

/** Largest property (for colours), or -1. @param {ArrayLike<number>} v */
export function dominantProp(v, min = 2) {
  let best = -1, bv = min;
  for (let k = 0; k < NP; k++) if (v[k] > bv) { bv = v[k]; best = k; }
  return best;
}

/** CSS colour of a property. @param {number} k @param {number} [a] */
export function propCss(k, a = 1) {
  const c = PROPS[k].color;
  return `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;
}
