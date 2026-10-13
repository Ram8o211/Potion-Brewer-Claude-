// Customer archetypes: who walks into the shop, what they look like, how they
// talk and which kinds of potions (brewing styles) they ask for.

import { Rng } from '../core/rng.js';

/**
 * @typedef {Object} Archetype
 * @property {string} key
 * @property {string} title       occupation
 * @property {string[]} styles    preferred brew styles (see commissions.js)
 * @property {string[]} props     properties they care about (beyond colour/quantity)
 * @property {number} budget      budget multiplier
 * @property {number} strict      tolerance multiplier (<1 = stricter)
 * @property {number} minRank
 * @property {Object} look        portrait parameters
 * @property {string[]} greet
 * @property {string[]} pleased
 * @property {string[]} displeased
 */

/** @type {Archetype[]} */
export const ARCHETYPES = [
  {
    key: 'farmer', title: 'Farmer', styles: ['tonic', 'syrup'], props: ['temperature'], budget: 0.8, strict: 1.3, minRank: 0,
    look: { hat: 'straw', outfit: [0.55, 0.42, 0.25], beardChance: 0.5 },
    greet: ['Mornin’. The goats are poorly — I need {potion}.', 'Got coin for {potion}, if you can make it proper.', 'My missus sent me for {potion}. Don’t tell her I forgot the colour twice.'],
    pleased: ['That’ll do nicely!', 'Smells like a good harvest.'], displeased: ['Hmm. Not quite what she asked for.', 'Bit off, innit?'],
  },
  {
    key: 'innkeeper', title: 'Innkeeper', styles: ['tonic', 'syrup', 'warm'], props: ['temperature', 'quantity'], budget: 0.9, strict: 1.2, minRank: 0,
    look: { hat: 'cap', outfit: [0.45, 0.28, 0.2], beardChance: 0.3, apron: true },
    greet: ['The common room’s full of coughing travellers. I need {potion}.', 'Make me {potion} — the guests pay well for a warm draught.'],
    pleased: ['Perfect, they’ll be singing tonight!', 'On the house next time you visit.'], displeased: ['The regulars will grumble…', 'I’ll water it down and pretend.'],
  },
  {
    key: 'bard', title: 'Bard', styles: ['syrup', 'tonic', 'fizzy'], props: ['viscosity', 'volatility'], budget: 1.0, strict: 1.1, minRank: 0,
    look: { hat: 'feather', outfit: [0.6, 0.2, 0.45], beardChance: 0.2 },
    greet: ['A sweet, smooth {potion} for my throat — tonight I perform for a duke!', 'Brew me {potion}, alchemist, and I shall write a ballad of you.'],
    pleased: ['Magnificent! I feel a song coming on.', 'Ah, honeyed perfection.'], displeased: ['My voice cracks just looking at it.', 'A minor key, I’m afraid.'],
  },
  {
    key: 'healer', title: 'Healer', styles: ['elixir', 'salve', 'syrup'], props: ['viscosity', 'vitality', 'temperature'], budget: 1.15, strict: 0.9, minRank: 0,
    look: { hat: 'hood', outfit: [0.85, 0.85, 0.8], beardChance: 0.1 },
    greet: ['My patients need {potion}. Precision matters — lives depend on it.', 'I require {potion}, prepared exactly as described.'],
    pleased: ['Excellent work. This will save lives.', 'Precisely right. Thank you.'], displeased: ['This won’t do for my patients.', 'Careless. I expected better.'],
  },
  {
    key: 'knight', title: 'Knight', styles: ['elixir', 'heavy', 'salve', 'ardent'], props: ['vitality', 'fortitude', 'density'], budget: 1.25, strict: 1.0, minRank: 1,
    look: { hat: 'helm', outfit: [0.6, 0.62, 0.68], beardChance: 0.6 },
    greet: ['I ride for the border at dawn. Brew me {potion} — something with backbone.', 'The king’s coin, for {potion}. Make it hearty.'],
    pleased: ['A warrior’s draught! My thanks.', 'This will see me through the battle.'], displeased: ['I’ve tasted better from a ditch.', 'Hm. It will have to do.'],
  },
  {
    key: 'traveler', title: 'Traveller', styles: ['ardent', 'tonic', 'warm'], props: ['density', 'temperature', 'ardor'], budget: 1.0, strict: 1.1, minRank: 0,
    look: { hat: 'wide', outfit: [0.35, 0.4, 0.3], beardChance: 0.5 },
    greet: ['The mountain pass is freezing. I need {potion}, light enough to carry.', 'Long road ahead. {potion}, please — quickly.'],
    pleased: ['That’ll keep the frost out of my bones.', 'Safe roads to you, friend.'], displeased: ['Heavy as a stone, this.', 'I’ll manage, I suppose.'],
  },
  {
    key: 'scholar', title: 'Scholar', styles: ['arcane', 'tonic', 'lumen'], props: ['stability', 'arcana'], budget: 1.2, strict: 0.85, minRank: 1,
    look: { hat: 'none', outfit: [0.25, 0.3, 0.5], beardChance: 0.4, glasses: true },
    greet: ['For my research I require {potion}. It must be perfectly stable.', 'Fascinating shop. I need {potion} — homogeneous, mind you.'],
    pleased: ['Remarkable consistency! Exactly as theorised.', 'This will make an excellent footnote.'], displeased: ['Inconsistent results. Disappointing.', 'The data will be noisy.'],
  },
  {
    key: 'witch', title: 'Hedge Witch', styles: ['salve', 'fizzy', 'frost', 'arcane'], props: ['viscosity', 'volatility', 'fortitude'], budget: 1.1, strict: 1.0, minRank: 1,
    look: { hat: 'witch', outfit: [0.2, 0.25, 0.2], beardChance: 0 },
    greet: ['Hehe… a {potion}, dearie. Thick enough to stand a spoon in.', 'The coven wants {potion}. Don’t ask what for.'],
    pleased: ['Wicked work, dearie!', 'The coven will be pleased.'], displeased: ['Pah! A toad could brew better.', 'Too weak, too weak…'],
  },
  {
    key: 'blacksmith', title: 'Blacksmith', styles: ['heavy', 'ardent', 'warm'], props: ['temperature', 'density', 'ardor'], budget: 1.1, strict: 1.1, minRank: 1,
    look: { hat: 'bandana', outfit: [0.3, 0.22, 0.18], beardChance: 0.8, apron: true },
    greet: ['Need {potion} for quenching. Hot, and heavy.', 'Forge is roaring. Bring me {potion}.'],
    pleased: ['Hah! That’s the stuff.', 'Good and solid.'], displeased: ['Too thin. Like my patience.', 'That won’t temper anything.'],
  },
  {
    key: 'noble', title: 'Noble', styles: ['tonic', 'elixir', 'arcane', 'lumen'], props: ['stability', 'color'], budget: 1.6, strict: 0.7, minRank: 2,
    look: { hat: 'crown', outfit: [0.5, 0.1, 0.25], beardChance: 0.3 },
    greet: ['I require {potion}, and the colour must be EXACT. I shall know.', 'My banquet demands {potion}. Spare no expense — but spare me mistakes.'],
    pleased: ['Exquisite. You may be presented at court.', 'Acceptable. More than acceptable.'], displeased: ['Vulgar. Simply vulgar.', 'Did you even look at the colour?'],
  },
  {
    key: 'wizard', title: 'Wizard', styles: ['arcane', 'fizzy', 'frost', 'lumen', 'panacea'], props: ['arcana', 'volatility', 'stability'], budget: 1.5, strict: 0.85, minRank: 2,
    look: { hat: 'wizard', outfit: [0.25, 0.2, 0.55], beardChance: 0.9 },
    greet: ['Ah, an apprentice of the Art. Prepare {potion} — the stars align tonight.', 'I seek {potion} with unusual properties. Impress me.'],
    pleased: ['The aether sings! Splendid.', 'Yes… yes! This will do.'], displeased: ['The aether is offended.', 'Mundane. Utterly mundane.'],
  },
  {
    key: 'hunter', title: 'Hunter', styles: ['tonic', 'heavy', 'salve', 'frost'], props: ['stability', 'volatility', 'temperature'], budget: 1.05, strict: 1.0, minRank: 1,
    look: { hat: 'hood', outfit: [0.3, 0.38, 0.22], beardChance: 0.5 },
    greet: ['Something that won’t spoil in my pack — {potion}.', 'Big game in the woods. I’ll need {potion}.'],
    pleased: ['Good. Steady as a held breath.', 'That’ll keep.'], displeased: ['It’s already separating.', 'Won’t last a day out there.'],
  },
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
