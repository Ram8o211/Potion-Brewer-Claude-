// Customer requests: who wants which effects, and why.
//
// What customers ask for follows the shop's maps: only the dominant effects
// of the biomes it has opened are ever asked for (commissions.js), single
// effects first, combinations from the rank of Adept on, ever stronger.
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
  { id: 'cooling', title: 'Cooling Draught', fx: [{ key: 'frost' }], who: ['healer', 'hunter', 'blacksmith', 'traveler'], minTier: 0,
    story: ['A child with a burning fever. It must be properly cold-natured.', 'I crossed the salt flats and my blood is still boiling. Something icy.', 'A dragon-bite on my forearm. Frost, and plenty of it.'] },
  { id: 'insight', title: 'Draught of Insight', fx: [{ key: 'arcana' }], who: ['scholar', 'wizard', 'noble', 'witch'], minTier: 0,
    story: ['My treatise is stuck on the same page for a month. Sharpen my mind — and only my mind.', 'The stars align tonight. I need clear arcane sight for the reading.', 'Examinations at the academy. True arcana, if you please.'] },
  { id: 'change', title: 'Transmutation Elixir', fx: [{ key: 'transformation' }], who: ['witch', 'wizard', 'noble', 'bard'], minTier: 0,
    story: ['A masquerade at the duke’s. I wish to arrive as someone — something — else.', 'My garden grows too plainly. I want to coax it into stranger shapes.', 'The coven’s rite needs a draught of pure change.'] },
  { id: 'settling', title: 'Settling Draught', fx: [{ key: 'acidity', sign: -1 }], who: ['innkeeper', 'healer', 'noble', 'farmer'], minTier: 1,
    story: ['Too much feasting. My stomach burns with acid — something chalky and alkaline to settle it.', 'Heartburn, every night since the harvest supper. An alkaline draught, nothing else.'] },
  { id: 'etching', title: 'Etching Acid', fx: [{ key: 'acidity' }], who: ['blacksmith', 'scholar', 'witch'], minTier: 1, drunk: false, tolerate: ['toxicity', 'fire'],
    story: ['I etch my maker’s mark into blades. A strong acid that bites steel.', 'Copper plates for my engravings. It must bite cleanly.'] },
  { id: 'bane', title: 'Pest Bane', fx: [{ key: 'toxicity' }], who: ['farmer', 'hunter', 'innkeeper'], minTier: 1, drunk: false, tolerate: ['death', 'acidity'],
    story: ['Rats in the granary, bold as cats. It has to be poisonous to them.', 'Slugs have eaten half my cabbages. Deadly to pests, please.'] },
  { id: 'fleetfoot', title: 'Fleetfoot Draught', fx: [{ key: 'swiftness' }], who: ['traveler', 'hunter', 'bard', 'knight', 'farmer'], minTier: 0,
    story: ['The royal post leaves at noon and I carry the satchel. My legs must outrun the horses.', 'A race at the summer fair, and my rival cheats. Make me swift — honestly swift.', 'The goats got out again and they are faster than me. Something to put wind in my heels.'] },
  { id: 'reaper', title: 'Reaper’s Bane', fx: [{ key: 'death' }], who: ['farmer', 'hunter', 'witch', 'innkeeper'], minTier: 0, drunk: false, tolerate: ['toxicity'],
    story: ['Rats in the granary, bold as cats. It has to be deadly to them.', 'Something is killing my sheep at night. I mean to bait the brute.', 'Blight in the orchard roots. A draught of death for the rot, poured on the soil.'] },
  { id: 'featherfall', title: 'Featherfall Elixir', fx: [{ key: 'levitation' }], who: ['wizard', 'scholar', 'noble', 'blacksmith', 'traveler'], minTier: 0,
    story: ['I mend the cathedral’s spire. A fall would be my last — unless I could float down.', 'The bell for the new tower weighs a ton. Make the bearers light as feathers.', 'I mean to cross the gorge where the bridge fell. Lighten me.'] },
  { id: 'vanishing', title: 'Vanishing Draught', fx: [{ key: 'invisibility' }], who: ['hunter', 'noble', 'bard', 'witch', 'traveler'], minTier: 0,
    story: ['The stag I stalk has seen me three seasons running. Not this time.', 'A masked ball — and a rival I would rather not be seen by.', 'Bandits on the north road. I would like to pass them unseen.'] },
  { id: 'thunder', title: 'Thunderhead Tonic', fx: [{ key: 'storm' }], who: ['knight', 'blacksmith', 'wizard', 'hunter'], minTier: 0,
    story: ['The tourney judges love a show. I want sparks flying off my lance.', 'My forge will not take the star-iron. Lightning in my arm might.', 'I duel a stormcaller at dawn. Fight fire with — well, with storm.'] },
  { id: 'dreaming', title: 'Draught of True Dreams', fx: [{ key: 'dream' }], who: ['scholar', 'healer', 'witch', 'noble', 'wizard'], minTier: 0,
    story: ['I have not slept in a week for the nightmares. Give me deep, kind dreams.', 'The oracle speaks only in dreams. I must dream true tonight.', 'My patient will not rest. A draught of sleep, and nothing else.'] },
  // ---- coherent combinations
  { id: 'expedition', title: 'Forced-March Draught', fx: [{ key: 'strength' }, { key: 'swiftness', share: 0.6 }], who: ['knight', 'hunter', 'traveler'], minTier: 2,
    story: ['We ride into the Thornwastes. Strong enough to carry the wounded, quick enough to outrun the wardens.', 'A long patrol beyond the border. Strength for the packs, speed for the miles.'] },
  { id: 'hearth', title: 'Hearth-and-Heart Cordial', fx: [{ key: 'fire' }, { key: 'love', share: 0.7 }], who: ['innkeeper', 'farmer', 'bard'], minTier: 2,
    story: ['Our cottage is cold and so is my marriage. Fire for the hearth and love for the heart, in one cup.', 'A winter wedding in a draughty barn. Warm them through, and warm them to each other.'] },
  { id: 'recovery', title: 'Soldier’s Recovery', fx: [{ key: 'vitality' }, { key: 'strength', share: 0.6 }], who: ['knight', 'healer', 'hunter'], minTier: 2,
    story: ['My company limps home from the siege. Heal the wounds and put the strength back in their legs.', 'Back from a bear hunt with three broken ribs. Mend me, and make me strong enough to try again.'] },
  { id: 'messenger', title: 'Courier’s Second Wind', fx: [{ key: 'swiftness' }, { key: 'vitality', share: 0.6 }], who: ['traveler', 'knight', 'bard'], minTier: 2,
    story: ['Three days in the saddle and three more to go. Mend the aches and keep me quick.', 'The relay runners collapse at the last mile. Heal them as they run.'] },
  { id: 'forgefire', title: 'Forge-Fire Tonic', fx: [{ key: 'strength' }, { key: 'fire', share: 0.6 }], who: ['blacksmith', 'knight'], minTier: 2,
    story: ['The great bell must be cast tonight. Strength to swing the hammer, fire to stand the heat.', 'A duel at dawn in the frozen yard. Strength, and fire against the cold.'] },
  { id: 'blessing', title: 'Wedding Blessing', fx: [{ key: 'love' }, { key: 'vitality', share: 0.6 }], who: ['noble', 'bard', 'healer'], minTier: 2,
    story: ['My daughter weds the baron’s son. A toast for long life and true affection.', 'A blessing for the newlyweds: health to them, and love between them.'] },
  { id: 'escape', title: 'Thief’s Escape', fx: [{ key: 'invisibility' }, { key: 'swiftness', share: 0.6 }], who: ['bard', 'hunter', 'traveler'], minTier: 2,
    story: ['Do not ask why. Unseen, and fast — that is all I need.', 'The sheriff knows my face. I would rather he did not see it, nor catch it.'] },
  { id: 'skyward', title: 'Skyrunner’s Draught', fx: [{ key: 'levitation' }, { key: 'swiftness', share: 0.6 }], who: ['traveler', 'wizard', 'noble'], minTier: 2,
    story: ['A race across the rooftops of the capital. Light feet, and quick ones.', 'I chase a runaway kite over the cliffs. I must float and I must hurry.'] },
  { id: 'tempest', title: 'Thunder Strike', fx: [{ key: 'storm' }, { key: 'strength', share: 0.6 }], who: ['knight', 'blacksmith'], minTier: 2,
    story: ['The champion’s blow, with lightning in it. The crowd will never forget.', 'The star-iron needs a hammer with thunder behind it.'] },
  { id: 'healingsleep', title: 'Healing Sleep', fx: [{ key: 'vitality' }, { key: 'dream', share: 0.5 }], who: ['healer', 'noble'], minTier: 2,
    story: ['The fever leaves them no rest. Heal them while they sleep.', 'The prince must sleep and mend. Both, in one draught.'] },
  { id: 'sweetdreams', title: 'Sweet Dreams', fx: [{ key: 'dream' }, { key: 'love', share: 0.6 }], who: ['bard', 'noble', 'innkeeper'], minTier: 2,
    story: ['I want to dream of her every night until she comes home.', 'For the honeymoon suite: dreams, and the sweetest ones.'] },
  { id: 'shapeshift', title: 'Shapeshifter’s Study', fx: [{ key: 'transformation' }, { key: 'arcana', share: 0.6 }], who: ['wizard', 'witch', 'scholar'], minTier: 3,
    story: ['I study the old shapeshifters. I need to change, and understand the change while it happens.', 'The coven elders want a true shifting draught: change of form, guided by arcane sight.'] },
  { id: 'seersleep', title: 'Seer’s Sleep', fx: [{ key: 'arcana' }, { key: 'dream', share: 0.6 }], who: ['wizard', 'scholar', 'witch'], minTier: 3,
    story: ['The prophecy comes only in sleep, and only to a sharpened mind.', 'I read the stars in my dreams. Give me both the sight and the sleep.'] },
  { id: 'ghostwalk', title: 'Ghostwalk Elixir', fx: [{ key: 'invisibility' }, { key: 'levitation', share: 0.6 }], who: ['wizard', 'noble', 'witch'], minTier: 3,
    story: ['To walk through the haunted abbey like one of its ghosts: unseen, unheard, not touching the floor.', 'A wager with the duke: I will cross his hall in plain sight without being seen or heard.'] },
  { id: 'warpath', title: 'War-Path Draught', fx: [{ key: 'strength' }, { key: 'fire', share: 0.5 }, { key: 'vitality', share: 0.5 }], who: ['knight'], minTier: 4,
    story: ['The northern campaign. Strength, fire against the frost and healing for the march — the general’s own order.'] },
  { id: 'starseer', title: 'Star-Seer’s Elixir', fx: [{ key: 'arcana' }, { key: 'transformation', share: 0.5 }, { key: 'love', share: 0.4 }], who: ['wizard', 'noble'], minTier: 4,
    story: ['A rite under the comet: sight, change and the bond between the casters — all three, in measure.'] },
  { id: 'stormrider', title: 'Stormrider’s Elixir', fx: [{ key: 'storm' }, { key: 'levitation', share: 0.5 }, { key: 'swiftness', share: 0.5 }], who: ['wizard', 'knight'], minTier: 4,
    story: ['I mean to ride the thunderhead itself: lightning, lightness and speed.'] },
];

/** Concentration targets (percent) of a request's main effect by tier. */
export const TIER_TARGET = [[8, 15], [10, 18], [13, 22], [17, 28], [22, 34]];

/** Hard limit on any effect the customer did not ask for (percent). */
export const PURITY_LIMIT = 1.2;

/** @param {string} id */
export function requestById(id) {
  return REQUESTS.find((r) => r.id === id);
}
