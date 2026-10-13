// Headless debug rendering of a Simulation into a PNG (for physics tuning
// and for test artefacts). Draws the vessel walls and particles by phase.
import fs from 'node:fs';
import { encodePng } from './png.mjs';

/**
 * @param {import('../../src/simulation/world.js').Simulation} sim
 * @param {string} file
 * @param {{scale?:number, mode?:'color'|'temp'|'phase'}} [opts]
 */
export function snapshot(sim, file, opts = {}) {
  const scale = opts.scale || 60;
  const c = sim.cauldron;
  const w = Math.ceil((c.maxX - c.minX) * scale), h = Math.ceil((c.maxY - c.minY) * scale);
  const img = new Uint8ClampedArray(w * h * 4);
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const x = c.minX + px / scale, y = c.minY + py / scale;
      const d = c.sample(x, y);
      const o = (py * w + px) * 4;
      if (d > 0 && d < 0.12 && y > -0.02) { img[o] = 60; img[o + 1] = 55; img[o + 2] = 60; }
      else if (d <= 0) { img[o] = 22; img[o + 1] = 20; img[o + 2] = 28; }
      else { img[o] = 12; img[o + 1] = 10; img[o + 2] = 14; }
      img[o + 3] = 255;
    }
  }
  if (c.lidClosed) {
    for (let px = 0; px < w; px++) {
      const x = c.minX + px / scale;
      if (Math.abs(x) > c.mouth + 0.1) continue;
      for (let k = 0; k < 4; k++) {
        const py = Math.round((0 - c.minY) * scale) - k;
        const o = (py * w + px) * 4;
        img[o] = 120; img[o + 1] = 90; img[o + 2] = 60;
      }
    }
  }
  const p = sim.p;
  const rad = Math.max(1, Math.round(0.05 * scale * (opts.mode === 'phase' ? 0.8 : 0.95)));
  for (let i = 0; i < p.count; i++) {
    let r = sim.colR[i] * 255, g = sim.colG[i] * 255, b = sim.colB[i] * 255;
    if (opts.mode === 'temp') {
      const t = Math.max(0, Math.min(1, (p.temp[i] + 20) / 140));
      r = 255 * t; g = 60; b = 255 * (1 - t);
    } else if (opts.mode === 'phase') {
      const pal = [[60, 140, 255], [230, 200, 120], [200, 120, 60], [220, 240, 255], [180, 180, 180]];
      [r, g, b] = pal[p.phase[i]];
    }
    const cx = (p.x[i] - c.minX) * scale, cy = (p.y[i] - c.minY) * scale;
    const gas = p.phase[i] === 4;
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        if (dx * dx + dy * dy > rad * rad) continue;
        const X = Math.round(cx + dx), Y = Math.round(cy + dy);
        if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        const o = (Y * w + X) * 4;
        if (gas) { img[o] = (img[o] + r) / 2; img[o + 1] = (img[o + 1] + g) / 2; img[o + 2] = (img[o + 2] + b) / 2; }
        else { img[o] = r; img[o + 1] = g; img[o + 2] = b; }
      }
    }
  }
  fs.writeFileSync(file, encodePng(w, h, img));
}
