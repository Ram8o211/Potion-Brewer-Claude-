// Lightweight cosmetic effects in screen space: flames under the cauldron,
// frost motes, sparks, steam, dust, reaction sparkles and splashes. These
// never touch the simulation — they only decorate events it reports.

import { PAL, hex2rgb } from './art.js';

const MAX = 900;
const FIRE_RAMP = [PAL.fire5, PAL.fire4, PAL.fire3, PAL.fire2, PAL.fire1, PAL.fire0].map(hex2rgb);

export class Effects {
  constructor() {
    this.x = new Float32Array(MAX);
    this.y = new Float32Array(MAX);
    this.vx = new Float32Array(MAX);
    this.vy = new Float32Array(MAX);
    this.life = new Float32Array(MAX);
    this.maxLife = new Float32Array(MAX);
    this.size = new Float32Array(MAX);
    this.kind = new Uint8Array(MAX); // 0 flame,1 spark,2 steam,3 dust,4 sparkle,5 frost,6 splash,7 smoke
    this.r = new Uint8Array(MAX);
    this.g = new Uint8Array(MAX);
    this.b = new Uint8Array(MAX);
    this.n = 0;
    this.seed = 1;
  }

  rand() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  /**
   * @param {number} kind @param {number} x @param {number} y @param {number} vx @param {number} vy
   * @param {number} life @param {number} size @param {number[]} [rgb]
   */
  add(kind, x, y, vx, vy, life, size, rgb) {
    if (this.n >= MAX) return;
    const i = this.n++;
    this.kind[i] = kind;
    this.x[i] = x; this.y[i] = y; this.vx[i] = vx; this.vy[i] = vy;
    this.life[i] = life; this.maxLife[i] = life; this.size[i] = size;
    const c = rgb || [255, 255, 255];
    this.r[i] = c[0]; this.g[i] = c[1]; this.b[i] = c[2];
  }

  /** Continuous fire under the cauldron. */
  fire(cx, cy, width, intensity, scale, dt) {
    const count = intensity * 90 * dt * (scale / 50);
    let k = count;
    while (k > 0) {
      if (k < 1 && this.rand() > k) break;
      k -= 1;
      const x = cx + (this.rand() - 0.5) * width;
      const life = 0.25 + this.rand() * 0.45 * (0.6 + intensity * 0.6);
      this.add(0, x, cy, (this.rand() - 0.5) * scale * 0.2, -scale * (0.5 + this.rand() * 0.9 * intensity), life, Math.max(1, scale * (0.04 + this.rand() * 0.05)));
    }
    if (this.rand() < intensity * dt * 6) this.add(1, cx + (this.rand() - 0.5) * width, cy, (this.rand() - 0.5) * scale * 0.5, -scale * (1 + this.rand()), 0.8, 1, hex2rgb(PAL.fire4));
  }

  frost(cx, cy, width, intensity, scale, dt) {
    const count = intensity * 30 * dt;
    if (this.rand() < count) {
      this.add(5, cx + (this.rand() - 0.5) * width, cy + this.rand() * scale * 0.1, (this.rand() - 0.5) * scale * 0.15, -scale * 0.12 * this.rand(), 1.2 + this.rand(), 1, hex2rgb(PAL.frost3));
    }
  }

  burst(kind, x, y, n, scale, rgb, speed = 1) {
    for (let k = 0; k < n; k++) {
      const a = this.rand() * Math.PI * 2;
      const v = scale * (0.3 + this.rand() * 0.9) * speed;
      this.add(kind, x, y, Math.cos(a) * v, Math.sin(a) * v - scale * 0.2, 0.4 + this.rand() * 0.6, kind === 4 ? 2 : 1, rgb);
    }
  }

  update(dt) {
    let j = 0;
    for (let i = 0; i < this.n; i++) {
      const life = this.life[i] - dt;
      if (life <= 0) continue;
      const k = this.kind[i];
      let vx = this.vx[i], vy = this.vy[i];
      if (k === 1 || k === 6 || k === 3) vy += 60 * dt; // gravity for sparks, splashes, dust
      if (k === 2 || k === 7) { vy -= 8 * dt; vx *= 0.98; }
      if (k === 0) { vx *= 0.94; }
      if (k === 5) { vy += 2 * dt; }
      this.x[j] = this.x[i] + vx * dt;
      this.y[j] = this.y[i] + vy * dt;
      this.vx[j] = vx; this.vy[j] = vy;
      this.life[j] = life; this.maxLife[j] = this.maxLife[i];
      this.size[j] = this.size[i]; this.kind[j] = k;
      this.r[j] = this.r[i]; this.g[j] = this.g[i]; this.b[j] = this.b[i];
      j++;
    }
    this.n = j;
  }

  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    for (let i = 0; i < this.n; i++) {
      const t = 1 - this.life[i] / this.maxLife[i];
      const k = this.kind[i];
      let r = this.r[i], g = this.g[i], b = this.b[i], a = 1;
      let sz = this.size[i];
      if (k === 0) {
        const c = FIRE_RAMP[Math.min(FIRE_RAMP.length - 1, Math.floor(t * FIRE_RAMP.length))];
        r = c[0]; g = c[1]; b = c[2];
        sz = Math.max(1, sz * (1 - t * 0.7));
        a = 1 - t * 0.4;
      } else if (k === 2 || k === 7) {
        a = 0.35 * (1 - t);
        sz = sz * (1 + t * 2);
      } else if (k === 4) {
        a = 1 - t;
        sz = (t < 0.5 ? 2 : 1);
      } else {
        a = 1 - t * t;
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      const s = Math.max(1, Math.round(sz));
      ctx.fillRect(Math.round(this.x[i] - s / 2), Math.round(this.y[i] - s / 2), s, s);
      if (k === 4 && t < 0.5) {
        ctx.fillRect(Math.round(this.x[i]) - 2, Math.round(this.y[i]), 5, 1);
        ctx.fillRect(Math.round(this.x[i]), Math.round(this.y[i]) - 2, 1, 5);
      }
    }
    ctx.globalAlpha = 1;
  }
}
