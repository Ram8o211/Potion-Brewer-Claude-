# Game architecture

The Alchemist's Shop is a static web app made of native ES modules (about
10,400 lines in 48 modules) with no runtime dependencies. In development the
browser loads `src/` directly; `scripts/build.mjs` bundles it into one
fingerprinted script for production.

```
                ┌──────────────────────────── ui/ ─────────────────────────────┐
                │ app (screens, settings) · menu · lab (the shop) · panels ·   │
 input ────────▶│ tutorial · dom helpers · icons                               │
                └───────┬───────────────────────────┬──────────────────┬───────┘
                        │ actions                   │ frame            │ events
                ┌───────▼─────────┐        ┌────────▼───────┐   ┌──────▼───────┐
                │ game/           │        │ rendering/     │   │ audio/       │
                │ state, economy, │        │ renderer, fluid│   │ WebAudio     │
                │ commissions,    │        │ art, effects,  │   │ synthesis    │
                │ measure, scoring│        │ portraits      │   └──────────────┘
                └───────┬─────────┘        └────────▲───────┘
                        │ brews in / measures       │ reads particles
                ┌───────▼───────────────────────────┴───────┐
                │ simulation/  (the particle world)          │
                │ world · grid · cauldron · tools · emitter ·│
                │ thermal · phase · rigid · derived · snapshot│
                └───────┬───────────────────────────────────┘
                        │ composition, mixture laws, reactions
                ┌───────▼──────────┐   ┌───────────────────┐
                │ reactions/       │◀──│ materials/        │
                │ species, mixture,│   │ schema, generator,│
                │ diffusion, rules │   │ names, reference  │
                └──────────────────┘   └───────────────────┘
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
  glow, and four magical aspects (vitality, ardor, arcana, fortitude).
* **`generator.js`** builds a world from a seed with the project's own
  seeded RNG (`core/rng.js`, so a seed always gives the same world). Fixed
  *roles* (spring water, an oil, a syrup, a spirit, two coloured essences,
  a binding meal, a soluble salt, then higher-tier reagents up to phoenix
  cinders and void ink) keep every world playable. Their properties,
  colours and names vary per seed. It also generates a dozen reactions
  (mix, contact and decompose kinds) between the world's reagents.
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
9. Every second step: heat transport (`thermal.js`), contact diffusion,
   reactions and combustion, phase changes (`phase.js`), oxygen exchange.
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

### Tools (`tools.js`)

The spoon has a velocity-field stirring zone (radius 0.42) and a physical
bowl collider. The pestle has a heavy head; it crushes rigid frozen bodies
and crystals into grains when struck hard enough. The skimmer removes
matter. Tool motion is sub-stepped along the pointer path, so fast strokes
can't jump through the brew. Tools can never push matter through the
walls (tested).

### Snapshots (`snapshot.js`)

The full cauldron state (particles, compositions, temperatures, rigid
bodies, wall temperatures, lid, oxygen) serialises to compact JSON for
saves; a test checks that the state round-trips.

## 4. Game layer (`src/game/`)

* **`state.js` (`GameState`)** holds the whole save: seed and embedded
  world, coins, reputation and rank, day and customer index, inventory and
  shelf limits, equipment, journal, knowledge, recipes, history,
  achievements, statistics, market day, tutorial progress and the cauldron
  snapshot. It handles buying and selling, equipment, sales and
  reputation, rank-ups, end of day, market events and a once-a-day
  stipend that makes a run impossible to lose. `toJSON` / `fromJSON` run
  through `migrate()`, which upgrades older save versions and regenerates
  a missing embedded world from the seed.
* **`commissions.js`** builds each order from a hidden **reference plan**
  (ingredients and amounts, heat-to, cool-to, serving temperature,
  kneading or crushing, hold time) for one of 14 brewing styles (tonic,
  syrup, warm draught, salve, elixir, ardent, heavy, fizzy, frost, arcane,
  lumen, varnish, panacea, phoenix). The plan uses only purchasable
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
  (composition heterogeneity, immiscible blends, sediment, gas) and
  volatility.
* **`evaluate.js`** scores each requirement (full marks within tolerance,
  falling linearly to zero), weights them (colour counts more, quantity
  less), caps the score for a short bottle, and turns quality into stars,
  payment and reputation.
* **`equipment.js`** lists 24 items in heating, cooling, vessels, tools,
  instruments, storage and guild categories, with ranks and prerequisites.
  `capabilities()` folds owned items into the simulation's limits (flame
  temperature and power, coldest temperature, cauldron size, storage,
  discount).
* **`journal.js`** turns simulation events (first boil, freeze, dough,
  crushing, dissolving, each reaction, fire) into journal discoveries,
  ingredient knowledge and achievements.
* **`autobrew.js`** is a controller that carries out a plan in the real
  simulation: it pours, stirs, kneads, crushes, heats and cools with
  feedback, and holds. In the game it is the homunculus upgrade, which
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
* Quality levels (high, medium, low) change the art-pixel size and
  lighting. **Automatic** quality (the default) steps down when frames
  keep running over budget.

## 6. UI (`src/ui/`)

* **`app.js`** handles settings, switching screens, and the new-game and
  free-experiment entry points.
* **`menu.js`** is the main menu, with a live simulated cauldron behind
  it.
* **`lab.js`** is the shop and experiment screen. It holds the order card
  with live per-requirement meters, the cauldron view, the shelf, the dose
  buttons, the fire and frost control, tools, lid, time speed, emptying,
  bottling, the brew-analysis panel, the probe and inspector, the thermal
  view and keyboard shortcuts. It runs the frame loop: physics within a
  time budget (what is left of a ~30 fps frame after rendering, 8–22 ms),
  so slow devices run the brew in slow motion instead of dropping frames.
  It also collects frame-timing statistics (`perfReport()`), used by the
  benchmark.
* **`panels.js`** contains the market and guild (reagents, equipment,
  selling back), the ingredient inspector, guild advice, the result and
  day-summary dialogs, the analysis panel, the recipe book (prepare or
  hand to the homunculus), the journal (discoveries, encyclopedia,
  achievements, sales), pause, help and settings.
* **`tutorial.js`** is the guided first commission (11 steps, each
  advancing on what actually happens in the cauldron).
* The layout is CSS grid. Phone portrait puts the order card on top, the
  cauldron in the middle and controls with a horizontal shelf at the
  bottom; phone landscape and tablet have their own arrangements; desktop
  uses three columns. Safe-area insets are respected, and touch targets
  are at least 30 CSS px (tested).

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
| Game rules | `tests/game.test.mjs` (10 tests) | seeded determinism, starting reagents, day-one feasibility and affordability, achievability brewed in the real simulation, scoring, market, the no-softlock stipend, ranks, save round-trip, migration and bad files |
| Browser | `tests/browser/*.spec.mjs` (43 tests, 5 profiles) | layouts and touch target sizes, the tutorial order through the real UI with touch stirring, tools, shop and equipment, saves (continue, cauldron, export and import, damaged save), settings, sandbox physics (layers, freezing and crushing, fire, a long boiling run with conservation checks), offline build |
| Types | `tsc` with `checkJs` | `src/`, `scripts/`, `tests/` |
| Performance | `scripts/bench.mjs` | physics ms per step; in-browser fps, frame-time percentiles, physics and render split, and simulation speed |
| Balance | `scripts/playtest.mjs`, `scripts/achievability.mjs` | multi-day economy and progression; order achievability |
