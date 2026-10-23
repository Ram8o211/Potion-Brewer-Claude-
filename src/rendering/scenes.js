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
    case 'bark': {
      // a curled strip of bark with dark fissures
      const w = Math.round(6 + 5 * s);
      P(8 - w / 2, 4, w, 9, k); P(9 - w / 2, 5, w - 2, 7, c);
      for (let i = 0; i < w - 3; i += 3) P(9 - w / 2 + i + 1, 5, 1, 7, d);
      P(9 - w / 2, 5, w - 2, 1, hi); P(8 + w / 2 - 2, 6, 1, 5, css(color, 0.45));
      break;
    }
    case 'berry': {
      // a bunch of round berries hanging from a twig
      P(7, 1, 2, 4, gd); P(9, 2, 3, 1, g);
      const n = Math.max(2, Math.round(5 * s));
      const pos = [[6, 5], [9, 5], [4, 8], [7, 8], [10, 8], [6, 11]];
      for (let i = 0; i < n; i++) { const [px, py] = pos[i]; P(px - 1, py - 1, 5, 5, k); P(px, py, 3, 3, c); P(px, py, 1, 1, hi); P(px + 2, py + 2, 1, 1, d); }
      break;
    }
    case 'bracket': {
      // a half-moon shelf fungus on a stump, with gill lines beneath
      P(1, 3, 3, 12, '#4a3020'); P(2, 3, 1, 12, '#6b4a30');
      const w = Math.round(6 + 6 * s);
      P(4, 6, w, 5, k); P(4, 7, w - 1, 3, c); P(4, 7, w - 2, 1, hi);
      for (let i = 5; i < 4 + w - 1; i += 2) P(i, 9, 1, 1, d);
      if (s > 0.6) { P(4, 11, w - 3, 3, k); P(4, 12, w - 4, 1, c); }
      break;
    }
    case 'sprig': {
      // a stinging sprig: a stem with jagged paired leaves
      P(7, 3, 2, 12, gd);
      const n = Math.max(1, Math.round(3 * s));
      for (let i = 0; i < n; i++) {
        const y0 = 3 + i * 4;
        P(2, y0, 5, 3, k); P(3, y0 + 1, 4, 1, c); P(2, y0 + 1, 1, 1, c);
        P(9, y0 + 1, 5, 3, k); P(9, y0 + 2, 4, 1, c); P(13, y0 + 2, 1, 1, c);
        P(4, y0, 1, 1, hi); P(11, y0 + 1, 1, 1, hi);
      }
      break;
    }
    case 'spike': {
      // a tall spike of shaggy florets
      P(7, 9, 2, 6, g); P(4, 12, 3, 2, g);
      const h = Math.round(5 + 4 * s);
      P(5, 9 - h, 6, h + 1, k);
      for (let y = 10 - h; y < 9; y += 2) { P(5, y, 6, 1, c); P(6, y + 1, 4, 1, d); }
      P(6, 10 - h, 1, 1, hi); P(9, 12 - h, 1, 1, hi);
      break;
    }
    case 'seed': {
      // a dry umbel of ribbed seeds
      P(7, 7, 2, 8, gd);
      const n = Math.max(2, Math.round(5 * s));
      for (let i = 0; i < n; i++) { const px = 2 + i * 2.5; P(px, 3 + (i % 2), 3, 4, k); P(px + 1, 4 + (i % 2), 1, 2, c); P(px + 1, 6 + (i % 2), 6 - px / 2.5, 1, gd); }
      break;
    }
    case 'crust': {
      // flaky crystalline crust heaped on a stone
      const w = Math.round(6 + 6 * s);
      P(8 - w / 2, 12, w, 3, '#5a5450');
      for (let i = 0; i < w; i += 2) { P(8 - w / 2 + i, 9 + (i % 4 === 0 ? 0 : 1), 2, 3, k); P(8 - w / 2 + i, 10 + (i % 4 === 0 ? 0 : 1), 1, 2, c); }
      P(9 - w / 2, 9, 1, 1, hi); P(8, 10, 1, 1, hi);
      break;
    }
    case 'nugget': {
      // a heavy dark nugget with a metallic gleam
      const w = Math.round(5 + 5 * s);
      P(8 - w / 2, 8, w, 6, k); P(9 - w / 2, 8, w - 2, 5, c); P(8 - w / 2 + 1, 7, w - 3, 1, k);
      P(9 - w / 2, 9, w - 3, 1, css(color, 1.9)); P(10 - w / 2, 12, w - 4, 1, d);
      break;
    }
    case 'shard': {
      // a black glass blade with a sharp glint
      const h = Math.round(5 + 7 * s);
      for (let i = 0; i < h; i++) { P(4 + i * 0.6, 14 - i, 3, 1, k); P(5 + i * 0.6, 14 - i, 1, 1, c); }
      P(5 + (h - 2) * 0.6, 15 - h, 1, 1, '#ffffff'); P(5, 13, 1, 1, hi);
      break;
    }
    case 'lily': {
      // a trumpet bloom on a long stem
      P(7, 8, 2, 7, g); P(9, 12, 3, 2, g);
      const r = Math.round(2 + 2 * s);
      P(8 - r - 1, 3, r * 2 + 2, 5, k); P(8 - r, 4, r * 2, 3, c);
      P(8 - r - 1, 2, 2, 2, k); P(7 + r, 2, 2, 2, k); P(8 - r, 3, 1, 1, c); P(8 + r, 3, 1, 1, c);
      P(7, 7, 2, 1, d); P(8 - r, 4, 1, 1, hi);
      break;
    }
    case 'toadstool': {
      // a red cap with white warts on a stout white stem
      P(6, 9, 4, 6, '#e8dcc4'); P(6, 9, 1, 6, '#fff6e6');
      const w = Math.round(7 + 4 * s);
      P(8 - w / 2, 4, w, 6, k); P(9 - w / 2, 5, w - 2, 4, c); P(10 - w / 2, 4, w - 4, 1, k);
      P(9 - w / 2 + 1, 6, 1, 1, '#ffffff'); P(8, 5, 2, 1, '#ffffff'); P(7 + w / 2 - 2, 7, 1, 1, '#ffffff');
      break;
    }
    case 'reed': {
      // a tall stem topped with a velvet head
      P(7, 1, 1, 3, gd); P(7, 9, 2, 6, g);
      const h = Math.round(3 + 3 * s);
      P(6, 3, 4, h + 1, k); P(7, 4, 2, h - 1, c); P(7, 4, 1, 1, hi);
      P(9, 10, 4, 1, g); P(3, 12, 4, 1, g);
      break;
    }
    case 'shell': {
      // a ribbed fan shell with a pearly lip
      const w = Math.round(6 + 5 * s);
      P(8 - w / 2, 7, w, 6, k); P(9 - w / 2, 8, w - 2, 4, c); P(7, 13, 2, 2, k);
      for (let i = 1; i < w - 2; i += 2) P(8 - w / 2 + i, 8, 1, 4, d);
      P(9 - w / 2, 8, w - 2, 1, css(mix(color, [1, 0.9, 1], 0.6)));
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

