// Ingredient rarity, the species catalog and the ingredient atlases.
import test from 'node:test';
import assert from 'node:assert/strict';
import { SPECIES_DATA } from '../src/materials/species-data.js';
import { RARITIES, RARITY, ARCANE, validateSpecies, splitEffects, seedChance, valueOf, opposed } from '../src/materials/rarity.js';
import { BIOMES, BIOME_BY_ID } from '../src/game/biomes.js';
import { EFFECT_KEYS, NATURAL_EFFECTS, EXOTIC_EFFECTS } from '../src/alchemy/effects.js';
import { validateAtlases } from '../scripts/validate-atlases.mjs';

test('twelve biomes: six natural, six exotic, each with its own dominant effect and creature', () => {
  assert.equal(BIOMES.length, 12);
  assert.equal(BIOMES.filter((b) => b.category === 'natural').length, 6);
  assert.equal(BIOMES.filter((b) => b.category === 'exotic').length, 6);
  assert.equal(BIOME_BY_ID.moonfen.category, 'exotic', 'Moonfen moved to the exotic biomes');
  assert.equal(new Set(BIOMES.map((b) => b.effect)).size, 12);
  assert.equal(new Set(BIOMES.map((b) => b.creature)).size, 12);
  assert.equal(BIOME_BY_ID.forest.effect, 'vitality');
  assert.equal(BIOME_BY_ID.forest.creature, 'fox');
  for (const b of BIOMES) assert.ok(EFFECT_KEYS.includes(b.effect), b.effect);
  for (const b of BIOMES.filter((x) => x.category === 'natural')) assert.ok(NATURAL_EFFECTS.includes(b.effect), `${b.id} has a natural dominant effect`);
  for (const b of BIOMES.filter((x) => x.category === 'exotic')) assert.ok(EXOTIC_EFFECTS.includes(b.effect), `${b.id} has an exotic dominant effect`);
});

test('every species has exactly one fixed, valid rarity and a unique identity', () => {
  assert.equal(SPECIES_DATA.length, 120);
  assert.equal(new Set(SPECIES_DATA.map((s) => s.key)).size, 120);
  assert.equal(new Set(SPECIES_DATA.map((s) => s.name)).size, 120, 'distinct names');
  for (const s of SPECIES_DATA) {
    assert.ok(RARITY[s.rarity], `${s.key} has a known rarity`);
    assert.deepEqual(validateSpecies(s), [], `${s.key} satisfies its tier`);
  }
});

test('rarity follows the magic: purity and strength rise tier by tier', () => {
  for (const s of SPECIES_DATA) {
    const { magnitude, secondaries } = splitEffects(s.fx);
    if (s.rarity === 'common') {
      assert.ok(secondaries.length >= 1 && secondaries.length <= 2);
      assert.ok(secondaries[0].ratio >= 0.3, `${s.key}: a substantial secondary effect`);
    } else if (s.rarity === 'uncommon') {
      assert.ok(secondaries.length >= 1 && secondaries.length <= 2);
      assert.ok(secondaries.every((x) => x.ratio <= 0.26), `${s.key}: weaker secondaries`);
    } else if (s.rarity === 'rare') {
      assert.equal(secondaries.length, 1, `${s.key}: exactly one secondary`);
      assert.ok(secondaries[0].ratio <= 0.08, `${s.key}: a very small one`);
    } else {
      assert.equal(secondaries.length, 0, `${s.key}: perfectly pure`);
    }
    assert.ok(magnitude >= RARITY[s.rarity].dominant[0] && magnitude <= RARITY[s.rarity].dominant[1]);
  }
  // tiers never overlap, and Legendary stands well clear of Unique
  for (let i = 1; i < RARITIES.length; i++) assert.ok(RARITIES[i].dominant[0] > RARITIES[i - 1].dominant[1], `${RARITIES[i].id} starts above ${RARITIES[i - 1].id}`);
  assert.ok(RARITY.legendary.dominant[0] - RARITY.unique.dominant[1] >= 10, 'a meaningful gap above Unique');
});

test('no species carries both halves of an opposed pair', () => {
  for (const s of SPECIES_DATA) {
    const keys = Object.keys(s.fx);
    for (const a of keys) for (const b of keys) assert.ok(a === b || !opposed(a, b), `${s.key}: ${a} and ${b}`);
  }
});

test('each biome has several species per tier and is dominated by its own effect', () => {
  for (const b of BIOMES) {
    const sp = SPECIES_DATA.filter((s) => s.biome === b.id);
    assert.equal(sp.length, 10, b.id);
    const tiers = Object.fromEntries(RARITIES.map((r) => [r.id, sp.filter((s) => s.rarity === r.id).length]));
    assert.ok(tiers.common >= 2 && tiers.uncommon >= 2 && tiers.rare >= 2, `${b.id}: several species in the lower tiers`);
    assert.ok(tiers.unique >= 1 && tiers.legendary >= 1, `${b.id}: a Unique and a Legendary`);
    const own = sp.filter((s) => s.dominant === b.effect).length;
    assert.ok(own >= 7, `${b.id}: ${own}/10 species favour ${b.effect}`);
    for (const s of sp.filter((x) => x.rarity === 'unique' || x.rarity === 'legendary')) assert.equal(s.dominant, b.effect, `${s.key}: the pure tiers carry the biome's own effect`);
  }
  // acidity, death and swiftness stay in the natural ecosystem
  for (const e of ['acidity', 'death', 'swiftness']) assert.ok(SPECIES_DATA.some((s) => s.category === 'natural' && s.dominant === e), `${e} dominates some natural species`);
});

test('Arcane variants: rarer, less fertile, dearer; thresholds follow the biome', () => {
  for (const r of RARITIES) assert.ok(ARCANE.spawnChance[r.id] < 0.5, `${r.id}: Arcane is the exception`);
  assert.ok(ARCANE.spawnChance.legendary < ARCANE.spawnChance.common);
  for (const r of RARITIES) {
    assert.ok(seedChance(r.id, true) < seedChance(r.id, false));
    assert.ok(valueOf(r.id, true) > valueOf(r.id, false));
  }
  assert.deepEqual(RARITIES.map((r) => Math.round(r.seedDrop * 100)), [35, 22, 10, 4, 1]);
  for (const s of SPECIES_DATA) {
    const band = s.arcane.thr < 0 ? ARCANE.coldThreshold : ARCANE.threshold;
    assert.ok(Math.abs(s.arcane.thr) >= band[0] && Math.abs(s.arcane.thr) <= band[1], `${s.key} threshold`);
    assert.equal(Math.sign(s.arcane.thr), BIOME_BY_ID[s.biome].arcaneSign, `${s.key}: its biome's direction`);
  }
});

test('ingredient atlases: every species has its sprites, Arcane sprites, seeds and growth stages, cleanly packed', () => {
  const { errors, stats } = validateAtlases();
  assert.deepEqual(errors.slice(0, 10), []);
  assert.equal(stats.species, 120);
  assert.ok(stats.atlases >= 6, 'several atlases, not one');
  assert.equal(stats.frames, 120 * 12);
});
