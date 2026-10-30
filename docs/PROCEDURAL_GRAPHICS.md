# Procedural wilds and ingredient graphics

This report describes the replacement of the fixed, image-based wilds and
ingredient art with one deterministic procedural pipeline: what was built,
how it fits together, how it was verified, what it costs, and what is
still limited.

## What changed for the player

* **Every world looks different.** The seven regions are generated from the
  world seed: the lie of the ground, its ledges and caves, palette
  variation and seed-chosen features (autumn woods, a meadow pond, standing
  stones or beehives, a footbridge over the river, the oaks, the vents…).
  The regions keep their identity: the open, warm Sunlit Meadow;
  Whisperwood's rows of trunks, closed canopy, roots and light shafts,
  always in the open air; the Netherwood, its cavern twin below, with
  roots hanging through the roof, giant mushrooms and violet glowing fungi;
  Willow Bank's river between chalky banks, reeds and weeping willows;
  Ironstone Quarry's benches cut in steps, strata and mineral seams, adit,
  crane, ladder, cart and lantern; Moonfen's black pools, moss-hung
  willows, glowing crystals and mist; the Ember Crags' smoking cone, lava
  pool, basalt columns and vents.
* **Open air or cavern.** Each region is a side view with no
  perspective, and each world decides whether it lies under the open sky
  or in a cavern (the meadow mostly open, the rest about even). Open, it
  has a smooth sky, clouds and far silhouettes (mountains, a dark wood,
  far cliffs, a smoking cone, a treeline against the stars); the wood
  has a canopy closing over it and rows of trees fading into the mist. In
  a cavern (`env/cave.js`), a dark back wall with rows of far pillars and
  mist, and the cave's frame: a roof of darker cobbled rock with a mossy
  lip, stalactites (glowing at their tips in the Ember Crags) and
  curtains of vines, and side walls — in the meadow and Moonfen a cave
  mouth or a rent in the roof showing the sky. Moonfen has ruined
  columns and arches either way.
* **The ground** is a cross-section: cobbled stone (rounded stones of a
  few colours in a dark mortar, lit on their upper left, speckled; darker
  down each pillar and deeper in the ground) under a crust of grass,
  moss, gravel or ash, with ledges in two tiers, overhangs and cave
  pockets. No ledge floats: each is a mushroom cap on a near-upright
  pillar reaching down to the ground or a ledge below, joined to them as
  one mass, moss running down its sides and hanging from its underside.
* **Pools seep into the ground.** Water and lava lie in the hollows, their
  bodies darkening smoothly with depth, and filter into the rock rather
  than lying on it: the bed's stones are stained toward the pool's deep
  colour and the cracks between them brim with the fluid, fading out
  through the ground; and a few winding seams leave the bed, wandering out
  and down, along which the fluid fills the mortar and crevices between the
  stones (found as the pixels darker than the rock round them) while the
  stones themselves are only darkened. The seams are thin and break up as
  they go: every crack round the pool glows, farther out only isolated
  pockets between the stones. Lava
  seams (about five) glow and light the rock round them; water seams shine
  faintly and wet it. In the Ember
  Crags lava also pours in falls from the roof and the ledges.
* **Light.** Skies, fog and every light fall off smoothly (no bands): the
  sun, the moon, mushrooms glowing cyan, ember-orange or cold white,
  torches and a lantern, lava, crystals, shafts through the leaves —
  added last, so they light the scenery too — with a vignette that is
  strong in caves and light in the open. At run time: drops from the
  stalactites, running falls, flickering torches, breathing mushrooms,
  pollen, motes, leaves, fireflies, wisps, trickling grit, shimmering
  water, lava bubbles, embers, ash and steam.
* **Trees, after a branch concept** (`objects.js` `branchTree`): a
  sinuous trunk, branches forking off it on alternating sides, rising and
  tapering, a long one forking again, and a foliage pad at every tip and
  at the top — a cloud of leaves wider than tall, a dark mass under
  rounded bumps lit from the upper left, moss dripping from its
  underside. Three habits: tall (a column of short branches), spread (a
  short trunk, long reaching branches) and lean (an S-curved trunk).
* **Two kinds of trees** (`env/trees.js`). Background trees stand in rows
  behind the terrain, all of one habit and nearly one size, faded into
  the distance: a homogeneous wood. Terrain trees grow on the terrain, in
  its plane: each takes a dry spot on the ground or a ledge's top and a
  height that fits there — shrinking until it does, or giving the spot up
  — so that none of it overlaps the terrain above its foot, the cave's
  rock, a liquid, a prop or another tree. Whisperwood grows up to eight, of every
  habit and height; the other regions a few (willows by the water, dead
  trees in the bog and the crags).
* **Leaf clusters** (`env/foliage.js`). Foliage follows the pixel
  artist's recipe: a few simple leaf shapes, each turned, scaled, its
  outline nudged pixel by pixel and sometimes cropped; coloured with a
  little jitter from two of the region's leaf ramps; laid at slightly
  different offsets into clusters (a dark mass in shade, the leaves lit
  from the upper left, lit flecks, loose leaves at the fringe, the
  region's blossoms). Pads and crowns are built of clusters, and the
  gnarled trees (`grove`) put them at the tips of a twisted trunk's
  branches in five styles: dome, tiers, weeping willow, wisteria and
  sparse. Each region has its own look: Whisperwood dark green hung with
  moss, the Meadow bright with yellow blossom, Willow Bank muted with a
  weeping willow, Moonfen cold blue-green with pink wisteria, the Crags
  olive flecked with orange, the Quarry sparse and dusty, the Netherwood
  teal with violet specks.
* **Leaves swaying in the wind** (`swayPixels` in
  `rendering/wild-scene.js`). Every foliage part carries its sway (a
  cluster moves as one, higher ones more; a hanging strand — moss,
  frond, vine, blossom — bends further toward its end). While stamping,
  the canvas keeps the swaying pixels apart from a *bare* painting (what
  lies behind them; inside a crown, its shade) and the stamp that last
  painted each pixel, so a leaf only moves over what was painted before
  it. Each frame (12 a second) the wind — a breeze slowly rising,
  falling and turning, waves running through the leaves and gusts of
  random strength sweeping across — shifts every group sideways. Open-air
  regions blow hardest; caverns only stir in their draughts. With no wind
  the frame is the painting exactly.
* **Scenery set down where it fits** (`Canvas.place` in `env/paint.js`).
  Logs, stumps, ferns, fences, hives, standing stones, boulders, reeds,
  the quarry's timberwork, cairns, crystals, basalt columns, vents and
  giant mushrooms are each rasterized once and tried at spots stepping
  outward from where they were meant to go. A spot fits when nothing of
  the piece runs into the terrain above its foot, the cave's rock, a
  liquid, a tree or another piece, and the ground under its whole base is
  solid (resting on the highest ground under it, never bridging a hollow
  or overhanging an edge); where nothing fits it is left out. Pieces drawn
  pixel by pixel (glowing mushrooms, torches) claim their room the same
  way. Ledges are sparser — three quarters as many, half as many above
  them, spread along the dry ground between pools — and keep clear of each
  other, with room to grow between one and the next above it.
* **Ingredients grow where they are found** (`visual/growth.js`). A
  plant is no longer a fixed picture: it is built the way a pixel artist
  builds one — a base structure (a stem, trunk or strand walking from its
  hold with jitter, curling, drooping under its own weight), branches
  forking off by chance, then the elements along it and at its tips
  (leaves of five outlines, petals, thistle brushes, florets, nodding
  bells, buds, berries in bunches, pods, peppers, umbels of seed heads,
  mushroom caps over their gills, zoned shelves, moss tufts, cattail
  heads, curls of bark with beads of resin). Each species draws its
  variation parameters — height, stems, branch chance and angle, leaf and
  petal type, droopiness, symmetry, cluster sizes, cap shape, crystal fan
  — from its morphology stream and the clues of its effects; each plant
  is one of four variants of it (chosen by its id), so a stand is never a
  row of copies. Inorganic finds follow build rules of their own: a
  crystal grows spikes from a knot of host rock into a fanned cluster, a
  shard juts with a skewed point, a fiery stone fractures into dark chunks
  with embers glowing in their cracks, chalk erodes into a pitted stack, a
  crust blooms into needles, a powder lies in a glittering heap, a nugget
  sits in its matrix of rock, mussels lie half-sunk with one open on its
  pearl, scales overlap like shingles in the ash.
* **…and are attached to the world.** Every form is found on its own
  mounts, weighted (`MOUNTS`). Only vines hang: owlberries and bogbeans
  trail from the boughs, the canopy, the ledges and the cave's roof as
  long vines with leaves along them and round fruit on short threads;
  nightshade and silverleaf as leafy vines hung with globes; moss as
  trailing strands. Roots, flowers, mushrooms, stones and crystals never
  hang. Shelf fungus and the barks grow on tree trunks, moss, crystals,
  flints, crusts and nuggets sit on cliff faces (faces of the ground
  itself, not the backdrop's far columns). The scene is searched for
  holds (`wild-scene.js` `findAnchors`): the undersides of branches,
  leaves, ledges and the roof (*hang*), the sides of sheer ground (*wall*)
  and of narrow upright runs of wood that carry on down (*trunk*), each
  with air before it. A plant tries the mount its id picks first, then
  the others, at the hold nearest where it came up with room for its
  whole silhouette (clear of the rock, water, props and other plants);
  only a plant that is found nowhere with room crowds the ground. A vine
  swings about its hold in the wind, bending rather than sliding (each row
  moved further the lower it hangs). Only what grew on the ground leaves
  turned earth when it is harvested.
* **Proportions.** Living plants stand knee-high to the trees, about a
  tenth of the scene (a flower 15 px of its 216, a herb 12, a reed 19,
  a mushroom 11), stones and crystals a hand across (`BASE_H`).
* **Lit by their surroundings.** Each plant is lit by the painting where
  it stands (`PlantGround.lightAt`): the average brightness of the scene
  round its silhouette against the region's own gives how dim or bright it
  is, a third of the surroundings' colour is mixed in (warm in the lava's
  glow, cold in the fen, golden in the sun), quantized so a stand shares a
  few tints. It is a step darker within two pixels of what holds it (its
  foot in the soil, the point it hangs from, the side against a face), and
  a plant on the ground casts a shadow to its right (the light comes from
  the upper left like the painting's), tinted by the region.
* **Glowing plants** (`growthParams` `glow`): every mushroom (gills, rim
  and spots), every berry (a core in each fruit, on hanging vines too),
  the lichens of the dark regions, the arcane and the luminous, a share of
  the dark regions' other plants, and a few more. Their glowing pixels are
  painted in a colour the lighting leaves alone and each lights its
  surroundings with a breathing halo (`Sketch.emit`, `wilds.js` `GLOW_IN`):
  strongest in the Netherwood and Moonfen, faint in the open meadow. A
  flower out of its hour does not glow.
* **Ingredients glow slightly.** In the wilds each plant keeps its own
  size and look, with a faint breathing glow of its own colour about it
  (`species-sprites.js` `plantGlow`), so it reads in the scene without
  standing out of it.
* **Every ingredient has its own look in each world**, derived from its
  family, habitat, colour, rarity and alchemy. The same species is drawn
  from one descriptor where it grows (sprout, ripe, mature, and closed out
  of its hour, on each of its mounts), as its icon (shelf, shop, book, recipes, deposit card,
  inspector) and as its four pieces in the cauldron, whose colours also dye
  the brew and its powder.
* **A simple, Noita-like pixel style, one for everything.** Ingredients
  (on the ground, as icons and as cauldron pieces), trees, rocks,
  timberwork and the distant silhouettes are all painted as a *material*,
  the way the ground is: a flat body colour (and a shadow where a form
  turns from the light; a light tone only for real highlights such as a
  crystal facet), broad blotches a step lighter, a few grains, a bright
  crust along edges open to the sky and dark rims along the others — no
  dithering, no gradients. The background is the same material, fainter.
  Skies are hard-edged bands and light falls off in hard steps.
  Ingredients are ringed in a near-black outline, so they read at a
  glance against the ground and look like their icon.
* **Pixels.** The scenery is drawn at the scene's own pixel (`paint.js`
  `CELL` = 1), so its stones, vines and moss are fine-grained; tree crowns
  are heaps of leafy clumps. Ingredients keep their coarser texture
  (`raster.js` `GRAIN`) and squircle shapes (`geometry.js` `SQUARE`).
* **Stones, crystals and shells do not grow.** Only living plants pass
  through sprout, ripe and mature. An inorganic deposit has one picture:
  once it has formed again it simply lies there whole (until then nothing
  shows at its spot), and its card counts how many are *found* and when the
  next one *turns up*.
* **Watering matters.** Living plants grow with the moisture of their soil;
  the Wilds have a *Tap to: Harvest | Water* control, a *Water* button on
  each living stand's card, damp-earth and thirsty-plant feedback, drops
  and splashes, and a soil line on each card. Rain soaks the plants.
  Minerals, crystals and shells come back with time and the weather.

## Architecture

```
src/visual/                     pure, DOM-free, deterministic
  noise.js        hashing, value noise, fBm, ordered dither
  color.js        OKLCh, shading ramps (cool shadows, warm lights), packing
  pixels.js       RGBA pixel buffer (Node and browser paint the same pixels)
  geometry.js     Model: ordered parts (filled outlines, tapering strokes,
                  1-px lines, dots) + shape helpers (blades, lumps, Béziers)
  raster.js       pixel-art rasterizer: scanline fill, round/fold/facet/
                  cylinder shading painted as a material (tones, blotches,
                  grains, sky-lit crust, rims), occlusion lines
  style.js        the house style: material tones, the outline ink and the
                  ink ring round plants and icons
  taxonomy.js     shape → family, botanical families, habitat traits, effect tints
  identity.js     the visual identity record (versioned, portable)
  descriptor.js   identity → canonical descriptor (traits, palette, morphology)
  families/       one construction grammar per family: flower, herb, root,
                  fungus, moss, fruit, reed, bark, crystal, mineral, shell —
                  each exports params, size, icon, piece(v)
  growth.js       the plant in the wilds, grown procedurally on its mount
                  (ground, hanging, a rock face, a trunk) in four variants
  render.js       descriptor → plant frames, icon, piece + silhouette grid
  pieces.js       the cauldron's piece atlas (skin layout unchanged)
  env/            the six region composers on a shared kit (paint.js:
                  canvas — pixels, ground, liquid, cave, open-ground and
                  scenery depth maps — banded sky, stepped light;
                  side.js: the side view's ground line, hollows, mounds,
                  ledges, caves, mottled terrain painting, pools, flat
                  silhouettes, glows; cave.js: the cavern — back wall,
                  far pillars, ruins, mist, roof, stalactites, walls,
                  vines, moss, glowing mushrooms, torches, falls, veins
                  seeping from pools, the vignette and lights; stone.js: the cobbled stone;
                  objects.js: branch trees and foliage pads, pines,
                  foliage.js: leaf clusters, hanging strands, gnarled trees,
                  shrubs, rocks, reeds, ferns, logs, clouds, crane, cart,
                  scaffolds, wheel…; trees.js: background rows and
                  terrain trees fitted to the terrain; scene.js: cache)
src/rendering/
  species-sprites.js   cached plant/icon frames and canvases, silhouettes,
                       ingredientSprite (every list's picture)
  wild-scene.js        scene canvas cache, holds (findAnchors), PlantGround
                       placement on every mount, hit testing,
                       per-frame animation (drips, falls, torches, birds,
                       motes, glints, wisps, embers, steam)
src/game/gathering.js  moisture-driven growth, watering, migration
src/ui/views/wilds.js  scene, harvesting, watering, feedback
```

Module boundaries follow the brief: world generation (`visual/env`),
taxonomy (`taxonomy.js`), visual descriptor (`identity.js`,
`descriptor.js`), procedural geometry (`geometry.js`, `families/`),
pixel-art rasterization (`raster.js`, `render.js`), sprite caching
(`rendering/species-sprites.js`, `rendering/wild-scene.js`), growth
simulation (`game/gathering.js`) and UI (`ui/views/wilds.js`).

### Identity and descriptor

A wild material carries `vis`, its visual identity: schema version, species
key, family shape, habitat, world of origin, a dedicated variation seed,
rarity, base colour, rounded effects, arcane threshold and glow. It is
written by `generateWild` for new worlds and by `attachVisuals` (from
`addAlchemy`) for saves made before this change — exactly the identity a
fresh world of that seed gets; an identity already present is never
rewritten, so a future generator can add new looks for new records
(`VISUAL_SCHEMA`) without changing ingredients players already own.

`describe(identity)` is pure and cached. Separate streams drawn from the
variation seed drive morphology, palette and surface detail, so refining
one never moves another (the test *colour never moves the morphology*
checks this). `encodeIdentity` / `decodeIdentity` give a compact portable
code (~250 characters) from which another device rebuilds the same pixels
(tested); it is a description, not proof of ownership.

### Alchemical clues

Traits are read from the material's own effects (never invented):
strength thickens stems, roots and crystals; transformation adds asymmetry
and iridescent sheens; frost pales and sharpens; fire warms edges and
lends ember glints and resin; death desaturates and draws dark veins and
droop; toxicity yellows foliage and adds warning spots; acidity blotches;
alkalinity rounds and chalks minerals; arcana and natural glow add violet
or cold glimmer spots that sparkle in the scene; love rounds and blushes
petals; vitality makes foliage lush. The strongest side effect tints the
species' accent ramp. Effects are clues only; no number is shown.

### Growth and moisture

Living plants keep a checkpoint (growth `g`, soil moisture `w`, time `t`).
Moisture decays exponentially toward the habitat's level (`base`) with a
habitat retention time (`tau`: a bog 8 h, a riverbank 6 h, the crags 1 h);
rain and storm days raise the level, fog a little, a heatwave lowers it and
dries soil faster; frost slows growth. Growth rate is
`k / growMs × (0.2 + 1.3 × clamp((w − lo)/(hi − lo)))`, with `lo`/`hi`
from the species' thirst (mosses, reeds and fungi thirstiest, crag plants
hardy). The integral is evaluated in closed form, so resolving at any
moments in any order gives the same result; a clock set back never grows
or shrinks a plant. Watering adds 0.5 moisture (capped at 1): at most half
again the usual pace, never an instant harvest. A rainy night soaks every
living plant, grows it on by half and brings empty slots up half-grown;
each new day still brings every plant on by half its time. Saves from
before (gathering v1) are migrated: each plant keeps exactly the growth its
age gave it. Minerals, crystals, crusts and shells keep the time-based
regrowth and the storm recharge.

### Pieces in the cauldron

`visual/pieces.js` paints each species' four pieces into the same atlas
layout as before (36 species × 4 cells of 40 px, 20 × 20 silhouette
grids), so skin ids saved in cauldrons stay valid and the physics fits its
particles to the silhouettes as before (`materials/shapes.js` is unchanged
apart from where masks come from). The species shown is registered when a
material is poured or found in the brew; stones are kept round so pebbles
still roll. Fragments, powders, dissolved matter and frozen bodies are
rendered as before from these pixels.

## Removed

Static backdrops, region and meadow atlases, the growth atlas, the
ingredient icon sheet and the poured-piece atlas (`assets/backdrops`,
`assets/wilds`, `assets/meadow`, `assets/growth`, `assets/icons/ingredients.png`,
`assets/icons/pieces.png`), their generated frame tables
(`rendering/wilds-atlas.js`, `meadow-atlas.js`, `growth-atlas.js`,
`ingredient-icons.js`, `backdrops-ground.js`, `materials/pieces.js`), the
loaders (`rendering/wild-sprites.js`, `regions.js`, `pieces-art.js`), the
image generators (`scripts/make-wilds.py`, `make-meadow.py`,
`make-growth.py`, `make-backdrops.py`, `make-ingredient-icons.py`,
`make-ingredient-pieces.py`, `pixelart.py`) and their source art
(`art/wilds`, `art/backdrops`, `art/growth`, `art/meadow`, `art/icons`,
`art/effects`). The procedural sprites of wild shapes in `rendering/scenes.js`
went too; it keeps only the rabbits' remains. Shipped assets went from
1.2 MB to 76 KB; source art from 31 MB to 1.4 MB. The hutch art, app icons,
font, interface and effects are untouched.

## Verification

* `tests/procedural.test.mjs`: identities on every wild ingredient, their
  migration and portability; identical pixels for the same world, different
  pixels for every species in another world; distinct icons, plants and
  pieces within a world; each family's grammar (three growing, distinct
  stages; a full icon; four solid pieces); one ingredient's colours shared
  by its plant, icon and pieces and its pieces dyeing like its icon;
  palette-only changes never moving the morphology; the six environments
  deterministic, varying per world, fully painted, open ground only on dry
  surfaces with room to grow and nothing growing in the river or the lava;
  placement on each species' own mounts (open ground; a vine from a bough
  or a roof; a rock face, a trunk — each checked against what holds it), never behind
  scenery nor into the ground or the water, hardly touching; hit testing
  of the front plant.
* `tests/gathering.test.mjs`: watering raises moisture and speeds growth;
  dry soil slows but never stops it; capped acceleration; no instant
  maturity; drying back; checkpoints compose exactly; no growth from a
  clock set back; save/load of checkpoints; habitats' wetness and
  retention, rain and heat; minerals neither drink nor need to; a v1 save's
  plants keep their growth; rain soaks and the new day grows.
* `tests/solids.test.mjs`, `tests/render.test.mjs`: pieces fitted with the
  right particle counts, all four used, preserved by snapshots; brews dyed
  by their pieces.
* Browser: `tests/browser/rooms.spec.mjs` harvests by tapping procedural
  plants, checks that scenery takes no taps, waters by tapping and by the
  card's button; the rest of the browser suite exercises brewing, crushing,
  bottling, recipes, trials, the shop and saves with the new pictures.
* Screenshots: `docs/screenshots/procedural/` (see below).

## Performance

Measured numbers are listed in the section *Measured* at the end of this
file.

Generation happens outside the animation loop: a region's scene is
composed once per world and cached as a canvas (the last six); species
frames, icons and pieces are rasterized once and cached (LRU of 500
frames). While the Wilds room is open and the player has paused for
1.5 s, the other regions they can travel to and their species are
pre-generated, one per idle callback — never during input and never in
another room (an earlier version pre-generated at game start and was
caught by the browser tests delaying a drag in the Trials room), so
travelling between regions normally only draws cached canvases. Per frame the view draws the
cached scene, its plants' cached canvases and a few dozen animated pixels.
The rasterizer fills polygons by scanline spans and strokes segment by
segment, with reused scratch buffers.

## Limitations

* Generation is synchronous on the main thread. The first region shown in
  a session is generated when the Wilds room opens (tens to a couple of
  hundred milliseconds on desktop, several times that on a slow phone);
  the others are pre-generated during pauses in that room. Moving
  generation into a Web Worker would remove the remaining one-off hitch,
  but the build's single-entry bundler would need a second bundle for it.
* The environments are composed from a fixed repertoire per region (with
  seed-chosen features and palettes); they vary clearly between worlds but
  do not invent new kinds of landmark.
* Morphology grammars cover the existing 36 ingredients' shapes. A new
  shape needs a family mapping (`taxonomy.js`), and a genuinely new form of
  life a new family module.
* The plant on the ground is drawn at the scene's pixel size (384 × 216);
  on a narrow phone it is shown at about one CSS pixel per art pixel, so
  the finest details read best on larger screens.
* The portable identity is ready for trading but nothing sends or receives
  it yet; ownership and authenticity are out of scope.

## Measured

Chromium (desktop, this development container), from the in-game probe
(`composeScene` and the species renderer imported in the running page;
"cold" is each region's first composition in the session):

| region | first (ms) | again, another seed (ms) |
| --- | ---: | ---: |
| Sunlit Meadow | 335 | 165 |
| Whisperwood | 310 | 205 |
| Willow Bank | 192 | 141 |
| Ironstone Quarry | 76 | 71 |
| Moonfen | 205 | 168 |
| Ember Crags | 47 | 41 |

* All 36 species of a new world — three growth stages, icon and four
  pieces each (288 rasters): **99 ms** in total, once per world.
* One frame of the Wilds view (Whisperwood, its plants, the animated
  overlay, weather): **0.17 ms** — it draws only cached canvases.
* Node 22 (no warm-up): 50–350 ms per region the first time, 40–250 ms
  after; the test bounds every region at 4 s. The terrain trees cost the
  most: each is rasterized again at every size tried until it fits.
* Shipped assets: 1.2 MB → 76 KB (the wilds' and ingredients' PNG atlases
  are gone); source art in the repository: 31 MB → 1.4 MB.

On a mid-range phone expect roughly three to five times these generation
times; they are paid once per region and world, when a region is first
shown or during a pause in the Wilds room, never inside the animation
loop.

## Screenshots

`docs/screenshots/procedural/`:

* `env/<region>-<seed>.png` — all six environments for two worlds
  (`amber-hollow`, `7-ravens`), 2× art pixels, from `scripts/scenes.mjs`.
* `species-<seed>.png` — every species of those worlds, one row each:
  sprout, ripe, mature, three more variants, the mature plant on each of
  its other mounts (hanging from the top of its cell, on a wall from its
  left side), closed (dawn/dusk plants), icon, four pieces, from
  `scripts/gallery.mjs`.
* `placement/wilds-<region>-<seed>.png` — every region of those worlds
  with fuller stands placed as the game places them, every plant grown,
  from `scripts/wilds.mjs`.
* `game-<seed>-<region>.png` — each region's scene in the running game,
  with its plants, for both worlds.
* `desktop-wilds-<region>.png`, `phone-portrait-wilds-meadow.png`,
  `phone-portrait-wilds-moonfen.png`, `phone-landscape-wilds-river.png`,
  `tablet-wilds-crags.png` — the Wilds room on each layout.
* `desktop-watering-before.png`, `desktop-watering.png`,
  `desktop-watering-after.png` — watering a stand of sprouts: drops,
  splash, damp earth, the soil line and thirsty count on the card.
* `desktop-shelf.png`, `phone-portrait-brew-shelf.png`,
  `desktop-book-ingredients.png` — the same icons on the shelf and in the
  book.
* `desktop-cauldron-pieces.png` — six species' pieces in the cauldron.
