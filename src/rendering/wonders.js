// The living wonders of the exotic biomes: something in each land that
// answers the finger, with no purpose but the pleasure of it.
//
//   Moonfen        wisps drifting over the bog flee from the finger and
//                  wander home again;
//   Skydrift Isles little isles bob in the sky, each on its own invisible
//                  spring: flick one and it swings and bounces round its
//                  resting place until it settles;
//   Veilmist Glade a veil of mist lies over the glade: the finger wipes it
//                  away like breath from a window, and it slowly closes;
//   Shifting Reef  anemones close at a touch and open again in another
//                  colour;
//   Stormspire     a finger near a crystal rod draws its lightning out to
//                  the fingertip (and on to the next rod); the rods arc
//                  among themselves now and then;
//   Dreamspire     dreams float up from the sleeping flowers in bubbles
//                  that pop at a touch.
//
// Each wonder keeps its own state (made once per scene) and steps itself
// from the time it is drawn at. Drawing is a few dozen rectangles and, for
// the mist, one small image scaled over the scene.

import { SCENE_W, SCENE_H } from '../visual/env/paint.js';

/** @param {CanvasRenderingContext2D} ctx */
function px(ctx, x, y, c, w = 1, h = 1) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

/** A soft round light (added). @param {CanvasRenderingContext2D} ctx */
function halo(ctx, x, y, r, c, a) {
  if (typeof ctx.createRadialGradient !== 'function') return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
  const ga = ctx.globalAlpha, op = ctx.globalCompositeOperation;
  ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = ga; ctx.globalCompositeOperation = op;
}

/** Distance from a point to a segment. */
function segDist(px0, py0, x0, y0, x1, y1) {
  const vx = x1 - x0, vy = y1 - y0, l = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((px0 - x0) * vx + (py0 - y0) * vy) / l));
  return Math.hypot(px0 - x0 - vx * t, py0 - y0 - vy * t);
}

/** A little deterministic hash. */
const rnd = (i, k = 0) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };

/** HSL (h 0..1) to a css colour. */
const hsl = (h, s, l) => `hsl(${Math.round((((h % 1) + 1) % 1) * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%)`;

/** What every wonder does with the finger and the clock. */
class Wonder {
  constructor() { this.last = -1; this.dt = 0; }
  /** @param {number} t */
  tick(t) { this.dt = this.last < 0 || t < this.last ? 0 : Math.min(0.1, t - this.last); this.last = t; return this.dt; }
  /** @param {number} _x @param {number} _y @param {number} _t */
  press(_x, _y, _t) {}
  /** @param {number} _x0 @param {number} _y0 @param {number} _x1 @param {number} _y1 @param {number} _t */
  push(_x0, _y0, _x1, _y1, _t) {}
  /** @param {number} _t */
  release(_t) {}
  /** @param {CanvasRenderingContext2D} _ctx @param {number} _t */
  draw(_ctx, _t) {}
}

// ------------------------------------------------------------------ Moonfen: wisps

class Wisps extends Wonder {
  constructor() {
    super();
    this.w = [];
    for (let i = 0; i < 7; i++) {
      const hx = SCENE_W * (0.07 + i * 0.14), hy = SCENE_H * (0.52 + rnd(i, 3) * 0.16);
      this.w.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, scared: 0 });
    }
  }
  scare(x, y, r) {
    for (const w of this.w) {
      const d = Math.hypot(w.x - x, w.y - y);
      if (d > r) continue;
      const k = (1 - d / r) * 160 / Math.max(6, d);
      w.vx += (w.x - x) * k; w.vy += (w.y - y) * k - 20;
      w.scared = 1.5;
    }
  }
  press(x, y) { this.scare(x, y, 44); }
  push(x0, y0, x1, y1) { this.scare(x1, y1, 34); }
  draw(ctx, t) {
    const dt = this.tick(t);
    this.w.forEach((w, i) => {
      // home is a slow drift over the bog; scared, they dart off and wander back
      const hx = w.hx + Math.sin(t * 0.6 + i * 2) * 14, hy = w.hy + Math.sin(t * 1.2 + i) * 9;
      w.scared = Math.max(0, w.scared - dt);
      const k = w.scared > 0 ? 0.4 : 2.2;
      w.vx += (hx - w.x) * k * dt; w.vy += (hy - w.y) * k * dt;
      const damp = Math.exp(-dt * 1.6);
      w.vx *= damp; w.vy *= damp;
      w.x += w.vx * dt; w.y += w.vy * dt;
      w.x = Math.max(4, Math.min(SCENE_W - 4, w.x)); w.y = Math.max(8, Math.min(SCENE_H - 10, w.y));
      const fl = Math.hypot(w.vx, w.vy) > 20 ? 1 : 0;
      halo(ctx, w.x, w.y, 9 + fl * 3, '#5fd4e8', 0.18 + fl * 0.1);
      px(ctx, w.x - 1, w.y - 2, '#8fe0ff', 2, 4); px(ctx, w.x - 1, w.y, '#e9fbff', 2, 2);
      // a little tail, streaming behind it
      for (let s = 1; s <= 3; s++) px(ctx, w.x - w.vx * 0.02 * s, w.y - 3 - s + Math.round(Math.sin(t * 8 + i + s)), s < 2 ? '#8fe0ff' : '#5fd4e8');
    });
  }
}

// ------------------------------------------------------------------ Skydrift: the bobbing isles

/** A little floating isle drawn into its own canvas: grass on top, earth, a rocky underside, roots, a tree or a crystal. @param {number} r @param {number} seed */
function isleSprite(r, seed) {
  if (typeof document === 'undefined') return null;
  const W = r * 2 + 6, H = r + 26, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  const cx = W / 2, top = 14;
  const P = (x, y, c, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  // underside: tapering rock, lit on the left, outlined
  for (let x = -r; x <= r; x++) {
    const u = x / r, d = Math.round(4 + (r * 0.85) * Math.pow(Math.max(0, 1 - u * u), 1.2) * (0.8 + rnd(x + seed, 1) * 0.35));
    for (let y = 0; y <= d; y++) {
      const c = y >= d - 1 ? '#3a3230' : y < 3 ? (y === 0 ? '#9ade5a' : y === 1 ? '#6ab83e' : '#4a8a30') : y < 6 ? '#7a5034' : u < -0.3 ? '#9a8e80' : u > 0.4 ? '#6e645a' : '#8a7e72';
      P(Math.round(cx + x), top + y, c);
    }
    if (rnd(x, seed) < 0.12) for (let y = d + 1; y < d + 3 + rnd(x, seed + 2) * 6; y++) P(Math.round(cx + x), top + y, '#5a3e26');
  }
  // outline the edges
  P(Math.round(cx - r - 1), top + 1, '#2a4a1a', 1, 3); P(Math.round(cx + r + 1), top + 1, '#2a4a1a', 1, 3);
  // on top: a tuft of grass and flowers, and a little tree or a crystal
  for (let x = -r + 2; x < r - 1; x += 2) if (rnd(x, seed + 4) < 0.5) P(Math.round(cx + x), top - 1, '#7ac84a');
  if (rnd(seed, 7) < 0.6) {
    const tx = Math.round(cx + (rnd(seed, 8) - 0.5) * r);
    P(tx, top - 8, '#5a3e26', 1, 8);
    for (const [dx, dy, c] of /** @type {[number, number, string][]} */ ([[-3, -12, '#4a9a32'], [-2, -13, '#6ab83e'], [0, -14, '#9ade5a'], [2, -12, '#6ab83e'], [-1, -11, '#4a9a32']])) P(tx + dx, top + dy, c, 3, 3);
  } else {
    const tx = Math.round(cx + (rnd(seed, 8) - 0.5) * r);
    for (let y = 0; y < 8; y++) { P(tx, top - 1 - y, y > 5 ? '#ffffff' : '#9ae0ff'); if (y < 5) P(tx + 1, top - 1 - y, '#5aa8e0'); }
  }
  return { cv, w: W, h: H, ax: cx, ay: top };
}

class Isles extends Wonder {
  /** @param {[number, number, number, number][]} spots x, y, radius, seed */
  constructor(spots) {
    super();
    this.isles = spots.map(([x, y, r, seed]) => ({ x, y, r, seed, ox: 0, oy: 0, vx: 0, vy: 0, sp: /** @type {any} */ (null) }));
  }
  hit(i, x, y) { return Math.abs(x - i.x - i.ox) < i.r + 6 && y > i.y + i.oy - 14 && y < i.y + i.oy + i.r + 6; }
  press(x, y) {
    for (const i of this.isles) if (this.hit(i, x, y)) { i.vy += 70; i.vx += (i.x + i.ox - x) * 4; }
  }
  push(x0, y0, x1, y1, t) {
    const dt = 1 / 60;
    for (const i of this.isles) {
      const cx = i.x + i.ox, cy = i.y + i.oy + i.r * 0.3;
      if (segDist(cx, cy, x0, y0, x1, y1) > i.r + 6) continue;
      // the finger's speed becomes the isle's (a flick sends it swinging)
      i.vx += Math.max(-260, Math.min(260, (x1 - x0) / dt * 0.35));
      i.vy += Math.max(-260, Math.min(260, (y1 - y0) / dt * 0.35));
    }
    void t;
  }
  draw(ctx, t) {
    const dt = this.tick(t);
    for (const i of this.isles) {
      // a spring back to where it floats, lightly damped: it bounces round its rest and settles
      const k = 26, c = 2.4, n = Math.max(1, Math.ceil(dt / 0.01));
      for (let s = 0; s < n; s++) {
        const h = dt / n;
        i.vx += (-k * i.ox - c * i.vx) * h; i.vy += (-k * i.oy - c * i.vy) * h;
        i.ox += i.vx * h; i.oy += i.vy * h;
      }
      i.ox = Math.max(-60, Math.min(60, i.ox)); i.oy = Math.max(-50, Math.min(50, i.oy));
      if (!i.sp) i.sp = isleSprite(i.r, i.seed);
      const bob = Math.sin(t * 0.8 + i.seed % 7) * 2;
      const X = Math.round(i.x + i.ox), Y = Math.round(i.y + i.oy + bob);
      if (i.sp) ctx.drawImage(i.sp.cv, X - i.sp.ax, Y - i.sp.ay);
      // a few motes falling from its underside
      for (let m = 0; m < 2; m++) { const a = (t * 0.4 + rnd(i.seed, m)) % 1; px(ctx, X - i.r * 0.4 + m * i.r * 0.8, Y + i.r * 0.6 + a * 20, a < 0.6 ? '#fff6d0' : 'rgba(255,246,208,0.4)'); }
    }
  }
}

// ------------------------------------------------------------------ Veilmist: the veil

const GW = 96, GH = 54;
class Mist extends Wonder {
  constructor(seed) {
    super();
    this.base = new Float32Array(GW * GH);
    this.d = new Float32Array(GW * GH);
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
      const v = 0.5 + 0.25 * Math.sin(x * 0.17 + seed) * Math.cos(y * 0.23 + seed * 0.7) + 0.2 * Math.sin((x + y) * 0.07 + seed * 1.3);
      // thicker low over the ground, thinner up in the sky
      const k = y * GW + x;
      this.base[k] = Math.max(0, Math.min(0.62, v * (0.32 + 0.5 * (y / GH))));
      this.d[k] = this.base[k];
    }
    this.cv = null; this.img = null; this.dirty = true;
  }
  wipe(x, y, r) {
    const gx = (x / SCENE_W) * GW, gy = (y / SCENE_H) * GH, gr = (r / SCENE_W) * GW;
    for (let yy = Math.floor(gy - gr); yy <= gy + gr; yy++) for (let xx = Math.floor(gx - gr); xx <= gx + gr; xx++) {
      if (xx < 0 || yy < 0 || xx >= GW || yy >= GH) continue;
      const d = Math.hypot(xx - gx, yy - gy) / gr;
      if (d > 1) continue;
      const k = yy * GW + xx;
      this.d[k] = Math.max(0, this.d[k] - (1 - d * d) * 0.9);
    }
    this.dirty = true;
  }
  press(x, y) { this.wipe(x, y, 16); }
  push(x0, y0, x1, y1) {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 4));
    for (let i = 0; i <= n; i++) this.wipe(x0 + (x1 - x0) * (i / n), y0 + (y1 - y0) * (i / n), 14);
  }
  draw(ctx, t) {
    const dt = this.tick(t);
    if (typeof document === 'undefined') return;
    if (!this.cv) {
      this.cv = document.createElement('canvas'); this.cv.width = GW; this.cv.height = GH;
      this.g = /** @type {CanvasRenderingContext2D} */ (this.cv.getContext('2d'));
      this.img = this.g.createImageData(GW, GH);
    }
    // the veil closes again, slowly, and drifts a little
    const back = dt * 0.07;
    let moved = this.dirty;
    for (let k = 0; k < this.d.length; k++) { const b = this.base[k]; if (this.d[k] < b) { this.d[k] = Math.min(b, this.d[k] + back); moved = true; } }
    if (moved || !this.drawn) {
      const a = /** @type {ImageData} */ (this.img).data;
      for (let k = 0; k < this.d.length; k++) { a[k * 4] = 236; a[k * 4 + 1] = 242; a[k * 4 + 2] = 250; a[k * 4 + 3] = Math.round(this.d[k] * 190); }
      /** @type {CanvasRenderingContext2D} */ (this.g).putImageData(/** @type {ImageData} */ (this.img), 0, 0);
      this.dirty = false; this.drawn = true;
    }
    const sm = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.cv, Math.sin(t * 0.05) * 6 - 6, 0, SCENE_W + 12, SCENE_H);
    ctx.imageSmoothingEnabled = sm;
  }
}

// ------------------------------------------------------------------ Shifting Reef: anemones

class Anemones extends Wonder {
  /** @param {[number, number, number][]} spots */
  constructor(spots) {
    super();
    this.a = spots.map(([x, y, seed]) => ({ x, y, seed, open: 1, want: 1, hue: rnd(seed, 1), next: 0, wait: 0 }));
  }
  touch(x, y, r) {
    for (const a of this.a) if (Math.abs(x - a.x) < r && y > a.y - 16 && y < a.y + 4 && a.want > 0) { a.want = 0; a.wait = 0.7; a.next = (a.hue + 0.2 + rnd(a.seed + Math.floor(a.hue * 100), 3) * 0.5) % 1; }
  }
  press(x, y) { this.touch(x, y, 9); }
  push(x0, y0, x1, y1) { this.touch(x1, y1, 8); }
  draw(ctx, t) {
    const dt = this.tick(t);
    for (const a of this.a) {
      if (a.want === 0) { a.wait -= dt; if (a.wait <= 0 && a.open < 0.15) { a.hue = a.next; a.want = 1; } }
      a.open += (a.want - a.open) * Math.min(1, dt * (a.want ? 2.2 : 9));
      // the stalk and its lip
      px(ctx, a.x - 3, a.y - 3, hsl(a.hue, 0.45, 0.25), 7, 3);
      px(ctx, a.x - 2, a.y - 4, hsl(a.hue, 0.5, 0.35), 5, 1);
      const n = 8, L = 2 + a.open * 9;
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (i - (n - 1) / 2) * 0.32 * (0.4 + a.open * 0.8);
        for (let s = 1; s <= L; s++) {
          const sway = Math.sin(t * 2.2 + i * 0.7 + s * 0.35) * s * 0.12 * a.open;
          const x = a.x + Math.cos(ang) * s + sway, y = a.y - 4 + Math.sin(ang) * s;
          px(ctx, x, y, s > L - 1.5 ? hsl(a.hue + 0.05, 0.9, 0.85) : hsl(a.hue + s * 0.01, 0.85, 0.45 + s * 0.03));
        }
      }
      if (a.open > 0.6) halo(ctx, a.x, a.y - 8, 10, hsl(a.hue, 0.9, 0.6), 0.12);
    }
  }
}

// ------------------------------------------------------------------ Stormspire: lightning rods

/** A jagged bolt from a to b, as points. */
function bolt(ax, ay, bx, by, seed) {
  const n = Math.max(4, Math.round(Math.hypot(bx - ax, by - ay) / 6)), pts = [[ax, ay]];
  const nx = -(by - ay), ny = bx - ax, l = Math.hypot(nx, ny) || 1;
  for (let i = 1; i < n; i++) {
    const u = i / n, j = (rnd(seed, i) - 0.5) * 12 * Math.sin(u * Math.PI);
    pts.push([ax + (bx - ax) * u + (nx / l) * j, ay + (by - ay) * u + (ny / l) * j]);
  }
  pts.push([bx, by]);
  return pts;
}

class Rods extends Wonder {
  /** @param {[number, number][]} tips */
  constructor(tips) {
    super();
    this.tips = tips;
    /** @type {{pts:number[][], t0:number, life:number}[]} */
    this.bolts = [];
    this.nextArc = 2;
    this.seed = 1;
    this.flash = 0;
  }
  strike(ax, ay, bx, by, t, life = 0.32) {
    this.bolts.push({ pts: bolt(ax, ay, bx, by, this.seed++), t0: t, life });
    if (this.bolts.length > 8) this.bolts.shift();
  }
  press(x, y, t) {
    let best = null, bd = 110;
    for (const r of this.tips) { const d = Math.hypot(r[0] - x, r[1] - y); if (d < bd) { bd = d; best = r; } }
    if (!best) return;
    this.strike(best[0], best[1], x, y, t);
    // and on to the next rod
    const next = this.tips.filter((r) => r !== best).sort((p, q) => Math.hypot(p[0] - x, p[1] - y) - Math.hypot(q[0] - x, q[1] - y))[0];
    if (next && Math.hypot(next[0] - x, next[1] - y) < 140) this.strike(x, y, next[0], next[1], t + 0.05);
    this.flash = 0.12;
  }
  push(x0, y0, x1, y1, t) { if (rnd(this.seed, 9) < 0.15) this.press(x1, y1, t); }
  draw(ctx, t) {
    const dt = this.tick(t);
    this.nextArc -= dt;
    if (this.nextArc <= 0 && this.tips.length > 1) {
      const i = Math.floor(rnd(this.seed, 4) * this.tips.length), a = this.tips[i], b = this.tips[(i + 1) % this.tips.length];
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 200) this.strike(a[0], a[1], b[0], b[1], t, 0.25);
      this.nextArc = 2.5 + rnd(this.seed, 5) * 4;
    }
    // the rods' tips hum with light
    for (const [x, y] of this.tips) { halo(ctx, x, y, 10 + Math.sin(t * 7 + x) * 2, '#7ab0ff', 0.25); if (Math.sin(t * 11 + x) > 0.5) px(ctx, x, y - 1, '#ffffff'); }
    if (this.flash > 0) { this.flash -= dt; ctx.fillStyle = `rgba(200,220,255,${(this.flash * 1.5).toFixed(3)})`; ctx.fillRect(0, 0, SCENE_W, SCENE_H); }
    this.bolts = this.bolts.filter((b) => t - b.t0 < b.life && t >= b.t0 - 0.01);
    for (const b of this.bolts) {
      const u = (t - b.t0) / b.life, on = u < 0.15 || (u > 0.35 && u < 0.5) || u > 0.7;
      if (!on) continue;
      for (let i = 1; i < b.pts.length; i++) {
        const [x0, y0] = b.pts[i - 1], [x1, y1] = b.pts[i], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
        for (let s = 0; s <= n; s++) { const x = x0 + (x1 - x0) * (s / n), y = y0 + (y1 - y0) * (s / n); px(ctx, x - 1, y, '#5a8aff', 3, 1); px(ctx, x, y, '#ffffff'); }
      }
      const m = b.pts[Math.floor(b.pts.length / 2)];
      halo(ctx, m[0], m[1], 30, '#6aa0ff', 0.25);
    }
  }
}

// ------------------------------------------------------------------ Dreamspire: bubbles

class Bubbles extends Wonder {
  /** @param {[number, number][]} blooms */
  constructor(blooms) {
    super();
    this.src = blooms.length ? blooms : [[SCENE_W * 0.3, SCENE_H * 0.7], [SCENE_W * 0.7, SCENE_H * 0.7]];
    /** @type {{x:number, y:number, r:number, vy:number, ph:number, hue:number}[]} */
    this.b = [];
    /** @type {{x:number, y:number, vx:number, vy:number, t:number, c:string}[]} */
    this.sparks = [];
    this.spawn = 0;
    this.n = 0;
  }
  pop(x, y, r) {
    for (let i = this.b.length - 1; i >= 0; i--) {
      const b = this.b[i];
      if (Math.hypot(b.x - x, b.y - y) > b.r + r) continue;
      this.b.splice(i, 1);
      for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; this.sparks.push({ x: b.x, y: b.y, vx: Math.cos(a) * 30, vy: Math.sin(a) * 30 - 10, t: 0, c: hsl(b.hue + k * 0.07, 0.9, 0.8) }); }
    }
  }
  press(x, y) { this.pop(x, y, 4); }
  push(x0, y0, x1, y1) { this.pop(x1, y1, 3); }
  draw(ctx, t) {
    const dt = this.tick(t);
    this.spawn -= dt;
    if (this.spawn <= 0 && this.b.length < 14) {
      const s = this.src[this.n % this.src.length];
      this.b.push({ x: s[0] + (rnd(this.n, 1) - 0.5) * 8, y: s[1] - 4, r: 3 + rnd(this.n, 2) * 4, vy: -(7 + rnd(this.n, 3) * 7), ph: rnd(this.n, 4) * 6, hue: rnd(this.n, 5) });
      this.n++;
      this.spawn = 0.5 + rnd(this.n, 6) * 0.9;
    }
    for (let i = this.b.length - 1; i >= 0; i--) {
      const b = this.b[i];
      b.y += b.vy * dt; b.x += Math.sin(t * 1.3 + b.ph) * 6 * dt;
      if (b.y < -10) { this.b.splice(i, 1); continue; }
      const R = Math.round(b.r);
      for (let a = 0; a < 24; a++) {
        const an = (a / 24) * Math.PI * 2, x = b.x + Math.cos(an) * R, y = b.y + Math.sin(an) * R;
        px(ctx, x, y, hsl(b.hue + a / 24 * 0.5 + t * 0.1, 0.8, 0.82));
      }
      px(ctx, b.x - R * 0.45, b.y - R * 0.45, '#ffffff', 2, 1);
      halo(ctx, b.x, b.y, R + 4, hsl(b.hue, 0.9, 0.7), 0.1);
    }
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 40 * dt;
      if (s.t > 0.6) { this.sparks.splice(i, 1); continue; }
      px(ctx, s.x, s.y, s.c);
    }
  }
}

/**
 * The wonder of a region's scene, or null (a natural land has none).
 * @param {string} region @param {Record<string, any>} meta the scene's meta (visual/env/scene.js) @param {number} seed
 */
export function makeWonder(region, meta, seed) {
  if (region === 'moonfen') return new Wisps();
  if (region === 'skydrift') return new Isles(meta.isles || []);
  if (region === 'veilmist') return new Mist(seed % 997);
  if (region === 'reef') return new Anemones(meta.anemones || []);
  if (region === 'stormspire') return new Rods(meta.rods || []);
  if (region === 'dreamspire') return new Bubbles(meta.blooms || []);
  return null;
}
