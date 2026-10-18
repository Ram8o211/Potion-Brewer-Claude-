// Derived per-particle properties. Recomputed when a particle's composition
// changes (dirty flag) and periodically for temperature-dependent values.

import { MAX_SPECIES, NO_BOIL } from '../reactions/species.js';
import { granularFraction, suspensionLnMult } from '../reactions/mixture.js';
import { rgbToOklab, linearToSrgb } from '../core/color.js';
import { PHASE } from './constants.js';
import { compositionEffects, EFFECTS, NE } from '../alchemy/effects.js';
import { ARC_NONE } from './particles.js';

/** emission weight per effect channel: magic shines, chemistry glows faintly */
const AURA_W = EFFECTS.map((e) => (e.kind === 'magic' ? 1 : 0.55));
const AURA_COL = EFFECTS.map((e) => e.color);
const auraFx = new Float64Array(NE);

/** Mass assigned to gas particles for constraint weighting (they yield to condensed matter). */
export const GAS_MASS = 0.05;

/**
 * @param {import('./world.js').Simulation} sim
 * @param {number} i
 */
export function refreshParticle(sim, i) {
  const p = sim.p, sp = sim.species;
  const off = i * MAX_SPECIES;
  const comp = p.comp;
  const T = p.temp[i];
  const n = sp.count;
  let tot = 0, rho = 0, rhoCp = 0, kap = 0, lnV = 0, lnVw = 0, vT = 0, beta = 0;
  let aR = 0, aG = 0, aB = 0, op = 0, flam = 0, ign = 0, ignW = 0, comb = 0, gasR = 0, glow = 0;
  let tbS = 0, tbW = 0, tmS = 0, tmW = 0, pmS = 0, pmW = 0, fricS = 0, hardS = 0, binder = 0, latF = 0, latV = 0;
  let cA = 0, cB = 0, ec = 0, arcW = 0, arcS = 0, whole = 0, lookF = 0, look = 0;
  for (let s = 0; s < n; s++) {
    const f = comp[off + s];
    if (f <= 0) continue;
    tot += f;
    rho += f * sp.density[s];
    rhoCp += f * sp.heatCap[s];
    kap += f * sp.conductivity[s];
    beta += f * sp.expansion[s];
    cA += f * sp.compatA[s];
    cB += f * sp.compatB[s];
    ec += f * sp.econd[s];
    const powder = sp.isPowder[s] === 1;
    if (!powder || T >= sp.melt[s]) {
      lnV += f * sp.lnVisc[s];
      vT += f * sp.viscTemp[s];
      lnVw += f;
    }
    aR += f * sp.absR[s];
    aG += f * sp.absG[s];
    aB += f * sp.absB[s];
    op += f * sp.opacity[s];
    glow += f * sp.glow[s];
    const fl = sp.flam[s];
    if (fl > 0) {
      flam += f * fl;
      ign += f * fl * sp.ignition[s];
      ignW += f * fl;
      comb += f * fl * sp.combHeat[s];
    }
    gasR += f * sp.gasDensity[s];
    if (sp.boil[s] < NO_BOIL) {
      tbS += f * sp.boil[s];
      tbW += f;
    }
    if (powder) {
      pmS += f * sp.melt[s];
      pmW += f;
      fricS += f * sp.friction[s];
      binder += f * sp.binder[s];
    } else {
      tmS += f * sp.melt[s];
      tmW += f;
    }
    hardS += f * sp.hardness[s];
    latF += f * sp.latF[s];
    latV += f * sp.latV[s];
    if (sp.arcMag[s]) { arcW += f; arcS += f * sp.arcThr[s]; }
    if (sp.isWhole[s]) {
      whole += f;
      if (f > lookF) { lookF = f; look = sp.look[s]; }
    }
  }
  if (tot <= 1e-6) {
    tot = 1;
    rho = 1; rhoCp = 4; kap = 1;
  }
  const inv = 1 / tot;
  const gran = granularFraction(sp, comp, off, T) * inv;
  const powderFrac = pmW * inv;
  const dissolved = Math.max(0, powderFrac - gran);
  const rho20 = rho * inv;
  const b = beta * inv;
  p.rho20[i] = rho20;
  const rhoT = rho20 * Math.max(0.6, 1 - b * (T - 20));
  p.rho[i] = rhoT;
  p.invMass[i] = p.phase[i] === PHASE.GAS ? 1 / GAS_MASS : 1 / rhoT;
  p.rhoCp[i] = rhoCp * inv;
  p.kappa[i] = kap * inv;
  p.beta[i] = b;
  p.cA[i] = cA * inv;
  p.cB[i] = cB * inv;
  const bnd = pmW > 0 ? binder / pmW : 0;
  p.binder[i] = bnd;
  p.gran[i] = gran;
  const lnMu20 = lnVw > 0 ? lnV / lnVw : 11;
  const kT = lnVw > 0 ? vT / lnVw : 0;
  p.lnMu20[i] = lnMu20;
  p.viscT[i] = kT;
  p.lnMu[i] = lnMu20 - kT * (Math.min(T, 300) - 20) + suspensionLnMult(gran, bnd);
  // freezing point: liquid-form species, depressed by dissolved solutes
  p.tm[i] = tmW > 0 ? tmS / tmW - 28 * dissolved : pmW > 0 ? pmS / pmW : 0;
  p.tb[i] = tbW > 0 ? tbS / tbW : NO_BOIL;
  p.volFrac[i] = tbW * inv;
  p.latF[i] = latF * inv;
  p.latV[i] = latV * inv;
  // Beer–Lambert colour: absorbances add by concentration
  const cr = linearToSrgb(Math.exp(-aR * inv)), cg = linearToSrgb(Math.exp(-aG * inv)), cb = linearToSrgb(Math.exp(-aB * inv));
  sim.colR[i] = cr; sim.colG[i] = cg; sim.colB[i] = cb;
  const lab = rgbToOklab(cr, cg, cb);
  p.colL[i] = lab[0]; p.colA[i] = lab[1]; p.colB[i] = lab[2];
  p.opacity[i] = op * inv;
  p.flam[i] = flam * inv;
  p.ign[i] = ignW > 0 ? ign / ignW : 9999;
  p.combHeat[i] = ignW > 0 ? comb / ignW : 0;
  p.gasRho[i] = gasR * inv;
  p.glow[i] = glow * inv;
  p.friction[i] = pmW > 0 ? fricS / pmW : 0.5;
  p.hardness[i] = hardS * inv;
  p.econd[i] = ec * inv;
  // paste yield velocity: zero for liquids, rising steeply with solids content
  const s = Math.max(0, Math.min(1, (gran - 0.34) / 0.42));
  p.yieldV[i] = (0.1 + 0.6 * bnd) * Math.pow(s, 1.1);
  p.arcT[i] = arcW > 1e-4 ? arcS / arcW : ARC_NONE;
  p.whole[i] = whole * inv;
  p.look[i] = look;
  refreshAura(sim, i);
  p.dirty[i] = 0;
}

/**
 * Magical emission of a particle: the colours of the effects it actually
 * carries (extracted, after resonance laws and oppositions — the same
 * function a bottle is measured with), weighted by their concentration.
 * @param {import('./world.js').Simulation} sim @param {number} i
 */
export function refreshAura(sim, i) {
  const p = sim.p;
  if (sim.species.count === 0) { p.auraI[i] = 0; return; }
  compositionEffects(sim.species, p.comp, i * MAX_SPECIES, p.temp[i], sim.laws || [], auraFx);
  let I = 0, r = 0, g = 0, b = 0;
  for (let k = 0; k < NE; k++) {
    const v = Math.abs(auraFx[k]) * AURA_W[k];
    if (v < 0.05) continue;
    const c = AURA_COL[k];
    I += v; r += v * c[0]; g += v * c[1]; b += v * c[2];
  }
  if (I > 0) {
    p.auraR[i] = r / I; p.auraG[i] = g / I; p.auraB[i] = b / I;
  }
  p.auraI[i] = I / 100;
}
