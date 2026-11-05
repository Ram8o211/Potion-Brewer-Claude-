// Ingredient rarity: five fixed tiers and the Arcane layer on top of them.
//
// Rarity is a permanent property of a *species* (Silverleaf is Common,
// Heartwood Mandrake Rare, Everburning Sunheart Legendary), never of a
// specimen, and it follows from the species' magic rather than from its
// price or how often it grows:
//
//   • dominant magnitude — how strong its principal effect is;
//   • purity             — how small its secondary effects are next to it.
//
// The constraints below are explicit and checked (validateSpecies), both by
// the catalog generator (scripts/build-catalog.mjs) and by the tests, so an
// invalid ingredient can never be produced. Magnitudes are on the game's
// 0..100 potency scale of the pure material (alchemy/effects.js): everyday
// orders want about 8–15 % in the bottle, the brew's saturation knee is 40.
//
// Arcane is not a sixth tier. Every species has an Arcane variant of the
// same rarity and the same magic; what it adds is access to the arcane
// transition (alchemy/arcane.js). Arcane variants are always rarer than
// their ordinary form, drop seeds less often and sell for more.

/**
 * @typedef {'common'|'uncommon'|'rare'|'unique'|'legendary'} RarityId
 * @typedef {Object} RarityDef
 * @property {RarityId} id
 * @property {string} label
 * @property {number} rank                 0 (Common) … 4 (Legendary)
 * @property {[number, number]} dominant   inclusive range of the dominant effect's magnitude
 * @property {[number, number]} secondaries permitted number of secondary effects
 * @property {[number, number]} ratio      permitted range of (each) secondary / dominant; the strongest secondary must reach ratio[0]
 * @property {number} spawnWeight          relative weight of the tier in a biome's population
 * @property {number} presence             chance a species of this tier grows at all in one generation of its biome
 * @property {[number, number]} specimens  specimens of a chosen species in one population
 * @property {number} seedDrop             chance a harvest drops a seed (ordinary form)
 * @property {number} value                selling-value multiplier
 * @property {string} visual               design classification of its sprites
 * @property {number} growHours            garden hours from seed to harvest (well watered)
 * @property {string} color                badge colour
 * @property {string} [requires]           growth requirement in the garden (beyond its plot kind)
 */

/** @type {RarityDef[]} */
export const RARITIES = [
  { id: 'common', presence: 0.95, label: 'Common', rank: 0, dominant: [18, 26], secondaries: [1, 2], ratio: [0.3, 0.62], spawnWeight: 10, specimens: [2, 3],
    seedDrop: 0.35, value: 1, visual: 'simple natural structure', growHours: 0.75, color: '#c9c3b8' },
  { id: 'uncommon', presence: 0.7, label: 'Uncommon', rank: 1, dominant: [28, 38], secondaries: [1, 2], ratio: [0.08, 0.26], spawnWeight: 5, specimens: [1, 2],
    seedDrop: 0.22, value: 1.8, visual: 'distinctive morphology', growHours: 1.5, color: '#6fd06a' },
  { id: 'rare', presence: 0.4, label: 'Rare', rank: 2, dominant: [40, 52], secondaries: [1, 1], ratio: [0.02, 0.08], spawnWeight: 2.2, specimens: [1, 2],
    seedDrop: 0.1, value: 3.5, visual: 'complex, unusual structure', growHours: 3, color: '#5aa8ff' },
  { id: 'unique', presence: 0.12, label: 'Unique', rank: 3, dominant: [56, 68], secondaries: [0, 0], ratio: [0, 0], spawnWeight: 0.6, specimens: [1, 1],
    seedDrop: 0.04, value: 8, visual: 'singular, striking anatomy', growHours: 6, color: '#c27aff', requires: 'an upgraded plot' },
  { id: 'legendary', presence: 0.03, label: 'Legendary', rank: 4, dominant: [84, 98], secondaries: [0, 0], ratio: [0, 0], spawnWeight: 0.12, specimens: [1, 1],
    seedDrop: 0.01, value: 20, visual: 'exceptional detail, unmistakable silhouette', growHours: 12, color: '#ffb340', requires: 'an Arcane cultivation chamber' },
];

/** @type {Record<RarityId, RarityDef>} */
export const RARITY = /** @type {any} */ (Object.fromEntries(RARITIES.map((r) => [r.id, r])));
export const RARITY_IDS = /** @type {RarityId[]} */ (RARITIES.map((r) => r.id));

/** The Arcane layer: how much rarer, how much less fertile, how much dearer than the ordinary form. */
export const ARCANE = Object.freeze({
  /** chance a specimen of a chosen species grows as its Arcane form, by tier (always well under its ordinary form) */
  spawnChance: Object.freeze({ common: 0.1, uncommon: 0.08, rare: 0.06, unique: 0.04, legendary: 0.02 }),
  /** seed-drop multiplier for an Arcane harvest */
  seedFactor: 0.35,
  /** selling-value multiplier on top of the tier's */
  value: 2.2,
  /** awakening gain range (effects × gain past the threshold) */
  gain: /** @type {[number, number]} */ ([2.5, 3]),
  /** activation threshold range on the −1000…+1000 scale (T = 20 °C + 0.1·thr): heat awakens 45–85 °C, below the boil */
  threshold: /** @type {[number, number]} */ ([250, 650]),
  /** cold awakening: −60…−300, i.e. 14 °C down to −10 °C, within the reach of the basin and the frost rune */
  coldThreshold: /** @type {[number, number]} */ ([60, 300]),
});

/** Effect pairs that cancel in a brew: a species never carries both halves (nor a secondary opposing its dominant). */
export const OPPOSED = [['fire', 'frost'], ['vitality', 'death'], ['vitality', 'toxicity'], ['levitation', 'strength'], ['temporal', 'phasing']];

/** @param {string} a @param {string} b */
export const opposed = (a, b) => OPPOSED.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

/**
 * The dominant effect of a species and its secondaries, strongest first.
 * @param {Record<string, number>} fx
 */
export function splitEffects(fx) {
  const list = Object.entries(fx).filter(([, v]) => Math.abs(v) > 0).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const [dom, ...sec] = list;
  return { dominant: dom ? dom[0] : null, magnitude: dom ? Math.abs(dom[1]) : 0, secondaries: sec.map(([k, v]) => ({ key: k, v: Math.abs(v), ratio: dom ? Math.abs(v) / Math.abs(dom[1]) : 0 })) };
}

/**
 * Check a species against its tier's constraints. Returns a list of
 * problems (empty when valid).
 * @param {{key:string, rarity:string, fx:Record<string, number>}} s
 */
export function validateSpecies(s) {
  const r = RARITY[/** @type {RarityId} */ (s.rarity)];
  if (!r) return [`${s.key}: unknown rarity ${s.rarity}`];
  const out = [];
  const { magnitude, secondaries } = splitEffects(s.fx);
  if (magnitude < r.dominant[0] || magnitude > r.dominant[1]) out.push(`${s.key}: dominant ${magnitude} outside ${r.label} range ${r.dominant.join('–')}`);
  if (secondaries.length < r.secondaries[0] || secondaries.length > r.secondaries[1]) out.push(`${s.key}: ${secondaries.length} secondary effects, ${r.label} permits ${r.secondaries.join('–')}`);
  if (secondaries.length) {
    if (secondaries[0].ratio < r.ratio[0]) out.push(`${s.key}: strongest secondary ratio ${secondaries[0].ratio.toFixed(2)} below ${r.ratio[0]}`);
    for (const x of secondaries) if (x.ratio > r.ratio[1] + 1e-9) out.push(`${s.key}: secondary ${x.key} ratio ${x.ratio.toFixed(2)} above ${r.ratio[1]}`);
  }
  const keys = Object.keys(s.fx).filter((k) => s.fx[k]);
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) if (opposed(keys[i], keys[j])) out.push(`${s.key}: carries opposed ${keys[i]} and ${keys[j]}`);
  return out;
}

/** Selling-value multiplier of a specimen. @param {string} rarity @param {boolean} arcane */
export function valueOf(rarity, arcane) {
  const r = RARITY[/** @type {RarityId} */ (rarity)] || RARITY.common;
  return r.value * (arcane ? ARCANE.value : 1);
}

/** Chance one harvest of a specimen drops a seed. @param {string} rarity @param {boolean} arcane */
export function seedChance(rarity, arcane) {
  const r = RARITY[/** @type {RarityId} */ (rarity)] || RARITY.common;
  return r.seedDrop * (arcane ? ARCANE.seedFactor : 1);
}
