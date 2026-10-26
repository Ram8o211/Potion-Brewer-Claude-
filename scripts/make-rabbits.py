"""Build the Moon Rabbit sprite atlas from the Rabbits Atlas sheet.
Dev-time only: `python scripts/make-rabbits.py` (needs Pillow and NumPy).

The sheet (art/rabbits/rabbits_atlas.png) is a table: along the top the base
rabbits, the idle and hop cycles (four frames each) and the dead rabbit; then
one row per effect (strength, venom, love, transformation, acid, fire) with
two frames for each level 0-3 and a death frame.

Each slot's dark backdrop is flooded in from the slot's edge and cleared (the
rabbits' near-black outline stops the flood, so a pale coat inside it stays,
while coloured auras, flames, hearts and wisps are kept), and the grass tuft
under the feet is dropped (the game draws its own straw). Every frame is then
brought down by one factor by majority vote on a fixed 48 x 34 window whose
bottom row is the feet and whose centre column is the body's, so frames swap
in place inside the 48 x 40 rabbit frame of rendering/rabbit.js (feet on row
33). A second set is made for kits, at kit size.

The rabbit's coat is recoloured per rabbit at run time. The build marks the
coat's pixels in the alpha channel: 254 the white fur, 253 the brown spots
(only on the body, the regions of fur and spot colours that meet the ink
outline, so a pale glint of an aura stays as painted), and
rendering/rabbit-sprites.js paints them in each rabbit's coat and pattern
colour, by their brightness against the ramps' light ends (FUR_V, SPOT_V).

Writes assets/rabbits/atlas.png and src/rendering/rabbit-atlas.js (the frame
rectangles). `--preview out.png` also writes an enlarged sheet.
"""
import colorsys
import os
import sys
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixelart import pack  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'rabbits', 'rabbits_atlas.png')
OUT_PNG = os.path.join(ROOT, 'assets', 'rabbits', 'atlas.png')
OUT_JS = os.path.join(ROOT, 'src', 'rendering', 'rabbit-atlas.js')

# the sheet as laid out at 2000 px wide (scaled to the real sheet below)
GRID = 2000
# sheet pixels per art pixel for a grown rabbit (about 26 px from ear tip to toe), and a kit's
SCALE = {'': 11.6, 'kit_': 11.6 / 0.66}
# glow darker than this (luma) outside the outline is backdrop
DIM = 84
# the window every frame is cut on: 48 wide, the feet on its last row
WIN_W, WIN_H, FEET = 48, 34, 33
# the effect rows, by channel (RABBIT_MARKS names): [y0, y1) of the cells
ROWS = [('strength', 282, 405), ('toxicity', 460, 582), ('love', 638, 760),
        ('transformation', 816, 938), ('acid', 992, 1112), ('fire', 1166, 1295)]
LEVEL_COLS = [(264, 588), (603, 944), (959, 1304), (1320, 1695)]
DEATH_COL = (1711, 1988)
TOP = (57, 203)
TOP_CELLS = {'base': ((400, 966), 4), 'idle': ((988, 1328), 4), 'hop': ((1348, 1762), 4), 'dead': ((1783, 1988), 1)}
BASES = ('spotted', 'dutch', 'white', 'ginger')
# the top cells draw their rabbits at other sizes than the effect rows: the
# ratio of each one's rabbit to an effect row's (widths of the cut frames),
# so every frame comes out at one size
CELL_SIZE = {'base': 1.15, 'idle': 0.7, 'hop': 0.7, 'dead': 1.18}


def load():
    im = Image.open(SRC).convert('RGB')
    return np.asarray(im).astype(np.int16), im.width / GRID


def slots(n, x0, x1):
    w = (x1 - x0) / n
    return [(x0 + i * w, x0 + (i + 1) * w) for i in range(n)]


def flood(passable):
    """Pixels of `passable` reachable from the edge (4-neighbourhood)."""
    reach = np.zeros_like(passable)
    reach[0, :], reach[-1, :], reach[:, 0], reach[:, -1] = passable[0, :], passable[-1, :], passable[:, 0], passable[:, -1]
    while True:
        grown = reach.copy()
        grown[1:, :] |= reach[:-1, :]
        grown[:-1, :] |= reach[1:, :]
        grown[:, 1:] |= reach[:, :-1]
        grown[:, :-1] |= reach[:, 1:]
        grown &= passable
        if (grown == reach).all():
            return reach
        reach = grown


def cut(px, charred=False, dark=False):
    """RGBA of one slot: the backdrop and the grass cleared."""
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    hi, lo = px.max(-1), px.min(-1)
    luma = 0.3 * r + 0.59 * g + 0.11 * b
    # the backdrop: dark and dull (its vignette never gets brighter than this);
    # the outline is darker still, so the flood stops at the rabbit
    back = (luma >= 24) & (luma < 112) & (hi - lo < 46)
    if charred:
        # a burnt body is as dark and dull as the backdrop, but brown where it leans violet
        back &= b >= g - 6
    elif not dark:
        # the dim fringe of a glow is the glow mixed into the dark backdrop: muddy
        # on a light page, so only an aura's bright core is kept
        back |= (luma >= 24) & (luma < DIM)
    # grass: green, in the lowest band of the slot (where the tufts sit)
    h = px.shape[0]
    band = np.zeros_like(back)
    band[int(h * 0.74):, :] = True
    grass = band & (g > r + 6) & (g > b + 10) & (luma < 150)
    clear = flood(back | grass | (band & (luma < 24)))
    alpha = np.where(clear, 0, 255).astype(np.uint8)
    return np.dstack([px.astype(np.uint8), alpha])


def body_box(rgba):
    """Bottom row and centre column of the rabbit itself: its pale coat and dark outline, not its aura."""
    px = rgba[..., :3].astype(np.int16)
    hi, lo = px.max(-1), px.min(-1)
    a = rgba[..., 3] > 0
    luma = 0.3 * px[..., 0] + 0.59 * px[..., 1] + 0.11 * px[..., 2]
    coat = a & (hi - lo < 70) & (luma > 120)
    rows, cols = np.nonzero(coat)
    if not len(rows):
        rows, cols = np.nonzero(a)
    # the lowest coat row with real width (not a stray speck); the outline under it is added by the caller
    width = coat.sum(1)
    bottom = max(y for y in range(rgba.shape[0]) if width[y] >= max(3, width.max() * 0.08))
    x0, x1 = np.percentile(cols, [1, 99])
    return bottom, (x0 + x1) / 2


def window(rgba, f, bottom, cx):
    """Majority vote on the fixed window at f sheet pixels per art pixel."""
    pal_src = Image.fromarray(rgba[..., :3]).quantize(64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    idx, pal = np.asarray(pal_src), pal_src.getpalette()
    a = rgba[..., 3] > 0
    out = np.zeros((WIN_H, WIN_W, 4), np.uint8)
    top = bottom + 1 - WIN_H * f
    left = cx - WIN_W * f / 2
    H, W = a.shape
    for y in range(WIN_H):
        sy0, sy1 = int(round(top + y * f)), int(round(top + (y + 1) * f))
        if sy1 <= 0 or sy0 >= H:
            continue
        for x in range(WIN_W):
            sx0, sx1 = int(round(left + x * f)), int(round(left + (x + 1) * f))
            if sx1 <= 0 or sx0 >= W:
                continue
            ba = a[max(0, sy0):sy1, max(0, sx0):sx1]
            full = (sy1 - sy0) * (sx1 - sx0)
            if not ba.size or ba.sum() < full * 0.5:
                continue
            i = np.bincount(idx[max(0, sy0):sy1, max(0, sx0):sx1][ba]).argmax()
            out[y, x] = (*pal[i * 3:i * 3 + 3], 255)
    return out


def specks(out, keep=4):
    """Drop opaque islands smaller than `keep` pixels that are dull (noise, not a spark or a heart)."""
    h, w = out.shape[:2]
    seen = np.zeros((h, w), bool)
    for y in range(h):
        for x in range(w):
            if seen[y, x] or not out[y, x, 3]:
                continue
            comp, stack = [], [(y, x)]
            seen[y, x] = True
            while stack:
                cy, cx = stack.pop()
                comp.append((cy, cx))
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and out[ny, nx, 3]:
                        seen[ny, nx] = True
                        stack.append((ny, nx))
            if len(comp) < keep:
                bright = max(colorsys.rgb_to_hsv(*(out[p][:3] / 255))[1] for p in comp)
                if bright < 0.45:
                    for p in comp:
                        out[p] = 0
    return out


# the frames whose rabbit is itself dark (the Dutch coat, the charred one in the flames)
DARK = ('dutch', 'fire_3_1')


def frame(sheet, k, box, f, charred=False, dark=False):
    """One frame: the slot in grid units, cut, anchored on its body, brought down by f."""
    (x0, x1), (y0, y1) = box
    px = sheet[int(y0 * k):int(y1 * k), int(x0 * k):int(x1 * k)]
    rgba = cut(px, charred, dark)
    bottom, cx = body_box(rgba)
    bottom += round(f * 0.9)  # the dark outline under the toes is the frame's last row
    return Image.fromarray(specks(window(rgba, f, bottom, cx)), 'RGBA')


def build():
    sheet, k = load()
    S = {}
    for pre, scale in SCALE.items():
        f = scale * k * GRID / 6144  # SCALE is in pixels of the 6144 px master
        for name, ((x0, x1), n) in TOP_CELLS.items():
            for i, sl in enumerate(slots(n, x0, x1)):
                key = f'{pre}{BASES[i]}' if name == 'base' else f'{pre}{name}' if n == 1 else f'{pre}{name}_{i}'
                if name == 'base' and (pre or BASES[i] in ('spotted', 'ginger')):
                    continue  # every coat colour is painted from the sheet rabbit; kits rest in the idle cycle
                S[key] = frame(sheet, k, (sl, TOP), f * CELL_SIZE[name], dark=key.endswith(DARK))
        for ch, y0, y1 in ROWS:
            for lv, (x0, x1) in enumerate(LEVEL_COLS):
                if lv == 0:
                    continue  # level 0 is the idle rabbit again
                for i, sl in enumerate(slots(2, x0, x1)):
                    S[f'{pre}{ch}_{lv}_{i}'] = frame(sheet, k, (sl, (y0, y1)), f, dark=f'{ch}_{lv}_{i}' in DARK)
            S[f'{pre}{ch}_dead'] = frame(sheet, k, (DEATH_COL, (y0, y1)), f, charred=ch == 'fire')
    return S


# ------------------------------------------------------------------ the coat ramps

FUR, SPOT = 254, 253
INK = (26, 18, 24, 255)  # the outline colour of the procedural rabbits (rabbit.js K)
FUR_V, SPOT_V = 0.96, 0.45


def coat_roles(im):
    """Mark the coat in the alpha channel (FUR, SPOT): fur- and spot-coloured
    regions of three or more pixels that touch the ink outline in three places."""
    px = np.asarray(im).copy()
    h, w = px.shape[:2]
    role = np.zeros((h, w), np.uint8)
    ink = np.zeros((h, w), bool)
    for y in range(h):
        for x in range(w):
            r, g, b, a = (int(v) for v in px[y, x])
            if not a:
                continue
            hh, ss, vv = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            hue = hh * 360
            # the fur is a warm white (the pink of the ears is redder and stronger); the spots a mid brown
            if ((10 <= hue <= 32 and ss < 0.36) or ss < 0.12) and vv > 0.55:
                role[y, x] = FUR
            elif (hue < 40 or hue > 340) and 0.25 <= ss <= 0.7 and 0.2 < vv <= 0.55:
                role[y, x] = SPOT
            elif 0.3 * r + 0.59 * g + 0.11 * b < 50:
                ink[y, x] = True
    seen = np.zeros((h, w), bool)
    for y in range(h):
        for x in range(w):
            if seen[y, x] or not role[y, x]:
                continue
            comp, stack, touch = [], [(y, x)], set()
            seen[y, x] = True
            while stack:
                cy, cx = stack.pop()
                comp.append((cy, cx))
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < h and 0 <= nx < w:
                        if ink[ny, nx]:
                            touch.add((ny, nx))
                        elif role[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            stack.append((ny, nx))
            if len(comp) >= 3 and len(touch) >= 3:
                for p in comp:
                    px[p][3] = role[p]
    # close the outline where the soft source left the coat open to the page
    coat = px[..., 3] >= SPOT
    coat &= px[..., 3] < 255
    for y in range(h):
        for x in range(w):
            if px[y, x, 3]:
                continue
            if any(0 <= y + dy < h and 0 <= x + dx < w and coat[y + dy, x + dx] for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                px[y, x] = INK
    return Image.fromarray(px, 'RGBA')


def main():
    sprites = build()
    # a charred body keeps its own colours
    sprites = {k: im if k.endswith('fire_dead') else coat_roles(im) for k, im in sprites.items()}
    atlas, rects = pack(sprites, width=512)
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    atlas.save(OUT_PNG, optimize=True)
    lines = [
        '// Generated by scripts/make-rabbits.py from art/rabbits/ — do not edit.',
        '// Frame rectangles [x, y, w, h] in assets/rabbits/atlas.png: every frame is the',
        '// 48 × 34 top of a rabbit frame (feet on row 33); kit_ frames are drawn at kit size.',
        '',
        "export const ATLAS_URL = 'assets/rabbits/atlas.png';",
        f'export const ATLAS_SIZE = [{atlas.width}, {atlas.height}];',
        '',
        '/** @type {Record<string, [number, number, number, number]>} */',
        'export const FRAMES = {',
    ]
    for key in sorted(rects):
        lines.append(f"  {key.replace('-', '_')}: [{', '.join(str(v) for v in rects[key])}],")
    lines += ['};', '',
              '/** Alpha of the coat\'s pixels (the fur, the spots) and the brightness of each ramp\'s light end. */',
              f'export const COAT_ALPHA = {{ fur: {FUR}, spot: {SPOT} }};',
              f'export const COAT_V = {{ fur: {FUR_V}, spot: {SPOT_V} }};', '']
    with open(OUT_JS, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(lines))
    print(f'{len(rects)} frames, atlas {atlas.width}x{atlas.height} -> {os.path.relpath(OUT_PNG, ROOT)}')
    if '--preview' in sys.argv:
        out = sys.argv[sys.argv.index('--preview') + 1]
        bg = Image.new('RGBA', atlas.size, (60, 70, 60, 255))
        bg.alpha_composite(atlas)
        bg.resize((atlas.width * 3, atlas.height * 3), Image.NEAREST).save(out)


if __name__ == '__main__':
    main()
