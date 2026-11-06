"""Build the animals' sprites from the animal atlas sheet
(art/animals/source/animal-atlas.webp): for each of the 21 kinds its four
colour variants and its four-frame animation, reconstructed as pixel art.

  python3 scripts/build-animal-sprites.py

The sheet is a soft, lossy picture of pixel art (about 2.7 screen pixels to
an art pixel, not aligned to any grid), so each sprite is recovered rather
than copied: its card's background is flooded away from the border, the
best-fitting pixel grid is found for it, each cell takes the colour at its
centre, and the colours are snapped to the sprite's own small palette. The
animation frames are drawn in one cream colour on the sheet; each variant's
frames are those frames recoloured into the variant's palette (by
lightness) and inked round in its darkest colour.

Writes src/rendering/animal-sprites.js (the sprites, palette-indexed),
src/game/animal-variants.js (each variant's coat colour) and, for review,
art/animals/sprites/<kind>.png (variants, then each variant's frames).
"""
import json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
P = 2.7
PF = 1.9
PANEL_X = [44, 513, 984]           # left edge of the first tile in each panel column
ROW_Y = [153, 282, 410, 535, 660, 783, 909]
TILE_STEP = 61.3
TILE_W, TILE_H = 54, 52
KINDS = [['rabbit', 'cat', 'toad'], ['salamander', 'deer', 'badger'], ['dove', 'fox', 'ermine'], ['snail', 'rat', 'hare'],
         ['otter', 'beetle', 'cavemoth'], ['wisp', 'cloudray', 'mimic'], ['shroudmoth', 'axolotl', 'scarab']]

def main_part(a):
    H,W=a.shape; lab=np.zeros((H,W),int); n=0; sizes=[0]
    for y in range(H):
        for x in range(W):
            if a[y,x] and not lab[y,x]:
                n+=1; st=[(y,x)]; lab[y,x]=n; c=0
                while st:
                    yy,xx=st.pop(); c+=1
                    for dy in (-1,0,1):
                        for dx in (-1,0,1):
                            Y,X=yy+dy,xx+dx
                            if 0<=Y<H and 0<=X<W and a[Y,X] and not lab[Y,X]: lab[Y,X]=n; st.append((Y,X))
                sizes.append(c)
    if n<=1: return a
    best=int(np.argmax(sizes))
    keep=lab==best
    # a small part within two pixels of the body (a spark, an antenna tip) stays; anything bigger or farther is cut
    grown=keep.copy()
    for _ in range(2): grown=grown|np.pad(grown,1)[2:,1:-1]|np.pad(grown,1)[:-2,1:-1]|np.pad(grown,1)[1:-1,2:]|np.pad(grown,1)[1:-1,:-2]
    for k in range(1,n+1):
        if k!=best and ((sizes[k]<=6 and (grown&(lab==k)).any()) or sizes[k]>=0.25*sizes[best]): keep|=lab==k
    return keep

def kmeans(X, k, it=12):
    # deterministic init: farthest point
    cs=[X[np.argmax(((X-X.mean(0))**2).sum(1))]]
    while len(cs)<k:
        d=np.min([((X-c)**2).sum(1) for c in cs],0); cs.append(X[np.argmax(d)])
    C=np.array(cs,float)
    for _ in range(it):
        lab=np.argmin(((X[:,None,:]-C[None])**2).sum(2),1)
        for j in range(k):
            if (lab==j).any(): C[j]=X[lab==j].mean(0)
    return C, lab

def grid(crop, bg, p=P, thr=48, k=7, mask=None):
    H,W,_=crop.shape
    pass
    best=None
    for ox in np.arange(0,p,p/8):
        for oy in np.arange(0,p,p/8):
            nx=int((W-ox)//p); ny=int((H-oy)//p)
            err=0; cells=[]
            for j in range(ny):
                y0=int(round(oy+j*p)); y1=int(round(oy+(j+1)*p))
                for i in range(nx):
                    x0=int(round(ox+i*p)); x1=int(round(ox+(i+1)*p))
                    blk=crop[y0:y1,x0:x1].reshape(-1,3)
                    err+=((blk-blk.mean(0))**2).sum()
            if best is None or err<best[0]: best=(err,ox,oy)
    _,ox,oy=best
    nx=int((W-ox)//p); ny=int((H-oy)//p)
    g=np.zeros((ny,nx,3)); a=np.zeros((ny,nx),bool)
    for j in range(ny):
        for i in range(nx):
            cy=oy+(j+0.5)*p; cx=ox+(i+0.5)*p
            y0,y1=int(np.floor(cy-0.6)),int(np.ceil(cy+0.6)); x0,x1=int(np.floor(cx-0.6)),int(np.ceil(cx+0.6))
            blk=crop[y0:y1,x0:x1].reshape(-1,3); bb=bg[y0:y1,x0:x1].reshape(-1,3) if bg is not None else None
            c=blk.mean(0)
            g[j,i]=c
            a[j,i]=(mask[y0:y1,x0:x1].mean()>0.5) if mask is not None else np.sqrt(((c-bb.mean(0))**2).sum())>thr
    # palette snap
    X=g[a]
    if len(X)>=k:
        C,lab=kmeans(X,k)
        g[a]=C[lab]
    # keep the body: the largest 8-connected part, and parts touching it within a pixel (a wisp's spark)
    a=main_part(a)
    # drop isolated specks
    ys,xs=np.nonzero(a)
    for y,x in zip(ys,xs):
        n=a[max(0,y-1):y+2,max(0,x-1):x+2].sum()-1
        if n==0: a[y,x]=False
    out=np.zeros((ny,nx,4),np.uint8); out[...,:3]=np.clip(g,0,255); out[...,3]=a*255
    # trim
    ys,xs=np.nonzero(a)
    return out[ys.min():ys.max()+1, xs.min():xs.max()+1]

from collections import deque
PANEL=np.array([28,18,34],float)
TILE=np.array([44,35,50],float)
def sprite_mask(c, thr=13):
    """what a flood from the crop's border through the card's and the panel's background does not reach"""
    H,W,_=c.shape
    # background: the card's colour, the panel's, or any shade between them (its border, its shadow, its gradient)
    d=TILE-PANEL; t=np.clip(((c-PANEL)@d)/(d@d),-0.2,1.25)
    near=np.sqrt(((c-(PANEL+t[...,None]*d))**2).sum(2))
    bgl=near<thr
    seen=np.zeros((H,W),bool); q=deque()
    for y in range(H):
        for x in (0,W-1):
            if bgl[y,x] and not seen[y,x]: seen[y,x]=True; q.append((y,x))
    for x in range(W):
        for y in (0,H-1):
            if bgl[y,x] and not seen[y,x]: seen[y,x]=True; q.append((y,x))
    while q:
        y,x=q.popleft()
        for yy,xx in ((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
            if 0<=yy<H and 0<=xx<W and bgl[yy,xx] and not seen[yy,xx]: seen[yy,xx]=True; q.append((yy,xx))
    m=~seen
    # background trapped inside (between a raised tail and the back): bg-like pockets of some size
    pocket=m&bgl
    H,W=m.shape; done=np.zeros_like(pocket)
    for y in range(H):
        for x in range(W):
            if pocket[y,x] and not done[y,x]:
                st=[(y,x)]; done[y,x]=True; comp=[]
                while st:
                    yy,xx=st.pop(); comp.append((yy,xx))
                    for Y,X in ((yy+1,xx),(yy-1,xx),(yy,xx+1),(yy,xx-1)):
                        if 0<=Y<H and 0<=X<W and pocket[Y,X] and not done[Y,X]: done[Y,X]=True; st.append((Y,X))
                if len(comp)>=10:
                    for yy,xx in comp: m[yy,xx]=False
    return m.astype(float)

def _run_near(on, want):
    runs=[];s=None
    for i,v in enumerate(list(on)+[False]):
        if v and s is None: s=i
        if not v and s is not None: runs.append((s,i)); s=None
    runs=[r for r in runs if r[1]-r[0]>=40]
    return min(runs, key=lambda r: abs(r[0]-want)) if runs else (want, want+TILE_W)

def tile_rect(im, nx, ny):
    """the card's real bounds near its nominal place (the sheet's spacing drifts by a few pixels):
    its sides from the sprite-free strip along its top, its top and bottom from its sprite-free left margin"""
    wx0, wy0 = nx-14, ny-12
    win=im[wy0:ny+TILE_H+12, wx0:nx+TILE_W+14]
    on=np.sqrt(((win-PANEL)**2).sum(2))>6
    top=on[12+3:12+7].all(0)
    cx=_run_near(top, 14)
    col=on[:, cx[0]+2:cx[0]+5].all(1)|on[:, cx[1]-5:cx[1]-2].all(1)
    cy=_run_near(col, 12)
    return wx0+cx[0], wy0+cy[0], wx0+cx[1], wy0+cy[1]

def tiles(im, kind_row, kind_col):
    Y=ROW_Y[kind_row]; X=PANEL_X[kind_col]
    out=[]
    for v in range(4):
        x0,_,_,_=tile_rect(im, int(round(X+v*TILE_STEP)), Y)
        c=im[Y-3:Y+TILE_H+4, x0-3:x0+TILE_W+3]
        out.append(grid(c, None, mask=sprite_mask(c)))
    return out

def frames(im, kind_row, kind_col):
    """the four animation frames right of the separator: blobs on the panel background"""
    Y=ROW_Y[kind_row]; X=PANEL_X[kind_col]
    x0=X+262; x1=X+432
    c=im[Y-2:Y+44, x0:x1]
    pb=np.array([28,18,34],float)
    bg=np.broadcast_to(pb,c.shape).copy()
    d=np.sqrt(((c-pb)**2).sum(2))>40
    colsum=d.sum(0)
    # split into 4 by gaps
    on=colsum>0; segs=[]; s=None
    for i,v in enumerate(list(on)+[False]):
        if v and s is None: s=i
        if not v and s is not None:
            segs.append([s,i]); s=None
    # merge segments separated by tiny gaps
    merged=[]
    for sg in segs:
        if merged and sg[0]-merged[-1][1]<=4: merged[-1][1]=sg[1]
        else: merged.append(sg)
    merged=[m for m in merged if m[1]-m[0]>=8]
    res=[]
    for a,b in merged[:4]:
        sub=c[:, max(0,a-3):b+3]
        m=(np.sqrt(((sub-PANEL)**2).sum(2))>40).astype(float)
        res.append(grid(sub,None,p=PF,k=6,mask=m))
    return res, len(merged)


# ---------------------------------------------------------------- recolouring, inking, output

def lum(c):
    return (0.299 * c[..., 0] + 0.587 * c[..., 1] + 0.114 * c[..., 2]) / 255

def recolour(frame, variant):
    """a cream animation frame in a variant's colours: each pixel takes the variant's colour at the same lightness quantile"""
    va = variant[..., 3] > 0; fa = frame[..., 3] > 0
    vc = variant[va][:, :3].astype(float)
    body = np.abs(vc - INK).sum(1) > 0          # its colours, not its outline's ink
    if body.sum() >= 4: vc = vc[body]
    vl = lum(vc); order = np.argsort(vl, kind='stable'); vc = vc[order]
    fl = lum(frame[..., :3].astype(float))
    ranks = np.argsort(np.argsort(fl[fa], kind='stable'), kind='stable')
    q = ranks / max(1, fa.sum() - 1)
    out = frame.copy()
    out[fa, :3] = vc[np.clip(np.round(q * (len(vc) - 1)).astype(int), 0, len(vc) - 1)]
    # its edge cleaned to the same crisp ink contour as the standing sprite's
    return crisp(out)

def ink(im, col, only=None):
    """a one-pixel outline round the sprite (or round `only` of it) in the given colour"""
    a = (im[..., 3] > 0) if only is None else only
    H, W = a.shape
    o = np.zeros((H + 2, W + 2, 4), np.uint8); o[1:-1, 1:-1] = im
    A = np.zeros((H + 2, W + 2), bool); A[1:-1, 1:-1] = a
    O = o[..., 3] > 0
    ring = (~O) & (np.roll(A, 1, 0) | np.roll(A, -1, 0) | np.roll(A, 1, 1) | np.roll(A, -1, 1))
    o[ring, :3] = np.clip(col, 0, 255); o[ring, 3] = 255
    return o

# the one ink every sprite is outlined in (the sheet's contour colour)
INK = np.array([20, 12, 24], float)

def neighbours4(m):
    p = np.pad(m, 1)
    return p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]

def crisp(im):
    """the standing sprite's soft, blurred contour made one crisp line of ink, as the animation frames have:
    contour pixels (dark at the silhouette's edge, and the dark pixels just inside them) become ink;
    where the body meets the clear without a contour, an ink pixel is added outside"""
    a = im[..., 3] > 0
    L = lum(im[..., :3].astype(float))
    edge = a & neighbours4(~a)
    inner = a & ~edge
    m = np.median(L[inner]) if inner.any() else np.median(L[a])
    dark = L < min(0.36, m - 0.12)
    contour = edge & dark
    # the blur's second, inner ring of the contour
    contour |= a & dark & neighbours4(contour) & neighbours4(edge)
    out = im.copy()
    out[contour, :3] = INK
    # wherever the light body touches the clear, outline it
    body = a & ~contour
    o = ink(out, INK, only=body)
    return o

def eye_of(im):
    """the eye: a dark pixel inside the body, toward the front and the top"""
    H, W = im.shape[:2]; a = im[..., 3] > 0; L = lum(im[..., :3].astype(float))
    best = None
    for y in range(1, H - 1):
        for x in range(1, W - 1):
            if not a[y, x] or L[y, x] > 0.3 or x < W * 0.45 or y > H * 0.65: continue
            if not (a[y - 1, x] and a[y + 1, x] and a[y, x - 1] and a[y, x + 1]): continue
            if L[y, x] > min(L[y - 1, x], L[y + 1, x], L[y, x - 1], L[y, x + 1]) + 0.02 and L[y, x] > 0.15: continue
            score = x - y * 0.5
            if best is None or score > best[0]: best = (score, x, y)
    return [best[1], best[2]] if best else [round(W * 0.8), round(H * 0.3)]

def encode(im):
    a = im[..., 3] > 0
    cols = sorted({tuple(int(v) for v in im[y, x, :3]) for y, x in zip(*np.nonzero(a))})
    if len(cols) > 36: sys.exit('too many colours')
    idx = {c: '0123456789abcdefghijklmnopqrstuvwxyz'[i] for i, c in enumerate(cols)}
    rows = []
    for y in range(im.shape[0]):
        rows.append(''.join(idx[tuple(int(v) for v in im[y, x, :3])] if a[y, x] else '.' for x in range(im.shape[1])))
    return {'w': int(im.shape[1]), 'h': int(im.shape[0]), 'pal': ['#%02x%02x%02x' % c for c in cols], 'px': '/'.join(rows), 'eye': eye_of(im)}

def main():
    im = np.array(Image.open(os.path.join(ROOT, 'art', 'animals', 'source', 'animal-atlas.webp')).convert('RGB')).astype(float)
    data, coats = {}, {}
    os.makedirs(os.path.join(ROOT, 'art', 'animals', 'sprites'), exist_ok=True)
    for kr in range(7):
        for kc in range(3):
            kind = KINDS[kr][kc]
            vs = [crisp(v) for v in tiles(im, kr, kc)]
            fs, n = frames(im, kr, kc)
            if len(vs) != 4 or n < 4: sys.exit(f'{kind}: {len(vs)} variants, {n} frames')
            anim = [[recolour(f, v) for f in fs[:4]] for v in vs]
            data[kind] = {'variants': [encode(v) for v in vs], 'frames': [[encode(f) for f in row] for row in anim]}
            # each variant's coat: the mean of its body (not its outline or eye)
            coats[kind] = []
            for v in vs:
                c = v[v[..., 3] > 0][:, :3].astype(float); c = c[lum(c) > 0.2] if (lum(c) > 0.2).sum() else c
                coats[kind].append([round(float(x) / 255, 3) for x in c.mean(0)])
            # a review sheet: the variants on the first row, each variant's frames below
            W = 24
            sheet = Image.new('RGBA', (W * 4, W * 5), (0, 0, 0, 0))
            for i, v in enumerate(vs): sheet.alpha_composite(Image.fromarray(v, 'RGBA'), (i * W, 0))
            for r, row in enumerate(anim):
                for i, f in enumerate(row): sheet.alpha_composite(Image.fromarray(f, 'RGBA'), (i * W, (r + 1) * W))
            sheet.save(os.path.join(ROOT, 'art', 'animals', 'sprites', f'{kind}.png'))
    head = '// GENERATED by scripts/build-animal-sprites.py from art/animals/source/animal-atlas.webp — do not edit by hand.\n'
    with open(os.path.join(ROOT, 'src', 'rendering', 'animal-sprites.js'), 'w') as f:
        f.write(head + '// Each kind\'s four colour variants (standing) and, per variant, its four\n// animation frames, facing right: palette-indexed rows (\'.\' clear), and the eye.\n\n')
        f.write('/** @type {Record<string, {variants: AnimalSprite[], frames: AnimalSprite[][]}>} */\n')
        f.write('export const ANIMAL_SPRITES = ' + json.dumps(data, separators=(',', ':')) + ';\n\n')
        f.write('/** @typedef {{w:number, h:number, pal:string[], px:string, eye:number[]}} AnimalSprite */\n')
    with open(os.path.join(ROOT, 'src', 'game', 'animal-variants.js'), 'w') as f:
        f.write(head + '// The coat colour (sRGB 0..1) of each kind\'s four variants on the animal atlas:\n// a look\'s coat picks the variant it is drawn as.\n\n')
        f.write('/** @type {Record<string, number[][]>} */\nexport const VARIANT_COATS = ' + json.dumps(coats) + ';\n')
    print(f'{len(data)} kinds written')

if __name__ == '__main__':
    main()
