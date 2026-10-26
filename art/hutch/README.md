# Hutch — source art

`pen.png` (1672 × 941): the colony's pen, shown as the hutch scene in the
Trials room.

The game never loads this file. `python scripts/make-hutch.py` (needs Pillow
and NumPy) cuts it to the pen and brings it down to the scene's 224 × 92 art
pixels by majority vote over a 64-colour palette. It writes
`assets/hutch/pen.png`, the front rail and its posts alone as
`assets/hutch/pen-front.png` (drawn over the rabbits), and
`src/rendering/hutch-ground.js`: row by row, the runs of straw a rabbit's
feet may rest on (the floor less the hide box and the two bowls).
`--preview DIR` writes the pen enlarged with its ground tinted.
