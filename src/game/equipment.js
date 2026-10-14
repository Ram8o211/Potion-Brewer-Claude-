// Laboratory equipment and progression ranks. Every upgrade changes what the
// player can physically do, measure or prepare — no bare multipliers.

/**
 * @typedef {Object} Equipment
 * @property {string} id
 * @property {string} name
 * @property {string} category  heat | cold | vessel | tool | instrument | trials | garden | storage | guild
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
  { id: 'hearth', name: 'Stone Hearth', category: 'heat', price: 0, rank: 0, icon: 'fire', desc: 'A wood fire under the cauldron.', effect: { maxFlame: 340, heatPower: 3.5 } },
  { id: 'bellows', name: 'Bellows & Coal', category: 'heat', price: 120, rank: 1, icon: 'bellows', requires: ['hearth'], desc: 'A hotter, faster fire.', effect: { maxFlame: 520, heatPower: 5.5 } },
  { id: 'athanor', name: 'Athanor Furnace', category: 'heat', price: 650, rank: 3, icon: 'furnace', requires: ['bellows'], desc: 'The fiercest, finest fire.', effect: { maxFlame: 800, heatPower: 8 } },
  // cooling
  { id: 'basin', name: 'Cold-Water Basin', category: 'cold', price: 0, rank: 0, icon: 'basin', desc: 'Cools toward 4°C.', effect: { minCool: 4, coolPower: 4 } },
  { id: 'frostrune', name: 'Frost Rune Plate', category: 'cold', price: 150, rank: 1, icon: 'rune', requires: ['basin'], desc: 'Cold down to -30°C.', effect: { minCool: -30, coolPower: 6 } },
  { id: 'glacial', name: 'Glacial Sigil', category: 'cold', price: 600, rank: 3, icon: 'rune', requires: ['frostrune'], desc: 'Deep cold to -70°C.', effect: { minCool: -70, coolPower: 9 } },
  // vessels
  { id: 'pot', name: 'Iron Pot', category: 'vessel', price: 0, rank: 0, icon: 'cauldron', desc: 'Your first cauldron.', effect: { size: 'pot' } },
  { id: 'copper', name: 'Copper Cauldron', category: 'vessel', price: 320, rank: 2, icon: 'cauldron2', requires: ['pot'], desc: 'A larger cauldron.', effect: { size: 'copper' } },
  { id: 'grand', name: 'Grand Vessel', category: 'vessel', price: 1500, rank: 4, icon: 'cauldron3', requires: ['copper'], desc: 'A huge cauldron.', effect: { size: 'grand' } },
  // tools
  { id: 'spoon', name: 'Oak Spoon', category: 'tool', price: 0, rank: 0, icon: 'spoon', desc: 'Stirs and blends.' },
  { id: 'mortar', name: 'Stone Mortar', category: 'tool', price: 0, rank: 0, icon: 'mortar', desc: 'Smashes stones to powder before they go in.' },
  { id: 'pestle', name: 'Granite Pestle', category: 'tool', price: 35, rank: 0, icon: 'pestle', desc: 'Smashes stones and ice inside the pot.' },
  { id: 'skimmer', name: 'Brass Skimmer', category: 'tool', price: 60, rank: 1, icon: 'skimmer', desc: 'Lifts matter out of the pot.' },
  { id: 'stirrer', name: 'Clockwork Stirrer', category: 'tool', price: 110, rank: 1, icon: 'gear', desc: 'Stirs on its own.' },
  { id: 'homunculus', name: 'Brass Homunculus', category: 'tool', price: 900, rank: 3, icon: 'homunculus', desc: 'Brews a saved recipe for you.' },
  // instruments
  { id: 'thermometer', name: 'Thermometer', category: 'instrument', price: 0, rank: 0, icon: 'thermo', desc: 'Shows the brew’s temperature.' },
  { id: 'thermal', name: 'Thermal Monocle', category: 'instrument', price: 80, rank: 1, icon: 'monocle', desc: 'A heat map of the whole cauldron.' },
  // testing room
  { id: 'kennel', name: 'Creature Kennel', category: 'trials', price: 60, rank: 1, icon: 'toad', desc: 'Replacing a creature costs half.' },
  { id: 'lantern', name: 'Wisp Lantern', category: 'trials', price: 200, rank: 2, icon: 'wisp', desc: 'A wisp joins the testing room.' },
  // garden
  { id: 'barrel', name: 'Rain Barrel', category: 'garden', price: 70, rank: 0, icon: 'drop', desc: 'The well holds twice as much.', effect: { wellCap: 2 } },
  { id: 'greenhouse', name: 'Greenhouse', category: 'garden', price: 240, rank: 1, icon: 'leaf', desc: 'Plants grow half again as fast.' },
  { id: 'lamp', name: 'Crystal Lamp', category: 'garden', price: 260, rank: 2, icon: 'gem', desc: 'Stones grow half again as fast.' },
  { id: 'sprinkler', name: 'Sprinkler', category: 'garden', price: 380, rank: 2, icon: 'can', desc: 'Plant beds never dry out.' },
  // storage & guild
  { id: 'shelf1', name: 'Oak Shelves', category: 'storage', price: 90, rank: 1, icon: 'shelf', desc: 'Keep up to 2 L of each ingredient.', effect: { storage: 2000 } },
  { id: 'shelf2', name: 'Cellar Racks', category: 'storage', price: 260, rank: 2, icon: 'shelf2', requires: ['shelf1'], desc: 'Keep up to 5 L of each ingredient.', effect: { storage: 5000 } },
  { id: 'charter', name: 'Guild Charter', category: 'guild', price: 400, rank: 2, icon: 'charter', desc: 'Certification costs 30% less; guild contracts.', effect: { certDiscount: 0.3 } },
];

export const STARTING_EQUIPMENT = ['hearth', 'basin', 'pot', 'spoon', 'mortar', 'thermometer'];
export const BASE_STORAGE = 800;

/** @param {string} id */
export function equipmentById(id) {
  return EQUIPMENT.find((e) => e.id === id);
}

export const RANKS = [
  { name: 'Apprentice', rep: 0 },
  { name: 'Journeyman', rep: 40 },
  { name: 'Adept', rep: 130 },
  { name: 'Expert', rep: 300 },
  { name: 'Master', rep: 600 },
  { name: 'Grand Alchemist', rep: 1100 },
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
  const cap = { maxFlame: 340, heatPower: 3.5, minCool: 4, coolPower: 4, size: 'pot', storage: BASE_STORAGE, certDiscount: 0, has: (id) => has.has(id) };
  for (const e of EQUIPMENT) {
    if (!has.has(e.id) || !e.effect) continue;
    const f = /** @type {any} */ (e.effect);
    if (f.maxFlame && f.maxFlame > cap.maxFlame) { cap.maxFlame = f.maxFlame; cap.heatPower = f.heatPower; }
    if (f.minCool !== undefined && f.minCool < cap.minCool) { cap.minCool = f.minCool; cap.coolPower = f.coolPower; }
    if (f.size === 'copper' && cap.size === 'pot') cap.size = 'copper';
    if (f.size === 'grand') cap.size = 'grand';
    if (f.storage && f.storage > cap.storage) cap.storage = f.storage;
    if (f.certDiscount) cap.certDiscount = Math.max(cap.certDiscount, f.certDiscount);
  }
  return cap;
}
