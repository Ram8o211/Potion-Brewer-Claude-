// The fine-pixel material renderer draws every phase where its particles
// are. Runs the real FluidRenderer in Node against a stub canvas.
import test from 'node:test';
import assert from 'node:assert/strict';
import { refLookup, PHASE } from './helpers.mjs';
import { Simulation } from '../src/simulation/world.js';
import { FluidRenderer } from '../src/rendering/fluid.js';
import { EFFECTS, NE } from '../src/alchemy/effects.js';
import { PIECE_ART } from '../src/rendering/pieces-art.js';
import { dominantColour } from '../src/rendering/brew-palette.js';
import { generateWorld, makeLookup } from '../src/materials/generator.js';

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

test('magic never recolours a brew: awakened or not, it keeps its own hue and gives off no light', () => {
  const sim = new Simulation({ size: 'medium', lookup: refLookup });
  const vit = EFFECTS.findIndex((e) => e.key === 'vitality'), fro = EFFECTS.findIndex((e) => e.key === 'frost');
  for (let k = 0; k < 144; k++) sim.addParticle(refLookup('water'), ((k % 12) - 5.5) * 0.09, 3.2 + (Math.floor(k / 12) - 5.5) * 0.09, PHASE.LIQUID, 20);
  const fr = new FluidRenderer();
  const view = { scale: 60, ox: 200, oy: 20 };
  /** chromaticity of the pool: each channel's share of its mean colour */
  const chroma = () => {
    const m = [0, 0, 0];
    for (let i = 0; i < fr.image.data.length; i += 4) if (fr.image.data[i + 3] > 200) for (let c = 0; c < 3; c++) m[c] += fr.image.data[i + c];
    const t = m[0] + m[1] + m[2];
    return m.map((v) => v / t);
  };
  assert.ok(fr.render(sim, view, 0));
  const plain = chroma();
  // a strongly magical brew, 70% vitality (red) and 30% frost (blue)
  const p = sim.p;
  for (let i = 0; i < p.count; i++) {
    p.auraFx.fill(0, i * NE, (i + 1) * NE);
    p.auraFx[i * NE + vit] = 0.7; p.auraFx[i * NE + fro] = 0.3; p.auraI[i] = 1;
  }
  const out = fr.render(sim, view, 0);
  assert.ok(out);
  const magic = chroma();
  for (let c = 0; c < 3; c++) assert.ok(Math.abs(magic[c] - plain[c]) < 0.01, `hue kept (${plain.map((v) => v.toFixed(3))} → ${magic.map((v) => v.toFixed(3))})`);
  assert.equal(out.halo, null, 'magic spills no light around the brew');
});

test('each effect draws its own animated pattern on a brew', () => {
  let width = 0;
  /** @param {number} e effect index, -1 for none @param {number} t */
  const draw = (e, t) => {
    const sim = new Simulation({ size: 'medium', lookup: refLookup });
    for (let k = 0; k < 144; k++) sim.addParticle(refLookup('water'), ((k % 12) - 5.5) * 0.09, 3.2 + (Math.floor(k / 12) - 5.5) * 0.09, PHASE.LIQUID, 20);
    const p = sim.p;
    if (e >= 0) for (let i = 0; i < p.count; i++) { p.auraFx.fill(0, i * NE, (i + 1) * NE); p.auraFx[i * NE + e] = 0.6; p.auraI[i] = 0.6; }
    const fr = new FluidRenderer();
    fr.halo = false;
    const out = fr.render(sim, { scale: 60, ox: 200, oy: 20 }, t);
    assert.ok(out);
    width = fr.w;
    return Uint8ClampedArray.from(fr.image.data);
  };
  const plain = draw(-1, 1);
  const looks = EFFECTS.map((_, e) => draw(e, 1));
  /** mean absolute difference between two renders @param {Uint8ClampedArray} a @param {Uint8ClampedArray} b */
  const diff = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; };
  /** how patterned a render is: mean colour step between neighbouring opaque pixels @param {Uint8ClampedArray} a @param {number} w */
  const texture = (a, w) => {
    let s = 0, n = 0;
    for (let i = 0; i + 4 * w + 4 < a.length; i += 4) {
      if (a[i + 3] < 200 || a[i + 7] < 200 || a[i + 4 * w + 3] < 200) continue;
      for (let c = 0; c < 3; c++) s += Math.abs(a[i + c] - a[i + 4 + c]) + Math.abs(a[i + c] - a[i + 4 * w + c]);
      n++;
    }
    return s / n;
  };
  for (let e = 0; e < NE; e++) {
    assert.ok(diff(looks[e], plain) > 3, `${EFFECTS[e].key} changes the brew`);
    for (let f = 0; f < e; f++) assert.ok(diff(looks[e], looks[f]) > 2, `${EFFECTS[e].key} looks unlike ${EFFECTS[f].key}`);
  }
  // patterns, not just a tint: the brew is more varied than plain water
  const base = texture(plain, width);
  const varied = EFFECTS.filter((_, e) => texture(looks[e], width) > base * 1.3).length;
  assert.equal(varied, NE, `every effect draws a pattern (${varied}/${NE})`);
  // and every pattern moves
  for (let e = 0; e < NE; e++) {
    const later = draw(e, 1.6);
    assert.ok(diff(later, looks[e]) > 0.5, `${EFFECTS[e].key} is animated`);
  }
});

test('a brew takes the painted palette of the ingredient crushed into it', () => {
  const world = generateWorld('palette-test');
  const lookup = makeLookup(world);
  const leaf = lookup('wild-silverleaf'), water = lookup(world.roles.water);
  assert.ok(leaf && water);
  /** mean colour of the pool's pixels @param {boolean} painted */
  const pool = (painted) => {
    const sim = new Simulation({ size: 'medium', lookup });
    // a dose of the ingredient dissolved through some water
    for (let k = 0; k < 144; k++) {
      const i = sim.addParticle(water, ((k % 12) - 5.5) * 0.09, 3.2 + (Math.floor(k / 12) - 5.5) * 0.09, PHASE.LIQUID, 20);
      if (k % 3 === 0) {
        const s = sim.species.ensure(leaf, lookup), off = i * sim.p.S;
        sim.p.comp[off + s] = 0.4; sim.p.comp[off + sim.species.slotOf.get(water.id)] = 0.6;
      }
    }
    for (let i = 0; i < sim.p.count; i++) sim.p.dirty[i] = 1;
    sim.step();
    // a stand-in atlas: every piece painted pure red
    const saved = { ...PIECE_ART };
    if (painted) Object.assign(PIECE_ART, { ready: true, loading: Promise.resolve(true), width: 160, height: 1440, px: new Uint32Array(160 * 1440).fill(0xff0000ff) });
    const fr = new FluidRenderer();
    fr.halo = false;
    const out = fr.render(sim, { scale: 60, ox: 200, oy: 20 }, 0);
    Object.assign(PIECE_ART, saved);
    assert.ok(out);
    const m = [0, 0, 0];
    let n = 0;
    for (let i = 0; i < fr.image.data.length; i += 4) {
      if (fr.image.data[i + 3] < 200) continue;
      for (let c = 0; c < 3; c++) m[c] += fr.image.data[i + c];
      n++;
    }
    return m.map((v) => v / n);
  };
  const plain = pool(false), dyed = pool(true);
  // dyed by the (red) painting: much redder than the leaf's own colour makes it
  assert.ok(dyed[0] - (dyed[1] + dyed[2]) / 2 > plain[0] - (plain[1] + plain[2]) / 2 + 40, `the brew takes the painting's colour (${plain.map(Math.round)} → ${dyed.map(Math.round)})`);
});

test('a brew is dyed the dominant colour of a painting, not the mean of its textures', () => {
  // mostly green, a few red berries, a dark outline and a pale highlight
  const px = [];
  for (let i = 0; i < 60; i++) px.push([0.2, 0.6 + (i % 5) * 0.04, 0.15]);
  for (let i = 0; i < 25; i++) px.push([0.85, 0.1, 0.12]);
  for (let i = 0; i < 20; i++) px.push([0.03, 0.03, 0.03]);
  for (let i = 0; i < 6; i++) px.push([0.95, 0.95, 0.9]);
  const c = dominantColour(px);
  assert.ok(c[1] > 0.55 && c[0] < 0.3 && c[2] < 0.25, `green dominates (${c.map((v) => v.toFixed(2))})`);
});

test('drops falling into a pool cast no dark columns down through it', () => {
  const lookup = refLookup;
  const water = lookup('water');
  const sim = new Simulation({ size: 'medium', lookup });
  // a still pool, dyed so its depth shading shows…
  for (let k = 0; k < 400; k++) sim.addParticle(water, ((k % 40) - 19.5) * 0.09, 3.6 - Math.floor(k / 40) * 0.09, PHASE.LIQUID, 20);
  // …and a thin stream of drops above its middle
  for (let k = 0; k < 8; k++) sim.addParticle(water, 0, 1.6 + k * 0.2, PHASE.LIQUID, 20);
  for (let i = 0; i < sim.p.count; i++) sim.p.dirty[i] = 1;
  sim.step();
  const view = { scale: 60, ox: 200, oy: 20 };
  const fr = new FluidRenderer();
  fr.halo = false;
  const out = fr.render(sim, view, 0);
  assert.ok(out);
  /** mean brightness of a column of the pool, deep below its surface @param {number} wx */
  const col = (wx) => {
    const x = Math.round(wx * view.scale + view.ox - out.x);
    let sum = 0, n = 0;
    for (let wy = 3.0; wy <= 3.4; wy += 0.02) {
      const y = Math.round(wy * view.scale + view.oy - out.y), o = (y * fr.w + x) * 4;
      if (fr.image.data[o + 3] < 100) continue;
      sum += fr.image.data[o] + fr.image.data[o + 1] + fr.image.data[o + 2]; n++;
    }
    assert.ok(n > 5);
    return sum / n;
  };
  const mid = col(0), side = (col(-0.6) + col(0.6)) / 2;
  assert.ok(Math.abs(mid - side) < side * 0.08, `under the drops the pool is as bright as beside them (${mid.toFixed(0)} vs ${side.toFixed(0)})`);
});

test('parcels of different colour and texture meet in gradients, not hard edges', () => {
  /** largest colour step between neighbouring pixels across a pool whose halves differ @param {'colour'|'paste'} kind */
  const edge = (kind) => {
    const sim = new Simulation({ size: 'medium', lookup: refLookup });
    const S = sim.p.S;
    for (let k = 0; k < 400; k++) {
      const col = k % 40, row = Math.floor(k / 40);
      const i = sim.addParticle(refLookup('water'), (col - 19.5) * 0.09, 3.6 - row * 0.09, PHASE.LIQUID, 20);
      if (kind === 'colour') {
        const sd = sim.slotFor(refLookup(col < 20 ? 'red' : 'blue'));
        sim.p.comp[i * S + sd] = 0.6; sim.p.comp[i * S + sim.slotFor(refLookup('water'))] = 0.4;
      } else if (col < 20) {
        sim.p.comp[i * S + sim.slotFor(refLookup('flour'))] = 0.6; sim.p.comp[i * S + sim.slotFor(refLookup('water'))] = 0.4;
      }
    }
    for (let i = 0; i < sim.p.count; i++) sim.p.dirty[i] = 1;
    sim.step();
    const view = { scale: 60, ox: 200, oy: 20 };
    const fr = new FluidRenderer();
    fr.halo = false;
    const out = fr.render(sim, view, 0);
    assert.ok(out);
    let worst = 0;
    for (const wy of [3.0, 3.2, 3.4]) {
      const y = Math.round(wy * view.scale + view.oy - out.y);
      for (let wx = -0.5; wx < 0.5; wx += 1 / view.scale) {
        const x = Math.round(wx * view.scale + view.ox - out.x), o = (y * fr.w + x) * 4;
        const d = fr.image.data;
        if (d[o + 3] < 200 || d[o + 7] < 200) continue;
        worst = Math.max(worst, Math.abs(d[o] - d[o + 4]) + Math.abs(d[o + 1] - d[o + 5]) + Math.abs(d[o + 2] - d[o + 6]));
      }
    }
    return worst;
  };
  const c = edge('colour'), pst = edge('paste');
  // (a hard switch measured ≈105 and ≈110)
  assert.ok(c < 85, `two colours meet softly (step ${c})`);
  assert.ok(pst < 75, `paste and liquid meet softly (step ${pst})`);
});
