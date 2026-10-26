// The fine-pixel material renderer draws every phase where its particles
// are. Runs the real FluidRenderer in Node against a stub canvas.
import test from 'node:test';
import assert from 'node:assert/strict';
import { refLookup, PHASE } from './helpers.mjs';
import { Simulation } from '../src/simulation/world.js';
import { FluidRenderer } from '../src/rendering/fluid.js';
import { EFFECTS, NE } from '../src/alchemy/effects.js';

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

test('mixed magic glows in each effect\'s own colour, in proportion to its share', () => {
  const sim = new Simulation({ size: 'medium', lookup: refLookup });
  const vit = EFFECTS.findIndex((e) => e.key === 'vitality'), fro = EFFECTS.findIndex((e) => e.key === 'frost');
  for (let k = 0; k < 144; k++) sim.addParticle(refLookup('water'), ((k % 12) - 5.5) * 0.09, 3.2 + (Math.floor(k / 12) - 5.5) * 0.09, PHASE.LIQUID, 20);
  const fr = new FluidRenderer();
  fr.halo = false;
  const view = { scale: 60, ox: 200, oy: 20 };
  const plain = fr.render(sim, view, 0);
  const base = Uint8ClampedArray.from(fr.image.data);
  // a brew that is 70% vitality, 30% frost (as derived.js would leave it)
  const p = sim.p;
  for (let i = 0; i < p.count; i++) {
    p.auraFx.fill(0, i * NE, (i + 1) * NE);
    p.auraFx[i * NE + vit] = 0.7; p.auraFx[i * NE + fro] = 0.3; p.auraI[i] = 1;
  }
  const out = fr.render(sim, view, 0);
  assert.ok(plain && out && out.x === plain.x && out.y === plain.y);
  // inside the pool, each lit pixel leans to one effect's colour: red or ice blue
  const cx = Math.round(view.ox - out.x), cy = Math.round(3.2 * view.scale + view.oy - out.y);
  let red = 0, blue = 0;
  for (let y = cy - 18; y <= cy + 18; y++) for (let x = cx - 18; x <= cx + 18; x++) {
    const o = (y * fr.w + x) * 4;
    const dR = fr.image.data[o] - base[o], dB = fr.image.data[o + 2] - base[o + 2];
    if (dR > dB + 4) red++; else if (dB > dR + 4) blue++;
  }
  const share = red / (red + blue);
  assert.ok(red + blue > 600, 'the pool glows');
  assert.ok(share > 0.6 && share < 0.8, `vitality's colour covers its share of the glow (${share.toFixed(2)})`);
});
