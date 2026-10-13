// Heat transport: particle↔particle conduction, particle↔iron wall/lid
// exchange, slow loss to room air at free surfaces, and the wall ring itself
// (furnace or frost plate under the bottom, conduction along the iron,
// loss to the room). All exchanges are pairwise and antisymmetric, so energy
// is conserved except for the explicit furnace input and ambient losses
// (tracked in sim.energyIn / sim.energyOut).

import { PHASE, SIM } from './constants.js';

const KPP = 34; // particle–particle conductance (game-scaled)
const KW = 24; // particle–wall conductance
const KA = 0.35; // free-surface loss to air
const KA_GAS = 0.5; // vapour ↔ headspace air
const RING = 220; // conduction along the iron
const HAMB = 0.5; // iron loss to room
const HAMB_LID = 9; // lid loses heat faster (exposed top)
const RT = 0.16;

/** @param {import('./world.js').Simulation} sim @param {number} dt */
export function thermalStep(sim, dt) {
  const p = sim.p, n = p.count, c = sim.cauldron;
  const T = p.temp, C = p.rhoCp, K = p.kappa, ph = p.phase;
  const { pairI, pairJ, pairCount } = sim.grid;
  const RT2 = RT * RT;
  for (let k = 0; k < pairCount; k++) {
    const i = pairI[k], j = pairJ[k];
    const dT = T[j] - T[i];
    if (dT > -0.01 && dT < 0.01) continue;
    const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
    const r2 = dx * dx + dy * dy;
    if (r2 >= RT2) continue;
    const gi = ph[i] === PHASE.GAS, gj = ph[j] === PHASE.GAS;
    const f = gi && gj ? 0.4 : gi || gj ? 0.2 : 1;
    const ki = K[i], kj = K[j];
    const G = KPP * f * ((2 * ki * kj) / (ki + kj + 1e-6)) * (1 - Math.sqrt(r2) / RT);
    let Q = G * dT * dt;
    const lim = 0.22 * Math.abs(dT) * Math.min(C[i], C[j]);
    if (Q > lim) Q = lim; else if (Q < -lim) Q = -lim;
    T[i] += Q / C[i];
    T[j] -= Q / C[j];
  }
  // wall and lid exchange, air losses
  const tw = sim.touchWall;
  const amb = SIM.AMBIENT;
  const n0 = sim.n0;
  const lidT = c.lidTemperature();
  for (let i = 0; i < n; i++) {
    const Ci = C[i];
    if (tw[i] === 1 && p.y[i] >= -0.02) {
      const cell = c.wallCellAt(p.x[i], p.y[i]);
      if (cell >= 0) {
        const dT = c.cellT[cell] - T[i];
        let Q = KW * Math.min(2, K[i]) * dT * dt * (ph[i] === PHASE.GAS ? 0.6 : 1);
        const lim = 0.3 * Math.abs(dT) * Math.min(Ci, c.cellC[cell]);
        if (Q > lim) Q = lim; else if (Q < -lim) Q = -lim;
        T[i] += Q / Ci;
        c.cellT[cell] -= Q / c.cellC[cell];
      }
    } else if (tw[i] === 2 && c.lidClosed) {
      const cell = c.lidCellAt(p.x[i]);
      const dT = c.cellT[cell] - T[i];
      let Q = KW * 0.8 * Math.min(2, K[i]) * dT * dt;
      const lim = 0.3 * Math.abs(dT) * Math.min(Ci, c.cellC[cell]);
      if (Q > lim) Q = lim; else if (Q < -lim) Q = -lim;
      T[i] += Q / Ci;
      c.cellT[cell] -= Q / c.cellC[cell];
    }
    // free surfaces lose a little heat to the room (less with the lid on)
    if (ph[i] !== PHASE.GAS && sim.dens[i] < 0.68 * n0) {
      const Q = KA * (c.lidClosed ? 0.4 : 1) * (amb - T[i]) * dt;
      T[i] += Q / Ci;
      sim.energyOut -= Q;
    } else if (ph[i] === PHASE.GAS) {
      // vapour exchanges heat with the headspace air, which follows the lid
      const Ta = c.lidClosed ? lidT : amb;
      const Q = KA_GAS * (Ta - T[i]) * dt;
      T[i] += Q / Ci;
      sim.energyOut -= Q;
    }
  }
  wallStep(sim, dt);
}

/** Iron ring + lid + furnace. @param {import('./world.js').Simulation} sim @param {number} dt */
export function wallStep(sim, dt) {
  const c = sim.cauldron;
  const M = c.wallCount, L = c.lidCells;
  const Tw = c.cellT, Cw = c.cellC;
  const f = sim.furnace;
  const amb = SIM.AMBIENT;
  const flow = sim._wallFlow || (sim._wallFlow = new Float32Array(Tw.length));
  flow.fill(0);
  // conduction along wall ring
  for (let k = 0; k < M - 1; k++) {
    const q = RING * (Tw[k + 1] - Tw[k]) * dt;
    flow[k] += q; flow[k + 1] -= q;
  }
  // lid chain, attached to the rim cells at both ends
  for (let k = 0; k < L - 1; k++) {
    const a = M + k, b = M + k + 1;
    const q = RING * 0.6 * (Tw[b] - Tw[a]) * dt;
    flow[a] += q; flow[b] -= q;
  }
  const rimG = c.lidClosed ? 8 : 2;
  {
    const q1 = rimG * (Tw[M] - Tw[0]) * dt;
    flow[0] += q1; flow[M] -= q1;
    const q2 = rimG * (Tw[M + L - 1] - Tw[M - 1]) * dt;
    flow[M - 1] += q2; flow[M + L - 1] -= q2;
  }
  const s = f.setting;
  for (let k = 0; k < M + L; k++) {
    let P = 0;
    const exp = c.cellFurnace[k];
    if (exp > 0 && s > 0) {
      const Tf = amb + s * (f.maxFlame - amb);
      P = f.heatPower * exp * Math.max(0, Tf - Tw[k]);
    } else if (exp > 0 && s < 0) {
      const Tc = amb + -s * (f.minCool - amb);
      P = f.coolPower * exp * Math.min(0, Tc - Tw[k]);
    }
    const lidCell = k >= M;
    const h = lidCell ? (c.lidClosed ? HAMB_LID : 3) : HAMB;
    const loss = h * (amb - Tw[k]);
    sim.energyIn += P * dt;
    sim.energyOut -= loss * dt;
    flow[k] += (P + loss) * dt;
  }
  for (let k = 0; k < M + L; k++) Tw[k] += flow[k] / Cw[k];
}
