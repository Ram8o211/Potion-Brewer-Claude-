// The wilds: twelve biomes where raw ingredients grow, plant by plant.
//
// Six natural biomes (the Whisperwood, the Sunlit Meadow, Willow Bank, the
// Ironstone Quarry, the Netherwood and the Ember Crags) and six exotic ones
// (Moonfen, the Skydrift Isles, the Veilmist Glade, the Shifting Reef,
// Stormspire and Dreamspire Hollow). Each has a dominant effect — every
// ingredient growing there carries it as its main effect — and a creature of
// its own. Only the Whisperwood is open in a new shop; the others are opened
// with a traveller's map bought for coins once the guild rank allows it.
//
// A biome's ground holds what it holds: a harvested plant is gone and
// nothing grows back, nor needs watering. A traveller coin *regenerates* a
// biome: a new expedition finds new ground (scene.js draws its terrain from
// the generation), a new selection of the biome's species (always on its
// dominant effect, each with its own minority side effects), new spots and
// amounts, and a new set of its creatures. Traveller coins refill with real
// time and are gifted by happy customers (state.js). Only the generation of
// each biome and the plants taken since are saved.
//
// How much one harvest brings depends on what the player does and when:
//   • the method each ingredient needs (pick, dig, chip, scrape, sweep) and
//     whether the right tool is in the satchel — by hand, half as much;
//   • the part of the day: some plants open only at dawn (before the shop
//     opens) or at dusk (after the last customer); out of their hour only a
//     few sprigs are worth taking, so nothing is ever completely out of reach;
//   • the day's weather (from the world seed and the day number).

import { Rng, hashString } from '../core/rng.js';
import { isBotanical } from '../visual/taxonomy.js';

/**
 * @typedef {Object} Region
 * @property {string} id
 * @property {string} name
 * @property {'natural'|'exotic'} realm
 * @property {string} effect     the dominant effect of every ingredient growing there
 * @property {string} creature   the animal kind that lives there (kinds.js)
 * @property {number} rank       guild rank needed to buy its map
 * @property {number} price      coins for the traveller's map (0: open from the start)
 * @property {boolean} magical   an exotic biome
 * @property {string} desc
 * @property {number[]} sky      palette seeds for the scene renderer
 * @property {string} [feature]  the exotic biome's living wonder, to play with (wild-scene.js)
 */

/** @type {Region[]} */
export const REGIONS = [
  { id: 'forest', name: 'Whisperwood', realm: 'natural', effect: 'vitality', creature: 'fox', rank: 0, price: 0, magical: false, desc: 'Old oaks and ferns. Everything here heals.', sky: [0.36, 0.52, 0.42] },
  { id: 'meadow', name: 'Sunlit Meadow', realm: 'natural', effect: 'love', creature: 'dove', rank: 0, price: 50, magical: false, desc: 'Flowers under an open sky, humming with bees. Everything here stirs the heart.', sky: [0.55, 0.72, 0.9] },
  { id: 'river', name: 'Willow Bank', realm: 'natural', effect: 'swiftness', creature: 'otter', rank: 1, price: 110, magical: false, desc: 'A quick river between chalky banks. Everything here quickens.', sky: [0.5, 0.66, 0.78] },
  { id: 'quarry', name: 'Ironstone Quarry', realm: 'natural', effect: 'strength', creature: 'badger', rank: 1, price: 160, magical: false, desc: 'Cut rock faces, mineral crusts and glittering dust. Everything here strengthens.', sky: [0.62, 0.6, 0.58] },
  { id: 'netherwood', name: 'Netherwood', realm: 'natural', effect: 'death', creature: 'rat', rank: 1, price: 220, magical: false, desc: 'A forest in a cavern under the Whisperwood, lit by glowing fungi. Everything here kills.', sky: [0.1, 0.12, 0.18] },
  { id: 'crags', name: 'Ember Crags', realm: 'natural', effect: 'fire', creature: 'salamander', rank: 2, price: 280, magical: false, desc: 'Volcanic slopes, lava and ash. Everything here burns.', sky: [0.42, 0.2, 0.16] },
  { id: 'moonfen', name: 'Moonfen', realm: 'exotic', effect: 'arcana', creature: 'mooncat', rank: 2, price: 360, magical: true, feature: 'wisps', desc: 'A moonlit bog of glowing crystals and wisps. Raw arcana — magic that wakes in the cold.', sky: [0.16, 0.18, 0.32] },
  { id: 'skydrift', name: 'Skydrift Isles', realm: 'exotic', effect: 'levitation', creature: 'skyhare', rank: 2, price: 450, magical: true, feature: 'isles', desc: 'Islands floating over a sea of cloud. Everything here is light as air.', sky: [0.56, 0.76, 0.98] },
  { id: 'veilmist', name: 'Veilmist Glade', realm: 'exotic', effect: 'invisibility', creature: 'veilstoat', rank: 3, price: 560, magical: true, feature: 'mist', desc: 'A pale glade drowned in mist, where things are only half there.', sky: [0.74, 0.8, 0.88] },
  { id: 'reef', name: 'Shifting Reef', realm: 'exotic', effect: 'transformation', creature: 'chromanewt', rank: 3, price: 660, magical: true, feature: 'anemones', desc: 'A drained, glowing seabed where nothing keeps its colour or shape.', sky: [0.2, 0.5, 0.6] },
  { id: 'stormspire', name: 'Stormspire', realm: 'exotic', effect: 'storm', creature: 'stormstag', rank: 3, price: 780, magical: true, feature: 'spires', desc: 'Black crags under an endless thunderstorm, crowned with lightning rods of crystal.', sky: [0.2, 0.22, 0.32] },
  { id: 'dreamspire', name: 'Dreamspire Hollow', realm: 'exotic', effect: 'dream', creature: 'dreamsnail', rank: 4, price: 900, magical: true, feature: 'bubbles', desc: 'A twilight hollow of sleeping flowers, where dreams float up in bubbles.', sky: [0.5, 0.36, 0.62] },
];
/** @type {Record<string, Region>} */
export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));
/** The biome a new shop starts with. */
export const FIRST_REGION = 'forest';
/** Biome ids of each realm. */
export const NATURAL_REGIONS = REGIONS.filter((r) => r.realm === 'natural').map((r) => r.id);
export const EXOTIC_REGIONS = REGIONS.filter((r) => r.realm === 'exotic').map((r) => r.id);

/**
 * @typedef {Object} Deposit
 * @property {string} id
 * @property {string} region
 * @property {number} gen        the expedition (generation of its biome) it belongs to
 * @property {string} materialId
 * @property {number} x          0..1 where the stand was first found in the region scene
 * @property {number} y          0..1
 * @property {number} slots      plants the stand holds
 * @property {number} capacity   ml the stand holds (slots × take)
 * @property {number} take       ml one plant gives (before the hour, weather and tools)
 * @property {number} rank       guild rank needed (0: the biome's map is what opens it)
 * @property {boolean} rare
 * @property {string} [place]    a name for the spot
 * @property {boolean} botanical a living plant (else a mineral, crystal or shell)
 * @property {number} growMs     (kept for older callers: plants are found grown)
 * @property {number} regrowMs   (nothing regrows: Infinity)
 */

/**
 * @typedef {Object} Plant
 * @property {string} id
 * @property {number} x      0..1 where it grows in the region scene
 * @property {number} y      0..1
 * @property {number} born   when the expedition found it
 */

/** Names of spots within each region (so two deposits read apart). */
const PLACES = {
  forest: ['by the old oak', 'in the fern hollow', 'under the beeches', 'at the mossy stump', 'by the woodcutter’s path', 'in the deep shade', 'along the brook'],
  netherwood: ['under the hanging roots', 'by the giant toadstool', 'in the glowing hollow', 'at the black pool', 'on the root stair'],
  meadow: ['by the stile', 'on the sunny slope', 'near the beehives', 'along the hedgerow', 'in the long grass', 'by the well'],
  river: ['under the willow', 'on the chalk bank', 'by the ford', 'in the reeds', 'at the mill race', 'on the gravel bar'],
  quarry: ['on the east face', 'in the spoil heap', 'by the cart track', 'in the old cutting', 'under the crane', 'at the seam', 'by the powder store'],
  moonfen: ['on the barrow', 'by the will-o’-pool', 'in the drowned grove', 'on the stepping stones', 'by the sunken cross', 'in the reed beds'],
  crags: ['on the ash slope', 'by the steam vent', 'in the lava cave', 'on the black ridge'],
  skydrift: ['on the high isle', 'under the falls', 'at the cloud’s edge', 'on the windward cliff', 'by the hanging roots'],
  veilmist: ['in the white hollow', 'by the glass trees', 'on the silent path', 'under the mist', 'by the faded shrine'],
  reef: ['on the coral ridge', 'in the tide pool', 'by the giant clam', 'under the arch', 'in the anemone bed'],
  stormspire: ['at the spire’s foot', 'on the struck rock', 'in the rain gully', 'under the rods', 'on the black ledge'],
  dreamspire: ['by the sleeping bloom', 'in the soft hollow', 'under the dream-tree', 'on the pillow moss', 'by the star pool'],
};

/** The growth stages older callers know; every plant the wilds show is mature. */
export const STAGES = /** @type {const} */ (['sprout', 'ripe', 'mature']);
export const SPROUT_SHARE = 0.4;

/** Opposing side channels: a side on one is balanced by a side on the other. */
const OPPOSE = { fire: 'frost', frost: 'fire', 'acid+': 'acid-', 'acid-': 'acid+' };
/** The balanceable sides of an ingredient. @param {any} m */
function sidesOf(m) {
  const fx = (m && m.effects) || {}, main = m && m.wild ? m.wild.main : null, out = [];
  for (const [k, v] of Object.entries(fx)) {
    if (k === main || !v) continue;
    if (k === 'fire' || k === 'frost') out.push(k);
    else if (k === 'acidity') out.push(v > 0 ? 'acid+' : 'acid-');
  }
  return out;
}

/**
 * The deposits of a world's biomes, each at its current generation: a
 * selection of the biome's species (three to five that grow on the ground,
 * one or two hanging from boughs and roofs where it has them), chosen so
 * that the sides of what grows can balance one another wherever the pool
 * allows; new spots, stand sizes and yields every generation.
 * @param {{seed:string, wild?:string[]}} world
 * @param {(id:string)=>any} lookup
 * @param {Record<string, number>} [gens] generation of each biome (0: the first expedition)
 * @returns {Deposit[]}
 */
export function generateDeposits(world, lookup, gens = {}) {
  /** @type {Deposit[]} */
  const out = [];
  for (const region of REGIONS) {
    const gen = Math.max(0, gens[region.id] | 0);
    const rng = new Rng(`deposits:${world.seed}:${region.id}:${gen}`);
    const mats = (world.wild || []).map(lookup).filter((m) => m && m.wild && m.wild.region === region.id);
    const ground = rng.shuffle(mats.filter((m) => !m.wild.late)), hang = rng.shuffle(mats.filter((m) => m.wild.late));
    const nG = Math.min(ground.length, rng.int(3, 5)), nH = Math.min(hang.length, rng.int(1, 2));
    const pick = ground.slice(0, nG).concat(hang.slice(0, nH));
    const rest = ground.slice(nG).concat(hang.slice(nH));
    // every side that grows should have its opposite growing too, where the biome has one
    for (let pass = 0; pass < 3; pass++) {
      const have = new Set(pick.flatMap(sidesOf));
      const lonely = [...have].find((k) => !have.has(OPPOSE[k]));
      if (!lonely) break;
      const j = rest.findIndex((m) => sidesOf(m).includes(OPPOSE[lonely]));
      if (j < 0) break;
      pick.push(rest.splice(j, 1)[0]);
    }
    pick.forEach((m, k) => {
      const rare = !!m.wild.rare;
      // (a crowded expedition finds fewer of each, so its ground does not overflow)
      const slots = rare ? 1 : pick.length >= 6 ? 2 : rng.int(2, 3);
      const take = rare ? rng.int(3, 4) * 10 : rng.int(5, 8) * 10;
      out.push({
        id: `${region.id}:${m.wild.key}:g${gen}`,
        place: PLACES[region.id][(k + gen) % PLACES[region.id].length],
        region: region.id, gen,
        materialId: m.id,
        x: Math.round(rng.range(0.1, 0.9) * 1000) / 1000,
        y: Math.round(rng.range(0.56, 0.88) * 1000) / 1000,
        slots,
        capacity: slots * take,
        take,
        rank: 0,
        rare,
        botanical: isBotanical(m.wild.shape),
        growMs: 0,
        regrowMs: Infinity,
      });
    });
  }
  return out;
}

/**
 * @typedef {Object} Stand  a deposit's plants still standing
 * @property {Plant[]} plants
 */

/** Version of the gathering state: 3 replaces growth, watering and regrowth with expeditions. */
export const GATHER_VERSION = 3;

/** Fresh gathering state: every biome at its first expedition. */
export function createGathering(now = Date.now()) {
  return { v: GATHER_VERSION, nodes: /** @type {Record<string, Stand>} */ ({}), total: 0, trips: 0, created: now, sky: 'clear', gens: /** @type {Record<string, number>} */ ({}), regen: 0 };
}

const finite = (/** @type {any} */ v) => typeof v === 'number' && Number.isFinite(v);

/** @param {any} g */
export function normalizeGathering(g, now = Date.now()) {
  const out = createGathering(now);
  if (!g || typeof g !== 'object') return out;
  if (finite(g.created)) out.created = Math.min(g.created, now);
  out.total = finite(g.total) ? g.total : 0;
  out.trips = finite(g.trips) ? g.trips : 0;
  out.regen = finite(g.regen) ? g.regen : 0;
  if (typeof g.sky === 'string') out.sky = g.sky;
  if (g.gens && typeof g.gens === 'object') for (const [k, v] of Object.entries(g.gens)) if (finite(v) && v >= 0) out.gens[k] = Math.floor(/** @type {number} */ (v));
  // stands of an older save (growth and regrowth) are dropped: its biomes start a fresh expedition
  if ((g.v | 0) >= GATHER_VERSION && g.nodes && typeof g.nodes === 'object') {
    for (const [id, v] of Object.entries(g.nodes)) {
      if (!v || typeof v !== 'object' || !Array.isArray(v.plants)) continue;
      const plants = v.plants.filter((p) => p && typeof p.id === 'string' && finite(p.x) && finite(p.y))
        .map((p) => ({ id: p.id, x: Math.min(1, Math.max(0, p.x)), y: Math.min(1, Math.max(0, p.y)), born: finite(p.born) ? Math.min(p.born, now) : out.created }));
      out.nodes[id] = { plants };
    }
  }
  return out;
}

/** The generation (expedition) a biome is at. @param {ReturnType<typeof createGathering>} g @param {string} region */
export const genOf = (g, region) => (g && g.gens && g.gens[region]) | 0;

/**
 * A stand nobody has touched: every plant grown, at spots of its own.
 * @param {ReturnType<typeof createGathering>} g @param {Deposit} d @returns {Stand}
 */
function untouched(g, d) {
  const rng = new Rng(hashString(`stand:${d.id}`));
  const plants = [];
  for (let k = 0; k < d.slots; k++) {
    plants.push({ id: `${d.id}#${k}`, x: Math.round(rng.range(0.06, 0.94) * 1000) / 1000, y: Math.round(rng.range(0.56, 0.9) * 1000) / 1000, born: g.created });
  }
  return { plants };
}

/** A deposit's stand as it is now (pure): what has not been harvested. @param {ReturnType<typeof createGathering>} g @param {Deposit} d @param {number} [now] @returns {Stand} */
export function standOf(g, d, now = Date.now()) { // eslint-disable-line no-unused-vars
  const saved = g.nodes[d.id] || untouched(g, d);
  return { plants: saved.plants.slice() };
}

/** A plant's stage: everything the wilds show is grown. @param {Deposit} d @param {Plant} p */
export function plantStage(d, p) { // eslint-disable-line no-unused-vars
  return { stage: 'mature', grown: 1, matureIn: 0, moisture: null, thirsty: false };
}

/**
 * How a deposit is doing now (pure): its plants, how much they hold.
 * @param {ReturnType<typeof createGathering>} g @param {Deposit} d @param {number} [now]
 */
export function depositStatus(g, d, now = Date.now()) {
  const s = standOf(g, d, now);
  const plants = s.plants.map((p) => ({ ...p, ...plantStage(d, p) }));
  const mature = plants.length, stock = mature * d.take;
  return {
    plants, mature, stock, available: stock,
    fraction: d.slots ? mature / d.slots : 0,
    fullIn: mature ? 0 : Infinity, nextIn: mature ? 0 : Infinity, scarred: false, moisture: null, thirsty: 0,
  };
}

/**
 * A new expedition to a biome: its generation moves on, its old stands are
 * forgotten; the deposits of the new generation are found fully grown.
 * @param {ReturnType<typeof createGathering>} g @param {string} region
 */
export function regenerate(g, region) {
  g.gens[region] = genOf(g, region) + 1;
  for (const id of Object.keys(g.nodes)) if (id.startsWith(region + ':')) delete g.nodes[id];
  g.regen = (g.regen || 0) + 1;
  return g.gens[region];
}

/** The day's weather is written down (it changes what a harvest brings, never what grows). @param {ReturnType<typeof createGathering>} g @param {any} _deposits @param {string} sky */
export function setSky(g, _deposits, sky) {
  g.sky = sky;
}

/** Older saves needed their plants' growth brought up to date; expeditions need nothing. @param {any} g */
export function migrateGathering(g) {
  return g;
}

// ------------------------------------------------------------------ methods, tools, hours and weather

/**
 * How each kind of ingredient is gathered. Everything but picking needs the
 * Forager's Kit for a full harvest.
 * @type {Record<string, {verb:string, tool:string|null, sound:string, icon:string, hand:string}>}
 */
export const METHODS = {
  pick: { verb: 'Pick', tool: null, sound: 'snip', icon: 'rose', hand: '' },
  dig: { verb: 'Dig up', tool: 'kit', sound: 'dig', icon: 'trowel', hand: 'by hand, half as much — the Forager’s Kit’s trowel digs it out whole' },
  mine: { verb: 'Chip out', tool: 'kit', sound: 'crack', icon: 'pick', hand: 'prised out by hand, half as much — the Forager’s Kit’s hammer would split the seam' },
  scrape: { verb: 'Scrape', tool: 'kit', sound: 'snip', icon: 'sickle', hand: 'torn off by hand, half as much — the Forager’s Kit’s sickle cuts it clean' },
  sweep: { verb: 'Sweep up', tool: 'kit', sound: 'dig', icon: 'brush', hand: 'scooped by hand, half as much — the Forager’s Kit’s brush gathers the fine dust' },
};

/** The method an ingredient needs. @param {any} m material */
export function methodOf(m) {
  return METHODS[(m && m.wild && m.wild.gather) || 'pick'] || METHODS.pick;
}

/**
 * The part of the shop day. The day has one clock, the shop door:
 *   dawn — before the shop opens (the first customer has not been let in);
 *   day  — while the shop is open;
 *   dusk — once the last customer has gone, until the shop closes for the night.
 * Dawn flowers are therefore gathered before opening, dusk plants after the
 * day's trade — or in fog, which keeps twilight all day. (A state without an
 * `opened` flag, as in old tests, counts as open once a customer was served.)
 * @param {{customerIndex:number, customersPerDay:number, dayOver?:boolean, opened?:boolean, current?:any}} st
 * @returns {'dawn'|'day'|'dusk'}
 */
export function dayPart(st) {
  if (st.dayOver) return 'dusk';
  const opened = st.opened !== undefined ? st.opened : st.customerIndex > 0;
  return opened ? 'day' : 'dawn';
}

export const DAY_PART_NAME = { dawn: 'Dawn', day: 'Midday', dusk: 'Dusk' };
/** What each part of the day means for the shop. */
export const DAY_PART_HINT = { dawn: 'The shop is still closed: dawn flowers are open.', day: 'The shop is open.', dusk: 'The shop has closed: dusk plants are open until you close for the night.' };

/**
 * @typedef {Object} Weather
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {string} desc
 */

/** @type {Weather[]} */
export const WEATHERS = [
  { id: 'clear', name: 'Clear skies', icon: 'sun', desc: 'A fair day for foraging.' },
  { id: 'rain', name: 'Soft rain', icon: 'drop', desc: 'Soft ground: roots and mosses come up whole (a quarter more).' },
  { id: 'frost', name: 'Hoarfrost', icon: 'snow', desc: 'The meadow flowers stay shut (half the harvest); frost-loving caps swell (half again).' },
  { id: 'storm', name: 'Thunderstorm', icon: 'bolt', desc: 'Lightning charges the crystals (half again); wind scatters a quarter of every other harvest.' },
  { id: 'fog', name: 'Fog', icon: 'wisp', desc: 'Twilight lingers all day: dawn and dusk plants stay open from morning to night.' },
  { id: 'heat', name: 'Heatwave', icon: 'flame', desc: 'Sun-loving flowers are lush (a quarter more); mosses dry out (half as much).' },
];

/** The weather of a day (deterministic from the world seed). @param {string} seed @param {number} day */
export function weatherOn(seed, day) {
  if (day <= 1) return WEATHERS[0];
  const r = new Rng(hashString(`weather:${seed}:${day}`)).next();
  // clear 40 %, rain 18 %, fog 12 %, frost 10 %, storm 10 %, heat 10 %
  const cut = [0.4, 0.58, 0.7, 0.8, 0.9, 1];
  const ids = ['clear', 'rain', 'fog', 'frost', 'storm', 'heat'];
  const id = ids[cut.findIndex((c) => r < c)];
  return WEATHERS.find((w) => w.id === id) || WEATHERS[0];
}

const FLOWER_SHAPES = new Set(['petal', 'flower', 'clover', 'spike', 'lily']);

/**
 * Everything that decides one harvest of a deposit right now: the method,
 * the tool, the hour, the weather and the chosen care. Pure.
 * @param {{has:(id:string)=>boolean, customerIndex:number, customersPerDay:number, dayOver?:boolean, seed:string, day:number}} st
 * @param {Deposit} d @param {any} m material @param {{thorough?:boolean}} [opts]
 */
export function gatherPlan(st, d, m, opts = {}) {
  const method = methodOf(m);
  const hasTool = !method.tool || st.has(method.tool);
  const part = dayPart(st);
  const weather = weatherOn(st.seed, st.day);
  const w = m && m.wild ? m.wild : {};
  const hour = w.dawn ? 'dawn' : w.dusk ? 'dusk' : null;
  const open = !hour || hour === part || weather.id === 'fog';
  /** @type {{why:string, f:number}[]} */
  const factors = [];
  if (st.has('satchel')) factors.push({ why: 'satchel', f: 1.5 });
  if (!hasTool) factors.push({ why: method.hand, f: 0.5 });
  if (!open) factors.push({ why: `closed until ${hour} — only a few sprigs`, f: 0.25 });
  const shape = w.shape || '';
  if (weather.id === 'frost' && FLOWER_SHAPES.has(shape)) factors.push({ why: 'shut by the frost', f: 0.5 });
  if (weather.id === 'frost' && (shape === 'cap' || shape === 'toadstool' || shape === 'bracket')) factors.push({ why: 'swollen in the frost', f: 1.5 });
  if (weather.id === 'heat' && (FLOWER_SHAPES.has(shape))) factors.push({ why: 'lush in the heat', f: 1.25 });
  if (weather.id === 'heat' && shape === 'moss') factors.push({ why: 'dried out in the heat', f: 0.5 });
  const fam = shape === 'crystal' || shape === 'shard' || shape === 'icicle';
  if (weather.id === 'storm') factors.push(fam ? { why: 'charged by the lightning', f: 1.5 } : { why: 'wind scatters it', f: 0.75 });
  if (weather.id === 'rain' && (shape === 'root' || shape === 'moss')) factors.push({ why: 'soft wet ground', f: 1.25 });
  const f = factors.reduce((a, x) => a * x.f, 1);
  const take = Math.max(5, Math.floor((d.take * f) / 5) * 5);
  // how much of what is cut becomes usable (the rest is spoiled by hand, out
  // of hours or by the weather); the satchel and a thorough harvest change how
  // much is taken per trip, not how well
  const eff = factors.filter((x) => x.why !== 'satchel').reduce((a, x) => a * x.f, 1);
  return { method, hasTool, part, weather, hour, open, factors, take, eff, thorough: false };
}

/**
 * How much one harvest can bring right now (ignoring shelf space): one
 * plant's yield, or nothing once the stand is bare.
 * @param {ReturnType<typeof createGathering>} g @param {Deposit} d @param {{take:number}} plan @param {number} [now]
 */
export function harvestable(g, d, plan, now = Date.now()) {
  return depositStatus(g, d, now).mature ? plan.take : 0;
}

/** Nothing regrows with the weather any more (kept for older callers). */
export function weatherRegrowth() {}
/** Nothing regrows with a new day any more (kept for older callers). */
export function newDayRegrowth() {}

/**
 * Harvest one plant of a deposit into the shop inventory: the plant given
 * (`plant`, a plant id) or else the first one. It is taken whole and does
 * not grow back: the biome's next expedition (a traveller coin) finds new
 * ground. Respects shelf storage; returns what was gathered (0 if nothing
 * could be). `free` (the Free Experiment) takes the plant all the same, but
 * its shelves are bottomless: nothing is stored and the plant gives its
 * full `take`.
 * @param {{rank:number, inventory:Record<string,number>, cap:{storage:number}, gathering:any}} st
 * @param {Deposit} d `take` is what the plant gives (gatherPlan)
 * @param {{now?:number, unlimited?:boolean, free?:boolean, plant?:string}} [opts]
 */
export function harvest(st, d, opts = {}) {
  const now = opts.now ?? Date.now();
  if (opts.unlimited) return { ok: true, amount: d.take, remaining: d.capacity };
  const g = st.gathering;
  const s = standOf(g, d, now);
  const have = st.inventory[d.materialId] ?? 0;
  const room = isFinite(have) ? Math.max(0, st.cap.storage - have) : 0;
  const p = opts.plant ? s.plants.find((q) => q.id === opts.plant) : s.plants[0];
  if (!p) return { ok: false, amount: 0, reason: opts.plant ? 'gone' : 'depleted', nextIn: Infinity };
  const amount = opts.free ? d.take : Math.floor(Math.min(d.take, room) / 5) * 5;
  if (amount <= 0) return { ok: false, amount: 0, reason: 'full' };
  g.nodes[d.id] = { plants: s.plants.filter((q) => q !== p) };
  if (!opts.free) { st.inventory[d.materialId] = have + amount; g.total += amount; }
  return { ok: true, amount, plant: p.id, remaining: (s.plants.length - 1) * d.take };
}

/**
 * Make a gathering state the Free Experiment's wilds: every biome at its
 * first expedition, under a clear sky. A harvest there takes the plant
 * (harvest `free`); a new expedition costs nothing.
 * @param {ReturnType<typeof createGathering>} g @param {Deposit[]} _deposits @param {number} [now]
 */
export function sandboxWilds(g, _deposits, now = Date.now()) {
  g.nodes = {};
  g.created = now;
  g.sky = 'clear';
  return g;
}

/** Human readable duration. @param {number} ms */
export function formatWait(ms) {
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.ceil(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}
