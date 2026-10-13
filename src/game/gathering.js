// The wilds: regions with finite deposits of raw ingredients.
//
// The layout (which deposits exist, where, how big, how fast they regrow) is
// generated from the world seed, so it never needs saving or migrating. Only
// each deposit's stock and the time it was last touched are saved. Stock is
// resolved lazily from elapsed wall-clock time whenever a deposit is shown
// or gathered — there are no timers and nothing runs per frame, so the wilds
// cost nothing while the player brews (and regrow while the game is closed).
// A new shop day also lets every deposit recover half of its capacity.

import { Rng } from '../core/rng.js';

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
 */

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
      const copies = m.wild.rare ? 1 : 2;
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
  return { nodes: /** @type {Record<string, {stock:number, at:number}>} */ ({}), total: 0, trips: 0, created: now };
}

/** @param {any} g */
export function normalizeGathering(g, now = Date.now()) {
  const out = createGathering(now);
  if (!g || typeof g !== 'object') return out;
  if (g.nodes && typeof g.nodes === 'object') {
    for (const [id, v] of Object.entries(g.nodes)) {
      if (!v || typeof v !== 'object') continue;
      const stock = Number(v.stock), at = Number(v.at);
      if (Number.isFinite(stock) && Number.isFinite(at)) out.nodes[id] = { stock: Math.max(0, stock), at: Math.min(at, now) };
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
  if (saved) {
    const dt = Math.max(0, now - saved.at);
    stock = Math.min(d.capacity, saved.stock + (dt / d.regrowMs) * d.capacity);
  }
  const available = Math.floor(stock + 1e-6);
  const fullIn = stock >= d.capacity ? 0 : ((d.capacity - stock) / d.capacity) * d.regrowMs;
  const nextIn = available >= Math.min(d.take, d.capacity) ? 0 : ((Math.min(d.take, d.capacity) - stock) / d.capacity) * d.regrowMs;
  return { stock, available, fraction: stock / d.capacity, fullIn, nextIn };
}

/**
 * Harvest a deposit into the shop inventory. Respects shelf storage and the
 * deposit's stock; returns what was gathered (0 if nothing could be).
 * @param {{rank:number, inventory:Record<string,number>, cap:{storage:number}, gathering:any}} st
 * @param {Deposit} d
 * @param {{now?:number, unlimited?:boolean}} [opts]
 */
export function harvest(st, d, opts = {}) {
  const now = opts.now ?? Date.now();
  if (d.rank > st.rank && !opts.unlimited) return { ok: false, amount: 0, reason: 'locked' };
  const g = st.gathering;
  const s = depositStatus(g, d, now);
  const have = st.inventory[d.materialId] ?? 0;
  const room = isFinite(have) ? Math.max(0, st.cap.storage - have) : 0;
  if (opts.unlimited) return { ok: true, amount: d.take, remaining: d.capacity };
  const amount = Math.floor(Math.min(d.take, s.available, room) / 5) * 5;
  if (amount <= 0) return { ok: false, amount: 0, reason: room <= 0 ? 'full' : 'depleted', nextIn: s.nextIn };
  g.nodes[d.id] = { stock: s.stock - amount, at: now };
  st.inventory[d.materialId] = have + amount;
  g.total += amount;
  return { ok: true, amount, remaining: Math.floor(s.stock - amount) };
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
    const stock = Math.min(d.capacity, s.stock + d.capacity * 0.5);
    if (stock >= d.capacity - 1e-6) delete g.nodes[d.id];
    else g.nodes[d.id] = { stock, at: now };
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
