# Gameplay architecture

How the game is put together after the gameplay-purpose refactor: the loop
every feature serves, the four layers and their contracts, how physics
becomes magic and magic becomes a customer's verdict, the equipment and
what each piece is for, the line between gameplay physics and immersion
physics, and how a new mechanic should be added. The evidence behind the
choices is in `docs/GAMEPLAY_PURPOSE_AUDIT.md`.

## 1. The loop

```
customer need → ingredient selection → preparation → extraction and
transformation → balancing → experimentation → bottling → sale →
feedback and progression
```

| Step | What the player decides | Where it lives |
|---|---|---|
| Customer need | Take the order or decline; read what it takes | `game/commissions.js`, `ui/views/counter.js` |
| Ingredient selection | Which natural herbs carry the wanted effects and which cancel their side effects; gather (where, when, how carefully) or buy | `materials/wild.js`, `game/gathering.js`, `ui/views/wilds.js` |
| Preparation | Grind or crush; which solvent; what goes in before the steep | `simulation/emitter.js`, `simulation/tools.js` |
| Extraction and transformation | How hot to steep and how long; cold steeps; keeping petals from spoiling; awakening past the arcane threshold | `reactions/reactions.js`, `simulation/arcane.js` |
| Balancing | Stir; add a neutraliser; dilute; boil down | `reactions/diffusion.js`, `simulation/phase.js` |
| Experimentation | Doses, sizes and rabbits; when to purge | `game/experiments.js`, `game/colony.js`, `ui/views/trials.js` |
| Bottling | How much, to the counter or the shelves, at what temperature | `game/vial.js`, `ui/lab.js` |
| Sale | What the label claims, what price to ask | `game/commerce.js`, `ui/trade.js` |
| Feedback and progression | Settle verdicts; buy equipment; save recipes | `game/state.js`, `game/patrons.js`, `game/recipes.js` |

Every mechanic in `game/mechanics.js` names the step it belongs to; every
piece of equipment names the mechanics it serves; every technique a
customer may ask for names its mechanic.

## 2. Layers and contracts

```
 simulation  ──matter──▶  alchemy  ──effects──▶  gameplay rules  ──state──▶  presentation
 (particles,              (extraction,           (commissions,               (rooms, tools,
  heat, phases,            reactions'             evaluation,                 readings the
  mixing, tools)           products, laws,        evidence, commerce,         player may have,
                           awakening)             recipes, economy)           feedback)
```

**Physical simulation** (`src/simulation`, `src/reactions`) owns the
behaviour of matter: particles in five phases, heat, phase changes,
diffusion and stirring, reactions, evaporation and condensation, charge,
the lid, the tap, the tools. It knows nothing of customers, coins or
equipment beyond the furnace limits it is given (`sim.furnace`). Its only
outputs are particles and events (`sim.events`: pours, phase changes,
reactions, awakenings…).

**Alchemical outcome** (`src/alchemy`, `src/materials`) turns matter into
magic: `effects.js` computes the effects of each particle from what is
dissolved in it (extraction), applies the world's hidden laws and the
universal oppositions (fire–frost, life–death, life–poison, acid–alkali)
inside that particle, then saturates; `arcane.js` defines thresholds and
awakened species. The same functions serve the simulation's measurements,
the predictor and the guild theory, so there is one formula for each law.

**Gameplay rules** (`src/game`) decide why an outcome matters:
commissions, evaluation, evidence, commerce, recipes, equipment,
progression and saves. They read the simulation only through
`measure.js` (`measureParticles`, `tapSelection`) and the predictor.

**Presentation** (`src/ui`, `src/rendering`) shows the simulation and the
rules, and only what the player may know: effects never come from the
brew's hidden truth, only from trials; physical readings are words in the
campaign ("like water", "evenly mixed") and numbers in the Free
Experiment.

Contracts between them:

| Contract | Producer → consumer | Guarantee |
|---|---|---|
| `measureParticles(sim, indices)` | simulation → rules | The physical and magical state of real particles (what a bottle holds) |
| `tapSelection(sim, n)` | simulation → rules | Exactly the particles bottling would draw |
| `predictPlan(world, lookup, plan)` | alchemy → rules | The outcome of a plan with the same mixture, reaction and effect laws as the simulation (supported range below) |
| `evaluatePotion(com, m)` | rules | One scoring for the counter, the planner and the playtests |
| `certification(trials, batch, effects)` / `summarize(samples)` | rules → presentation | Estimates built from readings and public noise figures only; the hidden truth is used only to detect drift |
| `requirementEvidence(req, sum)` | rules → presentation | What the trials can and cannot say about a requirement |
| `capabilities(equipment)` | rules → simulation | Furnace limits, vessel, storage, hutch and shelf sizes |
| `compareRecipe(recipe, parts, steps)` | rules | Formulation, procedure and reproduction kept apart |

**The predictor's supported range.** `predictPlan` assumes a well-mixed
brew that reaches its temperatures. The planner only uses it inside that
range: steeps are held well inside their windows (a hot window's cool edge
lags, a cold window's warm edge), boil-downs only where boiling starts no
new reaction and does not change the awakening, cold steeps only where the
equipment holds them and never frozen. Within it, generated orders brewed
in the real cauldron pass (`scripts/achievability.mjs`).

## 3. From physics to magic to a customer's verdict

1. **Preparation decides availability.** A whole herb is a rigid solid
   that barely leaches (`LEACH_WET`); ground or crushed, it is a powder
   that dissolves up to its solubility, which rises with heat.
2. **Steeping is chemistry.** Inside an ingredient's window its reaction
   turns the raw herb into a liquid extract that carries all of its
   effects in solution (`rw_extract_*`, `rw_infuse_*`, `rw_steep_*`);
   outside it, only solubility acts. Cold windows exist (Frostcap, Grave
   Moss); some reactions spoil (Heartpetal wilts into a poison).
3. **Mixing decides what meets.** Effects are computed per particle, so
   a neutraliser cancels only what it has mixed with, and an unstirred
   batch pours unevenly.
4. **Awakening is chemistry too.** Past the blend's threshold each
   magical species becomes its awakened species, ×2–3 stronger.
5. **Volume decides concentration.** Boiling with the lid open removes
   the most volatile liquid; everything that stays grows stronger, side
   effects included. Water does the opposite.
6. **The customer judges outcomes.** `evaluatePotion` scores the effects
   (minimums, alkaline maximums, or a band for exacting masters), purity
   (no other effect above 1.2 % unless tolerated) and the quantity.
   Nothing else — not even the serving temperature.
7. **Trust comes from evidence.** At the counter the customer sees only
   the label; how much they pay depends on how well the trials back it
   (`commerce.js trustReport`), and the next day they judge the real
   potion.

## 4. Commissions

`generateCommission` picks a request (`requests.js`: who wants which
effects and why), a strength for the tier, and searches a hidden plan from
the ingredients the shop can gather, hold or buy today, balancing carriers
against helpers on the opposing pairs. The plan is predicted, adjusted
particle by particle, and must pass `evaluatePotion` before the customer
may ask. Plain plans first; awakened plans when the strength is beyond
sleeping magic (Adept and up). Techniques (`TECHNIQUES`) then add to it:

| Technique | Mechanic | From tier | What it asks | Ways to meet it |
|---|---|---|---|---|
| Strong and compact | concentration | 2 | A strength beyond what a plain brew of the plan gives | Boil water off (lid open), use more herb, awaken |

Customers judge results, never procedures: any way that meets the
requirements is paid the same. The hidden plan is only one proof that the
order is possible.

## 5. Equipment

| Item | Price, rank | Purpose | Mechanics |
|---|---|---|---|
| Stone Hearth | start | Every steep, boil and heat-awakening | steeping, concentration, awakening |
| Cold-Water Basin | start | Brews to ~9 °C: most ice-cold steeps, chilled serving | cold extraction, serving |
| Iron Pot | start | 1.5 L | batch |
| Oak Spoon | start | Stirring | mixing |
| Stone Mortar | start | Grinding before pouring | extraction |
| Granite Pestle | start | Crushing in the pot, frozen blocks | extraction |
| Mercury Thermometer | start | Every temperature | steeping, serving |
| Forager's Kit | 60, Apprentice | Full harvests of roots, seams, mosses and dust | gathering |
| Bottle Shelf → Potion Cabinet → Bottle Cellar | 40 / 150 / 420 | 6 / 12 / 24 bottles | storage |
| Forager's Satchel | 80, Journeyman | +50 % per harvest | gathering |
| Frost Rune Plate | 150, Journeyman | Brews to −14 °C: narrow cold windows, Moonfen awakenings, freezing | cold extraction, awakening |
| Clockwork Stirrer | 110, Journeyman | Unattended, three times faster mixing: consistent batches | mixing |
| Arcanometer | 200, Journeyman | Auras and arcane thresholds of the probed brew | awakening, experimentation |
| Subject Kennel → Rabbit Warren | 60 / 180 | 6 / 10 rabbits, cheaper rabbits | experimentation |
| Purging Still | 150, Journeyman | Purges at 1 coin | experimentation |
| Copper Cauldron | 320, Adept | 2.2 L: contracts, several bottles per batch | batch |
| Guild Charter | 400, Adept | −15 %, a contract every day | commerce |
| Glacial Sigil | 750, Expert | Brews to −48 °C: the deepest cold awakenings | awakening, cold extraction |
| Brass Homunculus | 1100, Expert | Replays recorded procedures | automation |
| Grand Athanor Vessel | 1800, Master | 3 L | batch |

Retired items and what their owners received are listed in
`equipment.js RETIRED_EQUIPMENT`; `state.js migrate()` applies them once,
when a version-5 save is loaded.

## 6. Gameplay physics and immersion physics

| Gameplay (the campaign relies on it) | Supporting (explains or enables) | Immersion only (simulated, visible, never asked, scored or sold) |
|---|---|---|
| Extraction and grinding, steeping windows, cold extraction, heat damage, reactions, awakening, neutralisation, concentration and dilution | Mixing (consistency, contact, dissolution), colour as feedback, glow, evenness advice, density (layering) | Layering and separation, viscosity, pastes and doughs, electric charge and sparks, freezing and melting, vapour and condensation, fire, bubbles |

The Free Experiment shows everything (`mechanics.js SANDBOX_CONTROLS`):
the skimmer, the alembic and its receiver, the heat map, a hotter furnace,
and the exact readings of density, viscosity, stability, volatility and
charge. In the campaign the same code paths stay in the engine, but no
control, reading or requirement exposes them (`lab.js` checks
`this.sandbox`).

## 7. Experiments, evidence and hidden knowledge

* A rabbit reads every effect with a hidden lifelong bias and a per-dose
  noise; absent effects read nothing. `summarize` pools readings into a
  mean, the spread seen, and a ~95 % margin built from public noise
  figures only; `effectEvidence` names the state (untested, not detected
  with how strong it could still be, detected once, measured repeatedly,
  corroborated) and whether the margin lies within, outside or across what
  an order asks.
* Labels fill themselves from the trials of the batch; bottles of one
  batch share them, each checked against its own contents.
* Nothing in the interface reads a brew's hidden effects, an ingredient's
  hidden threshold or window, or the world's laws, until the player has
  observed them (journal) or measured them (trials, arcanometer). The
  automated players (`scripts/lib/player.mjs`) follow the same rule, and
  a test checks their source.

## 8. Recipes and automation

A saved recipe keeps its **formulation** (ingredients and amounts), its
**procedure** (ordered steps from the brew's trace: pours whole or ground,
crushing, stirring, temperature holds with any boil-down loss, the lid,
the serving temperature) and its **reproduction** record (trials of later
batches that followed the procedure agreed or not). `compareRecipe`
compares what changes the potion; the Homunculus (`autobrew.js` step
mode) replays every supported step in the real cauldron, boiling down to
the recorded share, and names what it cannot do (the skimming or
distilling of recipes saved before v6). Approximate recipes say why.

## 9. Adding a mechanic

1. **Prove it in the simulation first.** Add a comparison to
   `scripts/experiments.mjs`: the same problem with and without the
   technique, on several worlds. If the difference is not large and
   reproducible, it is immersion, not a mechanic.
2. **Name it** in `game/mechanics.js`: its decision, consequence,
   objective, feedback, the loop step and the rank the campaign relies on
   it from.
3. **Give the player a way to see it** (lore, brew advice, a journal
   entry, a reading) before anything depends on it.
4. **Only if a customer can fairly judge the outcome,** add a technique to
   `TECHNIQUES`: `apply()` changes the hidden plan and returns the
   requirement; keep it inside the predictor's supported range, or extend
   `predictPlan` and verify it against the real simulation in
   `scripts/achievability.mjs`.
5. **Equipment** that enables it goes into `EQUIPMENT` with the mechanics
   it serves and an `effect` that `capabilities()` turns into a physical
   limit; the planner reads the limit from `ctx.cap`.
6. **Recipes:** if the operation changes the potion, record it in
   `buildProcedure`, compare it in `procedureShape`, and replay it in
   `AutoBrewer.tickStep`.
7. **Tests:** `tests/purpose.test.mjs` checks that every item and
   technique names a mechanic; add the experiment's comparison there.
