// Mixture laws. Given a composition (volume fractions over species slots)
// these functions derive the effective physical properties of a blend.
// Different properties use different, physically motivated rules:
//   density, heat capacity per volume, potency → volume-fraction weighted
//   viscosity → logarithmic (Arrhenius/Refutas) blending + suspension law
//   colour → tint-weighted blending in perceptual OKLab space
//   melting/boiling → volume weighted over the relevant (volatile) part
// The same code is used by the live simulation and by the commission
// generator's predictions so customer targets are consistent with physics.

import { MAX_SPECIES, NO_BOIL } from './species.js';
import { rgbToOklab, linearToSrgb } from '../core/color.js';

/**
 * Undissolved granular fraction of a composition at temperature T.
 * Soluble powders dissolve into the liquid part up to their (temperature
 * dependent) solubility; insoluble powders always remain granular.
 * @param {import('./species.js').SpeciesTable} sp
 * @param {ArrayLike<number>} comp
 * @param {number} off offset into comp
 * @param {number} T
 */
export function granularFraction(sp, comp, off, T) {
  let liquidPart = 0;
  let gran = 0;
  const n = sp.count;
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    if (f <= 0) continue;
    if (sp.isPowder[s] && T < sp.melt[s]) continue;
    liquidPart += f;
  }
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    if (f <= 0 || !sp.isPowder[s] || T >= sp.melt[s]) continue;
    const sol = Math.min(0.9, Math.max(0, sp.solubility[s] + sp.solTemp[s] * (T - 20)));
    const dissolved = Math.min(f, sol * liquidPart * 1.2);
    gran += f - dissolved;
  }
  return gran;
}

/**
 * Viscosity multiplier (ln) from undissolved solids, continuous from a thin
 * suspension through paste to a stiff dough.
 * @param {number} g granular fraction @param {number} binder 0..1
 */
export function suspensionLnMult(g, binder) {
  const t = Math.min(1, Math.max(0, (g - 0.04) / 0.72));
  const s = t * t * (3 - 2 * t);
  return (8.5 + 3.5 * binder) * Math.pow(s, 1.5);
}

/**
 * Full derived-property bundle (used for measurement / prediction). The
 * simulation keeps a cached subset per particle for speed.
 * @param {import('./species.js').SpeciesTable} sp
 * @param {ArrayLike<number>} comp
 * @param {number} off
 * @param {number} T
 */
export function mixtureProps(sp, comp, off, T) {
  const n = sp.count;
  let tot = 0, rho = 0, rhoCp = 0, lnV = 0, lnVw = 0, vT = 0, beta = 0;
  let aR = 0, aG = 0, aB = 0, op = 0, glow = 0, vol = 0, volat = 0, react = 0;
  const asp = [0, 0, 0, 0];
  let tbW = 0, tbSum = 0;
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    if (f <= 0) continue;
    tot += f;
    rho += f * sp.density[s];
    rhoCp += f * sp.heatCap[s];
    beta += f * sp.expansion[s];
    if (!sp.isPowder[s] || T >= sp.melt[s]) {
      lnV += f * sp.lnVisc[s];
      vT += f * sp.viscTemp[s];
      lnVw += f;
    }
    aR += f * sp.absR[s];
    aG += f * sp.absG[s];
    aB += f * sp.absB[s];
    op += f * sp.opacity[s];
    glow += f * sp.glow[s];
    volat += f * sp.volatility[s];
    react += f * sp.reactivity[s];
    for (let k = 0; k < 4; k++) asp[k] += f * sp.aspects[s * 4 + k];
    if (sp.boil[s] < NO_BOIL) {
      tbSum += f * sp.boil[s];
      tbW += f;
      vol += f;
    }
  }
  if (tot <= 0) tot = 1;
  const g = granularFraction(sp, comp, off, T) / tot;
  let binder = 0, bw = 0;
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    if (f > 0 && sp.isPowder[s] && T < sp.melt[s]) {
      binder += f * sp.binder[s];
      bw += f;
    }
  }
  binder = bw > 0 ? binder / bw : 0;
  const lnMu20 = lnVw > 0 ? lnV / lnVw : Math.log(1e5);
  const kT = lnVw > 0 ? vT / lnVw : 0;
  const lnMu = lnMu20 - kT * (T - 20) + suspensionLnMult(g, binder);
  const rgb = [linearToSrgb(Math.exp(-aR / tot)), linearToSrgb(Math.exp(-aG / tot)), linearToSrgb(Math.exp(-aB / tot))];
  const lab = rgbToOklab(rgb[0], rgb[1], rgb[2]);
  return {
    density: (rho / tot) * (1 - (beta / tot) * (T - 20)),
    density20: rho / tot,
    heatCapacity: rhoCp / tot,
    viscosity: Math.exp(lnMu),
    granular: g,
    binder,
    color: rgb,
    lab,
    opacity: op / tot,
    glow: glow / tot,
    volatility: volat / tot,
    reactivity: react / tot,
    aspects: asp.map((v) => v / tot),
    boil: tbW > 0 ? tbSum / tbW : Infinity,
    volatileFraction: vol / tot,
  };
}

/** @param {number} n */
export function zeroComposition(n = MAX_SPECIES) {
  return new Float32Array(n);
}
