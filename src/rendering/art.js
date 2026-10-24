// Pixel-art painting for the workshop. Everything is drawn procedurally with
// integer-aligned rectangles from one cohesive palette, at the same pixel
// density as the materials, so scene and simulation read as one picture.

import { Rng } from '../core/rng.js';

export const PAL = {
  night0: '#0d0a10', night1: '#17121c', night2: '#221a28',
  stone0: '#2c2632', stone1: '#3a3341', stone2: '#4a4252', stone3: '#5d5465', stone4: '#73697b', mortar: '#241e29',
  wood0: '#24160f', wood1: '#3a2416', wood2: '#52321d', wood3: '#6d4527', wood4: '#8b5a31', wood5: '#a9743f',
  iron0: '#121014', iron1: '#1e1b22', iron2: '#2c2831', iron3: '#3d3844', iron4: '#545060', iron5: '#716c7c',
  copper0: '#4a2416', copper1: '#7a3c1f', copper2: '#a8582a', copper3: '#d27f3e', brass: '#e8b45c', brassHi: '#ffe39a',
  fire0: '#7a1f0c', fire1: '#c2410f', fire2: '#ff7a1c', fire3: '#ffb444', fire4: '#ffe58a', fire5: '#fffbe0',
  frost0: '#2a4f7a', frost1: '#4c86c4', frost2: '#8fc7f2', frost3: '#dff4ff',
  parch0: '#8f7651', parch1: '#c2a678', parch2: '#e6d3a5', parch3: '#f6ead0',
  leaf0: '#1f3318', leaf1: '#335224', leaf2: '#4f7a31', leaf3: '#7da447',
  glass: '#9fd4e8', glassHi: '#e9fbff', candle: '#efe2c4', magic: '#8c6cff', magicHi: '#c9b7ff',
};

/** @param {string} hex @returns {number[]} */
export function hex2rgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
/** @param {number[]} c rgb 0..255 or 0..1 @param {number} [scale] */
export function rgbStr(c, scale = 1) {
  const m = c[0] <= 1 && c[1] <= 1 && c[2] <= 1 ? 255 : 1;
  return `rgb(${Math.round(Math.min(255, c[0] * m * scale))},${Math.round(Math.min(255, c[1] * m * scale))},${Math.round(Math.min(255, c[2] * m * scale))})`;
}
/** Mix two hex colours. */
export function mixHex(a, b, t) {
  const A = hex2rgb(a), B = hex2rgb(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
}

/** @param {CanvasRenderingContext2D} ctx */
function R(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

/**
 * Paint the static workshop backdrop: a dark brick wall under a timber
 * beam hung with drying herbs and ivy, shelves of jars, bottles, books and
 * potted plants either side of the cauldron, a barrel, a sack and a mortar
 * on the flagstones, and the warm light of the hearth. Painted at a coarser
 * "deco pixel" (two art pixels on fine screens) so it reads as chunky pixel
 * art behind the fine-pixel simulation.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W @param {number} H
 * @param {{cx:number, floorY:number, scale:number, half?:number, top?:number, jars:{color:number[], form:string}[]}} L
 */
export function paintBackground(ctx, W, H, L) {
  const u = L.scale >= 70 ? 3 : L.scale >= 34 ? 2 : 1;
  const w = Math.ceil(W / u), h = Math.ceil(H / u);
  const cv = makeCanvas(w, h);
  const g = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  paintWorkshop(g, w, h, {
    cx: L.cx / u, floorY: Math.round(L.floorY / u), s: L.scale / u,
    half: (L.half ?? L.scale * 3.1) / u, top: (L.top ?? L.floorY - L.scale * 4) / u, jars: L.jars,
  });
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(cv, 0, 0, w * u, h * u);
}

const DK = '#140e12';

/** @param {CanvasRenderingContext2D} g */
function paintWorkshop(g, W, H, L) {
  const rng = new Rng('backdrop-2');
  const s = L.s, cx = L.cx, fy = L.floorY;
  // ---- brick wall
  R(g, 0, 0, W, fy, '#1e1a22');
  const bh = Math.max(4, Math.round(s * 0.2)), bw = bh * 2 + 3;
  const bricks = ['#2c2632', '#332c3a', '#3a3341', '#2a2430', '#403848'];
  for (let y = 0, row = 0; y < fy; y += bh, row++) {
    const off = row % 2 ? Math.round(bw / 2) : 0;
    for (let x = -off; x < W; x += bw) {
      const c = rng.pick(bricks);
      R(g, x + 1, y + 1, bw - 1, bh - 1, c);
      R(g, x + 1, y + 1, bw - 2, 1, mixHex(c, '#6a6070', 0.35));
      R(g, x + 1, y + bh - 1, bw - 1, 1, mixHex(c, '#0a080c', 0.4));
      R(g, x + 1, y + 1, 1, bh - 2, mixHex(c, '#6a6070', 0.2));
      if (rng.chance(0.3)) R(g, x + 2 + rng.int(0, bw - 5), y + 2 + rng.int(0, Math.max(0, bh - 4)), rng.int(1, 2), 1, mixHex(c, '#0a080c', 0.5));
      if (rng.chance(0.06)) R(g, x + rng.int(1, bw - 3), y + bh - 2, rng.int(2, 4), 1, '#3f5a2a');
    }
  }
  // soot above the hearth and darkness toward the top
  for (let y = 0; y < fy; y++) {
    const a = 0.35 * Math.max(0, 1 - y / (fy * 0.4));
    if (a > 0.01) R(g, 0, y, W, 1, `rgba(8,6,10,${a.toFixed(3)})`);
  }
  // ---- the timber beam with herbs and ivy
  const by = Math.round(s * 0.12), bth = Math.max(3, Math.round(s * 0.2));
  R(g, 0, by - 1, W, bth + 2, DK);
  R(g, 0, by, W, bth, PAL.wood2); R(g, 0, by, W, 1, PAL.wood4); R(g, 0, by + bth - 1, W, 1, PAL.wood1);
  for (let x = rng.int(0, 12); x < W; x += rng.int(10, 24)) R(g, x, by + 1 + rng.int(0, bth - 3), rng.int(4, 9), 1, PAL.wood1);
  const clear = (x, pad = 0) => Math.abs(x - cx) > L.half * 0.62 + pad;
  for (let k = 0; k < 9; k++) {
    const hx = Math.round((k + 0.5) * (W / 9) + rng.range(-4, 4));
    if (!clear(hx, 2)) continue;
    herbBundle(g, rng, hx, by + bth, Math.round(s * rng.range(0.45, 0.75)), rng.pick([['#2f5a24', '#4f8a32', '#7da447'], ['#4a3a6a', '#7a5aa8', '#a88ad8'], ['#5a6a24', '#8a9a32', '#b8c84a']]));
  }
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? rng.int(1, 4) : W - rng.int(2, 5);
    ivy(g, rng, x0, by + bth, Math.round(s * 1.6));
  }
  // ---- shelves of jars, books and plants: above the cauldron where there is
  // headroom (leaving the middle clear for the pouring jar), else at its sides
  /** @type {[number, number, number, number][]} */
  const shelves = [];
  const gap = Math.max(s * 0.55, 6);
  const up = by + bth + Math.round(s * 0.5);
  if (up < L.top - s * 0.15) {
    shelves.push([2, up, Math.round(cx - gap - 2), -1], [Math.round(cx + gap), up, Math.round(W - 2 - cx - gap), 1]);
  }
  const room = Math.max(0, cx - L.half * 0.95);
  const shelfW = Math.min(Math.round(s * 1.9), Math.round(room - 2));
  if (shelfW > s * 0.5) {
    for (const sy of [Math.round(s * 1.05), Math.round(s * 2.3)]) {
      if (sy > fy - s * 0.6 || (shelves.length && sy < up + s * 0.7)) continue;
      shelves.push([Math.round(Math.max(2, cx - L.half * 0.95 - shelfW)), sy, shelfW, -1], [Math.round(Math.min(W - shelfW - 2, cx + L.half * 0.95)), sy, shelfW, 1]);
    }
  }
  let ji = 0;
  for (const [sx, sy, sw, side] of shelves) {
    if (sw < 8) continue;
    shelf(g, sx, sy, sw);
    let x = sx + 2;
    while (x < sx + sw - 4) {
      const kind = rng.next();
      const jar = L.jars.length ? L.jars[ji++ % L.jars.length] : { color: [0.5, 0.6, 0.8], form: 'liquid' };
      if (kind < 0.55) { const jw = Math.max(4, Math.round(s * rng.range(0.16, 0.24))), jh = Math.max(5, Math.round(s * rng.range(0.24, 0.36))); if (x + jw > sx + sw - 2) break; drawJar(g, x, sy - 1 - jh, jw, jh, jar.color, jar.form); x += jw + 1 + rng.int(0, 1); }
      else if (kind < 0.7) { const bw2 = Math.max(4, Math.round(s * 0.2)); if (x + bw2 > sx + sw - 2) break; bottle(g, x, sy - 1, bw2, Math.round(s * rng.range(0.38, 0.5)), jar.color); x += bw2 + 2; }
      else if (kind < 0.85) { const n = rng.int(2, 4); for (let b = 0; b < n && x < sx + sw - 5; b++) { const bh2 = Math.round(s * rng.range(0.24, 0.32)); const c = rng.pick([PAL.copper1, PAL.leaf1, PAL.frost0, '#5a2340', PAL.wood2]); R(g, x - 1, sy - 2 - bh2, 4, bh2 + 1, DK); R(g, x, sy - 1 - bh2, 2, bh2, c); R(g, x, sy - bh2 + 1, 2, 1, PAL.brass); x += 3; } x += 2; }
      else { const pw = Math.max(5, Math.round(s * 0.26)); if (x + pw > sx + sw - 2) break; pottedPlant(g, rng, x, sy - 1, pw); x += pw + 2; }
    }
    // ivy trailing off the outer end of the shelf
    ivy(g, rng, side < 0 ? sx + 1 : sx + sw - 2, sy + 2, Math.round(s * rng.range(0.4, 0.9)));
  }
  // ---- the floor: big flagstones
  R(g, 0, fy, W, H - fy, '#2a2430');
  const fh = Math.max(3, Math.round(s * 0.18));
  for (let y = fy, row = 0; y < H; y += fh, row++) {
    const fw = fh * 3 + row;
    for (let x = -(row * 7) % fw; x < W; x += fw) {
      const c = rng.pick(['#3d3844', '#4a4252', '#433b4a', '#38323f']);
      R(g, x + 1, y + 1, fw - 1, fh - 1, c);
      R(g, x + 1, y + 1, fw - 2, 1, mixHex(c, '#8a8296', 0.3));
    }
  }
  R(g, 0, fy, W, 1, '#0d0a10'); R(g, 0, fy + 1, W, 1, 'rgba(0,0,0,0.4)');
  // ---- props on the floor, clear of the cauldron
  const lx = cx - L.half * 0.95, rx = cx + L.half * 0.95;
  if (lx > s * 0.7) barrel(g, Math.round(lx - s * 0.75), fy + 1, Math.round(s * 0.62), Math.round(s * 0.8));
  if (lx > s * 1.6) { stoneBlock(g, Math.round(lx - s * 1.5), fy + 1, Math.round(s * 0.55), Math.round(s * 0.36)); mortar(g, Math.round(lx - s * 1.38), fy + 1 - Math.round(s * 0.36), Math.round(s * 0.3)); }
  if (W - rx > s * 0.8) sack(g, rng, Math.round(rx + s * 0.25), fy + 1, Math.round(s * 0.62), Math.round(s * 0.66));
  if (W - rx > s * 1.6) pottedPlant(g, rng, Math.round(rx + s * 1.05), fy + 1, Math.round(s * 0.4));
  // ---- hearth glow and vignette
  const gl = g.createRadialGradient(cx, fy, s * 0.2, cx, fy, s * 4.2);
  gl.addColorStop(0, 'rgba(255,150,60,0.22)');
  gl.addColorStop(0.5, 'rgba(255,120,40,0.08)');
  gl.addColorStop(1, 'rgba(255,120,40,0)');
  g.fillStyle = gl;
  g.fillRect(0, 0, W, H);
  const vg = g.createRadialGradient(cx, fy * 0.7, s * 1.8, cx, fy * 0.6, Math.max(W, H) * 0.9);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(6,4,10,0.4)');
  g.fillStyle = vg;
  g.fillRect(0, 0, W, H);
}

/** A shelf plank on two iron brackets. @param {CanvasRenderingContext2D} g */
function shelf(g, x, y, w) {
  R(g, x - 1, y - 1, w + 2, 4, DK);
  R(g, x, y, w, 2, PAL.wood4); R(g, x, y, w, 1, PAL.wood5); R(g, x, y + 2, w, 1, PAL.wood1);
  for (const bx of [x + 2, x + w - 4]) { R(g, bx, y + 3, 2, 3, PAL.iron3); R(g, bx + 1, y + 6, 1, 1, PAL.iron3); }
  R(g, x, y + 3, w, 1, 'rgba(0,0,0,0.35)');
}

/** A bundle of drying herbs hung by a string. @param {CanvasRenderingContext2D} g */
function herbBundle(g, rng, x, y, len, pal) {
  R(g, x, y, 1, 2, PAL.parch1);
  R(g, x - 1, y + 2, 3, 2, PAL.wood3);
  for (let i = 0; i < len; i++) {
    const t = i / len, wd = Math.max(1, Math.round((0.4 + Math.sin(t * Math.PI) * 0.9) * 3));
    R(g, x - wd, y + 4 + i, wd * 2 + 1, 1, DK);
    for (let k = -wd + 1; k < wd; k++) R(g, x + k, y + 4 + i, 1, 1, pal[(k + i + 9) % 3 === 0 ? 2 : (k + i) % 2 ? 1 : 0]);
  }
  for (let k = 0; k < 4; k++) R(g, x + rng.int(-3, 3), y + 4 + rng.int(len - 3, len + 1), 1, 1, pal[1]);
}

/** Ivy trailing down from a point. @param {CanvasRenderingContext2D} g */
function ivy(g, rng, x, y, len) {
  let px = x;
  for (let i = 0; i < len; i++) {
    px += rng.int(-1, 1) * (i % 3 === 0 ? 1 : 0);
    R(g, px, y + i, 1, 1, '#2a4a1f');
    if (i % 3 === 0) { const sd = rng.chance(0.5) ? -1 : 1; R(g, px + sd, y + i, 2 * sd > 0 ? 2 : 1, 2, '#4f8a32'); R(g, px + sd * 2, y + i, 1, 1, '#7da447'); }
  }
}

/** A stoppered bottle with a long neck. @param {CanvasRenderingContext2D} g */
function bottle(g, x, base, w, h, color) {
  const nw = Math.max(2, Math.round(w / 3)), nh = Math.round(h * 0.35), bh = h - nh;
  const nx = x + Math.round((w - nw) / 2);
  R(g, x - 1, base - bh - 1, w + 2, bh + 1, DK);
  R(g, nx - 1, base - h - 1, nw + 2, nh + 1, DK);
  R(g, x, base - bh, w, bh, 'rgba(160,210,230,0.25)');
  const fill = Math.round(bh * 0.65);
  R(g, x, base - fill, w, fill, rgbStr(color, 0.9));
  R(g, x, base - fill, w, 1, rgbStr(color, 1.3));
  R(g, nx, base - h, nw, nh, 'rgba(160,210,230,0.3)');
  R(g, nx, base - h - 1, nw, 2, PAL.wood5);
  R(g, x, base - bh + 1, 1, bh - 2, 'rgba(255,255,255,0.45)');
}

/** A potted plant. @param {CanvasRenderingContext2D} g */
function pottedPlant(g, rng, x, base, w) {
  const ph = Math.max(3, Math.round(w * 0.7));
  R(g, x - 1, base - ph - 1, w + 2, ph + 1, DK);
  R(g, x, base - ph, w, ph, PAL.copper2); R(g, x, base - ph, w, 1, PAL.copper3); R(g, x + w - 2, base - ph + 1, 2, ph - 1, PAL.copper1);
  R(g, x - 1, base - ph - 1, w + 2, 2, PAL.copper3);
  const top = base - ph - 1;
  for (let i = 0; i < w * 2.2; i++) {
    const lx = x + rng.int(-1, w), ly = top - rng.int(0, Math.round(w * 1.2));
    R(g, lx, ly, 2, 1, DK);
    R(g, lx, ly, 1, 1, rng.pick(['#3f7a2a', '#5a9a34', '#7da447', '#2f5a24']));
  }
  for (let i = 0; i < 3; i++) R(g, x + Math.round(w / 2) + rng.int(-1, 1), top - i * 2, 1, 2, '#2f5a24');
}

/** A banded oak barrel. @param {CanvasRenderingContext2D} g */
function barrel(g, x, base, w, h) {
  for (let yy = 0; yy < h; yy++) {
    const t = yy / h, bulge = Math.round(Math.sin(t * Math.PI) * w * 0.08);
    R(g, x - bulge - 1, base - h + yy, w + bulge * 2 + 2, 1, DK);
    R(g, x - bulge, base - h + yy, w + bulge * 2, 1, PAL.wood3);
    for (let k = 3; k < w; k += 4) R(g, x - bulge + k, base - h + yy, 1, 1, PAL.wood2);
    R(g, x - bulge, base - h + yy, 2, 1, PAL.wood4);
    R(g, x + w + bulge - 3, base - h + yy, 3, 1, PAL.wood1);
  }
  for (const t of [0.15, 0.5, 0.85]) { const yy = Math.round(base - h + t * h); R(g, x - 1, yy, w + 2, 2, PAL.iron2); R(g, x - 1, yy, w + 2, 1, PAL.iron4); }
  R(g, x, base - h - 1, w, 2, PAL.wood4); R(g, x + 1, base - h - 1, w - 2, 1, PAL.wood5);
}

/** A burlap sack slumped on the floor. @param {CanvasRenderingContext2D} g */
function sack(g, rng, x, base, w, h) {
  for (let yy = 0; yy < h; yy++) {
    const t = yy / h, wd = Math.round(w * (0.55 + 0.45 * Math.sin(Math.min(1, t * 1.3) * Math.PI / 2)));
    const ox = Math.round((w - wd) / 2);
    R(g, x + ox - 1, base - h + yy, wd + 2, 1, DK);
    R(g, x + ox, base - h + yy, wd, 1, t < 0.15 ? '#a8885a' : '#8a6a42');
    R(g, x + ox, base - h + yy, 2, 1, '#b89868');
    R(g, x + ox + wd - 2, base - h + yy, 2, 1, '#6a5032');
  }
  R(g, x + Math.round(w * 0.3), base - Math.round(h * 0.82), Math.round(w * 0.4), 1, '#4a3420');
  for (let i = 0; i < w; i++) R(g, x + rng.int(2, w - 3), base - rng.int(2, h - 3), 1, 1, '#7a5a38');
}

/** A cut stone block. @param {CanvasRenderingContext2D} g */
function stoneBlock(g, x, base, w, h) {
  R(g, x - 1, base - h - 1, w + 2, h + 1, DK);
  R(g, x, base - h, w, h, PAL.stone2); R(g, x, base - h, w, 1, PAL.stone4); R(g, x, base - h, 1, h, PAL.stone3); R(g, x + w - 2, base - h + 1, 2, h - 1, PAL.stone1);
}

/** A stone mortar with its pestle. @param {CanvasRenderingContext2D} g */
function mortar(g, x, base, w) {
  const h = Math.max(3, Math.round(w * 0.6));
  R(g, x - 1, base - h - 1, w + 2, h + 1, DK);
  R(g, x, base - h, w, h, PAL.stone3); R(g, x, base - h, w, 1, PAL.stone4); R(g, x + 1, base - h + 1, w - 2, 1, PAL.stone1);
  for (let i = 0; i < h + 2; i++) R(g, x + w - 2 + Math.round(i * 0.5), base - h - i, 2, 1, i ? PAL.wood4 : PAL.wood5);
}

/**
 * A small reagent jar.
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawJar(ctx, x, y, w, h, color, form) {
  const c = color;
  const glass = form === 'powder' || form === 'solid' ? PAL.parch1 : PAL.glass;
  // body
  R(ctx, x, y + 2, w, h - 2, 'rgba(160,210,230,0.18)');
  const fill = form === 'gas' ? 0.5 : 0.72;
  const fy = y + 2 + Math.round((h - 2) * (1 - fill));
  R(ctx, x, fy, w, y + h - fy, rgbStr(c));
  R(ctx, x, fy, w, 1, rgbStr(c, 1.35));
  if (form === 'powder') for (let k = 0; k < w; k += 2) R(ctx, x + k, fy + 1 + (k % 3), 1, 1, rgbStr(c, 0.7));
  // outline + highlight
  R(ctx, x, y + 2, 1, h - 2, 'rgba(255,255,255,0.35)');
  R(ctx, x + w - 1, y + 2, 1, h - 2, 'rgba(0,0,0,0.35)');
  R(ctx, x, y + h - 1, w, 1, 'rgba(0,0,0,0.4)');
  // cork / lid
  R(ctx, x + 1, y, w - 2, 2, form === 'powder' || form === 'solid' ? PAL.wood4 : PAL.wood5);
  R(ctx, x + 1, y + Math.round(h * 0.45), w - 2, Math.max(1, Math.round(h * 0.18)), glass);
}

/** 4×4 ordered-dither matrix: sixteen levels, so gradients don't step into bands */
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** Smooth value noise on a coarse lattice (hammered-iron dimples). */
function hammer(x, y) {
  const h = (i, j) => {
    let n = (i * 374761393 + j * 668265263) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  };
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = h(i, j) + (h(i + 1, j) - h(i, j)) * sx;
  const b = h(i, j + 1) + (h(i + 1, j + 1) - h(i, j + 1)) * sx;
  return a + (b - a) * sy;
}

/**
 * Pre-render the iron cauldron, legs, rim and handles from the vessel profile.
 * Painted on a chunkier "iron pixel" (two art pixels on big screens) with a
 * dark outline, banded dither shading, a cool reflected rim light, riveted
 * seams on the back wall, a rolled lip, cast claw feet and ring handles.
 * Returns a canvas positioned at (x0,y0) in screen pixels.
 * @param {import('../simulation/cauldron.js').Cauldron} c
 * @param {{scale:number, ox:number, oy:number}} v
 */
export function renderCauldron(c, v) {
  const s = v.scale;
  const wall = 0.16, rim = 0.28;
  const x0 = Math.floor(v.ox + (-c.belly - 0.6) * s), x1 = Math.ceil(v.ox + (c.belly + 0.6) * s);
  const y0 = Math.floor(v.oy + -0.25 * s), y1 = Math.ceil(v.oy + (c.depth + 0.5) * s);
  const w = x1 - x0, h = y1 - y0;
  // iron pixel: p art pixels square
  const p = s >= 70 ? 2 : 1;
  const cw = Math.ceil(w / p), ch = Math.ceil(h / p);
  const S = s / p, u = 1 / S; // coarse px per world unit, world units per coarse px
  const ox = (v.ox - x0) / p, oy = (v.oy - y0) / p;
  const body = makeCanvas(cw, ch);
  const bctx = body.getContext('2d');
  const img = bctx.createImageData(cw, ch);
  const d = img.data;
  const iron = [PAL.iron0, PAL.iron1, PAL.iron2, PAL.iron3, PAL.iron4, PAL.iron5, '#9a95a6'].map(hex2rgb);
  const OUT = hex2rgb('#08070a');
  const put = (px, py, col) => { const o = (py * cw + px) * 4; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255; };
  const band = (lum, px, py) => {
    const t = (BAYER4[(px & 3) + (py & 3) * 4] + 0.5) / 16;
    return Math.max(0, Math.min(6, Math.floor(lum + (t - 0.5) * 0.7 + 0.5)));
  };
  // riveted seams across the back wall: far halves of horizontal hoops, so
  // they arc upward in the middle (the pot is seen from a little above)
  const seams = [c.neck * 0.8, c.neck + (c.depth - c.neck) * 0.55];
  const rivetGap = Math.max(5, Math.round(0.22 * S));
  /** wall pixel (coarse) → nearest wall cell, for dynamic heat glow */
  const wallCells = [];
  for (let py = 0; py < ch; py++) {
    const wy = (py + 0.5 - oy) * u;
    if (wy < -0.02) continue;
    for (let px = 0; px < cw; px++) {
      const wx = (px + 0.5 - ox) * u;
      const dist = c.sample(wx, wy);
      const nx = c.nx, ny = c.ny;
      if (dist <= 0 && wy >= 0) {
        // the inside of the far wall, seen through the cut-away: lit from the
        // upper left, so the right of the bowl catches light; dark in the
        // depths and in the shadow under the lip
        const hw = Math.max(0.05, c.halfWidth(wy));
        const xt = wx / hw;
        const depthT = Math.min(1, wy / c.depth);
        let lum = 1.7 - depthT * 1.2 + xt * 0.5 - xt * xt * 0.4;
        lum += (hammer(wx * 7, wy * 7) - 0.5) * 0.35;
        if (wy < 0.14) lum -= (0.14 - wy) * 6; // shadow cast by the rim
        if (dist > -u * 1.5) lum = Math.min(lum, 0.6); // seam where wall meets bowl
        let k = Math.min(3, band(lum, px, py));
        const k0 = k;
        for (const sy of seams) {
          const yy = sy - 0.07 * (1 - xt * xt);
          const dy = (wy - yy) * S;
          if (dy >= -0.5 && dy < 0.5) k = Math.max(0, k0 - 1);
          else if (dy >= 0.5 && dy < 1.5) k = Math.min(4, k0 + 1);
          // rivets ride the seam, foreshortened toward the sides
          if (Math.abs(xt) < 0.92 && Math.abs(dy + 1) < 1.01) {
            const along = Math.round(Math.asin(Math.max(-1, Math.min(1, xt))) * hw * S);
            const m = ((along % rivetGap) + rivetGap) % rivetGap;
            if (m === 0) k = dy < -1 ? 5 : 4;
            else if (m === 1 && dy > -1.5) k = 1;
          }
        }
        put(px, py, iron[k]);
        continue;
      }
      if (!(dist > 0 && dist < wall)) continue;
      // the wall in section: shaded by its normal, light from the upper left
      let lum = 3.0 - nx * 1.6 - ny * 1.3;
      lum += Math.pow(Math.max(0, -nx * 0.66 - ny * 0.75), 6) * 2.2; // sheen on the upper left of the belly
      lum += (hammer(wx * 9, wy * 9) - 0.5) * 0.9; // hammered dimples
      const outer = wall - dist;
      // reflected light off the hearth along the lower right edge
      if (outer < u * 2.2 && nx * 0.6 + ny * 0.8 > 0.35) lum = Math.max(lum, 3.6);
      if (dist < u * 1.2) lum = 0.6; // inner lip in shadow
      let col = iron[band(lum, px, py)];
      if (outer < u) col = OUT; // silhouette outline
      put(px, py, col);
      if (outer >= u) {
        const cell = c.wallCellAt(Math.max(-c.belly, Math.min(c.belly, wx - nx * dist)), Math.min(c.depth, wy - ny * dist));
        if (cell >= 0) wallCells.push(px, py, cell);
      }
    }
  }
  bctx.putImageData(img, 0, 0);

  const cv = makeCanvas(cw, ch);
  const ctx = cv.getContext('2d');
  const X = (wx) => Math.round(ox + wx * S), Y = (wy) => Math.round(oy + wy * S);

  // cast legs with claw feet, behind the belly
  const legW = Math.max(3, Math.round(0.2 * S));
  const top = Y(c.depth - 0.3), bot = Y(c.depth + 0.4);
  for (const sgn of [-1, 1]) {
    const cx = X(sgn * c.belly * 0.6);
    for (let y = top; y < bot; y++) {
      const t = (y - top) / Math.max(1, bot - top);
      // thick at the hip, a waist, then the foot flares outward
      const half = Math.round(legW * (0.62 - 0.22 * Math.sin(Math.min(1, t / 0.8) * Math.PI) + (t > 0.78 ? (t - 0.78) * 3.2 : 0)) );
      const shift = t > 0.78 ? Math.round(sgn * (t - 0.78) * legW * 1.6) : 0;
      const l = cx - half + shift, r = cx + half + shift;
      R(ctx, l - 1, y, r - l + 2, 1, '#08070a');
      R(ctx, l, y, r - l, 1, PAL.iron2);
      R(ctx, l, y, Math.max(1, Math.round((r - l) * 0.3)), 1, PAL.iron4);
      R(ctx, l + Math.max(1, Math.round((r - l) * 0.3)), y, 1, 1, PAL.iron3);
      R(ctx, r - 1, y, 1, 1, PAL.iron1);
    }
    // claw toes on the hearth
    const fx = cx + Math.round(sgn * legW * 0.35), toe = Math.max(1, Math.round(legW * 0.3));
    for (let k = -1; k <= 1; k++) {
      const tx = fx + k * (toe + 1) - Math.floor(toe / 2);
      R(ctx, tx - 1, bot - 1, toe + 2, 2, '#08070a');
      R(ctx, tx, bot - 1, toe, 1, PAL.iron3);
    }
    R(ctx, cx - legW, bot, legW * 2 + Math.round(legW * 0.7), 1, 'rgba(0,0,0,0.45)');
  }
  ctx.drawImage(body, 0, 0);

  // ring handles hanging from lugs at the neck
  const hy = Y(0.55);
  const ringR = Math.max(3, Math.round(0.14 * S)), ringT = Math.max(1, Math.round(0.045 * S));
  for (const sgn of [-1, 1]) {
    const wallX = X(sgn * (c.halfWidth(0.42) + wall));
    const hx = wallX + sgn * (ringR - 1);
    const lugW = Math.max(2, Math.round(0.08 * S) + 1), lugH = Math.max(3, Math.round(0.12 * S));
    const ly = hy - ringR - Math.round(lugH / 2);
    const lx = sgn > 0 ? wallX - 1 : wallX - lugW + 1;
    R(ctx, lx - 1, ly - 1, lugW + 2, lugH + 2, '#08070a');
    R(ctx, lx, ly, lugW, lugH, PAL.iron3);
    R(ctx, lx, ly, lugW, 1, PAL.iron5);
    R(ctx, lx, ly + lugH - 1, lugW, 1, PAL.iron1);
    // the ring: a pixel annulus, outlined, lit from the upper left
    for (let yy = -ringR - 1; yy <= ringR + 1; yy++) {
      for (let xx = -ringR - 1; xx <= ringR + 1; xx++) {
        const r = Math.hypot(xx + 0.5 * 0, yy);
        if (r > ringR + 0.6 || r < ringR - ringT - 0.6) continue;
        let col;
        if (r > ringR - 0.4 || r < ringR - ringT + 0.4) col = '#08070a';
        else {
          const lit = (-xx - yy) / (r || 1);
          col = lit > 0.55 ? PAL.iron5 : lit > -0.2 ? PAL.iron4 : lit > -0.7 ? PAL.iron3 : PAL.iron2;
        }
        if (ringT === 1 && col === '#08070a' && r < ringR + 0.1 && r > ringR - 1.4) col = PAL.iron4;
        R(ctx, hx + xx, hy + yy, 1, 1, col);
      }
    }
    // the lug's pin passes in front of the ring
    R(ctx, lx, hy - ringR - 1, lugW, 2, PAL.iron4);
  }

  // the rolled lip: an outlined bar each side with rounded ends
  const ry = Y(-0.12), rh = Math.max(4, Y(0.12) - ry);
  for (const sgn of [-1, 1]) {
    const a = X(sgn * (c.mouth - 0.02)), b = X(sgn * (c.mouth + rim));
    const l = Math.min(a, b), r = Math.max(a, b);
    R(ctx, l + 1, ry - 1, r - l - 2, rh + 2, '#08070a');
    R(ctx, l, ry, r - l, rh, '#08070a');
    R(ctx, l + 1, ry, r - l - 2, rh, PAL.iron3);
    R(ctx, l, ry + 1, r - l, rh - 2, PAL.iron3);
    const hiH = Math.max(1, Math.round(rh * 0.3));
    R(ctx, l + 1, ry, r - l - 2, hiH, PAL.iron5);
    R(ctx, l + 1, ry + hiH, r - l - 2, 1, PAL.iron4);
    R(ctx, l + 1, ry + rh - Math.max(1, Math.round(rh * 0.3)), r - l - 2, Math.max(1, Math.round(rh * 0.3)), PAL.iron1);
    // a glint on the outer curl
    const gx = sgn < 0 ? l + 2 : r - 4;
    R(ctx, gx, ry, 2, 1, '#c8c3d2');
  }

  // up-scale the iron pixels to art pixels
  const out = makeCanvas(w, h);
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = false;
  octx.drawImage(cv, 0, 0, cw * p, ch * p);
  const wallPix = [];
  for (let k = 0; k < wallCells.length; k += 3) {
    for (let j = 0; j < p; j++) for (let i = 0; i < p; i++) {
      const fx = wallCells[k] * p + i, fy = wallCells[k + 1] * p + j;
      if (fx < w && fy < h) wallPix.push(fx, fy, wallCells[k + 2]);
    }
  }
  return { canvas: out, x: x0, y: y0, wallPix };
}

/**
 * Paint the lid on iron pixels (S of them per world unit): a flanged iron
 * dome with a turned wooden knob, flange at the bottom.
 * @param {import('../simulation/cauldron.js').Cauldron} c @param {number} S
 */
function paintLid(c, S) {
  const half = Math.round((c.mouth + 0.22) * S);
  const fh = Math.max(2, Math.round(0.1 * S)); // flange
  const dh = Math.max(3, Math.round(0.2 * S)); // dome rise
  const kh = Math.max(3, Math.round(0.13 * S)), kw = Math.max(3, Math.round(0.11 * S)); // knob
  const cw = half * 2 + 2, ch = fh + dh + kh + 3;
  const cv = makeCanvas(cw, ch);
  const ctx = cv.getContext('2d');
  const cx = half + 1, base = ch - 1 - fh; // dome sits on the flange
  const rd = half - Math.max(2, Math.round(0.07 * S));
  const OUT = '#08070a';
  const iron = [PAL.iron0, PAL.iron1, PAL.iron2, PAL.iron3, PAL.iron4, PAL.iron5, '#9a95a6'];
  /** dome height (coarse px) at column offset x */
  const domeH = (x) => (Math.abs(x) >= rd ? 0 : Math.round(dh * Math.sqrt(1 - (x / rd) * (x / rd))));
  for (let x = -rd; x <= rd; x++) {
    const hgt = domeH(x);
    const topY = base - hgt;
    R(ctx, cx + x, topY - 1, 1, 1, OUT);
    for (let y = topY; y < base; y++) {
      const xt = x / rd, yt = (base - y) / Math.max(1, dh);
      let lum = 3.4 - xt * 1.6 + yt * 0.8;
      if (Math.abs(xt + 0.42) < 0.08 && yt > 0.35) lum += 1.6; // a highlight streak
      const t = (BAYER4[((cx + x) & 3) + (y & 3) * 4] + 0.5) / 16;
      R(ctx, cx + x, y, 1, 1, iron[Math.max(1, Math.min(6, Math.floor(lum + (t - 0.5) * 0.8 + 0.5)))]);
    }
  }
  // the flange: a wide outlined band that overhangs the rim
  const fy = base;
  R(ctx, 1, fy - 1, cw - 2, fh + 2, OUT);
  R(ctx, 0, fy, cw, fh, OUT);
  R(ctx, 1, fy, cw - 2, fh, PAL.iron3);
  R(ctx, 1, fy, cw - 2, 1, PAL.iron5);
  R(ctx, 1, fy + fh - 1, cw - 2, 1, PAL.iron1);
  R(ctx, 3, fy, Math.max(2, Math.round(half * 0.3)), 1, '#c8c3d2');
  // turned wooden knob on a little iron collar
  const ky = base - dh - kh;
  R(ctx, cx - kw - 1, base - dh - 2, kw * 2 + 2, 3, OUT);
  R(ctx, cx - kw, base - dh - 1, kw * 2, 1, PAL.iron4);
  R(ctx, cx - Math.ceil(kw / 2) - 1, ky - 1, Math.ceil(kw / 2) * 2 + 2, kh + 1, OUT);
  R(ctx, cx - Math.ceil(kw / 2), ky, Math.ceil(kw / 2) * 2, kh - 1, PAL.wood3);
  R(ctx, cx - Math.ceil(kw / 2), ky, 1, kh - 1, PAL.wood5);
  R(ctx, cx + Math.ceil(kw / 2) - 1, ky, 1, kh - 1, PAL.wood1);
  R(ctx, cx - Math.ceil(kw / 2), ky, Math.ceil(kw / 2) * 2, 1, PAL.wood4);

  return { cv, cw, ch, cx, base, fh, domeH };
}

/**
 * Pre-render the closed lid on the same iron pixel as the cauldron.
 * `topY(wx)` gives the dome's top edge (screen px) above world x, so
 * fittings can sit on it.
 * @param {import('../simulation/cauldron.js').Cauldron} c
 * @param {{scale:number, ox:number, oy:number}} v
 */
export function renderLid(c, v) {
  const s = v.scale;
  const p = s >= 70 ? 2 : 1;
  const S = s / p;
  const { cv, cw, ch, cx, base, fh, domeH } = paintLid(c, S);
  const w = cw * p, h = ch * p;
  const out = makeCanvas(w, h);
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = false;
  octx.drawImage(cv, 0, 0, w, h);
  // the flange's top sits at world y = -0.12, like the old flat lid
  const x = Math.round(v.ox) - cx * p, y = Math.round(v.oy - 0.12 * s) - (ch - 1 - fh) * p;
  return { canvas: out, x, y, topY: (wx) => y + (base - domeH(Math.round(wx * S)) - 1) * p };
}

/**
 * Pre-render the lid when it is off: the very same lid, full size, stood on
 * its rim on the hearth against the left of the belly, dome and knob facing
 * out. It is the closed lid's sprite transposed (a quarter turn and a
 * mirror), so the light still falls from the upper left.
 * @param {import('../simulation/cauldron.js').Cauldron} c
 * @param {{scale:number, ox:number, oy:number}} v
 */
export function renderLidAside(c, v) {
  const s = v.scale;
  const p = s >= 70 ? 2 : 1;
  const S = s / p;
  const { cv, cw, ch } = paintLid(c, S);
  // transposed: the lid's height becomes its width, the flange faces the pot
  const tw = ch, th = cw;
  const t = makeCanvas(tw + 2, th + 1);
  const tctx = t.getContext('2d');
  tctx.imageSmoothingEnabled = false;
  tctx.setTransform(0, 1, 1, 0, 0, 0);
  tctx.drawImage(cv, 0, 0);
  tctx.setTransform(1, 0, 0, 1, 0, 0);
  // contact shadow on the hearth
  R(tctx, 0, th, tw + 2, 1, 'rgba(0,0,0,0.4)');
  const w = (tw + 2) * p, h = (th + 1) * p;
  const out = makeCanvas(w, h);
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = false;
  octx.drawImage(t, 0, 0, w, h);
  // the flange rests against the widest part of the belly, the rim stands
  // where the feet do
  const x = Math.round(v.ox + (-c.belly - 0.1) * s) - tw * p;
  const y = Math.round(v.oy + (c.depth + 0.4) * s) - th * p;
  return { canvas: out, x, y };
}

/** @param {number} w @param {number} h @returns {HTMLCanvasElement} */
export function makeCanvas(w, h) {
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, w);
  cv.height = Math.max(1, h);
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return cv;
}

/**
 * Hearth stones and the frost plate around the cauldron base.
 * @param {CanvasRenderingContext2D} ctx
 */
export function paintHearth(ctx, c, v) {
  const s = v.scale;
  const left = Math.round(v.ox - (c.belly + 0.55) * s), right = Math.round(v.ox + (c.belly + 0.55) * s);
  const top = Math.round(v.oy + (c.depth + 0.25) * s), bot = Math.round(v.oy + (c.depth + 0.7) * s);
  const rng = new Rng('hearth');
  const sw = Math.max(5, Math.round(s * 0.32)), sh = Math.max(3, Math.round(s * 0.16));
  for (let y = top, row = 0; y < bot; y += sh, row++) {
    for (let x = left - (row % 2 ? sw / 2 : 0); x < right; x += sw) {
      const c0 = rng.pick([PAL.stone2, PAL.stone3, PAL.stone2, PAL.stone4]);
      R(ctx, x + 1, y + 1, sw - 1, sh - 1, c0);
      R(ctx, x + 1, y + 1, sw - 2, 1, PAL.stone4);
    }
  }
  R(ctx, left, top, right - left, 1, PAL.stone4);
  // firewood under the cauldron: split logs with pale end grain, and coals
  const fy = Math.round(v.oy + (c.depth + 0.2) * s), lw = Math.round(c.belly * 0.5 * s), lh = Math.max(3, Math.round(s * 0.11));
  for (const [dx, dy, ww] of [[-0.55, 0, 1], [0.05, 0, 1], [-0.25, -1, 0.9]]) {
    const x = Math.round(v.ox + dx * c.belly * s), y = fy + Math.round(dy * lh * 0.8);
    const w2 = Math.round(lw * ww);
    R(ctx, x - 1, y - 1, w2 + 2, lh + 2, PAL.wood0);
    R(ctx, x, y, w2, lh, PAL.wood2); R(ctx, x, y, w2, 1, PAL.wood4); R(ctx, x, y + lh - 1, w2, 1, PAL.wood1);
    for (let k = 3; k < w2 - 3; k += 5) R(ctx, x + k, y + 1 + (k % 2), 3, 1, PAL.wood1);
    R(ctx, x + w2 - lh, y, lh, lh, PAL.parch1); R(ctx, x + w2 - lh + 1, y + 1, Math.max(1, lh - 2), Math.max(1, lh - 2), PAL.parch0);
  }
  for (let k = 0; k < 14; k++) R(ctx, Math.round(v.ox + rng.range(-0.6, 0.6) * c.belly * s), fy + lh + rng.int(-1, 1), 2, 1, rng.pick([PAL.fire0, PAL.iron1, PAL.copper0]));
}

export { R as rect };
