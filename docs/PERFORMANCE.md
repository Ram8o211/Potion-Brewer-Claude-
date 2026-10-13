# Performance

Every number here comes from `npm run bench` (`scripts/bench.mjs`) and was
measured on this repository's code. Raw data: `docs/perf-results.json`.

**Machine:** a shared cloud container, Intel Xeon @ 2.8 GHz, 4 cores,
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
| tonic (water + essence) | pot | 60 | 0.26 | 0.52 | 0.42 |
| typical brew | pot | 150 | 0.56 | 1.12 | 0.38 |
| stirred infusion with powder | pot | 200 | 0.71 | 1.41 | 0.55 |
| full pot | pot | 293 | 0.81 | 1.62 | 0.23 |
| full copper cauldron | copper | 413 | 1.23 | 2.45 | 0.33 |
| three liquid layers | grand | 546 | 1.78 | 3.55 | 0.19 |
| boiling under the lid | grand | 400 | 0.68 | 1.35 | 0.02 |
| water (reference vessels) | small / medium / large | 300 / 900 / 1,400 | 0.81 / 2.90 / 3.96 | 1.61 / 5.80 / 7.92 | — |
| three liquid layers | medium | 900 | 3.05 | 6.10 | 0.30 |
| sand pile | medium | 600 | 1.04 | 2.08 | 0.28 |
| dough, stirred | medium | 600 | 1.71 | 3.41 | 0.30 |
| frozen block | medium | 500 | 1.47 | 2.95 | 0.19 |

Typical shop brews cost 0.3–1.4 ms of physics per 60 fps frame. The
homunculus brews a complete order (21–37 simulated seconds) in
0.4–1.7 s of wall time.

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

* **Frame p50 / p95 / p99:** intervals between frames, in ms.
* **Work:** median time inside the frame callback.
* **Physics / render:** smoothed ms per frame.
* **Sim speed:** simulated seconds per wall second (1.00 = real time).

| Profile | Preset | Particles | fps | Frame p50 / p95 / p99 | Work p50 | Physics | Render | Sim speed | Quality used |
|---|---|---|---|---|---|---|---|---|---|
| desktop 1440×900 | auto | 60 | 60 | 16.7 / 16.8 / 16.8 | 3.9 | 0.6 | 5.4 | 1.00 | high |
| desktop 1440×900 | auto | 150 | 59 | 16.7 / 16.8 / 33.3 | 4.7 | 2.0 | 6.9 | 1.00 | high |
| desktop 1440×900 | auto | 300 | 59 | 16.7 / 16.8 / 16.8 | 6.9 | 2.7 | 4.9 | 1.00 | high |
| desktop 1440×900 | auto | 600 | 54 | 16.7 / 33.3 / 50.0 | 12.1 | 6.4 | 8.8 | 0.97 | high |
| phone ÷4 | auto | 60 | 50 | 16.7 / 33.4 / 50.0 | 10.6 | 2.5 | 8.8 | 1.00 | medium |
| phone ÷4 | auto | 150 | 41 | 16.7 / 50.0 / 66.8 | 15.6 | 6.9 | 10.4 | 0.97 | low |
| phone ÷4 | auto | 300 | 30 | 33.3 / 50.1 / 83.3 | 25.2 | 16.0 | 11.3 | 0.65 | low |
| phone ÷4 | auto | 600 | 29 | 33.3 / 50.1 / 83.3 | 24.5 | 11.3 | 10.6 | 0.24 | low |

**Reading it**

* **Desktop** holds 59–60 fps in real time up to 300 particles at High
  quality, and 54 fps at 600 particles (the full 3 L vessel).
* **Phone ÷4.** Typical orders (60–150 particles) run at 41–50 fps in
  (near) real time. A full pot (300 particles) runs at 30 fps, with the
  brew in 0.65× slow motion. At 600 particles it holds 29 fps and the brew
  slows to 0.24×. The frame loop gives physics only what is left of a
  ~30 fps frame after rendering (8–22 ms), so a slow device keeps
  responding to input and runs the brew in slow motion instead of
  stuttering.

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

| Preset | fps | Frame p50 / p95 / p99 | Render ms | Physics ms | Sim speed |
|---|---|---|---|---|---|
| High quality | 18 | 50.0 / 83.4 / 116.6 | 31.4 | 7.4 | 0.15 |
| Balanced | 27 | 33.3 / 66.7 / 83.3 | 9.0 | 15.8 | 0.55 |
| Battery saver | 26 | 33.4 / 50.1 / 83.4 | 11.4 | 16.8 | 0.61 |

Balanced costs about a third of High's render time while keeping the
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
  3.60 → 4.61 → 4.31 → 4.24 MB at 0 / 30 / 60 / 90 s. Flat, with all 450
  particles still in the vessel.
* **Ten round trips between the main menu and the shop:** 4.16 MB after
  the first, 4.63 MB after the tenth.

Particle storage is typed arrays allocated once per cauldron, and the
renderer's buffers grow only when the drawn region does.

## 6. Limitations

* No physical-device measurements; the phone profile is throttled
  emulation in software rendering.
* With large batches on a slow device the simulation runs in slow motion
  (0.24× at 600 particles on the throttled profile). A full 1.5 L pot runs
  at 0.65×.
* Numbers move ±20–30% between runs on this shared container.
