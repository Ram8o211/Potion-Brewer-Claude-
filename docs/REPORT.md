# Implementation, balancing and performance report

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
