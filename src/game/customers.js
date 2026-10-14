// Customer archetypes: who walks into the shop, what they look like, how they
// talk and which kinds of potions (brewing styles) they ask for.

import { Rng } from '../core/rng.js';

/**
 * @typedef {Object} Archetype
 * @property {string} key
 * @property {string} title       occupation
 * @property {string[]} wants     the magic their problems usually call for
 * @property {number} budget      how much they value a potion (multiplier)
 * @property {number} open        opening offer as a share of what they would pay at most
 * @property {number} patience    counter-offers they sit through
 * @property {number} concession  how far they move toward the asking price each round
 * @property {number} bluff       chance they come back for a refund they do not deserve
 * @property {number} minRank
 * @property {Object} look        portrait parameters
 * @property {string[]} pleased
 * @property {string[]} displeased
 */

/** @type {Archetype[]} */
export const ARCHETYPES = [
  { key: 'farmer', title: 'Farmer', wants: ['vitality', 'bane', 'frost'], budget: 0.8, open: 0.62, patience: 4, concession: 0.45, bluff: 0.05, minRank: 0,
    look: { hat: 'straw', outfit: [0.55, 0.42, 0.25], beardChance: 0.5 },
    pleased: ['That’ll do nicely!', 'Fair enough.'], displeased: ['Robbery!', 'You drive a hard bargain.'] },
  { key: 'innkeeper', title: 'Innkeeper', wants: ['ardor', 'charm', 'vitality'], budget: 0.95, open: 0.58, patience: 4, concession: 0.4, bluff: 0.12, minRank: 0,
    look: { hat: 'cap', outfit: [0.45, 0.28, 0.2], beardChance: 0.3, apron: true },
    pleased: ['Deal!', 'The guests will be pleased.'], displeased: ['Pricey…', 'Hmph.'] },
  { key: 'bard', title: 'Bard', wants: ['charm', 'levity', 'vitality'], budget: 1.0, open: 0.5, patience: 5, concession: 0.35, bluff: 0.2, minRank: 0,
    look: { hat: 'feather', outfit: [0.6, 0.2, 0.45], beardChance: 0.2 },
    pleased: ['A song for you!', 'Splendid.'], displeased: ['A minor key, that price.', 'Alas, my purse.'] },
  { key: 'healer', title: 'Healer', wants: ['vitality', 'frost'], budget: 1.15, open: 0.66, patience: 3, concession: 0.5, bluff: 0.02, minRank: 0,
    look: { hat: 'hood', outfit: [0.85, 0.85, 0.8], beardChance: 0.1 },
    pleased: ['Thank you.', 'This will save lives.'], displeased: ['Too dear.', 'Lives depend on it…'] },
  { key: 'knight', title: 'Knight', wants: ['vitality', 'ardor', 'levity'], budget: 1.25, open: 0.64, patience: 3, concession: 0.5, bluff: 0.06, minRank: 1,
    look: { hat: 'helm', outfit: [0.6, 0.62, 0.68], beardChance: 0.6 },
    pleased: ['Agreed.', 'For the realm!'], displeased: ['Outrageous.', 'Very well.'] },
  { key: 'traveler', title: 'Traveller', wants: ['ardor', 'levity', 'vitality'], budget: 1.0, open: 0.55, patience: 4, concession: 0.4, bluff: 0.15, minRank: 0,
    look: { hat: 'wide', outfit: [0.35, 0.4, 0.3], beardChance: 0.5 },
    pleased: ['Safe roads.', 'Done.'], displeased: ['Steep.', 'I have a long road…'] },
  { key: 'scholar', title: 'Scholar', wants: ['levity', 'frost', 'charm'], budget: 1.2, open: 0.6, patience: 5, concession: 0.3, bluff: 0.04, minRank: 1,
    look: { hat: 'none', outfit: [0.25, 0.3, 0.5], beardChance: 0.4, glasses: true },
    pleased: ['Most reasonable.', 'Accepted.'], displeased: ['Hm. Expensive data.', 'Acceptable.'] },
  { key: 'witch', title: 'Hedge Witch', wants: ['bane', 'levity', 'charm'], budget: 1.1, open: 0.48, patience: 6, concession: 0.28, bluff: 0.3, minRank: 1,
    look: { hat: 'witch', outfit: [0.2, 0.25, 0.2], beardChance: 0 },
    pleased: ['Hehe… deal.', 'Wicked.'], displeased: ['Pah!', 'Thief…'] },
  { key: 'blacksmith', title: 'Blacksmith', wants: ['ardor', 'frost', 'vitality'], budget: 1.1, open: 0.62, patience: 3, concession: 0.5, bluff: 0.06, minRank: 1,
    look: { hat: 'bandana', outfit: [0.3, 0.22, 0.18], beardChance: 0.8, apron: true },
    pleased: ['Hah! Done.', 'Solid.'], displeased: ['Too much.', 'Fine.'] },
  { key: 'noble', title: 'Noble', wants: ['charm', 'levity', 'vitality'], budget: 1.6, open: 0.5, patience: 3, concession: 0.4, bluff: 0.25, minRank: 2,
    look: { hat: 'crown', outfit: [0.5, 0.1, 0.25], beardChance: 0.3 },
    pleased: ['Acceptable.', 'Very well.'], displeased: ['Vulgar haggling.', 'Must I?'] },
  { key: 'wizard', title: 'Wizard', wants: ['levity', 'frost', 'ardor', 'bane'], budget: 1.5, open: 0.6, patience: 4, concession: 0.4, bluff: 0.08, minRank: 2,
    look: { hat: 'wizard', outfit: [0.25, 0.2, 0.55], beardChance: 0.9 },
    pleased: ['The aether approves.', 'Done.'], displeased: ['Greedy.', 'Hmm.'] },
  { key: 'hunter', title: 'Hunter', wants: ['bane', 'frost', 'vitality'], budget: 1.05, open: 0.6, patience: 4, concession: 0.42, bluff: 0.1, minRank: 1,
    look: { hat: 'hood', outfit: [0.3, 0.38, 0.22], beardChance: 0.5 },
    pleased: ['Good.', 'That’ll keep.'], displeased: ['Hm.', 'Steep for a hunter.'] },
];

const FIRST = ['Aldric', 'Bryn', 'Cedric', 'Dagna', 'Edda', 'Fenwick', 'Gwen', 'Hob', 'Isolde', 'Jory', 'Kestrel', 'Liesl', 'Mabry', 'Nell', 'Osric', 'Perrin', 'Quill', 'Rowena', 'Sabine', 'Tamsin', 'Ulric', 'Vesna', 'Wynn', 'Yara', 'Zebedee', 'Agnes', 'Bertram', 'Cora', 'Dunstan', 'Elowen', 'Godric', 'Hilda', 'Ivo', 'Maud', 'Piers', 'Rosalind', 'Tobias', 'Wilda'];
const LAST = ['Ashdown', 'Brightwater', 'Copperpot', 'Dunmore', 'Elderberry', 'Fairweather', 'Greaves', 'Hollins', 'Ironside', 'Juniper', 'Kettleby', 'Larkspur', 'Millward', 'Nettlefold', 'Oakhart', 'Pennywhistle', 'Quarrel', 'Ravensby', 'Stonebridge', 'Thistlewood', 'Underhill', 'Vane', 'Whitlock', 'Yarrow'];

const SKIN = [[0.96, 0.8, 0.66], [0.87, 0.66, 0.5], [0.72, 0.52, 0.36], [0.55, 0.38, 0.26], [0.4, 0.27, 0.18], [0.98, 0.86, 0.76]];
const HAIR = [[0.15, 0.1, 0.07], [0.35, 0.22, 0.12], [0.62, 0.38, 0.18], [0.85, 0.7, 0.4], [0.55, 0.55, 0.55], [0.9, 0.9, 0.88], [0.55, 0.2, 0.1]];

/**
 * Create a concrete customer from an archetype.
 * @param {Rng} rng @param {Archetype} arch
 */
export function makeCustomer(rng, arch) {
  const name = `${rng.pick(FIRST)} ${rng.pick(LAST)}`;
  return {
    id: 'c' + Math.floor(rng.next() * 1e9).toString(36),
    archetype: arch.key,
    title: arch.title,
    name,
    portrait: {
      seed: Math.floor(rng.next() * 1e9),
      skin: rng.pick(SKIN),
      hair: rng.pick(HAIR),
      beard: rng.chance(arch.look.beardChance),
      hat: arch.look.hat,
      outfit: arch.look.outfit.map((c) => Math.max(0, Math.min(1, c + rng.range(-0.08, 0.08)))),
      glasses: !!arch.look.glasses || rng.chance(0.08),
      apron: !!arch.look.apron,
      eyes: rng.pick([[0.2, 0.35, 0.6], [0.3, 0.2, 0.1], [0.2, 0.45, 0.25], [0.35, 0.35, 0.4]]),
      age: rng.range(0, 1),
    },
  };
}

/** @param {string} key */
export function archetypeOf(key) {
  return ARCHETYPES.find((a) => a.key === key) || ARCHETYPES[0];
}

export { Rng };
