// The rabbit farm: readings that differ from rabbit to rabbit, estimates
// that narrow with every trial (fastest over different rabbits), effects
// piling up until they pass each rabbit's own hidden threshold and run away
// to death, aggression from the effects themselves (its own threshold),
// love that makes a rabbit mate faster and faster, purging draughts,
// culling, and vitality raising a healthy rabbit's maximum health.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState, PURGE_PRICE, PURGE_BREW_TIME } from '../src/game/state.js';
import { NE, EFFECT_INDEX } from '../src/alchemy/effects.js';
import { certification, rabbitReading, summarize } from '../src/game/experiments.js';
import {
  createColony, findRabbit, rabbitResponse, colonyTick, purgeRabbit, maxHealthOf, rabbitSensitivity, isFeral, rabbitSnap, encodeSnap, decodeSnap,
  degenAt, degenRate, aggroAt, mateEvery, burnRate, MARK_TAU, RABBIT_MARKS, AGGRO, LOVE_MATE,
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

test('the batch estimate is the plain mean and standard deviation of the trials; one trial is flagged', () => {
  const st = GameState.create('farm-1', { tutorial: false });
  st.batch = { id: 'farm-1', rev: 0 }; // fixed: the readings are the same every run
  st.coins = 500;
  st.equipment.push('kennel');
  for (let k = 0; k < 4; k++) st.buyRabbit();
  assert.equal(st.colony.rabbits.length, 6);
  const truth = fx({ vitality: 14 });
  const { record } = st.recordTrial('rabbit', dose({ vitality: 14 }), ctx(st, { rabbitId: 'r1' }));
  const one = certification(st.trials, st.batch, truth);
  assert.equal(one.values.vitality, record.values.vitality, 'after one trial: exactly that reading');
  assert.equal(one.spread.vitality, 0, 'with no deviation');
  assert.equal(one.first.vitality, true, 'flagged as a first measure');
  for (const r of st.colony.rabbits.slice(1)) st.recordTrial('rabbit', dose({ vitality: 14 }), ctx(st, { rabbitId: r.id }));
  const many = certification(st.trials, st.batch, truth);
  assert.equal(many.rabbits.vitality, 6);
  assert.equal(many.n.vitality, 6);
  assert.equal(many.first.vitality, false);
  const vs = st.trials.records.filter((r) => r.batchId === 'farm-1').map((r) => r.values.vitality);
  const mean = vs.reduce((a, v) => a + v, 0) / vs.length;
  const sd = Math.sqrt(vs.reduce((a, v) => a + (v - mean) ** 2, 0) / (vs.length - 1));
  assert.equal(many.values.vitality, Math.round(mean * 10) / 10, 'the mean of the readings');
  assert.equal(many.spread.vitality, Math.round(sd * 10) / 10, 'their sample standard deviation');
  assert.ok(Math.abs(many.values.vitality - 14) < 6, `mean ${many.values.vitality} is near the truth`);
  const s = summarize({ fire: [{ v: 10, r: 'a', rec: 't1' }, { v: 12, r: 'b', rec: 't2' }] });
  assert.equal(s.values.fire, 11);
  assert.equal(s.spread.fire, Math.round(Math.SQRT2 * 10) / 10, 'sd of 10 and 12 is √2');
  assert.equal(s.first.fire, false);
  assert.equal(s.records.fire, 't2');
  const f = summarize({ fire: [{ v: 37.4, r: 'a', rec: 't1' }] });
  assert.deepEqual([f.values.fire, f.spread.fire, f.first.fire], [37.4, 0, true]);
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

test('fire and acid burn slowly for as long as they are active, harder the higher they are', () => {
  assert.ok(burnRate(0) === 0 && burnRate(10) > 0 && burnRate(60) > 2 * burnRate(30));
  const lost = (k, v) => {
    const c = createColony();
    const r = c.rabbits[0];
    r.marks[k] = v;
    for (let s = 0; s < 30; s++) { r.marks[k] = v; colonyTick(c, 1, { day: 1 }); }
    return 100 - r.health;
  };
  for (const k of ['fire', 'acid']) {
    const low = lost(k, 15), high = lost(k, 60);
    assert.ok(low > 0, `${k} at 15% hurts a little (${low.toFixed(2)})`);
    assert.ok(low < 2, `slowly (${low.toFixed(2)} in 30 s)`);
    assert.ok(high > 3 * low, `${k} at 60% hurts much faster (${high.toFixed(2)})`);
  }
  // once it has faded away, the burning stops and the rabbit heals
  const h = createColony();
  const hr = h.rabbits[0];
  hr.marks.acid = 20;
  for (let s = 0; s < 4000; s++) colonyTick(h, 1, { day: 1 });
  assert.equal(hr.marks.acid, 0, 'a mark fades all the way');
  assert.ok(hr.health >= maxHealthOf(hr) - 0.01, 'and it heals back');
  // left to fade on its own, a strong burn still does real harm, and can kill a weak rabbit
  const c = createColony();
  const r = c.rabbits[0];
  r.marks.fire = 60; r.health = 20;
  let died = null;
  for (let s = 0; s < 1200 && r.alive; s++) { const rep = colonyTick(c, 1, { day: 1 }); if (rep.died.length) died = rep.died[0]; }
  assert.equal(r.alive, false);
  assert.equal(died.cause, 'fire');
});

test('every rabbit has its own hidden threshold for every channel; aggression has separate ones', () => {
  const c = createColony();
  const [a, b] = c.rabbits;
  const ta = RABBIT_MARKS.map((k) => degenAt(a, k));
  assert.ok(ta.every((t) => t >= 42 && t <= 95));
  assert.ok(new Set(ta).size > 3, `independent per channel: ${ta}`);
  assert.notDeepEqual(ta, RABBIT_MARKS.map((k) => degenAt(b, k)), 'and per rabbit');
  assert.equal(degenAt(a, 'fire'), degenAt(a, 'fire'), 'lifelong');
  assert.ok(RABBIT_MARKS.some((k) => degenRate(a, k) !== degenRate(a, RABBIT_MARKS[0])), 'it runs away at its own pace');
  assert.ok(AGGRO.some((k) => aggroAt(a, k) !== degenAt(a, k)), 'aggression is not the degeneration threshold');
  assert.equal(aggroAt(a, 'love'), Infinity, 'love never makes a rabbit aggressive');
  assert.equal(aggroAt(a, 'fire'), Infinity, 'nor does fire');
});

test('past its own threshold an effect climbs on its own until the rabbit dies; a purge stops it', () => {
  const c = createColony();
  const i = degenAt(c.rabbits[0], 'acid') < degenAt(c.rabbits[1], 'acid') ? 0 : 1; // the one with room to watch it climb
  let r = c.rabbits[i];
  let res;
  for (let k = 0; k < 12 && !(res && res.degen.length); k++) { res = rabbitResponse(r, fx({ acidity: 9 }), 10, { day: 1 }); r = res.after; }
  assert.ok(r.alive);
  assert.deepEqual(r.degen, ['acid'], `acid degenerates past ${degenAt(r, 'acid')}`);
  assert.ok(r.marks.acid >= degenAt(r, 'acid'));
  assert.ok(res.observations.some((o) => /acid/.test(o.text)));
  const saved = JSON.parse(JSON.stringify(r));
  c.rabbits[i] = r;
  let died = null;
  for (let s = 0; s < 1500 && r.alive; s++) { const rep = colonyTick(c, 1, { day: 1 }); if (rep.died.length) died = rep.died[0]; }
  assert.equal(r.alive, false, 'it runs out of control until the rabbit dies');
  assert.equal(died.cause, 'acid');
  // the same rabbit, purged in time, lives
  c.rabbits[i] = saved;
  for (let s = 0; s < 5; s++) colonyTick(c, 1, { day: 1 });
  assert.ok(purgeRabbit(saved));
  assert.deepEqual(saved.degen, []);
  assert.equal(saved.marks.acid, 0);
  for (let s = 0; s < 400; s++) colonyTick(c, 1, { day: 1 });
  assert.ok(saved.alive, 'purged, it recovers');
});

test('a harmless effect that degenerates also climbs until it kills: a mark at the top is always death', () => {
  const c = createColony();
  const r = c.rabbits[0];
  r.marks.vitality = degenAt(r, 'vitality') + 1;
  r.degen = ['vitality'];
  let died = null;
  for (let s = 0; s < 1500 && r.alive; s++) { const rep = colonyTick(c, 1, { day: 1 }); if (rep.died.length) died = rep.died.find((d) => d.id === r.id) || died; }
  assert.equal(r.alive, false);
  assert.equal(died.cause, 'growth');
  // a dose that drives a mark to the top kills at once
  const x = createColony().rabbits[1];
  const out = rabbitResponse(x, fx({ strength: 100 }), 25, { day: 1 });
  assert.equal(out.after.alive, false);
  assert.equal(out.cause, 'strain');
});

test('aggression comes from the effect itself, past its own threshold — degenerating or not', () => {
  const c = createColony();
  const r = c.rabbits[0];
  const at = aggroAt(r, 'strength');
  r.marks.strength = at - 3;
  assert.ok(!isFeral(r), 'below its aggression threshold it is calm');
  r.marks.strength = at + 1;
  assert.deepEqual(r.degen, [], 'not degenerating');
  assert.equal(isFeral(r), r.marks.strength >= at);
  assert.ok(isFeral(r), 'past it, it is aggressive');
  assert.ok(rabbitSnap(r).ag, 'the art knows it is aggressive');
  assert.equal(decodeSnap(encodeSnap(rabbitSnap(r))).ag, true, 'replays keep it');
  // a rabbit degenerating on fire is not aggressive
  const f = c.rabbits[1];
  f.marks.fire = 99; f.degen = ['fire'];
  assert.ok(!isFeral(f));
  assert.equal(decodeSnap(encodeSnap(rabbitSnap(f))).ag, false);
  assert.deepEqual(decodeSnap(encodeSnap(rabbitSnap(f))).dg, ['fire']);
  f.marks.fire = 0; f.degen = [];
  // old replays: a degenerating feral channel meant feral
  assert.equal(decodeSnap('a010|00000000000|00000|||love').ag, true);
  const victim = c.rabbits[1];
  r.marks.strength = 100; // held there: the test stops it fading
  let attacks = 0, killed = null;
  for (let s = 0; s < 300 && victim.alive; s++) {
    r.marks.strength = Math.max(r.marks.strength, at + 20);
    const rep = colonyTick(c, 1);
    attacks += rep.attacks.length;
    if (rep.died.length) killed = rep.died[0];
  }
  assert.ok(attacks >= 3, `${attacks} attacks`);
  assert.equal(victim.alive, false, 'left alone, it kills the others');
  assert.equal(killed.cause, 'mauled');
  assert.equal(killed.by, r.name);
});

test('love makes a rabbit mate with the others, faster and faster, until too much of it kills', () => {
  assert.ok(mateEvery(LOVE_MATE - 1) === Infinity);
  assert.ok(mateEvery(90) < mateEvery(50) && mateEvery(50) < mateEvery(LOVE_MATE));
  // moderate love: it mates, a doe may conceive, and it survives
  const c = createColony();
  const [doe, buck] = c.rabbits;
  doe.marks.love = 45;
  let mates = 0, conceived = false;
  for (let s = 0; s < 240; s++) { const rep = colonyTick(c, 1, { day: 1, cap: 6 }); mates += rep.mates.length; conceived ||= rep.mates.some((m) => m.conceived); }
  assert.ok(mates >= 3, `${mates} matings`);
  assert.ok(doe.alive && buck.alive, 'a little love does no lasting harm');
  assert.ok(conceived && doe.pregnant, 'and kits are on the way');
  assert.ok(isFeral(doe) === false, 'love never makes it aggressive');
  // love run out of control: faster and faster until it dies
  const c2 = createColony();
  const r = c2.rabbits[0];
  r.marks.love = degenAt(r, 'love') + 1;
  r.degen = ['love'];
  let died = null;
  const times = [];
  for (let s = 0; s < 1500 && r.alive; s++) {
    const rep = colonyTick(c2, 1, { day: 1 });
    if (rep.mates.some((m) => m.from === r.id)) times.push(s);
    if (rep.died.length) died = rep.died.find((d) => d.id === r.id) || died;
  }
  assert.equal(r.alive, false);
  assert.equal(died.cause, 'love', 'worn out by love');
  const gap = (i) => times[i + 1] - times[i];
  assert.ok(times.length >= 4 && gap(times.length - 2) <= gap(0), `matings come faster: ${times.join(',')}`);
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
