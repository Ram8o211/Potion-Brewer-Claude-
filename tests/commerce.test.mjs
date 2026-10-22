// Identification labels, bargaining and the customer's verdict the next day.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/game/state.js';
import { EFFECT_INDEX, NE } from '../src/alchemy/effects.js';
import { draftLabel, labelTrust, unprovenWanted, openNegotiation, proposePrice, acceptOffer, recordSale, resolveFollowUp, relevantEffects, editClaim, applyTrials } from '../src/game/commerce.js';
import { purityRequirement } from '../src/game/commissions.js';

/** A measurement with the given effects (everything else a plain potion). */
function meas(fx, ml = 100) {
  const effects = new Array(NE).fill(0);
  for (const [k, v] of Object.entries(fx)) effects[EFFECT_INDEX[k]] = v;
  return { effects, ml, color: [120, 60, 60], lab: [40, 20, 10], temperature: 20, viscosity: 1, density: 1, stability: 1, volatility: 0, charge: 0, composition: {} };
}

function order(persona, extra = {}) {
  return {
    id: 'com-' + JSON.stringify(persona), tier: 1, budget: 60, bottleMl: 100, potionName: 'Healing Draught', effectOrder: true,
    customer: { name: 'Ada Brook', title: 'Healer', archetype: 'healer', portrait: {}, persona },
    requirements: [
      { key: 'vitality', kind: 'min', target: 10, tol: 0, zero: 6, label: 'at least 10%', effect: true },
      purityRequirement(['vitality']),
    ],
    ...extra,
  };
}

const easy = { haggle: 0.2, patience: 3, honesty: 1, proof: 0.3 };
const strict = { haggle: 0.7, patience: 2, honesty: 1, proof: 0.95 };

test('a label never discloses untested truth: unknown without theory, estimates marked as such', () => {
  const bare = draftLabel({ cert: {} }, null, 3);
  for (const c of Object.values(bare.claims)) assert.equal(c.kind, 'unknown');
  const theory = new Array(NE).fill(0);
  theory[EFFECT_INDEX.vitality] = 14;
  const est = draftLabel({ cert: {} }, theory, 3);
  assert.equal(est.claims.vitality.source, 'estimate');
  assert.ok(est.claims.vitality.spread > 0, 'estimates carry their uncertainty');
  const tested = draftLabel({ cert: { vitality: 12.34, fire: 0.4 }, certRecords: { vitality: 't1', fire: 't1' } }, theory, 3);
  assert.deepEqual(tested.claims.vitality, { kind: 'value', value: 12.3, source: 'trial', record: 't1', measured: 12.3 });
  assert.equal(tested.claims.fire.kind, 'none');
  assert.equal(tested.claims.fire.source, 'trial');
});

test('trust grows with trial evidence; a demanding customer insists on proof', () => {
  const com = order(strict);
  const theory = new Array(NE).fill(0);
  theory[EFFECT_INDEX.vitality] = 14;
  const guess = draftLabel({ cert: {} }, theory, 1);
  const allKeys = relevantEffects(com);
  assert.equal(allKeys.length, NE, 'with a purity rule, every channel matters');
  const proven = draftLabel({ cert: Object.fromEntries(allKeys.map((k) => [k, k === 'vitality' ? 14 : 0])), certRecords: Object.fromEntries(allKeys.map((k) => [k, 't'])) }, theory, 1);
  assert.ok(labelTrust(com, proven, 1) > labelTrust(com, guess, 1) + 0.2);
  assert.deepEqual(unprovenWanted(com, guess), ['vitality']);
  assert.deepEqual(unprovenWanted(com, proven), []);
  assert.deepEqual(unprovenWanted(order(easy), guess), [], 'an easy-going customer buys on theory');
});

test('bargaining: several rounds, concessions toward a hidden limit, walking out when pushed too far', () => {
  const vial = { id: 'v1', ml: 100, m: meas({ vitality: 14 }) };
  const label = draftLabel({ cert: { vitality: 14 }, certRecords: { vitality: 't' } }, new Array(NE).fill(0), 1);
  const com = order({ haggle: 0.5, patience: 3, honesty: 1, proof: 0.5 });
  const n = openNegotiation(com, vial, label, 1);
  assert.equal(n.state, 'open');
  assert.ok(n.offer < n.reservation, 'they open below what they would pay');
  const o0 = n.offer;
  proposePrice(n, com, n.reservation * 1.2);
  assert.equal(n.state, 'open');
  assert.ok(n.offer > o0, 'a counter-offer concedes');
  proposePrice(n, com, n.reservation * 0.8);
  assert.equal(n.state, 'deal');
  assert.ok(n.price > o0, 'haggling paid off');
  // greed
  const g = openNegotiation(com, vial, label, 1);
  for (let k = 0; k < 4 && g.state === 'open'; k++) proposePrice(g, com, g.reservation * 3);
  assert.equal(g.state, 'left');
  // accepting the first offer always works
  const a = openNegotiation(com, vial, label, 1);
  acceptOffer(a);
  assert.equal(a.state, 'deal');
  assert.equal(a.price, a.offer);
  // a poor fit is worth less
  const weak = openNegotiation(com, { id: 'v2', ml: 100, m: meas({ vitality: 3 }) }, draftLabel({ cert: { vitality: 3 } }, null, 1), 1);
  assert.ok(weak.reservation < n.reservation * 0.6);
});

test('the verdict follows the real potion: praise, a lie found out, a harmful side effect', () => {
  const st = GameState.create('commerce-1', { tutorial: false });
  const com = order(easy);
  const honest = draftLabel({ cert: { vitality: 14 }, certRecords: { vitality: 't' } }, new Array(NE).fill(0), 1);
  const good = recordSale(st, com, { id: 'a', ml: 100 }, honest, 50, meas({ vitality: 14 }));
  assert.equal(good.follow.kind, 'praise');
  assert.equal(good.follow.day, st.day + 1, 'they come back the next day');
  // claimed 14 %, really 4 %
  const lie = recordSale(st, com, { id: 'b', ml: 100 }, honest, 50, meas({ vitality: 4 }));
  assert.equal(lie.follow.kind, 'complaint');
  assert.ok(lie.follow.legit);
  assert.ok(lie.follow.cites.includes('vitality'));
  // claimed "no toxicity", but it is poisonous
  const toxic = recordSale(st, com, { id: 'c', ml: 100 }, honest, 50, meas({ vitality: 14, toxicity: 6 }));
  assert.equal(toxic.follow.kind, 'complaint');
  assert.ok(toxic.follow.harmful);
  assert.equal(toxic.follow.demand, 50, 'harm earns a full refund');
});

test('dishonest complaints happen, and trial records of the batch win the dispute', () => {
  const st = GameState.create('commerce-2', { tutorial: false });
  const com = order({ haggle: 0.5, patience: 3, honesty: 0, proof: 0.5 });
  const label = draftLabel({ cert: { vitality: 14 }, certRecords: { vitality: 't9' } }, new Array(NE).fill(0), 1);
  const r = recordSale(st, com, { id: 'd', ml: 100 }, label, 50, meas({ vitality: 14 }));
  assert.equal(r.follow.kind, 'complaint');
  assert.equal(r.follow.legit, false, 'a perfect potion, a dishonest customer');
  st.sales.unshift(r.sale);
  if (r.follow.cites.includes('vitality') || r.follow.cites.includes('quality')) {
    const out = resolveFollowUp(st, r.follow, 'dispute');
    assert.equal(out.coins, 0);
    assert.ok(out.rep > 0, 'the evidence holds up');
  }
  // disputing a fair complaint backfires
  const lie = recordSale(st, order(easy), { id: 'e', ml: 100 }, label, 50, meas({ vitality: 3 }));
  st.sales.unshift(lie.sale);
  const bad = resolveFollowUp(st, lie.follow, 'dispute');
  assert.ok(bad.coins < 0 && bad.rep < 0);
});

test('sales and follow-ups persist; the counter settles them by day', () => {
  const st = GameState.create('commerce-3', { tutorial: false });
  st.current = /** @type {any} */ (order(easy));
  const label = draftLabel({ cert: { vitality: 14 }, certRecords: { vitality: 't' } }, new Array(NE).fill(0), st.day);
  const earned0 = st.stats.earned;
  const { follow } = st.completeDeal({ id: 'x', ml: 100, batchId: 'b', rev: 0 }, label, 42, meas({ vitality: 14 }), 30);
  assert.equal(st.stats.earned - earned0, 42, 'the agreed price is paid');
  assert.equal(st.history[0].paid, 42);
  assert.equal(st.dueFollowUps().length, 0, 'nobody is back yet');
  const loaded = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.equal(loaded.sales.length, 1);
  assert.equal(loaded.followUps[0].id, follow.id);
  loaded.current = null;
  loaded.endDay();
  const due = loaded.dueFollowUps();
  assert.equal(due.length, follow.kind === 'quiet' ? 0 : 1, 'they are back the next day');
  if (due.length) {
    const r = loaded.settleFollowUp(due[0].id, due[0].kind === 'praise' ? 'thank' : 'refund');
    assert.ok(r);
    assert.equal(loaded.dueFollowUps().length, 0);
    assert.ok(loaded.sales[0].outcome, 'the ledger records how it ended');
  }
});

test('editing a claim: a player value keeps the reading, and stepping back to it is a tested claim again', () => {
  const label = draftLabel({ cert: { vitality: 12.34 }, certRecords: { vitality: 't1' } }, new Array(NE).fill(0), 1);
  const t = label.claims.vitality;
  const up = editClaim(t, 'vitality', 'up');
  assert.equal(up.source, 'player');
  assert.equal(up.value, 13.3);
  assert.equal(up.measured, 12.3, 'the reading is not forgotten');
  assert.deepEqual(editClaim(up, 'vitality', 'down'), t, 'back where it was measured: tested again');
  assert.deepEqual(editClaim(editClaim(t, 'vitality', 'unknown'), 'vitality', 'tested'), t, 'the ✓ restores the reading');
  // a new trial does not overwrite what the player wrote, but the label learns the reading
  applyTrials(label, { vitality: 12.34 }, 't1');
  label.claims.vitality = up;
  applyTrials(label, { vitality: 9 }, 't2');
  assert.equal(label.claims.vitality.value, 13.3);
  assert.equal(label.claims.vitality.measured, 9);
  assert.equal(label.claims.vitality.record, 't2');
  // a player claim that agrees with the reading becomes the tested claim
  label.claims.vitality = { kind: 'value', value: 9, source: 'player' };
  applyTrials(label, { vitality: 9 }, 't3');
  assert.equal(label.claims.vitality.source, 'trial');
});

test('a harmful potion is never praised, and evidence lists each trial once', () => {
  const st = GameState.create('commerce-4', { tutorial: false });
  const com = order({ haggle: 0.2, patience: 3, honesty: 1, proof: 0.3 });
  // a label that admits "unknown" for everything but the healing
  const label = draftLabel({ cert: { vitality: 14, love: 0 }, certRecords: { vitality: 't7', love: 't7' } }, null, 1);
  const { follow, sale, ev } = recordSale(st, com, { id: 'h', ml: 100 }, label, 50, meas({ vitality: 14, toxicity: 3.5 }));
  assert.ok(ev.quality < 0.85 || follow.kind === 'complaint');
  assert.notEqual(follow.kind, 'praise', 'poison is not praised, whatever the label said');
  assert.deepEqual(sale.evidence, ['t7'], 'one trial backs two claims: one piece of evidence');
});

test('the verdict waits for the customer: quality, stars and perfection are counted when they report back', () => {
  const st = GameState.create('commerce-5', { tutorial: false });
  st.current = /** @type {any} */ (order(easy));
  const label = draftLabel({ cert: { vitality: 14 }, certRecords: { vitality: 't' } }, new Array(NE).fill(0), st.day);
  const best0 = st.stats.bestQuality, perfect0 = st.stats.perfect;
  const { follow, sale } = st.completeDeal({ id: 'p', ml: 100, batchId: 'b', rev: 0 }, label, 40, meas({ vitality: 14 }), 30);
  assert.equal(st.history[0].quality, null, 'not known at the counter');
  assert.equal(st.history[0].stars, null);
  assert.equal(st.stats.bestQuality, best0);
  assert.equal(st.stats.perfect, perfect0);
  st.current = null;
  st.endDay();
  const due = st.dueFollowUps().find((f) => f.id === follow.id);
  st.settleFollowUp(follow.id, due && due.kind === 'praise' ? 'thank' : 'dismiss');
  assert.equal(st.history[0].quality, sale.quality, 'the verdict is in');
  assert.ok(st.stats.bestQuality >= sale.quality);
  if (sale.perfect) assert.equal(st.stats.perfect, perfect0 + 1);
});

test('a refund is paid in full or not at all; a lost dispute costs more name when the shop is broke', () => {
  const st = GameState.create('commerce-6', { tutorial: false });
  st.current = /** @type {any} */ (order(easy));
  const label = draftLabel({ cert: { vitality: 14 }, certRecords: { vitality: 't' } }, new Array(NE).fill(0), st.day);
  // the label lied: a fair complaint for most of the price
  const { follow } = st.completeDeal({ id: 'q', ml: 100, batchId: 'b', rev: 0 }, label, 50, meas({ vitality: 3 }), 30);
  assert.equal(follow.kind, 'complaint');
  assert.ok(follow.legit);
  st.coins = follow.demand - 1;
  const coins0 = st.coins;
  const r = st.settleFollowUp(follow.id, 'refund');
  assert.ok(r && r.refused, 'refused');
  assert.equal(st.coins, coins0, 'no coins taken');
  assert.equal(st.followUps.find((f) => f.id === follow.id).resolved, false, 'the customer is still waiting');
  // disputing a fair complaint while broke: pay what there is, lose more name
  const rich = resolveFollowUp({ ...st, coins: 1000 }, follow, 'dispute');
  const broke = resolveFollowUp({ ...st, coins: 0 }, follow, 'dispute');
  assert.equal(rich.coins, -follow.demand);
  assert.equal(broke.coins, 0);
  assert.ok(broke.rep < rich.rep, 'the unpaid share costs reputation');
  // reputation can go below zero, to a floor
  st.reputation = 0;
  st.adjustReputation(-20);
  assert.equal(st.reputation, -20);
  st.adjustReputation(-500);
  assert.equal(st.reputation, -100);
});
