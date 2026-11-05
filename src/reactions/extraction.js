// Continuous extraction in the particle world (the model is in
// alchemy/extraction.js).
//
// Every other step, wherever a raw catalog ingredient shares a particle with
// liquid solvent of its class (water or spirit for hydrosoluble magic, oil
// for liposoluble), part of it turns into its dissolved extract — volume for
// volume, so matter and magic are conserved exactly. The pace is the
// ingredient's own rate at that particle's temperature, raised by stirring
// and slowed in an emulsion; the extracted share of the whole batch of that
// ingredient (φ, over the cauldron) never passes the ceiling Y(T) of the
// particle's temperature, and nothing ever goes back. A solvent can hold at
// most its own volume of extract.
//
// Whole pieces (rigid solids) have no solvent inside them: where they touch
// liquid of their class, the extract passes into the neighbour and an equal
// volume of that solvent soaks into the piece, at a small fraction of the
// ground rate (grinding matters). Frozen solvent extracts nothing.
//
// Above its combustion threshold the unextracted matter chars into soot: its
// remaining magic is lost. Extracts and solvents never burn.

import { MAX_SPECIES } from './species.js';
import { PHASE } from '../simulation/constants.js';
import { SOLVENT_CAPACITY, WHOLE_FACTOR, EMULSION_FACTOR, extractIdOf } from '../alchemy/extraction.js';
import { isFrozenGrain } from '../simulation/phase.js';

const { SOLID, GAS } = PHASE;
const S = MAX_SPECIES;
/** char rate (1/s) just past the threshold */
const CHAR_RATE = 0.35;

/** per-slot scratch */
const tot = new Float64Array(S);
const grpRaw = new Float64Array(S);
const grpExt = new Float64Array(S);
const grpOf = new Int16Array(S);

/**
 * Rate factor from stirring (0.4 at rest, 1 well stirred).
 * @param {number} agit
 */
export function agitFactor(agit) {
  return 0.4 + 0.6 * Math.min(1, agit * 2.5);
}

export class ExtractionSystem {
  /** @param {import('../simulation/world.js').Simulation} sim */
  constructor(sim) {
    this.sim = sim;
    /** total volume extracted (particles) and charred */
    this.extracted = 0;
    this.charred = 0;
    /** hottest temperature each raw ingredient was seen at without charring, and coolest seen charring (°C, by base id) */
    /** @type {Record<string, number>} */ this.safeSeen = {};
    /** @type {Record<string, number>} */ this.charSeen = {};
    this._lastChar = -99;
  }

  /** Resolve (lazily) the extract slot of raw slot s. Returns -1 if unavailable. @param {number} s */
  _ext(s) {
    const sp = this.sim.species;
    let x = sp.exSlot[s];
    if (x >= 0) return x;
    const def = sp.defs[s];
    if (!def) return -1;
    const ed = this.sim.lookup(extractIdOf(def.id));
    if (!ed) return -1;
    x = this.sim.slotFor(ed);
    if (x >= 0) sp.exSlot[s] = x;
    return x;
  }

  /** @param {number} dt */
  step(dt) {
    const sim = this.sim, sp = sim.species;
    if (sp.extractables <= 0) return;
    const p = sim.p, comp = p.comp, n = p.count, ns = sp.count;
    // ---- the batch's extracted share per ingredient (plain and awakened forms together)
    tot.fill(0);
    for (let i = 0; i < n; i++) {
      const off = i * S;
      for (let s = 0; s < ns; s++) { const f = comp[off + s]; if (f > 0) tot[s] += f; }
    }
    grpRaw.fill(0); grpExt.fill(0); grpOf.fill(-1);
    for (let s = 0; s < ns; s++) {
      if (!sp.exCls[s] || !sp.defs[s]) continue;
      const d = /** @type {any} */ (sp.defs[s]);
      const base = d.base || d.id;
      // group = the lowest slot sharing the base id
      let g = s;
      for (let q = 0; q < s; q++) {
        const dq = /** @type {any} */ (sp.defs[q]);
        if (dq && sp.exCls[q] && (dq.base || dq.id) === base) { g = grpOf[q]; break; }
      }
      grpOf[s] = g;
      grpRaw[g] += tot[s];
      const x = sp.exSlot[s];
      if (x >= 0) grpExt[g] += tot[x];
      else if (tot[s] > 0) {
        // the extract may be present already (an old brew, a poured-back bottle)
        const xd = sim.lookup(extractIdOf(d.id));
        const xs = xd ? sp.slotOf.get(xd.id) : undefined;
        if (xs !== undefined) { sp.exSlot[s] = xs; grpExt[g] += tot[xs]; }
      }
    }
    // ---- particle by particle
    for (let i = 0; i < n; i++) {
      const ph = p.phase[i];
      if (ph === GAS) continue;
      const off = i * S;
      let hasRaw = false;
      for (let s = 0; s < ns; s++) if (sp.exCls[s] && comp[off + s] > 1e-6) { hasRaw = true; break; }
      if (!hasRaw) continue;
      const T = p.temp[i];
      // charring of the unextracted matter
      let charred = false;
      for (let s = 0; s < ns; s++) {
        if (!sp.exCls[s]) continue;
        const f = comp[off + s];
        if (f <= 1e-6) continue;
        const d = /** @type {any} */ (sp.defs[s]);
        const base = d.base || d.id;
        if (T > sp.exComb[s]) {
          const a = sp.ashSlot[s];
          if (a < 0) continue;
          const k = CHAR_RATE * (1 + (T - sp.exComb[s]) / 40);
          const dv = f * (1 - Math.exp(-k * dt));
          comp[off + s] -= dv;
          comp[off + a] += dv;
          grpRaw[grpOf[s]] -= dv;
          this.charred += dv;
          p.burn[i] = Math.min(1, p.burn[i] + 0.25);
          p.dirty[i] = 1;
          charred = true;
          if (!(this.charSeen[base] <= T)) this.charSeen[base] = Math.round(T);
        } else if (!(this.safeSeen[base] >= T)) this.safeSeen[base] = Math.round(T);
      }
      if (charred && sim.time - this._lastChar > 1.5) {
        this._lastChar = sim.time;
        sim.emit({ type: 'char', x: p.x[i], y: p.y[i], temp: T });
      }
      if (ph === SOLID) {
        if (p.whole[i] > 0.3) this._contact(i, dt);
        continue;
      }
      if (isFrozenGrain(sim, i)) continue;
      // the liquid this particle holds, by class
      let Lh = 0, Ll = 0, Xh = 0, Xl = 0, em = 0;
      for (let s = 0; s < ns; s++) {
        const f = comp[off + s];
        if (f <= 0) continue;
        const sc = sp.solvCls[s];
        if (sc === 1) Lh += f; else if (sc === 2) Ll += f;
        const ec = sp.extCls[s];
        if (ec === 1) Xh += f; else if (ec === 2) Xl += f;
        em += f * sp.emul[s];
      }
      if (Lh < 0.02 && Ll < 0.02) continue;
      // an emulsion (both phases bound together in one particle) extracts badly
      const emulsified = Math.min(Lh + Xh, Ll + Xl) > 0.04 && em > 0.002;
      const mf = agitFactor(p.agit[i]) * (emulsified ? EMULSION_FACTOR : 1);
      let capH = SOLVENT_CAPACITY * (Lh + Xh) - Xh, capL = SOLVENT_CAPACITY * (Ll + Xl) - Xl;
      for (let s = 0; s < ns; s++) {
        const c = sp.exCls[s];
        if (!c) continue;
        const f = comp[off + s];
        if (f <= 1e-6) continue;
        if ((c === 1 ? Lh : Ll) < 0.02) continue;
        const cap = c === 1 ? capH : capL;
        if (cap <= 1e-6) continue;
        const g = grpOf[s];
        const all = grpRaw[g] + grpExt[g];
        const phi = all > 1e-9 ? grpExt[g] / all : 0;
        const Y = yieldOf(sp, s, T);
        const drive = Y - phi;
        if (drive <= 1e-4) continue;
        const k = sp.exK20[s] * Math.pow(2, (Math.max(-80, Math.min(400, T)) - 20) / sp.exQ[s]) * mf;
        let dv = (f * (1 - Math.exp(-k * dt)) * drive) / Math.max(0.02, 1 - phi);
        if (dv > f) dv = f;
        if (dv > cap) dv = cap;
        // the batch must not pass its ceiling within one step
        if (dv > drive * all) dv = drive * all;
        if (dv < 1e-8) continue;
        const x = this._ext(s);
        if (x < 0) continue;
        comp[off + s] -= dv;
        comp[off + x] += dv;
        grpRaw[g] -= dv;
        grpExt[g] += dv;
        if (c === 1) capH -= dv; else capL -= dv;
        this.extracted += dv;
        sim.compChange[i] += dv;
        if (sim.compChange[i] > 0.004) { sim.compChange[i] = 0; p.dirty[i] = 1; }
      }
    }
  }

  /**
   * A whole piece (rigid solid particle i) gives its magic to the liquid of
   * its class touching it; that liquid soaks into the piece in exchange.
   * @param {number} i @param {number} dt
   */
  _contact(i, dt) {
    const sim = this.sim, p = sim.p, sp = sim.species, comp = p.comp, ns = sp.count;
    const oi = i * S;
    const R2 = 0.0144;
    sim.grid.query(p.x[i], p.y[i], 0.12, (j) => {
      if (j === i) return;
      const ph = p.phase[j];
      if (ph === SOLID || ph === GAS) return;
      const dx = p.x[j] - p.x[i], dy = p.y[j] - p.y[i];
      if (dx * dx + dy * dy > R2) return;
      const oj = j * S;
      for (let s = 0; s < ns; s++) {
        const c = sp.exCls[s];
        if (!c) continue;
        const f = comp[oi + s];
        if (f <= 1e-6) continue;
        let L = 0, X = 0;
        for (let q = 0; q < ns; q++) {
          if (sp.solvCls[q] === c) L += comp[oj + q];
          if (sp.extCls[q] === c) X += comp[oj + q];
        }
        if (L < 0.05) continue;
        const cap = SOLVENT_CAPACITY * (L + X) - X;
        if (cap <= 1e-6) continue;
        const T = 0.5 * (p.temp[i] + p.temp[j]);
        const Y = yieldOf(sp, s, T);
        const phi = this._phi(s);
        const drive = Y - phi;
        if (drive <= 1e-4) continue;
        const k = sp.exK20[s] * Math.pow(2, (Math.max(-80, Math.min(400, T)) - 20) / sp.exQ[s]) * WHOLE_FACTOR * (0.4 + 0.6 * Math.min(1, p.agit[j] * 2.5));
        let dv = (f * (1 - Math.exp(-k * dt)) * drive) / Math.max(0.02, 1 - phi);
        dv = Math.min(dv, f, cap, L * 0.5);
        if (dv < 1e-8) continue;
        const x = this._ext(s);
        if (x < 0) continue;
        // solvent from j into i (in j's proportions), extract from i into j
        const kL = dv / L;
        for (let q = 0; q < ns; q++) {
          if (sp.solvCls[q] !== c) continue;
          const d = comp[oj + q] * kL;
          comp[oj + q] -= d;
          comp[oi + q] += d;
        }
        comp[oi + s] -= dv;
        comp[oj + x] += dv;
        this.extracted += dv;
        p.dirty[i] = 1; p.dirty[j] = 1;
      }
    });
  }

  /** Extracted share of the ingredient in slot s over the cauldron (slow path, for contacts). @param {number} s */
  _phi(s) {
    const g = grpOf[s];
    if (g < 0) return 0;
    const all = grpRaw[g] + grpExt[g];
    return all > 1e-9 ? grpExt[g] / all : 0;
  }
}

/** Ceiling at T for slot s. @param {import('./species.js').SpeciesTable} sp @param {number} s @param {number} T */
function yieldOf(sp, s, T) {
  const y = 1 - ((1 - sp.exYmin[s]) * (T - sp.exTfull[s])) / sp.exSpan[s];
  return y > 1 ? 1 : y < sp.exYmin[s] ? sp.exYmin[s] : y;
}

/**
 * What the cauldron holds of each extractable ingredient: how much of it is
 * extracted, its ceiling at the brew's mean temperature, and whether it is
 * frozen, emulsified or burning. For the brew panel.
 * @param {import('../simulation/world.js').Simulation} sim
 */
export function extractionReport(sim) {
  const sp = sim.species, p = sim.p, n = p.count, ns = sp.count;
  /** @type {Map<string, {id:string, raw:number, ext:number, T:number, w:number, frozen:number, cls:number}>} */
  const by = new Map();
  let liquidT = 0, liquidN = 0, frozen = 0, cond = 0, emulsified = 0, hyd = 0, lip = 0, alcohol = 0, emul = 0;
  for (let i = 0; i < n; i++) {
    if (p.phase[i] === GAS) continue;
    cond++;
    const off = i * S;
    const isFrozen = p.phase[i] === SOLID && p.whole[i] < 0.3;
    if (isFrozen) frozen++;
    else { liquidT += p.temp[i]; liquidN++; }
    let h = 0, l = 0, e = 0;
    for (let s = 0; s < ns; s++) {
      const f = p.comp[off + s];
      if (f <= 0) continue;
      if (sp.solvCls[s] === 1 || sp.extCls[s] === 1) h += f;
      if (sp.solvCls[s] === 2 || sp.extCls[s] === 2) l += f;
      if (sp.alcohol[s]) alcohol += f;
      e += f * sp.emul[s];
      let key = null, raw = 0, ext = 0;
      const d = /** @type {any} */ (sp.defs[s]);
      if (!d) continue;
      if (sp.exCls[s]) { key = d.base || d.id; raw = f; } else if (sp.extCls[s] && d.extractOf) { key = d.extractOf; ext = f; }
      if (!key) continue;
      let g = by.get(key);
      if (!g) { g = { id: key, raw: 0, ext: 0, T: 0, w: 0, frozen: 0, cls: sp.exCls[s] || sp.extCls[s] }; by.set(key, g); }
      g.raw += raw; g.ext += ext; g.T += p.temp[i] * f; g.w += f;
      if (isFrozen) g.frozen += f;
    }
    hyd += h; lip += l; emul += e;
    if (Math.min(h, l) > 0.04 && e > 0.002) emulsified++;
  }
  const meanT = liquidN ? liquidT / liquidN : 20;
  const items = [...by.values()].map((g) => {
    const def = sim.lookup(g.id);
    const pr = def && def.extraction;
    const share = g.raw + g.ext > 0 ? g.ext / (g.raw + g.ext) : 0;
    const T = g.w > 0 ? g.T / g.w : meanT;
    const ceiling = pr ? Math.max(pr.Ymin, Math.min(1, 1 - ((1 - pr.Ymin) * (T - pr.Tfull)) / pr.span)) : 1;
    return { id: g.id, name: def ? def.name : g.id, cls: g.cls === 2 ? 'lipo' : 'hydro', raw: g.raw, ext: g.ext, share, ceiling, frozen: g.raw > 0 && g.frozen >= g.raw * 0.8 };
  });
  return {
    items, meanT, frozen: cond ? frozen / cond : 0,
    emulsified: cond ? emulsified / cond : 0,
    phases: { hydro: hyd, lipo: lip, emulsifier: emul },
    alcohol: cond ? alcohol / cond : 0,
  };
}
