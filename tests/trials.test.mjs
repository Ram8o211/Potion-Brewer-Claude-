// Experiments, certification, gathering and save migration.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameState, SAVE_VERSION } from '../src/game/state.js';
import { Simulation } from '../src/simulation/world.js';
import { applySnapshot } from '../src/simulation/snapshot.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { theoryOf, EFFECT_INDEX, NE } from '../src/alchemy/effects.js';
import { SUBJECTS, SUBJECT_BY_ID, certification, missingEffects, suggestSubjects, subjectResponse, createTrials } from '../src/game/experiments.js';
import { depositStatus, generateDeposits, SCAR_SLOWDOWN } from '../src/game/gathering.js';
import { PHASE } from '../src/simulation/constants.js';

const V = EFFECT_INDEX;

function brew(st, parts) {
  const sim = new Simulation({ size: 'small', lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
  for (const [id, n, ground] of parts) {
    sim.emitter.start(st.lookup(id), { amount: n, ground });
    let g = 0;
    while (sim.emitter.pouring && g++ < 20000) sim.step();
    st.touchBatch();
  }
  const t = sim.tool; t.type = 'spoon';
  for (let k = 0; k < 120 * 10; k++) { const a = k / 120 * 2.6; t.setTarget(Math.cos(a) * 0.9, 2.6 + Math.sin(a) * 0.35, true); sim.advance(1 / 120, 1, 2); }
  t.setTarget(0, 2.6, false);
  for (let k = 0; k < 240; k++) sim.step();
  return sim;
}

/** Draw a dose from the tap exactly as the trials room does. */
function drawDose(sim, ml) {
  const sel = tapSelection(sim, Math.round(ml / 5));
  const m = measureParticles(sim, sel);
  for (const i of sel.sort((a, b) => b - a)) sim.removeParticle(i);
  return m;
}

test('a trial consumes a real dose and reveals only what the subject responds to', () => {
  const st = GameState.create('trial-seed-1', { tutorial: false });
  const R = st.world.roles;
  const stock0 = st.stock(R.essenceA);
  const sim = brew(st, [[R.water, 30], [R.essenceA, 30]]);
  const before = sim.p.count;
  const dose = drawDose(sim, 10);
  assert.equal(sim.p.count, before - 2, 'two 5 ml particles left the cauldron');
  assert.equal(st.stock(R.essenceA), stock0, 'no ingredient was duplicated or refunded');
  const theory = theoryOf([{ id: R.water, ml: 150 }, { id: R.essenceA, ml: 150 }], st.lookup);
  const { record } = st.recordTrial('stone', dose, { ml: 10, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory, parts: [] });
  assert.deepEqual(record.revealed, SUBJECT_BY_ID.stone.reveals);
  assert.equal(record.values.vitality, undefined, 'a stone cannot show healing');
  const { record: r2 } = st.recordTrial('rabbit', drawDose(sim, 10), { ml: 10, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory, parts: [] });
  assert.ok(r2.values.vitality > 5, `the rabbit shows vitality ${r2.values.vitality}`);
  assert.ok(r2.observations.some((o) => o.key === 'vitality'));
  assert.equal(st.trials.records.length, 2);
  assert.equal(st.stats.trials, 2);
  assert.ok(st.achievements.trial1);
});

test('certification: valid for this batch only, invalidated by a new pour or by drift', () => {
  const st = GameState.create('trial-seed-2', { tutorial: false });
  const R = st.world.roles;
  const sim = brew(st, [[R.water, 30], [R.essenceA, 30]]);
  const theory = new Float64Array(NE);
  st.recordTrial('rabbit', drawDose(sim, 10), { ml: 10, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory, parts: [] });
  const now = measureParticles(sim, tapSelection(sim, 20)).effects;
  const cert = certification(st.trials, st.batch, now);
  assert.ok(cert.values.vitality > 5 && cert.values.toxicity !== undefined, 'vitality and toxicity verified');
  const order = { requirements: [{ key: 'vitality' }, { key: 'toxicity' }, { key: 'color' }, { key: 'fire' }] };
  assert.deepEqual(missingEffects(order, cert.values), ['fire'], 'fire still needs a subject that shows it');
  assert.ok(suggestSubjects(['fire']).length === 1);
  // a different measurement (drift) invalidates silently
  const drifted = now.slice(); drifted[V.vitality] += 20;
  assert.equal(certification(st.trials, st.batch, drifted).values.vitality, undefined, 'drift invalidates');
  // pouring anything new invalidates
  st.touchBatch();
  const after = certification(st.trials, st.batch, now);
  assert.equal(after.values.vitality, undefined);
  assert.ok(after.changed, 'the trial is known to be outdated');
  // a fresh batch knows nothing
  st.newBatch();
  assert.deepEqual(certification(st.trials, st.batch, now).values, {});
});

test('resonance laws are discovered by repeated trials where they act, then join the theory', () => {
  const st = GameState.create('trial-seed-3', { tutorial: false });
  const L = st.world.laws[0];
  const dose = { effects: new Float64Array(NE), resonance: new Float64Array(st.world.laws.length) };
  dose.resonance[0] = 6;
  dose.effects[L.a] = 15;
  const subj = SUBJECTS.find((s) => s.reveals.includes(['vitality', 'strength', 'love', 'arcana', 'transformation', 'fire', 'frost', 'acidity', 'toxicity', 'death'][L.a]) && !s.needs);
  const ctx = { ml: 10, source: 'cauldron', batchId: 'x', rev: 0, theory: new Float64Array(NE), parts: [] };
  st.recordTrial(subj.id, dose, ctx);
  assert.equal(st.knownLaws.length, 0, 'one anomaly is not yet a law');
  if (!st.trials.subjects[subj.id].alive) st.replaceSubject(subj.id, true);
  const { events } = st.recordTrial(subj.id, dose, ctx);
  assert.equal(st.knownLaws.length, 1, 'confirmed on the second trial');
  assert.ok(events.some((e) => e.type === 'law'));
  assert.ok(st.journal['law:' + L.id]);
});

test('subjects respond differently; lethal doses kill and replacement costs coins', () => {
  const tox = new Float64Array(NE); tox[V.toxicity] = 40; tox[V.death] = 30;
  const rabbit = subjectResponse(SUBJECT_BY_ID.rabbit, createTrials().subjects.rabbit, tox, 25);
  assert.equal(rabbit.after.alive, false, 'poison and death kill the rabbit');
  const stone = subjectResponse(SUBJECT_BY_ID.stone, createTrials().subjects.stone, tox, 25);
  assert.equal(stone.after.alive, true, 'a stone does not die of poison');
  const acid = new Float64Array(NE); acid[V.acidity] = 30;
  const etched = subjectResponse(SUBJECT_BY_ID.stone, createTrials().subjects.stone, acid, 10);
  assert.ok(etched.after.marks.etch > 20 && etched.observations.some((o) => o.key === 'acidity'));
  const alk = new Float64Array(NE); alk[V.acidity] = -30;
  assert.ok(subjectResponse(SUBJECT_BY_ID.stone, createTrials().subjects.stone, alk, 10).observations[0].text.includes('alkaline'));
  const st = GameState.create('trial-seed-4', { tutorial: false });
  st.trials.subjects.rabbit = rabbit.after;
  assert.throws(() => st.recordTrial('rabbit', { effects: tox }, { ml: 10, source: 'cauldron', batchId: 'b', rev: 0, theory: [], parts: [] }));
  const c0 = st.coins;
  assert.ok(st.replaceSubject('rabbit').ok);
  assert.equal(st.coins, c0 - SUBJECT_BY_ID.rabbit.cost);
  assert.equal(st.trials.subjects.rabbit.alive, true);
  assert.equal(st.subjectAvailable('wisp'), false, 'the wisp needs its lantern');
});

test('the wilds: deterministic deposits, finite stock, timestamp regrowth, rank locks and storage limits', () => {
  const st = GameState.create('wild-seed-1', { tutorial: false });
  const again = generateDeposits(st.world, st.lookup);
  assert.equal(JSON.stringify(again), JSON.stringify(st.deposits), 'deterministic layout');
  const regions = new Set(st.deposits.map((d) => d.region));
  assert.ok(regions.size >= 6, 'six regions');
  const d = st.deposits.find((x) => x.rank === 0 && !x.rare);
  const t0 = 1_000_000_000_000;
  const inv0 = st.stock(d.materialId);
  let got = 0, n = 0;
  // careful harvests stop at the reserve; a thorough one strips the rest
  while (n++ < 100) { const r = st.gather(d.id, { now: t0 }); if (!r.ok) { assert.equal(r.reason, 'reserve'); break; } got += r.amount; }
  while (n++ < 200) { const r = st.gather(d.id, { now: t0, thorough: true }); if (!r.ok) break; got += r.amount; }
  assert.ok(got > 0 && got <= d.capacity, `gathered ${got} of ${d.capacity}`);
  assert.equal(st.stock(d.materialId), inv0 + got, 'everything gathered is in the inventory');
  assert.equal(st.gather(d.id, { now: t0, thorough: true }).reason, 'depleted');
  // a stripped deposit is scarred and regrows at a slower pace
  const half = depositStatus(st.gathering, d, t0 + d.regrowMs / 2);
  assert.ok(Math.abs(half.stock - d.capacity / 2 / SCAR_SLOWDOWN) < 2, 'regrows with elapsed time');
  assert.ok(depositStatus(st.gathering, d, t0 + d.regrowMs * SCAR_SLOWDOWN * 2).stock === d.capacity, 'never above capacity');
  const locked = st.deposits.find((x) => x.rank > 0);
  assert.equal(st.gather(locked.id, { now: t0 }).reason, 'locked');
  // shelves cap what can be carried home
  st.inventory[d.materialId] = st.cap.storage;
  assert.equal(st.gather(d.id, { now: t0 + d.regrowMs * 3 }).reason, 'full');
  // persistence of deposit state
  const back = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.equal(JSON.stringify(back.gathering.nodes), JSON.stringify(st.gathering.nodes));
  // a new day regrows half of each deposit
  st.inventory[d.materialId] = 0;
  st.gathering.nodes[d.id] = { stock: 0, at: Date.now() };
  st.endDay();
  assert.ok(depositStatus(st.gathering, d).stock >= d.capacity * 0.5 - 1);
});

test('a genuine v2 save migrates: progress kept, effects and wilds added, aspect order rescaled and needing a trial', () => {
  const raw = JSON.parse(fs.readFileSync(new URL('./fixtures/save-v2.json', import.meta.url), 'utf8'));
  assert.equal(raw.version, 2);
  const st = GameState.fromJSON(raw);
  assert.equal(st.version, SAVE_VERSION);
  assert.equal(st.coins, raw.coins);
  assert.equal(st.reputation, raw.reputation);
  assert.equal(st.day, raw.day);
  assert.equal(st.recipes.length, raw.recipes.length);
  assert.equal(st.journal['boil:x'].title, 'Water boils');
  for (const [k, v] of Object.entries(raw.inventory)) assert.equal(String(st.inventory[k] === Infinity ? 'inf' : st.inventory[k]), String(v), `stock of ${k} kept`);
  assert.ok(st.world.wild.length >= 15 && st.world.laws.length === 6, 'wild ingredients and laws added');
  for (const m of st.world.materials) assert.ok(m.effects, `${m.id} has effects`);
  assert.ok(st.has('mortar'), 'the new starter mortar is granted');
  // the old reagents are exactly the ones the seed always had
  const oldIds = raw.world.materials.map((m) => m.id);
  for (const id of oldIds) assert.ok(st.lookup(id), id);
  // in-progress order: fortitude → strength, rescaled, now an effect order
  const req = st.current.requirements.find((r) => r.key === 'strength');
  assert.ok(req && req.effect && req.target >= 3, 'fortitude requirement became strength');
  assert.ok(st.current.effectOrder);
  assert.ok(!st.current.requirements.some((r) => r.key === 'fortitude' || r.key === 'ardor'));
  // the cauldron snapshot (v1 snapshot, no charge field) restores
  const sim = new Simulation({ size: 'small', lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
  applySnapshot(sim, st.cauldron, { lookup: st.lookup });
  assert.equal(sim.p.count, raw.cauldron.n);
  for (let i = 0; i < sim.p.count; i++) assert.equal(sim.p.q[i], 0);
  const m = measureParticles(sim, tapSelection(sim, 10));
  assert.ok(m.effects[V.vitality] > 0, 'the old brew now has measurable (hidden) effects');
  // and it saves and loads as v3
  const again = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.equal(again.world.materials.length, st.world.materials.length);
  assert.equal(JSON.stringify(again.current.requirements), JSON.stringify(st.current.requirements));
});

test('corrupted, partial and future saves are rejected or repaired, never silently reset', () => {
  const st = GameState.create('robust-1', { tutorial: false });
  const good = st.toJSON();
  // partial new-system data is repaired
  const partial = { ...good, trials: { subjects: { rabbit: { health: 'x' } }, records: [null, 5, { subjectId: 'stone', values: { acidity: 3 } }] }, gathering: { nodes: { a: { stock: 'nan', at: 3 } } } };
  const p = GameState.fromJSON(JSON.parse(JSON.stringify(partial)));
  assert.equal(p.trials.subjects.rabbit.health, 100);
  assert.equal(p.trials.records.length, 1);
  assert.deepEqual(p.gathering.nodes, {});
  assert.throws(() => GameState.fromJSON({ ...good, version: SAVE_VERSION + 1 }), /newer version/);
  assert.throws(() => GameState.fromJSON({ ...good, inventory: null }), /inventory/);
  assert.throws(() => GameState.fromJSON(null));
  // a missing world regenerates from the seed (v2 behaviour, still supported)
  const noWorld = { ...JSON.parse(JSON.stringify(good)), world: undefined };
  const r = GameState.fromJSON(noWorld);
  assert.equal(r.world.seed, 'robust-1');
  assert.ok(r.world.wild.length > 0);
});

void PHASE;
