# Potion Brewer overhaul — report

This report covers the overhaul brief ("Complete Gameplay, Procedural World,
Ingredient, Art, and Release-Quality Refactor") as implemented on the branch
`claude/happy-lovelace-jhonzz`. It says what was built, how it was checked,
and what is **not** done yet.

Legend: ✔ done and covered by tests or reviewed screenshots · ◐ partly done ·
✘ not done.

## 1. Architecture (§1)

New modules, all data-driven:

| Module | Role |
|---|---|
| `src/game/biomes.js` | The 12 biomes: Natural/Exotic, dominant effect, native creature, minor effects, Arcane direction, interaction, unlock milestone |
| `src/materials/rarity.js` | Five rarity tiers with explicit constraints (magnitude, secondary count and ratio, presence, specimens, seed drop, value, growth time) and the Arcane layer |
| `scripts/build-catalog.mjs` → `src/materials/species-data.js` | The permanent species catalog (generated once, validated, committed) |
| `src/materials/catalog.js` | Catalog materials: ordinary `wild-sp-<key>` and Arcane `wild-sp-<key>-arcane`, extraction reactions |
| `src/game/regen.js` | Biome generations, rarity-weighted populations, Traveller Coins, unlocks |
| `src/game/garden.js` | Plots, seeds, watering, growth, harvests, upgrades |
| `scripts/build-atlases.mjs` → `assets/atlases/*` | The ingredient PNG atlases, metadata and manifest |
| `src/visual/atlas.js` | Runtime atlas frames: synchronous frame table, lazy browser loading, Node decoding |
| `src/visual/env/exotic.js` | Terrain grammars of the five new exotic biomes |
| `src/rendering/exotic-fx.js` | Exotic touch interactions and ambient particles |
| `src/ui/views/garden.js`, `src/ui/rarity-ui.js` | Garden room; rarity and Arcane badges |

Permanent identities and generation instances are kept apart. A species'
identity (name, rarity, effects, Arcane threshold, sprites) is fixed in the
catalog. A biome's *generation* (a number saved per biome) decides that
visit's scenery seed, species mix and specimen counts. Generation is
deterministic from the world seed and the generation number.

## 2. Status by section

| § | Requirement | Status | Notes |
|---|---|---|---|
| 2.1–2.3 | Terrain contours, materials, lighting | ◐ | The existing renderer already had layered strata, inked contours and per-region grades. The new biomes use the same kit. No further rework of the original seven biomes in this round. |
| 3.1 | Six natural biomes, Moonfen → Exotic | ✔ | `biomes.js`; Whisperwood is Vitality with the fox |
| 3.2 | Five new exotic biomes | ✔ | Each has its own grammar, palette, grade, habitat light, props, particles and touch interaction (`exotic.js`, `exotic-fx.js`) |
| 4 | Five rarity tiers, fixed per species | ✔ | `rarity.js` constraints, validated by the generator and `tests/rarity.test.mjs` |
| 5 | Arcane variants; only Arcane ingredients awaken | ✔ | `tests/arcane-catalog.test.mjs` (real simulation) |
| 6 | Personal garden | ✔ | `garden.js`, Garden room, `tests/garden.test.mjs`, browser test |
| 7 | Traveller Coins and regeneration; no wild regrowth or watering | ✔ | `regen.js`, `tests/gathering.test.mjs` |
| 8 | PNG atlases replace procedural ingredient art | ✔ | Nine atlases, 1,440 frames, used in the Wilds, on the shelf, in panels, the garden and the cauldron's pieces |
| 9 | Ingredient ecology | ✔ | 10 species per biome; 8–9 of 10 favour the biome's effect; Acidity, Death and Swiftness stay in natural biomes |
| 10 | 15 effects (Swiftness + 5 exotic) | ◐ | Brewing, extraction, measurement, particles, rabbit responses, saves and customer requests support them. Two light new oppositions (strength ↔ levitation, phasing ↔ temporal). Recipe knowledge needed no change. |
| 11 | 12 native creatures and pens | ✘ | **Not done.** Each biome now holds a single kind: the native fox and salamander, and existing animals standing in for the other ten (`kinds.js` HABITAT). Hare, otter, rock beetle, cave moth, wisp, cloud ray, mimic lizard, shroud moth, axolotl and scarab need anatomy, gaits and pens. The five new channels have no "steady" test animal yet. |
| 12 | Progression | ◐ | Only Whisperwood at start; milestones open the others in order (Natural before Exotic). Garden upgrades and order tiers follow rank. No separate named stage UI for Apprentice → Master. |
| 13 | Requests follow progression | ✔ | Requests are offered only for effects the shop can reach; purity limit by tier (4 % → 1.2 %); new Swiftness, Levitation, Invisibility, Phasing and Temporal requests |
| 14.1 | Immediate orders with patience | ◐ | The existing patron patience and bargaining system is kept. No new visible patience bar was added. |
| 14.2 | Special multi-day commissions | ✘ | **Not done** in this round. |
| 15 | Tutorial redesign | ✔ | Rewritten for steps 1–15: guaranteed Arcane Silverleaf and first seed, accelerated first crop, a real Arcane transition. Skippable per step and replayable. |
| 16 | UI | ◐ | Biome bar (category, dominant effect, creature, specimens left, coins, Regenerate). Rarity, Arcane and seed badges. Garden room. The mobile bottle-button overlap (§16.1) was not re-examined. |
| 17 | Graphics studio | ✘ | The repository has no `src/studio/`. Atlas review is done with `scripts/atlas-preview.mjs` instead. |
| 18 | Performance | ◐ | Atlases load lazily (needed ones before play, growth stages with the garden, the rest in idle time). Exotic effects are bounded. No benchmark comparison was run this round. |
| 19 | Saves | ✔ | Save v7 migration (below) |
| 20 | Tests | ◐ | 247 unit tests pass. Browser specs were updated for the new rules; see §7. |
| 21 | Release preparation | ◐ | See the checklist in §8 |

## 3. Rarity and Arcane specification

| Tier | Dominant | Secondary effects | Strongest secondary ÷ dominant | Presence per generation | Specimens | Seed drop | Value | Grow (h) |
|---|---|---|---|---|---|---|---|---|
| Common | 18–26 | 1–2 | 0.30–0.62 (always cancellable) | 0.95 | 2–3 | 35 % | ×1 | 0.75 |
| Uncommon | 28–38 | 1–2 | 0.08–0.26 | 0.70 | 1–2 | 22 % | ×1.8 | 1.5 |
| Rare | 40–52 | exactly 1 | 0.02–0.08 | 0.40 | 1–2 | 10 % | ×3.5 | 3 |
| Unique | 56–68 | 0 | — | 0.12 | 1 | 4 % | ×8 | 6 |
| Legendary | 84–98 | 0 | — | 0.03 | 1 | 1 % | ×20 | 12 |

Magnitudes are on the game's 0–100 potency scale. Legendary starts 16 above
Unique's ceiling. A species' strongest side effect always sits on a
cancelling pair (fire–frost, life–death, life–poison, acid–alkali,
strength–levitation, phasing–temporal), so impure ingredients can be
purified by mixing. A second side effect is at most a trace (3–5.5 %).

**Arcane layer.**
- Every species has an Arcane form with the same rarity and the same effects.
- Arcane forms are rarer: 10 % / 8 % / 6 % / 4 % / 2 % of specimens by tier.
- They drop seeds at ×0.35 the rate and sell for ×2.2.
- Only Arcane forms carry a threshold:
  - heat: +250 … +650, i.e. 45–85 °C;
  - cold, in the Willow Bank, Moonfen, Veil Hollow and Ghostglass Reef: −60 … −300, i.e. 14 °C down to −10 °C.
- Gain is ×2.5–3.
- In a mixture, the threshold is the volume-weighted mean over the Arcane parts only.
- Awakening converts a species into its own awakened form, so only the effects it carries grow. Effects from ordinary ingredients in the same brew are never amplified.

## 4. Taxonomy

| Biome | Category | Dominant effect | Native creature | Touch interaction |
|---|---|---|---|---|
| Whisperwood | Natural | Vitality | Fox | foliage sways |
| Sunlit Meadow | Natural | Love | Hare | foliage sways |
| Willow Bank | Natural | Frost | River Otter | foliage sways |
| Ironstone Quarry | Natural | Strength | Rock Beetle | foliage sways |
| Netherwood | Natural | Toxicity | Cave Moth | foliage sways |
| Ember Crags | Natural | Fire | Salamander | foliage sways |
| Moonfen | Exotic | Arcana | Will-o'-Wisp | wisp lights ripple |
| Skyshard Archipelago | Exotic | Levitation | Cloud Ray | isles spring back |
| Morphgrove | Exotic | Transformation | Mimic Lizard | blooms change shape |
| Veil Hollow | Exotic | Invisibility | Shroud Moth | mist parts |
| Ghostglass Reef | Exotic | Phasing | Spectral Axolotl | crystals turn clear |
| Chronoglass Wastes | Exotic | Temporal Distortion | Hourglass Scarab | sandfalls reverse, then race |

Effects: Natural — Vitality, Strength, Love, Fire, Frost, Acidity, Toxicity,
Death, Swiftness. Exotic — Arcana, Levitation, Transformation, Invisibility,
Phasing, Temporal Distortion. Channels 10–14 were appended, so old vectors
and saves keep their indices.

The full species table is `src/materials/species-data.js`: 120 species with
name, biome, morphology, rarity, effects and threshold.

## 5. Ingredient atlases

- **Source.** The supplied ingredient sheet (`art/ingredients/source/ingredient-sheet.png`), sliced into 240 cells (10 species × ordinary and Arcane × 12 biomes) by `scripts/slice-ingredient-sheet.py`.
  - Three cells in the sheet's Arcane rows show a different object (Ghostglass slots 2–3, Chronoglass slot 3). Their Arcane sprites are built from the ordinary sprite instead.
- **Pipeline** (`scripts/build-atlases.mjs`, deterministic, no dependencies):
  - hard alpha, stray specks removed, colours snapped to a per-sprite palette, one-pixel ink outline;
  - baked Arcane treatment: violet emissive rim lit from the upper left, a central rune, a vein, sparkles, a light spectral tint — the silhouette is kept;
  - species-specific propagation forms: seed, grain, pip, winged seed, bulb, spore sac, crystal chip, spat shell, polyp;
  - four growth stages per form (seed in its bed, sprout, young, developing), then the mature sprite;
  - shelf packing with 2 px transparent padding.
- **Output** (`assets/atlases/`): nine atlases — natural and exotic flora, natural and exotic fungi and minerals, Arcane natural and exotic, seeds, and growth stages (natural and exotic).
  - Each has JSON metadata per frame: species, kind, rarity, Arcane flag, biome, category, morphology, stage, rectangle, pivot and native size.
  - `manifest.json` lists every species' asset ids, and `src/visual/atlas-frames.js` is the generated frame table.
  - Individual sprites for review are in `art/ingredients/sprites/`.
- **Validation** (`node scripts/validate-atlases.mjs`, also run by the unit tests):
  - every species has all 12 assets and every reference resolves;
  - frames lie inside their atlas, with no overlaps or padding collisions;
  - backgrounds are transparent and alpha is crisp (no anti-aliased edges);
  - metadata agrees with the catalog.
- **One identity everywhere.** The Wilds plant, the shelf jar, the ingredient panel and the garden crop all use the same atlas pixels, and poured pieces are shards of those pixels; an Arcane specimen pours as Arcane shards (`tests/atlas-sprites.test.mjs`). In the Wilds, the detail layer draws the sprite at native resolution and the scene-pixel layer uses a crisp 2×2 downsample.
- **Review sheets:** `docs/screenshots/atlas-ordinary-vs-arcane.png` and `docs/screenshots/atlas-growth-stages.png`.

## 6. Save migration (v6 → v7)

- **Old materials stay.** The 59 old wild archetypes remain in the world as `legacy` materials, so bottled potions, recipes, cauldrons and awakened `~a` brews still resolve.
- **Stores move.** Each legacy stock moves to the catalog species of the same biome with the same main effect (else that biome's first Common), and a journal note lists every move.
- **Legacy awakening.** Legacy ordinary forms can no longer awaken (their profile is marked `legacy`). Brews that already awakened keep their awakened forms.
- **Biomes and new systems.** Regions a veteran's rank had opened stay open. Traveller Coins, biome generations and the garden start fresh.
- **Seed rolls.** Seed drops come from a saved counter, so reloading never rerolls one.

## 7. Tests

- `npm test`: **247 pass, 0 fail**.
  - New: `rarity`, `garden`, `atlas-sprites`, `arcane-catalog`.
  - Rewritten: `gathering` (generations, coins, no regrowth).
  - Commission, trial, purpose and procedural tests were updated where the rules changed. Each change is commented in place: tier purity, request reachability, realistically stocked test shops, overlap measured relative to the larger atlas sprites, the five new channels without a steady kind.
- `npm run typecheck`: no new errors. The three test files with pre-existing type errors (`animal-kinds`, `rabbit-render`, `wild-rabbits`) are unchanged in that respect.
- `npm run build`: OK.
- Browser specs (Playwright) were updated for the new ids, the garden and the removal of wild watering. See the PR description for the run's result.

## 8. Remaining work (honest list)

1. **Native creatures** (§11): ten new species — anatomy, gaits, pens — and steady test animals for the five new channels.
2. **Special multi-day commissions** (§14.2) and a visible patience indicator (§14.1).
3. **Graphics studio** (§17): no `src/studio/` exists in this repository; atlas review is script-based.
4. **Terrain rework of the original seven biomes** (§2.1) beyond what they already had.
5. **Mobile bottle-button overlap** (§16.1): not re-examined.
6. **Benchmarks and real-device testing** (§18, §20): not run in this round.
7. **Balance:** awakening orders are rarer than before, because Rare, Unique and Legendary species reach high targets plainly; Master orders sometimes fall back to milder strengths when a generation lacks the rarest species.
8. **Release packaging** (§21): see `docs/CHECKLIST.md` and `release/`; nothing new was packaged for Steam or Google Play.
