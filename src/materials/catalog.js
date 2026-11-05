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
import { speciesProfile, CLASS_COMPAT, classWords } from '../alchemy/extraction.js';

/** @typedef {typeof SPECIES_DATA[number]} SpeciesDef */

/** Version of the catalog's materials (bump to refresh them in old saves' worlds). */
export const CATALOG_VERSION = 6;

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

/** The inert char a burnt ingredient leaves (materials/generator.js addSolvents adds it to every world). */
export const CHAR_ID = 'char-inert';

const STEEP_NAME = { hydro: 'Extract', lipo: 'Oil Extract' };

/**
 * The catalog's materials for a world: every species' ordinary and Arcane
 * raw forms and their dissolved extracts. Extraction is no longer a set of
 * fixed-temperature reactions: the simulation draws magic out continuously
 * (reactions/extraction.js, alchemy/extraction.js), so `reactions` is empty.
 * @param {{materials:any[], roles:Record<string,string>}} base the world's solvents
 */
export function generateCatalog(base) {
  /** @type {any[]} */
  const materials = [];
  /** @type {import('../reactions/reactions.js').ReactionRule[]} */
  const reactions = [];
  for (const s of SPECIES) {
    const col = SPECIES_COLORS[s.key] || { body: [0.6, 0.55, 0.45], accent: [0.8, 0.7, 0.5] };
    const biome = BIOME_BY_ID[s.biome];
    const prof = /** @type {import('../alchemy/extraction.js').ExtractionProfile} */ (speciesProfile(s.key));
    const words = classWords(prof.cls);
    for (const arcane of [false, true]) {
      const id = materialIdOf(s.key, arcane);
      const m = /** @type {any} */ (completeMaterial({
        id, name: arcane ? `Arcane ${s.name}` : s.name, archetype: 'wild', form: /** @type {any} */ (s.form), color: col.body.slice(), tint: 0.75, opacity: 1,
        density: s.density, compat: CLASS_COMPAT[prof.cls].slice(), friction: 0.67, binder: 0, hardness: s.hardness,
        solubility: s.sol, solubilityTemp: s.solT, melt: 1500, boil: Infinity,
        // the raw matter chars above its (hidden) combustion threshold; its extract never burns
        heatCapacity: 1.7, conductivity: 0.35, flammability: 0.45, ignition: prof.combust, combustionHeat: 300,
        ash: CHAR_ID, smoke: base.roles.smoke, glow: arcane ? 0.35 : 0, reactivity: 0.3,
        price: Math.round(s.price * (arcane ? valueOf(s.rarity, true) / valueOf(s.rarity, false) : 1)), tier: 99, product: false,
        description: `${s.lore} ${RARITY[s.rarity].label}${arcane ? ', Arcane' : ''} — ${biome ? biome.name : s.biome}. Its magic is ${words.short}: it dissolves only in ${words.solvents}.`,
      }));
      // a species' magic is fixed: every specimen, every world, the same numbers
      m.effects = { ...s.fx };
      // only the Arcane form can awaken (the ordinary form has no threshold)
      if (arcane) m.arcane = { thr: s.arcane.thr, gain: s.arcane.gain };
      m.fxv = CATALOG_VERSION;
      m.econd = s.morph === 'crystal' || s.morph === 'relic' ? 0.3 : 0.04;
      m.charge = 0;
      m.crushable = true;
      m.extraction = { ...prof };
      if (prof.emulsifier > 0) m.emulsifier = prof.emulsifier;
      m.wild = {
        key: s.key, species: s.key, shape: s.shape, region: s.biome, rank: 0, rare: RARITY[s.rarity].rank >= 2,
        gatherOnly: true, gather: s.gather, dusk: false, dawn: false,
        rarity: s.rarity, arcane, morph: s.morph, category: s.category, catalog: true,
      };
      materials.push(m);
      // the dissolved extract: the same magic per volume (one volume of
      // ingredient gives one volume of extract), carried by its solvent class
      const ext = /** @type {any} */ (completeMaterial({
        id: `wild-p-sp-${s.key}${arcane ? ARC : ''}`, name: `${m.name} ${STEEP_NAME[prof.cls]}`, archetype: 'product',
        tint: 0.85, opacity: 0.85, heatCapacity: 3.6, boil: Infinity, melt: prof.cls === 'hydro' ? -2 : -10, viscosity: 2.5, compat: CLASS_COMPAT[prof.cls].slice(), price: 0, tier: 99, product: true,
        density: prof.cls === 'hydro' ? Math.max(1, s.density * 0.8) : 0.9, form: 'liquid', color: col.body.map((c) => Math.round(c * 0.85 * 100) / 100),
        flammability: 0, description: `The magic of ${m.name} dissolved in ${words.solvents}. Dissolved magic is thermally stable.`,
      }));
      ext.effects = { ...s.fx };
      if (m.arcane) ext.arcane = { ...m.arcane };
      ext.fxv = CATALOG_VERSION;
      ext.econd = 0.12;
      ext.charge = 0;
      ext.extractOf = id;
      ext.extractClass = prof.cls;
      materials.push(ext);
    }
  }
  return { materials, reactions };
}
