// Pouring and dosing. Liquids leave the flask as a stream, powders as a
// scattered trickle of grains, solid ingredients as rigid chunks, gases as
// puffs. With the lid closed, matter enters through the funnel port just
// below the lid; with the lid open it falls from above the mouth.

import { PHASE, SIM, formPhase } from './constants.js';
import { COLUMN } from './cauldron.js';

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
      this.chunkTimer = 0.32;
      const size = Math.min(a.remaining, a.remaining >= 12 ? 12 : 7);
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
      a.remaining--;
      a.spawned++;
      this.acc -= 1;
      this.blocked = 0;
      this.poured[a.def.id] = (this.poured[a.def.id] || 0) + 1;
    }
    if (this.acc > 3) this.acc = 3;
  }

  /** Spawn a rigid chunk of hex-packed particles. */
  _spawnChunk(a, size) {
    const sim = this.sim;
    const offs = [[0, 0]];
    const s = SIM.SPACING;
    for (let k = 0; k < 6; k++) offs.push([Math.cos((k * Math.PI) / 3) * s, Math.sin((k * Math.PI) / 3) * s]);
    if (size > 7) {
      for (let k = 0; k < 6; k++) offs.push([Math.cos((k * Math.PI) / 3 + Math.PI / 6) * s * 1.732, Math.sin((k * Math.PI) / 3 + Math.PI / 6) * s * 1.732]);
    }
    offs.length = Math.min(offs.length, size);
    const mouth = sim.cauldron.mouth;
    const cx = Math.max(-mouth + 0.3, Math.min(mouth - 0.3, a.x + (sim.rand() - 0.5) * 0.3));
    const cy = this.spawnY() + 0.12;
    const ang = sim.rand() * Math.PI * 2;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const pts = offs.map(([ox, oy]) => [cx + ca * ox - sa * oy, cy + sa * ox + ca * oy]);
    for (const [x, y] of pts) if (!this._free(x, y, 0.085)) return false;
    const g = sim.rigid.alloc();
    if (g < 0) return false;
    const idx = [];
    for (const [x, y] of pts) {
      const i = sim.addParticle(a.def, x, y, PHASE.SOLID, a.temp);
      if (i < 0) break;
      sim.p.group[i] = g;
      sim.p.vy[i] = 1.2;
      idx.push(i);
    }
    sim.rigid.setRest(idx);
    sim.rigid.markDirty(g);
    return idx.length > 0;
  }
}
