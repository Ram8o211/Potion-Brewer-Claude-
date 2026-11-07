// The guide: how the shop works, kept in one place — the Book's Guide tab
// and How to play in the menus. The rooms themselves show only what is
// happening; every explanation lives here.

import { h } from './dom.js';
import { icon } from './icons.js';

/** A day in the shop, in order. */
const DAY = [
  'Dawn: gather herbs and minerals in the Wilds (dawn flowers close once the shop opens).',
  'Open the door at the Counter and read the customer’s order.',
  'Brew: pour, crush, stir, heat or chill in the cauldron.',
  'Test a dose on a rabbit in Trials: only a test shows what a mixture does.',
  'Bottle it, check the label and sell it at the Counter — agree on a price.',
  'When the last customer has gone (dusk), close the shop for the night.',
];

/** @type {[string, string, string[], boolean?][]} [title, icon, lines, open at first] */
const SECTIONS = [
  ['Orders and selling', 'stall', ['Customers ask for an effect — healing, strength, love, fire… — at a strength in percent (everyday orders want about 8–15 %).', 'Most orders forbid side effects: “no other effect above 1.2 %”. Every other kind of magic in the bottle must stay that faint.', 'Before a sale you write the label — tested values, the guild theory’s estimates, “none” or unknown — and bargain over the price. The customer comes back the next day: pleased, or with a complaint. Refund them, dispute it with your trial records, or turn them away.', 'Bottle onto the potion shelves whenever there is room (3 bottles; more with a Bottle Shelf, Potion Cabinet or Bottle Cellar). Bottles of one batch share its trials.', 'Honest, well-tested potions earn reputation. Reputation raises your rank, which opens regions, ingredients, equipment and harder orders.'], true],
  ['Ingredients and side effects', 'leaf', ['The Shop sells no prepared reagents — only free well water and two plain solvents, oil and spirit. Every effect comes from what you gather.', 'Nothing that grows is pure: each herb or mineral brings side effects. Cancel them with their opposites — fire and frost, life and death (life also mends poison, two parts to one), acid and alkali.', 'Long-press (or right-click) a jar to see what it does and what cancels its side effects.', 'You know what each plain ingredient does. You do NOT know what a mixture does: extraction, heat, reactions and hidden laws change it.']],
  ['Brewing', 'cauldron', ['Pour: tap a jar, then a dose button (25–250 ml) — or hold your finger in the cauldron, or drag a jar onto it.', 'Crush: whole roots, leaves and stones go into the pot whole and give up little until you break them up with Crush (the pestle). Add more of an herb after it has reached its ceiling and its extracted share falls (the new leaves are not yet drawn out), then climbs back to the ceiling as they steep — and the brew grows stronger. Sample shows both: what is drawn out in the sample from the tap, and over the whole cauldron, whole pieces included.', 'Extraction: an herb’s magic dissolves only in its own solvent — water-soluble herbs in water or spirit, oil-soluble ones only in oil (see the herb’s card). At room temperature only about 60 % of it comes out, and slowly (minutes). Heat makes it much quicker, but less can come out hot (about 45 % at 60 °C); cool it again and more comes out. Everything comes out only well below freezing — in spirit (water freezes) or chilled oil — and very slowly: that is work for aging (Counter → potion shelves). A frozen solvent extracts nothing. Watch the brew panel’s Extracted bars.', 'Burning: every herb has its own burning point, above water’s boil, found only by trying. Undissolved matter above it chars and its magic is lost; what is already dissolved is safe. Water boils first, so it is hot oil that burns herbs.', 'Emulsions: oil and water extracts stay apart unless an emulsifier binds them — the neutral gum from the Shop, about 6 % of the smaller phase, with the smaller phase under two fifths of the liquid. An emulsion extracts badly: extract each in its own solvent first, then bind them.', 'Distillation (Alembic & Condenser): put the still head on and heat between spirit’s and water’s boiling points; the spirit goes into the receiver and the magic stays. Jar the distillate to use the spirit again.', 'Aging (with the Aging Cellar): select a bottle on the potion shelves (Counter). It has two slots: put a shelved Fire or Frost potion in the first — as much as you choose, by tapping the slot or dragging the bottle onto it — and the bottle warms or chills by itself, the stronger the potion the further, using it up as it works; a temperature rune in the second holds the temperature where you choose on the way, and wears out with use. A biome rune in the third — one of each biome’s effect (the Whisperwood’s Vitality Rune, the Willow Bank’s Frost Rune…), dug out of the earth in the Wilds, where it glows under the ground (a new one every day) — draws out ×4 quicker whatever carries its effect, as quickly in the cold as at room temperature, without lowering how much can come out. The bottle goes on extracting for hours, even while the game is closed. Unseal it when it is ready: it becomes a new, untested batch.', 'Stir after every addition: an unstirred brew pours unevenly, so later bottles may not match the tested dose.', 'The fire control: right heats, left cools; the gentle half of the slider is spread out for fine control, and − / + (or the arrow keys) move the flame two degrees at a time. The readout shows the flame (or the cold plate) and the cauldron floor. Tap Off beside it (or press 0) to put it out at once. The lid keeps steam in; boiling with the lid off makes a brew smaller and stronger — side effects too. Add water to weaken it.', 'Tap the ml · °C readout over the cauldron to see what is in it; Sample measures what a bottle drawn from the tap would hold (its composition, and with the Arcanometer its aura and arcane threshold).']],
  ['Arcane awakening', 'awaken', ['Magical ingredients carry a hidden arcane threshold. Heat the brew past it (or, for cold magic, chill it below) and the magic awakens: it glows and acts two to three times stronger — side effects too.', 'In a blend the threshold is the mix of its magical ingredients’ thresholds, by volume. Mix first at room temperature, then heat or chill; a half-mixed brew awakens unevenly.', 'Awakened magic stays awake when it cools, is bottled or kept. Only dilution and reactions undo it. The Arcanometer reads a brew’s threshold.']],
  ['Trials and rabbits', 'rabbit', ['Choose a rabbit and give it a dose (5, 10 or 25 ml) from the cauldron tap or the sealed vial. One trial reads every effect at once.', 'Each reading is uncertain: the ± margin is how far the truth may lie. One reading is a rough guess; repeating it on the same rabbit helps a little; other rabbits help most (detected once → repeated → corroborated).', '“Not detected” is not proof of absence: a faint effect can hide below the noise. Cautious customers want readings repeated or corroborated, and every customer pays more for a well-tested label.', 'Effects pile up in a rabbit and fade slowly. Past its own hidden limit an effect runs out of control and can kill it; fire and acid burn; strength and vitality can make it attack; love makes it mate. A purging draught washes everything out. Rabbits can be fed, bred, bought and put down; a body’s remains can be recovered once as an ingredient.', 'When a trial surprises you, a hidden law may be at work. Confirm it twice and your theory learns it.']],
  ['Wilds', 'tree', ['Tap a mature plant in the picture, or its button, to gather. Every plant grows from sprout to ripe to mature, and only a mature one can be harvested. A harvest leaves a mark on the ground that fades; new sprouts come up at random spots until the region is full again, even while the game is closed.', 'Thorough digs the plant out for twice as much, but its kind then sprouts at half pace. Roots, seams, mosses and dust need the Forager’s Kit for a full harvest.', 'Twilight plants open only at dawn (before you open the shop) or at dusk (after the last customer). The weather changes daily. New regions open with rank.']],
  ['Recipes and the Book', 'book', ['After a sale you can save the brew as a recipe: what went in, and every step in order. Prepare pours it again; the Brass Homunculus replays every step.', 'The Book also keeps every trial, the laws you discovered, all ingredients, your journal, awards and sales.']],
  ['Keys and tips', 'bulb', ['Keys: 1 pour · 2 stir · 3 crush · I inventory · L lid · B bottle · arrows fire · 0 fire off · S shop · R recipes · C/V/W/T/J rooms · Esc menu.', 'Advice at the Counter buys a hint for a hard order.', 'Orders far below your rank earn little reputation; a technique sold well for the first time earns a bonus.', 'Out of money? The guild helps a struggling apprentice once a day — and well water is always free.', 'The Free Experiment has every tool, the skimmer, the alembic and exact physical readings.']],
  ['The Counter', 'stall', [
    'At dawn the shop is still closed: dawn flowers are open in the Wilds only until you open the door. Brew ahead for the shelves, or open up when you are ready.',
    'At dusk, after the last customer, the twilight plants are open in the Wilds until you close for the night.',
    'With an order on the counter: brew it, test a dose in Trials, then Bottle it — the sealed vial appears at the Counter, ready to label and sell.',
    'The order’s plan lists where each wanted effect can be had today. Every carrier brings side effects: plan what will cancel them. Long-press a jar on the shelf to see its effects.',
    'Potion shelves: when you bottle a brew, choose “To the potion shelves” to keep it for a later customer. Tap a bottle to use it. More shelving is sold in the Shop.',
    'Rank and reputation grow with every satisfied customer; the day, its customers and any market event are shown at the top of the Counter.',
  ]],
  ['The Garden', 'seedling', [
    'Choose a seed, then tap an empty plot of the right bed to sow it. Water the plots; ripe crops are harvested with a tap.',
    'Seeds come from the Wilds: harvests sometimes drop one — common species often, rare ones seldom, Arcane ones rarely.',
  ]],
  ['Gathering in the Wilds', 'leaf', [
    'Slide a finger across a ripe plant to shake its fruit loose, then tap what falls. Each ingredient is listed under the scene once you have gathered it for the first time.',
    'Careful harvesting leaves the plant to grow back; Thorough takes the whole specimen, roots and all, for twice as much.',
    'Dawn plants are open until you open the shop, dusk plants after the last customer until you close. The weather changes what grows and how much.',
    'Your stores hold a set amount of each ingredient (the satchel carries half as much again). A harvest takes its specimen for good, and may drop a seed for your garden.',
    'The wilds do not grow back by themselves: spend a Traveller Coin to regenerate a biome — new scenery, new species, new specimens. Coins recharge with time, and delighted customers sometimes give one.',
  ]],
  ['The rabbit farm', 'rabbit', [
    'One reading is a rough guess: test again, ideally on another rabbit. Too much of an effect in one rabbit can make it sick, wild or dead.',
    'All trials on one rabbit keep its own bias in the estimate, and the effect piles up in it towards a limit nobody can see.',
    'A mixture’s effects are unknown until it is tested: choose a rabbit and give it a dose from the cauldron or the sealed vial.',
  ]],
  ['Special orders', 'awaken', [
    'Awakened magic: some orders are stronger than sleeping magic can reach — the brew must be awakened past its arcane threshold (see Arcane awakening).',
    'A pure potion: “no other effect above 1.2 %” means every effect the customer did not ask for must stay that faint. Test for them too.',
  ]],
  ['The Book', 'book', [
    'Trials: every trial records exactly what it revealed and what the guild theory expected.',
    'Laws: each world hides laws of resonance between effects. A law shows itself in trials where its effects meet; two observations confirm it.',
    'Ingredients: the effects of every plain ingredient are known to the guild. Mixtures are not — that is what the trials are for.',
  ]],
];

/**
 * Fill `body` with the guide: the day's round, then one folding section per
 * topic (one open at a time).
 * @param {HTMLElement} body @returns {HTMLElement}
 */
export function renderGuide(body) {
  body.append(h('div', { class: 'card parch help-day' }, h('h3', { text: 'A day in the shop' }),
    h('ol', { class: 'small' }, ...DAY.map((t) => h('li', { text: t })))));
  for (const [title, ic, lines, open] of SECTIONS) {
    body.append(h('details', { class: 'card parch help-sec', open: open || null },
      h('summary', {}, icon(ic), h('span', { text: title })),
      ...lines.map((l) => h('div', { class: 'small', text: '• ' + l }))));
  }
  // opening one section closes the others
  body.addEventListener('toggle', (e) => {
    const t = /** @type {HTMLDetailsElement} */ (e.target);
    if (t.open) for (const d of body.querySelectorAll('details[open]')) if (d !== t) /** @type {HTMLDetailsElement} */ (d).open = false;
  }, true);
  return body;
}
