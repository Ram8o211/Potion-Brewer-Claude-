# Extraction & Aging Overhaul — report

This release replaces the fixed-temperature steeping reactions with one
continuous extraction model shared by the cauldron, the commission planner
and the new aging cellar, and adds combustion of raw matter, distillation
with a condenser, emulsification and alcohol-free commissions. Save version
8; older saves migrate automatically.

## 1. Solvents and extraction

* **Model** — `src/alchemy/extraction.js` (pure, deterministic from the
  permanent species data, so identical in every world and save).
  * Every catalog species is **hydrosoluble** (water or spirit) or
    **liposoluble** (oil only): resinous barks, oily roots and seed pods,
    waxy vines, crystals and relics, some berries and fiery flowers — 38 of
    120 species, in eleven of the twelve biomes (all four starting ones).
  * Rate `k(T) = k20 · 2^((T−20)/Q)`, `k20` 0.09–0.30 /s by texture (soft
    leaves fast, stones slow), `Q` 15–20 °C.
  * Ceiling `Y(T)` falls linearly from 1 at `Tfull` to `Ymin` (0.25–0.45)
    over 130–170 °C. Hydrosoluble `Tfull` −16…−8 °C (below water's melting
    point: only spirit reaches it); liposoluble −6…+1 °C (above oil's
    melting point, below the basin's 9 °C: chilled oil). Melting points:
    spirit −110 °C < oil −25…−8 °C < water ≈0 °C.
  * `dφ/dt = k·m·(Y(T) − φ)` when φ < Y, else 0: heating never destroys
    extracted magic; cooling lets more out.
* **Simulation** — `src/reactions/extraction.js`, every other physics step.
  Raw matter becomes its extract **volume for volume** with the same
  effects per volume (the old ×1.08 potency bonus is gone), so strength is
  ingredient amount × extracted share ÷ total volume. A solvent holds at
  most its own volume of extract. φ is the extracted share of that
  ingredient over the whole cauldron. Frozen particles extract nothing.
  Stirring raises the rate (×0.4 at rest → ×1 stirred), an emulsion cuts it
  to ×0.1, whole pieces give only by surface contact (×0.03), which makes
  grinding decisive.
* Raw catalog matter no longer counts toward a potion's effects at all
  (`effects.js`): only extract does. The guild theory (brew panel, labels)
  now counts each ingredient only with the share the brew panel shows as
  dissolved.
* The planner (`commissions.js prepFor`) steeps each ingredient in its own
  solvent class at room temperature for long enough to approach its
  ceiling; the predictor (`predict.js predictExtraction`) integrates the
  same model over the plan's stages and applies solvent capacity. Measured
  agreement with the simulation: within 0.01–0.08 of the extracted share.
* Tier targets were rebalanced (≈ −20 %) for room-temperature yields of
  0.84–0.90 instead of the old 1.08 extracts.

## 2. Combustion

* Each species has a hidden combustion threshold, 115–300 °C (always above
  water's boil; 111 of 120 burn below even the lowest boiling point oil can have, 260 °C). The raw
  material carries it as its ignition point and chars (`reactions/
  extraction.js`, plus the existing surface flames) into inert **Char** —
  its remaining magic is lost. Extracts are non-flammable; water, spirit
  and oil now have flammability 0 (phase changes only).
* Discovery: the cauldron records the hottest temperature each ingredient
  was seen at unharmed and the coolest it was seen burning
  (`GameState.noteBurning`); the ingredient card and brew panel show only
  what was observed ("unharmed up to …", "seen burning at …"), the journal
  gets an entry, a toast warns.

## 3. Distillation and alcohol-free potions

* **Alembic & Condenser** (170 coins, Journeyman) — the retired Copper
  Alembic is converted into it for owners. Its still head (`Still` button)
  sits on the cauldron; vapour leaving the liquid is collected in the
  receiver (`Simulation.condenser`). The receiver flask can be jarred
  (solvents return to the shelf), poured back, or poured away.
* Physics: a liquid hotter than its most volatile component's boiling point
  gathers that component from its neighbours volume for volume before it
  boils (`phase.js enrichVolatile`), so spirit leaves near its own boiling
  point; vapour never carries dissolved matter (it soaks back instead), so
  magic never boils over. Bubbles can now rise through thin liquid
  (percolation), which also makes ordinary boiling under a closed lid
  behave better.
* Residual alcohol is measured (`Measurement.alcohol`, % spirit by volume)
  and scored (`evaluate.js` key `alcohol`).
* **Commission technique "Alcohol-free cold tincture"** (`sober`, tier 1+,
  needs the Frost Rune and the condenser): the plan steeps the herbs in
  spirit at −12 °C, adds water and distils the spirit off; the customer
  asks for the strength a warm water steep cannot reach and at most 3 %
  spirit. The homunculus/autobrew has a matching `distil` stage.

## 4. Emulsification

* Material property `emulsifier` (strength per volume). A **Neutral
  Emulsifying Gum** (no effects, 6 coins / 100 ml) is sold from the start;
  19 species also emulsify (seed pods, fungi, shells, berries).
* Stability (`emulsionStability`): emulsifier ≥ 6 % of the smaller phase
  (by strength), and the smaller phase ≤ 42 % of the liquid. Stable pairs
  of particles exchange composition across the oil/water boundary; unstable
  mixed particles actively separate again (`diffusion.js separate`).
* Extraction in an emulsified particle runs at 10 % speed, so extracting
  each herb in its own solvent first and emulsifying afterwards is optimal.
* Mixture-dependent melting/boiling points, colour and phase behaviour all
  come from the composition as before.

## 5. Aging cellar and runes

* **Aging Cellar** (240 coins, Journeyman, 2 vessels) and **Deep Cellar**
  (520, Adept, 4 vessels). `src/game/cellar.js`.
* A vessel holds bulk matter (ml per id) laid down from the cauldron or a
  shelved bottle, and is bottled back onto the potion shelves.
* Fire/Frost potions from the shelves activate a vessel with a lasting
  drive of 2.5 °C/h per percent of net fire (negative for frost) — it heats
  until its herbs burn or cools until its solvent freezes.
* **Temperature runes** (28 coins at the market from Journeyman; found by
  ≈14 % of Netherwood harvests and 6 % of mined or dug ones,
  deterministically per harvest) hold a chosen temperature (slewing at
  90 °C/h) for 12 h of work, wearing faster against a strong drive
  (×(1 + |drive|/40)); when worn out the drive resumes.
* Deterministic, persistent and cheap: fixed 20 s steps on each vessel's
  own wall-clock timestamp (offline catch-up up to 30 days; settled vessels
  skip ahead), so one jump equals any sequence of ticks (tested), and the
  state is saved with the game.

## 6. Integration

* Mechanics (`mechanics.js`): extraction, steeping, heat-damage and
  cold-extraction rewritten; new distillation, emulsification and aging.
* UI: brew panel "Extracted" bars (dissolved share vs. ceiling at the
  present heat, frozen/burn notes), emulsion and spirit readings, new brew
  advice (wrong solvent, frozen, at ceiling, burning risk, unbound
  oil/water), Still and Cellar buttons, receiver jarring, the cellar panel,
  rune purchase in the shop, ingredient card (solvent class, observed
  burning, emulsifying), help, hints and rank news updated.
* Save v8 migration: adds the cellar, refreshes catalog materials (profiles,
  compat by class, combustion), removes the retired `rw_extract_sp_*`
  reactions, adds the emulsifier and char, a journal note. Brews and
  bottles keep their matter (extract ids are unchanged).
* Arcane activation, effects, neutralisation, resonance laws, trials and
  the procedural physics are unchanged; the cellar applies the same
  awakening rule to its vessels.

## 7. Tests

`tests/extraction.test.mjs` (17 tests): profile invariants (classes, rates,
ceilings, thresholds vs. water/oil), the pure model, conservation and
solvent capacity in the real cauldron, wrong solvents, grinding/heat
trade-offs and recovery on cooling, frozen solvent, cold spirit, combustion
of only unextracted matter and its discovery, distillation selectivity and
jarring, emulsion rules/binding/slow extraction, predictor agreement, cellar
aging/freezing/burning, potions and runes (including wear and underground
finds), deterministic offline progression across a save, bottling a vessel,
the v8 migration, the guild theory, and a full alcohol-free order from
commission to sale with the spirit jarred and the rest laid down. Existing
tests were updated where their premise was the retired steeping windows.

## Remaining limitations

* Residual spirit after distillation is 1–2.5 %: spirit held in the
  extract-rich sediment escapes slowly (the per-particle boiling model
  cannot boil a particle that is mostly dissolved matter). Alcohol-free
  orders therefore allow up to 3 %.
* Recorded recipes do not replay distillation (the homunculus can follow a
  planned distillation, not a recorded one); a recipe that used the still
  is replayed without it.
* The planner steeps at room temperature (cold spirit only for alcohol-free
  orders) and never plans emulsions; emulsified potions are a player
  strategy, not an order type.
* Cellar vessels are sealed: nothing evaporates in them however hot, and
  their contents are treated as one well-mixed bulk.
* Browser suite (all six Playwright projects) was run: three specs were
  updated to the new rules (hot oil no longer burns — herbs in it char; a
  warm hold is what a recipe records; awakening counts volume for volume)
  and one wait condition now checks the extracted share. Two phone specs
  (the first commission's single rabbit reading, the hutch showcase's tile
  re-render) failed once and passed on two re-runs: they are timing/noise
  sensitive rather than broken.

## Addendum: recalibration, cellar charges, fine fire control

* **Room temperature is no longer enough.** Each species now has its own
  room-temperature ceiling `Y20` (52–68 %, about 60 % on average: soft
  herbs a little more, stones a little less). The ceiling rises linearly
  to 1 at `Tfull` and falls linearly above 20 °C to `Ymin` (`Y20` − 0.22…0.32)
  over 70–100 °C — about 45 % at 60 °C, 35 % near the boil.
* **Much slower.** `k20` is about 20× lower (a ground, stirred herb takes
  70–240 s per e-fold at 20 °C); the rate doubles every 12–16 °C, so a
  60 °C steep is quick (7–40 s) and a cold one very slow (5–20 min at
  −12 °C). The cellar factor was raised (0.006 → 0.12) so a vessel still
  works in hours.
* **The planner steeps warm** (`commissions.js composePlan`): the lowest
  temperature (from 20 °C, in 2 °C steps, arcane-quiet) at which the
  slowest ingredient nears its ceiling within 90 s; cold tinctures for
  alcohol-free orders hold up to 10 minutes. Tier targets were lowered to
  about two thirds (`requests.js TIER_TARGET`) to match the yields.
* **Cellar charges** replace the endless drive: see GAME_ARCHITECTURE.md
  (Aging cellar). Old saves' drives become a 100 ml charge of the same
  strength.
* **Fire control**: the slider is squared (fine at the gentle end) with a
  2.5 % off-notch, − / + buttons and arrow keys step the flame by 2 °C, and
  the readout shows the flame (or the cold plate) and the pot.
