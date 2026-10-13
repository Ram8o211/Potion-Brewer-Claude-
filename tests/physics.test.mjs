// Reproducible physics scenarios. Each test builds a fresh cauldron, runs the
// real simulation headlessly and checks a physical property the game relies on.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSim, pour, run, stir, frac, countPhase, meanSpeed, fractionStats, allContained, PHASE, REF, MAX_SPECIES } from './helpers.mjs';
import { snapshotSim, restoreSim } from '../src/simulation/snapshot.js';
import { refLookup } from '../src/materials/reference.js';
import { mixtureProps } from '../src/reactions/mixture.js';
import { deltaE } from '../src/core/color.js';

test('powder forms a stable pile with an angle of repose and goes to sleep', () => {
  const sim = makeSim();
  pour(sim, 'sand', 400, -0.4, 4);
  const p = sim.p;
  let minY = 9, maxY = -9, minX = 9, maxX = -9;
  for (let i = 0; i < p.count; i++) {
    minY = Math.min(minY, p.y[i]); maxY = Math.max(maxY, p.y[i]);
    minX = Math.min(minX, p.x[i]); maxX = Math.max(maxX, p.x[i]);
  }
  const height = maxY - minY;
  assert.ok(height > 0.7, `pile should stand up (height ${height.toFixed(2)})`);
  // slope estimate: height relative to half base width — far from a flat liquid layer
  const slope = height / ((maxX - minX) / 2);
  assert.ok(slope > 0.35 && slope < 1.4, `slope ${slope.toFixed(2)} should match an angle of repose`);
  let asleep = 0;
  for (let i = 0; i < p.count; i++) if (sim.isAsleep(i)) asleep++;
  assert.ok(asleep / p.count > 0.9, `most grains rest (asleep ${asleep}/${p.count})`);
  // no spontaneous creep afterwards
  const x0 = Float32Array.from(p.x.subarray(0, p.count));
  run(sim, 4);
  let moved = 0;
  for (let i = 0; i < p.count; i++) moved = Math.max(moved, Math.abs(p.x[i] - x0[i]));
  assert.ok(moved < 0.02, `resting pile must not creep (max drift ${moved.toFixed(4)})`);
});

test('grains do not rebound elastically', () => {
  const sim = makeSim();
  sim.cauldron.lidClosed = false;
  pour(sim, 'sand', 60, 0, 0);
  let maxUp = 0;
  for (let k = 0; k < 240; k++) {
    sim.step();
    for (let i = 0; i < sim.p.count; i++) if (sim.p.y[i] > 2.6) maxUp = Math.max(maxUp, -sim.p.vy[i]);
  }
  assert.ok(maxUp < 0.9, `upward velocity after impact should stay small (got ${maxUp.toFixed(2)})`);
});

test('a disturbed pile avalanches and settles again', () => {
  const sim = makeSim();
  pour(sim, 'sand', 350, -0.5, 4);
  const before = Float32Array.from(sim.p.x.subarray(0, sim.p.count));
  stir(sim, 1.2, -0.5, 2.4, 0.5, 0.2, 3);
  let moved = 0;
  for (let i = 0; i < sim.p.count; i++) if (Math.abs(sim.p.x[i] - before[i]) > 0.05) moved++;
  assert.ok(moved > 30, `spoon should move grains (moved ${moved})`);
  run(sim, 4);
  assert.ok(meanSpeed(sim) < 0.03, 'pile comes to rest again');
});

test('liquid pools calmly and stays contained', () => {
  const sim = makeSim();
  pour(sim, 'water', 500, 0, 6);
  assert.ok(meanSpeed(sim) < 0.03, `settled liquid is calm (mean speed ${meanSpeed(sim).toFixed(3)})`);
  assert.ok(allContained(sim), 'no particle outside the vessel');
});

test('immiscible liquids stratify by density without gaps', () => {
  const sim = makeSim();
  pour(sim, 'oil', 200, 0, 0.3);
  pour(sim, 'water', 250, 0, 0.3);
  pour(sim, 'quick', 120, 0, 8);
  const meanY = (id) => {
    let s = 0, n = 0;
    for (let i = 0; i < sim.p.count; i++) if (frac(sim, i, id) > 0.5) { s += sim.p.y[i]; n++; }
    return s / n;
  };
  const yq = meanY('quick'), yw = meanY('water'), yo = meanY('oil');
  assert.ok(yq > yw && yw > yo, `order quickwater ${yq.toFixed(2)} > water ${yw.toFixed(2)} > oil ${yo.toFixed(2)}`);
  // no gap: every oil particle at the interface has a water neighbour within contact range
  let lowestOil = -1, ly = -9;
  for (let i = 0; i < sim.p.count; i++) if (frac(sim, i, 'oil') > 0.5 && sim.p.y[i] > ly) { ly = sim.p.y[i]; lowestOil = i; }
  let nearest = 9;
  for (let j = 0; j < sim.p.count; j++) {
    if (frac(sim, j, 'oil') > 0.5) continue;
    nearest = Math.min(nearest, Math.hypot(sim.p.x[j] - sim.p.x[lowestOil], sim.p.y[j] - sim.p.y[lowestOil]));
  }
  assert.ok(nearest < 0.14, `interface contact distance ${nearest.toFixed(3)}`);
});

test('mixing starts at the contact interface and spreads progressively', () => {
  const sim = makeSim();
  pour(sim, 'water', 450, 0, 2);
  pour(sim, 'red', 50, -1.0, 0);
  run(sim, 1);
  // shortly after contact: some water particles mixed, but most far away untouched
  let touched = 0, far = 0;
  for (let i = 0; i < sim.p.count; i++) {
    const r = frac(sim, i, 'red'), w = frac(sim, i, 'water');
    if (r > 0.02 && w > 0.02) touched++;
    if (sim.p.x[i] > 0.8 && r > 0.02) far++;
  }
  assert.ok(touched > 5, `interface particles mix (${touched})`);
  assert.ok(far < 5, `distant particles not recoloured instantly (${far})`);
  const s1 = fractionStats(sim, 'red', ['water', 'red']).sd;
  run(sim, 8);
  const s2 = fractionStats(sim, 'red', ['water', 'red']).sd;
  assert.ok(s2 < s1, `diffusion progresses (sd ${s1.toFixed(3)} → ${s2.toFixed(3)})`);
});

test('stirring accelerates mixing dramatically', () => {
  const still = makeSim();
  pour(still, 'water', 400, 0.5, 1);
  pour(still, 'blue', 100, -1.0, 0);
  const stirred = makeSim();
  pour(stirred, 'water', 400, 0.5, 1);
  pour(stirred, 'blue', 100, -1.0, 0);
  run(still, 6);
  stir(stirred, 6);
  const a = fractionStats(still, 'blue', ['water', 'blue']).sd;
  const b = fractionStats(stirred, 'blue', ['water', 'blue']).sd;
  assert.ok(b < a * 0.6, `stirred heterogeneity ${b.toFixed(3)} should be far below still ${a.toFixed(3)}`);
});

test('compatible mixture converges to a composition-weighted equilibrium colour', () => {
  for (const [nr, nb] of [[60, 240], [150, 150]]) {
    const sim = makeSim();
    pour(sim, 'red', nr, -0.6, 0.5);
    pour(sim, 'blue', nb, 0.6, 0.5);
    stir(sim, 14);
    run(sim, 2);
    const st = fractionStats(sim, 'red', ['red', 'blue']);
    const expected = nr / (nr + nb);
    assert.ok(Math.abs(st.mean - expected) < 0.02, `mean red fraction ${st.mean.toFixed(3)} vs ${expected}`);
    assert.ok(st.sd < 0.08, `homogeneous after stirring (sd ${st.sd.toFixed(3)})`);
    // the colour of the blend equals the mixture law of the totals
    const comp = new Float32Array(MAX_SPECIES);
    comp[sim.species.slotOf.get('red')] = expected;
    comp[sim.species.slotOf.get('blue')] = 1 - expected;
    const target = mixtureProps(sim.species, comp, 0, 20).lab;
    let L = 0, A = 0, B = 0;
    for (let i = 0; i < sim.p.count; i++) { L += sim.p.colL[i]; A += sim.p.colA[i]; B += sim.p.colB[i]; }
    const n = sim.p.count;
    assert.ok(deltaE([L / n, A / n, B / n], target) < 4, 'blend colour matches mixture law');
  }
});

test('dough forms only with stirring, and excess liquid thins it back', () => {
  const ctrl = makeSim();
  pour(ctrl, 'flour', 220, 0, 0.5);
  pour(ctrl, 'water', 190, 0, 3);
  const pasteStill = countPhase(ctrl, PHASE.PASTE);
  const sim = makeSim();
  pour(sim, 'flour', 220, 0, 0.5);
  pour(sim, 'water', 190, 0, 1);
  stir(sim, 8, 0, 2.75, 1.2, 0.25, 3);
  stir(sim, 6, 0, 2.6, 0.9, 0.3, 2.6);
  run(sim, 1);
  const pasteStirred = countPhase(sim, PHASE.PASTE);
  assert.ok(pasteStirred > pasteStill * 2 && pasteStirred > 200, `stirred paste ${pasteStirred} vs unstirred ${pasteStill}`);
  // thin it with lots of water
  pour(sim, 'water', 500, 0, 0.5);
  stir(sim, 10, 0, 2.3, 1.2, 0.5, 2.6);
  run(sim, 1);
  const liquid = countPhase(sim, PHASE.LIQUID);
  assert.ok(liquid > sim.p.count * 0.7, `diluted back to liquid (${liquid}/${sim.p.count})`);
});

test('paste holds its shape while water and honey level out', () => {
  const block = (kind) => {
    const sim = makeSim();
    const S = MAX_SPECIES;
    for (let r = 0; r < 12; r++) for (let c = 0; c < 8; c++) {
      const x = -0.35 + c * 0.1 + (r % 2) * 0.05, y = 3.1 - r * 0.087;
      if (kind === 'paste') {
        const i = sim.addParticle(REF.flour, x, y);
        const sw = sim.slotFor(REF.water), sf = sim.slotFor(REF.flour);
        sim.p.comp[i * S + sf] = 0.6; sim.p.comp[i * S + sw] = 0.4; sim.p.dirty[i] = 1;
      } else sim.addParticle(REF[kind], x, y);
    }
    for (let k = 0; k < 48; k++) { sim.step(); for (let i = 0; i < sim.p.count; i++) { sim.p.vx[i] = 0; sim.p.vy[i] = 0; } }
    const width = () => { let a = 9, b = -9; for (let i = 0; i < sim.p.count; i++) { a = Math.min(a, sim.p.x[i]); b = Math.max(b, sim.p.x[i]); } return b - a; };
    const w1 = (run(sim, 1), width());
    const w5 = (run(sim, 5), width());
    return { w1, w5 };
  };
  const paste = block('paste'), water = block('water'), honey = block('honey');
  assert.ok(paste.w5 < 1.5 && paste.w5 < water.w1 * 0.55, `paste keeps its footprint (${paste.w5.toFixed(2)} vs water ${water.w1.toFixed(2)})`);
  assert.ok(water.w1 > 2.4, `water spreads immediately (${water.w1.toFixed(2)})`);
  assert.ok(honey.w1 < water.w1 - 0.3, `honey slower than water at 1 s (${honey.w1.toFixed(2)} vs ${water.w1.toFixed(2)})`);
  assert.ok(honey.w5 > honey.w1, 'honey keeps levelling (no yield stress)');
});

test('freezing starts at the cold bottom and forms one coherent rigid block', () => {
  const sim = makeSim();
  pour(sim, 'water', 400, 0, 1);
  Object.assign(sim.furnace, { setting: -1, minCool: -40, coolPower: 12 });
  run(sim, 6);
  // partially frozen: frozen particles are the deeper ones
  let fy = 0, fn = 0, ly = 0, ln = 0;
  for (let i = 0; i < sim.p.count; i++) {
    if (sim.p.phase[i] === PHASE.SOLID) { fy += sim.p.y[i]; fn++; } else { ly += sim.p.y[i]; ln++; }
  }
  assert.ok(fn > 20 && ln > 20, `freezing is progressive (solid ${fn}, liquid ${ln})`);
  assert.ok(fy / fn > ly / ln, 'ice forms from the bottom up');
  run(sim, 30);
  assert.equal(countPhase(sim, PHASE.SOLID), sim.p.count, 'everything froze');
  assert.equal(sim.rigid.bodyCount(), 1, 'a single coherent body');
  // rigidity: distances inside the block do not change while it rests
  const a = 0, b = Math.floor(sim.p.count / 2);
  const d0 = Math.hypot(sim.p.x[a] - sim.p.x[b], sim.p.y[a] - sim.p.y[b]);
  run(sim, 2);
  const d1 = Math.hypot(sim.p.x[a] - sim.p.x[b], sim.p.y[a] - sim.p.y[b]);
  assert.ok(Math.abs(d1 - d0) < 0.01, 'block moves as one rigid body');
});

test('pestle crushes a frozen block into grains, conserving material', () => {
  const sim = makeSim();
  pour(sim, 'red', 200, 0, 1);
  Object.assign(sim.furnace, { setting: -1, minCool: -40, coolPower: 12 });
  run(sim, 30);
  Object.assign(sim.furnace, { setting: 0 });
  const before = sim.inventory().red;
  const t = sim.tool;
  t.type = 'pestle';
  for (let k = 0; k < 480; k++) {
    const x = Math.sin(k / 20) * 0.9;
    const y = 2.6 + Math.abs(Math.sin(k / 7)) * 0.5;
    t.setTarget(x, y, true);
    sim.advance(1 / 120, 1, 2);
  }
  t.setTarget(0, 1, false);
  const grains = countPhase(sim, PHASE.POWDER);
  assert.ok(grains > 40, `crushed grains present (${grains})`);
  assert.ok(Math.abs(sim.inventory().red - before) < 1e-3, 'material conserved');
});

test('heat enters through the bottom and conducts progressively', () => {
  const sim = makeSim();
  pour(sim, 'water', 450, 0, 1);
  sim.furnace.setting = 1;
  run(sim, 3);
  let lo = 0, ln = 0, hi = 0, hn = 0, minY = 9, maxY = -9;
  for (let i = 0; i < sim.p.count; i++) { minY = Math.min(minY, sim.p.y[i]); maxY = Math.max(maxY, sim.p.y[i]); }
  for (let i = 0; i < sim.p.count; i++) {
    if (sim.p.y[i] > maxY - 0.25) { lo += sim.p.temp[i]; ln++; }
    if (sim.p.y[i] < minY + 0.25) { hi += sim.p.temp[i]; hn++; }
  }
  assert.ok(lo / ln > hi / hn + 3, `bottom ${(lo / ln).toFixed(1)}°C warmer than surface ${(hi / hn).toFixed(1)}°C`);
  sim.furnace.setting = 0;
  run(sim, 25);
  let mn = 99, mx = -99;
  for (let i = 0; i < sim.p.count; i++) { mn = Math.min(mn, sim.p.temp[i]); mx = Math.max(mx, sim.p.temp[i]); }
  assert.ok(mx - mn < 6, `approaches equilibrium (spread ${(mx - mn).toFixed(1)}°C)`);
});

test('boiling vapour stays under the lid and condenses back when cooled', () => {
  const sim = makeSim();
  pour(sim, 'water', 300, 0, 1);
  const mass0 = sim.totalMass();
  sim.furnace.setting = 1;
  run(sim, 35);
  const gas = countPhase(sim, PHASE.GAS);
  assert.ok(gas > 60, `water boils (${gas} vapour particles)`);
  // vapour is dispersed, not a single line under the lid
  let ys = [];
  for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === PHASE.GAS) ys.push(sim.p.y[i]);
  const spread = Math.max(...ys) - Math.min(...ys);
  assert.ok(spread > 0.5, `vapour fills the headspace (vertical spread ${spread.toFixed(2)})`);
  assert.ok(allContained(sim), 'lid contains all vapour');
  sim.furnace.setting = 0;
  run(sim, 60);
  const liquid = countPhase(sim, PHASE.LIQUID);
  assert.ok(liquid >= 0.95 * sim.p.count, `condensed back (${liquid}/${sim.p.count})`);
  assert.ok(Math.abs(sim.totalMass() - mass0) < 1e-3, 'mass conserved through boiling and condensation');
});

test('gases are buoyant and contained', () => {
  const sim = makeSim();
  pour(sim, 'water', 250, 0, 1);
  // light vapour (spirit is heavier than air; make some hot steam directly)
  for (let k = 0; k < 40; k++) sim.addParticle(REF.water, -0.8 + (k % 10) * 0.18, 1.6 + Math.floor(k / 10) * 0.12, PHASE.GAS, 140);
  sim.furnace.setting = 0.6;
  run(sim, 2);
  let gy = 0, gn = 0;
  for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === PHASE.GAS) { gy += sim.p.y[i]; gn++; }
  assert.ok(gn > 0 && gy / gn < 1.2, 'hot vapour rises toward the lid');
  assert.ok(allContained(sim), 'contained');
});

test('immiscible liquids never blend even when stirred', () => {
  const sim = makeSim();
  pour(sim, 'oil', 200, -0.5, 0.5);
  pour(sim, 'water', 250, 0.5, 0.5);
  stir(sim, 6);
  run(sim, 4);
  let mixed = 0;
  for (let i = 0; i < sim.p.count; i++) if (frac(sim, i, 'oil') > 0.05 && frac(sim, i, 'water') > 0.05) mixed++;
  assert.equal(mixed, 0, 'no oil/water blend particles');
});

test('vigorous stirring never pushes matter through the walls', () => {
  const sim = makeSim();
  pour(sim, 'water', 400, 0, 0.5);
  pour(sim, 'sand', 150, 0.5, 0.5);
  const t = sim.tool;
  t.type = 'spoon';
  let leaked = false;
  for (let k = 0; k < 900; k++) {
    // fast, jerky strokes reaching the walls
    const a = k * 0.35;
    t.setTarget(Math.cos(a) * 2.1, 2.4 + Math.sin(a * 1.3) * 0.9, true);
    sim.advance(1 / 60, 1, 4);
    if (!allContained(sim)) leaked = true;
  }
  assert.ok(!leaked, 'all particles stay inside the cauldron');
});

test('energy is conserved apart from explicit furnace input and ambient loss', () => {
  const sim = makeSim();
  pour(sim, 'water', 300, 0, 1);
  // put hot oil on top: pure conduction problem
  pour(sim, 'oil', 150, 0, 0);
  for (let i = 0; i < sim.p.count; i++) if (frac(sim, i, 'oil') > 0.5) sim.p.temp[i] = 80;
  const e0 = sim.totalEnergy();
  sim.energyIn = 0; sim.energyOut = 0;
  run(sim, 8);
  const e1 = sim.totalEnergy();
  const err = Math.abs(e1 - e0 - (sim.energyIn - sim.energyOut));
  assert.ok(err / Math.abs(e0) < 0.01, `energy balance error ${(err / Math.abs(e0) * 100).toFixed(3)}%`);
});

test('save → reload reproduces the cauldron state', () => {
  const sim = makeSim();
  pour(sim, 'flour', 120, -0.5, 0.5);
  pour(sim, 'water', 200, 0.4, 0.5);
  pour(sim, 'red', 60, 0, 1);
  stir(sim, 2);
  sim.furnace.setting = 0.5;
  run(sim, 2);
  const snap = JSON.parse(JSON.stringify(snapshotSim(sim, 'small')));
  const copy = restoreSim(snap, { lookup: refLookup });
  assert.equal(copy.p.count, sim.p.count);
  const inv0 = sim.inventory(), inv1 = copy.inventory();
  for (const k of Object.keys(inv0)) assert.ok(Math.abs(inv0[k] - inv1[k]) < 1e-4, `species ${k} preserved`);
  for (let i = 0; i < sim.p.count; i += 17) {
    assert.ok(Math.abs(sim.p.x[i] - copy.p.x[i]) < 1e-6);
    assert.ok(Math.abs(sim.p.temp[i] - copy.p.temp[i]) < 1e-4);
    assert.equal(sim.p.phase[i], copy.p.phase[i]);
  }
  run(sim, 1); run(copy, 1);
  const my = (s) => { let a = 0; for (let i = 0; i < s.p.count; i++) a += s.p.y[i]; return a / s.p.count; };
  assert.ok(Math.abs(my(sim) - my(copy)) < 0.02, 'behaviour continues identically after reload');
});

test('neighbour search is linear: step cost stays bounded at high particle counts', () => {
  const sim = makeSim('large');
  pour(sim, 'water', 1500, 0, 0.5, 400);
  const t0 = performance.now();
  run(sim, 1);
  const ms = (performance.now() - t0) / 120;
  assert.ok(ms < 12, `step time ${ms.toFixed(2)} ms for ${sim.p.count} particles`);
});

test('combustion spreads locally from the ignition point and consumes fuel', () => {
  const sim = makeSim();
  sim.cauldron.lidClosed = false;
  pour(sim, 'oil', 250, 0, 2);
  // ignite a small region at the surface
  let minY = 9;
  for (let i = 0; i < sim.p.count; i++) minY = Math.min(minY, sim.p.y[i]);
  for (let i = 0; i < sim.p.count; i++) if (sim.p.y[i] < minY + 0.12 && Math.abs(sim.p.x[i]) < 0.2) sim.p.temp[i] = 420;
  run(sim, 0.5);
  let burning = 0;
  for (let i = 0; i < sim.p.count; i++) if (sim.p.burn[i] > 0.2) burning++;
  assert.ok(burning > 0 && burning < sim.p.count * 0.5, `fire starts locally (${burning} burning)`);
  const oil0 = sim.inventory().oil;
  run(sim, 6);
  const oil1 = sim.inventory().oil || 0;
  assert.ok(oil1 < oil0, 'fuel is consumed');
});
