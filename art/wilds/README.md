# The Wilds — source art

The masters for five Wilds scenes (Whisperwood, Willow Bank, Ironstone
Quarry, Moonfen, Ember Crags), from the *Potion Brewer corrected complete
Wilds sprite exports* pack, under the pack's own folders and file names:
only the native-size files the scenes use, plus each biome's
`SCENE_PREVIEW.png` (the source of its palette). The Sunlit Meadow has its
own pack in `../meadow/`. The game never loads these files.
`python scripts/make-wilds.py` (needs Pillow and NumPy) reduces them to the
scene's art-pixel size and packs one atlas per region into
`assets/wilds/<region>.png` with the frame map
`src/rendering/wilds-atlas.js`.

## How the build changes them

- **Resampling.** Every sprite is resampled to the size it takes in the
  256 × 144 scene by majority vote over each block (hard alpha, never
  bilinear), then snapped to its region's palette: the 64 colours of the
  biome's scene preview plus the sprite's own accent colours (bark, ore,
  petals, lava).
- **Clean-up of the automated cut-outs.** Fragments of neighbouring sheet
  cells, white bars along a cell's edge and thin rules are dropped (anything
  smaller than a few percent of the object); the pale sticker border around
  an object is cleared, before resampling and again after (khaki or pale
  pixels on the silhouette that are lighter than the sprite inside them);
  where the sheet's white shows through a sprite (a willow's curtain of
  branches, between a ladder's rungs or a crane's beams) it is cleared too.
  Lone specks of a broken outline take their surroundings' colour, and a
  gatherable loses any one-pixel-thin strand along its foot, which its
  outline would turn into a ruled line.
- **Clean pixels, as in the Sunlit Meadow.** The pack's sprites are small
  and soft (two or three source pixels to an art pixel, where the meadow's
  have six or more), so a plain block vote leaves salt-and-pepper inside
  them and breaks their thin dark outline into dots. Scenery is therefore
  smoothed first (a 3 × 3 median over its colours), and after resampling
  an inner pixel that matches at most one of its eight neighbours takes
  their common colour (the background strips get the same clean-up); then
  the broken outline is dropped and drawn whole, one pixel round the
  silhouette, each pixel a deep shade of the colour inside it (dark green
  round leaves, dark brown round bark). Ground cover keeps no outline.
- **Background strips** are cropped clear of the sheet's captions, white
  margins and side borders and brought to 256 px wide; a strip that stands in front of
  another has its sky keyed out from the top down, so the layer behind shows
  through. Moonfen's water strips are rounded into pools.
- **Gatherables** get a dark outline (so they read ahead of the scenery,
  which has none) and a generated hover frame with a light outline; all
  frames of one ingredient share a canvas anchored at its foot, so states
  swap in place. They are 16–28 px tall and at most 28 px wide (deposits
  stand about 27 px apart).
- **Icons** are lifted out of the pack's parchment frames (the parchment is
  flooded away from the frame's inner edge) and drawn at 16 px for the shelf
  and the book and 24 px for the deposit card.
- The glint over a ripe deposit is `../effects/glint_frame_00–03`.

## The scenes

| Region | Layers (back to front) | Scenery |
| --- | --- | --- |
| Whisperwood | `backgrounds/sky_rays`, `distant_forest`, `mid_treeline`, `near_treeline`; the clearing in bands of grass | `two_ancient_oaks_composite` on both sides of the frame, `small_oak_tree`, `mossy_stones_cluster`, `woodland_log`; the big fern, bushes, a fern, a stump and ground cover from `trees_bushes_flora`; sticks and a snag from `rocks_logs_forest_props` |
| Willow Bank | `backgrounds/sky`, `mountains`, `pine_treeline`; the far meadow, `terrain/chalk_bank_strip`, `terrain/water_surface`, the near shore with a ragged edge | `great_willow_tree`, `willow_trees_bushes_002` (mirrored) and `_001` (small, across the water); Whisperwood's round bush recoloured to the river's palette; grass, buttercups, a stump, a post, a sign, a branch and a pebble from `riverbank_flora_props` |
| Ironstone Quarry | `backgrounds/quarry_sky`, `distant_cliffs`, `near_cliffs`; the pit floor in bands of dust | `crane_with_lantern_and_stone` (placed so the stone on its jib never hangs over a deposit), `quarry_support_beam`, `ladder`, `mine_cart_full`, `wooden_crate`; a scaffold, a rail fence, cut blocks and a crate from `cranes_carts_ladders`; a shrub, dry tufts and loose stones from `shrubs_rocks_decorations`; a wall block and pillar, a dirt heap |
| Moonfen | `backgrounds/night_sky` (in its own colours), `distant_hills`, `swamp_treeline`, `mist_overlay`; dark moss ground; pools from `terrain/bog_water_tiles` | `ancient_willow_left`, `ancient_willow_center` (at the right edge), `small_willow`, `dead_swamp_tree`, `glowing_wooden_stump`, `ghost_crystals_and_stumps`; a drowned stump from `decorative_flora`, a fallen trunk from `swamp_trees_props`; cattails, grass, fiddleheads, night flowers and lily pads from `plants_crystals_reeds`; `stepping_rocks` |
| Ember Crags | `backgrounds/smoky_sky`, `volcanic_ridges`, `lava_ridges`; a scorched plain with a winding stream of lava | four crags, a lava pool and a rock mound from `lava_rock_vents_plants`, `lava_vent_with_steam`, `sulfur_steam_gusher` (their painted plumes cleared: the scene animates the smoke); black rocks, a lava pan, a dead bush and ember brush from `lava_rock_vents_plants` |

The scenes are laid out as the Sunlit Meadow is: the large scenery stands
along the back of the ground, at the sides (at the trees' feet) and in the
near corners, partly cut off by the frame; in Moonfen the drowned and
ghostly stumps and the cattails stand in the pools, and in the Crags the
stream of lava runs into the pool at the bottom of the frame. Only ground
cover too small to keep a plant away (under 150 art pixels: grass, leaves,
pebbles, tufts) is scattered over the open ground, which is left to the
deposits.

Several of the pack's `CURATED_COMPLETE_OBJECTS` are cut off along their
right side (the lava crags and pool, the Willow Bank bushes, stumps and two
willows, Moonfen's drowned stump and fallen trunk, the sunlit fern); a whole
copy of the same object from the sheet's other export stands in, and the
oak pair and Moonfen's centre willow, whose cut edge is slight, stand with it
off the frame.

Not used as scenery: anything that looks like one of the region's
gatherables (bellflowers, toadstools and berry bushes in Whisperwood;
cattails, mushrooms, mossy logs and white bog flowers at Willow Bank; ore and
crystal heaps in the quarry; violet reeds and crystals, lilies and teal
crystals in Moonfen; the obsidian crystal bush in the Crags), so only
deposits read as something to gather.

## The ingredients

Each ingredient's art is `gatherables/<key>/` of its biome, bound by its key
(`materials/wild.js`): `mature` is the deposit, `harvested` its depleted
frame, `closed` (where there is one) its closed frame out of its hour, and
`icon` its icon. The pack's own hover art is not used; the hover frame is
generated, the same for every region.

| Region | Ingredients |
| --- | --- |
| Whisperwood | `ironroot`, `silverleaf`, `nightshade` (dusk: `closed`), `owlberry`, `emberbark`, `witchear`, `mandrake` |
| Willow Bank | `riverchalk`, `frostcap`, `bogbean`, `willowbark`, `reedmace`, `riverpearl` |
| Ironstone Quarry | `emberflint`, `mica`, `saltpetre`, `sulfur`, `lodestone`, `cinnabar`, `stormglass` |
| Moonfen | `gravemoss` (dusk: `closed`), `starquartz`, `wisplichen`, `moonlily` (dawn), `toadstool`, `sirenreed` (dusk: `closed`) |
| Ember Crags | `dragonpepper`, `cinderscale`, `ashbloom`, `obsidian` |

The Moonlily's `mature` file is its closed bud ("Closed (dawn)" on the
sheet) and its `hover` file the open bloom, so the scene shows the bloom as
the deposit and the bud out of its hour.
