# The Alchemist's Shop

A physics-driven potion-brewing game for the browser. You run a small
medieval apothecary: customers walk in with orders ("a warm amber tonic,
served at about 50 °C"), and you fill them by pouring, stirring, heating,
freezing and crushing simulated materials in a cauldron. Nothing is faked
with recipes or lookup tables: the colour, density, thickness, temperature
and potency of the potion you bottle are measured from the particles that
actually run out of the tap.

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
* **A procedural world per seed.** Every new shop generates its own
  reagents (names, colours, densities, viscosities, melting and boiling
  points, magical aspects), reactions and customers. You start with at
  least six liquids and two powders.
* **Achievable orders.** Every commission is derived from a hidden
  reference plan made only from what you can buy, and checked with the
  same mixture laws the simulation uses. The automated test suite brews
  samples of these plans in the real simulation.
* **A shop to grow.** Coins, reputation and six guild ranks; 24 pieces of
  equipment (furnaces, frost plates, bigger cauldrons, instruments, a
  clockwork stirrer, an alembic, a homunculus that brews your saved
  recipes); a recipe book, a discovery journal, achievements, market days
  and guild contracts.
* **Free Experiment mode** with every reagent and tool unlocked.
* **Mobile first, desktop too.** Touch and mouse, portrait and landscape,
  phone, tablet and desktop layouts. Installable, works fully offline,
  saves on the device with export/import.
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
   then pick the branch that holds this code (for example `main` once the
   work is merged, or `ccr-7feac1c1-20xdai`), folder **`/ (root)`**, and
   press **Save**.
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
npm test                  # 34 headless tests: physics scenarios + game logic
npx playwright install chromium   # once, if no Chromium is available
npm run test:browser      # 48 browser tests: desktop / phone / tablet emulation, offline build, GitHub Pages sub-path
npm run bench             # measured physics and frame timings → docs/perf-results.json
node scripts/playtest.mjs # automated 12-day balancing playthrough → docs/playtest-results.json
node scripts/achievability.mjs 20   # brew 20 generated commissions in the real simulation
npm run check             # typecheck + tests + build
```

Browser screenshots from the test run land in `test-results/screenshots/`.

## How to play

1. Read the order card: each requirement shows the target and a live meter
   of how well the brew in the cauldron matches it right now.
2. Tap a jar on the shelf, then hold your finger (or mouse) inside the
   cauldron to pour, or use the 25 / 50 / 100 / 250 ml dose buttons.
3. Pick the spoon and drag through the brew to stir. Powders plus a
   watery liquid knead into dough.
4. Slide the fire control right to heat, left to cool. Keep the lid on to
   trap vapour.
5. Press **Bottle**: the potion is drawn from the tap at the bottom, so
   the lowest layer comes out first. The customer pays according to how
   well it matches.

Keyboard: `1`–`5` tools, `L` lid, `B` bottle, `F` time speed, `A`
auto-stir, `T` thermal view, arrows fire, `0` fire off, `S` shop, `R`
recipes, `J` journal, `Esc` menu.

## Project layout

```
index.html, styles/, assets/     page shell, stylesheet, pixel font, icons
src/core/                        seeded RNG, colour science (Beer–Lambert, OKLab), maths
src/materials/                   material schema, procedural world generator, names
src/reactions/                   species table, mixture laws, diffusion, reactions & combustion
src/simulation/                  particle world: solver, grid, cauldron, thermal, phases, rigid blocks, tools
src/game/                        world state, commissions, prediction, measurement, scoring, economy, saves
src/rendering/                   fine-pixel fluid renderer, procedural pixel art, effects, portraits
src/ui/                          screens, panels, tutorial, input
src/audio/                       synthesised sound effects and music (WebAudio)
sw.js, manifest.webmanifest      offline support / installable app
scripts/                         dev server, build, benchmarks, playtest, asset generators
tests/                           headless tests (node --test) and browser tests (Playwright)
docs/                            architecture, report, checklist, measured results
```

## Documentation

* [docs/GAME_ARCHITECTURE.md](docs/GAME_ARCHITECTURE.md): how the
  simulation, game rules, rendering and UI fit together.
* [docs/REPORT.md](docs/REPORT.md): gameplay, balancing and performance
  report with the measured numbers.
* [docs/CHECKLIST.md](docs/CHECKLIST.md): the brief, item by item, with
  where each requirement is implemented and how it was verified.

## A note on the starting point

The brief asked for this game to be developed from the
`Ram8o211/fluid-pocket-sandbox` project. That code was not present in this
workspace, and fetching it from GitHub was outside what this task was
allowed to do, so the game was built from scratch. It follows the
architecture the brief describes: a unified particle simulation with
liquids, powders, pastes, rigid frozen blocks and gases; contact-based
diffusion; local heat; and fine-pixel rendering.

Phone and tablet behaviour was verified in desktop Chromium emulation
(viewport, touch events, device pixel ratio, CPU throttling), not on
physical devices.
