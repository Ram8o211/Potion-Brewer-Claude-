// Remains: what is left of a colony rabbit becomes brewing ingredients.
//
// A dead rabbit can be processed once. Its bones always come back; its pelt
// unless it burned (then ash); a residue if it carried poison, acid, lye or
// change. Each part is a real material of the world — a crushable bone or
// pelt, a fine ash or residue powder — whose hidden effects come from what
// the rabbit absorbed in life (the colony's lifetime exposure, colony.js):
// bones keep strength, death, change and magic; the pelt love, life, heat,
// cold and poison; ash the fire; the residue poison, acid or lye and change.
// Concentrations saturate (a bone never becomes stronger than a wild
// ingredient), the parts awaken past arcane thresholds like any magical
// material, and nothing here is shown to the player: like any mixture,
// remains have to be tested in the Trials room to be known.
//
// Pure and deterministic in (source, world seed): the same body always
// gives the same materials, so they can be rebuilt (the sandbox's world is
// not saved).

import { completeMaterial } from './schema.js';
import { arcaneProfile, jitter } from './profiles.js';

/** @typedef {'bone'|'fur'|'ash'|'residue'} RemainsPart */

/** Id of a part of a rabbit's remains. @param {string} rabbitId @param {RemainsPart} part */
export function remainsId(rabbitId, part) {
  return `rem-${rabbitId}-${part}`;
}

/** @param {any} m */
export function isRemains(m) {
  return !!(m && m.remains);
}

/** Has this body burned (fire death, or lived through a lot of fire)? @param {import('../game/colony.js').RemainsSource} src */
const burned = (src) => src.cause === 'fire' || (src.exposure.fire || 0) >= 60;

/**
 * Which parts a body yields, and how much (ml, multiples of 5).
 * @param {import('../game/colony.js').RemainsSource} src
 * @returns {{part:RemainsPart, ml:number}[]}
 */
export function remainsPlan(src) {
  const big = src.stage === 'adult' || src.stage === 'elder';
  const k = big ? 1 : 0.5;
  const ex = src.exposure;
  /** @type {{part:RemainsPart, ml:number}[]} */
  const out = [{ part: 'bone', ml: big ? 110 : 55 }];
  if (burned(src)) out.push({ part: 'ash', ml: big ? 50 : 25 });
  else out.push({ part: 'fur', ml: Math.round((80 * k) / 5) * 5 });
  if ((ex.toxicity || 0) + (ex.acid || 0) + (ex.alkali || 0) + (ex.transformation || 0) >= 30) out.push({ part: 'residue', ml: big ? 40 : 20 });
  return out;
}

/** Per part: base effects, and [cap, take] per channel. */
const FX = {
  bone: { base: { strength: 3, death: 3 }, ch: { strength: [30, 1], death: [28, 1], transformation: [24, 0.8], arcana: [22, 0.8], frost: [12, 0.5] } },
  fur: { base: { love: 2 }, ch: { love: [30, 1], vitality: [24, 0.8], fire: [26, 0.9], frost: [26, 0.9], toxicity: [20, 0.7], arcana: [10, 0.4] } },
  ash: { base: { acidity: -8, fire: 4 }, ch: { fire: [32, 1], death: [20, 0.8] } },
  residue: { base: { toxicity: 2 }, ch: { toxicity: [34, 1], acidity: [30, 0.9], transformation: [26, 0.9], vitality: [14, 0.5], death: [14, 0.5] } },
};
/** Arcane threshold of each part before its magic shifts it. */
const ARC_BASE = { bone: 600, fur: -250, ash: 900, residue: -500 };
const PART_NOUN = { bone: 'bones', fur: 'pelt', ash: 'ashes', residue: 'residue' };
const PART_SHORT = { bone: 'bone', fur: 'pelt', ash: 'ash', residue: 'residue' };

const mix = (a, b, t) => a.map((x, i) => Math.round((x + (b[i] - x) * t) * 1000) / 1000);
const r1 = (v) => Math.round(v * 10) / 10;

/**
 * The hidden effects of one part of a body.
 * @param {RemainsPart} part @param {Record<string, number>} ex lifetime exposure @param {string} seed @param {string} id
 */
function partEffects(part, ex, seed, id) {
  const t = FX[part];
  /** @type {Record<string, number>} */
  const fx = { ...t.base };
  for (const [k, [cap, take]] of Object.entries(t.ch)) {
    const E = k === 'acidity' ? (ex.acid || 0) - (ex.alkali || 0) : ex[k] || 0;
    if (!E) continue;
    const v = Math.sign(E) * r1(cap * (1 - Math.exp((-take * Math.abs(E)) / 60)) * jitter(seed, id, k, 0.08));
    fx[k] = r1(Math.max(-40, Math.min(40, (fx[k] || 0) + v)));
  }
  for (const k of Object.keys(fx)) if (Math.abs(fx[k]) < 0.5) delete fx[k];
  return fx;
}

/** The colour of a part (a visible, physical trait: it may show the life it had). */
function partColor(part, src) {
  const ex = src.exposure;
  if (part === 'bone') return mix(mix([0.9, 0.86, 0.76], [0.6, 0.58, 0.62], Math.min(0.5, (ex.death || 0) / 120)), [0.4, 0.9, 0.79], Math.min(0.3, (ex.transformation || 0) / 300));
  if (part === 'fur') {
    let c = src.look.coat.slice();
    c = mix(c, [0.3, 0.2, 0.14], Math.min(0.5, (ex.fire || 0) / 150));
    c = mix(c, [0.55, 0.62, 0.3], Math.min(0.3, (ex.toxicity || 0) / 200));
    return mix(c, [0.75, 0.9, 1], Math.min(0.3, (ex.frost || 0) / 200));
  }
  if (part === 'ash') return mix([0.42, 0.4, 0.4], [0.55, 0.3, 0.2], Math.min(0.3, (ex.fire || 0) / 300));
  // residue: weighted by what it carried
  const parts = [[[0.55, 0.62, 0.3], ex.toxicity || 0], [[0.85, 0.8, 0.3], ex.acid || 0], [[0.85, 0.82, 0.74], ex.alkali || 0], [[0.4, 0.9, 0.79], ex.transformation || 0], [[0.5, 0.48, 0.46], 10]];
  const w = parts.reduce((a, p) => a + /** @type {number} */ (p[1]), 0);
  return [0, 1, 2].map((i) => Math.round((parts.reduce((a, p) => a + /** @type {number[]} */ (p[0])[i] * /** @type {number} */ (p[1]), 0) / w) * 1000) / 1000);
}

/** Observational description: no numbers but the day it died. */
function describe(part, src) {
  const she = src.sex === 'f' ? 'she' : 'he';
  const kind = src.sex === 'f' ? 'a doe' : 'a buck';
  const how = src.cause && src.cause !== 'unknown' ? ` that died ${{ poison: 'of poison', death: 'of death magic', fire: 'in fire', frost: 'of cold', acid: 'of acid burns', alkali: 'of lye burns', change: 'of a violent change', arcana: 'of a magical surfeit', age: 'of old age', frail: 'of weakness', hunted: 'in the wilds' }[src.cause] || ''}` : '';
  const when = Number.isFinite(src.diedDay) ? ` on day ${src.diedDay}` : '';
  const what = { bone: 'The cleaned bones', fur: 'The pelt', ash: 'The ashes', residue: 'A residue scraped from the remains' }[part];
  const traits = part === 'bone' && src.traits.some((t) => ['horns', 'antlers', 'unihorn'].includes(t)) ? ' The skull bears its horns.' : part === 'bone' && src.traits.includes('wings') ? ' Fine wing bones are among them.' : '';
  return `${what} of ${src.name}, ${kind}${how}${when}. Whatever ${she} absorbed in life may linger in them.${traits}${part === 'bone' || part === 'fur' ? ' Crush or grind it; only what dissolves takes effect.' : ''}`;
}

/**
 * The materials a body yields (one per part in remainsPlan).
 * @param {import('../game/colony.js').RemainsSource} src
 * @param {{seed:string, roles:Record<string, string>}} world
 */
export function remainsMaterials(src, world) {
  return remainsPlan(src).map(({ part }) => {
    const id = remainsId(src.id, part);
    const fx = partEffects(part, src.exposure, world.seed, id);
    const solid = part === 'bone' || part === 'fur';
    const color = partColor(part, src);
    const phys = {
      bone: { form: 'solid', archetype: 'remains', density: 1.85, hardness: 0.7, solubility: 0.05, solubilityTemp: 0.0025, compat: [0.82, 0.14], friction: 0.68, heatCapacity: 1.4, conductivity: 0.4, flammability: 0, tint: 0.6, price: 8 },
      fur: { form: 'solid', archetype: 'remains', density: 0.62, hardness: 0.15, solubility: 0.14, solubilityTemp: 0.002, compat: [0.55, 0.22], friction: 0.7, heatCapacity: 1.5, conductivity: 0.2, flammability: 0.6, ignition: 280, combustionHeat: 500, ash: world.roles.soot, smoke: world.roles.smoke, tint: 0.75, price: 6 },
      ash: { form: 'powder', archetype: 'ash', density: 0.8, friction: 0.72, solubility: 0.18, solubilityTemp: 0.002, compat: [0.84, 0.12], heatCapacity: 0.9, conductivity: 0.3, flammability: 0, tint: 0.7, price: 4 },
      residue: { form: 'powder', archetype: 'remains', density: 1.3, solubility: 0.24, solubilityTemp: 0.003, binder: 0.2, friction: 0.6, compat: [0.82, 0.15], heatCapacity: 1.2, conductivity: 0.35, flammability: 0.1, ignition: 300, combustionHeat: 300, ash: world.roles.soot, tint: 0.7, price: 5 },
    }[part];
    const m = completeMaterial(/** @type {any} */ ({
      id, name: `${src.name}’s ${PART_NOUN[part]}`, color, opacity: 1, melt: 1500, boil: Infinity, reactivity: 0.2,
      tier: 99, product: false, description: describe(part, src), ...phys,
      glow: (src.exposure.arcana || 0) > 40 ? Math.min(0.6, ((src.exposure.arcana || 0) - 40) / 150) : 0,
    }));
    const mm = /** @type {any} */ (m);
    mm.effects = fx;
    // magic stays magic: the arcane threshold follows what the part carries
    const arc = fx.arcana || 0;
    const thr = ARC_BASE[part] * (1 - Math.min(0.8, Math.max(0, arc) / 30)) + 10 * ((fx.fire || 0) - (fx.frost || 0));
    mm.arcane = arcaneProfile(world.seed, id, thr, 1.8 + 0.04 * Math.min(30, Math.max(0, arc)));
    mm.econd = 0.03;
    mm.charge = 0;
    mm.shape = part === 'bone' ? 'bone' : part === 'fur' ? 'fur' : undefined;
    if (solid) mm.crushable = true;
    mm.remains = { rabbitId: src.id, rabbitName: src.name, part, day: src.diedDay, cause: src.cause, short: `${src.name.split(' ')[0]} ${PART_SHORT[part]}` };
    return m;
  });
}
