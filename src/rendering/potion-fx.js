// The look of each effect inside a brew: particles. Every effect a potion
// carries keeps a swarm of little pixel-art particles in the liquid where it
// is, as many as its share of the magic there (awakening, several times the
// magic, packs them denser and draws them bolder). Each effect has its own
// colour (the effect bars'), shape and way of moving, so it reads at a glance:
//   vitality        red healing crosses rising slowly, swelling on a double
//                   heartbeat, with motes of life darting up
//   strength        golden dumbbells heaving up and thumping down, gold glints
//   love            pink hearts, large and small, beating as they rise and sway
//   arcana          violet four-pointed stars drifting and twinkling, the odd
//                   shooting star
//   transformation  teal shapes circling, turning circle → square → triangle →
//                   diamond and changing colour as they go
//   fire            flames licking up from the depths, white-hot to red to
//                   smoke, sparks flying out of the surface
//   frost           snowflakes turning and tumbling down, glints of ice
//   acidity         a fast fizz of tiny bubbles, popping into droplets at the
//                   surface
//   toxicity        fat ringed green bubbles that swell and burst, little skulls
//   death           dark smoke sinking and pale ghosts wavering up
// Particles live in screen pixels (so they stay crisp pixel art) and are
// carried by the liquid they swim in: each frame the brew's own velocity
// where a particle is moves it by as far as the simulation ran, so they swirl
// with the stirring, slosh with the pour and ride the convection, on top of
// their own drift. They are drawn only over the liquid (sparks and droplets
// may leave it for a moment) and never change the colour of the brew around
// them. fluid.js gives them the liquid's pixels, velocity and per-effect
// magic each frame (PotionParticles.step).

import { EFFECTS, NE } from '../alchemy/effects.js';

const K = Object.fromEntries(EFFECTS.map((e, k) => [e.key, k]));
const MAX = 1400;
/** Particles per 1000 px of liquid at full strength, by effect. */
const DENSITY = {
  vitality: 9, strength: 7, love: 8, arcana: 12, transformation: 6,
  fire: 26, frost: 11, acidity: 34, toxicity: 5, death: 8,
};
/** Most particles of one effect. */
const CAP = 220;

// colours of each effect: its own, a highlight, an outline, white
const COL = EFFECTS.map((e) => e.color.slice());
const HI = COL.map((c) => c.map((v) => v + (1 - v) * 0.6));
const OUT = COL.map((c) => c.map((v) => v * 0.38));
const WHITE = [1, 1, 0.96], INK = [0.06, 0.04, 0.08];
const FIRE_RAMP = [[1, 0.98, 0.8], [1, 0.88, 0.35], [1, 0.56, 0.2], [0.86, 0.22, 0.1], [0.35, 0.3, 0.32]];
const SHIFT = [[0.4, 0.9, 0.79], [0.85, 0.55, 1], [1, 0.84, 0.38], [0.45, 0.7, 1]];
const TOX_DARK = [0.16, 0.3, 0.12], SMOKE = [0.14, 0.1, 0.2], GHOST = [0.92, 0.88, 1];

// pixel masks, top row first; letters pick a colour (c own, h highlight,
// o outline, w white, k ink), '.' is empty; every mask gets a 1px outline
const M = (rows) => rows.map((r) => r.split(''));
const PLUS_L = M(['..cc..', '..hc..', 'hhhhcc', 'cchcco', '..co..', '..oo..']);
const PLUS_B = M(['..ccc..', '..chc..', 'ccchccc', 'chhwhhc', 'ccchcco', '..cco..', '..ooo..']);
const HEART_S = M(['c.c', 'hcc', '.c.']);
const HEART_M = M(['.c.c.', 'chccc', 'ccccc', '.ccc.', '..c..']);
const HEART_L = M(['.cc.cc.', 'chhcccc', 'chccccc', 'ccccccc', '.ccccc.', '..ccc..', '...c...']);
const DUMBBELL = M(['hc...hc', 'hcccchc', 'cc...cc']);
const SKULL = M(['.hcc.', 'ccccc', 'ckckc', '.ccc.', '.c.c.']);
const GHOST_A = M(['.hcc.', 'hcccc', 'ckckc', 'ccccc', 'ccccc', 'c.c.c']);
const GHOST_B = M(['.hcc.', 'hcccc', 'ckckc', 'ccccc', 'ccccc', '.c.c.']);
const CIRCLE = M(['.ccc.', 'chhcc', 'chccc', 'ccccc', '.ccc.']);
const SQUARE = M(['ccccc', 'chhcc', 'chccc', 'ccccc', 'ccccc']);
const TRIANGLE = M(['..c..', '..h..', '.hcc.', '.cccc', 'ccccc']);
const DIAMOND = M(['..c..', '.hcc.', 'chccc', '.ccc.', '..c..']);
// flames by size, tip first: a white-hot core (3), yellow (2), orange (1), its rim (0)
const FLAME = [
  ['1', '0'],
  ['.0.', '.1.', '010', '121', '.0.'],
  ['..0..', '..1..', '.010.', '.121.', '01210', '12321', '.121.', '..0..'],
];
const SHAPES = [CIRCLE, SQUARE, TRIANGLE, DIAMOND];

/** The liquid's displacement at a particle (PotionParticles._carry). */
let FX = 0, FY = 0;

/** The double heartbeat: two quick swells every 1.2 s, 0..~1. */
const heartbeat = (t) => {
  const p = (t / 1.2) % 1;
  return Math.exp(-Math.pow((p - 0.1) / 0.05, 2)) + 0.6 * Math.exp(-Math.pow((p - 0.3) / 0.05, 2));
};

/**
 * The magic effects' particles in a brew. One per FluidRenderer; it keeps
 * its swarm from frame to frame.
 */
export class PotionParticles {
  constructor() {
    this.x = new Float32Array(MAX);
    this.y = new Float32Array(MAX);
    this.vx = new Float32Array(MAX);
    this.vy = new Float32Array(MAX);
    this.age = new Float32Array(MAX);
    this.life = new Float32Array(MAX);
    this.v = new Float32Array(MAX); // the particle's own random value: variant, phase
    this.amp = new Float32Array(MAX); // strength of its effect where it was born
    this.ox = new Float32Array(MAX); // a centre it sways or circles around
    this.oy = new Float32Array(MAX);
    this.k = new Uint8Array(MAX);
    this.free = new Uint8Array(MAX); // a spark or droplet that may leave the liquid
    this.n = 0;
    this.count = new Int32Array(NE);
    this.credit = new Float32Array(NE);
    this.warm = new Uint8Array(NE);
    this.last = -1;
    this.seed = 0;
    /** pixels of the last image a particle was drawn on (1), for tests */
    this.cover = new Uint8Array(0);
  }

  rand() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  /** Forget every particle (a new brew). */
  clear() {
    this.n = 0;
    this.count.fill(0);
    this.credit.fill(0);
    this.warm.fill(0);
  }

  /**
   * Spawn, move and draw the particles over a rendered brew.
   * @param {number} time seconds
   * @param {{w:number, h:number, bx:number, by:number, data:Uint8ClampedArray, liquid:Uint8Array,
   *   pix:Int32Array, npix:number, mfx:Float32Array, emit:Float32Array, mask:number,
   *   flow?:Float32Array, weight?:Float32Array, stride?:number, simDt?:number}} f
   *   the image (w × h at screen bx, by), which of its pixels are liquid
   *   (and the list of them), the per-effect magic and its kernel weight per
   *   pixel, and the liquid's weighted velocity per pixel (flow, screen px
   *   per simulated second; its weight every `stride` floats of `weight`)
   *   with the simulated time since the last frame
   */
  step(time, f) {
    if (this.last < 0) this.seed = (Math.floor(time * 1000) ^ 0x5bd1e995) >>> 0;
    const dt = this.last < 0 || time < this.last ? 0 : Math.min(0.1, time - this.last);
    this.last = time;
    const N = f.w * f.h;
    if (this.cover.length < N) this.cover = new Uint8Array(N);
    else this.cover.fill(0, 0, N);
    this._spawn(dt, f);
    this._move(time, dt, f);
    for (let i = 0; i < this.n; i++) this._draw(i, time, f);
  }

  /** The strength (0..1.6) of effect e at image pixel q. */
  static strength(f, q, e) {
    const ew = f.emit[q * 4 + 3];
    if (ew <= 0.02) return 0;
    return Math.min(1.6, Math.sqrt(f.mfx[q * NE + e] / Math.max(ew, 0.6)) * 1.5);
  }

  /** Keep each effect's swarm at its size: its density times its strength over the liquid. */
  _spawn(dt, f) {
    const npix = f.npix;
    for (let e = 0; e < NE; e++) {
      if (!(f.mask & (1 << e)) || npix === 0) { this.warm[e] = 0; this.credit[e] = 0; continue; }
      // how much of the brew carries it, and how strongly: a sample of the liquid
      const S = Math.min(240, npix);
      let sum = 0;
      for (let s = 0; s < S; s++) sum += PotionParticles.strength(f, f.pix[(this.rand() * npix) | 0], e);
      const target = Math.min(CAP, Math.round((sum / S) * npix * DENSITY[EFFECTS[e].key] / 1000));
      const deficit = target - this.count[e];
      if (deficit <= 0) { this.warm[e] = 1; continue; }
      let make;
      const first = !this.warm[e];
      if (first) { make = deficit; this.warm[e] = 1; }
      else {
        this.credit[e] += deficit * dt * 4;
        make = Math.floor(this.credit[e]);
        this.credit[e] -= make;
      }
      for (let m = 0; m < make && this.n < MAX; m++) {
        // a liquid pixel where the effect is, more likely where it is strong
        for (let tries = 0; tries < 16; tries++) {
          const q = f.pix[(this.rand() * npix) | 0], A = PotionParticles.strength(f, q, e);
          if (A <= 0.03 || this.rand() * 1.6 > A) continue;
          this._add(e, (q % f.w) + f.bx, ((q / f.w) | 0) + f.by, A, first);
          break;
        }
      }
    }
  }

  /** @param {number} e @param {number} x @param {number} y @param {number} A @param {boolean} aged */
  _add(e, x, y, A, aged) {
    const i = this.n++, r = this.rand();
    this.k[i] = e; this.x[i] = x; this.y[i] = y; this.ox[i] = x; this.oy[i] = y;
    this.v[i] = r; this.amp[i] = A; this.free[i] = 0; this.vx[i] = 0; this.vy[i] = 0;
    let life = 3;
    switch (e) {
      case K.vitality: life = 3 + r * 2; this.vy[i] = r < 0.35 ? -14 - r * 10 : -5 - r * 3; break;
      case K.strength: life = 3.5 + r * 2; this.vy[i] = r < 0.3 ? -12 : -2.5 - r * 1.5; break;
      case K.love: life = 3.5 + r * 2; this.vy[i] = r > 0.55 ? -4.5 : -8 - r * 4; break;
      case K.arcana:
        if (r < 0.06) { life = 0.55; this.vx[i] = 70; this.vy[i] = 26; }
        else { life = 2.5 + r * 2.5; this.vx[i] = (this.rand() - 0.5) * 6; this.vy[i] = (this.rand() - 0.5) * 6; }
        break;
      case K.transformation: life = 3 + r * 2; this.vy[i] = -2.5; this.vx[i] = (this.rand() - 0.5) * 3; break;
      case K.fire: life = 0.7 + r * 0.6; this.vy[i] = -20 - r * 14; break;
      case K.frost: life = 4 + r * 3; this.vy[i] = r < 0.3 ? 0.5 : 4 + r * 4; break;
      case K.acidity: life = 1.2 + r * 1.2; this.vy[i] = -22 - r * 18; break;
      case K.toxicity: life = 2.5 + r * 2; this.vy[i] = r < 0.25 ? -3 : -5 - r * 4; break;
      case K.death: life = 3 + r * 2; this.vy[i] = r < 0.4 ? -4 - r * 3 : 3 + r * 2; break;
    }
    this.life[i] = life;
    // the first swarm of a brew is already under way
    this.age[i] = aged ? this.rand() * life * 0.8 : 0;
    if (this.age[i] > 0 && e !== K.transformation) { this.x[i] += this.vx[i] * this.age[i] * 0.5; this.y[i] += this.vy[i] * this.age[i] * 0.5; }
    this.count[e]++;
  }

  /** @param {number} i */
  _kill(i) {
    this.count[this.k[i]]--;
    const j = --this.n;
    if (i === j) return;
    this.x[i] = this.x[j]; this.y[i] = this.y[j]; this.vx[i] = this.vx[j]; this.vy[i] = this.vy[j];
    this.age[i] = this.age[j]; this.life[i] = this.life[j]; this.v[i] = this.v[j]; this.amp[i] = this.amp[j];
    this.ox[i] = this.ox[j]; this.oy[i] = this.oy[j]; this.k[i] = this.k[j]; this.free[i] = this.free[j];
  }

  /** A spark or droplet leaving the brew. @param {number} e */
  _fling(e, x, y, vx, vy, life) {
    if (this.n >= MAX) return;
    const i = this.n++;
    this.k[i] = e; this.x[i] = x; this.y[i] = y; this.vx[i] = vx; this.vy[i] = vy;
    this.age[i] = 0; this.life[i] = life; this.v[i] = this.rand(); this.amp[i] = 1; this.free[i] = 1;
    this.ox[i] = x; this.oy[i] = y;
    this.count[e]++;
  }

  /**
   * How far the liquid at screen point (x, y) moved since the last frame
   * (into FX, FY): its velocity, bilinear between the four pixels around,
   * times the simulated time.
   */
  _carry(f, x, y) {
    FX = 0; FY = 0;
    const { flow, weight, stride, simDt } = f;
    if (!flow || !weight || !simDt) return;
    const gx = x - f.bx - 0.5, gy = y - f.by - 0.5, ix = Math.floor(gx), iy = Math.floor(gy), tx = gx - ix, ty = gy - iy;
    let vx = 0, vy = 0, ws = 0;
    for (let c = 0; c < 4; c++) {
      const px = ix + (c & 1), py = iy + (c >> 1);
      if (px < 0 || py < 0 || px >= f.w || py >= f.h) continue;
      const q = py * f.w + px, W = weight[q * (stride || 1)];
      if (W < 1e-4) continue;
      const k = ((c & 1) ? tx : 1 - tx) * ((c >> 1) ? ty : 1 - ty);
      vx += (flow[q * 2] / W) * k; vy += (flow[q * 2 + 1] / W) * k; ws += k;
    }
    if (ws < 1e-3) return;
    FX = (vx / ws) * simDt; FY = (vy / ws) * simDt;
  }

  _move(time, dt, f) {
    const { w, h, bx, by, liquid } = f;
    for (let i = this.n - 1; i >= 0; i--) {
      const e = this.k[i], v = this.v[i];
      this.age[i] += dt;
      if (this.age[i] >= this.life[i]) {
        if (e === K.toxicity && !this.free[i] && v >= 0.25) this._burst(i);
        this._kill(i);
        continue;
      }
      if (this.free[i]) {
        // sparks rise and drift; droplets fall back
        if (e !== K.fire) this.vy[i] += 90 * dt;
        this.x[i] += this.vx[i] * dt; this.y[i] += this.vy[i] * dt;
        const lx = Math.round(this.x[i]) - bx, ly = Math.round(this.y[i]) - by;
        if (lx < 0 || ly < 0 || lx >= w || ly >= h) this._kill(i);
        else if (this.vy[i] > 0 && liquid[ly * w + lx]) this._kill(i);
        continue;
      }
      const a = this.age[i];
      // carried along by the brew
      this._carry(f, this.x[i], this.y[i]);
      this.ox[i] += FX; this.oy[i] += FY;
      switch (e) {
        case K.transformation: {
          // circling a centre that drifts up
          this.ox[i] += this.vx[i] * dt; this.oy[i] += this.vy[i] * dt;
          const R = 3 + v * 6, ang = a * (1.2 + v) * (v < 0.5 ? 1 : -1) + v * 20;
          this.x[i] = this.ox[i] + Math.cos(ang) * R; this.y[i] = this.oy[i] + Math.sin(ang) * R * 0.6;
          break;
        }
        case K.strength: {
          // heaving up, then a thump down
          this.oy[i] += this.vy[i] * dt;
          this.x[i] = this.ox[i];
          this.y[i] = this.oy[i] - (v < 0.3 ? 0 : Math.abs(Math.sin(time * 2.4 + v * 9)) * 4);
          break;
        }
        default: {
          this.oy[i] += this.vy[i] * dt; this.ox[i] += this.vx[i] * dt;
          let sx = 0;
          if (e === K.love) sx = Math.sin(time * 2.2 + v * 30) * 2.2;
          else if (e === K.vitality) sx = Math.sin(time * 1.7 + v * 30) * 1.5;
          else if (e === K.frost) sx = Math.sin(time * 1.3 + v * 30) * 3;
          else if (e === K.fire) sx = Math.sin(time * 9 + v * 30) * 0.8 + Math.sin(time * 0.9) * a * 4;
          else if (e === K.acidity) sx = Math.sin(time * 14 + v * 30) * 0.7;
          else if (e === K.toxicity) sx = Math.sin(time * 1.1 + v * 30) * 1.5;
          else if (e === K.death) sx = v < 0.4 ? Math.sin(time * 2 + v * 30) * 2.5 : Math.cos(time * 0.8 + v * 30) * 2;
          this.x[i] = this.ox[i] + sx; this.y[i] = this.oy[i];
        }
      }
      const lx = Math.round(this.x[i]) - bx, ly = Math.round(this.y[i]) - by;
      const inside = lx >= 0 && ly >= 0 && lx < w && ly < h && liquid[ly * w + lx];
      if (!inside) {
        // out of the brew: at the surface fire throws sparks, acid pops, poison bursts
        if (this.vy[i] < 0 && lx >= 0 && lx < w) {
          if (e === K.fire && this.age[i] < this.life[i] * 0.6 && this.rand() < 0.6) this._fling(e, this.x[i], this.y[i], (this.rand() - 0.5) * 10, -18 - this.rand() * 14, 0.35 + this.rand() * 0.3);
          else if (e === K.acidity) for (let d = 0; d < 2; d++) this._fling(e, this.x[i], this.y[i] - 1, (this.rand() - 0.5) * 30, -20 - this.rand() * 15, 0.4);
          else if (e === K.toxicity && v >= 0.25) this._burst(i);
        }
        this._kill(i);
      }
    }
  }

  /** A poison bubble bursts into droplets. @param {number} i */
  _burst(i) {
    for (let d = 0; d < 4; d++) {
      const ang = -Math.PI * (0.15 + 0.7 * (d / 3));
      this._fling(this.k[i], this.x[i], this.y[i] - 1, Math.cos(ang) * 22, Math.sin(ang) * 28, 0.4);
    }
  }

  /** Draw particle i into the image. */
  _draw(i, time, f) {
    const { w, h, bx, by, data, liquid } = f;
    const e = this.k[i], v = this.v[i], free = this.free[i] === 1;
    const t = this.age[i] / this.life[i];
    // fade in and out, stronger where the effect is stronger
    const fade = Math.min(1, t * 6, (1 - t) * 5) * Math.min(1, 0.55 + this.amp[i] * 0.5);
    const X = Math.round(this.x[i]) - bx, Y = Math.round(this.y[i]) - by;
    const cover = this.cover;
    /** @param {number} x @param {number} y @param {number[]} c @param {number} a */
    const px = (x, y, c, a) => {
      x += X; y += Y;
      if (x < 0 || y < 0 || x >= w || y >= h || a <= 0.01) return;
      const q = y * w + x, o = q * 4;
      if (!liquid[q]) {
        if (!free) return;
        // a spark or droplet in the air
        const al = data[o + 3] / 255, na = a + al * (1 - a);
        for (let ch = 0; ch < 3; ch++) data[o + ch] = Math.round(((c[ch] * 255) * a + data[o + ch] * al * (1 - a)) / Math.max(na, 1e-3));
        data[o + 3] = Math.round(na * 255);
      } else {
        if (a > 1) a = 1;
        for (let ch = 0; ch < 3; ch++) data[o + ch] = Math.round(data[o + ch] + (c[ch] * 255 - data[o + ch]) * a);
      }
      cover[q] = 1;
    };
    const C = COL[e], H = HI[e], O = OUT[e];
    /** stamp a mask centred on (cx, cy) with its outline (none when pal.o is null) @param {string[][]} m @param {number} cx @param {number} cy @param {number} a @param {any} [pal] */
    const stamp = (m, cx, cy, a, pal = null) => {
      const mh = m.length, mw = m[0].length, x0 = -((mw - 1) >> 1) + cx, y0 = -((mh - 1) >> 1) + cy;
      const on = (x, y) => x >= 0 && y >= 0 && x < mw && y < mh && m[y][x] !== '.';
      const oc = pal ? pal.o : O;
      if (oc) for (let y = -1; y <= mh; y++) for (let x = -1; x <= mw; x++) {
        if (on(x, y)) continue;
        if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) px(x0 + x, y0 + y, oc, a * 0.75);
      }
      for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
        const ch = m[y][x];
        if (ch === '.') continue;
        const col = ch === 'h' ? (pal ? pal.h : H) : ch === 'w' ? WHITE : ch === 'k' ? INK : ch === 'o' ? oc || (pal && pal.s) || O : pal ? pal.c : C;
        px(x0 + x, y0 + y, col, a);
      }
    };
    /** draw a list of [x, y, colour] pixels with a soft outline around them @param {any[]} list @param {number} a */
    const shape = (list, a) => {
      const on = new Set(list.map(([x, y]) => x * 64 + y));
      for (const [x, y] of list) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const q = (x + dx) * 64 + y + dy;
        if (!on.has(q)) { on.add(q); px(x + dx, y + dy, O, a * 0.6); }
      }
      for (const [x, y, c] of list) px(x, y, c, a);
    };
    if (free) {
      // sparks glow yellow to red; droplets in the effect's colour
      const col = e === K.fire ? FIRE_RAMP[Math.min(3, Math.floor(t * 4))] : e === K.toxicity ? C : H;
      px(0, 0, col, 1 - t * 0.6);
      return;
    }
    switch (e) {
      case K.vitality: {
        if (v < 0.35) { px(0, 0, Math.sin(time * 9 + v * 40) > 0 ? WHITE : H, fade); px(0, 1, C, fade * 0.6); break; }
        const beat = heartbeat(time + v * 0.3);
        // a healing cross with no outline, shaded on its lower side
        stamp(beat > 0.5 && v > 0.6 ? PLUS_B : PLUS_L, 0, 0, fade * (0.8 + 0.2 * Math.min(1, beat)), { c: C, h: H, o: null, s: O });
        break;
      }
      case K.strength: {
        if (v < 0.3) { const s = Math.sin(time * 6 + v * 50) > 0; px(0, 0, WHITE, fade); if (s) { px(-1, 0, H, fade * 0.8); px(1, 0, H, fade * 0.8); px(0, -1, H, fade * 0.8); px(0, 1, H, fade * 0.8); } break; }
        stamp(DUMBBELL, 0, 0, fade);
        break;
      }
      case K.love: {
        const beat = Math.sin(time * 5 + v * 20) > 0.2;
        if (v > 0.55) stamp(beat ? HEART_L : HEART_M, 0, 0, fade);
        else stamp(beat ? HEART_M : HEART_S, 0, 0, fade);
        // a sparkle trailing under it
        if (Math.sin(time * 8 + v * 60) > 0.4) px(0, v > 0.55 ? 6 : 4, WHITE, fade * 0.8);
        break;
      }
      case K.arcana: {
        if (v < 0.06) {
          // a shooting star and its tail
          for (let s = 0; s < 7; s++) px(-Math.round(s * 0.94), -Math.round(s * 0.35), s === 0 ? WHITE : s < 3 ? H : C, fade * (1 - s / 8));
          break;
        }
        const tw = 0.5 + 0.5 * Math.sin(time * (1.6 + v * 2.4) + v * 40);
        const L = Math.round((1 + Math.floor(v * 3.99)) * (0.35 + 0.65 * tw));
        const diag = Math.sin(time * 1.3 + v * 25) > 0.6;
        const pts = [[0, 0, WHITE]];
        for (let s = 1; s <= L; s++) {
          const col = s === 1 ? H : C;
          if (diag) pts.push([s, s, col], [-s, s, col], [s, -s, col], [-s, -s, col]);
          else pts.push([s, 0, col], [-s, 0, col], [0, s, col], [0, -s, col]);
        }
        shape(pts, fade);
        break;
      }
      case K.transformation: {
        const j = Math.floor(time * 0.9 + v * 4) % 4;
        const c = SHIFT[j];
        stamp(SHAPES[j], 0, 0, fade, { c, h: c.map((x) => x + (1 - x) * 0.6), o: c.map((x) => x * 0.35) });
        break;
      }
      case K.fire: {
        // a tongue of flame, shrinking and cooling as it rises: white-hot,
        // yellow, orange, red, then a wisp of smoke; its tip flickers
        const s = t < 0.4 ? 2 : t < 0.8 ? 1 : 0, m = FLAME[v < 0.3 ? Math.min(s, 1) : s], cool = Math.floor(t * 2.5);
        const lean = Math.sin(time * 15 + v * 30) > 0 ? 1 : 0;
        for (let y = 0; y < m.length; y++) for (let x = 0; x < m[y].length; x++) {
          const ch = m[y][x];
          if (ch === '.') continue;
          px(x - (m[y].length >> 1) + (y < 2 ? lean : 0), y - m.length + 2, FIRE_RAMP[Math.min(4, 3 - +ch + cool)], fade);
        }
        break;
      }
      case K.frost: {
        if (v < 0.3) { if (Math.sin(time * 4 + v * 70) > 0.3) { px(0, 0, WHITE, fade); px(1, 0, H, fade * 0.5); px(-1, 0, H, fade * 0.5); } break; }
        const R = v > 0.65 ? 3 : 2;
        const tilt = Math.sin(time * (1 + v) + v * 30) > 0;
        const pts = [[0, 0, WHITE]];
        for (let s = 1; s <= R; s++) {
          const col = s === R ? H : C;
          if (tilt) pts.push([0, s, col], [0, -s, col], [s, s, col], [-s, -s, col], [s, -s, col], [-s, s, col]);
          else pts.push([s, 0, col], [-s, 0, col], [0, s, col], [0, -s, col], [s, s, col], [-s, -s, col]);
        }
        shape(pts, fade);
        break;
      }
      case K.acidity: {
        // a bubble swelling as it rises: a bright speck, then a ring with a glint
        if (t < 0.3 || v < 0.35) { px(0, 0, v < 0.15 ? WHITE : H, fade); px(0, 1, O, fade * 0.7); px(1, 0, O, fade * 0.5); break; }
        for (const [x, y] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) px(x, y, C, fade);
        for (const [x, y] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]]) px(x, y, O, fade * 0.7);
        px(0, 0, H, fade * 0.35); px(-1, -1, WHITE, fade);
        break;
      }
      case K.toxicity: {
        if (v < 0.25) { stamp(SKULL, 0, 0, fade, { c: C, h: HI[e], o: TOX_DARK }); break; }
        // a fat ringed bubble swelling until it bursts
        const R = 1.6 + t * 3.2 + Math.sin(time * 3 + v * 30) * 0.3, Ri = Math.ceil(R + 1);
        for (let y = -Ri; y <= Ri; y++) for (let x = -Ri; x <= Ri; x++) {
          const d = Math.hypot(x, y);
          if (d > R + 0.5) continue;
          if (d > R - 0.7) px(x, y, TOX_DARK, fade * 0.9);
          else if (x < 0 && y < 0 && d > R * 0.3 && d < R * 0.75) px(x, y, WHITE, fade * 0.8);
          else px(x, y, C, fade * 0.45);
        }
        break;
      }
      case K.death: {
        if (v < 0.4) {
          stamp(Math.sin(time * 6 + v * 40) > 0 ? GHOST_A : GHOST_B, 0, 0, fade * 0.85, { c: GHOST, h: WHITE, o: SMOKE });
          break;
        }
        // a sinking puff of dark smoke, spreading and thinning
        const R = 1 + t * 2.5;
        for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) {
          const d = Math.hypot(x, y * 1.2);
          if (d > R) continue;
          px(x, y, d < R * 0.5 ? SMOKE : O, fade * (0.85 - t * 0.4));
        }
        if ((v * 97) % 1 < 0.3) px(0, 0, C, fade * 0.7);
        break;
      }
    }
  }
}
