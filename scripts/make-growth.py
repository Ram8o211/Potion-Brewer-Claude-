"""Build the growth atlas: every wild ingredient as a sprout, ripe and mature
plant (or crystal, stone, shell...), cut from the Growth Atlas sheet.
Dev-time only: `python scripts/make-growth.py` (needs Pillow and NumPy).

The sheet (art/growth/growth_atlas.png) is a table per region: one row per
ingredient, one parchment cell per stage. Each cell's parchment is flooded
in from the cell's edge and cleared (the sprites' dark outlines stop the
flood, so pale caps, shells and petals inside them stay), the pieces of the
sprite are kept and stray specks dropped. All stages are brought down by one
factor, so a sprout stays small beside its mature plant, to twice the
scene's resolution (`RES`), by majority vote
(`pixelart.fit`, hard alpha), then outlined in ink. The mature stage also
gets a light-outlined hover frame. The frames of an ingredient share one
canvas anchored at its bottom centre (its spot on the ground), so a plant
grows in place.

Writes assets/growth/atlas.png and src/rendering/growth-atlas.js (the frame
rectangles). `--preview DIR` also writes an enlarged sheet.
"""
import os
import sys
from collections import deque
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixelart import INK, GLOW, trim, outline, anchored, pack, fit  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'growth', 'growth_atlas.png')
OUT_PNG = os.path.join(ROOT, 'assets', 'growth', 'atlas.png')
OUT_JS = os.path.join(ROOT, 'src', 'rendering', 'growth-atlas.js')
# sheet pixels per art pixel (a mature plant comes out about 24 px tall)
SCALE = 3.4
# atlas pixels per art pixel: the plants are kept at twice the scene's
# resolution (drawn at half size on its doubled canvas), so their detail
# is not crowded into a few coarse pixels
RES = 2
STAGES = ('sprout', 'ripe', 'mature')

# the sheet's two columns of panels: each stage's cell, [x0, x1)
COLS = {
    'left': ((206, 290), (293, 385), (387, 494)),
    'right': ((701, 787), (789, 889), (891, 999)),
}
# each panel: its column, then the centre row of each ingredient (wild keys, materials/wild.js)
PANELS = {
    'meadow': ('left', [('heartpetal', 176), ('sunthistle', 238), ('nettle', 302), ('dreamclover', 364), ('beebalm', 428), ('hemlock', 490)], 145, 585),
    'forest': ('right', [('ironroot', 176), ('silverleaf', 238), ('nightshade', 302), ('emberbark', 364), ('owlberry', 427), ('witchear', 490), ('mandrake', 552)], 145, 585),
    'river': ('left', [('riverchalk', 699), ('frostcap', 765), ('bogbean', 830), ('willowbark', 893), ('reedmace', 961), ('riverpearl', 1032)], 668, 1070),
    'quarry': ('right', [('emberflint', 699), ('mica', 757), ('saltpetre', 817), ('sulfur', 878), ('lodestone', 938), ('cinnabar', 998), ('stormglass', 1063)], 668, 1098),
    'moonfen': ('left', [('gravemoss', 1213), ('starquartz', 1268), ('wisplichen', 1323), ('moonlily', 1379), ('toadstool', 1433), ('sirenreed', 1484)], 1185, 1515),
    'crags': ('right', [('dragonpepper', 1222), ('cinderscale', 1289), ('ashbloom', 1365), ('obsidian', 1451)], 1190, 1500),
}


def parchment(rgb):
    """The sheet's parchment, cell fills and cell borders: light, warm and unsaturated."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return (r > 196) & (g > 178) & (b > 140) & (r - b < 75) & (r >= g - 4) & (g >= b - 4)


def cut(sheet, x0, x1, y0, y1):
    """One cell's sprite: the parchment flooded in from the cell's edge is cleared."""
    rgb = sheet[y0:y1, x0:x1, :3].astype(int)
    h, w = rgb.shape[:2]
    bg = parchment(rgb)
    out = np.zeros((h, w), bool)
    q = deque((y, x) for y in range(h) for x in (0, w - 1)) + deque((y, x) for x in range(w) for y in (0, h - 1))
    for y, x in q:
        out[y, x] = bg[y, x]
    q = deque((y, x) for y, x in q if bg[y, x])
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and bg[ny, nx] and not out[ny, nx]:
                out[ny, nx] = True
                q.append((ny, nx))
    keep = ~out
    # drop specks: pieces far smaller than the sprite (a neighbouring cell's edge, the cell's own border)
    lab, sizes = label(keep)
    if sizes:
        big = max(sizes)
        for n, s in enumerate(sizes, 1):
            if s < big * 0.04:
                keep[lab == n] = False
    a = np.dstack([sheet[y0:y1, x0:x1, :3], (keep * 255).astype(np.uint8)])
    return trim(Image.fromarray(a, 'RGBA'))


def label(a):
    """8-connected pieces of a mask: (labels, sizes)."""
    h, w = a.shape
    lab = np.zeros((h, w), np.int32)
    sizes = []
    for y0 in range(h):
        for x0 in range(w):
            if not a[y0, x0] or lab[y0, x0]:
                continue
            n = len(sizes) + 1
            lab[y0, x0] = n
            q, s = deque([(y0, x0)]), 0
            while q:
                y, x = q.popleft()
                s += 1
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w and a[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = n
                            q.append((ny, nx))
            sizes.append(s)
    return lab, sizes


def even(im):
    """Pad a frame on the top and right to whole art pixels (multiples of RES)."""
    w, h = -(-im.width // RES) * RES, -(-im.height // RES) * RES
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    out.paste(im, (0, h - im.height))
    return out


def build():
    sheet = np.asarray(Image.open(SRC).convert('RGBA'))
    sprites = {}
    for region, (side, rows, top, bottom) in PANELS.items():
        centres = [c for _, c in rows]
        for i, (key, cy) in enumerate(rows):
            # a cell reaches halfway to its neighbours (the panel's edge for the first and last)
            y0 = (centres[i - 1] + cy) // 2 if i else top
            y1 = (centres[i + 1] + cy) // 2 if i + 1 < len(rows) else bottom
            frames = {}
            for stage, (x0, x1) in zip(STAGES, COLS[side]):
                im = cut(sheet, x0, x1, y0, y1)
                im = fit(im, w=max(3, round(im.width * RES / SCALE)), colours=24)
                frames[stage] = outline(trim(im), INK)
            frames['mature_hover'] = outline(outline(frames['mature'], GLOW), GLOW)
            sprites.update({f'{key}_{k}': even(v) for k, v in anchored(frames).items()})
    return sprites


def main():
    preview = sys.argv[sys.argv.index('--preview') + 1] if '--preview' in sys.argv else None
    sprites = build()
    atlas, rects = pack(sprites, width=256 * RES, gap=RES)
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    atlas.save(OUT_PNG, optimize=True)
    print(f'growth: {len(rects)} frames, atlas {atlas.width}x{atlas.height}')
    if preview:
        bg = Image.new('RGBA', atlas.size, (110, 150, 80, 255))
        bg.alpha_composite(atlas)
        bg.resize((atlas.width * 4, atlas.height * 4), Image.NEAREST).save(os.path.join(preview, 'growth.png'))
    lines = [
        '// Generated by scripts/make-growth.py from art/growth/ — do not edit.',
        '// Frame rectangles [x, y, w, h] in assets/growth/atlas.png (atlas pixels, RES to',
        '// an art pixel): each wild ingredient as a sprout, ripe and mature plant, and',
        '// the mature hover frame.',
        '',
        "export const ATLAS_URL = 'assets/growth/atlas.png';",
        f'export const RES = {RES};',
        f'export const ATLAS_SIZE = [{atlas.width}, {atlas.height}];',
        '',
        '/** @type {Record<string, [number, number, number, number]>} */',
        'export const FRAMES = {',
    ]
    for k in sorted(rects):
        lines.append(f"  {k}: [{', '.join(str(v) for v in rects[k])}],")
    lines += ['};', '']
    with open(OUT_JS, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(lines))


if __name__ == '__main__':
    main()
