// The quick shelf at the cauldron (the "bench") and the inventory behind it.
//
// The storeroom holds every ingredient the shop owns; the shelf under the
// cauldron holds only the jars the alchemist has put out for the brew at
// hand, in the order they were put there. Something new (a first harvest,
// a purchase, an animal's remains) is put out once, the first time it is
// in stock, so a fresh find is always at hand; once it has been taken off
// the shelf it stays in the storeroom until it is put back (ui/inventory.js).
//
// The inventory lists the storeroom grouped by effect (each ingredient
// under its strongest one) or by rarity, rarest and strongest first.

import { EFFECTS, EFFECT_BY_KEY } from '../alchemy/effects.js';
import { RARITY, RARITIES } from '../materials/rarity.js';

/**
 * @typedef {{ids: string[], seen: Record<string, 1>}} Bench
 */

/** A saved bench, or a new one (an older save: everything in stock is put out on first sight). @param {any} raw @returns {Bench} */
export function normalizeBench(raw) {
  const ids = raw && Array.isArray(raw.ids) ? raw.ids.filter((x) => typeof x === 'string') : [];
  /** @type {Record<string, 1>} */
  const seen = {};
  if (raw && raw.seen && typeof raw.seen === 'object') for (const k of Object.keys(raw.seen)) seen[k] = 1;
  for (const id of ids) seen[id] = 1;
  return { ids: [...new Set(ids)], seen };
}

/**
 * The jars on the shelf: what was put out that can still be shown, after
 * putting out (once) anything in stock that was never offered before.
 * @param {Bench} bench @param {string[]} pool ingredients that may be shown @param {(id:string)=>number} stock
 * @returns {string[]}
 */
export function benchIds(bench, pool, stock) {
  for (const id of pool) {
    if (bench.seen[id] || !(stock(id) > 0)) continue;
    bench.seen[id] = 1;
    bench.ids.push(id);
  }
  const ok = new Set(pool);
  return bench.ids.filter((id) => ok.has(id));
}

/** Put a jar out (at the end of the shelf) or take it back to the storeroom. @param {Bench} bench @param {string} id @param {boolean} on */
export function setOnBench(bench, id, on) {
  bench.seen[id] = 1;
  const at = bench.ids.indexOf(id);
  if (on && at < 0) bench.ids.push(id);
  else if (!on && at >= 0) bench.ids.splice(at, 1);
}

/** The strongest effect of an ingredient, and its strength (|acidity| counts both ways), or null. @param {any} m */
export function mainEffect(m) {
  if (!m || m.remains || !m.effects) return null;
  let key = '', v = 0;
  for (const e of EFFECTS) {
    const x = Math.abs(Number(m.effects[e.key]) || 0);
    if (x >= 1 && x > v) { v = x; key = e.key; }
  }
  return key ? { key, value: v } : null;
}

/** An ingredient's rarity rank (0 Common … 4 Legendary), −1 for shop reagents and remains. @param {any} m */
export function rarityRank(m) {
  const r = m && m.wild && m.wild.rarity ? RARITY[/** @type {'common'} */ (m.wild.rarity)] : null;
  return r ? r.rank : -1;
}

/** Rarest first, the Arcane form before the ordinary one, then the strongest, then by name. */
function byRarity(lookup) {
  return (a, b) => {
    const ma = lookup(a), mb = lookup(b);
    return rarityRank(mb) - rarityRank(ma)
      || Number(!!(mb.wild && mb.wild.arcane)) - Number(!!(ma.wild && ma.wild.arcane))
      || ((mainEffect(mb) || { value: 0 }).value - (mainEffect(ma) || { value: 0 }).value)
      || String(ma.name).localeCompare(String(mb.name));
  };
}

/**
 * The storeroom in sections.
 * @param {string[]} ids @param {(id:string)=>any} lookup @param {'effect'|'rarity'} by
 * @returns {{key:string, label:string, icon:string, ids:string[]}[]}
 */
export function inventoryGroups(ids, lookup, by = 'effect') {
  /** @type {Map<string, string[]>} */
  const groups = new Map();
  const put = (k, id) => { if (!groups.has(k)) groups.set(k, []); /** @type {string[]} */ (groups.get(k)).push(id); };
  for (const id of ids) {
    const m = lookup(id);
    if (!m) continue;
    if (by === 'rarity') {
      const r = rarityRank(m);
      put(r >= 0 ? RARITIES[r].id : m.remains ? 'remains' : 'reagent', id);
    } else {
      const fx = mainEffect(m);
      put(fx ? fx.key : m.remains ? 'remains' : 'none', id);
    }
  }
  /** @type {{key:string, label:string, icon:string}[]} */
  const order = by === 'rarity'
    ? [...RARITIES.slice().reverse().map((r) => ({ key: r.id, label: r.label, icon: 'gem' })), { key: 'reagent', label: 'Shop reagents and solvents', icon: 'flask' }, { key: 'remains', label: 'Remains', icon: 'bone' }]
    : [...EFFECTS.map((e) => ({ key: e.key, label: e.label, icon: e.icon })), { key: 'none', label: 'Solvents and bases (no effect)', icon: 'drop' }, { key: 'remains', label: 'Remains (effects unknown)', icon: 'bone' }];
  const sort = byRarity(lookup);
  const out = [];
  for (const g of order) {
    const list = groups.get(g.key);
    if (!list || !list.length) continue;
    if (by === 'rarity') {
      // within a rarity: grouped by effect (in the effects' order), the strongest first
      const ix = (id) => { const fx = mainEffect(lookup(id)); return fx ? EFFECTS.indexOf(EFFECT_BY_KEY[fx.key]) : EFFECTS.length; };
      list.sort((a, b) => ix(a) - ix(b) || sort(a, b));
    } else list.sort(sort);
    out.push({ ...g, ids: list });
  }
  return out;
}
