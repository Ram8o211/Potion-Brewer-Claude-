// Magical, chemical and electrical profiles of the generated reagents.
//
// The world generator assigns every material an effect vector (see
// alchemy/effects.js) and electrical properties from its *role* (the stable
// part of its id, e.g. "ember-b" → "ember"). Values are jittered with a hash
// of the world seed and the id rather than the generator's RNG stream, so:
//   • existing seeds keep exactly the reagents they always had;
//   • an old save's embedded world is upgraded to precisely the values a
//     freshly generated world of the same seed would get.

import { hashString } from '../core/rng.js';

/** @typedef {Record<string, number>} Fx */

/** Base effect potencies (pure material, 0..100) by role. @type {Record<string, Fx>} */
export const ROLE_EFFECTS = {
  soot: { toxicity: 6, death: 4, acidity: -14 },
  smoke: { toxicity: 14 },
  water: {},
  oil: { fire: 5, strength: 4 },
  syrup: { vitality: 10, strength: 6, love: 5 },
  spirit: { fire: 5, arcana: 8, toxicity: 7 },
  essenceA: { vitality: 17 },
  essenceB: { fire: 16, love: 5 },
  essenceC: { arcana: 17, transformation: 3 },
  binder: { strength: 9, vitality: 2 },
  salt: { strength: 3, vitality: 4, frost: 2 },
  ember: { fire: 42, acidity: 10, strength: 4 },
  frost: { frost: 46, strength: 6, arcana: 2 },
  metal: { strength: 14, toxicity: 34, arcana: 4 },
  crystal: { arcana: 32, strength: 6, transformation: 6 },
  wax: { strength: 7, fire: 2 },
  fizz: { acidity: 32, transformation: 10, arcana: 4 },
  spores: { arcana: 22, transformation: 12, toxicity: 6, vitality: 4 },
  resin: { fire: 20, strength: 16 },
  starlight: { arcana: 45, love: 8, vitality: 6 },
  moss: { strength: 34, vitality: 6 },
  vapor: { arcana: 12, toxicity: 22 },
  phoenix: { vitality: 24, fire: 55, transformation: 16 },
  void: { arcana: 40, death: 34, transformation: 14 },
  p_elixir: { vitality: 70, strength: 4, arcana: 4 },
  p_ardent: { fire: 64, love: 10, strength: 6 },
  p_arcane: { arcana: 72, transformation: 8 },
  p_salve: { strength: 64, vitality: 12 },
  p_fizzgas: { transformation: 8, acidity: 6 },
  p_spent: { acidity: 10, strength: 4 },
  p_caramel: { vitality: 14, fire: 14, love: 12, strength: 8 },
  p_panacea: { vitality: 82, arcana: 58, strength: 8 },
  p_amalgam: { strength: 58, arcana: 28, toxicity: 18 },
  p_phoenix: { vitality: 58, fire: 66, transformation: 22 },
  p_varnish: { strength: 54, fire: 20, toxicity: 14 },
  p_frostbloom: { frost: 44, arcana: 30, transformation: 10 },
  p_lumen: { arcana: 84, vitality: 6, love: 6 },
};

/** Electrical conductance (0..1) and intrinsic charge per unit volume (−1..1). */
export const ROLE_ELECTRIC = {
  water: [0.08, 0], oil: [0, 0], syrup: [0.04, 0], spirit: [0.03, 0], essenceA: [0.1, 0], essenceB: [0.1, 0], essenceC: [0.12, 0],
  binder: [0.02, 0], salt: [0.6, 0], ember: [0.35, 0.25], frost: [0.06, 0], metal: [1, 0], crystal: [0.2, 0], wax: [0, 0], fizz: [0.3, 0],
  spores: [0.05, 0], resin: [0, 0], starlight: [0.3, 0.2], moss: [0.05, 0], vapor: [0.02, 0], phoenix: [0.4, 0.5], void: [0.25, -0.6],
  soot: [0.5, 0], smoke: [0, 0], p_amalgam: [0.9, 0], p_elixir: [0.2, 0], p_arcane: [0.25, 0], p_lumen: [0.35, 0.15], p_phoenix: [0.4, 0.3],
};

/** Stable role of a generated id ("p_elixir-1a" → "p_elixir", "wild-ironroot" → "wild-ironroot"). @param {string} id */
export function roleOf(id) {
  if (id.startsWith('wild-')) return id;
  const k = id.lastIndexOf('-');
  return k > 0 ? id.slice(0, k) : id;
}

/** Deterministic jitter in [1-amp, 1+amp] from seed and id. */
function jitter(seed, id, salt, amp) {
  const h = hashString(`${seed}|${id}|${salt}`);
  return 1 - amp + ((h % 10007) / 10006) * 2 * amp;
}

/**
 * Give a material its effect vector and electrical properties (in place) if
 * it has none. Wild materials carry their own and are left untouched.
 * @param {any} m material definition
 * @param {string} seed
 */
export function applyProfile(m, seed) {
  const role = roleOf(m.id);
  if (!m.effects) {
    const base = ROLE_EFFECTS[role];
    /** @type {Fx} */
    const fx = {};
    if (base) {
      for (const [k, v] of Object.entries(base)) fx[k] = Math.round(v * jitter(seed, m.id, k, 0.1) * 10) / 10;
    } else if (m.aspects) {
      // unknown role (e.g. a custom material): map the old aspects
      const keys = ['vitality', 'fire', 'arcana', 'strength'];
      m.aspects.forEach((v, i) => { if (v) fx[keys[i]] = v; });
    }
    m.effects = fx;
  }
  if (m.econd === undefined) {
    const el = ROLE_ELECTRIC[role] || [m.form === 'liquid' ? 0.06 : 0.03, 0];
    m.econd = el[0];
    m.charge = el[1];
  }
  return m;
}
