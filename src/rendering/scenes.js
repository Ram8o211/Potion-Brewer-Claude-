// Procedural pixel art for the wilds and the trials room: region panoramas,
// deposits of raw ingredients, raw-ingredient sprites and test subjects with
// visible states. Drawn with integer rectangles from the workshop palette at
// a low art resolution and shown with nearest-neighbour upscaling, so it
// matches the cauldron scene's pixel scale.

import { Rng } from '../core/rng.js';
import { PAL } from './art.js';

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

// ------------------------------------------------------------------ region panoramas (art resolution 192×108)
export const SCENE_W = 192;
export const SCENE_H = 108;

/**
 * Paint a region's static panorama.
 * @param {CanvasRenderingContext2D} ctx @param {string} region @param {string} seed
 */
export function paintRegion(ctx, region, seed) {
  const W = SCENE_W, H = SCENE_H;
  const rng = new Rng(`scene:${seed}:${region}`);
  const sky = {
    forest: [[0.36, 0.52, 0.42], [0.2, 0.32, 0.26]], meadow: [[0.55, 0.72, 0.92], [0.78, 0.86, 0.95]], river: [[0.5, 0.66, 0.8], [0.72, 0.8, 0.86]],
    quarry: [[0.66, 0.62, 0.58], [0.82, 0.76, 0.66]], moonfen: [[0.07, 0.07, 0.16], [0.16, 0.18, 0.32]], crags: [[0.3, 0.12, 0.1], [0.62, 0.3, 0.16]],
  }[region] || [[0.5, 0.6, 0.7], [0.7, 0.8, 0.9]];
  for (let y = 0; y < H * 0.55; y++) R(ctx, 0, y, W, 1, css(mix(sky[0], sky[1], y / (H * 0.55))));
  const ground = {
    forest: [[0.18, 0.3, 0.14], [0.11, 0.2, 0.09]], meadow: [[0.42, 0.62, 0.26], [0.3, 0.5, 0.2]], river: [[0.48, 0.52, 0.3], [0.36, 0.42, 0.24]],
    quarry: [[0.52, 0.46, 0.4], [0.4, 0.35, 0.31]], moonfen: [[0.12, 0.18, 0.16], [0.07, 0.11, 0.1]], crags: [[0.24, 0.14, 0.12], [0.15, 0.08, 0.07]],
  }[region] || [[0.4, 0.5, 0.3], [0.3, 0.4, 0.2]];
  // far hills
  const hillC = css(mix(sky[1], ground[0], 0.55));
  let hy = H * 0.45;
  for (let x = 0; x < W; x++) {
    hy += (rng.next() - 0.5) * 1.6;
    hy = Math.max(H * 0.34, Math.min(H * 0.52, hy));
    R(ctx, x, hy, 1, H * 0.6 - hy, hillC);
  }
  for (let y = Math.floor(H * 0.5); y < H; y++) R(ctx, 0, y, W, 1, css(mix(ground[0], ground[1], (y - H * 0.5) / (H * 0.5))));
  // ground speckle (ordered dither keeps the pixel look)
  for (let i = 0; i < 420; i++) {
    const x = rng.int(0, W - 1), y = rng.int(Math.floor(H * 0.52), H - 1);
    R(ctx, x, y, 1, 1, css(ground[0], 0.75 + rng.next() * 0.5));
  }
  if (region === 'forest' || region === 'moonfen') {
    for (let i = 0; i < 9; i++) {
      const x = rng.int(-6, W), h = rng.int(28, 46), top = H * 0.55 - h;
      const trunk = region === 'moonfen' ? '#2a2422' : '#3a2416';
      R(ctx, x + 4, top + 10, 4, h, trunk);
      const leaf = region === 'moonfen' ? [0.12, 0.2, 0.2] : [0.16, 0.32, 0.14];
      for (let r = 0; r < 4; r++) R(ctx, x - 4 + r, top + r * 3, 20 - r * 2, 9, css(leaf, 0.8 + r * 0.12));
    }
  }
  if (region === 'meadow') {
    for (let i = 0; i < 70; i++) {
      const x = rng.int(0, W - 1), y = rng.int(Math.floor(H * 0.58), H - 1);
      R(ctx, x, y, 1, 2, '#335224');
      R(ctx, x, y - 1, 1, 1, rng.pick(['#ffe58a', '#ff9fc7', '#ffffff', '#c9b7ff']));
    }
    R(ctx, W * 0.8, H * 0.12, 9, 9, '#fff3b0');
  }
  if (region === 'river' || region === 'moonfen') {
    let rx = W * 0.35;
    for (let y = Math.floor(H * 0.5); y < H; y++) {
      rx += Math.sin(y * 0.15) * 0.9;
      const w = 10 + (y - H * 0.5) * 0.35;
      R(ctx, rx - w / 2, y, w, 1, region === 'moonfen' ? '#1e3a40' : '#4c86c4');
      if (y % 3 === 0) R(ctx, rx - w / 4 + (y % 7), y, 3, 1, region === 'moonfen' ? '#3f7f7a' : '#8fc7f2');
    }
    if (region === 'river') for (let i = 0; i < 4; i++) {
      const x = rng.int(0, W - 20);
      R(ctx, x + 8, H * 0.3, 2, H * 0.25, '#4a3a20');
      for (let k = 0; k < 7; k++) R(ctx, x + k * 3, H * 0.28 + k, 1, 14 - k, '#7da447');
    }
  }
  if (region === 'quarry' || region === 'crags') {
    for (let i = 0; i < 6; i++) {
      const x = rng.int(-10, W), w = rng.int(24, 44), h = rng.int(16, 34), top = H * 0.56 - h;
      const rock = region === 'crags' ? [0.28, 0.18, 0.16] : [0.55, 0.5, 0.46];
      R(ctx, x, top, w, h, css(rock));
      R(ctx, x, top, w, 2, css(rock, 1.25));
      for (let k = 0; k < 5; k++) R(ctx, x + rng.int(2, w - 4), top + rng.int(3, h - 2), 3, 1, css(rock, 0.75));
    }
    if (region === 'crags') for (let i = 0; i < 4; i++) {
      const x = rng.int(0, W - 10);
      R(ctx, x, H * 0.62, 8, 2, '#ff7a1c'); R(ctx, x + 2, H * 0.62 - 1, 4, 1, '#ffe58a');
    }
  }
  if (region === 'moonfen') {
    R(ctx, W * 0.15, H * 0.1, 7, 7, '#e9fbff'); R(ctx, W * 0.15 + 2, H * 0.1, 5, 5, '#9fb4d8');
    for (let i = 0; i < 30; i++) R(ctx, rng.int(0, W - 1), rng.int(0, Math.floor(H * 0.4)), 1, 1, '#c9b7ff');
  }
}

/**
 * Animated overlay (wisps, birds, sparkles, steam) drawn each frame.
 * @param {CanvasRenderingContext2D} ctx @param {string} region @param {number} t seconds
 */
export function animateRegion(ctx, region, t) {
  const W = SCENE_W, H = SCENE_H;
  if (region === 'moonfen') {
    for (let i = 0; i < 5; i++) {
      const x = (W * (0.15 + i * 0.18) + Math.sin(t * 0.7 + i * 2) * 8) | 0, y = (H * 0.55 + Math.sin(t * 1.3 + i) * 5) | 0;
      R(ctx, x, y, 2, 2, '#8fe0ff'); R(ctx, x - 1, y, 1, 1, '#2a4f7a'); R(ctx, x + 2, y + 1, 1, 1, '#2a4f7a');
    }
  } else if (region === 'meadow' || region === 'forest') {
    for (let i = 0; i < 3; i++) {
      const x = ((t * (8 + i * 3) + i * 60) % (W + 20)) - 10, y = H * (0.15 + i * 0.07) + Math.sin(t * 3 + i) * 2;
      R(ctx, x, y, 1, 1, '#24160f'); R(ctx, x - 1, y - (Math.sin(t * 10 + i) > 0 ? 1 : 0), 1, 1, '#24160f'); R(ctx, x + 1, y - (Math.sin(t * 10 + i) > 0 ? 1 : 0), 1, 1, '#24160f');
    }
  } else if (region === 'crags') {
    for (let i = 0; i < 6; i++) {
      const y = H * 0.6 - ((t * 10 + i * 13) % 30), x = W * (0.1 + i * 0.15) + Math.sin(t + i) * 3;
      R(ctx, x, y, 1, 1, i % 2 ? '#ffb444' : '#73697b');
    }
  } else if (region === 'river') {
    for (let i = 0; i < 4; i++) {
      const y = H * 0.55 + ((t * 6 + i * 11) % (H * 0.45)), x = W * 0.35 + Math.sin(y * 0.15) * 6 + Math.sin(t * 2 + i) * 2;
      R(ctx, x, y, 2, 1, '#dff4ff');
    }
  }
}

// ------------------------------------------------------------------ test subjects (art resolution 48×40)
export const SUBJECT_W = 48;
export const SUBJECT_H = 40;

/**
 * Draw a test subject with its visible state.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} id rabbit | beetle | seedling | stone | wisp
 * @param {{alive:boolean, health:number, marks:Record<string, number>}} st
 * @param {number} t seconds (idle animation)
 * @param {number} [react] 0..1 reaction flash after a dose
 */
export function drawSubject(ctx, id, st, t, react = 0) {
  const W = SUBJECT_W, H = SUBJECT_H;
  const m = st.marks || {};
  ctx.clearRect(0, 0, W, H);
  // enclosure: straw, soil pot, stone plinth or a glass jar
  if (id === 'stone') { R(ctx, 8, 34, 32, 4, '#4a4252'); R(ctx, 8, 34, 32, 1, '#73697b'); }
  else if (id === 'seedling') { R(ctx, 14, 28, 20, 10, '#7a3c1f'); R(ctx, 13, 28, 22, 2, '#a8582a'); R(ctx, 15, 29, 18, 1, '#3a2416'); }
  else if (id === 'wisp') { R(ctx, 12, 6, 24, 32, 'rgba(159,212,232,0.18)'); R(ctx, 12, 6, 1, 32, 'rgba(233,251,255,0.5)'); R(ctx, 35, 6, 1, 32, 'rgba(233,251,255,0.3)'); R(ctx, 11, 4, 26, 3, '#545060'); R(ctx, 11, 37, 26, 2, '#545060'); }
  else { R(ctx, 4, 35, 40, 3, '#8b5a31'); for (let x = 5; x < 44; x += 3) R(ctx, x, 34, 2, 1, '#c2a678'); }
  if (!st.alive) {
    // spent subject
    if (id === 'stone') { for (let i = 0; i < 9; i++) R(ctx, 12 + i * 3, 31 + (i % 3), 3, 2, '#8a8296'); }
    else if (id === 'seedling') { R(ctx, 23, 22, 2, 6, '#5a4330'); R(ctx, 18, 26, 6, 1, '#5a4330'); R(ctx, 25, 25, 5, 1, '#5a4330'); }
    else if (id === 'wisp') { R(ctx, 22, 30, 4, 2, '#3a3341'); }
    else if (id === 'rabbit') { R(ctx, 12, 29, 24, 6, '#8a8296'); R(ctx, 10, 31, 5, 3, '#8a8296'); R(ctx, 13, 30, 1, 1, '#1a1218'); }
    else { R(ctx, 16, 30, 16, 5, '#5a3a20'); for (let k = 0; k < 3; k++) R(ctx, 17 + k * 5, 35, 1, 2, '#1a1218'); }
    return;
  }
  const bob = Math.round(Math.sin(t * 2.2) * 0.8);
  const shake = react > 0 ? Math.round(Math.sin(t * 40) * react * 1.5) : 0;
  const vig = (m.vigor || 0) / 100, love = (m.love || 0) / 100, glow = (m.glow || 0) / 100, burn = (m.burn || 0) / 100, frost = (m.frost || 0) / 100;
  const change = (m.change || 0) / 100, sick = (m.sick || 0) / 100, etch = (m.etch || 0) / 100, growth = (m.growth || 0) / 100;
  // aura glow behind
  if (glow > 0.05) { ctx.fillStyle = `rgba(166,120,255,${Math.min(0.55, glow * 0.7)})`; ctx.fillRect(6, 4, 36, 32); }
  if (burn > 0.05) { ctx.fillStyle = `rgba(255,122,28,${Math.min(0.5, burn * 0.6)})`; ctx.fillRect(8, 10, 32, 26); }
  const tint = (base) => {
    let c = base;
    if (change > 0.05) c = mix(c, [0.4, 0.9, 0.79], Math.min(0.7, change));
    if (sick > 0.05) c = mix(c, [0.55, 0.62, 0.3], Math.min(0.6, sick * 0.8));
    if (frost > 0.05) c = mix(c, [0.75, 0.9, 1], Math.min(0.6, frost));
    return c;
  };
  const x0 = shake;
  if (id === 'rabbit') {
    // a crouching rabbit facing right: round haunch, chest, head, long ears
    const fur = tint([0.93, 0.89, 0.82]), k = '#1a1218';
    const body = css(fur), shade = css(fur, 0.82), dark = css(fur, 0.68), belly = css(mix(fur, [1, 1, 1], 0.4));
    const g = 1 + vig * 0.12;
    const ox = 10 + x0, oy = 34 + bob;
    const ell = (cx, cy, rx, ry, col) => { for (let yy = -ry; yy <= ry; yy++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(ctx, cx - w, cy + yy, w * 2 + 1, 1, col); } };
    ell(ox + 9, oy - 6, Math.round(10 * g) + 1, Math.round(6 * g) + 1, k);
    ell(ox + 19, oy - 8, Math.round(6 * g) + 1, Math.round(5 * g) + 1, k);
    ell(ox + 24, oy - 13, 5, 4, k);
    ell(ox + 9, oy - 6, Math.round(10 * g), Math.round(6 * g), body);
    ell(ox + 19, oy - 8, Math.round(6 * g), Math.round(5 * g), body);
    ell(ox + 9, oy - 3, Math.round(8 * g), 2, shade);
    ell(ox + 20, oy - 5, 3, 2, belly);
    ell(ox + 24, oy - 13, 4, 3, body);
    R(ctx, ox + 26, oy - 14, 1, 1, k);
    R(ctx, ox + 28, oy - 12, 1, 1, '#ff5aa8');
    // ears droop when hurt or frosted
    const droop = st.health < 50 || frost > 0.3 ? 3 : 0;
    R(ctx, ox + 21, oy - 23 + droop, 3, 9 - droop, k); R(ctx, ox + 22, oy - 22 + droop, 1, 8 - droop, body);
    R(ctx, ox + 24, oy - 24 + droop, 3, 10 - droop, k); R(ctx, ox + 25, oy - 23 + droop, 1, 9 - droop, '#ffc7dd');
    ell(ox - 1, oy - 8, 2, 2, k); ell(ox - 1, oy - 8, 1, 1, '#fff6e0');
    R(ctx, ox + 14, oy - 1, 5, 1, dark); R(ctx, ox + 3, oy - 1, 6, 1, dark);
  } else if (id === 'beetle') {
    // a copper-green beetle seen from above: split wing cases, head, legs
    const shell = tint([0.36, 0.62, 0.42]), k = '#1a1218';
    const g = 1 + vig * 0.18;
    const cx = 24 + x0, cy = 22 + bob;
    const rx = Math.round(8 * g), ry = Math.round(9 * g);
    const ell = (x, y, ax, ay, col) => { for (let yy = -ay; yy <= ay; yy++) { const w = Math.round(ax * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ay * ay)))); R(ctx, x - w, y + yy, w * 2 + 1, 1, col); } };
    const leg = Math.round(Math.sin(t * 8) * (react > 0 ? 1 : 0.4));
    for (let l = -1; l <= 1; l++) {
      R(ctx, cx - rx - 4, cy + l * 5 + leg, 5, 1, k); R(ctx, cx - rx - 5, cy + l * 5 + 1 + leg, 1, 2, k);
      R(ctx, cx + rx, cy + l * 5 - leg, 5, 1, k); R(ctx, cx + rx + 4, cy + l * 5 + 1 - leg, 1, 2, k);
    }
    ell(cx, cy, rx + 1, ry + 1, k);
    ell(cx, cy, rx, ry, css(shell));
    R(ctx, cx, cy - ry, 1, ry * 2, css(shell, 0.55));
    ell(cx - 3, cy - 3, 2, 3, css(mix(shell, [1, 1, 1], 0.35)));
    ell(cx + 4, cy + 2, 1, 2, css(shell, 0.75));
    ell(cx, cy - ry - 2, 4, 2, k);
    ell(cx, cy - ry - 2, 3, 1, '#d27f3e');
    R(ctx, cx - 4, cy - ry - 7, 1, 4, k); R(ctx, cx - 5, cy - ry - 8, 1, 1, k);
    R(ctx, cx + 4, cy - ry - 7, 1, 4, k); R(ctx, cx + 5, cy - ry - 8, 1, 1, k);
  } else if (id === 'seedling') {
    const leaf = css(tint([0.42, 0.72, 0.3])), stem = '#335224';
    const h = Math.round(8 + growth * 14);
    const sway = Math.round(Math.sin(t * 1.5) * 1) + x0;
    R(ctx, 23 + sway, 28 - h, 2, h, stem);
    const leaves = 1 + Math.floor(growth * 3);
    for (let i = 0; i < leaves; i++) {
      const ly = 28 - h + 2 + i * 4, side = i % 2 ? 1 : -1;
      R(ctx, 24 + sway + side * 1 + (side < 0 ? -6 : 1), ly, 6, 3, leaf);
      R(ctx, 24 + sway + side * 1 + (side < 0 ? -5 : 2), ly, 3, 1, css(tint([0.66, 0.88, 0.5])));
    }
    if (love > 0.05) { R(ctx, 21 + sway, 28 - h - 4, 6, 4, '#ff5aa8'); R(ctx, 23 + sway, 28 - h - 3, 2, 2, '#ffe58a'); }
  } else if (id === 'stone') {
    const base = tint([0.66, 0.64, 0.6]);
    const w = 26, bx = 11 + x0, by = 20;
    R(ctx, bx - 1, by - 1, w + 2, 15, '#1a1218'); R(ctx, bx, by, w, 14, css(base)); R(ctx, bx, by, w, 2, css(base, 1.2)); R(ctx, bx, by + 11, w, 3, css(base, 0.8));
    // etching pits
    const pits = Math.round(etch * 12);
    for (let i = 0; i < pits; i++) R(ctx, bx + 2 + ((i * 7) % (w - 4)), by + 3 + ((i * 5) % 8), 2, 1, css(base, 0.55));
    if (change > 0.05) for (let i = 0; i < Math.round(change * 6); i++) { R(ctx, bx + 3 + i * 4, by - 3 - (i % 2) * 2, 2, 4, '#5fd4b4'); R(ctx, bx + 3 + i * 4, by - 3 - (i % 2) * 2, 1, 1, '#dff4ff'); }
    if (glow > 0.1) for (let i = 0; i < 4; i++) R(ctx, bx + 4 + i * 5, by + 5 + (i % 2) * 2, 2, 1, '#c9b7ff');
    if (vig > 0.05) R(ctx, bx, by, w, 1, '#e8b45c');
  } else if (id === 'wisp') {
    const pulse = 0.7 + 0.3 * Math.sin(t * 3);
    const col = change > 0.1 ? mix([0.55, 0.88, 1], [0.4, 0.9, 0.79], change) : love > 0.1 ? [1, 0.6, 0.8] : [0.55, 0.88, 1];
    const cx = 24 + x0 + Math.round(Math.sin(t * 1.1) * 3), cy = 20 + bob;
    ctx.fillStyle = css(col, 0.6 * pulse); ctx.fillRect(cx - 6, cy - 6, 12, 12);
    R(ctx, cx - 4, cy - 4, 8, 8, css(col, pulse));
    R(ctx, cx - 2, cy - 2, 4, 4, '#ffffff');
  }
  // overlays: hearts, frost rime, flames, sickness bubbles
  if (love > 0.05 && id !== 'seedling') for (let i = 0; i < 1 + Math.round(love * 3); i++) {
    const hx = 10 + ((i * 13 + Math.floor(t * 4)) % 28), hy = 10 - ((t * 6 + i * 7) % 10);
    R(ctx, hx, hy, 1, 1, '#ff5aa8'); R(ctx, hx + 2, hy, 1, 1, '#ff5aa8'); R(ctx, hx, hy + 1, 3, 1, '#ff5aa8'); R(ctx, hx + 1, hy + 2, 1, 1, '#ff5aa8');
  }
  if (frost > 0.1) for (let i = 0; i < Math.round(frost * 10); i++) R(ctx, 8 + ((i * 11) % 32), 18 + ((i * 7) % 16), 1, 1, '#dff4ff');
  if (burn > 0.1) for (let i = 0; i < Math.round(burn * 6); i++) {
    const fx = 10 + ((i * 9 + Math.floor(t * 8)) % 28), fy = 24 - ((t * 14 + i * 5) % 12);
    R(ctx, fx, fy, 1, 2, i % 2 ? '#ffb444' : '#ff7a1c');
  }
  if (sick > 0.1) for (let i = 0; i < Math.round(sick * 4); i++) { const bx2 = 14 + i * 6, by2 = 14 - ((t * 5 + i * 4) % 8); R(ctx, bx2, by2, 2, 2, '#92cc71'); }
  if (react > 0) { ctx.fillStyle = `rgba(255,255,255,${react * 0.35})`; ctx.fillRect(0, 0, W, H); }
  void PAL;
}
