# Rabbits Atlas — source art

`rabbits_atlas.png` is the *Rabbits Atlas* sheet: along the top the base
rabbits (spotted, Dutch, white, ginger), the idle and hop cycles (four frames
each) and the dead rabbit; below them one row per effect — strength, venom,
love, transformation, acid and fire — with two frames for each level 0–3 and
a death frame. The game never loads this file.
`python scripts/make-rabbits.py` (needs Pillow and NumPy) cuts it into
`assets/rabbits/atlas.png` with the frame map in
`src/rendering/rabbit-atlas.js`.

## How the build changes it

- Each slot's dark backdrop is flooded in from its edge and cleared; the
  rabbits' near-black outline stops the flood. The dim fringe of a glow (the
  glow mixed into the dark backdrop) goes with it, so an aura keeps only its
  bright core and does not muddy a light page. The grass tuft under the feet
  is dropped (the game draws its own straw).
- Every frame is brought down by one factor (`SCALE`, a grown rabbit about
  26 px from ear tip to toe; kits at two thirds) by majority vote on a fixed
  48 × 34 window whose bottom row is the feet and whose centre column is the
  body's, so frames swap in place in the 48 × 40 rabbit frame. The top cells
  draw their rabbits at other sizes than the effect rows; `CELL_SIZE`
  evens them out.
- The coat's pixels are marked in the alpha channel (254 the white fur, 253
  the brown spots; only the regions that meet the ink outline, so an aura's
  pale glints are left alone), and the coat is closed with a 1 px ink outline
  where the soft source left it open. At run time
  `src/rendering/rabbit-sprites.js` repaints those pixels in each rabbit's
  own coat and pattern colours.

| In the game | Sheet cells | Notes |
| --- | --- | --- |
| A rabbit at rest | Idle (4 frames); Base: white for a solid coat, Dutch for a Dutch or hooded one | kits rest in the idle cycle |
| A hop | Move / Hop (4 frames) | while the rabbit is off the ground |
| An effect, levels 1–3 | Strength, Venom, Love, Transformation, Acid, Fire | the strongest of them shows; two frames flicker (venom: one per rabbit, its second frame is the rabbit sunk on its side) |
| A death | Death (if lethal) per effect, Dead (static) otherwise | by the cause of death |

Not used: the spotted and ginger bases (every coat colour is painted from
the sheet rabbit, and the idle cycle is the spotted one), and level 0 of the
effect rows (the same rabbit as the idle cycle).
Grown traits, the hutch's loaf / rear / flop poses, a collapse, a rabbit
frozen solid and the channels the sheet has no row for (vitality, arcana,
frost, lye, death) keep the procedural rabbit of `src/rendering/rabbit.js`.
