# Implementation, balancing and performance report

## Release 2.0.1: magic-only wording and a reachable haggle

**The report.** After 2.0 the owner wrote that the game "still speaks
about density and colour" and that "the haggle system seems not
implemented".

**Cause 1: the live site is still 1.1.0.** GitHub Pages serves `main`.
The 2.0 work lives on branch `claude/potion-system-overhaul-39iuvd` and
was never merged. `main` is the 1.1.0 game, whose orders ask for colour,
density, viscosity and stability, and which has no haggling at all. This
matches the report word for word.

**Cause 2: the 2.0 build hid haggling.** An audit played the 2.0 build in
headless Chromium with real taps on a phone, with an independent skeptic
re-checking every finding. It confirmed that a real player could easily
never see a haggle:
* **A Potion ID slider could not be set to 0 by a tap.** An unset slider
  already rests at 0, so a tap fired no `change` event and nothing was
  written. Most properties of most potions are 0, so the label stayed
  incomplete and Offer refused.
* **The refusal was invisible on phones.** Its only explanation was a
  top-bar notice clipped to one word ("Label").
* **On a phone the ID sliders were below the fold,** under five cages.
* **The tutorial got stuck** at "Set every slider" and never reached the
  haggle steps.
* **The haggle panel had no words** (two bare numbers), and the customer
  never spoke.

**Cause 3: some text in 2.0 was still physical.**
* Ingredient lore named colours ("pink", "dark red") and floating ("so
  light it floats").
* Journal entries gave each ingredient's boiling and freezing point and
  "layers".
* Recipes and the sales ledger showed colour squares instead of names
  or magic.
* 🔥 and ❄ meant both the Ardor and Frost magic and the heat controls.

### What changed

* **Potion ID.**
  * Each slider row names its property.
  * A tap or a key on an unset slider at 0 writes 0, and "? → 0" sets
    every property the creatures did not show.
  * Rows update in place, so the keyboard keeps its slider.
  * On a phone the cages are a swipeable row with the sliders below
    them, all on one screen.
* **The counter explains itself.**
  * The vial card says what stops the sale.
  * The customer speaks in the speech bubble, naming the missing
    property on a wrong label.
  * The haggle panel reads "They offer / You ask / Patience / Final
    offer". Ask shows the price, and the price cannot go below their
    offer (the rules also never sell below it). "No deal" is labelled.
  * A parting card shows the outcome and waits for "Open the door"
    instead of a new customer appearing on a timer.
* **Wording.**
  * Every ingredient's lore is magic-only.
  * Journal entries for steam, ice and fire are generic magic entries.
    "Layers" became "Unbound magic / Bound by heat".
  * Awards, help and settings speak of magic.
  * "Floating Oil" is now "Lifting Tonic", and the fever customer asks
    for "frost magic".
  * Saves from earlier builds are rewritten on load (`modernizeJournal`,
    lore refreshed).
* **Icons.** The furnace and temperature tips use the hearth fire, the
  cold basin and the thermometer, so 🔥 and ❄ only ever mean Ardor and
  Frost.
* **Lists.** Recipes list ingredients by name and ml. The ingredient
  list, brew info and selection show the jar or stone sprite, and the
  sales ledger shows the label's magic.
* **Tutorial.**
  * The ID steps also count the vial's label.
  * The coach jumps ahead when the player is ahead, and scrolls its
    target into view.
  * "Play the guided order" works in any shop.
  * A 1.x shop is told once what changed.
* **Deployment.**
  * The version is shown in the menu and settings.
  * On an update, the service worker moves open pages onto the new
    build. Before, the first launch after a deploy still showed the old
    game.

### Re-verification

A second, independent pass played the 2.0.1 build with real taps only.
Each finding was again re-checked by a skeptic.

**Phone portrait.** The checker played through a full sale:
* harvested, brewed with jars and dose buttons, stirred, and dosed
  creatures;
* read the cages by eye and set the ID with taps and "? → 0";
* pressed Offer, haggled with −5, +5 and Ask, took the offer, and opened
  the door.

It also covered a walk-out at an insulting price and a refusal that named
the missing property ("I need more Vitality").

**Tutorial.** All 17 coach steps advanced by tapping the highlighted
control.

**Phone landscape.** The haggle worked.

**Text sweep.** No colour, density, viscosity, layer, melting or boiling
wording was left anywhere, and no "null", "undefined" or "NaN" appeared.

It found these problems, now fixed:
* **Ingredients were charged twice** (older than 2.0). Emptying the
  cauldron, by bottling all of it, drawing the last dose or Empty, reset
  the pour baseline to zero. The next frame then charged every earlier
  pour again, and logged phantom pours into the new batch and its
  recipe. Now the baseline is the emitter's running total
  (`settlePours`).
* **A swipe over a slider wrote a value.** On touch screens, a scroll
  that began on a Potion ID slider wrote a value into the ID, because
  Chrome jumps the slider to the finger and still fires `change` after
  cancelling the pointer. The same swipe on the price slider changed the
  ask. Both now undo the value on `pointercancel`.
* **"No deal" left no farewell.** The customer was gone from the state
  before the card was drawn.
* **The guided order skipped ahead.** Started from the menu, it jumped
  ahead, or finished, on another customer's haggle or sale. It now
  follows only its own customer, and steps back if the vial or haggle
  goes away.
* **The customer's refusal outlived the label it answered.** A line is
  now tied to the vial and label as well as the visitor.
* **Phone notices still showed one clipped line** (a CSS specificity
  slip). They now wrap.
* **Phone landscape had three layout gaps.** The ID rows had no names,
  the dose bar pushed the jars under the finger, and the customer's
  reply was scrolled out of view during the haggle. Each is fixed: the
  rows have names, the dose bar keeps its space, and the reply is
  repeated in the haggle panel.
* **Saved recipes lost their Potion ID** (older than 2.0). The recipe's
  own key overwrote it.
* **Small fixes:**
  * The Ask button's accessible name now changes with the price.
  * The mortar hint said "G"; it now says "M".
  * The "Rolling Boil" award is now "Lost to the Steam".

New regression tests cover each of these. For the slider swipe, the test
was confirmed to fail without the fix.

**Final 2.0.1 run.**
* `npm run typecheck`: clean.
* `npm test`: 57 passed. This includes the 8 new wording tests.
* `npm run test:browser`: 77 passed over desktop, phone portrait, phone
  landscape, tablet, the offline build and the GitHub Pages sub-path.

## Release 2.0: the magic overhaul

This round rebuilt the game around magic. Customers ask for magical
effects. Every ingredient grows in a personal garden. A potion's magic
follows the proportions of what is in it, with heat as a tool and a
danger. Potions are identified by watching creatures, and sales are
haggled, with complaints, refunds, bluffs and certification. The HUD was
simplified so that no text sits on a control. The earlier round's report
follows below, unchanged, for the record.

**Environment.** As before: a shared cloud Linux container (Intel Xeon @
2.1 GHz, 4 cores, Node 22), headless Chromium (Playwright 1.56) with
software rendering, and phones and tablets in device emulation only.

### What was built

| Brief | What it is | Where |
|---|---|---|
| Customers ask for magical effects | Requests are ranges on six magical properties (vitality, ardor, frost, levity, charm, bane), born from a problem the property solves. No colour, thickness or chemistry. | `src/game/commissions.js`, `src/alchemy/magic.js` |
| Water, magical liquids, magical stones | Plain water (no magic) is the solvent. There are four magical liquids, one of which floats apart from water until hot, and six magical stones gathered whole and smashed into powder in the mortar or with the pestle. | `src/materials/generator.js` |
| A personal garden that grows with time, not abundance | A well that refills slowly. Plant beds grow only while watered, and watering costs well water. Crystal beds grow slowly. A harvest empties the bed. Five beds to start and eleven to plant for coins and rank. Shelves cap stock. Growth is resolved from wall-clock timestamps, also while the game is closed. | `src/game/garden.js`, `src/ui/views/garden.js`, `src/rendering/garden.js` |
| Magic from proportions; magic-only descriptions | A particle's magic is the volume-weighted blend of its ingredients' magic vectors. Ingredient cards show only magic bars and the fading and transition temperatures. Physical words are absent (tested). | `src/alchemy/magic.js`, `src/ui/panels.js` |
| Testing room with creatures, visual only, and a Potion ID | Five creatures, each showing some properties as pictures against a notched post (leaves, hearts, flames, ice, lift, toxic bubbles), with no text or numbers (tested). Readings wobble a little and faint magic does not show. Bane hurts, creatures rest, and dead ones are replaced. The player sets six ID sliders, which become the vial's label. | `src/game/testing.js`, `src/rendering/creatures.js`, `src/ui/views/testing.js` |
| Haggling | The customer opens low. The seller asks, and the customer concedes part of the gap, loses patience, makes a final offer, or walks out at an insult. | `src/game/haggle.js`, `src/ui/views/counter.js` |
| Complaints and unavoidable refunds | A potion that misses a want or exceeds a limit brings its buyer back one to three visits later. The refund is forced and costs reputation. | `src/game/sales.js`, `src/game/state.js` |
| Bluffs and expensive certification | Customers bluff with their archetype's probability. Only a vial certified before the sale (30 + 12 × rank coins) unmasks them. Certification also replaces the label with the truth. | `src/game/sales.js`, `src/game/state.js` |
| Heat helps mixing; overheating fades magic | Miscibility rises with temperature (0.28% per °C) and blends stay blended when cooled. Above a particle's magic-weighted fading point, its magic decays exponentially. | `src/reactions/compatibility.js`, `src/simulation/magic.js` |
| Super transitions, averaged by mixing | Every ingredient has a transition temperature, independent of its melting and boiling, and most are unreachable alone (+1300 °C, −2250 °C). Mixing averages them by magic, so blends can transmute in an ordinary cauldron: one property very high, the rest near zero. | `src/alchemy/magic.js`, `src/simulation/magic.js` |
| Simpler HUD, no text over buttons | Requests, labels and IDs are icon chips. Notifications appear in the top bar's status line. The tutorial coach has its own row. Browser tests fail on any overlap. | `src/ui/lab.js`, `src/ui/tutorial.js`, `styles/main.css` |
| Saves | Save version 4. A genuine v3 save from the previous release migrates (`tests/fixtures/save-v3.json`). Snapshot version 3 carries the magic state. | `src/game/state.js`, `src/simulation/snapshot.js` |

### Automated verification (final run)

| Suite | Command | Result |
|---|---|---|
| Types | `npm run typecheck` | 0 errors |
| Headless | `npm test` | 49 passed (physics 23, game 11, magic 8, garden and testing room 6, renderer 1) |
| Browser | `npm run test:browser` | 71 passed over desktop, phone portrait, phone landscape, tablet, offline build and GitHub Pages sub-path |
| Achievability | `node scripts/achievability.mjs 25` / `… 25 ach super` | 25 of 25 normal and 25 of 25 super-transition requests brewed in the real simulation inside every range |
| Benchmark | `npm run bench` | see below and `docs/PERFORMANCE.md` |
| Build | `npm run build` | 461 KB (131 KB gzipped), offline-ready |

### Balancing

`node scripts/playtest.mjs` plays ten days on three seeds with two
profiles. Each day it:
* tends the garden on a simulated clock;
* brews each request's plan in the real simulation, with skill-dependent
  mistakes;
* tests on creatures that show the requested properties and writes the ID
  from what they showed;
* haggles, deals with returning customers, and buys beds and equipment in
  the evening.

| Profile | Final coins | Reputation | Rank | Served / declined | Tests | Certified | Sales kept / refunded / bluffs caught |
|---|---|---|---|---|---|---|---|
| careful (certifies, haggles hard) | 184 / 223 / 278 | 92–94 | Journeyman (day 5–6) | 27 / 3–4 | 68–74 | 8–12 | 24–25 / 1–2 / 0–1 |
| casual (no certification) | 64 / 97 / 139 | 91–92 | Journeyman (day 5–6) | 27 / 3–4 | 68–71 | 0 | 24–25 / 2 / 0 |

* Daily earnings grow from about 50–95 coins on day 1 to 130–260 by day
  10. Both profiles spend most of it on 8 garden beds and 15 pieces of
  equipment.
* Refunds are occasional (19–99 coins on 1–2 days of 10). Careful sellers
  catch some bluffs with certificates; casual sellers pay every bluff.
* Gathering stays scarce. A ten-day run harvests 7.4–8.6 L in total, and
  one seed has a day where three customers wanted what the garden had run
  out of, so it earned nothing that day. The daily stipend keeps such a
  run alive.

### Performance

The same benchmark as before (`docs/PERFORMANCE.md`), on a slower host
than the previous release's run:
* every physics scenario is as fast or faster (full pot 0.81 → 0.49
  ms/step);
* the throttled phone renders typical brews at 51–52 fps in (near) real
  time, and a full pot at 48 fps and 0.94× speed (previously 30 fps and
  0.65×);
* the heap stays flat at about 3.8 MB through 90 s of boiling.

The magic systems add one pass every second step and a few
multiply-adds per diffusing pair. The garden and the creatures cost
nothing outside their rooms.

### Problems found through tests, profiling and screenshots, and fixed

* **Cold stones gave too little.** Ground stones barely leached in cold
  water, so stone requests were weak. Extraction now follows the hottest
  steep each particle has seen, and a hot steep keeps its strength when
  cooled.
* **Brushing past a threshold transmuted a brew.** Briefly crossing a
  threshold while stirring transmuted it outright. Transmutation now
  builds up over a few seconds beyond the threshold.
* **Cold super plans failed.** The brew froze into a block, the
  controller overshot, and a warm-up scorched the magic. The autobrewer
  now caps its flame below the target, steeps warm, then chills and holds,
  and serves gently. Frostmilk's transition moved to −46 °C, closer to
  what the frost plates reach.
* **The production build broke** on an import cycle (counter ↔ shell).
  The shared request chips moved to `panels.js`.
* **Notifications and the coach covered buttons.** Floating toasts sat on
  the tutorial's targets. Notifications moved into the top bar's status
  line, and the coach got its own grid row.
* **On phones, the stir step needed too many turns.** A touch stir on a
  narrow screen covers less distance in the cauldron, so the step now
  needs about one and a half turns.
* **The reputation bar was invisible** in the top bar (0 px wide, present
  before this round). It now stretches.
* **The day label read "11/3".** The day and the customer count ran
  together, so a customer icon now separates them.
* **Text artefacts.** `null` showed in the top bar and on the counter;
  the toad's leaves overlapped. Both fixed.
* **Day-one shortages.** The first playtests ran out of ingredients on
  day one. Plans are smaller and the starting stock covers the first
  orders.
* **Dead code removed:** 19 unused icons and 36 CSS rules of the old
  rooms.

### Limitations

* Phones and tablets were verified in Chromium emulation only, not on
  devices, Safari or Firefox.
* A save from the previous release keeps the shop (coins, reputation,
  rank, equipment, awards, sales history) but not its ingredients,
  recipes or journal: the old reagents do not exist in the garden world.
* Electricity remains in the engine, but no garden ingredient is charged.
* Certification must happen before the sale; a bluff against an
  uncertified sale is always refunded, as the brief asks.

---

# Earlier round: hidden effects, trials and wilds

This report covers the round that brought hidden magical and chemical
effects, the trials room, the wilds, material processing, electricity and
the mobile-first shell to The Alchemist's Shop. It says what was built,
what was run, and what came out. The feature-by-feature comparison with
the reference project is in `FEATURE_PARITY.md`.

**How the reference was used.** The ideas in `Ram8o211/fluid-pocket-sandbox`
were re-implemented natively on this game's own engine: 5 ml composition
particles, °C, latent heat, rule reactions and the SDF cauldron. No code
was copied. The game's existing mechanics are all preserved: the physics
scenarios, chemistry, commissions, economy, art and audio. This followed the
owner's instruction during the work.

**Environment.** A shared cloud Linux container (Intel Xeon @ 2.8 GHz,
4 cores, Node 22) and headless Chromium (Playwright 1.56) with software
canvas rendering. **Phones and tablets were not tested on physical
devices.** Their results come from Chromium device emulation (viewport,
touch input, device pixel ratio 2, and 4× CPU throttling for the
performance profile). Safari/iOS and Firefox were not run.

Raw data: `docs/perf-results.json` (`npm run bench`) and
`docs/playtest-results.json` (`node scripts/playtest.mjs`).

## 1. What was built

| Area | What it is | Where |
|---|---|---|
| Effects | A 10-channel effect vector on every material. A potion's effects are computed per particle from what is actually dissolved: extraction, six hidden resonance laws per world, universal oppositions and saturation. Heat, reactions, evaporation and dilution change them through the same law. | `src/alchemy/effects.js`, `src/materials/profiles.js` |
| Hidden until tested | Effects show as "?" on the order, counter and assay until a trial of this batch reveals them. The brew panel separates **Theory** (naive sum of known ingredient effects plus discovered laws), **Recipe** (what a tested recipe the batch follows did) and **Verified** (a trial of this batch). | `src/ui/lab.js`, `src/ui/views/counter.js` |
| Trials room | Five subjects (rabbit, beetle, seedling, limestone, and the wisp with the lantern), each revealing only some effects. Doses are real 5/10/25 ml removed from the tap or split from the sealed vial. The room has observations and pixel-art marks, harm, death and paid replacement, a 120-entry trial log with theory against observation, law discovery, and **certification**: a batch id plus revision with a drift tolerance. An effect order cannot be served uncertified. | `src/game/experiments.js`, `src/ui/views/trials.js` |
| Wilds | Six regions, two of them magical and rank-gated. Deposits come from the seed, with finite stock, lazy timestamp regrowth (also while the game is closed) and half a deposit back each new day. Harvests respect shelf space; the satchel gives +50%. There are painted scenes with tappable deposits. | `src/game/gathering.js`, `src/ui/views/wilds.js`, `src/rendering/scenes.js` |
| Raw ingredients and processing | 19 wild roots, leaves, petals, mushrooms, minerals and crystals, mostly supplied whole as rigid chunks. The in-pot pestle crushes them; the new mortar ("Ground") pours them as powder. Wet-only steeping reactions turn ground herbs into liquid extracts in hot water. The skimmer returns pure skimmed reagent to its jar, and a vial can be poured back. | `src/materials/wild.js`, `src/simulation/emitter.js`, `src/simulation/tools.js` |
| Electricity | A conserved per-particle charge conducting between touching matter by conductance, with Joule heating, sparks and a galvanometer. | `src/simulation/electric.js` |
| Effect commissions | 11 effect styles (healing, strength, love, fire tonic, frost salve, settling, etching, bane, insight, transmutation, antidote). They come from hidden plans predicted with the same effect law, with safety limits on harm the customer did not ask for, and need certification. | `src/game/commissions.js` |
| Vessels | Shop pots shrank from 7–13.5 L to 1.5 / 2.2 / 3 L so typical orders fill them. Saved cauldrons from the old pots are remapped. | `src/simulation/cauldron.js`, `snapshot.js` |
| Mobile shell | A bottom tab bar (a rail in landscape and on desktop) over Counter · Brew · Wilds · Trials · Book; bottom sheets; drag jars onto the cauldron; drag the dropper onto subjects; ≥ 44 px targets; safe areas; a multi-touch guard. | `src/ui/lab.js`, `src/ui/views/`, `styles/main.css`, `docs/MOBILE_UX.md` |
| Saves | Save version 3 migrates v2 saves: progress kept, embedded world upgraded to the seed's effect profiles, pending orders rewritten in effect terms. Damaged and future saves are refused with a message, never reset. | `src/game/state.js` |
| Presets | High quality / Balanced / Battery saver / Automatic, with physics identical in all of them. | `src/rendering/renderer.js`, `docs/PERFORMANCE.md` |

## 2. Automated verification

| Suite | Command | Result |
|---|---|---|
| Type check (src, scripts, tests) | `npm run typecheck` | passes |
| Headless: physics (23), game rules (11), effects (8), trials and wilds (7), renderer (1) | `npm test` | 50 / 50 pass |
| Browser: desktop, phone portrait, phone landscape, tablet, offline build, Pages sub-path | `npm run test:browser` | 64 / 64 pass |
| Production build | `npm run build` | 157 KB gzipped; release ZIP (§7) |

**Headless tests added this round:**

* **Effects** (`tests/alchemy.test.mjs`)
  * Every material carries an effect vector, and old seeds keep their
    reagents.
  * Water does nothing; a 1:1 dilution halves potency.
  * A whole root does nothing, ground and stirred it acts, and hot
    steeping releases far more.
  * Fire and frost layers cancel only once stirred together.
  * Transmute, catalyse and suppress laws act per particle and are traced.
  * Heat spoils petals.
  * Boiling water away concentrates a non-volatile extract (≥ 80% retained;
    some is carried off in the steam).
  * Charge is conserved, spreads through brine, is blocked by oil, and
    heats resistive contacts.
* **Trials and wilds** (`tests/trials.test.mjs`)
  * A trial consumes a real dose and reveals only the subject's channels.
  * Certification holds for this batch only and is invalidated by a pour
    or by drift.
  * Laws are discovered by repeated trials and then join the theory.
  * Lethal doses kill, and replacement costs coins.
  * Deposits are deterministic, with finite stock, timestamp regrowth,
    rank locks and storage limits.
  * A genuine v2 save made by the previous release migrates.
  * Corrupted, partial and future saves are refused or repaired.
* **Renderer** (`tests/render.test.mjs`): every phase is drawn where its
  particles are. A deliberately broken renderer fails it.

### 2.1 Browser tests (real UI in Chromium)

* **Layout,** on every device profile:
  * No horizontal overflow, and every room fits the screen.
  * Every visible interactive element in every room is at least 44 px.
  * Panels open, fit and close.
  * Long-pressing a jar opens the inspector.
* **The first commission, end to end** (desktop, phone portrait, phone
  landscape):
  * Pour by dose buttons, stir by touch (or mouse), and heat with the
    slider.
  * Open the Trials room and give the rabbit a dose; the effect is
    certified.
  * Bottle into a sealed vial and serve at the Counter.
  * Save the recipe and prepare it again from the Book, charging stock.
  * The brew panel then shows the recipe's effects as **Recipe**, not
    verified.
* **Certification gate:** an untested effect potion cannot be served;
  testing the vial certifies it.
* **Drag and the mortar:** drag a jar onto the cauldron to pour, then
  grind a root so it arrives as powder grains.
* **Wilds** (desktop, phone portrait, phone landscape):
  * Gather by button and by tapping the scene; stock and the deposit
    change.
  * A magical region is refused to an apprentice.
  * The herb reaches the shelf, and the state survives a reload.
* **Trials room:**
  * Dragging the dropper onto the beetle doses it and the beetle shows
    fire.
  * A spent rabbit is replaced for its price.
  * The trial log survives a reload.
* **Unchanged suites:** tools, shop and equipment, saves (continue,
  export and import, damaged save), settings, sandbox physics, the offline
  build, and the GitHub Pages sub-path build (worker scope, cache
  isolation, stale-tab guard, redeploy under max-age caching).


## 3. Balancing

### Achievability

`node scripts/achievability.mjs 30` generates 30 orders across all tiers.
It brews each from its hidden reference plan in the real simulation, in
the 1.5 L starting pot: **30 / 30 reached quality 1.00 (5 stars).** The
styles covered were fire tonic, frost salve, etching, love and strength
(effect styles) and tonic, salve, syrup, heavy, elixir, frost, fizzy,
lumen and ardent (physical styles).

### Multi-day careers

`scripts/playtest.mjs` plays 12-day careers with the real rules:

* gathers from the wilds with simulated wall-clock time (so deposits
  deplete and regrow), or buys;
* brews in the real simulation, following the hidden plan with
  skill-dependent mistakes (amounts ±45% × (1 − skill), serving
  temperature ±18 °C × (1 − skill), shortened holds);
* tests 10 ml doses on the subjects that reveal the order's effects, and
  declines an order it cannot certify;
* sells, ends the day, and buys upgrades.

| Run | Mean quality | Served (perfect) | Declined | Journeyman | Adept | Expert | Earned | Spent | Coins day 12 | Rep. day 12 | Equipment | Gathered ml | Trials | Subjects replaced | Laws found |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| seed 0 careful | 1.000 | 43 (43) | 0 | day 3 | day 6 | day 10 | 5,685 | 4,649 | 463 | 560 | 28 / 29 | 1,160 | 31 | 0 | 0 |
| seed 1 careful | 1.000 | 43 (43) | 0 | day 3 | day 6 | day 10 | 6,778 | 5,874 | 1,419 | 571 | 28 / 29 | 880 | 29 | 1 | 1 |
| seed 2 careful | 1.000 | 42 (42) | 1 | day 3 | day 6 | day 10 | 5,947 | 4,675 | 738 | 553 | 28 / 29 | 1,350 | 38 | 1 | 2 |
| seed 0 casual | 0.998 | 43 (42) | 0 | day 3 | day 6 | day 10 | 5,663 | 4,646 | 444 | 555 | 28 / 29 | 1,160 | 31 | 0 | 0 |
| seed 1 casual | 1.000 | 43 (43) | 0 | day 3 | day 6 | day 10 | 6,778 | 5,881 | 1,413 | 571 | 28 / 29 | 940 | 29 | 1 | 1 |
| seed 2 casual | 0.999 | 41 (40) | 1 | day 3 | day 7 | day 11 | 5,843 | 4,668 | 640 | 533 | 28 / 29 | 1,350 | 38 | 1 | 3 |

No run needed the daily stipend.

**What this shows, and what it does not**

* **Every new system takes part in the loop.**
  * Each career gathered 0.9–1.4 L from the wilds and ran 29–38 trials.
  * Subjects were spent and replaced in four runs.
  * Hidden laws were discovered in four of six runs.
  * Two orders were declined. The simulated shopkeeper declines an order
    it cannot stock or certify.
* **The economy and ranks work:** income covers reagents and upgrades,
  with a new rank every 3–4 days.
* **Progression runs fast for a player who knows the recipes.** These
  simulated players follow each order's hidden plan, so they never pay
  for discovery. They also buy 28 of 29 upgrades by day 12, against 22–23
  of 24 last round; effect orders pay a little more, and the new
  trial-room items are cheap. A human must work out ratios, extraction
  and laws through trials, and spends doses, subjects and coins doing it.
  Whether the curve is right for humans needs human playtesting, which
  was not done.

## 4. Problems found through tests, profiling and screenshots, and fixed

| Found by | Problem | Fix |
|---|---|---|
| Browser test (phones) | A pour into a pot filled to the rim never finished: the stream's spawn point stayed blocked and the dose waited forever | The pour stops after 1.2 s of blocked stream, with a "cauldron is full" message |
| Browser test (phones) | Hold-to-pour filled a 1.5 L pot in about 4 s | A narrower mouth pours a thinner stream (default rate scales with mouth width; the large reference vessels are unchanged) |
| Browser test (landscape) | Jars could not be dragged out of the shelf: a sideways drag scrolled it instead | The landscape shelf wraps into a column that scrolls up and down; a jar lifts on a drag *across* the scroll direction |
| Browser test (phone portrait) | The tutorial's closing note covered the Book's tabs | The note closes when the player moves to another room |
| Browser test (phone landscape) | The wilds scene scrolled off-screen once the deposit list was used, so a tap on the scene missed | In landscape and on desktop the scene stays beside the list and only the list scrolls |
| Screenshot review | Right after a trial, the Trials room still said "nothing tested yet" until the next assay (0.4 s) | The assay is re-run as soon as a trial is recorded (browser-tested); the report scrolls into view on phones |
| Browser test (desktop) | A jar drag never started with a mouse; the first gathered herb did not appear on the shelf | Mouse pointer capture, and leaving the shelf lifts the jar; the shelf is rebuilt when a new reagent arrives |
| Benchmark | Balanced cost as much as High (same pixel size) | Balanced uses coarser art pixels with full lighting: its render time on the throttled phone fell from 43 to 9 ms (High: 31 ms) |
| CPU profile | The material renderer took 46% of the throttled phone's CPU at High | Interleaved accumulators, chord-bounded splats, phase-presence checks: −17% render time, pixel-identical output |
| Pixel comparison | The renderer refactor briefly stopped drawing vapour (a local variable shadowed its buffer) | Fixed before commit; `tests/render.test.mjs` now guards every phase |
| Audit re-check | No "known recipe" tier between theory and verified | The brew panel shows a tested recipe's effects as **Recipe** (browser-tested) |
| Screenshot review | Orders were thin puddles in 7–13.5 L pots | Shop vessels resized to 1.5 / 2.2 / 3 L |
| Screenshot review | Muted text on parchment had low contrast; the pour hint overlapped the HUD chips | Darker ink on parchment; hint moved to the bottom of the stage |
| Achievability script | Effect orders scored 0.75: the homunculus did not grind | Plans carry "ground", and the controller pours through the mortar |
| Effect plans | Quicksilver was chosen for a drinkable strength potion | Harm filter on drinkable plans, plus safety limits on unrequested harm |
| Market | A gather-only wild herb could crash the market listing | Gather-only reagents are never listed |
| Type check | Missing typedefs for the new requirement, journal and material fields | Typedefs added; type check clean |

## 5. Performance (summary)

Full tables and method: `docs/PERFORMANCE.md`.

* **Physics:** typical shop brews cost 0.3–1.4 ms per 60 fps frame
  (Node). The new systems did not slow the solver: the stirred
  300-particle scenario steps in about 1.0 ms in the old release and in
  this one.
* **Desktop (1440×900):** 59–60 fps in real time up to 300 particles at
  High quality; 54 fps with the full 3 L vessel.
* **Phone (390×844 @2×, CPU ÷4, emulated):**
  * Typical orders (60–150 particles) run at 41–50 fps in near real time.
  * A full 1.5 L pot runs at 30 fps with the brew in 0.65× slow motion.
  * With 300 particles, the presets measure: High 18 fps, Balanced 27,
    Battery saver 26 (capped at 30).
* **Memory:** flat over 90 s of lid-on boiling (3.6 → 4.2 MB), and
  4.2 → 4.6 MB over ten menu ↔ shop trips.

## 6. Answers to the brief's questions

These answers come from the scripted runs, the browser tests and screenshot
review, not from human testers.

* **Are effects hidden and emergent?** Yes. Nothing reads effects from a
  recipe. A trial reveals only the subject's channels, the theory is
  visibly naive, and hidden laws show up as anomalies until repeated
  trials confirm them.
* **Is experimenting real?** Yes. Every dose is real matter taken from the
  tap or the vial. Subjects can die and cost coins to replace. A new pour
  or drift invalidates earlier results.
* **Is gathering meaningful?** Deposits are finite and regrow on real
  time. Rare and magical ones open with rank, and some reagents can only
  be gathered.
* **Does preparation matter?** Whole roots do nothing until crushed or
  ground. Hot steeping extracts far more than cold. Stirring decides
  whether resonances meet. Boiling concentrates. Overheating spoils
  petals. All of it is measured in the effect tests.
* **Is it playable on a phone?** It is designed portrait-first with
  ≥ 44 px targets, tested on emulated phone, landscape and tablet
  profiles, and stays responsive on a 4× throttled CPU. Real-device
  testing is still to be done.

## 7. Final verification run

On the final code of this round:

| Check | Result |
|---|---|
| `npm run typecheck` | clean |
| `npm test` | 50 / 50 pass |
| `npm run test:browser` | **64 / 64 pass** in 4.9 min. 2 workers across 6 profiles: desktop 1440×900, phone portrait 390×844, phone landscape 844×390, tablet 820×1180, offline production build, GitHub Pages sub-path |
| `node scripts/achievability.mjs 30` | 30 / 30 at quality 1.00 |
| `node scripts/playtest.mjs 12 3` | six careers, see §3 |
| `npm run bench` | see `docs/PERFORMANCE.md` |
| `npm run build` | 1.1.0: 58 modules bundled into one script; 541 KB, 157 KB gzipped in total; `release/alchemists-shop-1.1.0-web.zip` (158 KB) |

## 8. Limitations

1. No physical-device testing. Phone and tablet results come from Chromium
   emulation; Safari/iOS and Firefox were not run.
2. Balance was tuned with simulated players who know each order's hidden
   plan, not with human playtesters (§3).
3. On a slow device with large batches the simulation runs in slow motion
   (§5).
4. Long-range electrostatic forces were left out. Conduction, charge and
   Joule heating are in (see `FEATURE_PARITY.md` §I).
5. The skimmer has no tap alternative (`docs/MOBILE_UX.md`).
6. GitHub Pages deployment could not be verified from this environment:
   the network policy blocks `*.github.io`.
7. Audio was checked for errors only; headless tests can't listen.
