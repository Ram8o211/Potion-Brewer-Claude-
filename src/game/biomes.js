// The world's twelve biomes: six Natural and six Exotic.
//
// A biome's *identity* is permanent and data-driven (this table): its name,
// category, dominant effect, native creature, the minority effects its
// ingredients may carry, the sign of its Arcane thresholds, its touch
// interaction and the milestone that unlocks it. What a visit looks like —
// terrain, scenery, which species grow where and how many — is a
// *generation instance*, made from the biome's current generation seed
// (game/regen.js) and changed only by spending a Traveller Coin.
//
// Ids keep the region ids saves have always used (forest, meadow, river,
// quarry, netherwood, crags, moonfen); the five new exotic biomes add theirs.

/**
 * @typedef {'natural'|'exotic'} BiomeCategory
 * @typedef {Object} Unlock
 * @property {number} [rank]    guild rank reached (game/equipment.js RANKS)
 * @property {number} [served]  customers served
 * @property {number} [gathered] ml gathered in the wilds
 * @typedef {Object} BiomeDef
 * @property {string} id
 * @property {string} name
 * @property {BiomeCategory} category
 * @property {string} effect         dominant effect key
 * @property {string} creature       native creature id (game/creatures.js)
 * @property {string[]} minor        effects its species may carry besides the dominant one
 * @property {1|-1} arcaneSign       +1: its Arcane forms awaken in heat, −1: in cold
 * @property {string} interaction    the decorative touch interaction of its scene
 * @property {Unlock} unlock         milestone that opens it (all conditions)
 * @property {string} tier           the progression stage it belongs to
 * @property {string} icon           UI icon
 * @property {string} desc
 * @property {number[]} sky          palette seed for UI cards
 */

/** @type {BiomeDef[]} */
export const BIOMES = [
  { id: 'forest', name: 'Whisperwood', category: 'natural', effect: 'vitality', creature: 'fox', minor: ['frost', 'fire', 'toxicity', 'love', 'strength', 'swiftness', 'acidity'], arcaneSign: 1,
    interaction: 'sway', unlock: {}, tier: 'Apprentice', icon: 'leaf', sky: [0.36, 0.52, 0.42],
    desc: 'Old oaks, ferns and fruiting groves where healing magic grows thick. Home of the fox.' },
  { id: 'meadow', name: 'Sunlit Meadow', category: 'natural', effect: 'love', creature: 'hare', minor: ['fire', 'vitality', 'swiftness', 'acidity', 'strength'], arcaneSign: 1,
    interaction: 'sway', unlock: { served: 3 }, tier: 'Naturalist', icon: 'rose', sky: [0.55, 0.72, 0.9],
    desc: 'Open fields of wildflowers, heavy with love and summer warmth. Hares run in the long grass.' },
  { id: 'river', name: 'Willow Bank', category: 'natural', effect: 'frost', creature: 'otter', minor: ['vitality', 'death', 'acidity', 'toxicity', 'swiftness', 'strength'], arcaneSign: -1,
    interaction: 'sway', unlock: { served: 6 }, tier: 'Naturalist', icon: 'snow', sky: [0.5, 0.66, 0.78],
    desc: 'Cold riverbanks, lilies and pearl mussels under the willows. River otters fish the shallows.' },
  { id: 'quarry', name: 'Ironstone Quarry', category: 'natural', effect: 'strength', creature: 'beetle', minor: ['acidity', 'frost', 'fire', 'toxicity', 'death'], arcaneSign: 1,
    interaction: 'sway', unlock: { rank: 1 }, tier: 'Naturalist', icon: 'fist', sky: [0.62, 0.6, 0.58],
    desc: 'Cut rock faces, ore seams and geodes, rich in strength. Rock beetles graze the lichen.' },
  { id: 'netherwood', name: 'Netherwood', category: 'natural', effect: 'toxicity', creature: 'cavemoth', minor: ['death', 'acidity', 'frost', 'strength', 'swiftness'], arcaneSign: 1,
    interaction: 'sway', unlock: { rank: 2 }, tier: 'Adept', icon: 'skull', sky: [0.1, 0.12, 0.18],
    desc: 'An umbral forest in a cavern under the Whisperwood, lit by poisonous fungi. Cave moths flutter to its glow.' },
  { id: 'crags', name: 'Ember Crags', category: 'natural', effect: 'fire', creature: 'salamander', minor: ['strength', 'acidity', 'toxicity', 'swiftness', 'death'], arcaneSign: 1,
    interaction: 'sway', unlock: { rank: 2, served: 20 }, tier: 'Adept', icon: 'flame', sky: [0.42, 0.2, 0.16],
    desc: 'Volcanic heights where heat-blooming life grows over magma veins. Salamanders bask on the rock.' },
  { id: 'moonfen', name: 'Moonfen', category: 'exotic', effect: 'arcana', creature: 'wisp', minor: ['frost', 'death', 'love', 'invisibility', 'vitality'], arcaneSign: -1,
    interaction: 'ripple', unlock: { rank: 3 }, tier: 'Exotic Explorer', icon: 'eye', sky: [0.16, 0.18, 0.32],
    desc: 'Silver marshes under the moon. Will-o’-wisps flicker over the pools: touch their lights and spectral ripples run out.' },
  { id: 'skyshard', name: 'Skyshard Archipelago', category: 'exotic', effect: 'levitation', creature: 'cloudray', minor: ['swiftness', 'frost', 'arcana', 'vitality'], arcaneSign: 1,
    interaction: 'float', unlock: { rank: 3, served: 40 }, tier: 'Exotic Explorer', icon: 'feather', sky: [0.55, 0.78, 0.98],
    desc: 'Islands adrift in a crystalline sky. Drag or flick them: they bob back to where they float. Cloud rays glide between.' },
  { id: 'morphgrove', name: 'Morphgrove', category: 'exotic', effect: 'transformation', creature: 'mimic', minor: ['vitality', 'toxicity', 'love', 'arcana', 'swiftness'], arcaneSign: 1,
    interaction: 'morph', unlock: { rank: 4 }, tier: 'Exotic Explorer', icon: 'swirl', sky: [0.4, 0.3, 0.55],
    desc: 'A living grove of shifting, adaptive flora that changes shape under the finger. Mimic lizards hide in plain sight.' },
  { id: 'veilhollow', name: 'Veil Hollow', category: 'exotic', effect: 'invisibility', creature: 'shroudmoth', minor: ['death', 'frost', 'arcana', 'phasing'], arcaneSign: -1,
    interaction: 'mist', unlock: { rank: 4, served: 70 }, tier: 'Master Alchemist', icon: 'veil', sky: [0.3, 0.26, 0.42],
    desc: 'A shrouded hollow of resonant mist. Stir the mist and the scenery it hides shows through. Shroud moths drift unseen.' },
  { id: 'ghostglass', name: 'Ghostglass Reef', category: 'exotic', effect: 'phasing', creature: 'axolotl', minor: ['frost', 'arcana', 'invisibility', 'vitality', 'acidity'], arcaneSign: -1,
    interaction: 'phase', unlock: { rank: 5 }, tier: 'Master Alchemist', icon: 'ghost', sky: [0.08, 0.2, 0.36],
    desc: 'A submerged reef of spectral light and living crystal that turns clear at a touch. Spectral axolotls haunt it.' },
  { id: 'chronoglass', name: 'Chronoglass Wastes', category: 'exotic', effect: 'temporal', creature: 'scarab', minor: ['swiftness', 'fire', 'death', 'phasing', 'arcana'], arcaneSign: 1,
    interaction: 'time', unlock: { rank: 5, served: 120 }, tier: 'Master Alchemist', icon: 'clock', sky: [0.72, 0.6, 0.78],
    desc: 'Fractured timefields of crystal sand. Touch a sandfall and time runs backward or races. Hourglass scarabs roll there.' },
];

/** @type {Record<string, BiomeDef>} */
export const BIOME_BY_ID = Object.fromEntries(BIOMES.map((b) => [b.id, b]));
export const BIOME_IDS = BIOMES.map((b) => b.id);
export const START_BIOME = 'forest';

/** @param {string} id */
export const biomeOf = (id) => BIOME_BY_ID[id] || BIOME_BY_ID[START_BIOME];

/**
 * Is a biome's milestone met?
 * @param {BiomeDef} b @param {{rank:number, stats?:Record<string, number>}} st
 */
export function milestoneMet(b, st) {
  const u = b.unlock || {};
  const s = st.stats || {};
  if (u.rank !== undefined && st.rank < u.rank) return false;
  if (u.served !== undefined && (s.served || 0) < u.served) return false;
  if (u.gathered !== undefined && (s.gathered || 0) < u.gathered) return false;
  return true;
}

/** A short text of what opens a biome. @param {BiomeDef} b @param {string[]} rankNames */
export function unlockText(b, rankNames) {
  const u = b.unlock || {}, parts = [];
  if (u.rank) parts.push(`rank ${rankNames[u.rank] || u.rank}`);
  if (u.served) parts.push(`${u.served} customers served`);
  if (u.gathered) parts.push(`${u.gathered} ml gathered`);
  return parts.length ? parts.join(' and ') : 'open from the start';
}
