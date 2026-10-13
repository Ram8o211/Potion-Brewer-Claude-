// Fine-pixel material renderer.
//
// Physics particles are ~5 screen pixels apart, but matter is drawn at
// 1–2 pixel detail:
//   • liquids & pastes are splatted into a continuous weight/colour field and
//     thresholded, so pools look continuous and diffusion shows as smooth
//     colour gradients; each particle also carries a texture value so pastes
//     look grainy and the texture moves with the material (no screen-space
//     "swimming" noise);
//   • powders are drawn as speckled grain clusters (darker when damp);
//   • frozen blocks get a compact, crisp body with a frosty rim;
//   • gases are soft translucent wisps; glowing and burning matter emits light.
// Rendering resolution is independent of the physics resolution.

import { PHASE } from '../simulation/constants.js';

const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
/** Interleaved liquid accumulator stride. */
const LS = 9;

/** Small integer hash → [0,1). */
function hash01(n) {
  n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
  n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
  n ^= n >>> 15;
  return (n >>> 0) / 4294967296;
}

export class FluidRenderer {
  constructor() {
    this.cap = 0;
    this.w = 0;
    this.h = 0;
    /** @type {HTMLCanvasElement|OffscreenCanvas|null} */
    this.canvas = null;
    this.ctx = null;
    this.image = null;
    this.thermal = false;
  }

  /** (Re)allocate buffers for a pixel region. */
  _alloc(w, h) {
    const n = w * h;
    if (n > this.cap) {
      this.cap = n;
      // Accumulators are interleaved per pixel (one cache line instead of
      // nine separate arrays): liquid = weight, r, g, b, opacity, paste
      // weight, texture, glow, heat; solid and gas = weight, r, g, b.
      this.liq = new Float32Array(n * LS);
      this.sol = new Float32Array(n * 4);
      this.gas = new Float32Array(n * 4);
      this.wl = new Float32Array(n); // liquid weight, contiguous (blur, neighbours)
      this.wb = new Float32Array(n); // smoothed liquid weight (surface shape)
      this.wt = new Float32Array(n); // blur scratch
      this.grain = new Uint32Array(n); // packed grain colour (0 = none)
    }
    if (w !== this.w || h !== this.h || !this.canvas) {
      this.w = w;
      this.h = h;
      if (typeof OffscreenCanvas !== 'undefined') this.canvas = new OffscreenCanvas(w, h);
      else {
        this.canvas = document.createElement('canvas');
        this.canvas.width = w;
        this.canvas.height = h;
      }
      this.ctx = /** @type {any} */ (this.canvas).getContext('2d');
      this.image = this.ctx.createImageData(w, h);
    }
  }

  /**
   * Render all particles into an offscreen image.
   * @param {import('../simulation/world.js').Simulation} sim
   * @param {{scale:number, ox:number, oy:number}} view  screen = world*scale + offset
   * @param {number} time seconds (for subtle animation)
   * @returns {{canvas:any, x:number, y:number}|null}
   */
  render(sim, view, time) {
    const p = sim.p, n = p.count;
    if (n === 0) return null;
    const s = view.scale;
    // bounding box in screen pixels
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    let anySolid = false, anyGas = false, anyGrain = false;
    for (let i = 0; i < n; i++) {
      const x = p.x[i] * s + view.ox, y = p.y[i] * s + view.oy;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      const ph = p.phase[i];
      if (ph === SOLID) anySolid = true; else if (ph === GAS) anyGas = true; else if (ph === POWDER) anyGrain = true;
    }
    const pad = Math.ceil(0.16 * s) + 2;
    const bx = Math.floor(minX) - pad, by = Math.floor(minY) - pad;
    const w = Math.ceil(maxX) + pad - bx, h = Math.ceil(maxY) + pad - by;
    if (w <= 0 || h <= 0 || w * h > 4e6) return null;
    this._alloc(w, h);
    const N = w * h;
    const { liq, sol, gas, grain } = this;
    // only the fields of phases that are present need clearing and reading
    liq.fill(0, 0, N * LS);
    if (anySolid) sol.fill(0, 0, N * 4);
    if (anyGas) gas.fill(0, 0, N * 4);
    if (anyGrain) grain.fill(0, 0, N);

    const rl = 0.092 * s; // liquid kernel radius (px), ~1.85 particle radii
    const rs = 0.085 * s; // solid
    const rgas = 0.23 * s; // gas (wide, soft kernel so packed vapour reads as fog)
    const rgrain = Math.max(1.2, 0.05 * s * 1.02);
    const RL = Math.ceil(rl), RS = Math.ceil(rs), RG = Math.ceil(rgas), RGR = Math.ceil(rgrain);
    const colR = sim.colR, colG = sim.colG, colB = sim.colB;
    const T = p.temp;

    for (let i = 0; i < n; i++) {
      const ph = p.phase[i];
      const fx = p.x[i] * s + view.ox - bx, fy = p.y[i] * s + view.oy - by;
      const r = colR[i], g = colG[i], b = colB[i];
      const seed = p.seed[i];
      if (ph === LIQUID || ph === PASTE) {
        const isPaste = ph === PASTE ? 1 : 0;
        const tex = hash01(seed) * 2 - 1;
        const o = Math.max(0.35, p.opacity[i]);
        const glow = p.glow[i] + p.burn[i];
        const Ti = T[i];
        const cy = fy | 0;
        const inv = 1 / (rl * rl), rl2 = rl * rl;
        for (let dy = -RL; dy <= RL; dy++) {
          const yy = cy + dy;
          if (yy < 0 || yy >= h) continue;
          const ddy = yy + 0.5 - fy;
          const rem = rl2 - ddy * ddy;
          if (rem <= 0) continue;
          // only the kernel's chord on this row (one pixel of slack each side)
          const half = Math.sqrt(rem);
          const x0 = Math.max(0, Math.floor(fx - 0.5 - half)), x1 = Math.min(w - 1, Math.ceil(fx - 0.5 + half));
          const row = yy * w;
          for (let xx = x0; xx <= x1; xx++) {
            const ddx = xx + 0.5 - fx;
            let q = 1 - (ddx * ddx + ddy * ddy) * inv;
            if (q <= 0) continue;
            q *= q;
            const k = (row + xx) * LS;
            liq[k] += q; liq[k + 1] += q * r; liq[k + 2] += q * g; liq[k + 3] += q * b;
            liq[k + 4] += q * o; liq[k + 5] += q * isPaste; liq[k + 6] += q * tex; liq[k + 7] += q * glow; liq[k + 8] += q * Ti;
          }
        }
      } else if (ph === POWDER) {
        // speckled grain cluster
        const frozen = p.gran[i] < 0.5;
        const damp = !frozen && p.gran[i] < 0.96 ? Math.min(0.45, (0.97 - p.gran[i]) * 1.6) : 0;
        const cx = Math.round(fx), cy = Math.round(fy);
        for (let dy = -RGR; dy <= RGR; dy++) {
          for (let dx = -RGR; dx <= RGR; dx++) {
            if (dx * dx + dy * dy > rgrain * rgrain + 0.5) continue;
            const xx = cx + dx, yy = cy + dy;
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
            const hv = hash01(seed + (dx + 7) * 31 + (dy + 7) * 977);
            // individual grains: bright facets and darker crevices, no holes
            let lum = hv < 0.18 ? 0.62 : 0.84 + hv * 0.28;
            if (frozen) lum = 0.95 + hv * 0.12;
            lum *= 1 - damp;
            if (p.burn[i] > 0.1) lum *= 1 + p.burn[i];
            const R8 = clamp255(r * lum * 255), G8 = clamp255(g * lum * 255), B8 = clamp255(b * lum * 255);
            grain[yy * w + xx] = 0xff000000 | (B8 << 16) | (G8 << 8) | R8;
          }
        }
        if (p.glow[i] > 0.05 || p.burn[i] > 0.05) {
          const k = Math.min(h - 1, Math.max(0, cy)) * w + Math.min(w - 1, Math.max(0, cx));
          liq[k * LS + 7] += p.glow[i] + p.burn[i];
        }
      } else if (ph === SOLID) {
        const cx = fx | 0, cy = fy | 0;
        const inv = 1 / (rs * rs);
        for (let dy = -RS; dy <= RS; dy++) {
          const yy = cy + dy;
          if (yy < 0 || yy >= h) continue;
          const ddy = yy + 0.5 - fy;
          for (let dx = -RS; dx <= RS; dx++) {
            const xx = cx + dx;
            if (xx < 0 || xx >= w) continue;
            const ddx = xx + 0.5 - fx;
            const q = 1 - (ddx * ddx + ddy * ddy) * inv;
            if (q <= 0) continue;
            const k = yy * w + xx;
            const k4 = k * 4;
            sol[k4] += q; sol[k4 + 1] += q * r; sol[k4 + 2] += q * g; sol[k4 + 3] += q * b;
            liq[k * LS + 7] += q * p.glow[i] * 0.5;
          }
        }
      } else if (ph === GAS) {
        const cy = fy | 0;
        const inv = 1 / (rgas * rgas), rg2 = rgas * rgas;
        // gas is pale: blend its colour toward white
        const gr0 = r * 0.5 + 0.5, gg0 = g * 0.5 + 0.5, gb0 = b * 0.5 + 0.5;
        for (let dy = -RG; dy <= RG; dy++) {
          const yy = cy + dy;
          if (yy < 0 || yy >= h) continue;
          const ddy = yy + 0.5 - fy;
          const rem = rg2 - ddy * ddy;
          if (rem <= 0) continue;
          const half = Math.sqrt(rem);
          const x0 = Math.max(0, Math.floor(fx - 0.5 - half)), x1 = Math.min(w - 1, Math.ceil(fx - 0.5 + half));
          for (let xx = x0; xx <= x1; xx++) {
            const ddx = xx + 0.5 - fx;
            let q = 1 - (ddx * ddx + ddy * ddy) * inv;
            if (q <= 0) continue;
            q *= q;
            const k = (yy * w + xx) * 4;
            gas[k] += q; gas[k + 1] += q * gr0; gas[k + 2] += q * gg0; gas[k + 3] += q * gb0;
          }
        }
      }
    }

    // ------------------------------------------------------------ smooth surface
    // The surface is taken from a lightly blurred copy of the liquid field so
    // single particles riding the surface don't read as spikes.
    const wb = this.wb, wt = this.wt;
    // liquid weight, packed contiguously for the blur and the neighbour reads
    const wl = this.wl;
    for (let k = 0; k < N; k++) wl[k] = liq[k * LS];
    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const k = row + x;
        const l = x > 0 ? wl[k - 1] : 0, r = x < w - 1 ? wl[k + 1] : 0;
        const l2 = x > 1 ? wl[k - 2] : 0, r2 = x < w - 2 ? wl[k + 2] : 0;
        const l3 = x > 2 ? wl[k - 3] : 0, r3 = x < w - 3 ? wl[k + 3] : 0;
        wt[k] = (wl[k] * 4 + (l + r) * 3 + (l2 + r2) * 2 + (l3 + r3)) * (1 / 16);
      }
    }
    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const k = row + x;
        const u = y > 0 ? wt[k - w] : 0, d = y < h - 1 ? wt[k + w] : 0;
        wb[k] = (wt[k] * 2 + u + d) * 0.25;
      }
    }

    // ------------------------------------------------------------ compose
    const data = this.image.data;
    const thr = 0.3; // liquid surface threshold
    // first liquid pixel of every column → depth below the surface (Beer–Lambert style darkening)
    if (!this.surf || this.surf.length < w) this.surf = new Int32Array(w);
    const surf = this.surf;
    for (let x = 0; x < w; x++) {
      let y = 0;
      while (y < h && wb[y * w + x] <= thr) y++;
      surf[x] = y;
    }
    const depthScale = 1 / Math.max(6, 0.9 * s);
    const thermal = this.thermal;
    const shimmer = Math.sin(time * 2.1);
    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const k = row + x;
        let R = 0, G = 0, B = 0, A = 0;
        // grains (opaque)
        const gp = anyGrain ? grain[k] : 0;
        if (gp) {
          R = (gp & 255) / 255; G = ((gp >>> 8) & 255) / 255; B = ((gp >>> 16) & 255) / 255; A = 1;
        }
        // solid blocks
        const sw = anySolid ? sol[k * 4] : 0;
        if (sw > 0.45) {
          const inv = 1 / sw;
          let r = sol[k * 4 + 1] * inv, g = sol[k * 4 + 2] * inv, b = sol[k * 4 + 3] * inv;
          // frosty, lighter body with a bright rim and a few facets
          const up = y > 0 ? sol[(k - w) * 4] : 0, left = x > 0 ? sol[(k - 1) * 4] : 0, down = y < h - 1 ? sol[(k + w) * 4] : 0, right = x < w - 1 ? sol[(k + 1) * 4] : 0;
          const edge = up < 0.45 || left < 0.45 || down < 0.45 || right < 0.45;
          let l = 0.78 + 0.22 * Math.min(1, sw / 1.6);
          r = r * 0.55 + 0.42; g = g * 0.55 + 0.45; b = b * 0.55 + 0.5;
          if (edge) l = up < 0.45 || left < 0.45 ? 1.18 : 0.72;
          else if (((x * 7 + y * 13) % 23) === 0) l = 1.12;
          R = r * l; G = g * l; B = b * l; A = 0.96;
        }
        // liquid / paste
        if (wb[k] > thr) {
          // colour from this pixel, or from the strongest neighbour in the
          // small gaps the smoothing fills in
          let kc = k, lw = wl[k];
          if (lw < 0.06) {
            if (x > 0 && wl[k - 1] > lw) { kc = k - 1; lw = wl[kc]; }
            if (x < w - 1 && wl[k + 1] > lw) { kc = k + 1; lw = wl[kc]; }
            if (y < h - 1 && wl[k + w] > lw) { kc = k + w; lw = wl[kc]; }
            if (y > 0 && wl[k - w] > lw) { kc = k - w; lw = wl[kc]; }
            if (lw < 1e-4) continue;
          }
          const inv = 1 / lw;
          const c9 = kc * LS;
          let r = liq[c9 + 1] * inv, g = liq[c9 + 2] * inv, b = liq[c9 + 3] * inv;
          const paste = liq[c9 + 5] * inv;
          const opac = liq[c9 + 4] * inv;
          let a = Math.min(0.97, Math.max(0.84, opac + 0.1));
          const tex = liq[c9 + 6] * inv;
          const up = y > 0 ? wb[k - w] : 0;
          const down = y < h - 1 ? wb[k + w] : 0;
          let l = 1;
          if (paste > 0.5) {
            // thick, opaque, grainy paste with a soft dark outline
            a = 1;
            l = 0.9 + tex * 0.09;
            if (up <= thr) l = 1.12;
            else if (down <= thr || (x > 0 && wb[k - 1] <= thr) || (x < w - 1 && wb[k + 1] <= thr)) l = 0.7;
          } else {
            // clear liquids let the dark iron show through: darker, cooler, with
            // the colour carried by what they absorb; opaque ones stay bright
            const clear = Math.max(0, 1 - opac);
            const ct = clear * 0.45;
            r = r * (1 - ct) + 0.42 * ct; g = g * (1 - ct) + 0.6 * ct; b = b * (1 - ct) + 0.82 * ct;
            l = (0.98 + tex * 0.03) * (1 - clear * 0.55);
            if (up <= thr) l = 1.28; // meniscus highlight
            else if (y > 1 && wb[k - 2 * w] <= thr) l = 1.1;
            // light is absorbed with depth: deeper liquid is darker and richer
            const depth = (y - surf[x]) * depthScale;
            l *= 1 - Math.min(0.42, depth * 0.16);
            // the lower edge against the iron gets a thin shadow line
            if (down <= thr) l *= 0.78;
          }
          const temp = liq[c9 + 8] * inv;
          if (thermal) {
            const tt = Math.max(0, Math.min(1, (temp + 20) / 140));
            r = tt; g = 0.25 + 0.3 * (1 - Math.abs(tt - 0.5) * 2); b = 1 - tt;
            a = 0.9;
          } else if (temp > 70) {
            const hh = Math.min(0.25, (temp - 70) / 400);
            r += hh; g += hh * 0.3;
          }
          r *= l; g *= l; b *= l;
          R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
          A = A + (1 - A) * a;
        }
        // gas wisps
        const gw = anyGas ? gas[k * 4] : 0;
        if (gw > 0.04) {
          const inv = 1 / gw;
          const a = 0.7 * (1 - Math.exp(-gw * 0.55)) * (0.9 + 0.1 * shimmer);
          const r = gas[k * 4 + 1] * inv, g = gas[k * 4 + 2] * inv, b = gas[k * 4 + 3] * inv;
          R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
          A = A + (1 - A) * a;
        }
        // emissive glow & fire
        const gv = liq[k * LS + 7];
        if (gv > 0.02) {
          const e = Math.min(0.6, gv * 0.25);
          R += e; G += e * 0.85; B += e * 0.55;
          A = Math.max(A, Math.min(0.8, e * 1.2));
        }
        const o = k * 4;
        if (A <= 0.003) {
          data[o + 3] = 0;
          continue;
        }
        data[o] = clamp255(R * 255);
        data[o + 1] = clamp255(G * 255);
        data[o + 2] = clamp255(B * 255);
        data[o + 3] = clamp255(A * 255);
      }
    }
    this.ctx.putImageData(this.image, 0, 0);
    return { canvas: this.canvas, x: bx, y: by };
  }
}

/** @param {number} v */
function clamp255(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}
