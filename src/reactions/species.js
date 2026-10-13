// Species table: maps the (unbounded) set of world materials onto a small
// fixed number of composition slots used inside one simulation. Every
// particle carries a volume-fraction vector over these slots.

import { rgbToOklab, srgbToLinear } from '../core/color.js';
import { volatilityOf } from '../materials/schema.js';

export const MAX_SPECIES = 16;
export const NO_BOIL = 1e6;

/** Property arrays indexed by slot. */
export class SpeciesTable {
  constructor() {
    const S = MAX_SPECIES;
    /** @type {(import('../materials/schema.js').MaterialDef|null)[]} */
    this.defs = new Array(S).fill(null);
    /** @type {Map<string, number>} */
    this.slotOf = new Map();
    this.count = 0; // highest used slot + 1
    const f = () => new Float32Array(S);
    this.density = f();
    this.gasDensity = f();
    this.lnVisc = f();
    this.viscTemp = f();
    this.compatA = f();
    this.compatB = f();
    this.conductivity = f();
    this.heatCap = f();
    this.melt = f();
    this.boil = f();
    this.latF = f();
    this.latV = f();
    this.expansion = f();
    this.flam = f();
    this.ignition = f();
    this.combHeat = f();
    this.reactivity = f();
    this.volatility = f();
    this.solubility = f();
    this.solTemp = f();
    this.binder = f();
    this.friction = f();
    this.hardness = f();
    this.glow = f();
    this.tint = f();
    this.opacity = f();
    this.labL = f();
    this.labA = f();
    this.labB = f();
    /** linear-light absorbance (Beer–Lambert) per unit concentration */
    this.absR = f();
    this.absG = f();
    this.absB = f();
    this.isPowder = new Uint8Array(S);
    this.aspects = new Float32Array(S * 4);
    /** slot of ash / smoke products for combustion (-1 none) */
    this.ashSlot = new Int16Array(S).fill(-1);
    this.smokeSlot = new Int16Array(S).fill(-1);
  }

  /**
   * Place a material in a specific slot (used when restoring saves so that
   * particle composition vectors keep their meaning).
   * @param {number} slot
   * @param {import('../materials/schema.js').MaterialDef} def
   * @param {(id:string)=>import('../materials/schema.js').MaterialDef|undefined} [lookup]
   */
  assign(slot, def, lookup) {
    if (this.defs[slot]) this.release(slot);
    const free = [];
    // temporarily occupy lower empty slots so ensure() lands on `slot`
    for (let s = 0; s < slot; s++) if (!this.defs[s]) { this.defs[s] = /** @type {any} */ ({ id: '__hold' + s }); free.push(s); }
    const got = this.ensure(def, undefined);
    for (const s of free) this.defs[s] = null;
    let c = 0;
    for (let s = 0; s < MAX_SPECIES; s++) if (this.defs[s]) c = s + 1;
    this.count = c;
    if (lookup) {
      if (def.ash) { const a = lookup(def.ash); if (a) { const as = this.slotOf.get(a.id); if (as !== undefined) this.ashSlot[got] = as; } }
      if (def.smoke) { const m = lookup(def.smoke); if (m) { const ms = this.slotOf.get(m.id); if (ms !== undefined) this.smokeSlot[got] = ms; } }
    }
    return got;
  }

  /**
   * Ensure a material has a slot. Returns slot index or -1 if table is full.
   * @param {import('../materials/schema.js').MaterialDef} def
   * @param {(id:string)=>import('../materials/schema.js').MaterialDef|undefined} [lookup]
   */
  ensure(def, lookup) {
    const existing = this.slotOf.get(def.id);
    if (existing !== undefined) return existing;
    let slot = this.defs.indexOf(null);
    if (slot < 0) return -1;
    this.defs[slot] = def;
    this.slotOf.set(def.id, slot);
    this.count = Math.max(this.count, slot + 1);
    this.density[slot] = def.density;
    this.gasDensity[slot] = def.gasDensity;
    this.lnVisc[slot] = Math.log(Math.max(0.2, def.viscosity));
    this.viscTemp[slot] = def.viscTemp;
    this.compatA[slot] = def.compat[0];
    this.compatB[slot] = def.compat[1];
    this.conductivity[slot] = def.conductivity;
    this.heatCap[slot] = def.heatCapacity;
    this.melt[slot] = def.melt;
    this.boil[slot] = isFinite(def.boil) ? def.boil : NO_BOIL;
    this.latF[slot] = def.latentFusion;
    this.latV[slot] = def.latentVapor;
    this.expansion[slot] = def.expansion;
    this.flam[slot] = def.flammability;
    this.ignition[slot] = def.ignition;
    this.combHeat[slot] = def.combustionHeat;
    this.reactivity[slot] = def.reactivity;
    this.volatility[slot] = volatilityOf(def);
    this.solubility[slot] = def.solubility;
    this.solTemp[slot] = def.solubilityTemp;
    this.binder[slot] = def.binder;
    this.friction[slot] = def.friction;
    this.hardness[slot] = def.hardness;
    this.glow[slot] = def.glow;
    this.tint[slot] = def.tint;
    this.opacity[slot] = def.opacity;
    const ab = absorbance(def);
    this.absR[slot] = ab[0];
    this.absG[slot] = ab[1];
    this.absB[slot] = ab[2];
    const lab = rgbToOklab(def.color[0], def.color[1], def.color[2]);
    this.labL[slot] = lab[0];
    this.labA[slot] = lab[1];
    this.labB[slot] = lab[2];
    this.isPowder[slot] = def.form === 'powder' || def.form === 'solid' ? 1 : 0;
    for (let k = 0; k < 4; k++) this.aspects[slot * 4 + k] = def.aspects[k] || 0;
    if (lookup) {
      if (def.ash) {
        const a = lookup(def.ash);
        if (a) this.ashSlot[slot] = this.ensure(a, lookup);
      }
      if (def.smoke) {
        const s = lookup(def.smoke);
        if (s) this.smokeSlot[slot] = this.ensure(s, lookup);
      }
    }
    return slot;
  }

  /** Free a slot that no particle references any more. @param {number} slot */
  release(slot) {
    const def = this.defs[slot];
    if (!def) return;
    this.slotOf.delete(def.id);
    this.defs[slot] = null;
    this.ashSlot[slot] = -1;
    this.smokeSlot[slot] = -1;
    for (let s = 0; s < MAX_SPECIES; s++) {
      if (this.ashSlot[s] === slot) this.ashSlot[s] = -1;
      if (this.smokeSlot[s] === slot) this.smokeSlot[s] = -1;
    }
    let c = 0;
    for (let s = 0; s < MAX_SPECIES; s++) if (this.defs[s]) c = s + 1;
    this.count = c;
  }

  /** @returns {{id:string, slot:number}[]} */
  list() {
    const out = [];
    for (let s = 0; s < this.count; s++) if (this.defs[s]) out.push({ id: this.defs[s].id, slot: s });
    return out;
  }
}

/**
 * Absorbance of a material: its pigment colour at full strength, scaled by
 * its colouring strength (tint). Mixtures add absorbances in proportion to
 * concentration, so diluting a dye lightens it (Beer–Lambert).
 * @param {{color:number[], tint:number}} def
 */
export function absorbance(def) {
  return [0, 1, 2].map((k) => -Math.log(Math.max(0.003, srgbToLinear(def.color[k]))) * def.tint);
}
