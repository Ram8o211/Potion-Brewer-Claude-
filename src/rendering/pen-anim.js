// What moves in the farm's enclosures (visual/env/pens.js lists, for each
// pen, its living things as `anim`): the hearth's fire licking up and
// throwing sparks, lantern flames flickering, a spring spilling into a pond
// and the light dancing on still water, snow falling, butterflies flitting
// over flowers, fireflies blinking at dusk, dust drifting in lamplight and
// drops falling from a cellar's moss. Drawn every frame over the pen's
// cached painting, pixel by pixel in the pens' own colours; a pure function
// of the time, so the same moment always looks the same.

/** @typedef {{type:string, [k:string]:any}} PenAnim */

/** A small integer hash → [0, 1). */
function hash(a, b = 0) {
  let n = Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul(b | 0, 0x165667b1);
  n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
  n ^= n >>> 13;
  return (n >>> 0) / 4294967296;
}

/** Smooth 1-D value noise. */
function wave(x) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return hash(i, 7) * (1 - u) + hash(i + 1, 7) * u;
}

/** @param {CanvasRenderingContext2D} ctx */
function px(ctx, x, y, c, w = 1, h = 1) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

const FLAME = ['#fff0a0', '#ffd25a', '#ffb43a', '#f0641e', '#a02a10'];

/** A soft pool of light, in stepped rings, added over what is there. */
function pool(ctx, x, y, r, c, a) {
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = c;
  for (let k = 1; k <= 3; k++) {
    const rr = Math.round((r * k) / 3);
    ctx.globalAlpha = a / 3;
    ctx.fillRect(Math.round(x - rr), Math.round(y - rr * 0.7), rr * 2, Math.round(rr * 1.4));
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

const DRAW = {
  /** a fire on its hearth: tongues of flame rising and falling, sparks drifting up */
  fire(ctx, a, t) {
    const { cx, base, w, h } = a;
    for (let x = cx - w; x < cx + w; x++) {
      const shape = Math.pow(Math.max(0, 1 - Math.abs(x + 0.5 - cx) / w), 0.8);
      const lick = wave(x * 0.45 + t * 5.5) * 0.6 + wave(x * 0.9 - t * 8) * 0.4;
      const hh = Math.round(3 + h * shape * (0.45 + 0.75 * lick));
      for (let j = 0; j < hh; j++) {
        const u = j / hh;
        // the tips break up into licks of flame
        if (j > hh - 3 && hash(x, Math.floor(t * 14) + j) > 0.6) continue;
        px(ctx, x, base - 1 - j, FLAME[u < 0.25 ? 0 : u < 0.45 ? 1 : u < 0.7 ? 2 : u < 0.92 ? 3 : 4]);
      }
    }
    // embers glowing and dimming along the bed
    for (let x = cx - w - 4; x < cx + w + 4; x += 2) if (wave(x * 0.7 + t * 2) > 0.62) px(ctx, x, base, '#ffcf5a');
    for (let i = 0; i < 9; i++) {
      const ph = (t * (0.45 + hash(i, 3) * 0.4) + hash(i, 1)) % 1;
      if (ph > 0.9) continue;
      const sx = cx + (hash(i, 2) - 0.5) * w * 1.2 + Math.sin(t * 2.3 + i * 1.7) * 4 * ph;
      px(ctx, sx, base - h * 0.6 - ph * 26, ph < 0.45 ? '#ffe070' : '#ff7a28');
    }
    pool(ctx, cx, base - h * 0.5, w * 3.2, '#ff7a28', 0.06 + 0.05 * wave(t * 9));
  },
  /** a lantern's flame flickering behind its glass */
  lantern(ctx, a, t) {
    const f = wave(t * 11 + a.x);
    px(ctx, a.x - 1, a.y + 1, f > 0.5 ? '#ffd25a' : '#ffbe48', 3, 4);
    px(ctx, a.x, a.y + (f > 0.65 ? 1 : 2), '#fff8d0', 1, 2);
    pool(ctx, a.x + 0.5, a.y + 3, 16, '#ffb050', 0.03 + 0.05 * f);
  },
  /** water spilling over a lip: streaks running down, a splash where it falls */
  waterfall(ctx, a, t) {
    const off = Math.floor(t * 26);
    for (let y = a.y0; y < a.y1; y++) for (let x = a.x0; x < a.x1; x++) {
      const k = (x * 3 + y - off) % 5;
      px(ctx, x, y, k === 0 ? '#e8f6ff' : k === 1 ? '#9ccaf0' : x === a.x0 ? '#36649e' : '#6a9ccc');
    }
    for (let i = 0; i < 5; i++) {
      const ph = (t * 2.2 + i / 5) % 1;
      px(ctx, a.x0 - 1 + hash(i, Math.floor(t * 2.2 + i / 5)) * (a.x1 - a.x0 + 2), a.y1 - Math.sin(ph * Math.PI) * 3, '#e8f6ff');
    }
  },
  /** light glinting off water: sparkles that come and go, ripples spreading */
  shimmer(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const slot = Math.floor(t * 1.6 + hash(i, 4) * 4), x = a.x0 + hash(i, slot) * (a.x1 - a.x0), y = a.y0 + hash(slot, i) * (a.y1 - a.y0);
      const ph = (t * 1.6 + hash(i, 4) * 4) % 1;
      if (ph < 0.6) px(ctx, x, y, ph < 0.3 ? '#ffffff' : '#c8e6fa', ph < 0.3 ? 2 : 1, 1);
    }
  },
  /** snow falling, drifting with the wind */
  snow(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const sp = 8 + hash(i, 1) * 10, y = (hash(i, 2) * a.y1 + t * sp) % a.y1;
      const x = (hash(i, 3) * 240 + Math.sin(t * 0.8 + i) * 3 + t * 4) % 232 - 4;
      px(ctx, x, y, hash(i, 5) > 0.7 ? '#ffffff' : '#dae2ee', hash(i, 6) > 0.85 ? 2 : 1, 1);
    }
  },
  /** butterflies flitting about, wings beating */
  butterflies(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const s = t * (0.25 + hash(i, 1) * 0.15) + hash(i, 2) * 10;
      const x = a.x0 + (a.x1 - a.x0) * (0.5 + 0.5 * Math.sin(s + Math.sin(s * 2.7) * 0.6));
      const y = a.y0 + (a.y1 - a.y0) * (0.5 + 0.5 * Math.sin(s * 1.9 + i)) + Math.sin(t * 9 + i) * 1.2;
      const c = a.colors[i % a.colors.length], open = Math.floor(t * 12 + i * 3) % 3 !== 0;
      px(ctx, x, y, '#2a1a20', 1, 2);
      if (open) { px(ctx, x - 2, y - 1, c, 2, 2); px(ctx, x + 1, y - 1, c, 2, 2); px(ctx, x - 2, y - 1, '#ffffff'); }
      else { px(ctx, x - 1, y - 2, c, 1, 2); px(ctx, x + 1, y - 2, c, 1, 2); }
    }
  },
  /** fireflies drifting low and blinking */
  fireflies(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const s = t * 0.3 + hash(i, 1) * 20, x = a.x0 + (a.x1 - a.x0) * wave(s + i * 3), y = a.y0 + (a.y1 - a.y0) * wave(s * 1.3 + i * 7 + 50);
      const b = Math.sin(t * 2.2 + hash(i, 2) * 6);
      if (b < 0) continue;
      px(ctx, x, y, b > 0.6 ? '#f4ff9a' : '#a8c84a');
      if (b > 0.6) pool(ctx, x, y, 3, '#c8ff6a', 0.15);
    }
  },
  /** dust drifting slowly in a pool of lamplight */
  motes(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const s = t * 0.12 + hash(i, 1) * 10, x = a.x + (wave(s + i * 3) - 0.5) * a.r * 2, y = a.y + (wave(s * 0.8 + i * 9 + 40) - 0.5) * a.r * 1.4;
      if (Math.sin(t * 1.3 + i) > -0.3) px(ctx, x, y, '#fff2c8');
    }
  },
  /** rain slanting down through the whole pen */
  rain(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const sp = 110 + hash(i, 1) * 50, y = (hash(i, 2) * 120 + t * sp) % 100 - 6, x = ((hash(i, 3) * 260 - y * 0.3 + t * 20) % 240 + 240) % 240 - 8;
      px(ctx, x, y, hash(i, 4) > 0.6 ? 'rgba(220,230,255,0.7)' : 'rgba(160,180,220,0.5)', 1, 3);
    }
  },
  /** sparks crackling over crystal rods (a: points [[x, y]]) */
  sparks(ctx, a, t) {
    a.at.forEach(([x, y], i) => {
      pool(ctx, x, y, 6, '#7ab0ff', 0.18 + 0.08 * Math.sin(t * 7 + i));
      if (Math.sin(t * 19 + i * 3) > 0.4) { px(ctx, x + Math.round(Math.sin(t * 31 + i) * 2), y - 1, '#ffffff'); px(ctx, x - 1, y + 1, '#9ac8ff'); }
    });
    // now and then a bolt between the first two rods
    if (a.at.length > 1 && (t * 0.4) % 1 < 0.05) {
      const [[x0, y0], [x1, y1]] = a.at;
      for (let k = 0; k <= 12; k++) px(ctx, x0 + (x1 - x0) * k / 12, y0 + (y1 - y0) * k / 12 + (hash(k, Math.floor(t * 8)) - 0.5) * 4, '#e0f0ff');
    }
  },
  /** bubbles rising and wobbling (a: x0, x1, y0 where they start, y1 where they pop, colors) */
  bubbles(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const sp = 6 + hash(i, 1) * 8, span = a.y0 - a.y1, ph = (hash(i, 2) * span + t * sp) % span;
      const x = a.x0 + hash(i, 3) * (a.x1 - a.x0) + Math.sin(t * 1.5 + i) * 2, y = a.y0 - ph, c = a.colors[i % a.colors.length];
      const r = hash(i, 4) > 0.6 ? 2 : 1;
      px(ctx, x - r, y, c, 1, 1); px(ctx, x + r, y, c, 1, 1); px(ctx, x, y - r, c, 1, 1); px(ctx, x, y + r, c, 1, 1);
      if (r > 1) px(ctx, x - 1, y - 1, '#ffffff');
    }
  },
  /** stars twinkling in a night sky (a: n, y1 the sky's bottom) */
  stars(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const b = Math.sin(t * (1 + hash(i, 1) * 2) + i * 2.3);
      if (b < 0.3) continue;
      px(ctx, hash(i, 2) * 224, hash(i, 3) * a.y1, b > 0.8 ? '#ffffff' : '#c8d0ff');
    }
  },
  /** wisps of light drifting and bobbing (a: n, x0, x1, y0, y1, color) */
  wisps(ctx, a, t) {
    for (let i = 0; i < a.n; i++) {
      const s = t * 0.2 + hash(i, 1) * 20, x = a.x0 + (a.x1 - a.x0) * wave(s + i * 3), y = a.y0 + (a.y1 - a.y0) * wave(s * 1.4 + i * 7 + 50);
      pool(ctx, x, y, 5, a.color, 0.22);
      px(ctx, x, y, '#ffffff'); px(ctx, x, y + 1, a.color);
    }
  },
  /** a drop gathering and falling now and then */
  drip(ctx, a, t) {
    const per = a.every, ph = (t + a.x * 0.37) % per, fall = Math.sqrt((2 * (a.y1 - a.y0)) / 160);
    if (ph < 1) px(ctx, a.x, a.y0, '#9ccaf0');
    else if (ph < 1 + fall) px(ctx, a.x, a.y0 + 80 * (ph - 1) ** 2, '#c8e6fa', 1, 2);
    else if (ph < 1.25 + fall) { px(ctx, a.x - 1, a.y1 - 1, '#9ccaf0'); px(ctx, a.x + 1, a.y1 - 1, '#9ccaf0'); }
  },
};

/**
 * Paint what moves in an enclosure at time t (seconds).
 * @param {CanvasRenderingContext2D} ctx @param {PenAnim[]|undefined} anims @param {number} t
 */
export function drawPenAnim(ctx, anims, t) {
  if (!anims || !Number.isFinite(t)) return;
  for (const a of anims) {
    const f = /** @type {any} */ (DRAW)[a.type];
    if (f) f(ctx, a, t);
  }
}
