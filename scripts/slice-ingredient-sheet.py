import sys, json
from PIL import Image, ImageDraw
import numpy as np
from collections import deque
src=Image.open(sys.argv[1]).convert('RGBA'); im=np.array(src)
A=im[:,:,3]
a=A>60
cols=[(27, 277), (293, 544), (561, 819)]
rows=[(2, 177), (181, 342), (346, 486), (489, 631)]
def runs(v,minlen=3,gap=0):
    out=[];s=None;last=-10
    for i,x in enumerate(v):
        if x:
            if s is None: s=i
            last=i
        elif s is not None and i-last>gap:
            if last-s+1>=minlen: out.append((s,last))
            s=None
    if s is not None: out.append((s,last))
    return out
def valleys(cnt, k):
    # split into k segments at minima near equal positions
    n=len(cnt); cuts=[0]
    for j in range(1,k):
        c=int(n*j/k); lo=max(0,c-n//(3*k)); hi=min(n,c+n//(3*k))
        m=lo+int(np.argmin(cnt[lo:hi])); cuts.append(m)
    cuts.append(n); return cuts
def flood(mask, seeds):
    h,w=mask.shape; out=np.zeros_like(mask); q=deque()
    for (y,x) in seeds:
        if mask[y,x] and not out[y,x]: out[y,x]=1; q.append((y,x))
    while q:
        y,x=q.popleft()
        for dy in (-1,0,1):
            for dx in (-1,0,1):
                yy,xx=y+dy,x+dx
                if 0<=yy<h and 0<=xx<w and mask[yy,xx] and not out[yy,xx]:
                    out[yy,xx]=1; q.append((yy,xx))
    return out
TOPS=[[31,30,31],[29,29,30],[27,26,27],[25,24,25]]
cells=[]
dbg=Image.new('RGBA',src.size,(30,30,30,255)); dbg.alpha_composite(src); d=ImageDraw.Draw(dbg)
for bi,(r0,r1) in enumerate(rows):
  for bj,(c0,c1) in enumerate(cols):
    blk=a[r0:r1+1,c0:c1+1]
    cnt=blk.sum(1)
    # banner end: first row after index 10 where count drops below 60% of max banner
    top=TOPS[bi][bj]
    body=blk[top:]
    rc=valleys(body.sum(1).astype(float),4)
    cc=valleys(body.sum(0).astype(float),5)
    for i in range(4):
      for j in range(5):
        y0=r0+top+rc[i]; y1=r0+top+rc[i+1]; x0=c0+cc[j]; x1=c0+cc[j+1]
        sub=A[y0:y1,x0:x1]>8
        core=A[y0:y1,x0:x1]>100
        ys,xs=np.nonzero(core)
        if len(ys)==0: print('empty',bi,bj,i,j); continue
        cy,cx=int(np.median(ys)),int(np.median(xs))
        # seeds: core pixels within central region
        h,w=sub.shape
        seeds=[(y,x) for y,x in zip(ys,xs) if abs(y-h/2)<h*0.3 and abs(x-w/2)<w*0.3]
        m=flood(sub,seeds)
        ys,xs=np.nonzero(m)
        by0,by1,bx0,bx1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        cells.append(dict(biome=bi*3+bj,row=i,col=j,x=int(x0+bx0),y=int(y0+by0),w=int(bx1-bx0),h=int(by1-by0)))
        d.rectangle([x0+bx0,y0+by0,x0+bx1-1,y0+by1-1],outline=(255,0,0,255))
        np.save if False else None
        crop=im[y0:y1,x0:x1].copy(); crop[:,:,3]=crop[:,:,3]*m
        Image.fromarray(crop[by0:by1,bx0:bx1]).save(f'{sys.argv[2]}/b{bi*3+bj:02d}_r{i}_c{j}.png')
dbg.save(sys.argv[2]+'/../debug.png')
json.dump(cells,open(sys.argv[2]+'/../cells.json','w'))
import collections
print(len(cells), collections.Counter((c['w'],c['h']) for c in cells).most_common(5), max(c['w'] for c in cells), max(c['h'] for c in cells), min(c['w'] for c in cells))
