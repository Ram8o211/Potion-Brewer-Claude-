// The rabbit farm: readings that differ from rabbit to rabbit, estimates
// that narrow with more rabbits, effects piling up until they degenerate,
// feral rabbits attacking the colony, purging draughts, culling, and
// vitality raising a healthy rabbit's maximum health.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState, PURGE_PRICE, PURGE_BREW_TIME } from '../src/game/state.js';
import { NE, EFFECT_INDEX } from '../src/alchemy/effects.js';
import { certification, rabbitReading, summarize } from '../src/game/experiments.js';
import {
  createColony, findRabbit, rabbitResponse, colonyTick, purgeRabbit, maxHealthOf, rabbitSensitivity, isFeral, rabbitSnap, encodeSnap, decodeSnap,
  DEGEN_AT, MARK_TAU,
} from '../src/game/colony.js';

const fx = (o) => { const e = new Array(NE).fill(0); for (const [k, v] of Object.entries(o)) e[EFFECT_INDEX[k]] = v; return e; };
const dose = (o) => ({ effects: fx(o), resonance: [], color: [0.5, 0.5, 0.5], temperature: 20 });
const ctx = (st, extra = {}) => ({ ml: 10, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory: new Array(NE).fill(0), parts: [], ...extra });

test('readings vary between rabbits and between doses; absent effects read as absent', () => {
  const c = createColony();
  const [a, b] = c.rabbits;
  const e = fx({ vitality: 12, toxicity: 0 });
  const sa = rabbitSensitivity(a, 'vitality'), sb = rabbitSensitivity(b, 'vitality');
  assert.ok(sa >= 0.6 && sa <= 1.6 && sb >= 0.6 && sb <= 1.6);
  assert.equal(sa, rabbitSensitivity(a, 'vitality'), 'a lifelong, stable trait');
  const r1 = rabbitReading(a, e, { ml: 10, salt: '1' }), r2 = rabbitReading(a, e, { ml: 10, salt: '2' });
  assert.notEqual(r1[EFFECT_INDEX.vitality], r2[EFFECT_INDEX.vitality], 'every dose differs a little');
  assert.equal(r1[EFFECT_INDEX.toxicity], 0, 'no poison, no poison reading');
  assert.deepEqual(r1, rabbitReading(a, e, { ml: 10, salt: '1' }), 'deterministic');
});

test('the batch estimate pools trials and gets surer with more different rabbits', () => {
  const st = GameState.create('farm-1', { tutorial: false });
  st.coins = 500;
  st.equipment.push('kennel');
  for (let k = 0; k < 4; k++) st.buyRabbit();
  assert.equal(st.colony.rabbits.length, 6);
  const truth = fx({ vitality: 14 });
  st.recordTrial('rabbit', dose({ vitality: 14 }), ctx(st, { rabbitId: 'r1' }));
  const one = certification(st.trials, st.batch, truth);
  assert.equal(one.rabbits.vitality, 1);
  for (const r of st.colony.rabbits.slice(1)) st.recordTrial('rabbit', dose({ vitality: 14 }), ctx(st, { rabbitId: r.id }));
  const many = certification(st.trials, st.batch, truth);
  assert.equal(many.rabbits.vitality, 6);
  assert.equal(many.n.vitality, 6);
  assert.ok(many.spread.vitality < one.spread.vitality, `±${many.spread.vitality} < ±${one.spread.vitality}`);
  assert.ok(Math.abs(many.values.vitality - 14) < 4, `mean ${many.values.vitality} is near the truth`);
  // the same rabbit again and again does not shrink its own bias
  const st2 = GameState.create('farm-1b', { tutorial: false });
  for (let k = 0; k < 6; k++) st2.recordTrial('rabbit', dose({ vitality: 14 }), ctx(st2, { rabbitId: 'r2', ml: 5 }));
  const same = certification(st2.trials, st2.batch, truth);
  assert.equal(same.rabbits.vitality, 1);
  assert.ok(same.spread.vitality > many.spread.vitality, 'one rabbit stays less certain than six');
  const s = summarize({ fire: [{ v: 10, r: 'a', rec: 't1' }, { v: 12, r: 'b', rec: 't2' }] });
  assert.equal(s.values.fire, 11);
  assert.equal(s.records.fire, 't2');
});

test('effects pile up in a rabbit and fade slowly in real time', () => {
  const c = createColony();
  const r = c.rabbits[0];
  let x = r;
  for (let k = 0; k < 3; k++) x = rabbitResponse(x, fx({ love: 10 }), 10).after;
  assert.ok(x.marks.love > 30, `cumulative: ${x.marks.love}`);
  c.rabbits[0] = x;
  const v0 = x.marks.love;
  colonyTick(c, 60);
  assert.ok(x.marks.love < v0 && x.marks.love > v0 * 0.85, 'a minute fades it only a little');
  for (let k = 0; k < 30; k++) colonyTick(c, 60);
  assert.ok(x.marks.love < v0 * Math.exp(-1800 / MARK_TAU) + 1, 'half an hour fades it most of the way');
});

test('a lethal effect past the threshold degenerates and kills; a purge stops it', () => {
  const c = createColony();
  let r = c.rabbits[0];
  let res;
  for (let k = 0; k < 10 && !(res && res.degen.length); k++) { res = rabbitResponse(r, fx({ acidity: 9 }), 10, { day: 1 }); r = res.after; }
  assert.ok(r.alive);
  assert.deepEqual(r.degen, ['acid'], `acid degenerates past ${DEGEN_AT}`);
  assert.ok(res.observations.some((o) => /acid/.test(o.text)));
  const saved = JSON.parse(JSON.stringify(r));
  c.rabbits[0] = r;
  let died = null;
  for (let s = 0; s < 400 && r.alive; s++) { const rep = colonyTick(c, 1, { day: 1 }); if (rep.died.length) died = rep.died[0]; }
  assert.equal(r.alive, false, 'it runs out of control until the rabbit dies');
  assert.equal(died.cause, 'acid');
  // the same rabbit, purged in time, lives
  c.rabbits[0] = saved;
  for (let s = 0; s < 5; s++) colonyTick(c, 1, { day: 1 });
  assert.ok(purgeRabbit(saved));
  assert.deepEqual(saved.degen, []);
  assert.equal(saved.marks.acid, 0);
  for (let s = 0; s < 400; s++) colonyTick(c, 1, { day: 1 });
  assert.ok(saved.alive, 'purged, it recovers');
});

test('love or transformation past the threshold turns a rabbit feral: it attacks the colony', () => {
  const c = createColony();
  let r = c.rabbits[0];
  for (let k = 0; k < 10 && !r.degen.length; k++) r = rabbitResponse(r, fx({ love: 15 }), 10).after;
  c.rabbits[0] = r;
  assert.ok(isFeral(r));
  assert.ok(rabbitSnap(r).ag, 'the art knows it is feral');
  assert.deepEqual(decodeSnap(encodeSnap(rabbitSnap(r))).dg, ['love'], 'replays keep it');
  const victim = c.rabbits[1];
  let attacks = 0, killed = null;
  for (let s = 0; s < 300 && victim.alive; s++) {
    const rep = colonyTick(c, 1);
    attacks += rep.attacks.length;
    if (rep.died.length) killed = rep.died[0];
  }
  assert.ok(attacks >= 3, `${attacks} attacks`);
  assert.equal(victim.alive, false, 'left alone, it kills the others');
  assert.equal(killed.cause, 'mauled');
  assert.equal(killed.by, r.name);
});

test('the farm in the game: purges are bought, brewed with the still, given; rabbits can be put down', () => {
  const st = GameState.create('farm-2', { tutorial: false });
  st.coins = 100;
  const p0 = st.colony.purges;
  assert.ok(st.buyPurge().ok);
  assert.equal(st.colony.purges, p0 + 1);
  assert.equal(st.coins, 100 - PURGE_PRICE);
  assert.equal(st.brewPurge().ok, false, 'brewing needs the Purging Still');
  st.equipment.push('still');
  assert.ok(st.brewPurge().ok);
  assert.equal(st.brewPurge().ok, false, 'one at a time');
  for (let s = 0; s < PURGE_BREW_TIME; s++) st.tickColony(1);
  assert.equal(st.colony.purges, p0 + 2, 'the still made one');
  findRabbit(st.colony, 'r1').marks.fire = 50;
  assert.ok(st.purgeRabbit('r1').ok);
  assert.equal(findRabbit(st.colony, 'r1').marks.fire, 0);
  assert.equal(st.colony.purges, p0 + 1);
  assert.ok(st.cullRabbit('r2').ok);
  const b = findRabbit(st.colony, 'r2');
  assert.equal(b.alive, false);
  assert.equal(b.cause, 'culled');
  assert.ok(st.processRemains('r2').ok, 'the body can be used');
  // old saves with the Wisp Lantern get the still
  const data = JSON.parse(JSON.stringify(st.toJSON()));
  data.equipment = data.equipment.filter((id) => id !== 'still').concat('lantern');
  const back = GameState.fromJSON(data);
  assert.ok(back.has('still') && !back.has('lantern'));
});

test('vitality heals what is missing, then raises the maximum', () => {
  const c = createColony();
  let r = c.rabbits[0];
  r.health = 50;
  r = rabbitResponse(r, fx({ vitality: 20 }), 10).after;
  assert.ok(r.health > 60 && (r.bonus || 0) === 0, 'healed, no growth');
  r.health = maxHealthOf(r);
  const m0 = maxHealthOf(r);
  r = rabbitResponse(r, fx({ vitality: 20 }), 10).after;
  assert.ok(maxHealthOf(r) > m0, `max ${maxHealthOf(r)} > ${m0}`);
  assert.equal(r.health, maxHealthOf(r), 'at its new maximum');
});
