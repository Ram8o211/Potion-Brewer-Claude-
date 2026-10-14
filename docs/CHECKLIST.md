# Completion checklist

## Release 2.0 brief: the magic overhaul

Each requirement of the 2.0 brief, where it is implemented and how it was
verified (updated for 2.0.1). Test files: `W` = `tests/wording.test.mjs`, `A` = `tests/alchemy.test.mjs`, `T` =
`tests/testing.test.mjs`, `G` = `tests/game.test.mjs`, `B:<spec>` =
`tests/browser/<spec>.spec.mjs`, `ach` = `scripts/achievability.mjs`,
`bench` = `scripts/bench.mjs`, `play` = `scripts/playtest.mjs`.

| Requirement | Status | Evidence |
|---|---|---|
| Customers ask for specific magical effects to solve their problems, not composition | ✔ | `commissions.js` (`PROBLEMS`, requirements only on the six properties, shown as named chips such as "Vitality ≥ 30"); G: "worlds are deterministic per seed; requests only ask for magic, never chemistry"; W: "customers ask only for magical effects" (lines, potion names, 120 generated requests) |
| Basic ingredients with magical properties: plain water as solvent, a few magical liquids, magical stones smashed into powder | ✔ | `generator.js` (water without magic, 4 liquids, 6 stones); A: "the garden world…"; B:gameplay "smash a stone in the mortar"; B:sandbox "sunstone powder" |
| All gathered in a personal garden where they keep growing with time | ✔ | `garden.js` (timestamp growth, also while closed); T: "the garden grows with real time…", "the well refills slowly…"; B:rooms garden test (harvest by button and by tap, water, plant, reload) |
| Gathering not too trivial; no abundance | ✔ | Plants grow only while watered (costs well water); a harvest empties the bed; ≥ 20% growth to harvest; shelves cap stock; new beds cost coins and rank. `play`: 7.4–8.6 L harvested over ten days, with occasional shortages |
| Final magic derives from the proportions of base ingredients whose magic the player knows | ✔ | `magic.js` volume-weighted blend; ingredient cards show the magic; A: "proportions: a 1:1 blend of dew and water carries half the dew’s magic" |
| Physical/chemical descriptions replaced by magical ones only | ✔ | `panels.openIngredient` (magic bars, fade and transition temperatures); W: lore, journal entries and awards contain no colour, weight, floating, thickness, boiling/melting or layer words and no °C, and old saves are rewritten on load; B:layout asserts the ingredient sheet has no density/viscosity/boiling words; recipes and lists show names and sprites, never colour squares |
| Inspection tool replaced by a testing room with creatures | ✔ | Probe and assay removed; `testing.js`, `views/testing.js`; T: "a test uses a real dose from the cauldron tap…"; B:rooms testing-room test |
| Player estimates each property from the creatures and compiles a Potion ID | ✔ | Six ID sliders per batch, copied onto the vial's label; T: "the Potion ID: written per batch, outdated by a new pour, copied onto the vial…"; B:gameplay guided order sets the sliders |
| Effects on creatures completely visual, no text | ✔ | `rendering/creatures.js` draws everything; B:gameplay asserts no digits on any creature card; B:rooms finds flame pixels in the salamander's cage |
| Selling by customer-proposed prices and seller offers until agreement | ✔ | `haggle.js`; G: "haggling: a low opening offer, counter-offers, lost patience, a final offer, a walk-out on insult"; W: never below their offer; B:gameplay haggles in the guided order and checks the captions, the speech bubble, the offer floor and the parting card |
| Haggling is reachable by a real player on a phone (2.0.1) | ✔ | A tap on an unset ID slider writes 0, and "? → 0" covers the rest; the counter says what stops a sale; B:rooms taps a slider at 0 with real touch and steps one with the keyboard; the 2.0.1 re-verification played to the haggle with real taps only (`docs/REPORT.md`) |
| Unsatisfied customers return later to complain about inefficiency or side effects | ✔ | `sales.settleSale` (weak, too strong or side effect, due 1–3 visits later); G: "a potion that fails its buyer comes back…"; B:gameplay "returning customers" |
| The refund cannot generally be avoided | ✔ | Counter offers only "refund", or "show certificate" for a certified sale; G: same test (refund forced, reputation lost) |
| Some customers bluff; only an expensive expert certification avoids a bluff refund | ✔ | Archetype bluff probabilities; `certifyVial` (30 + 12 × rank coins); G: "bluffers: without a certificate they get their refund; with one they are caught", "certification costs a lot…"; B:gameplay certificate unmasks a bluff |
| Heat helps mixing materials that stay separate at room temperature | ✔ | `compatFactorT`; A: "heat helps mixing: witch oil keeps apart from water while cold, blends when hot, and stays blended"; B:sandbox witch oil layers on cold water |
| Overheated materials lose magic | ✔ | `magicStep` fading; A: "overheating fades magic; the same brew kept below its fading point keeps it" |
| A super-transition temperature per material, anywhere relative to its phase points, transforming the magic into one extremely high property and the rest extremely low | ✔ | `superT`/`superKey` on every ingredient; A: "the super transition: past its threshold, witch oil’s whole magic pours into one property" |
| For most materials the threshold is at unreachable extremes; mixing averages thresholds into a normal range | ✔ | A: "the garden world… most transitions are out of reach", "mixing averages the thresholds (by magic): two unreachable transitions make a reachable one"; `ach … super`: 25 of 25 super requests brewed |
| Simplify the HUD; less text; no text over game buttons, especially during the tutorial | ✔ | Icon chips; status line in the top bar; coach row; B:layout "notifications and the tutorial never cover a control" on every profile; B:gameplay checks before every tutorial click |
| Each system complete and functional | ✔ | `play` ten-day careers use every system; 49 headless and 71 browser tests pass |
| Performance kept at the top | ✔ | `bench`: physics as fast or faster than the previous release, phone ÷4 at 48–52 fps for typical brews, flat memory (`docs/PERFORMANCE.md`) |
| Earlier saves keep working | ◐ partly | G: a genuine v3 save migrates and keeps coins, reputation, rank, equipment, awards and sales history. Its ingredients, recipes and journal are reset, because the old reagents do not exist in the garden world. |

## First version brief

> The tables below cover the brief of the game's first version. The
> second round (hidden effects, trials, wilds, processing, electricity,
> the mobile shell) is covered in `FEATURE_PARITY.md`, with results in
> `docs/REPORT.md`. Counts and mechanics below are from those versions;
> release 2.0 replaced the effects, trials, wilds and market with the
> systems above.

Each requirement from the brief is listed with where it is implemented and
how it was verified.

**Legend**

* **✔ verified**: covered by an automated test, measurement or reviewed
  screenshot named in the evidence column.
* **◐ partly**: implemented, but verification is partial or there is a known
  limitation (explained).
* **✘ not done**: not implemented, with the reason.

Test files:

* `P`: `tests/physics.test.mjs`
* `G`: `tests/game.test.mjs`
* `B:<spec>`: `tests/browser/<spec>.spec.mjs`
* `bench`: `scripts/bench.mjs`
* `play`: `scripts/playtest.mjs`

## 1. Source project and independence

| Requirement | Status | Evidence |
|---|---|---|
| Start from `Ram8o211/fluid-pocket-sandbox` | ✘ not done | The local copy was not present in the workspace, and fetching it from GitHub was outside the task's permissions. The game was built from scratch to the architecture the brief describes (see README). |
| Runs entirely in the browser; no backend, database, auth or cloud API | ✔ | Static files only; `B:offline` plays with the network cut |
| Saves progress locally | ✔ | `persistence.js`; `B:systems` (continue, cauldron, export/import, damaged save) |
| Self-contained static site, any static host | ✔ | `npm run build` → `dist/` (relative paths); served by `scripts/serve.mjs` in tests |
| Works with a local dev server without internet | ✔ | `npm run dev`; no external URLs anywhere in `src/`, `styles/` or `index.html` |
| Offline play via caching | ✔ | `sw.js` precache; `B:offline` |
| All assets local; no CDNs | ✔ | Font, icons, art and sound are generated or bundled; no third-party runtime code |
| No GitHub integration in the deliverable | ✔ | None |
| Experimental sandbox kept as a debugging tool | ✔ | In-game **Free Experiment** (every reagent and tool), plus `scripts/lab.mjs` headless scenarios with PNG snapshots |
| Android, iOS, Windows, macOS browsers | ◐ partly | Standard web APIs only (canvas 2D, pointer events, WebAudio, service worker). Tested only in Chromium, at desktop size and in phone/tablet emulation. Not run on Safari/iOS, Firefox or physical Android devices. |

## 2. Game loop

| Requirement | Status | Evidence |
|---|---|---|
| Customer → read order → pick reagents → measure → pour → manipulate → heat/cool/stir/crush → observe → measure → refine → bottle → sell → rewards → unlocks | ✔ | `B:gameplay` plays the first order through the real UI (doses, touch or mouse stirring, fire control, bottling, payment, next customer); `play` runs 12-day careers |

## 3. Physics

| Requirement | Status | Evidence |
|---|---|---|
| Gravity, settling, collisions, packing without gaps | ✔ | P: "liquid pools calmly…", "immiscible liquids stratify by density without gaps"; screenshots |
| Viscosity, friction, cohesion, buoyancy, stratification | ✔ | P: stratification, "paste holds its shape while water and honey level out", gas buoyancy |
| Thermal conduction, phase transitions | ✔ | P: conduction, freezing, boiling/condensing, drying |
| Solubility and compatibility; local reactions | ✔ | P: "immiscible liquids never blend even when stirred"; reactions only where reactants meet (`reactions.js`); `G` achievability includes reaction styles |
| Mass conservation | ✔ | P: crushing conserves material, drying conserves water; `B:sandbox` long run conserves matter (in pot + vented) |
| Particles never penetrate walls, floor or lid | ✔ | P: "vigorous stirring never pushes matter through the walls", "gases are buoyant and contained"; `B:sandbox` long run finds 0 particles outside |
| No artificial floating; no springy contacts | ✔ | P: "grains do not rebound elastically"; position-based contacts with no springs |
| Liquids: pool, flow, viscosity range, damping, layering, mixing | ✔ | P scenarios; `B:sandbox` layers (syrup below water, oil on top) |
| Very viscous liquids much slower | ✔ | P: honey levels out much more slowly than water |
| Settled liquid without bouncing or gaps | ✔ | P: "liquid pools calmly" (speed threshold); rendering smooths the surface iso-line |
| Powders behave like sand: pile, angle of repose, rest, avalanche, friction, no bounce, no fluidisation, no tunnelling | ✔ | P: "powder forms a stable pile with an angle of repose and goes to sleep", "a disturbed pile avalanches and settles again", "grains do not rebound"; speed limit of one radius per step |
| Dough only by stirring; yield-stress paste; ratio-dependent; dilutes continuously | ✔ | P: "dough forms only with stirring, and excess liquid thins it back", "paste holds its shape…" |
| Freezing makes one coherent block shaped like the liquid; moves as one body | ✔ | P: "freezing starts at the cold bottom and forms one coherent rigid block"; `rigid.js` shape matching |
| Pestle crushes blocks into grains that obey granular rules; melting works | ✔ | P: "pestle crushes a frozen block into grains, conserving material"; `B:sandbox` freeze → crush |
| Gases: buoyant, weak pressure, dispersal, contained by the lid, condense, recoverable | ✔ | P: "boiling vapour stays under the lid and condenses back when cooled", "gases are buoyant and contained"; alembic upgrade collects vapour |
| Densities retained; incompatible liquids stratify without gaps | ✔ | P stratification |
| Interactions for liquid–liquid, powder–liquid, powder–powder, gas–gas; gases are not solvents for dough | ✔ | `diffusion.js` pair rules; P dough scenario |

## 4. Visible mixing and diffusion

| Requirement | Status | Evidence |
|---|---|---|
| Mixing starts at the contact interface and spreads progressively | ✔ | P: "mixing starts at the contact interface and spreads progressively" |
| Stirring accelerates dramatically, with swirls | ✔ | P: "stirring accelerates mixing dramatically"; `B:gameplay` checks the essence spread falls under 0.35 after touch stirring |
| Composition-weighted equilibrium (e.g. 20/80 is mostly blue) | ✔ | P: "compatible mixture converges to a composition-weighted equilibrium colour"; Beer–Lambert colour mixing |
| Proper mixture laws per property | ✔ | `mixture.js`: linear in volume for density and heat capacity, logarithmic for viscosity plus a suspension law, absorbance for colour |
| Correct after adding, draining, save/reload | ✔ | P: "save → reload reproduces the cauldron state"; `B:systems` cauldron persistence |

## 5. Thermal physics and phase changes

| Requirement | Status | Evidence |
|---|---|---|
| Heat enters at the bottom and propagates; cauldron iron holds and conducts heat; returns to ambient | ✔ | P: "heat enters through the bottom and conducts progressively"; energy balance test |
| Temperature affects viscosity, solubility and reaction rates | ✔ | `derived.js` (viscosity), `mixture.js` (solubility), reaction temperature windows |
| Local freezing and boiling with latent heat; steam collects under the lid; condenses where cool; no artificial condensation while hot | ✔ | P freezing and boiling scenarios; `phase.js` |
| Visible thermal gradients | ✔ | Thermal monocle view (`T`); glowing wall rendering |
| Combustion: local ignition, spread through heat, no instant global fire, flames and sparks, material balance | ✔ | P: "combustion spreads locally…", "glowing iron lights an oil pool, and closing the lid smothers the fire"; `B:sandbox` fire; screenshot `desktop-fire.png` |

## 6. Tools

| Requirement | Status | Evidence |
|---|---|---|
| Spoon, radius about 0.42, drag, circles, fast/slow, swept for fast touches, no remote attraction | ✔ | `SIM.SPOON_RADIUS = 0.42`; sub-stepped tool path; `B:gameplay` stirs with real touch events (DevTools protocol) on phone profiles |
| Auto-stir that is not better than skilled stirring | ✔ | Clockwork stirrer upgrade or `A`: wide slow circles; manual stirring gives stronger local shear |
| Pouring and measured dosing | ✔ | Hold-to-pour plus 25/50/100/250 ml buttons; `B:gameplay` checks exactly 225 ml and the inventory charge |
| Heating and cooling controls | ✔ | Fire/frost slider; `B:gameplay` uses it |
| Pestle | ✔ | `B:sandbox` |
| Thermometer; ingredient/property inspector | ✔ | Inspect tool (local probe readings); long-press a jar for the ingredient inspector (`desktop-10-ingredient` screenshot) |
| Potion sampling and measuring vial | ✔ | **Sample** draws a test vial from the tap and shows its analysis, limited by the instruments owned; `B:gameplay` |
| Bottling; cauldron cleaning | ✔ | Bottle (drawn from the tap); empty button; skimmer upgrade |
| Upgrades that change capabilities | ✔ | 24 equipment items; `B:systems` checks bellows raise the flame limit |

## 7. Fine material pixels

| Requirement | Status | Evidence |
|---|---|---|
| 1–2 px material detail; continuous liquids; granular powders; thick dough; delicate gas; compact ice; no gaps, flicker or aliasing | ✔ | `fluid.js`; screenshots in `docs/screenshots/` reviewed during development (surface smoothing, fog-like vapour and back-wall dithering were added after reviews) |
| No naive increase of physical particle count | ✔ | Rendering resolution is independent of physics (5 ml per particle) |

## 8. Procedural ingredients

| Requirement | Status | Evidence |
|---|---|---|
| Reproducible per seed | ✔ | G: "worlds are deterministic per seed and differ between seeds" |
| At least 6 liquids and 2 powders at the start | ✔ | G: checked over 25 seeds |
| Full property set; distinct; medieval names; readable descriptions revealed by measurement | ✔ | `schema.js`, `generator.js`, `names.js`; the inspector reveals exact values with instruments or observation |

## 9. Customers and commissions

| Requirement | Status | Evidence |
|---|---|---|
| Names, personalities, portraits, occupations, dialogue, budgets, expectations, rewards | ✔ | 12 archetypes (`customers.js`), procedural portraits |
| Requirements: colour, density, viscosity, temperature, potency, stability, volatility, quantity | ✔ | `commissions.js` |
| Grows with progression; strategies differ by customer | ✔ | 14 styles gated by tier; archetypes prefer styles and properties |
| Always achievable | ✔ | G: 20 generated orders brewed in the real simulation (each ≥ 0.8 quality, mean ≥ 0.95); G: day-one orders only use purchasable, affordable reagents and reachable temperatures; `scripts/achievability.mjs` |
| Clear per-requirement feedback | ✔ | Live meters on the order card; result table after bottling |

## 10. Measurement and evaluation

| Requirement | Status | Evidence |
|---|---|---|
| Measured from the bottled particles | ✔ | `measure.js` (tap selection) |
| Tolerance scoring; better match pays more; minor mistakes not worthless; perfect is hard but possible | ✔ | G: "scoring rewards accuracy and tolerates small deviations" |
| Clear assessment after bottling | ✔ | Result dialog (`desktop-tutorial-result` screenshot) |

## 11. Economy

| Requirement | Status | Evidence |
|---|---|---|
| Coins, inventory, supply costs, restocking, sales, reputation, purchases, upgrades, unlockable reagents, rising difficulty | ✔ | `state.js`; G market test; `B:systems` purchases |
| Consumed resources cost money | ✔ | `B:gameplay` inventory charge; G exploit test |
| Recovery from bad decisions | ✔ | G: "no soft-lock" (daily stipend; water always free) |
| Upgrades change what you can do | ✔ | Furnaces, frost plates, vessels, instruments, stirrer, alembic, homunculus, shelves, charter |
| Balanced | ◐ partly | `play`: income exceeds costs; ranks at a steady pace (see REPORT). Tuned against simulated players, not human playtesters. |

## 12. Recipes and discovery

| Requirement | Status | Evidence |
|---|---|---|
| Save preparation (ingredients, amounts, actions, temperatures, stirring, results, satisfaction, name) | ✔ | Result dialog "Save recipe"; `B:gameplay` saves and reuses one |
| Reuse still involves brewing; automation respects cost and simulation | ✔ | "Prepare" pours (and charges) the ingredients, then you brew; the homunculus runs the plan in the real simulation and spends stock |
| Discovery journal / encyclopedia; rewards | ✔ | Journal tabs (discoveries, encyclopedia, achievements, sales); discoveries grant reputation; 22 achievements with coin rewards |

## 13. Progression and content

| Requirement | Status | Evidence |
|---|---|---|
| Apprentice → Grand Alchemist; milestones, ranks, contracts | ✔ | 6 ranks, guild contracts (charter), royal grand commission at Master |
| Multi-session content | ◐ partly | `play` reaches Expert around day 10–11 with Master and Grand Alchemist still ahead. Longer sessions were not simulated. |
| Free experimentation mode with separate economy | ✔ | Free Experiment (separate save key) |

## 14. Game feel

| Requirement | Status | Evidence |
|---|---|---|
| Feedback for pouring, mixing, avalanches, dough, phases, reactions, bottling, rewards, unlocks; sound; transitions | ✔ | Effects, toasts, celebrations, sounds; reviewed in screenshots |
| Time acceleration | ✔ | 1×/2×/4× speed (`F`) |
| Onboarding: first potion without outside help | ✔ | 11-step tutorial driven by cauldron events; `B:gameplay` completes it on desktop and phones |

## 15. Graphics

| Requirement | Status | Evidence |
|---|---|---|
| Coherent medieval pixel art: central cauldron, furnace, cooling, shelves, instruments, bottles, brass and copper, stone and timber, warm light | ✔ | `art.js`, `renderer.js`; screenshots |
| Original assets for jars, tools, equipment, portraits, coins, icons, potions, effects | ✔ | All drawn in code (`icons.js`, `portraits.js`, `art.js`); pixel font generated by `scripts/make-font.py` |
| Lighting for fire, heat, cold, burning, reactions, glow | ✔ | `renderer.js` lighting pass (skipped at low quality) |

## 16. Mobile-first UI

| Requirement | Status | Evidence |
|---|---|---|
| Portrait-optimised; large cauldron; reachable controls; touch for every action; no scroll conflicts; safe areas | ✔ | `B:layout`: cauldron covers more than 22% of the screen, no horizontal overflow, controls on screen, touch targets ≥ 30 px, on phone portrait, phone landscape and tablet |
| Desktop layout with keyboard shortcuts | ✔ | Three-column desktop layout; shortcuts listed in Help |
| 12 required screens | ✔ | Menu; new/continue; laboratory; customer/commission card; ingredient shelf/inventory; measurement (Inspect, Sample, analysis); recipe book; journal; shop/guild/equipment; result and sale; settings and saves; tutorial and help. `B:layout` opens the panels. |
| Every visible control works | ✔ | Browser tests exercise the main controls; a manual review of all panels found and fixed clipped tabs and missing icons |
| Physical devices | ◐ partly | **Only desktop emulation** (Chromium viewport, touch, DPR, CPU throttling). No physical phone or tablet testing was possible here. |

## 17. Sound

| Requirement | Status | Evidence |
|---|---|---|
| Sounds for pouring, stirring, heat, freezing, crushing, glass, reactions, sales, purchases, discoveries, customers | ✔ | `audio.js` (synthesised) |
| Optional; respects autoplay; volume and mute | ✔ | Starts on first gesture; settings persist (`B:systems`) |
| Audio quality on real speakers | ◐ partly | Headless tests can't listen; sounds were checked only for errors |

## 18. Saves and offline

| Requirement | Status | Evidence |
|---|---|---|
| Saves seed, world, coins, reputation, inventory, equipment, discoveries, recipes, history, current customer, cauldron particles, composition, temperatures, reaction progress, settings | ✔ | `GameState.toJSON`, `snapshot.js`; G round-trip; `B:systems` |
| Autosave, export and import | ✔ | `B:systems` |
| Migration of older saves | ✔ | G: v1 → v2 migration; missing world regenerated |
| Corrupted storage handled | ✔ | `B:systems` damaged save restores the backup and warns. A bug where the warning was lost was found by this test and fixed. |
| PWA, offline | ✔ | `B:offline` |

## 19. Performance

| Requirement | Status | Evidence |
|---|---|---|
| Typed arrays, uniform grid, no O(N²), fixed timestep, physics separate from rendering, quality-independent physics | ✔ | `particles.js`, `grid.js`; P: "neighbour search is linear" |
| About 60 fps on capable desktops | ✔ (measured) | bench: 59–60 fps in real time at the typical 60–300 particles; 48–51 fps at 800–1,300 particles (headless Chromium, software rendering) |
| 30–60 fps on mid-range phones | ◐ partly | Measured only with 4× CPU-throttled emulation: 28–33 fps at 60–300 particles (simulation at 0.73–0.83× real time), 16–21 fps at 800–1,300 particles (deliberate slow motion, 0.14–0.18×). Not measured on a real phone. |
| Graceful degradation before correctness | ✔ | Automatic quality steps; physics time budget slows the brew instead of changing results |
| No major leaks | ✔ (measured) | bench memory soak: heap flat at 3.5–4.1 MB over 90 s of boiling; 4.22 → 4.44 MB over 10 menu↔shop trips; old screens are released (REPORT §4) |
| Web Workers | ✘ not done | Not used: per-step cost is a few ms and the UI reads particle state every frame, so a worker would add synchronisation without a measured benefit. |

## 20. Architecture

| Requirement | Status | Evidence |
|---|---|---|
| Clear boundaries; modular, data-driven; no runtime frameworks | ✔ | `docs/GAME_ARCHITECTURE.md`; zero runtime dependencies. `lab.js` (about 1,200 lines) is the largest file; it coordinates the screen but delegates to the game, simulation and rendering modules. |

## 21–22. Testing and balancing

| Requirement | Status | Evidence |
|---|---|---|
| Physics scenarios listed in the brief | ✔ | 23 scenarios in P |
| Gameplay: achievable orders, rewards, inventory charges, no exploit, unlocks, purchases, recipes, no stuck states, save safety | ✔ | G (11 tests) and B:gameplay/systems |
| Browser tests: portrait, landscape, desktop, pointer and touch, selection, pouring, stirring, crushing, tools, customers, purchases, saves, reload, long simulation; screenshots inspected | ✔ | 43 Playwright tests, 5 profiles; screenshots in `test-results/screenshots/` (curated copies in `docs/screenshots/`) |
| Performance report with fps, step times, frame-time distribution, particle counts, memory | ✔ | `docs/perf-results.json`, REPORT |
| Balancing playthroughs | ◐ partly | `play` (2 skill profiles × 3 seeds × 12 days). Human playtesting was not available. |

## 23–25. Definition of complete and deliverables

| Deliverable | Status | Where |
|---|---|---|
| Source project | ✔ | this repository |
| Production build | ✔ | `dist/` (committed), rebuilt by `npm run build` |
| Development instructions | ✔ | README |
| Verification suite | ✔ | `npm test`, `npm run test:browser`, `npm run bench`, `scripts/playtest.mjs` |
| Gameplay and performance report | ✔ | `docs/REPORT.md` |
| Architecture documentation | ✔ | `docs/GAME_ARCHITECTURE.md` |
| Completion checklist | ✔ | this file |
| ZIP | ✔ | `release/alchemists-shop-1.0.0-web.zip` (production build) |

## Known limitations

1. The supplied source project was unavailable, so the game was written from
   scratch.
2. No physical-device testing. Phone and tablet results come from Chromium
   emulation; Safari/iOS and Firefox were not run.
3. On weak devices with large batches (more than about 800 particles) the
   simulation runs in slow motion to keep the game responsive. Typical
   shop orders use 50–300 particles.
4. Balancing was tuned with simulated players that follow the hidden
   reference recipes with noise. Real players must discover recipes through
   the meters, which is harder; human playtesting would refine pacing.
5. With oil on water, the oil can sit as a slightly domed lens rather than
   a perfectly flat film.
