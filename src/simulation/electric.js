// Electrical conduction between touching matter.
//
// Every particle carries an electric charge `q` (arbitrary units per 5 ml).
// Charged reagents (storm glass, phoenix ash, void ink…) bring their own
// charge when poured; it then flows between touching particles in
// proportion to their electrical conductance (metal ≫ brine ≫ water ≫ oil),
// so a conductive brew spreads it while an oil layer insulates. Every
// exchange is pairwise and antisymmetric: total charge is conserved exactly.
// Current through a resistive contact dissipates Joule heat into both
// particles (counted as energy input), and a large potential step across a
// good contact discharges as a visible spark. The cauldron sits on a stone
// hearth, so it is insulated (no ground leak). A neutral brew costs one scan.

import { PHASE } from './constants.js';

const KQ = 26; // conduction rate (game scaled)
const RE = 0.16; // contact distance
const JOULE = 140; // heat per unit of charge moved per unit of potential difference

/** @param {import('./world.js').Simulation} sim @param {number} dt */
export function electricStep(sim, dt) {
  const p = sim.p, n = p.count, q = p.q;
  let any = false;
  for (let i = 0; i < n; i++) if (q[i] > 1e-5 || q[i] < -1e-5) { any = true; break; }
  if (!any) return;
  const G = p.econd, T = p.temp, C = p.rhoCp, ph = p.phase;
  const { pairI, pairJ, pairCount } = sim.grid;
  const R2 = RE * RE;
  for (let k = 0; k < pairCount; k++) {
    const i = pairI[k], j = pairJ[k];
    const dq = q[j] - q[i];
    if (dq > -1e-5 && dq < 1e-5) continue;
    if (ph[i] === PHASE.GAS || ph[j] === PHASE.GAS) continue;
    const gi = G[i], gj = G[j];
    if (gi <= 0 || gj <= 0) continue;
    const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
    const r2 = dx * dx + dy * dy;
    if (r2 >= R2) continue;
    const g = ((2 * gi * gj) / (gi + gj)) * (1 - Math.sqrt(r2) / RE);
    let m = KQ * g * dq * dt;
    const lim = 0.24 * Math.abs(dq);
    if (m > lim) m = lim; else if (m < -lim) m = -lim;
    q[i] += m;
    q[j] -= m;
    // resistive loss: poorer conductors heat more per unit of charge moved
    const heat = JOULE * Math.abs(m * dq) * (1 - Math.min(0.9, g));
    if (heat > 0) {
      T[i] += (0.5 * heat) / C[i];
      T[j] += (0.5 * heat) / C[j];
      sim.energyIn += heat;
    }
    if (Math.abs(dq) > 0.55 && g > 0.25 && sim.rand() < 0.02) {
      sim.emit({ type: 'spark', x: 0.5 * (p.x[i] + p.x[j]), y: 0.5 * (p.y[i] + p.y[j]), q: Math.abs(dq) });
    }
  }
}

/** Total charge in the cauldron (conservation checks). @param {import('./world.js').Simulation} sim */
export function totalCharge(sim) {
  let s = 0;
  for (let i = 0; i < sim.p.count; i++) s += sim.p.q[i];
  return s;
}
