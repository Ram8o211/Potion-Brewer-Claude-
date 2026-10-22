// The hutch: the colony's pen as a 224×88 pixel-art scene. A plank wall,
// straw, a hay rack and a water bowl make a cached background (a nest box
// joins it while a doe is expecting, a linen cloth while there are bodies);
// each living rabbit runs a small behaviour machine — idling, hopping,
// grooming, eating at the rack, sniffing, and the moods its visible state
// gives it (flops when lovestruck or vital, zoomies on fire or vitality 3,
// rearing to flex its strength, loafing when sick, frozen solid, floating on
// arcana, slow near death); kits trail their mother. The dead lie on the
// cloth at the right in their death pose.
//
// Everything is deterministic: each decision draws from an Rng seeded by the
// rabbit's id, its look seed and that rabbit's decision counter, so the same
// sync() and update() calls always give the same hutch. The scene keeps
// only references to the entries it is given and never writes to them.
// Rabbits are drawn by drawRabbit (one cached sprite each, mirrored to face
// left) and depth-sorted by the y of their feet.

import { Rng, hashString } from '../core/rng.js';
import { PAL, makeCanvas } from './art.js';
import { drawRabbit, rabbitAnchors, rabbitLevels, rabbitPace, RABBIT_W } from './rabbit.js';

export const HUTCH_W = 224;
export const HUTCH_H = 88;
/** Bodies shown on the cloth; the UI counts any beyond. */
export const HUTCH_BODIES = 3;

const FLOOR_Y = 48;
/** Where living rabbits' feet may go. */
const ROAM = { x0: 30, x1: 160, y0: 57, y1: 76 };
/** Where an eating rabbit stands, facing the hay rack. */
const RACK = { x: 40, y: 58 };
/** Feet positions of the bodies on the cloth. */
const SLOTS = [[180, 70], [200, 74], [186, 78]];
/** Top of the front rail (drawn over the rabbits). */
const RAIL_Y = 79;

/** @param {number} v @param {number} lo @param {number} hi */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
/** @param {CanvasRenderingContext2D} ctx */
function R(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

/**
 * One rabbit in the hutch.
 * @typedef {Object} Actor
 * @property {string} id
 * @property {any} look
 * @property {any} snap
 * @property {Record<string, number>} L    visible levels by channel
 * @property {string|null} mother
 * @property {boolean} alive
 * @property {boolean} hidden  a body beyond the cloth's slots
 * @property {number} x        feet, art pixels
 * @property {number} y
 * @property {number} face     1 right, -1 left
 * @property {string} act
 * @property {number} at       seconds into the act (scaled by pace)
 * @property {number} dur
 * @property {string|null} pose  pose asked of drawRabbit
 * @property {number} hops     hops left in a run
 * @property {number} hopT     seconds per hop
 * @property {number} hopH     hop height
 * @property {number} step     px per hop
 * @property {number} sx       start and end of the current hop
 * @property {number} sy
 * @property {number} tx
 * @property {number} ty
 * @property {number} gx       goal of the run
 * @property {number} gy
 * @property {string|null} next  act after the run (eat)
 * @property {number} n        decision counter
 * @property {number} phase    animation phase, so the hutch does not bob in step
 * @property {number} react    0..1 after a poke
 * @property {string[]} reactCh
 * @property {any} anSnap      anchors cache
 * @property {string|null} anPose
 * @property {any} an
 */

// hutch palette: dark oiled planks, golden straw, weathered posts
const HW = { k: '#1a1218', p0: '#2a170c', p1: '#3a2212', p2: '#4a2c17', p3: '#5a371d', p4: '#6d4626', p5: '#8a5c33', p6: '#a8763f' };
const STRAW = ['#7a5a24', '#9a7630', '#b8923c', '#d2ae52', '#e8cc74', '#f6e2a0'];

/** A wooden post with its cap, lit from the left. @param {CanvasRenderingContext2D} ctx */
function post(ctx, x, y, w, h) {
  R(ctx, x - 1, y - 1, w + 2, h + 1, HW.k);
  R(ctx, x, y, w, h, HW.p4);
  R(ctx, x, y, 1, h, HW.p6);
  R(ctx, x + w - 1, y, 1, h, HW.p2);
  R(ctx, x - 1, y - 2, w + 2, 2, HW.p5); R(ctx, x - 1, y - 2, w + 2, 1, HW.p6);
  for (let yy = y + 3; yy < y + h - 1; yy += 4) R(ctx, x + 1 + (yy % 3), yy, 1, 2, HW.p3);
}

/**
 * Paint the hutch background into a 224×88 context.
 * @param {CanvasRenderingContext2D} ctx @param {{nest?:boolean, cloth?:boolean}} [o]
 */
export function paintHutch(ctx, o = {}) {
  const W = HUTCH_W, H = HUTCH_H, rng = new Rng('hutch-bg-2');
  // ---- plank back wall: long boards of uneven tone, grain, knots, butt joints and nails
  for (let y = 0, i = 0; y < FLOOR_Y; y += 8, i++) {
    const tone = [HW.p2, HW.p3, HW.p2, HW.p1, HW.p3, HW.p2][i % 6];
    R(ctx, 0, y, W, 8, tone);
    R(ctx, 0, y, W, 1, i % 2 ? HW.p4 : HW.p3);
    R(ctx, 0, y + 7, W, 1, HW.p0);
    for (let k = 0; k < 16; k++) R(ctx, rng.int(0, W - 10), y + rng.int(2, 6), rng.int(6, 22), 1, rng.chance(0.5) ? HW.p1 : HW.p4);
    for (let k = 0; k < 2; k++) { const kx = rng.int(8, W - 8), ky = y + rng.int(3, 5); R(ctx, kx - 1, ky, 3, 1, HW.p1); R(ctx, kx, ky - 1, 1, 3, HW.p1); R(ctx, kx, ky, 1, 1, HW.p0); }
    for (let x = (i % 2) * 31 + rng.int(10, 30); x < W; x += rng.int(52, 84)) {
      R(ctx, x, y + 1, 1, 6, HW.p0); R(ctx, x + 1, y + 1, 1, 6, HW.p4);
      R(ctx, x - 3, y + 3, 1, 1, '#8a8296'); R(ctx, x + 3, y + 3, 1, 1, '#8a8296');
    }
  }
  // shade toward the top of the wall, warm light toward the floor
  for (let y = 0; y < FLOOR_Y; y++) {
    const a = y < 16 ? 0.32 * (1 - y / 16) : 0;
    if (a > 0.01) R(ctx, 0, y, W, 1, `rgba(10,6,4,${a.toFixed(3)})`);
    if (y > 34) R(ctx, 0, y, W, 1, `rgba(255,190,90,${(0.05 * (y - 34) / 14).toFixed(3)})`);
  }
  // corner posts and a cross beam
  post(ctx, 0, 0, 5, FLOOR_Y);
  post(ctx, W - 5, 0, 5, FLOOR_Y);
  R(ctx, 0, 0, W, 4, HW.p1); R(ctx, 0, 3, W, 1, HW.p0); R(ctx, 0, 0, W, 1, HW.p3);
  // ---- straw floor: a golden bed of crossing strands
  for (let y = FLOOR_Y; y < H; y++) R(ctx, 0, y, W, 1, y < FLOOR_Y + 3 ? STRAW[0] : STRAW[1 + ((y >> 2) % 2)]);
  for (let k = 0; k < 900; k++) {
    const x = rng.int(-2, W), y = rng.int(FLOOR_Y + 2, H - 1), len = rng.int(2, 5);
    const c = STRAW[rng.weighted([0, 1, 2, 3, 4, 5], [1.2, 1.6, 2, 2, 1.4, 0.6])];
    const dir = rng.pick([-1, 1, 0]);
    for (let j = 0; j < len; j++) R(ctx, x + j, y + (dir ? Math.round(j * dir * 0.5) : 0), 1, 1, c);
  }
  R(ctx, 0, FLOOR_Y, W, 1, HW.p0);
  R(ctx, 0, FLOOR_Y + 1, W, 2, 'rgba(20,10,0,0.35)');
  R(ctx, 0, FLOOR_Y + 3, W, 2, 'rgba(20,10,0,0.15)');
  // ---- hay rack at the left: a wooden frame and lattice stuffed with hay
  const rx = 8, ry = 8, rw = 26, rh = 38;
  for (let k = 0; k < 140; k++) R(ctx, rng.int(rx + 2, rx + rw - 3), rng.int(ry + 2, ry + rh - 4), rng.int(1, 4), 1, rng.pick([STRAW[2], STRAW[3], STRAW[4], STRAW[5], '#a89a40']));
  for (let x = rx + 3; x < rx + rw - 2; x += 5) { R(ctx, x, ry + 2, 1, rh - 4, HW.p1); R(ctx, x + 1, ry + 2, 1, rh - 4, HW.p5); }
  for (let y = ry + 6; y < ry + rh - 3; y += 7) { R(ctx, rx + 2, y, rw - 4, 1, HW.p1); R(ctx, rx + 2, y - 1, rw - 4, 1, HW.p5); }
  post(ctx, rx, ry, 3, rh); post(ctx, rx + rw - 3, ry, 3, rh);
  R(ctx, rx - 1, ry, rw + 2, 3, HW.k); R(ctx, rx, ry, rw, 2, HW.p5); R(ctx, rx, ry, rw, 1, HW.p6);
  for (let k = 0; k < 26; k++) { const x = rng.int(rx + 1, rx + rw - 2); R(ctx, x, ry - rng.int(1, 4), 1, rng.int(2, 4), rng.pick([STRAW[3], STRAW[4], STRAW[5]])); }
  for (let k = 0; k < 40; k++) R(ctx, rng.int(rx - 4, rx + rw + 8), rng.int(FLOOR_Y + 1, FLOOR_Y + 9), rng.int(2, 5), 1, rng.pick([STRAW[3], STRAW[4], STRAW[5]]));
  // ---- the hide box at the right: planks, a hay-thatched roof, an arched door
  const bx = 176, by = 22, bw = 42, bh = 32;
  R(ctx, bx - 1, by - 1, bw + 2, bh + 2, HW.k);
  for (let y = by, i = 0; y < by + bh; y += 6, i++) {
    R(ctx, bx, y, bw, 6, i % 2 ? HW.p4 : HW.p3);
    R(ctx, bx, y, bw, 1, HW.p5); R(ctx, bx, y + 5, bw, 1, HW.p1);
    for (let k = 0; k < 3; k++) R(ctx, bx + rng.int(1, bw - 8), y + rng.int(2, 4), rng.int(3, 7), 1, HW.p2);
  }
  R(ctx, bx, by, 2, bh, HW.p6); R(ctx, bx + bw - 2, by, 2, bh, HW.p2);
  // the door: a dark arch with a lip of worn wood
  const dx = bx + 13, dw = 16, dy = by + 10;
  for (let y = dy; y < by + bh; y++) {
    const t = y - dy, half = t < 6 ? Math.round(Math.sqrt(Math.max(0, 36 - (6 - t) * (6 - t))) * (dw / 12)) : dw / 2;
    R(ctx, dx + dw / 2 - half - 1, y, half * 2 + 2, 1, HW.p1);
    R(ctx, dx + dw / 2 - half, y, half * 2, 1, y < dy + 3 ? '#140c08' : '#0d0806');
  }
  if (o.nest) for (let k = 0; k < 22; k++) R(ctx, rng.int(dx, dx + dw - 2), rng.int(by + bh - 6, by + bh - 1), rng.int(2, 3), 1, rng.pick([STRAW[4], STRAW[5], '#f6ead0', '#e6d3a5']));
  // thatch roof
  for (let y = 0; y < 8; y++) {
    const w = bw + 8 - y;
    R(ctx, bx - 4 + Math.round(y / 2), by - 8 + y, w, 1, STRAW[y < 2 ? 4 : y < 5 ? 3 : 2]);
  }
  for (let k = 0; k < 60; k++) R(ctx, rng.int(bx - 4, bx + bw + 3), rng.int(by - 9, by - 1), 1, rng.int(1, 3), rng.pick([STRAW[1], STRAW[2], STRAW[5]]));
  R(ctx, bx - 4, by - 1, bw + 8, 1, STRAW[0]);
  R(ctx, bx, by + bh + 1, bw, 2, 'rgba(20,10,0,0.35)');
  // ---- food bowl (pellets) and water bowl
  bowl(ctx, 86, 70, 9, 3, '#2a3a8a', '#4a6ad0', '#8aa8ff', (x, y) => { for (let k = 0; k < 12; k++) R(ctx, x + rng.int(-6, 6), y + rng.int(-1, 0), 1, 1, rng.pick(['#c8782a', '#e8a040', '#8a4a1a'])); });
  bowl(ctx, 58, 64, 7, 2, '#3d3844', '#73697b', '#a8a2b0', (x, y) => { R(ctx, x - 5, y - 1, 11, 2, PAL.frost1); R(ctx, x - 3, y - 1, 3, 1, PAL.frost3); });
  // ---- linen cloth at the right where the bodies are laid
  if (o.cloth) {
    R(ctx, 166, 64, 56, 18, PAL.parch0); R(ctx, 167, 64, 54, 16, PAL.parch1); R(ctx, 167, 64, 54, 1, PAL.parch2);
    for (let x = 174; x < 220; x += 9) { R(ctx, x, 66, 1, 5, PAL.parch0); R(ctx, x + 1, 71, 1, 5, PAL.parch0); }
    for (let x = 167; x < 221; x += 2) R(ctx, x, 79, 1, 1, PAL.parch2);
  }
  // soft vignette
  for (let x = 0; x < 10; x++) { const a = (0.28 * (1 - x / 10)).toFixed(3); R(ctx, x, 0, 1, H, `rgba(8,4,2,${a})`); R(ctx, W - 1 - x, 0, 1, H, `rgba(8,4,2,${a})`); }
}

/** A round bowl seen from the front, with its contents. @param {CanvasRenderingContext2D} ctx */
function bowl(ctx, x, y, rx, ry, dark, mid, hi, fill) {
  R(ctx, x - rx - 1, y - ry - 1, rx * 2 + 3, ry * 2 + 5, 'rgba(20,10,0,0.25)');
  for (let yy = -ry; yy <= ry; yy++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(ctx, x - w - 1, y + yy, w * 2 + 3, 1, HW.k); }
  R(ctx, x - rx, y, rx * 2 + 1, 4, HW.k);
  R(ctx, x - rx + 1, y, rx * 2 - 1, 3, mid); R(ctx, x - rx + 1, y + 2, rx * 2 - 1, 1, dark); R(ctx, x - rx + 2, y, 2, 2, hi);
  for (let yy = -ry + 1; yy < 1; yy++) { const w = Math.round((rx - 1) * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(ctx, x - w, y + yy, w * 2 + 1, 1, dark); }
  fill(x, y);
}

/**
 * The front rail of the pen, drawn over the rabbits.
 * @param {CanvasRenderingContext2D} ctx
 */
export function paintHutchFront(ctx) {
  const W = HUTCH_W, H = HUTCH_H;
  R(ctx, 0, RAIL_Y - 1, W, H - RAIL_Y + 1, HW.k);
  R(ctx, 0, RAIL_Y, W, H - RAIL_Y, HW.p3);
  R(ctx, 0, RAIL_Y, W, 1, HW.p6); R(ctx, 0, RAIL_Y + 1, W, 1, HW.p5);
  R(ctx, 0, H - 2, W, 2, HW.p1);
  for (let x = 6; x < W; x += 13) R(ctx, x, RAIL_Y + 3 + (x % 3), 7, 1, HW.p2);
  for (const x of [2, 56, 112, 168, W - 8]) post(ctx, x, RAIL_Y - 7, 6, H - RAIL_Y + 7);
}

/**
 * The colony's hutch. Feed it entries with sync(), step it with update(dt),
 * paint it with draw(); hit() maps a pointer in art pixels to a rabbit id.
 */
export class HutchScene {
  /**
   * @param {{canvas?:(w:number, h:number) => any, sprites?:boolean}} [opts]
   *   canvas: canvas maker for the cached background and the rabbit sprites
   *   (default makeCanvas when a DOM exists; without one the background is
   *   painted straight into the target every frame); sprites: false draws
   *   every rabbit rect by rect (tests).
   */
  constructor(opts = {}) {
    this.factory = opts.canvas || null;
    this.sprites = opts.sprites !== false;
    /** @type {Map<string, Actor>} */
    this.actors = new Map();
    this.steps = 0;
    this.nest = false;
    this.cloth = false;
    /** @type {any} */
    this.bg = null;
    this.bgKey = '';
    /** @type {any} */
    this.fg = null;
    /** claw marks where a feral rabbit struck: art pixels and age (s) */
    /** @type {{x:number, y:number, t:number}[]} */
    this.clashes = [];
  }

  /**
   * Take the colony as it is now: [{id, look, snap, mother?}], living and dead.
   * Rabbits keep their place and what they are doing across syncs.
   * @param {{id:string, look:any, snap:any, mother?:string|null, parents?:string[]|null}[]} entries
   */
  sync(entries) {
    const seen = new Set();
    let bodies = 0, nest = false;
    for (const e of Array.isArray(entries) ? entries : []) {
      if (!e || e.id == null || !e.look || !e.snap) continue;
      const id = String(e.id);
      if (seen.has(id)) continue;
      seen.add(id);
      let a = this.actors.get(id);
      if (!a) { a = this._spawn(id, e); this.actors.set(id, a); }
      a.look = e.look;
      a.snap = e.snap;
      a.L = rabbitLevels(e.snap);
      a.mother = e.mother != null ? String(e.mother) : Array.isArray(e.parents) && e.parents[0] ? String(e.parents[0]) : null;
      const alive = e.snap.alive !== false;
      if (!alive) {
        const slot = SLOTS[bodies++];
        a.hidden = !slot;
        if (slot) { a.x = slot[0]; a.y = slot[1]; }
        a.act = 'dead'; a.pose = null; a.face = 1; a.hops = 0;
      } else {
        if (!a.alive) this._place(a);
        a.hidden = false;
        if (e.snap.preg) nest = true;
      }
      a.alive = alive;
    }
    for (const id of [...this.actors.keys()]) if (!seen.has(id)) this.actors.delete(id);
    this.nest = nest;
    this.cloth = bodies > 0;
  }

  /** Advance every living rabbit's behaviour by dt seconds (clamped to 0.1). @param {number} dt */
  update(dt) {
    const d = Number.isFinite(dt) ? clamp(dt, 0, 0.1) : 0;
    this.steps++;
    for (const a of this.actors.values()) {
      if (a.react > 0) a.react = Math.max(0, a.react - d * 1.25);
      if (a.alive) this._tick(a, d);
    }
    for (const c of this.clashes) c.t += d;
    this.clashes = this.clashes.filter((c) => c.t < 0.9);
  }

  /**
   * A feral rabbit lunges at another: it dashes over, the victim flinches
   * and claw marks flash where it was struck.
   * @param {string} fromId @param {string} toId
   */
  attack(fromId, toId) {
    const a = this.actors.get(String(fromId)), v = this.actors.get(String(toId));
    if (!v || v.hidden) return;
    v.react = 1;
    v.reactCh = [];
    const b = this._box(v);
    this.clashes.push({ x: Math.round((b.x0 + b.x1) / 2), y: Math.round((b.y0 + b.y1) / 2), t: 0 });
    if (a && a.alive && !a.hidden && a.act !== 'collapse' && a.act !== 'frozen') {
      const side = a.x < v.x ? -1 : 1;
      this._hopTo(a, this._roam(v.x + side * 10, v.y), 3, true);
    }
  }

  /**
   * A pat or a dose landing on a rabbit: it hops on the spot and flashes
   * the channels given (drawRabbit's react).
   * @param {string} id @param {string[]} [channels]
   */
  poke(id, channels = []) {
    const a = this.actors.get(String(id));
    if (!a || !a.alive || a.act === 'collapse' || a.act === 'frozen') return;
    a.react = 1;
    a.reactCh = channels.slice();
    a.next = null;
    this._hopTo(a, { x: a.x + a.face * 2, y: a.y }, 1, false);
  }

  /**
   * Paint the hutch.
   * @param {CanvasRenderingContext2D} ctx a 192×72 art-resolution context
   * @param {number} t seconds
   * @param {{selected?:string|null, hover?:string|null, low?:boolean}} [o]
   */
  draw(ctx, t, o = {}) {
    const low = !!o.low;
    this._background(ctx);
    const list = this._visible();
    for (const a of list) {
      const f = this._frame(a);
      drawRabbit(ctx, a.look, a.snap, t + a.phase, a.react, {
        x: f.x, y: f.y, lift: f.lift, mirror: f.mirror, pose: a.pose || undefined, react: a.reactCh,
        quality: low ? 'low' : 'high', clear: false, floor: false, clip: false, flash: false, hop: false,
        cache: this.sprites, factory: this.factory || undefined,
      });
    }
    // feral rabbits: a red glare over the head; claw marks where they struck
    for (const a of list) {
      if (!a.alive || !a.snap.ag) continue;
      const f = this._frame(a), hx = f.mirror ? f.x + RABBIT_W - 1 - f.an.head.cx : f.x + f.an.head.cx;
      const y = Math.max(2, f.y + f.an.top - f.lift - 3);
      const on = Math.floor(t * 6 + a.phase) % 2 === 0;
      R(ctx, hx - 4, y, 2, 1, on ? '#ff3a2a' : '#a8241a'); R(ctx, hx + 3, y, 2, 1, on ? '#ff3a2a' : '#a8241a');
      R(ctx, hx - 3, y - 1, 1, 1, '#ff3a2a'); R(ctx, hx + 3, y - 1, 1, 1, '#ff3a2a');
    }
    for (const c of this.clashes) {
      const k = c.t < 0.45 ? '#ff3a2a' : '#a8241a';
      for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) R(ctx, c.x - 4 + i * 3 + j, c.y - 3 + j, 1, 1, j === 2 ? '#fff0e0' : k);
      if (c.t < 0.3) for (let i = 0; i < 6; i++) R(ctx, c.x + Math.round(Math.cos(i) * (4 + c.t * 20)), c.y + Math.round(Math.sin(i * 1.7) * (3 + c.t * 10)), 1, 1, '#f6ead0');
    }
    this._front(ctx);
    const hov = o.hover != null ? this.actors.get(String(o.hover)) : null;
    if (hov && !hov.hidden) {
      const b = this._box(hov), rx = Math.max(6, Math.round((b.x1 - b.x0) / 2) - 3);
      for (let i = 0; i < 12; i++) {
        const ang = (i * Math.PI) / 6;
        R(ctx, Math.round(hov.x + Math.cos(ang) * rx), Math.round(hov.y + 1 + Math.sin(ang) * 2), 1, 1, PAL.brassHi);
      }
    }
    const sel = o.selected != null ? this.actors.get(String(o.selected)) : null;
    if (sel && !sel.hidden) {
      // a brass marker bobbing over the selected rabbit's head
      const f = this._frame(sel), hx = f.mirror ? f.x + RABBIT_W - 1 - f.an.head.cx : f.x + f.an.head.cx;
      const y = Math.max(4, f.y + f.an.top - f.lift - 5 + Math.round(Math.sin(t * 4)));
      R(ctx, hx - 3, y - 1, 7, 2, '#1a1218'); R(ctx, hx - 2, y + 1, 5, 1, '#1a1218'); R(ctx, hx - 1, y + 2, 3, 1, '#1a1218'); R(ctx, hx, y + 3, 1, 1, '#1a1218');
      R(ctx, hx - 2, y, 5, 1, PAL.brass); R(ctx, hx - 1, y + 1, 3, 1, PAL.brass); R(ctx, hx, y + 2, 1, 1, PAL.brass); R(ctx, hx - 2, y, 2, 1, PAL.brassHi);
    }
  }

  /**
   * The rabbit under a point in art pixels (the topmost, by depth), or null.
   * Boxes are generous: 3px around the drawn rabbit, 6px for kits.
   * @param {number} x @param {number} y @returns {string|null}
   */
  hit(x, y) {
    const list = this._visible();
    for (let i = list.length - 1; i >= 0; i--) {
      const b = this._box(list[i]);
      if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) return list[i].id;
    }
    return null;
  }

  /** The hit box of a rabbit in art pixels, or null. @param {string} id */
  boxOf(id) {
    const a = this.actors.get(String(id));
    return a && !a.hidden ? this._box(a) : null;
  }

  /** Feet position, facing and current act of a rabbit (for the UI and tests), or null. @param {string} id */
  where(id) {
    const a = this.actors.get(String(id));
    return a ? { x: Math.round(a.x), y: Math.round(a.y), face: a.face, act: a.act, hidden: a.hidden } : null;
  }

  // ---------------------------------------------------------------- internals

  /** @param {string} id @param {any} e @returns {Actor} */
  _spawn(id, e) {
    const r = new Rng(hashString(`hutch:${id}:${e.look.seed}`));
    /** @type {Actor} */
    const a = {
      id, look: e.look, snap: e.snap, L: rabbitLevels(e.snap), mother: null, alive: e.snap.alive !== false, hidden: false,
      x: 0, y: 0, face: r.chance(0.5) ? 1 : -1, act: 'idle', at: 0, dur: r.range(0.3, 2), pose: null,
      hops: 0, hopT: 0.34, hopH: 4, step: 8, sx: 0, sy: 0, tx: 0, ty: 0, gx: 0, gy: 0, next: null,
      n: 0, phase: r.range(0, 10), react: 0, reactCh: [], anSnap: null, anPose: null, an: null,
    };
    a.x = r.int(ROAM.x0, ROAM.x1);
    a.y = r.int(ROAM.y0, ROAM.y1);
    return a;
  }

  /** Put a rabbit back on the straw (it came back from the cloth). @param {Actor} a */
  _place(a) {
    const r = new Rng(hashString(`hutch:place:${a.id}:${a.n++}`));
    a.x = r.int(ROAM.x0, ROAM.x1); a.y = r.int(ROAM.y0, ROAM.y1);
    a.act = 'idle'; a.at = 0; a.dur = 1; a.pose = null; a.hops = 0;
  }

  /** @param {Actor} a @param {number} dt */
  _tick(a, dt) {
    const L = a.L, snap = a.snap;
    if (L.death === 3 || snap.hp >= 3) { a.act = 'collapse'; a.pose = null; return; } // too weak to move
    if (L.frost === 3) { a.act = 'frozen'; a.pose = null; return; } // frozen stiff
    if (a.act === 'collapse' || a.act === 'frozen') this._begin(a, 'idle', 0.5);
    a.at += dt * rabbitPace(snap);
    if (a.act === 'hop' || a.act === 'zoom') {
      const p = Math.min(1, a.at / a.hopT);
      a.x = a.sx + (a.tx - a.sx) * p;
      a.y = a.sy + (a.ty - a.sy) * p;
      if (p < 1) return;
      if (--a.hops > 0 && this._nextHop(a)) return;
      if (a.next === 'eat') { a.next = null; this._begin(a, 'eat', 2.6); } else this._decide(a);
      return;
    }
    if (a.act === 'float') {
      const dx = a.gx - a.x, dy = a.gy - a.y, d = Math.hypot(dx, dy), s = Math.min(d, 6 * dt);
      if (d > 0.5) { a.x += (dx / d) * s; a.y += (dy / d) * s; if (Math.abs(dx) > 1) a.face = dx > 0 ? 1 : -1; }
    }
    if (a.at >= a.dur) this._decide(a);
  }

  /** Pick the next act from the rabbit's own seeded stream. @param {Actor} a */
  _decide(a) {
    const r = new Rng(hashString(`${a.id}:${a.look.seed}:${a.n++}`));
    const L = a.L, kit = a.snap.stage === 'kit';
    const sick = L.toxicity >= 2 || a.snap.hp >= 2;
    a.next = null;
    if (a.snap.ag && r.chance(0.6)) {
      // feral: stalk another rabbit
      const others = [...this.actors.values()].filter((o) => o !== a && o.alive && !o.hidden);
      if (others.length) { const o = r.pick(others); return this._hopTo(a, this._roam(o.x - 9 * Math.sign(o.x - a.x || 1), o.y), 3, true); }
    }
    if (sick && r.chance(0.8)) return this._begin(a, 'loaf', r.range(3, 6));
    if (L.arcana === 3 && r.chance(0.45)) {
      const g = this._goal(a, r, 26);
      a.gx = g.x; a.gy = g.y;
      return this._begin(a, 'float', r.range(2.5, 4));
    }
    if ((L.fire === 3 || L.vitality === 3) && r.chance(0.4)) return this._hopTo(a, this._goal(a, r, 60), 4, true);
    if (L.strength >= 2 && r.chance(0.3)) return this._begin(a, 'flex', r.range(1.2, 2));
    if ((L.love >= 2 || L.vitality >= 2) && a.snap.hp === 0 && r.chance(0.25)) return this._begin(a, 'flop', r.range(2.5, 4.5));
    const pick = r.weighted(['idle', 'hop', 'groom', 'eat', 'sniff'], [3, 3, 1.5, 1.2, 1.5]);
    if (pick === 'hop') return this._hopTo(a, this._goal(a, r, 30), kit ? 2 : r.int(1, 3), false);
    if (pick === 'eat') {
      const dx = RACK.x - a.x, dy = RACK.y - a.y;
      if (Math.hypot(dx, dy) <= 4) return this._begin(a, 'eat', r.range(2, 3.5));
      a.next = 'eat';
      return this._hopTo(a, { x: RACK.x + r.int(-3, 3), y: RACK.y + r.int(0, 3) }, 16, false);
    }
    const dur = pick === 'idle' ? r.range(1.2, 3.5) * (kit ? 0.6 : 1) : pick === 'groom' ? r.range(1.5, 2.5) : r.range(0.8, 1.4);
    return this._begin(a, pick, dur);
  }

  /** @param {Actor} a @param {string} act @param {number} dur */
  _begin(a, act, dur) {
    a.act = act; a.at = 0; a.dur = dur; a.hops = 0;
    a.pose = act === 'loaf' ? 'loaf' : act === 'flex' ? 'rear' : act === 'flop' ? 'flop' : null;
    if (act === 'eat') a.face = -1;
  }

  /** Where to go next: kits trail their mother, the lovestruck seek company. @param {Actor} a @param {Rng} r @param {number} range */
  _goal(a, r, range) {
    const mom = a.snap.stage === 'kit' && a.mother ? this.actors.get(a.mother) : null;
    if (mom && mom.alive && !mom.hidden) return this._roam(mom.x - mom.face * 9 + r.int(-3, 3), mom.y + r.int(0, 3));
    if (a.L.love >= 2 && r.chance(0.5)) {
      let best = null, bd = Infinity;
      for (const o of this.actors.values()) {
        if (o === a || !o.alive || o.hidden) continue;
        const d = Math.hypot(o.x - a.x, o.y - a.y);
        if (d < bd) { bd = d; best = o; }
      }
      if (best) return this._roam(best.x - 9 * Math.sign(best.x - a.x || 1), best.y + r.int(-2, 2));
    }
    return this._roam(a.x + r.range(-range, range), a.y + r.range(-range / 3, range / 3));
  }

  /** @param {number} x @param {number} y */
  _roam(x, y) {
    return { x: clamp(x, ROAM.x0, ROAM.x1), y: clamp(y, ROAM.y0, ROAM.y1) };
  }

  /** Start a run of hops toward a goal. @param {Actor} a @param {{x:number, y:number}} goal @param {number} n @param {boolean} zoom */
  _hopTo(a, goal, n, zoom) {
    const kit = a.snap.stage === 'kit';
    a.act = zoom ? 'zoom' : 'hop'; a.pose = null;
    a.gx = goal.x; a.gy = goal.y; a.hops = n;
    a.hopT = zoom ? 0.17 : 0.34; a.hopH = kit ? 2 : zoom ? 5 : 4;
    a.step = (kit ? 5 : 8) * (zoom ? 1.7 : 1);
    if (!this._nextHop(a)) this._begin(a, 'idle', 0.6);
  }

  /** Plan the next hop of a run; false when already there. @param {Actor} a */
  _nextHop(a) {
    const dx = a.gx - a.x, dy = a.gy - a.y, d = Math.hypot(dx, dy);
    if (d < 0.5 && a.hops <= 0) return false;
    const len = Math.min(a.step, d);
    a.sx = a.x; a.sy = a.y;
    a.tx = d > 0 ? a.x + (dx / d) * len : a.x;
    a.ty = d > 0 ? a.y + (dy / d) * len : a.y;
    if (Math.abs(dx) > 0.5) a.face = dx > 0 ? 1 : -1;
    a.at = 0;
    if (d < 0.5) a.hops = 1; // a hop on the spot (a poke), then stop
    return true;
  }

  /** @param {Actor} a */
  _anchors(a) {
    if (a.an && a.anSnap === a.snap && a.anPose === a.pose) return a.an;
    a.an = rabbitAnchors(a.look, a.snap, a.pose || undefined);
    a.anSnap = a.snap; a.anPose = a.pose;
    return a.an;
  }

  /** Frame origin, lift and facing of a rabbit as drawn now. @param {Actor} a */
  _frame(a) {
    const an = this._anchors(a), mirror = a.face < 0;
    let lift = 0, nx = 0, ny = 0;
    if (a.act === 'hop' || a.act === 'zoom') lift = Math.round(a.hopH * Math.sin(Math.PI * Math.min(1, a.at / a.hopT)));
    else if (a.act === 'groom') ny = Math.floor(a.at * 5) & 1;
    else if (a.act === 'eat') ny = Math.floor(a.at * 4) & 1;
    else if (a.act === 'sniff') nx = (Math.floor(a.at * 8) & 1) * a.face;
    const x = Math.round(a.x) - (mirror ? RABBIT_W - 1 - an.cx : an.cx) + nx;
    const y = Math.round(a.y) - an.feetY + ny;
    return { x, y, lift, mirror, an };
  }

  /** @param {Actor} a */
  _box(a) {
    const f = this._frame(a), b = f.an.box, pad = a.snap.stage === 'kit' ? 6 : 3;
    const x0 = f.mirror ? f.x + RABBIT_W - 1 - b.x1 : f.x + b.x0, x1 = f.mirror ? f.x + RABBIT_W - 1 - b.x0 : f.x + b.x1;
    return { x0: x0 - pad, y0: f.y + b.y0 - f.lift - pad, x1: x1 + pad, y1: f.y + b.y1 + pad };
  }

  /** Drawn rabbits in depth order (feet y, then id). */
  _visible() {
    return [...this.actors.values()].filter((a) => !a.hidden).sort((p, q) => p.y - q.y || (p.id < q.id ? -1 : p.id > q.id ? 1 : 0));
  }

  /** @param {CanvasRenderingContext2D} ctx */
  _front(ctx) {
    const factory = this.factory || (typeof document !== 'undefined' ? makeCanvas : null);
    if (!factory) { paintHutchFront(ctx); return; }
    if (!this.fg) { this.fg = factory(HUTCH_W, HUTCH_H); paintHutchFront(this.fg.getContext('2d')); }
    ctx.drawImage(this.fg, 0, 0);
  }

  /** @param {CanvasRenderingContext2D} ctx */
  _background(ctx) {
    const o = { nest: this.nest, cloth: this.cloth };
    const factory = this.factory || (typeof document !== 'undefined' ? makeCanvas : null);
    if (!factory) { paintHutch(ctx, o); return; }
    const key = `${o.nest ? 1 : 0}${o.cloth ? 1 : 0}`;
    if (!this.bg || this.bgKey !== key) {
      this.bg = factory(HUTCH_W, HUTCH_H);
      paintHutch(this.bg.getContext('2d'), o);
      this.bgKey = key;
    }
    ctx.drawImage(this.bg, 0, 0);
  }
}
