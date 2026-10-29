// Procedural geometry: the shapes a species is built from, before any pixel
// exists. A Model is an ordered list of parts (back to front) in free
// coordinates — filled outlines, tapering strokes, single-pixel lines and
// dots — each naming the material (a palette ramp of the species) it is
// painted in and how it is shaded. The rasterizer (raster.js) turns a model
// into pixels at any size, so one geometry yields the plant on the ground,
// its close-up icon and the pieces poured into the cauldron.

/**
 * @typedef {[number, number]} Pt
 * @typedef {Object} Part
 * @property {'poly'|'stroke'|'line'|'dot'} t
 * @property {Pt[]} [pts]
 * @property {number|number[]} [w]     stroke width (per point when an array)
 * @property {number} [x] @property {number} [y]
 * @property {string} mat              palette ramp
 * @property {'round'|'fold'|'flat'|'cyl'|'facet'} [shade]
 * @property {number} [tone]           lightness offset (−1..1)
 * @property {number} [lum]            fixed lightness for 'facet' parts (0..1)
 * @property {boolean} [clip]          lines and dots only over what is already drawn
 * @property {boolean} [noOutline]     the edge of this part is not inked
 * @property {number} [tex]            surface texture strength (default 1)
 * @property {boolean} [glow]          a spot that can glimmer (magic)
 */

export class Model {
  constructor() {
    /** @type {Part[]} */
    this.parts = [];
    /** points of interest (glints, glow spots) in model coordinates @type {Pt[]} */
    this.glints = [];
  }

  /** @param {Part} p */
  add(p) { this.parts.push(p); return this; }

  /** @param {Pt[]} pts @param {string} mat @param {Partial<Part>} [o] */
  poly(pts, mat, o = {}) { return this.add({ t: 'poly', pts, mat, shade: 'round', ...o }); }

  /** @param {Pt[]} pts @param {number|number[]} w @param {string} mat @param {Partial<Part>} [o] */
  stroke(pts, w, mat, o = {}) { return this.add({ t: 'stroke', pts, w, mat, shade: 'cyl', ...o }); }

  /** @param {Pt[]} pts @param {string} mat @param {Partial<Part>} [o] */
  line(pts, mat, o = {}) { return this.add({ t: 'line', pts, mat, clip: true, ...o }); }

  /** @param {number} x @param {number} y @param {string} mat @param {Partial<Part>} [o] */
  dot(x, y, mat, o = {}) { return this.add({ t: 'dot', x, y, mat, clip: true, ...o }); }

  /** @param {number} cx @param {number} cy @param {number} rx @param {number} ry @param {string} mat @param {Partial<Part>} [o] @param {number} [rot] */
  ellipse(cx, cy, rx, ry, mat, o = {}, rot = 0) { return this.poly(ellipse(cx, cy, rx, ry, rot), mat, o); }

  /** Bounds of every point. */
  bounds() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const take = (x, y, r = 0) => { x0 = Math.min(x0, x - r); y0 = Math.min(y0, y - r); x1 = Math.max(x1, x + r); y1 = Math.max(y1, y + r); };
    for (const p of this.parts) {
      if (p.pts) {
        p.pts.forEach((q, i) => take(q[0], q[1], p.t === 'stroke' ? (Array.isArray(p.w) ? p.w[i] ?? p.w[p.w.length - 1] : p.w || 1) / 2 : 0));
      } else take(p.x, p.y);
    }
    return { x0, y0, x1, y1 };
  }

  /** Apply an affine map x' = a·x + c·y + e, y' = b·x + d·y + f (widths scale by |k|). */
  transform(a, b, c, d, e, f, k = Math.sqrt(Math.abs(a * d - b * c))) {
    const m = (/** @type {Pt} */ q) => /** @type {Pt} */ ([a * q[0] + c * q[1] + e, b * q[0] + d * q[1] + f]);
    for (const p of this.parts) {
      if (p.pts) p.pts = p.pts.map(m);
      if (p.x !== undefined) { const [x, y] = m([p.x, p.y]); p.x = x; p.y = y; }
      if (p.w !== undefined) p.w = Array.isArray(p.w) ? p.w.map((v) => v * k) : p.w * k;
    }
    this.glints = this.glints.map(m);
    return this;
  }

  /** Rotate about a point. @param {number} ang radians */
  rotate(ang, cx = 0, cy = 0) {
    const c = Math.cos(ang), s = Math.sin(ang);
    return this.transform(c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy, 1);
  }

  /**
   * Scale and move the model to fit a w × h box (keeping its proportions),
   * centred, or standing on the bottom edge when `foot` is set. Returns the scale.
   * @param {number} w @param {number} h @param {{margin?:number, foot?:boolean, max?:number}} [o]
   */
  fit(w, h, o = {}) {
    const mg = o.margin ?? 1, b = this.bounds();
    const bw = Math.max(1e-6, b.x1 - b.x0), bh = Math.max(1e-6, b.y1 - b.y0);
    const s = Math.min((w - mg * 2) / bw, (h - mg * 2) / bh, o.max ?? Infinity);
    const ox = (w - bw * s) / 2 - b.x0 * s, oy = o.foot ? h - mg - b.y1 * s : (h - bh * s) / 2 - b.y0 * s;
    this.transform(s, 0, 0, s, ox, oy, s);
    return s;
  }

  /** A deep copy. */
  clone() {
    const m = new Model();
    m.parts = this.parts.map((p) => ({ ...p, pts: p.pts ? p.pts.map((q) => /** @type {Pt} */ ([q[0], q[1]])) : undefined, w: Array.isArray(p.w) ? p.w.slice() : p.w }));
    m.glints = this.glints.map((q) => /** @type {Pt} */ ([q[0], q[1]]));
    return m;
  }

  /** Append another model's parts (drawn in front). @param {Model} o */
  merge(o) { this.parts.push(...o.parts); this.glints.push(...o.glints); return this; }
}

// ------------------------------------------------------------------ shape helpers

/**
 * How square the round shapes are: the exponent of the superellipse every
 * "ellipse" and lump is drawn as (2 would be a true ellipse; 4 a squircle),
 * so bodies, berries, caps and stones read as blocks, after Noita.
 */
export const SQUARE = 4;

/** A point of the unit superellipse at angle a: [x, y]. @param {number} a */
export function sq(a) {
  const c = Math.cos(a), s = Math.sin(a), e = 2 / SQUARE;
  return [Math.sign(c) * Math.pow(Math.abs(c), e), Math.sign(s) * Math.pow(Math.abs(s), e)];
}

/** An ellipse outline (squared off: a superellipse, see SQUARE). */
export function ellipse(cx, cy, rx, ry, rot = 0, n = 0) {
  n = n || Math.max(12, Math.round((rx + ry) * 2.4));
  const c = Math.cos(rot), s = Math.sin(rot), out = /** @type {Pt[]} */ ([]);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, [ux, uy] = sq(a), x = ux * rx, y = uy * ry;
    out.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return out;
}

/** Points along a cubic Bézier. @param {Pt} p0 @param {Pt} p1 @param {Pt} p2 @param {Pt} p3 */
export function bezier(p0, p1, p2, p3, n = 12) {
  const out = /** @type {Pt[]} */ ([]);
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return out;
}

/** Points along a quadratic curve from a to b bending by `bend` (perpendicular, in units of the length). */
export function arc(a, b, bend, n = 10) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
  const c = /** @type {Pt} */ ([mx - dy * bend, my + dx * bend]);
  const out = /** @type {Pt[]} */ ([]);
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
  }
  return out;
}

/**
 * A blade outline (leaf, petal, scale…) from `base` along `ang` for `len`,
 * its half-width at fraction t given by `profile(t)` × `width`. `edge`
 * adds teeth (serration count) and `asym` makes one side wider.
 * @param {Pt} base @param {number} ang @param {number} len @param {number} width @param {(t:number)=>number} profile
 * @param {{teeth?:number, tooth?:number, asym?:number, curl?:number, n?:number}} [o]
 */
export function blade(base, ang, len, width, profile, o = {}) {
  const n = o.n ?? Math.max(8, Math.round(len * 1.5)), teeth = o.teeth || 0, tooth = o.tooth ?? 0.25, asym = o.asym || 0, curl = o.curl || 0;
  const left = /** @type {Pt[]} */ ([]), right = /** @type {Pt[]} */ ([]);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // the midrib curls as it goes
    const a = ang + curl * t * t;
    const cx = base[0] + Math.cos(ang) * len * t + Math.cos(a + Math.PI / 2) * curl * len * t * t * 0.15;
    const cy = base[1] + Math.sin(ang) * len * t + Math.sin(a + Math.PI / 2) * curl * len * t * t * 0.15;
    let hw = Math.max(0, profile(t)) * width;
    // serration: each tooth widens toward its point, which faces the tip
    if (teeth && t > 0.08 && t < 0.95) hw *= 1 - tooth + tooth * ((t * teeth) % 1);
    const nx = Math.cos(a + Math.PI / 2), ny = Math.sin(a + Math.PI / 2);
    left.push([cx + nx * hw * (1 + asym), cy + ny * hw * (1 + asym)]);
    right.push([cx - nx * hw * (1 - asym), cy - ny * hw * (1 - asym)]);
  }
  return left.concat(right.reverse());
}

/** Common blade profiles: half-width (0..1) along the blade. */
export const PROFILES = {
  ovate: (t) => Math.sin(Math.PI * Math.pow(t, 0.8)) * (1 - t * 0.15),
  lance: (t) => Math.sin(Math.PI * Math.pow(t, 0.6)) * (1 - t * 0.35),
  round: (t) => Math.sqrt(Math.max(0, 1 - Math.pow(t * 2 - 1, 2))),
  spoon: (t) => Math.pow(Math.sin(Math.PI * Math.pow(t, 1.6)), 0.8),
  heart: (t) => (t > 0.85 ? Math.max(0, (1 - t) / 0.15) * 0.75 : Math.sin(Math.PI * Math.pow(t, 0.55) * 0.92)),
  linear: (t) => (t < 0.85 ? 1 - t * 0.35 : (1 - t) / 0.15 * 0.7),
  needle: (t) => (1 - t) * 0.9 + 0.1 * Math.sin(Math.PI * t),
  wedge: (t) => Math.min(1, t * 1.6) * (t > 0.9 ? (1 - t) * 8 : 1),
};

/** Nudge every point of an outline by up to `amt` (organic irregularity). @param {Pt[]} pts @param {()=>number} rnd */
export function roughen(pts, rnd, amt) {
  return pts.map((q) => /** @type {Pt} */ ([q[0] + (rnd() - 0.5) * 2 * amt, q[1] + (rnd() - 0.5) * 2 * amt]));
}

/** A lumpy closed outline around a centre: a squared-off body (see SQUARE), radius r × (1 ± lump) over `k` bumps. */
export function lumpy(cx, cy, rx, ry, rnd, lump = 0.15, k = 7, n = 0) {
  n = n || Math.max(12, Math.round((rx + ry) * 2.5));
  const amps = Array.from({ length: k }, () => 1 + (rnd() - 0.5) * 2 * lump);
  rnd(); // (the old rotation's draw: keeps every later draw of the stream in place)
  const out = /** @type {Pt[]} */ ([]);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, f = (i / n) * k, i0 = Math.floor(f) % k, i1 = (i0 + 1) % k, u = f - Math.floor(f);
    const r = amps[i0] + (amps[i1] - amps[i0]) * (u * u * (3 - 2 * u)), [ux, uy] = sq(a);
    out.push([cx + ux * rx * r, cy + uy * ry * r]);
  }
  return out;
}

/** A regular-ish polygon (crystal facets, stones) with jittered vertices. */
export function polygon(cx, cy, r, k, rot, rnd, jit = 0.15, sy = 1) {
  const out = /** @type {Pt[]} */ ([]);
  for (let i = 0; i < k; i++) {
    const a = rot + (i / k) * Math.PI * 2 + (rnd() - 0.5) * jit;
    const rr = r * (1 + (rnd() - 0.5) * jit);
    out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sy]);
  }
  return out;
}

/** Point along a polyline at fraction t (by length). @param {Pt[]} pts @param {number} t */
export function along(pts, t) {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const want = L[L.length - 1] * Math.max(0, Math.min(1, t));
  for (let i = 1; i < pts.length; i++) {
    if (L[i] >= want) {
      const u = (want - L[i - 1]) / Math.max(1e-9, L[i] - L[i - 1]);
      const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u;
      return { x, y, ang: Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]) };
    }
  }
  const n = pts.length - 1;
  return { x: pts[n][0], y: pts[n][1], ang: n > 0 ? Math.atan2(pts[n][1] - pts[n - 1][1], pts[n][0] - pts[n - 1][0]) : -Math.PI / 2 };
}

/** The part of a polyline up to fraction t. @param {Pt[]} pts @param {number} t */
export function upTo(pts, t) {
  if (t >= 1) return pts.slice();
  const end = along(pts, t), out = /** @type {Pt[]} */ ([pts[0]]);
  let L = 0;
  const total = pts.reduce((a, q, i) => (i ? a + Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) : 0), 0);
  for (let i = 1; i < pts.length; i++) {
    L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (L >= total * t) break;
    out.push(pts[i]);
  }
  out.push([end.x, end.y]);
  return out;
}
