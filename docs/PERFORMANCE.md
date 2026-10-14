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
2.2 L (440) and 3 L (600); typical orders are 16–40 particles of potion
from a 100–250 ml brew. A 60 fps frame needs two steps. *Assay* is what
the HUD pays to measure the bottle (tap selection, colour, magic), done
about twice a second.

| Scenario | Vessel | Particles | ms / step | ms / 60 fps frame | assay ms |
|---|---|---|---|---|---|
| tonic (water + essence) | pot | 60 | 0.11 | 0.22 | 0.16 |
| typical brew | pot | 150 | 0.28 | 0.56 | 0.09 |
| stirred infusion with powder | pot | 200 | 0.34 | 0.68 | 0.12 |
| full pot | pot | 293 | 0.49 | 0.99 | 0.25 |
| full copper cauldron | copper | 413 | 0.66 | 1.32 | 0.13 |
| three liquid layers | grand | 546 | 1.30 | 2.59 | 0.13 |
| boiling under the lid | grand | 400 | 0.45 | 0.90 | 0.01 |
| water (reference vessels) | small / medium / large | 300 / 900 / 1,400 | 0.49 / 1.60 / 2.88 | 0.99 / 3.21 / 5.76 | — |
| three liquid layers | medium | 900 | 1.98 | 3.96 | 0.19 |
| sand pile | medium | 600 | 0.68 | 1.37 | 0.11 |
| dough, stirred | medium | 600 | 1.25 | 2.49 | 0.18 |
| frozen block | medium | 500 | 0.94 | 1.88 | 0.06 |

Typical shop brews cost 0.2–1.0 ms of physics per 60 fps frame. The
homunculus brews a complete request (about 38 simulated seconds) in
0.26–0.54 s of wall time.

### What the magic systems cost

* **Magic** (`simulation/magic.js`) runs every second step: one pass over
  the particles that updates steeping, fading and transmutation from
  per-particle thresholds. The thresholds are derived values, refreshed
  with a particle's other derived properties (when its composition
  changes, and in the rolling ~10 Hz refresh), not in the magic pass.
* **Magic state in diffusion.** The exchange of vigour, transmuted share
  and steeping rides on the existing contact pairs, a few multiply-adds
  per exchanging pair. Pairs whose composition *and* magic state are
  equal are skipped as before.
* **Heat-assisted miscibility** is one multiply per pair, at the pair's
  mean temperature.
* **A potion's magic** is computed only when something is measured (the
  assay above, a test dose, the bottle), never per frame.
* **The garden** costs nothing while brewing: beds resolve their growth
  lazily from timestamps when shown or touched. **The creatures**
  are drawn on five small 64×72 canvases, and only while the Testing room
  is open.
* **The simulation is drawn only in the Brew room.** It keeps stepping
  elsewhere, so a fire left burning keeps burning, but the other rooms
  render their own lightweight scenes.

Against the previous release's recorded numbers (`perf-results.json`
before this change, on a faster 2.8 GHz host), every physics scenario is
as fast or faster here. A full pot went from 0.81 to 0.49 ms/step, and
three layers in the grand vessel from 1.78 to 1.30 ms/step. The magic
systems did not slow the solver. The same comparison in the browser is
below.

## 2. Frame timing in the browser

The Free Experiment cauldron (3 L) is filled with water, dew and witch oil,
with auto-stir and gentle heat. The game's own instrumentation is then
read over 6 s (8 s throttled).

* **Frame p50 / p95 / p99:** intervals between frames, in ms.
* **Work:** median time inside the frame callback.
* **Physics / render:** smoothed ms per frame.
* **Sim speed:** simulated seconds per wall second (1.00 = real time).

| Profile | Preset | Particles | fps | Frame p50 / p95 / p99 | Work p50 | Physics | Render | Sim speed | Quality used |
|---|---|---|---|---|---|---|---|---|---|
| desktop 1440×900 | auto | 60 | 60 | 16.7 / 16.7 / 16.8 | 2.5 | 0.4 | 3.9 | 1.00 | high |
| desktop 1440×900 | auto | 150 | 60 | 16.7 / 16.7 / 16.8 | 2.8 | 1.1 | 3.5 | 1.00 | high |
| desktop 1440×900 | auto | 300 | 59 | 16.7 / 16.8 / 33.2 | 5.2 | 2.1 | 4.7 | 1.00 | high |
| desktop 1440×900 | auto | 600 | 58 | 16.7 / 16.8 / 33.3 | 8.5 | 5.3 | 6.8 | 0.99 | high |
| phone ÷4 | auto | 60 | 52 | 16.7 / 33.4 / 50.0 | 7.1 | 1.2 | 5.3 | 0.99 | medium |
| phone ÷4 | auto | 150 | 51 | 16.7 / 33.4 / 66.7 | 10.6 | 3.9 | 6.8 | 0.97 | medium |
| phone ÷4 | auto | 300 | 48 | 16.7 / 33.4 / 83.3 | 13.8 | 9.1 | 6.1 | 0.94 | medium |
| phone ÷4 | auto | 600 | 36 | 33.3 / 33.4 / 50.0 | 23.4 | 18.0 | 7.5 | 0.63 | low |

**Reading it**

* **Desktop** holds 58–60 fps in real time at every size, including the
  full 3 L vessel (600 particles) at High quality.
* **Phone ÷4.** Typical brews (60–150 particles) run at 51–52 fps in
  (near) real time, and a full pot (300 particles) at 48 fps at 0.94×
  speed. At 600 particles Automatic drops to Battery saver (30 fps cap)
  and the brew runs at 0.63×. The frame loop gives physics only what is
  left of a ~30 fps frame after rendering (8–22 ms), so a slow device
  keeps responding to input and runs the brew in slow motion instead of
  stuttering.
* **Against the previous release** (same profiles, its own recorded
  run): the throttled phone went from 50 / 41 / 30 / 29 fps to
  52 / 51 / 48 / 36 fps at 60 / 150 / 300 / 600 particles. Its simulation
  speed went from 0.65× to 0.94× at 300 particles, and from 0.24× to
  0.63× at 600. Desktop at 600 particles went from 54 to 58 fps. Part of
  this is run-to-run noise on a shared host (±20–30%), but nothing got
  slower.

## 3. Graphics presets

Settings → Graphics. Physics, quantities and magic are identical in every
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
| High quality | 28 | 33.3 / 66.6 / 83.4 | 22.5 | 6.5 | 0.65 |
| Balanced | 53 | 16.7 / 33.3 / 49.9 | 5.9 | 8.3 | 0.98 |
| Battery saver | 29 | 33.3 / 33.4 / 50.0 | 6.5 | 15.3 | 0.96 |

Balanced costs about a quarter of High's render time while keeping the
lighting. Battery saver's advantage is the 30 fps cap: it draws half as
many frames, which is where the battery saving comes from, at the same
simulation speed.

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
  3.39 → 3.75 → 3.78 → 3.79 MB at 0 / 30 / 60 / 90 s. Flat, with all 450
  particles still in the vessel.
* **Ten round trips between the main menu and the shop:** 3.58 MB after
  the first, 3.94 MB after the tenth.

Particle storage is typed arrays allocated once per cauldron (the three
magic-state arrays included), and the renderer's buffers grow only when
the drawn region does.

## 6. Limitations

* No physical-device measurements; the phone profile is throttled
  emulation in software rendering.
* With large batches on a slow device the simulation runs in slow motion
  (0.63× at 600 particles on the throttled profile). A full 1.5 L pot runs
  at 0.94×.
* Numbers move ±20–30% between runs on this shared container.
