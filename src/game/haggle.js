// Selling by haggling. The customer opens with an offer well below what the
// potion is worth to them; the seller names a price; the customer either
// takes it, comes up part of the way, or loses patience. Asking far beyond
// what they would ever pay costs more patience, an insulting price makes
// them walk out. When patience runs out they make one final offer.
//
// Everything is pure and seeded per customer, so a haggle is reproducible.

/**
 * @typedef {Object} Haggle
 * @property {number} max        the most this customer would pay (hidden)
 * @property {number} offer      their current offer
 * @property {number} opening    their first offer
 * @property {number} patience   counter-offers left
 * @property {number} patienceMax
 * @property {number} concession share of the gap they close each round
 * @property {number} rounds
 * @property {'open'|'final'|'deal'|'walked'} state
 * @property {number} price      agreed price (when state === 'deal')
 * @property {number} lastAsk
 */

/**
 * Start haggling.
 * @param {{value:number}} com the request (its value to the customer)
 * @param {{open:number, patience:number, concession:number}} arch customer archetype
 * @param {{certified?:boolean, reputation?:number, short?:number}} [opts]
 *   certified: an expert's certificate makes the potion worth more to them;
 *   short: share of the ordered volume actually in the vial (0..1)
 * @returns {Haggle}
 */
export function startHaggle(com, arch, opts = {}) {
  const trust = 1 + Math.min(0.15, (opts.reputation || 0) / 4000);
  const fill = Math.min(1, opts.short ?? 1);
  const max = Math.max(4, Math.round(com.value * (opts.certified ? 1.25 : 1) * trust * (0.35 + 0.65 * fill)));
  const opening = Math.max(2, Math.round(max * arch.open));
  return { max, offer: opening, opening, patience: arch.patience, patienceMax: arch.patience, concession: arch.concession, rounds: 0, state: 'open', price: 0, lastAsk: 0 };
}

/**
 * The seller names a price.
 * @param {Haggle} h @param {number} ask
 * @returns {{result:'deal'|'counter'|'final'|'walked', price?:number, offer:number}}
 */
export function ask(h, ask) {
  if (h.state === 'deal' || h.state === 'walked') return { result: h.state, offer: h.offer, price: h.price };
  ask = Math.max(1, Math.round(ask));
  h.lastAsk = ask;
  h.rounds++;
  if (h.state === 'final') {
    // past the final offer, any higher ask ends it
    if (ask <= h.offer) return deal(h, ask);
    h.state = 'walked';
    return { result: 'walked', offer: h.offer };
  }
  if (ask <= h.offer) return deal(h, ask);
  if (ask > h.max * 2) {
    h.state = 'walked';
    return { result: 'walked', offer: h.offer };
  }
  if (ask <= h.max) {
    // close enough: they shake on it
    if (ask - h.offer <= Math.max(1, h.max * 0.04)) return deal(h, ask);
    h.offer = Math.min(h.max, Math.round(h.offer + (ask - h.offer) * h.concession));
    h.patience -= 1;
  } else {
    // more than it is worth to them: they budge only a little, and sour
    h.offer = Math.min(h.max, Math.round(h.offer + (h.max - h.offer) * h.concession * 0.5));
    h.patience -= ask > h.max * 1.3 ? 2 : 1;
  }
  if (h.patience <= 0) {
    h.state = 'final';
    h.patience = 0;
    return { result: 'final', offer: h.offer };
  }
  return { result: 'counter', offer: h.offer };
}

/** The seller takes the customer's current offer. @param {Haggle} h */
export function acceptOffer(h) {
  if (h.state === 'walked' || h.state === 'deal') return { result: h.state, offer: h.offer, price: h.price };
  return deal(h, h.offer);
}

/** The seller turns the customer away. @param {Haggle} h */
export function refuse(h) {
  h.state = 'walked';
  return { result: /** @type {'walked'} */ ('walked'), offer: h.offer };
}

/** @param {Haggle} h @param {number} price */
function deal(h, price) {
  h.state = 'deal';
  h.price = Math.round(price);
  return { result: /** @type {'deal'} */ ('deal'), price: h.price, offer: h.offer };
}

/** The customer's mood from 0 (fed up) to 1 (keen), for the portrait. @param {Haggle} h */
export function mood(h) {
  if (h.state === 'walked') return 0;
  if (h.state === 'deal') return 1;
  return Math.max(0, h.patience / Math.max(1, h.patienceMax));
}
