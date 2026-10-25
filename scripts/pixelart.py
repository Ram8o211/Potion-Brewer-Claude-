"""Pixel-art helpers shared by the Wilds sprite builds (scripts/make-meadow.py,
scripts/make-wilds.py). Dev-time only; needs Pillow and NumPy.

The packs are generated concept art: soft edges, uneven grids and far more
colours than pixel art uses. These bring a sprite down to art pixels by
majority vote with a hard alpha (`fit` to an exact size, `down` by a fixed
factor), snap it to a palette, clean stray pixels and halos, outline it and
pack sprites into an atlas.
"""
import colorsys
import math
from collections import Counter
import numpy as np
from PIL import Image


INK = (26, 18, 24, 255)      # the game's outline colour (#1a1218)
GLOW = (255, 243, 196, 255)  # hover outline: warm parchment white


def hexes(*cs):
    return [tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)) for c in cs]


def down(im, f=4, colours=14, alpha_share=0.5):
    """Block-majority downsample to art pixels, on the grid offset that best fits the source."""
    opaque = [px for px in getattr(im, 'get_flattened_data', im.getdata)() if px[3] >= 128]
    fill = Counter(px[:3] for px in opaque).most_common(1)[0][0]
    flat = Image.new('RGB', im.size, fill)
    flat.paste(im.convert('RGB'), mask=im.getchannel('A').point(lambda a: 255 if a >= 128 else 0))
    q = flat.quantize(colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pal, qp, ap = q.getpalette(), q.load(), im.getchannel('A').load()

    def sample(ox, oy):
        W, H = (im.width + ox + f - 1) // f, (im.height + oy + f - 1) // f
        out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        o, purity = out.load(), 0
        for y in range(H):
            for x in range(W):
                c, n, tot = Counter(), 0, 0
                for yy in range(max(0, y * f - oy), min(im.height, y * f - oy + f)):
                    for xx in range(max(0, x * f - ox), min(im.width, x * f - ox + f)):
                        tot += 1
                        if ap[xx, yy] >= 128:
                            n += 1
                            c[qp[xx, yy]] += 1
                if n and n >= tot * alpha_share:
                    i, k = c.most_common(1)[0]
                    purity += k
                    o[x, y] = (pal[i * 3], pal[i * 3 + 1], pal[i * 3 + 2], 255)
        return purity, out

    return max((sample(ox, oy) for oy in range(f) for ox in range(f)), key=lambda r: r[0])[1]


def dist(a, b):
    return 2 * (a[0] - b[0]) ** 2 + 4 * (a[1] - b[1]) ** 2 + 3 * (a[2] - b[2]) ** 2


def snap(im, palette):
    """Map every opaque pixel to the nearest palette colour."""
    out, cache = im.copy(), {}
    p = out.load()
    for y in range(out.height):
        for x in range(out.width):
            c = p[x, y]
            if c[3]:
                if c[:3] not in cache:
                    cache[c[:3]] = min(palette, key=lambda q: dist(q, c))
                p[x, y] = (*cache[c[:3]], 255)
    return out


def accents(im, n=8):
    """A sprite's own colours that are not foliage green (berries, bells, caps, bark)."""
    px = [c[:3] for c in getattr(im, 'get_flattened_data', im.getdata)() if c[3]]
    flat = Image.new('RGB', (len(px), 1))
    flat.putdata(px)
    q = flat.quantize(n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    used = {i for _, i in q.getcolors()}
    pal = q.getpalette()
    out = []
    for i in sorted(used):
        c = tuple(pal[i * 3:i * 3 + 3])
        h, s, v = colorsys.rgb_to_hsv(*(k / 255 for k in c))
        if not (hue_in(h, 60, 170) and s > 0.3) and v > 0.08:
            out.append(c)
    return out


def neighbours(p, x, y, w, h):
    return [p[nx, ny] for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)) if 0 <= nx < w and 0 <= ny < h]


def despeckle(im, near=14400):
    """A lone pixel whose neighbours (three or four of them alike) differ from it takes
    their colour, if it is close to it (noise, not a blossom or a berry glint)."""
    out = im.copy()
    src, o = im.load(), out.load()
    for y in range(im.height):
        for x in range(im.width):
            c = src[x, y]
            if not c[3]:
                continue
            ns = neighbours(src, x, y, im.width, im.height)
            if len(ns) == 4 and all(n[3] for n in ns) and c not in ns:
                n, k = Counter(ns).most_common(1)[0]
                if k >= 3 and dist(n, c) < near:
                    o[x, y] = n
    return out


def majority(im, passes=2):
    """Clean the salt and pepper a soft source leaves inside a sprite: an
    inner pixel that shares its colour with at most one of its eight
    neighbours takes their most common colour, if four or more share it.
    The silhouette's edge stays."""
    px = np.asarray(im).copy()
    h, w = px.shape[:2]
    for _ in range(passes):
        src = px.copy()
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                if not src[y, x, 3]:
                    continue
                ns = [tuple(src[y + dy, x + dx]) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx]
                if any(not n[3] for n in ns):
                    continue
                me = tuple(src[y, x])
                if sum(n == me for n in ns) >= 2:
                    continue
                c, k = Counter(ns).most_common(1)[0]
                if k >= 4:
                    px[y, x] = c
    return Image.fromarray(px, 'RGBA')


def rim(im, palette, luma=70):
    """Replace a broken dark outline with a whole one: the dark pixels on the
    silhouette's edge are dropped, then the silhouette is grown by one pixel,
    each new pixel a deep shade of the one inside it (dark green around
    leaves, dark brown around bark), snapped to the palette."""
    im = trim(defringe(im, luma))
    out = Image.new('RGBA', (im.width + 2, im.height + 2), (0, 0, 0, 0))
    out.paste(im, (1, 1))
    src, o = out.copy().load(), out.load()
    cache = {}
    for y in range(out.height):
        for x in range(out.width):
            if src[x, y][3]:
                continue
            ns = [src[nx, ny] for nx, ny in ((x, y + 1), (x, y - 1), (x + 1, y), (x - 1, y)) if 0 <= nx < out.width and 0 <= ny < out.height and src[nx, ny][3]]
            if not ns:
                continue
            c = ns[0][:3]
            if c not in cache:
                deep = tuple(int(v * 0.32) for v in c)
                cache[c] = min(palette, key=lambda q: dist(q, deep))
            o[x, y] = (*cache[c], 255)
    return out


def defringe(im, luma=70):
    """Drop dark pixels on the silhouette edge (soft-alpha halos of the source art)."""
    out = im.copy()
    src, o = im.load(), out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = src[x, y]
            if a and 0.3 * r + 0.59 * g + 0.11 * b < luma:
                ns = neighbours(src, x, y, im.width, im.height)
                if len(ns) < 4 or any(not n[3] for n in ns):
                    o[x, y] = (0, 0, 0, 0)
    return out


# bark, dark to light (rendering/regions.js OAKBARK)
BARK = hexes('#1e1008', '#4a2a14', '#6e4220', '#94602e', '#b8844a', '#d8a868')


def bark_texture(im, seed=0):
    """Re-shade each row of a trunk: lit from the left (a light edge, then
    light, mid and dark bark), two long grooves wavering down it, and the
    shade of the crown on the bark just beneath it. A trunk's run includes
    the dark crevices inside it; the outline stays."""
    out = im.copy()
    src, o = im.load(), out.load()
    w, h = im.size
    bark = lambda c: c[3] and c[0] > c[1] + 8 and c[0] > c[2] + 8
    dark = lambda c: c[3] and 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2] < 60
    leaf = lambda c: c[3] and c[1] > c[0] + 10
    for y in range(h):
        x = 0
        while x < w:
            if not bark(src[x, y]):
                x += 1
                continue
            x0 = x
            while x < w and (bark(src[x, y]) or (dark(src[x, y]) and any(bark(src[x + k, y]) for k in (1, 2) if x + k < w))):
                x += 1
            L = x - x0
            if L < 4:
                continue
            tones = []
            for xx in range(x0, x):
                t = (xx - x0 + 0.5) / L
                tone = 4 if t < 0.12 else 3 if t < 0.4 else 2 if t < 0.76 else 1
                # in the crown's shade
                if any(leaf(src[xx, y - k]) or (dark(src[xx, y - k]) and not bark(src[xx, y - k])) for k in range(1, 4) if y - k >= 0):
                    tone -= 1
                tones.append(tone)
            if L >= 7:
                for k, gt in enumerate((0.42, 0.7)):
                    if (y + k * 5 + seed) % 11 == 0:
                        continue
                    gx = round(gt * L + math.sin(y * 0.22 + k * 2.4 + seed) * 1.1)
                    if 1 <= gx < L - 1:
                        tones[gx] = max(0, tones[gx] - 1)
            for k, tone in enumerate(tones):
                o[x0 + k, y] = (*BARK[max(0, tone)], 255)
    return out


def trim(im):
    box = im.getchannel('A').getbbox()
    return im.crop(box) if box else im


def outline(im, colour):
    """Grow the silhouette by one pixel (4-neighbourhood) in the given colour."""
    out = Image.new('RGBA', (im.width + 2, im.height + 2), (0, 0, 0, 0))
    out.paste(im, (1, 1))
    src, o = out.copy().load(), out.load()
    for y in range(out.height):
        for x in range(out.width):
            if src[x, y][3]:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < out.width and 0 <= ny < out.height and src[nx, ny][3]:
                    o[x, y] = colour
                    break
    return out


def recolour(im, fn):
    """Apply fn(h, s, v) -> (h, s, v) (all 0..1) to every opaque pixel."""
    out = im.copy()
    p = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = p[x, y]
            if not a:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            h, s, v = fn(h, s, v)
            r, g, b = colorsys.hsv_to_rgb(h % 1, max(0, min(1, s)), max(0, min(1, v)))
            p[x, y] = (round(r * 255), round(g * 255), round(b * 255), a)
    return out


def hue_in(h, lo, hi):
    h *= 360
    return lo <= h <= hi if lo <= hi else h >= lo or h <= hi


def anchored(frames):
    """Pad frames to one canvas, bottom-centre aligned, so states swap in place."""
    W, H = max(f.width for f in frames.values()), max(f.height for f in frames.values())
    out = {}
    for k, f in frames.items():
        c = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        c.paste(f, ((W - f.width) // 2, H - f.height))
        out[k] = c
    return out


def pack(sprites, width=256, gap=1):
    order = sorted(sprites, key=lambda k: (-sprites[k].height, k))
    x = y = row = 0
    rects = {}
    for k in order:
        im = sprites[k]
        if x + im.width > width:
            x, y, row = 0, y + row + gap, 0
        rects[k] = (x, y, im.width, im.height)
        x += im.width + gap
        row = max(row, im.height)
    atlas = Image.new('RGBA', (width, y + row), (0, 0, 0, 0))
    for k, (x, y, _, _) in rects.items():
        atlas.paste(sprites[k], (x, y))
    return atlas, rects


def fit(im, w=None, h=None, colours=16, alpha_share=0.5):
    """Majority-vote downsample to w x h art pixels (one given: keep the aspect)."""
    im = trim(im)
    W, H = im.size
    if w is None:
        w = max(1, round(W * h / H))
    if h is None:
        h = max(1, round(H * w / W))
    a = np.asarray(im.getchannel('A')) >= 128
    opaque = np.asarray(im.convert('RGB'))[a]
    fill = tuple(int(v) for v in np.median(opaque, axis=0)) if len(opaque) else (0, 0, 0)
    flat = Image.new('RGB', im.size, fill)
    flat.paste(im.convert('RGB'), mask=Image.fromarray((a * 255).astype(np.uint8)))
    q = flat.quantize(colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    idx, pal = np.asarray(q), q.getpalette()
    xs, ys = np.linspace(0, W, w + 1).round().astype(int), np.linspace(0, H, h + 1).round().astype(int)
    out = np.zeros((h, w, 4), np.uint8)
    for y in range(h):
        for x in range(w):
            ba = a[ys[y]:ys[y + 1], xs[x]:xs[x + 1]]
            if not ba.size or ba.mean() < alpha_share:
                continue
            i = np.bincount(idx[ys[y]:ys[y + 1], xs[x]:xs[x + 1]][ba]).argmax()
            out[y, x] = (*pal[i * 3:i * 3 + 3], 255)
    return Image.fromarray(out, 'RGBA')
