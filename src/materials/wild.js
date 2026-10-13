// Wild raw ingredients, their per-world reactions and the world's hidden
// resonance laws.
//
// Wild materials are gathered (or, for common ones, bought at a premium from
// the herbalist). Most are supplied *whole* — a rigid root, leaf bundle,
// mushroom or stone that the pestle (in the cauldron) or the mortar (before
// pouring) must break into powder before anything can dissolve. Their
// effects reach a potion only through extraction (see alchemy/effects.js).
//
// Everything here is generated from separate RNG streams ("wild:", "laws:")
// so adding it never changes the reagents an existing seed already had.

import { Rng } from '../core/rng.js';
import { hslToRgb } from '../core/color.js';
import { completeMaterial } from './schema.js';
import { EFFECT_INDEX } from '../alchemy/effects.js';

/** @typedef {import('./schema.js').MaterialDef} MaterialDef */

/**
 * Wild archetypes. `shape` is the sprite, `region` where it grows, `rank` the
 * guild rank needed to reach its deposits, `buy` the herbalist's market tier
 * (null = gather only).
 */
export const WILD_SPECS = [
  // Whisperwood (forest)
  { key: 'ironroot', noun: 'Ironroot', shape: 'root', region: 'forest', rank: 0, buy: 1, hue: [28, 0.45, 0.42], form: 'solid', density: 1.05, hardness: 0.5, sol: 0.12, solT: 0.0022,
    fx: { strength: 72, acidity: 6 }, price: 9, lore: 'A knotted woodland root that carries strength. Crush or grind it; it gives up far more when steeped in hot water.' },
  { key: 'silverleaf', noun: 'Silverleaf', shape: 'leaf', region: 'forest', rank: 0, buy: 1, hue: [150, 0.25, 0.7], form: 'solid', density: 0.72, hardness: 0.22, sol: 0.18, solT: 0.0015,
    fx: { vitality: 66, frost: 8 }, price: 9, lore: 'Soft silvery leaves prized by healers. Grind them into water; gentle warmth draws out their healing.' },
  { key: 'nightshade', noun: 'Nightshade', shape: 'leaf', region: 'forest', rank: 0, buy: null, hue: [285, 0.45, 0.42], form: 'solid', density: 1.12, hardness: 0.25, sol: 0.16, solT: 0.001, compat: [0.55, 0.22],
    fx: { toxicity: 70, death: 32, acidity: 12 }, price: 12, lore: 'A poisonous leaf. Its oily extract dissolves in spirits rather than water. Test tiny doses before you trust it.' },
  { key: 'mandrake', noun: 'Mandrake', shape: 'root', region: 'forest', rank: 2, buy: null, hue: [38, 0.5, 0.6], form: 'solid', density: 1.15, hardness: 0.45, sol: 0.12, solT: 0.0015, rare: true,
    fx: { transformation: 78, strength: 28, toxicity: 10 }, price: 30, lore: 'A rare screaming root of transformation. Old grimoires say it wakes fully only in warm spirits.' },
  // Sunlit Meadow
  { key: 'heartpetal', noun: 'Heartpetal', shape: 'petal', region: 'meadow', rank: 0, buy: 1, hue: [335, 0.6, 0.72], form: 'solid', density: 0.6, hardness: 0.15, sol: 0.2, solT: 0.001,
    fx: { love: 74, vitality: 10, acidity: 8 }, price: 10, lore: 'Soft meadow petals carrying affection. Delicate: strong heat spoils them.' },
  { key: 'sunthistle', noun: 'Sunthistle', shape: 'flower', region: 'meadow', rank: 0, buy: 1, hue: [45, 0.8, 0.55], form: 'solid', density: 0.8, hardness: 0.3, sol: 0.15, solT: 0.0015,
    fx: { fire: 38, vitality: 18, strength: 6 }, price: 9, lore: 'A prickly golden flower that warms the blood.' },
  { key: 'dreamclover', noun: 'Dreamclover', shape: 'clover', region: 'meadow', rank: 1, buy: null, hue: [205, 0.45, 0.62], form: 'solid', density: 0.7, hardness: 0.18, sol: 0.16, solT: 0.0012, rare: true,
    fx: { arcana: 34, love: 14, transformation: 8 }, price: 18, lore: 'A rare blue clover that brings vivid dreams and clear insight.' },
  // Willow Riverbank
  { key: 'riverchalk', noun: 'River Chalk', shape: 'stone', region: 'river', rank: 0, buy: 1, hue: [48, 0.22, 0.82], form: 'solid', density: 1.32, hardness: 0.35, sol: 0.06, solT: 0.0005, binder: 0.55, friction: 0.7,
    fx: { acidity: -55, strength: 10, frost: 6 }, price: 6, lore: 'Soft alkaline chalk from the bank. It neutralises acids. A little water and stirring knead it into a paste.' },
  { key: 'frostcap', noun: 'Frostcap', shape: 'cap', region: 'river', rank: 0, buy: 1, hue: [196, 0.5, 0.72], form: 'solid', density: 0.95, hardness: 0.25, sol: 0.17, solT: 0.0012,
    fx: { frost: 68, transformation: 18 }, price: 10, lore: 'A cool mushroom growing beneath the willows. Its essence freezes and subtly changes things.' },
  { key: 'bogbean', noun: 'Bogbean', shape: 'bean', region: 'river', rank: 0, buy: null, hue: [95, 0.4, 0.42], form: 'solid', density: 1.0, hardness: 0.3, sol: 0.2, solT: 0.0015,
    fx: { vitality: 30, toxicity: 14 }, price: 7, lore: 'A marsh bean: restorative, though a little poisonous unless something cancels its bite.' },
  // Ironstone Quarry (minerals)
  { key: 'emberflint', noun: 'Ember Flint', shape: 'stone', region: 'quarry', rank: 0, buy: 1, hue: [16, 0.62, 0.55], form: 'solid', density: 1.6, hardness: 0.7, sol: 0.05, solT: 0.003,
    fx: { fire: 72, acidity: 34, strength: 10 }, price: 11, lore: 'A warm flint that releases fire when ground. It barely dissolves unless the water is hot.' },
  { key: 'mica', noun: 'Mica Dust', shape: 'powder', region: 'quarry', rank: 0, buy: 1, hue: [270, 0.25, 0.75], form: 'powder', density: 1.22, hardness: 0.3, sol: 0.05, solT: 0.001, binder: 0.6, friction: 0.66,
    fx: { transformation: 26, love: 10, arcana: 6 }, price: 7, lore: 'Naturally loose glittering grains. Knead with a little water for dough; plenty of water makes a shimmering infusion.' },
  { key: 'sulfur', noun: 'Sulphur Crust', shape: 'powder', region: 'quarry', rank: 1, buy: 2, hue: [56, 0.85, 0.6], form: 'powder', density: 1.4, hardness: 0.3, sol: 0.22, solT: 0.0015, friction: 0.6,
    fx: { acidity: 68, fire: 22, toxicity: 14 }, price: 10, lore: 'A crumbly yellow crust. Strongly acidic, it etches stone and stings flesh.' },
  { key: 'stormglass', noun: 'Storm Glass', shape: 'crystal', region: 'quarry', rank: 2, buy: null, hue: [222, 0.55, 0.7], form: 'solid', density: 1.9, hardness: 0.65, sol: 0.08, solT: 0.0015, rare: true,
    fx: { arcana: 22, transformation: 12 }, econd: 0.6, charge: 1, glow: 0.3, price: 28, lore: 'Glass struck by lightning. It still holds a charge that flows into anything that conducts.' },
  // Moonfen (magical bog, guild rank 2)
  { key: 'gravemoss', noun: 'Grave Moss', shape: 'moss', region: 'moonfen', rank: 2, buy: null, hue: [150, 0.12, 0.45], form: 'solid', density: 0.85, hardness: 0.2, sol: 0.16, solT: 0.0012,
    fx: { death: 84, frost: 18, toxicity: 44 }, price: 26, lore: 'Moss from old barrows, heavy with death magic. Dilute generously and test carefully.' },
  { key: 'starquartz', noun: 'Star Quartz', shape: 'crystal', region: 'moonfen', rank: 2, buy: null, hue: [280, 0.45, 0.78], form: 'solid', density: 1.5, hardness: 0.65, sol: 0.1, solT: 0.002, glow: 0.5,
    fx: { arcana: 52, love: 36, transformation: 24 }, price: 30, lore: 'A luminous crystal of love and insight. Crush it, then warm it in spirits.' },
  { key: 'wisplichen', noun: 'Wisp Lichen', shape: 'moss', region: 'moonfen', rank: 2, buy: null, hue: [172, 0.6, 0.6], form: 'solid', density: 0.7, hardness: 0.15, sol: 0.18, solT: 0.001, glow: 0.7,
    fx: { arcana: 58, transformation: 18 }, price: 24, lore: 'A faintly glowing lichen that the wisps feed on.' },
  // Ember Crags (volcanic, guild rank 3)
  { key: 'dragonpepper', noun: 'Dragon Pepper', shape: 'pepper', region: 'crags', rank: 3, buy: null, hue: [4, 0.8, 0.5], form: 'solid', density: 0.9, hardness: 0.3, sol: 0.18, solT: 0.0015,
    fx: { fire: 84, strength: 36, toxicity: 6 }, price: 32, lore: 'A furious red pepper from the crags. Its fire loves oil.' },
  { key: 'cinderscale', noun: 'Cinder Scale', shape: 'scale', region: 'crags', rank: 3, buy: null, hue: [24, 0.7, 0.4], form: 'solid', density: 1.45, hardness: 0.6, sol: 0.07, solT: 0.003, rare: true,
    fx: { fire: 48, transformation: 42, vitality: 12 }, econd: 0.3, charge: 0.4, price: 40, lore: 'A shed salamander scale, warm to the touch. Only fierce heat dissolves it.' },
];

/** @type {Record<string, typeof WILD_SPECS[number]>} */
export const WILD_BY_KEY = Object.fromEntries(WILD_SPECS.map((s) => [s.key, s]));

const PREFIX = ['Moss', 'Moon', 'Dusk', 'Ember', 'Witch', 'Frost', 'Star', 'Thorn', 'Dew', 'Raven', 'Old', 'Hollow'];

const r2 = (v) => Math.round(v * 100) / 100;

/**
 * Generate this world's wild materials, their reactions and the resonance laws.
 * @param {string} seed
 * @param {{materials: MaterialDef[], roles: Record<string,string>}} base existing world (water/spirit/oil ids)
 */
export function generateWild(seed, base) {
  const rng = new Rng('wild:' + seed);
  const used = new Set(base.materials.map((m) => m.name));
  /** @type {MaterialDef[]} */
  const materials = [];
  /** @type {Record<string, string>} */
  const ids = {};
  for (const s of WILD_SPECS) {
    const id = 'wild-' + s.key;
    const [h, sat, l] = s.hue;
    const color = hslToRgb((h + rng.range(-8, 8) + 360) % 360, Math.min(1, sat * rng.range(0.9, 1.1)), Math.min(0.92, l * rng.range(0.94, 1.06)));
    let name = '';
    const prefixes = PREFIX.filter((w) => !s.noun.includes(w));
    for (let tries = 0; tries < 12 && (!name || used.has(name)); tries++) name = `${rng.pick(prefixes)} ${s.noun}`;
    if (used.has(name)) name = s.noun;
    used.add(name);
    /** @type {Record<string, number>} */
    const fx = {};
    for (const [k, v] of Object.entries(s.fx)) fx[k] = Math.round(v * rng.range(0.9, 1.1) * 10) / 10;
    const m = completeMaterial({
      id, name, archetype: 'wild', form: /** @type {any} */ (s.form), color, tint: 0.75, opacity: 1,
      density: r2(s.density * rng.range(0.97, 1.03)), compat: s.compat ? s.compat.slice() : [r2(rng.range(0.8, 0.84)), r2(rng.range(0.12, 0.16))],
      friction: s.friction ?? r2(rng.range(0.62, 0.72)), binder: s.binder ?? 0, hardness: s.hardness,
      solubility: r2(s.sol * rng.range(0.9, 1.1)), solubilityTemp: s.solT, melt: 1500, boil: Infinity,
      heatCapacity: 1.7, conductivity: 0.35, flammability: s.region === 'quarry' ? 0 : 0.45, ignition: Math.round(rng.range(260, 320)), combustionHeat: 500,
      ash: base.roles.soot, smoke: base.roles.smoke, glow: s.glow || 0, reactivity: 0.3,
      price: s.price, tier: s.buy === null ? 99 : s.buy, product: false, description: s.lore,
    });
    const mm = /** @type {any} */ (m);
    mm.effects = fx;
    mm.econd = s.econd ?? 0.04;
    mm.charge = s.charge ?? 0;
    mm.wild = { key: s.key, shape: s.shape, region: s.region, rank: s.rank, rare: !!s.rare, gatherOnly: s.buy === null };
    if (s.form === 'solid') mm.crushable = true;
    materials.push(m);
    ids[s.key] = id;
  }

  // ---- reactions of wild ingredients (they start where the reagents meet)
  /** @type {import('../reactions/reactions.js').ReactionRule[]} */
  const reactions = [];
  const t5 = (lo, hi) => Math.round(rng.range(lo, hi) / 5) * 5;
  const product = (key, from, props) => {
    const src = materials.find((m) => m.id === ids[from]);
    const m = completeMaterial({
      id: 'wild-p-' + key, archetype: 'product', tint: 0.85, opacity: 0.85, heatCapacity: 3.6, boil: Infinity, melt: -20,
      viscosity: 2.5, compat: src.compat.slice(), price: 0, tier: 99, product: true, density: src.density,
      form: 'liquid', color: src.color.map((c) => r2(c * 0.85)), ...props,
    });
    /** @type {any} */ (m).econd = 0.12;
    /** @type {any} */ (m).charge = 0;
    materials.push(m);
    return m;
  };
  const water = base.roles.water, spirit = base.roles.spirit, oil = base.roles.oil;
  const nm = (k) => materials.find((m) => m.id === ids[k]).name;

  // steeping: hot water turns ground root/leaf into a true liquid extract
  const steepedRoot = product('steeped-ironroot', 'ironroot', { name: `Steeped ${nm('ironroot')}`, description: 'A dark root extract: all of the root’s strength, fully in solution.' });
  /** @type {any} */ (steepedRoot).effects = { strength: 74, acidity: 4 };
  reactions.push({ id: 'rw_steep_root', name: steepedRoot.name, kind: 'decompose', a: ids.ironroot, b: null, ra: 1, rb: 0, products: [{ id: steepedRoot.id, frac: 1 }],
    minT: t5(60, 70), maxT: 160, rate: 0.09, heat: -5, stir: 0.3, wet: true, hint: `Ground ${nm('ironroot')} steeps into a liquid extract in hot water.` });
  const infusion = product('silver-infusion', 'silverleaf', { name: `${nm('silverleaf')} Infusion`, description: 'A pale, fragrant healing infusion.' });
  /** @type {any} */ (infusion).effects = { vitality: 70, frost: 6 };
  reactions.push({ id: 'rw_infuse_leaf', name: infusion.name, kind: 'decompose', a: ids.silverleaf, b: null, ra: 1, rb: 0, products: [{ id: infusion.id, frac: 1 }],
    minT: t5(45, 55), maxT: t5(85, 95), rate: 0.1, heat: -5, stir: 0.3, wet: true, hint: `${nm('silverleaf')} infuses in warm (not boiling) water.` });
  // heat spoils delicate petals into something bitter
  const wilted = product('wilted-petal', 'heartpetal', { name: `Wilted ${nm('heartpetal')}`, color: [0.45, 0.32, 0.3], description: 'Scorched petals: the love is gone and bitterness remains.' });
  /** @type {any} */ (wilted).effects = { love: 14, toxicity: 22 };
  reactions.push({ id: 'rw_wilt_petal', name: wilted.name, kind: 'decompose', a: ids.heartpetal, b: null, ra: 1, rb: 0, products: [{ id: wilted.id, frac: 1 }],
    minT: t5(78, 88), maxT: 400, rate: 0.12, heat: 0, stir: 0.2, hint: `Strong heat spoils ${nm('heartpetal')}.` });
  // warm spirit wakes mandrake and quartz
  const mandrakeT = product('mandrake-tincture', 'mandrake', { name: `${nm('mandrake')} Tincture`, compat: [0.62, 0.16], description: 'The waking root dissolved in warm spirit.' });
  /** @type {any} */ (mandrakeT).effects = { transformation: 92, strength: 20 };
  reactions.push({ id: 'rw_mandrake', name: mandrakeT.name, kind: 'mix', a: ids.mandrake, b: spirit, ra: 1, rb: 2, products: [{ id: mandrakeT.id, frac: 1 }],
    minT: t5(35, 45), maxT: t5(70, 75), rate: 0.25, heat: 10, stir: 0.8, hint: `${nm('mandrake')} wakes in warm spirit.` });
  const starT = product('starlit-tincture', 'starquartz', { name: `Starlit ${nm('starquartz').split(' ').slice(-1)[0]} Tincture`, compat: [0.62, 0.16], glow: 0.7, description: 'Crushed quartz dissolved in warm spirit; it glimmers.' });
  /** @type {any} */ (starT).effects = { arcana: 68, love: 34, transformation: 14 };
  reactions.push({ id: 'rw_starquartz', name: starT.name, kind: 'mix', a: ids.starquartz, b: spirit, ra: 1, rb: 2, products: [{ id: starT.id, frac: 1 }],
    minT: t5(35, 45), maxT: t5(70, 80), rate: 0.25, heat: 8, stir: 0.8, hint: `Crushed ${nm('starquartz')} dissolves in warm spirit.` });
  // fire loves oil
  const dragonOil = product('dragonfire-oil', 'dragonpepper', { name: 'Dragonfire Oil', compat: [0.16, 0.11], color: [0.85, 0.25, 0.08], flammability: 0.7, ignition: 240, combustionHeat: 900,
    ash: base.roles.soot, smoke: base.roles.smoke, description: 'Pepper fire carried in oil.' });
  /** @type {any} */ (dragonOil).effects = { fire: 92, strength: 30 };
  reactions.push({ id: 'rw_dragonoil', name: dragonOil.name, kind: 'contact', a: ids.dragonpepper, b: oil, ra: 1, rb: 1, products: [{ id: dragonOil.id, frac: 1 }],
    minT: t5(30, 40), maxT: 220, rate: 0.4, heat: 20, stir: 1, hint: `Ground ${nm('dragonpepper')} pours its fire into warm oil.` });
  // acid meets alkali: neutral gypsum and heat
  const gypsum = product('gypsum', 'riverchalk', { name: 'Gypsum Grit', form: 'powder', color: [0.9, 0.88, 0.82], friction: 0.68, solubility: 0.02, melt: 1500, viscosity: 1,
    description: 'The neutral grit left where acid met chalk.' });
  /** @type {any} */ (gypsum).effects = { strength: 8 };
  reactions.push({ id: 'rw_neutralise', name: 'Neutralisation', kind: 'contact', a: ids.riverchalk, b: ids.sulfur, ra: 1, rb: 1, products: [{ id: gypsum.id, frac: 1 }],
    minT: -10, maxT: 400, rate: 0.5, heat: 60, stir: 1, wet: true, hint: `${nm('riverchalk')} fizzes where it meets ${nm('sulfur')} and both turn to neutral grit.` });
  // frostcap freezes water into a slush of transformation when chilled
  void water;

  return { materials, reactions, ids, laws: generateLaws(seed) };
}

/** Resonance templates (a acted on, b partner, c product). */
const LAW_TEMPLATES = [
  { id: 'forged', name: 'Forged Vigour', kind: 'catalyse', a: 'strength', b: 'fire', k: [0.45, 0.7], lore: 'A touch of fire tempers strength and makes it stronger.' },
  { id: 'blessed', name: 'Blessed Life', kind: 'catalyse', a: 'vitality', b: 'arcana', k: [0.4, 0.6], lore: 'Arcana amplifies healing.' },
  { id: 'enchant', name: 'Enchantment', kind: 'transmute', a: 'love', b: 'arcana', c: 'transformation', k: [0.5, 0.75], lore: 'Love and arcana together become transformation.' },
  { id: 'venom', name: 'Burning Venom', kind: 'transmute', a: 'toxicity', b: 'fire', c: 'death', k: [0.45, 0.65], lore: 'Fire turns poison into death.' },
  { id: 'bitter', name: 'Bitter Heart', kind: 'suppress', a: 'love', b: 'toxicity', k: [1.0, 1.5], lore: 'Poison sours love.' },
  { id: 'quicken', name: 'Quickening', kind: 'transmute', a: 'vitality', b: 'transformation', c: 'strength', k: [0.45, 0.6], lore: 'Life and change together build strength.' },
  { id: 'glacial', name: 'Glacial Insight', kind: 'catalyse', a: 'arcana', b: 'frost', k: [0.35, 0.55], lore: 'Cold sharpens arcane insight.' },
  { id: 'corrode', name: 'Corroding Change', kind: 'transmute', a: 'acidity', b: 'strength', c: 'transformation', k: [0.4, 0.55], lore: 'Acid gnaws strength into change.' },
  { id: 'heartfire', name: 'Heartfire', kind: 'transmute', a: 'love', b: 'fire', c: 'vitality', k: [0.45, 0.6], lore: 'Passion’s warmth becomes life.' },
  { id: 'gravechill', name: 'Grave Chill', kind: 'catalyse', a: 'death', b: 'frost', k: [0.4, 0.6], lore: 'Cold feeds death.' },
  { id: 'dulling', name: 'Dulling', kind: 'suppress', a: 'arcana', b: 'toxicity', k: [0.7, 1.0], lore: 'Poison clouds arcane potency.' },
  { id: 'wildgrowth', name: 'Wild Growth', kind: 'catalyse', a: 'transformation', b: 'vitality', k: [0.35, 0.55], lore: 'Life drives change wild.' },
  { id: 'kindling', name: 'Kindling', kind: 'catalyse', a: 'fire', b: 'acidity', k: [0.3, 0.45], lore: 'Acid feeds the flame.' },
];

/**
 * Pick this world's resonance laws. Each world has six, on distinct effect
 * pairs, with jittered strengths and thresholds.
 * @param {string} seed
 * @returns {import('../alchemy/effects.js').Resonance[]}
 */
export function generateLaws(seed) {
  const rng = new Rng('laws:' + seed);
  const pool = rng.shuffle(LAW_TEMPLATES);
  const out = [];
  const pairs = new Set();
  for (const t of pool) {
    if (out.length >= 6) break;
    const key = [t.a, t.b].sort().join('+');
    if (pairs.has(key)) continue;
    pairs.add(key);
    out.push({
      id: t.id, name: t.name, kind: /** @type {any} */ (t.kind),
      a: EFFECT_INDEX[t.a], b: EFFECT_INDEX[t.b], c: t.c ? EFFECT_INDEX[t.c] : -1,
      k: Math.round(rng.range(t.k[0], t.k[1]) * 100) / 100,
      min: Math.round(rng.range(2, 4.5) * 10) / 10,
      lore: t.lore,
    });
  }
  return out;
}
