# Feature parity: Fluid Pocket Sandbox → The Alchemist's Shop

This document compares the reference project
[`Ram8o211/fluid-pocket-sandbox`](https://github.com/Ram8o211/fluid-pocket-sandbox)
(main, commit `55ecaf9`, "Make potion fluids look continuous (#24)") with the
target game [`Ram8o211/Potion-Brewer-Claude-`](https://github.com/Ram8o211/Potion-Brewer-Claude-)
(main, commit `f72f200`). The audit was done on the actual source code and tests, not
on the READMEs. Both repositories were cloned and run locally, and the reference
game was played in headless Chromium at phone size.

**How it was integrated.** The target is the foundation. Its engine, chemistry,
commissions, economy, art and audio stay as they are. Where the reference
has a system the target lacks, the *idea* was re-implemented natively on the
target's own data model. Reference code was not copied, and nothing was
pasted across. This was the owner's explicit instruction during the work:
"take the ideas of the new implementations but preserve the original mechanics".

Status legend: **equivalent** · **better in target** · **better in reference** ·
**partial** (one side has part of it) · **missing** (absent in target) ·
**incompatible** (does not fit the mobile potion game as is).

The *Final status* column records what is now in the target. Each entry was
checked against the code and the tests listed under *Verification*.

---

## 0. Engine-level reconciliation (done before anything was adapted)

The two engines do not share units, so no algorithm could be carried across
as written. These differences were resolved first:

| Aspect | Reference (`src/game/brewing.mjs`, `contracts.mjs`) | Target (`src/simulation/constants.js`) | Decision |
|---|---|---|---|
| Particle volume | 0.25 ml per parcel; mass = density × 0.25; parcels shrink when partially drained | 5 ml per particle, fixed volume; composition is a volume-fraction vector over 16 species slots | Keep the target. Experiment doses and bottles are whole particles drawn from the tap. Vial doses are split as aggregate measurements, so nothing is ever duplicated. |
| Temperature | normalised "°A", room = 0.33, range 0–1.2 | °C, room = 20, latent heat in J/ml | Keep °C. Reference thresholds such as "warmth accelerates mixing" were re-expressed in °C on the target's existing laws. |
| Time step | 40 Hz collisions; transport at 10–20 Hz | 120 Hz PBF step; thermal, diffusion and reactions every second step | Keep 120 Hz. Section 7 covers the cost. |
| Material model | Each particle carries intrinsic property fields, including 8 effect fields, transported by `MixtureSolver` | Each particle carries a composition. Properties are *derived* from species tables (`derived.js`, `mixture.js`) | Keep composition. Effects are now a **species property** and are computed from local composition (section A). That makes them conserved by construction and allows non-linear interactions. |
| Axis | y up | y down (0 = cauldron mouth) | Target. |
| Cauldron | 200 / 320 / 440 ml copper bowl, convex planes | 7 / 10 / 13.5 L iron pot, exact SDF from the drawn profile | Keep the SDF. The vessels were resized to fit the volumes that orders actually need (section E). |

---

## A. Magical and chemical effects

| # | Feature | Reference implementation | Target before | Status | Functional differences | Integration strategy | Verification | Final status |
|---|---|---|---|---|---|---|---|---|
| A1 | Effect channels | `src/game/effects.mjs`, `materials/MaterialDefinition.mjs`: strength, love, death, transformation, fire, freeze, acidity, poison (0–1) | `materials/schema.js` `aspects`: vitality, ardor, arcana, fortitude (0–100) | partial | Reference has chemical channels (acidity, poison) and death/transformation; target has vitality and arcana | Unified 10-channel set in `src/alchemy/effects.js`: vitality, strength, love, arcana, transformation, fire, frost, acidity (signed: negative = alkaline), toxicity, death. Migration: ardor → fire, fortitude → strength. Every material gets an `effects` vector derived from its archetype | `tests/effects.test.mjs` | pending |
| A2 | Effects come from the actual particles | `potion.mjs` `measurePotion`: mass-weighted mean of particle effect fields | `measure.js`: volume-weighted mean of species aspects | equivalent | Both are physical | Measurement now evaluates effects **per particle**, from what is dissolved in it. Undissolved grains, frozen and gaseous matter contribute little or nothing | `tests/effects.test.mjs` (extraction, dilution, sediment) | pending |
| A3 | Non-linear mixture interactions | none: effects average linearly | only through species reactions | missing | Reference mixtures are predictable from ingredient effects alone | Universal opposition laws (fire↔frost, vitality↔death, vitality neutralises toxicity, acid↔alkali). **Per-world hidden resonances**, seeded (transmute A+B→C, catalyse, suppress), applied where the substances meet *inside a particle*, so stirring matters. Saturation curve | `tests/effects.test.mjs` | pending |
| A4 | Heat, reactions, evaporation and dilution change effects | dilution and mixing only; heat only changes "potency activation" | reactions with temperature windows; boiling leaves non-volatiles behind (`phase.js` `gatherVolatile`) | partial | Target chemistry is richer | Reaction products carry their own effects. New per-world herb reactions: heat-activated steeping, heat degradation, contact neutralisation. Solubility rises with temperature, so hot infusions extract more. Boiling the water off concentrates an extract | `tests/effects.test.mjs`, `tests/alchemy-physics.test.mjs` | pending |
| A5 | Mixture effects hidden until tested | `knowledge.mjs` `observedPotion`; `main.mjs` shows "?" until a trial | **not hidden**: Aether Lens shows exact aspects and order meters show them live | missing | This is the core design break in the target | Order meters, probe, analysis and vial show "?" for effects until the batch is tested. The Aether Lens now reveals only a qualitative aura (a hint) | `tests/experiments.test.mjs`, browser `gameplay.spec` | pending |
| A6 | Magic glows as visual clues | `LaboratoryRenderer.mjs`: per-particle halos coloured by effect | luminous materials glow (`glow`) | partial | Reference halos reveal the dominant effect colour | An aura shimmer, drawn only when the Aether Lens is owned, shows the dominant hue with no numbers. It is bounded by the graphics preset | screenshots | pending |
| A7 | Theory, known recipe and verified results kept apart | recipe book marks "tested discovery" vs "untested formula" | recipe book stores measured results, including exact aspects | partial | | Three tiers. **Theory**: naive prediction from known ingredient effects plus resonances discovered so far. **Known recipe**: expected effects copied from a verified recipe the brew follows. **Verified**: measured on this batch | `tests/experiments.test.mjs` | pending |

## B. Experimental testing environment

| # | Feature | Reference | Target before | Status | Differences | Strategy | Verification | Final status |
|---|---|---|---|---|---|---|---|---|
| B1 | Experiment subjects | `experiments.mjs`: Moon Rabbit, Copper Beetle, Bean Seedling, Limestone; `effects.mjs` `assessEffects` responses | none | missing | | `src/game/experiments.js`: the same four ideas, plus a guild-sold Will-o'-Wisp. **Each subject reveals only the channels it responds to** (for example, limestone reports acidity, not love), so characterising a potion takes reasoning about which subjects to use | `tests/experiments.test.mjs` | pending |
| B2 | Real dose consumption | `splitPotionSample` and `takeSample` drain exact mass | none | missing | | Doses of 5, 10 or 25 ml are removed as whole particles from the cauldron tap, or split off a sealed vial. Ingredient cost follows the dose. Nothing is duplicated | `tests/experiments.test.mjs` (conservation) | pending |
| B3 | Observable responses | observation sentences and before/after stats | none | missing | | Sentences plus animated pixel-art subject states (glowing, burning, frosted, wilted, etched, transformed, asleep, dead) and stat bars | browser `trials.spec`, screenshots | pending |
| B4 | Records and history | 80 reports kept, with preparation snapshots | journal of physical discoveries | missing | | Trial log (last 120) with dose, subject, revealed channels, theory vs observed, and the preparation used | unit and browser tests | pending |
| B5 | Certification and invalidation | `observedPotion`: batch id, effects within 0.0015, temperature, stability, portions | none | missing | | A batch id plus a pour revision. Pouring after a test invalidates it. A silent drift check (reactions, settling) also invalidates. A vial inherits the certificate of the batch it was bottled from. Effect orders can only be served certified | `tests/experiments.test.mjs` | pending |
| B6 | Subject reset | free | — | missing | | Costs a few coins (a new subject); free in sandbox | unit test | pending |
| B7 | Discovering laws | none | journal discoveries for physical events | missing | | A trial that shows a resonance at work records it as a discovered law. The theory predictor then includes it | `tests/experiments.test.mjs` | pending |

## C. Resource gathering

| # | Feature | Reference | Target before | Status | Differences | Strategy | Verification | Final status |
|---|---|---|---|---|---|---|---|---|
| C1 | Locations | `gathering.mjs`: 11 fixed patches in one "Wild garden" sheet | none: everything is bought | missing | | `src/game/gathering.js`: six regions (Whisperwood forest, Sunlit meadow, Willow riverbank, Ironstone quarry, Moonfen and Ember crags, the last two magical). Node layout is generated per seed | `tests/gathering.test.mjs` | pending |
| C2 | Finite deposits and regeneration | lazy timestamp regrowth, no timers | — | missing | | Same lazy-timestamp idea (stock resolved when viewed or gathered), plus extra regrowth on each new day. Spring water is unlimited | `tests/gathering.test.mjs` | pending |
| C3 | Rare materials and progression | guild reagent licences | rank-tiered market | partial | | Rare nodes and magical regions open by guild rank. Some wild reagents can only be gathered | unit test | pending |
| C4 | Inventory and economy | gather writes to stock | — | missing | | Gathering writes the shop inventory and respects shelf storage. Wild goods sell back at 40% | unit test | pending |
| C5 | Art and feedback | `naturalLandscapeSprite`, hotspots | — | missing | | Procedural pixel panoramas per region, tappable deposits, collection particles, floating "+50 ml" text, sound | browser `wilds.spec`, screenshots | pending |
| C6 | Persistence | `foraging` in save v4 | — | missing | | `state.gathering` stored per node; v3 save migration | `tests/save-migration.test.mjs` | pending |

## D. Material processing

| # | Feature | Reference | Target before | Status | Strategy | Verification | Final status |
|---|---|---|---|---|---|---|---|
| D1 | Raw plants and minerals | whole plants and stones spawn as coherent solids | crystal, resin and frost chunks are rigid solids | partial | 16 wild raw ingredients per world (roots, leaves, petals, mushrooms, stones, crystals) poured whole as rigid chunks | `tests/alchemy-physics.test.mjs` | pending |
| D2 | Grinding | "Grind & add" emits powder | pestle crushes rigid bodies and crystals in the pot (`tools.js`) | partial | Keep the in-pot pestle. Add a **mortar**: a "Ground" toggle on the shelf pours crushable solids as powder | `tests/alchemy-physics.test.mjs` | pending |
| D3 | Dissolving and extraction | stirring dissolves compatible powder | contact dissolution limited by solubility, faster when hot or stirred | better in target | Wild powders are partly soluble. Effects count only for the dissolved part | `tests/effects.test.mjs` | pending |
| D4 | Suspensions, pastes, doughs | dough from kneading; extra solvent thins it | binder doughs, paste yield stress, suspension viscosity law | better in target | kept | existing physics tests | pending |
| D5 | Freeze, crush, melt | compact rigid freeze; pestle turns it to powder | latent-heat freezing into shape-matched rigid bodies; crushing; melting | better in target | kept | existing physics tests | pending |
| D6 | Recovery and reuse | discard vial; trade stock | alembic distillate can be poured back | partial | The skimmer returns nearly pure skimmed matter to the shelf. A sealed vial can be poured back into the cauldron | unit tests | pending |

## E. Physics and reaction systems

| # | Feature | Reference (`src/simulation`, `src/reactions`) | Target | Status | Notes and strategy | Final status |
|---|---|---|---|---|---|---|
| E1 | Powder friction and settling | `PowderSolver.mjs`: inelastic contacts, support cones, ~33° repose | GRAN mode: position-level Coulomb friction, mass scaling, sleeping (`world.js`) | equivalent | Target kept; its angle-of-repose and no-rebound tests remain | pending |
| E2 | Liquid incompressibility | `FluidSolver.mjs` packing constraints | PBF density constraints | better in target | kept | pending |
| E3 | Density stratification | `DensityStratification.mjs`, inverted-contact sorting | ρ⁻² weighted PBF plus Boussinesq term | equivalent | kept | pending |
| E4 | Gas buoyancy and pressure | `BuoyancySolver`, `GasDensitySolver` (local vapour concentration) | gas mode: buoyancy against air, weak pressure, lid containment | equivalent | kept | pending |
| E5 | Thermal conduction | `ThermalSolver`, `CauldronThermal` | pair conduction plus an iron wall ring (`thermal.js`), energy-balance test | better in target | kept | pending |
| E6 | Progressive phase transitions | `PhaseSolver` hysteretic progress | latent-heat accounting (`phase.js`) | better in target | kept | pending |
| E7 | Evaporation and condensation | saturation-driven condensation under the lid | condensation on cool iron or when saturated; drying | equivalent | kept | pending |
| E8 | Combustion | `CombustionSolver`: deterministic 2–3 daughter materials | oxygen-limited fire, lid smothering, ash and smoke | equivalent | Target kept. Ash and smoke now carry effects (toxicity), so burning changes potions | pending |
| E9 | Contact reactions | `ReactionEngine` property-distance intensity | rule-based mix, contact and decompose reactions (`reactions.js`) | better in target | Extended with herb reactions | pending |
| E10 | Miscibility and solubility | affinity envelopes | 2-D compatibility vectors plus solubility | equivalent | kept | pending |
| E11 | Emergent substances | fusion identities keyed by lineage | generated reaction products | equivalent | kept; the per-world resonances add emergent *effects* | pending |
| E12 | Electrical conductivity and potential | `ElectricalSolver.mjs`: conduction, Joule heat, electrostatics | none | missing | `src/simulation/electric.js`: a per-particle charge that conducts between touching particles in proportion to species conductance. Charge is conserved, Joule heating is applied, charged reagents (storm glass) exist, and a galvanometer reads charge. Electrostatic forces were left out: in the reference they levitated small parcels and are disabled in its shop too | pending |
| E13 | Molds and coherent solids | `MoldSystem.mjs` | rigid bodies from freezing | partial | Coherent solids are kept. Molds belong to the sandbox (section I) | pending |
| E14 | Collision accuracy | radius-aware planes | exact SDF from the drawn profile | better in target | kept | pending |
| E15 | Quantity conservation | mass-conserving drains | composition conserved exactly; vent accounting | equivalent | kept; doses and vials are tested for conservation | pending |
| E16 | Spoon interaction | contact-only velocity on liquid parcels touching a 0.42 head | 0.42 stirring field plus bowl collider; sub-stepped path | equivalent | kept | pending |
| E17 | Vessel size vs order volume | 200–440 ml | 7–13.5 L pots for 0.2–1 L brews | better in reference | Pots resized so typical brews fill a sensible part of the vessel. This also improves rendering detail and frame cost | pending |

## F. Rendering

| # | Feature | Reference | Target | Status | Strategy | Final status |
|---|---|---|---|---|---|---|
| F1 | Continuous liquids | `MaterialRaster.mjs` density-field splat | weight and colour field, thresholded and smoothed (`fluid.js`) | equivalent | kept | pending |
| F2 | Powder grains | 1-texel grit per grain | speckled grain clusters, darker when damp | equivalent | kept | pending |
| F3 | Pastes and doughs | liquid-like dough | textured paste field | better in target | kept | pending |
| F4 | Vapour | translucent parcels | soft fog field | better in target | kept | pending |
| F5 | Magic glows | halos | luminous species | partial | see A6 | pending |
| F6 | One upload per frame | reusable RGBA buffer | one offscreen ImageData | equivalent | kept | pending |

## G. Game systems

| # | Feature | Reference | Target | Status | Strategy | Final status |
|---|---|---|---|---|---|---|
| G1 | Procedural world seeds | `world.mjs`: 11 fixed-role ingredients | `generator.js`: 22 reagents, 12 reactions, roles | better in target | kept; wild materials, resonances and herb reactions are added from separate RNG streams so existing seeds keep their reagents | pending |
| G2 | Customers and dialogue | 12 names, 6 roles, purpose lines | 12 archetypes with styles, strictness, portraits, moods (`customers.js`) | better in target | kept; effect purposes added to dialogue | pending |
| G3 | Effect-based commissions | `orders.mjs` effect orders validated by a simulated witness brew | physical-property commissions from a hidden reference plan (`commissions.js`) | partial | Effect styles (healing, strength, love draught, warding, insight, transmutation, fire tonic, frost salve, antidote, acid etch, poison and others) built from hidden plans that use shop *and* wild reagents, predicted with the same effect law. Unwanted-effect limits. They require certification | `tests/commissions-effects.test.mjs` brews the plans in the real simulation | pending |
| G4 | Scoring | Gaussian-tail similarity | linear-falloff tolerance (`evaluate.js`) | equivalent | target kept; effect rows added | pending |
| G5 | Economy | coins, debt and loans, stock trading | coins, reputation, market events, sell-back, daily stipend | better in target | kept | pending |
| G6 | Progression and upgrades | 9 upgrades | 6 ranks, 24 equipment items | better in target | kept, plus mortar, galvanometer, wisp lantern and field satchel | pending |
| G7 | Recipe book | tested vs untested formulas | recipe book with prepare and homunculus | partial | recipes record certification status and verified effects | pending |
| G8 | Journal and achievements | — | discoveries, encyclopedia, achievements | better in target | trials, laws and gathering achievements added | pending |
| G9 | Tutorial | 7 steps | 11 steps, each advancing on real simulation events | better in target | rewritten for the new loop: brew, test on the rabbit, bottle, serve | pending |
| G10 | Free / sandbox mode | infinite ingredients, separate save | Free Experiment, separate save | equivalent | kept; also unlocks every wild reagent, subjects and region | pending |
| G11 | Audio | minimal | synthesised effects, loops and music | better in target | kept; gathering and trial sounds added | pending |

## H. Mobile, delivery, persistence, performance

| # | Feature | Reference | Target | Status | Strategy | Final status |
|---|---|---|---|---|---|---|
| H1 | Touch targets | 44 px minimum | 30–40 px | better in reference | 44–48 px targets throughout | pending |
| H2 | Navigation | long scrolling page plus modal sheets | one lab screen plus modals | partial | Native-style bottom tab bar: Counter · Brew · Wilds · Trials · Book, with the Market and Menu in the top bar; bottom sheets | pending |
| H3 | Gestures | drag-stir, hold-to-pour | pointer capture, multi-touch guarded | equivalent | Drag-and-drop jars into the cauldron, drag a dropper onto subjects, tap or drag deposits; a button alternative for each | pending |
| H4 | Safe areas, portrait, landscape, tablet | yes | yes | equivalent | re-laid out | pending |
| H5 | Graphics presets | Eco / Balanced; 30 fps battery mode | auto, high, medium, low | partial | Battery Saver / Balanced / High Quality / Auto. Battery caps at 30 fps and reduces effects. Physics is identical in every preset | pending |
| H6 | PWA and offline | network-first service worker | cache-first release service worker, precache, installable | better in target | kept | pending |
| H7 | GitHub Pages sub-path | tested | tested (`subpath.spec.mjs`) | equivalent | kept | pending |
| H8 | Saves and migration | v1→v4 chain, backup, export/import, separate sandbox key | v1→v2, rolling backup, export/import, cross-tab guard | equivalent | v2→v3 migration: effects, wild reagents, gathering, trials, vial, aspect orders → effect orders | pending |
| H9 | Benchmarks | `benchmark-game.mjs` | `bench.mjs` (physics plus in-browser frames) | equivalent | extended | pending |

## I. Reference features judged unsuitable for the shop

These sandbox features do not fit an upright cauldron on a phone. They are
documented here rather than imported:

| Feature | Reference file | Reason not imported into the game |
|---|---|---|
| 3D mode with a WebGL point renderer | `rendering/SceneRenderer.mjs`, `sandbox.html` | The game is deliberately 2D pixel art. A second engine and renderer would double maintenance and download size |
| Device-orientation gravity | `sensors/GravityInputProvider.mjs` | A cauldron that sloshes when the phone tilts fights one-handed play and makes measured doses unfair |
| Free-form molds and barriers | `simulation/MoldSystem.mjs` | There is no mold in a potion shop; coherent cast solids are already covered by freezing and by wax setting into a cake |
| Material editor with arbitrary sliders | `sandbox.html` | It would let the player bypass the discovery system. Free Experiment keeps every reagent, tool and subject instead |
| Long-range electrostatic forces | `ElectricalSolver.mjs` | Disabled in the reference shop too, because it levitates small parcels. Conduction and charge are integrated (E12) |

The original sandbox stays available in the reference repository itself. The
game does not link to it, since gameplay must not depend on the network.
