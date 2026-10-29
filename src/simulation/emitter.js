// Pouring and dosing. Liquids leave the flask as a stream, powders as a
// scattered trickle of grains, whole solid ingredients as recognisable rigid
// objects (materials/shapes.js: a forked root, a pebble, a crystal), gases as
// puffs. With the lid closed, matter enters through the funnel port just
// below the lid; with the lid open it falls from above the mouth.

import { PHASE, SIM, formPhase } from './constants.js';
import { COLUMN } from './cauldron.js';
import { chunkTemplate, chunkSize, hasPieces, skinOf, grainSkinOf, piece } from '../materials/shapes.js';
import { registerSpecies } from '../visual/pieces.js';

export class Emitter {
  /** @param {import('./world.js').Simulation} sim */
  constructor(sim) {
    this.sim = sim;
    /** @type {null | {def:any, x:number, rate:number, remaining:number, temp:number|undefined, spawned:number, dose?:boolean, form:string}} */
    this.active = null;
    this.acc = 0;
    this.chunkTimer = 0;
    this.blocked = 0;
    /** particles poured per material id since last reset */
    this.poured = /** @type {Record<string, number>} */ ({});
  }

  /**
   * @param {any} def
   * @param {{x?:number, rate?:number, amount?:number, temp?:number, ground?:boolean}} [opts]
   *   ground: a solid ingredient already ground in the mortar pours as powder
   */
  start(def, opts = {}) {
    const form = opts.ground && def.form === 'solid' ? 'powder' : def.form;
    // a narrower mouth takes a thinner stream (the shop's pots fill in
    // seconds otherwise); the great vessels pour at the full rate
    const k = Math.min(1, Math.max(0.5, this.sim.cauldron.mouth / 1.7));
    this.active = {
      def,
      form,
      x: opts.x ?? 0,
      rate: opts.rate ?? (form === 'powder' ? 55 : form === 'gas' ? 30 : 75) * k,
      remaining: opts.amount ?? Infinity,
      temp: opts.temp,
      spawned: 0,
    };
    this.acc = 0;
    this.blocked = 0;
    this.chunkTimer = 0;
  }

  /** @param {number} x */
  setX(x) {
    if (this.active) this.active.x = x;
  }

  stop() {
    if (this.active && this.active.spawned > 0) {
      this.sim.emit({ type: 'pourEnd', id: this.active.def.id, amount: this.active.spawned });
    }
    this.active = null;
  }

  get pouring() {
    return !!this.active;
  }

  spawnY() {
    return this.sim.cauldron.lidClosed ? 0.1 : -COLUMN * 0.55;
  }

  /** @param {number} x @param {number} y @param {number} r */
  _free(x, y, r) {
    const p = this.sim.p, r2 = r * r;
    for (let i = 0; i < p.count; i++) {
      const dx = p.x[i] - x, dy = p.y[i] - y;
      if (dx * dx + dy * dy < r2) return false;
    }
    return true;
  }

  /** @param {number} dt */
  step(dt) {
    const a = this.active;
    if (!a) return;
    const sim = this.sim;
    if (a.remaining <= 0) {
      this.stop();
      return;
    }
    if (sim.p.count >= sim.maxParticles) {
      this.blocked += dt;
      if (this.blocked > 0.5) {
        sim.emit({ type: 'full' });
        this.stop();
      }
      return;
    }
    const mouth = sim.cauldron.mouth;
    const form = a.form;
    if (form === 'solid') {
      this.chunkTimer -= dt;
      if (this.chunkTimer > 0) return;
      this.chunkTimer = 0.36;
      const size = Math.min(a.remaining, chunkSize(a.def));
      if (this._spawnChunk(a, size)) {
        a.remaining -= size;
        a.spawned += size;
        this.poured[a.def.id] = (this.poured[a.def.id] || 0) + size;
      }
      return;
    }
    this.acc += a.rate * dt;
    let guard = 4;
    while (this.acc >= 1 && a.remaining > 0 && guard-- > 0) {
      const spread = form === 'powder' ? 0.09 : form === 'gas' ? 0.3 : 0.16;
      const x = Math.max(-mouth + 0.12, Math.min(mouth - 0.12, a.x + (sim.rand() - 0.5) * spread));
      const y = this.spawnY() + (sim.rand() - 0.5) * 0.04;
      if (!this._free(x, y, 0.078)) {
        // the brew has risen to the stream: give up rather than hang
        this.blocked += dt;
        if (this.blocked > 1.2) {
          sim.emit({ type: 'full' });
          this.stop();
          return;
        }
        break;
      }
      const ph = formPhase(form);
      const i = sim.addParticle(a.def, x, y, ph, a.temp);
      if (i < 0) break;
      const p = sim.p;
      p.vx[i] = (sim.rand() - 0.5) * (form === 'powder' ? 0.35 : 0.15);
      p.vy[i] = form === 'gas' ? 0.2 : sim.cauldron.lidClosed ? 1.4 : 2.2;
      if (form === 'powder') this._grainSkin(a.def, i);
      a.remaining--;
      a.spawned++;
      this.acc -= 1;
      this.blocked = 0;
      this.poured[a.def.id] = (this.poured[a.def.id] || 0) + 1;
    }
    if (this.acc > 3) this.acc = 3;
  }

  /**
   * A grain of a powder (or a ground solid) with pieces is drawn in
   * their colours: it takes a spot in one of them, picked from its seed (so
   * the simulation's random stream is untouched).
   * @param {any} def @param {number} i
   */
  _grainSkin(def, i) {
    const p = this.sim.p, sd = p.seed[i];
    registerSpecies(def);
    const skin = grainSkinOf(def, sd >>> 30);
    const pc = skin ? piece(skin) : null;
    if (!pc) return;
    const h = Math.imul(sd ^ (sd >>> 13), 0x5bd1e995) >>> 0;
    const [u, v] = pc.pts[h % pc.pts.length];
    p.skin[i] = skin;
    p.skinU[i] = u + (((h >>> 8) & 255) / 255 - 0.5) * 0.8;
    p.skinV[i] = v + (((h >>> 16) & 255) / 255 - 0.5) * 0.8;
  }

  /**
   * Spawn one whole object of a solid ingredient, shaped by its template —
   * or, for a wild ingredient, by one of its four painted pieces, picked at
   * random, which its particles then carry.
   */
  _spawnChunk(a, size) {
    const sim = this.sim;
    const s = SIM.SPACING;
    const variant = hasPieces(a.def) ? Math.floor(sim.rand() * 4) : -1;
    const offs = chunkTemplate(a.def, size, variant);
    let ext = 0;
    for (const [ox, oy] of offs) ext = Math.max(ext, Math.hypot(ox, oy) * s);
    const mouth = sim.cauldron.mouth;
    const room = Math.max(0.05, mouth - ext - 0.12);
    const cx = Math.max(-room, Math.min(room, a.x + (sim.rand() - 0.5) * 0.3));
    const cy = this.spawnY() + 0.12;
    // tumble in at a random angle, but long objects lie roughly flat so they fit the mouth
    const ang = (sim.rand() - 0.5) * (ext > 0.25 ? 0.8 : Math.PI * 2);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const pts = offs.map(([ox, oy]) => [cx + (ca * ox - sa * oy) * s, cy + (sa * ox + ca * oy) * s]);
    for (const [x, y] of pts) if (!this._free(x, y, 0.085)) return false;
    const g = sim.rigid.alloc();
    if (g < 0) return false;
    const idx = [];
    const skin = variant >= 0 ? skinOf(a.def, variant) : 0;
    for (let k = 0; k < pts.length; k++) {
      const [x, y] = pts[k];
      const i = sim.addParticle(a.def, x, y, PHASE.SOLID, a.temp);
      if (i < 0) break;
      sim.p.group[i] = g;
      sim.p.vy[i] = 1.2;
      sim.p.skin[i] = skin;
      sim.p.skinU[i] = offs[k][0];
      sim.p.skinV[i] = offs[k][1];
      idx.push(i);
    }
    if (!idx.length) return false;
    // the rest shape is the upright template, turned by the angle it tumbles in at
    sim.rigid.setRest(idx, g);
    const p = sim.p;
    for (const i of idx) {
      const rx = p.restX[i], ry = p.restY[i];
      p.restX[i] = ca * rx + sa * ry;
      p.restY[i] = -sa * rx + ca * ry;
    }
    sim.rigid.angle[g] = ang;
    sim.rigid.markDirty(g);
    return true;
  }
}
