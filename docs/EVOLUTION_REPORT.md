# The complete game evolution — implementation report

This report covers the round that turned The Alchemist's Shop into the
complete, simulation-driven alchemy game described in the "Complete Game
Evolution" brief: arcane activation, whole solids and cracking, the rabbit
colony, narrative commissions with the 1.2 % purity rule, labels,
bargaining and next-day consequences, reversible particle-exact bottling,
deeper gathering, and the sound, interface, saves, tests and documentation
around them. It explains the architectural decisions, lists what was
built, and reports what was measured and what remains limited.

Everything was built on this repository's own engines. No other
potion-brewing project was inspected, cloned or borrowed from; the brief
was the only functional reference. The working checkpoint used across
sessions is [`EVOLUTION_PLAN.md`](EVOLUTION_PLAN.md).

**Environment.** A shared cloud Linux container (Intel Xeon, 4 cores,
Node 22) and headless Chromium (Playwright) with software canvas
rendering. Phones and tablets were exercised through Chromium device
emulation (viewport, touch input, device pixel ratio 2; 4× CPU throttling
for the performance profile), not on physical devices.

## 1. Architectural decisions

* **Extend, never replace.** The position-based particle simulation
  (liquids, powders, pastes, rigid bodies, gas), composition vectors over
  species slots, Celsius thermodynamics with latent heat, the ten effect
  channels, hidden resonance laws, procedural materials and Free
  Experiment mode are all kept and extended. The species table grew from
  16 to 24 slots to make room for awakened forms.
* **Awakening is chemistry, not a flag.** An awakened material is its own
  species (`id~a`): the same physical substance with effects × gain and a
  brighter glow, resolved on demand by the world lookup. A per-particle
  conversion step compares each particle's temperature with the
  volume-weighted threshold of the magic it carries. Because activation
  is composition, every existing system — diffusion, reactions,
  measurement, bottling, snapshots, saves — carries it with no special
  case, it is proportional to the magic present, and it never reverts by
  itself. The −1000…+1000 scale maps linearly onto °C
  (`T = 20 + 0.1 · threshold`), so −1000 × 1 and +800 × 2 blend to +200
  (40 °C), exactly as the brief's example.
* **Effects are percent effective concentration.** Native potencies were
  rebalanced so everyday orders want 8–15 % and the strongest need
  awakened magic; glow comes from each particle's actual effect vector.
* **Vials hold particles, not summaries.** A bottle stores every
  particle's composition, temperature, charge and phase, so doses, pouring
  back and re-bottling conserve matter exactly and certification is tied
  to a batch revision.
* **The colony is a pure model plus a pure renderer.** `game/colony.js`
  holds the individuals and rules (deterministic, seeded per world, rabbit
  and day); `rendering/rabbit.js` and `rendering/hutch-scene.js` draw only
  from a quantised visible state, so no hidden number can reach the
  screen. `trials.subjects.rabbit` stays a non-enumerable handle on the
  selected rabbit, so every earlier code path and test kept working.
* **Remains are real materials.** A body's bones, pelt, ash and residue
  join the world's materials with physical properties, hidden effects
  derived from the rabbit's lifetime exposure, and arcane thresholds; the
  lookup re-indexes itself, and remains are masked from theory, shop,
  inspector, book and order planning.
* **Commissions are proven before they are offered.** Each order comes
  from a hidden plan that the predictor brews and the counter's own
  scoring (`evaluatePotion`) accepts — including activation stages and
  the purity rule — and a feasibility run brews generated orders in the
  real simulation.
* **Saves migrate by version and by shape.** Save version 4 converts the
  old single rabbit into a colony founder inside `normalizeTrials`, driven
  by the data's shape, so the unversioned sandbox store is repaired the
  same way; genuine version-2 and version-3 saves are part of the tests.

## 2. What was built (by section of the brief)

| Brief | Built | Where |
|---|---|---|
| 3 Physics | Whole solids with shaped templates and body-local textures that rotate with the body; crushing cracks solids into fragments before grinding them to powder; a slush stage between liquid and ice; translucency of clear liquids; vapour, combustion and phases as before. | `materials/shapes.js`, `simulation/rigid.js`, `simulation/tools.js`, `rendering/fluid.js` |
| 4 Tools | Pour, stir and crush act directly on the simulation; crushing chips or splits along the stroke. | `simulation/tools.js`, `ui/lab.js` |
| 5 Magic | Arcane thresholds on every magical material, volume-weighted blend thresholds, per-particle awakening with energy bookkeeping, persistence through bottling, saves and pour-back, per-channel coloured glow from effective concentration, predictor support, the Arcanometer instrument. Thresholds never appear in the UI. | `alchemy/arcane.js`, `simulation/arcane.js`, `simulation/derived.js`, `rendering/fluid.js`, `game/predict.js` |
| 6 Rabbits | A persistent colony of individuals (identity, inherited look, age stages, health and scarring, eleven-channel marks and lifetime exposure, permanent traits, dose log); visible, combinable effects at three levels each; an enclosure where rabbits hop, turn, sniff, groom, eat, flop, loaf, freeze or float by their state; death keeps body, traits and scars with closed eyes; remains recovered once as real ingredients; breeding, growth, buying, feeding, capacity upgrades; trial replays that consume nothing. | `game/colony.js`, `materials/remains.js`, `rendering/rabbit.js`, `rendering/hutch-scene.js`, `ui/views/hutch.js`, `ui/views/trials.js` |
| 7 Commerce | 20 narrative request templates; concentration tiers; the 1.2 % purity rule; activation orders; verified feasibility; labels (tested / estimate / none / unknown); customer personas; multi-round bargaining; next-day praise, legitimate or dishonest complaints, refunds, disputes with trial evidence; referrals; all saved. | `game/requests.js`, `game/commissions.js`, `game/commerce.js`, `game/customers.js`, `ui/trade.js` |
| 8 Bottling | Measured bottling of exact particles, real doses, exact pour-back, invalidation of earlier certification, relaxation toward room temperature in the bottle. | `game/vial.js`, `ui/lab.js` |
| 9 Gathering | Methods and tools per ingredient, dawn and dusk following the customers, daily weather, careful or thorough harvests with scarred deposits, new equipment (four tools, the Arcanometer, the Rabbit Warren). | `game/gathering.js`, `ui/views/wilds.js`, `game/equipment.js` |
| 10 Interface | Label editor (one claim open at a time on phones), bargaining sheet, follow-up cards, the hutch panel, the wilds' sky and harvest mode, onboarding tips and an "Arcane awakening" help section, touch targets ≥ 44 px on every viewport. | `ui/` |
| 11 Audio | Synthesised cues for awakening, cracking, bargaining, deals, complaints, praise, rabbits (squeak, thump, munch, birth, toll) and gathering (dig, snip). | `audio/audio.js` |

## 3. Acceptance criteria

| # | Criterion | Evidence |
|---|---|---|
| 1 | Original physics and chemistry intact | `tests/physics.test.mjs` (23), `tests/alchemy.test.mjs`, unchanged scenarios; benchmark scenarios faster than before |
| 2 | Materials interact across phases | physics and solids tests; browser systems spec |
| 3 | Direct pouring, stirring, crushing | gameplay and systems browser specs (real pointer and touch input) |
| 4 | Freezing makes coherent solids | `tests/solids.test.mjs`, rigid-body tests |
| 5 | Activation by composition and temperature, opposing thresholds | `tests/arcane.test.mjs` (blend threshold, opposing mixes, energy balance) |
| 6 | Activation persists; concentrations drive glow | arcane and vial tests (awakened state through bottling, save, pour-back); showcase screenshot |
| 7 | Real doses, meaningful readings, persistent creatures | trials, vial, colony and colony-state tests; colony browser spec counts removed particles |
| 8 | Animated, cumulative, combinable rabbit effects through death and recovery | `tests/colony.test.mjs`, `tests/rabbit-render.test.mjs`, colony and showcase specs, contact-sheet review |
| 9 | Coherent, balanced, achievable commissions | `tests/commissions.test.mjs`; feasibility run (§5) |
| 10 | Complete commercial system | `tests/commerce.test.mjs`; gameplay and showcase specs (label → bargain → deal → complaint → refund) |
| 11 | Return and modify bottles without duplication or stale certification | `tests/vial.test.mjs` |
| 12 | Gathering and progression support the loop | `tests/gathering.test.mjs`, rooms spec, multi-day playtest |
| 13 | Practical on mobile and desktop | layout spec on desktop, phone portrait, phone landscape and tablet; screenshots |
| 14 | Performance and long-play stability | benchmark (§4) |
| 15 | Saves migrate | v1, v2 and genuine v3 save tests; sandbox store repair |
| 16 | Build, docs and tests reflect the implementation | this report, README, architecture doc, production build |

## 4. Performance

All figures are from `npm run bench` on the machine above; full tables in
[`PERFORMANCE.md`](PERFORMANCE.md), raw data in
[`perf-results.json`](perf-results.json). Runs vary by ±20–30 % on this
shared container.

* **Physics.** Typical shop brews (60–300 particles in the 1.5 L pot) cost
  0.14–0.61 ms per 1/120 s step, 0.3–1.2 ms per 60 fps frame; the full 3 L
  cauldron with three liquid layers 2.7 ms. The homunculus brews a whole
  order (23–62 simulated seconds) in 0.3–2.3 s.
* **Awakening.** In a stirred pot of water and essence (150 particles) a
  step costs 0.34 ms cold and 0.40 ms while the magic awakens.
* **The colony.** A simulated year with a full warren — 730 strong doses,
  33 births, 42 deaths, half of them processed into remains — costs
  0.08 ms per dose and 0.07 ms per night (the whole end of day). The save
  grows from 84 KB to 277 KB, almost all of it the remains' materials;
  it is written in 4 ms and loaded in 9 ms.
* **Frames.** Desktop (1440×900) holds 55–60 fps in real time up to 300
  particles and 49 fps at 600. The phone profile (390×844 at 2×, CPU
  throttled 4×) runs typical orders at 44–49 fps and a full pot at 38 fps
  with the brew in 0.83× slow motion; a 600-particle cauldron slows to
  0.29×. The trials room with ten changed rabbits hopping in the hutch
  runs at 60 fps on desktop (0.5 ms of work per frame) and 59 fps on the
  throttled phone (2.5 ms median, 5.2 ms p95).
* **Memory.** 90 s of lid-on boiling with auto-stir at 4× speed keeps the
  heap flat at 4.2–4.9 MB; ten trips between the menu and the shop end at
  5.4 MB.

## 5. Balance and feasibility

* **Feasibility simulation** (`node scripts/achievability.mjs 20 final`,
  [`achievability-results.txt`](achievability-results.txt)): 100 generated
  commissions across tiers 0–4 brewed in the real simulation with each
  rank's equipment — mean quality 0.999, worst 0.90, none below 0.8;
  29 of the 100 require awakening.
* **Multi-day playtest** (`node scripts/playtest.mjs`,
  [`playtest-results.json`](playtest-results.json)): a scripted
  shopkeeper plays twelve days in three worlds, carefully and casually —
  gathering (with the new spoilage and careful reserve), brewing in the
  real simulation, testing, selling and upgrading. Every run reaches
  Expert by day 10–11, buying the four gathering tools, the kennel, the
  warren and the arcanometer along the way.

## 6. Tests

Every command below was run on the final code; all passed.

| Check | Result |
|---|---|
| `npm run typecheck` (TypeScript over JSDoc, app and Node configs) | no errors |
| `npm test` (Node test runner, 14 files) | **108 / 108** passed |
| `npx playwright test` (6 projects) | **92 / 92** passed: desktop 31, phone portrait 31, phone landscape 19, tablet 5, offline production build 1, GitHub Pages sub-path 5 |
| `node scripts/achievability.mjs 20 final` | 100 / 100 commissions brewed; mean quality 0.999, worst 0.90, none below 0.8 |
| `node scripts/playtest.mjs` | 6 runs × 12 days (3 worlds, careful and casual players): every run reaches Expert (day 10–11) |
| `npm run bench` | §4 |
| `npm run build` | 70 modules, 767 KB (227 KB gzipped); `release/alchemists-shop-2.0.0-web.zip` |

New unit coverage: `arcane` (6 tests), `solids` (3), `vial` (5),
`commerce` (10), `gathering` (6), `colony` (12), `colony-state` (7),
`rabbit-render` (4), plus additions to `commissions`, `trials` and
`physics`. They include regressions for every finding of the final
adversarial review: claims that keep their reading and become tested
again, verdicts that wait for the customer, refunds refused when the till
is short, reputation below zero, harmful potions never praised, evidence
counted once, spoilage drawn from the deposit and the careful reserve,
the night's weather, founders' ages after a late migration, and the
memorial keeping processed bodies and their names, and pouring part of
a vial back returning only its share of the batch's provenance.

New browser specs: `colony` (choosing and dosing rabbits, the dropper onto
a rabbit, replay without consumption, death and remains across a reload,
buying to capacity, births overnight, the sandbox night), `bargain`
(walking away and resuming), `pourback` (bottle, dose from the vial,
pour the rest back: matter, provenance and the batch revision), `showcase` (the documentation scenes, each
with assertions), and additions to `gameplay`, `rooms`, `layout` and
`systems` (labels, proof, bargaining, follow-ups, harvest modes, 44 px
touch targets).

**Screenshots** ([`screenshots/`](screenshots/)), captured by the specs:

| | |
|---|---|
| Awakened magic glowing in the brew | [desktop](screenshots/desktop-showcase-awakened.png) · [phone](screenshots/phone-portrait-showcase-awakened.png) |
| A hutch of changed rabbits | [desktop](screenshots/desktop-showcase-hutch.png) · [phone](screenshots/phone-portrait-showcase-hutch.png) · [landscape](screenshots/phone-landscape-showcase-hutch.png) |
| A body that keeps its changes | [desktop](screenshots/desktop-showcase-body.png) · [phone](screenshots/phone-portrait-showcase-body.png) |
| Dosing, replay, a night, remains on the shelf | [dosed](screenshots/phone-portrait-colony-dosed.png) · [replay](screenshots/desktop-colony-replay.png) · [night](screenshots/desktop-colony-night.png) · [remains](screenshots/desktop-colony-remains-shelf.png) |
| Labelling and bargaining | [label](screenshots/phone-portrait-showcase-label.png) · [bargain](screenshots/desktop-showcase-bargain.png) |
| A complaint the next day | [desktop](screenshots/desktop-showcase-complaint.png) · [phone](screenshots/phone-portrait-showcase-complaint.png) |
| The wilds at dusk in a storm | [desktop](screenshots/desktop-showcase-wilds-storm.png) · [phone](screenshots/phone-portrait-showcase-wilds-storm.png) |
| Physics: layers, freezing, crushing, fire | [layers](screenshots/desktop-layers.png) · [frozen](screenshots/desktop-frozen.png) · [crushed](screenshots/desktop-crushed.png) · [fire](screenshots/desktop-fire.png) |

## 7. Limitations

* Devices were emulated, not physical; Safari and Firefox were not run.
* Rabbit appearance is procedural pixel art at 48 × 40; very crowded
  hutches (ten rabbits with strong effects) overlap.
* Reading uncertainty (±) is presentational: certification, labels and
  disputes compare the exact readings, so a later version could add real
  measurement noise only within the drift tolerance.
* Remains of processed rabbits stay in the world's material list (their
  particles, vials and records must remain resolvable), so a very long
  career grows the save by a few kilobytes per processed body.
* An older cached build refuses version-4 saves with a clear "newer
  version" message until the service worker updates.
* The multi-day playtest sells through the counter's direct sale, not the
  label-and-bargain loop; labels, bargaining and the next-day verdicts are
  covered by unit and browser tests, but their long-run economy is not
  simulated over many days.
* The new sound cues are synthesised at run time. The browser specs run
  the code paths that play them and fail on any page error, but the
  sounds were not judged by ear in this headless environment.
* Ten round trips between the menu and the shop leave the heap about
  0.5 MB larger than after the first (as in the previous release); the
  brewing session itself stays flat.
