// Wild raw ingredients, their per-world reactions and the world's hidden
// resonance laws.
//
// Wild materials are gathered (or, for common ones, bought at a premium from
// the herbalist). Most are supplied *whole* — a rigid root, leaf bundle,
// mushroom or stone that the pestle (in the cauldron) or the mortar (before
// pouring) must break into powder before anything can dissolve. Their
// effects reach a potion only through extraction (see alchemy/effects.js).
//
// Everything here is generated from separate RNG streams ("wild:", "laws:")
// so adding it never changes the reagents an existing seed already had.

import { Rng } from '../core/rng.js';
import { hslToRgb } from '../core/color.js';
import { completeMaterial } from './schema.js';
import { EFFECT_INDEX } from '../alchemy/effects.js';
import { arcaneProfile } from './profiles.js';
import { identityOf } from '../visual/identity.js';

/** @typedef {import('./schema.js').MaterialDef} MaterialDef */

/**
 * Physical defaults of each family of wild ingredient (density, hardness,
 * solubility and its rise with heat, form and how it is gathered); a spec
 * only states what differs.
 */
const FAMILY_DEFAULTS = {
  herb: { form: 'solid', density: 0.72, hardness: 0.2, sol: 0.18, solT: 0.0014, gather: 'pick' },
  flower: { form: 'solid', density: 0.64, hardness: 0.15, sol: 0.2, solT: 0.0012, gather: 'pick' },
  root: { form: 'solid', density: 1.05, hardness: 0.45, sol: 0.12, solT: 0.002, gather: 'dig' },
  bark: { form: 'solid', density: 0.86, hardness: 0.4, sol: 0.12, solT: 0.002, gather: 'scrape' },
  fruit: { form: 'solid', density: 1, hardness: 0.14, sol: 0.21, solT: 0.0013, gather: 'pick' },
  fungus: { form: 'solid', density: 0.88, hardness: 0.24, sol: 0.17, solT: 0.0012, gather: 'pick' },
  moss: { form: 'solid', density: 0.78, hardness: 0.18, sol: 0.17, solT: 0.0012, gather: 'scrape' },
  reed: { form: 'solid', density: 0.7, hardness: 0.24, sol: 0.16, solT: 0.0015, gather: 'scrape' },
  crystal: { form: 'solid', density: 1.6, hardness: 0.65, sol: 0.09, solT: 0.002, gather: 'mine' },
  mineral: { form: 'solid', density: 1.7, hardness: 0.6, sol: 0.07, solT: 0.0025, gather: 'mine' },
  shell: { form: 'solid', density: 1.5, hardness: 0.55, sol: 0.08, solT: 0.002, gather: 'pick' },
  powder: { form: 'powder', density: 1.4, hardness: 0.3, sol: 0.2, solT: 0.0015, gather: 'sweep', friction: 0.62 },
};
/** Shape → family of its physical defaults. */
const SHAPE_FAMILY = {
  leaf: 'herb', sprig: 'herb', petal: 'flower', flower: 'flower', clover: 'flower', spike: 'flower', lily: 'flower', bellbloom: 'flower', bluebell: 'flower', puffbloom: 'flower',
  root: 'root', bark: 'bark', berry: 'fruit', bean: 'fruit', pepper: 'fruit', seed: 'fruit', apple: 'fruit', pear: 'fruit', plum: 'fruit', orb: 'fruit', teardrop: 'fruit', netpod: 'fruit', jelly: 'fruit',
  cap: 'fungus', toadstool: 'fungus', bracket: 'fungus', moss: 'moss', reed: 'reed',
  crystal: 'crystal', shard: 'crystal', icicle: 'crystal', stone: 'mineral', nugget: 'mineral', crust: 'powder', powder: 'powder', shell: 'shell', scale: 'shell',
};

/**
 * A wild archetype with its family's defaults filled in.
 * @param {string} region @param {any} o
 */
function sp(region, o) {
  const fam = FAMILY_DEFAULTS[SHAPE_FAMILY[o.shape] || 'herb'];
  return { rank: 0, buy: null, price: 10, ...fam, ...o, region };
}

/**
 * Wild archetypes, biome by biome. `shape` is the sprite (and the surface
 * texture of the whole ingredient in the cauldron), `region` the biome it
 * grows in, `buy` the herbalist's market tier (null = gather only).
 *
 * Every biome has one dominant effect, and every ingredient growing there
 * carries it as its main effect — the Whisperwood heals, the Meadow stirs
 * love, Willow Bank quickens, the Quarry strengthens, the Netherwood kills,
 * the Crags burn; the exotic biomes carry the exotic effects (arcana,
 * levitation, invisibility, transformation, storm, dream). Nothing in nature
 * is pure: each also carries one or two minority side effects, always on the
 * guild's opposing pairs — fire and frost, life and death (life also mends
 * poison), acid and alkali — and every biome grows ingredients whose sides
 * oppose one another, so a pure potion of its effect can be balanced from
 * that biome alone. No ingredient carries both halves of a pair. `steep` is
 * how its magic is drawn into a liquid (the extract keeps every effect of
 * the raw ingredient, in the same proportions). `late` ingredients hang from
 * boughs and roofs (vines and orchard fruit).
 */
export const WILD_SPECS = [
  // ---------------------------------------------------------------- Whisperwood: vitality
  sp('forest', { key: 'silverleaf', noun: 'Silverleaf', shape: 'leaf', buy: 1, hue: [150, 0.25, 0.7], fx: { vitality: 24, frost: 8 }, arc: [550, 3], price: 9,
    lore: 'Soft silvery leaves prized by healers. They heal, but leave a frosty bite that a warming herb must cancel. Gentle warmth draws out their healing.' }),
  sp('forest', { key: 'emberbark', noun: 'Emberbark', shape: 'bark', buy: 1, hue: [12, 0.55, 0.36], fx: { vitality: 20, fire: 9 }, arc: [560, 2.8], price: 8,
    steep: { name: 'Emberbark Tea', into: 'water', lo: [45, 50], hi: [85, 90] },
    lore: 'Resinous red bark of the old oaks. It mends and warms the blood — a warmth that something cool must cancel.' }),
  sp('forest', { key: 'ironroot', noun: 'Ironroot', shape: 'root', buy: 1, hue: [28, 0.45, 0.42], fx: { vitality: 22, acidity: -7 }, arc: [560, 3], price: 9,
    lore: 'A knotted woodland root that mends from within, earthy and faintly alkaline. Crush or grind it; it gives up far more when steeped in hot water.' }),
  sp('forest', { key: 'owlberry', noun: 'Owlberry', shape: 'berry', hue: [330, 0.55, 0.38], fx: { vitality: 18, acidity: 8 }, arc: [380, 3], price: 9,
    steep: { name: 'Owlberry Cordial', into: 'water', lo: [30, 35], hi: [65, 70] },
    lore: 'Dark berries the owls guard jealously: restorative, and sour enough to need something alkaline.' }),
  sp('forest', { key: 'foxglove', noun: 'Foxglove', shape: 'spike', hue: [300, 0.5, 0.62], fx: { vitality: 28, frost: 7, acidity: 5 }, arc: [420, 3], price: 14, dusk: true, rare: true,
    steep: { name: 'Foxglove Tincture', into: 'spirit', lo: [20, 25], hi: [55, 60] },
    lore: 'Purple bells that mend the heart, gathered at dusk: strong healing with a cold, bitter edge. Weigh every drop.' }),
  sp('forest', { key: 'woodsorrel', noun: 'Wood Sorrel', shape: 'clover', buy: 2, hue: [110, 0.45, 0.55], fx: { vitality: 16, fire: 6, acidity: 5 }, arc: [480, 3], price: 8, dawn: true,
    steep: { name: 'Sorrel Water', into: 'water', lo: [30, 35], hi: [70, 75] },
    lore: 'Little shamrock leaves that open at dawn: a sharp, warming tonic.' }),
  sp('forest', { key: 'emberapple', noun: 'Ember Apple', shape: 'apple', late: true, hue: [8, 0.75, 0.48], fx: { vitality: 20, fire: 8, acidity: 4 }, arc: [400, 3], price: 11,
    steep: { name: 'Ember Apple Cider', into: 'water', lo: [35, 40], hi: [65, 70] },
    lore: 'Red apples that warm the hand, hanging among the oak leaves. They heal and warm, with a sour tang that alkali tames.' }),
  sp('forest', { key: 'goldpear', noun: 'Gold Pear', shape: 'pear', late: true, hue: [52, 0.7, 0.58], fx: { vitality: 22, frost: 6 }, arc: [420, 3], price: 11,
    steep: { name: 'Gold Pear Nectar', into: 'water', lo: [30, 35], hi: [60, 65] },
    lore: 'Heavy golden pears on thin stalks. Gentle healing, with a cool bite that warmth cancels.' }),
  sp('forest', { key: 'duskplum', noun: 'Dusk Plum', shape: 'plum', late: true, hue: [285, 0.45, 0.4], fx: { vitality: 18, acidity: -6 }, arc: [380, 3], price: 12,
    steep: { name: 'Dusk Plum Syrup', into: 'water', lo: [30, 35], hi: [60, 65] },
    lore: 'Dark plums with a pale bloom: gently mending, with a soft alkaline note.' }),

  // ---------------------------------------------------------------- Sunlit Meadow: love
  sp('meadow', { key: 'heartpetal', noun: 'Heartpetal', shape: 'petal', buy: 1, hue: [335, 0.6, 0.72], fx: { love: 26, fire: 6 }, arc: null, price: 10,
    steep: { name: 'Heartpetal Infusion', into: 'water', lo: [30, 35], hi: [60, 65] },
    lore: 'Soft meadow petals carrying affection — and the flush of passion, a little fire that something cool must cancel. Warm water draws out their love; strong heat spoils them. Too delicate to hold awakened magic.' }),
  sp('meadow', { key: 'sunthistle', noun: 'Sunthistle', shape: 'flower', buy: 1, hue: [45, 0.8, 0.55], fx: { love: 16, fire: 10 }, arc: [520, 2.8], price: 9,
    steep: { name: 'Sunthistle Tea', into: 'water', lo: [40, 45], hi: [80, 85] },
    lore: 'A prickly golden flower that sets hearts racing: affection with a hot temper.' }),
  sp('meadow', { key: 'dreamclover', noun: 'Calmclover', shape: 'clover', hue: [205, 0.45, 0.62], fx: { love: 18, frost: 7 }, arc: [450, 3], price: 12, dawn: true,
    steep: { name: 'Calmclover Tea', into: 'water', lo: [30, 35], hi: [60, 65] },
    lore: 'A blue clover, open only at dawn: a cool, calm tenderness.' }),
  sp('meadow', { key: 'beebalm', noun: 'Bee Balm', shape: 'spike', buy: 2, hue: [300, 0.5, 0.6], fx: { love: 18, acidity: -7 }, arc: [480, 3], price: 12,
    steep: { name: 'Balm Tea', into: 'water', lo: [35, 40], hi: [70, 75] },
    lore: 'Shaggy purple flower-spikes humming with bees: a balm for the heart, with a soft alkaline aftertaste.' }),
  sp('meadow', { key: 'honeyapple', noun: 'Crab Apple', shape: 'apple', late: true, hue: [44, 0.8, 0.6], fx: { love: 20, acidity: 6 }, arc: [420, 3], price: 12,
    steep: { name: 'Crab Apple Cordial', into: 'water', lo: [30, 35], hi: [60, 65] },
    lore: 'Little sour apples of the meadow hedges, given by sweethearts.' }),
  sp('meadow', { key: 'pearlpuff', noun: 'Pearlpuff', shape: 'puffbloom', late: true, hue: [48, 0.25, 0.86], glow: 0.9, fx: { love: 16, acidity: -5, frost: 4 }, arc: [430, 3], price: 15,
    steep: { name: 'Pearlpuff Milk', into: 'water', lo: [25, 30], hi: [55, 60] },
    lore: 'Creamy blossoms that cluster in puffs in the vines over the meadow: soothing and faintly alkaline.' }),
  sp('meadow', { key: 'rosebell', noun: 'Rosebell', shape: 'bellbloom', late: true, rare: true, hue: [330, 0.6, 0.6], glow: 0.9, fx: { love: 24, frost: 6 }, arc: null, price: 14,
    steep: { name: 'Rosebell Infusion', into: 'water', lo: [30, 35], hi: [65, 70] },
    lore: 'Pink bells that nod from the hanging vines. Deep affection with a cool breath; too delicate to hold any awakening magic.' }),
  sp('meadow', { key: 'honeydrop', noun: 'Honeydrop', shape: 'teardrop', late: true, hue: [50, 0.8, 0.62], glow: 0.9, fx: { love: 22, fire: 5, acidity: -4 }, arc: [400, 3], price: 14,
    steep: { name: 'Honeydrop Syrup', into: 'water', lo: [30, 35], hi: [60, 65] },
    lore: 'Sticky glowing drops of honey-sap: sweet affection, warm and faintly alkaline.' }),

  // ---------------------------------------------------------------- Willow Bank: swiftness
  sp('river', { key: 'reedmace', noun: 'Reedmace', shape: 'reed', buy: 1, hue: [26, 0.5, 0.3], fx: { swiftness: 22, acidity: -6 }, arc: [520, 2.8], price: 8,
    steep: { name: 'Reed Pith Broth', into: 'water', lo: [35, 40], hi: [80, 85] },
    lore: 'Brown velvet heads on tall stems that bend and spring back in the current. The pith quickens the step; chalky, alkaline.' }),
  sp('river', { key: 'willowbark', noun: 'Willow Bark', shape: 'bark', buy: 1, hue: [60, 0.18, 0.55], fx: { swiftness: 18, frost: 8 }, arc: [560, 2.6], price: 7,
    steep: { name: 'Willow Tea', into: 'water', lo: [40, 45], hi: [80, 85] },
    lore: 'Pale bark of the riverside willows: it lightens the feet and cools the blood.' }),
  sp('river', { key: 'bogbean', noun: 'Bogbean', shape: 'bean', hue: [95, 0.4, 0.42], fx: { swiftness: 16, acidity: 8 }, arc: [400, 2.5], price: 7,
    steep: { name: 'Bogbean Broth', into: 'water', lo: [40, 45], hi: [80, 85] },
    lore: 'A marsh bean that puts a spring in the step — sour with bog acid unless something alkaline settles it.' }),
  sp('river', { key: 'riverchalk', noun: 'River Chalk', shape: 'stone', buy: 1, hue: [48, 0.22, 0.82], density: 1.32, hardness: 0.35, sol: 0.06, solT: 0.0005, binder: 0.55, friction: 0.7, gather: 'dig',
    fx: { swiftness: 16, acidity: -13 }, arc: [350, 2.5], price: 6,
    steep: { name: 'Chalk Milk', into: 'water', lo: [15, 20], hi: [60, 65] },
    lore: 'Soft, strongly alkaline chalk from the bank, with a little of the river’s quickness. It neutralises acids. A little water kneads it into a paste.' }),
  sp('river', { key: 'frostcap', noun: 'Frostcap', shape: 'cap', buy: 2, hue: [196, 0.5, 0.72], fx: { swiftness: 18, frost: 9 }, arc: [520, 2.8], price: 10,
    steep: { name: 'Frostcap Brine', into: 'water', lo: [1, 2], hi: [12, 14] },
    lore: 'A cool mushroom growing beneath the willows. It steeps only in ice-cold water, giving a quick, freezing brine.' }),
  sp('river', { key: 'riverpearl', noun: 'River Pearl', shape: 'shell', hue: [210, 0.15, 0.85], density: 1.6, fx: { swiftness: 18, acidity: -9 }, arc: [560, 3], price: 14,
    steep: { name: 'Nacre Milk', into: 'water', lo: [50, 55], hi: [85, 90] },
    lore: 'Mussel shells lined with mother-of-pearl. Ground and simmered, the nacre gives quickness — and an alkaline milk.' }),
  sp('river', { key: 'streamorb', noun: 'Streamorb', shape: 'orb', late: true, hue: [165, 0.6, 0.55], glow: 0.9, fx: { swiftness: 20, fire: 6 }, arc: [420, 3], price: 11,
    steep: { name: 'Streamorb Cordial', into: 'water', lo: [25, 30], hi: [55, 60] },
    lore: 'Glowing teal bubbles on the vines over the river: quick and warm.' }),
  sp('river', { key: 'pondjelly', noun: 'Pond Jelly', shape: 'jelly', late: true, hue: [195, 0.8, 0.58], glow: 0.9, gather: 'scrape', fx: { swiftness: 18, fire: 7, toxicity: 3 }, arc: [440, 3], price: 13,
    steep: { name: 'Pond Jelly Broth', into: 'water', lo: [10, 15], hi: [40, 45] },
    lore: 'Pale blue jellies that dart on their threads above the river, glowing softly: quick, warm and faintly bitter.' }),
  sp('river', { key: 'glimmerdrop', noun: 'Glimmerdrop', shape: 'icicle', late: true, rare: true, hue: [190, 0.7, 0.62], glow: 0.9, fx: { swiftness: 22, frost: 5, acidity: 4 }, arc: [480, 3], price: 16,
    steep: { name: 'Glimmerdrop Tincture', into: 'spirit', lo: [20, 25], hi: [55, 60] },
    lore: 'Pale blue crystal drops that grow on threads from the riverbank’s overhangs: swift as running water, cold and sharp.' }),

  // ---------------------------------------------------------------- Ironstone Quarry: strength
  sp('quarry', { key: 'lodestone', noun: 'Lodestone', shape: 'nugget', buy: 1, hue: [220, 0.08, 0.3], density: 2.4, hardness: 0.75, fx: { strength: 24, frost: 6 }, arc: [760, 2.6], price: 12,
    steep: { name: 'Rust Water', into: 'water', lo: [70, 75], hi: [150, 160] },
    lore: 'A heavy, magnetic black nugget. Its iron gives great strength and a cold, metallic edge.' }),
  sp('quarry', { key: 'emberflint', noun: 'Ember Flint', shape: 'stone', buy: 1, hue: [16, 0.62, 0.55], fx: { strength: 18, fire: 10 }, arc: [820, 2.5], price: 11,
    steep: { name: 'Flint Fire-Water', into: 'water', lo: [80, 85], hi: [160, 170] },
    lore: 'A warm flint that releases strength, and a spark of fire with it, when ground. It barely dissolves unless the water is near boiling.' }),
  sp('quarry', { key: 'nettle', noun: 'Nettle', shape: 'sprig', buy: 1, hue: [105, 0.5, 0.4], fx: { strength: 16, acidity: 10 }, arc: [560, 3], price: 7,
    steep: { name: 'Nettle Tea', into: 'water', lo: [45, 50], hi: [85, 90] },
    lore: 'Stinging nettles on the spoil heaps. Steeped hot they give strength, and the sting of their acid — chalk or another alkali settles it.' }),
  sp('quarry', { key: 'mica', noun: 'Mica Dust', shape: 'powder', buy: 1, hue: [270, 0.25, 0.75], density: 1.22, binder: 0.4, friction: 0.66, sol: 0.16, solT: 0.001, fx: { strength: 14, acidity: -10 }, arc: [500, 3], price: 7,
    steep: { name: 'Mica Shimmer', into: 'water', lo: [40, 45], hi: [85, 90] },
    lore: 'Loose glittering grains of stony strength, alkaline. Knead with a little water for dough; warm plenty of water with it for a shimmering infusion.' }),
  sp('quarry', { key: 'saltpetre', noun: 'Saltpetre', shape: 'crust', buy: 2, hue: [190, 0.12, 0.88], density: 1.9, sol: 0.3, solT: 0.004, friction: 0.6, fx: { strength: 14, frost: 9 }, arc: [540, 2.6], price: 6,
    lore: 'Cold white crystals that bloom on cave walls. They dissolve readily and chill whatever they touch.' }),
  sp('quarry', { key: 'sulfur', noun: 'Sulphur Crust', shape: 'powder', buy: 2, hue: [56, 0.85, 0.6], sol: 0.22, gather: 'mine', fx: { strength: 17, acidity: 12, fire: 4 }, arc: [500, 2.5], price: 10,
    steep: { name: 'Sulphur Water', into: 'water', lo: [50, 55], hi: [95, 100] },
    lore: 'A crumbly yellow crust: a little strength and a lot of acid. Hot water dissolves it into a biting liquor.' }),
  sp('quarry', { key: 'cinnabar', noun: 'Cinnabar', shape: 'crystal', hue: [358, 0.7, 0.42], density: 2.2, hardness: 0.5, sol: 0.08, fx: { strength: 22, toxicity: 8, fire: 4 }, arc: [620, 2.8], price: 15,
    steep: { name: 'Cinnabar Tincture', into: 'spirit', lo: [30, 35], hi: [60, 65] },
    lore: 'Blood-red crystals of quicksilver ore. Powerful strength, but poisonous; it dissolves in warm spirits.' }),
  sp('quarry', { key: 'obsidian', noun: 'Obsidian', shape: 'shard', rare: true, hue: [265, 0.3, 0.16], density: 2.35, hardness: 0.8, sol: 0.06, fx: { strength: 28, fire: 6, death: 4 }, arc: [900, 2.6], price: 30,
    steep: { name: 'Obsidian Water', into: 'water', lo: [75, 80], hi: [150, 160] },
    lore: 'Black volcanic glass with an edge like a razor: unyielding strength, a smouldering heat and a whisper of death.' }),

  // ---------------------------------------------------------------- Netherwood: death
  sp('netherwood', { key: 'witchear', noun: 'Witch’s Ear', shape: 'bracket', buy: 2, hue: [32, 0.35, 0.3], gather: 'scrape', fx: { death: 20, frost: 6 }, arc: [420, 3], price: 13,
    steep: { name: 'Witch’s Ear Broth', into: 'water', lo: [25, 30], hi: [60, 65] },
    lore: 'A leathery shelf fungus that grows on dead oaks, carrying the dead tree’s chill of decay.' }),
  sp('netherwood', { key: 'mandrake', noun: 'Mandrake', shape: 'root', rare: true, hue: [38, 0.5, 0.6], density: 1.15, fx: { death: 26, toxicity: 8, fire: 4 }, arc: [420, 3], price: 28,
    lore: 'A rare screaming root that kills with a cry, with a poisonous skin. Old grimoires say it wakes fully only in warm spirits.' }),
  sp('netherwood', { key: 'gravemoss', noun: 'Grave Moss', shape: 'moss', dusk: true, hue: [150, 0.12, 0.45], fx: { death: 24, frost: 8, toxicity: 5 }, arc: [480, 2.5], price: 18,
    steep: { name: 'Barrow Draught', into: 'water', lo: [-5, 0], hi: [10, 12] },
    lore: 'Moss from old barrows, heavy with death magic, scraped at dusk. It steeps only in near-freezing water.' }),
  sp('netherwood', { key: 'hemlock', noun: 'Hemlock Seed', shape: 'seed', buy: 2, dusk: true, hue: [70, 0.25, 0.5], density: 1.1, hardness: 0.35, fx: { death: 20, frost: 7 }, arc: [450, 2.6], price: 12,
    steep: { name: 'Hemlock Draught', into: 'water', lo: [20, 25], hi: [50, 55] },
    lore: 'Ribbed grey seeds of the spotted hemlock, gathered at dusk: a cold, creeping death.' }),
  sp('netherwood', { key: 'bloodnet', noun: 'Bloodnet', shape: 'netpod', late: true, rare: true, hue: [355, 0.6, 0.52], glow: 0.9, fx: { death: 18, fire: 7 }, arc: [380, 3], price: 15,
    steep: { name: 'Bloodnet Tincture', into: 'spirit', lo: [30, 35], hi: [60, 65] },
    lore: 'Red netted pods, heavy and warm, that sweat a deadly sap.' }),
  sp('netherwood', { key: 'embertear', noun: 'Embertear', shape: 'teardrop', late: true, hue: [28, 0.9, 0.55], glow: 0.9, fx: { death: 16, fire: 9, acidity: 5 }, arc: [520, 3], price: 16,
    steep: { name: 'Embertear Draught', into: 'spirit', lo: [40, 45], hi: [75, 80] },
    lore: 'Amber teardrops of molten sap that never quite fall from the Netherwood’s roof: a burning, sour death.' }),
  sp('netherwood', { key: 'gloompear', noun: 'Gloom Pear', shape: 'pear', late: true, hue: [250, 0.4, 0.68], glow: 0.6, fx: { death: 18, acidity: -6 }, arc: [450, 3], price: 16,
    steep: { name: 'Gloom Pear Nectar', into: 'water', lo: [20, 25], hi: [50, 55] },
    lore: 'Pale pears that glow among the black leaves of the Netherwood: a quiet, alkaline death.' }),
  sp('netherwood', { key: 'umbercrystal', noun: 'Umber Crystal', shape: 'icicle', late: true, rare: true, hue: [275, 0.5, 0.6], glow: 0.9, fx: { death: 22, frost: 5, acidity: -4 }, arc: [470, 3], price: 19,
    steep: { name: 'Umber Tincture', into: 'spirit', lo: [20, 25], hi: [55, 60] },
    lore: 'Violet crystals glowing from the Netherwood’s roots: a grave chill.' }),

  // ---------------------------------------------------------------- Ember Crags: fire
  sp('crags', { key: 'dragonpepper', noun: 'Dragon Pepper', shape: 'pepper', buy: 2, hue: [4, 0.8, 0.5], fx: { fire: 30, toxicity: 5 }, arc: [850, 2.6], price: 22,
    lore: 'A furious red pepper from the crags with a poisonous sting. Its fire loves oil.' }),
  sp('crags', { key: 'cinderscale', noun: 'Cinder Scale', shape: 'scale', rare: true, hue: [24, 0.7, 0.4], density: 1.45, hardness: 0.6, sol: 0.07, solT: 0.003, econd: 0.3, charge: 0.4, gather: 'mine',
    fx: { fire: 24, acidity: 8 }, arc: [1000, 2.6], price: 34,
    steep: { name: 'Salamander Essence', into: 'oil', lo: [140, 150], hi: [300, 320] },
    lore: 'A shed salamander scale, warm to the touch. Only fierce heat — hot oil, not water — dissolves it.' }),
  sp('crags', { key: 'ashbloom', noun: 'Ashbloom', shape: 'lily', hue: [20, 0.85, 0.6], glow: 0.3, fx: { fire: 22, acidity: -6 }, arc: [560, 2.8], price: 20,
    steep: { name: 'Ashbloom Tea', into: 'water', lo: [45, 50], hi: [85, 90] },
    lore: 'A flower that blooms in warm ash after an eruption: it burns, with a smoky alkaline note.' }),
  sp('crags', { key: 'emberglass', noun: 'Ember Glass', shape: 'shard', hue: [18, 0.75, 0.5], fx: { fire: 26, acidity: -8 }, arc: [880, 2.6], price: 24,
    steep: { name: 'Ember Glass Water', into: 'water', lo: [75, 80], hi: [150, 160] },
    lore: 'Orange glass blown by the vents, still glowing inside: fierce heat and a chalky bite.' }),
  sp('crags', { key: 'brimstone', noun: 'Brimstone', shape: 'crust', buy: 2, hue: [48, 0.9, 0.55], gather: 'mine', fx: { fire: 18, acidity: 12 }, arc: [600, 2.5], price: 12,
    lore: 'Yellow crust round the steam vents: fire and a sharp acid.' }),
  sp('crags', { key: 'cinderberry', noun: 'Cinderberry', shape: 'berry', hue: [14, 0.8, 0.45], fx: { fire: 20, toxicity: 6 }, arc: [620, 2.8], price: 16,
    steep: { name: 'Cinderberry Cordial', into: 'water', lo: [45, 50], hi: [85, 90] },
    lore: 'Black-red berries that ripen on warm ash: burning, and a little poisonous — something healing mends the bite.' }),
  sp('crags', { key: 'ashmoss', noun: 'Ash Moss', shape: 'moss', hue: [10, 0.25, 0.32], fx: { fire: 16, death: 6 }, arc: [580, 2.8], price: 14,
    lore: 'Grey moss creeping over the cinders, smouldering softly: heat with a breath of the grave.' }),

  // ---------------------------------------------------------------- Moonfen (exotic): arcana — cold magic, awakened by chill
  sp('moonfen', { key: 'starquartz', noun: 'Star Quartz', shape: 'crystal', hue: [280, 0.45, 0.78], density: 1.5, glow: 0.5, fx: { arcana: 26, frost: 6 }, arc: [-400, 3], price: 30,
    lore: 'A luminous crystal of insight, cool to the touch. Crush it, then warm it in spirits.' }),
  sp('moonfen', { key: 'wisplichen', noun: 'Wisp Lichen', shape: 'moss', hue: [172, 0.6, 0.6], glow: 0.7, fx: { arcana: 28, frost: 7, toxicity: 4 }, arc: [-250, 3], price: 24,
    steep: { name: 'Lichen Glow', into: 'water', lo: [15, 20], hi: [45, 50] },
    lore: 'A faintly glowing lichen that the wisps feed on, cold and a little poisonous. Lukewarm water draws out its light.' }),
  sp('moonfen', { key: 'moonlily', noun: 'Moonlily', shape: 'lily', dawn: true, hue: [240, 0.3, 0.86], glow: 0.4, fx: { arcana: 22, acidity: -6 }, arc: [-300, 3], price: 22,
    steep: { name: 'Moonlily Dew', into: 'water', lo: [10, 15], hi: [40, 45] },
    lore: 'A pale lily that opens to the moon and closes at sunrise; gather it at dawn. Clear sight, faintly alkaline.' }),
  sp('moonfen', { key: 'sirenreed', noun: 'Siren Reed', shape: 'reed', dusk: true, hue: [180, 0.35, 0.5], fx: { arcana: 20, frost: 8 }, arc: [-200, 3], price: 20,
    steep: { name: 'Siren Water', into: 'water', lo: [15, 20], hi: [45, 50] },
    lore: 'Reeds that sing to travellers at dusk. Their pith opens the mind, coldly.' }),
  sp('moonfen', { key: 'duskbell', noun: 'Duskbell', shape: 'bluebell', late: true, dusk: true, hue: [255, 0.4, 0.72], glow: 0.9, fx: { arcana: 20, fire: 6 }, arc: [-500, 2.5], price: 20,
    steep: { name: 'Duskbell Tea', into: 'water', lo: [10, 15], hi: [40, 45] },
    lore: 'Lavender bells that ring only at dusk, trailing from the fen’s overhangs. They sharpen the mind, with a strange warmth.' }),
  sp('moonfen', { key: 'moonpuff', noun: 'Moon Lantern', shape: 'bellbloom', late: true, hue: [215, 0.35, 0.8], glow: 0.9, fx: { arcana: 18, acidity: 5, frost: 4 }, arc: [-480, 2.5], price: 20,
    steep: { name: 'Moonpuff Milk', into: 'water', lo: [10, 15], hi: [40, 45] },
    lore: 'Silver-white lantern flowers hanging in the fen’s vines: insight, sharp and cool.' }),
  sp('moonfen', { key: 'driftjelly', noun: 'Drift Jelly', shape: 'jelly', late: true, rare: true, hue: [205, 0.75, 0.6], glow: 0.9, gather: 'scrape', fx: { arcana: 22, acidity: 6 }, arc: [-450, 2.5], price: 22,
    steep: { name: 'Drift Jelly Broth', into: 'water', lo: [0, 5], hi: [30, 35] },
    lore: 'Blue bells of living jelly that drift on their threads in the fen’s dark: raw magic with a sour sting.' }),

  // ---------------------------------------------------------------- Skydrift Isles (exotic): levitation — wakes in the cold wind
  sp('skydrift', { key: 'cloudcap', noun: 'Cloudcap', shape: 'cap', hue: [210, 0.25, 0.92], glow: 0.2, fx: { levitation: 24, frost: 7 }, arc: [-150, 3], price: 22,
    steep: { name: 'Cloudcap Broth', into: 'water', lo: [15, 20], hi: [50, 55] },
    lore: 'A puffy white mushroom so light it tugs at its own stalk. Cool as the high wind.' }),
  sp('skydrift', { key: 'featherfern', noun: 'Featherfern', shape: 'leaf', hue: [80, 0.45, 0.62], fx: { levitation: 20, fire: 6 }, arc: [-120, 3], price: 18,
    steep: { name: 'Featherfern Tea', into: 'water', lo: [30, 35], hi: [65, 70] },
    lore: 'Fronds as light as down that curl up in the sun: lightness, and a sunny warmth.' }),
  sp('skydrift', { key: 'skypetal', noun: 'Skypetal', shape: 'petal', hue: [200, 0.6, 0.78], fx: { levitation: 18, acidity: -6 }, arc: [-180, 3], price: 18,
    steep: { name: 'Skypetal Infusion', into: 'water', lo: [25, 30], hi: [55, 60] },
    lore: 'Sky-blue petals that drift off their flower at a breath. Soft and alkaline.' }),
  sp('skydrift', { key: 'windseed', noun: 'Windseed', shape: 'seed', hue: [50, 0.3, 0.82], fx: { levitation: 22, acidity: 7 }, arc: [-140, 3], price: 20,
    lore: 'Silky seeds that ride the updraughts between the isles, tart on the tongue.' }),
  sp('skydrift', { key: 'driftstone', noun: 'Driftstone', shape: 'stone', hue: [30, 0.15, 0.72], density: 0.9, fx: { levitation: 26, frost: 5, acidity: -4 }, arc: [-220, 3], price: 26,
    steep: { name: 'Driftstone Water', into: 'water', lo: [60, 65], hi: [95, 100] },
    lore: 'A pale, airy pumice that floats in water and almost in air: lightness itself, cool and chalky.' }),
  sp('skydrift', { key: 'galeberry', noun: 'Galeberry', shape: 'orb', late: true, hue: [45, 0.75, 0.68], glow: 0.7, fx: { levitation: 18, fire: 8 }, arc: [-160, 3], price: 20,
    steep: { name: 'Galeberry Cordial', into: 'water', lo: [25, 30], hi: [55, 60] },
    lore: 'Golden bubbles of fruit that float on their threads under the isles: light and warming.' }),
  sp('skydrift', { key: 'zephyrcrystal', noun: 'Zephyr Crystal', shape: 'icicle', late: true, rare: true, hue: [190, 0.4, 0.88], glow: 0.9, fx: { levitation: 28, fire: 5, toxicity: 3 }, arc: [-250, 3], price: 34,
    steep: { name: 'Zephyr Tincture', into: 'spirit', lo: [15, 20], hi: [50, 55] },
    lore: 'Clear crystals hanging from the isles’ roots, humming in the wind: pure lift.' }),

  // ---------------------------------------------------------------- Veilmist Glade (exotic): invisibility
  sp('veilmist', { key: 'ghostleaf', noun: 'Ghostleaf', shape: 'leaf', hue: [190, 0.12, 0.88], fx: { invisibility: 24, frost: 7 }, arc: [380, 3], price: 22,
    steep: { name: 'Ghostleaf Infusion', into: 'water', lo: [35, 40], hi: [70, 75] },
    lore: 'Leaves so pale you see the veins of the next leaf through them. Cool and quiet.' }),
  sp('veilmist', { key: 'veilmoss', noun: 'Veil Moss', shape: 'moss', hue: [200, 0.1, 0.74], fx: { invisibility: 20, acidity: -6 }, arc: [420, 3], price: 18,
    steep: { name: 'Veil Moss Broth', into: 'water', lo: [30, 35], hi: [70, 75] },
    lore: 'A grey moss that hangs like mist from the glade’s stones, faintly alkaline.' }),
  sp('veilmist', { key: 'glasscap', noun: 'Glasscap', shape: 'toadstool', hue: [180, 0.25, 0.82], glow: 0.3, fx: { invisibility: 22, fire: 6 }, arc: [460, 3], price: 22,
    steep: { name: 'Glasscap Broth', into: 'water', lo: [40, 45], hi: [80, 85] },
    lore: 'A toadstool of clear jelly: only its spots show. Warm to the touch.' }),
  sp('veilmist', { key: 'mistlily', noun: 'Mistlily', shape: 'lily', dawn: true, hue: [230, 0.15, 0.92], glow: 0.4, fx: { invisibility: 26, frost: 6, death: 3 }, arc: [350, 3], price: 26,
    steep: { name: 'Mistlily Dew', into: 'water', lo: [20, 25], hi: [50, 55] },
    lore: 'A white lily that is only there at dawn, while the mist lies on the glade.' }),
  sp('veilmist', { key: 'hushberry', noun: 'Hushberry', shape: 'berry', hue: [260, 0.18, 0.7], fx: { invisibility: 18, acidity: 7 }, arc: [400, 3], price: 18,
    steep: { name: 'Hushberry Cordial', into: 'water', lo: [30, 35], hi: [65, 70] },
    lore: 'Pale lilac berries that fade as they ripen: sour, and quiet as a held breath.' }),
  sp('veilmist', { key: 'clearquartz', noun: 'Clear Quartz', shape: 'crystal', rare: true, hue: [200, 0.08, 0.95], glow: 0.4, fx: { invisibility: 28, fire: 5 }, arc: [520, 3], price: 34,
    lore: 'Quartz so clear it is found by touch. Crush it, then warm it.' }),
  sp('veilmist', { key: 'shadeorb', noun: 'Shade Orb', shape: 'orb', late: true, hue: [240, 0.2, 0.6], glow: 0.6, fx: { invisibility: 18, toxicity: 5, fire: 4 }, arc: [400, 3], price: 20,
    steep: { name: 'Shade Orb Cordial', into: 'water', lo: [25, 30], hi: [55, 60] },
    lore: 'Smoky bubbles hanging in the mist that blink in and out of sight.' }),

  // ---------------------------------------------------------------- Shifting Reef (exotic): transformation
  sp('reef', { key: 'polypcap', noun: 'Polyp Cap', shape: 'toadstool', hue: [5, 0.75, 0.55], fx: { transformation: 22, fire: 6 }, arc: [420, 3], price: 22,
    steep: { name: 'Polyp Broth', into: 'water', lo: [30, 35], hi: [65, 70] },
    lore: 'A spotted reef polyp that never keeps one colour for long. It changes whoever eats it — warmly.' }),
  sp('reef', { key: 'prismshell', noun: 'Prism Shell', shape: 'shell', hue: [300, 0.5, 0.78], fx: { transformation: 24, acidity: -8 }, arc: [560, 3], price: 24,
    steep: { name: 'Prism Milk', into: 'water', lo: [50, 55], hi: [85, 90] },
    lore: 'A shell lined with shifting rainbows. Ground and simmered it gives change, and an alkaline milk.' }),
  sp('reef', { key: 'shiftweed', noun: 'Shiftweed', shape: 'reed', hue: [160, 0.55, 0.5], fx: { transformation: 18, frost: 7 }, arc: [450, 3], price: 18,
    steep: { name: 'Shiftweed Broth', into: 'water', lo: [20, 25], hi: [55, 60] },
    lore: 'Ribbons of weed that sway in no wind and change from green to blue to gold. Cool to the touch.' }),
  sp('reef', { key: 'anemone', noun: 'Anemone', shape: 'bellbloom', hue: [330, 0.7, 0.62], glow: 0.4, fx: { transformation: 20, toxicity: 6 }, arc: [480, 3], price: 22,
    steep: { name: 'Anemone Tincture', into: 'spirit', lo: [25, 30], hi: [55, 60] },
    lore: 'A stinging flower of the reef that closes at a touch and opens a new colour. A little poisonous.' }),
  sp('reef', { key: 'chromascale', noun: 'Chroma Scale', shape: 'scale', hue: [170, 0.6, 0.55], density: 1.4, fx: { transformation: 26, acidity: 6, fire: 3 }, arc: [620, 2.8], price: 28,
    steep: { name: 'Chroma Essence', into: 'water', lo: [60, 65], hi: [95, 100] },
    lore: 'A shed newt scale that flashes every colour as you turn it: deep change, sharp and warm.' }),
  sp('reef', { key: 'morphjelly', noun: 'Morph Jelly', shape: 'jelly', late: true, hue: [280, 0.7, 0.62], glow: 0.9, gather: 'scrape', fx: { transformation: 20, frost: 6 }, arc: [440, 3], price: 22,
    steep: { name: 'Morph Jelly Broth', into: 'water', lo: [10, 15], hi: [40, 45] },
    lore: 'Jellies drifting over the reef on threads, never the same shape twice: change, and a chill.' }),
  sp('reef', { key: 'tidecrystal', noun: 'Tide Crystal', shape: 'crystal', rare: true, hue: [185, 0.55, 0.62], glow: 0.5, fx: { transformation: 28, frost: 4, acidity: -4 }, arc: [600, 3], price: 34,
    lore: 'A crystal that grows in rings like the tide: deep, cool change.' }),

  // ---------------------------------------------------------------- Stormspire (exotic): storm — wakes in fierce heat
  sp('stormspire', { key: 'stormglass', noun: 'Storm Glass', shape: 'shard', rare: true, hue: [222, 0.55, 0.7], density: 1.9, econd: 0.6, charge: 1, glow: 0.3, fx: { storm: 26, fire: 6 }, arc: [700, 3], price: 30,
    lore: 'Glass struck by lightning: it still holds a charge that flows into anything that conducts.' }),
  sp('stormspire', { key: 'thundercap', noun: 'Thundercap', shape: 'cap', hue: [230, 0.35, 0.5], fx: { storm: 20, frost: 7 }, arc: [650, 3], price: 20,
    steep: { name: 'Thundercap Broth', into: 'water', lo: [45, 50], hi: [85, 90] },
    lore: 'A slate-blue mushroom that crackles when picked: storm and the cold of the rain.' }),
  sp('stormspire', { key: 'boltroot', noun: 'Boltroot', shape: 'root', hue: [55, 0.45, 0.55], fx: { storm: 22, acidity: 8 }, arc: [720, 2.8], price: 22,
    steep: { name: 'Boltroot Extract', into: 'water', lo: [60, 65], hi: [95, 100] },
    lore: 'A forked yellow root that grows where lightning struck: sharp and sour.' }),
  sp('stormspire', { key: 'sparkmoss', noun: 'Spark Moss', shape: 'moss', hue: [205, 0.5, 0.55], glow: 0.4, fx: { storm: 18, fire: 7 }, arc: [680, 3], price: 18,
    lore: 'A moss that glitters with static on the spire stones: storm and a scorch.' }),
  sp('stormspire', { key: 'voltstone', noun: 'Voltstone', shape: 'nugget', hue: [215, 0.25, 0.42], density: 2.2, econd: 0.5, charge: 0.6, fx: { storm: 24, acidity: -7 }, arc: [760, 2.6], price: 26,
    steep: { name: 'Volt Water', into: 'water', lo: [70, 75], hi: [100, 110] },
    lore: 'A heavy, humming nugget that makes your hair stand up: storm and a chalky bite.' }),
  sp('stormspire', { key: 'cloudberry', noun: 'Rainberry', shape: 'berry', hue: [232, 0.5, 0.56], fx: { storm: 16, frost: 6, acidity: -3 }, arc: [640, 3], price: 16,
    steep: { name: 'Rainberry Cordial', into: 'water', lo: [40, 45], hi: [80, 85] },
    lore: 'Blue berries heavy with rain that fizz on the tongue: storm and cold.' }),
  sp('stormspire', { key: 'skyiron', noun: 'Sky Iron', shape: 'crystal', rare: true, hue: [205, 0.35, 0.6], glow: 0.5, density: 2.4, econd: 0.6, charge: 0.8, fx: { storm: 30, fire: 5, toxicity: 4 }, arc: [780, 2.8], price: 36,
    lore: 'Star-metal from a fallen bolt: the heart of the storm.' }),

  // ---------------------------------------------------------------- Dreamspire Hollow (exotic): dream — wakes in the cold of night
  sp('dreamspire', { key: 'sleeppoppy', noun: 'Sleep Poppy', shape: 'flower', hue: [345, 0.65, 0.6], fx: { dream: 24, fire: 5 }, arc: [-300, 3], price: 22,
    steep: { name: 'Poppy Milk', into: 'water', lo: [25, 30], hi: [60, 65] },
    lore: 'Heavy-headed poppies that nod off in the afternoon: deep sleep, warm as a blanket.' }),
  sp('dreamspire', { key: 'slumbermoss', noun: 'Slumber Moss', shape: 'moss', hue: [280, 0.25, 0.6], fx: { dream: 22, acidity: -6 }, arc: [-350, 3], price: 20,
    steep: { name: 'Slumber Broth', into: 'water', lo: [15, 20], hi: [50, 55] },
    lore: 'A soft lilac moss that makes a perfect pillow: dreams, and a soft alkaline note.' }),
  sp('dreamspire', { key: 'nightbloom', noun: 'Nightbloom', shape: 'lily', dusk: true, hue: [265, 0.5, 0.7], glow: 0.5, fx: { dream: 26, frost: 7 }, arc: [-400, 3], price: 26,
    steep: { name: 'Nightbloom Dew', into: 'water', lo: [10, 15], hi: [40, 45] },
    lore: 'A violet lily that opens only at dusk and dreams of the moon. Cold as a clear night.' }),
  sp('dreamspire', { key: 'moonpetal', noun: 'Moonpetal', shape: 'petal', hue: [310, 0.45, 0.8], fx: { dream: 20, fire: 6, death: 2 }, arc: [-280, 3], price: 20,
    steep: { name: 'Moonpetal Infusion', into: 'water', lo: [25, 30], hi: [55, 60] },
    lore: 'Pale pink petals that fall like snow in the hollow: sweet dreams, warm and a little grave.' }),
  sp('dreamspire', { key: 'lullabell', noun: 'Lullabell', shape: 'bluebell', late: true, hue: [290, 0.45, 0.72], glow: 0.9, fx: { dream: 20, frost: 6 }, arc: [-450, 2.5], price: 22,
    steep: { name: 'Lullabell Tea', into: 'water', lo: [10, 15], hi: [40, 45] },
    lore: 'Bells that ring a lullaby only sleepers hear, trailing from the hollow’s vines. Cool.' }),
  sp('dreamspire', { key: 'dreamplum', noun: 'Dream Plum', shape: 'plum', late: true, hue: [300, 0.55, 0.5], glow: 0.4, fx: { dream: 18, acidity: 6 }, arc: [-320, 3], price: 20,
    steep: { name: 'Dream Plum Syrup', into: 'water', lo: [20, 25], hi: [50, 55] },
    lore: 'Plums that ripen while you sleep: sour, sweet dreams.' }),
  sp('dreamspire', { key: 'sleepstone', noun: 'Sleepstone', shape: 'stone', rare: true, hue: [255, 0.25, 0.72], glow: 0.4, fx: { dream: 28, frost: 5, acidity: 4 }, arc: [-500, 3], price: 34,
    lore: 'A smooth lilac stone found under sleeping snails: the deepest dreams.' }),
];

/** Wild ingredients by biome. @param {string} region */
export const speciesOf = (region) => WILD_SPECS.filter((s) => s.region === region);

/** @type {Record<string, typeof WILD_SPECS[number]>} */
export const WILD_BY_KEY = Object.fromEntries(WILD_SPECS.map((s) => [s.key, s]));

const PREFIX = ['Moss', 'Moon', 'Dusk', 'Ember', 'Witch', 'Frost', 'Star', 'Thorn', 'Dew', 'Raven', 'Old', 'Hollow'];

const r2 = (v) => Math.round(v * 100) / 100;

/** Version of the wild profiles (effects, thresholds, extracts). */
export const WILD_FX_VERSION = 5;

/**
 * Generate this world's wild materials, their reactions and the resonance laws.
 * @param {string} seed
 * @param {{materials: MaterialDef[], roles: Record<string,string>}} base existing world (water/spirit/oil ids)
 */
export function generateWild(seed, base) {
  const mainRng = new Rng('wild:' + seed);
  // the hanging vines (`late`) draw from a stream of their own, so adding them never shifts what the older ingredients drew
  const lateRng = new Rng('wild+:' + seed);
  let rng = mainRng;
  // names never depend on wild materials already in the world, so an old
  // save regenerates exactly the names a fresh world of its seed gets
  const used = new Set(base.materials.filter((m) => !m.id.startsWith('wild-')).map((m) => m.name));
  /** @type {MaterialDef[]} */
  const materials = [];
  /** @type {Record<string, string>} */
  const ids = {};
  for (const s of WILD_SPECS) {
    rng = s.late ? lateRng : mainRng;
    const id = 'wild-' + s.key;
    const [h, sat, l] = s.hue;
    const color = hslToRgb((h + rng.range(-8, 8) + 360) % 360, Math.min(1, sat * rng.range(0.9, 1.1)), Math.min(0.92, l * rng.range(0.94, 1.06)));
    let name = '';
    const prefixes = PREFIX.filter((w) => !s.noun.includes(w));
    for (let tries = 0; tries < 12 && (!name || used.has(name)); tries++) name = `${rng.pick(prefixes)} ${s.noun}`;
    if (used.has(name)) name = s.noun;
    used.add(name);
    /** @type {Record<string, number>} */
    const fx = {};
    for (const [k, v] of Object.entries(s.fx)) fx[k] = Math.round(v * rng.range(0.9, 1.1) * 10) / 10;
    const m = completeMaterial({
      id, name, archetype: 'wild', form: /** @type {any} */ (s.form), color, tint: 0.75, opacity: 1,
      density: r2(s.density * rng.range(0.97, 1.03)), compat: s.compat ? s.compat.slice() : [r2(rng.range(0.8, 0.84)), r2(rng.range(0.12, 0.16))],
      friction: s.friction ?? r2(rng.range(0.62, 0.72)), binder: s.binder ?? 0, hardness: s.hardness,
      solubility: r2(s.sol * rng.range(0.9, 1.1)), solubilityTemp: s.solT, melt: 1500, boil: Infinity,
      heatCapacity: 1.7, conductivity: 0.35, flammability: ['crystal', 'mineral', 'shell', 'powder'].includes(SHAPE_FAMILY[s.shape]) ? 0 : 0.45, ignition: Math.round(rng.range(260, 320)), combustionHeat: 500,
      ash: base.roles.soot, smoke: base.roles.smoke, glow: s.glow || 0, reactivity: 0.3,
      price: s.price, tier: s.buy === null ? 99 : s.buy, product: false, description: s.lore,
    });
    const mm = /** @type {any} */ (m);
    mm.effects = fx;
    // a few delicate ingredients carry no magic that can awaken (arc: null)
    if (s.arc) mm.arcane = arcaneProfile(seed, id, s.arc[0], s.arc[1]);
    mm.fxv = WILD_FX_VERSION;
    mm.econd = s.econd ?? 0.04;
    mm.charge = s.charge ?? 0;
    mm.wild = { key: s.key, shape: s.shape, region: s.region, rank: s.rank, rare: !!s.rare, gatherOnly: s.buy === null, gather: s.gather || 'pick', dusk: !!s.dusk, dawn: !!s.dawn, late: !!s.late, main: Object.keys(s.fx)[0] };
    if (s.form === 'solid') mm.crushable = true;
    // its visual identity in this world: what its plant, icon and pieces are drawn from (visual/)
    mm.vis = identityOf(mm, seed);
    materials.push(m);
    ids[s.key] = id;
  }

  // ---- reactions of wild ingredients (they start where the reagents meet)
  /** @type {import('../reactions/reactions.js').ReactionRule[]} */
  const reactions = [];
  rng = mainRng;
  const t5 = (lo, hi) => Math.round(rng.range(lo, hi) / 5) * 5;
  /**
   * A product of a wild ingredient: its awakening profile follows its source.
   * An extract keeps every effect of the raw ingredient in the same
   * proportions (fully dissolved, a little stronger): steeping never
   * purifies an ingredient, only mixing with its opposites does.
   */
  const product = (key, from, props, fx) => {
    const src = materials.find((m) => m.id === ids[from]);
    if (!fx) {
      const k = 1.08 * rng.range(0.97, 1.03);
      fx = Object.fromEntries(Object.entries(/** @type {any} */ (src).effects).map(([e, v]) => [e, Math.round(Number(v) * k * 10) / 10]));
    }
    const m = completeMaterial({
      id: 'wild-p-' + key, archetype: 'product', tint: 0.85, opacity: 0.85, heatCapacity: 3.6, boil: Infinity, melt: -20,
      viscosity: 2.5, compat: src.compat.slice(), price: 0, tier: 99, product: true, density: src.density,
      form: 'liquid', color: src.color.map((c) => r2(c * 0.85)), ...props,
    });
    const mm = /** @type {any} */ (m);
    mm.econd = 0.12;
    mm.charge = 0;
    mm.effects = fx;
    mm.arcane = { ...(/** @type {any} */ (src).arcane) };
    mm.fxv = WILD_FX_VERSION;
    materials.push(m);
    return m;
  };
  const water = base.roles.water, spirit = base.roles.spirit, oil = base.roles.oil;
  const nm = (k) => materials.find((m) => m.id === ids[k]).name;
  const short = (k) => nm(k).split(' ').slice(-1)[0];

  // steeping: hot water turns ground root/leaf into a true liquid extract
  const steepedRoot = product('steeped-ironroot', 'ironroot', { name: `Steeped ${nm('ironroot')}`, description: 'A dark root extract: all of the root’s strength, and its chill, fully in solution.' });
  reactions.push({ id: 'rw_steep_root', name: steepedRoot.name, kind: 'decompose', a: ids.ironroot, b: null, ra: 1, rb: 0, products: [{ id: steepedRoot.id, frac: 1 }],
    minT: t5(60, 70), maxT: 160, rate: 0.09, heat: -5, stir: 0.3, wet: true, hint: `Ground ${nm('ironroot')} steeps into a liquid extract in hot water.` });
  const infusion = product('silver-infusion', 'silverleaf', { name: `${nm('silverleaf')} Infusion`, description: 'A pale, fragrant healing infusion with a frosty edge.' });
  reactions.push({ id: 'rw_infuse_leaf', name: infusion.name, kind: 'decompose', a: ids.silverleaf, b: null, ra: 1, rb: 0, products: [{ id: infusion.id, frac: 1 }],
    minT: t5(45, 55), maxT: t5(85, 95), rate: 0.1, heat: -5, stir: 0.3, wet: true, hint: `${nm('silverleaf')} infuses in warm (not boiling) water.` });
  // heat spoils delicate petals into something bitter
  const wilted = product('wilted-petal', 'heartpetal', { name: `Wilted ${nm('heartpetal')}`, color: [0.45, 0.32, 0.3], description: 'Scorched petals: the love is gone and bitterness remains.' }, { love: 6, toxicity: 9 });
  // spoiled matter has lost its magic: it no longer awakens
  delete /** @type {any} */ (wilted).arcane;
  reactions.push({ id: 'rw_wilt_petal', name: wilted.name, kind: 'decompose', a: ids.heartpetal, b: null, ra: 1, rb: 0, products: [{ id: wilted.id, frac: 1 }],
    minT: t5(78, 88), maxT: 400, rate: 0.12, heat: 0, stir: 0.2, hint: `Strong heat spoils ${nm('heartpetal')}.` });
  // warm spirit wakes mandrake and quartz
  const mandrakeT = product('mandrake-tincture', 'mandrake', { name: `${nm('mandrake')} Tincture`, compat: [0.62, 0.16], description: 'The waking root dissolved in warm spirit.' });
  reactions.push({ id: 'rw_mandrake', name: mandrakeT.name, kind: 'mix', a: ids.mandrake, b: spirit, ra: 1, rb: 2, products: [{ id: mandrakeT.id, frac: 1 }],
    minT: t5(35, 45), maxT: t5(70, 75), rate: 0.25, heat: 10, stir: 0.8, hint: `${nm('mandrake')} wakes in warm spirit.` });
  const starT = product('starlit-tincture', 'starquartz', { name: `Starlit ${short('starquartz')} Tincture`, compat: [0.62, 0.16], glow: 0.7, description: 'Crushed quartz dissolved in warm spirit; it glimmers.' });
  reactions.push({ id: 'rw_starquartz', name: starT.name, kind: 'mix', a: ids.starquartz, b: spirit, ra: 1, rb: 2, products: [{ id: starT.id, frac: 1 }],
    minT: t5(35, 45), maxT: t5(70, 80), rate: 0.25, heat: 8, stir: 0.8, hint: `Crushed ${nm('starquartz')} dissolves in warm spirit.` });
  // fire loves oil
  const dragonOil = product('dragonfire-oil', 'dragonpepper', { name: 'Dragonfire Oil', compat: [0.16, 0.11], color: [0.85, 0.25, 0.08], flammability: 0.7, ignition: 240, combustionHeat: 900,
    ash: base.roles.soot, smoke: base.roles.smoke, description: 'Pepper fire carried in oil.' });
  reactions.push({ id: 'rw_dragonoil', name: dragonOil.name, kind: 'contact', a: ids.dragonpepper, b: oil, ra: 1, rb: 1, products: [{ id: dragonOil.id, frac: 1 }],
    minT: t5(30, 40), maxT: 220, rate: 0.4, heat: 20, stir: 1, hint: `Ground ${nm('dragonpepper')} pours its fire into warm oil.` });
  // acid meets alkali: neutral gypsum and heat
  const gypsum = product('gypsum', 'riverchalk', { name: 'Gypsum Grit', form: 'powder', color: [0.9, 0.88, 0.82], friction: 0.68, solubility: 0.02, melt: 1500, viscosity: 1,
    description: 'The neutral grit left where acid met chalk: whatever either carried is spent.' }, {});
  reactions.push({ id: 'rw_neutralise', name: 'Neutralisation', kind: 'contact', a: ids.riverchalk, b: ids.sulfur, ra: 1, rb: 1, products: [{ id: gypsum.id, frac: 1 }],
    minT: -10, maxT: 400, rate: 0.5, heat: 60, stir: 1, wet: true, hint: `${nm('riverchalk')} fizzes where it meets ${nm('sulfur')} and both turn to neutral grit.` });

  // generic extraction: each remaining herb or mineral gives up its magic to
  // the right solvent inside its own temperature window
  for (const s of WILD_SPECS) {
    if (!s.steep) continue;
    rng = s.late ? lateRng : mainRng;
    const st = s.steep;
    const solvent = st.into === 'spirit' ? spirit : st.into === 'oil' ? oil : water;
    const solv = base.materials.find((m) => m.id === solvent);
    const ext = product(`extract-${s.key}`, s.key, {
      name: st.name, ...(solv ? { compat: solv.compat.slice() } : {}),
      description: `The magic of ${nm(s.key)} drawn into ${st.into === 'water' ? 'water' : st.into}.`,
    });
    const lo = t5(st.lo[0], st.lo[1]), hi = t5(st.hi[0], st.hi[1]);
    const where = st.into === 'water' ? '' : ` in ${st.into}`;
    const window = lo <= 15 ? `only when chilled below ${hi}°C` : `between about ${lo} and ${hi}°C`;
    if (st.into === 'water') {
      reactions.push({ id: `rw_extract_${s.key}`, name: ext.name, kind: 'decompose', a: ids[s.key], b: null, ra: 1, rb: 0, products: [{ id: ext.id, frac: 1 }],
        minT: lo, maxT: hi, rate: 0.1, heat: -4, stir: 0.4, wet: true, hint: `Ground ${nm(s.key)} steeps into water ${window}.` });
    } else {
      // oil never blends with watery matter: it extracts where the grains touch it
      reactions.push({ id: `rw_extract_${s.key}`, name: ext.name, kind: st.into === 'oil' ? 'contact' : 'mix', a: ids[s.key], b: solvent, ra: 1, rb: 1, products: [{ id: ext.id, frac: 1 }],
        minT: lo, maxT: hi, rate: 0.25, heat: 4, stir: 0.8, hint: `${nm(s.key)} dissolves${where} ${window}.` });
    }
  }

  return { materials, reactions, ids, laws: generateLaws(seed) };
}

/** Resonance templates (a acted on, b partner, c product). */
const LAW_TEMPLATES = [
  { id: 'forged', name: 'Forged Vigour', kind: 'catalyse', a: 'strength', b: 'fire', k: [0.45, 0.7], lore: 'A touch of fire tempers strength and makes it stronger.' },
  { id: 'blessed', name: 'Blessed Life', kind: 'catalyse', a: 'vitality', b: 'arcana', k: [0.4, 0.6], lore: 'Arcana amplifies healing.' },
  { id: 'enchant', name: 'Enchantment', kind: 'transmute', a: 'love', b: 'arcana', c: 'transformation', k: [0.5, 0.75], lore: 'Love and arcana together become transformation.' },
  { id: 'venom', name: 'Burning Venom', kind: 'transmute', a: 'toxicity', b: 'fire', c: 'death', k: [0.45, 0.65], lore: 'Fire turns poison into death.' },
  { id: 'bitter', name: 'Bitter Heart', kind: 'suppress', a: 'love', b: 'toxicity', k: [1.0, 1.5], lore: 'Poison sours love.' },
  { id: 'quicken', name: 'Quickening', kind: 'transmute', a: 'vitality', b: 'transformation', c: 'strength', k: [0.45, 0.6], lore: 'Life and change together build strength.' },
  { id: 'glacial', name: 'Glacial Insight', kind: 'catalyse', a: 'arcana', b: 'frost', k: [0.35, 0.55], lore: 'Cold sharpens arcane insight.' },
  { id: 'corrode', name: 'Corroding Change', kind: 'transmute', a: 'acidity', b: 'strength', c: 'transformation', k: [0.4, 0.55], lore: 'Acid gnaws strength into change.' },
  { id: 'heartfire', name: 'Heartfire', kind: 'transmute', a: 'love', b: 'fire', c: 'vitality', k: [0.45, 0.6], lore: 'Passion’s warmth becomes life.' },
  { id: 'gravechill', name: 'Grave Chill', kind: 'catalyse', a: 'death', b: 'frost', k: [0.4, 0.6], lore: 'Cold feeds death.' },
  { id: 'dulling', name: 'Dulling', kind: 'suppress', a: 'arcana', b: 'toxicity', k: [0.7, 1.0], lore: 'Poison clouds arcane potency.' },
  { id: 'wildgrowth', name: 'Wild Growth', kind: 'catalyse', a: 'transformation', b: 'vitality', k: [0.35, 0.55], lore: 'Life drives change wild.' },
  { id: 'kindling', name: 'Kindling', kind: 'catalyse', a: 'fire', b: 'acidity', k: [0.3, 0.45], lore: 'Acid feeds the flame.' },
];

/**
 * Pick this world's resonance laws. Each world has six, on distinct effect
 * pairs, with jittered strengths and thresholds.
 * @param {string} seed
 * @returns {import('../alchemy/effects.js').Resonance[]}
 */
export function generateLaws(seed) {
  const rng = new Rng('laws:' + seed);
  const pool = rng.shuffle(LAW_TEMPLATES);
  const out = [];
  const pairs = new Set();
  for (const t of pool) {
    if (out.length >= 6) break;
    const key = [t.a, t.b].sort().join('+');
    if (pairs.has(key)) continue;
    pairs.add(key);
    out.push({
      id: t.id, name: t.name, kind: /** @type {any} */ (t.kind),
      a: EFFECT_INDEX[t.a], b: EFFECT_INDEX[t.b], c: t.c ? EFFECT_INDEX[t.c] : -1,
      k: Math.round(rng.range(t.k[0], t.k[1]) * 100) / 100,
      min: Math.round(rng.range(2, 4.5) * 10) / 10,
      lore: t.lore,
    });
  }
  return out;
}
