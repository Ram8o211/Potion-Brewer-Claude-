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
 * Paint the static workshop backdrop.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W @param {number} H
 * @param {{cx:number, floorY:number, scale:number, jars:{color:number[], form:string}[]}} L
 */
export function paintBackground(ctx, W, H, L) {
  const rng = new Rng('backdrop');
  // wall
  R(ctx, 0, 0, W, H, PAL.stone1);
  const bh = Math.max(4, Math.round(L.scale * 0.17));
  const bw = bh * 2 + 2;
  for (let y = 0, row = 0; y < L.floorY; y += bh, row++) {
    const off = row % 2 ? Math.round(bw / 2) : 0;
    for (let x = -off; x < W; x += bw) {
      const shade = rng.next();
      const c = shade < 0.15 ? PAL.stone0 : shade < 0.55 ? PAL.stone1 : shade < 0.9 ? PAL.stone2 : PAL.stone3;
      R(ctx, x + 1, y + 1, bw - 1, bh - 1, c);
      // top highlight & bottom shade per brick
      R(ctx, x + 1, y + 1, bw - 2, 1, mixHex(c === PAL.stone0 ? PAL.stone0 : PAL.stone2, PAL.stone4, 0.35));
      if (rng.chance(0.25)) R(ctx, x + 2 + rng.int(0, bw - 5), y + 2 + rng.int(0, Math.max(0, bh - 4)), 1, 1, PAL.stone0);
    }
    R(ctx, 0, y, W, 1, PAL.mortar);
  }
  // vignette darkening toward the top corners
  const g = ctx.createRadialGradient(L.cx, L.floorY * 0.75, L.scale * 1.5, L.cx, L.floorY * 0.6, Math.max(W, H) * 0.85);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(6,4,10,0.62)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // timber beams
  const beamH = Math.max(5, Math.round(L.scale * 0.22));
  R(ctx, 0, Math.round(L.scale * 0.15), W, beamH, PAL.wood1);
  R(ctx, 0, Math.round(L.scale * 0.15), W, 1, PAL.wood3);
  R(ctx, 0, Math.round(L.scale * 0.15) + beamH - 1, W, 1, PAL.wood0);
  for (let x = 6; x < W; x += Math.round(L.scale * 1.7)) {
    R(ctx, x, Math.round(L.scale * 0.15) + 2, 2, 2, PAL.iron3);
  }

  // window (moonlit) — left of the cauldron when there is room
  const side = (W - L.scale * 6) / 2;
  if (side > L.scale * 0.6 || W > H) {
    const ww = Math.round(L.scale * 0.95), wh = Math.round(L.scale * 1.25);
    const wx = Math.round(Math.max(4, L.cx - L.scale * 3.8 - ww / 2)), wy = Math.round(L.scale * 0.65);
    R(ctx, wx - 2, wy - 2, ww + 4, wh + 4, PAL.wood1);
    const sky = ctx.createLinearGradient(0, wy, 0, wy + wh);
    sky.addColorStop(0, '#1c2350');
    sky.addColorStop(1, '#3a3166');
    ctx.fillStyle = sky;
    ctx.fillRect(wx, wy, ww, wh);
    for (let k = 0; k < 9; k++) R(ctx, wx + rng.int(1, ww - 2), wy + rng.int(1, wh - 2), 1, 1, '#d8d6ff');
    const mr = Math.max(2, Math.round(ww * 0.17));
    ctx.fillStyle = '#f2ecc8';
    ctx.beginPath();
    ctx.arc(wx + ww * 0.68, wy + wh * 0.28, mr, 0, Math.PI * 2);
    ctx.fill();
    R(ctx, wx + ww / 2 - 1, wy, 2, wh, PAL.wood2);
    R(ctx, wx, wy + wh / 2 - 1, ww, 2, PAL.wood2);
    R(ctx, wx - 3, wy + wh + 2, ww + 6, 3, PAL.wood3);
  }

  // shelves with reagent jars on both sides
  const shelfY = [Math.round(L.scale * 1.05), Math.round(L.scale * 2.15)];
  const shelfSpan = Math.round(L.scale * 1.55);
  const sides = W > L.scale * 6.2 ? [L.cx + L.scale * 3.0, L.cx - L.scale * 3.0 - shelfSpan] : [W - shelfSpan - 2, 2];
  let jarIndex = 0;
  for (const sx0 of sides) {
    const sx = Math.round(sx0);
    if (sx + shelfSpan < 0 || sx > W) continue;
    for (const sy of shelfY) {
      // brackets
      R(ctx, sx + 2, sy, 2, 4, PAL.iron3);
      R(ctx, sx + shelfSpan - 4, sy, 2, 4, PAL.iron3);
      R(ctx, sx, sy - 2, shelfSpan, 3, PAL.wood3);
      R(ctx, sx, sy - 2, shelfSpan, 1, PAL.wood5);
      R(ctx, sx, sy + 1, shelfSpan, 1, PAL.wood0);
      // jars and books
      let x = sx + 3;
      while (x < sx + shelfSpan - 6) {
        const kind = rng.next();
        if (kind < 0.62 && L.jars.length) {
          const jar = L.jars[jarIndex++ % L.jars.length];
          const jw = Math.max(4, Math.round(L.scale * (0.16 + rng.next() * 0.06)));
          const jh = Math.max(6, Math.round(L.scale * (0.22 + rng.next() * 0.12)));
          drawJar(ctx, x, sy - 2 - jh, jw, jh, jar.color, jar.form);
          x += jw + 2;
        } else if (kind < 0.85) {
          // books
          const n = rng.int(2, 4);
          for (let b = 0; b < n; b++) {
            const bh2 = Math.round(L.scale * (0.24 + rng.next() * 0.08));
            const c = rng.pick([PAL.copper1, PAL.leaf1, PAL.frost0, PAL.wood2, '#5a2340']);
            R(ctx, x, sy - 2 - bh2, 3, bh2, c);
            R(ctx, x, sy - 2 - bh2 + 2, 3, 1, PAL.brass);
            x += 3;
          }
          x += 2;
        } else {
          // skull / mortar
          const mw = Math.round(L.scale * 0.2);
          R(ctx, x, sy - 2 - mw * 0.6, mw, mw * 0.6, PAL.stone3);
          R(ctx, x + 1, sy - 2 - mw * 0.6, mw - 2, 1, PAL.stone4);
          x += mw + 3;
        }
      }
    }
  }

  // hanging herbs from the beam
  for (let k = 0; k < 6; k++) {
    const hx = Math.round((k + 0.5) * (W / 6) + rng.range(-8, 8));
    if (Math.abs(hx - L.cx) < L.scale * 1.6) continue;
    const top = Math.round(L.scale * 0.15) + beamH;
    const len = Math.round(L.scale * rng.range(0.35, 0.6));
    R(ctx, hx, top, 1, 3, PAL.parch0);
    for (let y = 0; y < len; y++) {
      const wdt = Math.max(1, Math.round((1 - Math.abs(y / len - 0.45)) * 4));
      R(ctx, hx - Math.floor(wdt / 2), top + 3 + y, wdt, 1, y % 3 === 0 ? PAL.leaf3 : y % 2 ? PAL.leaf1 : PAL.leaf2);
    }
  }

  // floor
  R(ctx, 0, L.floorY, W, H - L.floorY, PAL.wood1);
  const ph = Math.max(3, Math.round(L.scale * 0.12));
  for (let y = L.floorY; y < H; y += ph) {
    R(ctx, 0, y, W, 1, PAL.wood0);
    for (let x = rng.int(0, 30); x < W; x += rng.int(18, 40)) R(ctx, x, y, 1, ph, PAL.wood0);
  }
  R(ctx, 0, L.floorY, W, 2, PAL.wood3);
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

/**
 * Pre-render the iron cauldron, legs, rim and handles from the vessel profile.
 * Returns a canvas positioned at (x0,y0) in screen pixels.
 * @param {import('../simulation/cauldron.js').Cauldron} c
 * @param {{scale:number, ox:number, oy:number}} v
 */
/** 4×4 ordered-dither matrix: sixteen levels, so gradients don't step into bands */
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function renderCauldron(c, v) {
  const s = v.scale;
  const wall = 0.16, rim = 0.28;
  const x0 = Math.floor(v.ox + (-c.belly - 0.6) * s), x1 = Math.ceil(v.ox + (c.belly + 0.6) * s);
  const y0 = Math.floor(v.oy + -0.25 * s), y1 = Math.ceil(v.oy + (c.depth + 0.75) * s);
  const w = x1 - x0, h = y1 - y0;
  const cv = makeCanvas(w, h);
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const iron = [PAL.iron0, PAL.iron1, PAL.iron2, PAL.iron3, PAL.iron4, PAL.iron5].map(hex2rgb);
  const rng = new Rng('cauldron');
  /** wall pixel → nearest wall cell, for dynamic heat glow */
  const wallPix = [];
  for (let py = 0; py < h; py++) {
    const wy = (py + y0 + 0.5 - v.oy) / s;
    for (let px = 0; px < w; px++) {
      const wx = (px + x0 + 0.5 - v.ox) / s;
      let dist = c.sample(wx, wy);
      let isRim = false;
      if (wy < 0.12 && wy > -0.12 && Math.abs(wx) < c.mouth + rim && Math.abs(wx) > c.mouth - 0.02) { isRim = true; }
      if (wy < -0.02) continue;
      if (dist <= 0 && wy >= 0 && !isRim) {
        // dark inner back wall of the vessel (seen through the cut-away)
        // a faintly lit back wall: lighter toward the rim, darker in the depths
        const depthT = Math.min(1, wy / c.depth);
        const bayer = (BAYER4[(px & 3) + (py & 3) * 4] + 0.5) / 16;
        const shade = 1.1 - depthT * 1.1 + Math.max(0, 0.6 + dist * 6);
        const k2 = Math.max(0, Math.min(2, Math.floor(shade + bayer)));
        const col2 = iron[k2];
        const o2 = (py * w + px) * 4;
        d[o2] = col2[0]; d[o2 + 1] = col2[1]; d[o2 + 2] = col2[2]; d[o2 + 3] = 255;
        continue;
      }
      if (!(dist > 0 && dist < wall) && !isRim) continue;
      // normal-based shading: light from upper left
      const nx = c.nx, ny = c.ny;
      let lum = 2.2 - nx * 1.4 - ny * 1.1;
      lum += (rng.next() - 0.5) * 0.6; // hammered texture
      if (isRim) lum = wy < -0.06 ? 4.3 : wy < 0.03 ? 3.4 : 1.8;
      if (dist < 0.03 && !isRim) lum -= 0.8; // inner edge shadow
      const k = Math.max(0, Math.min(5, Math.round(lum)));
      const col = iron[k];
      const o = (py * w + px) * 4;
      d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
      if (!isRim) {
        const cell = c.wallCellAt(Math.max(-c.belly, Math.min(c.belly, wx - nx * dist)), Math.min(c.depth, wy - ny * dist));
        if (cell >= 0) wallPix.push(px, py, cell);
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  // legs
  const legW = Math.max(3, Math.round(0.18 * s));
  for (const lx of [-c.belly * 0.62, c.belly * 0.62]) {
    const px = Math.round(v.ox + lx * s - x0 - legW / 2);
    const top = Math.round(v.oy + (c.depth - 0.45) * s - y0);
    const bot = Math.round(v.oy + (c.depth + 0.7) * s - y0);
    R(ctx, px, top, legW, bot - top, PAL.iron2);
    R(ctx, px, top, 1, bot - top, PAL.iron4);
    R(ctx, px - 1, bot - 2, legW + 2, 2, PAL.iron3);
  }
  // ring handles at the neck
  const hy = Math.round(v.oy + 0.55 * s - y0);
  for (const sgn of [-1, 1]) {
    const hx = Math.round(v.ox + sgn * (c.halfWidth(0.55) + wall + 0.06) * s - x0);
    ctx.strokeStyle = PAL.iron4;
    ctx.lineWidth = Math.max(1, Math.round(s * 0.035));
    ctx.beginPath();
    ctx.arc(hx, hy, Math.max(3, Math.round(s * 0.13)), 0, Math.PI * 2);
    ctx.stroke();
  }
  return { canvas: cv, x: x0, y: y0, wallPix };
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
  const top = Math.round(v.oy + (c.depth + 0.55) * s), bot = Math.round(v.oy + (c.depth + 1.0) * s);
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
}

export { R as rect };
