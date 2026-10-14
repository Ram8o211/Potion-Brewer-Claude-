# The Alchemist's Shop

A physics-driven potion-brewing game for the browser, designed for phones
first. You run a small medieval apothecary. Customers walk in with a
problem ("my son caught a fever: something that mends, and nothing that
harms") and ask for **magical effects**: at least so much vitality, no more
than so much bane. You grow every ingredient in your own garden, blend them
in a simulated cauldron, find out what you actually made by testing it on
creatures, write the potion's ID on the label, and haggle over the price.

Nothing is faked with recipes or lookup tables. The magic of the potion you
bottle is computed from the particles that actually run out of the tap.

* **Six magical properties and nothing else.** Vitality, ardor, frost,
  levity, charm and bane. Every ingredient's card shows only its magic
  (bars for the six properties) and how heat treats it. There are no
  densities or boiling points to read: the player thinks in magic.
* **Proportions make the potion.** A potion's magic is the
  volume-weighted blend of what is in it: plain water dilutes, and a 1:1
  blend of two ingredients sits halfway between them. Stones act once
  smashed and dissolved; steeping them hot draws their magic out.
* **Heat is a tool and a danger.**
  * Liquids that keep apart at room temperature (witch oil floats on
    water) blend once both are hot.
  * Every ingredient has a **fading** temperature: overheated, its magic
    burns away.
  * Every ingredient has a **super-transition** temperature, somewhere
    unrelated to where it melts or boils. Crossing it transmutes the magic:
    one property becomes extremely high and the rest drop to almost
    nothing. For most ingredients it lies at impossible extremes
    (+1300 °C, −1450 °C), but mixing averages the thresholds, weighted by
    magic. A hot ingredient blended with a cold one can bring the
    transition into an ordinary cauldron's range.
* **The garden is the only source.** It has a well of plain water, plant
  beds that give magical liquids (dew, ember sap, frostmilk, witch oil),
  and crystal beds that grow magical stones. Stones are gathered whole and
  smashed into powder in the mortar or with the pestle. Beds grow with
  real time, even while the game is closed. Plants grow only while
  watered, and watering costs well water. A harvest empties the bed, so
  waiting pays but never piles up.
* **The testing room.** You keep a moss toad, a salamander, a moon moth, a
  mandrake sprout and, later, a wisp. A real 10 ml dose from the tap or the
  vial makes a creature *show* what the potion does, with no words or
  numbers:
  * leaves sprout and hearts float;
  * flames rise or ice creeps up a notched post;
  * the moth lifts off;
  * toxic bubbles rise.

  Each creature shows only some properties, a little imprecisely. Bane and
  extreme heat or cold hurt them, they rest to recover, and a dead one
  costs coins to replace. From what you saw you set the six sliders of the
  **Potion ID**, which becomes the vial's label.
* **Selling is haggling.**
  * The customer reads the label and opens low. You ask a price, and they
    meet you partway, lose patience, or walk out at an insult.
  * What they drink is the truth. If it falls short, or a side effect goes
    over their limit, they **come back later and the refund cannot be
    refused**.
  * Some customers **bluff**: they claim a good potion failed. Only a
    certificate from an expert alchemist proves them wrong, and
    certification is expensive.
* **A procedural world per seed.** Every new shop has its own ingredient
  names, colours, and exact magic and thresholds (within each role's
  range), plus its own customers and market days.
* **Achievable orders.** Every request is derived from a hidden reference
  plan made only from ingredients your garden can grow, and checked with
  the same magic laws the simulation uses. The automated tests brew these
  plans in the real simulation, including ones that need a super
  transition.
* **A shop to grow.**
  * Coins, reputation and six guild ranks.
  * New garden beds to plant.
  * 26 pieces of equipment: furnaces and frost plates, bigger cauldrons, a
    pestle, a skimmer, a clockwork stirrer, a thermal monocle, a creature
    kennel, a wisp lantern, a rain barrel, a greenhouse, a crystal lamp, a
    sprinkler, shelves, a guild charter that makes certification cheaper,
    and a homunculus that brews your saved recipes.
  * A recipe book, an ingredient compendium, a discovery journal,
    achievements, a sales ledger, market days and guild contracts.
* **Free Experiment mode** with every ingredient, tool and creature
  unlocked.
* **Mobile first, desktop too.**
  * A bottom tab bar over five rooms: Counter, Brew, Garden, Testing and
    Book.
  * A small HUD. Requests, Potion IDs and labels are property names
    with icons and numbers. Notifications appear in the top bar's status
    line, and the tutorial coach has its own row, so neither ever covers a
    button. The browser tests check this on every layout. Sale feedback
    (what the label is missing, what the customer says) appears on the
    counter itself.
  * Drag a jar onto the cauldron or the dropper onto a creature. Every
    gesture except skimming has a tap alternative.
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

Pages serves only the branch picked in step 2. Work on any other branch
appears there only after it is merged into that branch. The main menu's
footer shows the version you are playing (for example `v2.0.1`). After a
new deploy, an open page switches itself to the new version as soon as
its service worker updates.

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
npm test                  # headless tests: physics, magic, garden, testing room, sales, saves, renderer
npx playwright install chromium   # once, if no Chromium is available
npm run test:browser      # browser tests: desktop / phone / tablet emulation, offline build, GitHub Pages sub-path
npm run bench             # measured physics and frame timings → docs/perf-results.json
node scripts/playtest.mjs # automated 10-day balancing playthrough → docs/playtest-results.json
node scripts/achievability.mjs 25   # brew 25 generated requests (and 25 super-transition ones) in the real simulation
npm run check             # typecheck + tests + build
```

Browser screenshots from the test run land in `test-results/screenshots/`
(`node scripts/curate-screenshots.mjs` copies a selection to
`docs/screenshots/`).

## How to play

1. **Counter.** A customer explains their problem. The request names the
   magic they need, for example "Vitality ≥ 30" and "Bane ≤ 10", and the
   bottle size. The bulb button buys rough guild advice for a few coins.
2. **Garden.** Harvest ripe beds, water the dry ones (it uses well water)
   and plant new beds as your rank grows. Tap a bed or use its buttons.
3. **Brew.** Pick a jar and pour with the dose buttons (10, 25, 50,
   100 ml), by holding inside the cauldron, or by dragging the jar onto
   it. Stones need the **mortar** first (or the pestle in the pot). Stir
   with the spoon. Slide the fire control to heat (binds magics that will
   not join cold, steeps stones, but fades magic when too hot) or to cool
   (a cold blend can cross a super transition).
4. **Testing.** Drag the dropper onto a creature or press its dose
   button. Watch the cage and replay the last reaction if you missed it.
   Then set the six Potion ID sliders to what you saw. Press **? → 0**
   for every property the creatures did not show. Pouring anything new
   makes the ID stale.
5. **Bottle** the brew. The vial carries your Potion ID as its label.
   * At the Counter, the vial card says in words what is still missing
     before the customer will buy.
   * Press **Offer**: the customer names a price. Ask for more with the
     ±1/±5 buttons and **Ask**, or **Take** their offer. They concede part
     of the way and lose patience, make a final offer, or walk out at an
     insult. **No deal** sends them away.
   * Then **Open the door** for the next visitor.
   * If you suspect a bluffer, have the vial **certified** first.
     Customers whose potion failed come back for their money, so test
     honestly.

Continuing a shop from an older version shows what changed once and
offers the guided order. The guided order can be replayed any time from
the menu.

Keyboard: `C` `V` `G` `T` `J` rooms, `1`–`4` tools (pour, spoon, pestle,
skimmer), `M` mortar, `L` lid, `B` bottle, `F` time speed, `A` auto-stir,
`H` thermal view, arrows fire, `0` fire off, `S` guild shop, `R` recipes,
`Esc` menu.

## Project layout

```
index.html, styles/, assets/     page shell, stylesheet, pixel font, icons
src/core/                        seeded RNG, colour science (Beer–Lambert, OKLab), maths
src/alchemy/                     magic: the six properties, proportions, extraction, fading, super transitions
src/materials/                   material schema, the garden ingredient world generator, reference materials
src/reactions/                   species table, mixture laws, heat-assisted miscibility, diffusion, combustion
src/simulation/                  particle world: solver, grid, cauldron, thermal, phases, rigid blocks, magic, tools
src/game/                        state, garden, testing room, requests, haggling, sales & refunds, prediction, saves
src/rendering/                   fine-pixel fluid renderer, procedural pixel art, creatures, garden, portraits
src/ui/                          shell and Brew room, views/ (counter, garden, testing, book), panels, tutorial
src/audio/                       synthesised sound effects and music (WebAudio)
sw.js, manifest.webmanifest      offline support / installable app
scripts/                         dev server, build, benchmarks, playtest, achievability, asset generators
tests/                           headless tests (node --test) and browser tests (Playwright)
docs/                            architecture, report, checklist, measured results
```

## Documentation

* [FEATURE_PARITY.md](FEATURE_PARITY.md): feature-by-feature comparison
  with `Ram8o211/fluid-pocket-sandbox`, and how each idea was integrated.
* [docs/GAME_ARCHITECTURE.md](docs/GAME_ARCHITECTURE.md): how the
  simulation, magic, garden, testing room, selling, rendering and UI fit
  together.
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

Release 2.0 rebuilt the game around magic. The six magical properties
replace the earlier ten hidden effects and the world's hidden laws. The
garden replaces the wilds and the market. The testing room's creatures and
the hand-written Potion ID replace the trials room's written reports.
Haggling, complaints, refunds, bluffs and certification replace fixed
payment. The particle physics underneath is the same engine.

Phone and tablet behaviour was verified in desktop Chromium emulation
(viewport, touch events, device pixel ratio, CPU throttling), not on
physical devices.
