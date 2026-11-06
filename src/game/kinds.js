// Kinds of test animal: the Moon Rabbit and the creatures of the wilds that
// can be caught and kept in the hutch beside it, each in its own pen —
// deer (vitality), badgers (strength), doves (love), cats (arcana), foxes
// (transformation), fire salamanders (fire), ermines (frost), snails
// (acidity), toads (toxicity) and rats (death), and the biomes' native
// creatures: hares (swiftness), river otters (frost), rock beetles
// (strength), cave moths (toxicity), will-o'-wisps (arcana), cloud rays
// (levitation), mimic lizards (transformation), shroud moths
// (invisibility), spectral axolotls (phasing) and hourglass scarabs
// (temporal distortion).
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
 * @typedef {'rabbit'|'cat'|'toad'|'salamander'|'deer'|'badger'|'dove'|'fox'|'ermine'|'snail'|'rat'|'hare'|'otter'|'beetle'|'cavemoth'|'wisp'|'cloudray'|'mimic'|'shroudmoth'|'axolotl'|'scarab'} AnimalKind
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
  deer: {
    id: 'deer', noun: 'deer', plural: 'deer', young: 'fawn',
    biasAll: RABBIT_SPREAD, bias: { vitality: STEADY_SPREAD, death: 0.14 }, noise: { vitality: STEADY_NOISE, death: 1.2 }, steady: 'vitality',
    lore: 'Deer all feel vitality alike, within about 1 %, and steadily: the surest measure of healing. Death unsettles them.',
  },
  badger: {
    id: 'badger', noun: 'badger', plural: 'badgers', young: 'cub',
    biasAll: RABBIT_SPREAD, bias: { strength: STEADY_SPREAD, love: 0.14 }, noise: { strength: STEADY_NOISE, love: 1.2 }, steady: 'strength',
    lore: 'Badgers all feel strength alike, within about 1 %, and steadily: the surest measure of might. Love they take unevenly.',
  },
  dove: {
    id: 'dove', noun: 'dove', plural: 'doves', young: 'squab',
    biasAll: RABBIT_SPREAD, bias: { love: STEADY_SPREAD, strength: 0.14 }, noise: { love: STEADY_NOISE, strength: 1.2 }, steady: 'love',
    lore: 'Doves all feel love alike, within about 1 %, and steadily: the surest measure of love. Strength sits oddly on them.',
  },
  fox: {
    id: 'fox', noun: 'fox', plural: 'foxes', young: 'kit',
    biasAll: RABBIT_SPREAD, bias: { transformation: STEADY_SPREAD, arcana: 0.13 }, noise: { transformation: STEADY_NOISE, arcana: 1.2 }, steady: 'transformation',
    lore: 'Foxes, the old shape-shifters, all feel transformation alike, within about 1 %, and steadily. Their arcana is capricious.',
  },
  ermine: {
    id: 'ermine', noun: 'ermine', plural: 'ermines', young: 'kit',
    biasAll: RABBIT_SPREAD, bias: { frost: STEADY_SPREAD, fire: 0.14 }, noise: { frost: STEADY_NOISE, fire: 1.2 }, steady: 'frost',
    lore: 'Ermines, white with the winter, all feel frost alike, within about 1 %, and steadily. Heat makes them erratic.',
  },
  snail: {
    id: 'snail', noun: 'snail', plural: 'snails', young: 'hatchling',
    biasAll: RABBIT_SPREAD, bias: { acidity: STEADY_SPREAD, toxicity: 0.06 }, noise: { acidity: STEADY_NOISE, toxicity: 0.7 }, steady: 'acidity',
    lore: 'Snails all feel acids and lyes alike, within about 1 %, and steadily: the surest measure of acidity. Poisons they read fairly well too.',
  },
  rat: {
    id: 'rat', noun: 'rat', plural: 'rats', young: 'pup',
    biasAll: RABBIT_SPREAD, bias: { death: STEADY_SPREAD, vitality: 0.14 }, noise: { death: STEADY_NOISE, vitality: 1.2 }, steady: 'death',
    lore: 'Rats all feel death alike, within about 1 %, and steadily: the surest measure of death. Healing takes them unevenly.',
  },
  // ---- the biomes' native creatures (game/biomes.js `creature`)
  hare: {
    id: 'hare', noun: 'hare', plural: 'hares', young: 'leveret',
    biasAll: RABBIT_SPREAD, bias: { swiftness: STEADY_SPREAD, love: 0.13 }, noise: { swiftness: STEADY_NOISE, love: 1.2 }, steady: 'swiftness',
    lore: 'Meadow hares all feel swiftness alike, within about 1 %, and steadily: the surest measure of speed. Love makes them skittish.',
  },
  otter: {
    id: 'otter', noun: 'river otter', plural: 'river otters', young: 'pup',
    biasAll: RABBIT_SPREAD, bias: { frost: STEADY_SPREAD, acidity: 0.12 }, noise: { frost: STEADY_NOISE, acidity: 1.15 }, steady: 'frost',
    lore: 'River otters, at home in cold water, all feel frost alike and steadily — as surely as ermines, and calmer with heat. Acids trouble them.',
  },
  beetle: {
    id: 'beetle', noun: 'rock beetle', plural: 'rock beetles', young: 'grub',
    biasAll: RABBIT_SPREAD, bias: { strength: STEADY_SPREAD, swiftness: 0.13 }, noise: { strength: STEADY_NOISE, swiftness: 1.2 }, steady: 'strength',
    lore: 'Rock beetles all feel strength alike, within about 1 %, under their stone-hard shells. Swiftness sits oddly on them.',
  },
  cavemoth: {
    id: 'cavemoth', noun: 'cave moth', plural: 'cave moths', young: 'caterpillar',
    biasAll: RABBIT_SPREAD, bias: { toxicity: STEADY_SPREAD, vitality: 0.13 }, noise: { toxicity: STEADY_NOISE, vitality: 1.2 }, steady: 'toxicity',
    lore: 'Cave moths, raised on the Netherwood\'s spores, all feel poison alike and steadily. Healing takes them unevenly.',
  },
  wisp: {
    id: 'wisp', noun: 'will-o’-wisp', plural: 'will-o’-wisps', young: 'spark',
    biasAll: RABBIT_SPREAD, bias: { arcana: STEADY_SPREAD, invisibility: 0.12 }, noise: { arcana: STEADY_NOISE, invisibility: 1.15 }, steady: 'arcana',
    lore: 'Will-o’-wisps are arcana given a flicker of life: every one reads arcana alike, and steadily. What hides from sight unsettles their glow.',
  },
  cloudray: {
    id: 'cloudray', noun: 'cloud ray', plural: 'cloud rays', young: 'pup',
    biasAll: RABBIT_SPREAD, bias: { levitation: STEADY_SPREAD, strength: 0.13 }, noise: { levitation: STEADY_NOISE, strength: 1.2 }, steady: 'levitation',
    lore: 'Cloud rays glide on the Skyshard winds and all feel levitation alike, within about 1 %: the surest measure of lightness. Weight unsettles them.',
  },
  mimic: {
    id: 'mimic', noun: 'mimic lizard', plural: 'mimic lizards', young: 'hatchling',
    biasAll: RABBIT_SPREAD, bias: { transformation: STEADY_SPREAD, love: 0.13 }, noise: { transformation: STEADY_NOISE, love: 1.2 }, steady: 'transformation',
    lore: 'Mimic lizards change colour with every mood and all feel transformation alike, and steadily — calmer readers than foxes. Love they take unevenly.',
  },
  shroudmoth: {
    id: 'shroudmoth', noun: 'shroud moth', plural: 'shroud moths', young: 'caterpillar',
    biasAll: RABBIT_SPREAD, bias: { invisibility: STEADY_SPREAD, fire: 0.13 }, noise: { invisibility: STEADY_NOISE, fire: 1.2 }, steady: 'invisibility',
    lore: 'Shroud moths fade at the edges of sight; all of them feel invisibility alike, within about 1 %. Fire makes them erratic.',
  },
  axolotl: {
    id: 'axolotl', noun: 'spectral axolotl', plural: 'spectral axolotls', young: 'larva',
    biasAll: RABBIT_SPREAD, bias: { phasing: STEADY_SPREAD, toxicity: 0.12 }, noise: { phasing: STEADY_NOISE, toxicity: 1.15 }, steady: 'phasing',
    lore: 'Spectral axolotls slip half through glass and stone; all feel phasing alike, within about 1 %. Poisons cloud them.',
  },
  scarab: {
    id: 'scarab', noun: 'hourglass scarab', plural: 'hourglass scarabs', young: 'grub',
    biasAll: RABBIT_SPREAD, bias: { temporal: STEADY_SPREAD, death: 0.13 }, noise: { temporal: STEADY_NOISE, death: 1.2 }, steady: 'temporal',
    lore: 'Hourglass scarabs keep the time of the Wastes: all feel temporal distortion alike, within about 1 %. Death unsettles them.',
  },
};

/**
 * The build each kind is drawn and moves with: a native creature borrows
 * the nearest build already drawn (a hare is built like a rabbit, an otter
 * like an ermine, the mimic and the axolotl like a salamander, the moths
 * like a bird in the air) and adds its own look on top (rendering/rabbit.js
 * creatureLayer); the beetles, the wisp and the cloud ray have bodies of
 * their own drawn over the build they move with.
 * @type {Partial<Record<AnimalKind, AnimalKind>>}
 */
export const BODY = { hare: 'rabbit', otter: 'ermine', beetle: 'rat', scarab: 'rat', cavemoth: 'dove', shroudmoth: 'dove', wisp: 'dove', cloudray: 'dove', mimic: 'salamander', axolotl: 'salamander' };

/** The build a kind is drawn and moves with (itself, for the first eleven). @param {AnimalKind} kind @returns {AnimalKind} */
export const bodyOf = (kind) => BODY[kind] || kind;
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
  // each biome's native creature (game/biomes.js), and with it the kind that stood in for
  // it before the natives were drawn (so every kind can still be caught somewhere)
  forest: [['fox', 1]],                              // native: fox
  meadow: [['hare', 0.65], ['rabbit', 0.35]],        // native: hare
  river: [['otter', 0.6], ['ermine', 0.4]],          // native: river otter
  quarry: [['beetle', 0.6], ['badger', 0.4]],        // native: rock beetle
  netherwood: [['cavemoth', 0.55], ['rat', 0.45]],   // native: cave moth
  crags: [['salamander', 1]],                        // native: salamander
  moonfen: [['wisp', 0.55], ['toad', 0.45]],         // native: will-o'-wisp
  skyshard: [['cloudray', 0.6], ['dove', 0.4]],      // native: cloud ray
  morphgrove: [['mimic', 0.6], ['cat', 0.4]],        // native: mimic lizard
  veilhollow: [['shroudmoth', 0.6], ['deer', 0.4]],  // native: shroud moth
  ghostglass: [['axolotl', 0.6], ['snail', 0.4]],    // native: spectral axolotl
  chronoglass: [['scarab', 0.65], ['rabbit', 0.35]], // native: hourglass scarab
};

/** The regions where a kind lives in the wild (HABITAT). @param {AnimalKind} kind @returns {string[]} */
export function habitatOf(kind) {
  return Object.entries(HABITAT).filter(([, h]) => h.some((x) => x[0] === kind)).map(([r]) => r);
}

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
    // leaf-green, mossy, brown, olive or sulphur-yellow, with darker warts and a pale throat; gold eyes
    const coats = [[0.44, 0.66, 0.26], [0.36, 0.58, 0.24], [0.5, 0.4, 0.26], [0.46, 0.5, 0.27], [0.72, 0.66, 0.26]];
    const c = coats[rng.int(0, coats.length - 1)];
    return { kind, coat: c.slice(), coat2: [c[0] * 0.62, c[1] * 0.62, c[2] * 0.6].map(r2), pattern: 'warts', ear: 'none', size, eye: 'amber', tail: 0, seed };
  }
  const pick = (/** @type {any[]} */ xs) => xs[rng.int(0, xs.length - 1)];
  if (kind === 'deer') {
    // a dappled fawn-brown, white spots along the back
    return { kind, coat: pick([[0.62, 0.42, 0.25], [0.55, 0.38, 0.22], [0.68, 0.5, 0.32]]).slice(), coat2: [0.96, 0.93, 0.86], pattern: 'dapple', ear: 'deer', size, eye: 'dark', tail: 1, seed };
  }
  if (kind === 'badger') {
    return { kind, coat: pick([[0.56, 0.55, 0.57], [0.5, 0.48, 0.47], [0.62, 0.6, 0.58]]).slice(), coat2: [0.12, 0.11, 0.12], pattern: 'badger', ear: 'round', size, eye: 'dark', tail: 1, seed };
  }
  if (kind === 'dove') {
    // pale grey, white or rosy, with darker wing bars
    const c = pick([[0.8, 0.8, 0.85], [0.95, 0.95, 0.95], [0.78, 0.7, 0.72]]);
    return { kind, coat: c.slice(), coat2: [c[0] * 0.6, c[1] * 0.6, c[2] * 0.66].map(r2), pattern: 'dove', ear: 'none', size, eye: 'dark', tail: 1, seed };
  }
  if (kind === 'fox') {
    return { kind, coat: pick([[0.86, 0.45, 0.16], [0.78, 0.38, 0.14], [0.9, 0.55, 0.22]]).slice(), coat2: [0.97, 0.95, 0.9], pattern: 'fox', ear: 'fox', size, eye: 'amber', tail: 2, seed };
  }
  if (kind === 'ermine') {
    // brown in summer, white in winter: the wilds hold both
    const white = rng.chance(0.5);
    return { kind, coat: white ? [0.96, 0.95, 0.92] : [0.52, 0.36, 0.22], coat2: white ? [0.96, 0.95, 0.92] : [0.96, 0.92, 0.82], pattern: 'ermine', ear: 'round', size, eye: 'dark', tail: 1, seed };
  }
  if (kind === 'snail') {
    // a grey-brown foot under a banded shell
    return { kind, coat: pick([[0.62, 0.56, 0.48], [0.55, 0.52, 0.48], [0.7, 0.62, 0.52]]).slice(), coat2: pick([[0.72, 0.5, 0.28], [0.6, 0.45, 0.3], [0.82, 0.68, 0.42], [0.86, 0.56, 0.62], [0.52, 0.66, 0.4]]).slice(), pattern: 'spiral', ear: 'stalk', size, eye: 'dark', tail: 0, seed };
  }
  if (kind === 'rat') {
    const c = pick([[0.45, 0.4, 0.37], [0.3, 0.27, 0.26], [0.58, 0.54, 0.48]]);
    return { kind, coat: c.slice(), coat2: [Math.min(1, c[0] + 0.25), Math.min(1, c[1] + 0.25), Math.min(1, c[2] + 0.22)].map(r2), pattern: 'solid', ear: 'round', size, eye: 'dark', tail: 1, seed };
  }
  if (kind === 'hare') {
    // a brown hare: longer than a rabbit, tawny, with black-tipped ears and a pale belly
    return { kind, coat: pick([[0.62, 0.46, 0.28], [0.56, 0.42, 0.26], [0.68, 0.52, 0.32]]).slice(), coat2: [0.94, 0.9, 0.82], pattern: 'agouti', ear: 'long', size: r2(size * 1.08), eye: 'amber', tail: 1, seed };
  }
  if (kind === 'otter') {
    // sleek dark brown with a pale throat
    return { kind, coat: pick([[0.36, 0.24, 0.16], [0.42, 0.3, 0.2], [0.3, 0.22, 0.16]]).slice(), coat2: [0.82, 0.74, 0.62], pattern: 'otter', ear: 'round', size, eye: 'dark', tail: 2, seed };
  }
  if (kind === 'beetle' || kind === 'scarab') {
    // a beetle: a domed shell (iron-grey to bronze for the rock beetle; turquoise and gold for the scarab)
    // (rock beetles: steel-blue, moss-green, rust-red, bronze or slate, with a metallic sheen)
    const shell = kind === 'scarab' ? pick([[0.2, 0.62, 0.6], [0.26, 0.5, 0.72], [0.2, 0.58, 0.42], [0.5, 0.3, 0.62]]) : pick([[0.24, 0.38, 0.62], [0.3, 0.52, 0.28], [0.66, 0.24, 0.2], [0.62, 0.48, 0.2], [0.36, 0.36, 0.42]]);
    return { kind, coat: shell.slice(), coat2: kind === 'scarab' ? [0.95, 0.76, 0.3] : [0.16, 0.15, 0.17], pattern: 'carapace', ear: 'none', size, eye: 'dark', tail: 0, seed };
  }
  if (kind === 'cavemoth' || kind === 'shroudmoth') {
    // a furry moth: dusky brown with pale eyespots (the cave moth), or grey-violet veils with dark eyes on the wings (the shroud moth)
    if (kind === 'cavemoth') {
      // gold, cream, dusky brown, rose or violet wings, each with a darker eyespot
      const [c, c2] = pick([[[0.9, 0.74, 0.34], [0.5, 0.32, 0.16]], [[0.92, 0.88, 0.76], [0.56, 0.46, 0.36]], [[0.56, 0.44, 0.32], [0.94, 0.84, 0.56]], [[0.9, 0.62, 0.74], [0.5, 0.24, 0.4]], [[0.66, 0.54, 0.86], [0.3, 0.2, 0.5]]]);
      return { kind, coat: c.slice(), coat2: c2.slice(), pattern: 'moth', ear: 'antenna', size, eye: 'dark', tail: 0, seed };
    }
    const c = pick([[0.62, 0.58, 0.72], [0.56, 0.56, 0.62], [0.7, 0.66, 0.78]]);
    return { kind, coat: c.slice(), coat2: [0.2, 0.16, 0.28], pattern: 'moth', ear: 'antenna', size, eye: 'dark', tail: 0, seed };
  }
  if (kind === 'wisp') {
    // a floating flame: blue-green, sky-blue, pale gold or violet
    const c = pick([[0.5, 0.95, 0.9], [0.62, 0.86, 1], [0.98, 0.9, 0.55], [0.82, 0.6, 1]]);
    return { kind, coat: c.slice(), coat2: [1, 1, 1], pattern: 'glow', ear: 'none', size, eye: 'dark', tail: 0, seed };
  }
  if (kind === 'cloudray') {
    // a manta of the clouds: sky-blue above, white below
    return { kind, coat: pick([[0.52, 0.7, 0.9], [0.62, 0.74, 0.92], [0.7, 0.8, 0.94]]).slice(), coat2: [0.97, 0.98, 1], pattern: 'ray', ear: 'none', size, eye: 'dark', tail: 1, seed };
  }
  if (kind === 'mimic') {
    // a chameleon: its bands shift colour
    const c = pick([[0.36, 0.72, 0.34], [0.86, 0.5, 0.24], [0.42, 0.5, 0.86], [0.78, 0.36, 0.62]]);
    return { kind, coat: c.slice(), coat2: [Math.min(1, c[2] + 0.3), Math.min(1, c[0] + 0.2), Math.min(1, c[1] + 0.25)].map(r2), pattern: 'bands', ear: 'none', size, eye: 'amber', tail: 2, seed };
  }
  if (kind === 'axolotl') {
    // pink, rose, lilac or ice-blue, half see-through, with feathery red gills
    return { kind, coat: pick([[0.97, 0.7, 0.8], [0.98, 0.8, 0.86], [0.82, 0.74, 0.96], [0.66, 0.88, 0.92]]).slice(), coat2: [0.9, 0.3, 0.48], pattern: 'spectral', ear: 'gills', size, eye: 'dark', tail: 2, seed };
  }
  // fire salamander: glossy black with yellow or orange blotches
  const spot = rng.chance(0.65) ? [0.98, 0.78, 0.16] : [0.96, 0.46, 0.12];
  return { kind: 'salamander', coat: [0.14, 0.12, 0.13], coat2: spot, pattern: 'blotched', ear: 'none', size, eye: 'dark', tail: 2, seed };
}
