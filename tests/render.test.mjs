// The fine-pixel material renderer draws every phase where its particles
// are. Runs the real FluidRenderer in Node against a stub canvas.
import test from 'node:test';
import assert from 'node:assert/strict';
import { refLookup, PHASE } from './helpers.mjs';
import { Simulation } from '../src/simulation/world.js';
import { FluidRenderer } from '../src/rendering/fluid.js';

// a minimal 2D context: the renderer only needs ImageData and putImageData
/** @type {any} */ (globalThis).OffscreenCanvas ??= class {
  /** @param {number} w @param {number} h */
  constructor(w, h) { this.width = w; this.height = h; }
  getContext() { return { createImageData: (/** @type {number} */ w, /** @type {number} */ h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }; }
};

/** Mean alpha of the image in a small window around world point (x, y). */
function alphaAt(fr, out, view, x, y, r = 2) {
  const cx = Math.round(x * view.scale + view.ox - out.x), cy = Math.round(y * view.scale + view.oy - out.y);
  let sum = 0, n = 0;
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const px = cx + dx, py = cy + dy;
    if (px < 0 || py < 0 || px >= fr.w || py >= fr.h) continue;
    sum += fr.image.data[(py * fr.w + px) * 4 + 3]; n++;
  }
  return n ? sum / n : 0;
}

test('every phase is drawn where its particles are: liquid, paste, powder, ice and vapour', () => {
  const sim = new Simulation({ size: 'medium', lookup: refLookup });
  const groups = {
    liquid: { id: 'water', phase: PHASE.LIQUID, x: -1.2, y: 3.2, temp: 20 },
    paste: { id: 'honey', phase: PHASE.PASTE, x: -0.4, y: 3.2, temp: 20 },
    powder: { id: 'sand', phase: PHASE.POWDER, x: 0.4, y: 3.2, temp: 20 },
    ice: { id: 'water', phase: PHASE.SOLID, x: 1.2, y: 3.2, temp: -10 },
    vapour: { id: 'water', phase: PHASE.GAS, x: 0, y: 1.0, temp: 105 },
  };
  for (const g of Object.values(groups)) {
    // a tight 4×4 cluster so the pixels at its centre are well inside
    for (let k = 0; k < 16; k++) sim.addParticle(refLookup(g.id), g.x + ((k % 4) - 1.5) * 0.09, g.y + (Math.floor(k / 4) - 1.5) * 0.09, g.phase, g.temp);
  }
  const fr = new FluidRenderer();
  const view = { scale: 60, ox: 200, oy: 20 };
  const out = fr.render(sim, view, 0);
  assert.ok(out, 'something was drawn');
  for (const [name, g] of Object.entries(groups)) {
    assert.ok(alphaAt(fr, out, view, g.x, g.y) > 10, `${name} is visible at its particles`);
  }
  // empty space between the clusters stays transparent
  assert.ok(alphaAt(fr, out, view, -0.8, 2.2) < 1, 'nothing is drawn where there is no matter');
});
