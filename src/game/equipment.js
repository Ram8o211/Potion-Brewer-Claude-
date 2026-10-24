// Laboratory equipment and progression ranks. Every item for sale gives the
// player a capability, a measurable production advantage or a research
// reading that the campaign actually uses (game/mechanics.js names which
// mechanic each one serves; docs/GAMEPLAY_PURPOSE_AUDIT.md has the evidence).
// Items retired by the gameplay refactor are listed in RETIRED_EQUIPMENT so
// older saves can be refunded fairly (state.js migrate).

/**
 * @typedef {Object} Equipment
 * @property {string} id
 * @property {string} name
 * @property {string} category  heat | cold | vessel | tool | instrument | trials | gathering | storage | guild
 * @property {number} price
 * @property {number} rank      minimum reputation rank index
 * @property {string} desc      what it lets the player do (shown in the guild shop)
 * @property {string} icon
 * @property {string[]} mechanics  campaign mechanics it serves (mechanics.js)
 * @property {string[]} [requires]
 * @property {Object} [effect]
 */

/** @type {Equipment[]} */
export const EQUIPMENT = [
  // the starting kit: everything an apprentice needs for the core loop
  { id: 'hearth', name: 'Stone Hearth', category: 'heat', price: 0, rank: 0, icon: 'fire', mechanics: ['steeping', 'concentration', 'awakening'], desc: 'A wood fire under the cauldron. It brings a pot to the boil in seconds and takes lamp oil past 200°C — every steep, boil and heat-awakening in the guild’s books.', effect: { maxFlame: 340, heatPower: 3.5 } },
  { id: 'basin', name: 'Cold-Water Basin', category: 'cold', price: 0, rank: 0, icon: 'basin', mechanics: ['cold-extraction'], desc: 'Cool well water under the cauldron: chills a brew to about 9°C — cold enough for most ice-cold steeps, never colder.', effect: { minCool: 4, coolPower: 4 } },
  { id: 'pot', name: 'Iron Pot', category: 'vessel', price: 0, rank: 0, icon: 'cauldron', mechanics: ['batch'], desc: 'Your first cauldron (about 1.5 litres).', effect: { size: 'pot' } },
  { id: 'spoon', name: 'Oak Spoon', category: 'tool', price: 0, rank: 0, icon: 'spoon', mechanics: ['mixing'], desc: 'Stirs, folds and kneads.' },
  { id: 'pestle', name: 'Granite Pestle', category: 'tool', price: 0, rank: 0, icon: 'pestle', mechanics: ['extraction'], desc: 'Crushes whole herbs, roots and stones in the pot, frozen blocks and crystal chunks into grains. Everything solid goes in whole: only the pestle breaks it up.' },
  { id: 'thermometer', name: 'Mercury Thermometer', category: 'instrument', price: 0, rank: 0, icon: 'thermo', mechanics: ['steeping'], desc: 'Reads temperatures anywhere in the brew.' },
  // gathering
  { id: 'kit', name: 'Forager’s Kit', category: 'gathering', price: 60, rank: 0, icon: 'trowel', mechanics: ['gathering'], desc: 'Trowel, rock hammer, sickle and brush: roots, mineral seams, mosses and fine dust come up whole. Without it you scrabble up half as much of anything you cannot simply pick.' },
  { id: 'satchel', name: 'Forager’s Satchel', category: 'gathering', price: 80, rank: 1, icon: 'satchel', mechanics: ['gathering'], desc: 'Carry more from the wilds: each harvest gathers half as much again.' },
  // potion storage: shelves of sealed glass bottles
  { id: 'rack1', name: 'Bottle Shelf', category: 'storage', price: 40, rank: 0, icon: 'shelf', mechanics: ['storage'], desc: 'A plank shelf with a lip: room for 6 sealed bottles of potion.', effect: { bottles: 6 } },
  { id: 'rack2', name: 'Potion Cabinet', category: 'storage', price: 150, rank: 1, icon: 'shelf2', requires: ['rack1'], mechanics: ['storage'], desc: 'A glass-fronted cabinet: room for 12 sealed bottles.', effect: { bottles: 12 } },
  { id: 'rack3', name: 'Bottle Cellar', category: 'storage', price: 420, rank: 2, icon: 'shelf2', requires: ['rack2'], mechanics: ['storage'], desc: 'Cool cellar racks from floor to vault: room for 24 sealed bottles.', effect: { bottles: 24 } },
  // cold: what the basin cannot reach
  { id: 'frostrune', name: 'Frost Rune Plate', category: 'cold', price: 150, rank: 1, icon: 'rune', requires: ['basin'], mechanics: ['cold-extraction', 'awakening'], desc: 'A carved rune that draws a brew down to about -14°C: the ice-cold steeps the basin cannot hold (Grave Moss, the narrowest windows), the cold awakenings of Moonfen magic, and freezing. Mind the dial: a brew frozen solid gives up less.', effect: { minCool: -30, coolPower: 6 } },
  { id: 'glacial', name: 'Glacial Sigil', category: 'cold', price: 750, rank: 3, icon: 'snow', requires: ['frostrune'], mechanics: ['awakening', 'cold-extraction'], desc: 'Deep cold, fast: a brew falls to about -48°C, past the thresholds of the Moonfen’s deepest magic.', effect: { minCool: -70, coolPower: 9 } },
  // tools
  { id: 'stirrer', name: 'Clockwork Stirrer', category: 'tool', price: 110, rank: 1, icon: 'gear', mechanics: ['mixing'], desc: 'A wind-up paddle that keeps stirring on its own — through the whole depth of the brew — while you gather, test or serve. It evens a brew about three times as fast as the hand spoon, so every bottle of a batch matches the one you tested.' },
  { id: 'homunculus', name: 'Brass Homunculus', category: 'tool', price: 1100, rank: 3, icon: 'homunculus', mechanics: ['automation'], desc: 'A clockwork assistant that follows a saved recipe’s recorded procedure step by step — every pour, grinding, stir, heat, chill, hold, boil-down and the lid — in the real cauldron, at full ingredient cost.' },
  // research
  { id: 'arcanometer', name: 'Arcanometer', category: 'instrument', price: 200, rank: 1, icon: 'awaken', mechanics: ['awakening', 'experimentation'], desc: 'A lodestone needle in a glass of wisp-light. The Inspect probe shows the aura of strong magic in the matter under it (which kinds, never how strong) and reads its arcane threshold to the nearest 50, and how much has awakened.' },
  // experiments
  { id: 'kennel', name: 'Subject Kennel', category: 'trials', price: 60, rank: 1, icon: 'rabbit', mechanics: ['experimentation'], desc: 'Spare cages and pots: the hutch holds six rabbits, and new test subjects cost half — corroborate a reading on more animals.', effect: { hutch: 6 } },
  { id: 'warren', name: 'Rabbit Warren', category: 'trials', price: 180, rank: 2, icon: 'nest', requires: ['kennel'], mechanics: ['experimentation'], desc: 'A walled run with burrows and a nest box: room for ten rabbits.', effect: { hutch: 10 } },
  { id: 'still', name: 'Purging Still', category: 'trials', price: 150, rank: 1, icon: 'alembic', mechanics: ['experimentation'], desc: 'The guild’s recipe for the purging draught and a little still to brew it: a draught costs 1 coin of salts and a short wait instead of 8 coins at the apothecary. A purge washes every potion effect out of a rabbit and stops any degeneration.' },
  // vessels
  { id: 'copper', name: 'Copper Cauldron', category: 'vessel', price: 320, rank: 2, icon: 'cauldron2', requires: ['pot'], mechanics: ['batch'], desc: 'A larger vessel (about 2.2 litres): bigger orders, spare test doses and two or three bottles from one tested batch.', effect: { size: 'copper' } },
  { id: 'grand', name: 'Grand Athanor Vessel', category: 'vessel', price: 1800, rank: 4, icon: 'cauldron3', requires: ['copper'], mechanics: ['batch'], desc: 'A huge vessel (3 litres) for the grandest commissions and whole shelves from one batch.', effect: { size: 'grand' } },
  // guild
  { id: 'charter', name: 'Guild Charter', category: 'guild', price: 400, rank: 2, icon: 'charter', mechanics: ['commerce'], desc: 'Guild membership: 15% off all reagents, and the day’s last customer brings a guild contract — a larger bottle for a much larger fee.', effect: { discount: 0.15 } },
];

export const STARTING_EQUIPMENT = ['hearth', 'basin', 'pot', 'spoon', 'pestle', 'thermometer'];
/** Millilitres of each reagent the shop's shelves hold. */
export const BASE_STORAGE = 2500;
/** Sealed bottles the shop's first shelf holds. */
export const BASE_BOTTLES = 3;
/** Rabbits the starting hutch holds. */
export const BASE_HUTCH = 4;

/**
 * Equipment retired from the campaign, with what an owner gets for it when an
 * older save is loaded (state.js migrate): `into` an item that took over its
 * purpose (owners receive it), `refund` the coins paid back. Items whose
 * physics stays in the Free Experiment say so in `sandbox`.
 * @type {Record<string, {name:string, price:number, into?:string, sandbox?:boolean, why:string}>}
 */
export const RETIRED_EQUIPMENT = {
  hydrometer: { name: 'Glass Hydrometer', price: 45, sandbox: true, why: 'customers no longer ask for a density' },
  viscometer: { name: 'Falling-Ball Viscometer', price: 70, sandbox: true, why: 'natural brews stay watery: viscosity is never asked for' },
  assay: { name: 'Assay Kit', price: 90, sandbox: true, why: 'customers no longer ask for stability or volatility; the cauldron tells you when a brew is uneven' },
  galvanometer: { name: 'Galvanometer', price: 120, sandbox: true, why: 'charge is never asked for' },
  thermal: { name: 'Thermal Monocle', price: 80, sandbox: true, why: 'the heat map is now a Free Experiment view' },
  skimmer: { name: 'Brass Skimmer', price: 60, sandbox: true, why: 'natural extracts all mix with water, so there is no layer worth skimming; the tap already draws from the bottom' },
  alembic: { name: 'Copper Alembic', price: 360, sandbox: true, why: 'boiling down with the lid open does the same, and the distillate is never clean enough to jar' },
  bellows: { name: 'Bellows & Coal', price: 120, why: 'the hearth already reaches every steep and boil; hotter fires only set lamp oil alight' },
  athanor: { name: 'Athanor Furnace', price: 700, why: 'the hearth already reaches every steep and boil' },
  lens: { name: 'Aether Lens', price: 140, into: 'arcanometer', why: 'its aura view is now part of the Arcanometer' },
  trowel: { name: 'Digging Trowel', price: 20, into: 'kit', why: 'the Forager’s Kit holds every gathering tool' },
  rockhammer: { name: 'Rock Hammer', price: 35, into: 'kit', why: 'the Forager’s Kit holds every gathering tool' },
  brush: { name: 'Badger Brush', price: 15, into: 'kit', why: 'the Forager’s Kit holds every gathering tool' },
  sickle: { name: 'Silver Sickle', price: 45, into: 'kit', why: 'the Forager’s Kit holds every gathering tool' },
  shelf1: { name: 'Oak Shelves', price: 90, why: 'every shop now stores 2.5 L of each reagent' },
  shelf2: { name: 'Cellar Racks', price: 260, why: 'every shop now stores 2.5 L of each reagent' },
};

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
