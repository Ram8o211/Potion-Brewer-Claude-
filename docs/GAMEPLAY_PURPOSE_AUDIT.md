# Gameplay purpose audit

This audit asks of every physical phenomenon, campaign mechanic and piece of
equipment in the game what decision it gives the player, what that
decision does to the potion, why a customer would care, whether the player
can see and learn the relationship, whether something simpler already does
the job, and whether the game would be worse without it. It was written
before the refactor and drove it; the decisions below are implemented
(`docs/GAMEPLAY_ARCHITECTURE.md` describes the result, the change report
is at the end of `docs/GAMEPLAY_REFACTOR_REPORT.md`).

Nothing is kept because it has code, an icon, a shop entry or tests, and
nothing is removed because an automated player failed to buy it: every
decision rests on a measurement in the real simulation.

## 1. Method

* **Code reading** of the simulation (`src/simulation`, `src/reactions`),
  the alchemy (`src/alchemy`, `src/materials`), the gameplay rules
  (`src/game`) and the interface (`src/ui`), the tests, the automated
  players and the previous integration report.
* **Controlled experiments** (`scripts/experiments.mjs`, helpers in
  `scripts/lib/experiment.mjs`): the same brewing problem prepared with and
  without a technique in the real simulation — pours through the emitter,
  heat through the furnace, stirring through the spoon tool, bottling from
  the tap — on three worlds (`experiment-0…2`), with campaign ingredients
  only. Each comparison reports the wanted effect, the strongest unwanted
  effect and the volume of a 100 ml bottle. Command:
  `node scripts/experiments.mjs 3` → `docs/experiment-results.json`.
  The figures quoted below are from the run on `main` *before* any change
  (the simulation itself was not modified by the refactor); where they vary
  between worlds the range is given.
* **The previous realistic playtest** (`docs/playtest-results.json` as it
  was on `main`: five player profiles, three worlds, ten days) for what
  players bought, used and were asked for.
* Classification: **A core** (changes effectiveness, purity, quantity,
  consistency or feasibility through a real decision), **B supporting**
  (explains or enables a core mechanic, no requirement of its own), **C
  immersion** (genuine simulated physics, visible, never optimised),
  **D unnecessary** (removed from the active architecture).

## 2. Experimental evidence

All values are percent effective concentration in a 100 ml bottle drawn
from the tap (an apprentice's order wants 8–15 %, the purity limit is
1.2 %).

| Experiment | Without the technique | With it | What it shows |
|---|---|---|---|
| Grinding (16 Silverleaf in 250 ml, steeped at 62 °C) | whole: vitality 0.0 | ground in the mortar: 6.9–7.4; crushed in the pot with the pestle: 6.8–7.3 | Only what dissolves acts. Mortar and pestle give the same result. |
| Steeping heat, realistic load (34 Silverleaf) | 20 °C: 3.6–3.9; 35 °C (below the window): 3.6–4.2 | 62 °C (inside the window): 11.8–12.6 | Three times the strength inside the window. (At a light load the gain is 1.8×: solubility alone dissolves a little.) |
| Arcane threshold (16 Silverleaf at 95 °C) | 62 °C: 6.9–7.4 | 95 °C: 16.4–17.2, frost 5.2–6.1 | Past its threshold (≈76 °C) the herb awakens: ×2.3, side effect too. |
| Cold extraction (34 Frostcap) | warm 40 °C: frost 3.4–4.0; room temperature: 3.4–4.0 | held at the basin's 9 °C or the frost rune's 5 °C: 9.5–11.1 | Two and a half to three times the frost. Frozen solid at full frost-rune cold: 6.5–7.4 — over-chilling costs. |
| Heat damage (24 Heartpetal) | 50 °C: love 8.6–9.7 | 95 °C: love 2.6–2.7, toxicity 2.6 | Petals wilt above ~85 °C: the love is lost and a poison appears. |
| Neutralisation and mixing (Silverleaf's frost against Sunthistle's fire, poured apart, steeped unstirred) | not stirred after: fire 0.6–1.2 | stirred 8 s by hand: 0.3–0.6; clockwork: 0.3–0.8 | The steep's convection already mixes a small pot; stirring halves the residue. |
| Mixing in a cold brew (Mica and Saltpetre powders, no heat), three bottles in a row | unstirred: transformation 1.4–1.9, bottles differ by up to 0.4 | hand 6 s: 2.1–2.5 (still uneven); hand 20 s or clockwork 6 s: 2.4–2.5, identical bottles | Stirring dissolves powders (+40 %) and makes the batch consistent; the clockwork paddle is about three times faster. |
| Late addition (Saltpetre onto a steeped Ironroot brew), three bottles | unstirred: strength 17.5→19.7 from first to third bottle, acidity 1.2→0.6 | clockwork 6 s: identical bottles | An unstirred batch pours unevenly: later bottles do not match the dose that was tested. |
| Order of addition (Sunthistle with the steep, or after it) | after: vitality 5.7–6.2 | together: 6.4–6.8 | A herb added after the steep stays weak. Small here because Sunthistle dissolves well; large for slow herbs. |
| Dilution (+50 % water) | plain: strength 14.5–15.6, side effects 1.5–1.8 | 10.4–10.6, side effects 1.1–1.3 | Both fall together. |
| Concentration (boil 30 % away, lid open) | plain: as above | strength 20.4–29.5, side effects 2.4–2.6, volume 400 → 240–275 ml | About +40 % — wanted and unwanted alike; fewer bottles. |
| Separation: water brew + lamp oil | just stirred: vitality 3.0–4.9, 20–45 % oil in the bottle | settled 15 s, bottom tap: 3.2–5.2, still 15–40 % oil | Plain oil carries nothing; it only dilutes. |
| Separation: Dragon Pepper steeped in an oil layer over a water brew | mixed: fire 5.5–6.2 | layered, bottom tap: fire 3.6–6.1; upper layer skimmed off: identical to the bottom tap | The herbs bridge the phases (every natural extract mixes with water): at best a third less of the side effect, never under the purity limit. The tap already draws from the bottom, so the skimmer changes nothing. |
| Distillation (healing tincture with 25 % spirit, reduced by a third) | lid open: vitality 16.5–17.0 | alembic, lid closed: 15.2–16.2; receiver 62 % water, 35 % spirit, 3 % magic; 47 ml of spirit recovered = 1.9 coins | The same potion; the distillate is never clean enough to go back into its jar (≥ 92 % one solvent), and the spirit is worth almost nothing. |
| Fire (hearth / bellows / athanor) | hearth: 450 ml to 92 °C in 7.2–7.4 s; boil down 30 % in 14 s; lamp oil to 205–232 °C | bellows: 3.5 s, 11–12 s; athanor: 2.0 s, 12–13 s; lamp oil: **burnt away** with either | Every steep (the hottest, Cinder Scale in oil, needs 145 °C) and boil is within the hearth's reach. Hotter fires only save seconds and set oil alight. |
| Cold (basin / frost rune / glacial sigil) | basin: a watery brew bottoms out at 9 °C | frost rune: −14 °C; glacial: −48 °C | The basin holds the usual Frostcap window (0–15 °C in 80 % of worlds); the rune holds the narrow ones (0–10 °C, Grave Moss −5–10 °C) and reaches the Moonfen's awakening thresholds (0 to −50 °C); the glacial sigil the deepest. |

## 3. Physical features: classification and decisions

| Feature | What it does now | Gameplay purpose before | Demonstrated benefit | Class | Decision |
|---|---|---|---|---|---|
| Dissolution and extraction (grinding) | Whole solids give up almost nothing; ground or crushed ones dissolve and steep | Implicit (orders needed strength) | 0 → 7 % (section 2) | A core | Retain; brew advice and help explain it |
| Steeping temperature | Herb-specific reaction windows turn ground herbs into strong extracts | "Steep" in the theory; true colour orders | ×3 at realistic loads | A core | Retain; windows learnt from lore and journal |
| Cold extraction | Ice-cold windows (Frostcap, Grave Moss) | Planned at 7 °C whatever the equipment, though the basin cannot take a brew below 9 °C; narrow windows (0–10 °C) never planned | ×2.5–3; frozen solid ×0.7 | A core | Redesigned: the planner uses cold steeps the equipment can actually hold (basin ≈ 9 °C, a cold plate ≥ 3 °C, never frozen) |
| Heat damage | Heartpetal wilts above ~85 °C | Not used | love 9 → 2.6, toxicity appears | A core | Retain; mechanic named, help text |
| Chemical reactions (chalk + sulphur, oil extracts, tinctures in spirit) | Simulated stoichiometry | Planner and journal | Changes composition (neutralising acid by reaction; solvent choice) | A core | Retain |
| Arcane activation | Volume-weighted thresholds, awakening ×2–3 | Awakened orders (Adept+) | ×2.3 past the threshold | A core | Retain |
| Neutralisation | Opposing pairs cancel within each particle | Every order | Purity limit met or missed | A core | Retain |
| Mixing and diffusion | Contact diffusion boosted by shear | "Well mixed" orders (stability ≥ 80–92) | Dissolution +40 % in cold brews; bottle-to-bottle consistency; neutraliser contact | B supporting (consequences are core) | Retain the physics; **remove the stability requirement**; consistency now matters through shared batch evidence; advice still says when a brew is uneven |
| Evaporation and concentration | Lid-open boiling removes the most volatile liquid | "Boiled down" orders asked for a *volatility* ceiling | +40 % strength and side effects | A core | Redesigned: the "strong" technique asks for the strength itself, any method allowed |
| Dilution | Adding water | Implicit | Both effects fall | A core | Retain (the main correction for overshoot) |
| Layering and physical separation | Immiscible liquids stratify by density | Skimmer, "oil and water" achievement | None reliable: natural extracts all mix with water; at best a third of an oil-borne side effect | C immersion | Retain the physics and the achievement; remove separation equipment from the campaign |
| Freezing and melting | Rigid frozen blocks, latent heat, pestle crushing | Achievement only | Over-chilling hurts extraction; otherwise none | C immersion (B where it limits cold steeps) | Retain |
| Density | Mass per volume, buoyancy | Density orders (54 of 204 technique sales) and the hydrometer | No decision: density follows whatever was dissolved | B supporting (layering) | **Remove from commissions**; "heavy / like water / light" by eye; numbers in the Free Experiment |
| Colour | OKLab mixture colour | "True colour" orders (97 of 204 technique sales: the most common requirement of all) | A visible sign of extraction; but as a target it duplicated the effect requirement and dominated orders | B supporting (feedback) | **Remove from commissions**; colour stays as feedback (the swatch, the label, the bottle) |
| Homogeneity / stability | RMS composition spread, immiscibility, sediment | Stability orders and the assay kit | Process feedback only | B supporting | **Remove from commissions**; drives the "uneven: stir" advice |
| Volatility | Volatile species and gas share | Tincture orders (≥ x) and boiled-down orders (≤ x) | Proxy for "spirit added late" or "boiled", not an outcome a customer feels | B supporting (real evaporation stays) | **Remove from commissions** with the "heady tincture" technique |
| Viscosity | Log-mean particle rheology; pastes and doughs | Never asked (natural grains do not thicken a brew) | None | C immersion | Retain the physics; remove the viscometer |
| Electric charge and conduction | Storm Glass charge flows through conductive matter, heats it | Never asked | None (the charge at the tap cannot be controlled) | C immersion | Retain; remove the galvanometer |
| Vapour, condensation, bubbles | Gas phase under the lid | Supports boiling down | Visible steam escaping | C immersion | Retain |
| Fire and burning | Oil and spirit ignite on glowing iron | Hazard, achievement | A risk of strong fires (oil burnt away) | C immersion | Retain |
| Glow | Awakened magic glows | Feedback of awakening | The awakening is visible | B supporting | Retain |
| Dough and paste | Binding powders knead into dough | Achievement | None in natural brews | C immersion | Retain |
| Serving temperature | The bottle keeps the brew's temperature | "Serve hot / chilled" | A final processing condition a customer feels | B supporting | Retain as the "serve" technique |

### The six questions for each core mechanic

| Mechanic | 1. Decision | 2. Consequence | 3. Objective | 4. Observable? | 5. Simpler substitute? | 6. Without it |
|---|---|---|---|---|---|---|
| Formulation and neutralisation | Which herbs, in what proportions | Side effects cancel in pairs | Wanted effects at strength, others under 1.2 % | Effects of each herb, balancing hints, theory, trials | No | No puzzle |
| Grinding | Mortar, pestle or whole | Whole herbs give nothing | Strength at all | Advice "whole herbs: crush", colour | Mortar and pestle overlap: both kept free (in-pot crushing and frozen blocks need the pestle) | The cheapest mistake would vanish |
| Steeping heat | Temperature and what is in the pot during the steep | ×3 inside the window | Strength without waste | Lore, journal windows, advice | No | Strength would be a plain proportion |
| Cold extraction | Steep cold, not frozen | ×2.5–3 | Cooling and fever orders | Lore "ice-cold", thermometer | No | Frost orders would ignore preparation |
| Heat damage | Keep petals below ~85 °C | Love lost, poison | Love orders | Lore, journal | No | "Hotter is always better" |
| Awakening | Heat or chill past the blend's threshold — or stay below | ×2–3, side effects too | Strong orders; plain orders must not overshoot | Glow, journal, arcanometer | Boiling passes most heat thresholds (so a strong fire is a crude route) | No route to master strengths |
| Concentration / dilution | Boil off or add water | ±40 %, all effects | Strong orders; overshoot correction | Steam, volume, trials | No | No volume–strength trade-off |
| Mixing | Stir after additions | Dissolution, contact, consistency | Batches whose bottles match their trials | Swirls, advice, stale evidence | Convection does part of it in a hot steep | Consistency would be free |
| Trials | Doses, sizes, rabbits | Margins narrow | Trust, price, proof | Expected-effects section | No | No uncertainty, no identity |

## 4. Equipment: classification and decisions

38 items were sold or given before; 23 remain (7 in the starting kit, 16 for sale).

| Item (price, rank) | Function before | Purpose before | Demonstrated benefit | Class | Decision |
|---|---|---|---|---|---|
| Stone Hearth (start) | Flame 340 °C | Every steep | Reaches every steep, boil and heat-awakening (section 2) | Essential | Retain |
| Bellows & Coal (120, 1) | Flame 520 °C, faster | "Boil quickly" | 7 s → 3.5 s to 92 °C; burns lamp oil away | Unnecessary | **Remove**, refund 120 |
| Athanor Furnace (700, 3) | Flame 800 °C | "Fine control" | 2 s to 92 °C; burns oil | Unnecessary | **Remove**, refund 700 (the Free Experiment keeps its heat) |
| Cold-Water Basin (start) | Down to ~9 °C | Serving cold | Most ice-cold steeps (Frostcap 0–15 °C) | Essential | Retain |
| Frost Rune Plate (150, 1) | Plate to −30 °C | "Freezes liquids" | Brew to −14 °C: narrow cold windows, Moonfen cold awakenings, freezing | Specialized, verified | Retain (rank 1, before the Moonfen opens) |
| Glacial Sigil (750, 3) | Plate to −70 °C | Deep cold | Brew to −48 °C: the deepest Moonfen thresholds (Grave Moss −50 °C) | Useful upgrade | Retain |
| Iron Pot (start) | 1.5 L | — | — | Essential | Retain |
| Copper Cauldron (320, 2) | 2.2 L | Big orders | Contracts (×1.5 bottle), several bottles per tested batch | Useful upgrade | Retain |
| Grand Athanor Vessel (1800, 4) | 3 L | Grandest orders | Whole shelves from one batch | Useful upgrade | Retain |
| Oak Spoon (start) | Stirring | — | — | Essential | Retain |
| Stone Mortar (start) | Grind before pouring | Extraction | 0 → 7 % | Essential | Retain |
| Granite Pestle (35, 0) | Crush in the pot | Extraction, frozen blocks | Same as the mortar for herbs; needed for frozen blocks and herbs dropped in whole | Redundant as a purchase | **Consolidate into the starting kit**, refund 35 |
| Brass Skimmer (60, 1) | Remove matter | "Remove a floating layer" | None (section 2: the tap already draws from the bottom) | Unnecessary | **Remove from the campaign**, Free Experiment tool, refund 60 |
| Clockwork Stirrer (110, 1) | Hands-free whole-depth stirring | Stability orders | Even in 6 s what the hand spoon needs 20 s for; unattended; consistent bottles | Useful upgrade | Retain (purpose: consistency and attention, not a stability number) |
| Copper Alembic (360, 2) | Distil under the lid | Recover spirit | Same potion as open boiling; distillate never jar-clean; 1.9 coins | Unnecessary | **Remove from the campaign**, Free Experiment control, refund 360 |
| Brass Homunculus (1100, 3) | Replays a recipe | Automation | Reproduces a recorded procedure in the real cauldron (tests) | Useful upgrade | Retain; now replays boil-downs too and states its limits |
| Mercury Thermometer (start) | Temperatures | Steeps, serving | Essential for every heat decision | Essential | Retain |
| Glass Hydrometer (45, 0) | Density reading | Density orders | Only for an arbitrary target | Unnecessary | **Remove**, refund 45 |
| Falling-Ball Viscometer (70, 1) | Viscosity reading | None | None | Unnecessary | **Remove**, refund 70 |
| Assay Kit (90, 1) | Stability, volatility | Those orders | Only for arbitrary targets | Unnecessary | **Remove**, refund 90; the brew advice says when a brew is uneven |
| Aether Lens (140, 1) | Aura of effects ≥ 3 % in the probe | Research | A real screen of a brew; overlaps the arcanometer's role | Redundant | **Consolidate into the Arcanometer** (owners receive it) |
| Galvanometer (120, 2) | Charge reading | None | None | Unnecessary | **Remove**, refund 120 |
| Arcanometer (260, 2) | Threshold of the probed matter | Awakening | The only way to read a threshold before trying | Specialized, verified | Retain, merged with the lens, 200 coins at rank 1 |
| Thermal Monocle (80, 1) | Heat map | None | Visualisation only | Unnecessary as a purchase | **Move to the Free Experiment**, refund 80 |
| Subject Kennel (60, 1) | Six rabbits, half price | Trials | More animals for corroboration | Useful upgrade | Retain |
| Rabbit Warren (180, 2) | Ten rabbits | Trials | As above | Useful upgrade | Retain |
| Purging Still (150, 1) | Purges for 1 coin | Rabbit care | 7 coins saved per purge | Useful upgrade | Retain |
| Forager's Satchel (80, 1) | +50 % per harvest | Gathering | More per trip | Useful upgrade | Retain |
| Trowel, Rock Hammer, Brush, Sickle (20 / 35 / 15 / 45, 0–1) | Full harvests by one method each | Gathering | Four equivalent yield multipliers | Redundant | **Consolidate into the Forager's Kit** (60, rank 0); owners receive it, the excess refunded |
| Oak Shelves, Cellar Racks (90 / 260, 1–2) | 2.5 L / 6 L per reagent | Storage | The 1 L shelf never limited a measured run | Unnecessary | **Remove**; every shop stores 2.5 L per reagent; refunded |
| Bottle Shelf, Potion Cabinet, Bottle Cellar (40 / 150 / 420) | 6 / 12 / 24 bottles | Shelves | Shelf sales, shared batch evidence | Useful upgrade | Retain |
| Guild Charter (400, 2) | −15 %, contracts | Commerce | Contracts at ×2.2 budget | Useful upgrade | Retain |

## 5. Commissions

| Before | Evidence | After |
|---|---|---|
| Techniques: true colour, serving temperature, well mixed (stability), density, heady tincture (volatility ≥), boiled down (volatility ≤) | Colour and density were 151 of 204 technique sales: two arbitrary physical targets dominated; stability and volatility were proxies for a process, not outcomes | Techniques: serving temperature, strong and compact (a strength beyond the plain brew; boiling down or more herb both work) |
| Order strip meters for density, stability, volatility hidden without an instrument | Instruments existed to unlock meters | Only effects (from trials), purity (from trials), temperature and quantity |
| Cold steeps planned at 7 °C with any equipment; narrow windows never | The basin's floor is 9 °C (section 2) | Planned where the equipment holds them (basin ≈ 9 °C, cold plate ≥ 3 °C, never frozen) |
| Grand commission forced "true colour" | Arbitrary | Forces "strong" |

Every generated commission keeps the old guarantees: its hidden plan uses
only what the shop can gather, hold or buy today, is predicted with the
simulation's own laws and passes the counter's own scoring before the
customer may ask; a day never stalls.

## 6. Recipes

`matchRecipe()` compared ingredient amounts and the hottest and coldest
holds only. A batch with a herb added after the steep, left whole, or
boiled down was "exactly" the recipe. Now (`recipes.js compareRecipe`):
the formulation (amounts), the procedure (which stage each ingredient was
in the pot for, ground or crushed, each stage's temperature, hold and
boil-down, stirred after the last addition, served at the same
temperature) and reproduction (trials agreed) are kept apart. Pour order
between two stages, the exact seconds and the lid outside a boil are
ignored: they do not change the brew. The Homunculus replays boil-downs by
the share that boiled away. Recipes whose procedure cannot be replayed
exactly (skimming, distilling, or an open-lid boil recorded before volumes
were traced) are marked approximate with the reason.

## 7. Experiments and hidden knowledge

* A reading of zero showed as "✓ 0" at the counter and "No effect seen" in
  the trials room, as if absence were proven. A single 10 ml reading of
  zero leaves room for about 2.9 %, more than twice the purity limit. The
  evidence states are now: untested, not detected (with how strong it
  could still be), detected once, measured repeatedly, corroborated — and
  against an order: reliably met (✓), reliably missed (✗), or not settled
  (~).
* The automated player read every ingredient's hidden arcane threshold
  (`m.arcane.thr`) and every hidden reaction window (`st.world.reactions`)
  to plan its steeps and awakenings. It now reads the lore, its own
  journal (reactions and awakening temperatures it has seen happen) and the
  arcanometer's reading of the brew in its cauldron; a test checks it never
  reads thresholds, hidden plans or laws.
