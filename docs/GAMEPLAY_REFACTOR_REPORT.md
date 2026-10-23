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

## 7. Experiments (the physics each mechanic rests on)

`node scripts/experiments.mjs 3` — three worlds, the same cauldron
helpers the player uses (`scripts/lib/experiment.mjs`); results in
`docs/experiment-results.json` (after) and
`docs/experiment-results-before.json` (the retired equipment, measured on
the same physics before it was removed). Values are effect strengths in %.

| Question | Measured | Consequence |
|---|---|---|
| Does grinding matter? | Whole herb 0 → ground 6.9–7.4 | Core: mortar and pestle in the starting kit |
| Does the steep window matter? | Heavy load at room 3.6–3.9 → in window 11.8–12.6; awakening at 95 °C 16.4–17.2 | Core: the hearth and thermometer |
| Can the basin cold-steep? | Frostcap warm 3.4–4.0; basin held at 9 °C 9.5–11.1; frost rune at full cold (frozen) 6.6–7.4; glacial at full cold 4.9–5.8 | Basin plans cold steeps; freezing costs strength; frost rune for narrow windows and Moonfen |
| Does heat damage delicate herbs? | Heartpetal at 95 °C: love 2.6, toxicity 2.6 | Supporting: named and taught |
| Does stirring matter? | Small in a hot steep; cold powders +40 %; clockwork 6 s ≈ spoon 20 s; unstirred bottles drift from their batch | Supporting: the stirrer is a time saver and consistency tool |
| Does boiling down concentrate? | 30 % off → +40 % on every effect | Core: "strong and compact" |
| Does the skimmer separate? | At best a third less of an oil-borne side effect, at the cost of the brew on top | Sandbox only |
| Does the alembic make anything new? | Same potion; distillate 62 % water / 35 % spirit, worth 1.9 coins | Sandbox only |
| Do hotter fires help? | Hearth: 92 °C in 7.4 s, a boil-down in 14 s; bellows/athanor 3.5 s / 2 s, and they burn lamp oil away | Retired (sandbox keeps the old furnace) |

## 8. Playtests

`node scripts/playtest.mjs` with five automated profiles, 20 days × 3
worlds (`docs/playtest-results.json`). The players now know only lore,
their journal, the arcanometer and their trials. Before this branch they
read hidden thresholds, so the numbers below are honest players on a
harder information footing.

| Profile | Sold | Mean quality | Abandoned | Trials / order | Praise / complaints | Reputation (mean) | Ranks reached | Coins (mean) | Shelf sales | Recipe reuse | Max stock (ml) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| beginner | 79 % | 0.77 | 1 | 0.99 | 20 / 52 (50 fair) | 211 | Adept ×3 | 1963 | 0 | 0 | 200 |
| casual | 74 % | 0.77 | 1 | 1.82 | 23 / 68 (64 fair) | 132 | Journeyman, Apprentice, Adept | 1473 | 0 | 0 | 200 |
| careful | 61 % | 0.94 | 84 | 6.27 | 77 / 39 (23 fair) | 401 | Adept, Adept, Expert | 2374 | 0 | 0 | 845 |
| experienced | 62 % | 0.92 | 80 | 3.36 | 64 / 47 (31 fair) | 344 | Adept, Adept, Expert | 2101 | 0 | 72 | 615 |
| efficient | 91 % | 0.82 | 19 | 2.67 | 65 / 95 (80 fair) | 396 | Expert, Adept, Adept | 4004 | 17 | 48 | 540 |

Against the 10-day run on `main` (same profiles and worlds), at day 10:

| Profile | Sold by day 10 | before (share sold) | Reputation, day 10 | before | Coins, day 10 | before |
|---|---|---|---|---|---|---|
| beginner | 20.7 of 30 | 63 % | 86 | 69 | 697 | 545 |
| casual | 19 of 30 | 64 % | 57 | 75 | 604 | 532 |
| careful | 26.3 of 31.7 | 70 % | 236 | 133 | 895 | 283 |
| experienced | 24.3 of 31 | 77 % | 189 | 151 | 913 | 407 |
| efficient | 29.7 of 31.7 | 99 % | 217 | 158 | 635 | 408 |

* **Techniques sold:** serving temperature 122, strong and compact 85.
  Before, colour and density made up 151 of 204.
* **Processes used:** grinding 1399, steeping 1204, awakening 309,
  chilling 197, neutralising 183, dilution 163, recipe replay 120,
  boiling down 101, cold steep 51. Every core mechanic is exercised.
* **Equipment:** everything for sale was bought by some profile except
  the Grand Cauldron (20 days is short for it). No instrument was bought
  and left unused; the stirrer was used 540 times, the shelves 127.
* **Storage:** the most stock any player held of one reagent was 845 ml,
  so the 2.5 L base never bound. The shelf items it replaced sold
  capacity nobody needed.
* **Variety:** 17 potion styles sold; the most common (warming) is 22 %.
* **Evidence at sale:** 504 corroborated, 294 preliminary, 1 certified.
* **Abandonment** is high for the careful and experienced profiles
  (80–84 over three runs). They drop orders they cannot settle with their
  trials rather than sell on preliminary evidence. That is the intended
  honest behaviour; the beginner and casual profiles, who do not test,
  sell more and take more fair complaints.

## 9. Achievability

`node scripts/achievability.mjs` — orders generated for realistic
equipment sets, then brewed by the automated player from the hidden
reference plan: **32 of 32 at quality 1.00** (plain 20/20, serving
temperature 7/7, strong and compact 5/5). No generated order is
unbrewable with the equipment it was generated for.

## 10. Tests

| Check | Result |
|---|---|
| `npm test` (Node unit + integration) | 148 pass, 0 fail, including 12 new tests in `tests/purpose.test.mjs`: mechanics consistency, outcome-only commissions, cold steeps, v5→v6 refit with no double refund, retired-equipment refunds, recipe equivalence, approximate migration, boil-down replay, evidence states, the player's honesty, capabilities, and mechanics making measurable differences |
| `npm run typecheck` | clean (this also fixes 3 type errors already on `main` in `tests/commerce.test.mjs`) |
| Playwright (desktop, phone portrait/landscape, tablet, offline, sub-path) | 105 passed; 1 intermittent failure (see §12) |
| `npm run build` | clean; `dist/` rebuilt for 2.3.0 |

## 11. Performance

`npm run bench`, `main` and this branch on the same machine
(`docs/perf-results.json`). Physics per step, browser frame rates and
memory agree within run-to-run noise (e.g. water 900: 3.02 vs 2.97
ms/step; desktop 300 particles 54.7 vs 52.0 fps; phone auto 150 particles
31.5 vs 34.5 fps; heap after ten menu↔shop trips 6.16 vs 6.35 MB). The
homunculus's "strong" brews take longer in simulated time (150–230 s)
because a boil-down is now really performed.

## 12. Limitations

* **The automated player is a model, not a person.** It knows the lore
  and its journal and plays fair, but its judgement of when to trial and
  when to abandon is a fixed rule. The balance above is evidence, not
  proof, of how people will play.
* **An intermittent page error** — "Cannot read properties of undefined
  (reading '0')" — appeared once in `tests/browser/rooms.spec.mjs:64` on
  the phone-landscape project. It did not recur in 15 reruns (with
  `PW_STACK=1` stack capture). It is unexplained and may predate this
  branch.
* **The efficient profile takes many fair complaints** (80 over three
  runs): it sells fast on preliminary evidence. That is a choice the game
  allows and prices in reputation, not a bug, but it is the cheapest
  path to coins.
* **Cold steeps are rare** (51 of 1204 steeps). They are planned only
  where an order's reagents call for one.
* **Old saves:** recipes whose steps skimmed, distilled or boiled with
  the lid open (without a recorded loss) are kept but marked approximate,
  with the reason shown. The homunculus will not replay them exactly.

## 13. Future opportunities

* A "settled" order state that a careful player can buy with more trials,
  so honest abandonment turns into slower but surer sales.
* Make the Grand Cauldron pay within 20 days (contract batches sized for
  it), or fold it into the copper cauldron.
* Teach cold steeps in the tutorial using a world seeded to have one.
* Let mixing earn its keep in larger batches (shared batch evidence) by
  showing the drift of unstirred bottles before they are sold.
