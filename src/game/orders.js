// Commissions and patience.
//
// Commissions: now and then a customer does not want a potion now but a
// harder one later — stronger, often combining effects, a bigger bottle —
// and comes back for it in a few days. The player may take the commission
// or turn it down (no penalty: a shop short of shelf room, or without the
// map of the land that grows what it takes, should decline). Accepted
// commissions wait in the order book; on its day the customer comes to
// collect, inspects what is handed over and pays a generous reward for a
// potion that meets the order (part of it for a near miss, nothing for a
// poor one). Missing the day costs a quarter of the reward and one more
// day; missing that too fails the order and costs reputation.
//
// Patience: a customer at the counter waits only so long. Time is counted
// while the game runs (never while it is closed). Past half their patience
// they pay less and less (down to 60 % of their purse); at the end they
// give up and leave.

/** Commissions start coming once the shop has found its feet. */
export const ORDER_FROM_DAY = 3;
/** Days until the customer comes back. */
export const ORDER_DAYS = [2, 4];
/** A commission's reward against a counter sale's purse. */
export const ORDER_REWARD = 1.8;
/** At most this many commissions open at once. */
export const ORDER_MAX = 3;
/** Quality from which a commission is paid in full, and below which nothing. */
export const ORDER_FULL = 0.85, ORDER_PART = 0.55;

/**
 * Does this customer come with a commission rather than a counter order?
 * @param {{day:number, orders:any[], tutorial:{active:boolean, done:boolean}, stats:{served:number}}} st @param {import('../core/rng.js').Rng} rng
 */
export function wantsCommission(st, rng) {
  if (st.day < ORDER_FROM_DAY || (st.tutorial.active && !st.tutorial.done) || st.stats.served < 3) return false;
  if (st.orders.filter((o) => o.status === 'open').length >= ORDER_MAX) return false;
  return rng.chance(0.3);
}

/**
 * Turn a generated order into a commission offer: when it is due, what it
 * pays, and the customer's words.
 * @param {any} com @param {number} day @param {import('../core/rng.js').Rng} rng
 */
export function asCommission(com, day, rng) {
  const days = rng.int(ORDER_DAYS[0], ORDER_DAYS[1]);
  com.commission = { due: day + days, days, reward: Math.round(com.budget * ORDER_REWARD) };
  com.potionName = com.potionName.startsWith('Fine ') ? com.potionName : `Fine ${com.potionName}`;
  com.dialogue = `I can wait ${days} days for something special. ${com.dialogue}`;
  return com;
}

/** The patience a customer brings, in seconds of play. @param {any} com @param {import('../core/rng.js').Rng} rng */
export function patienceFor(com, rng) {
  const tier = com.tier || 0;
  return Math.round((300 + 90 * tier + (com.techniques || []).length * 60 + (com.activation ? 120 : 0)) * rng.range(0.85, 1.25));
}

/** How much of their purse a waiting customer will still pay (1 … 0.6). @param {any} com */
export function patienceFactor(com) {
  const w = com && com.wait;
  if (!w || !(w.limit > 0)) return 1;
  const u = w.used / w.limit;
  return u <= 0.5 ? 1 : Math.max(0.6, 1 - 0.8 * (u - 0.5));
}

/** Patience left (0..1). @param {any} com */
export function patienceLeft(com) {
  const w = com && com.wait;
  if (!w || !(w.limit > 0)) return 1;
  return Math.max(0, 1 - w.used / w.limit);
}
