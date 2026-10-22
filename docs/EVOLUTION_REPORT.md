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

PERF_PLACEHOLDER

## 5. Balance and feasibility

* **Feasibility simulation** (`node scripts/achievability.mjs 20 final`,
  [`achievability-results.txt`](achievability-results.txt)): 100 generated
  commissions across tiers 0–4 brewed in the real simulation with each
  rank's equipment — mean quality 0.999, worst 0.90, none below 0.8;
  awakening stages appear in roughly a third of commissions from tier 2.
* **Multi-day playtest** (`node scripts/playtest.mjs`,
  [`playtest-results.json`](playtest-results.json)): twelve days of a
  scripted shopkeeper reach the Expert rank, buying the new tools, the
  warren and the arcanometer along the way.

## 6. Tests

TESTS_PLACEHOLDER

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
