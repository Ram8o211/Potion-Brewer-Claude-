// Persistent game state and the rules that change it: the garden, the
// testing room, Potion IDs, customers and haggled sales, certification,
// complaints and refunds, days, progression, discoveries and recipes.
// Pure data + logic (no DOM), so it is fully testable headlessly.

import { Rng, hashString } from '../core/rng.js';
import { generateWorld, makeLookup, SPEC_BY_ROLE } from '../materials/generator.js';
import { serializeMaterial, deserializeMaterial } from '../materials/schema.js';
import { generateCommission, tutorialCommission, meets } from './commissions.js';
import { EQUIPMENT, STARTING_EQUIPMENT, RANKS, rankIndex, capabilities, equipmentById } from './equipment.js';
import { SIM } from '../simulation/constants.js';
import { createLab, normalizeLab, runTrial, replaceCreature, restCreatures, CREATURE_BY_ID, idComplete, idVector, blankId, idError } from './testing.js';
import { createGarden, normalizeGarden, BEDS, BED_BY_ID, bedStatus, harvestBed, waterBed, plantBed, newDayGarden, growthMods } from './garden.js';
import { startHaggle, ask, acceptOffer, refuse } from './haggle.js';
import { settleSale, certificationFee, REP } from './sales.js';
import { archetypeOf } from './customers.js';
import { PROP_KEYS, toRecord } from '../alchemy/magic.js';
import { modernizeJournal } from './journal.js';

export const SAVE_VERSION = 4;
export const WORLD_GEN_VERSION = 3;

export const MARKET_EVENTS = [
  { key: 'none', name: 'An ordinary day', icon: 'sun' },
  { key: 'winter', name: 'Bitter Frost', icon: 'basin' },
  { key: 'plague', name: 'Coughing Sickness', icon: 'leaf' },
  { key: 'festival', name: 'Harvest Festival', icon: 'heart' },
  { key: 'heatwave', name: 'Heatwave', icon: 'sun' },
  { key: 'rain', name: 'Gentle Rain', icon: 'drop' },
  { key: 'eclipse', name: 'Crystal Eclipse', icon: 'gem' },
  { key: 'fair', name: 'Market Fair', icon: 'stall' },
];

export const ACHIEVEMENTS = [
  { id: 'first_sale', name: 'Open for Business', desc: 'Sell your first potion.', reward: 10 },
  { id: 'haggler', name: 'Silver Tongue', desc: 'Sell for half again the opening offer.', reward: 20 },
  { id: 'certified', name: 'Seal of the Expert', desc: 'Have a potion certified.', reward: 10 },
  { id: 'caught', name: 'Liar Unmasked', desc: 'Show a certificate to a bluffing customer.', reward: 30 },
  { id: 'sharp_eye', name: 'Sharp Eye', desc: 'Write a Potion ID within 6 points of the truth on every property.', reward: 30 },
  { id: 'super', name: 'Transmutation', desc: 'Push a brew past its super transition.', reward: 30 },
  { id: 'fade', name: 'Too Hot', desc: 'Watch overheated magic fade away.', reward: 5 },
  { id: 'heatmix', name: 'Warm Embrace', desc: 'Bind two magics that will not join while cold.', reward: 15 },
  { id: 'crush', name: 'Stone Breaker', desc: 'Smash a stone with the pestle.', reward: 10 },
  { id: 'frozen', name: 'Cold Hands', desc: 'Lock a brew in ice.', reward: 10 },
  { id: 'boil', name: 'Lost to the Steam', desc: 'Lose magic to the steam.', reward: 10 },
  { id: 'fire', name: 'Singed Eyebrows', desc: 'Burn magic in too fierce a fire.', reward: 10 },
  { id: 'harvest1', name: 'Green Fingers', desc: 'Harvest your garden.', reward: 5 },
  { id: 'harvest1k', name: 'Gardener', desc: 'Harvest 1 litre of ingredients.', reward: 40 },
  { id: 'trial1', name: 'First Test', desc: 'Test a potion on a creature.', reward: 5 },
  { id: 'trial25', name: 'Keen Observer', desc: 'Run 25 tests.', reward: 40 },
  { id: 'served10', name: 'Regulars', desc: 'Sell ten potions.', reward: 30 },
  { id: 'served50', name: 'Talk of the Town', desc: 'Sell fifty potions.', reward: 120 },
  { id: 'rich', name: 'Gold in the Coffers', desc: 'Hold 1000 coins at once.', reward: 50 },
  { id: 'journeyman', name: 'Journeyman', desc: 'Reach the rank of Journeyman.', reward: 20 },
  { id: 'adept', name: 'Adept', desc: 'Reach the rank of Adept.', reward: 40 },
  { id: 'expert', name: 'Expert', desc: 'Reach the rank of Expert.', reward: 80 },
  { id: 'master', name: 'Master Alchemist', desc: 'Reach the rank of Master.', reward: 150 },
  { id: 'grand', name: 'Grand Alchemist', desc: 'Complete the Grand Commission.', reward: 500 },
  { id: 'recipe', name: 'Written Down', desc: 'Save a recipe to your book.', reward: 10 },
];

/**
 * @typedef {Object} JournalEntry
 * @property {string} key
 * @property {string} title
 * @property {string} text
 * @property {string} kind    phase | magic | mixing | fire | tool
 * @property {number} [day]
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
    /** @type {number} */ this.servedToday = data.servedToday || 0;
    /** @type {number} */ this.dayEarnings = data.dayEarnings || 0;
    /** @type {number} */ this.daySpending = data.daySpending || 0;
    /** @type {number} */ this.dayRefunds = data.dayRefunds || 0;
    /** @type {Record<string, number>} */ this.inventory = data.inventory;
    /** @type {string[]} */ this.equipment = data.equipment;
    /** @type {Record<string, JournalEntry>} */ this.journal = data.journal || {};
    /** @type {Record<string, any>} */ this.knowledge = data.knowledge || {};
    /** @type {any[]} */ this.recipes = data.recipes || [];
    /** @type {any[]} */ this.history = data.history || [];
    /** @type {Record<string, number>} */ this.achievements = data.achievements || {};
    /** @type {any} */ this.current = data.current || null;
    this.stats = { served: 0, earned: 0, spent: 0, brews: 0, declined: 0, refunds: 0, refunded: 0, bluffsCaught: 0, certified: 0, harvested: 0, trials: 0, ...(data.stats || {}) };
    /** @type {{active:boolean, step:number, done:boolean, guided?:boolean}} */ this.tutorial = { active: false, step: 0, done: true, ...(data.tutorial || {}) };
    /** @type {{event:string}} */ this.market = data.market && MARKET_EVENTS.some((e) => e.key === data.market.event) ? { event: data.market.event } : { event: 'none' };
    /** @type {any} */ this.cauldron = data.cauldron || null;
    /** @type {any[]} */ this.brewLog = data.brewLog || [];
    /** @type {number} */ this.reliefDay = data.reliefDay || 0;
    /** @type {boolean} */ this.grandDone = !!data.grandDone;
    /** @type {number} a one-time note for a shop that came over from an older version (the version it came from) */ this.whatsNew = Number(data.whatsNew) || 0;
    /** @type {number} */ this.createdAt = data.createdAt || Date.now();
    this.garden = normalizeGarden(data.garden);
    this.lab = normalizeLab(data.lab);
    /** the sealed vial waiting to be sold (or null) */
    this.vial = data.vial || null;
    /** identity of the brew in the cauldron: a new id when it is emptied, rev++ on every addition */
    this.batch = data.batch && typeof data.batch.id === 'string' ? { id: data.batch.id, rev: data.batch.rev | 0 } : newBatch();
    /** the Potion ID being written for the batch in the cauldron */
    /** @type {import('./testing.js').PotionId} */
    this.idCard = data.idCard && data.idCard.values ? data.idCard : { values: blankId(), batchId: this.batch.id, rev: this.batch.rev };
    /** every sale, newest first (complaints are scheduled on them) */
    /** @type {any[]} */ this.sales = Array.isArray(data.sales) ? data.sales : [];
    /** customer visits so far (complaints fall due after a few more) */
    /** @type {number} */ this.visits = data.visits | 0;
    this.lookup = makeLookup(this.world);
  }

  /**
   * Fresh game for a seed.
   * @param {string} seed
   * @param {{tutorial?: boolean}} [opts]
   */
  static create(seed, opts = {}) {
    const world = generateWorld(seed);
    /** @type {Record<string, number>} */
    const inventory = {};
    for (const id of world.ingredients) inventory[id] = 0;
    // a little in the store room to begin with; everything else grows
    inventory[world.roles.water] = 150;
    inventory[world.roles.sap] = 40;
    inventory[world.roles.sunstone] = 30;
    inventory[world.roles.bloodstone] = 30;
    const st = new GameState({
      version: SAVE_VERSION,
      genVersion: WORLD_GEN_VERSION,
      seed,
      world,
      coins: 40,
      reputation: 0,
      day: 1,
      customerIndex: 0,
      customersPerDay: 3,
      inventory,
      equipment: STARTING_EQUIPMENT.slice(),
      tutorial: { active: opts.tutorial !== false, step: 0, done: opts.tutorial === false },
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
  stock(id) {
    return this.inventory[id] ?? 0;
  }

  /** Ingredient ids the shop can grow (an owned bed) or has in store. */
  availableSet() {
    const s = new Set();
    for (const b of BEDS) {
      const owned = b.kind === 'well' || (this.garden.beds[b.id] && this.garden.beds[b.id].owned);
      if (owned && this.world.roles[b.role]) s.add(this.world.roles[b.role]);
    }
    for (const [id, v] of Object.entries(this.inventory)) if (v > 0) s.add(id);
    return s;
  }

  /** Remove ingredients when poured. Returns false if not enough. */
  consume(id, ml) {
    const s = this.stock(id);
    if (!isFinite(s)) return true;
    if (s + 1e-6 < ml) return false;
    this.inventory[id] = round1(s - ml);
    return true;
  }

  /** @param {number} amount */
  spend(amount) {
    this.coins = round1(this.coins - amount);
    this.stats.spent += amount;
    this.daySpending += amount;
  }

  buyEquipment(id) {
    const e = equipmentById(id);
    if (!e) return { ok: false, reason: 'Unknown item.' };
    if (this.has(id)) return { ok: false, reason: 'Already owned.' };
    if (e.rank > this.rank) return { ok: false, reason: `Requires the rank of ${RANKS[e.rank].name}.` };
    if (e.requires && !e.requires.every((r) => this.has(r))) return { ok: false, reason: 'Requires the previous upgrade.' };
    if (this.coins < e.price) return { ok: false, reason: 'Not enough coins.' };
    this.spend(e.price);
    this.equipment.push(id);
    return { ok: true, item: e };
  }

  // ------------------------------------------------------------ the garden
  get growth() {
    return growthMods(this.cap, this.market.event);
  }

  /** @param {string} bedId */
  bed(bedId, now = Date.now()) {
    const b = BED_BY_ID[bedId];
    return b ? bedStatus(this.garden, b, this.growth, now) : null;
  }

  /** Harvest a bed (or draw from the well). @param {string} bedId */
  harvest(bedId, now = Date.now()) {
    const b = BED_BY_ID[bedId];
    if (!b) return { ok: false, amount: 0, reason: 'unknown', events: [] };
    const id = this.world.roles[b.role];
    const r = harvestBed(/** @type {any} */ (this), b, id, this.growth, now);
    /** @type {any[]} */
    const events = [];
    if (r.ok && b.kind !== 'well') {
      this.stats.harvested += r.amount;
      events.push(...this.unlock('harvest1'));
      if (this.stats.harvested >= 1000) events.push(...this.unlock('harvest1k'));
    }
    return { ...r, id, events };
  }

  /** Water a plant bed with well water from the stores. @param {string} bedId */
  water(bedId, now = Date.now()) {
    const b = BED_BY_ID[bedId];
    if (!b) return { ok: false, reason: 'unknown' };
    return waterBed(/** @type {any} */ (this), b, this.world.roles.water, this.growth, now);
  }

  /** Plant a new bed for coins. @param {string} bedId */
  plant(bedId, now = Date.now()) {
    const b = BED_BY_ID[bedId];
    if (!b || b.kind === 'well') return { ok: false, reason: 'unknown' };
    if (this.garden.beds[b.id] && this.garden.beds[b.id].owned) return { ok: false, reason: 'Already planted.' };
    if (b.rank > this.rank) return { ok: false, reason: `Requires the rank of ${RANKS[b.rank].name}.` };
    if (this.coins < b.price) return { ok: false, reason: 'Not enough coins.' };
    this.spend(b.price);
    plantBed(this.garden, b, now);
    return { ok: true, cost: b.price };
  }

  // ------------------------------------------------------------ batches and Potion IDs
  /** A new batch identity (the cauldron was emptied). */
  newBatch() {
    this.batch = newBatch();
    this.idCard = { values: blankId(), batchId: this.batch.id, rev: this.batch.rev };
    return this.batch;
  }

  /** Something was added to the brew: earlier tests no longer describe it. */
  touchBatch() {
    this.batch.rev++;
  }

  /** Is the batch's Potion ID older than the batch? */
  get idStale() {
    // a blank ID cannot be out of date
    if (!PROP_KEYS.some((k) => Number.isFinite(this.idCard.values[k]))) return false;
    return this.idCard.batchId !== this.batch.id || (this.idCard.rev ?? 0) !== this.batch.rev;
  }

  /**
   * Write (part of) the Potion ID of the batch, or of the vial's label.
   * @param {'batch'|'vial'} target @param {Record<string, number|null>} values
   */
  writeId(target, values) {
    const clean = Object.fromEntries(PROP_KEYS.map((k) => [k, Number.isFinite(values[k]) ? Math.max(0, Math.min(100, Math.round(/** @type {number} */ (values[k])))) : null]));
    if (target === 'vial') {
      if (!this.vial || this.vial.certified) return false;
      this.vial.label = { values: clean };
      return true;
    }
    this.idCard = { values: clean, batchId: this.batch.id, rev: this.batch.rev };
    return true;
  }

  // ------------------------------------------------------------ the testing room
  /**
   * Record a test (the caller has already taken the dose from the cauldron
   * or the vial). Returns the record plus any events.
   * @param {string} creatureId @param {any} dose @param {any} ctx
   */
  recordTrial(creatureId, dose, ctx) {
    const rec = runTrial(this.lab, creatureId, dose, { ...ctx, day: this.day });
    this.stats.trials++;
    /** @type {any[]} */
    const events = [...this.unlock('trial1')];
    if (this.stats.trials >= 25) events.push(...this.unlock('trial25'));
    return { record: rec, events };
  }

  /** Replace a dead creature (costs coins). @param {string} id */
  replaceCreature(id, free = false) {
    const def = CREATURE_BY_ID[id];
    if (!def) return { ok: false, reason: 'Unknown creature.' };
    const cost = free ? 0 : Math.ceil(def.cost * (this.has('kennel') ? 0.5 : 1));
    if (cost > this.coins + 1e-9) return { ok: false, reason: `A new one costs ${cost} coins.` };
    this.spend(cost);
    replaceCreature(this.lab, id);
    return { ok: true, cost };
  }

  /** @param {string} id */
  creatureAvailable(id) {
    const def = CREATURE_BY_ID[id];
    return !!def && (!def.needs || this.has(def.needs));
  }

  // ------------------------------------------------------------ the vial
  get certifyFee() {
    return certificationFee(this.rank, this.cap);
  }

  /**
   * An expert alchemist certifies the vial: its label is replaced by the
   * exact truth, and the certificate is proof against false complaints.
   */
  certifyVial() {
    const v = this.vial;
    if (!v) return { ok: false, reason: 'No vial.' };
    if (v.certified) return { ok: false, reason: 'Already certified.' };
    const fee = this.certifyFee;
    if (this.coins < fee) return { ok: false, reason: `The expert asks ${fee} coins.` };
    this.spend(fee);
    const truth = toRecord(v.m.magic);
    /** @type {any[]} */
    const events = [...this.unlock('certified')];
    // how good was the alchemist's own estimate?
    if (v.label && idComplete(v.label) && idError(v.label.values, v.m.magic) <= 6) events.push(...this.unlock('sharp_eye'));
    v.estimate = v.label ? { ...v.label.values } : null;
    v.certified = Object.fromEntries(PROP_KEYS.map((k) => [k, Math.round(truth[k])]));
    v.label = { values: { ...v.certified }, certified: true };
    this.stats.certified++;
    return { ok: true, fee, events };
  }

  /** Does the vial's label promise what the customer asks for? */
  labelMatches(com = this.current) {
    const v = this.vial;
    if (!v || !com || com.type !== 'order' || !v.label || !idComplete(v.label)) return false;
    return meets(com, idVector(v.label));
  }

  // ------------------------------------------------------------ customers
  commissionContext() {
    return {
      world: this.world,
      lookup: this.lookup,
      available: this.availableSet(),
      stock: this.inventory,
      cap: this.cap,
      rank: this.rank,
      event: this.market.event,
    };
  }

  /** A complaint that has fallen due, if any. */
  dueComplaint() {
    return this.sales.find((s) => s.complaint && !s.resolved && this.visits >= s.complaint.due) || null;
  }

  /** Bring in the next visitor: a complaint that has fallen due, or today's next customer. */
  nextCustomer() {
    if (this.current) return this.current;
    const due = this.dueComplaint();
    if (due) {
      this.visits++;
      this.current = { type: 'complaint', saleId: due.id, customer: due.customer, potionName: due.potion, complaint: due.complaint, price: due.price, certified: !!due.certified };
      return this.current;
    }
    if (this.customerIndex >= this.customersPerDay) return null;
    const rng = new Rng(hashString(`${this.seed}:${this.day}:${this.customerIndex}`));
    let com;
    if (this.tutorial.active && !this.tutorial.done && (this.stats.served === 0 || this.tutorial.guided)) {
      com = tutorialCommission(this.commissionContext(), rng);
    } else if (this.rank >= 4 && !this.grandDone && this.customerIndex === 0 && this.day % 2 === 0) {
      com = this.grandCommission(rng);
    } else {
      const contract = this.has('charter') && this.rank >= 2 && this.customerIndex === this.customersPerDay - 1;
      const tier = Math.max(0, Math.min(4, this.rank + (rng.chance(0.25) ? -1 : 0) + (rng.chance(0.15) ? 1 : 0)));
      com = generateCommission(this.commissionContext(), rng, { tier: Math.min(tier, this.rank + 1), contract });
    }
    if (!com) { this.customerIndex++; return this.nextCustomer(); }
    this.visits++;
    this.current = com;
    return com;
  }

  /**
   * (Re)start the guided order in a shop that has already sold potions: the
   * next visitor is the tutorial's customer. A customer still only browsing
   * steps aside and comes back later.
   */
  startGuidedOrder() {
    this.tutorial = { ...this.tutorial, active: true, done: false, step: 0, guided: true };
    const c = this.current;
    if (c && c.type === 'order' && !c.tutorial && !c.haggle) this.current = null;
  }

  grandCommission(rng) {
    const com = generateCommission(this.commissionContext(), rng, { tier: 4, archetype: 'noble', contract: true, super: true }) ||
      generateCommission(this.commissionContext(), rng, { tier: 4, contract: true });
    if (com) {
      com.grand = true;
      com.customer.name = 'Queen Isolde’s Herald';
      com.dialogue = 'By royal decree: the Queen requires a masterwork of pure magic.';
      com.value = Math.round(com.value * 2.5);
      com.bluff = 0;
    }
    return com;
  }

  /** The customer leaves without buying. */
  declineCustomer() {
    const c = this.current;
    if (!c || c.tutorial || c.type !== 'order') return;
    this.current = null;
    this.customerIndex++;
    this.stats.declined++;
  }

  // ------------------------------------------------------------ haggling
  /** Open (or resume) haggling over the vial with the current customer. */
  beginHaggle() {
    const com = this.current, v = this.vial;
    if (!com || com.type !== 'order' || !v) return null;
    if (!com.haggle) {
      com.haggle = startHaggle(com, archetypeOf(com.customer.archetype), { certified: !!v.certified, reputation: this.reputation, short: v.ml / com.bottleMl });
    }
    return com.haggle;
  }

  /** @param {number} price */
  haggleAsk(price) {
    const h = this.beginHaggle();
    if (!h) return null;
    return ask(h, price);
  }

  haggleAccept() {
    const h = this.beginHaggle();
    return h ? acceptOffer(h) : null;
  }

  /** The customer is sent away (the vial stays unsold). */
  haggleRefuse() {
    const h = this.beginHaggle();
    if (h) refuse(h);
    this.declineCustomer();
  }

  /**
   * Hand over the vial at the agreed price. Returns the sale and events
   * (rank-ups, achievements).
   */
  completeSale() {
    const com = this.current, v = this.vial;
    if (!com || com.type !== 'order' || !v || !com.haggle || com.haggle.state !== 'deal') return { sale: null, events: [] };
    const price = com.haggle.price;
    const rng = new Rng(hashString(`${this.seed}:sale:${com.id}:${this.visits}`));
    const sale = settleSale(com, v, price, rng, { day: this.day, visits: this.visits });
    this.sales.unshift(sale);
    if (this.sales.length > 80) this.sales.length = 80;
    const events = [];
    const oldRank = this.rank;
    this.coins = round1(this.coins + price);
    this.reputation = Math.max(0, this.reputation + REP.sale(com.tier));
    this.stats.served++;
    this.stats.earned += price;
    this.dayEarnings += price;
    this.servedToday++;
    this.history.unshift({ day: this.day, customer: com.customer.name, title: com.customer.title, potion: com.potionName, paid: price, color: v.m.color, ml: v.ml, certified: !!v.certified });
    if (this.history.length > 60) this.history.length = 60;
    if (com.tutorial) { this.tutorial.done = true; this.tutorial.active = false; this.tutorial.guided = false; }
    if (com.grand && meets(com, v.m.magic)) { this.grandDone = true; events.push(...this.unlock('grand')); }
    this.vial = null;
    this.current = null;
    this.customerIndex++;
    events.push(...this.unlock('first_sale'));
    if (price >= com.haggle.opening * 1.5) events.push(...this.unlock('haggler'));
    if (this.stats.served >= 10) events.push(...this.unlock('served10'));
    if (this.stats.served >= 50) events.push(...this.unlock('served50'));
    if (this.coins >= 1000) events.push(...this.unlock('rich'));
    events.push(...this.rankEvents(oldRank));
    return { sale, events };
  }

  /** @param {number} oldRank */
  rankEvents(oldRank) {
    const nr = this.rank;
    if (nr <= oldRank) return [];
    /** @type {any[]} */
    const events = [{ type: 'rank', rank: nr, name: RANKS[nr].name }];
    const ach = ['', 'journeyman', 'adept', 'expert', 'master'][nr];
    if (ach) events.push(...this.unlock(ach));
    this.customersPerDay = 3 + Math.floor(nr / 2) + (this.market.event === 'fair' ? 1 : 0);
    return events;
  }

  // ------------------------------------------------------------ complaints
  /**
   * Deal with a returning customer.
   * @param {'refund'|'certificate'} how
   * @returns {{ok:boolean, outcome?:'refunded'|'caught'|'proven', amount?:number, events?:any[], reason?:string}}
   */
  resolveComplaint(how) {
    const c = this.current;
    if (!c || c.type !== 'complaint') return { ok: false, reason: 'No complaint.' };
    const sale = this.sales.find((s) => s.id === c.saleId);
    if (!sale) { this.current = null; return { ok: false, reason: 'Unknown sale.' }; }
    /** @type {any[]} */
    const events = [];
    if (how === 'certificate') {
      if (!sale.certified) return { ok: false, reason: 'This potion was never certified.' };
      if (sale.complaint.kind === 'bluff') {
        sale.resolved = 'caught';
        this.reputation += REP.bluffCaught();
        this.stats.bluffsCaught++;
        events.push(...this.unlock('caught'));
        this.current = null;
        return { ok: true, outcome: 'caught', amount: 0, events };
      }
      // the certificate proves the customer right: the money goes back
      how = 'refund';
    }
    const amount = sale.price;
    this.coins = round1(this.coins - amount);
    this.stats.refunds++;
    this.stats.refunded += amount;
    this.dayRefunds += amount;
    this.reputation = Math.max(0, this.reputation + (sale.complaint.kind === 'genuine' ? REP.genuine(sale.tier) : REP.bluffRefund()));
    sale.resolved = 'refunded';
    this.current = null;
    return { ok: true, outcome: sale.certified ? 'proven' : 'refunded', amount, events };
  }

  get dayOver() {
    return !this.current && this.customerIndex >= this.customersPerDay && !this.dueComplaint();
  }

  /** Advance to the next day. Returns a summary of the finished day. */
  endDay() {
    const summary = { day: this.day, earned: this.dayEarnings, spent: this.daySpending, refunds: this.dayRefunds, served: this.servedToday };
    this.day++;
    this.customerIndex = 0;
    this.servedToday = 0;
    this.dayEarnings = 0;
    this.daySpending = 0;
    this.dayRefunds = 0;
    this.current = null;
    this.rollMarket();
    this.customersPerDay = 3 + Math.floor(this.rank / 2) + (this.market.event === 'fair' ? 1 : 0);
    newDayGarden(this.garden, this.growth);
    restCreatures(this.lab);
    return summary;
  }

  rollMarket() {
    const rng = new Rng(hashString(`${this.seed}:market:${this.day}`));
    const ev = this.day <= 2 ? MARKET_EVENTS[0] : rng.weighted(MARKET_EVENTS, [6, 1, 1, 1, 1, 1, 1, 1]);
    this.market = { event: ev.key };
  }

  get marketEvent() {
    return MARKET_EVENTS.find((e) => e.key === this.market.event) || MARKET_EVENTS[0];
  }

  /**
   * Safety net: the garden is free, but coins can run out (refunds, dead
   * creatures). A broke alchemist gets a small guild stipend once a day.
   */
  claimRelief() {
    if (this.reliefDay === this.day || this.coins >= 10) return 0;
    this.reliefDay = this.day;
    const grant = 25;
    this.coins = round1(this.coins + grant);
    return grant;
  }

  // ------------------------------------------------------------ journal / knowledge
  /** @param {JournalEntry} e */
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
      dayRefunds: this.dayRefunds,
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
      brewLog: this.brewLog,
      reliefDay: this.reliefDay,
      grandDone: this.grandDone,
      whatsNew: this.whatsNew,
      createdAt: this.createdAt,
      garden: this.garden,
      lab: this.lab,
      vial: this.vial,
      batch: this.batch,
      idCard: this.idCard,
      sales: this.sales,
      visits: this.visits,
      savedAt: Date.now(),
    };
  }

  /** @param {any} raw */
  static fromJSON(raw) {
    const data = migrate(raw);
    const world = { ...data.world, materials: data.world.materials.map(deserializeMaterial) };
    // descriptions are the ingredients' magic lore, always the current wording
    for (const m of world.materials) if (m.archetype && SPEC_BY_ROLE[m.archetype]) m.description = SPEC_BY_ROLE[m.archetype].lore;
    const inventory = Object.fromEntries(Object.entries(data.inventory).map(([k, v]) => [k, v === 'inf' ? Infinity : Number(v)]));
    for (const id of world.ingredients || []) if (!(id in inventory)) inventory[id] = 0;
    for (const [k, v] of Object.entries(inventory)) if (!Number.isFinite(v) && v !== Infinity) inventory[k] = 0;
    const st = new GameState({ ...data, world, inventory });
    st.journal = modernizeJournal(st.journal, st.lookup);
    return st;
  }
}

/** @returns {{id:string, rev:number}} */
function newBatch() {
  return { id: 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36), rev: 0 };
}

/**
 * Upgrade older save formats.
 *
 * Saves before version 4 come from the old reagent world (bought fluids,
 * physical orders, effect laws). Their shop survives — coins, reputation and
 * rank, the day, equipment that still exists, awards, sales history and
 * statistics — but the world is regrown from the seed as a garden, so
 * ingredients, the cauldron, recipes, the vial and the pending order start
 * fresh.
 * @param {any} raw
 */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('Not a save file');
  const d = { ...raw };
  if (!d.version) throw new Error('Missing save version');
  if (d.version > SAVE_VERSION) throw new Error('This save comes from a newer version of the game');
  if (typeof d.seed !== 'string' && typeof d.seed !== 'number') throw new Error('The save has no world seed');
  d._migratedFrom = d.version;
  if (d.version < 4) {
    const w = generateWorld(d.seed);
    d.world = { ...w, materials: w.materials.map(serializeMaterial) };
    const inventory = {};
    for (const id of w.ingredients) inventory[id] = 0;
    inventory[w.roles.water] = 150;
    d.inventory = inventory;
    const known = new Set(EQUIPMENT.map((e) => e.id));
    d.equipment = [...new Set([...STARTING_EQUIPMENT, ...(Array.isArray(d.equipment) ? d.equipment : []).filter((id) => known.has(id))])];
    const awards = new Set(ACHIEVEMENTS.map((a) => a.id));
    d.achievements = Object.fromEntries(Object.entries(d.achievements || {}).filter(([k]) => awards.has(k)));
    d.history = (Array.isArray(d.history) ? d.history : []).map((h) => ({ day: h.day, customer: h.customer, title: h.title, potion: h.potion, paid: h.paid, color: h.color, ml: h.ml }));
    d.journal = {};
    d.knowledge = {};
    d.recipes = [];
    d.brewLog = [];
    d.current = null;
    d.cauldron = null;
    d.vial = null;
    d.batch = null;
    d.idCard = null;
    d.garden = null;
    d.lab = null;
    d.sales = [];
    d.visits = 0;
    d.market = { event: 'none' };
    d.customerIndex = Math.min(d.customerIndex | 0, d.customersPerDay | 0 || 3);
    d.customersPerDay = d.customersPerDay | 0 || 3;
    d.genVersion = WORLD_GEN_VERSION;
    d.tutorial = { active: false, step: 0, done: true };
    d.whatsNew = d._migratedFrom;
    d.version = 4;
  }
  if (!d.world || !Array.isArray(d.world.materials)) {
    const w = generateWorld(d.seed);
    d.world = { ...w, materials: w.materials.map(serializeMaterial) };
  }
  if (d.world.materials.length === 0) throw new Error('The save has no ingredients');
  if (!d.inventory || typeof d.inventory !== 'object') throw new Error('The save has no inventory');
  for (const k of ['journal', 'achievements', 'stats', 'tutorial', 'knowledge']) d[k] = d[k] && typeof d[k] === 'object' ? d[k] : {};
  d.recipes = Array.isArray(d.recipes) ? d.recipes : [];
  d.history = Array.isArray(d.history) ? d.history : [];
  d.brewLog = Array.isArray(d.brewLog) ? d.brewLog : [];
  d.equipment = Array.isArray(d.equipment) && d.equipment.length ? d.equipment : STARTING_EQUIPMENT.slice();
  if (!Number.isFinite(d.coins)) d.coins = 0;
  if (!Number.isFinite(d.reputation)) d.reputation = 0;
  if (!Number.isFinite(d.day) || d.day < 1) d.day = 1;
  return d;
}

/** @param {number} v */
function round1(v) {
  return Math.round(v * 10) / 10;
}

export { EQUIPMENT, SIM, BEDS };
