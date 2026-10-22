// Procedural pixel art for the wilds: deposits of raw ingredients and
// raw-ingredient sprites (the region panoramas live in regions.js). Drawn with integer rectangles from the workshop palette at
// a low art resolution and shown with nearest-neighbour upscaling, so it
// matches the cauldron scene's pixel scale.


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

// ------------------------------------------------------------------ raw ingredient sprites (16×16)
/**
 * Draw a raw ingredient (root, leaf, petal, cap, stone, crystal…) in a 16×16 cell.
 * @param {CanvasRenderingContext2D} ctx @param {number} x @param {number} y
 * @param {string} shape @param {number[]} color sRGB 0..1 @param {number} [fill] 0..1 (deposit stock: smaller when depleted)
 */
export function drawRaw(ctx, x, y, shape, color, fill = 1) {
  const c = css(color), d = css(color, 0.62), hi = css(mix(color, [1, 1, 1], 0.45)), k = '#1a1218';
  const g = '#4f7a31', gd = '#335224';
  const s = Math.max(0.35, fill);
  const P = (px, py, w, h, col) => R(ctx, x + px, y + py, w, h, col);
  switch (shape) {
    case 'root': {
      P(7, 1, 2, 4, g); P(5, 2, 2, 2, gd); P(9, 2, 2, 2, g);
      const h = Math.round(9 * s);
      P(6, 5, 4, h, k); P(7, 5, 2, h, c); P(7, 5, 1, h, hi);
      P(4, 7, 3, 1, d); P(9, 9, 3, 1, d); P(5, 11, 2, 1, d);
      break;
    }
    case 'leaf': case 'moss': {
      const n = Math.max(1, Math.round(3 * s));
      for (let i = 0; i < n; i++) {
        const ox = [4, 8, 6][i], oy = [6, 5, 2][i];
        P(ox - 1, oy, 6, 5, k); P(ox, oy + 1, 4, 3, shape === 'moss' ? d : c); P(ox + 1, oy + 1, 2, 1, hi);
      }
      P(7, 10, 2, 5, gd);
      if (shape === 'moss') { P(3, 12, 10, 3, k); P(4, 12, 8, 2, c); P(5, 12, 2, 1, hi); }
      break;
    }
    case 'petal': case 'flower': case 'clover': {
      P(7, 8, 2, 7, g);
      P(4, 11, 3, 2, g);
      const r = Math.round(2 + 2 * s);
      P(8 - r, 6 - r, r * 2, r * 2, k);
      P(9 - r, 7 - r, r * 2 - 2, r * 2 - 2, c);
      P(7, 5, 2, 2, shape === 'flower' ? '#ffe58a' : shape === 'clover' ? hi : css(color, 1.2));
      P(8 - r + 1, 7 - r, 1, 1, hi);
      break;
    }
    case 'cap': {
      P(7, 9, 2, 6, '#e6d3a5'); P(7, 9, 1, 6, '#f6ead0');
      const w = Math.round(6 + 4 * s);
      P(8 - w / 2, 5, w, 4, k); P(8 - w / 2 + 1, 5, w - 2, 3, c);
      P(8 - w / 2 + 2, 6, 2, 1, hi); P(8, 7, 1, 1, hi);
      break;
    }
    case 'bean': {
      P(6, 3, 2, 9, g);
      for (let i = 0; i < Math.round(3 * s); i++) { P(3 + i * 3, 6 + (i % 2) * 3, 4, 3, k); P(4 + i * 3, 7 + (i % 2) * 3, 2, 1, c); }
      break;
    }
    case 'pepper': {
      P(7, 2, 2, 3, g);
      const h = Math.round(5 + 6 * s);
      P(5, 4, 6, h, k); P(6, 4, 4, h - 1, c); P(6, 5, 1, h - 3, hi);
      break;
    }
    case 'scale': {
      const w = Math.round(6 + 4 * s);
      P(8 - w / 2, 6, w, 7, k); P(9 - w / 2, 7, w - 2, 5, c);
      for (let i = 0; i < w - 3; i += 2) P(9 - w / 2 + i, 8, 1, 3, d);
      P(9 - w / 2, 7, 2, 1, hi);
      break;
    }
    case 'crystal': {
      const h = Math.round(5 + 7 * s);
      P(6, 14 - h, 4, h, k); P(7, 15 - h, 2, h - 1, c); P(7, 15 - h, 1, h - 2, hi);
      P(3, 16 - Math.round(h * 0.6), 3, Math.round(h * 0.6) - 1, k); P(4, 16 - Math.round(h * 0.6), 1, Math.round(h * 0.6) - 2, c);
      P(10, 16 - Math.round(h * 0.7), 3, Math.round(h * 0.7) - 1, k); P(11, 16 - Math.round(h * 0.7), 1, Math.round(h * 0.7) - 2, c);
      break;
    }
    case 'powder': {
      const w = Math.round(6 + 6 * s);
      P(8 - w / 2, 12, w, 3, k); P(9 - w / 2, 11, w - 2, 3, c); P(10 - w / 2, 10, w - 4, 2, c); P(10 - w / 2, 10, 2, 1, hi);
      P(9, 13, 1, 1, d); P(6, 12, 1, 1, d);
      break;
    }
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

/** A 16×16 canvas with a raw sprite (for lists and the shelf). */
export function rawSprite(shape, color, fill = 1) {
  const cv = document.createElement('canvas');
  cv.width = 16; cv.height = 16;
  const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  drawRaw(ctx, 0, 0, shape, color, fill);
  return cv;
}

