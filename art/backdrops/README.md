# Wilds backdrops — source art

One painted picture per region (1448 × 1086, 4:3), shown as the region's
scene in the Wilds:

| file | region |
| --- | --- |
| `meadow.png` | Sunlit Meadow |
| `forest.png` | Whisperwood |
| `river.png` | Willow Bank |
| `quarry.png` | Ironstone Quarry |
| `moonfen.png` | Moonfen |
| `crags.png` | Ember Crags |

The game never loads these files. `python scripts/make-backdrops.py` (needs
Pillow and NumPy) brings each one down to 256 art pixels wide by majority
vote over a 64-colour palette, so its pixels are as crisp as the plant
sprites drawn on top, and cuts it to the scene's 16:9 (256 × 144) by
dropping rows of sky above and foreground below (`CROP` in the script). It
writes `assets/backdrops/<region>.png`.

It also writes `src/rendering/backdrops-ground.js`: for each region, row by
row, the runs of ground a plant's foot may rest on. That is the region's
open ground (`GROUND`, polygons drawn over the scene), less the scenery
standing on it (`SCENERY`: trunks, the cart, the rubble) and, by colour,
less water, lava and rock (`BLOCKED`), shrunk by a pixel or two from them.
`--preview DIR` writes each backdrop enlarged with its ground tinted, to
check the map after changing a picture or a polygon.
