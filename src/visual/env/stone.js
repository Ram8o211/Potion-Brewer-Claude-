// The cobbled stone the caverns are built of (cave.js): ground, pillars,
// roof and walls share this one texture, so they read as one rock.

import { hash2 } from '../noise.js';
import { mixPacked } from '../color.js';

/**
 * The cobbled stone texture: rounded stones of a few colours packed in a
 * darker mortar, each lit along its upper left and shaded underneath, with
 * single-pixel speckles. A pure function of the pixel.
 * @param {number} x @param {number} y
 * @param {{stones:number[], mortar:number, s:number, seed:number, flat?:number}} o
 */
export function cobble(x, y, o) {
  const s = o.s, gx = Math.floor(x / s), gy = Math.floor(y / s), fl = o.flat ?? 1.3;
  let d1 = 1e9, d2 = 1e9, bx = 0, by = 0, id = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = gx + i, cy = gy + j;
    const px = (cx + 0.15 + hash2(cx, cy, o.seed) * 0.7) * s, py = (cy + 0.15 + hash2(cx, cy, o.seed + 1) * 0.7) * s;
    const dx = x + 0.5 - px, dy = (y + 0.5 - py) * fl, d = dx * dx + dy * dy;
    if (d < d1) { d2 = d1; d1 = d; bx = dx; by = dy / fl; id = cx * 7919 + cy * 104729; }
    else if (d < d2) d2 = d;
  }
  const edge = Math.sqrt(d2) - Math.sqrt(d1);
  if (edge < 0.9) return o.mortar;
  let c = o.stones[Math.floor(hash2(id, 3, o.seed) * o.stones.length)];
  const r = s * 0.45;
  if (by < -r * 0.3 && bx < r * 0.4) c = mixPacked(c, 0xffffffff, by < -r * 0.6 ? 0.2 : 0.11);
  else if (by > r * 0.3 || edge < 1.6) c = mixPacked(c, 0xff000000, 0.22);
  const g = hash2(x, y, o.seed + 9);
  if (g > 0.94) c = mixPacked(c, 0xffffffff, 0.14); else if (g < 0.06) c = mixPacked(c, 0xff000000, 0.25);
  return c;
}
