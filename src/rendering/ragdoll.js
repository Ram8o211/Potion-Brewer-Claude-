// Ragdolls: what a ripe plant lets go of in the wilds, falling as a body.
//
// The ingredient's own sprite is cut along its long axis into one to three
// pieces (a short berry is one stiff piece; a tall flower its head, its
// stem and its foot) joined end to end; a rigid body (a crystal broken from
// its rock) is always one stiff piece, however long. Each joint is a point mass moved by
// Verlet integration under gravity; the pieces keep their lengths and a
// joint bends only so far. The terrain (ground, rock, a water surface) is
// impenetrable: every joint is a small disc and every piece a row of them,
// swept along its path each step so nothing tunnels through a thin ledge;
// what meets the terrain stops at its surface, bounces a little off it and
// slides along it with friction, and anything that would still overlap it
// goes back to where it last was clear. A body that starts overlapping the
// scenery (a fruit hung in front of a ledge) is first set down clear of it.
// The pieces are drawn rotated with their own pixels, never resampled, so
// the ingredient keeps its texture however it lands. Pure (no DOM) except
// `draw`, so the physics runs in Node too.

/** Pull of gravity, scene pixels per second² (a scene pixel is a hand's breadth: things drop briskly). */
export const GRAVITY = 640;
/** The physics step (seconds): a few substeps per frame. */
export const STEP = 1 / 120;
/** How hard the ground brakes what slides on it (pixels per second²): it stops, it does not stick. */
export const FRICTION = 380;

/** Points round a disc's rim (unit), and finer: what the terrain is tested at, the first straight up. */
const RING = Array.from({ length: 8 }, (_, i) => [Math.sin((i * Math.PI) / 4), -Math.cos((i * Math.PI) / 4)]);
const RING16 = Array.from({ length: 16 }, (_, i) => [Math.sin((i * Math.PI) / 8), -Math.cos((i * Math.PI) / 8)]);

/**
 * @typedef {{w:number, h:number, ax:number, ay:number}} SpriteBox  a sprite's size and the point it hangs or stands by
 * @typedef {(x:number, y:number) => boolean} SolidAt  whether the scene pixel (x, y) is something to rest on
 */

export class Ragdoll {
  /**
   * A body made from a sprite whose anchor stands at scene point (x, y).
   * @param {SpriteBox} sp @param {number} x @param {number} y
   * @param {{vx?:number, vy?:number, spin?:number, W:number, H:number, rigid?:boolean}} o its push (pixels per second; spin: how much faster its top flies than its foot) and the scene's size; `rigid`: one stiff piece that never bends (a crystal, a stone)
   */
  constructor(sp, x, y, o) {
    this.sp = sp;
    this.W = o.W; this.H = o.H;
    /** the long axis: down the sprite (a stem, a hanging fruit), or across it (something jutting from a face) */
    this.vertical = sp.h >= sp.w;
    const len = this.vertical ? sp.h : sp.w, thick = this.vertical ? sp.w : sp.h;
    /** a rigid body is a single stiff piece: it tumbles and lands whole, it never bends */
    this.rigid = !!o.rigid;
    const n = this.rigid ? 1 : len >= 24 ? 3 : len >= 12 ? 2 : 1;
    /** where each piece starts along the long axis (sprite pixels), and the end */
    this.cuts = Array.from({ length: n + 1 }, (_, j) => Math.round((j * len) / n));
    /** half the thickness of the body: what keeps it from sinking into the ground */
    this.r = Math.max(1.5, Math.min(5, thick * 0.32));
    const left = x - sp.ax, top = y - sp.ay;
    /** the joints: position and where they were a step ago */
    this.px = new Float64Array(n + 1); this.py = new Float64Array(n + 1);
    this.ox = new Float64Array(n + 1); this.oy = new Float64Array(n + 1);
    // (nothing falls perfectly straight: a body never balances on its foot)
    /** which way it leans when nothing else decides (from where it grew) */
    this.side = (Math.round(x * 7 + y * 3) & 1) ? 1 : -1;
    const vx = o.vx ?? 0, vy = o.vy ?? 0, spin = (o.spin ?? 0) + this.side * 6;
    for (let j = 0; j <= n; j++) {
      const u = this.cuts[j];
      this.px[j] = this.vertical ? left + sp.w / 2 : left + u;
      this.py[j] = this.vertical ? top + u : top + sp.h / 2;
      // the top of the body flies out faster than its foot: it tumbles
      const lift = n ? 1 - j / n : 0;
      this.ox[j] = this.px[j] - (vx + spin * lift) * STEP;
      this.oy[j] = this.py[j] - vy * STEP;
    }
    /** each piece's length */
    this.len = this.cuts.slice(1).map((c, i) => c - this.cuts[i]);
    /** at rest (not simulated until something kicks it) */
    this.asleep = false;
    this.still = 0;
    /** how long it has been touching the ground (seconds) */
    this.ground = 0;
    /** the hardest knock against the ground since last read (pixels per second), for a sound */
    this.knock = 0;
    this.t = 0;
    /** time not yet stepped (less than a step) */
    this.acc = 0;
    /** where its middle was at the last look, and how long since (to tell a trembling body at rest) @type {{x:number, y:number}|null} */
    this.mark = null;
    this.watch = 0;
    /** each joint's last place clear of the terrain (null till the body has been set down clear of it) */
    /** @type {Float64Array|null} */ this.qx = null;
    /** @type {Float64Array|null} */ this.qy = null;
  }

  /**
   * Move the body on by dt seconds, colliding with `solid`.
   * @param {number} dt @param {SolidAt} solid
   */
  step(dt, solid) {
    if (this.asleep) return;
    // whole steps only, the rest carried to the next frame: a Verlet body
    // keeps its speed as the distance of its last step, so a sliver of a
    // step would all but stop it (frames are never exactly 1/120 s apart)
    this.acc += Math.min(dt, 0.1);
    while (this.acc >= STEP) {
      this.acc -= STEP;
      this.t += STEP;
      this.sub(STEP, solid);
      if (this.asleep) { this.acc = 0; break; }
    }
  }

  /** Whether a disc of radius r at (x, y) overlaps the terrain. @param {number} x @param {number} y @param {number} r @param {SolidAt} solid */
  static hits(x, y, r, solid) {
    if (solid(Math.round(x), Math.round(y))) return true;
    for (const [cx, cy] of RING) if (solid(Math.round(x + cx * r), Math.round(y + cy * r))) return true;
    return false;
  }

  /** The way out of the terrain at (x, y): away from what is solid round it (up where it cannot tell). @param {number} x @param {number} y @param {number} r @param {SolidAt} solid */
  static normal(x, y, r, solid) {
    let nx = 0, ny = 0;
    for (const [cx, cy] of RING16) if (solid(Math.round(x + cx * (r + 1.5)), Math.round(y + cy * (r + 1.5)))) { nx -= cx; ny -= cy; }
    const d = Math.hypot(nx, ny);
    return d > 1e-6 ? [nx / d, ny / d] : [0, -1];
  }

  /** The shortest move (up first, where moves tie) that takes a disc at (x, y) clear of the terrain, within `far` pixels, or null. @param {number} x @param {number} y @param {number} r @param {number} far @param {SolidAt} solid */
  static out(x, y, r, far, solid) {
    for (let d = 0.5; d <= far; d += 0.5) for (const [cx, cy] of RING16) if (!Ragdoll.hits(x + cx * d, y + cy * d, r, solid)) return [cx * d, cy * d];
    return null;
  }

  /** The points along piece i where it is tested against the terrain (between its joints), as fractions of it. @param {number} i */
  samples(i) {
    const m = Math.max(1, Math.ceil(this.len[i] / 2)), out = [];
    for (let k = 1; k < m; k++) out.push(k / m);
    return out;
  }

  /** Whether the body as it is now overlaps the terrain anywhere (a joint, or a point along a piece). @param {SolidAt} solid */
  overlaps(solid) {
    const { px, py, r } = this, rs = r * 0.8;
    for (let j = 0; j < px.length; j++) if (Ragdoll.hits(px[j], py[j], r, solid)) return true;
    for (let i = 0; i < this.len.length; i++) for (const u of this.samples(i)) if (Ragdoll.hits(px[i] + (px[i + 1] - px[i]) * u, py[i] + (py[i + 1] - py[i]) * u, rs, solid)) return true;
    return false;
  }

  /** Set the body down clear of the terrain: the nearest place, up first where places tie, keeping its speed. @param {SolidAt} solid */
  settle(solid) {
    if (this.overlaps(solid)) {
      found: for (let d = 1; d <= 28; d++) for (const [cx, cy] of RING16) {
        const dx = Math.round(cx * d), dy = Math.round(cy * d);
        this.shift(dx, dy);
        if (!this.overlaps(solid)) break found;
        this.shift(-dx, -dy);
      }
    }
    this.qx = Float64Array.from(this.px); this.qy = Float64Array.from(this.py);
  }

  /**
   * Joint j would move from where it was last clear to where it is now: it
   * goes as far along that way as the terrain lets it, then slides along the
   * surface it met; meeting one, it loses its speed into the surface (a
   * quick fall keeps a little of it as a bounce) and is braked along it.
   * Returns whether it met the terrain.
   * @param {number} j @param {SolidAt} solid
   */
  sweep(j, solid) {
    const { px, py, ox, oy, r } = this, qx = /** @type {Float64Array} */ (this.qx), qy = /** @type {Float64Array} */ (this.qy);
    const tx = px[j], ty = py[j];
    if (!Ragdoll.hits(tx, ty, r, solid)) return false;
    // as far as it gets, in steps of half a pixel
    const dx = tx - qx[j], dy = ty - qy[j], dist = Math.hypot(dx, dy), n = Math.max(1, Math.ceil(dist / 0.5));
    let cx = qx[j], cy = qy[j];
    for (let k = 1; k <= n; k++) {
      const x = qx[j] + (dx * k) / n, y = qy[j] + (dy * k) / n;
      if (Ragdoll.hits(x, y, r, solid)) break;
      cx = x; cy = y;
    }
    const [nx, ny] = Ragdoll.normal(tx, ty, r, solid);
    // the rest of the way, along the surface
    const rx = tx - cx, ry = ty - cy, along = rx * -ny + ry * nx;
    const sx = cx + -ny * along, sy = cy + nx * along;
    if (!Ragdoll.hits(sx, sy, r, solid)) { cx = sx; cy = sy; }
    px[j] = cx; py[j] = cy;
    // its speed: none into the surface (a little back out of it after a quick fall), braked along it
    const vx = tx - ox[j], vy = ty - oy[j], vn = vx * nx + vy * ny;
    let wx = vx, wy = vy;
    if (vn < 0) {
      this.knock = Math.max(this.knock, -vn / STEP);
      const back = -vn > 0.25 ? -vn * 0.3 : 0;
      wx = vx - vn * nx + back * nx; wy = vy - vn * ny + back * ny;
    }
    const vt = wx * -ny + wy * nx, brake = FRICTION * STEP * STEP, vt2 = Math.sign(vt) * Math.max(0, Math.abs(vt) - brake);
    wx += (vt2 - vt) * -ny; wy += (vt2 - vt) * nx;
    ox[j] = px[j] - wx; oy[j] = py[j] - wy;
    return true;
  }

  /** One substep. @param {number} h @param {SolidAt} solid */
  sub(h, solid) {
    const n = this.px.length, { px, py, ox, oy, r } = this;
    if (!this.qx) this.settle(solid);
    const qx = /** @type {Float64Array} */ (this.qx), qy = /** @type {Float64Array} */ (this.qy);
    let moved = 0, touching = false;
    for (let j = 0; j < n; j++) {
      const vx = (px[j] - ox[j]) * 0.999, vy = (py[j] - oy[j]) * 0.999;
      ox[j] = px[j]; oy[j] = py[j];
      px[j] += vx * (h / STEP); py[j] += vy * (h / STEP) + GRAVITY * h * h;
    }
    const rs = r * 0.8;
    for (let it = 0; it < 3; it++) {
      // the pieces keep their lengths; a joint bends at most so far
      for (let i = 0; i < n - 1; i++) this.keep(i, i + 1, this.len[i], this.len[i]);
      for (let i = 0; i < n - 2; i++) { const L = this.len[i] + this.len[i + 1]; this.keep(i, i + 2, L * 0.72, L); }
      // the scene's edges
      for (let j = 0; j < n; j++) {
        if (px[j] < 1 + r) { px[j] = 1 + r; ox[j] = px[j] + (px[j] - ox[j]) * 0.3; }
        if (px[j] > this.W - 2 - r) { px[j] = this.W - 2 - r; ox[j] = px[j] + (px[j] - ox[j]) * 0.3; }
        if (py[j] > this.H - 1 - r) { py[j] = this.H - 1 - r; oy[j] = py[j]; touching = true; }
      }
      // the joints meet the terrain
      for (let j = 0; j < n; j++) if (this.sweep(j, solid)) touching = true;
      // and so does every piece along its length: one pressed into it is pushed out at both ends
      for (let i = 0; i < n - 1; i++) for (const u of this.samples(i)) {
        const x = px[i] + (px[i + 1] - px[i]) * u, y = py[i] + (py[i + 1] - py[i]) * u;
        if (!Ragdoll.hits(x, y, rs, solid)) continue;
        touching = true;
        const d = Ragdoll.out(x, y, rs, 4, solid);
        if (!d) continue;
        const k = 1 / ((1 - u) * (1 - u) + u * u);
        px[i] += d[0] * (1 - u) * k; py[i] += d[1] * (1 - u) * k;
        px[i + 1] += d[0] * u * k; py[i + 1] += d[1] * u * k;
      }
    }
    // nothing ever stays in the terrain: a joint, or a piece, still in it goes back to where it last was clear, stopped
    for (let j = 0; j < n; j++) if (Ragdoll.hits(px[j], py[j], r, solid)) { px[j] = qx[j]; py[j] = qy[j]; ox[j] = px[j]; oy[j] = py[j]; touching = true; }
    for (let i = 0; i < n - 1; i++) for (const u of this.samples(i)) {
      if (!Ragdoll.hits(px[i] + (px[i + 1] - px[i]) * u, py[i] + (py[i + 1] - py[i]) * u, rs, solid)) continue;
      for (const j of [i, i + 1]) { px[j] = qx[j]; py[j] = qy[j]; ox[j] = px[j]; oy[j] = py[j]; }
      touching = true;
      break;
    }
    // resting on it counts as touching it
    if (!touching) for (let j = 0; j < n && !touching; j++) if (Ragdoll.hits(px[j], py[j] + 1, r, solid)) touching = true;
    for (let j = 0; j < n; j++) {
      if (!Ragdoll.hits(px[j], py[j], r, solid)) { qx[j] = px[j]; qy[j] = py[j]; }
      moved = Math.max(moved, Math.abs(px[j] - ox[j]), Math.abs(py[j] - oy[j]));
    }
    // standing up it tips over: gravity's pull round its foot (point masses alone would balance forever) —
    // the whole body one way, so a zigzag of pieces cannot prop itself up
    let upright = false;
    if (touching && n > 1) {
      let foot = 0, cx = 0, cy = 0;
      for (let j = 0; j < n; j++) { if (py[j] > py[foot]) foot = j; cx += px[j] / n; cy += py[j] / n; }
      const rise = py[foot] - cy, lean = cx - px[foot], total = this.len.reduce((x, y) => x + y, 0);
      if (rise > total * 0.18 && rise > Math.abs(lean) * 0.8) {
        upright = true;
        const dir = Math.abs(lean) > 0.3 ? Math.sign(lean) : this.side;
        for (let j = 0; j < n; j++) if (j !== foot) ox[j] -= dir * GRAVITY * 1.6 * h * h * Math.min(1, (py[foot] - py[j]) / Math.max(1, rise));
      }
    }
    // at rest once it has lain still a moment (one still standing, a while
    // longer: it may be going over — or propped against a face, and staying)
    this.still = touching && moved < 0.05 ? this.still + h : 0;
    // (and one creeping down a slope or rocking on a bump, after a while on the ground)
    this.ground = touching ? this.ground + h : 0;
    if (this.still > (upright ? 0.6 : 0.35) || (this.ground > 2 && moved < 0.4)) this.asleep = true;
    // (and one that only trembles where it lies — wedged between faces — once it has not got anywhere in half a second)
    if (touching && !this.asleep) {
      this.watch += h;
      if (this.watch >= 0.5) {
        const c = this.centre();
        if (this.mark && Math.hypot(c.x - this.mark.x, c.y - this.mark.y) < 0.8 && this.ground > 1) this.asleep = true;
        this.mark = c; this.watch = 0;
      }
    } else { this.watch = 0; this.mark = null; }
  }

  /** Keep joints a and b between lo and hi apart, moving both. @param {number} a @param {number} b @param {number} lo @param {number} hi */
  keep(a, b, lo, hi) {
    const { px, py } = this, dx = px[b] - px[a], dy = py[b] - py[a], d = Math.hypot(dx, dy) || 1e-6;
    const want = d < lo ? lo : d > hi ? hi : d;
    if (want === d) return;
    const k = (d - want) / d / 2;
    px[a] += dx * k; py[a] += dy * k; px[b] -= dx * k; py[b] -= dy * k;
  }

  /**
   * A finger passing from (x0, y0) to (x1, y1) knocks every joint it comes
   * close to along with it (and wakes the body).
   * @param {number} x0 @param {number} y0 @param {number} x1 @param {number} y1 @param {number} reach
   * @returns {boolean} whether it touched the body
   */
  kick(x0, y0, x1, y1, reach) {
    const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1e-6;
    let hit = false;
    for (let j = 0; j < this.px.length; j++) {
      const u = Math.max(0, Math.min(1, ((this.px[j] - x0) * dx + (this.py[j] - y0) * dy) / L2));
      if (Math.hypot(x0 + dx * u - this.px[j], y0 + dy * u - this.py[j]) > reach + this.r) continue;
      hit = true;
      // a flick along the finger's way, and a little up off the ground
      const s = Math.min(1, Math.sqrt(L2) / 12);
      this.ox[j] -= Math.max(-110, Math.min(110, dx * 14)) * s * STEP;
      this.oy[j] -= (Math.max(-90, Math.min(30, dy * 9)) - 60 * s) * STEP;
    }
    if (hit) { this.asleep = false; this.still = 0; this.ground = 0; this.watch = 0; this.mark = null; }
    return hit;
  }

  /** Whether the body is clear of the terrain. @param {SolidAt} solid */
  clear(solid) {
    return !this.overlaps(solid);
  }

  /** Move the whole body, its speed kept. @param {number} dx @param {number} dy */
  shift(dx, dy) {
    for (let j = 0; j < this.px.length; j++) { this.px[j] += dx; this.ox[j] += dx; this.py[j] += dy; this.oy[j] += dy; }
  }

  /** The middle of the body. */
  centre() {
    let x = 0, y = 0;
    for (let j = 0; j < this.px.length; j++) { x += this.px[j]; y += this.py[j]; }
    return { x: x / this.px.length, y: y / this.py.length };
  }

  /** A box round the whole body, grown by `pad`. @param {number} [pad] */
  box(pad = 0) {
    const half = (this.vertical ? this.sp.w : this.sp.h) / 2 + pad;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let j = 0; j < this.px.length; j++) {
      x0 = Math.min(x0, this.px[j]); x1 = Math.max(x1, this.px[j]);
      y0 = Math.min(y0, this.py[j]); y1 = Math.max(y1, this.py[j]);
    }
    return { x0: x0 - half, y0: y0 - half, x1: x1 + half, y1: y1 + half };
  }

  /**
   * Each piece as it lies now: its middle, its turn from how it grew, and
   * the part of the sprite it is (sx, sy, sw, sh) with the offset of its
   * middle within it.
   */
  pieces() {
    const out = [], { sp } = this;
    for (let i = 0; i < this.len.length; i++) {
      const ax = this.px[i], ay = this.py[i], bx = this.px[i + 1], by = this.py[i + 1];
      const ang = Math.atan2(by - ay, bx - ax) - (this.vertical ? Math.PI / 2 : 0);
      const c0 = this.cuts[i], c1 = this.cuts[i + 1];
      // (each piece reaches a pixel into the next, so a bent joint shows no gap)
      const e0 = Math.max(0, c0 - (i ? 1 : 0)), e1 = c1;
      out.push(this.vertical
        ? { x: (ax + bx) / 2, y: (ay + by) / 2, ang, sx: 0, sy: e0, sw: sp.w, sh: e1 - e0, mx: sp.w / 2, my: (c0 + c1) / 2 - e0 }
        : { x: (ax + bx) / 2, y: (ay + by) / 2, ang, sx: e0, sy: 0, sw: e1 - e0, sh: sp.h, mx: (c0 + c1) / 2 - e0, my: sp.h / 2 });
    }
    return out;
  }

  /**
   * Draw the body with the sprite's own pixels (browser): each piece turned
   * about its middle, never smoothed.
   * @param {CanvasRenderingContext2D} ctx @param {CanvasImageSource} cv
   */
  draw(ctx, cv) {
    const smooth = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    for (const p of this.pieces()) {
      if (p.sw <= 0 || p.sh <= 0) continue;
      // a piece barely turned is drawn upright on whole pixels, exactly as it grew
      const turned = Math.abs(p.ang) > 0.06;
      ctx.save();
      ctx.translate(Math.round(p.x), Math.round(p.y));
      if (turned) ctx.rotate(p.ang);
      ctx.drawImage(cv, p.sx, p.sy, p.sw, p.sh, -Math.round(p.mx), -Math.round(p.my), p.sw, p.sh);
      ctx.restore();
    }
    ctx.imageSmoothingEnabled = smooth;
  }
}
