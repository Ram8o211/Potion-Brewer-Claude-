// Persistent game state and the rules that change it: economy, inventory,
// days and customers, progression, discoveries, recipes and achievements.
// Pure data + logic (no DOM), so it is fully testable headlessly.

import { Rng, hashString } from '../core/rng.js';
import { generateWorld, makeLookup } from '../materials/generator.js';
import { serializeMaterial, deserializeMaterial } from '../materials/schema.js';
import { generateCommission, tutorialCommission } from './commissions.js';
import { EQUIPMENT, STARTING_EQUIPMENT, RANKS, rankIndex, capabilities, equipmentById } from './equipment.js';
import { SIM } from '../simulation/constants.js';

export const SAVE_VERSION = 2;
export const WORLD_GEN_VERSION = 1;

export const MARKET_EVENTS = [
  { key: 'none', name: 'An ordinary day', text: 'Business as usual in the market square.' },
  { key: 'winter', name: 'Bitter Frost', text: 'A cold snap grips the valley — warming draughts pay extra.' },
  { key: 'plague', name: 'Coughing Sickness', text: 'Healers buy restoratives and salves at a premium.' },
  { key: 'conclave', name: 'Mages’ Conclave', text: 'Wizards fill the inns, hungry for arcane brews.' },
  { key: 'festival', name: 'Harvest Festival', text: 'Revellers want colourful tonics and fizzing brews.' },
  { key: 'caravan', name: 'Spice Caravan', text: 'A caravan floods the market — reagents are cheaper today.' },
  { key: 'shortage', name: 'Road Bandits', text: 'Supply wagons were raided — reagents cost more today.' },
];

export const ACHIEVEMENTS = [
  { id: 'first_sale', name: 'Open for Business', desc: 'Sell your first potion.', reward: 10 },
  { id: 'perfect', name: 'Flawless', desc: 'Brew a perfect five-star potion.', reward: 25 },
  { id: 'perfect5', name: 'Master of Precision', desc: 'Brew five perfect potions.', reward: 80 },
  { id: 'dough', name: 'Kneaded It', desc: 'Knead a dough from powder and liquid.', reward: 10 },
  { id: 'frozen', name: 'Cold Hands', desc: 'Freeze a liquid solid.', reward: 15 },
  { id: 'crush', name: 'Grind Stone', desc: 'Crush a solid into grains with the pestle.', reward: 10 },
  { id: 'boil', name: 'Rolling Boil', desc: 'Boil a liquid into vapour.', reward: 10 },
  { id: 'condense', name: 'What Goes Up', desc: 'Condense vapour back into liquid.', reward: 15 },
  { id: 'fire', name: 'Singed Eyebrows', desc: 'Set something alight in the cauldron.', reward: 10 },
  { id: 'react1', name: 'Transmutation', desc: 'Discover your first reaction.', reward: 15 },
  { id: 'react5', name: 'Natural Philosopher', desc: 'Discover five reactions.', reward: 60 },
  { id: 'react10', name: 'Chymist Supreme', desc: 'Discover ten reactions.', reward: 150 },
  { id: 'served10', name: 'Regulars', desc: 'Serve ten customers.', reward: 30 },
  { id: 'served50', name: 'Talk of the Town', desc: 'Serve fifty customers.', reward: 120 },
  { id: 'rich', name: 'Gold in the Coffers', desc: 'Hold 1000 coins at once.', reward: 50 },
  { id: 'journeyman', name: 'Journeyman', desc: 'Reach the rank of Journeyman.', reward: 20 },
  { id: 'adept', name: 'Adept', desc: 'Reach the rank of Adept.', reward: 40 },
  { id: 'expert', name: 'Expert', desc: 'Reach the rank of Expert.', reward: 80 },
  { id: 'master', name: 'Master Alchemist', desc: 'Reach the rank of Master.', reward: 150 },
  { id: 'grand', name: 'Grand Alchemist', desc: 'Complete the Grand Commission.', reward: 500 },
  { id: 'recipe', name: 'Written Down', desc: 'Save a recipe to your book.', reward: 10 },
  { id: 'distil', name: 'Spirit Catcher', desc: 'Collect a distillate with the alembic.', reward: 30 },
  { id: 'layers', name: 'Oil and Water', desc: 'Observe immiscible liquids separating into layers.', reward: 10 },
];

/**
 * @typedef {Object} JournalEntry
 * @property {string} key
 * @property {string} title
 * @property {string} text
 * @property {string} kind    ingredient | phase | reaction | mixing | fire | tool
 * @property {number} day
 * @property {string} [material]
 */

export class GameState {
  /** @param {any} data */
  constructor(data) {
    /** @type {number} */ this.version = data.version;
    /** @type {number} */ this.genVersion = data.genVersion;
    /** @type {string} */ this.seed = data.seed;
    /** @type {import('../materials/generator.js').World} */ this.world = data.world;
    /** @type {number} */ this.coins = data.coins;
    /** @type {number} */ this.reputation = data.reputation;
    /** @type {number} */ this.day = data.day;
    /** @type {number} */ this.customerIndex = data.customerIndex;
    /** @type {number} */ this.customersPerDay = data.customersPerDay;
    /** @type {number} */ this.servedToday = data.servedToday;
    /** @type {number} */ this.dayEarnings = data.dayEarnings;
    /** @type {number} */ this.daySpending = data.daySpending;
    /** @type {Record<string, number>} */ this.inventory = data.inventory;
    /** @type {string[]} */ this.equipment = data.equipment;
    /** @type {Record<string, JournalEntry>} */ this.journal = data.journal;
    /** @type {Record<string, any>} */ this.knowledge = data.knowledge;
    /** @type {any[]} */ this.recipes = data.recipes;
    /** @type {any[]} */ this.history = data.history;
    /** @type {Record<string, number>} */ this.achievements = data.achievements;
    /** @type {any} */ this.current = data.current;
    /** @type {{served:number, perfect:number, earned:number, spent:number, brews:number, declined:number, bestQuality:number}} */
    this.stats = { served: 0, perfect: 0, earned: 0, spent: 0, brews: 0, declined: 0, bestQuality: 0, ...(data.stats || {}) };
    /** @type {{active:boolean, step:number, done:boolean}} */ this.tutorial = { active: false, step: 0, done: true, ...(data.tutorial || {}) };
    /** @type {{event:string, mods:Record<string, number>}} */ this.market = data.market || { event: 'none', mods: {} };
    /** @type {any} */ this.cauldron = data.cauldron || null;
    /** @type {any} */ this.receiver = data.receiver || null;
    /** @type {any[]} */ this.brewLog = data.brewLog || [];
    /** @type {number} */ this.reliefDay = data.reliefDay || 0;
    /** @type {boolean} */ this.grandDone = !!data.grandDone;
    /** @type {number} */ this.createdAt = data.createdAt || Date.now();
    this.lookup = makeLookup(this.world);
  }

  /**
   * Fresh game for a seed.
   * @param {string} seed
   * @param {{tutorial?: boolean}} [opts]
   */
  static create(seed, opts = {}) {
    const world = generateWorld(seed);
    const inventory = {};
    for (const id of world.starting) inventory[id] = 0;
    const R = world.roles;
    inventory[R.water] = Infinity;
    inventory[R.essenceA] = 300;
    inventory[R.essenceB] = 200;
    inventory[R.oil] = 200;
    inventory[R.syrup] = 200;
    inventory[R.spirit] = 200;
    inventory[R.binder] = 300;
    inventory[R.salt] = 200;
    const st = new GameState({
      version: SAVE_VERSION,
      genVersion: WORLD_GEN_VERSION,
      seed,
      world,
      coins: 60,
      reputation: 0,
      day: 1,
      customerIndex: 0,
      customersPerDay: 3,
      servedToday: 0,
      dayEarnings: 0,
      daySpending: 0,
      inventory,
      equipment: STARTING_EQUIPMENT.slice(),
      journal: /** @type {Record<string, JournalEntry>} */ ({}),
      knowledge: /** @type {Record<string, any>} */ ({}),
      recipes: [],
      history: [],
      achievements: {},
      current: null,
      stats: { served: 0, perfect: 0, earned: 0, spent: 0, brews: 0, declined: 0, bestQuality: 0 },
      tutorial: { active: opts.tutorial !== false, step: 0, done: opts.tutorial === false },
      market: { event: 'none', mods: {} },
      cauldron: null,
      receiver: null,
      brewLog: [],
      reliefDay: 0,
      grandDone: false,
      createdAt: Date.now(),
    });
    st.rollMarket();
    return st;
  }

  // ------------------------------------------------------------ derived
  get rank() {
    return rankIndex(this.reputation);
  }
  get rankName() {
    return RANKS[this.rank].name;
  }
  nextRank() {
    return RANKS[this.rank + 1] || null;
  }
  get cap() {
    return capabilities(this.equipment);
  }
  has(id) {
    return this.equipment.includes(id);
  }

  /** Ingredients the player may buy now (unlocked by rank). */
  purchasable() {
    return this.world.ingredients.filter((id) => (this.lookup(id).tier || 0) <= this.rank);
  }

  /** Ingredient ids that are buyable or in stock. */
  availableSet() {
    const s = new Set(this.purchasable());
    for (const [id, v] of Object.entries(this.inventory)) if (v > 0) s.add(id);
    return s;
  }

  /** Price per 100 ml today. @param {string} id */
  priceOf(id) {
    const m = this.lookup(id);
    if (!m) return 0;
    if (id === this.world.roles.water) return 0;
    const mod = this.market.mods[id] ?? 1;
    const ev = this.market.event === 'caravan' ? 0.8 : this.market.event === 'shortage' ? 1.3 : 1;
    return Math.max(1, Math.round(m.price * mod * ev * (1 - this.cap.discount) * 10) / 10);
  }

  stock(id) {
    return this.inventory[id] ?? 0;
  }

  /** @param {string} id @param {number} ml */
  buy(id, ml) {
    const room = this.cap.storage - this.stock(id);
    const amount = Math.min(ml, room);
    if (amount <= 0) return { ok: false, reason: 'Your shelves are full for that reagent.' };
    const cost = Math.round((amount / 100) * this.priceOf(id) * 10) / 10;
    if (cost > this.coins + 1e-9) return { ok: false, reason: 'Not enough coins.' };
    this.coins = round1(this.coins - cost);
    this.inventory[id] = this.stock(id) + amount;
    this.stats.spent += cost;
    this.daySpending += cost;
    return { ok: true, amount, cost };
  }

  /** Sell surplus back to the merchant at 40%. */
  sellBack(id, ml) {
    const amount = Math.min(ml, this.stock(id));
    if (amount <= 0 || !isFinite(this.stock(id))) return { ok: false };
    const value = Math.round((amount / 100) * this.priceOf(id) * 0.4 * 10) / 10;
    this.inventory[id] -= amount;
    this.coins = round1(this.coins + value);
    return { ok: true, value };
  }

  /** Remove ingredients when poured. Returns false if not enough. */
  consume(id, ml) {
    const s = this.stock(id);
    if (!isFinite(s)) return true;
    if (s + 1e-6 < ml) return false;
    this.inventory[id] = round1(s - ml);
    return true;
  }

  buyEquipment(id) {
    const e = equipmentById(id);
    if (!e) return { ok: false, reason: 'Unknown item.' };
    if (this.has(id)) return { ok: false, reason: 'Already owned.' };
    if (e.rank > this.rank) return { ok: false, reason: `Requires the rank of ${RANKS[e.rank].name}.` };
    if (e.requires && !e.requires.every((r) => this.has(r))) return { ok: false, reason: 'Requires the previous upgrade.' };
    if (this.coins < e.price) return { ok: false, reason: 'Not enough coins.' };
    this.coins = round1(this.coins - e.price);
    this.equipment.push(id);
    this.stats.spent += e.price;
    this.daySpending += e.price;
    return { ok: true, item: e };
  }

  // ------------------------------------------------------------ customers
  commissionContext() {
    return {
      world: this.world,
      lookup: this.lookup,
      available: this.availableSet(),
      cap: this.cap,
      rank: this.rank,
      priceOf: (id) => this.priceOf(id),
      event: this.market.event,
    };
  }

  /** Bring in the next customer for today (or null if the day is over). */
  nextCustomer() {
    if (this.current) return this.current;
    if (this.customerIndex >= this.customersPerDay) return null;
    const rng = new Rng(hashString(`${this.seed}:${this.day}:${this.customerIndex}`));
    let com;
    if (this.tutorial.active && !this.tutorial.done && this.stats.served === 0) {
      com = tutorialCommission(this.commissionContext(), rng);
    } else if (this.rank >= 4 && !this.grandDone && this.customerIndex === 0 && this.day % 2 === 0) {
      com = this.grandCommission(rng);
    } else {
      const contract = this.has('charter') && this.rank >= 2 && this.customerIndex === this.customersPerDay - 1;
      // difficulty follows rank, with some easier and harder requests mixed in
      const tier = Math.max(0, Math.min(4, this.rank + (rng.chance(0.25) ? -1 : 0) + (rng.chance(0.15) ? 1 : 0)));
      com = generateCommission(this.commissionContext(), rng, { tier: Math.min(tier, this.rank + 1), contract });
    }
    this.current = com;
    return com;
  }

  grandCommission(rng) {
    const com = generateCommission(this.commissionContext(), rng, { tier: 4, style: 'panacea', archetype: 'noble', contract: true }) ||
      generateCommission(this.commissionContext(), rng, { tier: 4, contract: true });
    if (com) {
      com.grand = true;
      com.customer.name = 'Queen Isolde’s Herald';
      com.dialogue = 'By royal decree: the Queen requires a masterwork. Brew it, and the guild shall name you Grand Alchemist.';
      com.budget = Math.round(com.budget * 2.5);
    }
    return com;
  }

  /** Customer leaves without buying. */
  declineCustomer() {
    if (!this.current) return;
    if (this.current.tutorial) return;
    this.current = null;
    this.customerIndex++;
    this.stats.declined++;
  }

  /**
   * Record a sale. Returns events (rank-ups, achievements).
   * @param {ReturnType<import('./evaluate.js').evaluatePotion>} ev
   * @param {any} measurement
   */
  completeSale(ev, measurement) {
    const com = this.current;
    const events = [];
    if (!com) return events;
    const oldRank = this.rank;
    this.coins = round1(this.coins + ev.payment);
    this.reputation = Math.max(0, this.reputation + ev.repDelta);
    this.stats.served++;
    this.stats.earned += ev.payment;
    this.dayEarnings += ev.payment;
    this.stats.bestQuality = Math.max(this.stats.bestQuality, ev.quality);
    if (ev.perfect) this.stats.perfect++;
    this.servedToday++;
    this.history.unshift({
      day: this.day, customer: com.customer.name, title: com.customer.title, potion: com.potionName, quality: ev.quality, stars: ev.stars,
      paid: ev.payment, color: measurement?.color, ml: measurement?.ml,
    });
    if (this.history.length > 60) this.history.length = 60;
    if (com.tutorial) { this.tutorial.done = true; this.tutorial.active = false; }
    if (com.grand && ev.quality >= 0.85) { this.grandDone = true; events.push(...this.unlock('grand')); }
    this.current = null;
    this.customerIndex++;
    events.push(...this.unlock('first_sale'));
    if (ev.perfect) events.push(...this.unlock('perfect'));
    if (this.stats.perfect >= 5) events.push(...this.unlock('perfect5'));
    if (this.stats.served >= 10) events.push(...this.unlock('served10'));
    if (this.stats.served >= 50) events.push(...this.unlock('served50'));
    if (this.coins >= 1000) events.push(...this.unlock('rich'));
    const nr = this.rank;
    if (nr > oldRank) {
      events.push({ type: 'rank', rank: nr, name: RANKS[nr].name });
      const ach = ['', 'journeyman', 'adept', 'expert', 'master'][nr];
      if (ach) events.push(...this.unlock(ach));
      this.customersPerDay = 3 + Math.floor(nr / 2);
    }
    return events;
  }

  get dayOver() {
    return !this.current && this.customerIndex >= this.customersPerDay;
  }

  /** Advance to the next day. Returns a summary of the finished day. */
  endDay() {
    const summary = { day: this.day, earned: this.dayEarnings, spent: this.daySpending, served: this.servedToday };
    this.day++;
    this.customerIndex = 0;
    this.servedToday = 0;
    this.dayEarnings = 0;
    this.daySpending = 0;
    this.current = null;
    this.customersPerDay = 3 + Math.floor(this.rank / 2);
    this.rollMarket();
    return summary;
  }

  rollMarket() {
    const rng = new Rng(hashString(`${this.seed}:market:${this.day}`));
    const ev = this.day <= 2 ? MARKET_EVENTS[0] : rng.weighted(MARKET_EVENTS, [5, 1, 1, 1, 1, 1, 1]);
    /** @type {Record<string, number>} */
    const mods = {};
    for (const id of this.world.ingredients) mods[id] = Math.round(rng.range(0.88, 1.12) * 100) / 100;
    this.market = { event: ev.key, mods };
  }

  get marketEvent() {
    return MARKET_EVENTS.find((e) => e.key === this.market.event) || MARKET_EVENTS[0];
  }

  /**
   * Safety net: an apprentice who cannot afford anything gets a small guild
   * stipend once per day, so a run can never become unwinnable.
   */
  claimRelief() {
    if (this.reliefDay === this.day) return 0;
    const cheapest = Math.min(...this.purchasable().filter((id) => id !== this.world.roles.water).map((id) => this.priceOf(id)));
    if (this.coins >= cheapest * 2) return 0;
    this.reliefDay = this.day;
    const grant = 25;
    this.coins = round1(this.coins + grant);
    return grant;
  }

  // ------------------------------------------------------------ journal / knowledge
  /**
   * Add a journal entry if new. Returns the entry or null.
   * @param {JournalEntry} e
   */
  discover(e) {
    if (this.journal[e.key]) return null;
    const entry = { ...e, day: this.day };
    this.journal[e.key] = entry;
    this.reputation += 1;
    return entry;
  }

  /** @param {string} id @param {string} fact @param {any} value */
  learn(id, fact, value) {
    const k = (this.knowledge[id] ||= {});
    if (k[fact] !== undefined) return false;
    k[fact] = value;
    return true;
  }

  reactionsDiscovered() {
    return Object.values(this.journal).filter((e) => e.kind === 'reaction').length;
  }

  /** @param {string} id */
  unlock(id) {
    if (this.achievements[id]) return [];
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) return [];
    this.achievements[id] = Date.now();
    this.coins = round1(this.coins + a.reward);
    return [{ type: 'achievement', id, name: a.name, desc: a.desc, reward: a.reward }];
  }

  // ------------------------------------------------------------ recipes
  /** @param {any} recipe */
  addRecipe(recipe) {
    this.recipes.unshift({ ...recipe, id: 'r' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36) });
    return this.unlock('recipe');
  }

  // ------------------------------------------------------------ persistence
  toJSON() {
    return {
      version: SAVE_VERSION,
      genVersion: this.genVersion,
      seed: this.seed,
      world: {
        seed: this.world.seed,
        materials: this.world.materials.map(serializeMaterial),
        ingredients: this.world.ingredients,
        starting: this.world.starting,
        reactions: this.world.reactions,
        roles: this.world.roles,
      },
      coins: this.coins,
      reputation: this.reputation,
      day: this.day,
      customerIndex: this.customerIndex,
      customersPerDay: this.customersPerDay,
      servedToday: this.servedToday,
      dayEarnings: this.dayEarnings,
      daySpending: this.daySpending,
      inventory: Object.fromEntries(Object.entries(this.inventory).map(([k, v]) => [k, isFinite(v) ? v : 'inf'])),
      equipment: this.equipment,
      journal: this.journal,
      knowledge: this.knowledge,
      recipes: this.recipes,
      history: this.history,
      achievements: this.achievements,
      current: this.current,
      stats: this.stats,
      tutorial: this.tutorial,
      market: this.market,
      cauldron: this.cauldron,
      receiver: this.receiver,
      brewLog: this.brewLog,
      reliefDay: this.reliefDay,
      grandDone: this.grandDone,
      createdAt: this.createdAt,
      savedAt: Date.now(),
    };
  }

  /** @param {any} raw */
  static fromJSON(raw) {
    const data = migrate(raw);
    const world = {
      ...data.world,
      materials: data.world.materials.map(deserializeMaterial),
    };
    const inventory = Object.fromEntries(Object.entries(data.inventory).map(([k, v]) => [k, v === 'inf' ? Infinity : Number(v)]));
    return new GameState({ ...data, world, inventory });
  }
}

/**
 * Upgrade older save formats in place.
 * @param {any} raw
 */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('Not a save file');
  const d = { ...raw };
  if (!d.version) throw new Error('Missing save version');
  if (d.version > SAVE_VERSION) throw new Error('This save comes from a newer version of the game');
  if (d.version < 2) {
    // v1 had no market, receiver or grand-commission fields
    d.market = d.market || { event: 'none', mods: {} };
    d.receiver = d.receiver || null;
    d.grandDone = !!d.grandDone;
    d.reliefDay = d.reliefDay || 0;
    d.knowledge = d.knowledge || {};
    d.version = 2;
  }
  if (!d.world || !Array.isArray(d.world.materials)) {
    // a save without an embedded world: regenerate from the seed
    const w = generateWorld(d.seed);
    d.world = { ...w, materials: w.materials.map(serializeMaterial) };
  }
  for (const k of ['journal', 'achievements', 'stats', 'tutorial']) d[k] = d[k] || {};
  d.recipes = d.recipes || [];
  d.history = d.history || [];
  d.brewLog = d.brewLog || [];
  d.equipment = d.equipment && d.equipment.length ? d.equipment : STARTING_EQUIPMENT.slice();
  return d;
}

/** @param {number} v */
function round1(v) {
  return Math.round(v * 10) / 10;
}

export { EQUIPMENT, SIM };
