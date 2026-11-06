// The campaign's mechanics: the physical and magical processes the game is
// played through, each with the decision it gives the player, what that
// decision does to the potion, why it matters to a customer and how the
// player can see it. This is the reference the rest of the gameplay layer is
// built against (docs/GAMEPLAY_ARCHITECTURE.md):
//
//   equipment.js   every item names the mechanics it serves
//   commissions.js every technique a customer may ask for names its mechanic
//   tests          check that every purchasable item and technique serves a
//                  mechanic, and every mechanic is reachable
//
// The simulation itself knows nothing of this: it only moves matter. A new
// mechanic is added here, given the tools that enable it, and (only if a
// customer can fairly judge its outcome) a technique in commissions.js.
//
// Roles:
//   core        changes effectiveness, purity, quantity or feasibility
//   supporting  explains or enables a core mechanic; no requirement of its own
//   production  makes the shop more efficient (batches, storage, automation)
// Immersion-only physics (IMMERSION) stays in the engine and on screen but is
// never asked for, scored or sold.

/**
 * @typedef {Object} Mechanic
 * @property {string} id
 * @property {string} name
 * @property {'core'|'supporting'|'production'} role
 * @property {'formulation'|'preparation'|'transformation'|'balancing'|'experimentation'|'commerce'|'production'} stage  where it sits in the loop
 * @property {string} decision    what the player chooses
 * @property {string} consequence what the choice does to the potion
 * @property {string} objective   why a customer cares
 * @property {string} feedback    how the player can see and learn it
 * @property {number} rank        the rank from which the campaign relies on it
 */

/** @type {Mechanic[]} */
export const MECHANICS = [
  { id: 'formulation', name: 'Formulation and neutralisation', role: 'core', stage: 'formulation', rank: 0,
    decision: 'Which natural ingredients, in what proportions, to carry the wanted effects and cancel their side effects.',
    consequence: 'Effects cancel in pairs where they meet (fire–frost, life–death, life–poison, acid–alkali); what is left is the potion.',
    objective: 'The wanted effects at strength, every other effect under the purity limit.',
    feedback: 'Each ingredient’s known effects and its balancing hints; the guild theory; trials.' },
  { id: 'extraction', name: 'Solvents, grinding and extraction', role: 'core', stage: 'preparation', rank: 0,
    decision: 'Which solvent each ingredient goes into, whether to crush it, and how much liquid to give it.',
    consequence: 'Water-soluble magic dissolves only in water or spirit, oil-soluble magic only in oil. A whole piece gives slowly at its surface; ground and stirred, it gives in seconds. A solvent holds at most its own volume of extract.',
    objective: 'Reaching the strength the order asks for at all, without wasting herbs.',
    feedback: 'Each ingredient’s solvent class (encyclopedia), the brew panel’s extraction bars, the brew’s colour, trials.' },
  { id: 'steeping', name: 'Steeping temperature and time', role: 'core', stage: 'preparation', rank: 0,
    decision: 'How hot to steep, and for how long.',
    consequence: 'At room temperature an herb gives up only about 60 % of its magic, and slowly (minutes). Heat speeds it up (about twice as fast for every 12–16 °C) but lowers how much can come out at all — about 45 % at 60 °C, 35 % near the boil; cooling lets more come out again, heating never takes back what is dissolved.',
    objective: 'Strength against time: a hot quick steep, or a cool patient one that gets more.',
    feedback: 'The brew panel shows each ingredient’s extracted share and its ceiling at the present heat; trials.' },
  { id: 'heat-damage', name: 'Combustion of raw ingredients', role: 'core', stage: 'preparation', rank: 0,
    decision: 'Keep undissolved ingredients below the heat at which they burn — every one has its own, found by experiment.',
    consequence: 'Above it the unextracted matter chars and its magic is gone for good; what is already dissolved is safe. Water boils first, so only oil (or a dry pot) gets hot enough.',
    objective: 'Hot oil steeps that do not throw herbs away.',
    feedback: 'Charring smoke, the journal’s burning temperatures once seen (unknown until then), trials.' },
  { id: 'cold-extraction', name: 'Cold extraction', role: 'core', stage: 'preparation', rank: 1,
    decision: 'Steep cold — in spirit below water’s freezing point, or in chilled oil — instead of warm.',
    consequence: 'Only near −10 °C does everything come out; water freezes long before, and a frozen solvent extracts nothing. Cold is slow.',
    objective: 'The strongest potion an ingredient can give; alcohol-free cold tinctures.',
    feedback: 'The brew panel’s ceiling bars, the thermometer, trials.' },
  { id: 'awakening', name: 'Arcane awakening', role: 'core', stage: 'transformation', rank: 2,
    decision: 'Heat (or chill) a well-mixed brew past the blend’s arcane threshold, or keep it below.',
    consequence: 'Awakened magic runs two to three times stronger, side effects too, and stays awake.',
    objective: 'Strong orders beyond what sleeping magic reaches; plain orders that must not overshoot.',
    feedback: 'The glow, the journal’s awakening temperatures, the Arcanometer’s threshold reading, trials.' },
  { id: 'concentration', name: 'Concentration and dilution', role: 'core', stage: 'balancing', rank: 0,
    decision: 'Boil water off with the lid open, or add water.',
    consequence: 'Boiling a third away strengthens every effect by about 40 %, wanted and unwanted; water weakens both.',
    objective: 'Strong orders (“strong and compact”); taming a brew that overshoots its purity limit.',
    feedback: 'Steam escaping (brew advice), the volume, trials.' },
  { id: 'distillation', name: 'Distillation', role: 'core', stage: 'balancing', rank: 1,
    decision: 'Put the alembic’s still head on and heat between spirit’s and water’s boiling points.',
    consequence: 'Spirit boils off through the condenser into the receiver, water mostly stays and the dissolved magic never boils. The spirit collected goes back on the shelf.',
    objective: 'Alcohol-free potions that were steeped in spirit; recovering spirit instead of buying it.',
    feedback: 'The brew panel’s spirit reading, the receiver, the alcohol line of an order.' },
  { id: 'emulsification', name: 'Emulsification', role: 'core', stage: 'balancing', rank: 1,
    decision: 'Bind a watery extract and an oily one with an emulsifier, in the right proportions.',
    consequence: 'With enough emulsifier (about 6 % of the smaller phase) and the smaller phase under two fifths of the liquid, oil and water become one potion; otherwise they part again. An emulsion extracts badly, so extract first, then emulsify.',
    objective: 'Potions that need magic from both oil- and water-soluble herbs.',
    feedback: 'The brew panel’s emulsion reading, layers that part or stay mixed, trials.' },
  { id: 'aging', name: 'Aging on the shelves', role: 'production', stage: 'production', rank: 1,
    decision: 'Choose a bottle on the potion shelves, put as much of another shelved Fire or Frost potion as you choose in its Fire/Frost slot, and a rune in its rune slot to hold the temperature.',
    consequence: 'Extraction goes on for hours, even while the shop is closed. The stronger the potion’s Fire (or Frost), the hotter (or colder) the bottle goes, by itself; the potion is used up as it works, and when it is spent the bottle returns to cellar temperature. Unsealed, it is a new, untested batch. A rune stops the rise or fall where you choose, and wears out with use.',
    objective: 'Full, slow extraction without standing at the cauldron.',
    feedback: 'The selected bottle on the shelves: its temperature, the potion left in its slot and how far it can go, extraction, and the rune.' },
  { id: 'mixing', name: 'Mixing', role: 'supporting', stage: 'balancing', rank: 0,
    decision: 'Stir, and how thoroughly, after every addition.',
    consequence: 'Powders dissolve faster when stirred (about 40 % more in a cold brew), neutralisers meet what they cancel, and every bottle of the batch comes out the same.',
    objective: 'Bottles that match the trials of their batch (shared batch evidence).',
    feedback: 'The swirl of colours, brew advice (“uneven: stir”), bottles whose evidence goes stale.' },
  { id: 'experimentation', name: 'Trials on rabbits', role: 'core', stage: 'experimentation', rank: 0,
    decision: 'How many doses, how large, on how many rabbits — and when a rabbit needs a purge.',
    consequence: 'Each reading narrows the estimate; several rabbits average out each one’s bias; doses pile up in a rabbit.',
    objective: 'A label customers trust and pay for; proof for demanding customers; disputes won.',
    feedback: 'The expected-effects section: value, margin, evidence level, detection limit.' },
  { id: 'commerce', name: 'Labels and bargaining', role: 'core', stage: 'commerce', rank: 0,
    decision: 'What to claim on the label and what price to ask.',
    consequence: 'Customers pay for claims they trust and come back if the potion or the label failed them.',
    objective: 'Coins and reputation, patrons who return.',
    feedback: 'The customer’s reasons in the bargaining, next-day verdicts.' },
  { id: 'gathering', name: 'Gathering', role: 'supporting', stage: 'formulation', rank: 0,
    decision: 'Where, when (dawn, dusk, weather) and how carefully to harvest.',
    consequence: 'Ingredients the market does not sell; careful harvests regrow faster.',
    objective: 'Supplying every order without the market’s prices.',
    feedback: 'The wilds’ deposits, weather and hours.' },
  { id: 'storage', name: 'Potion shelves', role: 'production', stage: 'production', rank: 0,
    decision: 'Bottle a batch for later customers.',
    consequence: 'Bottles of one batch share its trials (each checked against its own contents).',
    objective: 'Serving a later order without brewing or testing again.',
    feedback: 'The shelf, bottles that already meet the order.' },
  { id: 'batch', name: 'Batch size', role: 'production', stage: 'production', rank: 0,
    decision: 'How large a batch to brew.',
    consequence: 'A larger vessel brews bigger orders and several bottles from one tested batch.',
    objective: 'Contracts and repeat orders.',
    feedback: 'The cauldron’s fill line.' },
  { id: 'automation', name: 'Recipes and the homunculus', role: 'production', stage: 'production', rank: 0,
    decision: 'Save a procedure that worked, and brew it again.',
    consequence: 'The same ingredients prepared the same way give the same potion; a reproduced recipe is reliable.',
    objective: 'Repeat orders with less work and less testing.',
    feedback: 'The recipe book: formulation, procedure and reproduction kept apart.' },
];

/** @type {Record<string, Mechanic>} */
export const MECHANIC_BY_ID = Object.fromEntries(MECHANICS.map((m) => [m.id, m]));

/**
 * Physics that stays for immersion and comprehension only: simulated,
 * visible, never a requirement, a price or a purchase (the Free Experiment
 * shows their numbers).
 */
export const IMMERSION = [
  { id: 'layering', name: 'Density and layering', note: 'Liquids that do not mix stratify by density; every natural extract mixes with water, so layering never separates magic. The tap draws from the bottom.' },
  { id: 'viscosity', name: 'Viscosity', note: 'Pastes and doughs hold their shape; natural brews stay watery.' },
  { id: 'charge', name: 'Electric charge', note: 'Storm Glass carries charge into conductive brews; sparks warm what they pass through.' },
  { id: 'phases', name: 'Freezing, melting, boiling and vapour', note: 'Rigid frozen blocks, vapour under the lid, condensation, latent heat.' },
  { id: 'fire', name: 'Burning', note: 'Oil and spirit catch fire on glowing iron; the lid smothers it.' },
  { id: 'appearance', name: 'Colour, glow and bubbles', note: 'The colour shows what is dissolved; awakened magic glows.' },
];

/**
 * Controls that only the Free Experiment offers: they demonstrate the
 * physics but give the campaign no decision.
 */
export const SANDBOX_CONTROLS = ['skimmer', 'alembic', 'heatmap', 'readouts'];
