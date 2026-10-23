// Laboratory equipment and progression ranks. Every upgrade changes what the
// player can physically do, measure or prepare — no bare multipliers.

/**
 * @typedef {Object} Equipment
 * @property {string} id
 * @property {string} name
 * @property {string} category  heat | cold | vessel | tool | instrument | trials | storage | guild
 * @property {number} price
 * @property {number} rank      minimum reputation rank index
 * @property {string} desc
 * @property {string} icon
 * @property {string[]} [requires]
 * @property {Object} [effect]
 */

/** @type {Equipment[]} */
export const EQUIPMENT = [
  // heating
  { id: 'hearth', name: 'Stone Hearth', category: 'heat', price: 0, rank: 0, icon: 'fire', desc: 'A modest wood fire under the cauldron. Flame up to ~340°C.', effect: { maxFlame: 340, heatPower: 3.5 } },
  { id: 'bellows', name: 'Bellows & Coal', category: 'heat', price: 120, rank: 1, icon: 'bellows', requires: ['hearth'], desc: 'A hotter, faster fire (up to ~520°C). Boil quickly and reach caramelising heat.', effect: { maxFlame: 520, heatPower: 5.5 } },
  { id: 'athanor', name: 'Athanor Furnace', category: 'heat', price: 700, rank: 3, icon: 'furnace', requires: ['bellows'], desc: 'The alchemist’s self-feeding furnace (up to ~800°C) with fine control.', effect: { maxFlame: 800, heatPower: 8 } },
  // cooling
  { id: 'basin', name: 'Cold-Water Basin', category: 'cold', price: 0, rank: 0, icon: 'basin', desc: 'Cool well water under the cauldron. Chills toward ~4°C but cannot freeze water.', effect: { minCool: 4, coolPower: 4 } },
  { id: 'frostrune', name: 'Frost Rune Plate', category: 'cold', price: 150, rank: 1, icon: 'rune', requires: ['basin'], desc: 'A carved rune that draws heat out to -30°C. Freezes liquids into solid blocks.', effect: { minCool: -30, coolPower: 6 } },
  { id: 'glacial', name: 'Glacial Sigil', category: 'cold', price: 750, rank: 3, icon: 'snow', requires: ['frostrune'], desc: 'Deep cold to -70°C, fast. Condenses even marsh vapour.', effect: { minCool: -70, coolPower: 9 } },
  // vessels
  { id: 'pot', name: 'Iron Pot', category: 'vessel', price: 0, rank: 0, icon: 'cauldron', desc: 'Your first cauldron (about 1.5 litres).', effect: { size: 'pot' } },
  { id: 'copper', name: 'Copper Cauldron', category: 'vessel', price: 320, rank: 2, icon: 'cauldron2', requires: ['pot'], desc: 'A larger vessel (about 2.2 litres) for big orders, spare test doses and multi-step brews.', effect: { size: 'copper' } },
  { id: 'grand', name: 'Grand Athanor Vessel', category: 'vessel', price: 1800, rank: 4, icon: 'cauldron3', requires: ['copper'], desc: 'A huge vessel (3 litres) for the grandest commissions.', effect: { size: 'grand' } },
  // tools
  { id: 'spoon', name: 'Oak Spoon', category: 'tool', price: 0, rank: 0, icon: 'spoon', desc: 'Stirs, folds and kneads.' },
  { id: 'mortar', name: 'Stone Mortar', category: 'tool', price: 0, rank: 0, icon: 'mortar', desc: 'Grinds roots, leaves and stones into powder before they go into the pot ("Ground" on the shelf).' },
  { id: 'pestle', name: 'Granite Pestle', category: 'tool', price: 35, rank: 0, icon: 'pestle', desc: 'Crushes frozen blocks and crystal chunks into grains.' },
  { id: 'skimmer', name: 'Brass Skimmer', category: 'tool', price: 60, rank: 1, icon: 'skimmer', desc: 'Scoops matter out of the cauldron — remove a floating layer or unwanted grains.' },
  { id: 'stirrer', name: 'Clockwork Stirrer', category: 'tool', price: 110, rank: 1, icon: 'gear', desc: 'A wind-up paddle that stirs in wide circles while you do other things.' },
  { id: 'alembic', name: 'Copper Alembic', category: 'tool', price: 360, rank: 2, icon: 'alembic', desc: 'Captures vapour from under the lid into a receiver flask — distil volatile reagents and pour them back later.' },
  { id: 'homunculus', name: 'Brass Homunculus', category: 'tool', price: 1100, rank: 3, icon: 'homunculus', desc: 'A clockwork assistant that pours, stirs and heats a saved recipe for you — in the real cauldron, at full ingredient cost.' },
  // instruments
  { id: 'thermometer', name: 'Mercury Thermometer', category: 'instrument', price: 0, rank: 0, icon: 'thermo', desc: 'Reads temperatures anywhere in the brew.' },
  { id: 'hydrometer', name: 'Glass Hydrometer', category: 'instrument', price: 45, rank: 0, icon: 'hydro', desc: 'Measures density precisely (g/ml).' },
  { id: 'viscometer', name: 'Falling-Ball Viscometer', category: 'instrument', price: 70, rank: 1, icon: 'visco', desc: 'Measures viscosity precisely instead of by eye.' },
  { id: 'assay', name: 'Assay Kit', category: 'instrument', price: 90, rank: 1, icon: 'assay', desc: 'Measures stability and volatility precisely.' },
  { id: 'lens', name: 'Aether Lens', category: 'instrument', price: 140, rank: 1, icon: 'lens', desc: 'Lets you see the aura of magic in the brew: which kinds of effect are present, never how strong. Mixtures still need a trial.' },
  { id: 'galvanometer', name: 'Galvanometer', category: 'instrument', price: 120, rank: 2, icon: 'galvo', desc: 'Reads the electric charge carried by the brew.' },
  { id: 'arcanometer', name: 'Arcanometer', category: 'instrument', price: 260, rank: 2, icon: 'awaken', desc: 'A needle of lodestone in a glass of wisp-light: the probe reads the arcane threshold of the brew under it (to the nearest 50), and whether it has awakened.' },
  { id: 'thermal', name: 'Thermal Monocle', category: 'instrument', price: 80, rank: 1, icon: 'monocle', desc: 'Shows the temperature field of the whole cauldron as a heat map.' },
  // experiments
  { id: 'kennel', name: 'Subject Kennel', category: 'trials', price: 60, rank: 1, icon: 'rabbit', desc: 'Spare cages and pots: the hutch holds six rabbits, and new test subjects cost half.', effect: { hutch: 6 } },
  { id: 'warren', name: 'Rabbit Warren', category: 'trials', price: 180, rank: 2, icon: 'nest', requires: ['kennel'], desc: 'A walled run with burrows and a nest box: room for ten rabbits.', effect: { hutch: 10 } },
  { id: 'still', name: 'Purging Still', category: 'trials', price: 150, rank: 1, icon: 'alembic', desc: 'The guild’s recipe for the purging draught and a little still to brew it: a draught costs 1 coin of salts and a short wait instead of 8 coins at the apothecary. A purge washes every potion effect out of a rabbit and stops any degeneration.' },
  // gathering: each method has its tool; by hand a harvest brings half as much
  { id: 'satchel', name: 'Forager’s Satchel', category: 'storage', price: 80, rank: 1, icon: 'satchel', desc: 'Carry more from the wilds: each harvest gathers half as much again.' },
  { id: 'trowel', name: 'Digging Trowel', category: 'storage', price: 20, rank: 0, icon: 'trowel', desc: 'Digs roots and river chalk out whole. Without it you scrabble up half as much.' },
  { id: 'rockhammer', name: 'Rock Hammer', category: 'storage', price: 35, rank: 0, icon: 'pick', desc: 'Splits mineral seams and crystal: full harvests of flint, sulfur and quartz.' },
  { id: 'brush', name: 'Badger Brush', category: 'storage', price: 15, rank: 0, icon: 'brush', desc: 'Sweeps up fine mineral dust like mica without losing half to the wind.' },
  { id: 'sickle', name: 'Silver Sickle', category: 'storage', price: 45, rank: 1, icon: 'sickle', desc: 'Cuts mosses and lichens clean from stone and barrow.' },
  // storage & guild
  { id: 'shelf1', name: 'Oak Shelves', category: 'storage', price: 90, rank: 1, icon: 'shelf', desc: 'Store up to 2.5 L of each reagent.', effect: { storage: 2500 } },
  { id: 'shelf2', name: 'Cellar Racks', category: 'storage', price: 260, rank: 2, icon: 'shelf2', requires: ['shelf1'], desc: 'Store up to 6 L of each reagent.', effect: { storage: 6000 } },
  // potion storage: shelves of sealed glass bottles
  { id: 'rack1', name: 'Bottle Shelf', category: 'storage', price: 40, rank: 0, icon: 'shelf', desc: 'A plank shelf with a lip: room for 6 sealed bottles of potion.', effect: { bottles: 6 } },
  { id: 'rack2', name: 'Potion Cabinet', category: 'storage', price: 150, rank: 1, icon: 'shelf2', requires: ['rack1'], desc: 'A glass-fronted cabinet: room for 12 sealed bottles.', effect: { bottles: 12 } },
  { id: 'rack3', name: 'Bottle Cellar', category: 'storage', price: 420, rank: 2, icon: 'shelf2', requires: ['rack2'], desc: 'Cool cellar racks from floor to vault: room for 24 sealed bottles.', effect: { bottles: 24 } },
  { id: 'charter', name: 'Guild Charter', category: 'guild', price: 400, rank: 2, icon: 'charter', desc: 'Guild membership: 15% off all reagents and access to guild contracts.', effect: { discount: 0.15 } },
];

export const STARTING_EQUIPMENT = ['hearth', 'basin', 'pot', 'spoon', 'mortar', 'thermometer'];
export const BASE_STORAGE = 1000;
/** Sealed bottles the shop's first shelf holds. */
export const BASE_BOTTLES = 3;
/** Rabbits the starting hutch holds. */
export const BASE_HUTCH = 4;

/** @param {string} id */
export function equipmentById(id) {
  return EQUIPMENT.find((e) => e.id === id);
}

export const RANKS = [
  { name: 'Apprentice', rep: 0 },
  { name: 'Journeyman', rep: 60 },
  { name: 'Adept', rep: 180 },
  { name: 'Expert', rep: 400 },
  { name: 'Master', rep: 800 },
  { name: 'Grand Alchemist', rep: 1500 },
];

/** @param {number} rep */
export function rankIndex(rep) {
  let r = 0;
  for (let i = 0; i < RANKS.length; i++) if (rep >= RANKS[i].rep) r = i;
  return r;
}

/**
 * Derive the physical capabilities granted by owned equipment.
 * @param {Set<string>|string[]} owned
 */
export function capabilities(owned) {
  const has = owned instanceof Set ? owned : new Set(owned);
  const cap = { maxFlame: 340, heatPower: 3.5, minCool: 4, coolPower: 4, size: 'pot', storage: BASE_STORAGE, discount: 0, hutch: BASE_HUTCH, bottles: BASE_BOTTLES, has: (id) => has.has(id) };
  for (const e of EQUIPMENT) {
    if (!has.has(e.id) || !e.effect) continue;
    const f = /** @type {any} */ (e.effect);
    if (f.maxFlame && f.maxFlame > cap.maxFlame) { cap.maxFlame = f.maxFlame; cap.heatPower = f.heatPower; }
    if (f.minCool !== undefined && f.minCool < cap.minCool) { cap.minCool = f.minCool; cap.coolPower = f.coolPower; }
    if (f.size === 'copper' && cap.size === 'pot') cap.size = 'copper';
    if (f.size === 'grand') cap.size = 'grand';
    if (f.storage && f.storage > cap.storage) cap.storage = f.storage;
    if (f.discount) cap.discount = Math.max(cap.discount, f.discount);
    if (f.hutch && f.hutch > cap.hutch) cap.hutch = f.hutch;
    if (f.bottles && f.bottles > cap.bottles) cap.bottles = f.bottles;
  }
  return cap;
}
