# Gameplay refactor report

The gameplay-purpose refactor (v2.3): what changed, what it rests on, how
it was verified, and what remains. The audit that drove it is
`docs/GAMEPLAY_PURPOSE_AUDIT.md`; the resulting design is
`docs/GAMEPLAY_ARCHITECTURE.md`. Every number below comes from a run that
was actually executed; the command is given with each.

## 1. In one table

| | Before (v2.2, `main`) | After (v2.3) |
|---|---|---|
| Equipment | 38 items (6 starting, 32 for sale) | 23 items (7 starting, 16 for sale), each naming the mechanics it serves |
| What customers can ask | Effects, purity, quantity, serving temperature, colour, density, stability, volatility (viscosity and charge in old orders) | Effects, purity, quantity, serving temperature |
| Techniques | 6: true colour, serving temperature, well mixed, density, heady tincture, boiled down | 2: serving temperature, strong and compact |
| Most common technique requirement | Colour (97 of 204 technique sales) and density (54) | — (no arbitrary physical target exists) |
| Order-strip meters gated behind instruments | Density, stability, volatility, viscosity, charge | None |
| Requirement kinds scored by `evaluatePotion` | 8 (colour, density, viscosity, temperature, stability, volatility, charge, effects/purity) | 3 (temperature, effects, purity) + quantity |
| Recipe matching | Ingredient amounts + hottest/coldest hold | Formulation, procedure (stages, preparation, boil-downs, stirring, serving) and reproduction, kept apart |
| Evidence shown for a zero reading | "✓ 0", "No effect seen" | "not detected (≤ x %)", and against an order ✓ met / ✗ missed / ~ not settled |
| Automated player's knowledge | Read hidden arcane thresholds and reaction windows | Lore, its own journal, the arcanometer, its trials |
| Physics demonstrations in the campaign | Skimmer, alembic, heat map, exact density/viscosity/stability/volatility/charge readings for sale | Free Experiment only |
| Cold extraction | Planned at 7 °C whatever the equipment; narrow windows never | Planned only where the equipment holds the brew (basin ≈ 9 °C, frost rune ≥ 3 °C) |

## 2. Features removed

* **Commission targets** for colour, density, stability and volatility
  (and the dormant viscosity and charge branches), with their scoring code,
  the order-strip meters and the instrument gating.
* **Techniques** "true colour", "well mixed", "density" and "a heady
  tincture", with the predictor's and the autobrewer's "late addition"
  stage that only the tincture used.
* **Equipment:** Glass Hydrometer, Falling-Ball Viscometer, Assay Kit,
  Galvanometer (instruments for removed targets); Bellows & Coal and
  Athanor Furnace (the hearth reaches every steep and boil; hotter fires
  burn lamp oil away); Oak Shelves and Cellar Racks (every shop now
  stores 2.5 L per reagent).
* **From the campaign, kept in the Free Experiment:** the Brass Skimmer,
  the Copper Alembic and its receiver (jar return removed), the Thermal
  Monocle's heat map, the exact physical readings.
* **Dead code:** `showResult` (a result screen no longer reachable), the
  non-effect branch of the guild advice, `logOp`/`recoverSkimmed`, the
  "Spirit Catcher" achievement (alembic only), `STYLE_NOUN`'s prepared-
  reagent styles, `PHYSICAL_KEYS`/`PROPERTY_KEYS`/`VISCOSITY_CLASSES`,
  `INSTRUMENT_FOR`, `predictedVolatility`, `readable()`.

## 3. Features consolidated

* **Granite Pestle** joins the starting kit (it and the mortar prepare
  herbs identically; the pestle also crushes in the pot and frozen
  blocks). Owners are refunded 35 coins.
* **Trowel, Rock Hammer, Badger Brush, Silver Sickle → Forager's Kit**
  (60 coins, Apprentice): one item for full harvests of everything that is
  not simply picked. Owners receive the kit; anything paid beyond its
  price is refunded.
* **Aether Lens → Arcanometer** (200 coins, now from Journeyman): the
  probe shows the aura of strong magic and reads the arcane threshold.
  Lens owners receive the arcanometer (or 140 coins if they owned both).
* **"Boiled down" (volatility ceiling) → "strong and compact"**: the
  customer asks for the strength, not a proxy; boiling down, more herb or
  awakening all meet it.

## 4. Retained purely for immersion

Density and layering, viscosity, pastes and doughs, electric charge and
sparks, freezing and melting, vapour and condensation, fire, glow and
bubbles: all still simulated and visible in the campaign, none asked for,
scored or sold. Their numbers, the skimmer, the alembic and the heat map
are in the Free Experiment, which also keeps the old furnace's heat.

## 5. Mechanics strengthened

* **Cold extraction** is now planned where it is physically achievable and
  explained: the basin holds about 9 °C (enough for Frostcap in most
  worlds), the frost rune the narrow windows; a frozen brew extracts less.
* **Heat damage** (Heartpetal wilting) named, explained and covered by
  the "keep delicate herbs cool" lore in the player's knowledge.
* **Concentration** asked for as an outcome ("strong and compact").
* **Mixing** matters through its real consequences — dissolution, contact
  and batch consistency (bottles that drift from their batch's trials lose
  the shared evidence) — instead of a stability number.
* **Recipes** distinguish formulation, procedure and reproduction; the
  homunculus replays boil-downs; approximate recipes say why.
* **Experimental integrity:** undetected is not absent; requirements read
  as met, missed or unsettled against the trials' margin; the automated
  player plays on public knowledge.

## 6. Equipment retained and its demonstrated purpose

See `docs/GAMEPLAY_ARCHITECTURE.md` §5 for the full table and
`docs/GAMEPLAY_PURPOSE_AUDIT.md` §2 for the measurements: the hearth
reaches every steep and boil; the basin holds ~9 °C (Frostcap ×2.5–3);
the frost rune −14 °C (narrow windows, Moonfen awakenings); the glacial
sigil −48 °C; mortar and pestle 0 → 7 % vitality; the clockwork stirrer
evens a brew in 6 s that the hand spoon needs 20 s for; the arcanometer
reads thresholds; larger cauldrons and shelves serve batches; the
homunculus reproduces procedures; the kennel, warren and still serve
trials; the charter brings contracts.

RESULTS_PLACEHOLDER
