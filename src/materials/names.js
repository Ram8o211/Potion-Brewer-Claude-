// Name generation for procedural reagents. Names are built from a colour-
// or theme-appropriate prefix and an archetype noun, so "Ember Tincture" is
// actually red-orange and "Bog Honey" is actually a thick syrup.

import { hueOf } from '../core/color.js';

/** @type {[number, string[]][]} */
const HUE_PREFIXES = [
  [25, ['Bloodroot', 'Crimson', 'Wyrmblood', 'Rosehip', 'Cardinal']],
  [55, ['Ember', 'Flamecap', 'Cinnabar', 'Foxfire', 'Saffron']],
  [90, ['Amber', 'Marigold', 'Sunpetal', 'Honeydew', 'Gilded']],
  [130, ['Mossy', 'Wormwood', 'Fernwater', 'Bogmyrtle', 'Willow']],
  [175, ['Verdigris', 'Jadeleaf', 'Emerald', 'Mintwort', 'Glimmerfern']],
  [215, ['Tidewater', 'Kelpie', 'Sea-glass', 'Mistral', 'Brinedeep']],
  [255, ['Azure', 'Frostmere', 'Moonwell', 'Kingfisher', 'Skyshard']],
  [290, ['Cobalt', 'Nightshade', 'Duskbloom', 'Starfall', 'Gloaming']],
  [330, ['Violet', 'Hexberry', 'Mandrake', 'Amethyst', 'Witchbell']],
  [361, ['Magenta', 'Heartsease', 'Faeblush', 'Rubywort', 'Fireweed']],
];

/** @type {Record<string, string[]>} */
export const NOUNS = {
  water: ['Dew', 'Spring Water', 'Rainwater', 'Wellwater', 'Brook Water'],
  oil: ['Oil', 'Tallow', 'Lamp Oil', 'Seed Oil', 'Pressing'],
  syrup: ['Honey', 'Syrup', 'Treacle', 'Nectar', 'Molasses'],
  spirit: ['Spirit', 'Aqua Vitae', 'Brandywine', 'Ether', 'Distillate'],
  essence: ['Essence', 'Tincture', 'Extract', 'Ichor', 'Infusion'],
  binder: ['Flour', 'Meal', 'Root Starch', 'Bone Meal', 'Clay Dust'],
  salt: ['Salt', 'Crystals', 'Alum', 'Saltpetre', 'Brine Salt'],
  ember: ['Ember Dust', 'Cinder Powder', 'Sulphur Bloom', 'Firegrit'],
  frost: ['Frost Crystal', 'Rime Shard', 'Winter Gem', 'Hailstone'],
  metal: ['Quickwater', 'Quicksilver', 'Liquid Pewter', 'Mercurium'],
  crystal: ['Moonstone', 'Star Quartz', 'Aether Shard', 'Seer Crystal'],
  wax: ['Wax Flakes', 'Tallow Chips', 'Candle Shavings'],
  fizz: ['Fizzing Powder', 'Bubble Salts', 'Effervescent Dust'],
  spores: ['Glowcap Spores', 'Lantern Moss Spores', 'Wisp Pollen'],
  resin: ['Dragon Resin', 'Wyrm Amber', 'Sap of Ages'],
  starlight: ['Starlight Tincture', 'Aurora Water', 'Comet Dew'],
  moss: ['Troll Moss', 'Ironwort', 'Stonebark Dust'],
  vapor: ['Swamp Vapour', 'Marsh Breath', 'Will-o-Gas'],
  phoenix: ['Phoenix Ash', 'Sunbird Cinders', 'Rebirth Ash'],
  void: ['Void Ink', 'Shadow Ichor', 'Abyssal Tar'],
};

const PLACE = ['Hollow', 'Fen', 'Crag', 'Vale', 'Mere', 'Barrow', 'Thorn', 'Elder', 'Raven', 'Gloam'];

/**
 * @param {import('../core/rng.js').Rng} rng
 * @param {number[]} color sRGB
 * @param {string} archetype
 * @param {Set<string>} used
 */
export function makeName(rng, color, archetype, used) {
  const nouns = NOUNS[archetype] || ['Reagent'];
  const hue = hueOf(color);
  const sat = Math.max(...color) - Math.min(...color);
  for (let attempt = 0; attempt < 30; attempt++) {
    let prefix;
    if (sat < 0.12 || rng.chance(0.2)) prefix = rng.pick(PLACE);
    else prefix = rng.pick(HUE_PREFIXES.find(([lim]) => hue < lim)[1]);
    const noun = rng.pick(nouns);
    // a few nouns already read as complete names
    const name = /Quickwater|Quicksilver|Moonstone|Mercurium/.test(noun) && rng.chance(0.6) ? noun : `${prefix} ${noun}`;
    if (!used.has(name)) {
      used.add(name);
      return name;
    }
  }
  const fallback = `${rng.pick(PLACE)} ${rng.pick(nouns)} ${used.size}`;
  used.add(fallback);
  return fallback;
}

/** @type {Record<string, string[]>} */
export const PRODUCT_WORDS = {
  elixir: ['Elixir', 'Restorative', 'Lifewater', 'Vigour Draught'],
  ardent: ['Ardent Draught', 'Hearthfire Tonic', 'Blaze Cordial', 'Warming Brew'],
  arcane: ['Arcane Tincture', 'Seer’s Philtre', 'Mystic Essence', 'Glimmer Serum'],
  salve: ['Fortifying Salve', 'Stoneskin Balm', 'Bulwark Paste', 'Ironhide Unguent'],
  caramel: ['Caramel', 'Burnt Treacle', 'Toffee Draught'],
  panacea: ['Panacea', 'Cure-all', 'Grand Philtre'],
  amalgam: ['Amalgam', 'Silvered Alloy', 'Star Mercury'],
  phoenix: ['Phoenix Brew', 'Rebirth Draught', 'Sunfire Elixir'],
  varnish: ['Varnish', 'Lacquer', 'Resin Balm'],
  frostbloom: ['Frostbloom', 'Rime Essence', 'Winter Philtre'],
  lumen: ['Lumen', 'Liquid Light', 'Starglow Serum'],
};

/**
 * @param {import('../core/rng.js').Rng} rng @param {string} theme @param {number[]} color @param {Set<string>} used
 */
export function makeProductName(rng, theme, color, used) {
  const words = PRODUCT_WORDS[theme] || ['Brew'];
  const hue = hueOf(color);
  for (let attempt = 0; attempt < 30; attempt++) {
    const prefix = rng.pick(HUE_PREFIXES.find(([lim]) => hue < lim)[1]);
    const name = `${prefix} ${rng.pick(words)}`;
    if (!used.has(name)) {
      used.add(name);
      return name;
    }
  }
  const n = `${rng.pick(words)} No. ${used.size}`;
  used.add(n);
  return n;
}
