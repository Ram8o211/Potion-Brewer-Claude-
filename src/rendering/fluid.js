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
      this.wl = new Float32Array(n); // liquid weight
      this.cr = new Float32Array(n);
      this.cg = new Float32Array(n);
      this.cb = new Float32Array(n);
      this.op = new Float32Array(n); // opacity accum
      this.pw = new Float32Array(n); // paste weight
      this.tx = new Float32Array(n); // texture accum
      this.gl = new Float32Array(n); // glow accum
      this.ht = new Float32Array(n); // heat accum (temperature-weighted)
      this.ws = new Float32Array(n); // solid weight
      this.sr = new Float32Array(n);
      this.sg = new Float32Array(n);
      this.sb = new Float32Array(n);
      this.wg = new Float32Array(n); // gas weight
      this.gr = new Float32Array(n);
      this.gg = new Float32Array(n);
      this.gb = new Float32Array(n);
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
    for (let i = 0; i < n; i++) {
      const x = p.x[i] * s + view.ox, y = p.y[i] * s + view.oy;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    const pad = Math.ceil(0.16 * s) + 2;
    const bx = Math.floor(minX) - pad, by = Math.floor(minY) - pad;
    const w = Math.ceil(maxX) + pad - bx, h = Math.ceil(maxY) + pad - by;
    if (w <= 0 || h <= 0 || w * h > 4e6) return null;
    this._alloc(w, h);
    const N = w * h;
    const { wl, cr, cg, cb, op, pw, tx, gl, ht, ws, sr, sg, sb, wg, gr, gg, gb, grain } = this;
    wl.fill(0, 0, N); cr.fill(0, 0, N); cg.fill(0, 0, N); cb.fill(0, 0, N); op.fill(0, 0, N);
    pw.fill(0, 0, N); tx.fill(0, 0, N); gl.fill(0, 0, N); ht.fill(0, 0, N);
    ws.fill(0, 0, N); sr.fill(0, 0, N); sg.fill(0, 0, N); sb.fill(0, 0, N);
    wg.fill(0, 0, N); gr.fill(0, 0, N); gg.fill(0, 0, N); gb.fill(0, 0, N);
    grain.fill(0, 0, N);

    const rl = 0.092 * s; // liquid kernel radius (px), ~1.85 particle radii
    const rs = 0.085 * s; // solid
    const rgas = 0.16 * s; // gas
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
        const cx = fx | 0, cy = fy | 0;
        const inv = 1 / (rl * rl);
        for (let dy = -RL; dy <= RL; dy++) {
          const yy = cy + dy;
          if (yy < 0 || yy >= h) continue;
          const ddy = yy + 0.5 - fy;
          const row = yy * w;
          for (let dx = -RL; dx <= RL; dx++) {
            const xx = cx + dx;
            if (xx < 0 || xx >= w) continue;
            const ddx = xx + 0.5 - fx;
            let q = 1 - (ddx * ddx + ddy * ddy) * inv;
            if (q <= 0) continue;
            q *= q;
            const k = row + xx;
            wl[k] += q; cr[k] += q * r; cg[k] += q * g; cb[k] += q * b;
            op[k] += q * o; pw[k] += q * isPaste; tx[k] += q * tex; gl[k] += q * glow; ht[k] += q * T[i];
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
            if (hv < 0.12) continue; // gaps between grains
            let lum = 0.82 + hv * 0.3;
            if (frozen) lum = 0.95 + hv * 0.12;
            lum *= 1 - damp;
            if (p.burn[i] > 0.1) lum *= 1 + p.burn[i];
            const R8 = clamp255(r * lum * 255), G8 = clamp255(g * lum * 255), B8 = clamp255(b * lum * 255);
            grain[yy * w + xx] = 0xff000000 | (B8 << 16) | (G8 << 8) | R8;
          }
        }
        if (p.glow[i] > 0.05 || p.burn[i] > 0.05) {
          const k = Math.min(h - 1, Math.max(0, cy)) * w + Math.min(w - 1, Math.max(0, cx));
          gl[k] += p.glow[i] + p.burn[i];
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
            ws[k] += q; sr[k] += q * r; sg[k] += q * g; sb[k] += q * b;
            gl[k] += q * p.glow[i] * 0.5;
          }
        }
      } else if (ph === GAS) {
        const cx = fx | 0, cy = fy | 0;
        const inv = 1 / (rgas * rgas);
        // gas is pale: blend its colour toward white
        const gr0 = r * 0.6 + 0.4, gg0 = g * 0.6 + 0.4, gb0 = b * 0.6 + 0.4;
        for (let dy = -RG; dy <= RG; dy++) {
          const yy = cy + dy;
          if (yy < 0 || yy >= h) continue;
          const ddy = yy + 0.5 - fy;
          for (let dx = -RG; dx <= RG; dx++) {
            const xx = cx + dx;
            if (xx < 0 || xx >= w) continue;
            const ddx = xx + 0.5 - fx;
            let q = 1 - (ddx * ddx + ddy * ddy) * inv;
            if (q <= 0) continue;
            q *= q * q;
            const k = yy * w + xx;
            wg[k] += q; gr[k] += q * gr0; gg[k] += q * gg0; gb[k] += q * gb0;
          }
        }
      }
    }

    // ------------------------------------------------------------ compose
    const data = this.image.data;
    const thr = 0.32; // liquid surface threshold
    const thermal = this.thermal;
    const shimmer = Math.sin(time * 2.1);
    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const k = row + x;
        let R = 0, G = 0, B = 0, A = 0;
        // grains (opaque)
        const gp = grain[k];
        if (gp) {
          R = (gp & 255) / 255; G = ((gp >>> 8) & 255) / 255; B = ((gp >>> 16) & 255) / 255; A = 1;
        }
        // solid blocks
        const sw = ws[k];
        if (sw > 0.45) {
          const inv = 1 / sw;
          let r = sr[k] * inv, g = sg[k] * inv, b = sb[k] * inv;
          // frosty, lighter body with a bright rim and a few facets
          const up = y > 0 ? ws[k - w] : 0, left = x > 0 ? ws[k - 1] : 0, down = y < h - 1 ? ws[k + w] : 0, right = x < w - 1 ? ws[k + 1] : 0;
          const edge = up < 0.45 || left < 0.45 || down < 0.45 || right < 0.45;
          let l = 0.78 + 0.22 * Math.min(1, sw / 1.6);
          r = r * 0.55 + 0.42; g = g * 0.55 + 0.45; b = b * 0.55 + 0.5;
          if (edge) l = up < 0.45 || left < 0.45 ? 1.18 : 0.72;
          else if (((x * 7 + y * 13) % 23) === 0) l = 1.12;
          R = r * l; G = g * l; B = b * l; A = 0.96;
        }
        // liquid / paste
        const lw = wl[k];
        if (lw > thr) {
          const inv = 1 / lw;
          let r = cr[k] * inv, g = cg[k] * inv, b = cb[k] * inv;
          const paste = pw[k] * inv;
          let a = Math.min(0.97, op[k] * inv + 0.08);
          const tex = tx[k] * inv;
          const up = y > 0 ? wl[k - w] : 0;
          const down = y < h - 1 ? wl[k + w] : 0;
          let l = 1;
          if (paste > 0.5) {
            // thick, opaque, grainy paste with a soft dark outline
            a = 1;
            l = 0.9 + tex * 0.09;
            if (up <= thr) l = 1.12;
            else if (down <= thr || (x > 0 && wl[k - 1] <= thr) || (x < w - 1 && wl[k + 1] <= thr)) l = 0.7;
          } else {
            l = 0.97 + tex * 0.035;
            if (up <= thr) l = 1.3; // meniscus highlight
            else if (y > 1 && wl[k - 2 * w] <= thr) l = 1.12;
            // deeper liquid slightly darker
            l *= 1 - Math.min(0.12, (lw - thr) * 0.05);
          }
          const temp = ht[k] * inv;
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
        } else if (lw > thr * 0.55 && !gp && sw <= 0.45) {
          // anti-aliased fringe one pixel wide
          const inv = 1 / lw;
          const a = 0.35 * (lw - thr * 0.55) / (thr * 0.45);
          R = cr[k] * inv; G = cg[k] * inv; B = cb[k] * inv; A = a;
        }
        // gas wisps
        const gw = wg[k];
        if (gw > 0.05) {
          const inv = 1 / gw;
          const a = Math.min(0.5, gw * 0.22) * (0.9 + 0.1 * shimmer);
          const r = gr[k] * inv, g = gg[k] * inv, b = gb[k] * inv;
          R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
          A = A + (1 - A) * a;
        }
        // emissive glow & fire
        const gv = gl[k];
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
