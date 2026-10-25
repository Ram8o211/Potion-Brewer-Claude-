# Sunlit Meadow — source art

The high-resolution masters for the Sunlit Meadow scene, taken from the
*Sunlit Meadow complete pack* (v4.0): the sprites the scene uses, cut from
generated concept sheets, under the pack's own file names. The game never
loads these files. `python scripts/make-meadow.py` (needs Pillow and NumPy)
reduces them to the scene's art-pixel size and packs them into
`assets/meadow/atlas.png` (about 53 KB) with its frame map
`src/rendering/meadow-atlas.js`.

## How the build changes them

Every sprite is resampled to the size it takes in the 256 × 144 scene by
majority vote over each block (nearest colour, hard alpha; never bilinear),
then snapped to one meadow palette: the 64 colours of the pack's full scene
preview, plus each sprite's own non-green colours (bark, stone, petals). Small
details lose the soft dark fringe the automated cut-outs left; lone stray
pixels take their surroundings' colour.

| In the scene | Source | Changed |
| --- | --- | --- |
| Sky | `background/sky_gradient_01` | stretched to 256 × 78 |
| Clouds (6) | `background/cloud_01, 02, 03, 05, 06, 08` | 22–46 px wide, fringe removed |
| Birds (2 wingbeats) | `background/bird_01, 03` | 6 px wide; they fly across the sky |
| Far and near mountains, firs | `background/far_mountain_strip_01`, `near_mountain_strip_01`, `treeline_strip_01` | 256 px wide |
| The fence | `environment/fences_props_atlas_01` | 112 px wide, repeated across the field |
| The great oak | `environment/oak_tree_01` | 84 px tall; trunk re-shaded with the Whisperwood bark ramp (the cut-out's trunk highlights fell into the flowers' yellow) |
| Bushes | `environment/bushes_flora_atlas_01, 03, 04, 07`, `bushes_props_atlas_02` | 26–34 px wide |
| Rocks | `environment/rocks_flora_atlas_01, 02, 03` | 30–40 px wide |
| Flower clumps (8) | `environment/flowers_flora_atlas_01, 02, 03, 08`, `flowers_props_atlas_06–09` | 10–14 px, so they never read as a gatherable |
| Grass | `environment/grass_flora_atlas_01–08` | 5–44 px |
| Glint | `../effects/glint_frame_00–03` | packed with the other wilds; the scene now draws its own sparkle on the crystals instead |

Not used: the lupin clumps (`flowers_flora_atlas_04`, `fences_props_atlas_09`)
would look like Bee Balm, and the single large flowers like Heartpetal, so
the scene's decoration stays clear of anything that resembles a gatherable;
the distant-hill strip, the other fences, mushrooms, logs and sticks did not
fit the composition.

## The six meadow ingredients

The pack names the plants as they appear in one save (`Ember Heartpetal`,
`Witch Sunthistle`, …): the first word is generated per world, so the game
binds the art to the ingredient's key (`materials/wild.js`).

| Ingredient (key) | In the scene | Out of its hour | Depleted | Icons (32 px shelf / book, 48 px card) |
| --- | --- | --- | --- | --- |
| Heartpetal (`heartpetal`) | `Ember_Heartpetal_mature_cluster` | — | `Ember_Heartpetal_harvested_remnant` | `Ember_Heartpetal_flower_icon` |
| Sunthistle (`sunthistle`) | `Witch_Sunthistle_mature_cluster` | — | `Witch_Sunthistle_harvested_remnant` | `Witch_Sunthistle_flower_icon` |
| Nettle (`nettle`) | `Moss_Nettle_mature_cluster` | — | `Moss_Nettle_harvested_remnant` | `Moss_Nettle_plant_icon` |
| Dreamclover (`dreamclover`, dawn) | `Hollow_Dreamclover_open_blossoms` | `Hollow_Dreamclover_closed_buds` | the Heartpetal remnant (the pack has none) | `Hollow_Dreamclover_flower_icon` |
| Bee Balm (`beebalm`) | `Frost_Bee_Balm_mature_cluster` | — | `Frost_Bee_Balm_harvested_remnant` | `Frost_Bee_Balm_flower_icon` |
| Hemlock Seed (`hemlock`, dusk) | `Thorn_Hemlock_Seed_opened_seed_heads` | `Thorn_Hemlock_Seed_closed_seed_pods` | the Nettle remnant (the pack has none) | `Thorn_Hemlock_Seed_seed_icon` |

The gatherables are 22–27 px tall with a dark outline; a hover frame with a
light outline is generated from each. All frames of one plant share a canvas
anchored at its foot, so states swap in place. Hemlock's near-black seed
heads are lifted off the outline colour. Icons keep their own colours (a
small flower has no pixel to spare for its yellow heart).
