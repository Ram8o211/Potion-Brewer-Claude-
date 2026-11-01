// Kinds of test animal: the Moon Rabbit and the creatures of the wilds that
// can be caught and kept in the hutch beside it — cats, toads and fire
// salamanders.
//
// A kind is stored in the animal's look (`look.kind`; absent means a
// rabbit), so every place that already draws, breeds, saves or replays a
// rabbit carries it for free: kits take their mother's kind, the renderer
// draws the kind's own anatomy, the wilds move it in its own way.
//
// What sets the kinds apart for the alchemist is *steadiness*. Every animal
// feels each effect a little more or less than the next of its kind (a
// hidden, lifelong bias, colony.js rabbitSensitivity) and every dose varies
// (experiments.js DOSE_NOISE). A rabbit is an all-rounder: about ±10 % on
// every channel. Each other kind is almost perfectly steady on one channel —
// one cat reads arcana within about 1 % of any other cat, dose after dose —
// so a couple of trials on cats certify arcana where rabbits need many; on
// its other channels it is an ordinary animal, or a little less reliable.

import { Rng } from '../core/rng.js';

/**
 * @typedef {'rabbit'|'cat'|'toad'|'salamander'} AnimalKind
 * @typedef {Object} KindDef
 * @property {AnimalKind} id
 * @property {string} noun        singular, lower case
 * @property {string} plural
 * @property {string} young       the word for its young
 * @property {Record<string, number>} bias   relative spread (one sigma) of the lifelong individual bias, per effect key (default `biasAll`)
 * @property {number} biasAll
 * @property {Record<string, number>} noise  factor on the per-dose noise, per effect key (default 1)
 * @property {string|null} steady  the effect it reads steadily (null: none in particular)
 * @property {string} lore
 */

/** Relative spread of a rabbit's lifelong sensitivity (one sigma), every channel. */
export const RABBIT_SPREAD = 0.1;
/** Spread of a kind on its steady channel, and its dose-noise factor there. */
export const STEADY_SPREAD = 0.012;
export const STEADY_NOISE = 0.3;

/** @type {Record<AnimalKind, KindDef>} */
export const KINDS = {
  rabbit: {
    id: 'rabbit', noun: 'rabbit', plural: 'rabbits', young: 'kit',
    biasAll: RABBIT_SPREAD, bias: {}, noise: {}, steady: null,
    lore: 'Moon Rabbits feel every effect, each a little more or less than the next (about ±10 %): the all-round test animal.',
  },
  cat: {
    id: 'cat', noun: 'cat', plural: 'cats', young: 'kitten',
    biasAll: RABBIT_SPREAD, bias: { arcana: STEADY_SPREAD, love: 0.16 }, noise: { arcana: STEADY_NOISE, love: 1.2 }, steady: 'arcana',
    lore: 'Every cat feels arcana alike, within about 1 %, and steadily dose after dose: a few trials on cats pin arcana down. Their love is fickle.',
  },
  toad: {
    id: 'toad', noun: 'toad', plural: 'toads', young: 'toadlet',
    biasAll: RABBIT_SPREAD, bias: { toxicity: STEADY_SPREAD, acid: 0.05 }, noise: { toxicity: STEADY_NOISE, acid: 0.7 }, steady: 'toxicity',
    lore: 'Toads all feel poison alike, within about 1 %, and steadily: the surest measure of toxicity. Acids they read fairly well too.',
  },
  salamander: {
    id: 'salamander', noun: 'salamander', plural: 'salamanders', young: 'eft',
    biasAll: RABBIT_SPREAD, bias: { fire: STEADY_SPREAD, frost: 0.14 }, noise: { fire: STEADY_NOISE, frost: 1.2 }, steady: 'fire',
    lore: 'Fire salamanders all feel fire alike, within about 1 %, and steadily: the surest measure of fire. Cold makes them erratic.',
  },
};
export const KIND_IDS = /** @type {AnimalKind[]} */ (Object.keys(KINDS));

/** The kind of an animal, from its look (or the animal itself). @param {any} o @returns {AnimalKind} */
export function kindOf(o) {
  const k = o && (o.kind || (o.look && o.look.kind));
  return k && Object.prototype.hasOwnProperty.call(KINDS, k) ? k : 'rabbit';
}

/** @param {any} o @returns {KindDef} */
export const kindDef = (o) => KINDS[kindOf(o)];

/** Lifelong bias spread of an animal's kind for one effect. @param {any} o animal, look or kind holder @param {string} key */
export function biasSpread(o, key) {
  const d = kindDef(o);
  return d.bias[key] ?? d.biasAll;
}

/** Factor on the per-dose noise of an animal's kind for one effect. @param {any} o @param {string} key */
export function noiseFactor(o, key) {
  return kindDef(o).noise[key] ?? 1;
}

/** "a cat", "a toad". @param {any} o */
export function aNoun(o) {
  return `a ${kindDef(o).noun}`;
}

/**
 * Which kinds live in each region of the wilds, by weight. Rabbits are
 * everywhere; cats prowl the woods and the crags, toads keep to water, fire
 * salamanders to warm stone and the netherwood's embers.
 * @type {Record<string, [AnimalKind, number][]>}
 */
export const HABITAT = {
  meadow: [['rabbit', 4], ['cat', 1]],
  forest: [['rabbit', 3], ['cat', 2], ['toad', 1]],
  netherwood: [['rabbit', 2], ['cat', 2], ['salamander', 1]],
  river: [['rabbit', 2], ['toad', 3]],
  quarry: [['rabbit', 1], ['salamander', 2]],
  moonfen: [['rabbit', 1], ['toad', 3], ['salamander', 1]],
  crags: [['rabbit', 1], ['cat', 1], ['salamander', 2]],
};

/** Pick a kind for a newcomer to a region. @param {string} region @param {Rng} rng @returns {AnimalKind} */
export function pickKind(region, rng) {
  const h = HABITAT[region] || [['rabbit', 1]];
  return rng.weighted(h.map((x) => x[0]), h.map((x) => x[1]));
}

const r2 = (v) => Math.round(v * 100) / 100;

/**
 * A wild look for a kind other than the rabbit (rabbits use wild-rabbits.js
 * wildLook). Fields are those of a RabbitLook, read by the kind's own art.
 * @param {AnimalKind} kind @param {Rng} rng
 */
export function kindLook(kind, rng) {
  const seed = 1 + rng.int(0, 2147483000);
  const size = r2(Math.max(0.85, Math.min(1.15, 1 + 0.06 * rng.gauss())));
  if (kind === 'cat') {
    // tabbies, gingers, blacks, greys, a tuxedo now and then; green or amber eyes
    const coats = [
      [[0.55, 0.45, 0.33], [0.24, 0.18, 0.13], 'tabby', 3], [[0.85, 0.52, 0.24], [0.62, 0.32, 0.12], 'tabby', 2],
      [[0.2, 0.18, 0.2], [0.97, 0.96, 0.94], 'dutch', 1], [[0.16, 0.15, 0.17], [0.16, 0.15, 0.17], 'solid', 2],
      [[0.6, 0.6, 0.64], [0.36, 0.36, 0.4], 'tabby', 2], [[0.93, 0.89, 0.82], [0.35, 0.25, 0.2], 'points', 1],
    ];
    const c = coats[rng.weighted(coats.map((_, i) => i), coats.map((x) => /** @type {number} */ (x[3])))];
    return { kind, coat: /** @type {number[]} */ (c[0]).slice(), coat2: /** @type {number[]} */ (c[1]).slice(), pattern: c[2], ear: 'cat', size, eye: rng.chance(0.5) ? 'green' : 'amber', tail: 1, seed };
  }
  if (kind === 'toad') {
    // olive, brown or mossy, with darker warts; gold eyes
    const coats = [[0.46, 0.5, 0.27], [0.5, 0.4, 0.26], [0.36, 0.44, 0.26], [0.58, 0.5, 0.32]];
    const c = coats[rng.int(0, coats.length - 1)];
    return { kind, coat: c.slice(), coat2: [c[0] * 0.62, c[1] * 0.62, c[2] * 0.6].map(r2), pattern: 'warts', ear: 'none', size, eye: 'amber', tail: 0, seed };
  }
  // fire salamander: glossy black with yellow or orange blotches
  const spot = rng.chance(0.65) ? [0.98, 0.78, 0.16] : [0.96, 0.46, 0.12];
  return { kind: 'salamander', coat: [0.14, 0.12, 0.13], coat2: spot, pattern: 'blotched', ear: 'none', size, eye: 'dark', tail: 2, seed };
}
