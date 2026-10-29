// Little sprites for the rabbits' recovered remains (bones, pelts, ash
// lumps) in lists. Every wild ingredient is drawn procedurally from its
// visual identity instead (rendering/species-sprites.js). Drawn with
// integer rectangles at a low art resolution and shown with
// nearest-neighbour upscaling.


/** @param {CanvasRenderingContext2D} ctx */
function R(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
/** @param {number[]} rgb 0..1 @param {number} [k] brightness */
function css(rgb, k = 1) {
  return `rgb(${Math.round(Math.min(255, rgb[0] * 255 * k))},${Math.round(Math.min(255, rgb[1] * 255 * k))},${Math.round(Math.min(255, rgb[2] * 255 * k))})`;
}
/** @param {number[]} a @param {number[]} b @param {number} t */
function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/**
 * Draw remains (a bone, a pelt, or a lump) in a 16×16 cell.
 * @param {CanvasRenderingContext2D} ctx @param {number} x @param {number} y
 * @param {string} shape bone | fur | anything else (a lump) @param {number[]} color sRGB 0..1 @param {number} [fill] 0..1
 */
export function drawRaw(ctx, x, y, shape, color, fill = 1) {
  const c = css(color), d = css(color, 0.62), hi = css(mix(color, [1, 1, 1], 0.45)), k = '#1a1218';
  const s = Math.max(0.35, fill);
  const P = (px, py, w, h, col) => R(ctx, x + px, y + py, w, h, col);
  switch (shape) {
    case 'bone': {
      // a little bone: a shaft with two round knobs at each end
      const hl = Math.max(1, Math.round(4 * s)), l = 8 - hl, r = 8 + hl;
      P(l - 1, 6, r - l + 2, 4, k);
      for (const kx of [l - 2, r - 1]) { P(kx - 1, 4, 5, 5, k); P(kx - 1, 7, 5, 5, k); }
      P(l, 7, r - l, 2, c); P(l, 8, r - l, 1, d);
      for (const kx of [l - 2, r - 1]) { P(kx, 5, 3, 3, c); P(kx, 8, 3, 3, c); P(kx, 10, 3, 1, d); P(kx, 5, 1, 1, hi); }
      P(l + 1, 7, Math.max(1, r - l - 2), 1, hi);
      break;
    }
    case 'fur': {
      // a pelt: a soft hide with leg tabs at the corners, a ragged furry edge and a tufted texture
      const hw = Math.max(3, Math.round(6 * s)), x0 = 8 - hw, x1 = 8 + hw;
      P(x0 - 1, 6, x1 - x0 + 2, 7, k);
      P(x0 - 2, 5, 3, 2, k); P(x1 - 1, 5, 3, 2, k); P(x0 - 2, 12, 3, 2, k); P(x1 - 1, 12, 3, 2, k);
      P(x0, 6, x1 - x0, 6, c);
      P(x0 - 1, 6, 2, 1, c); P(x1 - 1, 6, 2, 1, c); P(x0 - 1, 12, 2, 1, d); P(x1 - 1, 12, 2, 1, d);
      // ragged fur along the top edge
      for (let x = x0; x < x1; x += 2) P(x, 5, 1, 1, (x & 2) ? k : c);
      for (let y = 7; y < 12; y++) for (let x = x0 + ((y & 1) ? 1 : 0); x < x1; x += 3) P(x, y, 1, 1, y < 9 ? hi : d);
      P(x0, 11, x1 - x0, 1, d);
      break;
    }
    default: { // stone
      const w = Math.round(6 + 6 * s);
      P(8 - w / 2, 9, w, 6, k); P(9 - w / 2, 9, w - 2, 5, c); P(9 - w / 2, 9, w - 3, 1, hi); P(10 - w / 2, 13, w - 3, 1, d);
    }
  }
}

/** A 16×16 canvas with a remains sprite (for lists and the shelf). */
export function rawSprite(shape, color, fill = 1) {
  const cv = document.createElement('canvas');
  cv.width = 16; cv.height = 16;
  const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  drawRaw(ctx, 0, 0, shape, color, fill);
  return cv;
}

