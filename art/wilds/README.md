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
  an object is cleared; where the sheet's white shows through a sprite (a
  willow's curtain of branches, between a ladder's rungs or a crane's beams)
  it is cleared too.
- **Background strips** are cropped clear of the sheet's captions and white
  margins and brought to 256 px wide; a strip that stands in front of
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
| Whisperwood | `backgrounds/sky_rays`, `distant_forest`, `mid_treeline`, `near_treeline`; the clearing in bands of grass | `two_ancient_oaks_composite` (mirrored on the right), `small_oak_tree`, `mossy_stones_cluster`, `sunlit_fern`, `woodland_log`; bushes, ferns, a stump, ground cover and snowdrops from `trees_bushes_flora`; sticks and a snag from `rocks_logs_forest_props` |
| Willow Bank | `backgrounds/sky`, `mountains`, `pine_treeline`; the far meadow, `terrain/chalk_bank_strip`, `terrain/water_surface`, the near shore | `second_willow_tree` and `willow_trees_bushes_002` (the curated great willow is cut off on one side), `small_willow_tree`, the plain, leafy and flowering bushes, `river_stump`; grass, pinks, buttercups, clover, a post, a sign and a branch from `riverbank_flora_props`; chalk stones |
| Ironstone Quarry | `backgrounds/quarry_sky`, `distant_cliffs`, `near_cliffs`; the pit floor in bands of dust | `crane_with_lantern_and_stone`, `quarry_support_beam`, `ladder`, `mine_cart_full`, `wooden_crate`; a scaffold, a rail fence, cut blocks, a bench and a crate from `cranes_carts_ladders`; shrubs, dry brush and loose stones from `shrubs_rocks_decorations`; a wall block and pillar, a dirt heap |
| Moonfen | `backgrounds/night_sky`, `distant_hills`, `swamp_treeline`, `mist_overlay`; dark moss ground; pools from `terrain/bog_water_tiles` | `ancient_willow_left`, `ancient_willow_center` (mirrored), `small_willow`, `dead_swamp_tree`, `drowned_stump`, `glowing_wooden_stump`, `mossy_fallen_trunk`, `ghost_crystals_and_stumps`; cattails, grass, fiddleheads, night flowers and lily pads from `plants_crystals_reeds`; `stepping_rocks` |
| Ember Crags | `backgrounds/smoky_sky`, `volcanic_ridges`, `lava_ridges`; a scorched plain with glowing cracks | the four `lava_crag_*`, `lava_pool`, `lava_vent_with_steam`, `sulfur_steam_gusher`; a rock mound, black rocks, a lava pan, dead trees, ember brush and charred posts from `lava_rock_vents_plants` |

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
