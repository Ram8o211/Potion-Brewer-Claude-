// Wild rabbits in the wilds: a few hop about each region's open ground,
// grazing and resting between calm hops. A tap on one wounds it: blood
// bursts from where it was struck, and from then on it bleeds — drips as it
// runs, spurts as it lands, a trail of it on the ground behind — and it
// flees in long, quick bounds that hardly stop (even a tap that misses close
// by sets it running so). Three wounds bring it down: it lies there
// bleeding, still alive, and is caught by a tap (it goes home to the hutch,
// weak from its wounds); left lying, or struck again with the hutch full,
// it dies, and its body can be carried home for its remains.
//
// Every drop of blood is a particle under gravity; where it meets the
// ground, rock or a trunk it stains it (`stains`, painted by the view onto
// the scene for as long as the player stays in the wilds), and where it
// falls in water it clouds it. Pure (no DOM): the scene is given as
// `solid` / `liquid` tests, so the whole thing runs in Node too.

import { Rng, hashString } from '../core/rng.js';
import { rollLook } from './colony.js';

/** Pull of gravity on a rabbit and on blood, scene pixels per second². */
export const HOP_GRAVITY = 300, BLOOD_GRAVITY = 260;
/** Wounds that bring a rabbit down. */
export const WILD_HP = 3;
/** Seconds a downed rabbit lives on, bleeding, before it dies. */
export const BLEED_OUT = 10;
/** How close (scene pixels) a tap that misses must come to set a rabbit running. */
export const NEAR_MISS = 24;
/** How many rabbits a region keeps, and how soon (seconds) a new one comes in from the edge. */
export const WARREN_SIZE = { forest: 4, meadow: 5, river: 3, netherwood: 3, quarry: 2, moonfen: 3, crags: 2 };
export const RESPAWN = 25;

/** The blood's colours, fresh to dark. */
export const BLOOD = ['#b0141c', '#8e0c14', '#6c060e', '#c8202a', '#54040a'];

/**
 * @typedef {(x:number, y:number) => boolean} Test  whether the scene pixel (x, y) is something (ground, water)
 * @typedef {{x:number, y:number, vx:number, vy:number, t:number, s:number, c:string}} Drop
 * @typedef {{x:number, y:number, c:string}} Stain  a pixel of the scene coloured by blood
 * @typedef {{x:number, y:number, t:number, r:number}} Cloud  blood spreading in water
 */

/** A wild rabbit's look: mostly the coats of the wild (agouti, grey, brown), upright ears. @param {Rng} rng */
export function wildLook(rng) {
  const look = rollLook(rng);
  const coats = [[0.55, 0.42, 0.3], [0.6, 0.58, 0.62], [0.47, 0.36, 0.26], [0.36, 0.24, 0.18], [0.66, 0.54, 0.4]];
  look.coat = coats[rng.int(0, coats.length - 1)].slice();
  look.coat2 = rng.chance(0.7) ? [0.93, 0.89, 0.82] : [0.2, 0.18, 0.2];
  look.pattern = rng.chance(0.65) ? 'agouti' : 'solid';
  look.ear = rng.chance(0.85) ? 'upright' : 'half';
  look.eye = 'dark';
  return look;
}

export class WildRabbit {
  /** @param {string} id @param {number} x @param {number} y its feet (scene pixels) @param {Rng} rng */
  constructor(id, x, y, rng) {
    this.id = id;
    this.look = wildLook(rng);
    /** @type {'f'|'m'} */
    this.sex = rng.chance(0.5) ? 'f' : 'm';
    this.x = x; this.y = y; this.vx = 0; this.vy = 0;
    this.air = false;
    /** which way it faces: 1 right, -1 left */
    this.face = rng.chance(0.5) ? 1 : -1;
    /** seconds before its next hop */
    this.rest = rng.range(0.2, 2.5);
    /** what it does while resting: sit, graze or rear up */
    this.pose = /** @type {string|null} */ (null);
    this.hits = 0;
    /** frantic since the first attempt on its life: it bounds about fast and hardly stops */
    this.alarm = false;
    /** where the danger came from (it flees away from it) */
    this.from = x;
    this.down = false;
    this.dead = false;
    /** seconds since it went down */
    this.downT = 0;
    /** where it was struck, relative to its feet (facing right) @type {[number, number][]} */
    this.wounds = [];
    /** seconds to the next drip, and to the next spurt */
    this.drip = 0;
    this.spurt = 0.6;
    /** the flinch of a blow (fades) */
    this.react = 0;
    this.t = rng.range(0, 10);
  }

  /** How badly it is hurt, as the renderer's health band (0 healthy … 3 down). */
  get band() {
    return this.dead || this.down ? 3 : Math.min(2, this.hits);
  }

  /** Whether it is still up and about. */
  get running() {
    return !this.dead && !this.down;
  }

  /** The box it is struck in (scene pixels): its body round its feet. @param {number} [pad] */
  box(pad = 0) {
    const lying = this.dead || this.down;
    // (a wild rabbit is drawn at half the hutch's size: about 18 scene pixels long)
    return lying
      ? { x0: this.x - 8 - pad, y0: this.y - 6 - pad, x1: this.x + 8 + pad, y1: this.y + 1 + pad }
      : { x0: this.x - 7 - pad, y0: this.y - 11 - pad, x1: this.x + 7 + pad, y1: this.y + 1 + pad };
  }
}

export class Warren {
  /**
   * The rabbits of a region.
   * @param {string} region @param {string} seed
   * @param {{solid:Test, liquid:Test, W:number, H:number, spots:[number, number][]}} scene its ground and the spots a rabbit may start on
   */
  constructor(region, seed, scene) {
    this.region = region;
    this.solid = scene.solid; this.liquid = scene.liquid;
    this.W = scene.W; this.H = scene.H;
    this.spots = scene.spots;
    this.rng = new Rng(hashString(`warren:${seed}:${region}`));
    this.serial = 0;
    /** @type {WildRabbit[]} */
    this.rabbits = [];
    /** blood in flight @type {Drop[]} */
    this.drops = [];
    /** pixels newly stained since the view last took them @type {Stain[]} */
    this.stains = [];
    /** blood spreading in water @type {Cloud[]} */
    this.clouds = [];
    /** seconds until a newcomer arrives */
    this.due = RESPAWN;
    this.size = WARREN_SIZE[region] ?? 3;
    for (let i = 0; i < this.size && this.spots.length; i++) this.add();
  }

  /** A new rabbit at a random spot (or, coming in, at an edge of the scene). @param {boolean} [edge] */
  add(edge = false) {
    if (!this.spots.length) return null;
    let at = this.spots[this.rng.int(0, this.spots.length - 1)];
    if (edge) {
      // the open spot nearest one side or the other
      const left = this.rng.chance(0.5);
      at = this.spots.reduce((b, s) => (left ? s[0] < b[0] : s[0] > b[0]) ? s : b, at);
    }
    const r = new WildRabbit(`${this.region}-${++this.serial}`, at[0], at[1], this.rng);
    if (edge) { r.face = at[0] < this.W / 2 ? 1 : -1; r.rest = 0.1; }
    this.rabbits.push(r);
    return r;
  }

  /** The rabbit under a scene point (nearest where boxes overlap), grown to a fingertip. @param {number} x @param {number} y @param {number} [pad] */
  at(x, y, pad = 4) {
    let best = null, bd = Infinity;
    for (const r of this.rabbits) {
      const b = r.box(pad);
      if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) continue;
      const d = (x - r.x) ** 2 + (y - r.y + 5) ** 2;
      if (d < bd) { bd = d; best = r; }
    }
    return best;
  }

  /** The running rabbits near a point (a tap that missed them). @param {number} x @param {number} y */
  near(x, y) {
    return this.rabbits.filter((r) => r.running && Math.hypot(r.x - x, r.y - 5 - y) <= NEAR_MISS);
  }

  /**
   * An attempt on a rabbit's life that missed: it bolts, and is frantic from then on.
   * @param {WildRabbit} r @param {number} x where the blow fell
   */
  scare(r, x) {
    if (!r.running) return;
    r.alarm = true;
    r.from = x;
    r.pose = null;
    if (!r.air) r.rest = 0;
  }

  /**
   * A blow on a rabbit at (x, y): blood bursts from the wound, away from the
   * blow and up; it flees; the third wound brings it down, and a blow on one
   * already down kills it.
   * @param {WildRabbit} r @param {number} x @param {number} y
   * @returns {'wounded'|'down'|'killed'|null}
   */
  strike(r, x, y) {
    if (r.dead) return null;
    const b = r.box();
    // the wound, on its body where the blow fell (as if it faced right)
    const wx = Math.max(b.x0 + 2, Math.min(b.x1 - 2, x)) - r.x, wy = Math.max(b.y0 + 2, Math.min(b.y1 - 2, y)) - r.y;
    r.wounds.push([wx * r.face, wy]);
    if (r.wounds.length > 6) r.wounds.shift();
    r.hits++;
    r.react = 1;
    const side = x < r.x ? 1 : -1;
    this.burst(r.x + wx, r.y + wy, side, 18 + r.hits * 8, 1);
    if (r.down) { this.kill(r); return 'killed'; }
    r.alarm = true;
    r.from = x;
    r.pose = null;
    if (r.hits >= WILD_HP) {
      r.down = true;
      r.downT = 0;
      r.vx *= 0.3;
      return 'down';
    }
    // it leaps away at once
    if (!r.air) r.rest = 0;
    return 'wounded';
  }

  /** It dies where it lies: a last gush, and the blood pools under it. @param {WildRabbit} r */
  kill(r) {
    if (r.dead) return;
    r.dead = true; r.down = false;
    r.react = 0.6;
    this.burst(r.x, r.y - 3, 0, 16, 0.6);
  }

  /** Take a rabbit out of the scene (caught, or its body carried off). @param {WildRabbit} r */
  remove(r) {
    this.rabbits = this.rabbits.filter((q) => q !== r);
  }

  /**
   * Blood thrown from (x, y): `side` the way it flies (0 every way),
   * `n` drops, `force` how hard.
   * @param {number} x @param {number} y @param {number} side @param {number} n @param {number} force
   */
  burst(x, y, side, n, force) {
    const rng = this.rng;
    for (let i = 0; i < n; i++) {
      const dir = side || (rng.chance(0.5) ? 1 : -1), v = (40 + rng.next() * 90) * force;
      const a = rng.range(-1.35, 0.25);
      this.drops.push({
        x: x + rng.range(-1, 1), y: y + rng.range(-1, 1),
        vx: dir * Math.cos(a) * v * (side ? 1 : rng.range(0.3, 1)) + rng.range(-12, 12), vy: Math.sin(a) * v * 1.1 - rng.range(0, 20),
        t: 0, s: rng.chance(0.3) ? 2 : 1, c: BLOOD[rng.int(0, 3)],
      });
    }
  }

  /** A drop or two falling from a wound. @param {WildRabbit} r @param {number} n @param {number} [v] */
  bleed(r, n, v = 0) {
    const rng = this.rng;
    for (let i = 0; i < n; i++) {
      const w = r.wounds.length ? r.wounds[rng.int(0, r.wounds.length - 1)] : [0, -4];
      this.drops.push({
        x: r.x + w[0] * r.face + rng.range(-1, 1), y: r.y + w[1],
        vx: r.vx * 0.3 + rng.range(-10, 10) + (v ? -r.face * rng.range(10, 40) * v : 0), vy: v ? -rng.range(30, 70) * v : rng.range(-5, 10),
        t: 0, s: 1, c: BLOOD[rng.int(0, 4)],
      });
    }
  }

  /** Mark a scene pixel and the surface right round it as stained (where it is something). @param {number} x @param {number} y @param {string} c @param {number} spread */
  stain(x, y, c, spread) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || x >= this.W || y < 0 || y >= this.H) return;
    this.stains.push({ x, y, c });
    const rng = this.rng;
    for (let k = 0; k < spread; k++) {
      const sx = x + rng.int(-2, 2), sy = y + rng.int(-1, 1);
      if (sx >= 0 && sx < this.W && sy >= 0 && sy < this.H && this.solid(sx, sy)) this.stains.push({ x: sx, y: sy, c: BLOOD[rng.int(1, 4)] });
    }
  }

  /** The ground's top under (x, y): the first row at or below y with something under it. @param {number} x @param {number} y */
  floor(x, y) {
    let yy = Math.max(0, Math.round(y));
    const X = Math.round(x);
    while (yy < this.H - 1 && !this.solid(X, yy + 1)) yy++;
    return yy;
  }

  /**
   * The next hop of a rabbit standing on the ground: calm, a short one now
   * and then (or a turn, or it grazes); frantic, long fast bounds away from
   * the danger, hardly stopping, now and then doubling back.
   * @param {WildRabbit} r
   */
  hop(r) {
    const rng = this.rng;
    if (r.alarm) {
      // away from where the blow came from, zigzagging; a wall or the scene's edge turns it
      r.face = r.x < r.from ? -1 : 1;
      if (rng.chance(0.18)) r.face = -r.face;
      const speed = rng.range(78, 100) * (1 + 0.12 * Math.min(2, r.hits));
      r.vx = r.face * speed;
      r.vy = -rng.range(82, 108);
    } else {
      if (rng.chance(0.3)) r.face = -r.face;
      r.vx = r.face * rng.range(16, 30);
      r.vy = -rng.range(42, 58);
    }
    // the edges of the scene turn it back; so does water ahead (it will not jump in)
    const flight = (2 * -r.vy) / HOP_GRAVITY, lx = r.x + r.vx * flight;
    if (lx < 8 || lx > this.W - 8 || this.wet(lx, r.y)) { r.face = -r.face; r.vx = -r.vx; }
    r.air = true;
    r.pose = null;
    // a wounded one throws blood off as it bounds
    if (r.hits) this.bleed(r, 2 + r.hits * 2, 0.7);
  }

  /** Whether the ground round column x near row y is water (or lava). @param {number} x @param {number} y */
  wet(x, y) {
    const X = Math.round(x);
    for (let yy = Math.max(0, Math.round(y) - 24); yy < this.H; yy++) {
      if (this.liquid(X, yy)) return true;
      if (this.solid(X, yy)) return false;
    }
    return false;
  }

  /**
   * Everything on by dt seconds.
   * @param {number} dt
   */
  step(dt) {
    dt = Math.min(dt, 0.05);
    for (const r of this.rabbits) this.move(r, dt);
    // a newcomer now and then, until the region holds its share of the living
    const live = this.rabbits.filter((r) => r.running).length;
    if (live < this.size) { this.due -= dt; if (this.due <= 0) { this.add(true); this.due = RESPAWN; } }
    // and bodies beyond a few are left to the foxes
    const bodies = this.rabbits.filter((r) => r.dead);
    if (bodies.length > 3) this.remove(bodies[0]);
    this.flow(dt);
  }

  /** One rabbit on by dt. @param {WildRabbit} r @param {number} dt */
  move(r, dt) {
    const solid = this.solid;
    r.t += dt;
    r.react = Math.max(0, r.react - dt * 3);
    // its wounds bleed: drips, quicker the worse it is, and spurts with its heartbeat
    if (r.hits && !r.dead) {
      r.drip -= dt;
      if (r.drip <= 0) { this.bleed(r, 1 + (r.hits >> 1)); r.drip = (r.down ? 0.1 : 0.28) / r.hits; }
      r.spurt -= dt;
      if (r.spurt <= 0) {
        // a hemorrhage: jets with its heartbeat, harder the worse the wounds
        this.bleed(r, r.down ? 3 : 2 + r.hits * 2, r.down ? 0.5 : 0.5 + 0.25 * r.hits);
        r.spurt = r.down ? 0.9 : 0.75 - 0.1 * r.hits;
      }
    }
    if (r.dead && r.downT < 6) {
      // the blood pools under the body for a while
      r.downT += dt;
      if (Math.floor((r.downT - dt) * 5) !== Math.floor(r.downT * 5)) this.stain(r.x + this.rng.int(-6, 6), this.floor(r.x, r.y) + 1, BLOOD[this.rng.int(1, 4)], 1);
    }
    if (r.down) {
      r.downT += dt;
      if (r.downT >= BLEED_OUT) this.kill(r);
    }
    if (r.air) {
      r.vy += HOP_GRAVITY * dt;
      const nx = r.x + r.vx * dt;
      // a face in the way turns it back; a step up it climbs
      if (solid(Math.round(nx), Math.round(r.y) - 5) || nx < 4 || nx > this.W - 4) { r.vx = -r.vx * 0.4; r.face = r.vx < 0 ? -1 : r.vx > 0 ? 1 : r.face; }
      else {
        r.x = nx;
        for (let k = 0; k < 4 && solid(Math.round(r.x), Math.round(r.y)); k++) r.y--;
      }
      const ny = r.y + r.vy * dt;
      if (r.vy < 0) {
        if (solid(Math.round(r.x), Math.round(ny) - 12)) r.vy = 0; else r.y = ny;
      } else {
        // down until it meets the ground (every pixel on the way: it never falls through a thin ledge)
        let y = r.y, landed = false;
        while (y < ny) {
          const step = Math.min(1, ny - y);
          // (its feet stop on the air right over the ground)
          if (solid(Math.round(r.x), Math.round(y + step) + 1)) { y = Math.round(y + step); landed = true; break; }
          y += step;
        }
        r.y = Math.min(y, this.H - 2);
        if (landed || r.y >= this.H - 2) {
          r.air = false;
          r.y = Math.round(r.y);
          const hard = r.vy;
          r.vx = 0; r.vy = 0;
          r.rest = r.alarm ? this.rng.range(0.03, 0.14) : this.rng.range(0.8, 3.2);
          if (!r.alarm) { const u = this.rng.next(); r.pose = u < 0.35 ? 'eat' : u < 0.45 ? 'rear' : null; }
          // where a bleeding one lands it leaves blood on the ground
          if (r.hits) { this.stain(r.x - r.face * this.rng.int(0, 3), r.y + 1, BLOOD[this.rng.int(0, 2)], r.hits * 2 + 2); if (hard > 60) this.bleed(r, r.hits * 2, 0.5); }
        }
      }
      return;
    }
    // standing: it falls if the ground went from under it
    if (!solid(Math.round(r.x), Math.round(r.y) + 1)) { r.air = true; r.vx = 0; r.vy = 0; return; }
    if (!r.running) return;
    r.rest -= dt;
    if (r.rest <= 0) this.hop(r);
  }

  /** The blood in flight: it falls, and stains what it meets (clouding water). @param {number} dt */
  flow(dt) {
    const keep = [];
    for (const d of this.drops) {
      d.t += dt;
      d.vy += BLOOD_GRAVITY * dt;
      const steps = Math.max(1, Math.ceil(Math.hypot(d.vx, d.vy) * dt));
      let hit = false;
      for (let k = 0; k < steps && !hit; k++) {
        const nx = d.x + (d.vx * dt) / steps, ny = d.y + (d.vy * dt) / steps, X = Math.round(nx), Y = Math.round(ny);
        if (X < 0 || X >= this.W || Y >= this.H) { hit = true; d.t = 9; break; }
        if (Y >= 0 && this.liquid(X, Y)) { this.clouds.push({ x: X, y: Y, t: 0, r: 2 + d.s }); hit = true; break; }
        if (Y >= 0 && this.solid(X, Y)) {
          // it splashes where it lands: the faster, the wider
          this.stain(X, Y, d.c, Math.hypot(d.vx, d.vy) > 90 ? 2 + d.s : d.s - 1);
          hit = true; break;
        }
        d.x = nx; d.y = ny;
      }
      if (!hit && d.t < 4) keep.push(d);
    }
    this.drops = keep;
    for (const c of this.clouds) c.t += dt;
    this.clouds = this.clouds.filter((c) => c.t < 4);
  }

  /** The stains made since last asked (the view paints them once). */
  takeStains() {
    const s = this.stains;
    this.stains = [];
    return s;
  }
}

/**
 * Where a rabbit may start in a scene: open ground (a surface with air over
 * it) out of water and away from the very edges, as [x, feet row].
 * @param {{open:Uint8Array, solid:Uint8Array, liquid:Uint8Array, rock:Uint8Array}} sc @param {number} W @param {number} H
 * @returns {[number, number][]}
 */
export function warrenSpots(sc, W, H) {
  /** @type {[number, number][]} */
  const out = [];
  for (let y = 2; y < H - 2; y++) for (let x = 12; x < W - 12; x += 2) {
    const k = y * W + x;
    // the surface pixel itself is solid; its feet stand on the air pixel above it, with room over them
    if (!sc.open[k] || !sc.solid[k] || sc.solid[k - W] || sc.liquid[k - W]) continue;
    let clear = true;
    for (let j = 2; j <= 16 && clear; j++) if (sc.solid[k - j * W] || sc.rock[k - j * W]) clear = false;
    if (clear) out.push([x, y - 1]);
  }
  return out;
}
