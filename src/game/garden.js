// The personal garden: where seeds gathered in the wilds are grown into
// ingredients at home.
//
// Seeds. Harvesting a specimen in the wilds (or in the garden) may drop a
// seed of its species and form, with a chance set by its rarity and halved
// again for an Arcane form (materials/rarity.js seedChance). Each roll is
// drawn from a saved counter, so reloading a save before a harvest gives
// the very same result: seeds cannot be rerolled. A seed keeps its species'
// identity and form — an Arcane Silverleaf seed always grows Arcane
// Silverleaf — and nothing in the garden ever changes a species' rarity or
// magic.
//
// Plots. Each species needs its kind of bed: soil for plants, a shaded
// fungal planter for mushrooms and mosses, a mineral bed for crystals,
// stones and relics, a tide basin for shells and corals. Unique species and
// Arcane forms need a greenhouse-grade plot, Legendary ones an Arcane
// cultivation chamber. More plots and better ones are bought as the shop
// grows.
//
// Growth and watering. A crop passes through seed, sprout, young,
// developing and mature. It grows with saved time — also while the game is
// closed, but at most a day's worth per absence — faster in moist soil.
// Watering is one tap per plot (or one for all), and the soil dries back
// over a few hours. Growth is resolved in closed steps from a checkpoint,
// so it is deterministic and survives save and reload.
//
// Harvest. A mature crop is taken whole (the plant is consumed) and gives
// its species' yield; it may drop a seed by the same rules as the wilds, at
// half the chance, so a garden never multiplies seeds on its own.

import { Rng } from '../core/rng.js';
import { RARITY, ARCANE, seedChance } from '../materials/rarity.js';
import { SPECIES_BY_KEY, materialIdOf } from '../materials/catalog.js';

/** Growth stages of a crop and the share of its growing time at which each begins. */
export const GARDEN_STAGES = /** @type {const} */ (['seed', 'sprout', 'young', 'developing', 'mature']);
const STAGE_AT = [0, 0.12, 0.35, 0.65, 1];

/** Bed kinds: what each grows and its name. */
export const BEDS = {
  soil: { name: 'Soil plot', grows: 'herbs, flowers, fruit, roots and bark' },
  fungal: { name: 'Fungal planter', grows: 'mushrooms and mosses, in the shade' },
  crystal: { name: 'Mineral bed', grows: 'crystals, stones and relics' },
  tide: { name: 'Tide basin', grows: 'shells and corals' },
};

/** Plot grades: 0 plain, 1 greenhouse (Unique species and Arcane forms), 2 Arcane chamber (Legendary). */
export const GRADES = ['Plain', 'Greenhouse', 'Arcane chamber'];

/**
 * Garden upgrades for sale. `bed` adds a plot of that kind; `grade` raises
 * one plot's grade; `can` improves the watering can (each watering lasts longer).
 * @type {{id:string, name:string, desc:string, price:number, rank:number, bed?:string, grade?:number, can?:number, max?:number}[]}
 */
export const GARDEN_UPGRADES = [
  { id: 'plot-soil', name: 'Soil plot', desc: 'Another stone-bordered plot of good soil.', price: 35, rank: 0, bed: 'soil', max: 6 },
  { id: 'plot-fungal', name: 'Fungal planter', desc: 'A shaded box of rotting oak for mushrooms and mosses.', price: 55, rank: 0, bed: 'fungal', max: 3 },
  { id: 'plot-crystal', name: 'Mineral bed', desc: 'Gravel and geode-seed for crystals, stones and relics.', price: 80, rank: 1, bed: 'crystal', max: 3 },
  { id: 'plot-tide', name: 'Tide basin', desc: 'A salt-water basin for shells and corals.', price: 95, rank: 3, bed: 'tide', max: 2 },
  { id: 'greenhouse', name: 'Greenhouse frame', desc: 'Raises one plain plot to greenhouse grade: Unique species and Arcane forms grow there.', price: 120, rank: 2, grade: 1 },
  { id: 'arcane-chamber', name: 'Arcane cultivation chamber', desc: 'Raises one greenhouse plot to an Arcane chamber: Legendary species grow there.', price: 300, rank: 4, grade: 2 },
  { id: 'can', name: 'Copper watering can', desc: 'Holds more: every watering keeps the soil moist twice as long.', price: 40, rank: 0, can: 1, max: 1 },
];

/** How long watered soil stays moist (hours, about two thirds dried), by watering can. */
const MOIST_TAU = [3, 6];
/** Moisture of unwatered garden soil, and growth pace when dry (share of the full pace). */
const DRY = 0.25, DRY_PACE = 0.45;
/** At most this much time counts while the game is closed (so a long absence is not a free harvest of everything). */
export const OFFLINE_CAP_MS = 24 * 3600000;
/** How much faster the tutorial's first seed grows (so nobody waits a whole crop cycle). */
export const TUTORIAL_PACE = 60;

/**
 * @typedef {Object} Crop
 * @property {string} species
 * @property {boolean} arcane
 * @property {number} planted   wall-clock time it was sown
 * @property {number} g         growth 0..1 at its checkpoint t
 * @property {number} t         checkpoint time
 * @property {number} w         soil moisture 0..1 at t
 * @property {number} [pace]    a speed-up (the tutorial's first seed)
 * @typedef {Object} Plot
 * @property {string} id
 * @property {keyof BEDS} bed
 * @property {number} grade
 * @property {Crop|null} crop
 * @typedef {Object} Garden
 * @property {Plot[]} plots
 * @property {Record<string, number>} seeds  seed id (species key, `+arcane` for the Arcane form) → count
 * @property {number} rolls    seed-drop rolls drawn so far (the stream they come from)
 * @property {number} can      watering can grade
 * @property {Record<string, number>} bought  upgrades bought, by id
 * @property {number} harvested crops harvested
 * @property {boolean} seen    the garden has been visited
 */

/** @returns {Garden} */
export function createGarden() {
  return { plots: [{ id: 'p1', bed: 'soil', grade: 0, crop: null }, { id: 'p2', bed: 'soil', grade: 0, crop: null }], seeds: {}, rolls: 0, can: 0, bought: {}, harvested: 0, seen: false };
}

const finite = (/** @type {any} */ v) => typeof v === 'number' && Number.isFinite(v);

/** A seed id. @param {string} key @param {boolean} arcane */
export const seedId = (key, arcane) => key + (arcane ? '+arcane' : '');
/** The species and form of a seed id. @param {string} id */
export function parseSeed(id) {
  const arcane = id.endsWith('+arcane'), key = arcane ? id.slice(0, -7) : id;
  return SPECIES_BY_KEY[key] ? { key, arcane, species: SPECIES_BY_KEY[key] } : null;
}

/** A saved garden made safe (or a fresh one). @param {any} g */
export function normalizeGarden(g, now = Date.now()) {
  const out = createGarden();
  if (!g || typeof g !== 'object') return out;
  if (Array.isArray(g.plots) && g.plots.length) {
    out.plots = g.plots.filter((p) => p && typeof p.id === 'string' && BEDS[p.bed]).map((p) => {
      const c = p.crop;
      const crop = c && SPECIES_BY_KEY[c.species] && finite(c.planted) && finite(c.g) && finite(c.t)
        ? { species: c.species, arcane: !!c.arcane, planted: Math.min(c.planted, now), g: Math.max(0, Math.min(1, c.g)), t: Math.min(c.t, now), w: finite(c.w) ? Math.max(0, Math.min(1, c.w)) : DRY, ...(finite(c.pace) && c.pace > 1 ? { pace: Math.min(TUTORIAL_PACE, c.pace) } : {}) }
        : null;
      return { id: p.id, bed: p.bed, grade: Math.max(0, Math.min(2, p.grade | 0)), crop };
    });
  }
  if (g.seeds && typeof g.seeds === 'object') for (const [k, v] of Object.entries(g.seeds)) if (parseSeed(k) && finite(v) && v > 0) out.seeds[k] = Math.floor(/** @type {number} */ (v));
  if (finite(g.rolls)) out.rolls = Math.max(0, g.rolls | 0);
  if (finite(g.can)) out.can = Math.max(0, Math.min(MOIST_TAU.length - 1, g.can | 0));
  if (g.bought && typeof g.bought === 'object') for (const [k, v] of Object.entries(g.bought)) if (finite(v)) out.bought[k] = v | 0;
  if (finite(g.harvested)) out.harvested = g.harvested | 0;
  out.seen = !!g.seen;
  return out;
}

/** The bed a species needs. @param {string} key */
export const bedOf = (key) => /** @type {keyof BEDS} */ (SPECIES_BY_KEY[key] ? SPECIES_BY_KEY[key].bed : 'soil');

/** The plot grade a species' form needs. @param {string} key @param {boolean} arcane */
export function gradeNeeded(key, arcane) {
  const s = SPECIES_BY_KEY[key];
  if (!s) return 0;
  if (s.rarity === 'legendary') return 2;
  return s.rarity === 'unique' || arcane ? 1 : 0;
}

/** Hours a species takes from seed to harvest (well watered). @param {string} key @param {boolean} arcane */
export function growHours(key, arcane) {
  const s = SPECIES_BY_KEY[key];
  return (s ? RARITY[s.rarity].growHours : 1) * (arcane ? 1.5 : 1);
}

/** Moisture and growth of a crop at `now`, from its checkpoint. @param {Crop} c @param {number} can @param {number} now */
export function cropState(c, can, now) {
  const tau = MOIST_TAU[can] * 3600000;
  const S = Math.min(OFFLINE_CAP_MS, Math.max(0, now - c.t));
  const total = growHours(c.species, c.arcane) * 3600000 / (c.pace || 1);
  // closed-form: moisture decays exponentially toward DRY; pace runs from DRY_PACE (dry) to 1 (moist)
  const pace = (w) => DRY_PACE + (1 - DRY_PACE) * Math.min(1, Math.max(0, (w - DRY) / 0.5));
  // integrate in a few even steps (exact enough, and identical whenever it is asked)
  const N = 24;
  let grown = 0;
  for (let i = 0; i < N; i++) {
    const s = (S * (i + 0.5)) / N;
    grown += pace(DRY + (c.w - DRY) * Math.exp(-s / tau)) * (S / N);
  }
  const g = Math.min(1, c.g + grown / total);
  const w = DRY + (c.w - DRY) * Math.exp(-S / tau);
  const stageIx = g >= 1 ? 4 : STAGE_AT.findIndex((x, i) => g >= x && g < STAGE_AT[i + 1]);
  const remain = g >= 1 ? 0 : ((1 - g) * total) / pace(w);
  return { g, w, stage: GARDEN_STAGES[Math.max(0, stageIx)], stageIx: Math.max(0, stageIx), readyIn: remain, thirsty: w < DRY + 0.15 && g < 1 };
}

/** Write a crop's state down at `now` (before anything changes it). @param {Crop} c @param {number} can @param {number} now */
function checkpoint(c, can, now) {
  const s = cropState(c, can, now);
  c.g = Math.round(s.g * 1e6) / 1e6;
  c.w = Math.round(s.w * 1e6) / 1e6;
  c.t = Math.max(c.t, now);
}

/**
 * Roll for a seed after one harvest (deterministic: the garden's roll
 * counter advances, whatever the result). Adds the seed when it drops.
 * @param {Garden} g @param {string} worldSeed @param {string} key @param {boolean} arcane @param {number} [factor] extra multiplier (the garden's own harvests: 0.5)
 * @returns {string|null} the seed id that dropped
 */
export function rollSeed(g, worldSeed, key, arcane, factor = 1) {
  const s = SPECIES_BY_KEY[key];
  if (!s) return null;
  const r = new Rng(`seed-roll:${worldSeed}:${g.rolls}`).next();
  g.rolls++;
  if (r >= seedChance(s.rarity, arcane) * factor) return null;
  const id = seedId(key, arcane);
  g.seeds[id] = (g.seeds[id] || 0) + 1;
  return id;
}

/** Give a seed (the tutorial's guaranteed first one). @param {Garden} g @param {string} key @param {boolean} arcane */
export function giveSeed(g, key, arcane) {
  const id = seedId(key, arcane);
  g.seeds[id] = (g.seeds[id] || 0) + 1;
  return id;
}

/**
 * Sow a seed in a plot.
 * @param {Garden} g @param {string} plotId @param {string} seed @param {number} [now] @param {{tutorial?:boolean}} [o]
 */
export function plant(g, plotId, seed, now = Date.now(), o = {}) {
  const p = g.plots.find((x) => x.id === plotId);
  const sd = parseSeed(seed);
  if (!p) return { ok: false, reason: 'No such plot.' };
  if (!sd) return { ok: false, reason: 'Unknown seed.' };
  if (p.crop) return { ok: false, reason: 'That plot is already sown.' };
  if (!(g.seeds[seed] > 0)) return { ok: false, reason: 'You have no such seed.' };
  const bed = bedOf(sd.key);
  if (p.bed !== bed) return { ok: false, reason: `${sd.species.name} needs a ${BEDS[bed].name.toLowerCase()}.` };
  const need = gradeNeeded(sd.key, sd.arcane);
  if (p.grade < need) return { ok: false, reason: `${sd.arcane ? 'Arcane ' : ''}${sd.species.name} needs a plot of ${GRADES[need].toLowerCase()} grade.` };
  g.seeds[seed]--;
  if (!g.seeds[seed]) delete g.seeds[seed];
  p.crop = { species: sd.key, arcane: sd.arcane, planted: now, g: 0, t: now, w: DRY, ...(o.tutorial ? { pace: TUTORIAL_PACE } : {}) };
  return { ok: true };
}

/** Water one plot, or every sown plot (null). Returns how many drank. @param {Garden} g @param {string|null} plotId @param {number} [now] */
export function waterPlots(g, plotId, now = Date.now()) {
  let n = 0;
  for (const p of g.plots) {
    if (!p.crop || (plotId && p.id !== plotId)) continue;
    checkpoint(p.crop, g.can, now);
    if (p.crop.g >= 1 || p.crop.w >= 0.98) continue;
    p.crop.w = Math.min(1, p.crop.w + 0.65);
    n++;
  }
  return n;
}

/** ml a mature crop gives. @param {string} key */
export function cropYield(key) {
  const s = SPECIES_BY_KEY[key];
  return ({ common: 75, uncommon: 55, rare: 40, unique: 30, legendary: 25 })[s ? s.rarity : 'common'];
}

/**
 * Harvest a mature crop: it is consumed and its yield goes into the stores
 * (as much as there is room for); it may drop a seed (at half the wilds' chance).
 * @param {Garden} g @param {string} plotId @param {{inventory:Record<string, number>, cap:{storage:number}, seed:string}} st @param {number} [now]
 */
export function harvestPlot(g, plotId, st, now = Date.now()) {
  const p = g.plots.find((x) => x.id === plotId);
  if (!p || !p.crop) return { ok: false, amount: 0, reason: 'Nothing grows there.' };
  const s = cropState(p.crop, g.can, now);
  if (s.g < 1) return { ok: false, amount: 0, reason: 'It is not ready yet.', readyIn: s.readyIn };
  const id = materialIdOf(p.crop.species, p.crop.arcane);
  const have = st.inventory[id] ?? 0;
  const room = Math.max(0, st.cap.storage - have);
  const amount = Math.floor(Math.min(cropYield(p.crop.species), room) / 5) * 5;
  if (amount <= 0) return { ok: false, amount: 0, reason: 'Your stores of it are full.' };
  st.inventory[id] = have + amount;
  const crop = p.crop;
  p.crop = null;
  g.harvested++;
  const seed = rollSeed(g, st.seed, crop.species, crop.arcane, 0.5);
  return { ok: true, amount, material: id, seed, species: crop.species, arcane: crop.arcane };
}

/** How many of an upgrade have been bought. @param {Garden} g @param {string} id */
export const boughtCount = (g, id) => g.bought[id] || 0;

/**
 * Buy a garden upgrade (coins are handled by the caller).
 * @param {Garden} g @param {string} id @param {number} rank
 * @returns {{ok:boolean, reason?:string, price?:number}}
 */
export function upgrade(g, id, rank) {
  const u = GARDEN_UPGRADES.find((x) => x.id === id);
  if (!u) return { ok: false, reason: 'Unknown upgrade.' };
  if (rank < u.rank) return { ok: false, reason: 'Your guild rank is too low for that yet.' };
  if (u.max !== undefined && boughtCount(g, id) >= u.max) return { ok: false, reason: 'You have as many of those as the garden can hold.' };
  if (u.bed) {
    let n = g.plots.length + 1;
    while (g.plots.some((p) => p.id === 'p' + n)) n++;
    g.plots.push({ id: 'p' + n, bed: /** @type {keyof BEDS} */ (u.bed), grade: 0, crop: null });
  } else if (u.grade !== undefined) {
    const target = g.plots.filter((p) => p.grade === u.grade - 1).sort((a, b) => (a.crop ? 1 : 0) - (b.crop ? 1 : 0))[0];
    if (!target) return { ok: false, reason: u.grade === 1 ? 'Every plot is already greenhouse grade.' : 'You need a greenhouse plot to turn into a chamber.' };
    target.grade = u.grade;
  } else if (u.can) {
    g.can = Math.min(MOIST_TAU.length - 1, u.can);
  }
  g.bought[id] = boughtCount(g, id) + 1;
  return { ok: true, price: u.price };
}

/** Everything the garden view shows, at `now`. @param {Garden} g @param {number} [now] */
export function gardenStatus(g, now = Date.now()) {
  return g.plots.map((p) => ({ ...p, state: p.crop ? cropState(p.crop, g.can, now) : null }));
}

/** Seeds held, as a list. @param {Garden} g */
export function seedList(g) {
  return Object.entries(g.seeds).filter(([, n]) => n > 0).map(([id, n]) => ({ id, n, ...(/** @type {any} */ (parseSeed(id))) })).filter((x) => x.species);
}

export { ARCANE };
