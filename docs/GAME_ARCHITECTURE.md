# Game architecture

> The gameplay layer was refactored in v2.3 (`docs/GAMEPLAY_ARCHITECTURE.md`
> is the reference for the loop, the layers' contracts, the equipment and
> how to add a mechanic; `docs/GAMEPLAY_PURPOSE_AUDIT.md` has the
> evidence). This document describes the engine and modules; its gameplay
> sections below are updated to match.

The Alchemist's Shop is a static web app made of native ES modules (about
13,700 lines in 59 modules) with no runtime dependencies. In development the
browser loads `src/` directly; `scripts/build.mjs` bundles it into one
fingerprinted script for production.

```
                ┌──────────────────────────── ui/ ─────────────────────────────┐
                │ app (screens, settings) · menu · lab (shell + Brew room) ·   │
 input ────────▶│ views/ counter · wilds · trials · book · panels · tutorial · │
                │ dom helpers · icons                                          │
                └───────┬───────────────────────────┬──────────────────┬───────┘
                        │ actions                   │ frame            │ events
                ┌───────▼──────────┐       ┌────────▼───────┐   ┌──────▼───────┐
                │ game/            │       │ rendering/     │   │ audio/       │
                │ state, economy,  │       │ renderer, fluid│   │ WebAudio     │
                │ commissions,     │       │ art, effects,  │   │ synthesis    │
                │ measure, scoring,│       │ portraits,     │   └──────────────┘
                │ experiments,     │       │ scenes         │
                │ gathering        │       └────────▲───────┘
                └───────┬──────────┘                │ reads particles
                        │ brews in / measures       │
                ┌───────▼───────────────────────────┴───────┐
                │ simulation/  (the particle world)          │
                │ world · grid · cauldron · tools · emitter ·│
                │ thermal · electric · phase · rigid ·       │
                │ derived · snapshot                         │
                └───────┬───────────────────────────────────┘
                        │ composition, mixture laws, reactions, effects
                ┌───────▼──────────┐   ┌───────────────────┐   ┌──────────────┐
                │ reactions/       │◀──│ materials/        │──▶│ alchemy/     │
                │ species, mixture,│   │ schema, generator,│   │ effects:     │
                │ diffusion, rules │   │ profiles, wild,   │   │ extraction,  │
                │                  │   │ names, reference  │   │ laws, theory │
                └──────────────────┘   └───────────────────┘   └──────────────┘
```

Dependencies point downward only. The simulation knows nothing about
customers or screens, and the game layer brews and measures through the
same public simulation API the UI uses. That lets the test suite and the
balancing tools run the real game rules headlessly in Node.

## 1. Materials and the procedural world (`src/materials/`)

* **`schema.js`** defines a material: form (liquid, powder, solid, gas),
  colour and tint, opacity, density, viscosity and its temperature
  dependence, thermal conductivity and heat capacity, melting and boiling
  points with latent heats, expansion, compatibility coordinates
  (miscibility), friction and binder strength (powders), solubility,
  flammability, ignition point and combustion heat, smoke and ash products,
  glow, a 10-channel **effect vector** (vitality, strength, love, arcana,
  transformation, fire, frost, acidity, toxicity, death), electrical
  conductivity and an initial charge.
* **`generator.js`** builds a world from a seed with the project's own
  seeded RNG (`core/rng.js`, so a seed always gives the same world). Fixed
  *roles* (spring water, an oil, a syrup, a spirit, two coloured essences,
  a binding meal, a soluble salt, then higher-tier reagents up to phoenix
  cinders and void ink) keep every world playable. Their properties,
  colours and names vary per seed. It also generates a dozen reactions
  (mix, contact and decompose kinds) between the world's reagents.
* **`profiles.js`** gives every generated reagent its effect vector and
  electrical properties from its role, jittered by a hash of the seed and
  id (not the generator's RNG), so existing seeds keep their reagents and
  an old save's embedded world upgrades to exactly what a fresh world of
  that seed gets.
* **`wild.js`** defines 19 wild raw ingredients (roots, leaves, flowers,
  mushrooms, minerals, magical crystals and mosses) for six regions, most
  supplied *whole* as rigid chunks that must be crushed or ground before
  anything dissolves; their wet-only steeping reactions; and the world's
  hidden **resonance laws** (below). All of it comes from separate RNG
  streams so it never changes the base reagents of a seed.
* **`names.js`** composes themed names ("Frostmere Spring Water",
  "Foxfire Dragon Resin").
* **`reference.js`** holds a fixed material set used by the physics tests
  and the menu backdrop.

## 2. Composition and mixture laws (`src/reactions/`)

Every particle has the same volume (5 ml) and carries a composition
vector: volume fractions over up to 16 species slots (`species.js` maps
material ids to slots and keeps per-slot property arrays).

* **`mixture.js`** holds the shared mixture laws, used by both the live
  simulation and the commission predictor. Density, heat capacity and
  conductivity mix linearly by volume. Viscosity mixes logarithmically and
  is raised by undissolved solids through a suspension law; binder powders
  drive the paste regime. Undissolved solids are tracked as a granular
  fraction (solubility depends on temperature). Freezing point is
  depressed by dissolved solutes.
* **Colour** uses Beer–Lambert absorption. Each species contributes
  absorbance (−ln of its transmittance, scaled by tint), absorbances add by
  concentration, and the result is converted back to sRGB. Mixing blue and
  yellow essences therefore gives green, and a strong dye dominates a pale
  one. Colour distances for scoring use OKLab ΔE.
* **`compatibility.js`** decides miscibility from two compatibility
  coordinates per material: water and oil never blend, spirits blend with
  water.
* **`diffusion.js`** handles contact diffusion, which is how mixing becomes
  visible. Composition is exchanged only between touching, compatible
  particles and symmetrically, so the amount of each species is conserved
  exactly. The exchange rate rises with temperature, falls with viscosity,
  and is multiplied by local shear measured from real particle velocities.
  This is why stirring mixes dramatically faster and leaves swirls. Powders
  wet only at their surface unless kneaded; binder powders turn into dough.
* **`reactions.js`** runs reactions only where the reactants actually
  meet: inside one particle once diffusion has mixed them (mix and
  decompose rules) or across touching particles (contact rules). Rates
  depend on temperature windows and agitation, and reaction heat warms the
  reacting particle. Combustion is built in. Flammable matter above its
  ignition point burns where it is exposed to air (a free surface or
  vapour) and while oxygen lasts. Flames share their heat with nearby
  matter, so a fire creeps across warm fuel. Fuel touching glowing iron
  ignites. A closed lid stops air coming in and the fire uses up the oxygen
  inside.

### Effects (`src/alchemy/effects.js`)

What a potion *does* is never looked up from a recipe. It is computed from
the matter actually drunk, particle by particle:

1. **Extraction.** A species acts only in solution. Undissolved grains
   leach 12% of their potency, dry powder 5%. Solubility rises with heat,
   so grinding, stirring and hot water all change the result.
2. **Resonance laws** (hidden; six per world, on distinct effect pairs).
   Two effects meeting inside one particle can *transmute* into a third,
   *catalyse* or *suppress* one another above a threshold. A layered brew
   and a stirred one differ. The amount each law moved is traced so trials
   can discover it.
3. **Oppositions** (known to every guild alchemist): fire/frost,
   vitality/death, vitality neutralises toxicity, acids and alkalis
   neutralise (acidity is signed).
4. **Saturation** above 40: diminishing returns.

Effect values are **percent effective concentration** (0–100, acidity
signed): 100 would be a pure, fully extracted, fully potent reagent.
Sleeping (unawakened) magic is weak — most native potencies are 6–30 — so
everyday orders sit around 8–15 % and the strongest ones need awakening.
Extraction only counts liquids that mix with the solvent (an oil does not
dissolve a crystal sitting in a water brew).

Reactions, evaporation and dilution change the composition, so they change
effects through the same function. `theoryOf()` is the player's naive
prediction (volumes simply add, plus the laws they have confirmed), shown
next to every observation so surprises point at hidden laws.

### Arcane activation (`src/alchemy/arcane.js`, `src/simulation/arcane.js`)

Every magical material carries a hidden **arcane threshold** on an
abstract −1000…+1000 scale and a **gain**. The scale maps linearly onto
the simulation's temperatures, `T = 20 °C + 0.1 · threshold` (+800 → 100 °C,
−1000 → −80 °C). The threshold of a mixture is the volume-weighted mean of
the thresholds of the unawakened magical substances in it, so −1000 × 1
part with +800 × 2 parts gives +200 → 40 °C; hot-waking and cold-waking
ingredients pull each other toward room temperature.

Awakening is chemistry, not a flag. The awakened form of `X` is its own
species `X~a` — the same physical substance with effects × gain and a
brighter glow — resolved on demand by the world lookup (`withAwakened`).
Every other step, each particle holding unawakened magic compares its
temperature with its *own* effective threshold; past it, the magical slots
convert into their awakened slots at a first-order rate that grows with how
far past the threshold the particle is. Heating-driven awakening draws a
little heat in and cold-driven awakening gives some back (booked in `eph`,
so the energy balance still closes). Because it is composition, mixing,
reactions (which treat `X~a` as `X` and yield awakened products in
proportion), measurement, bottling, vials, snapshots and saves carry it
with no special cases, and it never reverts by itself. The amount
activated is proportional to the magical matter present; a half-mixed
brew awakens unevenly.

Each particle's **glow** is an emission colour computed in `derived.js`
from the effects it carries (magic weighs more than chemistry), splatted by
`fluid.js` as coloured light (screen-blended emission plus a half-resolution
halo), so concentration and awakening are visible. Thresholds never appear
in the UI: the journal records the temperature where an ingredient was
seen to awaken, and the Arcanometer instrument reads a brew's threshold to
the nearest 50.

`predict.js` models activation for the guild theory and for commission
planning: `arcaneRegime` tells whether a set of stage temperatures keeps
every local mixture asleep ("quiet"), wakes it fully, or would wake part
of it; preparation stages must be quiet and activation is a separate stage
after mixing.

## 3. The particle world (`src/simulation/`)

### Step order (`world.js`, fixed 1/120 s step)

1. `emitter`: pouring streams add particles at the rim.
2. Refresh derived properties for particles whose composition changed,
   plus a rolling refresh (about 10 Hz) for temperature-dependent ones
   (`derived.js`).
3. Choose each particle's **solver mode** from its phase and rheology.
4. Forces: gravity with a Boussinesq buoyancy term relative to the local
   fluid density; gas buoyancy against air (ideal-gas temperature
   dependence), Brownian jitter and drag. Tool forces (the spoon's stirring
   field, radius 0.42 units).
5. Predict positions; build neighbour pairs on a uniform grid (`grid.js`,
   linear time).
6. **3 constraint iterations:** fluid density constraints, granular and
   cohesive contacts, tool colliders (spoon bowl, pestle head), the
   cauldron boundary (signed distance field with lid, `cauldron.js`), and
   rigid shape matching (`rigid.js`).
7. Update velocities; XSPH-style viscosity and viscous smoothing; sleep
   resting grains.
8. Percolation: steam trapped in paste or powder trades places with the
   matter above it.
9. Every second step: heat transport (`thermal.js`), electric conduction
   (`electric.js`), contact diffusion, reactions and combustion, phase
   changes (`phase.js`), oxygen exchange.
10. Venting: vapour leaving an open cauldron is removed and accounted for.

### Solver modes

| Mode | Used for | Behaviour |
|---|---|---|
| PBF | thin liquids | position-based fluid density constraint (incompressible); corrections weighted by inverse mass ∝ ρ⁻², so heavy liquids sink and light ones float; artificial-pressure term against clumping; mild surface tension |
| GRAN | powders, crushed grains | hard contacts with position-level static and kinetic Coulomb friction (angle of repose), no rebound, height-based mass scaling for stable stacks, sleeping |
| COH | pastes, doughs, very viscous liquids (≥150 cP) | contacts plus cohesion just beyond contact and dashpot damping; pastes add Coulomb friction as a yield stress, so they hold mounds until pushed |
| RIGID | frozen material | contacts plus shape matching (Müller et al.): a block moves as one body; union-find over contacts forms bodies, and cracking or melting splits them |
| GAS | vapour and smoke | weak repulsive pressure, buoyancy, jitter and drag; the lid contains it |

### Heat and phases

* `thermal.js` conducts heat between particle pairs (harmonic mean of
  conductivities, antisymmetric, so energy is conserved). It also exchanges
  heat between particles and a ring of iron wall cells plus lid cells, and
  conducts heat along the iron. The furnace heats (or the frost plate
  cools) the cells under the bottom, and air at free surfaces takes a
  little heat away. Furnace input and ambient losses are tracked, and a
  test checks the energy balance.
* `phase.js` handles transitions with **latent heat**. Crossing a melting
  or boiling point stores the excess heat until the full latent heat is
  absorbed, so boiling and freezing start where the temperature first
  crosses the threshold and spread with the heat. Vapour condenses on cool
  iron or when saturated. **Drying:** a wet paste or syrup above the
  boiling point of its volatile part stays at that temperature while water
  gathers into the hottest particles (equal-volume composition exchanges,
  so mass is conserved) and steams off, leaving the solids behind. Liquid,
  paste and powder are reclassified from the undissolved-solids fraction,
  with hysteresis.

### Electricity (`electric.js`)

Every particle carries a charge `q`. Charged reagents (embers, starlight,
phoenix cinders, storm glass carry positive charge; void ink negative)
bring charge when poured; it flows between touching
particles in proportion to their conductance (metal ≫ brine ≫ water ≫ oil),
so a conductive brew spreads it and an oil layer insulates. Exchanges are
pairwise and antisymmetric (total charge is conserved exactly). Current
through a resistive contact heats both particles (Joule heating, counted as
energy input), and a large potential step across a good contact sparks. A
neutral brew costs one scan per step.

### Tools (`tools.js`)

The spoon has a velocity-field stirring zone (radius 0.42) and a physical
bowl collider. The pestle has a heavy head; it crushes rigid frozen bodies
and crystals into grains when struck hard enough. The skimmer (a Free
Experiment tool since v2.3) removes matter and counts what it lifted. Tool motion is sub-stepped along the pointer path, so fast strokes
can't jump through the brew. Tools can never push matter through the
walls (tested).

### Snapshots (`snapshot.js`)

The full cauldron state (particles, compositions, temperatures, charges,
rigid bodies, wall temperatures, lid, oxygen) serialises to compact JSON
for saves; a test checks that the state round-trips. Snapshot version 2
adds charge; a version-1 snapshot from a larger old vessel is remapped
into the new vessel's shape instead of being dropped.

## 4. Game layer (`src/game/`)

* **`state.js` (`GameState`)** holds the whole save: seed and embedded
  world, coins, reputation and rank, day and customer index, inventory and
  shelf limits, equipment, journal, knowledge, recipes, history,
  achievements, statistics, market day, tutorial progress, the cauldron
  snapshot, the current batch (id and revision), the sealed vial, the
  bottles on the potion shelves (`bottles`: vials with their exact
  particles, at most `cap.bottles` of them — 3, then 6, 12 and 24 with the
  Bottle Shelf, Potion Cabinet and Bottle Cellar; `shelveBottle`,
  `takeBottle` swaps a shelved bottle with the counter's vial,
  `removeBottle`), the trials state, the wilds' deposit stocks, whether the
  shop door has been opened today (`opened`, the day's clock) and the
  returning customers (`patrons`). It handles buying and selling — `buy`
  goes through `canBuy`, which refuses gather-only finds, rabbit remains,
  reaction products, the retired prepared reagents and herbs above the
  shop's rank, exactly as the market panel does — equipment, sales and
  reputation, rank-ups, end of day, market events and a once-a-day
  stipend that makes a run impossible to lose. `toJSON` / `fromJSON` run
  through `migrate()`, which upgrades older save versions and regenerates
  a missing embedded world from the seed. Save version 5 adds the day
  clock (a save with a customer waiting counts as open), the patrons, and
  turns saved recipes into procedures (older ones become approximate steps,
  marked as such). `shareEvidence` lets every bottle of one batch and
  revision carry that batch's trials, each checked against the bottle's own
  contents. `supplyOf` is what the shop can lay hands on today without
  buying (shelf plus careful harvests of reachable deposits, by method,
  tool, hour and weather), and `nextCustomer` never stalls the day: an
  order that cannot be generated falls back to easier tiers and the
  plainest single-effect order, and a customer the shop could not serve at
  all simply does not come in. Save version 4 turns the single
  Moon Rabbit into the founder of a colony (its health, marks, death and
  trial history kept; a companion joins) and defaults the commerce fields;
  the conversion is driven by the data's shape inside `normalizeTrials`, so
  the unversioned sandbox store is repaired the same way, and a genuine v3
  save is part of the tests. Save version 3 adds effects,
  trials, gathering, batches and the vial; a version-2 save keeps every
  coin, recipe and journal entry, its embedded world gains the effect
  profiles a fresh world of that seed would have, and a pending order is
  rewritten in effect terms (`migrateCommission`). A test loads a genuine
  v2 save produced by the previous release. A save from a newer version,
  or a damaged one, is refused with a message, never silently reset.
* **`requests.js`** holds 20 narrative request templates (healing,
  strength, love, warming, cooling, insight, change, settling, etching,
  bane, expedition, hearth, recovery, meditation, forgefire, blessing,
  shapeshift, fever cure, warpath, starseer), each with the effects it
  wants, the stories customers tell, the tier where it appears, and the
  tier targets: beginner orders want about 8–15 % effective
  concentration, rising with tier, and advanced ones can only be met with
  awakened magic. `PURITY_LIMIT = 1.2`: an order with a purity rule
  allows no unwanted effect above 1.2 %.
* **Natural ingredients only.** The shop stocks just the three plain
  solvents (water, oil, spirit — no effects); the prepared reagents the
  generator still makes (essences, salts, crystals…) are kept in the world
  for the physics and appear only on the Free Experiment's shelf
  (`LAB_ROLES`, `sandboxIngredients`). Every effect comes from the 36 wild
  ingredients (`materials/wild.js`), and each carries a main effect plus
  side effects that sit only on the universal opposing pairs (fire/frost,
  life/death with life mending poison 2:1, acid/alkali) — never both halves
  of one pair — so any order can be balanced. Extracts keep the raw
  ingredient's whole profile: steeping never purifies, only mixing with an
  opposite does. A few delicate ingredients (Heartpetal) cannot awaken, and
  spoiled matter loses its magic.
* **`commissions.js`** builds each order from a hidden **reference plan**
  for one of the request templates. The plan search (`searchPlan`) picks
  carriers of the wanted effects and balances them with helpers: each
  candidate's raw (pre-law) effects per unit share are probed with
  `predict.js` under the brew's extraction stage; on the net opposition
  channels (fire − frost, life − death − 2·poison, signed acidity and the
  unopposed effects) the problem is a convex least-squares one, solved for
  all candidates at once with exact coordinate steps; the strongest few are
  kept and polished on the full model (the world's laws, saturation,
  tolerated effects); the real plan is then predicted, the model re-probed
  where the brew actually is, and a near miss tuned particle by particle.
  An **activation stage** is added when the target needs it (only
  ingredients that wake within reach, all in one direction).

  *Practical feasibility.* Only ingredients the shop can get today enter
  the search (`obtainable`: on the shelf, gatherable now, or legally for
  sale); `checkSupply` then checks the plan's every ingredient — with
  `TEST_MARGIN` (15 %) for test doses and what sticks to the pot — against
  shelf, wilds and market, and the purchases against the purse. A plan
  that fails is searched again without the missing (or dearest)
  ingredient. The order carries a **supplies brief** (`supplyBrief`): how
  much brew to make and, for each wanted effect, the ingredients that carry
  it and where they can be had today — public knowledge, never the hidden
  plan.

  *Techniques* (`TECHNIQUES`). Customers judge outcomes, never
  procedures: the effects, purity and the quantity (never the temperature
  it is served at). On top of the plain request they may ask, from Adept,
  for a brew **strong and
  compact** — a strength beyond what a plain brew of the plan gives,
  planned with a real `reduce` stage (lid off, a quarter of the volume
  boiled away, side effects stronger too; only where the prediction of the
  boiling is trustworthy) but met by any method. Each names its mechanic
  (`mechanics.js`) and carries a one-line lesson shown with the order; a
  technique sold well for the first time is recorded as mastered (journal,
  +4 reputation). Density, viscosity, stability, volatility, charge and an
  exact colour are never asked for (`docs/GAMEPLAY_PURPOSE_AUDIT.md`).
  Cold steeps are planned only where the equipment holds them (the basin
  about 9 °C, a cold plate just above freezing).

  *Variety and progression.* Requests sold in the last three sales are
  avoided when there is anything else; the same order again and again
  earns less reputation (`patrons.js noveltyFactor`: 70 % for the third of
  six, 50 % beyond). Plans are kept only if the predicted potion scores
  full marks with `evaluatePotion` (the same function the counter uses). `scripts/achievability.mjs` brews generated
  orders' plans — every technique, every tier — in the real simulation for
  *realistic* shops (the equipment a player of that rank typically owns, a
  modest purse) and fully equipped ones (`autobrew.js`, stages pour → crush
  → stir → steep → heat/chill → hold → reduce → serve;
  recorded procedures replay step by step, boil-downs to the share that
  boiled away).
* **`patrons.js`** remembers customers by name: visits, potions that
  worked, fair complaints and a trust between −1 and 1. A share of
  customer slots goes to a returning patron (`returningPatron`), who keeps
  their face and temperament but adjusts it by history (`welcomePatron`):
  trust lowers the proof they need and their haggling and raises their
  purse; a burned patron opens with what went wrong and wants proof; one
  let down badly enough stays away.
* **`recipes.js`** makes recipes procedures. The lab keeps a coarse trace
  of every brew (one sample a second: mean temperature, stirring,
  crushing, the lid) beside the pour, skim and distil events;
  `buildProcedure` compresses it into ordered steps (pour, stir, crush,
  temp = bring to a temperature and hold, lid, skim, distil, serve).
  `matchRecipe` decides whether a batch follows a recipe: the same
  ingredients within 5 ml *and* the same heating and cooling stages
  (within 10 °C) — the same ingredients prepared differently only share a
  shopping list. `checkReproduction` compares a re-brewed, tested batch
  with what the recipe recorded (within the combined margins), once per
  batch, and `recipeConfidence` reads untested → tested → reproduced (or
  unreliable). The homunculus replays the steps (`autobrew.js` step mode);
  it cannot skim or distil, and a recipe says so.
* **`customers.js`** has 12 archetypes (farmer, innkeeper, bard, healer,
  knight, traveller, scholar, hedge witch, blacksmith, noble, wizard,
  hunter), each with preferred styles, properties they care about, budget,
  strictness, the rank at which they start visiting, a procedural pixel
  portrait and dialogue. Each customer also has a **persona**: how hard
  they haggle, how many rounds of bargaining they tolerate, how honest they
  are afterwards, and how much proof they need before trusting a label.
* **`commerce.js`** is the trade around a bottle:
  * *Identification.* Before selling, the player writes the label: for each
    effect a value measured in a trial of this very batch, an estimate from
    the guild theory (marked as such, with its spread), "none" (below
    1.2 %) or unknown. The game never fills in hidden truth; trials of the
    vial fill in tested values, and claims the player wrote stay theirs.
  * *Negotiation.* The customer scores the label against the order with
    `evaluatePotion` (what they can see — colour, temperature, thickness —
    is real; the effects are the label's), weighs trust (trial evidence,
    reputation, unknowns, how much proof they need — each tested claim
    counting by its evidence level: one reading 45 %, repeated 70 %,
    corroborated 90 %, certified 100 %), the volume and their
    temperament, and bargains over several rounds toward a hidden limit:
    counter-offers concede part of the gap, greed costs patience and can
    end the talks, and a demanding customer will not buy without the proof
    they need (`proofGaps`): a customer who insists on proof wants the
    wanted effects tested more than once, the most exacting want them read
    on two rabbits, and with a purity rule every other effect tested (one
    trial reads them all). The opening comes with the reasons the customer
    weighs (`reasons`: fit, trust and why, measure, temper, history) — the
    reservation price itself stays hidden. Stepping away keeps the talks for that bottle and label
    (and costs patience); a new label re-prices it without a fresh start.
    The agreed price is paid; how good the potion really was (its stars,
    a perfect potion, the grand commission) counts only once the customer
    reports back.
  * *Delivery.* `recordSale` evaluates the *real* potion. The next day the
    customer comes back: pleased (reputation, a tip, sometimes a referral
    who brings a better-paying order), with a **legitimate complaint** (the
    potion failed the order, the label was wrong beyond reading noise, or
    an undeclared harmful side effect), or — depending on their honesty —
    a **dishonest** one about a good potion. A harmful potion is never
    praised. The player refunds (in full, or not at all when the till is
    short), disputes (trial records of the batch are the evidence: a fair
    complaint disputed backfires, and costs more name when the shop
    cannot pay) or turns them away. Reputation can fall below zero. Unanswered visitors resolve
    at the end of the day. Sales, follow-ups and outcomes are saved.
* **`vial.js`** keeps a sealed vial as the exact particles that ran out
  of the tap — each one's composition by species id (reaction products and
  awakened forms included), temperature, charge and phase. Bottling draws
  a measured quantity; a trial dose removes real particles spread through
  the vial; pouring back returns exactly that matter (matter is conserved
  at every step, and the batch revision bumps, so earlier certification
  stops counting); a sealed vial does not react or awaken and only drifts
  toward room temperature. Its measurement is computed from what is left
  with the same function as the tap. Older saves' vials become particles
  of their mean composition.
* **`measure.js`** measures the bottle. `tapSelection` takes the particles
  closest to the tap at the bottom of the cauldron, so the lowest layer
  comes out first. `measureParticles` computes colour (Beer–Lambert, then
  OKLab), density, viscosity, temperature, magical aspects, stability
  (composition heterogeneity, immiscible blends, sediment, gas),
  volatility, charge and the hidden effect vector (with the amount each
  resonance law contributed).
* **`experiments.js`** is the trials room's rules. The Moon Rabbits of
  the colony are the only subjects (old records naming the retired beetle,
  seedling, limestone and wisp stay readable) and a rabbit shows every
  effect. `rabbitReading` turns the dose's real effects into what one
  rabbit feels and shows: scaled by that rabbit's hidden, lifelong
  sensitivity per effect (`colony.js rabbitSensitivity`, about ±18 %) and
  by a per-dose variation (wider for small doses, kits and elders); absent
  effects read as absent. Trial records keep the reading, its ± and the
  dose's real values (`tv`, read only by the drift check), the theory
  beside it, and a replay. Law discovery needs two trials where a law is
  at work. **Certification** pools every trial of this batch *and
  revision* whose real values still match the brew within max(3, 15%).
  `summarize` keeps three things apart: the mean; the spread actually seen
  between readings (sample standard deviation); and the margin of the
  mean (`unc`, ~95 %), built only from what the guild knows publicly — each
  reading's own dose noise for its size and the rabbit's visible age and
  health (`readingSteadiness`: a rabbit below half its health shakes),
  blended with the spread seen once there are several readings, plus each
  rabbit's possible bias divided by the number of *different* rabbits. One
  reading is never "±0"; repeats on one rabbit never remove its bias. The
  evidence level follows: preliminary (one reading), repeated (one
  rabbit), corroborated (two or more), certified (corroborated, at least
  three readings, a narrow margin). A sealed vial keeps its own samples,
  and bottles of the same batch share theirs (`GameState.shareEvidence`). Pouring anything bumps the revision, so
  earlier trials stop counting; drift from reactions, settling or heat is
  caught silently. The estimates become the tested claims on a label
  (`commerce.js`); an untested potion can still be offered, but customers
  trust it less and some refuse it.
* **`colony.js`** also runs the hutch in real time (`colonyTick`, called
  by the lab every half second in any room and caught up after a break):
  marks fade with a ten-minute time constant; a mark past `DEGEN_AT` (70)
  degenerates — lethal channels climb and drain health until death, feral
  channels make the rabbit strike other rabbits (`mauled`); a purging
  draught (`purgeRabbit`) clears marks and degeneration, `cullRabbit` ends
  a life on purpose, and vitality at full health raises `bonus` (the
  maximum health).
* **`colony.js`** is the hutch of Moon Rabbits (it lives in
  `trials.colony`; the other four subjects keep the single-subject model).
  Each rabbit is an individual: id, name, sex, an inherited **look** (coat
  and pattern colours, ears, size, eyes, tail, a seed), birth day and stage
  (kit → youngster → adult → elder), health capped by permanent **scar**,
  transient **marks** on eleven channels (the ten effects, acidity split
  into acid and alkali) that fade nightly by per-channel factors, hidden
  lifetime **exposure** per channel, up to five permanent **traits** grown
  when lifetime transformation crosses thresholds (ears, horns, antlers,
  a spiral horn, scales, spines, lizard or plumed tail, giant or tiny body,
  a third eye, wings — weighted by what else was in that dose), its own
  dose log and a pregnancy. `rabbitResponse` is pure: every channel acts on
  the body (opposites cancel: fire/frost, acid/alkali, vitality eases poison
  and pallor), harm by channel kills with a cause, and the young and old
  feel doses more. A trial still *reads* only the rabbit's five channels,
  with an uncertainty that grows for small doses and young or old animals.
  `colonyDay` runs at the end of each shop day: fading, lingering poison,
  recovery (faster when fed), growth, old age, births and pairing of
  healthy, unrelated adults, never beyond the hutch's room (4; kennel 6;
  Rabbit Warren 10), deterministic per seed and day. `rabbitSnap` quantises
  what can be seen (levels 0–3, scars, traits, pose) — the renderer and the
  trial replays use only that, and `rabbitCondition` describes a rabbit in
  words, so no hidden number reaches the screen. `trials.subjects.rabbit`
  stays a non-enumerable handle on the selected rabbit for older code.
* **`materials/remains.js`** turns a dead rabbit into ingredients, once:
  bones always, a pelt unless it burned (then ash), a residue if it carried
  poison, acid, lye or change. Each part is a full material (a crushable
  11-particle bone, a light flammable pelt, ash and residue powders) whose
  hidden effects saturate toward caps from the rabbit's exposure and whose
  arcane threshold follows what it carries. They join `world.materials`
  (the lookup re-indexes itself), are saved with the world, and are masked
  from the guild theory, the shop, the inspector, the book and order
  planning: only trials reveal them.
* **`gathering.js`** is the wilds: six regions with 36 ingredients (four open from the start,
  two magical ones from Adept and Expert), deposits generated from the
  seed (never saved), and per-deposit stock plus a timestamp in the save.
  Stock is resolved lazily from elapsed wall-clock time when a deposit is
  shown or gathered, so nothing runs per frame and deposits regrow while
  the game is closed. A new day lets every deposit recover half its
  capacity. Harvests respect shelf space; the satchel gathers 50% more.
  `gatherPlan` decides one harvest: the ingredient's method (pick, dig,
  chip, scrape, sweep) and whether the Forager's Kit is owned (everything
  but picking needs it — by hand, half of what is cut is spoiled);
  the part of the day, whose clock is the shop door (`dayPart`): dawn
  until the door is opened, the day while the shop is open, dusk once the
  last customer has gone until the shop closes for the night — so dawn
  flowers are gathered before trade and dusk plants after it, to stock up
  for orders to come (twilight plants out of their hour give a quarter); the day's
  weather, deterministic from seed and day (rain regrows plants overnight,
  frost shuts meadow flowers, a storm recharges crystal seams, fog keeps
  twilight plants open, a heatwave favours flowers over mosses); and care —
  a careful harvest leaves 30 % of the deposit standing, a thorough one
  takes twice as much, may strip it bare and scars it, so it regrows at
  half speed until full (the scar is saved). The plan's `eff` is the
  usable share of what is cut: a harvest draws `amount / eff` from the
  deposit, so spoiled material is gone from it too, and `harvestable`
  tells the button exactly what the next harvest will bring.
* **`evaluate.js`** scores each requirement — effects, purity, serving
  temperature (full marks within tolerance, falling linearly to zero) —
  weights them (quantity counts less), caps the score for a short bottle, and turns quality into stars,
  payment and reputation.
* **`equipment.js`** lists 23 items (7 in the starting kit, 16 for sale),
  each naming the mechanics it serves (`mechanics.js`), with ranks and
  prerequisites, and the retired items an older save is refunded for
  (`RETIRED_EQUIPMENT`). `capabilities()` folds owned items into the
  simulation's limits (flame temperature and power, coldest temperature,
  cauldron size, storage, discount, hutch and bottle shelves).
* **`journal.js`** turns simulation events (first boil, freeze, dough,
  crushing, dissolving, steeping, each reaction, fire, sparks, awakening) into journal discoveries,
  ingredient knowledge and achievements.
* **`autobrew.js`** is a controller that carries out a plan in the real
  simulation: it pours (ground in the mortar where the plan says so),
  stirs, kneads, crushes, heats and cools with feedback, holds, boils down
  with the lid off until the brew has lost its share of volume (then lets
  the steam out before the lid goes back, boiling off again what rains
  back), and adds cold ingredients after the stages. In **step mode** it
  replays a recorded procedure exactly, step by step. In the game it is the
  homunculus upgrade, which brews saved recipes. Tests and tools use it to prove orders achievable
  and to run balancing playthroughs.
* **`persistence.js`** autosaves to `localStorage` with a rolling backup,
  recovers from a damaged save, handles exporting and importing save files,
  and degrades gracefully when storage is unavailable.

## 5. Rendering (`src/rendering/`)

* **`renderer.js`** composes each frame on a 2D canvas at a chunky
  "art pixel" scale: a pre-rendered workshop backdrop and cauldron
  (`art.js`, procedural pixel art with ordered dithering), wall heat glow,
  the brew, lid, tools, pouring stream, bottle and tap, fire under the
  cauldron, flames on burning matter, steam, sparks and splashes
  (`effects.js`), and an optional thermal view.
* **`fluid.js`** draws the material at 1–2 pixel detail, independent of
  the physics resolution:
  * Liquids and pastes are splatted into a continuous weight and colour
    field and thresholded on a lightly smoothed copy, so pools are
    continuous and flat-topped and diffusion shows as smooth gradients.
    Each particle also carries a texture value that moves with the
    material.
  * Clear liquids are drawn darker and cooler, as if the iron shows
    through; opaque ones stay bright. Depth darkening, a meniscus highlight
    and a shadow line add shape.
  * Powders are drawn as speckled grain clusters, darker when damp.
  * Frozen blocks get a crisp body with a frosty rim.
  * A whole ingredient is drawn with its own surface, laid out in the
    body's frame so it tumbles with it (`materials/shapes.js` LOOK): root
    fibres, leaf veins, stone speckle, crystal facets, mushroom caps,
    glossy beans and scales, bark plates split by fissures, glossy berries,
    fungus gills, ribbed seeds, pearly shell rings, metallic bands, black
    glass glints, spotted toadstool caps, velvet reeds and froths of
    florets. Each shape also has its own 16×16 sprite (`scenes.js`).
  * Vapour is a soft fog.
  * Glowing and burning matter emits light.
* **`portraits.js`** draws procedural customer portraits.
* **`scenes.js`** paints the wilds (sky, hills, trees, rocks, water and
  the deposits' plants and minerals, with a little ambient animation),
  raw-ingredient sprites for the shelf, and the trial subjects with their
  marks (growth, glow, frost, etching, love). Static layers are cached and
  only redrawn when the region or a deposit changes.
* Effects show in the brew: a potion with a strong effect gets a faint
  aura of that effect's colour, and charged matter crackles with sparks.
* Quality presets: **High quality**, **Balanced** and **Battery saver**
  change the art-pixel size, lighting and effects; Battery saver also
  draws at 30 fps. **Automatic** (the default) steps down when frames keep
  running over budget. Physics and scores are identical in every preset.

## 6. UI (`src/ui/`)

* **`app.js`** handles settings, switching screens, and the new-game and
  free-experiment entry points.
* **`menu.js`** is the main menu, with a live simulated cauldron behind
  it.
* **`lab.js`** is the shop shell and the Brew room: a top bar, a bottom
  tab bar (a rail in landscape and on desktop) over five rooms, badges,
  and the Brew room itself: the order strip with live per-requirement
  meters, the cauldron view, the shelf (tap, long-press to inspect, or
  drag a jar onto the cauldron), dose buttons and the mortar switch, the
  fire and frost control, tools, lid, time speed, emptying, bottling into
  a sealed vial (to the counter, or onto the potion shelves while there is
  room), the brew-analysis panel, the probe and inspector, the
  thermal view and keyboard shortcuts. It owns batch identity and the
  vial (serve, discard or pour back). The simulation runs in every room
  but is drawn only in the Brew room. It runs the frame loop: physics within a
  time budget (what is left of a ~30 fps frame after rendering, 8–22 ms),
  so slow devices run the brew in slow motion instead of dropping frames.
  It also collects frame-timing statistics (`perfReport()`), used by the
  benchmark.
* **`views/`** holds the other rooms: `counter.js` (customer, full order
  with verified effects, the vial, serving, and the potion shelves: a grid
  of bottle places, each bottle taken down, poured back or discarded), `wilds.js` (regions, the
  painted scene with tappable deposits, the deposit list), `trials.js`
  (subjects, the draggable dropper, dose size and source, reports with
  theory vs observation) and `book.js` (recipes, trial log, laws,
  journal, ingredients, awards, sales).
* **`panels.js`** contains the market and guild (reagents, equipment,
  selling back), the ingredient inspector, guild advice, the result and
  day-summary dialogs, the analysis panel, the recipe book (prepare or
  hand to the homunculus), the journal (discoveries, encyclopedia,
  achievements, sales), pause, help and settings.
* **`tutorial.js`** is the guided first commission (11 steps, each
  advancing on what actually happens in the cauldron).
* The layout is CSS grid; see `docs/MOBILE_UX.md` for the per-device
  arrangements, gestures and their tap alternatives. Safe-area insets are
  respected, and touch targets are at least 44 CSS px (tested in every
  room on every device profile).

## 7. Audio (`src/audio/audio.js`)

All sound is synthesised with WebAudio, so there are no audio files.
Effects (click, pour splash, glass, coins, purchase, bell, discovery,
fanfare, crush, reaction, freeze, ignite, lid, page, failure), continuous
loops driven by the simulation (fire roar, frost hiss, stirring, pouring,
boiling) and a generative lute-like background tune. The audio context
starts on the first user gesture, as autoplay policies require. Master,
effects and music volumes, a music toggle and mute are persisted in
settings.

## 8. Build, offline and installability

* `scripts/build.mjs` has its own small bundler (no third-party tools).
  It resolves the static import graph from `src/main.js`, rejects import
  cycles and checks that every imported name is exported. It wraps each
  module in a function scope in dependency order, strips whole-line
  comments, and writes `app.<hash>.js`. It fingerprints the stylesheet,
  copies the assets and manifest, and writes `sw.js` with a versioned
  precache list of every file. Finally it zips the build into
  `release/alchemists-shop-<version>-web.zip`.
* The service worker precaches the build on the first visit. It serves
  from cache first (with background refresh) in release builds and from
  the network first in development, and deletes old caches on activation.
  The offline browser test cuts the network and plays.
* `manifest.webmanifest` and the icons make the game installable;
  `scripts/make-icons.mjs` generates the icons and `scripts/make-font.py`
  generates the pixel font.

## 9. Verification strategy

| Layer | Tool | What is checked |
|---|---|---|
| Physics | `tests/physics.test.mjs` (23 scenarios) | piles and angle of repose, sleeping, no rebound, avalanches, calm pooling, stratification without gaps, progressive mixing and the stirring speed-up, equilibrium colour, dough only with stirring and thinning, paste yield, freezing into one rigid block, crushing, conduction, boiling and condensing under the lid, gas containment, immiscibility under stirring, wall integrity, energy balance, snapshot round-trip, linear cost, fire spread, drying, hot-iron ignition and smothering |
| Game rules | `tests/game.test.mjs` (11 tests) | seeded determinism, starting reagents, day-one feasibility and affordability, achievability brewed in the real simulation, scoring, market, the no-softlock stipend, ranks, save round-trip, migration and bad files |
| Effects | `tests/alchemy.test.mjs` (8 tests) | effect vectors on every material, dilution, extraction (whole vs ground vs hot steeping), effects interacting only where substances meet, resonance laws, heat-spoiled petals, reduction by boiling, electric charge conservation, conduction, insulation and Joule heating |
| Trials and wilds | `tests/trials.test.mjs` (7 tests) | real dose consumption, what each subject reveals, certification and its invalidation by pours and drift, law discovery, lethal doses and replacement, deterministic deposits with finite stock, timestamp regrowth, rank locks and storage limits, a genuine v2 save migrating, corrupted, partial and future saves |
| Browser | `tests/browser/*.spec.mjs` (62 runs over 6 profiles) | layouts and ≥ 44 px touch targets in every room, the first commission end to end (pour, stir by touch, heat, test on a subject, bottle, serve, save and re-prepare the recipe), the certification gate, tools, jar drag-to-pour and the mortar, gathering by tap and list with persistence, dropper trials and subject replacement, shop and equipment, saves (continue, cauldron, export and import, damaged save), settings, sandbox physics, offline build, GitHub Pages sub-path build |
| Types | `tsc` with `checkJs` | `src/`, `scripts/`, `tests/` |
| Performance | `scripts/bench.mjs` | physics ms per step; in-browser fps, frame-time percentiles, physics and render split, and simulation speed |
| Balance | `scripts/playtest.mjs`, `scripts/achievability.mjs` | multi-day economy and progression; order achievability |
