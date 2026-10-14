// The alchemist's personal garden: the only source of ingredients.
//
//   • the well gives plain water, refilling slowly;
//   • plant beds (dew lilies, ember trees, frost lilies, hexberries) grow
//     their liquid only while the soil is moist — watering costs well water
//     and lasts a while, so tending them competes with brewing for water;
//   • crystal beds grow magical stones slowly and need no water. Stones are
//     gathered whole and must be smashed into powder before they dissolve.
// A harvest takes what has grown (more the riper the bed) and the bed starts
// again from bare soil, so waiting pays but never piles up beyond one bed's
// worth. Shelves cap how much of each ingredient the shop can keep.
//
// Growth is resolved lazily from wall-clock timestamps whenever a bed is
// shown or touched: nothing runs per frame, and the garden keeps growing
// while the game is closed. Only bed state and timestamps are saved.

/**
 * @typedef {Object} BedDef
 * @property {string} id
 * @property {'well'|'plant'|'stone'} kind
 * @property {string} role       ingredient role (materials/generator.js)
 * @property {number} cap        ml at full growth (well: stock)
 * @property {number} fullMin    minutes from bare to fully grown (well: empty to full)
 * @property {number} price      coins to plant (0 = part of the starting garden)
 * @property {number} rank       guild rank needed to plant it
 */

/** @type {BedDef[]} */
export const BEDS = [
  { id: 'well', kind: 'well', role: 'water', cap: 600, fullMin: 16, price: 0, rank: 0 },
  { id: 'dew-a', kind: 'plant', role: 'dew', cap: 90, fullMin: 20, price: 0, rank: 0 },
  { id: 'sap-a', kind: 'plant', role: 'sap', cap: 75, fullMin: 24, price: 0, rank: 0 },
  { id: 'sunstone-a', kind: 'stone', role: 'sunstone', cap: 60, fullMin: 34, price: 0, rank: 0 },
  { id: 'bloodstone-a', kind: 'stone', role: 'bloodstone', cap: 55, fullMin: 36, price: 0, rank: 0 },
  { id: 'glacite-a', kind: 'stone', role: 'glacite', cap: 60, fullMin: 34, price: 45, rank: 0 },
  { id: 'frostmilk-a', kind: 'plant', role: 'frostmilk', cap: 80, fullMin: 24, price: 70, rank: 1 },
  { id: 'heartstone-a', kind: 'stone', role: 'heartstone', cap: 55, fullMin: 38, price: 90, rank: 1 },
  { id: 'dew-b', kind: 'plant', role: 'dew', cap: 90, fullMin: 20, price: 80, rank: 1 },
  { id: 'skystone-a', kind: 'stone', role: 'skystone', cap: 50, fullMin: 42, price: 150, rank: 2 },
  { id: 'witchoil-a', kind: 'plant', role: 'witchoil', cap: 70, fullMin: 28, price: 160, rank: 2 },
  { id: 'sap-b', kind: 'plant', role: 'sap', cap: 75, fullMin: 24, price: 110, rank: 2 },
  { id: 'blight-a', kind: 'stone', role: 'blight', cap: 50, fullMin: 46, price: 190, rank: 3 },
  { id: 'sunstone-b', kind: 'stone', role: 'sunstone', cap: 60, fullMin: 34, price: 140, rank: 3 },
  { id: 'glacite-b', kind: 'stone', role: 'glacite', cap: 60, fullMin: 34, price: 140, rank: 3 },
  { id: 'heartstone-b', kind: 'stone', role: 'heartstone', cap: 55, fullMin: 38, price: 170, rank: 4 },
];
/** @type {Record<string, BedDef>} */
export const BED_BY_ID = Object.fromEntries(BEDS.map((b) => [b.id, b]));

/** A harvest needs at least this much growth. */
export const MIN_HARVEST = 0.2;
/** Well water spent to water one plant bed. */
export const WATER_COST = 40;
/** How long a watering keeps a plant bed moist. */
export const MOIST_MS = 30 * 60000;
/** How much the well gives per draw. */
export const WELL_DRAW = 150;

/**
 * @typedef {{owned:boolean, g:number, at:number, wetUntil:number}} BedState
 * @typedef {{beds: Record<string, BedState>, well: {stock:number, at:number}, harvested:number, waterings:number}} Garden
 */

/** The starting garden: the free beds are ripe and freshly watered, the well is full. */
export function createGarden(now = Date.now()) {
  /** @type {Garden} */
  const g = { beds: {}, well: { stock: BED_BY_ID.well.cap, at: now }, harvested: 0, waterings: 0 };
  for (const b of BEDS) if (b.kind !== 'well' && b.price === 0) g.beds[b.id] = { owned: true, g: 1, at: now, wetUntil: now + MOIST_MS };
  return g;
}

/** @param {any} raw @returns {Garden} */
export function normalizeGarden(raw, now = Date.now()) {
  const out = createGarden(now);
  if (!raw || typeof raw !== 'object') return out;
  if (raw.beds && typeof raw.beds === 'object') {
    for (const [id, v] of Object.entries(raw.beds)) {
      if (!BED_BY_ID[id] || !v || typeof v !== 'object') continue;
      const o = /** @type {any} */ (v);
      out.beds[id] = {
        owned: o.owned !== false,
        g: Number.isFinite(o.g) ? Math.max(0, Math.min(1, o.g)) : 0,
        at: Number.isFinite(o.at) ? Math.min(o.at, now) : now,
        wetUntil: Number.isFinite(o.wetUntil) ? o.wetUntil : 0,
      };
    }
  }
  if (raw.well && Number.isFinite(raw.well.stock) && Number.isFinite(raw.well.at)) out.well = { stock: Math.max(0, raw.well.stock), at: Math.min(raw.well.at, now) };
  out.harvested = Number.isFinite(raw.harvested) ? raw.harvested : 0;
  out.waterings = Number.isFinite(raw.waterings) ? raw.waterings : 0;
  return out;
}

/**
 * Growth multipliers from equipment and the day's weather.
 * @param {{has:(id:string)=>boolean}} cap @param {string} [event]
 */
export function growthMods(cap, event = 'none') {
  return {
    plant: (cap.has('greenhouse') ? 1.5 : 1) * (event === 'heatwave' ? 0.75 : 1),
    stone: (cap.has('lamp') ? 1.5 : 1) * (event === 'eclipse' ? 1.5 : 1),
    wellCap: cap.has('barrel') ? 2 : 1,
    sprinkler: cap.has('sprinkler'),
    rain: event === 'rain',
  };
}

/**
 * Current state of a bed (pure; resolves growth since it was touched).
 * @param {Garden} g @param {BedDef} b @param {ReturnType<typeof growthMods>} mods @param {number} [now]
 */
export function bedStatus(g, b, mods, now = Date.now()) {
  if (b.kind === 'well') {
    const cap = b.cap * mods.wellCap;
    const w = g.well;
    const dt = Math.max(0, now - w.at);
    const stock = Math.min(cap, w.stock + (dt / (b.fullMin * 60000)) * cap);
    return { owned: true, growth: stock / cap, amount: Math.floor(stock), cap, moist: true, ready: stock >= 5, fullIn: ((cap - stock) / cap) * b.fullMin * 60000, dryIn: Infinity };
  }
  const s = g.beds[b.id];
  if (!s || !s.owned) return { owned: false, growth: 0, amount: 0, cap: b.cap, moist: false, ready: false, fullIn: Infinity, dryIn: 0 };
  const full = b.fullMin * 60000 / (b.kind === 'plant' ? mods.plant : mods.stone);
  let grow = Math.max(0, now - s.at);
  let moist = true, dryIn = Infinity;
  if (b.kind === 'plant' && !mods.sprinkler && !mods.rain) {
    grow = Math.max(0, Math.min(now, s.wetUntil) - s.at);
    moist = now < s.wetUntil;
    dryIn = Math.max(0, s.wetUntil - now);
  }
  const growth = Math.min(1, s.g + grow / full);
  const fullIn = growth >= 1 ? 0 : moist ? (1 - growth) * full : Infinity;
  return { owned: true, growth, amount: Math.floor((b.cap * growth) / 5) * 5, cap: b.cap, moist, ready: growth >= MIN_HARVEST, fullIn, dryIn };
}

/** Fix a bed's resolved growth into its state (before changing it). */
function settle(g, b, mods, now) {
  const s = g.beds[b.id];
  const st = bedStatus(g, b, mods, now);
  s.g = st.growth;
  s.at = now;
  return st;
}

/**
 * Harvest a bed (or draw from the well) into the shop's stores.
 * @param {{inventory:Record<string,number>, cap:{storage:number}, garden:Garden}} shop
 * @param {BedDef} b @param {string} materialId @param {ReturnType<typeof growthMods>} mods @param {number} [now]
 */
export function harvestBed(shop, b, materialId, mods, now = Date.now()) {
  const g = shop.garden;
  const have = shop.inventory[materialId] ?? 0;
  const room = isFinite(have) ? Math.max(0, shop.cap.storage - have) : 0;
  if (b.kind === 'well') {
    const st = bedStatus(g, b, mods, now);
    const amount = Math.floor(Math.min(WELL_DRAW, st.amount, room) / 5) * 5;
    if (amount <= 0) return { ok: false, amount: 0, reason: room <= 0 ? 'full' : 'empty', wait: st.fullIn };
    g.well = { stock: Math.max(0, st.growth * st.cap - amount), at: now };
    shop.inventory[materialId] = have + amount;
    return { ok: true, amount };
  }
  const s = g.beds[b.id];
  if (!s || !s.owned) return { ok: false, amount: 0, reason: 'unplanted' };
  const st = bedStatus(g, b, mods, now);
  if (!st.ready) return { ok: false, amount: 0, reason: 'unripe', wait: st.moist ? ((MIN_HARVEST - st.growth) / Math.max(1e-6, 1 - st.growth)) * st.fullIn : Infinity };
  const amount = Math.floor(Math.min(st.amount, room) / 5) * 5;
  if (amount <= 0) return { ok: false, amount: 0, reason: 'full' };
  // what the shelves could not hold stays on the plant
  const left = Math.max(0, st.growth - amount / b.cap);
  s.g = left < 0.05 ? 0 : left;
  s.at = now;
  shop.inventory[materialId] = have + amount;
  g.harvested += amount;
  return { ok: true, amount };
}

/**
 * Water a plant bed: it stays moist (and grows) for a while. Costs well water from the stores.
 * @param {{inventory:Record<string,number>, garden:Garden}} shop @param {BedDef} b @param {string} waterId
 * @param {ReturnType<typeof growthMods>} mods @param {number} [now]
 */
export function waterBed(shop, b, waterId, mods, now = Date.now()) {
  const g = shop.garden;
  const s = g.beds[b.id];
  if (!s || !s.owned || b.kind !== 'plant') return { ok: false, reason: 'not-plant' };
  const st = bedStatus(g, b, mods, now);
  if (st.moist && st.dryIn > MOIST_MS * 0.6) return { ok: false, reason: 'wet' };
  if ((shop.inventory[waterId] ?? 0) < WATER_COST) return { ok: false, reason: 'no-water' };
  settle(g, b, mods, now);
  shop.inventory[waterId] -= WATER_COST;
  s.wetUntil = now + MOIST_MS;
  g.waterings++;
  return { ok: true, cost: WATER_COST };
}

/** Plant a new bed (the caller charges the coins). @param {Garden} g @param {BedDef} b */
export function plantBed(g, b, now = Date.now()) {
  if (g.beds[b.id] && g.beds[b.id].owned) return false;
  g.beds[b.id] = { owned: true, g: 0, at: now, wetUntil: now + MOIST_MS };
  return true;
}

/**
 * A new shop day: the well fills, moist plants and the crystal beds put on
 * a little extra growth overnight.
 * @param {Garden} g @param {ReturnType<typeof growthMods>} mods
 */
export function newDayGarden(g, mods, now = Date.now()) {
  g.well = { stock: BED_BY_ID.well.cap * mods.wellCap, at: now };
  for (const b of BEDS) {
    const s = g.beds[b.id];
    if (!s || !s.owned || b.kind === 'well') continue;
    const st = settle(g, b, mods, now);
    if (b.kind === 'stone') s.g = Math.min(1, st.growth + 0.15 * mods.stone);
    else if (st.moist) s.g = Math.min(1, st.growth + 0.25 * mods.plant);
    if (mods.rain && b.kind === 'plant') s.wetUntil = now + MOIST_MS;
  }
}

/** Human readable duration. @param {number} ms */
export function formatWait(ms) {
  if (!isFinite(ms)) return '—';
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.ceil(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
}
