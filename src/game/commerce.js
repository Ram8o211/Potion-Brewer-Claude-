// The commercial side of a potion: what you claim it does, what the
// customer will pay for that claim, and what happens once they drink it.
//
//   identification — before selling, the alchemist writes a label: for each
//     effect, a value measured in a trial of this very batch, an estimate
//     from the guild's theory (with its uncertainty), "none", or nothing.
//     The game never fills in hidden truths; it only offers what the
//     player's own trials and theory say.
//   negotiation — the customer weighs the label against the order (with the
//     counter's own scoring), how far they trust it (trial evidence,
//     reputation, unknowns, how much proof this customer needs), the volume
//     and their temperament, and bargains over several rounds. The agreed
//     price is what is paid.
//   delivery — the customer then drinks the real potion. A day later they
//     come back: pleased (reputation, a tip, sometimes a friend with an
//     order), or with a complaint. A complaint is legitimate when the potion
//     or its label failed them, and sometimes dishonest from a customer who
//     simply wants money back. The player refunds, disputes (trial records of
//     the batch are the evidence) or turns them away.
// All of it is plain data on the game state, so it survives saving.

import { Rng, hashString } from '../core/rng.js';
import { EFFECT_KEYS, EFFECT_INDEX, NE, EFFECT_BY_KEY } from '../alchemy/effects.js';
import { evaluatePotion, strongestUnwanted } from './evaluate.js';
import { PURITY_LIMIT } from './requests.js';

/**
 * A claim about one effect.
 * @typedef {Object} Claim
 * @property {'value'|'none'|'unknown'} kind
 * @property {number} [value]      claimed concentration (percent; acidity signed)
 * @property {'trial'|'estimate'|'player'} source
 * @property {number} [spread]     uncertainty of an estimate (plus or minus)
 * @property {string} [record]     the trial record backing it
 */

/**
 * @typedef {Object} Label
 * @property {Record<string, Claim>} claims
 * @property {number} day
 */

/**
 * Draft a label from what the player knows: trial readings of this vial or
 * batch where there are any, the guild theory elsewhere (marked as an
 * estimate), unknown where neither exists.
 * @param {{cert?:Record<string, number>, certRecords?:Record<string, string>}} vial
 * @param {ArrayLike<number>|null} theory naive theory for the batch (alchemy/effects.js theoryOf)
 * @param {number} day
 * @returns {Label}
 */
export function draftLabel(vial, theory, day) {
  /** @type {Record<string, Claim>} */
  const claims = {};
  const cert = vial.cert || {}, recs = vial.certRecords || {};
  for (let k = 0; k < NE; k++) {
    const key = EFFECT_KEYS[k];
    if (cert[key] !== undefined) {
      const v = cert[key];
      claims[key] = Math.abs(v) < PURITY_LIMIT ? { kind: 'none', source: 'trial', record: recs[key] } : { kind: 'value', value: Math.round(v * 10) / 10, source: 'trial', record: recs[key] };
    } else if (theory) {
      const v = theory[k];
      claims[key] = Math.abs(v) < 0.6 ? { kind: 'none', source: 'estimate', spread: 1 } : { kind: 'value', value: Math.round(v), source: 'estimate', spread: Math.round(2 + 0.3 * Math.abs(v)) };
    } else claims[key] = { kind: 'unknown', source: 'estimate' };
  }
  return { claims, day };
}

/**
 * New trial readings of the vial fill in its label: every claim the player
 * did not write themselves takes the measured value.
 * @param {Label} label @param {Record<string, number>} values @param {string} record trial record id
 */
export function applyTrials(label, values, record) {
  for (const [key, v] of Object.entries(values)) {
    const c = label.claims[key];
    if (c && c.source === 'player') continue;
    label.claims[key] = Math.abs(v) < PURITY_LIMIT ? { kind: 'none', source: 'trial', record } : { kind: 'value', value: Math.round(v * 10) / 10, source: 'trial', record };
  }
  return label;
}

/** The effects a label claims (unknown counts as nothing claimed). @param {Label} label */
export function claimedEffects(label) {
  const e = new Array(NE).fill(0);
  for (let k = 0; k < NE; k++) {
    const c = label.claims[EFFECT_KEYS[k]];
    if (c && c.kind === 'value') e[k] = c.value || 0;
  }
  return e;
}

/**
 * The effects that matter for an order: those it asks for and, with a purity
 * rule, every other one too.
 * @param {any} com
 */
export function relevantEffects(com) {
  const keys = new Set();
  for (const r of com.requirements) {
    if (EFFECT_INDEX[r.key] !== undefined) keys.add(r.key);
    if (r.key === 'purity') for (const k of EFFECT_KEYS) if (!(r.exclude || []).includes(k)) keys.add(k);
  }
  return [...keys];
}

/**
 * How far a customer trusts a label for their order (0.3…1.05).
 * @param {any} com @param {Label} label @param {number} rank
 */
export function labelTrust(com, label, rank) {
  const keys = relevantEffects(com);
  if (!keys.length) return Math.min(1.05, 0.85 + 0.04 * rank);
  let proven = 0, unknown = 0;
  for (const k of keys) {
    const c = label.claims[k];
    if (!c || c.kind === 'unknown') unknown++;
    else if (c.source === 'trial') proven++;
  }
  const proof = com.customer.persona ? com.customer.persona.proof : 0.5;
  const evidence = proven / keys.length;
  const t = 0.5 + 0.05 * rank + evidence * (0.25 + 0.3 * proof) - (unknown / keys.length) * (0.2 + 0.4 * proof) - (1 - evidence) * 0.15 * proof;
  return Math.max(0.3, Math.min(1.05, t));
}

/**
 * The order's wanted effects that a demanding customer will only take on
 * trial evidence of this batch.
 * @param {any} com @param {Label} label
 */
export function unprovenWanted(com, label) {
  const proof = com.customer.persona ? com.customer.persona.proof : 0.5;
  if (proof < 0.8) return [];
  return com.requirements.filter((r) => r.effect && r.key !== 'purity').map((r) => r.key).filter((k) => !label.claims[k] || label.claims[k].source !== 'trial');
}

/**
 * The bottle as the customer understands it: what they can see, taste and
 * feel (colour, temperature, thickness…) is real; the effects are the label's.
 * @param {any} m measurement of the vial @param {Label} label
 */
export function claimedMeasurement(m, label) {
  return { ...m, effects: claimedEffects(label) };
}

/**
 * @typedef {Object} Negotiation
 * @property {number} round
 * @property {number} patience
 * @property {number} reservation  most this customer will pay (hidden)
 * @property {number} offer        their current offer
 * @property {number} fit          how well the claims meet the order (0..1)
 * @property {number} trust
 * @property {'open'|'deal'|'left'} state
 * @property {number} [price]
 * @property {{who:'you'|'them', text:string, coins?:number}[]} log
 */

/**
 * Open the bargaining over a vial for the current order.
 * @param {any} com @param {any} vial (with .m measurement and .ml) @param {Label} label @param {number} rank
 * @returns {Negotiation}
 */
export function openNegotiation(com, vial, label, rank) {
  const persona = com.customer.persona || { haggle: 0.5, patience: 3, honesty: 0.85, proof: 0.5 };
  const rng = new Rng(hashString(`${com.id}:${vial.id}:haggle`));
  const fit = evaluatePotion(com, /** @type {any} */ (claimedMeasurement({ ...vial.m, ml: vial.ml }, label))).quality;
  const trust = labelTrust(com, label, rank);
  const qty = Math.min(1, vial.ml / com.bottleMl);
  const reservation = Math.round(com.budget * Math.pow(fit, 1.3) * trust * Math.pow(qty, 1.4) * rng.range(0.92, 1.08) * 10) / 10;
  const offer = Math.round(reservation * (0.58 + 0.27 * (1 - persona.haggle)) * 10) / 10;
  const n = { round: 0, patience: persona.patience, reservation, offer, fit, trust, state: /** @type {'open'} */ ('open'), log: [] };
  const opening = fit < 0.35 ? 'That is not what I asked for.' : trust < 0.55 ? 'How do I know it does what your label says?' : fit < 0.8 ? 'Not quite what I wanted, but let’s talk.' : 'This looks right.';
  n.log.push({ who: 'them', text: `${opening} I can offer ${fmt(offer)} coins.`, coins: offer });
  return n;
}

/**
 * The player names a price. The customer accepts, counters or walks out.
 * @param {Negotiation} n @param {any} com @param {number} ask
 */
export function proposePrice(n, com, ask) {
  if (n.state !== 'open') return n;
  const persona = com.customer.persona || { haggle: 0.5 };
  ask = Math.max(0, Math.round(ask * 10) / 10);
  n.round++;
  n.log.push({ who: 'you', text: `I want ${fmt(ask)} coins.`, coins: ask });
  if (ask <= n.offer + 0.05) return close(n, ask, 'Done! A fair price.');
  // a soft bargainer accepts any ask within reach; a hard one keeps a margin
  if (ask <= n.reservation * (1 - 0.12 * persona.haggle)) return close(n, ask, 'Very well — agreed.');
  n.patience -= ask > n.reservation * 1.4 ? 2 : 1;
  if (n.patience <= 0) {
    n.state = 'left';
    n.log.push({ who: 'them', text: ask > n.reservation * 1.4 ? 'That is robbery! Good day.' : 'We will not agree. I will find another alchemist.' });
    return n;
  }
  // concede part of the way toward what they would really pay
  const step = (0.3 + 0.35 * (1 - persona.haggle)) * (n.reservation - n.offer);
  n.offer = Math.round(Math.min(n.reservation, Math.max(n.offer, n.offer + step)) * 10) / 10;
  const mood = ask > n.reservation * 1.4 ? 'Absurd.' : persona.haggle > 0.6 ? 'Hah! No.' : 'Too much for me.';
  n.log.push({ who: 'them', text: `${mood} ${fmt(n.offer)} coins, and that is generous.${n.patience <= 1 ? ' Last offer.' : ''}`, coins: n.offer });
  return n;
}

/** Take the customer's current offer. @param {Negotiation} n */
export function acceptOffer(n) {
  if (n.state !== 'open') return n;
  n.log.push({ who: 'you', text: `Agreed: ${fmt(n.offer)} coins.` });
  return close(n, n.offer, 'Pleasure doing business.');
}

function close(n, price, text) {
  n.state = 'deal';
  n.price = price;
  n.log.push({ who: 'them', text });
  return n;
}

/**
 * Record a sale and decide (deterministically) how the customer will react
 * once they have drunk the real potion. The reaction arrives the next day.
 * @param {any} st GameState
 * @param {any} com @param {any} vial @param {Label} label @param {number} price
 * @param {any} truth the true measurement of the bottled potion
 */
export function recordSale(st, com, vial, label, price, truth) {
  const ev = evaluatePotion(com, truth);
  const rng = new Rng(hashString(`${com.id}:${vial.id}:after`));
  const persona = com.customer.persona || { honesty: 0.85 };
  // was the label honest? (beyond the reading noise a customer would notice)
  const wrong = [];
  for (const k of EFFECT_KEYS) {
    const c = label.claims[k];
    const v = truth.effects[EFFECT_INDEX[k]];
    if (!c || c.kind === 'unknown') continue;
    if (c.kind === 'none' && Math.abs(v) >= PURITY_LIMIT) wrong.push(k);
    if (c.kind === 'value' && Math.abs(v - (c.value || 0)) > Math.max(3, 0.25 * Math.abs(c.value || 0))) wrong.push(k);
  }
  const purity = com.requirements.find((r) => r.key === 'purity');
  const side = purity ? strongestUnwanted(truth.effects, purity.exclude || []) : { value: 0, key: '' };
  const harmful = side.value >= 3 && ['toxicity', 'death', 'acidity'].includes(side.key);
  const failed = ev.rows.filter((r) => r.score < 0.7 && r.req.key !== 'quantity').map((r) => r.req.key);
  const evidence = Object.values(label.claims).filter((c) => c.source === 'trial' && c.record).map((c) => c.record);
  const sale = {
    id: 's' + hashString(`${com.id}:${vial.id}`).toString(36), day: st.day, customer: { name: com.customer.name, title: com.customer.title, archetype: com.customer.archetype, portrait: com.customer.portrait },
    potion: com.potionName, price, quality: Math.round(ev.quality * 1000) / 1000, repDelta: ev.repDelta, wrong, failed, side: side.value >= PURITY_LIMIT ? side : null,
    claims: label.claims, truth: Array.from(truth.effects, (v) => Math.round(v * 10) / 10), evidence, batchId: vial.batchId, rev: vial.rev, ml: vial.ml,
  };
  /** @type {any} */
  let follow = null;
  const due = st.day + 1;
  if (ev.quality >= 0.85 && !wrong.length) {
    if (rng.next() > persona.honesty) {
      // a satisfied customer who wants their money back anyway
      const key = rng.pick(com.requirements.filter((r) => r.effect && r.key !== 'purity').map((r) => r.key).concat(['quality']));
      follow = { kind: 'complaint', legit: false, demand: Math.round(price * rng.range(0.5, 1) * 10) / 10, cites: [key],
        text: key === 'quality' ? 'It did nothing at all. I want my money back.' : `The ${EFFECT_BY_KEY[key] ? EFFECT_BY_KEY[key].label.toLowerCase() : key} was much weaker than you claimed. Refund me.` };
    } else {
      const referral = rng.chance(0.35);
      follow = { kind: 'praise', legit: true, tip: Math.round(price * rng.range(0.05, 0.15) * 10) / 10, referral,
        text: referral ? 'It worked wonders! I told a friend about your shop — expect them.' : 'It worked exactly as promised. Thank you!' };
    }
  } else if (ev.quality < 0.6 || wrong.length || harmful) {
    const share = harmful ? 1 : wrong.length ? Math.max(0.5, 1 - ev.quality) : Math.max(0.3, 1 - ev.quality);
    const cites = [...new Set([...wrong, ...failed])];
    follow = { kind: 'complaint', legit: true, demand: Math.round(price * share * 10) / 10, cites, harmful,
      text: harmful ? `Your potion made me ill — ${EFFECT_BY_KEY[side.key].label.toLowerCase()}! You never said.` : wrong.length ? `Your label lied: ${wrong.map((k) => EFFECT_BY_KEY[k].label.toLowerCase()).join(', ')} was nothing like you wrote.` : 'It barely worked. I paid for a proper potion.' };
  } else {
    follow = { kind: 'quiet', legit: true, text: 'Seemed content enough.' };
  }
  follow = { id: 'f' + sale.id.slice(1), saleId: sale.id, day: due, customer: sale.customer, ...follow, resolved: false };
  return { sale, follow, ev };
}

/**
 * Settle a follow-up visit. Returns the coins and reputation it cost or
 * earned, and what was said.
 * @param {any} st GameState
 * @param {any} f follow-up @param {'thank'|'refund'|'dispute'|'dismiss'} action
 */
export function resolveFollowUp(st, f, action) {
  const sale = (st.sales || []).find((s) => s.id === f.saleId);
  const rng = new Rng(hashString(`${f.id}:${action}`));
  let coins = 0, rep = 0, text = '';
  const base = sale ? sale.repDelta : 0;
  if (f.kind === 'praise') {
    coins = f.tip || 0;
    rep = Math.max(2, base);
    text = f.referral ? 'They leave a tip and promise to send a friend.' : 'They leave a small tip.';
  } else if (f.kind === 'quiet') {
    rep = base;
    text = 'No news is good news.';
  } else if (action === 'refund') {
    coins = -Math.min(f.demand, st.coins);
    rep = f.legit ? Math.min(-1, Math.round(base / 2)) : 1;
    text = f.legit ? 'You refund them. They leave mollified.' : 'You refund them. They leave smirking — but people saw you were fair.';
  } else if (action === 'dispute') {
    // the evidence: trials of the very batch that back the disputed claims
    const covered = sale && (f.cites || []).every((k) => k === 'quality' ? sale.evidence.length > 0 : sale.claims[k] && sale.claims[k].source === 'trial');
    if (f.legit) {
      coins = -Math.min(f.demand, st.coins);
      rep = Math.min(-6, base - 4);
      text = 'Your records do not hold up: the complaint was fair. You refund them, and the story spreads.';
    } else if (covered || rng.chance(0.35 + 0.08 * st.rank)) {
      rep = 2;
      text = covered ? 'You show the trial records of that very batch. They mumble and leave empty-handed.' : 'You stand your ground and they back down.';
    } else {
      coins = -Math.min(Math.round(f.demand * 0.5 * 10) / 10, st.coins);
      rep = -3;
      text = 'With no trial records to show, you settle for half.';
    }
  } else {
    rep = f.legit ? Math.min(-6, base - 3) : -2;
    text = 'You turn them away. They grumble to everyone in the square.';
  }
  return { coins, rep, text };
}

/** @param {number} v */
function fmt(v) {
  return (Math.round(v * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 });
}
