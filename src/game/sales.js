// After the handshake: what a sale leaves behind.
//
// A customer buys on the strength of the label (the Potion ID the alchemist
// wrote, or an expert's certificate). What they drink is the truth. If it
// falls short of what they asked for, or carries a side effect beyond their
// limit, they come back a little later to complain — and the money goes
// back to them. Some customers bluff: they come back claiming the potion
// failed although it worked. Without proof the shop must refund them too;
// the only proof is a certificate from an expert alchemist, which is
// expensive.

import { failures } from './commissions.js';
import { PROP_INDEX } from '../alchemy/magic.js';

/** Grace (in property points) before a customer notices a shortfall. */
export const NOTICE = 1.5;

/** What an expert charges to certify a vial. @param {number} rank @param {{certDiscount:number}} cap */
export function certificationFee(rank, cap) {
  return Math.round((30 + 12 * rank) * (1 - (cap.certDiscount || 0)));
}

/**
 * Settle a sale: record it and decide whether (and why) the customer will
 * come back.
 * @param {any} com the request
 * @param {any} vial the sold vial (its `m.magic` is the truth)
 * @param {number} price
 * @param {import('../core/rng.js').Rng} rng
 * @param {{day:number, visits:number}} when
 */
export function settleSale(com, vial, price, rng, when) {
  const truth = vial.m.magic;
  const fails = failures(com, truth, NOTICE);
  /** @type {null | {kind:'genuine'|'bluff', key:string, how:'weak'|'strong'|'side', due:number}} */
  let complaint = null;
  if (fails.length) {
    // the worst miss is what they complain about
    const f = fails.slice().sort((a, b) => miss(com, truth, b) - miss(com, truth, a))[0];
    complaint = { kind: 'genuine', key: f.key, how: f.kind, due: when.visits + rng.int(1, 3) };
  } else if (!com.tutorial && rng.chance(com.bluff || 0)) {
    const r = rng.pick(com.requirements);
    complaint = { kind: 'bluff', key: r.key, how: r.kind === 'limit' ? 'side' : 'weak', due: when.visits + rng.int(1, 3) };
  }
  return {
    id: 's' + Math.floor(rng.next() * 1e9).toString(36),
    day: when.day,
    customer: { name: com.customer.name, title: com.customer.title, archetype: com.customer.archetype, portrait: com.customer.portrait },
    potion: com.potionName,
    requirements: com.requirements.map((r) => ({ ...r })),
    price,
    tier: com.tier,
    label: { ...(vial.label ? vial.label.values : {}) },
    certified: vial.certified ? { ...vial.certified } : null,
    truth: Array.from(truth, (v) => Math.round(v * 10) / 10),
    color: vial.m.color,
    ml: vial.ml,
    complaint,
    resolved: complaint ? null : 'kept',
  };
}

/** How badly a requirement is missed. */
function miss(com, truth, f) {
  const r = com.requirements.find((x) => x.key === f.key);
  const v = truth[PROP_INDEX[f.key]];
  return r ? Math.max(r.min - v, v - r.max) : 0;
}

/** Reputation changes after the sale, by outcome. */
export const REP = {
  sale: (tier) => 3 + tier,
  genuine: (tier) => -(6 + 2 * tier),
  bluffRefund: () => -1,
  bluffCaught: () => 2,
};
