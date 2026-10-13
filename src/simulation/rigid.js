// Rigid bodies made of frozen material.
//
// Particles that freeze join neighbouring frozen particles (union-find over
// contact pairs). Each connected component is a rigid body solved with
// shape matching (Müller et al. 2005): every iteration the particles are
// moved to the best-fit rigid transform of their rest shape, so a block
// moves, falls and collides as one coherent body. The rest shape is the
// configuration at the moment of freezing, so blocks keep the shape the
// liquid had. Melting or crushing removes particles; components are then
// re-evaluated and a cracked block splits into separate bodies.

import { PHASE } from './constants.js';

const MAX_GROUPS = 2048;
/** neighbour distance that bonds frozen particles */
const BOND = 0.135;
export const FRESH = -2;

export class RigidBodies {
  /** @param {import('./world.js').Simulation} sim */
  constructor(sim) {
    this.sim = sim;
    this.start = new Int32Array(MAX_GROUPS + 1);
    this.members = new Int32Array(sim.capacity);
    this.dirty = new Uint8Array(MAX_GROUPS);
    this.used = new Uint8Array(MAX_GROUPS);
    this.anyDirty = false;
    this.parent = new Int32Array(sim.capacity);
    this.active = /** @type {number[]} */ ([]);
  }

  reset() {
    this.dirty.fill(0);
    this.used.fill(0);
    this.anyDirty = false;
    this.active = [];
  }

  /** @param {number} g */
  markDirty(g) {
    if (g >= 0 && g < MAX_GROUPS) this.dirty[g] = 1;
    this.anyDirty = true;
  }

  alloc() {
    for (let g = 0; g < MAX_GROUPS; g++) {
      if (!this.used[g]) {
        this.used[g] = 1;
        return g;
      }
    }
    return -1;
  }

  /** Recompute rest offsets of a group from current positions. @param {number[]} idx */
  setRest(idx) {
    const p = this.sim.p;
    let cx = 0, cy = 0, m = 0;
    for (const i of idx) {
      const w = p.rho[i];
      cx += p.x[i] * w; cy += p.y[i] * w; m += w;
    }
    cx /= m; cy /= m;
    for (const i of idx) {
      p.restX[i] = p.x[i] - cx;
      p.restY[i] = p.y[i] - cy;
    }
  }

  /** Resolve freshly frozen particles / broken groups, then build member lists. */
  update() {
    const p = this.sim.p, n = p.count;
    let fresh = false;
    for (let i = 0; i < n; i++) {
      if (p.group[i] === FRESH) { fresh = true; break; }
    }
    if (fresh || this.anyDirty) this._topology();
    // counting sort of members by group
    const start = this.start;
    start.fill(0);
    this.used.fill(0);
    for (let i = 0; i < n; i++) {
      const g = p.group[i];
      if (g >= 0) { start[g + 1]++; this.used[g] = 1; }
    }
    for (let g = 0; g < MAX_GROUPS; g++) start[g + 1] += start[g];
    const cur = this._cur || (this._cur = new Int32Array(MAX_GROUPS));
    cur.set(start.subarray(0, MAX_GROUPS));
    for (let i = 0; i < n; i++) {
      const g = p.group[i];
      if (g >= 0) this.members[cur[g]++] = i;
    }
    this.active.length = 0;
    for (let g = 0; g < MAX_GROUPS; g++) if (start[g + 1] - start[g] >= 2) this.active.push(g);
  }

  _find(i) {
    const par = this.parent;
    while (par[i] !== i) {
      par[i] = par[par[i]];
      i = par[i];
    }
    return i;
  }

  _topology() {
    const sim = this.sim, p = sim.p, n = p.count;
    const par = this.parent;
    for (let i = 0; i < n; i++) par[i] = i;
    const { pairI, pairJ, pairCount } = sim.grid;
    const B2 = BOND * BOND;
    for (let k = 0; k < pairCount; k++) {
      const i = pairI[k], j = pairJ[k];
      if (p.phase[i] !== PHASE.SOLID || p.phase[j] !== PHASE.SOLID) continue;
      const gi = p.group[i], gj = p.group[j];
      // bonds exist inside a body, and between fresh ice and anything frozen it touches;
      // two separate blocks that merely touch do not fuse.
      if (!((gi === gj && gi >= 0) || gi === FRESH || gj === FRESH)) continue;
      const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
      if (dx * dx + dy * dy > B2) continue;
      const a = this._find(i), b = this._find(j);
      if (a !== b) par[a] = b;
    }
    /** @type {Map<number, number[]>} */
    const comps = new Map();
    for (let i = 0; i < n; i++) {
      if (p.phase[i] !== PHASE.SOLID) {
        p.group[i] = -1;
        continue;
      }
      const r = this._find(i);
      let arr = comps.get(r);
      if (!arr) comps.set(r, (arr = []));
      arr.push(i);
    }
    // larger pieces keep their identity
    const list = [...comps.values()].sort((a, b) => b.length - a.length);
    const claimed = new Uint8Array(MAX_GROUPS);
    const pending = [];
    for (const arr of list) {
      const counts = new Map();
      let hasFresh = false;
      for (const i of arr) {
        const g = p.group[i];
        if (g >= 0) counts.set(g, (counts.get(g) || 0) + 1);
        else hasFresh = true;
      }
      let best = -1, bc = 0;
      for (const [g, c] of counts) if (c > bc && !claimed[g]) { best = g; bc = c; }
      if (best < 0) { pending.push(arr); continue; }
      claimed[best] = 1;
      const changed = hasFresh || counts.size !== 1 || bc !== arr.length || this.dirty[best];
      if (changed) {
        for (const i of arr) p.group[i] = best;
        this.setRest(arr);
      }
    }
    let nextFree = 0;
    for (const arr of pending) {
      while (nextFree < MAX_GROUPS && claimed[nextFree]) nextFree++;
      if (nextFree >= MAX_GROUPS) break;
      claimed[nextFree] = 1;
      for (const i of arr) p.group[i] = nextFree;
      this.setRest(arr);
    }
    this.dirty.fill(0);
    this.anyDirty = false;
  }

  /** Shape-matching projection for every rigid body. */
  shapeMatch() {
    const p = this.sim.p;
    const xs = p.x, ys = p.y, rx = p.restX, ry = p.restY, rho = p.rho;
    const start = this.start, mem = this.members;
    for (const g of this.active) {
      const s0 = start[g], s1 = start[g + 1];
      let cx = 0, cy = 0, m = 0;
      for (let k = s0; k < s1; k++) {
        const i = mem[k];
        const w = rho[i];
        cx += xs[i] * w; cy += ys[i] * w; m += w;
      }
      cx /= m; cy /= m;
      let a00 = 0, a01 = 0, a10 = 0, a11 = 0;
      for (let k = s0; k < s1; k++) {
        const i = mem[k];
        const w = rho[i];
        const qx = xs[i] - cx, qy = ys[i] - cy;
        a00 += w * qx * rx[i]; a01 += w * qx * ry[i];
        a10 += w * qy * rx[i]; a11 += w * qy * ry[i];
      }
      const th = Math.atan2(a10 - a01, a00 + a11);
      const c = Math.cos(th), s = Math.sin(th);
      for (let k = s0; k < s1; k++) {
        const i = mem[k];
        xs[i] = cx + c * rx[i] - s * ry[i];
        ys[i] = cy + s * rx[i] + c * ry[i];
      }
    }
  }

  /** Number of rigid bodies with ≥2 particles. */
  bodyCount() {
    return this.active.length;
  }
}
