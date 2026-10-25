"""Build the wilds' backdrops: one painted picture per region, brought down to
the scene's 256 x 144 art pixels, and the ground the plants may stand on.
Dev-time only: `python scripts/make-backdrops.py` (needs Pillow and NumPy).

Each source picture (art/backdrops/<region>.png, 4:3) is brought down to 256
art pixels wide by majority vote over a 64-colour palette (crisp pixels, as
the sprites drawn on top are), then cut to the scene's 16:9 by dropping rows
of sky above and foreground below (`CROP`: the first row kept). The Ember
Crags' painted plumes of steam are filled in from their surroundings
(`PLUMES`): the scene animates the steam.

The ground is where a plant's foot may rest: inside the region's open ground
(`GROUND`, polygons drawn over the picture in art pixels), off the scenery
that stands on it (`SCENERY`: trunks, stumps, the cart...) and, by colour,
never in water, in lava or on a rock (nor in Moonfen's pools and mist); then shrunk by a pixel or two so a foot
never rests on an edge. It is written as rows of [x0, x1) runs.

Writes assets/backdrops/<region>.png and src/rendering/backdrops-ground.js.
`--preview DIR` also writes each backdrop enlarged with its ground tinted.
"""
import os
import sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'backdrops')
OUT = os.path.join(ROOT, 'assets', 'backdrops')
OUT_JS = os.path.join(ROOT, 'src', 'rendering', 'backdrops-ground.js')
W, H = 256, 144
REGIONS = ('meadow', 'forest', 'river', 'quarry', 'moonfen', 'crags')

# the first row kept of the picture brought down to 256 x 192
CROP = {'meadow': 18, 'forest': 24, 'river': 40, 'quarry': 38, 'moonfen': 24, 'crags': 30}

# the open ground, as polygons in the scene's art pixels (after the crop)
GROUND = {
    # the field below the fence and the oak's roots, above the bushes along the near edge
    'meadow': [[(4, 92), (62, 90), (222, 90), (228, 100), (252, 100), (252, 134), (216, 138), (44, 138), (4, 132)]],
    # the sunlit clearing between the two oaks' roots and the ferns
    'forest': [[(12, 104), (58, 98), (76, 90), (100, 86), (166, 86), (180, 98), (250, 100), (250, 112), (236, 114), (200, 118), (186, 130), (182, 141), (60, 141), (52, 126), (12, 116)]],
    # the near shore, below the river and the reeds along it
    'river': [[(30, 97), (226, 97), (252, 104), (252, 116), (232, 122), (212, 136), (188, 141), (64, 141), (44, 128), (16, 112)]],
    # the quarry floor in front of the cliff and the scaffolds
    'quarry': [[(4, 84), (252, 84), (252, 141), (4, 141)]],
    # the fen's bank in front of the willows, round the pools
    'moonfen': [[(6, 76), (250, 76), (250, 140), (6, 140)]],
    # the plain between the crags and the rocks in the foreground
    'crags': [[(4, 84), (252, 84), (252, 132), (200, 138), (70, 138), (4, 132)]],
}

# scenery standing on the ground, [x0, y0, x1, y1] in scene pixels: nothing grows out of it
SCENERY = {
    'meadow': [(0, 0, 50, 98), (222, 0, 256, 100)],
    'forest': [(0, 0, 76, 96), (176, 0, 256, 98)],
    'river': [(10, 86, 36, 104), (220, 88, 256, 108)],
    'quarry': [(234, 64, 256, 104), (0, 90, 22, 112), (212, 104, 256, 144), (0, 118, 60, 144)],
    'moonfen': [(0, 0, 52, 104), (204, 0, 256, 104), (226, 118, 256, 144), (0, 114, 44, 132)],
    'crags': [(0, 0, 56, 100), (196, 0, 256, 96)],
}

# how far the ground is shrunk from water, lava and rocks (art pixels)
SHRINK = {'moonfen': 1}


def water(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return (b > r + 50) & (b > g + 40)


def bog(rgb):
    """Moonfen's dark pools and mist: where most of the pixels round about are
    bluer than the green bank (a blade of grass standing in a pool does not
    make it ground, nor a bluish speck in the grass a pool)."""
    blue = (rgb[..., 2] > rgb[..., 1] + 8).astype(float)
    pad, n = np.pad(blue, 3, mode='edge'), 7
    share = sum(pad[dy:dy + blue.shape[0], dx:dx + blue.shape[1]] for dy in range(n) for dx in range(n)) / (n * n)
    return share > 0.6


def lava(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return (r > 140) & (r - b > 100)


def stone(rgb):
    """Grey and blue-grey stone (low saturation, not dark)."""
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    return (mx > 96) & ((mx - mn) < 0.28 * mx)


def violet_rock(rgb):
    """The crags' purple-grey rock (blue near red, unlike the brown ground)."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return (b > 50) & (b > r * 0.72) & (b >= g)


# what no foot may rest in, by colour, per region
BLOCKED = {
    'meadow': [], 'forest': [],
    'river': [water, stone], 'quarry': [stone], 'moonfen': [water, stone, bog], 'crags': [lava, violet_rock],
}


# painted plumes of steam over the crags' vents, [x0, y0, x1, y1] in scene
# pixels above each vent: cleared from the picture (the scene animates the smoke)
PLUMES = {'crags': [(64, 18, 88, 58), (186, 0, 208, 34)]}


def plume(rgb):
    """Steam: purple-grey smoke (bluer than the red sky and rock) or the
    glowing yellow-orange column (lighter than the lava under it)."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return ((b > 0.45 * r) & (b > 40)) | ((r > 200) & (g > 90))


def clear_plumes(region, rgb):
    """Fill each plume in from the colours round it, ring by ring."""
    rgb = rgb.copy()
    hole = np.zeros((H, W), bool)
    for x0, y0, x1, y1 in PLUMES.get(region, ()):
        hole[y0:y1, x0:x1] |= plume(rgb[y0:y1, x0:x1].astype(int))
    hole = grow(hole, 1)
    while hole.any():
        fill = []
        for y, x in zip(*np.nonzero(hole)):
            near = [tuple(rgb[y + dy, x + dx]) for dy in (-1, 0, 1) for dx in (-1, 0, 1)
                    if 0 <= y + dy < H and 0 <= x + dx < W and not hole[y + dy, x + dx]]
            if near:
                fill.append((y, x, max(set(near), key=near.count)))
        for y, x, c in fill:
            rgb[y, x] = c
            hole[y, x] = False
    return rgb


def down(src, w, colours=64):
    """Majority vote over a palette, block by block, to w art pixels wide."""
    sw, sh = src.size
    h = round(sh * w / sw)
    q = src.convert('RGB').quantize(colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    idx, pal = np.asarray(q), q.getpalette()
    xs, ys = np.linspace(0, sw, w + 1).round().astype(int), np.linspace(0, sh, h + 1).round().astype(int)
    out = np.zeros((h, w, 3), np.uint8)
    for y in range(h):
        for x in range(w):
            i = np.bincount(idx[ys[y]:ys[y + 1], xs[x]:xs[x + 1]].ravel()).argmax()
            out[y, x] = pal[i * 3:i * 3 + 3]
    return out


def grow(mask, n):
    """Grow a mask by n pixels (8-neighbourhood)."""
    m = mask.copy()
    for _ in range(n):
        g = m.copy()
        g[1:, :] |= m[:-1, :]; g[:-1, :] |= m[1:, :]; g[:, 1:] |= m[:, :-1]; g[:, :-1] |= m[:, 1:]
        g[1:, 1:] |= m[:-1, :-1]; g[:-1, :-1] |= m[1:, 1:]; g[1:, :-1] |= m[:-1, 1:]; g[:-1, 1:] |= m[1:, :-1]
        m = g
    return m


def ground(region, rgb):
    img = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(img)
    for poly in GROUND[region]:
        d.polygon(poly, fill=255)
    for x0, y0, x1, y1 in SCENERY[region]:
        d.rectangle((x0, y0, x1 - 1, y1 - 1), fill=0)
    g = np.asarray(img) > 0
    bad = np.zeros((H, W), bool)
    for fn in BLOCKED[region]:
        bad |= fn(rgb.astype(int))
    if bad.any():
        # a speck of a blocked colour inside the ground is texture, not a pool or a rock
        bad = keep_large(bad, 6)
        g &= ~grow(bad, SHRINK.get(region, 2))
    return g


def keep_large(mask, n):
    """Only the 4-connected pieces of a mask of at least n pixels."""
    out = np.zeros_like(mask)
    seen = np.zeros_like(mask)
    hh, ww = mask.shape
    for y in range(hh):
        for x in range(ww):
            if not mask[y, x] or seen[y, x]:
                continue
            stack, piece = [(y, x)], []
            seen[y, x] = True
            while stack:
                cy, cx = stack.pop()
                piece.append((cy, cx))
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < hh and 0 <= nx < ww and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        stack.append((ny, nx))
            if len(piece) >= n:
                for cy, cx in piece:
                    out[cy, cx] = True
    return out


def runs(row):
    out, x = [], 0
    while x < len(row):
        if row[x]:
            s = x
            while x < len(row) and row[x]:
                x += 1
            out.append([s, x])
        else:
            x += 1
    return out


def main():
    preview = sys.argv[sys.argv.index('--preview') + 1] if '--preview' in sys.argv else None
    os.makedirs(OUT, exist_ok=True)
    rows = {}
    for region in REGIONS:
        full = down(Image.open(os.path.join(SRC, region + '.png')), W)
        rgb = full[CROP[region]:CROP[region] + H]
        assert rgb.shape[:2] == (H, W), (region, rgb.shape)
        rgb = clear_plumes(region, rgb)
        Image.fromarray(rgb, 'RGB').save(os.path.join(OUT, region + '.png'), optimize=True)
        g = ground(region, rgb)
        rows[region] = [runs(g[y]) for y in range(H)]
        if preview:
            os.makedirs(preview, exist_ok=True)
            tint = rgb.astype(float)
            tint[g] = tint[g] * 0.5 + np.array([255, 0, 255]) * 0.5
            Image.fromarray(tint.astype(np.uint8), 'RGB').resize((W * 4, H * 4), Image.NEAREST).save(os.path.join(preview, region + '-ground.png'))
            Image.fromarray(rgb, 'RGB').resize((W * 4, H * 4), Image.NEAREST).save(os.path.join(preview, region + '.png'))
    with open(OUT_JS, 'w') as f:
        f.write('// Generated by scripts/make-backdrops.py from art/backdrops/ — do not edit.\n')
        f.write('// Per region: its backdrop (assets/backdrops/<region>.png, 256 x 144) and, row by row,\n')
        f.write('// the runs [x0, x1) of ground a plant\'s foot may rest on.\n\n')
        f.write('/** @type {Record<string, number[][][]>} */\n')
        f.write('export const GROUND = {\n')
        for region in REGIONS:
            f.write(f'  {region}: [\n')
            for r in rows[region]:
                f.write('    [' + ', '.join(f'[{a}, {b}]' for a, b in r) + '],\n')
            f.write('  ],\n')
        f.write('};\n')


if __name__ == '__main__':
    main()
