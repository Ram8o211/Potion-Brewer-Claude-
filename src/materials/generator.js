// The ingredient world of a shop, reproducible from its seed.
//
// Every ingredient grows in the alchemist's own garden:
//   • plain water from the well — the solvent, with no magic of its own;
//   • a few magical liquids pressed or collected from garden plants;
//   • magical stones grown in crystal beds, gathered whole, to be smashed
//     into powder (mortar or pestle) before they can dissolve.
// Each carries a magic vector (alchemy/magic.js), a temperature above which
// its magic fades and a super-transition temperature, usually far beyond any
// fire or frost, at which its magic would transmute into a single property.
// The seed varies names, colours and the exact numbers; the roles and their
// physical behaviour (which liquids blend, which float, how stones dissolve)
// stay the same so every world is playable.

import { Rng } from '../core/rng.js';
import { hslToRgb } from '../core/color.js';
import { completeMaterial } from './schema.js';

/** @typedef {import('./schema.js').MaterialDef} MaterialDef */

/**
 * @typedef {Object} World
 * @property {string} seed
 * @property {MaterialDef[]} materials       every material (ingredients and universals)
 * @property {string[]} ingredients          garden ingredient ids (display order)
 * @property {string[]} starting             ids the shop starts with
 * @property {any[]} reactions               (none: magic follows proportions)
 * @property {Record<string,string>} roles   role → material id
 */

/**
 * Ingredient roles. `hue` is [h, s, l]; `magic` is per property (0..100);
 * fadeT / superT in °C; `names` are seeded name choices.
 */
export const INGREDIENT_SPECS = [
  { role: 'water', kind: 'water', names: ['Well Water'], form: 'liquid', hue: [202, 0.5, 0.84], tint: 0.12, opacity: 0.5,
    density: 1.0, viscosity: 1, compat: [0.85, 0.1], boil: 100, melt: 0, heatCapacity: 4.2, gasDensity: 0.62, latentVapor: 380,
    magic: {}, lore: 'Plain water from your well. It has no magic of its own: it carries and dilutes.' },
  { role: 'dew', kind: 'liquid', names: ['Moonwell Dew', 'Dawn Dew', 'Silver Dew', 'Lily Dew'], form: 'liquid', hue: [150, 0.42, 0.74], tint: 0.42, opacity: 0.55,
    density: 1.02, viscosity: 1.6, compat: [0.84, 0.12], boil: 102, melt: -4, heatCapacity: 4.0,
    magic: { vitality: 56, charm: 14, levity: 8 }, fadeT: 72, superT: -520, superKey: 'vitality',
    lore: 'Dew from the moon lilies. Its magic mends and soothes.' },
  { role: 'sap', kind: 'liquid', names: ['Ember Sap', 'Cinder Sap', 'Hearth Sap'], form: 'liquid', hue: [16, 0.85, 0.42], tint: 0.85, opacity: 0.85,
    density: 1.18, viscosity: 60, viscTemp: 0.04, compat: [0.63, 0.28], boil: 190, melt: -12, heatCapacity: 3.0,
    flammability: 0.4, ignition: 270, combustionHeat: 700,
    magic: { ardor: 62, vitality: 12, bane: 6 }, fadeT: 150, superT: 1300, superKey: 'ardor',
    lore: 'Sap of the ember tree. Its magic kindles ardor, and gives a little life.' },
  { role: 'frostmilk', kind: 'liquid', names: ['Frostmilk', 'Rime Milk', 'Snowcap Milk'], form: 'liquid', hue: [196, 0.35, 0.9], tint: 0.4, opacity: 0.92,
    density: 1.04, viscosity: 3, compat: [0.85, 0.13], boil: 99, melt: -9, heatCapacity: 4.0,
    magic: { frost: 60, levity: 12, charm: 6 }, fadeT: 46, superT: -46, superKey: 'frost',
    lore: 'Milk of the frost lily. Its frost magic dies in the smallest heat.' },
  { role: 'witchoil', kind: 'liquid', names: ['Witch Oil', 'Nightshade Oil', 'Hexberry Oil'], form: 'liquid', hue: [285, 0.55, 0.3], tint: 0.9, opacity: 0.9,
    density: 0.86, viscosity: 28, viscTemp: 0.03, compat: [0.44, 0.24], boil: 240, melt: -20, heatCapacity: 2.0,
    flammability: 0.7, ignition: 235, combustionHeat: 850,
    magic: { bane: 46, levity: 26, charm: 10 }, fadeT: 125, superT: 94, superKey: 'levity',
    lore: 'Pressed from hexberries. Its magic lifts and harms, and will not join water’s magic until both are hot.' },
  { role: 'sunstone', kind: 'stone', shape: 'stone', names: ['Sunstone', 'Daystone', 'Gold Topaz'], hue: [42, 0.85, 0.58], density: 2.2, hardness: 0.6,
    sol: 0.12, solT: 0.0025, glow: 0.35, magic: { ardor: 70, vitality: 20 }, fadeT: 220, superT: 1650, superKey: 'ardor',
    lore: 'A stone that stores the sun’s ardor. Smash it; a hot steep draws its magic out.' },
  { role: 'glacite', kind: 'stone', shape: 'crystal', names: ['Glacite', 'Rime Crystal', 'Ice Spar'], hue: [190, 0.55, 0.8], density: 1.9, hardness: 0.5,
    sol: 0.15, solT: 0.002, glow: 0.2, magic: { frost: 72, levity: 10 }, fadeT: 58, superT: -1450, superKey: 'frost',
    lore: 'A crystal of deep frost. Smash it; gentle heat draws its magic out.' },
  { role: 'heartstone', kind: 'stone', shape: 'crystal', names: ['Heartstone', 'Rose Quartz', 'Amour Spar'], hue: [335, 0.55, 0.72], density: 2.3, hardness: 0.55,
    sol: 0.12, solT: 0.0025, glow: 0.25, magic: { charm: 68, vitality: 14 }, fadeT: 110, superT: 950, superKey: 'charm',
    lore: 'A crystal of affection. Its magic charms whoever drinks it.' },
  { role: 'bloodstone', kind: 'stone', shape: 'stone', names: ['Bloodstone', 'Heartwood Garnet', 'Life Jasper'], hue: [356, 0.6, 0.38], density: 2.5, hardness: 0.65,
    sol: 0.1, solT: 0.003, glow: 0, magic: { vitality: 66, ardor: 12, bane: 4 }, fadeT: 100, superT: 2100, superKey: 'vitality',
    lore: 'A stone that beats faintly. Its magic gives life, with a little sting.' },
  { role: 'skystone', kind: 'stone', shape: 'crystal', names: ['Skystone', 'Cloud Pumice', 'Wind Opal'], hue: [245, 0.35, 0.86], density: 0.75, hardness: 0.35,
    sol: 0.14, solT: 0.002, glow: 0.3, magic: { levity: 70, frost: 8 }, fadeT: 160, superT: -950, superKey: 'levity',
    lore: 'A stone of levity. Its magic lifts whatever drinks it.' },
  { role: 'blight', kind: 'stone', shape: 'stone', names: ['Blight Agate', 'Grave Agate', 'Murk Stone'], hue: [95, 0.4, 0.3], density: 2.0, hardness: 0.6,
    sol: 0.11, solT: 0.0025, glow: 0, magic: { bane: 74, frost: 10 }, fadeT: 180, superT: -2250, superKey: 'bane',
    lore: 'A stone of blight. Its magic withers what it touches.' },
];

/** @type {Record<string, typeof INGREDIENT_SPECS[number]>} */
export const SPEC_BY_ROLE = Object.fromEntries(INGREDIENT_SPECS.map((s) => [s.role, s]));

const r2 = (v) => Math.round(v * 100) / 100;

/**
 * @param {string|number} seed
 * @returns {World}
 */
export function generateWorld(seed) {
  const seedStr = String(seed);
  const rng = new Rng('garden-world:' + seedStr);
  /** @type {MaterialDef[]} */
  const materials = [];
  /** @type {Record<string,string>} */
  const roles = {};

  // universals produced by burning
  const soot = completeMaterial({
    id: 'soot', name: 'Soot', form: 'powder', archetype: 'ash', color: [0.17, 0.16, 0.16], tint: 0.9, opacity: 1,
    density: 1.1, compat: [0.5, 0.3], friction: 0.72, melt: 3000, boil: Infinity, heatCapacity: 1, conductivity: 0.2,
    price: 0, tier: 99, product: true, description: 'What burning leaves behind. No magic survives a fire.',
  });
  const smoke = completeMaterial({
    id: 'smoke', name: 'Smoke', form: 'gas', archetype: 'smoke', color: [0.46, 0.44, 0.43], tint: 0.6, opacity: 0.6,
    density: 0.8, gasDensity: 1.05, compat: [0.5, 0.3], melt: -200, boil: -150, heatCapacity: 1.2, conductivity: 0.2,
    price: 0, tier: 99, product: true, description: 'Smoke of something that burned.',
  });
  materials.push(soot, smoke);
  roles.soot = soot.id;
  roles.smoke = smoke.id;

  for (const s of INGREDIENT_SPECS) {
    const [h, sat, l] = s.hue;
    const color = hslToRgb((h + rng.range(-7, 7) + 360) % 360, Math.min(1, sat * rng.range(0.92, 1.08)), Math.min(0.94, l * rng.range(0.95, 1.05)));
    /** @type {Record<string, number>} */
    const magic = {};
    for (const [k, v] of Object.entries(s.magic)) magic[k] = Math.round(v * rng.range(0.9, 1.1));
    const name = rng.pick(s.names);
    const stone = s.kind === 'stone';
    // thresholds within reach stay within reach; the extreme ones stay extreme
    const sup = s.superT === undefined ? undefined : Math.abs(s.superT) < 200 ? Math.round(s.superT + rng.range(-5, 5)) : Math.round(s.superT * rng.range(0.92, 1.08));
    const fade = s.fadeT === undefined ? undefined : Math.round(s.fadeT * rng.range(0.94, 1.06));
    const common = {
      id: s.role, name, archetype: s.role, color, magic, description: s.lore, product: false, tier: 0,
      kind: /** @type {any} */ (s.kind), fadeT: fade, superT: sup, superKey: s.superKey,
      price: s.kind === 'water' ? 0 : stone ? 10 : 8, econd: 0.05, charge: 0, reactivity: 0.1,
    };
    let m;
    if (stone) {
      m = completeMaterial({
        ...common, form: 'solid', shape: s.shape, tint: 0.8, opacity: 1,
        density: r2(s.density * rng.range(0.97, 1.03)), compat: [r2(rng.range(0.81, 0.85)), r2(rng.range(0.12, 0.16))],
        hardness: s.hardness, friction: r2(rng.range(0.6, 0.7)), binder: 0,
        solubility: r2(s.sol * rng.range(0.92, 1.08)), solubilityTemp: s.solT, melt: 1500, boil: Infinity,
        heatCapacity: 1.8, conductivity: 0.6, flammability: 0, glow: s.glow || 0,
      });
      /** @type {any} */ (m).crushable = true;
    } else {
      m = completeMaterial({
        ...common, form: 'liquid', tint: s.tint, opacity: s.opacity,
        density: r2(s.density * rng.range(0.98, 1.02)), viscosity: s.viscosity, viscTemp: s.viscTemp ?? 0.02, compat: s.compat.slice(),
        boil: s.boil, melt: s.melt, heatCapacity: s.heatCapacity, gasDensity: s.gasDensity ?? 1.2, latentVapor: s.latentVapor ?? 300,
        flammability: s.flammability || 0, ignition: s.ignition || 9999, combustionHeat: s.combustionHeat || 0,
        smoke: s.flammability ? smoke.id : undefined, ash: s.flammability ? soot.id : undefined,
      });
    }
    materials.push(m);
    roles[s.role] = m.id;
  }
  const ingredients = INGREDIENT_SPECS.map((s) => roles[s.role]);
  const starting = ['water', 'dew', 'sap', 'sunstone', 'bloodstone'].map((r) => roles[r]);
  return { seed: seedStr, materials, ingredients, starting, reactions: [], roles };
}

/** Build an id → material lookup for a world (plus optional extra defs). */
export function makeLookup(world, extra = []) {
  const map = new Map();
  for (const m of world.materials) map.set(m.id, m);
  for (const m of extra) map.set(m.id, m);
  return (id) => map.get(id);
}
