// Fine-pixel material renderer.
//
// Physics particles are ~5 screen pixels apart, but matter is drawn at
// 1–2 pixel detail:
//   • liquids & pastes are splatted into a continuous weight/colour field and
//     thresholded, so pools look continuous and diffusion shows as smooth
//     colour gradients; each particle also carries a texture value so pastes
//     look grainy and the texture moves with the material (no screen-space
//     "swimming" noise); liquid on its way to freezing turns to slush;
//   • powders are drawn as clusters of small, irregular chips (darker when
//     damp), an ingredient's in the colours of its painted pieces;
//   • frozen blocks get a compact, crisp icy body with a frosty rim that
//     clears as they melt;
//   • whole solid ingredients (roots, stones, crystals…) are drawn as their
//     own material — fibres, speckles, facets, veins — with cracks where the
//     pestle has damaged them, so they break down as the simulation does; a
//     wild ingredient's object is painted from the piece it was poured as
//     (one of its four in the piece atlas, rendering/pieces-art.js), turning
//     with it and eaten away particle by particle;
//   • liquids have depth: light crosses more of the brew the deeper it is,
//     so the colour deepens and saturates downward, channel by channel
//     (Beer–Lambert), under a bright thin surface layer and its meniscus;
//   • vapour is a swarm of fine droplets rising, swaying and fading in and
//     out around its particles, over a faint haze;
//   • magic shines: every particle emits light in the colours of the effects
//     it actually carries (derived.js, the palette of the effect bars), as
//     bright as their concentration, and the light spills into a soft pixel
//     halo around the brew. Effects are not blended into one colour: each
//     glowing pixel (and halo block) shines in one effect's own colour,
//     picked in proportion to that effect's share of the light there, so a
//     brew that is 70% vitality and 30% frost glows 70% red and 30% ice
//     blue, each as bright as its part of the magic.
// Rendering resolution is independent of the physics resolution.

import { PHASE, SIM } from '../simulation/constants.js';
import { LOOK, piece } from '../materials/shapes.js';
import { PIECE_ART, loadPieceArt, piecePalette } from './pieces-art.js';
import { PIECE_CELL } from '../materials/pieces.js';
import { EFFECTS, NE } from '../alchemy/effects.js';

const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
/** Interleaved liquid accumulator stride: weight, r, g, b, opacity, paste, texture, temperature, slush. */
const LS = 9;

/** Small integer hash → [0,1). */
function hash01(n) {
  n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
  n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
  n ^= n >>> 15;
  return (n >>> 0) / 4294967296;
}

/** Colour of each effect channel's light (the effect bars' palette). */
const FX_COL = EFFECTS.map((e) => e.color);

/**
 * Light emitted by one particle: its own glow and flames in `em` (rgb), and
 * its magic split by effect into chK/chV (nc channels: effect index and
 * brightness, the shares of the particle's total magical light).
 */
const em = [0, 0, 0];
const chK = new Int32Array(NE), chV = new Float32Array(NE);
let nc = 0;
function emission(p, i, r, g, b) {
  const a = p.auraI[i];
  // faint for plain ingredients, radiant once awakened (strongly non-linear)
  const s = a > 0.002 ? (1 - Math.exp(-Math.pow(a, 1.4) * 6)) * 0.75 : 0;
  nc = 0;
  if (s > 0) {
    const fx = p.auraFx, o = i * NE, k0 = s / a;
    for (let k = 0; k < NE; k++) {
      const v = fx[o + k];
      if (v > 0) { chK[nc] = k; chV[nc] = v * k0; nc++; }
    }
  }
  const gl = p.glow[i] * 0.42, bu = p.burn[i];
  em[0] = gl * (0.45 + r * 0.55) + bu;
  em[1] = gl * (0.45 + g * 0.55) + bu * 0.55;
  em[2] = gl * (0.45 + b * 0.55) + bu * 0.18;
  return s + em[0] + em[1] + em[2];
}

/** Add the current particle's magic, weight q, to pixel `px` of a per-effect field. */
function addMagic(mfx, px, q) {
  const o = px * NE;
  for (let c = 0; c < nc; c++) mfx[o + chK[c]] += q * chV[c];
}

/**
 * Pick one effect channel of a per-effect field cell, each with probability
 * equal to its share (u uniform in [0,1)). Sets pickTot to the cell's total.
 * @returns {number} effect index, -1 when the cell carries no magic
 */
let pickTot = 0;
function pickEffect(f, o, mask, u) {
  let tot = 0;
  for (let m = mask, k = 0; m; m >>>= 1, k++) if (m & 1) tot += f[o + k];
  pickTot = tot;
  if (tot <= 0) return -1;
  let t = u * tot, last = -1;
  for (let m = mask, k = 0; m; m >>>= 1, k++) {
    if (!(m & 1) || f[o + k] <= 0) continue;
    last = k;
    t -= f[o + k];
    if (t < 0) return k;
  }
  return last;
}

/**
 * Uniform dither value for a cell anchored to the screen (so the pattern
 * does not jump when the drawn region moves); each cell picks again now and
 * then at its own moment, so mixed magic twinkles gently between its colours.
 */
function dither(cx, cy, time) {
  const c = Math.imul(cx, 73856093) ^ Math.imul(cy, 19349663);
  const ep = Math.floor(time * 0.7 + hash01(c) * 4);
  return hash01(c ^ Math.imul(ep + 1, 83492791));
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
    /** draw the light halo around glowing matter */
    this.halo = true;
    this.haloCanvas = null;
    this.haloCtx = null;
    this.haloImage = null;
    this.hw = 0;
    this.hh = 0;
  }

  /** (Re)allocate buffers for a pixel region. */
  _alloc(w, h) {
    const n = w * h;
    if (n > this.cap) {
      this.cap = n;
      // Accumulators are interleaved per pixel (one cache line instead of
      // separate arrays).
      this.liq = new Float32Array(n * LS);
      this.sol = new Float32Array(n * 4);
      this.emit = new Float32Array(n * 4); // emitted light r, g, b and kernel weight
      this.mfx = new Float32Array(n * NE); // emitted magic, per effect
      this.solBest = new Float32Array(n); // strongest solid particle at a pixel…
      this.solIdx = new Int32Array(n); // …and its index
      this.wl = new Float32Array(n); // liquid weight, contiguous (blur, neighbours)
      this.wb = new Float32Array(n); // smoothed liquid weight (surface shape)
      this.wt = new Float32Array(n); // blur scratch
      this.grain = new Uint32Array(n); // packed grain colour (0 = none)
    }
    if (w !== this.w || h !== this.h || !this.canvas) {
      this.w = w;
      this.h = h;
      this.canvas = makeCanvas(w, h);
      this.ctx = /** @type {any} */ (this.canvas).getContext('2d');
      this.image = this.ctx.createImageData(w, h);
      const hw = Math.ceil(w / 2), hh = Math.ceil(h / 2);
      this.hw = hw; this.hh = hh;
      this.haloCanvas = makeCanvas(hw, hh);
      this.haloCtx = /** @type {any} */ (this.haloCanvas).getContext('2d');
      this.haloImage = this.haloCtx.createImageData(hw, hh);
      this.haloAcc = new Float32Array(hw * hh * (3 + NE));
      this.haloTmp = new Float32Array(hw * hh * (3 + NE));
      this.gas = new Float32Array(hw * hh * 4); // vapour weight + colour at half resolution
      this.mote = new Float32Array(w * h * 4); // vapour droplets: alpha + colour, full resolution
      this.gasTmp = new Float32Array(hw * hh * 4);
    }
  }

  /**
   * Render all particles into an offscreen image.
   * @param {import('../simulation/world.js').Simulation} sim
   * @param {{scale:number, ox:number, oy:number}} view  screen = world*scale + offset
   * @param {number} time seconds (for subtle animation)
   * @returns {{canvas:any, x:number, y:number, halo:any}|null}
   */
  render(sim, view, time) {
    const p = sim.p, n = p.count;
    if (n === 0) return null;
    const s = view.scale;
    // bounding box in screen pixels
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    let anySolid = false, anyGas = false, anyGrain = false, anyLight = false, fxMask = 0;
    for (let i = 0; i < n; i++) {
      const x = p.x[i] * s + view.ox, y = p.y[i] * s + view.oy;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      const ph = p.phase[i];
      if (ph === SOLID) anySolid = true; else if (ph === GAS) anyGas = true; else if (ph === POWDER) anyGrain = true;
      if (p.auraI[i] > 0.002 || p.glow[i] > 0.02 || p.burn[i] > 0.02) anyLight = true;
      if (p.auraI[i] > 0.002) for (let k = 0, o = i * NE; k < NE; k++) if (p.auraFx[o + k] > 0) fxMask |= 1 << k;
    }
    if ((anySolid || anyGrain) && !PIECE_ART.loading) loadPieceArt();
    const art = PIECE_ART.ready ? PIECE_ART.px : null, artW = PIECE_ART.width;
    const pad = Math.ceil(0.16 * s) + 8;
    const bx = Math.floor(minX) - pad, by = Math.floor(minY) - pad;
    const w = Math.ceil(maxX) + pad - bx, h = Math.ceil(maxY) + pad - by;
    if (w <= 0 || h <= 0 || w * h > 4e6) return null;
    this._alloc(w, h);
    const N = w * h;
    const { liq, sol, gas, grain, emit, mfx, solBest, solIdx } = this;
    // only the fields of phases that are present need clearing and reading
    liq.fill(0, 0, N * LS);
    if (anySolid) { sol.fill(0, 0, N * 4); solBest.fill(0, 0, N); }
    if (anyGas) { gas.fill(0, 0, this.hw * this.hh * 4); this.mote.fill(0, 0, N * 4); }
    if (anyGrain) grain.fill(0, 0, N);
    if (anyLight) emit.fill(0, 0, N * 4);
    if (fxMask) mfx.fill(0, 0, N * NE);

    const rl = 0.092 * s; // liquid kernel radius (px), ~1.85 particle radii
    const rs = 0.085 * s; // solid
    const rgas = 0.13 * s; // gas, in half-resolution pixels (wide, soft kernel so vapour reads as fog)
    const rgrain = Math.max(1.2, 0.05 * s * 1.02);
    const RL = Math.ceil(rl), RS = Math.ceil(rs), RG = Math.ceil(rgas);
    const colR = sim.colR, colG = sim.colG, colB = sim.colB;
    const T = p.temp;

    for (let i = 0; i < n; i++) {
      const ph = p.phase[i];
      const fx = p.x[i] * s + view.ox - bx, fy = p.y[i] * s + view.oy - by;
      const r = colR[i], g = colG[i], b = colB[i];
      const seed = p.seed[i];
      const lit = anyLight && emission(p, i, r, g, b) > 0.004;
      const eR = em[0], eG = em[1], eB = em[2];
      if (ph === LIQUID || ph === PASTE) {
        const isPaste = ph === PASTE ? 1 : 0;
        const tex = hash01(seed) * 2 - 1;
        const o = Math.max(0.35, p.opacity[i]);
        const Ti = T[i];
        // progress toward freezing (latent heat already given up)
        const slush = p.lat[i] < 0 && p.latF[i] > 0 ? Math.min(1, -p.lat[i] / p.latF[i]) : 0;
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
            liq[k + 4] += q * o; liq[k + 5] += q * isPaste; liq[k + 6] += q * tex; liq[k + 7] += q * Ti; liq[k + 8] += q * slush;
            if (lit) { const e = (row + xx) * 4; emit[e] += q * eR; emit[e + 1] += q * eG; emit[e + 2] += q * eB; emit[e + 3] += q; if (nc) addMagic(mfx, row + xx, q); }
          }
        }
      } else if (ph === POWDER) {
        // a few small, irregular chips and a stray speck or two: each chip a
        // lobed blob with a ragged edge, lit from the upper left. A grain of
        // an ingredient with painted pieces takes its chips' colours from its
        // spot in its piece (a crushed object's grains carry the colours of
        // the part they broke from), blending toward the brew's colour as it
        // dissolves away.
        const frozen = p.gran[i] < 0.5;
        const damp = !frozen && p.gran[i] < 0.96 ? Math.min(0.45, (0.97 - p.gran[i]) * 1.6) : 0;
        const burnL = p.burn[i] > 0.1 ? 1 + p.burn[i] : 1;
        const pc = art && p.skin[i] ? piece(p.skin[i]) : null;
        const pal = pc ? piecePalette(p.skin[i]) : null;
        const wArt = pc ? Math.max(0, Math.min(1, (p.whole[i] - 0.3) * 2)) : 0;
        const rx = Math.round(fx), ry = Math.round(fy);
        const chips = 3 + (seed & 1);
        for (let c = 0; c < chips + 2; c++) {
          const h1 = hash01(seed + c * 7919), h2 = hash01(seed * 3 + c * 104729 + 1), h3 = hash01(seed * 7 + c * 1299709 + 2);
          const speck = c >= chips;
          const an = h1 * 6.2832;
          const dist = speck ? rgrain * (0.85 + 0.45 * h2) : c === 0 ? 0 : Math.sqrt(h2) * rgrain * 0.6;
          const rc = speck ? 0.5 : Math.max(0.8, rgrain * (0.36 + 0.2 * h3));
          const ccx = fx + Math.cos(an) * dist, ccy = fy + Math.sin(an) * dist;
          // a second, smaller lobe makes the chip irregular rather than round
          const lcx = ccx + Math.cos(h3 * 6.2832) * rc * 0.65, lcy = ccy + Math.sin(h3 * 6.2832) * rc * 0.65;
          let cr = r, cg = g, cb = b;
          if (pc && wArt > 0) {
            const u = p.skinU[i] + (ccx - fx) / (s * SIM.SPACING) + (h1 - 0.5) * 0.5, v = p.skinV[i] + (ccy - fy) / (s * SIM.SPACING) + (h3 - 0.5) * 0.5;
            const tx = Math.floor(pc.ax + u * pc.ppu), ty = Math.floor(pc.ay + v * pc.ppu);
            let t = tx >= pc.cx && ty >= pc.cy && tx < pc.cx + PIECE_CELL && ty < pc.cy + PIECE_CELL ? /** @type {Uint32Array} */ (art)[ty * artW + tx] : 0;
            if (!(t >>> 31) && pal) t = pal[Math.floor(h2 * pal.length)];
            if (t >>> 31) {
              cr = ((t & 255) / 255) * wArt + r * (1 - wArt);
              cg = (((t >>> 8) & 255) / 255) * wArt + g * (1 - wArt);
              cb = (((t >>> 16) & 255) / 255) * wArt + b * (1 - wArt);
            }
          } else {
            // no painting: chips of the grain's own colour, each a shade apart
            const k = 0.8 + 0.34 * h3;
            cr = r * k; cg = g * (k + (h1 - 0.5) * 0.06); cb = b * (k + (h2 - 0.5) * 0.06);
          }
          const R2 = rc * rc, L2 = R2 * 0.5;
          const x0 = Math.max(0, Math.floor(Math.min(ccx, lcx) - rc)), x1 = Math.min(w - 1, Math.ceil(Math.max(ccx, lcx) + rc));
          const y0 = Math.max(0, Math.floor(Math.min(ccy, lcy) - rc)), y1 = Math.min(h - 1, Math.ceil(Math.max(ccy, lcy) + rc));
          for (let yy = y0; yy <= y1; yy++) {
            for (let xx = x0; xx <= x1; xx++) {
              const hv = hash01(seed + (xx - rx + 15) * 31 + (yy - ry + 15) * 977 + c * 65537);
              const dx = xx + 0.5 - ccx, dy = yy + 0.5 - ccy, ex = xx + 0.5 - lcx, ey = yy + 0.5 - lcy;
              // a ragged edge: border pixels come and go with the hash
              const edge = 0.62 + 0.5 * hv;
              const inside = speck ? (xx === Math.floor(ccx) && yy === Math.floor(ccy)) : (dx * dx + dy * dy < R2 * edge || ex * ex + ey * ey < L2 * edge);
              if (!inside) continue;
              let lum = speck ? 0.9 + hv * 0.2 : 1 + 0.24 * Math.max(-1, Math.min(1, -(dx + dy) / (rc * 1.4))) + (hv - 0.5) * 0.12;
              if (frozen) lum = 0.95 + hv * 0.12;
              lum *= (1 - damp) * burnL;
              const R8 = clamp255(cr * lum * 255), G8 = clamp255(cg * lum * 255), B8 = clamp255(cb * lum * 255);
              grain[yy * w + xx] = 0xff000000 | (B8 << 16) | (G8 << 8) | R8;
              if (lit) { const e = (yy * w + xx) * 4; emit[e] += eR; emit[e + 1] += eG; emit[e + 2] += eB; emit[e + 3] += 1; if (nc) addMagic(mfx, yy * w + xx, 1); }
            }
          }
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
            if (q > solBest[k]) { solBest[k] = q; solIdx[k] = i; }
            if (lit) { emit[k4] += q * eR; emit[k4 + 1] += q * eG; emit[k4 + 2] += q * eB; emit[k4 + 3] += q; if (nc) addMagic(mfx, k, q); }
          }
        }
      } else if (ph === GAS) {
        // vapour is splatted at half resolution with a wide kernel and then
        // blurred, so it reads as one continuous cloud, not separate puffs
        const hx = fx * 0.5, hy = fy * 0.5;
        const cy = hy | 0;
        const inv = 1 / (rgas * rgas), rg2 = rgas * rgas;
        const hw = this.hw, hh = this.hh, gas = this.gas;
        // gas is pale: blend its colour toward white
        const gr0 = r * 0.5 + 0.5, gg0 = g * 0.5 + 0.5, gb0 = b * 0.5 + 0.5;
        for (let dy = -RG; dy <= RG; dy++) {
          const yy = cy + dy;
          if (yy < 0 || yy >= hh) continue;
          const ddy = yy + 0.5 - hy;
          const rem = rg2 - ddy * ddy;
          if (rem <= 0) continue;
          const half = Math.sqrt(rem);
          const x0 = Math.max(0, Math.floor(hx - 0.5 - half)), x1 = Math.min(hw - 1, Math.ceil(hx - 0.5 + half));
          for (let xx = x0; xx <= x1; xx++) {
            const ddx = xx + 0.5 - hx;
            let q = 1 - (ddx * ddx + ddy * ddy) * inv;
            if (q <= 0) continue;
            q *= q;
            const k = (yy * hw + xx) * 4;
            gas[k] += q; gas[k + 1] += q * gr0; gas[k + 2] += q * gg0; gas[k + 3] += q * gb0;
          }
        }
        // the droplets: each rises a little, sways, and fades in and out on
        // its own cycle, then appears again elsewhere around its particle
        const mote = this.mote, R0 = rgas * 1.7, rise = 0.07 * s;
        const mr = r * 0.6 + 0.4, mg = g * 0.6 + 0.4, mb = b * 0.6 + 0.4;
        const nm = 5 + (seed & 3);
        for (let m = 0; m < nm; m++) {
          const h1 = hash01(seed + m * 7919), h2 = hash01(seed * 3 + m * 104729 + 1), h3 = hash01(seed * 7 + m * 1299709 + 2);
          const t = time * (0.3 + 0.35 * h2) + h1;
          const cyc = Math.floor(t), ph = t - cyc;
          // a new spot every cycle
          const h4 = hash01(seed + m * 31 + cyc * 65537);
          const an = h4 * 6.2832, dist = Math.sqrt(hash01(seed * 5 + m * 17 + cyc * 92821)) * R0;
          const mx = fx + Math.cos(an) * dist + Math.sin(time * 1.7 + h3 * 6.2832) * 1.2;
          const my = fy + Math.sin(an) * dist * 0.8 - ph * rise;
          const a = Math.min(1, Math.sin(ph * Math.PI) * 1.4) * (0.55 + 0.45 * h3);
          const sz = h2 > 0.78 ? 2 : 1;
          const x0 = Math.floor(mx), y0 = Math.floor(my);
          for (let yy = y0; yy < y0 + sz; yy++) {
            if (yy < 0 || yy >= h) continue;
            for (let xx = x0; xx < x0 + sz; xx++) {
              if (xx < 0 || xx >= w) continue;
              const k = (yy * w + xx) * 4;
              mote[k] += a; mote[k + 1] += a * mr; mote[k + 2] += a * mg; mote[k + 3] += a * mb;
            }
          }
        }
        if (lit) {
          const px = Math.min(h - 1, Math.max(0, fy | 0)) * w + Math.min(w - 1, Math.max(0, fx | 0)), k = px * 4;
          emit[k] += eR * 0.35; emit[k + 1] += eG * 0.35; emit[k + 2] += eB * 0.35; emit[k + 3] += 0.35;
          if (nc) addMagic(mfx, px, 0.35);
        }
      }
    }
    if (anyGas) this._blurGas();

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
    const twinkle = time * 3.1;
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
        // solid bodies: frozen ice or a whole ingredient
        const sw = anySolid ? sol[k * 4] : 0;
        if (sw > 0.45) {
          const bi = solIdx[k];
          const up = y > 0 ? sol[(k - w) * 4] : 0, left = x > 0 ? sol[(k - 1) * 4] : 0, down = y < h - 1 ? sol[(k + w) * 4] : 0, right = x < w - 1 ? sol[(k + 1) * 4] : 0;
          const edgeHi = up < 0.45 || left < 0.45, edgeLo = down < 0.45 || right < 0.45;
          const inv = 1 / sw;
          let r = sol[k * 4 + 1] * inv, g = sol[k * 4 + 2] * inv, b = sol[k * 4 + 3] * inv;
          let l = 1, a = 0.97;
          if (p.whole[bi] > 0.5) {
            // a whole ingredient: its own surface, shaded, with pestle cracks.
            // The pattern is laid out in the body's own frame (rest shape and
            // rotation), so it is continuous across the object and tumbles
            // with it; a loose fragment carries the piece it broke off with.
            const gi = p.group[bi];
            const th = gi >= 0 ? sim.rigid.angle[gi] : 0;
            const ddx = (x + 0.5 - (p.x[bi] * s + view.ox - bx)) / s, ddy = (y + 0.5 - (p.y[bi] * s + view.oy - by)) / s;
            const ct = Math.cos(th), st = Math.sin(th);
            const ox = ct * ddx + st * ddy, oy = -st * ddx + ct * ddy;
            const lx = p.restX[bi] + ox, ly = p.restY[bi] + oy;
            const u = Math.floor(lx * s * 0.75), v = Math.floor(ly * s * 0.75);
            const sd = gi >= 0 ? gi * 7919 + 13 : p.seed[bi];
            const hv = hash01(sd + (u + 4096) * 37 + (v + 4096) * 1013);
            const pc = art && p.skin[bi] ? piece(p.skin[bi]) : null;
            if (pc) {
              // its painted piece, read where this pixel falls in it (each
              // particle knows its own spot, so broken-off bits keep theirs);
              // the blob around the piece's outline stays clear
              const tx = Math.floor(pc.ax + (p.skinU[bi] + ox / SIM.SPACING) * pc.ppu);
              const ty = Math.floor(pc.ay + (p.skinV[bi] + oy / SIM.SPACING) * pc.ppu);
              const c = tx >= pc.cx && ty >= pc.cy && tx < pc.cx + PIECE_CELL && ty < pc.cy + PIECE_CELL ? /** @type {Uint32Array} */ (art)[ty * artW + tx] : 0;
              if (c >>> 31) {
                r = (c & 255) / 255; g = ((c >>> 8) & 255) / 255; b = ((c >>> 16) & 255) / 255;
                a = 1;
              } else a = 0;
            } else switch (p.look[bi]) {
              case LOOK.FIBRE: { // fibres along the root, the odd knot
                const band = Math.floor(ly * s * 0.55);
                l = (band & 1) ? 0.8 + hv * 0.08 : 0.97 + hv * 0.08;
                if (hash01(sd + Math.floor(lx * s * 0.25) * 53 + band * 7) < 0.05) l = 0.66;
                break;
              }
              case LOOK.LEAF: { // a bright midrib and paired veins
                const av = Math.abs(ly * s);
                l = av < 0.7 ? 1.16 : ((Math.floor(Math.abs(lx) * s * 0.5) + Math.floor(av * 0.5)) % 3 === 0 ? 1.06 : 0.9 + hv * 0.06);
                break;
              }
              case LOOK.STONE: l = hv < 0.13 ? 0.7 : hv > 0.93 ? 1.16 : 0.9 + hv * 0.1; break;
              case LOOK.CRYSTAL: { // long facets down the prism
                const f = Math.floor((ly * 0.9 - lx * 0.35) * s * 0.4);
                l = (f % 3 + 3) % 3 === 0 ? 1.14 : (f % 3 + 3) % 3 === 1 ? 0.84 : 0.97;
                a = 0.9;
                break;
              }
              case LOOK.CAP: l = (ly < 0 && hv < 0.08) ? 1.45 : ly > 0.05 ? 1.08 : 0.94 + hv * 0.06; break;
              case LOOK.GLOSSY: l = Math.abs(lx * 0.7 + ly * 0.7 + 0.06) * s < 0.6 ? 1.3 : 0.92 + hv * 0.06; break;
              case LOOK.BONE: l = hv < 0.05 ? 0.8 : Math.abs(ly * s) < 0.6 ? 0.96 : 1.04; break;
              case LOOK.FUR: l = 0.78 + hash01(sd + (u + 4096) * 37 + Math.floor(ly * s * 0.4 + 4096) * 1013) * 0.42; break;
              case LOOK.LUMP: l = Math.abs(lx * 0.7 + ly * 0.7 + 0.05) * s < 0.6 ? 1.32 : 0.88 + hv * 0.06; a = 0.94; break;
              case LOOK.BARK: { // rough plates split by deep, wandering fissures
                const col = Math.floor(lx * s * 0.35);
                const f = ly * s * 0.4 + hash01(sd + (col + 4096) * 97) * 0.9;
                l = f - Math.floor(f) < 0.24 ? 0.58 : 0.9 + hv * 0.14;
                break;
              }
              case LOOK.BERRY: { // round, glossy berries with dark gaps and a bright dot each
                const fx = lx * s * 0.4, fy = ly * s * 0.4, dx = fx - Math.round(fx), dy = fy - Math.round(fy);
                const r2 = dx * dx + dy * dy;
                l = r2 > 0.2 ? 0.55 : dx < -0.08 && dy < -0.08 && r2 < 0.1 ? 1.55 : 1.02 - r2;
                break;
              }
              case LOOK.GILLS: { // fine lamellae fanning out from the stalk
                const ang = Math.atan2(ly + 1.5, lx);
                l = (Math.floor(ang * 14 / Math.PI + 64) & 1) ? 0.78 : 1.04 + hv * 0.05;
                break;
              }
              case LOOK.SEED: { // diagonal ribs
                const rb = Math.floor((lx * 0.8 + ly * 0.6) * s * 0.55);
                l = (rb & 1) ? 0.74 : 1.06 + hv * 0.05;
                break;
              }
              case LOOK.SHELL: { // concentric growth rings with a pearly sheen
                const ring = Math.floor(Math.hypot(lx, ly - 1.2) * s * 0.45);
                l = (ring & 1) ? 0.86 : 1.08;
                if (hv > 0.9) { l = 1.35; r = r * 0.7 + 0.3; g = g * 0.7 + 0.28; b = b * 0.7 + 0.32; }
                break;
              }
              case LOOK.METAL: // bands of metallic sheen and the odd bright fleck
                l = 0.7 + 0.5 * Math.abs(Math.sin(ly * s * 0.22 + lx * s * 0.05)) + (hv > 0.96 ? 0.35 : 0);
                break;
              case LOOK.GLASS: { // dark glass with sharp, curving glints
                const c = Math.sin((lx * 1.3 + ly * ly * 0.6) * s * 0.3);
                l = c > 0.9 ? 1.7 : 0.72 + hv * 0.06;
                a = 0.95;
                break;
              }
              case LOOK.SPOTS: { // white warts scattered over the cap
                const fx = lx * s * 0.28, fy = ly * s * 0.28, cx = Math.floor(fx), cy = Math.floor(fy);
                const dx = fx - cx - 0.5, dy = fy - cy - 0.5;
                if (hash01(sd + (cx + 4096) * 131 + (cy + 4096) * 977) < 0.4 && dx * dx + dy * dy < 0.08) { r = 0.95; g = 0.93; b = 0.88; l = 1; }
                else l = 0.95 + hv * 0.08;
                break;
              }
              case LOOK.REED: // fine velvet striations along the stem
                l = (Math.floor(lx * s * 0.9) & 1 ? 0.86 : 1.0) + hv * 0.08;
                break;
              case LOOK.FLORET: // a froth of tiny florets
                l = hv > 0.72 ? 1.32 : hv < 0.16 ? 0.72 : 0.98;
                break;
              default: l = 0.92 + hv * 0.1;
            }
            if (!pc) { if (edgeHi) l *= 1.16; else if (edgeLo) l *= 0.64; }
            // cracks open up as the pestle damages it
            const dmg = sim.dmg[bi] / (0.25 + p.hardness[bi] * 1.5);
            if (dmg > 0.12 && hash01(p.seed[bi] * 3 + (u + 4096) * 7 + (v + 4096) * 131) < dmg * 0.4) l *= 0.42;
          } else {
            // frozen liquid: frosty, lighter body with a bright rim and a few
            // facets; melting clears the frost back toward the liquid colour
            const melt = p.lat[bi] > 0 && p.latF[bi] > 0 ? Math.min(1, p.lat[bi] / p.latF[bi]) : 0;
            const frost = 1 - melt * 0.8;
            r = r * (1 - 0.45 * frost) + 0.42 * frost; g = g * (1 - 0.45 * frost) + 0.45 * frost; b = b * (1 - 0.45 * frost) + 0.5 * frost;
            l = 0.78 + 0.22 * Math.min(1, sw / 1.6);
            if (edgeHi) l = 1.18 - 0.2 * melt; else if (edgeLo) l = 0.72;
            else if (((x * 7 + y * 13) % 23) === 0) l = 1.12;
            a = 0.92 - 0.12 * melt;
          }
          R = R * (1 - a) + r * l * a; G = G * (1 - a) + g * l * a; B = B * (1 - a) + b * l * a; A = A + (1 - A) * a;
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
          let a = Math.min(0.96, 0.7 + 0.3 * opac);
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
            // light crosses more of the brew the deeper it is: each channel
            // is absorbed by its own amount (Beer–Lambert on the brew's
            // transmitted colour), so the colour deepens and saturates
            // downward from a bright, thin surface layer to a rich, dark
            // heart. Clear liquids deepen faster (the dark iron shows
            // through); opaque ones keep more of their colour.
            const clear = Math.max(0, 1 - opac);
            const depth = Math.max(0, (y - surf[x]) * depthScale);
            const path = Math.min(4.5, 0.75 + depth * (0.9 + 2 * clear));
            r = Math.pow(Math.max(0.02, r), path); g = Math.pow(Math.max(0.02, g), path); b = Math.pow(Math.max(0.02, b), path);
            // texture carried by the particles: currents show as soft light
            // and shade moving with the brew
            l = (1 + tex * 0.07) * (1 - clear * 0.18) * (1 - Math.min(0.3, depth * 0.1));
            if (up <= thr) l = 1.32; // meniscus highlight
            else if (y > 1 && wb[k - 2 * w] <= thr) l = 1.16; // sheen just under the surface
            else if (y > 2 && wb[k - 3 * w] <= thr) l *= 1.07;
            // the lower edge against the iron gets a thin shadow line
            if (down <= thr) l *= 0.7;
          }
          // slush: liquid giving up its latent heat clouds over with ice crystals
          const slush = liq[c9 + 8] * inv;
          if (slush > 0.04) {
            const f = Math.min(0.75, slush * 0.85);
            r = r * (1 - f) + 0.82 * f; g = g * (1 - f) + 0.9 * f; b = b * (1 - f) + 0.98 * f;
            if (((x * 5 + y * 3) % 7) === 0 && slush > 0.3) l *= 1.15;
            a = Math.max(a, 0.9);
          }
          const temp = liq[c9 + 7] * inv;
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
        // vapour: the blurred half-resolution cloud, sampled smoothly
        if (anyGas) {
          const hw = this.hw, hh = this.hh, gas = this.gas;
          const gx = Math.max(0, Math.min(hw - 1.001, x * 0.5 - 0.25)), gy = Math.max(0, Math.min(hh - 1.001, y * 0.5 - 0.25));
          const ix = gx | 0, iy = gy | 0, tx = gx - ix, ty = gy - iy;
          const k00 = (iy * hw + ix) * 4, k10 = k00 + 4, k01 = k00 + hw * 4, k11 = k01 + 4;
          const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty;
          const gw = gas[k00] * w00 + gas[k10] * w10 + gas[k01] * w01 + gas[k11] * w11;
          if (gw > 0.03) {
            const inv = 1 / gw;
            // only a faint haze: the vapour reads as its droplets (below)
            const a = Math.min(0.34, 0.4 * (1 - Math.exp(-gw * 0.5)));
            const r = (gas[k00 + 1] * w00 + gas[k10 + 1] * w10 + gas[k01 + 1] * w01 + gas[k11 + 1] * w11) * inv;
            const g = (gas[k00 + 2] * w00 + gas[k10 + 2] * w10 + gas[k01 + 2] * w01 + gas[k11 + 2] * w11) * inv;
            const b = (gas[k00 + 3] * w00 + gas[k10 + 3] * w10 + gas[k01 + 3] * w01 + gas[k11 + 3] * w11) * inv;
            R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
            A = A + (1 - A) * a;
          }
          const mote = this.mote, m4 = k * 4, ma = mote[m4];
          if (ma > 0.02) {
            const a = Math.min(0.9, ma), inv = 1.12 / ma;
            R = R * (1 - a) + mote[m4 + 1] * inv * a; G = G * (1 - a) + mote[m4 + 2] * inv * a; B = B * (1 - a) + mote[m4 + 3] * inv * a;
            A = A + (1 - A) * a;
          }
        }
        // emitted light: the colours of the magic (and flames) in the matter here
        if (anyLight && !thermal) {
          const e4 = k * 4, ew = emit[e4 + 3];
          if (ew > 0.02 && A > 0.05) {
            const inv = 1 / Math.max(ew, 0.6);
            // a few sparkling pixels where it is strong
            const sp = ((x * 13 + y * 7) % 31 === 0) ? 1.6 + 0.8 * Math.max(0, Math.sin(twinkle + x * 0.7 + y)) : 1;
            // the magic here shines in one effect's colour, chosen by share,
            // at the full brightness of the magic (so each effect's light is
            // proportional to its part of it)
            let mr = 0, mg = 0, mb = 0;
            if (fxMask) {
              const fk = pickEffect(mfx, k * NE, fxMask, dither((x + bx) >> 1, (y + by) >> 1, time));
              if (fk >= 0) { const c = FX_COL[fk]; mr = c[0] * pickTot; mg = c[1] * pickTot; mb = c[2] * pickTot; }
            }
            const e0 = (emit[e4] + mr) * inv * sp, e1 = (emit[e4 + 1] + mg) * inv * sp, e2 = (emit[e4 + 2] + mb) * inv * sp;
            // the matter first takes on the light's hue at its own brightness
            // (so glowing brews stay richly coloured), then the light is
            // screened on top without washing out to white
            const eM = Math.max(e0, e1, e2);
            if (eM > 0.01) {
              const t = Math.min(0.6, eM * 0.7), lum = Math.max(R, G, B) / eM;
              R += (e0 * lum - R) * t; G += (e1 * lum - G) * t; B += (e2 * lum - B) * t;
            }
            const er = Math.min(1, e0 * 0.6), eg = Math.min(1, e1 * 0.6), eb = Math.min(1, e2 * 0.6);
            R = 1 - (1 - R) * (1 - er); G = 1 - (1 - G) * (1 - eg); B = 1 - (1 - B) * (1 - eb);
          }
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
    const halo = anyLight && this.halo && !thermal ? this._halo(w, h, bx, by, time, fxMask) : null;
    return { canvas: this.canvas, x: bx, y: by, halo };
  }

  /** Separable box blur (radius 2) of the half-resolution vapour field. */
  _blurGas() {
    const hw = this.hw, hh = this.hh, a = this.gas, t = this.gasTmp;
    for (let y = 0; y < hh; y++) {
      for (let x = 0; x < hw; x++) {
        let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
        for (let d = -2; d <= 2; d++) {
          const xx = x + d;
          if (xx < 0 || xx >= hw) continue;
          const k = (y * hw + xx) * 4;
          s0 += a[k]; s1 += a[k + 1]; s2 += a[k + 2]; s3 += a[k + 3];
        }
        const o = (y * hw + x) * 4;
        t[o] = s0 * 0.2; t[o + 1] = s1 * 0.2; t[o + 2] = s2 * 0.2; t[o + 3] = s3 * 0.2;
      }
    }
    for (let y = 0; y < hh; y++) {
      for (let x = 0; x < hw; x++) {
        let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
        for (let d = -2; d <= 2; d++) {
          const yy = y + d;
          if (yy < 0 || yy >= hh) continue;
          const k = (yy * hw + x) * 4;
          s0 += t[k]; s1 += t[k + 1]; s2 += t[k + 2]; s3 += t[k + 3];
        }
        const o = (y * hw + x) * 4;
        a[o] = s0 * 0.2; a[o + 1] = s1 * 0.2; a[o + 2] = s2 * 0.2; a[o + 3] = s3 * 0.2;
      }
    }
  }

  /**
   * Soft light around glowing matter: the emission field at half resolution,
   * blurred and drawn additively in 2-pixel blocks (it stays pixel art). The
   * magic is blurred per effect, and each block shines in one effect's colour
   * picked by its share there, like the matter itself.
   * @param {number} w @param {number} h @param {number} bx @param {number} by
   * @param {number} time @param {number} fxMask effect channels present
   */
  _halo(w, h, bx, by, time, fxMask) {
    const hw = this.hw, hh = this.hh, acc = this.haloAcc, tmp = this.haloTmp, emit = this.emit, mfx = this.mfx;
    // channels: base light r, g, b, then each effect present (compacted)
    const fxK = [];
    for (let k = 0; k < NE; k++) if (fxMask & (1 << k)) fxK.push(k);
    const C = 3 + fxK.length, nf = fxK.length;
    acc.fill(0, 0, hw * hh * C);
    for (let y = 0; y < h; y++) {
      const hy = (y >> 1) * hw;
      for (let x = 0; x < w; x++) {
        const px = y * w + x, e4 = px * 4;
        if (emit[e4 + 3] <= 0.01) continue;
        const k = (hy + (x >> 1)) * C;
        acc[k] += emit[e4]; acc[k + 1] += emit[e4 + 1]; acc[k + 2] += emit[e4 + 2];
        for (let c = 0, o = px * NE; c < nf; c++) acc[k + 3 + c] += mfx[o + fxK[c]];
      }
    }
    // two box blurs (separable, radius 2) ≈ a soft falloff
    for (let pass = 0; pass < 2; pass++) {
      blur5(acc, tmp, hw, hh, C, 1, hw);
      blur5(tmp, acc, hw, hh, C, hw, 1);
    }
    const d = this.haloImage.data;
    const ox = bx >> 1, oy = by >> 1;
    let mask = 0;
    for (let c = 0; c < nf; c++) mask |= 1 << c;
    for (let k = 0, o = 0; k < hw * hh; k++, o += 4) {
      const a = k * C;
      let r = acc[a], g = acc[a + 1], b = acc[a + 2];
      if (nf) {
        const c = pickEffect(acc, a + 3, mask, dither(ox + (k % hw), oy + ((k / hw) | 0), time));
        if (c >= 0) { const col = FX_COL[fxK[c]]; r += col[0] * pickTot; g += col[1] * pickTot; b += col[2] * pickTot; }
      }
      // quantised levels keep the light banded like the rest of the pixel art
      d[o] = clamp255(Math.round(r * 0.09 * 16) * 16);
      d[o + 1] = clamp255(Math.round(g * 0.09 * 16) * 16);
      d[o + 2] = clamp255(Math.round(b * 0.09 * 16) * 16);
      d[o + 3] = 255;
    }
    this.haloCtx.putImageData(this.haloImage, 0, 0);
    return this.haloCanvas;
  }
}

/**
 * Box blur (radius 2) of a C-channel field along one axis: `step` is the
 * cell stride along the axis, `cross` across it.
 * @param {Float32Array} src @param {Float32Array} dst
 * @param {number} hw @param {number} hh @param {number} C @param {number} step @param {number} cross
 */
function blur5(src, dst, hw, hh, C, step, cross) {
  const n = step === 1 ? hw : hh, lines = step === 1 ? hh : hw;
  for (let l = 0; l < lines; l++) {
    const base = l * cross;
    for (let i = 0; i < n; i++) {
      const o = (base + i * step) * C;
      for (let c = 0; c < C; c++) {
        let v = 0;
        for (let dd = -2; dd <= 2; dd++) {
          const j = i + dd;
          if (j < 0 || j >= n) continue;
          v += src[(base + j * step) * C + c];
        }
        dst[o + c] = v * 0.2;
      }
    }
  }
}

/** @param {number} w @param {number} h */
function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** @param {number} v */
function clamp255(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}
