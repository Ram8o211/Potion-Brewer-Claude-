// Customer requests: who wants which effects, and why.
//
// Every effect commission starts from one of these situations. A request
// names the effects the customer needs (one to three, chosen to fit one
// coherent purpose — a soldier wants strength and the power to change shape
// for an expedition, never love and poison at once), the kinds of people who
// ask for it, the tier from which it appears, and a few ways of telling the
// story. The generator (commissions.js) then has to find a real way to brew
// it with what the player can buy, gather and equip before the customer is
// allowed to ask.

/**
 * @typedef {Object} RequestTemplate
 * @property {string} id
 * @property {string} title          potion name
 * @property {{key:string, sign?:number, share?:number}[]} fx  wanted effects (share: target relative to the first)
 * @property {string[]} who          archetype keys that ask for it
 * @property {number} minTier
 * @property {boolean} [drunk]       false: applied, not drunk (no purity limit on its harmful partners)
 * @property {string[]} [tolerate]   unwanted effects the customer does not mind (special orders)
 * @property {string[]} story        greeting + purpose; {name} is the customer's first name
 */

/** @type {RequestTemplate[]} */
export const REQUESTS = [
  // ---- single effects
  { id: 'healing', title: 'Healing Draught', fx: [{ key: 'vitality' }], who: ['healer', 'farmer', 'innkeeper', 'knight', 'hunter'], minTier: 0,
    story: ['My patients are wasting with fever. I need something that truly heals — and nothing else in it.', 'The goats are poorly and so is my back. A healing draught, plain and honest.', 'A traveller collapsed in my common room. Something to bring the colour back to his face.'] },
  { id: 'strength', title: 'Draught of Might', fx: [{ key: 'strength' }], who: ['knight', 'blacksmith', 'hunter', 'farmer', 'traveler'], minTier: 0,
    story: ['The new anvil arrives tomorrow and it takes four men to lift. I want to be one of them.', 'Harvest is in and the carts are heavy. Strength in my arms, nothing more.', 'A tourney at the castle. My lance arm must not tire.'] },
  { id: 'love', title: 'Love Philtre', fx: [{ key: 'love' }], who: ['bard', 'innkeeper', 'noble', 'farmer'], minTier: 0,
    story: ['There is someone I sing to every night, and she has not once looked up. Just a little warmth in her heart.', 'For a betrothal feast — it should warm every heart at the table, and do nothing else.', 'My husband has grown cold as a cellar. Remind him why he married me.'] },
  { id: 'warming', title: 'Warming Draught', fx: [{ key: 'fire' }], who: ['traveler', 'blacksmith', 'hunter', 'farmer'], minTier: 0,
    story: ['The mountain pass is all ice. Something with real fire in it, against the cold.', 'My forge-hands work through the winter nights. Fire in the belly, nothing more.', 'The well froze and so did I. A warming draught, please.'] },
  { id: 'cooling', title: 'Cooling Draught', fx: [{ key: 'frost' }], who: ['healer', 'hunter', 'blacksmith', 'traveler'], minTier: 1,
    story: ['A child with a burning fever. It must be properly cold-natured.', 'I crossed the salt flats and my blood is still boiling. Something icy.', 'A dragon-bite on my forearm. Frost, and plenty of it.'] },
  { id: 'insight', title: 'Draught of Insight', fx: [{ key: 'arcana' }], who: ['scholar', 'wizard', 'noble'], minTier: 1,
    story: ['My treatise is stuck on the same page for a month. Sharpen my mind — and only my mind.', 'The stars align tonight. I need clear arcane sight for the reading.', 'Examinations at the academy. True arcana, if you please.'] },
  { id: 'change', title: 'Transmutation Elixir', fx: [{ key: 'transformation' }], who: ['witch', 'wizard', 'noble', 'bard'], minTier: 2,
    story: ['A masquerade at the duke’s. I wish to arrive as someone — something — else.', 'My garden grows too plainly. I want to coax it into stranger shapes.', 'The coven’s rite needs a draught of pure change.'] },
  { id: 'settling', title: 'Settling Draught', fx: [{ key: 'acidity', sign: -1 }], who: ['innkeeper', 'healer', 'noble', 'farmer'], minTier: 1,
    story: ['Too much feasting. My stomach burns with acid — something chalky and alkaline to settle it.', 'Heartburn, every night since the harvest supper. An alkaline draught, nothing else.'] },
  { id: 'etching', title: 'Etching Acid', fx: [{ key: 'acidity' }], who: ['blacksmith', 'scholar', 'witch'], minTier: 1, drunk: false, tolerate: ['toxicity', 'fire'],
    story: ['I etch my maker’s mark into blades. A strong acid that bites steel.', 'Copper plates for my engravings. It must bite cleanly.'] },
  { id: 'bane', title: 'Pest Bane', fx: [{ key: 'toxicity' }], who: ['farmer', 'hunter', 'innkeeper'], minTier: 1, drunk: false, tolerate: ['death', 'acidity'],
    story: ['Rats in the granary, bold as cats. It has to be poisonous to them.', 'Slugs have eaten half my cabbages. Deadly to pests, please.'] },
  { id: 'swiftfoot', title: 'Swiftfoot Draught', fx: [{ key: 'swiftness' }], who: ['traveler', 'hunter', 'bard', 'knight'], minTier: 1,
    story: ['The king’s courier rides at dawn and the roads are long. Quickness in the legs, nothing else.', 'A footrace at the summer fair, and the miller’s boy has never lost. Make me quick.'] },
  { id: 'featherfall', title: 'Featherfall Elixir', fx: [{ key: 'levitation' }], who: ['scholar', 'traveler', 'wizard', 'noble'], minTier: 3,
    story: ['I mean to study the sky-isles from below their cliffs. If I fall, I wish to float.', 'The tower stair collapsed. I need to drift up to my study and down again.'] },
  { id: 'shroud', title: 'Shroud Draught', fx: [{ key: 'invisibility' }], who: ['witch', 'hunter', 'noble', 'bard'], minTier: 3,
    story: ['A masked ball where I must not be seen leaving. Fade me out, nothing more.', 'The stag is wary of every shadow. Let it not see me at all.'] },
  { id: 'ghostwalk', title: 'Ghostwalk Philtre', fx: [{ key: 'phasing' }], who: ['scholar', 'wizard', 'witch'], minTier: 3,
    story: ['The library’s sealed wing has no door. I need to walk through its wall.', 'A ghost-hunter must go where ghosts go: through stone.'] },
  { id: 'timeslip', title: 'Timeslip Tonic', fx: [{ key: 'temporal' }], who: ['scholar', 'wizard', 'noble'], minTier: 3,
    story: ['My experiment needs an hour I do not have. Stretch the afternoon for me.', 'An heirloom clock stopped the day grandfather died. I want to see that day again, just once.'] },
  // ---- coherent combinations
  { id: 'expedition', title: 'Expedition Draught', fx: [{ key: 'strength' }, { key: 'transformation', share: 0.6 }], who: ['knight', 'hunter', 'traveler'], minTier: 2,
    story: ['We ride into the Thornwastes. I must be strong enough to carry the wounded, and able to change shape to slip past the wardens.', 'A long patrol beyond the border. Strength for the march, and a change of form for the night watch.'] },
  { id: 'hearth', title: 'Hearth-and-Heart Cordial', fx: [{ key: 'fire' }, { key: 'love', share: 0.7 }], who: ['innkeeper', 'farmer', 'bard'], minTier: 2,
    story: ['Our cottage is cold and so is my marriage. Fire for the hearth and love for the heart, in one cup.', 'A winter wedding in a draughty barn. Warm them through, and warm them to each other.'] },
  { id: 'recovery', title: 'Soldier’s Recovery', fx: [{ key: 'vitality' }, { key: 'strength', share: 0.6 }], who: ['knight', 'healer', 'hunter'], minTier: 2,
    story: ['My company limps home from the siege. Heal the wounds and put the strength back in their legs.', 'Back from a bear hunt with three broken ribs. Mend me, and make me strong enough to try again.'] },
  { id: 'meditation', title: 'Glacial Meditation', fx: [{ key: 'arcana' }, { key: 'frost', share: 0.6 }], who: ['wizard', 'scholar'], minTier: 2,
    story: ['A week of meditation on the glacier. A cold, clear mind — frost to endure, arcana to see.', 'I study the ice-runes of the north. I must think clearly and feel no cold.'] },
  { id: 'forgefire', title: 'Forge-Fire Tonic', fx: [{ key: 'strength' }, { key: 'fire', share: 0.6 }], who: ['blacksmith', 'knight'], minTier: 2,
    story: ['The great bell must be cast tonight. Strength to swing the hammer, fire to stand the heat.', 'A duel at dawn in the frozen yard. Strength, and fire against the cold.'] },
  { id: 'blessing', title: 'Wedding Blessing', fx: [{ key: 'love' }, { key: 'vitality', share: 0.6 }], who: ['noble', 'bard', 'healer'], minTier: 2,
    story: ['My daughter weds the baron’s son. A toast for long life and true affection.', 'A blessing for the newlyweds: health to them, and love between them.'] },
  { id: 'shapeshift', title: 'Shapeshifter’s Study', fx: [{ key: 'transformation' }, { key: 'arcana', share: 0.6 }], who: ['wizard', 'witch', 'scholar'], minTier: 3,
    story: ['I study the old shapeshifters. I need to change, and understand the change while it happens.', 'The coven elders want a true shifting draught: change of form, guided by arcane sight.'] },
  { id: 'fevercure', title: 'Fever Cure', fx: [{ key: 'vitality' }, { key: 'frost', share: 0.5 }], who: ['healer', 'noble'], minTier: 3,
    story: ['The marsh fever: it burns them up from inside. It must heal, and it must cool.', 'The prince is burning with fever. Healing, and cold to break the heat.'] },
  { id: 'warpath', title: 'War-Path Draught', fx: [{ key: 'strength' }, { key: 'fire', share: 0.5 }, { key: 'vitality', share: 0.5 }], who: ['knight'], minTier: 4,
    story: ['The northern campaign. Strength, fire against the frost and healing for the march — the general’s own order.'] },
  { id: 'skysail', title: 'Sky-Sailor’s Draught', fx: [{ key: 'levitation' }, { key: 'swiftness', share: 0.5 }], who: ['traveler', 'knight'], minTier: 4,
    story: ['A courier route over the Skyshard isles: float from one to the next, and quickly.'] },
  { id: 'starseer', title: 'Star-Seer’s Elixir', fx: [{ key: 'arcana' }, { key: 'transformation', share: 0.5 }, { key: 'love', share: 0.4 }], who: ['wizard', 'noble'], minTier: 4,
    story: ['A rite under the comet: sight, change and the bond between the casters — all three, in measure.'] },
];

/** Concentration targets (percent) of a request's main effect by tier. */
// (rebalanced for the slower extraction: a room-temperature steep draws out
// only about 60 % of an ingredient, and the quicker warm steep a planner
// uses less again — about two thirds of the old strengths)
export const TIER_TARGET = [[4, 8], [5, 9], [6, 11], [8, 14], [11, 18]];

/** Hard limit on any effect the customer did not ask for (percent). */
export const PURITY_LIMIT = 1.2;

/**
 * The limit on unwanted effects a customer of a tier holds an order to:
 * apprentices' customers accept a little of what common, impure
 * ingredients carry; masters' customers want it pure. Rarer, purer
 * ingredients are what make the strict limits reachable.
 */
export const PURITY_BY_TIER = [4, 3.2, 2.4, 1.8, 1.2];
/** @param {number} tier */
export const purityLimitFor = (tier) => PURITY_BY_TIER[Math.max(0, Math.min(PURITY_BY_TIER.length - 1, tier | 0))];

/** @param {string} id */
export function requestById(id) {
  return REQUESTS.find((r) => r.id === id);
}
