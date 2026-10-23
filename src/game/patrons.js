// Returning customers. A customer who has bought from the shop is
// remembered by name: what they bought, whether it worked, whether the label
// told the truth. When they come back, the history changes how they trade:
//   • trust (−1…1) grows with potions that worked and shrinks with
//     complaints that were fair; a trusting patron needs less proof, haggles
//     less and brings a bigger budget, a burned one wants trial evidence;
//   • they say why (their dialogue opens with what happened last time);
//   • a patron who was badly let down twice does not come back.
// Patrons are plain data on the game state, so they survive saving.

/**
 * @typedef {Object} Patron
 * @property {string} name
 * @property {string} archetype
 * @property {string} title
 * @property {any} portrait
 * @property {any} persona      the customer's own temperament (customers.js)
 * @property {number} visits    sales to them
 * @property {number} good      potions that worked as promised
 * @property {number} bad       fair complaints
 * @property {number} trust     −1 … 1
 * @property {number} lastDay
 * @property {string} lastPotion
 * @property {string} [lastOutcome] 'praise' | 'complaint' | 'quiet'
 */

/** Chance that a customer slot is taken by someone who has been here before. */
export const RETURN_CHANCE = 0.3;
/** Trust below which a patron stays away for good. */
export const BANNED_TRUST = -0.75;

/** @param {number} v */
const clamp1 = (v) => Math.max(-1, Math.min(1, v));

/**
 * Remember a sale to a customer (called when the deal is struck).
 * @param {{patrons:Record<string, Patron>, day:number}} st @param {any} com
 */
export function notePatron(st, com) {
  if (!com || !com.customer || com.tutorial) return null;
  const c = com.customer;
  const p = st.patrons[c.name] || { name: c.name, archetype: c.archetype, title: c.title, portrait: c.portrait, persona: c.persona, visits: 0, good: 0, bad: 0, trust: 0, lastDay: 0, lastPotion: '' };
  p.visits++;
  p.lastDay = st.day;
  p.lastPotion = com.potionName;
  st.patrons[c.name] = p;
  return p;
}

/**
 * The customer's verdict is in: trust follows what actually happened.
 * @param {{patrons:Record<string, Patron>}} st @param {any} f follow-up @param {string} action
 */
export function patronVerdict(st, f, action) {
  const p = f && f.customer ? st.patrons[f.customer.name] : null;
  if (!p) return null;
  if (f.kind === 'praise') { p.good++; p.trust = clamp1(p.trust + 0.25); }
  else if (f.kind === 'quiet') p.trust = clamp1(p.trust + 0.05);
  else if (f.legit) {
    p.bad++;
    // a fair refund softens it; arguing with a fair complaint makes it worse
    p.trust = clamp1(p.trust - (action === 'refund' ? 0.2 : action === 'dispute' ? 0.5 : 0.4));
  } else if (action === 'refund') p.trust = clamp1(p.trust + 0.05);
  p.lastOutcome = f.kind;
  return p;
}

/**
 * Pick a returning patron for a new customer slot (or null).
 * @param {{patrons:Record<string, Patron>, day:number, rank:number}} st @param {import('../core/rng.js').Rng} rng
 */
export function returningPatron(st, rng) {
  const list = Object.values(st.patrons || {}).filter((p) => p.visits > 0 && p.lastDay < st.day && p.trust > BANNED_TRUST);
  if (!list.length || !rng.chance(RETURN_CHANCE)) return null;
  return rng.weighted(list, list.map((p) => 1 + Math.min(4, p.visits) + Math.max(0, p.trust) * 2));
}

/**
 * Dress a generated commission as a visit from a patron: their own face and
 * temperament, adjusted by their history with the shop, and words about it.
 * @param {any} com @param {Patron} p @param {{day:number}} st
 */
export function welcomePatron(com, p, st) {
  const base = p.persona || com.customer.persona || { haggle: 0.5, patience: 3, honesty: 0.85, proof: 0.5 };
  const t = p.trust;
  const persona = {
    ...base,
    // trust lowers the proof they need and how hard they haggle; distrust raises both
    proof: round2(Math.max(0, Math.min(1, base.proof - 0.3 * t))),
    haggle: round2(Math.max(0, Math.min(1, base.haggle - 0.15 * t))),
    patience: Math.max(2, base.patience + (t > 0.3 ? 1 : t < -0.3 ? -1 : 0)),
  };
  com.customer = { ...com.customer, name: p.name, archetype: p.archetype, title: p.title, portrait: p.portrait, persona };
  const loyalty = 1 + 0.12 * t + 0.04 * Math.min(4, p.visits);
  com.budget = Math.max(12, Math.round(com.budget * loyalty));
  const last = (p.lastPotion || 'potion').toLowerCase();
  const opening = p.lastOutcome === 'praise' || (p.good > p.bad && t > 0.2)
    ? `Your ${last} did everything you promised — I came straight back.`
    : p.lastOutcome === 'complaint' || t < -0.2
      ? `Last time your ${last} let me down. This time I want to see proof before I pay.`
      : `Back again — the ${last} was fair enough.`;
  com.dialogue = `${opening} ${com.dialogue}`;
  com.patron = { visits: p.visits, trust: round2(t), good: p.good, bad: p.bad };
  return com;
}

/**
 * The kinds of order the shop has sold lately (newest first): generation
 * prefers something different, and repeats earn less reputation.
 * @param {{sales:any[]}} st
 */
export function recentStyles(st) {
  return (st.sales || []).slice(0, 8).map((s) => s.style).filter(Boolean);
}

/**
 * How much reputation a sale still earns. Customers choose what they ask
 * for, so an apprentice is never punished for the village's needs; what
 * stops one easy recipe from carrying a career is the order's level: an
 * order below the shop's rank teaches the guild little (two ranks below:
 * 60 %, three or more: 40 %), and the same order sold again and again on
 * top of that earns a little less (85 % from the third of six).
 * @param {string} style @param {string[]} recent @param {number} [tier] @param {number} [rank]
 */
export function noveltyFactor(style, recent, tier = 0, rank = 0) {
  const below = Math.max(0, rank - tier);
  const level = below <= 1 ? 1 : below === 2 ? 0.6 : 0.4;
  const same = recent.slice(0, 6).filter((s) => s === style).length;
  return level * (same >= 2 ? 0.85 : 1);
}

/** @param {number} v */
function round2(v) {
  return Math.round(v * 100) / 100;
}
