// Shop rules: requests for magic (achievable, brewed in the real simulation),
// haggling, certification, complaints, refunds and bluffs, progression,
// saves and migration.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameState, SAVE_VERSION, migrate } from '../src/game/state.js';
import { generateWorld, makeLookup } from '../src/materials/generator.js';
import { generateCommission, meets, failures } from '../src/game/commissions.js';
import { capabilities, EQUIPMENT } from '../src/game/equipment.js';
import { Simulation } from '../src/simulation/world.js';
import { applySnapshot } from '../src/simulation/snapshot.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { startHaggle, ask, acceptOffer } from '../src/game/haggle.js';
import { archetypeOf } from '../src/game/customers.js';
import { parseImport } from '../src/game/persistence.js';
import { Rng } from '../src/core/rng.js';
import { PROP_KEYS, PROP_INDEX, NP } from '../src/alchemy/magic.js';

/** A vial whose (hidden) truth is `magic`, labelled with `label`. */
function vialOf(magic, label = magic, ml = 150) {
  return {
    id: 'v', ml, m: { magic: magic.slice(), color: [0.5, 0.6, 0.4], composition: {}, temperature: 20, vig: 1, ss: 0, steep: 20 },
    label: { values: Object.fromEntries(PROP_KEYS.map((k, i) => [k, Math.round(label[i])])) }, certified: null,
  };
}
/** A magic vector in the middle of every range of a request. */
function centre(com) {
  const v = new Array(NP).fill(0);
  for (const r of com.requirements) v[PROP_INDEX[r.key]] = r.kind === 'limit' ? 0 : r.max >= 100 ? r.min + 10 : (r.min + r.max) / 2;
  return v;
}
/** Haggle to a deal at the customer's best price. */
function sellAtBest(st) {
  const h = st.beginHaggle();
  ask(h, h.max);
  if (h.state !== 'deal') acceptOffer(h);
  return st.completeSale();
}

test('worlds are deterministic per seed; requests only ask for magic, never chemistry', () => {
  const a = GameState.create('det-1'), b = GameState.create('det-1'), c = GameState.create('det-2');
  assert.deepEqual(a.world, b.world);
  assert.notDeepEqual(a.world.materials.map((m) => m.name), c.world.materials.map((m) => m.name));
  const st = GameState.create('reqs-1', { tutorial: false });
  for (let k = 0; k < 6; k++) {
    const com = generateCommission(st.commissionContext(), new Rng('r' + k), { tier: k % 3 });
    assert.ok(com, 'a request');
    for (const r of com.requirements) {
      assert.ok(PROP_KEYS.includes(r.key), `only magical properties (${r.key})`);
      assert.ok(r.min >= 0 && r.max <= 100 && r.min < r.max);
    }
    assert.ok(com.dialogue.length > 10 && com.potionName, 'a problem to solve');
    // only what the starting garden grows
    const avail = st.availableSet();
    for (const i of com.reference.ingredients) assert.ok(avail.has(i.id), `${i.id} grows in the starting garden`);
  }
});

test('requests are achievable: their hidden plans, brewed in the real simulation, land inside every range', () => {
  const failed = [];
  for (let k = 0; k < 14; k++) {
    const world = generateWorld('ach-' + k);
    const lookup = makeLookup(world);
    const cap = capabilities(EQUIPMENT.map((e) => e.id));
    cap.size = 'pot';
    const ctx = { world, lookup, available: new Set(world.ingredients), cap, rank: 4 };
    const com = generateCommission(ctx, new Rng('c' + k), { tier: k % 5, super: k % 3 === 2 });
    assert.ok(com, `request ${k}`);
    const sim = new Simulation({ size: 'pot', lookup });
    Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
    runPlanHeadless(sim, com.reference, lookup);
    const m = measureParticles(sim, tapSelection(sim, com.bottleN));
    if (!meets(com, m.magic)) failed.push(`${k} ${com.super ? 'super ' : ''}${JSON.stringify(failures(com, m.magic))} got ${m.magic.map(Math.round)}`);
  }
  assert.deepEqual(failed, []);
});

test('haggling: a low opening offer, counter-offers, lost patience, a final offer, a walk-out on insult', () => {
  const arch = archetypeOf('farmer');
  const h = startHaggle({ value: 50 }, arch);
  assert.ok(h.opening < h.max && h.opening >= h.max * 0.4);
  const r1 = ask(h, h.max);
  assert.equal(r1.result, 'counter');
  assert.ok(r1.offer > h.opening && r1.offer <= h.max, 'they come up part of the way');
  // asking the same keeps narrowing the gap until they shake on it or run out of patience
  let r = r1;
  while (r.result === 'counter') r = ask(h, h.max);
  assert.ok(r.result === 'deal' || r.result === 'final');
  if (r.result === 'final') { const d = acceptOffer(h); assert.equal(d.result, 'deal'); assert.ok(d.price <= h.max); }
  else assert.ok(r.price <= h.max);
  // too much costs patience faster; an insult ends it
  const g = startHaggle({ value: 50 }, arch);
  const p0 = g.patience;
  ask(g, g.max * 1.5);
  assert.equal(g.patience, p0 - 2);
  const w = startHaggle({ value: 50 }, arch);
  assert.equal(ask(w, w.max * 2.5).result, 'walked');
  // a certificate makes the potion worth more to them
  assert.ok(startHaggle({ value: 50 }, arch, { certified: true }).max > startHaggle({ value: 50 }, arch).max);
  // a short bottle is worth less
  assert.ok(startHaggle({ value: 50 }, arch, { short: 0.5 }).max < startHaggle({ value: 50 }, arch).max);
});

test('a customer only haggles over a label that promises what they need', () => {
  const st = GameState.create('label-1', { tutorial: false });
  const com = st.nextCustomer();
  const good = centre(com);
  st.vial = vialOf(good);
  assert.ok(st.labelMatches());
  const want = com.requirements.find((r) => r.kind !== 'limit');
  const weak = good.slice(); weak[PROP_INDEX[want.key]] = 0;
  st.vial = vialOf(good, weak);
  assert.equal(st.labelMatches(), false);
  st.vial.label = { values: { vitality: 30 } };
  assert.equal(st.labelMatches(), false, 'an incomplete ID promises nothing');
});

test('a potion that fails its buyer comes back: the refund cannot be avoided and costs reputation', () => {
  const st = GameState.create('refund-1', { tutorial: false });
  const com = st.nextCustomer();
  const truth = centre(com);
  const want = com.requirements.find((r) => r.kind !== 'limit');
  truth[PROP_INDEX[want.key]] = Math.max(0, want.min - 10);
  st.vial = vialOf(truth, centre(com)); // labelled as if it worked
  const { sale } = sellAtBest(st);
  assert.ok(sale && sale.complaint && sale.complaint.kind === 'genuine' && sale.complaint.key === want.key && sale.complaint.how === 'weak');
  const coins = st.coins, rep = st.reputation;
  // they come back after a few more visits
  let visitor = null;
  for (let k = 0; k < 6 && !visitor; k++) {
    const c = st.nextCustomer();
    if (c && c.type === 'complaint') visitor = c;
    else if (c) st.declineCustomer();
    else st.endDay();
  }
  assert.ok(visitor, 'the customer came back');
  assert.equal(st.resolveComplaint('certificate').ok, false, 'there is no certificate to show');
  const r = st.resolveComplaint('refund');
  assert.ok(r.ok && r.amount === sale.price);
  assert.equal(st.coins, Math.round((coins - sale.price) * 10) / 10);
  assert.ok(st.reputation < rep);
  assert.equal(sale.resolved, 'refunded');
});

test('bluffers: without a certificate they get their refund; with one they are caught', () => {
  const find = (certify) => {
    for (let s = 0; s < 400; s++) {
      const st = GameState.create('bluff-' + s, { tutorial: false });
      st.reputation = 200; // nobles and witches (the keenest bluffers) visit
      const com = st.nextCustomer();
      st.vial = vialOf(centre(com));
      st.coins = 500;
      if (certify) st.certifyVial();
      const { sale } = sellAtBest(st);
      if (sale.complaint && sale.complaint.kind === 'bluff') return { st, sale };
    }
    return null;
  };
  const a = find(false);
  assert.ok(a, 'some customer bluffs');
  assert.equal(a.sale.certified, null);
  let c = null;
  for (let k = 0; k < 8 && !(c && c.type === 'complaint'); k++) { c = a.st.nextCustomer(); if (c && c.type !== 'complaint') { a.st.declineCustomer(); c = null; } else if (!c) a.st.endDay(); }
  const r = a.st.resolveComplaint('refund');
  assert.ok(r.ok && r.amount === a.sale.price, 'no proof: refunded');
  const b = find(true);
  assert.ok(b && b.sale.certified);
  c = null;
  for (let k = 0; k < 8 && !(c && c.type === 'complaint'); k++) { c = b.st.nextCustomer(); if (c && c.type !== 'complaint') { b.st.declineCustomer(); c = null; } else if (!c) b.st.endDay(); }
  const coins = b.st.coins;
  const r2 = b.st.resolveComplaint('certificate');
  assert.ok(r2.ok && r2.outcome === 'caught');
  assert.equal(b.st.coins, coins + (r2.events.length ? r2.events.reduce((s, e) => s + e.reward, 0) : 0), 'no refund');
  assert.equal(b.sale.resolved, 'caught');
});

test('certification costs a lot, replaces the label with the truth and rewards a sharp eye', () => {
  const st = GameState.create('cert-1', { tutorial: false });
  st.nextCustomer();
  const truth = [31.2, 0, 0, 4.1, 7.7, 0.4];
  st.vial = vialOf(truth, [30, 0, 0, 5, 9, 0]);
  const fee = st.certifyFee;
  assert.ok(fee >= 30, `a lot of money (${fee})`);
  st.coins = fee - 1;
  assert.equal(st.certifyVial().ok, false);
  st.coins = fee + 100;
  const r = st.certifyVial();
  assert.ok(r.ok);
  assert.ok(r.events.some((e) => e.id === 'sharp_eye'), 'the estimate was within 6 of the truth');
  assert.equal(st.vial.label.values.vitality, 31);
  assert.equal(st.vial.certified.charm, 8);
  assert.equal(st.writeId('vial', { vitality: 90 }), false, 'a certified label cannot be rewritten');
  st.equipment.push('charter');
  assert.ok(st.certifyFee < fee, 'the guild charter makes it cheaper');
});

test('progress: sales raise reputation and rank; a broke alchemist gets a stipend', () => {
  const st = GameState.create('rank-1', { tutorial: false });
  const events = [];
  for (let k = 0; k < 120 && st.rank < 2; k++) {
    let com = st.nextCustomer();
    if (!com) { st.endDay(); com = st.nextCustomer(); }
    if (!com || com.type !== 'order') { if (com) st.resolveComplaint('refund'); continue; }
    st.vial = vialOf(centre(com));
    events.push(...sellAtBest(st).events);
  }
  assert.ok(st.rank >= 2, `rank ${st.rank}`);
  assert.ok(events.some((e) => e.type === 'rank'));
  assert.ok(events.some((e) => e.id === 'first_sale'));
  st.coins = 2;
  assert.ok(st.claimRelief() > 0);
  assert.equal(st.claimRelief(), 0, 'once a day');
});

test('save → JSON → load round-trips the whole shop', () => {
  const st = GameState.create('save-1', { tutorial: false });
  st.coins = 123.4; st.reputation = 17; st.day = 4;
  st.harvest('dew-a'); st.plant('glacite-a');
  st.writeId('batch', { vitality: 20, ardor: 0, frost: 0, levity: 0, charm: 5, bane: 0 });
  const com = st.nextCustomer();
  st.vial = vialOf(centre(com));
  sellAtBest(st);
  st.addRecipe({ name: 'Test', ingredients: [] });
  const back = parseImport(JSON.stringify(st.toJSON()));
  assert.equal(back.coins, st.coins);
  assert.equal(back.day, 4);
  assert.equal(back.stock(st.world.roles.dew), st.stock(st.world.roles.dew));
  assert.deepEqual(back.garden, st.garden);
  assert.deepEqual(back.idCard, st.idCard);
  assert.equal(back.sales.length, 1);
  assert.deepEqual(back.sales[0], st.sales[0]);
  assert.equal(back.recipes.length, 1);
  assert.deepEqual(back.world.ingredients, st.world.ingredients);
});

test('a genuine save from the previous release migrates: the shop survives, the world regrows as a garden', () => {
  const raw = JSON.parse(fs.readFileSync(new URL('./fixtures/save-v3.json', import.meta.url), 'utf8'));
  assert.equal(raw.version, 3);
  const st = GameState.fromJSON(raw);
  assert.equal(st.version, SAVE_VERSION);
  assert.equal(st.coins, raw.coins);
  assert.equal(st.reputation, raw.reputation);
  assert.equal(st.day, raw.day);
  assert.ok(st.has('pestle') && st.has('kennel'), 'equipment that still exists is kept');
  assert.ok(!st.has('hydrometer') && !st.has('satchel'), 'retired instruments are dropped');
  assert.ok(st.achievements.first_sale && st.achievements.trial1);
  assert.equal(st.history.length, raw.history.length);
  assert.ok(st.lookup(st.world.roles.dew) && st.world.ingredients.length === 11, 'the new garden world');
  assert.equal(st.current, null);
  assert.equal(st.cauldron, null, 'the old brew is gone with its reagents');
  // and it plays
  const com = st.nextCustomer();
  assert.ok(com && com.type === 'order');
  const sim = new Simulation({ size: 'pot', lookup: st.lookup });
  if (st.cauldron) applySnapshot(sim, st.cauldron, { lookup: st.lookup });
  const again = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.equal(again.coins, st.coins);
  // the even older v2 save also comes through
  const v2 = GameState.fromJSON(JSON.parse(fs.readFileSync(new URL('./fixtures/save-v2.json', import.meta.url), 'utf8')));
  assert.equal(v2.version, SAVE_VERSION);
});

test('corrupted, partial and future saves are repaired or refused with a readable message, never silently reset', () => {
  const st = GameState.create('robust-1', { tutorial: false });
  const good = JSON.parse(JSON.stringify(st.toJSON()));
  const partial = { ...good, lab: { creatures: { toad: { health: 'x' } }, records: [null, 5, { creature: 'moth', levels: { levity: 3 } }] }, garden: { beds: { 'dew-a': { g: 'nan', at: 3 }, nope: {} }, well: 'x' } };
  const p = GameState.fromJSON(JSON.parse(JSON.stringify(partial)));
  assert.equal(p.lab.creatures.toad.health, 100);
  assert.equal(p.lab.records.length, 1);
  assert.equal(p.garden.beds['dew-a'].g, 0);
  assert.ok(!p.garden.beds.nope);
  assert.throws(() => GameState.fromJSON({ ...good, version: SAVE_VERSION + 1 }), /newer version/);
  assert.throws(() => GameState.fromJSON({ ...good, inventory: null }), /inventory/);
  assert.throws(() => GameState.fromJSON(null));
  assert.throws(() => parseImport('not json'), /not a valid save/);
  assert.throws(() => migrate({ version: 2 }), /seed/);
  const noWorld = { ...good, world: undefined };
  assert.equal(GameState.fromJSON(noWorld).world.seed, 'robust-1');
});
