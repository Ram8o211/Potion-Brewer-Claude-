// Local chemistry. Reactions only proceed where their reactants actually
// coexist — inside one particle's composition (i.e. where diffusion has
// mixed them) or across a touching pair for interface reactions — so they
// begin at contact fronts and spread as mixing and heat spread. Heat of
// reaction warms the reacting particle, which conducts to neighbours and
// can accelerate them in turn (thermal runaway is possible and local).
//
// Rule kinds:
//   mix        A + B → products   (both in the same particle)
//   contact    A | B → products   (A in one particle touching B in another)
//   decompose  A → products       (single reactant above a temperature)
// Combustion is built in: flammable species above their ignition point, at
// an exposed surface and with oxygen available, burn into ash (solids) or
// smoke (liquids), releasing heat.

import { MAX_SPECIES } from './species.js';
import { PHASE } from '../simulation/constants.js';

const { GAS, SOLID } = PHASE;

/**
 * @typedef {Object} ReactionRule
 * @property {string} id
 * @property {string} name
 * @property {'mix'|'contact'|'decompose'} kind
 * @property {string} a
 * @property {string|null} b
 * @property {number} ra
 * @property {number} rb
 * @property {{id:string, frac:number}[]} products
 * @property {number} minT
 * @property {number} maxT
 * @property {number} rate
 * @property {number} heat      J released per unit volume of reactants consumed (negative = endothermic)
 * @property {number} stir      agitation boost
 * @property {string} [description]
 * @property {string} [hint]
 */

export class ReactionSystem {
  /** @param {import('../simulation/world.js').Simulation} sim @param {ReactionRule[]} rules */
  constructor(sim, rules) {
    this.sim = sim;
    this.rules = rules;
    /** @type {Record<string, number>} */
    this.lastEvent = {};
    /** total volume converted per rule */
    this.progress = /** @type {Record<string, number>} */ ({});
    this.burned = 0;
    this._acc = new Float32Array(MAX_SPECIES);
  }

  /** @param {ReactionRule[]} rules */
  setRules(rules) {
    this.rules = rules;
  }

  /** @param {string} id */
  needsSlot(id) {
    void id;
    return false;
  }

  /** @param {number} dt */
  step(dt) {
    const sim = this.sim, p = sim.p, sp = sim.species, S = MAX_SPECIES;
    const n = p.count;
    for (const rule of this.rules) {
      const sa = sp.slotOf.get(rule.a);
      if (sa === undefined) continue;
      let sb = -1;
      if (rule.b) {
        const t = sp.slotOf.get(rule.b);
        if (t === undefined) continue;
        sb = t;
      }
      if (rule.kind === 'contact') this._contact(rule, sa, sb, dt);
      else this._local(rule, sa, sb, dt);
    }
    this._combustion(dt);
    for (let i = 0; i < n; i++) if (p.burn[i] > 0) p.burn[i] *= 0.93;
    void S;
  }

  /** Resolve product slots, ensuring they exist. Returns null if table full. */
  _productSlots(rule) {
    const sim = this.sim;
    const out = [];
    for (const pr of rule.products) {
      const def = sim.lookup(pr.id);
      if (!def) return null;
      const s = sim.slotFor(def);
      if (s < 0) return null;
      out.push([s, pr.frac]);
    }
    return out;
  }

  _rateT(rule, T) {
    if (T < rule.minT || T > rule.maxT) return 0;
    return 1 + Math.min(3, (T - rule.minT) / 40);
  }

  _local(rule, sa, sb, dt) {
    const sim = this.sim, p = sim.p, S = MAX_SPECIES;
    let prods = null;
    const n = p.count;
    for (let i = 0; i < n; i++) {
      if (p.phase[i] === SOLID) continue;
      const off = i * S;
      const fa = p.comp[off + sa];
      if (fa < 0.004) continue;
      let lim = fa / rule.ra;
      if (sb >= 0) {
        const fb = p.comp[off + sb];
        if (fb < 0.004) continue;
        lim = Math.min(lim, fb / rule.rb);
      }
      const tf = this._rateT(rule, p.temp[i]);
      if (tf <= 0) continue;
      let ext = rule.rate * dt * tf * lim * (1 + rule.stir * Math.min(3, p.agit[i]));
      if (ext > lim) ext = lim;
      if (ext < 1e-6) continue;
      if (!prods) {
        prods = this._productSlots(rule);
        if (!prods) return;
      }
      const used = ext * (rule.ra + (sb >= 0 ? rule.rb : 0));
      p.comp[off + sa] -= ext * rule.ra;
      if (sb >= 0) p.comp[off + sb] -= ext * rule.rb;
      for (const [s, f] of prods) p.comp[off + s] += used * f;
      p.temp[i] += (rule.heat * used) / p.rhoCp[i];
      p.dirty[i] = 1;
      p.wet[i] = Math.min(1, p.wet[i] + 0.3);
      this.progress[rule.id] = (this.progress[rule.id] || 0) + used;
      this._event(rule, i);
    }
  }

  _contact(rule, sa, sb, dt) {
    const sim = this.sim, p = sim.p, S = MAX_SPECIES;
    const { pairI, pairJ, pairCount } = sim.grid;
    let prods = null;
    for (let k = 0; k < pairCount; k++) {
      let i = pairI[k], j = pairJ[k];
      if (p.phase[i] === GAS || p.phase[j] === GAS) continue;
      let fa = p.comp[i * S + sa], fb = p.comp[j * S + sb];
      if (fa < 0.004 || fb < 0.004) {
        // try the other orientation
        const fa2 = p.comp[j * S + sa], fb2 = p.comp[i * S + sb];
        if (fa2 < 0.004 || fb2 < 0.004) continue;
        const t = i; i = j; j = t;
        fa = fa2; fb = fb2;
      }
      const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
      const r2 = dx * dx + dy * dy;
      if (r2 > 0.0144) continue;
      const T = 0.5 * (p.temp[i] + p.temp[j]);
      const tf = this._rateT(rule, T);
      if (tf <= 0) continue;
      const lim = Math.min(fa / rule.ra, fb / rule.rb);
      let ext = rule.rate * dt * tf * lim * (1 + rule.stir * Math.min(3, Math.max(p.agit[i], p.agit[j])));
      if (ext > lim) ext = lim;
      if (ext < 1e-6) continue;
      if (!prods) {
        prods = this._productSlots(rule);
        if (!prods) return;
      }
      const ua = ext * rule.ra, ub = ext * rule.rb;
      p.comp[i * S + sa] -= ua;
      p.comp[j * S + sb] -= ub;
      for (const [s, f] of prods) {
        p.comp[i * S + s] += ua * f;
        p.comp[j * S + s] += ub * f;
      }
      p.temp[i] += (rule.heat * ua) / p.rhoCp[i];
      p.temp[j] += (rule.heat * ub) / p.rhoCp[j];
      p.dirty[i] = 1; p.dirty[j] = 1;
      p.wet[i] = Math.min(1, p.wet[i] + 0.3);
      p.wet[j] = Math.min(1, p.wet[j] + 0.3);
      this.progress[rule.id] = (this.progress[rule.id] || 0) + ua + ub;
      this._event(rule, i);
    }
  }

  _event(rule, i) {
    const sim = this.sim;
    const last = this.lastEvent[rule.id];
    if (last !== undefined && sim.time - last < 2.5) return;
    this.lastEvent[rule.id] = sim.time;
    sim.emit({ type: 'reaction', rule: rule.id, name: rule.name, x: sim.p.x[i], y: sim.p.y[i], heat: rule.heat });
  }

  _combustion(dt) {
    const sim = this.sim, p = sim.p, sp = sim.species, S = MAX_SPECIES;
    const n = p.count;
    const n0 = sim.n0;
    const lid = sim.cauldron.lidClosed;
    for (let i = 0; i < n; i++) {
      if (p.flam[i] < 0.03 || p.temp[i] < p.ign[i]) continue;
      if (p.phase[i] === GAS) continue;
      // fire needs air: only exposed surfaces burn, and only with oxygen left
      const exposed = sim.dens[i] < 0.78 * n0 || sim.nGas[i] > 0;
      if (!exposed || sim.oxygen < 0.04) continue;
      const off = i * S;
      const rate = 0.55 * dt * Math.min(1, sim.oxygen * 1.5) * (1 + (p.temp[i] - p.ign[i]) / 150);
      let heat = 0, burnt = 0;
      for (let s = 0; s < sp.count; s++) {
        const fl = sp.flam[s];
        if (fl <= 0) continue;
        const f = p.comp[off + s];
        if (f <= 0) continue;
        const target = sp.isPowder[s] ? sp.ashSlot[s] : sp.smokeSlot[s];
        if (target < 0) continue;
        const amt = Math.min(f, f * fl * rate + 0.002 * dt * 60);
        p.comp[off + s] -= amt;
        p.comp[off + target] += amt;
        heat += amt * sp.combHeat[s];
        burnt += amt;
      }
      if (burnt <= 0) continue;
      p.temp[i] += heat / p.rhoCp[i];
      p.burn[i] = Math.min(1, p.burn[i] + 0.35 + burnt * 4);
      p.dirty[i] = 1;
      p.sleep[i] = 0;
      this.burned += burnt;
      if (lid) sim.oxygen = Math.max(0, sim.oxygen - burnt * 0.012);
      const last = this.lastEvent.__fire;
      if (last === undefined || sim.time - last > 1.5) {
        this.lastEvent.__fire = sim.time;
        sim.emit({ type: 'ignite', x: p.x[i], y: p.y[i], species: sp.defs[maxFlamSlot(sim, i)]?.id });
      }
    }
  }
}

function maxFlamSlot(sim, i) {
  const sp = sim.species, off = i * MAX_SPECIES;
  let best = 0, bf = -1;
  for (let s = 0; s < sp.count; s++) {
    const v = sim.p.comp[off + s] * sp.flam[s];
    if (v > bf) { bf = v; best = s; }
  }
  return best;
}
