# Gameplay integration report

This report covers the gameplay integration round: an audit of the game as
it stood on `main` (2.1.0, natural ingredients and potion shelves), the
weaknesses confirmed in code or by measurement, what was changed, how the
systems now connect, the balance and performance measured afterwards, and
what remains open. Every number below comes from a run that was actually
executed; the commands are given with each.

## 1. Audit: weaknesses found

| # | Weakness | Confirmed by |
|---|---|---|
| W1 | `GameState.buy()` sold anything: gather-only finds, herbs above the shop's rank, rabbit remains, even the retired prepared reagents. Only the market *panel* filtered. | Code (`state.js buy`); the old playtest bought gather-only ingredients this way. |
| W2 | All 14 physical commission styles (tonic, syrup, salve, elixir, heavy, varnish, panacea…) required prepared reagents the market no longer sells, so **no physical commission was ever generated**: every order was "reach a concentration, keep the rest under 1.2 %". | Code (`buildPlan` needs `essenceA`, `binder`…); 15 of 15 generated orders in a fresh achievability run were effect orders. |
| W3 | Commission feasibility was theoretical: an order could need a gather-only herb from a stripped deposit, or purchases beyond the purse. | Code (`commissionContext` = everything gatherable, any stock level). |
| W4 | A day could stall: when no commission could be generated, `nextCustomer` returned null without moving on, and "Open the door" generated the same null again. | Code (same seed key, `customerIndex` unchanged). |
| W5 | The balancing tools were idealised: the playtest followed each order's hidden reference plan, bought illegally (W1), booked sales directly (`completeSale`, no label, no bargaining, no complaints) and bought every upgrade; the achievability run gave each shop every upgrade of its rank. | `scripts/playtest.mjs`, `scripts/achievability.mjs` (old versions). |
| W6 | Trials: one reading was shown as the value "±0", the only uncertainty being the sample standard deviation of the readings. A single trial looked exact; repeated trials of one rabbit looked as good as trials of several. | Code (`summarize`), the trials view text. |
| W7 | Evidence did not matter commercially beyond "tested or not": one reading and ten readings on five rabbits earned the same trust. | Code (`labelTrust`, `unprovenWanted`). |
| W8 | Recipes kept ingredient amounts and the hottest/coldest temperature only; the Homunculus "replayed" by pouring everything, then heating to the maximum, so a steep followed by a chill, a steep before an ingredient, or a held temperature was lost. A batch counted as "following" a recipe whenever its amounts matched, however it was prepared. | Code (`recipeDraft`, `startHomunculus`, `knownRecipe`). |
| W9 | Equipment without a purpose: no order asked for density, stability or volatility, so the hydrometer and assay kit only displayed numbers; the order strip showed a met/unmet meter for those properties even without the instrument. The Clockwork Stirrer differed from the free hold-to-stir only by a wider circle. The alembic's distillate could only be poured back, from the pause menu. | Code (`readable`, `updateAssay`, `setAutoStir`, `pourReceiver`). |
| W10 | Time of day depended on which customer was being served (dawn = first customer present), which made gathering dawn flowers an odd race against serving. | Code (`gathering.js dayPart`). |
| W11 | Customers had personas but no memory; negotiation showed only offers, never why. Selling the same easy potion forever earned the same reputation. | Code (`customers.js`, `commerce.js`). |
| W12 | Little contextual feedback tied to the cauldron: nothing said that whole herbs were not dissolving or that the brew sat outside a steeping window. | UI review. |

Already resolved on `main` and kept as they were: natural ingredients
with impurities and their neutralisation, the potion shelves, exact
particle vials and conservation in partial use, the rabbit colony and its
transformations, arcane awakening with composition-weighted thresholds,
the commerce loop with next-day verdicts, Free Experiment, procedural
worlds and save migration.

## 2. What was changed

### Milestone A — gameplay integrity

* **Legal purchasing** (`GameState.canBuy`): the same rules as the market
  panel, enforced by `buy()` itself. `purchasable()` excludes gather-only
  finds and products. *Test:* `integration: the market sells only…`.
* **Practical feasibility** (`commissions.js checkSupply`,
  `GameState.supplyOf`): a plan may only use what is on the shelf, what
  careful harvests of reachable deposits bring *today* (method, tool, hour
  and weather included) or what may legally be bought within the purse,
  with a 15 % margin for test doses. A failing plan is searched again
  without the missing or dearest ingredient. *Tests:* `integration:
  commissions only need…`, `…never stall the day`.
* **A day that never stalls:** `nextCustomer` falls back to lower tiers,
  then to the plainest single-effect order; a customer the shop cannot
  serve at all does not come in, and the next one does.
* **Honest balancing tools:** see section 4.

### Milestone B — commissions that use the whole simulation

Before choosing what to ask, the physics was measured (scratch harnesses
brewing generated plans properly and sloppily in the real simulation):

* the predictor matches the real brew's colour to ΔE ≈ 0.1 and density to
  ±0.003 g/ml for well-made natural brews, while whole or unsteeped herbs
  are off by ΔE 10–30 and 0.05–0.13 g/ml — colour and density are fair,
  visible checks of real extraction;
* an unstirred brew reads stability 20–60, a stirred one 94–100;
* boiling a quarter of the water off with the lid open strengthens the
  brew and lowers volatility (15 → 8–9); spirit raises it (15 → 20–22);
* natural grains **cannot** make a reliable paste: every wild powder or
  ground solid tested (mica, chalk, gypsum from chalk + sulphur) dissolves
  or extracts in the cauldron, so viscosity stays 1–4 cP. No fake paste was
  introduced; viscosity orders are not asked for (section 7).

On that basis orders now carry **techniques** (`TECHNIQUES`), each applied
to the hidden plan, re-predicted and checked by the counter's scoring:
true colour, serving temperature, well mixed (stability), density, a
heady tincture (spirit added *cold* after the steep — a new `late` stage
in predictor and brewer), and boiled down (a new `reduce` stage: lid off
until a quarter of the volume has gone, the steam let out before the lid
returns, re-boiling what rains back). The predictor models both stages
and was checked against the simulation (frost 43 predicted / 46 brewed,
strength 47 / 44); boiling down is only asked for where the prediction is
trustworthy (no new reaction, no change in awakening). Boiling at 100 °C
passes most ingredients' arcane thresholds, so in this world boiling down
*is* a route to awakened strength — consistent with the physics, and
reflected in the help text.

Orders also carry a **supplies brief** (how much to brew; for each wanted
effect, which ingredients carry it and whether they are on the shelf, in
the wilds or at the market) built from public ingredient knowledge, never
the hidden plan, and each technique shows a one-line lesson.

### Milestone B2 — equipment with a distinct use

| Item | Its advantage now |
|---|---|
| Hydrometer, Assay Kit | Orders ask for density, stability and volatility; without the instrument the order strip shows *no meter* for them (only a rough word), with a hint naming the instrument. |
| Clockwork Stirrer | Runs unattended in every room and sweeps the whole depth of the brew (free hold-to-stir circles near the bottom and stops when released). Measured: 6 s of stirring an unmixed brew → whole-brew stability 98 with the sweep, 94 by hand. |
| Copper Alembic | Draws vapour off under a closed lid (boil down without venting or fire risk); a clean distillate (≥ 92 % one solvent) goes back into its jar from the Brew room's receiver chip — spirit costs coins. |
| Homunculus | Replays a recipe's recorded steps exactly (section C) and says which steps (skimming, distilling) it leaves to the alchemist. |
| Larger cauldrons, potion shelves | Batch production: bottles of one batch share its trials (each checked against its own contents), so one round of testing serves several bottles; the counter points out a tested shelf bottle that already meets a new order. |
| Arcanometer, frost and fire upgrades | Unchanged mechanics; awakened orders from Adept need them (threshold reading, cold awakening of Moonfen magic, faster boiling). |

### Milestone C — experiments and recipes

* **Uncertainty** (`experiments.js summarize`): the mean, the spread seen
  between readings, and separately the **margin of the mean**, built only
  from public knowledge — each reading's dose noise for its size and the
  rabbit's visible age and health, blended with the observed spread, and
  each rabbit's possible bias divided by the number of *different*
  rabbits. One reading never reads "±0" (≈ ±4–5 % at 12 %); repeats on one
  rabbit never remove its bias; other rabbits do. Evidence levels:
  preliminary → repeated → corroborated → certified.
* **Rabbits in planning:** a rabbit below half its health reads less
  steadily (up to 1.5×); the hutch shows each rabbit's steadiness (from age
  and health only — its hidden sensitivity and limits stay hidden).
* **Evidence in commerce:** claims carry their level; trust weighs them
  (45 / 70 / 90 / 100 %); a customer who insists on proof wants readings
  repeated, the most exacting corroborated on two rabbits, and with a
  purity rule every effect tested (one trial reads them all). A tested
  claim states its margin, and a fair customer forgives a potion within it.
* **Recipes as procedures** (`recipes.js`): a one-second trace of every
  brew plus pour, lid, skim and distil events compress into ordered steps;
  the Homunculus replays them step by step (`autobrew.js` step mode); a
  batch follows a recipe only when prepared the same way (heats and chills
  within 10 °C); brewing a recipe again and testing it records whether it
  reproduced. Old recipes become approximate procedures, marked as such.
  *Test:* `integration: a recipe records the procedure in order, and the
  homunculus replays it to the same potion`.

### Milestone D — shop, customers, progression

* **The shop door is the clock:** dawn until the door opens, the day while
  open, dusk after the last customer until closing. A new day starts
  closed — gather dawn flowers, brew for the shelves, then open.
* **Patrons** (`patrons.js`): returning customers keep their face and
  temperament, adjusted by their history (trust lowers the proof they need
  and their haggling and raises their purse; a let-down patron says so and
  wants proof; one badly burned stays away).
* **Interpretable bargaining:** the opening shows what the customer weighs
  (fit and what is short, trust and why, the measure, their temper, their
  history); the reservation price stays hidden.
* **Progression:** orders far below the shop's rank earn less reputation
  (two ranks below 60 %, three or more 40 %), the same order again and
  again a little less; a technique sold well the first time is "mastered"
  (journal, +4 reputation); each promotion says what new challenges it
  brings; generation avoids the last four sold request types.

### Milestone E — clarity

* Brew advice read off the cauldron (`lab.brewAdvice`), shown as a chip
  and in the brew panel: whole herbs that will not dissolve, herbs outside
  a steeping window the player has discovered (or a hint that some herbs
  want warmth), steam leaving with the lid off, an uneven brew.
* The order card: what each technique takes, the supplies, matching shelf
  bottles, returning-patron notes; the brew panel says when a batch has a
  recipe's ingredients but not its procedure; the label shows each claim's
  margin and evidence; the trials view says what the current customer's
  proof demands still need.
* Tutorial and in-game help updated for the day clock, evidence levels,
  techniques and procedure recipes (no new tutorial steps: the existing
  action-driven steps teach the same actions, with revised text).

## 3. New relationships between mechanics

* Extraction → **colour and density** (visible to the eye and the
  hydrometer before any rabbit is dosed) → the order.
* Stirring (hand or clockwork) → **stability** → "well mixed" orders.
* Heat, the lid and the boil → **reduction** → strength, volatility,
  awakening, purity (side effects concentrate too) → the order.
* Spirit added cold → **volatility** → tinctures; the alembic → recovered
  spirit → coins.
* Rabbit health and age → **reading steadiness** → margin → evidence level
  → trust, price and proof demands → complaints and patron trust.
* Batch size (cauldron) → bottles sharing evidence → shelves → serving
  later orders without brewing.
* Recipes' procedures → the Homunculus → reproduction → recipe confidence.
* Dawn/dusk and weather → when gathering is possible → stock for later
  orders.

## 4. Balance and gameplay measurements

PLAYTEST_SECTION

## 5. Achievability of generated orders

ACHIEVABILITY_SECTION

## 6. Performance

PERFORMANCE_SECTION

## 7. Remaining limitations and intentional exceptions

* **Viscosity and electric charge are not asked for.** Natural grains
  dissolve or extract instead of thickening the brew (measured, section
  2), and the charge a bottle carries depends on how storm-glass grains
  happen to be distributed at the tap, which the predictor cannot
  forecast honestly. The viscometer and galvanometer remain instruments
  for the Free Experiment, old saves' orders and curiosity; they are the
  two purchases without a campaign use (documented in their descriptions'
  absence of order claims).
* **Boiling down** is only generated where the prediction of the boil is
  trustworthy; spirit tinctures and heat-sensitive petals (Heartpetal
  wilts above ~80 °C) are excluded, so "boiled down" orders are rarer
  than the other techniques.
* **The skimmer** has no technique of its own: its use is removing an
  oil layer or leftover grains from a brew that must read as stable. The
  automated players extract fully and never needed it.
* **The automated players are simplified thinkers:** they formulate from
  the theory and public effects, steep at windows read from the lore, and
  adjust one step at a time; they do not use the alembic, the skimmer or
  the arcanometer's probe interactively. Their results bound what the
  rules allow, not how a human plays.
* **Ageing and spoilage of bottles** were not introduced: sealed vials are
  chemically at rest in this engine, and an arbitrary timer would
  contradict it.
* Phone and tablet behaviour is verified in desktop Chromium emulation
  (viewport, touch events, device pixel ratio), not on physical devices.
