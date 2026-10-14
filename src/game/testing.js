// The testing room: creatures kept to reveal what a potion does.
//
// The only way to learn a potion's magic is to give a real dose (drawn from
// the cauldron tap or split off the sealed vial) to a creature and watch it.
// Each creature shows only some properties, each in its own visual way
// (leaves sprouting, flames rising, ice creeping up, the creature lifting
// off, hearts, toxic bubbles), against the marks of its cage. Responses are
// never written down: the player reads them and compiles a Potion ID — an
// estimate of every property — by hand.
//
// Readings are honest but imperfect: each dose wobbles a little around the
// truth (deterministically per trial), a creature cannot show more than its
// cage allows, and very faint magic does not show at all. Bane, and extreme
// heat or cold, hurt creatures; they recover with time and a dead one has to
// be replaced.

import { NP, PROP_KEYS, PROP_INDEX } from '../alchemy/magic.js';
import { hashString } from '../core/rng.js';

/**
 * @typedef {Object} CreatureDef
 * @property {string} id
 * @property {string} name
 * @property {string[]} shows        properties it responds to visibly
 * @property {Record<string, number>} hurt  harm per point of a property (above `from`)
 * @property {Record<string, number>} from  property level where harm starts
 * @property {number} cost           coins for a replacement
 * @property {number} max            the highest reading its cage can show
 * @property {string} [needs]        equipment id required
 */

/** @type {CreatureDef[]} */
export const CREATURES = [
  { id: 'toad', name: 'Moss Toad', shows: ['vitality', 'charm', 'bane'], hurt: { bane: 0.9, ardor: 0.6, frost: 0.6 }, from: { bane: 0, ardor: 50, frost: 50 }, cost: 6, max: 100 },
  { id: 'salamander', name: 'Salamander', shows: ['ardor', 'frost'], hurt: { bane: 0.5, frost: 1.1 }, from: { bane: 0, frost: 45 }, cost: 12, max: 100 },
  { id: 'moth', name: 'Moon Moth', shows: ['levity', 'charm', 'bane'], hurt: { bane: 1.1, ardor: 0.9 }, from: { bane: 0, ardor: 40 }, cost: 4, max: 90 },
  { id: 'sprout', name: 'Mandrake Sprout', shows: ['vitality', 'ardor', 'frost', 'bane'], hurt: { bane: 0.8, ardor: 0.8, frost: 0.8 }, from: { bane: 0, ardor: 45, frost: 45 }, cost: 3, max: 100 },
  { id: 'wisp', name: 'Wisp', shows: ['levity', 'vitality', 'charm'], hurt: { bane: 0.4 }, from: { bane: 0 }, cost: 16, max: 100, needs: 'lantern' },
];
/** @type {Record<string, CreatureDef>} */
export const CREATURE_BY_ID = Object.fromEntries(CREATURES.map((c) => [c.id, c]));
/** Every dose is this much potion. */
export const DOSE_ML = 10;
/** Below this a property is too faint to show. */
export const FAINT = 3;
/** Health regained per minute of rest. */
export const REST_PER_MIN = 2;
export const RECORD_LIMIT = 60;

/**
 * @typedef {{health:number, alive:boolean, at:number, trials:number}} CreatureState
 * @typedef {Object} TrialRecord
 * @property {string} id
 * @property {number} serial
 * @property {number} at
 * @property {number} day
 * @property {string} creature
 * @property {number} ml
 * @property {'cauldron'|'vial'} source
 * @property {string} batchId
 * @property {number} rev
 * @property {Record<string, number>} levels  what the creature visibly showed per property (0..max)
 * @property {number} harm
 * @property {boolean} died
 * @property {number[]} color
 * @property {number} temperature
 */

export function createLab(now = Date.now()) {
  /** @type {Record<string, CreatureState>} */
  const creatures = {};
  for (const c of CREATURES) creatures[c.id] = { health: 100, alive: true, at: now, trials: 0 };
  return { creatures, records: /** @type {TrialRecord[]} */ ([]), serial: 0 };
}

/** @param {any} raw */
export function normalizeLab(raw, now = Date.now()) {
  const out = createLab(now);
  if (!raw || typeof raw !== 'object') return out;
  if (raw.creatures && typeof raw.creatures === 'object') {
    for (const c of CREATURES) {
      const s = raw.creatures[c.id];
      if (!s || typeof s !== 'object') continue;
      out.creatures[c.id] = {
        health: Number.isFinite(s.health) ? Math.max(0, Math.min(100, s.health)) : 100,
        alive: s.alive !== false,
        at: Number.isFinite(s.at) ? Math.min(s.at, now) : now,
        trials: s.trials | 0,
      };
    }
  }
  if (Array.isArray(raw.records)) out.records = raw.records.filter((r) => r && typeof r === 'object' && CREATURE_BY_ID[r.creature] && r.levels).slice(0, RECORD_LIMIT);
  out.serial = Math.max(raw.serial | 0, ...out.records.map((r) => r.serial | 0), 0);
  return out;
}

/** Health now, after resting since the last dose. @param {CreatureState} s */
export function healthNow(s, now = Date.now()) {
  if (!s.alive) return 0;
  return Math.min(100, s.health + (Math.max(0, now - s.at) / 60000) * REST_PER_MIN);
}

/**
 * What a creature visibly shows for a dose of a potion. Pure and
 * deterministic: the wobble comes from the trial's serial number.
 * @param {CreatureDef} def @param {ArrayLike<number>} magic true magic (NP)
 * @param {number} serial
 */
export function observe(def, magic, serial) {
  /** @type {Record<string, number>} */
  const levels = {};
  for (const key of def.shows) {
    const v = magic[PROP_INDEX[key]] || 0;
    // honest but imperfect: ±(2 + 6%) around the truth
    const h = hashString(`${def.id}|${serial}|${key}`);
    const u = ((h % 10007) / 10006) * 2 - 1;
    let seen = v + u * (2 + 0.06 * v);
    if (v < FAINT) seen = 0;
    levels[key] = Math.round(Math.max(0, Math.min(def.max, seen)) * 10) / 10;
  }
  let harm = 0;
  for (const [key, k] of Object.entries(def.hurt)) {
    const v = magic[PROP_INDEX[key]] || 0;
    const from = def.from[key] || 0;
    if (v > from) harm += (v - from) * k;
  }
  // vitality soothes a little of the harm
  harm = Math.max(0, harm - 0.25 * (magic[PROP_INDEX.vitality] || 0));
  return { levels, harm };
}

/**
 * Give a dose to a creature and record what it showed.
 * @param {ReturnType<typeof createLab>} lab
 * @param {string} id creature id
 * @param {{magic:ArrayLike<number>, color?:number[], temperature?:number}} dose measured dose (the hidden truth)
 * @param {{ml:number, source:'cauldron'|'vial', batchId:string, rev:number, day:number, now?:number}} ctx
 */
export function runTrial(lab, id, dose, ctx) {
  const def = CREATURE_BY_ID[id];
  if (!def) throw new Error('Choose a creature.');
  const now = ctx.now ?? Date.now();
  const st = lab.creatures[id];
  if (!st || !st.alive) throw new Error(`The ${def.name.toLowerCase()} must be replaced first.`);
  if (!(ctx.ml > 0)) throw new Error('No potion to give.');
  lab.serial++;
  const o = observe(def, dose.magic, lab.serial);
  const health = healthNow(st, now) - o.harm * (ctx.ml / DOSE_ML);
  const died = health <= 0.5;
  lab.creatures[id] = { health: Math.max(0, health), alive: !died, at: now, trials: st.trials + 1 };
  /** @type {TrialRecord} */
  const record = {
    id: 't' + lab.serial, serial: lab.serial, at: now, day: ctx.day, creature: id, ml: ctx.ml, source: ctx.source,
    batchId: ctx.batchId, rev: ctx.rev, levels: o.levels, harm: Math.round(o.harm * 10) / 10, died,
    color: (dose.color || [0.5, 0.5, 0.5]).map((c) => Math.round(c * 1000) / 1000), temperature: Math.round(dose.temperature ?? 20),
  };
  lab.records.unshift(record);
  if (lab.records.length > RECORD_LIMIT) lab.records.length = RECORD_LIMIT;
  return record;
}

/** @param {ReturnType<typeof createLab>} lab @param {string} id */
export function replaceCreature(lab, id, now = Date.now()) {
  if (!CREATURE_BY_ID[id]) throw new Error('Unknown creature.');
  lab.creatures[id] = { health: 100, alive: true, at: now, trials: lab.creatures[id]?.trials || 0 };
}

/** A new day: every living creature is rested. @param {ReturnType<typeof createLab>} lab */
export function restCreatures(lab, now = Date.now()) {
  for (const s of Object.values(lab.creatures)) if (s.alive) { s.health = 100; s.at = now; }
}

/** The newest trial of a creature (for replaying its reaction). */
export function lastTrialOf(lab, id) {
  return lab.records.find((r) => r.creature === id) || null;
}

// ------------------------------------------------------------------ the Potion ID
/**
 * A Potion ID: the player's estimate of every property (null = not yet
 * estimated). Certified IDs come from the expert and are exact.
 * @typedef {{values: Record<string, number|null>, batchId?: string, rev?: number, certified?: boolean}} PotionId
 */

/** @returns {Record<string, number|null>} */
export function blankId() {
  return Object.fromEntries(PROP_KEYS.map((k) => [k, null]));
}

/** Does an ID have a value for every property? @param {PotionId|null|undefined} id */
export function idComplete(id) {
  return !!id && PROP_KEYS.every((k) => Number.isFinite(id.values[k]));
}

/** ID values as an array (unknown = 0). @param {PotionId} id */
export function idVector(id) {
  const v = new Array(NP).fill(0);
  for (let k = 0; k < NP; k++) v[k] = Number(id.values[PROP_KEYS[k]]) || 0;
  return v;
}

/** How far an estimate is from the truth (largest error over the properties). */
export function idError(values, truth) {
  let e = 0;
  for (let k = 0; k < NP; k++) e = Math.max(e, Math.abs((Number(values[PROP_KEYS[k]]) || 0) - truth[k]));
  return e;
}
