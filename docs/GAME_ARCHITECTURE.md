# Game architecture

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

Reactions, evaporation and dilution change the composition, so they change
effects through the same function. `theoryOf()` is the player's naive
prediction (volumes simply add, plus the laws they have confirmed), shown
next to every observation so surprises point at hidden laws.

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
and crystals into grains when struck hard enough. The skimmer removes
matter and counts what it lifted: a particle that is at least 92% one
substance (and not burning) counts as `recovered`, so a skimmed layer of
a pure reagent goes back into its jar; mixtures are waste. Tool motion is sub-stepped along the pointer path, so fast strokes
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
  trials state and the wilds' deposit stocks. It handles buying and selling, equipment, sales and
  reputation, rank-ups, end of day, market events and a once-a-day
  stipend that makes a run impossible to lose. `toJSON` / `fromJSON` run
  through `migrate()`, which upgrades older save versions and regenerates
  a missing embedded world from the seed. Save version 3 adds effects,
  trials, gathering, batches and the vial; a version-2 save keeps every
  coin, recipe and journal entry, its embedded world gains the effect
  profiles a fresh world of that seed would have, and a pending order is
  rewritten in effect terms (`migrateCommission`). A test loads a genuine
  v2 save produced by the previous release. A save from a newer version,
  or a damaged one, is refused with a message, never silently reset.
* **`commissions.js`** builds each order from a hidden **reference plan**
  (ingredients and amounts, heat-to, cool-to, serving temperature,
  kneading or crushing, hold time) for one of 14 physical brewing styles
  (tonic, syrup, warm draught, salve, elixir, ardent, heavy, fizzy, frost,
  arcane, lumen, varnish, panacea, phoenix) or 11 **effect styles**
  (healing, strength, love, fire tonic, frost salve, settling (alkaline),
  etching (acid), bane, insight, transmutation, antidote). An effect plan
  picks an ingredient known to carry the effect, a solvent it dissolves in
  and a preparation (grinding, steeping heat, stirring); higher tiers blend
  a second ingredient, sometimes one a hidden law acts on. Drinkable
  potions get safety limits on poison, acid and death they did not ask
  for. The plan uses only purchasable
  reagents and owned equipment. `predict.js` computes its outcome with the
  same mixture laws and reaction stoichiometry as the simulation, and the
  requirements are placed around that outcome. Tolerances tighten with
  tier and customer strictness. A requirement is only asked for where it
  is predictable: no viscosity target for undissolved slurries, no
  stability target for brews that keep loose grains, and a wider density
  band where grains settle unevenly.
* **`customers.js`** has 12 archetypes (farmer, innkeeper, bard, healer,
  knight, traveller, scholar, hedge witch, blacksmith, noble, wizard,
  hunter), each with preferred styles, properties they care about, budget,
  strictness, the rank at which they start visiting, a procedural pixel
  portrait and dialogue.
* **`measure.js`** measures the bottle. `tapSelection` takes the particles
  closest to the tap at the bottom of the cauldron, so the lowest layer
  comes out first. `measureParticles` computes colour (Beer–Lambert, then
  OKLab), density, viscosity, temperature, magical aspects, stability
  (composition heterogeneity, immiscible blends, sediment, gas),
  volatility, charge and the hidden effect vector (with the amount each
  resonance law contributed).
* **`experiments.js`** is the trials room's rules: five subjects (Moon
  Rabbit, Copper Beetle, Bean Seedling, Limestone, and the Will-o'-Wisp
  with the lantern), each responding to only some effects; dose-scaled
  observations and lasting marks; harm that can spend a subject (replaced
  for coins, half price with the kennel); trial records with the theory
  beside the observation; law discovery after two trials show a law at
  work on a channel the subject reveals; and **certification**. A batch is
  certified for an effect once a trial of this batch *and revision*
  revealed it and the brew still matches that reading within
  max(3, 15%). Pouring anything bumps the revision, so earlier trials stop
  counting; drift from reactions, settling or heat is caught silently. An
  order with effect requirements cannot be served uncertified.
* **`gathering.js`** is the wilds: six regions (four open from the start,
  two magical ones from Adept and Expert), deposits generated from the
  seed (never saved), and per-deposit stock plus a timestamp in the save.
  Stock is resolved lazily from elapsed wall-clock time when a deposit is
  shown or gathered, so nothing runs per frame and deposits regrow while
  the game is closed. A new day lets every deposit recover half its
  capacity. Harvests respect shelf space; the satchel gathers 50% more.
* **`evaluate.js`** scores each requirement (full marks within tolerance,
  falling linearly to zero), weights them (colour counts more, quantity
  less), caps the score for a short bottle, and turns quality into stars,
  payment and reputation.
* **`equipment.js`** lists 29 items in heating, cooling, vessels, tools,
  instruments, trials, storage and guild categories (new: stone mortar,
  galvanometer, subject kennel, wisp lantern, forager's satchel), with ranks and prerequisites.
  `capabilities()` folds owned items into the simulation's limits (flame
  temperature and power, coldest temperature, cauldron size, storage,
  discount).
* **`journal.js`** turns simulation events (first boil, freeze, dough,
  crushing, dissolving, steeping, each reaction, fire, sparks) into journal discoveries,
  ingredient knowledge and achievements.
* **`autobrew.js`** is a controller that carries out a plan in the real
  simulation: it pours (ground in the mortar where the plan says so),
  stirs, kneads, crushes, heats and cools with feedback, and holds. In the game it is the homunculus upgrade, which
  brews saved recipes. Tests and tools use it to prove orders achievable
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
  a sealed vial, the brew-analysis panel, the probe and inspector, the
  thermal view and keyboard shortcuts. It owns batch identity and the
  vial (serve, discard or pour back). The simulation runs in every room
  but is drawn only in the Brew room. It runs the frame loop: physics within a
  time budget (what is left of a ~30 fps frame after rendering, 8–22 ms),
  so slow devices run the brew in slow motion instead of dropping frames.
  It also collects frame-timing statistics (`perfReport()`), used by the
  benchmark.
* **`views/`** holds the other rooms: `counter.js` (customer, full order
  with verified effects, the vial, serving), `wilds.js` (regions, the
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
