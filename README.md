# The Alchemist's Shop

A physics-driven potion-brewing game for the browser, designed for phones
first. You run a small medieval apothecary. Customers walk in with orders
("a healing tonic, at least moderately strong, served warm"). You fill them
by gathering herbs and minerals in the wilds, grinding them, and then
pouring, stirring, steeping, heating, freezing and crushing simulated
materials in a cauldron. You test what you made on live subjects before
anyone drinks it.

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
  arcana, transformation, fire, frost, acidity, toxicity and death. They
  come from what is actually dissolved in each particle:
  * a whole root does nothing until it is crushed or ground;
  * hot steeping extracts more than cold;
  * fire and frost cancel where they meet;
  * each world has six hidden laws that transmute, amplify or suppress
    effects that meet inside the brew;
  * heat, reactions, boiling and dilution change the result.
* **The trials room.** You give real, measured doses (5, 10 or 25 ml from
  the tap or the sealed vial) to a moon rabbit, a copper beetle, a bean
  seedling, a limestone block or a captive wisp. Each shows only some
  effects. Subjects can be harmed or killed and cost coins to replace.
  Repeated trials uncover the hidden laws. A customer only accepts a potion
  whose effects were verified on that very batch; pouring anything new
  invalidates the test.
* **The wilds.** Six regions, two of them magical and opened by rank. Their
  deposits are finite and regrow with real time, even while the game is
  closed. Some reagents can only be gathered.
* **Electricity.** Charged reagents carry a conserved charge that flows
  through conductive brews. Oil insulates, and current heats what it
  passes through.
* **A procedural world per seed.** Every new shop generates its own
  reagents (names, colours, densities, viscosities, melting and boiling
  points, effects), reactions, wild deposits, hidden laws and customers.
* **Achievable orders.** Every commission, physical or effect-based, is
  derived from a hidden reference plan made only from what you can buy or
  gather. It is checked with the same mixture and effect laws the
  simulation uses. The automated tests brew samples of these plans in the
  real simulation.
* **A shop to grow.**
  * Coins, reputation and six guild ranks.
  * 29 pieces of equipment: furnaces, frost plates, bigger cauldrons, a
    mortar, instruments, a galvanometer, a clockwork stirrer, an alembic, a
    wisp lantern, a forager's satchel, and a homunculus that brews your
    saved recipes.
  * A recipe book, a trial log, the laws you have found, a discovery
    journal, achievements, market days and guild contracts.
* **Free Experiment mode** with every reagent, tool, subject and region
  unlocked.
* **Mobile first, desktop too.**
  * A bottom tab bar over five rooms (Counter, Brew, Wilds, Trials, Book).
  * Drag a jar onto the cauldron, or drag the dropper onto a subject.
    Every gesture except skimming has a tap alternative.
  * Touch targets of at least 44 px, and portrait, landscape, tablet and
    desktop layouts.
  * Installable and fully offline, with saves on the device and
    export/import.
* **Everything is original and bundled:** pixel art drawn in code, a
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
npm test                  # 50 headless tests: physics, game rules, effects, trials & wilds, renderer
npx playwright install chromium   # once, if no Chromium is available
npm run test:browser      # 64 browser tests: desktop / phone / tablet emulation, offline build, GitHub Pages sub-path
npm run bench             # measured physics and frame timings → docs/perf-results.json
node scripts/playtest.mjs # automated 12-day balancing playthrough → docs/playtest-results.json
node scripts/achievability.mjs 30   # brew 30 generated commissions in the real simulation
npm run check             # typecheck + tests + build
```

Browser screenshots from the test run land in `test-results/screenshots/`.

## How to play

1. **Counter.** Read the order. Each requirement shows its target; effects
   show "?" until you have tested them.
2. **Wilds.** Gather what the order needs by tapping a deposit, or buy
   reagents at the Market (bag icon).
3. **Brew.** Pour in one of three ways: tap a jar and hold inside the
   cauldron, tap a jar and use the dose buttons, or drag the jar onto the
   cauldron. Switch on **Ground** to grind roots and stones in the mortar
   first. Stir with the spoon, and slide the fire control to heat or cool.
4. **Trials.** Drag the dropper onto a subject, or press its **Test**
   button. The report compares what happened with the guild's theory.
   Surprises point at hidden laws.
5. **Bottle** into a sealed vial and **serve** it at the Counter. Payment
   follows how well it matches. Save good brews as recipes in the Book.

Keyboard: `C` `V` `W` `T` `J` rooms, `1`–`5` tools, `G` ground, `L` lid,
`B` bottle, `F` time speed, `A` auto-stir, `H` thermal view, arrows fire,
`0` fire off, `S` market, `R` recipes, `Esc` menu.

## Project layout

```
index.html, styles/, assets/     page shell, stylesheet, pixel font, icons
src/core/                        seeded RNG, colour science (Beer–Lambert, OKLab), maths
src/alchemy/                     effects: extraction, hidden resonance laws, oppositions, theory
src/materials/                   material schema, procedural world generator, effect profiles, wild ingredients, names
src/reactions/                   species table, mixture laws, diffusion, reactions & combustion
src/simulation/                  particle world: solver, grid, cauldron, thermal, electricity, phases, rigid blocks, tools
src/game/                        world state, commissions, prediction, measurement, scoring, trials, gathering, economy, saves
src/rendering/                   fine-pixel fluid renderer, procedural pixel art, effects, portraits, wilds and subjects
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
