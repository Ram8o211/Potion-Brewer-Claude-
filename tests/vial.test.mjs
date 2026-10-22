// Reversible bottling: a vial keeps the exact particles it was filled with.
// Bottle → test a dose → pour the rest back → change the brew → test again
// → bottle again, with matter conserved at every step, consumed doses gone
// for good, the awakened state carried through, and earlier certification
// dropped once the brew changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { Simulation } from '../src/simulation/world.js';
import { PHASE } from '../src/simulation/constants.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { makeVial, appendParticles, updateVial, takeDose, pourBack, pourBackParts, vialInventory, migrateVial, relaxVial } from '../src/game/vial.js';
import { certification } from '../src/game/experiments.js';
import { awakenedId, thresholdToCelsius } from '../src/alchemy/arcane.js';
import { EFFECT_INDEX } from '../src/alchemy/effects.js';

const st = GameState.create('vial-tests-1', { tutorial: false });
const R = st.world.roles;

function brew() {
  const sim = new Simulation({ size: 'pot', lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
  for (const [id, n] of /** @type {[string, number][]} */ ([[R.water, 30], [R.essenceA, 30]])) {
    sim.emitter.start(st.lookup(id), { amount: n });
    let g = 0;
    while (sim.emitter.pouring && g++ < 20000) sim.step();
  }
  const t = sim.tool; t.type = 'spoon';
  for (let k = 0; k < 120 * 8; k++) { const a = k / 120 * 2.6; t.setTarget(Math.cos(a) * 0.5, 1.2 + Math.sin(a) * 0.2, true); sim.advance(1 / 120, 1, 2); }
  t.setTarget(0, 1, false);
  for (let k = 0; k < 240; k++) sim.step();
  return sim;
}
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
function bottle(sim, n) {
  const v = makeVial(sim, [], { batchId: st.batch.id, rev: st.batch.rev, day: 1, parts: [{ id: R.water, ml: 150 }, { id: R.essenceA, ml: 150 }] });
  const sel = tapSelection(sim, n).sort((a, b) => b - a);
  appendParticles(v, sim, sel);
  for (const i of sel) sim.removeParticle(i);
  return updateVial(v, st.lookup, st.world.laws);
}

test('bottling, dosing and pouring back conserve every drop; consumed doses never return', () => {
  const sim = brew();
  const total0 = sum(sim.inventory());
  const v = bottle(sim, 20);
  assert.equal(v.ml, 100);
  assert.ok(Math.abs(sum(sim.inventory()) + sum(vialInventory(v)) - total0) < 1e-4, 'cauldron + vial = what there was');
  // the vial measures like the tap
  assert.ok(v.m.effects[EFFECT_INDEX.vitality] > 5);
  const before = sum(vialInventory(v));
  const d = takeDose(v, 10, st.lookup, st.world.laws, 1);
  assert.equal(d.ml, 10);
  assert.equal(v.particles.length, 18, 'two particles left the vial');
  assert.ok(Math.abs(before - sum(vialInventory(v)) - 2) < 1e-4, 'the dose is exactly what left');
  assert.ok(Math.abs(d.dose.effects[EFFECT_INDEX.vitality] - v.m.effects[EFFECT_INDEX.vitality]) < 2, 'a dose from a shaken vial represents it');
  const n0 = sim.p.count;
  const back = pourBack(v, sim);
  assert.equal(back, 18);
  assert.equal(sim.p.count, n0 + 18);
  assert.ok(Math.abs(sum(sim.inventory()) - (total0 - 2)) < 1e-4, 'all but the tested dose is back in the cauldron');
  for (let k = 0; k < 240; k++) sim.step();
  let inside = 0;
  for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] !== PHASE.GAS && sim.cauldron.inside(sim.p.x[i], sim.p.y[i])) inside++;
  assert.equal(inside, sim.p.count, 'the poured-back matter settles into the cauldron');
});

test('the awakened state survives bottling, a save and pouring back; the vial cools in its bottle', () => {
  const sim = brew();
  // awaken the essence, then cool it
  const Ta = thresholdToCelsius(st.lookup(R.essenceA).arcane.thr);
  for (let k = 0; k < 120 * 40; k++) {
    let m = 0;
    for (let i = 0; i < sim.p.count; i++) m += sim.p.temp[i];
    m /= sim.p.count;
    sim.furnace.setting = Math.max(-1, Math.min(1, (Ta + 12 - m) / 8));
    sim.step();
  }
  sim.furnace.setting = 0;
  const v = bottle(sim, 20);
  assert.ok(v.species.includes(awakenedId(R.essenceA)), 'the vial holds the awakened essence');
  const hot = v.m.temperature;
  const saved = JSON.parse(JSON.stringify(st.toJSON()));
  saved.vial = v;
  const loaded = GameState.fromJSON(saved);
  assert.deepEqual(loaded.vial.species, v.species);
  assert.equal(loaded.vial.particles.length, 20);
  relaxVial(v, 600);
  updateVial(v, st.lookup, st.world.laws);
  assert.ok(v.m.temperature < hot - 10, `a sealed vial drifts toward room temperature (${hot.toFixed(0)} → ${v.m.temperature.toFixed(0)} °C)`);
  const fresh = new Simulation({ size: 'pot', lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
  pourBack(loaded.vial, fresh);
  const inv = fresh.inventory();
  assert.ok((inv[awakenedId(R.essenceA)] || 0) > 5, 'poured back, it is still awakened');
});

test('modifying the brew after a trial invalidates the old certification', () => {
  const s2 = GameState.create('vial-tests-2', { tutorial: false });
  const sim = brew();
  const dose = measureParticles(sim, tapSelection(sim, 2));
  s2.recordTrial('rabbit', dose, { ml: 10, source: 'cauldron', batchId: s2.batch.id, rev: s2.batch.rev, theory: new Array(10).fill(0), parts: [] });
  const now = measureParticles(sim, tapSelection(sim, 20)).effects;
  assert.ok(Object.keys(certification(s2.trials, s2.batch, now).values).length > 0, 'certified');
  // the vial goes back in (the shop bumps the batch revision)
  s2.touchBatch();
  assert.equal(Object.keys(certification(s2.trials, s2.batch, now).values).length, 0, 'no longer certified');
});

test('a vial from an older save becomes particles of its mean composition', () => {
  const old = { id: 'v1', ml: 45, m: { composition: { [R.water]: 0.5, [R.essenceA]: 0.5 }, temperature: 40, charge: 0 }, batchId: 'b', rev: 2, cert: { vitality: 9 } };
  const v = migrateVial(old);
  assert.equal(v.particles.length, 9);
  assert.deepEqual(v.species.sort(), [R.water, R.essenceA].sort());
  assert.equal(v.cert.vitality, 9);
  updateVial(v, st.lookup, st.world.laws);
  assert.ok(Math.abs(v.m.temperature - 40) < 0.5);
});

test('pouring part of a batch back returns its share of the batch’s provenance, never the whole batch', () => {
  // a 50 ml vial drawn from a 200 ml batch of 150 ml water and 50 ml essence
  const v = /** @type {any} */ ({ parts: [{ id: 'water', ml: 150 }, { id: 'essence', ml: 50 }] });
  assert.deepEqual(pourBackParts(v, 50), [{ id: 'water', ml: 37.5 }, { id: 'essence', ml: 12.5 }]);
  // after a 10 ml dose, 40 ml go back
  assert.deepEqual(pourBackParts(v, 40), [{ id: 'water', ml: 30 }, { id: 'essence', ml: 10 }]);
  // never more than the batch, and nothing from a vial without provenance
  assert.deepEqual(pourBackParts(v, 500), v.parts);
  assert.deepEqual(pourBackParts(/** @type {any} */ ({}), 20), []);
});
