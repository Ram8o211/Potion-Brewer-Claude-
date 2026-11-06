#!/usr/bin/env python3
"""Slice the interface sprite sheets (art/ui/source) into the sprites the
game uses (assets/ui).

  python3 scripts/slice-ui-sheets.py          → assets/ui (only what the game references)
  python3 scripts/slice-ui-sheets.py --all D  → every named sprite into D (the full library)

The sheets have real transparency: each sprite is found as a connected
blob of opaque pixels (boxes listed in reading order), cropped and named.
Icons that sit on a backing in the sheet (wooden slots, the purple room
tabs, the dark effect slots) are keyed out of it with a flood fill from the
crop's edge that stops at the icon's dark outline. A few sprites are
derived: a blank vine header (the potion painted over with plank), blank
room-tab backgrounds (icon and label filled with the tab's own colour) and
the brand plate cleared of the header that touched it.

Shipped sprites are palette-quantized (256 colours, no dither), which keeps
them visually identical at a quarter of the size. Needs Pillow, NumPy and
SciPy.
"""
import json, os, re, shutil, sys, tempfile
from collections import deque
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'ui', 'source')


def segment(im, dil=2):
    """Sprite boxes of a sheet: blobs of opaque pixels, top-to-bottom in 40 px bands, then left to right."""
    a = np.array(im)[:, :, 3] > 100
    lab, n = ndimage.label(ndimage.binary_dilation(a, iterations=dil))
    boxes = []
    for s in ndimage.find_objects(lab):
        y0, y1, x0, x1 = s[0].start, s[0].stop, s[1].start, s[1].stop
        if (x1 - x0) * (y1 - y0) < 150: continue
        boxes.append([x0 + dil, y0 + dil, x1 - dil, y1 - dil])
    boxes.sort(key=lambda b: (b[1] // 40, b[0]))
    return boxes


def key(img, inset, tol=38, outline=48):
    im = np.array(img.convert('RGBA')).astype(int)
    h, w = im.shape[:2]
    x0, y0, x1, y1 = inset[0], inset[1], w - inset[2], h - inset[3]
    sub = im[y0:y1, x0:x1].copy()
    H, W = sub.shape[:2]
    rgb = sub[:, :, :3]
    lum = rgb.mean(axis=2)
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    ref = np.median(border, axis=0)
    bg = np.zeros((H, W), bool)
    q = deque()
    for y in range(H):
        for x in (0, W - 1):
            q.append((y, x))
    for x in range(W):
        for y in (0, H - 1):
            q.append((y, x))
    def ok(y, x):
        return lum[y, x] > outline and np.abs(rgb[y, x] - ref).sum() < tol * 3
    while q:
        y, x = q.popleft()
        if bg[y, x] or not ok(y, x): continue
        bg[y, x] = True
        for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
            yy, xx = y+dy, x+dx
            if 0 <= yy < H and 0 <= xx < W and not bg[yy, xx]: q.append((yy, xx))
    # border pixels that are not bg but are the frame are also removed: only keep
    # the largest blobs not touching bg
    sub[bg, 3] = 0
    # drop specks: small islands (rivets, grain) near the crop's edge
    from scipy import ndimage
    lab, n = ndimage.label(sub[:, :, 3] > 40)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        big = sizes.max()
        for k, s in enumerate(ndimage.find_objects(lab), start=1):
            area = sizes[k - 1]
            cy, cx = (s[0].start + s[0].stop) / 2, (s[1].start + s[1].stop) / 2
            edge = min(cy, cx, H - cy, W - cx)
            if area < big * 0.04 or (area < big * 0.25 and edge < 9):
                sub[lab == k, 3] = 0
    out = Image.fromarray(sub.astype(np.uint8))
    bb = out.getchannel('A').point(lambda a: 255 if a > 40 else 0).getbbox()
    return out.crop(bb) if bb else out

ALL = '--all' in sys.argv
OUT = sys.argv[sys.argv.index('--all') + 1] if ALL else tempfile.mkdtemp(prefix='ui-sprites-')
S = {n: Image.open(os.path.join(SRC, n + '.png')).convert('RGBA') for n in ('sheet1', 'sheet2')}
B = {n: segment(im) for n, im in S.items()}



def clean(img, thr=24):
    """drop the faint halo of near-transparent pixels the generator left"""
    a = np.array(img)
    a[a[:, :, 3] < thr] = 0
    out = Image.fromarray(a)
    bb = out.getchannel('A').getbbox()
    return out.crop(bb) if bb else out

def box(sheet, i, pad=2):
    x0, y0, w, h = B[sheet][i][0], B[sheet][i][1], B[sheet][i][2] - B[sheet][i][0], B[sheet][i][3] - B[sheet][i][1]
    return S[sheet].crop((x0 - pad, y0 - pad, x0 + w + pad, y0 + h + pad))

def split(sheet, rect, dil=0, thr=160, minarea=400):
    """sub-sprites of a merged region, left→right then top→bottom"""
    reg = S[sheet].crop(rect)
    a = np.array(reg)[:, :, 3] > thr
    if dil: a = ndimage.binary_dilation(a, iterations=dil)
    lab, n = ndimage.label(a)
    parts = []
    for s in ndimage.find_objects(lab):
        y0, y1, x0, x1 = s[0].start, s[0].stop, s[1].start, s[1].stop
        if (x1 - x0) * (y1 - y0) < minarea: continue
        parts.append((x0, y0, x1, y1))
    parts.sort(key=lambda p: (p[1] // 30, p[0]))
    return [clean(reg.crop((p[0] - 2, p[1] - 2, p[2] + 2, p[3] + 2))) for p in parts]

def save(name, img):
    path = os.path.join(OUT, name + '.png')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, optimize=True)

one = lambda s, i: clean(box(s, i))
# ---- panels and frames
for n, (s, i) in {
    'panel/wood-vine': ('sheet1', 0), 'panel/parch': ('sheet1', 1), 'panel/purple': ('sheet1', 2), 'panel/dark': ('sheet1', 3),
    'panel/parch-wide': ('sheet1', 7), 'panel/dark-wide': ('sheet1', 9),
    'panel/frame-dark': ('sheet2', 0), 'panel/frame-parch': ('sheet2', 1), 'panel/frame-purple': ('sheet2', 2),
    'header/brand': ('sheet1', 4), 'header/vine-potion': ('sheet1', 6), 'header/vine-purple': ('sheet1', 8), 'header/vine-parch': ('sheet1', 11),
    'header/wood': ('sheet2', 3), 'header/wood-2': ('sheet2', 8), 'header/wood-3': ('sheet2', 10), 'header/purple': ('sheet2', 17),
    'header/dark': ('sheet2', 4), 'header/dark-2': ('sheet2', 9), 'header/parch': ('sheet2', 11),
    'button/green': ('sheet1', 12), 'button/wood-gold': ('sheet1', 14), 'button/purple': ('sheet1', 15), 'button/tan': ('sheet1', 16),
    'button/red': ('sheet1', 17), 'button/gray': ('sheet1', 18), 'button/green-dark': ('sheet1', 23), 'button/wood': ('sheet1', 24),
    'button/purple-dark': ('sheet1', 25), 'button/tan-dark': ('sheet1', 26), 'button/red-dark': ('sheet1', 27), 'button/gray-dark': ('sheet1', 28),
    'chip/coin': ('sheet1', 19), 'chip/potion': ('sheet1', 20), 'chip/gold': ('sheet1', 21),
    'bar/green': ('sheet1', 29), 'bar/blue': ('sheet1', 44), 'slider/heat': ('sheet1', 51), 'slider/coin': ('sheet1', 52),
    'slider/track': ('sheet2', 54),
    'control/plus': ('sheet2', 34), 'control/minus': ('sheet2', 35), 'control/close': ('sheet2', 36), 'control/check': ('sheet2', 37),
    'control/help': ('sheet2', 38), 'control/info': ('sheet2', 39), 'control/back': ('sheet2', 47), 'control/forward': ('sheet2', 48),
    'control/fastforward': ('sheet2', 49), 'control/fullscreen': ('sheet2', 50), 'control/grid': ('sheet2', 51), 'control/star': ('sheet2', 52),
    'control/down': ('sheet1', 42), 'control/up': ('sheet1', 43),
    'form/checkbox': ('sheet2', 40), 'form/checkbox-on': ('sheet2', 41), 'form/checkbox-purple': ('sheet2', 42), 'form/radio': ('sheet2', 43),
    'form/radio-on': ('sheet2', 44), 'form/switch-on': ('sheet2', 45), 'form/switch-off': ('sheet2', 46),
    'slot/wood': ('sheet2', 64), 'slot/gold': ('sheet2', 65), 'slot/purple': ('sheet2', 66), 'slot/dark': ('sheet2', 67), 'slot/bottle-outline': ('sheet2', 68),
    'slot/dark-1': ('sheet1', 47), 'slot/dark-2': ('sheet1', 48), 'slot/dark-3': ('sheet1', 49),
    'slot/icon-potion': ('sheet1', 64), 'slot/icon-drop': ('sheet1', 65), 'slot/icon-leaf': ('sheet1', 66), 'slot/icon-mushroom': ('sheet1', 67),
    'slot/icon-crystal': ('sheet1', 68), 'slot/icon-star': ('sheet1', 69), 'slot/icon-trophy': ('sheet1', 72), 'slot/icon-help': ('sheet1', 73),
    'slot/icon-scroll': ('sheet1', 74), 'slot/icon-gear': ('sheet1', 75), 'slot/icon-door': ('sheet1', 76), 'slot/icon-trash': ('sheet1', 77),
    'tab/counter': ('sheet1', 58), 'tab/brew': ('sheet1', 59), 'tab/wilds': ('sheet1', 60), 'tab/garden': ('sheet1', 61), 'tab/trials': ('sheet1', 62), 'tab/book': ('sheet1', 63),
    'tab/counter-on': ('sheet1', 79), 'tab/brew-on': ('sheet1', 80), 'tab/wilds-on': ('sheet1', 81), 'tab/garden-on': ('sheet1', 82), 'tab/trials-on': ('sheet1', 83), 'tab/book-on': ('sheet1', 84),
    'item/honeycap': ('sheet2', 83), 'item/dawnblossom': ('sheet2', 84), 'item/dewpear': ('sheet2', 85), 'item/crystal': ('sheet2', 86),
    'item/mushroom': ('sheet2', 87), 'item/flower-white': ('sheet2', 88), 'item/berries': ('sheet2', 89),
    'deco/bookshelf': ('sheet2', 71), 'deco/potion-shelf': ('sheet2', 72), 'deco/lantern': ('sheet2', 63), 'deco/candlestick': ('sheet2', 73),
    'deco/cauldron': ('sheet2', 74), 'deco/barrel-tap': ('sheet2', 80), 'deco/table': ('sheet2', 81), 'deco/supply-shelf': ('sheet2', 82),
    'deco/crate': ('sheet2', 97), 'deco/hourglass': ('sheet2', 96), 'deco/counter': ('sheet2', 98), 'deco/gold-pile': ('sheet2', 101),
    'deco/potion-shelf-four': ('sheet1', 71), 'deco/candles': ('sheet1', 46), 'deco/candle': ('sheet1', 50), 'deco/stool': ('sheet1', 70),
    'deco/vine-shelf': ('sheet1', 45), 'deco/crates': ('sheet1', 104), 'deco/books': ('sheet1', 105), 'deco/sack': ('sheet1', 106), 'deco/scrolls': ('sheet1', 107),
    'deco/fence-short': ('sheet1', 85), 'deco/fence-long': ('sheet1', 86), 'deco/fence': ('sheet1', 116), 'deco/sign': ('sheet1', 115), 'deco/sign-small': ('sheet1', 118),
    'deco/bush-1': ('sheet1', 94), 'deco/bush-2': ('sheet1', 95), 'deco/bush-3': ('sheet1', 90), 'deco/hedge-1': ('sheet1', 129), 'deco/hedge-2': ('sheet1', 130),
    'deco/grass': ('sheet1', 119), 'deco/flower-pink': ('sheet1', 121), 'deco/flower-white': ('sheet1', 122), 'deco/sprout': ('sheet1', 125), 'deco/rock': ('sheet1', 124), 'deco/rock-2': ('sheet1', 126),
    'deco/vine-1': ('sheet1', 91), 'deco/vine-2': ('sheet1', 92), 'deco/vine-3': ('sheet1', 101), 'deco/vine-4': ('sheet1', 102), 'deco/vine-arch': ('sheet1', 112), 'deco/vine-5': ('sheet1', 113),
    'deco/stone-wall-1': ('sheet1', 93), 'deco/stone-wall-2': ('sheet1', 103), 'deco/stone-wall-3': ('sheet1', 114),
    'deco/divider': ('sheet1', 117), 'deco/divider-2': ('sheet1', 131), 'deco/divider-3': ('sheet1', 89),
    'deco/corner-1': ('sheet1', 98), 'deco/corner-2': ('sheet1', 99),
    'fx/arcane': ('sheet2', 113), 'fx/love': ('sheet2', 114), 'fx/sparkle-pink': ('sheet2', 115), 'fx/sparkle-gold': ('sheet2', 116),
    'fx/sparkle-gold-2': ('sheet2', 117), 'fx/sparkle-violet': ('sheet2', 118), 'fx/bubbles': ('sheet2', 119), 'fx/fire': ('sheet2', 120),
    'fx/water': ('sheet2', 121), 'fx/frost': ('sheet2', 122), 'fx/nature': ('sheet2', 123), 'fx/death': ('sheet2', 124),
    'crop/flower': ('sheet2', 69), 'crop/crystal': ('sheet2', 70),
}.items():
    save(n, one(s, i))

# ---- merged groups split apart
for n, im in zip(['banner/potion', 'banner/book', 'banner/moon', 'banner/leaf'], split('sheet1', (1230, 5, 1536, 152))): save(n, im)
for n, im in zip(['banner/potion-2', 'banner/book-2', 'banner/crystal'], [one('sheet2', 5), one('sheet2', 6), one('sheet2', 7)]): save(n, im)
for n, im in zip(['button/lightgreen', 'button/lightgreen-hover'], split('sheet1', (130, 264, 242, 370))): save(n, im)
for n, im in zip(['plot/dark', 'plot/stone', 'plot/brown'], split('sheet1', (8, 724, 358, 820), dil=0, thr=200)): save(n, im)
for n, im in zip(['plot/fungal', 'plot/water'], split('sheet1', (356, 724, 600, 820), dil=0, thr=200)): save(n, im)
for n, im in zip(['plot/wide-brown', 'plot/wide-dry', 'plot/wide-fungal', 'plot/wide-rich'], split('sheet1', (5, 822, 608, 918), dil=0, thr=200)): save(n, im)
save('heart/full', clean(S['sheet1'].crop((1084, 342, 1130, 386)), 40)); save('heart/empty', clean(S['sheet1'].crop((1214, 342, 1262, 386)), 40))
hs = split('sheet2', (1260, 556, 1500, 594))
if hs: save('heart/full-b', hs[0]); save('heart/empty-b', hs[-1])
for n, im in zip(['cauldron/fire'], [clean(S['sheet1'].crop((1293, 290, 1502, 524)))]): save(n, im)
for n, im in zip(['seed/bean', 'seed/bean-2', 'seed/bean-3'], [one('sheet2', 90), one('sheet2', 91), one('sheet2', 92)]): save(n, im)
for n, im in zip(['ore/stone', 'ore/stone-2', 'ore/gold'], [one('sheet2', 93), one('sheet2', 94), one('sheet2', 95)]): save(n, im)
for n, im in zip(['crop/sprout', 'crop/seedling'], [one('sheet2', 112) if False else clean(S['sheet2'].crop((610, 655, 655, 702))), clean(S['sheet2'].crop((664, 648, 708, 702)))]): save(n, im)
for k, n in zip(range(102, 106), ['growth/1', 'growth/2', 'growth/3', 'growth/4']): save(n, one('sheet2', k))
for k, n in zip(range(106, 112), ['wall/1', 'wall/2', 'wall/3', 'wall/4', 'wall/5', 'wall/6']): save(n, one('sheet2', k))

# ---- icons keyed out of their backings (they replace the procedural 12×12 icons)
ICON = {
    # wood icon slots
    'flask': ('sheet1', 64, 7), 'drop': ('sheet1', 65, 7), 'leaf': ('sheet1', 66, 7), 'shroom': ('sheet1', 67, 7), 'gem': ('sheet1', 68, 7),
    'star': ('sheet1', 69, 7), 'trophy': ('sheet1', 72, 7), 'help': ('sheet1', 73, 7), 'scroll': ('sheet1', 74, 7), 'gear': ('sheet1', 75, 7),
    'door': ('sheet1', 76, 7), 'trash': ('sheet1', 77, 7),
    # the purple room tabs
    'stall': ('sheet1', 79, 10), 'cauldron': ('sheet1', 80, 10), 'tree': ('sheet1', 81, 10), 'seedling': ('sheet1', 82, 10), 'dropper': ('sheet1', 83, 10), 'book': ('sheet1', 84, 10),
    # effect slots
}
for n, (s, i, inset) in ICON.items():
    save('icon/' + n, clean(key(box(s, i, 0), (inset, inset, inset, inset)), 40))
DARK = {'swirl': 113, 'rose': 114, 'awaken': 118, 'spark': 116, 'bubbles': 119, 'flame': 120, 'snow': 122, 'skull': 124}
for n, i in DARK.items():
    save('icon/' + n, clean(key(box('sheet2', i, 0), (9, 9, 9, 9), tol=26, outline=0), 40))
for n, i in {'plus': 34, 'minus': 35, 'close': 36, 'check': 37, 'grid': 51}.items():
    save('icon/' + n, clean(key(box('sheet2', i, 0), (11, 11, 11, 11), tol=34, outline=40), 40))
# standalone sprites used as icons as they are
save('icon/coin', clean(key(S['sheet1'].crop((802, 288, 838, 323)), (0, 0, 0, 0), tol=30, outline=70), 40))
save('icon/heart', clean(S['sheet1'].crop((1084, 342, 1130, 386)), 40))
save('icon/clock', Image.open(os.path.join(OUT, 'deco/hourglass.png')))
save('icon/stone', Image.open(os.path.join(OUT, 'ore/stone.png')))

for n, im in zip(['bottle/red', 'bottle/blue', 'bottle/violet', 'bottle/amber'], split('sheet2', (395, 640, 580, 712), thr=120)): save(n, im)
save('icon/bottle', Image.open(os.path.join(OUT, 'bottle/violet.png')))
save('icon/jar', Image.open(os.path.join(OUT, 'bottle/blue.png')))
def largest(img, dil=3):
    a = np.array(img); m = ndimage.binary_dilation(a[:, :, 3] > 60, iterations=dil)
    lab, n = ndimage.label(m); sizes = ndimage.sum(m, lab, range(1, n + 1)); k = 1 + int(np.argmax(sizes))
    a[lab != k] = 0; return clean(Image.fromarray(a))
for n in ['cauldron/fire', 'deco/sign', 'deco/sign-small', 'deco/corner-1', 'deco/corner-2', 'deco/fence-long', 'deco/vine-1', 'deco/vine-5', 'deco/barrel-tap', 'deco/cauldron', 'deco/bush-3', 'deco/hedge-1', 'deco/vine-2', 'deco/vine-3']:
    p = os.path.join(OUT, n + '.png'); save(n, largest(Image.open(p)))
# a blank vine header: the baked potion painted over with clean plank
hv = Image.open(os.path.join(OUT, 'header/vine-potion.png'))
patch = hv.crop((120, 0, 160, hv.height))
hv.paste(patch, (64, 0)); save('header/vine', hv)
# blank room-tab backgrounds: the icon and label painted over with the tab's own
# plank (tiled from a clean strip inside its frame), for live icons and labels
def blank_tab(src, dst, inset, strip):
    t = Image.open(os.path.join(OUT, src)).copy()
    w, h = t.size
    arr = np.array(t)
    inner = arr[inset:h - inset, inset:w - inset, :3].reshape(-1, 3)
    med = np.median(inner, axis=0).astype(np.uint8)
    rows = np.array([np.median(arr[y, inset:w - inset, :3], axis=0) for y in range(h)]).astype(np.uint8)
    for y in range(inset, h - inset):
        arr[y, inset:w - inset, :3] = rows[y] // 2 + med // 2
        arr[y, inset:w - inset, 3] = 255
    save(dst, Image.fromarray(arr))
blank_tab('tab/brew.png', 'tab/blank', 6, 7)
blank_tab('tab/brew-on.png', 'tab/blank-on', 9, 10)
save('icon/bag', Image.open(os.path.join(OUT, 'deco/sack.png')))

# the brand plate's box caught the top of the header under it: clear that strip
b = Image.open(os.path.join(OUT, 'header/brand.png')).copy()
arr = np.array(b); arr[78:, 30:428] = 0
save('header/brand', clean(Image.fromarray(arr)))


# ---- ship: only the sprites the game references, palette-quantized
def referenced():
    used = set()
    for d in ('src', 'styles'):
        for base, _, files in os.walk(os.path.join(ROOT, d)):
            for f in files:
                if f.endswith(('.js', '.css')):
                    used.update(re.findall(r'assets/ui/([a-z0-9/-]+)\.png', open(os.path.join(base, f), encoding='utf8').read()))
    icons = open(os.path.join(ROOT, 'src', 'ui', 'icons.js'), encoding='utf8').read()
    m = re.search(r'SPRITE_ICONS = new Set\(\[([^\]]*)\]', icons)
    used.update('icon/' + n for n in re.findall(r"'([a-z0-9-]+)'", m.group(1)))
    return sorted(used)

if not ALL:
    dest = os.path.join(ROOT, 'assets', 'ui')
    shutil.rmtree(dest, ignore_errors=True)
    for name in referenced():
        src = os.path.join(OUT, name + '.png')
        if not os.path.exists(src): sys.exit(f'missing sprite: {name}')
        im = Image.open(src).convert('RGBA')
        q = im.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
        os.makedirs(os.path.dirname(os.path.join(dest, name)), exist_ok=True)
        q.save(os.path.join(dest, name + '.png'), optimize=True)
    shutil.rmtree(OUT)
    print(f'{len(referenced())} sprites → assets/ui')
else:
    print('library →', OUT)
