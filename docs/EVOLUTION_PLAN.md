# Evolution plan — checkpoint

This file is the working checkpoint for the "complete game evolution"
brief. It maps every requirement onto this repository's own modules, records
what already exists, and tracks what is done. It is updated as work lands, so
a later session can continue from it.

## 1. Gap analysis (state of `main` before this work)

| Area | Exists | Needs work | Missing |
|---|---|---|---|
| Liquids (PBF, stratification, viscosity, miscibility, smooth surface) | `simulation/world.js`, `rendering/fluid.js` | translucency of clear liquids | — |
| Powders (GRAN mode, friction, sleeping, dissolving, aggregate rendering) | `world.js`, `diffusion.js`, `fluid.js` | — | — |
| Intact solids (rigid chunks) | `emitter._spawnChunk`, `rigid.js` | shapes are generic hex blobs; drawn like ice | shape templates, material texture that rotates with the body, fragments |
| Crushing | `tools.crush` (particle → powder) | no fragments, no visible damage, effort not material-specific enough | crack/fragment stage, damage rendering |
| Pastes & dough | `phase.classifyFluid`, `mixture.js`, COH mode | — | — |
| Freezing / melting | latent heat in `phase.js`, union-find bodies in `rigid.js` | hard visual switch liquid → ice | slush transition in the renderer |
| Vapour / condensation | GAS mode, lid, `phase.js` | — | — |
| Heat & combustion | `thermal.js`, `reactions._combustion` | — | — |
| Tools (pour/stir/crush, input) | `lab.js`, `tools.js`, `emitter.js` | — | — |
| Ten effect channels, extraction, resonance laws, oppositions | `alchemy/effects.js`, `materials/wild.js` | native potencies too strong for the new scale | — |
| Arcane activation thresholds | — | — | **all** (property, mixture threshold, awakening, persistence, prediction) |
| Magical glow | single warm glow scalar | — | per-channel coloured emission from effective concentration |
| Subjects & trials | `game/experiments.js`, `ui/views/trials.js` | rabbit is a single disposable subject | rabbit colony, exposure, anatomy, breeding, remains, replay |
| Commissions | `game/commissions.js` (plans + predictor) | targets not on the 8–15 % → activation scale; safety limits 4+ | narrative templates, 1.2 % unwanted limit, activation orders, feasibility check through `evaluatePotion` |
| Identification / negotiation / delivery | — | serving is gated on certification | label with uncertainty, bargaining, follow-ups, complaints, disputes, refunds |
| Bottling | one sealed vial (mean composition) | pour-back homogenises, dose reuses the mean | exact particle storage, measured bottle size, provenance |
| Gathering & progression | regions, deposits, regrowth, ranks, equipment | single "gather" action | activities/tools per deposit, availability windows, new equipment |
| Audio | WebAudio synthesis | — | sounds for awakening, rabbits, bargaining, complaints, cracking |
| Saves | v3 with migrations | — | v4 migration (colony, vial particles, rebalanced effects) |

## 2. Design decisions

* **Effect scale.** Effect values stay on the existing 0..100 scale and are
  read as *percent effective concentration*: 100 = a pure, fully extracted,
  fully potent reagent. Native (unawakened) potencies are kept weak
  (mostly 6–30); awakening multiplies them (×2.5–×4).
* **Arcane thresholds.** Each magical material carries `arcane.thr` on the
  abstract −1000…+1000 scale and `arcane.gain`. The scale maps linearly onto
  Celsius: `T = 20 °C + 0.1 · thr` (so +800 → 100 °C, −1000 → −80 °C).
  A particle's effective threshold is the volume-weighted mean over the
  *unawakened magical* species it contains.
* **Awakening is chemistry, not a flag.** An awakened material is a distinct
  species `id~a` (same physical properties, effects × gain, brighter glow),
  resolved on demand by the world lookup. Conversion `A → A~a` runs per
  particle like a reaction, at a rate that grows with how far the particle is
  past its threshold, and exchanges a little energy (stored in `eph`, so the
  energy balance still closes). Therefore diffusion, reactions, measurement,
  bottling, snapshots and saves carry activation with no special cases, and
  it never reverts on its own. Reactions treat `A~a` as `A` and yield
  awakened products in proportion.
* **Glow** is a per-particle emission colour computed in `derived.js` from the
  particle's effective effect vector (the same `compositionEffects` used for
  bottles), splatted by `fluid.js` as coloured light.
* **Rabbit colony** lives in `trials.colony` (individual records). The other
  four subjects keep their single-subject model.
* **Commerce** adds `game/commerce.js` (identification, negotiation,
  follow-ups) on top of `evaluate.js`; the payment comes from the agreed
  price, satisfaction from the true measurement.

## 3. Work order and status



- [x] A1 MAX_SPECIES 16 → 24 (tests use `p.S`)
- [x] A2 arcane properties on every material (profiles, wild, products, remains)
- [x] A3 awakened species + lookup + species table fields
- [x] A4 awakening step in the simulation (+ energy, events, reactions)
- [x] A5 rebalance native effects / gains
- [x] A6 predictor + theory support for activation
- [x] A7 coloured magical glow (derived + fluid renderer + lighting)
- [x] B1 intact solid shapes and rendering
- [x] B2 crack → fragment → powder crushing with damage visuals
- [x] B3 freezing slush transition, translucency polish
- [ ] C1 colony model, exposure, mortality, breeding, growth, migration
- [ ] C2 remains recovery → new ingredients
- [ ] C3 rabbit renderer + enclosure behaviour
- [ ] C4 trials UI: colony, selection, records, replay
- [x] D1 narrative request templates, concentration tiers, 1.2 % rule, activation orders
- [ ] D2 identification record
- [ ] D3 negotiation
- [ ] D4 delivery consequences, complaints, disputes, refunds
- [ ] E1 particle-exact vials, measured bottling, provenance, invalidation
- [ ] F1 gathering activities, availability, new equipment
- [ ] G1 audio
- [ ] G2 UI polish, tutorial/onboarding update
- [ ] G3 tests (unit, browser), feasibility simulation, bench
- [ ] G4 docs, screenshots, build, PR
