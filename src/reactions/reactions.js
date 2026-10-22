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
// an exposed surface (or as vapour) and with oxygen available, burn into ash
// (solids) or smoke (liquids), releasing heat into the flame and the matter
// around it.

import { MAX_SPECIES } from './species.js';
import { PHASE } from '../simulation/constants.js';
import { awakenedId } from '../alchemy/arcane.js';
import { awakeSlot } from '../simulation/arcane.js';

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
 * @property {boolean} [wet]    only proceeds in solution (steeping, acid–base): scaled by the particle's dissolved share
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
    /** reagent slots of the rule being run (base and awakened forms) */
    this._pools = { sa: -1, saw: -1, sb: -1, sbw: -1, magA: false, magB: false };
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
    const sim = this.sim, p = sim.p, sp = sim.species;
    const n = p.count;
    for (const rule of this.rules) {
      // a reagent's awakened form (alchemy/arcane.js) reacts like the reagent
      const sa = slot(sp, rule.a), saw = slot(sp, awakenedId(rule.a));
      if (sa < 0 && saw < 0) continue;
      let sb = -1, sbw = -1;
      if (rule.b) {
        sb = slot(sp, rule.b);
        sbw = slot(sp, awakenedId(rule.b));
        if (sb < 0 && sbw < 0) continue;
      }
      const pools = this._pools;
      pools.sa = sa; pools.saw = saw; pools.sb = sb; pools.sbw = sbw;
      pools.magA = saw >= 0 || (sa >= 0 && sp.arcMag[sa] === 1);
      pools.magB = sbw >= 0 || (sb >= 0 && sp.arcMag[sb] === 1);
      if (rule.kind === 'contact') this._contact(rule, dt);
      else this._local(rule, dt);
    }
    this._combustion(dt);
    for (let i = 0; i < n; i++) if (p.burn[i] > 0) p.burn[i] *= 0.93;
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

  /**
   * Add `used` volume of products to particle offset `off`; the share `q`
   * that came from awakened magic is produced in awakened form.
   * @param {number[][]} prods @param {number} off @param {number} used @param {number} q
   */
  _yield(prods, off, used, q) {
    const p = this.sim.p;
    for (const [s, f] of prods) {
      const v = used * f;
      const a = q > 0 ? awakeSlot(this.sim, s) : -1;
      if (a >= 0) {
        p.comp[off + s] += v * (1 - q);
        p.comp[off + a] += v * q;
      } else p.comp[off + s] += v;
    }
  }

  _rateT(rule, T) {
    if (T < rule.minT || T > rule.maxT) return 0;
    return 1 + Math.min(3, (T - rule.minT) / 40);
  }

  _local(rule, dt) {
    const sim = this.sim, p = sim.p, S = MAX_SPECIES, comp = p.comp;
    const { sa, saw, sb, sbw, magA, magB } = this._pools;
    const hasB = sb >= 0 || sbw >= 0;
    let prods = null;
    const n = p.count;
    for (let i = 0; i < n; i++) {
      if (p.phase[i] === SOLID) continue;
      const off = i * S;
      const fa = pool(comp, off, sa, saw);
      if (fa < 0.004) continue;
      let lim = fa / rule.ra;
      let fb = 0;
      if (hasB) {
        fb = pool(comp, off, sb, sbw);
        if (fb < 0.004) continue;
        lim = Math.min(lim, fb / rule.rb);
      }
      const tf = this._rateT(rule, p.temp[i]);
      if (tf <= 0) continue;
      if (rule.wet) {
        // only what is actually dissolved reacts; dry grains and pastes wait
        const sol = 1 - p.gran[i];
        if (sol < 0.5) continue;
        lim *= sol;
      }
      let ext = rule.rate * dt * tf * lim * (1 + rule.stir * Math.min(3, p.agit[i]));
      if (ext > lim) ext = lim;
      if (ext < 1e-6) continue;
      if (!prods) {
        prods = this._productSlots(rule);
        if (!prods) return;
      }
      const ua = ext * rule.ra, ub = hasB ? ext * rule.rb : 0;
      const qa = take(comp, off, sa, saw, ua);
      const qb = hasB ? take(comp, off, sb, sbw, ub) : 0;
      const used = ua + ub;
      this._yield(prods, off, used, awakeShare(ua, qa, magA, ub, qb, magB));
      p.temp[i] += (rule.heat * used) / p.rhoCp[i];
      p.dirty[i] = 1;
      p.wet[i] = Math.min(1, p.wet[i] + 0.3);
      this.progress[rule.id] = (this.progress[rule.id] || 0) + used;
      this._event(rule, i);
    }
  }

  _contact(rule, dt) {
    const sim = this.sim, p = sim.p, S = MAX_SPECIES, comp = p.comp;
    const { sa, saw, sb, sbw, magA, magB } = this._pools;
    const { pairI, pairJ, pairCount } = sim.grid;
    let prods = null;
    for (let k = 0; k < pairCount; k++) {
      let i = pairI[k], j = pairJ[k];
      if (p.phase[i] === GAS || p.phase[j] === GAS) continue;
      let fa = pool(comp, i * S, sa, saw), fb = pool(comp, j * S, sb, sbw);
      if (fa < 0.004 || fb < 0.004) {
        // try the other orientation
        const fa2 = pool(comp, j * S, sa, saw), fb2 = pool(comp, i * S, sb, sbw);
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
      // acid–base and similar contact chemistry needs a liquid at the interface
      if (rule.wet && p.gran[i] > 0.7 && p.gran[j] > 0.7) continue;
      const lim = Math.min(fa / rule.ra, fb / rule.rb);
      let ext = rule.rate * dt * tf * lim * (1 + rule.stir * Math.min(3, Math.max(p.agit[i], p.agit[j])));
      if (ext > lim) ext = lim;
      if (ext < 1e-6) continue;
      if (!prods) {
        prods = this._productSlots(rule);
        if (!prods) return;
      }
      const ua = ext * rule.ra, ub = ext * rule.rb;
      const qa = take(comp, i * S, sa, saw, ua);
      const qb = take(comp, j * S, sb, sbw, ub);
      const q = awakeShare(ua, qa, magA, ub, qb, magB);
      this._yield(prods, i * S, ua, q);
      this._yield(prods, j * S, ub, q);
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
    const c = sim.cauldron;
    for (let i = 0; i < n; i++) {
      if (p.flam[i] < 0.03) continue;
      if (p.temp[i] < p.ign[i]) {
        // hot-surface ignition: glowing iron above the liquid line lights the
        // fuel (and its vapour) touching it; the pilot heat comes from the wall
        if (sim.touchWall[i] !== 1 || sim.oxygen < 0.04 || sim.dens[i] >= 0.78 * n0) continue;
        const cell = c.wallCellAt(p.x[i], p.y[i]);
        if (cell < 0 || c.cellT[cell] < p.ign[i] + 60) continue;
        const Q = (p.ign[i] - p.temp[i]) * p.rhoCp[i];
        p.temp[i] = p.ign[i];
        c.cellT[cell] -= Q / c.cellC[cell];
      }
      const gas = p.phase[i] === GAS;
      // fire needs air: only exposed surfaces (or vapour, which is already in
      // the air) burn, and only while oxygen lasts
      const exposed = gas || sim.dens[i] < 0.78 * n0 || sim.nGas[i] > 0;
      if (!exposed || sim.oxygen < 0.04) continue;
      const off = i * S;
      const rate = (gas ? 1.6 : 0.28) * dt * Math.min(1, sim.oxygen * 1.5) * (1 + Math.min(1.5, (p.temp[i] - p.ign[i]) / 150));
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
      this._flameHeat(i, heat);
      p.burn[i] = Math.min(1, p.burn[i] + 0.35 + burnt * 4);
      p.dirty[i] = 1;
      p.sleep[i] = 0;
      this.burned += burnt;
      if (lid) sim.oxygen = Math.max(0, sim.oxygen - burnt * 0.03);
      const last = this.lastEvent.__fire;
      if (last === undefined || sim.time - last > 1.5) {
        this.lastEvent.__fire = sim.time;
        sim.emit({ type: 'ignite', x: p.x[i], y: p.y[i], species: sp.defs[maxFlamSlot(sim, i)]?.id });
      }
    }
  }

  /**
   * A flame does not keep its heat to itself: part of it radiates onto the
   * matter around it (most usefully the fuel surface underneath), which is
   * how a fire creeps across a warm pool instead of flaring and dying.
   * Energy is conserved — the shares always add up to `heat`.
   * @param {number} i @param {number} heat
   */
  _flameHeat(i, heat) {
    const sim = this.sim, p = sim.p;
    const R = 0.16, R2 = R * R;
    const x = p.x[i], y = p.y[i];
    let wsum = 0;
    const nb = this._nb || (this._nb = { idx: new Int32Array(64), w: new Float32Array(64), n: 0 });
    nb.n = 0;
    sim.grid.query(x, y, R, (j) => {
      if (j === i || nb.n >= 64) return;
      const dx = p.x[j] - x, dy = p.y[j] - y;
      const d2 = dx * dx + dy * dy;
      if (d2 >= R2) return;
      // flames rise, so matter beside and below the flame is reached by radiation
      // while the hot plume carries the rest upward
      let w = 1 - Math.sqrt(d2) / R;
      if (p.phase[j] !== GAS) w *= 1.5;
      nb.idx[nb.n] = j; nb.w[nb.n] = w; nb.n++;
      wsum += w;
    });
    const share = wsum > 0 ? 0.6 : 0;
    p.temp[i] += (heat * (1 - share)) / p.rhoCp[i];
    if (share > 0) {
      const k = (heat * share) / wsum;
      for (let a = 0; a < nb.n; a++) {
        const j = nb.idx[a];
        p.temp[j] += (k * nb.w[a]) / p.rhoCp[j];
        if (p.sleep[j]) p.sleep[j] = 0;
      }
    }
  }
}

/** Slot of a species id, or -1. @param {import('./species.js').SpeciesTable} sp @param {string} id */
function slot(sp, id) {
  const s = sp.slotOf.get(id);
  return s === undefined ? -1 : s;
}

/** Volume of a reagent in a particle, counting its awakened form. */
function pool(comp, off, s, sw) {
  return (s >= 0 ? comp[off + s] : 0) + (sw >= 0 ? comp[off + sw] : 0);
}

/**
 * Consume `amt` of a reagent from a particle, from its plain and awakened
 * forms in proportion. Returns the awakened share consumed.
 */
function take(comp, off, s, sw, amt) {
  const a = s >= 0 ? comp[off + s] : 0, w = sw >= 0 ? comp[off + sw] : 0;
  const tot = a + w;
  if (tot <= 0) return 0;
  const q = w / tot;
  if (s >= 0) comp[off + s] = Math.max(0, a - amt * (1 - q));
  if (sw >= 0) comp[off + sw] = Math.max(0, w - amt * q);
  return q;
}

/** Share of the magical reagents consumed that was awakened. */
function awakeShare(ua, qa, magA, ub, qb, magB) {
  const tot = (magA ? ua : 0) + (magB ? ub : 0);
  if (tot <= 0) return 0;
  return ((magA ? ua * qa : 0) + (magB ? ub * qb : 0)) / tot;
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
