// Cauldron geometry and thermal body.
//
// The interior is described by a smooth half-width profile w(y) (y grows
// downward, y=0 is the mouth). A signed distance field is precomputed from
// that profile with an exact Euclidean distance transform; the renderer
// draws the vessel from the very same profile, so the collision boundary
// matches the visible walls exactly (particles are pushed out by their
// radius, never overlapping the drawn iron).
//
// The iron wall is discretised into a ring of thermal cells. The furnace
// heats (or the frost plate cools) the cells under the bottom; heat then
// spreads along the iron and into touching particles.

import { SIM } from './constants.js';

export const CAULDRON_SIZES = {
  // the game's vessels, sized for the 0.2–1 L brews customers order
  pot: { key: 'pot', label: 'Iron Pot', mouth: 0.8, belly: 1.0, neck: 0.5, depth: 1.55, capacity: 310 },
  copper: { key: 'copper', label: 'Copper Cauldron', mouth: 0.95, belly: 1.2, neck: 0.6, depth: 1.8, capacity: 440 },
  grand: { key: 'grand', label: 'Grand Athanor', mouth: 1.1, belly: 1.4, neck: 0.7, depth: 2.1, capacity: 600 },
  // larger reference vessels (the original 7–13.5 L pots): the physics test
  // scenarios and benchmarks are calibrated on these; old saves used them
  small: { key: 'small', label: 'Great Iron Pot', mouth: 1.7, belly: 2.15, neck: 1.1, depth: 3.2, capacity: 1400 },
  medium: { key: 'medium', label: 'Great Copper Cauldron', mouth: 1.95, belly: 2.5, neck: 1.25, depth: 3.6, capacity: 2000 },
  large: { key: 'large', label: 'Great Athanor', mouth: 2.2, belly: 2.85, neck: 1.35, depth: 4.0, capacity: 2700 },
};

/** Height of the open column above the mouth that catches splashes / pour streams. */
export const COLUMN = 1.5;
const RES = 0.02;
const INF = 1e20;

/** 1-D squared Euclidean distance transform (Felzenszwalb & Huttenlocher). */
function edt1d(f, n, d, v, z) {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const dq = q - v[k];
    d[q] = dq * dq + f[v[k]];
  }
}

/** 2-D EDT of a binary grid: returns distance (in cells) to the nearest `target` cell. */
function edt2d(mask, w, h, target) {
  const g = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = mask[i] === target ? 0 : INF;
  const n = Math.max(w, h);
  const f = new Float64Array(n), d = new Float64Array(n), z = new Float64Array(n + 1);
  const v = new Int32Array(n);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = g[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) g[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = g[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) g[y * w + x] = Math.sqrt(d[x]);
  }
  return g;
}

export class Cauldron {
  /** @param {keyof typeof CAULDRON_SIZES} sizeKey */
  constructor(sizeKey = 'small') {
    const spec = CAULDRON_SIZES[sizeKey] || CAULDRON_SIZES.small;
    this.spec = spec;
    this.mouth = spec.mouth;
    this.belly = spec.belly;
    this.neck = spec.neck;
    this.depth = spec.depth;
    this.capacity = spec.capacity;
    this.lidClosed = true;
    this.lidY = 0;
    this.minX = -spec.belly - 0.5;
    this.maxX = spec.belly + 0.5;
    this.minY = -COLUMN - 0.4;
    this.maxY = spec.depth + 0.5;
    this._buildSdf();
    this._buildWall();
  }

  /** Interior half-width at height y (y down, 0 = mouth). @param {number} y */
  halfWidth(y) {
    if (y < 0) return y >= -COLUMN ? this.mouth : 0;
    if (y > this.depth) return 0;
    if (y <= this.neck) {
      return this.mouth + (this.belly - this.mouth) * Math.sin((Math.PI / 2) * (y / this.neck));
    }
    const t = (y - this.neck) / (this.depth - this.neck);
    const p = 2.8;
    return this.belly * Math.pow(Math.max(0, 1 - Math.pow(t, p)), 1 / p);
  }

  _buildSdf() {
    const w = Math.ceil((this.maxX - this.minX) / RES) + 1;
    const h = Math.ceil((this.maxY - this.minY) / RES) + 1;
    this.gw = w;
    this.gh = h;
    const mask = new Uint8Array(w * h);
    for (let gy = 0; gy < h; gy++) {
      const y = this.minY + gy * RES;
      const hw = this.halfWidth(y);
      for (let gx = 0; gx < w; gx++) {
        const x = this.minX + gx * RES;
        mask[gy * w + gx] = Math.abs(x) < hw ? 1 : 0;
      }
    }
    const dOut = edt2d(mask, w, h, 1); // for outside cells: distance to inside
    const dIn = edt2d(mask, w, h, 0); // for inside cells: distance to outside
    const sdf = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      sdf[i] = mask[i] ? -(dIn[i] - 0.5) * RES : (dOut[i] - 0.5) * RES;
    }
    this.sdfGrid = sdf;
    const gx = new Float32Array(w * h), gy = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        let ax = sdf[i + 1] - sdf[i - 1];
        let ay = sdf[i + w] - sdf[i - w];
        const l = Math.hypot(ax, ay) || 1;
        gx[i] = ax / l;
        gy[i] = ay / l;
      }
    }
    this.gradX = gx;
    this.gradY = gy;
    this._sx = 0; this._sy = 0;
  }

  /**
   * Sample signed distance (negative inside). Gradient written to this.nx/this.ny.
   * @param {number} x @param {number} y
   */
  sample(x, y) {
    const fx = (x - this.minX) / RES, fy = (y - this.minY) / RES;
    let ix = fx | 0, iy = fy | 0;
    if (ix < 0 || iy < 0 || ix >= this.gw - 1 || iy >= this.gh - 1) {
      this.nx = 0; this.ny = 0;
      return 1;
    }
    const tx = fx - ix, ty = fy - iy;
    const w = this.gw;
    const i = iy * w + ix;
    const s = this.sdfGrid, gx = this.gradX, gy = this.gradY;
    const a = 1 - tx, b = 1 - ty;
    const d = (s[i] * a + s[i + 1] * tx) * b + (s[i + w] * a + s[i + w + 1] * tx) * ty;
    let nx = (gx[i] * a + gx[i + 1] * tx) * b + (gx[i + w] * a + gx[i + w + 1] * tx) * ty;
    let ny = (gy[i] * a + gy[i + 1] * tx) * b + (gy[i + w] * a + gy[i + w + 1] * tx) * ty;
    const l = Math.hypot(nx, ny) || 1;
    this.nx = nx / l;
    this.ny = ny / l;
    return d;
  }

  /** Cheap nearest-cell signed distance (no gradient) for culling. */
  roughDist(x, y) {
    const ix = ((x - this.minX) / RES) | 0, iy = ((y - this.minY) / RES) | 0;
    if (ix < 0 || iy < 0 || ix >= this.gw || iy >= this.gh) return 1;
    return this.sdfGrid[iy * this.gw + ix];
  }

  /** Is the point inside the vessel interior (excluding the open column)? */
  inside(x, y) {
    return y >= 0 && y <= this.depth && Math.abs(x) < this.halfWidth(y);
  }

  _buildWall() {
    // Sample the profile, compute arc length along left side (top→bottom) and right side (bottom→top).
    const N = 300;
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const y = (k / N) * this.depth;
      pts.push([-this.halfWidth(y), y]);
    }
    for (let k = N; k >= 0; k--) {
      const y = (k / N) * this.depth;
      pts.push([this.halfWidth(y), y]);
    }
    const arc = [0];
    for (let k = 1; k < pts.length; k++) arc.push(arc[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    const total = arc[arc.length - 1];
    const M = 52;
    this.wallCount = M;
    this.lidCells = 8;
    const nCells = M + this.lidCells;
    this.cellX = new Float32Array(nCells);
    this.cellY = new Float32Array(nCells);
    this.cellT = new Float32Array(nCells).fill(SIM.AMBIENT);
    this.cellC = new Float32Array(nCells);
    this.cellFurnace = new Float32Array(nCells);
    let k = 0;
    for (let c = 0; c < M; c++) {
      const target = ((c + 0.5) / M) * total;
      while (k < arc.length - 2 && arc[k + 1] < target) k++;
      const t = (target - arc[k]) / Math.max(1e-9, arc[k + 1] - arc[k]);
      const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t;
      const y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t;
      this.cellX[c] = x;
      this.cellY[c] = y;
      this.cellC[c] = 26;
      // furnace exposure: strongest at the bottom centre, fading up the belly
      const bottomness = Math.max(0, Math.min(1, (y - (this.depth - 1.5)) / 1.2));
      this.cellFurnace[c] = bottomness * Math.exp(-Math.pow(x / (this.belly * 0.75), 2));
    }
    for (let c = 0; c < this.lidCells; c++) {
      const idx = M + c;
      this.cellX[idx] = -this.mouth + ((c + 0.5) / this.lidCells) * 2 * this.mouth;
      this.cellY[idx] = 0;
      this.cellC[idx] = 14;
      this.cellFurnace[idx] = 0;
    }
    // Lookup: for grid cells near the boundary, nearest wall cell.
    const step = 0.04;
    this.lw = Math.ceil((this.maxX - this.minX) / step) + 1;
    this.lh = Math.ceil((this.depth + 0.3) / step) + 1;
    this.lstep = step;
    this.lookup = new Int16Array(this.lw * this.lh).fill(-1);
    for (let gy = 0; gy < this.lh; gy++) {
      const y = gy * step;
      for (let gx = 0; gx < this.lw; gx++) {
        const x = this.minX + gx * step;
        const d = this.sample(x, y);
        if (d < -0.35 || d > 0.2) continue;
        let best = -1, bd = 1e9;
        for (let c = 0; c < M; c++) {
          const dd = (this.cellX[c] - x) ** 2 + (this.cellY[c] - y) ** 2;
          if (dd < bd) { bd = dd; best = c; }
        }
        this.lookup[gy * this.lw + gx] = best;
      }
    }
  }

  /** Nearest wall cell for a point near the wall (-1 if none). */
  wallCellAt(x, y) {
    const gx = Math.round((x - this.minX) / this.lstep);
    const gy = Math.round(y / this.lstep);
    if (gx < 0 || gy < 0 || gx >= this.lw || gy >= this.lh) return -1;
    return this.lookup[gy * this.lw + gx];
  }

  /** Lid cell index for an x position. */
  lidCellAt(x) {
    const t = (x + this.mouth) / (2 * this.mouth);
    const c = Math.max(0, Math.min(this.lidCells - 1, Math.floor(t * this.lidCells)));
    return this.wallCount + c;
  }

  /** Mean temperature of the iron under the furnace. */
  bottomTemperature() {
    let s = 0, w = 0;
    for (let c = 0; c < this.wallCount; c++) {
      s += this.cellT[c] * this.cellFurnace[c];
      w += this.cellFurnace[c];
    }
    return w > 0 ? s / w : SIM.AMBIENT;
  }

  lidTemperature() {
    let s = 0;
    for (let c = 0; c < this.lidCells; c++) s += this.cellT[this.wallCount + c];
    return s / this.lidCells;
  }
}
