// The Free Experiment: a GameState turned into a laboratory with everything
// the campaign has, and no shop around it.
//
// It keeps the campaign's features in step with the shop's: every reagent
// and wild ingredient (bottomless), every piece of equipment, every biome,
// the potion shelves, the aging cellar (with as many temperature runes as
// wanted) and the garden (every seed, every bed, at the highest grade). The
// slow parts of the campaign run faster here, so they can be watched within
// a session: the wilds grow back SANDBOX_PACE times faster (gathering.js),
// the cellar ages SANDBOX_CELLAR_PACE times faster and crops grow
// SANDBOX_GARDEN_PACE times faster.
//
// Nothing here touches the shop's save: the sandbox keeps its own (the
// cauldron, its trials, shelves, cellar and garden) under its own key.

import { sandboxIngredients } from '../materials/generator.js';
import { EQUIPMENT } from './equipment.js';
import { BIOMES } from './biomes.js';
import { sandboxWilds } from './gathering.js';
import { normalizeTrials } from './experiments.js';
import { normalizeCellar } from './cellar.js';
import { normalizeGarden, seedId, TUTORIAL_PACE } from './garden.js';
import { SPECIES_BY_KEY, materialIdOf } from '../materials/catalog.js';
import { migrateVial } from './vial.js';

/** How many times faster the Free Experiment's cellar ages: an hour of aging in a minute. */
export const SANDBOX_CELLAR_PACE = 60;
/** How many times faster the Free Experiment's crops grow (the garden's own ceiling). */
export const SANDBOX_GARDEN_PACE = TUTORIAL_PACE;

/**
 * The Free Experiment's garden plots: as many of each bed as the scene
 * holds (two rows of six), every one an Arcane chamber, so any seed grows.
 */
const SANDBOX_BEDS = /** @type {const} */ ([['soil', 4], ['fungal', 3], ['crystal', 3], ['tide', 2]]);

/**
 * Turn a freshly created GameState into the Free Experiment, restoring what
 * the sandbox kept from an earlier visit (only when it was the same world).
 * @param {import('./state.js').GameState} st
 * @param {any} [saved] the sandbox's own save (persistence KEYS.sandbox)
 * @param {number} [now]
 */
export function prepareSandbox(st, saved = null, now = Date.now()) {
  const same = !!(saved && saved.seed === st.seed);
  st.equipment = EQUIPMENT.map((e) => e.id);
  st.reputation = 99999;
  st.current = null;
  // every biome is open; its wilds stand fully grown and grow back quickly after every harvest
  st.regen.unlocked = BIOMES.map((b) => b.id);
  sandboxWilds(st.gathering, st.deposits, now);
  if (same && saved.cauldron) st.cauldron = saved.cauldron;
  // the sandbox keeps its own trial history, separate from the shop's
  if (same && saved.trials) {
    st.trials = normalizeTrials(saved.trials);
    // the sandbox's hutch keeps its own days; its rabbits' remains are rebuilt
    st.day = Math.max(st.day, st.colony.day || 1);
    st.colony.seed = st.colony.seed || String(st.seed);
    st.restoreRemains();
  }
  // its own potion shelves
  if (same && Array.isArray(saved.bottles)) st.bottles = saved.bottles.map(migrateVial).filter(Boolean).slice(0, st.cap.bottles);
  // the cellar: every vessel the guild sells, runes without end, aging at a quicker pace
  st.cellar = normalizeCellar(same && saved.cellar ? saved.cellar : null, st.cap.vessels, now);
  sandboxCellar(st.cellar);
  // the garden: every bed at the highest grade, every seed, growing at a quicker pace
  st.garden = sandboxGarden(same && saved.garden ? normalizeGarden(saved.garden, now) : null, st);
  // bottomless stores (also of the remains rebuilt above)
  for (const id of sandboxIngredients(st.world)) st.inventory[id] = Infinity;
  return st;
}

/** Make a cellar the Free Experiment's: unlimited runes, a quicker clock. @param {any} cellar */
export function sandboxCellar(cellar) {
  cellar.runes = Infinity;
  cellar.pace = SANDBOX_CELLAR_PACE;
  return cellar;
}

/**
 * Make a garden the Free Experiment's: its plots (keeping the crops of an
 * earlier visit), a seed of every species the world holds in both forms
 * (never used up), the copper can and a quicker growth.
 * @param {ReturnType<typeof normalizeGarden>|null} g @param {import('./state.js').GameState} st
 */
export function sandboxGarden(g, st) {
  const out = g || normalizeGarden(null);
  /** @type {any[]} */
  const plots = [];
  for (const [bed, n] of SANDBOX_BEDS) {
    const old = out.plots.filter((p) => p.bed === bed);
    for (let k = 0; k < n; k++) plots.push({ id: `${bed}${k + 1}`, bed, grade: 2, crop: (old[k] && old[k].crop) || null });
  }
  out.plots = plots;
  out.seeds = {};
  for (const key of Object.keys(SPECIES_BY_KEY)) {
    for (const arcane of [false, true]) if (st.lookup(materialIdOf(key, arcane))) out.seeds[seedId(key, arcane)] = Infinity;
  }
  out.can = 1;
  out.pace = SANDBOX_GARDEN_PACE;
  out.seen = true;
  return out;
}

/** What the Free Experiment saves of a state (its own key, never the shop's). @param {import('./state.js').GameState} st @param {any} cauldron */
export function sandboxSave(st, cauldron) {
  const { pace: _p, runes: _r, ...cellar } = /** @type {any} */ (st.cellar);
  const { pace: _g, seeds: _s, ...garden } = /** @type {any} */ (st.garden);
  return { seed: st.seed, cauldron, trials: st.trials, bottles: st.bottles, cellar, garden };
}
