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
  { id: 'extraction', name: 'Grinding and extraction', role: 'core', stage: 'preparation', rank: 0,
    decision: 'Grind in the mortar, crush in the pot, or drop in whole.',
    consequence: 'Only what dissolves acts: a whole herb gives nothing, the same herb ground gives its effects.',
    objective: 'Reaching the strength the order asks for at all.',
    feedback: 'Brew advice (“whole herbs: crush”), the brew’s colour, trials.' },
  { id: 'steeping', name: 'Steeping temperature', role: 'core', stage: 'preparation', rank: 0,
    decision: 'How hot to steep, for how long, and which ingredients go in before the steep.',
    consequence: 'Inside an ingredient’s steeping window it gives up two to three times as much; outside it only what dissolves.',
    objective: 'Strength without wasting herbs; an ingredient added after the steep stays weak.',
    feedback: 'The lore of each herb, the reaction once discovered (its window in the journal), brew advice, trials.' },
  { id: 'heat-damage', name: 'Heat-sensitive ingredients', role: 'core', stage: 'preparation', rank: 0,
    decision: 'Keep delicate petals below their spoiling heat.',
    consequence: 'Overheated Heartpetal wilts: its love falls to a quarter and a poison appears.',
    objective: 'Love philtres and cordials must not be boiled.',
    feedback: 'The petal’s lore, the wilting reaction in the journal, trials.' },
  { id: 'cold-extraction', name: 'Cold extraction', role: 'core', stage: 'preparation', rank: 0,
    decision: 'Steep ice-cold ingredients cold — but not frozen — instead of warm.',
    consequence: 'Frostcap held at 5–10°C gives two and a half to three times the frost it gives warm; frozen solid it gives less again. The basin holds 9°C; narrower windows (Grave Moss) need the Frost Rune.',
    objective: 'Cooling and fever orders at strength.',
    feedback: 'The lore (“steeps only in ice-cold water”), the thermometer, trials.' },
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
  { id: 'mixing', name: 'Mixing', role: 'supporting', stage: 'balancing', rank: 0,
    decision: 'Stir, and how thoroughly, after every addition.',
    consequence: 'Powders dissolve faster when stirred (about 40 % more in a cold brew), neutralisers meet what they cancel, and every bottle of the batch comes out the same.',
    objective: 'Bottles that match the trials of their batch (shared batch evidence).',
    feedback: 'The swirl of colours, brew advice (“uneven: stir”), bottles whose evidence goes stale.' },
  { id: 'serving', name: 'Serving temperature', role: 'supporting', stage: 'balancing', rank: 0,
    decision: 'Bring the brew to the asked temperature before bottling.',
    consequence: 'The bottle keeps the temperature of the brew it was drawn from, and cools slowly.',
    objective: 'Customers who want a draught hot or chilled.',
    feedback: 'The thermometer.' },
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
