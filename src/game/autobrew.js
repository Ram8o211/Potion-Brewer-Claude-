// Automatic brewing in the *real* simulation. Drives the same tools a player
// uses — pouring, the pestle, the spoon, the furnace dial — following a plan.
// Used by the Brass Homunculus upgrade and by the test-suite to prove that
// generated commissions are achievable.

import { PHASE, SIM } from '../simulation/constants.js';
import { MAX_SPECIES } from '../reactions/species.js';

/**
 * @typedef {'pour'|'crush'|'stir'|'heat'|'hold'|'serve'|'done'} Stage
 */

export class AutoBrewer {
  /**
   * @param {import('../simulation/world.js').Simulation} sim
   * @param {import('./predict.js').BrewPlan} plan
   * @param {(id:string)=>any} lookup
   * @param {{scale?: number, onPour?: (id:string, n:number)=>boolean, onPoured?: (id:string, n:number, ground:boolean)=>void}} [opts]
   */
  constructor(sim, plan, lookup, opts = {}) {
    this.sim = sim;
    this.plan = plan;
    this.lookup = lookup;
    this.scale = opts.scale || 1;
    this.onPour = opts.onPour;
    this.onPoured = opts.onPoured;
    /** @type {Stage} */
    this.stage = 'pour';
    this.ingIndex = 0;
    this.t = 0;
    this.stageT = 0;
    this.phase = 0;
    this.status = 'Preparing';
    this.failed = false;
    this.chilling = false;
  }

  get done() {
    return this.stage === 'done';
  }

  meanTemp() {
    const p = this.sim.p;
    let s = 0, n = 0;
    for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { s += p.temp[i]; n++; }
    return n ? s / n : SIM.AMBIENT;
  }

  /**
   * Proportional furnace control toward a temperature. The flame is never
   * set more than `margin` degrees above the target, so the iron at the
   * bottom does not scorch (and fade) the magic while the brew warms.
   */
  control(target, margin = 60) {
    const T = this.meanTemp();
    const f = this.sim.furnace;
    const err = target - T;
    // cold never scorches: chill hard, warm gently
    let s = Math.max(-1, Math.min(1, err / (err < 0 ? 4 : 12)));
    if (s > 0) s = Math.min(s, Math.max(0.04, (target + margin - 20) / Math.max(1, f.maxFlame - 20)));
    f.setting = s;
    return Math.abs(err);
  }

  /** The temperature the current heating stage aims for. */
  goal() {
    const plan = this.plan;
    const hot = (plan.heatTo ?? 20) > 25, cold = (plan.coolTo ?? 20) < 15;
    if (this.chilling || (cold && !hot)) return plan.coolTo;
    return plan.heatTo ?? 20;
  }

  /** Spoon stirring along a wide ellipse through the brew. */
  stir(strength = 1) {
    const sim = this.sim, t = sim.tool;
    t.type = 'spoon';
    this.phase += SIM.DT * 2.6;
    const c = sim.cauldron;
    // centre the stroke on the bulk of the contents
    let minY = c.depth, n = 0;
    const p = sim.p;
    for (let i = 0; i < p.count; i += 7) if (p.phase[i] !== PHASE.GAS) { minY = Math.min(minY, p.y[i]); n++; }
    const top = n ? minY : c.depth - 1;
    const cy = (top + c.depth) / 2;
    const ry = Math.max(0.12, (c.depth - top) / 2 - 0.15);
    const rx = c.halfWidth(cy) * 0.68 * strength;
    t.setTarget(Math.cos(this.phase) * rx, cy + Math.sin(this.phase * 1.7) * ry, true);
    t.beginFrame();
    t.substep(0, 1);
  }

  release() {
    const t = this.sim.tool;
    t.setTarget(t.x, t.y, false);
  }

  /** Advance one simulation step's worth of decisions. Call before sim.step(). */
  tick() {
    const dt = SIM.DT;
    this.t += dt;
    this.stageT += dt;
    const sim = this.sim, plan = this.plan;
    if (this.t > 420) { this.failed = true; this.finish(); return; }
    switch (this.stage) {
      case 'pour': {
        if (sim.emitter.pouring) { this.stir(0.6); return; }
        if (this.ingIndex >= plan.ingredients.length) {
          this.next(plan.crush ? 'crush' : 'stir');
          return;
        }
        const ing = plan.ingredients[this.ingIndex++];
        const n = Math.max(1, Math.round(ing.n * this.scale));
        if (this.onPour && !this.onPour(ing.id, n)) { this.failed = true; this.finish(); return; }
        const def = this.lookup(ing.id);
        const ground = !!ing.ground && def.form === 'solid';
        sim.emitter.start(def, { x: (this.ingIndex % 2 ? -0.35 : 0.35), amount: n, rate: def.form === 'powder' || ground ? 70 : 110, ground });
        this.status = ground ? `Grinding and adding ${def.name}` : `Pouring ${def.name}`;
        if (this.onPoured) this.onPoured(ing.id, n, ground);
        return;
      }
      case 'crush': {
        this.status = 'Grinding solids';
        const p = sim.p;
        let solids = 0, sx = 0, sy = 0;
        for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID) { solids++; sx += p.x[i]; sy += p.y[i]; }
        if (solids === 0 || this.stageT > 25) { this.release(); this.next('stir'); return; }
        const t = sim.tool;
        t.type = 'pestle';
        this.phase += dt * 9;
        const cx = sx / solids, cy = sy / solids;
        t.setTarget(cx + Math.sin(this.phase * 0.6) * 0.35, cy + Math.abs(Math.sin(this.phase)) * 0.3 - 0.05, true);
        t.beginFrame();
        t.substep(0, 1);
        return;
      }
      case 'stir': {
        this.status = 'Stirring';
        this.stir(1);
        this.control(Math.min(plan.heatTo ?? 20, 60));
        const need = plan.stir ?? (plan.knead ? 14 : 7);
        if (this.stageT > need) this.next('heat');
        return;
      }
      case 'heat': {
        const goal = this.goal();
        this.status = goal < 15 ? 'Chilling' : `Heating to ${Math.round(goal)}°C`;
        const err = this.control(goal);
        if (this.stageT % 3 < 1.5) this.stir(0.8); else this.release();
        if (err < 4 || this.stageT > 70) this.next('hold');
        return;
      }
      case 'hold': {
        this.control(this.goal());
        this.status = 'Holding';
        if (this.stageT % 2.5 < 1.5) this.stir(0.9); else this.release();
        if (this.stageT > (plan.hold ?? 6) + 4) {
          // a hot steep first, then the chill
          if (!this.chilling && (plan.heatTo ?? 20) > 25 && (plan.coolTo ?? 20) < 15) { this.chilling = true; this.next('heat'); }
          else this.next('serve');
        }
        return;
      }
      case 'serve': {
        // warm a chilled brew gently: a scorching pot bottom would fade delicate magic
        const err = this.control(plan.serveTemp ?? 20, (plan.coolTo ?? 20) < 0 ? 25 : 60);
        this.status = `Bringing to ${Math.round(plan.serveTemp ?? 20)}°C`;
        if (this.stageT % 2 < 1.2) this.stir(0.8); else this.release();
        if ((err < 3 && this.stageT > 3 && !this.frozen()) || this.stageT > 120) this.finish();
        return;
      }
    }
  }

  /** Is part of the brew still frozen solid? */
  frozen() {
    const p = this.sim.p;
    for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID) return true;
    return false;
  }

  /** @param {Stage} s */
  next(s) {
    this.stage = s;
    this.stageT = 0;
  }

  finish() {
    this.release();
    this.sim.furnace.setting = 0;
    this.stage = 'done';
    this.status = this.failed ? 'Stopped' : 'Ready to bottle';
  }
}

/** Run a plan to completion headlessly (tests). */
export function runPlanHeadless(sim, plan, lookup) {
  const ab = new AutoBrewer(sim, plan, lookup);
  let guard = 0;
  while (!ab.done && guard++ < 120 * 400) {
    ab.tick();
    sim.step();
  }
  return ab;
}

/** Species fraction helper for debugging. */
export function speciesFraction(sim, id) {
  const s = sim.species.slotOf.get(id);
  if (s === undefined) return 0;
  let t = 0;
  for (let i = 0; i < sim.p.count; i++) t += sim.p.comp[i * MAX_SPECIES + s];
  return t / Math.max(1, sim.p.count);
}
