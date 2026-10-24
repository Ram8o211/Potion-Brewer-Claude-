# The Alchemist's Shop

A physics-driven potion-brewing game for the browser, designed for phones
first. You run a small medieval apothecary. Customers walk in with orders
("a healing tonic, at least moderately strong, served warm"). You fill them
by gathering herbs and minerals in the wilds, grinding them, and then
pouring, stirring, steeping, heating, freezing and crushing simulated
materials in a cauldron. You test what you made on the Moon Rabbits of
your own farm before anyone drinks it.

Nothing is faked with recipes or lookup tables. The colour, density,
thickness, temperature and magical effects of the potion you bottle are
computed from the particles that actually run out of the tap. What a
*mixture* does stays hidden until you test it.

* **Real simulation at the centre.** Liquids pool, layer by density and
  never leave gaps. Powders pile up at an angle of repose and settle to
  sleep. Dough forms only when a binding powder is kneaded into a liquid,
  and more liquid thins it back to a paste. Frozen liquid becomes one rigid
  block that the pestle crushes into grains. Vapour rises, collects under
  the lid and condenses back on the cooler iron. Mixing starts where two
  liquids touch and spreads; stirring speeds it up dramatically. Heat comes
  in through the bottom and conducts outward. Water boils at its boiling
  point, wet pastes dry out, oil catches fire on glowing iron and the lid
  smothers it.
* **Hidden, emergent effects.** Ten effects: vitality, strength, love,
  arcana, transformation, fire, frost, acidity, toxicity and death,
  measured as percent effective concentration (everyday orders want about
  8–15 %). They come from what is actually dissolved in each particle:
  * a whole root does nothing until it is crushed or ground;
  * hot steeping extracts more than cold;
  * the guild's opposing pairs cancel where they meet: fire and frost,
    life and death (life also mends poison, two parts to one), acid and
    alkali;
  * each world has six hidden laws that transmute, amplify or suppress
    effects that meet inside the brew;
  * heat, reactions, boiling and dilution change the result.
* **Only natural ingredients, and none of them pure.** The market sells no
  prepared reagents — just the free well water and two plain solvents (oil
  and spirit) that carry no magic. Every effect comes from 36 herbs, roots,
  fungi, berries, shells and minerals gathered in the wilds, and every one
  of them carries a main effect *and* side effects: Silverleaf heals but
  leaves a frosty bite, Heartpetal's love comes with the heat of passion,
  Nettle's strength stings with acid, Witch's Ear sharpens the mind with a
  breath of decay. Side effects always sit on an opposing pair, so the
  craft is balancing ingredients against each other — Sunthistle's fire
  cancels Silverleaf's frost, River Chalk settles Nettle's acid — until
  only what the customer asked for remains. Long-press an ingredient to see
  its side effects and what cancels them. Each kind of ingredient has its
  own sprite and its own surface in the cauldron (bark plates, glossy
  berries, fungus gills, ribbed seeds, pearly shells, metallic nuggets,
  black glass, spotted caps, velvet reeds…).
* **Arcane awakening.** Magical ingredients carry a hidden activation
  threshold (−1000…+1000, mapped onto temperature). Heat or chill a
  well-mixed brew past the volume-weighted threshold of its magic and that
  magic awakens — glowing in the colour of its effect, several times
  stronger, and it stays awake through cooling, bottling and saving.
* **A living rabbit colony.** Your Moon Rabbits are individuals with
  names, inherited coats, ages and family trees. Every dose acts on the
  rabbit's body and shows — muscles, hearts, frost, flames, acid burns, a
  green pallor, sparkling runes — and transformation magic grows horns,
  antlers, wings, scales or a third eye that stay for life. Rabbits can
  die; their bodies keep every change, and their bones, pelt or ashes can
  be recovered once as new ingredients that carry what they absorbed.
  Healthy pairs have kits overnight; buy, feed and house them (the kennel
  and warren make room). Any trial can be replayed without spending a drop.
* **The rabbit farm (the Trials room).** Rabbits are the only test
  subjects, and you test them right in the hutch: tap a rabbit (or drag
  the dropper onto it) and give it a real, measured dose (5, 10 or 25 ml
  from the tap or the sealed vial).
  * A rabbit shows every effect, but never exactly: each rabbit feels each
    effect a little more or less than the next (a hidden, lifelong bias of
    about ±10 %), and every dose varies a lot (about ±30 %, so a first
    trial is only a rough guess). One section, **Expected effects
    of this batch**, pools every trial of the brew: each effect as a
    percentage, plainly computed: the mean of every trial ± their sample
    margin within which the true strength lies, with how many trials on how
    many rabbits and an **evidence level**: one reading (a rough guess,
    with the full margin of a single dose — never ±0), repeated on one
    rabbit, corroborated on several, certified. The observed spread between
    readings is shown separately. Trials on the same rabbit keep the others
    clean but keep that rabbit's own bias in the mean; other rabbits average
    it out. A hurt rabbit (below half its health) reads less steadily.
    Your label sells on the mean and carries its evidence: customers trust,
    and pay for, corroborated readings more than one, cautious ones insist
    on repeated or corroborated proof, and a customer complains when the
    real potion is far from the label. Bottles of one batch share its
    trials, each checked against its own contents.
  * The chosen rabbit shows a bar per effect channel (acid and lye apart)
    with how much of it is active in it right now, plus its health (current
    / maximum). Doses are cumulative and fade slowly in real time (about a
    seven-minute half-life, faster overnight).
  * **Fire and acid burn** for as long as any of them is active in a
    rabbit: a slow, steady loss of health that grows with the percentage
    (about 0.05 health a second at 30 %, 0.14 at 60 %, 0.3 at the top) and
    stops its healing until the mark has faded.
  * Every rabbit has its own **hidden degeneration threshold for every
    channel** (somewhere around 45–95, never shown). Past it the effect
    runs out of control and keeps climbing on its own, faster or slower
    depending on the rabbit, until it reaches the top and kills the rabbit
    (poison, death, acid, lye, fire and frost eat its health on the way). A
    mark driven to the top is always death. So piling trials on one rabbit
    spares the others but risks crossing a line you cannot see.
  * **Aggression** comes from the effect itself: strength, vitality, arcana
    and transformation make a rabbit attack the others once the mark is past
    its own aggression threshold — hidden, and independent of the
    degeneration threshold — whether or not it is degenerating.
  * **Love** makes a rabbit mate with the others in real time, faster and
    faster the higher it is (does may conceive); every mating wears it out,
    so too much love — or love running out of control — kills it.
  * A **purging draught** washes every effect out of a rabbit and stops any
    degeneration (what grew for good stays). You start with two, buy more
    from the apothecary (8 coins), and once you can afford the guild's
    **Purging Still** you brew your own (1 coin and 40 seconds each).
  * **Put down** any rabbit at any time — an aggressive one before it
    kills again; the body stays for its remains or burial.
  * Vitality heals what a rabbit is missing; given to a rabbit already at
    full health it raises its maximum health instead.
  * Repeated trials uncover the hidden laws. Pouring anything new
    invalidates earlier tests of the batch.
* **Potion shelves.** Bottle the cauldron whenever you like — onto the
  counter, or into a sealed glass bottle on your potion shelves, as long as
  there is room. Each bottle keeps its exact contents; take it down later
  to test, label and sell it (the bottle on the counter goes up in its
  place), pour it back into a new brew or pour it away. The shop starts
  with room for 3 bottles; a Bottle Shelf (6), a Potion Cabinet (12) and a
  Bottle Cellar (24) add more.
* **Trade.** A bottle whose batch has been tested labels itself — the
  tested values, the guild's estimates for the rest — and keeps its label up
  to date as further trials of the batch come in, so every bottle of that
  batch (on the counter or the shelves, where hovering a bottle shows its
  label) can be read and sold without testing it again. Every tested value
  carries its standard deviation (σ), and accuracy stars — ☆☆☆ to ★★★ —
  show at a glance how far to trust it: one reading earns none, two earn
  one, three or four on more than one rabbit two, about six on two or three
  rabbits all three. A bottle rates as the mean σ of its tested effects
  (relative to each reading), weighted by how strong each effect measured;
  estimates and figures you write yourself earn no stars. A tested bottle
  keeps its label when it is shelved, taken down, or poured back into an
  empty cauldron (or into the unchanged batch it came from) and bottled
  again. Revise the label
  with what you know — tested values, estimates, "none" or unknown — and
  bargain with customers who
  each haggle, trust and need proof differently. They pay the agreed
  price, drink the real potion and come back the next day: pleased, with a
  fair complaint, or a dishonest one you can dispute with your trial
  records. Many orders forbid any side effect above 1.2 %.
* **The wilds.** Six regions, two of them magical and opened by rank, with
  36 natural ingredients between them. Each
  ingredient is picked, dug, chipped, scraped or swept (without the
  Forager's Kit half of what you dig, chip, scrape or sweep is spoiled), some only open at dawn (before
  you open the shop door) or dusk (after the last customer),
  the weather changes daily, careful hands leave part of every deposit to
  regrow, and a thorough harvest strips it and scars it. Deposits are
  finite and regrow with real time, even while the game is closed.
* **Electricity.** Charged reagents carry a conserved charge that flows
  through conductive brews. Oil insulates, and current heats what it
  passes through.
* **A procedural world per seed.** Every new shop generates its own
  reagents (names, colours, densities, viscosities, melting and boiling
  points, effects), reactions, wild deposits, hidden laws and customers.
* **Orders judged on outcomes.** Customers ask for what a customer can
  judge: the effects at a strength, nothing else above the purity limit,
  and the quantity — never the temperature it is served at; from Adept
  on, brews stronger than plain brewing gives (boil water off, or
  use more herb). How you get there is yours: grinding, the steeping heat,
  cold steeps, stirring, awakening and boiling down all change what ends
  up in the bottle. Density, viscosity, stability, volatility and charge
  are simulated and visible, never asked for. The order card says what a
  technique takes, how much to brew and where today's carriers of each
  effect can be found. See `docs/GAMEPLAY_ARCHITECTURE.md`.
* **Achievable orders.** Every commission is derived from a hidden
  reference plan made only from what you can gather today, hold, or
  legally buy with the coins you have — gather-only finds are never for
  sale — and accepted only if the predicted potion passes the counter's
  own scoring, techniques, awakening stages and the purity rule included.
  An order that cannot be met gives way to an easier one; the day never
  stalls. Because no
  ingredient is pure, the planner balances carriers of the wanted effects
  against helpers whose effects oppose their side effects (a least-squares
  solve on the opposing pairs, refined with the predictor), so every plan
  is a real neutralisation puzzle. A feasibility run brews generated
  orders in the real simulation.
* **A shop to grow.**
  * Coins, reputation and six guild ranks.
  * A starting kit that covers the core craft (hearth, cold basin, pot,
    spoon, pestle, thermometer) and 16 purchases, each of which
    lets you do something new or faster: the Forager's Kit and satchel,
    three sizes of potion shelving, the frost rune and glacial sigil
    (deep cold for cold awakenings and narrow steeps), a clockwork
    stirrer, the arcanometer (auras and arcane thresholds), a kennel,
    warren and purging still, larger cauldrons, the guild charter and a
    homunculus that brews your saved recipes.
  * A recipe book that keeps a brew's formulation, its procedure (pours,
    grinding, stirring, every heat, chill and boil-down held, the lid)
    and whether it was reproduced apart; the homunculus replays the
    procedure, and a batch only counts as the recipe when it was
    prepared the same way where that changes the potion. A trial log, the
    laws you have found, a discovery journal, achievements, market days
    and guild contracts.
  * Returning customers who remember how your last potion worked, and
    less reputation for selling the same order again and again.
* **Free Experiment mode** with every reagent, tool, rabbit and region
  unlocked, plus the physics demonstrations the campaign does not need:
  the skimmer, the alembic, the heat map, a hotter furnace and the exact
  readings of density, viscosity, stability, volatility and charge.
* **Mobile first, desktop too.**
  * A bottom tab bar over five rooms (Counter, Brew, Wilds, Trials, Book).
  * A guided tour on a new game walks through every room and control,
    step by step, in a strip of its own that never covers a control
    (replay it from the menu).
  * Every tool shows its name under its icon.
  * Drag a jar onto the cauldron, or drag the dropper onto a rabbit.
    Every gesture has a tap alternative.
  * Touch targets of at least 44 px, and portrait, landscape, tablet and
    desktop layouts.
  * Installable and fully offline, with saves on the device and
    export/import.
* **Pixel art painted in code:** layered wilds panoramas, shown until a
  region's sprites have loaded (lit oak
  canopies and light shafts, a willow river, terraced quarry faces with a
  crane and lantern, a moonlit bog of willows, crystals and wisps, smoking
  volcanic crags), a furnished workshop (brick wall, shelves of jars and
  plants, drying herbs, ivy, barrel, sack, firewood under the cauldron), a
  hutch with a hay rack, a thatched hide box and a fence, shaded rabbits,
  and wood-grain, parchment and nail textures on the interface.
* **Sprite-composed wilds:** Whisperwood, Willow Bank, Ironstone Quarry,
  Moonfen and the Ember Crags are each composed in layers from their own
  atlas (`assets/wilds/<region>.png`, 40–90 KB each) built from the
  corrected Wilds sprite pack: the pack's sky and parallax strips (canopy
  and tree lines, mountains and pines, cliff faces, the moonlit bog and its
  mist, smoky volcanic ridges and lava fissures), then the region's terrain
  and scenery — ancient oaks, willows, a river with its chalk bank, a crane
  and timber frames, drowned stumps and pools of black water, lava crags,
  vents and a lava pool. Every ingredient of those regions is an outlined
  sprite with hover and depleted (harvested) frames; the dusk Nightshade,
  Grave Moss and Siren Reed and the dawn Moonlily show their closed state
  out of their hour, and each has its icon on the deposit card, the shelf
  and in the book. Nothing decorative looks like a gatherable, and only
  deposits take taps. Built from `art/wilds/` by
  `python scripts/make-wilds.py` (needs Pillow and NumPy);
  `art/wilds/README.md` lists which sprite went where and how it was
  changed.
* **Sunlit Meadow sprites:** the meadow is composed in layers from its own
  atlas (`assets/meadow/atlas.png`, 53 KB): the pack's sky, clouds and
  birds, far and near mountains, a treeline of firs, a split-rail fence,
  the great oak, bushes, rocks, small flower clumps and grass. Each meadow
  ingredient (Heartpetal, Sunthistle, Nettle, Dreamclover, Bee Balm,
  Hemlock Seed) is an outlined sprite with hover and depleted frames; the
  dawn Dreamclover and the dusk Hemlock show their closed buds and seed
  pods out of their hour. The same art gives every meadow ingredient its
  icon on the deposit card, the shelf and in the book. Built from
  `art/meadow/` by `python scripts/make-meadow.py` (needs Pillow and
  NumPy); `art/meadow/README.md` lists which sprite went where and how it
  was changed.
* **Everything is original and bundled:** pixel art drawn in code (plus
  the wilds' sprites from the project's own concept-art packs), a
  pixel font, synthesised sound effects and music. No third-party runtime
  code, no CDNs, no network calls.

## Quick start

Requirements: Node.js 20 or newer (tested with Node 22). No runtime
dependencies; the dev dependencies are only for type checking and browser
tests.

```bash
npm install               # TypeScript + Playwright (dev only)
npm run dev               # http://localhost:5173  (serves the source directly)
```

Open <http://localhost:5173> on a desktop browser, or on a phone on the same
network (`http://<your-computer-ip>:5173`).

### Production build

```bash
npm run build             # → dist/  and  release/alchemists-shop-<version>-web.zip
npm run serve:dist        # http://localhost:4173  (preview the build)
```

`dist/` is a static site: copy it to any web server (a sub-path works).
The service worker precaches the whole build on the first visit, so the
game then runs offline and can be installed to the home screen. Opening
`dist/index.html` straight from disk (`file://`) is not supported: browsers
block ES modules and service workers there.

### Play it on GitHub Pages

The repository is a ready-to-serve static site, so GitHub Pages can host it
straight from a branch with no build step:

1. On GitHub open **Settings → Pages**.
2. Under **Build and deployment** choose **Source: Deploy from a branch**,
   then pick the branch that holds this code (`main`), folder
   **`/ (root)`**, and press **Save**.
3. After a minute or two the site is live:
   * <https://ram8o211.github.io/Potion-Brewer-Claude-/> — the game straight
     from the source modules;
   * <https://ram8o211.github.io/Potion-Brewer-Claude-/dist/> — the
     optimised production build (one bundled script, fully precached for
     offline play). This is the one to share or install on a phone.

Both copies use the same save on that device. Pages needs a public
repository on a free account (this one is public). Every push to the chosen
branch redeploys automatically; Pages caches files for up to 10 minutes, so
a fresh deploy can take that long to show up.

The browser test project `pages-subpath` serves the repository the same way
(under `/Potion-Brewer-Claude-/`, with Pages-style 10-minute caching for the
redeploy check). It plays both copies, checks that each keeps its own
offline cache, that the build plays with the server stopped, that a
redeploy reaches returning players, and that a stale second tab cannot
overwrite a newer save.

### Verification

```bash
npm run typecheck         # TypeScript (checkJs) over src/, scripts/ and tests/
npm test                  # headless tests: physics, game rules, effects, the rabbit farm, wilds, renderer
npx playwright install chromium   # once, if no Chromium is available
npm run test:browser      # browser tests: desktop / phone / tablet emulation, offline build, GitHub Pages sub-path
npm run bench             # measured physics and frame timings → docs/perf-results.json
node scripts/playtest.mjs 8 3      # five automated player profiles, 3 worlds × 8 days, the real loop → docs/playtest-results.json
node scripts/achievability.mjs 2 ach docs/achievability-results.json   # brew generated commissions (every tier and technique) in the real simulation
npm run check             # typecheck + tests + build
```

Browser screenshots from the test run land in `test-results/screenshots/`.

## How to play

0. **Dawn.** Each day starts with the shop closed: gather dawn flowers in
   the Wilds, brew ahead for the shelves, then open the door.
1. **Counter.** Read the order. Each requirement shows its target; effects
   show "?" until you have tested them. "What it takes" explains the
   techniques; the supplies line says how much to brew and where the
   ingredients for each effect can be had today.
2. **Wilds.** Gather what the order needs by tapping a deposit, or buy
   the common herbs in the Shop (top bar) from Journeyman on.
3. **Brew.** Pour in one of three ways: tap a jar and hold inside the
   cauldron, tap a jar and use the dose buttons, or drag the jar onto the
   cauldron. Roots, leaves and stones go in whole: break them up with
   **Crush** (the pestle). Stir with the spoon, slide the fire control to
   heat or cool, and tap **Off** beside it to put it out.
4. **Trials.** Tap a rabbit in the hutch and press **Give**, or drag the
   dropper onto it. Test several different rabbits before you trust the
   estimate, and watch their status bars: purge or rest a rabbit before an
   effect passes the tick and degenerates. The report compares what happened with the guild's theory.
   Surprises point at hidden laws.
5. **Bottle** into a sealed vial and **serve** it at the Counter, or keep
   it on the potion shelves for a later customer (the counter points out a
   tested bottle that already meets an order). Label it, bargain (the
   customer shows what they weigh), and hear their verdict tomorrow. Save
   good brews as recipes in the Book: they keep every step.

Keyboard: `C` `V` `W` `T` `J` rooms, `1`–`5` tools, `G` ground, `L` lid,
`B` bottle, `F` time speed, `A` auto-stir, `H` thermal view, arrows fire,
`0` fire off, `S` market, `R` recipes, `Esc` menu.

## Project layout

```
index.html, styles/, assets/     page shell, stylesheet, pixel font, icons, Whisperwood and Meadow sprite atlases
art/                             source art for generated assets (not shipped)
src/core/                        seeded RNG, colour science (Beer–Lambert, OKLab), maths
src/alchemy/                     effects: extraction, hidden resonance laws, oppositions, theory
src/materials/                   material schema, procedural world generator, effect profiles, wild ingredients, names
src/reactions/                   species table, mixture laws, diffusion, reactions & combustion
src/simulation/                  particle world: solver, grid, cauldron, thermal, electricity, phases, rigid blocks, tools
src/game/                        world state, commissions, prediction, measurement, scoring, trials, gathering, economy, saves
src/rendering/                   fine-pixel fluid renderer, procedural pixel art, effects, portraits, wilds panoramas, the hutch and its rabbits
src/ui/                          shell and Brew room, views/ (counter, wilds, trials, book), panels, tutorial, input
src/audio/                       synthesised sound effects and music (WebAudio)
sw.js, manifest.webmanifest      offline support / installable app
scripts/                         dev server, build, benchmarks, playtest, asset generators
tests/                           headless tests (node --test) and browser tests (Playwright)
docs/                            architecture, report, checklist, measured results
```

## Documentation

* [FEATURE_PARITY.md](FEATURE_PARITY.md): feature-by-feature comparison
  with `Ram8o211/fluid-pocket-sandbox`, and how each idea was integrated.
* [docs/GAME_ARCHITECTURE.md](docs/GAME_ARCHITECTURE.md): how the
  simulation, effects, game rules, rendering and UI fit together.
* [docs/MOBILE_UX.md](docs/MOBILE_UX.md): rooms, layouts, gestures and
  their alternatives, touch targets.
* [docs/PERFORMANCE.md](docs/PERFORMANCE.md): measured physics and frame
  timings, graphics presets, what was optimised.
* [docs/REPORT.md](docs/REPORT.md): implementation, balancing and
  performance report with the measured numbers.
* [docs/screenshots/](docs/screenshots/): every room on phone portrait,
  phone landscape, tablet and desktop (`room-<profile>-<room>.png`), plus
  scenes from the browser tests.
* [docs/CHECKLIST.md](docs/CHECKLIST.md): the brief, item by item, with
  where each requirement is implemented and how it was verified.
* [docs/GAMEPLAY_INTEGRATION_REPORT.md](docs/GAMEPLAY_INTEGRATION_REPORT.md):
  the gameplay integration audit — weaknesses found, fixes, how the
  systems now connect, measured balance, and remaining limitations.

## A note on the starting point

The game's engine and first version were written from scratch, because the
`Ram8o211/fluid-pocket-sandbox` project was not available in that
workspace. In a later round that project *was* available. Its ideas were
then re-implemented natively on this game's own engine: hidden effects,
experiment subjects, gathering, grinding, conductivity and the mobile
navigation. No code was copied, and the game's original mechanics were
kept. `FEATURE_PARITY.md` documents each feature.

Phone and tablet behaviour was verified in desktop Chromium emulation
(viewport, touch events, device pixel ratio, CPU throttling), not on
physical devices.
