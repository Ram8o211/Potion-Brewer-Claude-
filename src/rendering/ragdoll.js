// Ragdolls: what a ripe plant lets go of in the wilds, falling as a body.
//
// The ingredient's own sprite is cut along its long axis into one to three
// pieces (a short berry is one stiff piece; a tall flower its head, its
// stem and its foot) joined end to end. Each joint is a point mass moved by
// Verlet integration under gravity; the pieces keep their lengths, a joint
// bends only so far, and every point collides with the scene's ground, rock
// and water surface, bouncing a little and sliding to rest with friction.
// The pieces are drawn rotated with their own pixels, never resampled, so
// the ingredient keeps its texture however it lands. Pure (no DOM) except
// `draw`, so the physics runs in Node too.

/** Pull of gravity, scene pixels per second² (a scene pixel is a hand's breadth: things drop briskly). */
export const GRAVITY = 640;
/** The physics step (seconds): a few substeps per frame. */
export const STEP = 1 / 120;

/**
 * @typedef {{w:number, h:number, ax:number, ay:number}} SpriteBox  a sprite's size and the point it hangs or stands by
 * @typedef {(x:number, y:number) => boolean} SolidAt  whether the scene pixel (x, y) is something to rest on
 */

export class Ragdoll {
  /**
   * A body made from a sprite whose anchor stands at scene point (x, y).
   * @param {SpriteBox} sp @param {number} x @param {number} y
   * @param {{vx?:number, vy?:number, spin?:number, W:number, H:number}} o its push (pixels per second; spin: how much faster its top flies than its foot) and the scene's size
   */
  constructor(sp, x, y, o) {
    this.sp = sp;
    this.W = o.W; this.H = o.H;
    /** the long axis: down the sprite (a stem, a hanging fruit), or across it (something jutting from a face) */
    this.vertical = sp.h >= sp.w;
    const len = this.vertical ? sp.h : sp.w, thick = this.vertical ? sp.w : sp.h;
    const n = len >= 24 ? 3 : len >= 12 ? 2 : 1;
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
  }

  /**
   * Move the body on by dt seconds, colliding with `solid`.
   * @param {number} dt @param {SolidAt} solid
   */
  step(dt, solid) {
    if (this.asleep) return;
    let left = Math.min(dt, 0.1);
    while (left > 1e-6) {
      const h = Math.min(STEP, left);
      left -= h;
      this.t += h;
      this.sub(h, solid);
    }
  }

  /** One substep. @param {number} h @param {SolidAt} solid */
  sub(h, solid) {
    const n = this.px.length, { px, py, ox, oy, r } = this;
    let moved = 0, touching = false;
    for (let j = 0; j < n; j++) {
      const vx = (px[j] - ox[j]) * 0.999, vy = (py[j] - oy[j]) * 0.999;
      ox[j] = px[j]; oy[j] = py[j];
      px[j] += vx * (h / STEP); py[j] += vy * (h / STEP) + GRAVITY * h * h;
    }
    // the pieces keep their lengths; a joint bends at most so far
    for (let it = 0; it < 4; it++) {
      for (let i = 0; i < n - 1; i++) this.keep(i, i + 1, this.len[i], this.len[i]);
      for (let i = 0; i < n - 2; i++) { const L = this.len[i] + this.len[i + 1]; this.keep(i, i + 2, L * 0.72, L); }
    }
    for (let j = 0; j < n; j++) {
      // the scene's edges
      if (px[j] < 1) { px[j] = 1; ox[j] = px[j] + (px[j] - ox[j]) * 0.3; }
      if (px[j] > this.W - 2) { px[j] = this.W - 2; ox[j] = px[j] + (px[j] - ox[j]) * 0.3; }
      if (py[j] + r > this.H - 1) { this.land(j, this.H - 1 - r); touching = true; }
      const cx = Math.round(px[j]), row = Math.round(py[j] + r);
      if (solid(cx, row)) {
        touching = true;
        // onto the surface just above (exactly on it, so it lies still), else back where it was (it ran into a face)
        let k = 1;
        while (k <= 6 && solid(cx, row - k)) k++;
        if (k <= 6) this.land(j, row - k + 0.49 - r);
        else { const vx = px[j] - ox[j]; px[j] = ox[j]; py[j] = oy[j]; ox[j] = px[j] + vx * 0.3; }
      } else if (solid(cx, row + 1) && py[j] + r > row + 0.3) touching = true;
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
        for (let j = 0; j < n; j++) if (j !== foot) ox[j] -= dir * GRAVITY * 0.6 * h * h * Math.min(1, (py[foot] - py[j]) / Math.max(1, rise * 2));
      }
    }
    // at rest once it has lain still a moment
    // (never while it still stands: it is going over)
    this.still = touching && !upright && moved < 0.05 ? this.still + h : 0;
    // (and one creeping down a slope or rocking on a bump, after a while on the ground)
    this.ground = touching ? this.ground + h : 0;
    if (this.still > 0.35 || (this.ground > (upright ? 6 : 3) && moved < 0.4)) this.asleep = true;
  }

  /** Joint j comes to the surface at height y: it bounces a little and slides with friction. @param {number} j @param {number} y */
  land(j, y) {
    const vx = this.px[j] - this.ox[j], vy = this.py[j] - this.oy[j];
    this.knock = Math.max(this.knock, Math.abs(vy) / STEP);
    this.py[j] = y;
    // (a quick fall bounces back up a little, a slow one just stops)
    this.oy[j] = y + (vy > 0.25 ? vy * 0.3 : 0);
    this.ox[j] = this.px[j] - vx * 0.6;
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
    if (hit) { this.asleep = false; this.still = 0; this.ground = 0; }
    return hit;
  }

  /** Whether no joint is in something solid. @param {SolidAt} solid */
  clear(solid) {
    for (let j = 0; j < this.px.length; j++) if (solid(Math.round(this.px[j]), Math.round(this.py[j] + this.r))) return false;
    return true;
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
