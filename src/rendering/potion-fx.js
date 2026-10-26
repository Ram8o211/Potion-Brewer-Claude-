// The look of each effect inside a brew. Every effect a potion carries
// draws its own pattern in the liquid where it is, as strong as its share
// of the magic there. The patterns are drawn in the potion's own colour —
// lighter, darker and highlight tones of whatever it is dyed — so they
// adapt to every brew, and every one of them moves:
//   vitality        soft mottling breathing with a heartbeat, motes of life rising
//   strength        heavy stepped bands, waving and rolling slowly
//   love            hearts, large and small, drifting up and swaying
//   arcana          four-pointed stars of every size, twinkling in and out
//   transformation  diagonal stripes sliding by, beaded with dots, the hue turning
//   fire            tongues of flame licking upward, flickering, with sparks
//   frost           a frosty pallor, snowflakes of two sizes drifting down
//   acidity         a dense fizz of fine bubbles racing up, popping at the surface
//   toxicity        murky blotches roiling, ringed bubbles rising slowly
//   death           dark smoke swirling, black specks sinking
// Patterns are laid out in screen pixels (so they stay crisp pixel art) and
// animated in time; fluid.js calls potionFx per liquid pixel.

import { EFFECTS } from '../alchemy/effects.js';

const K = Object.fromEntries(EFFECTS.map((e, k) => [e.key, k]));

/** Small integer hash → [0,1). */
function hash01(n) {
  n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
  n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
  n ^= n >>> 15;
  return (n >>> 0) / 4294967296;
}

function cellHash(cx, cy, salt) {
  return hash01(Math.imul(cx, 73856093) ^ Math.imul(cy, 19349663) ^ Math.imul(salt, 83492791));
}

/** Smooth value noise. */
function vnoise(x, y, salt) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const a = cellHash(ix, iy, salt), b = cellHash(ix + 1, iy, salt), c = cellHash(ix, iy + 1, salt), d = cellHash(ix + 1, iy + 1, salt);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}

/**
 * Is there a dot (bubble, star, heart…) at this pixel? The screen is cut
 * into C×C cells scrolled vertically by `scroll` px; a cell holds a dot with
 * probability `prob`. Sets dX, dY (pixel offset from the dot's centre) and
 * dH (the dot's own random value in [0,1)). A margin m keeps shapes of
 * radius ≤ m inside their cell.
 */
let dX = 0, dY = 0, dH = 0;
function cellDot(sx, sy, C, scroll, prob, salt, m) {
  if (prob <= 0) return false;
  const yy = sy + Math.floor(scroll);
  const cx = Math.floor(sx / C), cy = Math.floor(yy / C);
  const h = cellHash(cx, cy, salt);
  if (h >= prob) return false;
  dH = h / prob;
  const span = Math.max(1, C - 2 * m);
  dX = sx - (cx * C + m + Math.floor(cellHash(cx, cy, salt + 7) * span));
  dY = yy - (cy * C + m + Math.floor(cellHash(cx, cy, salt + 13) * span));
  return true;
}

/** Output colour (fc) and the potion's own tones it is drawn with. */
export const fc = [0, 0, 0];
const INK = [0.02, 0.02, 0.03], GROUND = [0, 0, 0];
const base = [0, 0, 0], LIGHT = [0, 0, 0], DARK = [0, 0, 0], HI = [0, 0, 0], DEEP = [0, 0, 0], TMP = [0, 0, 0];
function mixTo(c, t) {
  fc[0] += (c[0] - fc[0]) * t; fc[1] += (c[1] - fc[1]) * t; fc[2] += (c[2] - fc[2]) * t;
}

// pixel masks, rows top to bottom (bit 0 = rightmost column)
const HEART_S = [0b01010, 0b11111, 0b01110, 0b00100]; // 5×4, centre (2, 1)
const HEART_L = [0b0110110, 0b1111111, 0b1111111, 0b0111110, 0b0011100, 0b0001000]; // 7×6, centre (3, 2)
/** @param {number[]} rows @param {number} w @param {number} x @param {number} y */
const inMask = (rows, w, x, y) => x >= 0 && x < w && y >= 0 && y < rows.length && ((rows[y] >> (w - 1 - x)) & 1) === 1;

/** Turn an sRGB colour's hue by `a` radians (keeping its brightness). */
function hueTurn(c, a, out) {
  const cs = Math.cos(a), sn = Math.sin(a), k = 0.57735;
  const d = (1 - cs) / 3, e = k * sn;
  out[0] = c[0] * (cs + d) + c[1] * (d - e) + c[2] * (d + e);
  out[1] = c[0] * (d + e) + c[1] * (cs + d) + c[2] * (d - e);
  out[2] = c[0] * (d - e) + c[1] * (d + e) + c[2] * (cs + d);
  return out;
}

/**
 * Apply the effects' patterns to the liquid colour in fc.
 * @param {Float32Array} f per-effect magic field @param {number} o its offset for this pixel
 * @param {number} mask effects present anywhere @param {number} inv 1 / kernel weight
 * @param {number} sx @param {number} sy screen pixel
 * @param {number} time seconds @param {number} below px below the surface
 * @param {boolean} edge on the liquid's outline
 */
export function potionFx(f, o, mask, inv, sx, sy, time, below, edge) {
  // the potion's tones: everything below is drawn in them
  base[0] = fc[0]; base[1] = fc[1]; base[2] = fc[2];
  for (let c = 0; c < 3; c++) {
    LIGHT[c] = base[c] + (1 - base[c]) * 0.45;
    HI[c] = base[c] + (1 - base[c]) * 0.9;
    GROUND[c] = base[c] * 0.8;
    DARK[c] = base[c] * 0.62;
    DEEP[c] = base[c] * 0.3;
  }
  for (let m = mask, k = 0; m; m >>>= 1, k++) {
    if (!(m & 1)) continue;
    // a square root: a plain brew still shows its character, an awakened one in full
    const A = Math.min(1, Math.sqrt(f[o + k] * inv) * 1.3);
    if (A < 0.03) continue;
    // a slightly deeper ground, so the pattern's light shapes stand out
    // even in a pale potion
    mixTo(GROUND, A * 0.35);
    switch (k) {
      case K.vitality: {
        // lub-dub: two quick swells every 1.2 s brighten the mottling
        const t = (time / 1.2) % 1;
        const beat = Math.exp(-Math.pow((t - 0.1) / 0.05, 2)) + 0.6 * Math.exp(-Math.pow((t - 0.3) / 0.05, 2));
        const n = vnoise(sx * 0.11, sy * 0.11 - time * 0.4, 101);
        if (n > 0.55) mixTo(LIGHT, A * (n - 0.55) * (1.3 + 1.2 * beat));
        else if (n < 0.4) mixTo(DARK, A * (0.4 - n) * 1.1);
        // motes of life rising, swelling into a little cross on the beat
        if (cellDot(sx, sy, 8, time * 5, A * 0.45, 103, 1)) {
          const ax = Math.abs(dX), ay = Math.abs(dY);
          if (ax + ay === 0) mixTo(HI, 0.9);
          else if (ax + ay === 1 && dH > 0.6 && beat > 0.3) mixTo(LIGHT, 0.7);
        }
        break;
      }
      case K.strength: {
        // heavy bands stepping light → dark, waving and rolling slowly
        const wv = sy * 0.09 + Math.sin(sx * 0.075 + time * 0.7) * 0.5 + time * 0.12;
        const step = Math.floor((wv - Math.floor(wv)) * 5);
        const tone = step === 0 ? HI : step === 1 ? LIGHT : step === 3 ? DARK : step === 4 ? DEEP : null;
        if (tone) mixTo(tone, A * (step === 4 ? 0.45 : 0.55));
        break;
      }
      case K.love: {
        // large hearts rise slowly, small ones faster; both sway
        if (cellDot(sx, sy, 16, time * 3, A * 0.45, 211, 4)) {
          const sw = Math.round(Math.sin(time * 1.6 + dH * 9) * 1.5);
          if (inMask(HEART_L, 7, dX + 3 - sw, dY + 2)) mixTo(HI, 0.85);
        }
        if (cellDot(sx, sy, 10, time * 5, A * 0.5, 223, 3)) {
          const sw = Math.round(Math.sin(time * 2.2 + dH * 9) * 1);
          if (inMask(HEART_S, 5, dX + 2 - sw, dY + 1)) mixTo(LIGHT, 0.85);
        }
        if (cellDot(sx, sy, 6, time * 4, A * 0.25, 227, 0) && dX === 0 && dY === 0) mixTo(HI, 0.6);
        break;
      }
      case K.arcana: {
        // four-pointed stars of every size, their arms growing and shrinking
        mixTo(DARK, A * 0.18);
        if (cellDot(sx, sy, 11, time * 0.6, A * 0.75, 307, 4)) {
          const tw = 0.5 + 0.5 * Math.sin(time * (1.2 + dH * 1.8) + dH * 40);
          const L = Math.round((1 + Math.floor(dH * 3.99)) * (0.3 + 0.7 * tw));
          const ax = Math.abs(dX), ay = Math.abs(dY);
          if (ax === 0 && ay === 0 && tw > 0.05) mixTo(HI, 0.6 + 0.4 * tw);
          else if ((ax === 0 && ay <= L) || (ay === 0 && ax <= L)) mixTo(Math.max(ax, ay) === L ? LIGHT : HI, 0.85);
        }
        if (cellDot(sx, sy, 5, 0, A * 0.3, 311, 0) && dX === 0 && dY === 0 && Math.sin(time * 3 + dH * 50) > 0) mixTo(LIGHT, 0.7);
        break;
      }
      case K.transformation: {
        // diagonal stripes sliding by, their hue turning as they pass
        const ph = (sx + sy) / 14 - time * 0.5;
        const fr = ph - Math.floor(ph), band = Math.floor(ph);
        hueTurn(fr < 0.5 ? LIGHT : DARK, Math.sin(band * 1.7 + time * 0.8) * 0.9, TMP);
        mixTo(TMP, A * (fr < 0.08 || (fr > 0.5 && fr < 0.58) ? 0.35 : 0.6));
        // a bead of light running along the middle of each light stripe
        const along = (sx - sy) / 2 + time * 6;
        if (fr > 0.2 && fr < 0.3 && ((Math.floor(along) % 5) + 5) % 5 === 0) mixTo(HI, A * 0.9);
        break;
      }
      case K.fire: {
        // tongues of flame: noise stretched upward and racing up, flickering
        const n = vnoise(sx * 0.16, sy * 0.06 + time * 1.8, 401) * 0.7 + vnoise(sx * 0.4, sy * 0.15 + time * 4, 403) * 0.3;
        const hot = below < 10 ? 0.08 : 0;
        if (n + hot > 0.62) mixTo(n + hot > 0.74 ? HI : LIGHT, A * Math.min(1, (n + hot - 0.62) * 5));
        else if (n < 0.38) mixTo(DARK, A * (0.38 - n) * 2);
        // sparks: a bright point with a curling tail
        if (cellDot(sx, sy, 9, time * 14, A * 0.4, 409, 2)) {
          const cx = Math.round(Math.sin(time * 6 + dH * 20 + dY * 0.9) * 1);
          if (dY === 0 && dX === 0) mixTo(HI, 0.95);
          else if (dY > 0 && dY <= 2 && dX === cx) mixTo(LIGHT, 0.7);
        }
        break;
      }
      case K.frost: {
        // a frosty pallor, rime at the edges, flakes drifting down and swaying
        mixTo(LIGHT, A * (edge ? 0.8 : 0.25));
        if (cellDot(sx, sy, 12, -time * 2, A * 0.75, 503, 4)) {
          const sw = Math.round(Math.sin(time * 1.1 + dH * 9) * 1.5);
          const ax = Math.abs(dX - sw), ay = Math.abs(dY), R = dH > 0.5 ? 3 : 2;
          const arm = (ax === 0 || ay === 0 || ax === ay) && Math.max(ax, ay) <= R;
          const tip = R === 3 && ((ax === 1 && ay === 3) || (ax === 3 && ay === 1));
          if (arm || tip) mixTo(ax + ay === 0 || Math.max(ax, ay) === R ? HI : LIGHT, 0.9);
        }
        if (cellDot(sx, sy, 6, -time * 3, A * 0.25, 509, 0) && dX === 0 && dY === 0) mixTo(HI, 0.7);
        break;
      }
      case K.acidity: {
        // a dense fizz: fine light and dark specks racing up
        if (cellDot(sx, sy, 3, time * 18, A * 0.5, 601, 0) && dX === 0 && dY === 0) mixTo(dH < 0.65 ? HI : DARK, 0.75);
        if (cellDot(sx, sy, 4, time * 11, A * 0.35, 603, 0) && dX === 0 && dY === 0) mixTo(LIGHT, 0.6);
        // popping at the surface
        if (below <= 1 && cellHash(sx, Math.floor(time * 10), 607) < A * 0.45) mixTo(HI, 0.8);
        break;
      }
      case K.toxicity: {
        // murky blotches roiling
        const n = vnoise(sx * 0.07 + time * 0.12, sy * 0.08 - time * 0.2, 701) * 0.75 + vnoise(sx * 0.2 - time * 0.3, sy * 0.2, 703) * 0.25;
        if (n > 0.52) mixTo(DEEP, A * Math.min(0.75, (n - 0.52) * 2.6));
        else if (n < 0.35) mixTo(LIGHT, A * (0.35 - n) * 1.8);
        // ringed bubbles of a few sizes rising slowly, wobbling: a dark rim,
        // a pale glint at the upper left
        if (cellDot(sx, sy, 15, time * 2.2, A * 0.4, 709, 5)) {
          const R = 2.3 + dH * 2.2 + Math.sin(time * 3 + dH * 30) * 0.3;
          const d = Math.hypot(dX, dY);
          if (d < R + 0.5) {
            if (d > R - 0.6) mixTo(DEEP, 0.85);
            else if (dX < 0 && dY < 0 && d > R * 0.3 && d < R * 0.7) mixTo(HI, 0.85);
            else mixTo(DARK, 0.4);
          }
        }
        break;
      }
      case K.death: {
        // dark smoke swirling: noise warped by noise, turning slowly
        const wx = vnoise(sx * 0.05 + time * 0.1, sy * 0.05, 801) * 6, wy = vnoise(sx * 0.05, sy * 0.05 - time * 0.12, 803) * 6;
        const n = vnoise(sx * 0.06 + wx, sy * 0.06 + wy - time * 0.15, 805);
        if (n > 0.5) mixTo(DEEP, A * Math.min(0.85, (n - 0.5) * 2.4));
        else if (n < 0.3) mixTo(LIGHT, A * (0.3 - n) * 1.2);
        // black specks sinking, the odd pale one
        if (cellDot(sx, sy, 8, -time * 3.5, A * 0.4, 809, 1)) {
          if (dX === 0 && dY === 0) mixTo(dH < 0.8 ? INK : HI, 0.9);
          else if (dH < 0.25 && dX === 1 && dY === 0) mixTo(INK, 0.8);
        }
        break;
      }
    }
  }
}
