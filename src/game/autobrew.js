// Automatic brewing in the *real* simulation. Drives the same tools a player
// uses — pouring, the pestle, the spoon, the furnace dial — following a plan.
// Used by the Brass Homunculus upgrade and by the test-suite to prove that
// generated commissions are achievable.

import { PHASE, SIM } from '../simulation/constants.js';
import { MAX_SPECIES } from '../reactions/species.js';

/**
 * @typedef {'pour'|'crush'|'stir'|'steep'|'heat'|'hold'|'reduce'|'serve'|'steps'|'done'} Stage
 */

/** Liquid (non-vapour) particles in the cauldron. @param {import('../simulation/world.js').Simulation} sim */
export function condensedCount(sim) {
  const p = sim.p;
  let n = 0;
  for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) n++;
  return n;
}

/**
 * The temperature of a plan's main stage (reaction or awakening): the cold
 * extreme for a chilling plan, otherwise the hot one.
 * @param {import('./predict.js').BrewPlan} plan
 */
export function stageGoal(plan) {
  const st = plan.steep ? plan.steep.T : null;
  const cool = plan.coolTo ?? 20, heat = plan.heatTo ?? 20;
  const cold = cool < Math.min(15, st ?? 99) - 1 && heat <= Math.max(25, st ?? 0) + 1;
  return cold ? cool : heat;
}

export class AutoBrewer {
  /**
   * @param {import('../simulation/world.js').Simulation} sim
   * @param {import('./predict.js').BrewPlan} plan
   * @param {(id:string)=>any} lookup
   * @param {{scale?: number, onPour?: (id:string, n:number)=>boolean, onPoured?: (id:string, n:number)=>void}} [opts]
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
    this.held = 0;
    /** the whole piece the pestle is working on (particle index) */
    this.crushTarget = -1;
    /** recorded procedure (recipes.js): replayed step by step instead of the plan's stages */
    // solids always go in whole now (the mortar is retired): an old recipe's
    // ground pour becomes a whole pour crushed with the pestle
    const steps = /** @type {any} */ (plan).steps;
    this.steps = /** @type {any[]|null} */ (steps ? steps.flatMap((s) => (s.op === 'pour' && s.ground ? [{ ...s, ground: undefined }, { op: 'crush', s: 60 }] : [s])) : null);
    this.stepIndex = 0;
    this.target = 20;
    this.reduceFrom = 0;
    this.venting = 0;
    if (this.steps) this.stage = 'steps';
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

  /** Proportional furnace control toward a temperature. */
  control(target) {
    const T = this.meanTemp();
    const f = this.sim.furnace;
    const err = target - T;
    f.setting = Math.max(-1, Math.min(1, err / 12));
    return Math.abs(err);
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
    if (this.t > (this.steps ? 900 : 360)) { this.failed = true; this.finish(); return; }
    switch (this.stage) {
      case 'steps': this.tickStep(); return;
      case 'pour': {
        if (sim.emitter.pouring) { this.stir(0.6); return; }
        if (this.ingIndex >= plan.ingredients.length) {
          this.next(plan.crush ? 'crush' : 'stir');
          return;
        }
        const ing = plan.ingredients[this.ingIndex++];
        this.pourOne(ing);
        return;
      }
      case 'crush': {
        // the pestle works until nothing whole is left (a generous cap)
        if (!this.crushSolids() || this.stageT > 90) { this.release(); this.next('stir'); }
        return;
      }
      case 'stir': {
        // mix at room temperature first, so nothing awakens or reacts in
        // unmixed pockets before the brew is even
        this.status = 'Stirring';
        this.stir(1);
        this.control(20);
        const need = plan.knead ? 14 : plan.activate ? 10 : 7;
        if (this.stageT > need) this.next(plan.steep ? 'steep' : 'heat');
        return;
      }
      case 'steep': {
        const T = plan.steep.T;
        this.status = `Steeping at ${Math.round(T)}°C`;
        const err = this.control(T);
        if (this.stageT % 3 < 1.6) this.stir(0.8); else this.release();
        if (err < 4) this.held = (this.held || 0) + dt;
        if (this.held >= plan.steep.hold || this.stageT > 90) { this.held = 0; this.next('heat'); }
        return;
      }
      case 'heat': {
        const goal = stageGoal(plan);
        this.status = goal < 15 ? `Chilling to ${Math.round(goal)}°C` : `Heating to ${Math.round(goal)}°C`;
        const err = this.control(goal);
        if (this.stageT % 3 < 1.5) this.stir(0.8); else this.release();
        if (err < 4 || this.stageT > (goal < 15 ? 120 : 70)) this.next('hold');
        return;
      }
      case 'hold': {
        this.control(stageGoal(plan));
        this.status = plan.activate ? 'Letting it awaken' : 'Letting it react';
        if (this.stageT % 2.5 < 1.5) this.stir(0.9); else this.release();
        if (this.stageT > (plan.hold ?? 6) + 4) this.next(plan.reduce ? 'reduce' : 'serve');
        return;
      }
      case 'reduce': {
        // lid off, a steady boil, until the brew has lost its share of volume
        const c = sim.cauldron;
        if (this.stageT <= dt + 1e-9) { this.reduceFrom = condensedCount(sim); this.lidWas = c.lidClosed; c.lidClosed = false; }
        const goal = Math.round(this.reduceFrom * (1 - (plan.reduce ? plan.reduce.frac : 0)));
        if (!this.venting) {
          this.status = `Boiling down (${condensedCount(sim)} → ${goal})`;
          this.control(130);
          sim.furnace.setting = Math.min(sim.furnace.setting, 0.7);
          if (this.stageT % 3 < 1.2) this.stir(0.7); else this.release();
          if (condensedCount(sim) <= goal || this.stageT > 160) { this.venting = this.stageT; sim.furnace.setting = 0; this.release(); }
          return;
        }
        // fire out, lid still off: let the steam leave before the lid goes back on
        // (steam that falls back as rain is boiled off again)
        this.status = 'Letting the steam out';
        sim.furnace.setting = 0;
        const gas = sim.p.count - condensedCount(sim);
        if (gas <= 0 && condensedCount(sim) > goal && this.stageT < 200) { this.venting = 0; return; }
        if (gas <= 0 || this.stageT - this.venting > 20) { c.lidClosed = this.lidWas ?? true; this.venting = 0; this.next('serve'); }
        return;
      }
      case 'serve': {
        const err = this.control(plan.serveTemp ?? 20);
        this.status = `Bringing to ${Math.round(plan.serveTemp ?? 20)}°C`;
        if (this.stageT % 2 < 1.2) this.stir(0.8); else this.release();
        if ((err < 3 && this.stageT > 3) || this.stageT > 60) this.finish();
        return;
      }
    }
  }

  /**
   * One step of work with the pestle: it picks a whole piece (the lowest),
   * keeps on it until it breaks, and pounds back and forth over it.
   * Returns false when nothing whole is left.
   */
  crushSolids() {
    const sim = this.sim, p = sim.p;
    this.status = 'Crushing solids';
    let k = this.crushTarget ?? -1;
    if (k < 0 || k >= p.count || p.phase[k] !== PHASE.SOLID) {
      k = -1;
      for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID && (k < 0 || p.y[i] > p.y[k])) k = i;
      this.crushTarget = k;
    }
    if (k < 0) return false;
    const t = sim.tool;
    t.type = 'pestle';
    this.phase += SIM.DT * 9;
    t.setTarget(p.x[k] + Math.sin(this.phase * 0.6) * 0.18, p.y[k] + Math.abs(Math.sin(this.phase)) * 0.25 - 0.08, true);
    t.beginFrame();
    t.substep(0, 1);
    return true;
  }

  /**
   * Start pouring one ingredient (n particles, or ml in a recorded step).
   * Returns false (and stops) if the stock does not allow it.
   * @param {{id:string, n?:number, ml?:number, ground?:boolean}} ing
   */
  pourOne(ing) {
    const n = Math.max(1, Math.round((ing.n ?? (ing.ml || 0) / SIM.ML_PER_PARTICLE) * this.scale));
    if (this.onPour && !this.onPour(ing.id, n)) { this.failed = true; this.finish(); return false; }
    const def = this.lookup(ing.id);
    if (!def) { this.failed = true; this.finish(); return false; }
    this.sim.emitter.start(def, { x: (this.ingIndex % 2 ? -0.35 : 0.35), amount: n, rate: def.form === 'powder' ? 70 : 110 });
    this.status = `Pouring ${def.name}`;
    if (this.onPoured) this.onPoured(ing.id, n);
    return true;
  }

  /**
   * One physics step of a recorded procedure (recipes.js): every step is
   * done for real, in order — pours wait for the stream, holds wait for the
   * temperature, then count their seconds. Between steps the furnace keeps
   * the last temperature asked for.
   */
  tickStep() {
    const sim = this.sim, dt = SIM.DT;
    const steps = /** @type {any[]} */ (this.steps);
    if (sim.emitter.pouring) { this.control(this.target); return; }
    const s = steps[this.stepIndex];
    if (!s) { this.finish(); return; }
    const done = () => { this.release(); this.stepIndex++; this.stageT = 0; this.held = 0; };
    switch (s.op) {
      case 'pour':
        if (this.stageT <= dt + 1e-9) { if (this.pourOne(s)) this.stageT = dt * 2; return; }
        done();
        return;
      case 'stir':
        this.status = 'Stirring';
        this.control(this.target);
        this.stir(1);
        if (this.stageT >= s.s) done();
        return;
      case 'crush': {
        this.control(this.target);
        if (!this.crushSolids() || this.stageT >= s.s) done();
        return;
      }
      case 'temp': {
        if (s.loss) { this.tickBoilDown(s, done); return; }
        this.target = s.T;
        this.status = `${s.T < 20 ? 'Chilling' : 'Heating'} to ${s.T}°C`;
        const err = this.control(s.T);
        const duty = s.stir ?? 0.5;
        if (duty > 0.05 && (this.stageT % 3) < 3 * duty) this.stir(0.8); else this.release();
        if (err < 4) this.held += dt;
        if (this.held >= s.hold || this.stageT > s.hold + 120) done();
        return;
      }
      case 'lid':
        sim.cauldron.lidClosed = !!s.closed;
        done();
        return;
      case 'serve': {
        this.target = s.T;
        this.status = `Bringing to ${s.T}°C`;
        const err = this.control(s.T);
        if (this.stageT % 2 < 1.2) this.stir(0.6); else this.release();
        if ((err < 3 && this.stageT > 2) || this.stageT > 60) done();
        return;
      }
      default:
        // the skimming and distilling of old recipes are beyond it: the step is skipped (and was announced)
        done();
    }
  }

  /**
   * A recorded boil-down: the lid open and the brew boiling until the share
   * of it that boiled away when the recipe was made has gone, then the fire
   * out until the steam has left.
   * @param {{T:number, hold:number, loss:number}} s @param {()=>void} done
   */
  tickBoilDown(s, done) {
    const sim = this.sim, c = sim.cauldron, dt = SIM.DT;
    if (this.stageT <= dt + 1e-9) { this.reduceFrom = condensedCount(sim); this.venting = 0; }
    c.lidClosed = false;
    const goal = Math.round(this.reduceFrom * (1 - s.loss));
    if (!this.venting) {
      this.status = `Boiling down (${Math.round((1 - condensedCount(sim) / Math.max(1, this.reduceFrom)) * 100)} of ${Math.round(s.loss * 100)} %)`;
      this.control(Math.max(s.T, 130));
      sim.furnace.setting = Math.min(sim.furnace.setting, 0.7);
      if (this.stageT % 3 < 1.2) this.stir(0.7); else this.release();
      // what matters is how much boiled away, not how long it took on that fire
      if (condensedCount(sim) <= goal || this.stageT > s.hold + 200) { this.venting = this.stageT; sim.furnace.setting = 0; this.release(); }
      return;
    }
    this.status = 'Letting the steam out';
    sim.furnace.setting = 0;
    const gas = sim.p.count - condensedCount(sim);
    if (gas <= 0 || this.stageT - this.venting > 20) { this.venting = 0; done(); }
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
