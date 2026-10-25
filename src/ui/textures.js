// Pixel textures for the interface, drawn once at startup and handed to the
// stylesheet as CSS custom properties: a translucent wood grain laid over
// every wooden button, tab and frame (so it tints with their colour), a
// parchment fibre for the cards and an iron nail for their corners.

import { Rng } from '../core/rng.js';

/** @param {number} w @param {number} h @param {(ctx:CanvasRenderingContext2D, R:(x:number, y:number, w:number, h:number, c:string) => void) => void} paint */
function texture(w, h, paint) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  paint(ctx, (x, y, ww, hh, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, ww, hh); });
  return `url(${cv.toDataURL()})`;
}

/** Install the textures on the document root. Safe to call more than once. */
export function installTextures() {
  if (typeof document === 'undefined' || document.documentElement.dataset.tex) return;
  const rng = new Rng('ui-textures');
  // wood: long grain streaks of darker and lighter tone, a few knots, tileable
  const wood = texture(64, 32, (_, R) => {
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 64;) {
        const len = rng.int(3, 14), dark = rng.chance(0.5);
        if (rng.chance(0.55)) R(x, y, len, 1, dark ? 'rgba(20,10,4,0.16)' : 'rgba(255,220,170,0.07)');
        x += len;
      }
    }
    for (let k = 0; k < 2; k++) {
      const kx = rng.int(4, 58), ky = rng.int(4, 28);
      R(kx - 2, ky, 5, 1, 'rgba(20,10,4,0.22)'); R(kx - 1, ky - 1, 3, 3, 'rgba(20,10,4,0.18)'); R(kx, ky, 1, 1, 'rgba(20,10,4,0.35)');
    }
  });
  // parchment: soft fibres and specks
  const parch = texture(64, 64, (_, R) => {
    for (let k = 0; k < 220; k++) R(rng.int(0, 63), rng.int(0, 63), rng.int(1, 3), 1, rng.chance(0.6) ? 'rgba(120,90,50,0.07)' : 'rgba(255,255,240,0.18)');
    for (let k = 0; k < 18; k++) R(rng.int(0, 63), rng.int(0, 63), 1, 1, 'rgba(90,60,30,0.16)');
  });
  // a nail head: dark rim, iron body, a glint
  const nail = texture(4, 4, (_, R) => {
    R(1, 0, 2, 4, 'rgba(18,12,10,0.85)'); R(0, 1, 4, 2, 'rgba(18,12,10,0.85)');
    R(1, 1, 2, 2, '#8a8296'); R(1, 1, 1, 1, '#d8d2e0');
  });
  const root = document.documentElement;
  root.style.setProperty('--tex-wood', wood);
  root.style.setProperty('--tex-parch', parch);
  root.style.setProperty('--nail', nail);
  root.dataset.tex = '1';
}
