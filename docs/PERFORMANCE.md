# Performance

Every number here comes from `npm run bench` (`scripts/bench.mjs`) and was
measured on this repository's code. Raw data: `docs/perf-results.json`.

**Machine:** a shared cloud container, Intel Xeon @ 2.1 GHz, 4 cores,
Node 22, headless Chromium 1.56 (Playwright) with **software** canvas
rendering. Repeated runs on this container vary by roughly ±20–30%, so
treat single figures as indicative.

**Phones were not measured on real devices.** The "phone ÷4" profile is
Chromium emulation: a 390×844 viewport at device pixel ratio 2 with touch
input and the CPU throttled 4× through the DevTools protocol. It stands in
for a slow phone; a real phone composites on its GPU, which headless
Chromium does in software here.

## 1. Physics step cost (Node, one thread, fixed 1/120 s step)

One particle is 5 ml. The shop's vessels hold 1.5 L (310 particles),
2.2 L (440) and 3 L (600); typical orders are 30–150 particles. A 60 fps
frame needs two steps. *Assay* is what the HUD pays to measure the bottle
(tap selection, colour, density, effects), done about twice a second.

| Scenario | Vessel | Particles | ms / step | ms / 60 fps frame | assay ms |
|---|---|---|---|---|---|
| tonic (water + essence) | pot | 60 | 0.14 | 0.27 | 0.27 |
| typical brew | pot | 150 | 0.30 | 0.61 | 0.17 |
| stirred infusion with powder | pot | 200 | 0.50 | 0.99 | 0.29 |
| full pot | pot | 293 | 0.61 | 1.21 | 0.16 |
| full copper cauldron | copper | 413 | 0.96 | 1.91 | 0.21 |
| three liquid layers | grand | 546 | 1.34 | 2.69 | 0.11 |
| boiling under the lid | grand | 400 | 0.73 | 1.46 | 0.01 |
| water (reference vessels) | small / medium / large | 300 / 900 / 1,400 | 0.60 / 2.42 / 3.35 | 1.19 / 4.83 / 6.70 | — |
| three liquid layers | medium | 900 | 2.26 | 4.52 | 0.23 |
| sand pile | medium | 600 | 0.70 | 1.41 | 0.17 |
| dough, stirred | medium | 600 | 1.40 | 2.79 | 0.22 |
| frozen block | medium | 500 | 0.89 | 1.78 | 0.14 |

Typical shop brews cost 0.3–1.2 ms of physics per 60 fps frame. The
homunculus brews a complete order (23–62 simulated seconds) in
0.3–2.3 s of wall time.

The new systems add little to the step:

* **Electricity** is one scan per step for a neutral brew. Conduction runs
  only when some particle is charged.
* **Effects** are not part of the step at all. They are computed from
  composition only when something is measured (the assay above, a trial
  dose, the bottle).
* **The wilds** cost nothing while brewing. Deposits resolve their stock
  lazily from timestamps when shown or gathered.
* **The simulation is drawn only in the Brew room.** It keeps stepping
  elsewhere so a fire left burning keeps burning, but the other rooms
  render their own lightweight scenes.

Profiling the stirred 300-particle scenario in Node, old release against
this one, gave the same step cost (about 1.0 ms), so the new systems did
not slow the solver.

## 2. Frame timing in the browser

The Free Experiment cauldron (3 L) is filled with water, essence and oil,
with auto-stir and gentle heat. The game's own instrumentation is then
read over 6 s (8 s throttled).

* **Frame p50 / p95:** intervals between frames, in ms.
* **Work:** median time inside the frame callback.
* **Physics / render:** smoothed ms per frame.
* **Sim speed:** simulated seconds per wall second (1.00 = real time).

| Profile | Preset | Particles | fps | Frame p50 / p95 | Work p50 | Physics | Render | Sim speed | Quality used |
|---|---|---|---|---|---|---|---|---|---|
| desktop 1440×900 | auto | 60 | 60 | 16.7 / 16.7 | 6.5 | 0.5 | 9.2 | 1.00 | high |
| desktop 1440×900 | auto | 150 | 59 | 16.7 / 16.8 | 6.3 | 1.4 | 9.1 | 0.99 | high |
| desktop 1440×900 | auto | 300 | 55 | 16.7 / 33.3 | 10.0 | 2.6 | 9.6 | 0.98 | high |
| desktop 1440×900 | auto | 600 | 49 | 16.7 / 33.4 | 13.8 | 4.5 | 10.8 | 0.93 | high |
| phone ÷4 | auto | 60 | 49 | 16.7 / 33.4 | 11.6 | 2.0 | 12.8 | 0.98 | low |
| phone ÷4 | auto | 150 | 44 | 16.7 / 50.0 | 14.6 | 7.0 | 12.7 | 0.93 | low |
| phone ÷4 | auto | 300 | 38 | 16.7 / 50.0 | 19.3 | 13.8 | 12.3 | 0.83 | low |
| phone ÷4 | auto | 600 | 31 | 33.3 / 50.1 | 22.7 | 14.3 | 10.4 | 0.29 | low |

**Reading it**

* **Desktop** holds 55–60 fps in (near) real time up to 300 particles at
  High quality, and 49 fps at 600 particles (the full 3 L vessel) with the
  brew at 0.93×.
* **Phone ÷4.** The automatic preset steps down to Battery saver on this
  profile. Typical orders (60–150 particles) run at 44–49 fps in near real
  time. A full pot (300 particles) runs at 38 fps, with the brew at 0.83×.
  At 600 particles it holds 31 fps and the brew slows to 0.29×. The frame
  loop gives physics only what is left of a ~30 fps frame after rendering
  (8–22 ms), so a slow device keeps responding to input and runs the brew
  in slow motion instead of stuttering.
* Render times here include the new per-channel glow of awakened magic
  and the slush and translucency stages; they are within the run-to-run
  spread of the earlier release.

## 2a. The new systems

**Arcane awakening** (Node, a 1.5 L pot of water and essence, 150
particles, stirred). The per-particle threshold check runs every step for
particles that carry magic; the conversion only where a particle is past
its blend's threshold.

| State | ms / step |
|---|---|
| cold (magic present, nothing past its threshold) | 0.34 |
| heated, awakening under way (73 particle volumes awakened) | 0.40 |
| afterwards (awakened species in the brew, still hot) | 0.47 |

The "afterwards" figure includes the hotter, more agitated brew, not just
the extra species.

**A year in the hutch** (Node, `GameState` itself). A full warren (10
places), breeding on, two strong doses a day, every death processed or
buried in turn, for 365 nights: 730 doses at 0.08 ms each, 33 kits born,
21 bodies processed into remains and 21 buried. A whole `endDay` (follow-
ups, market, regrowth and the night in the hutch) costs 0.07 ms. The save
grows from 84 KB to 277 KB, almost all of it the 84 remains materials
(about 4 KB per processed body; trial records are capped at 120). Writing
it takes 4 ms and loading it 9 ms.

**The hutch scene** (browser, the trials room with ten changed rabbits —
several horned, winged or scaled — hopping about; the cauldron empty):

| Profile | fps | Frame p50 / p95 | Work p50 / p95 |
|---|---|---|---|
| desktop 1440×900 | 60 | 16.7 / 16.7 | 0.5 / 0.9 ms |
| phone ÷4 | 59 | 16.7 / 16.8 | 2.5 / 5.2 ms |

Each rabbit's static body is cached per visible state and pose (an LRU
keyed by the quantised snapshot), so a frame blits it and draws only the
animated effects — flames, frost breath, sparkles, hearts — on top.

## 2b. Gameplay integration round

The brew advice, procedure trace, supply-aware generation and evidence
model add little per frame (advice once a second, the trace one sample a
second, generation ~15–20 ms per customer). Measured on one machine
against the original `main`, the throttled phone moves a few frames per
second either way (better at 150 particles, worse at 300–600); desktop is
unchanged. Details: [GAMEPLAY_INTEGRATION_REPORT.md](GAMEPLAY_INTEGRATION_REPORT.md#6-performance).

## 3. Graphics presets

Settings → Graphics. Physics, quantities and scores are identical in every
preset; only drawing changes.

| Preset | Art pixels | Lighting, glow, aura | Frame cap |
|---|---|---|---|
| High quality | finest (1–2 CSS px) | all | none |
| Balanced | one step coarser once the fine canvas would exceed 90k pixels (phones, desktop stages) | all | none |
| Battery saver | one step coarser | none | 30 fps |
| Automatic (default) | starts at High and steps down when most frames take over 15 ms | | |

Measured on the throttled phone with 300 particles:

| Preset | fps | Frame p50 / p95 | Render ms | Physics ms | Sim speed |
|---|---|---|---|---|---|
| High quality | 18 | 50.0 / 83.3 | 32.8 | 7.1 | 0.15 |
| Balanced | 29 | 33.3 / 50.0 | 16.8 | 15.0 | 0.73 |
| Battery saver | 27 | 33.3 / 50.1 | 9.4 | 18.2 | 0.74 |

Balanced costs about half of High's render time while keeping the
lighting. Battery saver's advantage is the 30 fps cap: it draws half as
many frames as an uncapped preset would on a fast phone, which is where
the battery saving comes from. On this throttled profile neither reaches
30 fps anyway, so the two measure alike. The previous Balanced preset used
the same pixel size as High and cost the same (render 42.7 ms vs 37.2 ms
in an earlier run). That was the reason for the change.

## 4. What was optimised, and how it was checked

**Fluid renderer** (`src/rendering/fluid.js`). A CPU profile of the
throttled phone at High quality put 46% of all samples in the material
renderer. Three changes:

1. The per-pixel accumulators (weight, colour, opacity, paste, texture,
   glow and heat for liquids; weight and colour for ice and vapour) are
   interleaved in one buffer per phase instead of 17 separate arrays. A
   splat now touches one or two cache lines per pixel instead of nine.
2. Each splat row covers only the kernel's chord instead of its bounding
   square.
3. The ice, vapour and powder fields are cleared and read only when such
   particles exist.

Result in a Node harness at phone scale (300 particles): 4.81 → 4.0 ms per
render (−17%). The output was compared pixel by pixel with the previous
renderer, with liquid, paste, powder, ice and vapour all present: **0
differing bytes**.

That comparison also caught a bug in the refactor itself: a local colour
variable shadowed the vapour buffer, so vapour stopped being drawn.
`tests/render.test.mjs` now renders every phase and checks each is
visible. A deliberately broken renderer fails it.

**Balanced preset.** It now uses coarser art pixels (section 3).

**Vessel sizes.** The shop's pots shrank from 7–13.5 L to 1.5–3 L, so the
brew fills more of the view. That makes the rendering denser per particle,
but each frame simulates far fewer particles than before.

## 5. Memory

Heap after forced garbage collection (DevTools protocol):

* **90 s of lid-on boiling with auto-stir at 4× speed (450 particles):**
  4.15 → 4.85 → 4.77 → 4.86 MB at 0 / 30 / 60 / 90 s. Flat, with all 450
  particles still in the vessel.
* **Ten round trips between the main menu and the shop:** 4.88 MB after
  the first, 5.40 MB after the tenth.

Particle storage is typed arrays allocated once per cauldron, and the
renderer's buffers grow only when the drawn region does.

## 6. Limitations

* No physical-device measurements; the phone profile is throttled
  emulation in software rendering.
* With large batches on a slow device the simulation runs in slow motion
  (0.29× at 600 particles on the throttled profile). A full 1.5 L pot runs
  at 0.83×.
* Numbers move ±20–30% between runs on this shared container.
