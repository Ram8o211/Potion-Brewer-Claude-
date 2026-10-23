// The wilds: regions with finite deposits of raw ingredients.
//
// The layout (which deposits exist, where, how big, how fast they regrow) is
// generated from the world seed, so it never needs saving or migrating. Only
// each deposit's stock and the time it was last touched are saved. Stock is
// resolved lazily from elapsed wall-clock time whenever a deposit is shown
// or gathered — there are no timers and nothing runs per frame, so the wilds
// cost nothing while the player brews (and regrow while the game is closed).
// A new shop day also lets every deposit recover half of its capacity.
//
// How much one harvest brings depends on what the player does and when:
//   • the method each ingredient needs (pick, dig, chip, scrape, sweep) and
//     whether the right tool is in the satchel — by hand, half as much;
//   • the part of the day: some plants open only at dawn (before the shop
//     opens) or at dusk (after the last customer); out of their hour only a
//     few sprigs are worth taking, so nothing is ever completely out of reach;
//   • the day's weather (from the world seed and the day number): rain makes
//     plants regrow overnight, frost closes the meadow flowers, a storm
//     recharges the crystal seams, fog keeps the twilight plants open;
//   • careful or thorough harvesting: thorough takes twice as much but scars
//     the deposit, which then regrows at half speed until it is full again.

import { Rng, hashString } from '../core/rng.js';

/**
 * @typedef {Object} Region
 * @property {string} id
 * @property {string} name
 * @property {number} rank       guild rank needed to travel there
 * @property {boolean} magical
 * @property {string} desc
 * @property {number[]} sky      palette seeds for the scene renderer
 */

/** @type {Region[]} */
export const REGIONS = [
  { id: 'forest', name: 'Whisperwood', rank: 0, magical: false, desc: 'Old oaks and ferns. Roots and leaves grow in the shade.', sky: [0.36, 0.52, 0.42] },
  { id: 'meadow', name: 'Sunlit Meadow', rank: 0, magical: false, desc: 'Flowers and clover under an open sky.', sky: [0.55, 0.72, 0.9] },
  { id: 'river', name: 'Willow Bank', rank: 0, magical: false, desc: 'Chalky banks, mushrooms and bog plants along the slow river.', sky: [0.5, 0.66, 0.78] },
  { id: 'quarry', name: 'Ironstone Quarry', rank: 0, magical: false, desc: 'Cut rock faces, mineral crusts and glittering dust.', sky: [0.62, 0.6, 0.58] },
  { id: 'moonfen', name: 'Moonfen', rank: 2, magical: true, desc: 'A haunted bog lit by wisps. Death-moss and star crystals.', sky: [0.16, 0.18, 0.32] },
  { id: 'crags', name: 'Ember Crags', rank: 3, magical: true, desc: 'Volcanic slopes where fire-peppers and salamanders live.', sky: [0.42, 0.2, 0.16] },
];
/** @type {Record<string, Region>} */
export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));

/**
 * @typedef {Object} Deposit
 * @property {string} id
 * @property {string} region
 * @property {string} materialId
 * @property {number} x          0..1 position in the region scene
 * @property {number} y          0..1
 * @property {number} capacity   ml when fully grown
 * @property {number} regrowMs   time to regrow from empty to full
 * @property {number} take       ml gathered per harvest
 * @property {number} rank       guild rank needed
 * @property {boolean} rare
 * @property {string} [place]    a name for the spot
 */

/** Names of spots within each region (so two deposits read apart). */
const PLACES = {
  forest: ['by the old oak', 'in the fern hollow', 'under the beeches', 'at the mossy stump', 'by the woodcutter’s path', 'in the deep shade'],
  meadow: ['by the stile', 'on the sunny slope', 'near the beehives', 'along the hedgerow', 'in the long grass', 'by the well'],
  river: ['under the willow', 'on the chalk bank', 'by the ford', 'in the reeds', 'at the mill race', 'on the gravel bar'],
  quarry: ['on the east face', 'in the spoil heap', 'by the cart track', 'in the old cutting', 'under the crane', 'at the seam'],
  moonfen: ['on the barrow', 'by the will-o’-pool', 'in the drowned grove', 'on the stepping stones'],
  crags: ['on the ash slope', 'by the steam vent', 'in the lava cave', 'on the black ridge'],
};

/**
 * Deterministic deposits for a world.
 * @param {{seed:string, wild?:string[]}} world
 * @param {(id:string)=>any} lookup
 * @returns {Deposit[]}
 */
export function generateDeposits(world, lookup) {
  const rng = new Rng('deposits:' + world.seed);
  /** @type {Deposit[]} */
  const out = [];
  for (const region of REGIONS) {
    const mats = (world.wild || []).map(lookup).filter((m) => m && m.wild && m.wild.region === region.id);
    /** @type {[number, number][]} */
    const placed = [];
    for (const m of mats) {
      // a crowded region grows one patch of each ingredient, a sparse one two
      const copies = m.wild.rare || mats.length > 5 ? 1 : 2;
      for (let c = 0; c < copies; c++) {
        let x = 0.5, y = 0.7;
        for (let tries = 0; tries < 40; tries++) {
          x = rng.range(0.1, 0.9);
          y = rng.range(0.5, 0.88);
          if (placed.every(([px, py]) => Math.hypot((px - x) * 1.6, py - y) > 0.17)) break;
        }
        placed.push([x, y]);
        const rare = !!m.wild.rare;
        out.push({
          id: `${region.id}:${m.wild.key}:${c}`,
          place: PLACES[region.id][(placed.length - 1) % PLACES[region.id].length],
          region: region.id,
          materialId: m.id,
          x: Math.round(x * 1000) / 1000,
          y: Math.round(y * 1000) / 1000,
          capacity: rare ? rng.int(4, 6) * 20 : rng.int(10, 16) * 20,
          regrowMs: Math.round((rare ? rng.range(45, 80) : rng.range(10, 20)) * 60000),
          take: rare ? 20 : 40,
          rank: Math.max(region.rank, m.wild.rank || 0),
          rare,
        });
      }
    }
  }
  return out;
}

/** Fresh gathering state: every deposit full. */
export function createGathering(now = Date.now()) {
  return { nodes: /** @type {Record<string, {stock:number, at:number, scar?:boolean}>} */ ({}), total: 0, trips: 0, created: now };
}

/** @param {any} g */
export function normalizeGathering(g, now = Date.now()) {
  const out = createGathering(now);
  if (!g || typeof g !== 'object') return out;
  if (g.nodes && typeof g.nodes === 'object') {
    for (const [id, v] of Object.entries(g.nodes)) {
      if (!v || typeof v !== 'object') continue;
      const stock = Number(v.stock), at = Number(v.at);
      if (Number.isFinite(stock) && Number.isFinite(at)) out.nodes[id] = { stock: Math.max(0, stock), at: Math.min(at, now), ...(/** @type {any} */ (v).scar ? { scar: true } : {}) };
    }
  }
  out.total = Number.isFinite(g.total) ? g.total : 0;
  out.trips = Number.isFinite(g.trips) ? g.trips : 0;
  return out;
}

/**
 * Current stock of a deposit (pure; resolves regrowth since it was touched).
 * @param {ReturnType<typeof createGathering>} g @param {Deposit} d @param {number} [now]
 */
export function depositStatus(g, d, now = Date.now()) {
  const saved = g.nodes[d.id];
  let stock = d.capacity;
  const scarred = !!(saved && saved.scar);
  const regrow = d.regrowMs * (scarred ? SCAR_SLOWDOWN : 1);
  if (saved) {
    const dt = Math.max(0, now - saved.at);
    stock = Math.min(d.capacity, saved.stock + (dt / regrow) * d.capacity);
  }
  const available = Math.floor(stock + 1e-6);
  const fullIn = stock >= d.capacity ? 0 : ((d.capacity - stock) / d.capacity) * regrow;
  const nextIn = available >= Math.min(d.take, d.capacity) ? 0 : ((Math.min(d.take, d.capacity) - stock) / d.capacity) * regrow;
  return { stock, available, fraction: stock / d.capacity, fullIn, nextIn, scarred: scarred && stock < d.capacity };
}

/** A thoroughly stripped deposit regrows this many times slower until full. */
export const SCAR_SLOWDOWN = 2;

// ------------------------------------------------------------------ methods, tools, hours and weather

/**
 * How each kind of ingredient is gathered, and the tool that does it well.
 * @type {Record<string, {verb:string, tool:string|null, sound:string, icon:string, hand:string}>}
 */
export const METHODS = {
  pick: { verb: 'Pick', tool: null, sound: 'snip', icon: 'rose', hand: '' },
  dig: { verb: 'Dig up', tool: 'trowel', sound: 'dig', icon: 'trowel', hand: 'by hand, half as much — a trowel digs it out whole' },
  mine: { verb: 'Chip out', tool: 'rockhammer', sound: 'crack', icon: 'pick', hand: 'prised out by hand, half as much — a rock hammer would split the seam' },
  scrape: { verb: 'Scrape', tool: 'sickle', sound: 'snip', icon: 'sickle', hand: 'torn off by hand, half as much — a sickle cuts it clean' },
  sweep: { verb: 'Sweep up', tool: 'brush', sound: 'dig', icon: 'brush', hand: 'scooped by hand, half as much — a brush gathers the fine dust' },
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
  { id: 'rain', name: 'Soft rain', icon: 'drop', desc: 'Plants drink deep: tonight every herb, root and moss grows back in full.' },
  { id: 'frost', name: 'Hoarfrost', icon: 'snow', desc: 'The meadow flowers stay shut (half the harvest); frost-loving caps swell (half again).' },
  { id: 'storm', name: 'Thunderstorm', icon: 'bolt', desc: 'Lightning recharges the crystal seams — they are full again tonight. Wind scatters a quarter of every outdoor harvest.' },
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

const PLANT_SHAPES = new Set(['root', 'leaf', 'petal', 'flower', 'clover', 'moss', 'cap', 'bean', 'pepper', 'bark', 'berry', 'bracket', 'sprig', 'spike', 'seed', 'lily', 'toadstool', 'reed']);
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
  if (weather.id === 'storm') factors.push({ why: 'wind scatters it', f: 0.75 });
  if (opts.thorough) factors.push({ why: 'thorough: the deposit will regrow slowly', f: 2 });
  const f = factors.reduce((a, x) => a * x.f, 1);
  const take = Math.max(5, Math.floor((d.take * f) / 5) * 5);
  // how much of what is cut becomes usable (the rest is spoiled by hand, out
  // of hours or by the weather); the satchel and a thorough harvest change how
  // much is taken per trip, not how well
  const eff = factors.filter((x) => x.why !== 'satchel' && !x.why.startsWith('thorough')).reduce((a, x) => a * x.f, 1);
  // careful hands leave part of every deposit to regrow
  const reserve = opts.thorough ? 0 : Math.round(d.capacity * CAREFUL_RESERVE);
  return { method, hasTool, part, weather, hour, open, factors, take, eff, reserve, thorough: !!opts.thorough };
}

/** The share of a deposit a careful harvest leaves standing. */
export const CAREFUL_RESERVE = 0.3;

/**
 * How much one harvest can bring right now (ignoring shelf space).
 * @param {ReturnType<typeof createGathering>} g @param {Deposit} d @param {{take:number, eff:number, reserve:number}} plan @param {number} [now]
 */
export function harvestable(g, d, plan, now = Date.now()) {
  const s = depositStatus(g, d, now);
  return Math.floor(Math.min(plan.take, Math.max(0, s.stock - plan.reserve) * plan.eff) / 5) * 5;
}

/**
 * A new day's weather acts on the deposits: rain refills the plants, a storm
 * the crystal seams.
 * @param {ReturnType<typeof createGathering>} g @param {Deposit[]} deposits @param {Weather} weather @param {(id:string)=>any} lookup
 */
export function weatherRegrowth(g, deposits, weather, lookup) {
  for (const d of deposits) {
    const m = lookup(d.materialId);
    const shape = m && m.wild ? m.wild.shape : '';
    if ((weather.id === 'rain' && PLANT_SHAPES.has(shape)) || (weather.id === 'storm' && (shape === 'crystal' || shape === 'shard'))) delete g.nodes[d.id];
  }
}

/**
 * Harvest a deposit into the shop inventory. Respects shelf storage and the
 * deposit's stock; returns what was gathered (0 if nothing could be).
 * @param {{rank:number, inventory:Record<string,number>, cap:{storage:number}, gathering:any}} st
 * @param {Deposit} d
 * Each harvest draws on the deposit by what it really takes from the plant:
 * `eff` is the usable share (the rest is spoiled), and a careful harvest
 * never cuts into the `reserve` it leaves to regrow.
 * @param {{now?:number, unlimited?:boolean, thorough?:boolean, eff?:number, reserve?:number}} [opts]
 */
export function harvest(st, d, opts = {}) {
  const now = opts.now ?? Date.now();
  if (d.rank > st.rank && !opts.unlimited) return { ok: false, amount: 0, reason: 'locked' };
  const g = st.gathering;
  const s = depositStatus(g, d, now);
  const have = st.inventory[d.materialId] ?? 0;
  const room = isFinite(have) ? Math.max(0, st.cap.storage - have) : 0;
  if (opts.unlimited) return { ok: true, amount: d.take, remaining: d.capacity };
  const eff = opts.eff > 0 ? opts.eff : 1, reserve = Math.max(0, opts.reserve || 0);
  const amount = Math.floor(Math.min(d.take, Math.max(0, s.stock - reserve) * eff, room) / 5) * 5;
  if (amount <= 0) return { ok: false, amount: 0, reason: room <= 0 ? 'full' : reserve > 0 && Math.min(d.take, s.stock * eff) >= 5 ? 'reserve' : 'depleted', nextIn: s.nextIn };
  const drawn = Math.min(s.stock, amount / eff);
  // a scar stays until the deposit has grown back in full
  const scar = opts.thorough || (s.scarred && s.stock - drawn < d.capacity);
  g.nodes[d.id] = { stock: s.stock - drawn, at: now, ...(scar ? { scar: true } : {}) };
  st.inventory[d.materialId] = have + amount;
  g.total += amount;
  return { ok: true, amount, remaining: Math.floor(s.stock - drawn) };
}

/**
 * A new shop day: every deposit recovers half its capacity (on top of
 * wall-clock regrowth), so a quick player is never stuck waiting.
 * @param {ReturnType<typeof createGathering>} g @param {Deposit[]} deposits @param {number} [now]
 */
export function newDayRegrowth(g, deposits, now = Date.now()) {
  for (const d of deposits) {
    const saved = g.nodes[d.id];
    if (!saved) continue;
    const s = depositStatus(g, d, now);
    const stock = Math.min(d.capacity, s.stock + d.capacity * (saved.scar ? 0.25 : 0.5));
    if (stock >= d.capacity - 1e-6) delete g.nodes[d.id];
    else g.nodes[d.id] = { stock, at: now, ...(saved.scar ? { scar: true } : {}) };
  }
}

/** Human readable duration. @param {number} ms */
export function formatWait(ms) {
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.ceil(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}
