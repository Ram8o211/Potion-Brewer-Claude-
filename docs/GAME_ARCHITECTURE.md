# Game architecture

The Alchemist's Shop is a static web app made of native ES modules (about
12,700 lines in 60 modules) with no runtime dependencies. In development the
browser loads `src/` directly; `scripts/build.mjs` bundles it into one
fingerprinted script for production.

```
                ┌──────────────────────────── ui/ ──────────────────────────────┐
                │ app (screens, settings) · menu · lab (shell + Brew room) ·    │
 input ────────▶│ views/ counter · garden · testing · book · panels · tutorial ·│
                │ dom helpers · icons                                           │
                └───────┬───────────────────────────┬──────────────────┬────────┘
                        │ actions                   │ frame            │ events
                ┌───────▼──────────┐       ┌────────▼───────┐   ┌──────▼───────┐
                │ game/            │       │ rendering/     │   │ audio/       │
                │ state, garden,   │       │ renderer, fluid│   │ WebAudio     │
                │ testing, haggle, │       │ art, effects,  │   │ synthesis    │
                │ sales, commiss., │       │ creatures,     │   └──────────────┘
                │ predict, measure │       │ garden, portr. │
                └───────┬──────────┘       └────────▲───────┘
                        │ brews in / measures       │ reads particles
                ┌───────▼───────────────────────────┴───────┐
                │ simulation/  (the particle world)          │
                │ world · grid · cauldron · tools · emitter ·│
                │ thermal · electric · phase · rigid · magic·│
                │ derived · snapshot                         │
                └───────┬───────────────────────────────────┘
                        │ composition, mixture laws, miscibility, magic
                ┌───────▼──────────┐   ┌───────────────────┐   ┌──────────────┐
                │ reactions/       │◀──│ materials/        │──▶│ alchemy/     │
                │ species, mixture,│   │ schema, generator │   │ magic: six   │
                │ compatibility,   │   │ (garden world),   │   │ properties,  │
                │ diffusion, fire  │   │ reference         │   │ fade, super  │
                └──────────────────┘   └───────────────────┘   └──────────────┘
```

Dependencies point downward only. The simulation knows nothing about
customers or screens, and the game layer brews and measures through the
same public simulation API the UI uses. That lets the test suite and the
balancing tools run the real game rules headlessly in Node.

## 1. Materials and the garden world (`src/materials/`)

* **`schema.js`** defines a material. The physics fields are form
  (liquid, powder, solid, gas), colour and tint, opacity, density,
  viscosity and its temperature dependence, thermal conductivity and heat
  capacity, melting and boiling points with latent heats, compatibility
  coordinates (miscibility), friction, solubility, flammability and
  ignition. The magic fields are a 6-channel **magic vector** (vitality,
  ardor, frost, levity, charm, bane; 0–100 each), a **fading** temperature
  (`fadeT`) and a **super-transition** temperature (`superT`) with the
  property it transmutes into (`superKey`). Only the magic fields are ever
  shown to the player.
* **`generator.js`** builds a world from a seed with the project's own
  seeded RNG (`core/rng.js`, so a seed always gives the same world). Eleven
  fixed *roles* keep every world playable:
  * plain **water** (no magic: the solvent);
  * four **magical liquids**: dew, ember sap, frostmilk and witch oil.
    Witch oil floats apart from water until both are hot;
  * six **magical stones**: sunstone, glacite, heartstone, bloodstone,
    skystone and blight agate, gathered whole and smashed into powder.

  The seed varies each ingredient's name, colour and magic. Reachable
  thresholds move ±5 °C, extreme ones scale by 0.92–1.08, and fading
  points by 0.94–1.06. The physics of each role stays fixed. Most
  super-transition temperatures are unreachable on their own (sap
  +1300 °C, glacite −1450 °C, blight −2250 °C). Frostmilk (−46 °C) and
  witch oil (+94 °C) are the exceptions, so a cold or hot transition is
  possible early on. Burning produces universal `soot` and `smoke`.
* **`reference.js`** holds a fixed material set used by the physics tests,
  the benchmark and the menu backdrop.

## 2. Composition, mixture laws and magic (`src/reactions/`, `src/alchemy/`)

Every particle has the same volume (5 ml) and carries a composition
vector: volume fractions over up to 16 species slots (`species.js` maps
material ids to slots and keeps per-slot property arrays, including each
slot's magic vector, magic weight and thresholds).

* **`mixture.js`** holds the shared mixture laws, used by both the live
  simulation and the request predictor. Density, heat capacity and
  conductivity mix linearly by volume. Viscosity mixes logarithmically and
  is raised by undissolved solids. Undissolved solids are tracked as a
  granular fraction (solubility depends on temperature).
* **Colour** uses Beer–Lambert absorption: absorbances add by
  concentration and the result is converted back to sRGB.
* **`compatibility.js`** decides miscibility from two compatibility
  coordinates per material. **Heat helps mixing:** `compatFactorT` raises
  the compatibility of a pair by 0.28% per °C above room temperature
  (`HEAT_MIX`). Liquids that keep apart cold blend in a hot cauldron, and
  once blended they stay blended when cooled. `fullMixTemperature` gives
  the temperature at which a pair mixes fully. The request planner uses it
  to heat such blends.
* **`diffusion.js`** handles contact diffusion: composition is exchanged
  only between touching, compatible particles (judged at their mean
  temperature) and symmetrically, so each species is conserved exactly.
  The exchange rate rises with temperature, falls with viscosity, and is
  multiplied by local shear, so stirring mixes dramatically faster. The
  same exchange carries each particle's magic state (below), weighted by
  how much magic each side holds.
* **`reactions.js`** runs combustion. Flammable matter above its ignition
  point burns where it meets air, flames spread heat, and a closed lid
  smothers the fire. No magic survives a fire: burned matter becomes
  soot. Garden ingredients have no other chemistry. A potion's magic
  follows proportions, heat and transmutation.

### Magic (`src/alchemy/magic.js`, `src/simulation/magic.js`)

What a potion *does* is computed from the matter actually drunk, particle
by particle:

1. **Proportions.** A particle's natural magic is the volume-weighted mean
   of its species' magic vectors. Water dilutes, and a 1:1 blend sits
   halfway between its two ingredients.
2. **Extraction.** Stone powder acts once dissolved. Undissolved grains in
   liquid leach 12% (dry powder 5%). Steeping hot draws more out, fully
   about 70 °C above room temperature, and each particle remembers the
   hottest steep it saw (`stp`). A hot steep keeps its strength after
   cooling.
3. **Fading.** A particle's fading threshold is the magic-weighted mean of
   its species' `fadeT`. Above it, the particle's vigour `vig` (1 =
   intact) decays exponentially, at 0.4% per second per °C over the
   threshold.
4. **Transmutation.** A particle's super-transition threshold is the
   magic-weighted mean of its species' `superT`, and its target property
   is the magic-weighted vote of their `superKey`s. A threshold at or
   above 20 °C is crossed by heating, one below 20 °C by cooling. Beyond
   it, the transmuted share `ss` rises at 0.2 per second, faster the
   further past. A blend that only brushes the threshold barely changes;
   one held there transmutes completely. A transmuted particle's total
   magic, amplified by 1.35 and capped at 100, goes into the one target
   property, and the other properties drop to almost nothing.

`vig`, `ss` and `stp` are per-particle state, exchanged by diffusion
weighted by magic, so stirring spreads them like matter without creating
magic (tested). `magicStep` runs every second step after the phase
changes. It emits rare `transmute` and `fade` events, which drive a
starburst in the property's colour or pale wisps in the renderer and
entries in the journal. `sampleMagic()` measures any set of particles:
the vial, a test dose, or the brew panel.

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
   (`electric.js`), contact diffusion (matter and magic state), combustion,
   phase changes (`phase.js`), magic (`magic.js`: steeping, fading,
   transmutation), oxygen exchange.
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

The engine still carries a conserved per-particle charge that flows
between touching particles in proportion to their conductance, with Joule
heating and sparks. No garden ingredient is charged, so in the game a
neutral brew costs one scan per step. The system is kept for the free
experiment and future ingredients.

### Tools (`tools.js`)

The spoon has a velocity-field stirring zone (radius 0.42) and a physical
bowl collider. The pestle has a heavy head; it crushes rigid frozen bodies
and crystals into grains when struck hard enough. The skimmer removes
matter and counts what it lifted: a particle that is at least 92% one
substance (and not burning) counts as `recovered`, so a skimmed layer of
a pure ingredient goes back into its jar; mixtures are waste. Tool motion is sub-stepped along the pointer path, so fast strokes
can't jump through the brew. Tools can never push matter through the
walls (tested).

### Snapshots (`snapshot.js`)

The full cauldron state serialises to compact JSON for saves:
* particles, compositions, temperatures and charges;
* each particle's magic state (vigour, transmuted share, steeping
  temperature);
* rigid bodies, wall temperatures, the lid and oxygen.

A test checks that the state round-trips. Snapshot version 3 adds the
magic state, and older snapshots load with intact, untransmuted magic. A
smaller old vessel's snapshot is remapped into the new vessel's shape
instead of being dropped.

## 4. Game layer (`src/game/`)

* **`state.js` (`GameState`)** holds the whole save:
  * the seed and embedded world, coins, reputation and rank, the day and
    customer index, inventory and shelf limits, and equipment;
  * the garden, the testing room (creatures and trial records) and the
    current Potion ID card;
  * the current batch (id and revision), the sealed vial with its label,
    and the sales ledger with pending complaints;
  * the journal, knowledge, recipes, achievements, statistics, market day,
    tutorial progress and the cauldron snapshot.

  It runs the shop's rules:
  * harvesting, watering and planting, and recording trials;
  * writing the ID, certification and the label check;
  * bringing in visitors: a complaint that has fallen due comes before
    the day's next customer;
  * haggling, completing a sale, resolving a complaint by refund or
    certificate, rank-ups, and the end of day (market events, a push for
    the garden, rest for the creatures);
  * a once-a-day stipend for a broke alchemist, so a run cannot be lost.

  `toJSON` / `fromJSON` run through `migrate()`. **Save version 4** comes
  with the garden world. A version-3 save keeps the shop: coins,
  reputation, rank, day, the equipment that still exists, achievements,
  sales history and statistics. Its world is regrown from the seed as a
  garden, because the old reagents have no place in it. Ingredients (150
  ml of water to start), the cauldron, recipes, the journal, the vial and
  the pending order start fresh, and the starting garden is ready to
  harvest. A test loads a genuine v3 save produced by the previous release
  (`tests/fixtures/save-v3.json`). A save from a newer version, or a
  damaged one, is refused with a message, never silently reset.
* **`garden.js`** defines the beds:
  * the **well** gives plain water and refills over about 16 minutes;
  * **plant beds** (dew, ember sap, frostmilk, witch oil) grow their
    liquid only while the soil is moist. Watering costs 40 ml of well
    water and lasts 30 minutes;
  * **crystal beds** grow stones slowly (34–46 minutes to full) and need
    no water.

  Five beds belong to the starting garden. Eleven more are planted for coins
  as the rank allows. A harvest takes what has grown, scaled by ripeness
  with nothing below 20%, and the bed starts again from bare soil. Growth
  is resolved lazily from wall-clock timestamps whenever a bed is shown or
  touched, so nothing runs per frame and the garden keeps growing while
  the game is closed. Several things change growth: equipment (greenhouse
  for plants, crystal lamp for stones, rain barrel for the well,
  sprinkler so plants never dry out) and market days (rain, heat wave,
  eclipse). Shelves cap how much of each ingredient is kept.
* **`testing.js`** is the testing room. It has five creatures: the moss
  toad, salamander, moon moth and mandrake sprout from the start, and the
  wisp with the lantern. Each shows only some properties, and every
  property shows on at least two creatures.
  * A trial uses a real **10 ml dose** (two particles from the cauldron
    tap, or split from the vial).
  * The observed level per property is the truth plus a deterministic
    wobble of ±(2 + 6%), capped by the creature's cage (`max`). Magic
    under 3 does not show.
  * Bane, and ardor or frost beyond a creature's tolerance, cost health.
    Creatures recover 2 health per minute of rest. A dead one is replaced
    for coins, at half price with the kennel.
  * Records keep what was shown (`levels`), never a verdict.

  The **Potion ID** belongs to a batch. Any new pour bumps the batch
  revision and marks a written ID stale (a blank one is never stale). A
  written ID is copied onto the vial as its label when bottling.
* **`commissions.js`** builds each request from a *problem* that one
  property solves (a fever, a frozen pass, rats in the granary), with
  requirements only on the six properties. Each requirement is *want*
  (at least), *range* or *limit* (at most: a side effect). A hidden
  **reference plan** picks ingredients that carry the property from what
  the shop can grow. It also picks proportions, and sometimes a second
  ingredient, a hot steep for stones, or a heated blend for oil. For a
  **super request**, it picks a pair whose magic-weighted threshold falls
  inside the shop's fire or frost, with a plan that crosses the threshold
  and holds there. `predict.js` computes the plan's outcome with the
  simulation's own magic laws (steeping, fading, transmutation), and every
  range is placed so that outcome sits comfortably inside it. Drinkable
  potions get a bane limit. The tests and `scripts/achievability.mjs` brew
  these plans in the real simulation.
* **`customers.js`** has 12 archetypes, from farmer to wizard. Each has
  the properties they come for, a budget, how low they open, patience,
  how far they concede, a **bluff** probability (2% for the healer, 30%
  for the hedge witch), the rank at which they start visiting, a
  procedural pixel portrait and dialogue.
* **`haggle.js`** is the price negotiation, pure and seeded per customer.
  * The customer's hidden maximum comes from the request's value. A
    certificate raises it by 25%, reputation by up to 15%, and a short
    vial lowers it.
  * They open at a share of it. Each price the seller asks either closes
    the deal (at or under their current willingness), or brings a
    counter-offer that closes part of the gap and costs patience.
    Asking far too much costs extra patience. More than twice their
    maximum is an insult, and they walk out.
  * With patience gone they make one final offer.
  * Asking no more than their offer sells at their offer, never below it
    (the counter's buttons cannot go below it either).
* **`sales.js`** settles a sale. The label is what the customer bought,
  and the vial's measured magic is what they drink. If a want falls short
  or a limit is exceeded by more than 1.5 points, a **genuine complaint**
  is scheduled one to three visits later. Otherwise the customer may still
  **bluff** with their archetype's probability. A complaint is always a
  refund (minus reputation), unless the vial was certified *and* the
  customer is bluffing: the certificate exposes them and the shop gains
  reputation. Certification costs 30 + 12 × rank coins (30% less with the
  guild charter). It replaces the label with the measured truth.
* **`measure.js`** measures a bottle or a dose. `tapSelection` takes the
  particles closest to the tap at the bottom of the cauldron, so the
  lowest layer comes out first. `measureParticles` gives the volume,
  colour, temperature and the magic (`sampleMagic`), with the mean vigour,
  transmuted share and steeping.
* **`equipment.js`** lists 26 items in heating, cooling, vessels, tools,
  instruments, testing, garden, storage and guild categories, with ranks
  and prerequisites. `capabilities()` folds owned items into the
  simulation's limits (flame temperature and power, coldest temperature,
  cauldron size, storage) and the shop's modifiers (garden growth,
  replacement and certification discounts).
* **`journal.js`** turns simulation events into journal discoveries,
  ingredient knowledge and achievements. The events include the first
  boil and freeze, crushing, heat-assisted mixing, magics that will not
  join while cold, a fire, a transmutation and magic fading. Entries
  speak of magic only: one generic entry each for steam, ice and fire,
  never an ingredient's boiling point, colour or weight.
  `modernizeJournal()` rewrites entries saved by earlier builds when a
  game is loaded, and `fromJSON` refreshes every ingredient's description
  from its current lore.
* **`autobrew.js`** is a controller that carries out a plan in the real
  simulation. It pours (smashing stones in the mortar where the plan says
  so), stirs, heats and cools with feedback, holds, and serves at the
  right temperature. Its flame is capped below the plan's target so the
  magic does not fade on the way. For a cold super plan it steeps warm
  first, then chills and holds. In the game it is the homunculus upgrade,
  which brews saved recipes. Tests and tools use it to prove requests
  achievable and to run balancing playthroughs.
* **`persistence.js`** autosaves to `localStorage` with a rolling backup,
  recovers from a damaged save, handles exporting and importing save files,
  and degrades gracefully when storage is unavailable.

## 5. Rendering (`src/rendering/`)

* **`renderer.js`** composes each frame on a 2D canvas at a chunky
  "art pixel" scale: a pre-rendered workshop backdrop and cauldron
  (`art.js`, procedural pixel art with ordered dithering), wall heat glow,
  the brew, lid, tools, pouring stream, bottle and tap, fire under the
  cauldron, flames on burning matter, steam and splashes (`effects.js`),
  and an optional thermal view. A transmutation bursts as a starburst in
  the colour of the property it became, and fading magic rises as pale
  wisps.
* **`fluid.js`** draws the material at 1–2 pixel detail, independent of
  the physics resolution:
  * Liquids are splatted into a continuous weight and colour field and
    thresholded on a lightly smoothed copy, so pools are continuous and
    flat-topped and diffusion shows as smooth gradients.
  * Clear liquids are drawn darker and cooler, as if the iron shows
    through; opaque ones stay bright.
  * Powders are drawn as speckled grain clusters.
  * Frozen blocks get a crisp body with a frosty rim.
  * Vapour is a soft fog.
  * Glowing and burning matter emits light.
* **`creatures.js`** draws the testing room's cages and the creatures'
  responses. Every response is a picture against the cage's notched post
  (ten notches) and countable marks (one per ten points):
  * leaves for vitality and hearts for charm;
  * a rising flame or creeping ice for ardor and frost;
  * the moth's height for levity;
  * toxic bubbles for bane.

  A weakened creature looks sickly, and a dead one lies still. No text is
  drawn.
* **`garden.js`** paints the garden scene (sky, fence, the well, soil
  that darkens when watered, plants and crystals that grow with the
  bed's growth) and maps taps to beds. The static layer is cached.
* **`portraits.js`** draws procedural customer portraits; **`scenes.js`**
  draws the whole-stone sprites for the shelf.
* Quality presets: **High quality**, **Balanced** and **Battery saver**
  change the art-pixel size, lighting and effects; Battery saver also
  draws at 30 fps. **Automatic** (the default) steps down when frames keep
  running over budget. Physics and magic are identical in every preset.

## 6. UI (`src/ui/`)

* **`app.js`** handles settings, switching screens, and the new-game and
  free-experiment entry points.
* **`menu.js`** is the main menu, with a live simulated cauldron behind
  it.
* **`lab.js`** is the shop shell and the Brew room. The shell is a top bar
  (coins, reputation, day, the guild shop) whose middle doubles as the
  **status line** for notifications, a **coach row** for the tutorial,
  the rooms, and a bottom tab bar (a rail in landscape and on desktop).
  The Brew room has:
  * the order strip, with the request as icon chips;
  * the cauldron view;
  * the shelf: tap a jar, long-press to read its magic, or drag it onto
    the cauldron;
  * dose buttons (10, 25, 50, 100 ml) and the mortar;
  * the fire and frost control, tools, lid, time speed, emptying and
    bottling into a labelled vial;
  * the thermal view and keyboard shortcuts.

  It owns batch identity and the vial (offer, certify, test, discard or
  pour back, with the magic state restored). The simulation runs in every
  room but is drawn only in the Brew room. It runs the frame loop: physics
  within a time budget (what is left of a ~30 fps frame after rendering,
  8–22 ms), so slow devices run the brew in slow motion instead of
  dropping frames. Frame-timing statistics (`perfReport()`) feed the
  benchmark.
* **`views/`** holds the other rooms:
  * `counter.js` covers the customer and everything a sale needs:
    * the request as named property chips;
    * the vial with its named ID chips and seal, and an inline hint
      saying what stops the sale (no label, an incomplete label, a label
      that does not promise what they need);
    * Offer and Certify;
    * the haggle panel. It shows "They offer", "You ask" (−5/−1/+1/+5 and
      a slider, never below their offer), "Patience", Ask, Take and
      No deal, and turns into "Final offer" when patience runs out;
    * the customer's speech bubble, which voices the offer, each
      counter-offer and every refusal, naming the missing property;
    * a parting card after a sale, a walk-out, a refund or a caught
      bluff, with "Open the door" for the next visitor;
    * returning customers (refund, or show the certificate);
  * `garden.js`: the painted garden and one row per bed with plant, water
    and harvest buttons;
  * `testing.js`:
    * the dose source (cauldron or vial) and the draggable dropper;
    * one card per creature: cage canvas, health, dose, replay and
      replace. On a phone in portrait the cards form a swipeable row
      above the ID panel;
    * the Potion ID panel: six named sliders, updated in place. A tap or a
      key on an unset slider resting at 0 writes 0, and "? → 0" sets every
      property the creatures did not show;
  * `book.js`: recipes, ingredients, journal, achievements and the sales
    ledger.
* **`panels.js`** contains the guild shop (equipment), the ingredient
  card (magic bars, fading and transition temperatures, nothing physical),
  guild advice, the day summary, the recipe book (prepare or hand to the
  homunculus), the journal, pause, help and settings.
* **`tutorial.js`** is the guided first order, 17 short steps in the coach
  row:
  1. harvest the well and the dew;
  2. pour 50 ml of water and 50 ml of dew, and stir;
  3. test on the toad and set the ID sliders;
  4. bottle, offer and haggle.

  Each step advances on what actually happens. The coach highlights its
  target, or the target's room tab, and scrolls it into view. It never
  sits on top of a control. It jumps ahead when the player is already
  further along (bottled early, already haggling, sold). "Play the guided
  order" in the menu replays it in any shop (`startGuidedOrder`), and a
  shop carried over from an older version is offered it once, together
  with a short note on what changed (`openWhatsNew`).
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
  When it activates as an update, it navigates the open pages, which
  may still run the old build, onto the new one. The game saves on
  `pagehide`. The offline browser test cuts the network and plays. The
  sub-path test checks that a redeploy reaches an open page by itself.
  `src/version.js` holds the version shown in the menu footer and in
  settings, and a test keeps it equal to `package.json`.
* `manifest.webmanifest` and the icons make the game installable;
  `scripts/make-icons.mjs` generates the icons and `scripts/make-font.py`
  generates the pixel font.

## 9. Verification strategy

| Layer | Tool | What is checked |
|---|---|---|
| Physics | `tests/physics.test.mjs` (23 scenarios) | piles and angle of repose, sleeping, no rebound, avalanches, calm pooling, stratification without gaps, progressive mixing and the stirring speed-up, equilibrium colour, dough and paste, freezing into one rigid block, crushing, conduction, boiling and condensing under the lid, gas containment, immiscibility under stirring, wall integrity, energy balance, snapshot round-trip, linear cost, fire spread, drying, hot-iron ignition and smothering |
| Magic | `tests/alchemy.test.mjs` (8 tests) | the garden world (water without magic, magic-only cards, most transitions out of reach), proportions, extraction and hot steeping, fading, a super transition, thresholds averaged by mixing into reach, heat-assisted mixing that stays mixed, the magic state conserved by stirring |
| Garden and testing room | `tests/testing.test.mjs` (6 tests) | every property readable on two creatures, honest but imperfect readings, real doses from the tap and harm, the Potion ID per batch and its staleness, real-time growth (plants only while moist), the well, planting costs and rank locks |
| Wording | `tests/wording.test.mjs` (8 tests) | ingredient lore, customer lines, potion names, journal entries and awards are magic-only; old saves are rewritten on load; the haggle floor; the version label; a blank ID is never stale; the guided order replayed after sales; the what's-new note for 1.x saves |
| Game rules | `tests/game.test.mjs` (11 tests) | seeded worlds with requests in magic terms only, achievability brewed in the real simulation, haggling, the label gate, unavoidable refunds, bluffs with and without certificates, certification, progress and the stipend, save round-trip, a genuine v3 save migrating, corrupted, partial and future saves |
| Rendering | `tests/render.test.mjs` (1 test) | every phase drawn where its particles are |
| Browser | `tests/browser/*.spec.mjs` (71 runs over 6 profiles) | layouts and ≥ 44 px touch targets in every room; the coach row and the status line never covering a control; the guided first order end to end (garden, dose buttons, stirring by touch, a toad test with no numbers on the cage, the “? → 0” button, bottling, haggling, the parting card); the label gate with the counter's own explanations, haggle captions and the offer floor, certification; complaints and a caught bluff; a real tap writing 0 on an unset ID slider and keyboard steps keeping focus; no “null/undefined/NaN” in any room; the garden by tap and by button with persistence; the dropper, flame pixels in the salamander's cage, ID persistence and replacement; tools, jar drag-to-pour and the mortar; equipment; saves (continue, cauldron, export and import, damaged save); settings; sandbox physics; offline build; GitHub Pages sub-path build |
| Types | `tsc` with `checkJs` | `src/`, `scripts/`, `tests/` |
| Performance | `scripts/bench.mjs` | physics ms per step; in-browser fps, frame-time percentiles, physics and render split, simulation speed, memory soak |
| Balance | `scripts/playtest.mjs`, `scripts/achievability.mjs` | a 10-day economy (garden, tests, haggling, refunds, certification) for two player profiles; normal and super-transition requests brewed in the real simulation |
