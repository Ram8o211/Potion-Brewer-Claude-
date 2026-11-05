// The ingredient species catalog at runtime: permanent species identities
// (species-data.js), their ordinary and Arcane materials, and the
// extraction reactions that draw their magic into a solvent.
//
// A species is never rerolled: its name, rarity, effects, Arcane threshold
// and look are the same in every world, every save and every biome
// regeneration. What a world or a regeneration changes is only which
// species grow where and how many (game/regen.js).
//
// Material ids:
//   wild-sp-<key>          the ordinary form — carries every effect of its
//                          species but no arcane profile: it can never awaken
//   wild-sp-<key>-arcane   the Arcane form — the same magic, plus the species'
//                          activation threshold and gain (alchemy/arcane.js)
//
// The `wild-` prefix keeps them in every code path that already treats wild
// ingredients specially (profiles, discovery, the shelf).

import { SPECIES_DATA } from './species-data.js';
import { SPECIES_COLORS } from './species-colors.js';
import { completeMaterial } from './schema.js';
import { RARITY, valueOf } from './rarity.js';
import { BIOME_BY_ID } from '../game/biomes.js';

/** @typedef {typeof SPECIES_DATA[number]} SpeciesDef */

/** Version of the catalog's materials (bump to refresh them in old saves' worlds). */
export const CATALOG_VERSION = 5;

/** @type {SpeciesDef[]} */
export const SPECIES = SPECIES_DATA;
/** @type {Record<string, SpeciesDef>} */
export const SPECIES_BY_KEY = Object.fromEntries(SPECIES.map((s) => [s.key, s]));

const PREFIX = 'wild-sp-';
const ARC = '-arcane';

/** @param {string} key @param {boolean} [arcane] */
export const materialIdOf = (key, arcane = false) => PREFIX + key + (arcane ? ARC : '');

/** Is this a catalog species' material (ordinary or Arcane)? @param {string} id */
export const isCatalogId = (id) => typeof id === 'string' && id.startsWith(PREFIX);

/**
 * The species and form of a catalog material id (or of its awakened form).
 * @param {string} id @returns {{key:string, arcane:boolean, species:SpeciesDef}|null}
 */
export function parseCatalogId(id) {
  if (!isCatalogId(id)) return null;
  let rest = id.slice(PREFIX.length);
  if (rest.endsWith('~a')) rest = rest.slice(0, -2);
  const arcane = rest.endsWith(ARC);
  const key = arcane ? rest.slice(0, -ARC.length) : rest;
  const species = SPECIES_BY_KEY[key];
  return species ? { key, arcane, species } : null;
}

/** The species of a material (its catalog entry), or null. @param {any} m */
export function speciesOfMaterial(m) {
  if (!m) return null;
  if (m.wild && m.wild.species) return SPECIES_BY_KEY[m.wild.species] || null;
  const p = parseCatalogId(m.id);
  return p ? p.species : null;
}

/** Every catalog material id (ordinary, then Arcane), in catalog order. */
export function catalogIds() {
  return SPECIES.flatMap((s) => [materialIdOf(s.key), materialIdOf(s.key, true)]);
}

/** Species of a biome, catalog order. @param {string} biome */
export const speciesOfBiome = (biome) => SPECIES.filter((s) => s.biome === biome);

const STEEP_NAME = { water: 'Infusion', spirit: 'Tincture', oil: 'Oil' };

/**
 * The catalog's materials and extraction reactions for a world.
 * @param {{materials:any[], roles:Record<string,string>}} base the world's solvents
 */
export function generateCatalog(base) {
  /** @type {any[]} */
  const materials = [];
  /** @type {import('../reactions/reactions.js').ReactionRule[]} */
  const reactions = [];
  const solvent = { water: base.roles.water, spirit: base.roles.spirit, oil: base.roles.oil };
  for (const s of SPECIES) {
    const col = SPECIES_COLORS[s.key] || { body: [0.6, 0.55, 0.45], accent: [0.8, 0.7, 0.5] };
    const biome = BIOME_BY_ID[s.biome];
    for (const arcane of [false, true]) {
      const id = materialIdOf(s.key, arcane);
      const m = /** @type {any} */ (completeMaterial({
        id, name: arcane ? `Arcane ${s.name}` : s.name, archetype: 'wild', form: /** @type {any} */ (s.form), color: col.body.slice(), tint: 0.75, opacity: 1,
        density: s.density, compat: [0.82, 0.14], friction: 0.67, binder: 0, hardness: s.hardness,
        solubility: s.sol, solubilityTemp: s.solT, melt: 1500, boil: Infinity,
        heatCapacity: 1.7, conductivity: 0.35, flammability: s.botanical ? 0.45 : 0, ignition: 290, combustionHeat: 500,
        ash: base.roles.soot, smoke: base.roles.smoke, glow: arcane ? 0.35 : 0, reactivity: 0.3,
        price: Math.round(s.price * (arcane ? valueOf(s.rarity, true) / valueOf(s.rarity, false) : 1)), tier: 99, product: false,
        description: `${s.lore} ${RARITY[s.rarity].label}${arcane ? ', Arcane' : ''} — ${biome ? biome.name : s.biome}.`,
      }));
      // a species' magic is fixed: every specimen, every world, the same numbers
      m.effects = { ...s.fx };
      // only the Arcane form can awaken (the ordinary form has no threshold)
      if (arcane) m.arcane = { thr: s.arcane.thr, gain: s.arcane.gain };
      m.fxv = CATALOG_VERSION;
      m.econd = s.morph === 'crystal' || s.morph === 'relic' ? 0.3 : 0.04;
      m.charge = 0;
      m.crushable = true;
      m.wild = {
        key: s.key, species: s.key, shape: s.shape, region: s.biome, rank: 0, rare: RARITY[s.rarity].rank >= 2,
        gatherOnly: true, gather: s.gather, dusk: false, dawn: false,
        rarity: s.rarity, arcane, morph: s.morph, category: s.category, catalog: true,
      };
      materials.push(m);
      // extraction: the right solvent, inside its temperature window, takes up all of its magic
      const st = s.steep, into = solvent[/** @type {'water'|'spirit'|'oil'} */ (st.into)];
      if (!into) continue;
      const ext = /** @type {any} */ (completeMaterial({
        id: `wild-p-sp-${s.key}${arcane ? ARC : ''}`, name: `${m.name} ${STEEP_NAME[/** @type {'water'} */ (st.into)] || 'Extract'}`, archetype: 'product',
        tint: 0.85, opacity: 0.85, heatCapacity: 3.6, boil: Infinity, melt: -20, viscosity: 2.5, compat: [0.82, 0.14], price: 0, tier: 99, product: true,
        density: Math.max(1, s.density * 0.8), form: 'liquid', color: col.body.map((c) => Math.round(c * 0.85 * 100) / 100),
        description: `The magic of ${m.name} drawn into ${st.into}.`,
      }));
      ext.effects = Object.fromEntries(Object.entries(s.fx).map(([k, v]) => [k, Math.round(v * 1.08 * 10) / 10]));
      if (m.arcane) ext.arcane = { ...m.arcane };
      ext.fxv = CATALOG_VERSION;
      ext.econd = 0.12;
      ext.charge = 0;
      materials.push(ext);
      const lo = Math.round((st.lo[0] + st.lo[1]) / 10) * 5, hi = Math.round((st.hi[0] + st.hi[1]) / 10) * 5;
      const window = `between about ${lo} and ${hi}°C`;
      if (st.into === 'water') {
        reactions.push({ id: `rw_extract_sp_${s.key}${arcane ? '_a' : ''}`, name: ext.name, kind: 'decompose', a: id, b: null, ra: 1, rb: 0, products: [{ id: ext.id, frac: 1 }],
          minT: lo, maxT: hi, rate: 0.1, heat: -4, stir: 0.4, wet: true, hint: `Ground ${m.name} steeps into water ${window}.` });
      } else {
        reactions.push({ id: `rw_extract_sp_${s.key}${arcane ? '_a' : ''}`, name: ext.name, kind: st.into === 'oil' ? 'contact' : 'mix', a: id, b: into, ra: 1, rb: 1, products: [{ id: ext.id, frac: 1 }],
          minT: lo, maxT: hi, rate: 0.25, heat: 4, stir: 0.8, hint: `${m.name} dissolves in ${st.into} ${window}.` });
      }
    }
  }
  return { materials, reactions };
}
