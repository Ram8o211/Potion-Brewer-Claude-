// Structure-of-arrays particle storage. Every particle has the same volume;
// its composition is a vector of volume fractions over species slots.

import { MAX_SPECIES } from '../reactions/species.js';
import { PHASE } from './constants.js';

/** Per-particle state fields that are persisted & swapped on removal. */
export const STATE_FIELDS_F32 = ['x', 'y', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet', 'q', 'skinU', 'skinV'];
export const STATE_FIELDS_I32 = ['group'];
export const STATE_FIELDS_U8 = ['phase'];
export const STATE_FIELDS_U16 = ['skin'];
export const STATE_FIELDS_U32 = ['seed'];

/** Derived (cached) per-particle properties computed from composition. */
export const DERIVED_FIELDS = [
  'rho20', 'rho', 'invMass', 'rhoCp', 'kappa', 'lnMu20', 'viscT', 'lnMu', 'gran', 'binder',
  'tm', 'tb', 'volFrac', 'latF', 'latV', 'beta', 'cA', 'cB', 'colL', 'colA', 'colB',
  'opacity', 'flam', 'ign', 'combHeat', 'gasRho', 'glow', 'friction', 'hardness', 'yieldV', 'econd',
  'auraR', 'auraG', 'auraB', 'auraI', 'arcT', 'whole', 'look',
];
/** arcT value of a particle with nothing left to awaken */
export const ARC_NONE = 1e9;

export class Particles {
  /** @param {number} capacity */
  constructor(capacity) {
    this.capacity = capacity;
    this.count = 0;
    this.S = MAX_SPECIES;
    // positions (current / previous)
    this.x = new Float32Array(capacity);
    this.y = new Float32Array(capacity);
    this.px = new Float32Array(capacity);
    this.py = new Float32Array(capacity);
    this.vx = new Float32Array(capacity);
    this.vy = new Float32Array(capacity);
    this.temp = new Float32Array(capacity);
    /** latent energy in progress toward a phase change (+ up / − down) */
    this.lat = new Float32Array(capacity);
    /** accumulated phase energy offset (for energy accounting) */
    this.eph = new Float32Array(capacity);
    this.restX = new Float32Array(capacity);
    this.restY = new Float32Array(capacity);
    /** smoothed local shear rate (agitation) */
    this.agit = new Float32Array(capacity);
    /** combustion intensity 0..1 */
    this.burn = new Float32Array(capacity);
    /** recent wetting/mixing activity, for visual feedback */
    this.wet = new Float32Array(capacity);
    /** electric charge (conserved; see electric.js) */
    this.q = new Float32Array(capacity);
    this.group = new Int32Array(capacity).fill(-1);
    /** painted piece of a poured whole object it belongs to (materials/shapes.js skin id, 0 = none) */
    this.skin = new Uint16Array(capacity);
    /** where in that piece it sits: offset from the piece's centre in particle spacings */
    this.skinU = new Float32Array(capacity);
    this.skinV = new Float32Array(capacity);
    this.phase = new Uint8Array(capacity);
    this.seed = new Uint32Array(capacity);
    this.sleep = new Uint16Array(capacity);
    this.dirty = new Uint8Array(capacity);
    this.comp = new Float32Array(capacity * MAX_SPECIES);
    // ---- derived (cached) properties, see derived.js
    this.rho20 = new Float32Array(capacity);
    this.rho = new Float32Array(capacity);
    this.invMass = new Float32Array(capacity);
    this.rhoCp = new Float32Array(capacity);
    this.kappa = new Float32Array(capacity);
    this.lnMu20 = new Float32Array(capacity);
    this.viscT = new Float32Array(capacity);
    this.lnMu = new Float32Array(capacity);
    this.gran = new Float32Array(capacity);
    this.binder = new Float32Array(capacity);
    this.tm = new Float32Array(capacity);
    this.tb = new Float32Array(capacity);
    this.volFrac = new Float32Array(capacity);
    this.latF = new Float32Array(capacity);
    this.latV = new Float32Array(capacity);
    this.beta = new Float32Array(capacity);
    this.cA = new Float32Array(capacity);
    this.cB = new Float32Array(capacity);
    this.colL = new Float32Array(capacity);
    this.colA = new Float32Array(capacity);
    this.colB = new Float32Array(capacity);
    this.opacity = new Float32Array(capacity);
    this.flam = new Float32Array(capacity);
    this.ign = new Float32Array(capacity);
    this.combHeat = new Float32Array(capacity);
    this.gasRho = new Float32Array(capacity);
    this.glow = new Float32Array(capacity);
    this.friction = new Float32Array(capacity);
    this.hardness = new Float32Array(capacity);
    this.yieldV = new Float32Array(capacity);
    /** electrical conductance of the blend */
    this.econd = new Float32Array(capacity);
    /** magical emission: colour (0..1) and intensity (effective concentration / 100) */
    this.auraR = new Float32Array(capacity);
    this.auraG = new Float32Array(capacity);
    this.auraB = new Float32Array(capacity);
    this.auraI = new Float32Array(capacity);
    /** effective arcane threshold of the unawakened magic in the particle (ARC_NONE if none) */
    this.arcT = new Float32Array(capacity).fill(ARC_NONE);
    /** share of supplied-whole solid ingredient (roots, stones) in the particle */
    this.whole = new Float32Array(capacity);
    /** surface look of its main whole ingredient (materials/shapes.js LOOK) */
    this.look = new Uint8Array(capacity);
    this._seedCounter = 1;
  }

  /**
   * Append a particle. Returns its index or -1 when full.
   * @param {number} x @param {number} y @param {number} phase @param {number} temp
   */
  add(x, y, phase, temp) {
    if (this.count >= this.capacity) return -1;
    const i = this.count++;
    this.x[i] = x; this.y[i] = y; this.px[i] = x; this.py[i] = y;
    this.vx[i] = 0; this.vy[i] = 0;
    this.temp[i] = temp;
    this.lat[i] = 0; this.eph[i] = 0;
    this.restX[i] = 0; this.restY[i] = 0;
    this.agit[i] = 0; this.burn[i] = 0; this.wet[i] = 0; this.q[i] = 0;
    this.group[i] = -1;
    this.skin[i] = 0; this.skinU[i] = 0; this.skinV[i] = 0;
    this.phase[i] = phase;
    this.seed[i] = (Math.imul(this._seedCounter++, 2654435761) >>> 0) || 1;
    this.sleep[i] = 0;
    this.dirty[i] = 1;
    this.comp.fill(0, i * this.S, (i + 1) * this.S);
    return i;
  }

  /** Copy every field of particle `src` into slot `dst`. @param {number} dst @param {number} src */
  copy(dst, src) {
    const self = /** @type {any} */ (this);
    for (const f of ['x', 'y', 'px', 'py', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet', 'q', 'group', 'skin', 'skinU', 'skinV', 'phase', 'seed', 'sleep', 'dirty']) {
      self[f][dst] = self[f][src];
    }
    for (const f of DERIVED_FIELDS) self[f][dst] = self[f][src];
    this.comp.copyWithin(dst * this.S, src * this.S, (src + 1) * this.S);
  }

  /** Remove by swapping the last particle into its slot. @param {number} i */
  remove(i) {
    const last = this.count - 1;
    if (i !== last) this.copy(i, last);
    this.count--;
  }

  /** @param {number} i */
  isCondensed(i) {
    return this.phase[i] !== PHASE.GAS;
  }
}
