# Gameplay, balancing and performance report

This report says what was actually run and what came out. All numbers come
from the scripts in this repository. Raw data:

* `docs/perf-results.json` from `npm run bench`
* `docs/playtest-results.json` from `node scripts/playtest.mjs`
* `test-results/browser-results.json` from the Playwright run

**Environment:** a cloud Linux container (Intel Xeon @ 2.8 GHz, 4 cores,
Node 22). Browser runs used headless Chromium (Playwright 1.56), which
renders the canvas in software.

**Phones and tablets were not tested on physical devices.** Their
numbers come from Chromium device emulation (viewport, touch events,
device pixel ratio 2, and 4× CPU throttling for the performance profile).
Safari/iOS and Firefox were not run.

## 1. Automated verification: results

| Suite | Command | Result |
|---|---|---|
| Type check (src, scripts, tests) | `npm run typecheck` | passes |
| Physics scenarios (23) | `npm test` | all pass |
| Game logic (11) | `npm test` | all pass |
| Browser (43 tests: desktop, phone portrait, phone landscape, tablet, offline build) | `npm run test:browser` | all pass |
| Production build | `npm run build` | 47 modules bundled; about 112 KB gzipped in total |

### Physics scenarios (headless, real solver)

Each scenario sets up a cauldron, runs the simulation and checks measurable
outcomes:

* **Powders.** A pile forms with an angle of repose and its grains go to
  sleep. Grains don't rebound. A disturbed pile avalanches and settles
  again.
* **Liquids.** Liquids pool calmly and stay contained. Immiscible liquids
  stratify by density without gaps and never blend even when stirred.
  Honey levels out measurably slower than water.
* **Mixing.** Mixing starts at the contact interface and spreads. Stirring
  speeds it up dramatically. Mixtures converge to a composition-weighted
  equilibrium colour.
* **Dough.** Dough forms only with stirring, and extra liquid thins it back.
  Paste holds its footprint while water and honey level out.
* **Freezing.** Freezing starts at the cold bottom and forms one rigid
  block. The pestle crushes it into grains with material conserved.
* **Heat and gas.** Heat enters through the bottom and conducts outward.
  Vapour stays under the lid and condenses back when cooled. Gas is
  buoyant and contained.
* **Integrity.** Vigorous stirring never pushes matter through the walls.
  Energy balances (furnace input minus ambient losses). A cauldron
  snapshot reproduces the state. Neighbour search cost stays linear.
* **Fire and drying.** Combustion spreads locally and consumes fuel. A
  wet paste dries: it holds near the boiling point, steams off its water
  and keeps at least 90% of its solids, with water conserved between pot
  and vented steam. Glowing iron lights an oil pool, and closing the lid
  puts the fire out.

### Game logic

* **Worlds.** Worlds are deterministic per seed and differ between seeds.
  Over 25 seeds every world starts with at least 6 liquids and 2 powders.
* **Day one.** In 12 fresh shops, the first order only uses purchasable
  reagents, reachable temperatures and an affordable shopping list.
* **Achievability.** 20 generated orders across all tiers (14 styles
  possible) were brewed from their hidden reference plans in the real
  simulation. Each reached quality ≥ 0.8 and the mean was ≥ 0.95.
  Separate runs of `scripts/achievability.mjs`:
  * 10 orders: 10 perfect.
  * 40 orders of mixed styles: 38 perfect, plus 0.92 and 0.86.
  * 30 "heavy" orders: 30 perfect, after the fix in §3.
* **Economy.** Scoring falls off outside tolerance, and a half-empty bottle
  is penalised. Buying respects coins and shelf space, and selling back
  pays 40%. Buy-and-sell loops lose money, and a sale can't be paid twice.
  The daily stipend prevents soft-locks and water is always free.
* **Progression and saves.** Perfect sales raise reputation and rank. Saves
  round-trip, including unlimited water. Version-1 saves migrate, worlds
  regenerate from the seed, and bad files are rejected with readable
  messages.

### Browser tests (real UI in Chromium)

* **Layout (desktop, phone portrait 390×844, phone landscape 844×390,
  tablet 820×1180).** No horizontal overflow. The cauldron covers more
  than 22% of the screen. Order card, shelf (8+ jars), tools, bottle and
  fire control are all on screen. Touch targets are at least 30 CSS px.
  Shop, recipe book, journal and pause panels open, fit the viewport and
  close.
* **Tutorial order end to end (desktop, phone portrait, phone landscape).**
  Pick jars and pour 150 ml water and 75 ml essence with the dose buttons
  (exactly 225 ml in the pot, inventory charged 75 ml). Stir with real
  pointer input: mouse on desktop, touch events through the DevTools
  protocol on phones. Mixing then evens out (essence spread < 0.35). Heat
  with the fire control past 44 °C, bottle, read the assessment, and save
  the recipe. Coins and reputation rise and the next customer arrives.
  The saved recipe is then prepared again from the recipe book, pouring
  the same 225 ml and charging the stock again.
* **Tools.** Switching tools, pouring by holding inside the cauldron, the
  measuring vial and the lid.
* **Shop and saves.** Buying reagents (coins down, stock up). Buying the
  bellows through the confirmation dialog raises the flame limit. Reload
  then Continue restores day, coins and seed, and the cauldron contents
  survive. A save file is exported, the game changed, and the file
  imported back. A damaged save restores the backup and warns the player.
  Settings (mute, graphics quality) persist.
* **Free Experiment (desktop, phone portrait).**
  * Syrup sinks below water and oil floats on top.
  * Powders pile up and stirring works.
  * A liquid freezes into a block under the frost plate and the pestle
    (dragged by pointer or touch) crushes it into grains.
  * Oil ignites under a strong furnace and closing the lid smothers it.
  * Three simulated minutes of lid-on boiling with auto-stir: no NaN
    particles, nothing outside the vessel, and matter conserved to within
    1 ml (pot plus vented).
* **Offline build.** The service worker precaches the bundle and font. With
  the network cut, the game reloads, opens Free Experiment and pours.

Screenshots from these runs are in `docs/screenshots/`. They were reviewed
during development, and the review findings are in §3.

## 2. Balancing playthroughs

`scripts/playtest.mjs` plays complete careers with the real rules: orders
from the generator, purchases from the market, brewing in the real physics
simulation, measurement from the tap, payment and reputation, end of day
and upgrade purchases. The simulated shopkeeper follows each order's hidden
reference plan but makes skill-dependent mistakes:

* reagent amounts off by up to ±45% × (1 − skill)
* serving temperature off by up to ±18 °C × (1 − skill)
* reaction holds cut short

Two profiles (careful: skill 0.95; casual: skill 0.7) were run over 3 seeds
for 12 days each.

| Run | Mean quality | Served (perfect) | Journeyman | Adept | Expert | Earned | Spent* | Coins day 12 | Rep. day 12 | Equipment owned |
|---|---|---|---|---|---|---|---|---|---|---|
| seed 0 careful | 0.996 | 43 (40) | day 3 | day 6 | day 10 | 4,624 | 4,232 | 788 | 548 | 22 / 24 |
| seed 1 careful | 0.985 | 42 (39) | day 3 | day 7 | day 11 | 4,223 | 3,422 | 447 | 515 | 22 / 24 |
| seed 2 careful | 0.998 | 43 (41) | day 3 | day 6 | day 10 | 5,278 | 4,345 | 229 | 558 | 23 / 24 |
| seed 0 casual | 0.991 | 42 (41) | day 3 | day 7 | day 11 | 4,591 | 4,211 | 775 | 536 | 22 / 24 |
| seed 1 casual | 0.984 | 43 (38) | day 3 | day 6 | day 11 | 4,483 | 4,181 | 697 | 543 | 22 / 24 |
| seed 2 casual | 0.995 | 43 (41) | day 3 | day 6 | day 10 | 5,262 | 4,345 | 213 | 556 | 23 / 24 |

\* reagents plus upgrades. No run needed the stipend or declined an order.

**What this shows**

* **The economy works:** income consistently covers reagent costs, and
  spending heavily on equipment is recoverable. Coins dipped to about 50
  several times and the next day's sales restored them.
* **Progression is steady:** a new rank roughly every 3–4 days, with new
  reagents, customers, styles and equipment at each rank. Master (800
  reputation), the Grand Athanor vessel (1,800 coins) and the royal
  commission for Grand Alchemist remain after day 12.
* **Tolerances are generous to a player who knows the recipe.** Even a
  "clumsy" profile (skill 0.4: amounts ±27%, temperature ±11 °C) scored
  about 0.95 over 6 days. This is deliberate: real players don't see the
  reference plan and must find the ratios from the order card's live
  meters. The challenge is discovering and executing a recipe, and
  tolerances tighten with tier and customer strictness. Human playtesting
  would be the right way to tune this further.

**Balance changes made because of these runs**

* Top-tier equipment was raised (athanor 480 → 700, glacial sigil
  520 → 750, homunculus 750 → 1,100, grand vessel 950 → 1,800) after the
  first run showed nearly everything bought by day 12.
* "Heavy" orders (quicksilver plus crushed crystal) could demand
  stability that loose grains can never reach. Stability is now only
  required where predictable, and density gets a wider band where grains
  settle unevenly (§3).

## 3. Problems found through tests and screenshot review, and fixed

| Found by | Problem | Fix |
|---|---|---|
| Sandbox screenshot | A wet flour–water paste heated to 513 °C without boiling (only particles ≥ 80% volatile could boil) | Drying model: wet pastes and syrups hold at the boiling point while water gathers into the hottest particles (equal-volume exchanges, mass conserved) and steams off; trapped steam percolates through paste; vapour leaves its solids behind. New physics test. |
| Sandbox screenshot | Oil set alight went out within a second | Flames share heat with neighbouring matter, vapour burns, glowing iron ignites fuel, a closed lid uses up the oxygen faster. New physics test. |
| Headless measurement | Even at full fire, oil levelled off just below its ignition point | Hot-surface ignition (the iron above the liquid line glows first) |
| Screenshot | Vapour under the lid rendered as a grey maze | Wider, softer gas kernel with saturating opacity: reads as fog |
| Screenshot | Horizontal bands on the cauldron's back wall | 4×4 ordered dithering |
| Screenshot | Liquid surface looked spiky (the top row's packing zigzag) | Surface taken from a smoothed copy of the liquid field; colour from the nearest particle |
| Screenshot | Clear water drawn as an opaque white slab | Clear liquids are darker and cooler (the iron shows through); opaque ones stay bright |
| Panel review | Shop and journal tabs clipped; prices without a coin symbol; four equipment items without icons; powders listed a "viscosity" | Layout fix, coin price tags, new icons, grain info for powders |
| Panel review (phone) | Shop descriptions squeezed into a narrow column | Buy buttons wrap below the description on narrow screens |
| Tablet screenshot | Two shelf jars both labelled "Ichor" | Short labels made unique |
| Landscape screenshot | Toolbar wider than its column | Compact toolbar in phone landscape |
| Browser test | The "save damaged" warning was deleted by the screen switch | Toast shown after the switch |
| Achievability test | A "heavy" order demanded unreachable stability; density drifted from the prediction | Requirement generation fixed (§2) |
| Benchmark | Frame rate collapsed under load: slow frames caused more catch-up steps (desktop 1,300 particles 25 fps; throttled phone 300 particles 12 fps) | Physics time budget per frame, automatic quality, inlined solver hot path (§4) |

## 4. Performance (measured)

PERFORMANCE_SECTION

## 5. Answers to the brief's playtest questions

These answers come from the scripted runs and screenshot reviews above,
not from human testers.

* **Is the tutorial clear?** It is an 11-step guided first order. Each step
  advances on what actually happens in the cauldron (pouring, stirring
  until the colour is even, heating to the requested range). It was
  completed by browser automation on desktop and phones without extra
  instructions.
* **Is pouring pleasant, and does stirring matter?** Pouring is a visible
  stream with dose buttons for exact amounts. Stirring physically moves
  matter (spoon radius 0.42) and is what makes mixtures even: the
  stirring scenario measures a dramatic speed-up, and the tutorial cannot
  reach its colour target without it.
* **Can players see mixing, and are materials recognisable?** Colour
  diffuses from contact lines in swirls (Beer–Lambert colour). Powders
  pile up as grains, dough holds folds, ice is a crisp block, steam is fog,
  oil floats and syrup sinks (screenshots).
* **Are orders understandable and assessment fair?** Each requirement
  shows its target and a live meter. The result dialog lists target,
  measured value and score per property. Scoring is tolerance-based and
  never zero for small misses.
* **Can players earn money through skill?** Yes: in the playthroughs,
  income exceeds costs from day one. Better quality pays more (payment
  scales with quality^1.6, plus a 20% bonus for a perfect potion).
* **Do new reagents and tools create choices?** Each rank unlocks
  reagents (embers, frost shards, quicksilver, crystals, spores, resins,
  phoenix cinders) and styles that need them. Upgrades change what is
  physically possible: higher flames, deep cold, larger vessels, exact
  instruments, an alembic for vapour, a homunculus for automation.
* **Frustrating delays?** 2× and 4× time speed for heating and cooling.
  Slow devices keep a playable frame rate by running the brew in slow
  motion instead of freezing.
* **Is experimenting fun without coins?** Free Experiment has every
  reagent and tool, its own save, and the full physics (fire, freezing,
  reactions, boiling under the lid).
* **Is progression rewarding over several sessions?** Six ranks, 24
  upgrades, 22 achievements, a discovery journal, contracts and a final
  royal commission. Simulated careers reach Expert around day 10–11 with
  the top tier still ahead.

## 6. Limitations

1. The supplied starting project was unavailable, so the game was written
   from scratch to the architecture the brief describes.
2. No physical-device testing. Phone and tablet results come from Chromium
   emulation; Safari/iOS and Firefox were not run. All standard APIs
   used (canvas 2D, pointer events, WebAudio, service workers, ES
   modules) are supported by current Safari, Chrome and Firefox.
3. On a slow device with large batches the simulation runs below real
   time (see §4). Typical shop orders are 50–300 particles.
4. Headless Chromium renders the canvas in software, so desktop frame times
   here are likely worse than in a GPU-accelerated browser. Phone figures
   use CPU throttling as a stand-in for a mid-range phone and are not
   device measurements.
5. Balance was tuned with simulated players, not human playtesters.
6. Audio was checked for errors only; headless tests can't listen.
