// Biome generations and Traveller Coins.
//
// The wilds no longer grow back by themselves and are never watered. Each
// biome has a *generation*: a number that, with the world seed, decides
// everything about one visit's resources — which of its species grow there,
// how many specimens of each, which of those are Arcane, and where they
// stand. What is harvested is gone until the player spends a Traveller Coin
// to regenerate the biome, which moves it to its next generation: new
// scenery seed, new species mix, new populations. Generation is
// deterministic (equal seeds and generation numbers give equal biomes) and
// never touches a species' identity, rarity or magic — only which species
// appear and how many.
//
// Traveller Coins recharge with elapsed time up to a cap, and satisfied
// customers sometimes give one. Elapsed time is measured from a saved
// checkpoint; a clock set back never takes coins away nor adds any, and a
// clock set far forward gives at most the cap.

import { Rng } from '../core/rng.js';
import { RARITY, ARCANE } from '../materials/rarity.js';
import { SPECIES } from '../materials/catalog.js';
import { BIOMES, BIOME_BY_ID, START_BIOME, milestoneMet } from './biomes.js';

/** Traveller Coin balancing (configurable). */
export const COIN_RULES = Object.freeze({
  max: 3,
  start: 3,
  /** minutes for one coin to recharge */
  rechargeMin: 25,
  /** chance an excellent sale (quality ≥ 0.9) brings a coin as a gift */
  giftChance: 0.25,
  /** cost of one regeneration */
  cost: 1,
});

/**
 * @typedef {Object} RegenState
 * @property {number} coins     Traveller Coins held (0..max, a gift may go one over)
 * @property {number} at        wall-clock checkpoint of the recharge (ms)
 * @property {Record<string, number>} gens  each biome's current generation
 * @property {string[]} unlocked biomes opened so far
 * @property {number} spent     coins spent in all
 */

/** @returns {RegenState} */
export function createRegen(now = Date.now()) {
  return { coins: COIN_RULES.start, at: now, gens: {}, unlocked: [START_BIOME], spent: 0 };
}

const finite = (/** @type {any} */ v) => typeof v === 'number' && Number.isFinite(v);

/** A saved regeneration state made safe (or a fresh one). @param {any} r */
export function normalizeRegen(r, now = Date.now()) {
  const out = createRegen(now);
  if (!r || typeof r !== 'object') return out;
  if (finite(r.coins)) out.coins = Math.max(0, Math.min(COIN_RULES.max + 3, Math.floor(r.coins)));
  if (finite(r.at)) out.at = Math.min(r.at, now);
  if (r.gens && typeof r.gens === 'object') for (const [k, v] of Object.entries(r.gens)) if (BIOME_BY_ID[k] && finite(v) && v >= 0) out.gens[k] = Math.floor(/** @type {number} */ (v));
  if (Array.isArray(r.unlocked)) out.unlocked = [...new Set([START_BIOME, ...r.unlocked.filter((id) => BIOME_BY_ID[id])])];
  if (finite(r.spent)) out.spent = Math.max(0, r.spent | 0);
  return out;
}

/**
 * Bring the coin balance up to date with the time elapsed since its
 * checkpoint (in place). Returns how many coins were added.
 * @param {RegenState} r @param {number} [now]
 */
export function accrue(r, now = Date.now()) {
  const per = COIN_RULES.rechargeMin * 60000;
  // the clock went back: start counting again from now, nothing lost or gained
  if (now < r.at) { r.at = now; return 0; }
  if (r.coins >= COIN_RULES.max) { r.at = now; return 0; }
  const n = Math.floor((now - r.at) / per);
  if (n <= 0) return 0;
  const add = Math.min(n, COIN_RULES.max - r.coins);
  r.coins += add;
  // a full balance stops the clock; otherwise keep the part-recharged coin's progress
  r.at = r.coins >= COIN_RULES.max ? now : r.at + n * per;
  return add;
}

/** Milliseconds until the next coin (0 when full). @param {RegenState} r @param {number} [now] */
export function nextCoinIn(r, now = Date.now()) {
  if (r.coins >= COIN_RULES.max) return 0;
  return Math.max(0, r.at + COIN_RULES.rechargeMin * 60000 - now);
}

/** The current generation of a biome. @param {RegenState} r @param {string} biome */
export const generationOf = (r, biome) => r.gens[biome] || 0;

/**
 * Spend a coin to regenerate a biome (in place).
 * @param {RegenState} r @param {string} biome @param {number} [now]
 * @returns {{ok:boolean, reason?:string, gen?:number}}
 */
export function regenerate(r, biome, now = Date.now()) {
  if (!BIOME_BY_ID[biome]) return { ok: false, reason: 'No such biome.' };
  if (!r.unlocked.includes(biome)) return { ok: false, reason: 'That biome is still locked.' };
  accrue(r, now);
  if (r.coins < COIN_RULES.cost) return { ok: false, reason: 'No Traveller Coin left — one recharges every ' + COIN_RULES.rechargeMin + ' minutes.' };
  const wasFull = r.coins >= COIN_RULES.max;
  r.coins -= COIN_RULES.cost;
  // spending from a full purse starts the recharge clock now
  if (wasFull) r.at = now;
  r.gens[biome] = generationOf(r, biome) + 1;
  r.spent++;
  return { ok: true, gen: r.gens[biome] };
}

/**
 * A satisfied customer may gift a coin (deterministic from the sale's seed).
 * @param {RegenState} r @param {number} quality 0..1 @param {string} seed
 */
export function maybeGift(r, quality, seed) {
  if (quality < 0.9) return false;
  if (new Rng('coin-gift:' + seed).next() >= COIN_RULES.giftChance) return false;
  r.coins = Math.min(COIN_RULES.max + 3, r.coins + 1);
  return true;
}

/**
 * Open every biome whose milestone is met (in place); returns those newly opened.
 * @param {RegenState} r @param {{rank:number, stats?:Record<string, number>}} st
 */
export function unlockBiomes(r, st) {
  const out = [];
  for (const b of BIOMES) if (!r.unlocked.includes(b.id) && milestoneMet(b, st)) { r.unlocked.push(b.id); out.push(b.id); }
  return out;
}

/**
 * @typedef {Object} Population
 * @property {string} key       species
 * @property {number} ordinary  specimens of its ordinary form
 * @property {number} arcane    specimens of its Arcane form
 */

/**
 * The resources of one generation of a biome: which of its species grow and
 * how many specimens of each form. Pure and deterministic. Rarity sets both
 * the chance a species appears and how many specimens it brings; every
 * specimen of a species shares its rarity and magic (they are one material).
 * The very first Whisperwood always holds Silverleaf and one Arcane
 * Silverleaf, so the tutorial can show an arcane transition.
 * @param {string} seed world seed @param {string} biome @param {number} gen
 * @returns {Population[]}
 */
export function populationOf(seed, biome, gen) {
  const rng = new Rng(`population:${seed}:${biome}:${gen}`);
  const pool = SPECIES.filter((s) => s.biome === biome);
  /** @type {Population[]} */
  const out = [];
  for (const s of pool) {
    const r = RARITY[s.rarity];
    const present = rng.next() < r.presence;
    const count = rng.int(r.specimens[0], r.specimens[1]);
    if (!present) continue;
    let arcane = 0;
    for (let k = 0; k < count; k++) if (rng.next() < ARCANE.spawnChance[s.rarity]) arcane++;
    out.push({ key: s.key, ordinary: count - arcane, arcane });
  }
  // never an empty or one-note biome: at least three species, its own commons first
  if (out.length < 3) {
    for (const s of pool.filter((x) => x.rarity === 'common' || x.rarity === 'uncommon')) {
      if (out.length >= 3) break;
      if (!out.some((p) => p.key === s.key)) out.push({ key: s.key, ordinary: RARITY[s.rarity].specimens[0], arcane: 0 });
    }
  }
  if (biome === START_BIOME && gen === 0) {
    const sl = out.find((p) => p.key === 'silverleaf');
    if (sl) { sl.arcane = Math.max(1, sl.arcane); sl.ordinary = Math.max(2, sl.ordinary); }
    else out.unshift({ key: 'silverleaf', ordinary: 3, arcane: 1 });
  }
  return out;
}

/** Specimens in a population. @param {Population[]} pop */
export const specimenCount = (pop) => pop.reduce((a, p) => a + p.ordinary + p.arcane, 0);
