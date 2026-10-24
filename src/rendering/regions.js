// The wilds as pixel-art panoramas (256×144 art pixels): each region is a
// layered painting — a dithered sky, far silhouettes, the scenery that gives
// it its character (lit oak canopies over a sunny clearing with shrubs,
// berries, bluebells, daisies and toadstools, a flowered meadow, a
// willow river, terraced quarry faces with cranes and a lantern, a moonlit
// bog of willows, crystals and wisps, smoking volcanic crags) and a ground
// the deposits sit on (they are placed between 0.5 and 0.88 of the height).
// Painted once per region into a cached canvas; animateRegion adds a few
// moving pixels each frame. Deterministic: every random choice comes from
// an Rng seeded by the world seed and the region. Each region swaps its
// painted scenery for a composition of sprites from its atlas
// (rendering/wild-sprites.js) once that loads.

import { Rng } from '../core/rng.js';
import { REGION_ATLAS, MEADOW } from './wild-sprites.js';

export const SCENE_W = 256;
export const SCENE_H = 144;

/** 4×4 ordered dither. */
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x, y) => (BAYER4[(x & 3) + (y & 3) * 4] + 0.5) / 16;
const K = '#1a1218';

/** @param {CanvasRenderingContext2D} ctx */
function R(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
/** @param {string} hex */
function rgbOf(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
/** @param {number[]} c 0..255 */
const css = (c) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
/** @param {number[]} a @param {number[]} b @param {number} t */
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/**
 * A vertical gradient through colour stops, quantised to `steps` bands and
 * dithered between them (the pixel-art way to draw a sky).
 * @param {CanvasRenderingContext2D} ctx @param {number} x0 @param {number} y0 @param {number} w @param {number} h @param {string[]} stops @param {number} [steps]
 */
function gradient(ctx, x0, y0, w, h, stops, steps = 10) {
  const cols = stops.map(rgbOf);
  const at = (t) => {
    const f = Math.min(cols.length - 1.0001, t * (cols.length - 1)), i = Math.floor(f);
    return mix(cols[i], cols[i + 1], f - i);
  };
  for (let y = 0; y < h; y++) {
    const t = h > 1 ? y / (h - 1) : 0;
    const band = t * steps, lo = Math.floor(band), frac = band - lo;
    const cA = css(at(lo / steps)), cB = css(at(Math.min(1, (lo + 1) / steps)));
    let run = 0, cur = '';
    for (let x = 0; x <= w; x++) {
      const c = x === w ? '' : frac > bayer(x0 + x, y0 + y) ? cB : cA;
      if (c !== cur) { if (cur) R(ctx, x0 + x - run, y0 + y, run, 1, cur); cur = c; run = 0; }
      run++;
    }
  }
}

/** A filled pixel disc. @param {CanvasRenderingContext2D} ctx */
function disc(ctx, cx, cy, rx, ry, c) {
  for (let yy = -ry; yy <= ry; yy++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry || 1))));
    R(ctx, cx - w, cy + yy, w * 2 + 1, 1, c);
  }
}

/** A rolling silhouette from y = base ± amp, filled to the bottom of the band. */
function ridge(ctx, rng, y, amp, rough, bottom, c, W = SCENE_W) {
  let h = y + rng.range(-amp, amp), v = 0;
  for (let x = 0; x < W; x++) {
    v += rng.range(-rough, rough); v *= 0.9;
    h = Math.max(y - amp, Math.min(y + amp, h + v));
    R(ctx, x, h, 1, bottom - h, c);
  }
}

/** A row of far trees as soft round tops. */
function treeLine(ctx, rng, y, size, c, cHi) {
  for (let x = -size; x < SCENE_W + size; x += rng.int(Math.round(size * 0.6), size)) {
    const r = rng.int(Math.round(size * 0.55), size), cy = y - rng.int(0, Math.round(size * 0.6));
    disc(ctx, x, cy, r, Math.round(r * 1.15), c);
    if (cHi) disc(ctx, x - Math.round(r / 3), cy - Math.round(r / 2), Math.max(1, Math.round(r / 3)), Math.max(1, Math.round(r / 3)), cHi);
    R(ctx, x, cy, Math.max(2, r * 2 / 3), y + 30 - cy, c);
  }
}

/**
 * A leafy crown: dark mass, mid-tone clusters, lit clusters to the upper
 * left, a few highlight specks and a ragged edge of single leaves.
 * @param {string[]} pal [outline, dark, mid, light, highlight]
 */
function canopy(ctx, rng, cx, cy, r, pal) {
  const blobs = [];
  for (let i = 0; i < 9; i++) blobs.push([cx + rng.range(-r * 0.8, r * 0.8), cy + rng.range(-r * 0.5, r * 0.45), rng.range(r * 0.4, r * 0.62)]);
  for (const [x, y, br] of blobs) disc(ctx, Math.round(x), Math.round(y), Math.round(br) + 1, Math.round(br * 0.85) + 1, pal[0]);
  for (const [x, y, br] of blobs) disc(ctx, Math.round(x), Math.round(y), Math.round(br), Math.round(br * 0.85), pal[1]);
  for (const [x, y, br] of blobs) disc(ctx, Math.round(x - br * 0.15), Math.round(y - br * 0.2), Math.round(br * 0.75), Math.round(br * 0.62), pal[2]);
  for (const [x, y, br] of blobs) if (x < cx + r * 0.3 && y < cy + r * 0.1) disc(ctx, Math.round(x - br * 0.3), Math.round(y - br * 0.35), Math.round(br * 0.42), Math.round(br * 0.34), pal[3]);
  for (let i = 0; i < r * 1.2; i++) R(ctx, cx + rng.range(-r, r * 0.5), cy + rng.range(-r * 0.7, r * 0.1), 1, 1, pal[4]);
  for (let i = 0; i < r * 2; i++) {
    const a = rng.range(0, Math.PI * 2), d = r * rng.range(0.85, 1.05);
    R(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.75, 1, 1, pal[rng.int(0, 1)]);
  }
}

/** A trunk with bark stripes and a flared base. @param {string[]} pal [outline, dark, mid, light] */
function trunk(ctx, rng, x, top, bot, w, pal) {
  R(ctx, x - 1, top, w + 2, bot - top, pal[0]);
  R(ctx, x, top, w, bot - top, pal[2]);
  R(ctx, x, top, Math.max(1, Math.round(w / 4)), bot - top, pal[3]);
  R(ctx, x + w - Math.max(1, Math.round(w / 3)), top, Math.max(1, Math.round(w / 3)), bot - top, pal[1]);
  for (let y = top + 2; y < bot - 2; y += rng.int(2, 4)) R(ctx, x + rng.int(1, Math.max(1, w - 2)), y, 1, rng.int(2, 4), pal[1]);
  // roots
  R(ctx, x - 3, bot - 2, w + 6, 2, pal[0]); R(ctx, x - 2, bot - 2, w + 4, 1, pal[2]);
  R(ctx, x - 4, bot - 1, 3, 1, pal[1]); R(ctx, x + w + 1, bot - 1, 3, 1, pal[1]);
}

/** A fern: arching fronds of single leaves. */
function fern(ctx, rng, x, y, size, dark, light) {
  for (let f = 0; f < 5; f++) {
    const ang = -Math.PI / 2 + (f - 2) * 0.55 + rng.range(-0.15, 0.15);
    for (let i = 0; i < size; i++) {
      const t = i / size, bend = t * t * 0.9 * Math.sign(f - 2 || 1);
      const px = x + Math.cos(ang + bend) * i, py = y + Math.sin(ang + bend) * i * 0.8;
      R(ctx, px, py, 1, 1, dark);
      if (i % 2 === 0 && i > 1) { R(ctx, px - 1, py + 1, 1, 1, light); R(ctx, px + 1, py + 1, 1, 1, dark); }
    }
  }
}

/** A grass tuft. */
function tuft(ctx, x, y, h, dark, light) {
  R(ctx, x, y - h, 1, h, dark); R(ctx, x - 1, y - h + 2, 1, h - 2, light); R(ctx, x + 1, y - h + 1, 1, h - 1, dark); R(ctx, x + 2, y - h + 3, 1, h - 3, light);
}

/** A little flower on a stem. */
function flower(ctx, x, y, c, stem) {
  R(ctx, x, y, 1, 3, stem);
  R(ctx, x - 1, y - 1, 3, 1, c); R(ctx, x, y - 2, 1, 3, c); R(ctx, x, y - 1, 1, 1, '#fff3b0');
}

/**
 * A boulder lit from the upper left. @param {string[]} pal [outline, dark, mid, light, highlight]
 */
function rock(ctx, rng, x, y, w, h, pal, moss) {
  for (let yy = 0; yy < h; yy++) {
    const t = yy / h, inset = Math.round((1 - Math.sqrt(Math.min(1, t * 2.2))) * w * 0.3);
    R(ctx, x + inset - 1, y + yy, w - inset * 2 + 2, 1, pal[0]);
    R(ctx, x + inset, y + yy, w - inset * 2, 1, t < 0.3 ? pal[3] : t < 0.7 ? pal[2] : pal[1]);
    R(ctx, x + inset, y + yy, Math.max(1, Math.round((w - inset * 2) * 0.25)), 1, t < 0.5 ? pal[4] : pal[3]);
  }
  R(ctx, x, y + h, w, 1, pal[0]);
  for (let i = 0; i < w / 4; i++) R(ctx, x + rng.int(2, w - 3), y + rng.int(2, h - 1), rng.int(1, 3), 1, pal[1]);
  if (moss) for (let i = 0; i < w; i++) R(ctx, x + rng.int(Math.round(w * 0.15), Math.round(w * 0.85)), y + rng.int(0, Math.round(h * 0.3)), 1, 1, rng.chance(0.5) ? moss[0] : moss[1]);
}

/** Speckle a ground band with strokes of the given colours. */
function speckle(ctx, rng, y0, y1, n, cols, len = 2) {
  for (let i = 0; i < n; i++) R(ctx, rng.int(0, SCENE_W - 1), rng.int(y0, y1), rng.int(1, len), 1, rng.pick(cols));
}

/** Translucent shafts of light falling from the upper left. */
function rays(ctx, rng, n, a) {
  for (let i = 0; i < n; i++) {
    const x0 = rng.int(10, SCENE_W * 0.7), w = rng.int(6, 14), len = rng.int(70, 120);
    for (let y = 0; y < len; y++) R(ctx, x0 + y * 0.55, y, w, 1, `rgba(255,248,200,${(a * (1 - y / len)).toFixed(3)})`);
  }
}

/** A drifting pixel cloud. */
function cloud(ctx, x, y, s, c, shade) {
  disc(ctx, x, y, 6 * s, 3 * s, shade);
  disc(ctx, x - 7 * s, y + s, 5 * s, 2 * s, shade);
  disc(ctx, x + 8 * s, y + s, 5 * s, 2 * s, shade);
  disc(ctx, x, y - s, 6 * s, 3 * s, c);
  disc(ctx, x - 7 * s, y, 4 * s, 2 * s, c);
  disc(ctx, x + 7 * s, y, 4 * s, 2 * s, c);
}

/**
 * A big old trunk: outlined bark with a lit left edge, deep vertical
 * crevices, a knot hole and roots that flare into the ground.
 * @param {string[]} pal [outline, dark, mid, light, highlight]
 */
function oak(ctx, rng, x, top, bot, w, pal) {
  for (let y = top; y < bot; y++) {
    const flare = Math.max(0, y - (bot - 10)), ww = w + Math.round(flare * flare * 0.12) * 2, x0 = x - Math.round(flare * flare * 0.12);
    R(ctx, x0 - 1, y, ww + 2, 1, pal[0]);
    R(ctx, x0, y, ww, 1, pal[2]);
    R(ctx, x0, y, Math.max(2, Math.round(ww * 0.28)), 1, pal[3]);
    R(ctx, x0, y, 1, 1, pal[4]);
    R(ctx, x0 + ww - Math.max(2, Math.round(ww * 0.3)), y, Math.max(2, Math.round(ww * 0.3)), 1, pal[1]);
  }
  // crevices that wander down the bark
  for (let k = 0; k < Math.round(w / 3); k++) {
    let cx = x + rng.int(2, w - 3);
    for (let y = top + rng.int(0, 6); y < bot - rng.int(2, 8); y++) { R(ctx, cx, y, 1, 1, pal[0]); if (rng.chance(0.18)) cx += rng.chance(0.5) ? 1 : -1; cx = Math.max(x + 1, Math.min(x + w - 2, cx)); }
  }
  // a knot hole
  const ky = rng.int(top + 10, bot - 16), kx = x + rng.int(2, Math.max(2, w - 6));
  disc(ctx, kx + 2, ky, 2, 2, pal[0]); R(ctx, kx + 1, ky - 1, 2, 1, pal[1]);
  // roots spreading over the grass
  for (const dir of [-1, 1]) {
    const rx = dir < 0 ? x - 4 : x + w + 3;
    for (let i = 0; i < 6; i++) { R(ctx, rx + dir * i, bot - 3 + Math.round(i / 3), 3, 2, pal[0]); R(ctx, rx + dir * i, bot - 3 + Math.round(i / 3), 2, 1, pal[2]); }
  }
}

/**
 * A rounded shrub: an outlined mass of leaf clusters, lit from the upper
 * left, sitting on a flat shadow — optionally hung with glossy berries.
 * @param {string[]} pal [outline, dark, mid, light, highlight]
 */
function bush(ctx, rng, cx, cy, r, pal, berries) {
  R(ctx, cx - r, cy + Math.round(r * 0.45), r * 2, 2, 'rgba(10,30,8,0.35)');
  const blobs = [];
  for (let i = 0; i < 6; i++) blobs.push([cx + rng.range(-r * 0.7, r * 0.7), cy + rng.range(-r * 0.35, r * 0.2), rng.range(r * 0.42, r * 0.6)]);
  for (const [x, y, br] of blobs) disc(ctx, Math.round(x), Math.round(y), Math.round(br) + 1, Math.round(br * 0.8) + 1, pal[0]);
  for (const [x, y, br] of blobs) disc(ctx, Math.round(x), Math.round(y), Math.round(br), Math.round(br * 0.8), pal[1]);
  for (const [x, y, br] of blobs) disc(ctx, Math.round(x - br * 0.15), Math.round(y - br * 0.22), Math.round(br * 0.7), Math.round(br * 0.5), pal[2]);
  for (const [x, y, br] of blobs) if (x < cx + r * 0.3) disc(ctx, Math.round(x - br * 0.32), Math.round(y - br * 0.4), Math.max(1, Math.round(br * 0.32)), Math.max(1, Math.round(br * 0.22)), pal[3]);
  for (let i = 0; i < r; i++) R(ctx, cx + rng.range(-r * 0.8, r * 0.3), cy + rng.range(-r * 0.6, 0), 1, 1, pal[4]);
  if (berries) for (let i = 0; i < Math.round(r * 0.5); i++) {
    const bx = Math.round(cx + rng.range(-r * 0.7, r * 0.7)), by = Math.round(cy + rng.range(-r * 0.4, r * 0.25));
    berry(ctx, bx, by, berries); if (rng.chance(0.6)) berry(ctx, bx + 3, by + 2, berries);
  }
}

/** A glossy berry (3×3 with an outline and a glint). @param {string[]} c [outline, body, glint] */
function berry(ctx, x, y, c) {
  R(ctx, x - 1, y, 5, 3, c[0]); R(ctx, x, y - 1, 3, 5, c[0]);
  R(ctx, x, y, 3, 3, c[1]); R(ctx, x, y, 1, 1, c[2]);
}

/** A toadstool with a spotted dome. @param {string[]} c [outline, cap, cap light, spot] */
function mushroom(ctx, x, y, s, c) {
  const w = 3 + s * 2, ch = 2 + s;
  R(ctx, x - 2, y - ch - 1, 4, ch + 2, K); R(ctx, x - 1, y - ch, 2, ch + 1, '#e8dcc8'); R(ctx, x - 1, y - ch, 1, ch + 1, '#fff8ea');
  const row = (yy) => Math.round(w * Math.sqrt(1 - Math.pow((ch - yy) / (ch + 1), 2)));
  for (let yy = 0; yy <= ch; yy++) R(ctx, x - row(yy) - 1, y - ch * 2 + yy - 1, row(yy) * 2 + 2, 3, c[0]);
  for (let yy = 0; yy <= ch; yy++) R(ctx, x - row(yy), y - ch * 2 + yy, row(yy) * 2, 1, yy < ch / 2 ? c[2] : c[1]);
  R(ctx, x - w, y - ch * 2, 2, 1, c[2]);
  R(ctx, x - Math.round(w / 2), y - ch * 2, 1, 1, c[3]); R(ctx, x + Math.round(w / 3), y - ch * 2 + 1, 1, 1, c[3]); if (s > 1) R(ctx, x - 1, y - ch - 2, 2, 1, c[3]);
}

/** A bluebell stalk: a curved stem hung with bells. */
function bluebell(ctx, x, y, h, c = ['#2a1f5a', '#6a5ad0', '#a898ff']) {
  for (let i = 0; i < h; i++) R(ctx, x + Math.round(Math.sin(i / h * 1.6) * 2), y - i, 1, 1, '#2f6a24');
  for (let b = 0; b < 3; b++) {
    const by = y - h + 2 + b * 3, bx = x + Math.round(Math.sin((h - b * 3) / h * 1.6) * 2) + (b % 2 ? -2 : 2);
    R(ctx, bx - 1, by - 1, 3, 4, c[0]); R(ctx, bx - 1, by, 3, 2, c[1]); R(ctx, bx - 2, by + 2, 5, 1, c[0]); R(ctx, bx - 1, by + 2, 3, 1, c[1]); R(ctx, bx, by, 1, 1, c[2]);
  }
  R(ctx, x - 2, y - 3, 2, 1, '#4f9a2a'); R(ctx, x + 1, y - 2, 2, 1, '#4f9a2a');
}

/** A daisy: white petals round a golden heart. */
function daisy(ctx, x, y, petal = '#ffffff', heart = '#ffd23a') {
  R(ctx, x, y + 2, 1, 3, '#2f6a24');
  R(ctx, x - 2, y - 1, 5, 3, 'rgba(20,40,10,0.45)'); R(ctx, x - 1, y - 2, 3, 5, 'rgba(20,40,10,0.45)');
  R(ctx, x - 1, y - 1, 3, 3, petal); R(ctx, x - 2, y, 5, 1, petal); R(ctx, x, y - 2, 1, 5, petal);
  R(ctx, x, y, 1, 1, heart);
}

/** A cut stump with growth rings. @param {string[]} pal [outline, dark, mid, light, highlight] */
function stump(ctx, x, y, w, h, pal) {
  R(ctx, x - 1, y - h, w + 2, h + 1, pal[0]);
  R(ctx, x, y - h, w, h, pal[2]); R(ctx, x, y - h, 2, h, pal[3]); R(ctx, x + w - 3, y - h, 3, h, pal[1]);
  for (let k = 0; k < 3; k++) R(ctx, x + 3 + k * 4, y - h + 3, 1, h - 4, pal[1]);
  R(ctx, x - 3, y - 1, 3, 2, pal[0]); R(ctx, x + w, y - 1, 3, 2, pal[0]); R(ctx, x - 2, y - 1, 2, 1, pal[2]); R(ctx, x + w, y - 1, 2, 1, pal[1]);
  // the cut face
  disc(ctx, x + Math.floor(w / 2), y - h, Math.floor(w / 2) + 1, 3, pal[0]);
  disc(ctx, x + Math.floor(w / 2), y - h, Math.floor(w / 2), 2, '#d8a868');
  disc(ctx, x + Math.floor(w / 2), y - h, Math.floor(w / 3), 1, '#b8844a');
  R(ctx, x + Math.floor(w / 2), y - h, 1, 1, '#8a5a2e');
}

/** A short rail fence. */
function fence(ctx, x, y, posts, gap) {
  const wood = ['#24160f', '#5a3a20', '#8a5c33', '#b8844a'];
  for (const ry of [y - 9, y - 5]) { R(ctx, x - 2, ry - 1, (posts - 1) * gap + 6, 4, wood[0]); R(ctx, x - 1, ry, (posts - 1) * gap + 4, 2, wood[2]); R(ctx, x - 1, ry, (posts - 1) * gap + 4, 1, wood[3]); }
  for (let i = 0; i < posts; i++) { const px = x + i * gap; R(ctx, px - 1, y - 13, 5, 14, wood[0]); R(ctx, px, y - 12, 3, 12, wood[2]); R(ctx, px, y - 12, 1, 12, wood[3]); R(ctx, px + 2, y - 12, 1, 12, wood[1]); }
}

/** A four-point glint. */
function sparkle(ctx, x, y, c = '#fff3a0', core = '#ffffff') {
  R(ctx, x - 1, y, 3, 1, c); R(ctx, x, y - 1, 1, 3, c); R(ctx, x, y, 1, 1, core);
}

/** Pale crystals growing out of a stone. */
function crystals(ctx, rng, x, y, n) {
  for (let i = 0; i < n; i++) {
    const cx = x + rng.int(-4, 4), h = rng.int(2, 4);
    R(ctx, cx - 1, y - h - 1, 3, h + 2, '#1a3a5a'); R(ctx, cx, y - h, 1, h + 1, '#8fe0ff');
  }
  sparkle(ctx, x + rng.int(-3, 3), y - rng.int(4, 7), '#bfefff');
}

// ------------------------------------------------------------------ the regions

const OAK = ['#0f1f10', '#1f3a1a', '#2f5a24', '#4f8a32', '#9fd060'];
const BARK = ['#1a1008', '#3a2414', '#5a3a20', '#7a5230'];
const STONE = ['#1a1820', '#3d3a44', '#5d5a64', '#7d7a84', '#a8a4ac'];
const MOSS = ['#4f7a31', '#7da447'];
/** sunlit greens for the woodland painting */
const LEAF = ['#163212', '#2a6a1c', '#3f8f24', '#68bc34', '#b6ea5a'];
const SHRUB = ['#12300f', '#256018', '#3a8a22', '#5cb030', '#a6e050'];
const OAKBARK = ['#1e1008', '#4a2a14', '#6e4220', '#94602e', '#b8844a'];
const BERRY = ['#4a0a10', '#e0302c', '#ffc0a8'];
const SHROOM = ['#3a1440', '#b04ac8', '#e08cf0', '#ffffff'];
const RSTONE = ['#1e2028', '#555a68', '#7a8090', '#9aa2b0', '#c8d0da'];

/** @param {CanvasRenderingContext2D} ctx @param {Rng} rng */
function forest(ctx, rng) {
  const W = SCENE_W, H = SCENE_H;
  // a bright sky glimpsed through a gap in the canopy
  gradient(ctx, 0, 0, W, 64, ['#3f8ee0', '#7ec0f0', '#cdeef0'], 9);
  cloud(ctx, 128, 14, 2, '#ffffff', '#cfe2f2');
  cloud(ctx, 96, 30, 1, '#ffffff', '#d4e6f4');
  // far forest in blue-green haze, then a nearer wall of trees
  treeLine(ctx, rng, 46, 12, '#4f9a96', '#74baa8');
  treeLine(ctx, rng, 54, 14, '#3a8060', '#5aa070');
  // ground: a sunlit clearing among darker grass
  gradient(ctx, 0, 62, W, H - 62, ['#5aa834', '#4a9a2a', '#367a1e'], 7);
  for (let y = 70; y < 122; y++) {
    const t = (y - 70) / 52, hw = 30 + t * 60;
    for (let x = Math.round(128 - hw); x < 128 + hw; x++) {
      const e = 1 - Math.abs(x - 128) / hw;
      if (e * 1.4 * (1 - Math.abs(t - 0.45)) > bayer(x, y) + 0.15) R(ctx, x, y, 1, 1, '#6cbc3e');
    }
  }
  rays(ctx, rng, 2, 0.14);
  for (let i = 0; i < 3; i++) { const x0 = 104 + i * 16; for (let y = 0; y < 110; y++) R(ctx, x0 + y * 0.35, y, 7 - i, 1, `rgba(255,250,210,${(0.22 * (1 - y / 110)).toFixed(3)})`); }
  // mid-distance trunks behind the clearing
  for (const x of [50, 150, 200]) { R(ctx, x - 1, 40, 7, 30, '#1e3020'); R(ctx, x, 40, 5, 30, '#4a3a28'); R(ctx, x, 40, 1, 30, '#6a5238'); }
  speckle(ctx, rng, 64, H - 1, 700, ['#3a8a22', '#6cbc3e', '#2f7a1e', '#7ac848', '#4f9a2a'], 3);
  // back row of shrubs closing off the clearing
  for (let x = -6; x < W + 10; x += rng.int(16, 24)) bush(ctx, rng, x, rng.int(66, 72), rng.int(8, 12), SHRUB, null);
  fence(ctx, 112, 82, 3, 14);
  // the great oaks framing the scene, canopies meeting overhead
  const trees = [[6, 18], [66, 12], [180, 12], [232, 18]];
  for (const [x, w] of trees) oak(ctx, rng, x, 18, 80 + rng.int(-2, 3), w, OAKBARK);
  for (const [x, w] of trees) {
    const c = x + w / 2;
    canopy(ctx, rng, c - 12, rng.int(4, 12), rng.int(22, 26), LEAF);
    canopy(ctx, rng, c + 14, rng.int(6, 14), rng.int(20, 24), LEAF);
    canopy(ctx, rng, c, rng.int(20, 26), rng.int(16, 20), LEAF);
  }
  // shrubs, berries and flowers around the clearing
  bush(ctx, rng, 92, 96, 12, SHRUB, BERRY);
  bush(ctx, rng, 160, 86, 10, SHRUB, BERRY);
  bush(ctx, rng, 30, 92, 11, SHRUB, null);
  bush(ctx, rng, 224, 94, 12, SHRUB, null);
  stump(ctx, 144, 114, 18, 11, OAKBARK);
  for (let i = 0; i < 8; i++) bluebell(ctx, 194 + i * 4 + rng.int(-1, 1), 104 + rng.int(-6, 4), rng.int(9, 13));
  for (const [cx, cy, n] of [[52, 84, 6], [44, 104, 4], [222, 112, 7], [120, 132, 4], [240, 88, 3]]) for (let i = 0; i < n; i++) daisy(ctx, cx + rng.int(-10, 10), cy + rng.int(-5, 5));
  for (let i = 0; i < 60; i++) tuft(ctx, rng.int(0, W), rng.int(76, H), rng.int(3, 6), '#2f6a1e', '#7ac848');
  for (let i = 0; i < 8; i++) fern(ctx, rng, rng.int(0, W), rng.int(110, H - 2), rng.int(8, 12), '#2a6a1c', '#7ac848');
  // mossy boulders in the corners, crusted with pale crystals
  rock(ctx, rng, -4, 112, 40, 24, RSTONE, MOSS);
  crystals(ctx, rng, 14, 118, 3);
  rock(ctx, rng, 214, 126, 46, 18, RSTONE, MOSS);
  crystals(ctx, rng, 238, 130, 3);
  rock(ctx, rng, 176, 128, 16, 8, RSTONE, MOSS);
  // toadstools
  mushroom(ctx, 40, 140, 2, SHROOM); mushroom(ctx, 50, 142, 1, SHROOM);
  mushroom(ctx, 196, 138, 2, SHROOM); mushroom(ctx, 205, 141, 1, SHROOM);
  // golden motes hanging in the light
  for (let i = 0; i < 18; i++) sparkle(ctx, rng.int(4, W - 4), rng.int(60, H - 6), rng.pick(['#fff3a0', '#ffe066']), '#ffffff');
}

/**
 * Props from a sprite atlas that keep clear of the deposits and of each
 * other: `prop` draws a frame at the first of its spots whose box is free
 * (`avoid` holds the deposits' boxes) and remembers it; `spots` picks a few
 * random spots in a band of the ground.
 * @param {CanvasRenderingContext2D} ctx @param {Rng} rng @param {import('./wild-sprites.js').SpriteAtlas} atlas @param {{x0:number, y0:number, x1:number, y1:number}[]} avoid
 */
function placer(ctx, rng, atlas, avoid) {
  /** what is already standing on the ground: the deposits, then each prop placed */
  const taken = avoid.slice();
  const free = (x0, y0, x1, y1) => taken.every((b) => x1 < b.x0 || x0 > b.x1 || y1 < b.y0 || y0 > b.y1);
  /** A few random spots in a band of the ground. @returns {[number, number][]} */
  const spots = (x0, x1, y0, y1, n = 5) => Array.from({ length: n }, () => [rng.int(x0, x1), rng.int(y0, y1)]);
  /** Draw a prop at the first spot clear of the deposits and the props before it. @param {string} name @param {[number, number][]} spots */
  const prop = (name, spots, flip = false) => {
    const f = atlas.frame(name);
    if (!f) return;
    for (const [x, y] of spots) {
      const b = { x0: x - f[2] / 2, y0: y - f[3], x1: x + f[2] / 2, y1: y };
      if (free(b.x0, b.y0, b.x1, b.y1)) { atlas.draw(ctx, name, x, y, 1, flip); taken.push(b); return; }
    }
  };
  return { taken, free, spots, prop };
}

/** The ground in flat bands from y0 to the bottom of the frame (stepped, not dithered). @param {CanvasRenderingContext2D} ctx @param {number} y0 @param {string[]} bands */
function groundBands(ctx, y0, bands) {
  for (let k = 0; k < bands.length; k++) { const y = y0 + Math.round(k * (SCENE_H - y0) / bands.length); R(ctx, 0, y, SCENE_W, SCENE_H - y, bands[k]); }
}

/**
 * Whisperwood from its sprite atlas (rendering/wild-sprites.js, built from
 * the Wilds pack): the pack's sky through the canopy, its distant, middle
 * and near tree lines, a sunlit clearing in bands of grass, two ancient oaks
 * framing it (mirrored on the right) and a smaller oak beyond; mossy stones,
 * a fallen log, a stump, bushes, ferns and ground cover. Nothing decorative
 * looks like a gatherable — no bellflowers, toadstools or berries — so the
 * outlined deposits drawn on top are the only things that read as something
 * to pick. Props that would sit under a deposit move aside or are left out
 * (`avoid` holds the deposits' boxes).
 * @param {CanvasRenderingContext2D} ctx @param {Rng} rng @param {{x0:number, y0:number, x1:number, y1:number}[]} avoid
 */
function forestSprites(ctx, rng, avoid) {
  const W = SCENE_W, H = SCENE_H, A = REGION_ATLAS.forest;
  const { spots, prop } = placer(ctx, rng, A, avoid);
  A.draw(ctx, 'sky', W / 2, 46);
  A.draw(ctx, 'distant', W / 2, 52);
  A.draw(ctx, 'mid', W / 2, 64);
  A.draw(ctx, 'near', W / 2, 74);
  groundBands(ctx, 70, ['#5aa830', '#52a02c', '#4a9628', '#428a24', '#3a7e20']);
  // the sunlit clearing: a ragged lighter patch in steps of two pixels
  for (const [c, grow] of /** @type {[string, number][]} */ ([['#68b83a', 1], ['#7cc846', 0.62]])) {
    for (let y = 74; y < 130; y += 2) {
      const t = (y - 74) / 56, hw = Math.round((22 + Math.sin(t * Math.PI) * 76) * grow);
      const l = 128 - hw - rng.int(0, 3) * 2, r = 128 + hw + rng.int(0, 3) * 2;
      if (hw > 0) R(ctx, l, y, r - l, 2, c);
    }
  }
  A.draw(ctx, 'oak_small', 132, 78);
  for (let i = 0; i < 3; i++) { const x0 = 96 + i * 15; for (let y = 0; y < 104; y++) R(ctx, x0 + y * 0.35, y, 6 - i, 1, `rgba(255,250,210,${(0.18 * (1 - y / 104)).toFixed(3)})`); }
  // the ancient oaks framing the clearing, crowns running off the top
  A.draw(ctx, 'oaks', 22, 96);
  A.draw(ctx, 'oaks', 238, 94, 1, true);
  // stones, a log, a stump, bushes and ferns around the clearing
  prop('bush_flowers', [[96, 84], [86, 86], [108, 82]]);
  prop('bush_round', [[170, 84], [182, 86], [158, 82]], true);
  prop('fern', [[60, 106], [46, 110], [76, 104]]);
  prop('stones', [[196, 114], [210, 118], [180, 110]]);
  prop('log', [[74, 128], [96, 132], [52, 124]]);
  prop('stump', [[160, 104], [146, 100], [174, 106]]);
  prop('fern_small', [[226, 128], [212, 132], [236, 124]], true);
  prop('bush_small', [[118, 96], [140, 94]]);
  prop('snag', [[32, 116], [20, 120]]);
  prop('sticks', [[140, 136], [120, 134], [166, 138]]);
  // foliage cut off by the bottom of the frame
  prop('bush_round', [[14, 150], [28, 150]]);
  prop('bush_flowers', [[244, 150], [230, 150]], true);
  // ground cover and a few snowdrops in the open, never on a prop or a deposit
  for (let i = 0; i < 22; i++) prop(`leaves_${rng.int(1, 3)}`, spots(6, W - 6, 86, H + 2), rng.chance(0.5));
  for (let i = 0; i < 4; i++) prop('snowdrops', spots(20, W - 20, 92, H), rng.chance(0.5));
}

/**
 * Willow Bank from its sprite atlas: the pack's sky, distant mountains and
 * pines, a meadow on the far side of the river, its chalk bank, the river
 * itself and the near shore; the great willows on either side and a young
 * one across the water, bushes, posts, a sign, chalk stones, grass and small
 * flowers. No cattails, mushrooms, mossy logs or white bog flowers: those
 * are the region's gatherables.
 * @param {CanvasRenderingContext2D} ctx @param {Rng} rng @param {{x0:number, y0:number, x1:number, y1:number}[]} avoid
 */
function riverSprites(ctx, rng, avoid) {
  const W = SCENE_W, H = SCENE_H, A = REGION_ATLAS.river;
  const { spots, prop } = placer(ctx, rng, A, avoid);
  A.draw(ctx, 'sky', W / 2, 58);
  A.draw(ctx, 'mountains', W / 2, 60);
  A.draw(ctx, 'pines', W / 2, 70);
  // the far meadow, the river and the near shore
  groundBands(ctx, 68, ['#7cc846', '#70be40', '#64b43a']);
  A.draw(ctx, 'water', W / 2, 114);
  const bank = /** @type {number[]} */ (A.frame('bank'));
  for (let x = -rng.int(0, 40); x < W; x += bank[2] - 2) A.draw(ctx, 'bank', x + bank[2] / 2, 96);
  R(ctx, 0, 114, W, 1, '#3a7a2a');
  for (let k = 0, bands = ['#6cbe3c', '#62b636', '#58ac30', '#4ea22c']; k < bands.length; k++) R(ctx, 0, 115 + k * 8, W, H, bands[k]);
  A.draw(ctx, 'willow_small', 150, 78);
  prop('bush_plain', [[96, 82], [84, 84], [110, 82]]);
  prop('bush_flowers', [[192, 84], [178, 84], [206, 86]], true);
  prop('bush_leafy', [[122, 80], [134, 80], [62, 82]]);
  prop('post', [[172, 92], [164, 92]]);
  prop('sign', [[70, 92], [56, 90]]);
  A.draw(ctx, 'willow_great', 26, 98);
  A.draw(ctx, 'willow_second', 232, 96);
  prop('stump', [[214, 132], [228, 136], [200, 128]]);
  prop('chalk_1', [[40, 130], [56, 134], [28, 126]]);
  prop('chalk_3', [[150, 140], [130, 138], [170, 142]]);
  prop('branch', [[100, 136], [84, 138], [120, 140]]);
  // grass, small flowers and pebbles on both banks, never on a prop or a deposit
  for (let i = 0; i < 12; i++) prop(rng.pick(['grass_1', 'grass_2', 'grass_3', 'clover']), spots(8, W - 8, 72, 90), rng.chance(0.5));
  for (let i = 0; i < 18; i++) prop(rng.pick(['grass_1', 'grass_2', 'grass_3', 'grass_tall', 'clover', 'pinks', 'buttercups']), spots(6, W - 6, 120, H + 2), rng.chance(0.5));
  for (let i = 0; i < 5; i++) prop('pebble', spots(10, W - 10, 118, H - 2));
}

/**
 * Ironstone Quarry from its sprite atlas: the pack's sky, its distant and
 * near cliff faces, the pit floor in bands of dust, a crane with its lantern
 * and hoisted stone, timber frames, a ladder and scaffold against the face,
 * a loaded cart, crates, cut blocks, dry shrubs and loose
 * stones. No crystal or ore heaps: those are the deposits.
 * @param {CanvasRenderingContext2D} ctx @param {Rng} rng @param {{x0:number, y0:number, x1:number, y1:number}[]} avoid
 */
function quarrySprites(ctx, rng, avoid) {
  const W = SCENE_W, H = SCENE_H, A = REGION_ATLAS.quarry;
  const { spots, prop } = placer(ctx, rng, A, avoid);
  A.draw(ctx, 'sky', W / 2, 56);
  A.draw(ctx, 'far_cliffs', W / 2, 64);
  A.draw(ctx, 'near_cliffs', W / 2, 84);
  groundBands(ctx, 80, ['#b89462', '#ad8a59', '#a18052', '#95754a', '#896b43']);
  speckle(ctx, rng, 82, H - 1, 260, ['#7a5e3a', '#c8a472', '#6e6a78', '#5a5664'], 2);
  A.draw(ctx, 'frame', 64, 86);
  A.draw(ctx, 'scaffold', 150, 84);
  A.draw(ctx, 'ladder', 112, 86);
  A.draw(ctx, 'crane', 206, 92);
  prop('blocks', [[176, 96], [190, 98], [94, 94]]);
  prop('stone_pillar', [[236, 96], [246, 98]]);
  prop('rail_fence', [[132, 98], [120, 100], [40, 96]]);
  prop('shrub_green', [[30, 112], [16, 116], [44, 110]]);
  prop('cart', [[232, 134], [218, 138], [240, 126]]);
  prop('crate', [[198, 136], [204, 128], [184, 140]]);
  prop('crate_small', [[188, 140], [178, 134]]);
  prop('stone_block', [[100, 132], [80, 136], [120, 134]]);
  prop('bench', [[150, 132], [164, 136], [138, 140]]);
  prop('dirt_heap', [[56, 136], [40, 140], [70, 132]]);
  prop('shrub_small', [[12, 140], [24, 142]]);
  // dry brush, tufts and loose stones on the pit floor, never on a prop or a deposit
  for (let i = 0; i < 14; i++) prop(rng.pick(['brush', 'brush_small', 'tuft', 'tuft', 'dead_bush']), spots(6, W - 6, 96, H + 2), rng.chance(0.5));
  for (let i = 0; i < 10; i++) prop(rng.pick(['boulder', 'pebbles', 'coal', 'pebbles']), spots(6, W - 6, 98, H), rng.chance(0.5));
}

/**
 * Moonfen from its sprite atlas: the pack's night sky with its moon, the
 * distant bogs, a tree line of willows in mist, dark moss ground with pools
 * of black water, ancient willows, a dead tree, drowned and glowing stumps,
 * a fallen trunk, mossy stones, cattails, ferns and night flowers. No violet reeds or crystals, lilies, wisp stalks or toadstools:
 * those are the deposits.
 * @param {CanvasRenderingContext2D} ctx @param {Rng} rng @param {{x0:number, y0:number, x1:number, y1:number}[]} avoid
 */
function moonfenSprites(ctx, rng, avoid) {
  const W = SCENE_W, H = SCENE_H, A = REGION_ATLAS.moonfen;
  const { spots, prop } = placer(ctx, rng, A, avoid);
  A.draw(ctx, 'sky', W / 2, 50);
  A.draw(ctx, 'hills', W / 2, 56);
  A.draw(ctx, 'treeline', W / 2, 74);
  groundBands(ctx, 74, ['#1f3a2a', '#1b3325', '#172d20', '#13261b', '#102117']);
  A.draw(ctx, 'mist', W / 2, 82);
  // pools of black water
  A.draw(ctx, 'water_2', 70, 104);
  A.draw(ctx, 'water', 196, 122);
  A.draw(ctx, 'water', 48, 140, 1, true);
  A.draw(ctx, 'willow_small', 164, 82);
  A.draw(ctx, 'dead_tree', 96, 84);
  A.draw(ctx, 'willow_left', 24, 102);
  A.draw(ctx, 'willow_center', 234, 98);
  prop('trunk', [[132, 96], [146, 98], [120, 94]]);
  prop('stump_glowing', [[200, 96], [186, 94], [214, 98]]);
  prop('stump_drowned', [[118, 112], [140, 108], [104, 116]]);
  prop('rock_big', [[214, 138], [226, 140], [200, 136]]);
  prop('cattails', [[72, 128], [58, 130], [86, 126]]);
  prop('ghost_stumps', [[160, 134], [144, 138], [176, 136]]);
  prop('rock_mid', [[40, 116], [54, 118], [28, 120]]);
  // ferns, grass, night flowers, lily pads, stones and crystals, never on a prop or a deposit
  for (let i = 0; i < 16; i++) prop(rng.pick(['grass_1', 'grass_2', 'grass_3', 'fiddleheads', 'night_flowers']), spots(6, W - 6, 86, H + 2), rng.chance(0.5));
  for (let i = 0; i < 6; i++) prop(rng.pick(['rock_small', 'stone_flat', 'rock_small']), spots(10, W - 10, 90, H), rng.chance(0.5));
  for (let i = 0; i < 4; i++) prop('pad', spots(50, 120, 96, 102));
}

/**
 * The Ember Crags from their sprite atlas: the pack's smoky sky, distant
 * volcanic ridges and the lava fissures beneath them, a scorched plain with
 * a winding stream of lava and glowing cracks, lava crags, a pool of lava, a vent and a sulphur gusher
 * steaming, black rocks, dead trees and ember brush. No crystals or
 * flowering brush: those are the deposits.
 * @param {CanvasRenderingContext2D} ctx @param {Rng} rng @param {{x0:number, y0:number, x1:number, y1:number}[]} avoid
 */
function cragsSprites(ctx, rng, avoid) {
  const W = SCENE_W, H = SCENE_H, A = REGION_ATLAS.crags;
  const { spots, prop } = placer(ctx, rng, A, avoid);
  A.draw(ctx, 'sky', W / 2, 64);
  A.draw(ctx, 'ridges', W / 2, 62);
  A.draw(ctx, 'fissures', W / 2, 78);
  groundBands(ctx, 76, ['#3a2420', '#34201c', '#2e1c19', '#281815', '#221412']);
  speckle(ctx, rng, 78, H - 1, 260, ['#4a2e26', '#1a0c0a', '#5a3a2e'], 3);
  // a thin stream of lava winding down the plain, as in the pack's scene
  for (let y = 80, x = rng.int(90, 150); y < H; y++) {
    x += Math.sin(y * 0.13 + 1) * 1.3 + rng.range(-0.6, 0.6);
    const w = 2 + Math.round((y - 80) / 26);
    R(ctx, x - w / 2 - 1, y, w + 2, 1, '#a8320c');
    R(ctx, x - w / 2, y, w, 1, y % 5 ? '#ff7a1c' : '#ffb444');
  }
  // glowing cracks in the plain
  for (let i = 0; i < 8; i++) {
    let x = rng.int(0, W), y = rng.int(84, H - 12);
    for (let k = 0; k < rng.int(8, 16); k++) { R(ctx, x, y, 1, 1, k % 4 ? '#ff7a1c' : '#ffb444'); x += rng.int(-1, 1); y += 1; }
  }
  A.draw(ctx, 'gusher', 182, 86);
  A.draw(ctx, 'vent', 76, 88);
  A.draw(ctx, 'crag_large', 22, 104);
  A.draw(ctx, 'crag_tall', 236, 102);
  prop('crag_medium', [[126, 88], [140, 86], [112, 90]]);
  prop('crag_small', [[210, 92], [222, 94]]);
  prop('dead_tree', [[46, 92], [36, 90], [104, 90]]);
  prop('lava_pool', [[150, 128], [128, 132], [172, 126]]);
  prop('rock_mound', [[208, 140], [222, 142], [192, 138]]);
  prop('dead_brush', [[60, 132], [46, 136], [74, 128]]);
  prop('post_tall', [[100, 118], [90, 120]]);
  prop('post', [[160, 104], [170, 106]]);
  // black rocks, lava pans and ember brush, never on a prop or a deposit
  for (let i = 0; i < 10; i++) prop(rng.pick(['rock_1', 'rock_2', 'rock_3', 'lava_pan']), spots(6, W - 6, 94, H), rng.chance(0.5));
  for (let i = 0; i < 14; i++) prop(rng.pick(['ember_brush', 'ember_brush_small', 'ember_tuft']), spots(6, W - 6, 90, H + 2), rng.chance(0.5));
}

/** @param {CanvasRenderingContext2D} ctx @param {Rng} rng */
function meadow(ctx, rng) {
  const W = SCENE_W, H = SCENE_H;
  gradient(ctx, 0, 0, W, 70, ['#5a96e0', '#8cc0f0', '#d8eef8'], 9);
  disc(ctx, 214, 20, 9, 9, '#fff6c8'); disc(ctx, 214, 20, 7, 7, '#fffbe6');
  for (let i = 0; i < 4; i++) cloud(ctx, rng.int(10, W - 30), rng.int(10, 34), rng.pick([1, 1, 2]), '#ffffff', '#d4e4f4');
  ridge(ctx, rng, 56, 6, 0.6, 72, '#7aa8b8');
  ridge(ctx, rng, 62, 5, 0.5, 80, '#5a9a5a');
  treeLine(ctx, rng, 66, 8, '#3f7a3a', '#5a9a4a');
  gradient(ctx, 0, 68, W, H - 68, ['#7ac04a', '#5aa83a', '#3f8a2a'], 6);
  speckle(ctx, rng, 70, H - 1, 700, ['#8ad05a', '#4f9a32', '#9ade6a', '#3f8a2a'], 3);
  // a wooden fence across the field
  for (let x = 6; x < W; x += 22) { R(ctx, x - 1, 70, 4, 14, K); R(ctx, x, 71, 2, 13, '#8a5c33'); R(ctx, x, 71, 1, 13, '#a8763f'); }
  for (const y of [73, 78]) { R(ctx, 0, y - 1, W, 3, K); R(ctx, 0, y, W, 1, '#a8763f'); }
  for (let i = 0; i < 90; i++) tuft(ctx, rng.int(0, W), rng.int(82, H), rng.int(3, 6), '#3f8a2a', '#8ad05a');
  for (let i = 0; i < 120; i++) flower(ctx, rng.int(0, W), rng.int(84, H - 2), rng.pick(['#ff9fc7', '#ffe58a', '#ffffff', '#c9b7ff', '#ff6a8a']), '#3f8a2a');
  oak(ctx, rng, 20, 46, 74, 8, OAKBARK);
  canopy(ctx, rng, 18, 36, 18, LEAF); canopy(ctx, rng, 34, 42, 14, LEAF);
  for (const [x, y, r, b] of [[60, 84, 9, null], [196, 82, 10, ['#5a0a3a', '#ff6aa8', '#ffd0e8']], [244, 90, 11, null]]) bush(ctx, rng, x, y, r, SHRUB, b);
  for (const [cx, cy, n] of [[30, 100, 6], [110, 92, 5], [170, 120, 6], [232, 128, 5]]) for (let i = 0; i < n; i++) daisy(ctx, cx + rng.int(-12, 12), cy + rng.int(-5, 5));
  for (let i = 0; i < 6; i++) bluebell(ctx, 134 + i * 4 + rng.int(-1, 1), 112 + rng.int(-4, 4), rng.int(9, 12));
  rock(ctx, rng, -4, 124, 34, 20, RSTONE, MOSS);
  for (let i = 0; i < 14; i++) sparkle(ctx, rng.int(4, W - 4), rng.int(78, H - 6), '#fff3a0');
}

/**
 * The Sunlit Meadow from its sprite atlas (rendering/wild-sprites.js), in
 * layers: the pack's sky, clouds, far and near mountains and a treeline of
 * firs; then the field in flat bands of grass, a split-rail fence across it,
 * the great oak on the left, bushes along the fence, rocks, small clumps of
 * daisies, buttercups and pinks, grass tufts and a fringe of tall grass at
 * the bottom of the frame. The decorative flowers are small and have no
 * outline, and none of them is a lupin-like spike, a blue clover or a seed
 * head, so the outlined gatherables drawn on top are the only plants that
 * read as something to pick. Props keep clear of the deposits.
 * @param {CanvasRenderingContext2D} ctx @param {Rng} rng @param {{x0:number, y0:number, x1:number, y1:number}[]} avoid
 */
function meadowSprites(ctx, rng, avoid) {
  const W = SCENE_W, H = SCENE_H;
  const A = MEADOW;
  const { spots, prop } = placer(ctx, rng, A, avoid);
  // sky, clouds and the distance
  A.draw(ctx, 'sky', W / 2, 66);
  for (const [name, x, y] of /** @type {[string, number, number][]} */ ([['cloud_2', 30, 14], ['cloud_1', 92, 26], ['cloud_3', 150, 12], ['cloud_6', 212, 20], ['cloud_8', 128, 36], ['cloud_5', 244, 38]])) A.draw(ctx, name, x, y);
  A.draw(ctx, 'far_mountains', W / 2, 54);
  A.draw(ctx, 'near_mountains', W / 2, 60);
  A.draw(ctx, 'treeline', W / 2, 66);
  // the field in flat bands, brighter towards the viewer
  const bands = ['#7cc844', '#6cbe3c', '#62b636', '#58ac30', '#4ea22c', '#459826'];
  for (let k = 0; k < bands.length; k++) { const y0 = 64 + Math.round(k * (H - 64) / bands.length); R(ctx, 0, y0, W, H - y0, bands[k]); }
  // a speckle of tiny far-off flowers (single pixels: nothing here looks pickable)
  for (let i = 0; i < 260; i++) {
    const y = rng.int(68, H - 1), x = rng.int(0, W - 1);
    R(ctx, x, y, 1, 1, rng.pick(['#ffffff', '#ffffff', '#ffe066', '#ff9fc7', '#d6f08a', '#3f8a2a', '#3f8a2a']));
  }
  // the split-rail fence at the far edge of the field, behind every deposit
  // (each length shares its end post with the next)
  const fence = /** @type {number[]} */ (A.frame('fence'));
  for (let x = -6; x < W + fence[2]; x += fence[2] - 4) A.draw(ctx, 'fence', x + fence[2] / 2, 73);
  // bushes along the fence, the great oak, rocks
  prop('bush_round', [[66, 80], [78, 81], [52, 80], [92, 80]]);
  prop('bush_low', [[118, 78], [104, 78], [132, 78], [150, 78]]);
  prop('bush_pink', [[206, 80], [192, 80], [220, 81], [176, 80]]);
  prop('bush_dark', [[244, 82], [236, 83], [252, 82]]);
  A.draw(ctx, 'oak', 30, 80);
  prop('rock_big', [[14, 146], [24, 146]]);
  prop('rock_mossy', [[226, 112], [238, 108], [212, 116], [150, 100]]);
  prop('rock_pair', [[170, 92], [158, 94], [184, 92], [100, 94]]);
  // small clumps of meadow flowers and grass in the open, never on a prop or a deposit
  const clumps = ['flowers_daisies', 'flowers_pinks', 'flowers_yellows', 'flowers_mixed', 'flowers_daisy_clump', 'flowers_buttercups', 'flowers_pink_clump', 'flowers_posies'];
  for (let i = 0; i < 24; i++) prop(rng.pick(clumps), spots(6, W - 6, 88, H + 2), rng.chance(0.5));
  for (let i = 0; i < 28; i++) prop(`grass_${rng.int(2, 8)}`, spots(4, W - 4, 82, H + 1), rng.chance(0.5));
  // tall grass along the bottom of the frame
  for (let x = 40; x < W; x += rng.int(30, 44)) prop(rng.chance(0.5) ? 'grass_near' : 'grass_1', [[x, H + 6], [x + 8, H + 6]], rng.chance(0.5));
}

/** @param {CanvasRenderingContext2D} ctx @param {Rng} rng */
function river(ctx, rng) {
  const W = SCENE_W, H = SCENE_H;
  gradient(ctx, 0, 0, W, 66, ['#7aaad8', '#a8cce8', '#e0ecf0'], 8);
  for (let i = 0; i < 3; i++) cloud(ctx, rng.int(10, W - 30), rng.int(8, 28), 1, '#ffffff', '#c8dcec');
  treeLine(ctx, rng, 56, 12, '#5a8a7a', '#6f9e88');
  gradient(ctx, 0, 60, W, H - 60, ['#8aaa4a', '#6a8f3a', '#4f7a2a'], 6);
  speckle(ctx, rng, 62, H - 1, 500, ['#9aba5a', '#5a8a32', '#7aa045'], 3);
  // the river winding from the back left to the front right
  for (let y = 62; y < H; y++) {
    const t = (y - 62) / (H - 62), cx = 70 + t * 110 + Math.sin(y * 0.11) * 8, w = 10 + t * 46;
    R(ctx, cx - w / 2 - 3, y, w + 6, 1, '#d8d0b0');
    R(ctx, cx - w / 2 - 1, y, w + 2, 1, '#a89a70');
    for (let x = 0; x < w; x++) R(ctx, cx - w / 2 + x, y, 1, 1, (x + y) % 9 === 0 ? '#9fd4f0' : t < 0.3 ? '#5a9ad0' : bayer(x, y) < t ? '#2f6aa8' : '#4a86c4');
  }
  // willows
  for (const [x, cy] of [[28, 30], [214, 26]]) {
    trunk(ctx, rng, x, cy, 84, 7, BARK);
    canopy(ctx, rng, x + 3, cy, 20, LEAF);
    for (let i = 0; i < 26; i++) { const vx = x + 3 + rng.int(-22, 22), vy = cy + rng.int(0, 10), len = rng.int(12, 34); for (let k = 0; k < len; k++) R(ctx, vx + Math.round(Math.sin(k * 0.3) * 0.6), vy + k, 1, 1, k % 3 ? '#4f8a32' : '#7aba4a'); }
  }
  // reeds and cattails along the banks
  for (let i = 0; i < 26; i++) {
    const x = rng.int(0, W), y = rng.int(80, H), h = rng.int(8, 16);
    R(ctx, x, y - h, 1, h, '#5a7a2a'); if (rng.chance(0.5)) { R(ctx, x - 1, y - h - 1, 3, 4, '#5a3a20'); R(ctx, x - 1, y - h - 1, 1, 4, '#7a5230'); }
  }
  for (let i = 0; i < 6; i++) { const x = rng.int(110, 200), y = rng.int(100, H - 6); disc(ctx, x, y, 3, 1, '#3a7a2a'); R(ctx, x - 1, y - 1, 2, 1, '#6aaa3a'); }
  rock(ctx, rng, 150, 120, 14, 7, RSTONE, MOSS); rock(ctx, rng, 170, 128, 12, 6, RSTONE, MOSS);
  bush(ctx, rng, 52, 78, 10, SHRUB, null); bush(ctx, rng, 244, 92, 12, SHRUB, BERRY); bush(ctx, rng, 8, 112, 11, SHRUB, null);
  rock(ctx, rng, 220, 128, 40, 18, RSTONE, MOSS);
  for (const [x, y, sz] of [[34, 136, 2], [42, 139, 1], [104, 96, 1], [232, 120, 2]]) mushroom(ctx, x, y, sz, ['#3a1a08', '#c8642a', '#f0a050', '#fff3d8']);
  for (let i = 0; i < 6; i++) daisy(ctx, rng.int(10, 60), rng.int(84, 104));
  for (let i = 0; i < 4; i++) fern(ctx, rng, rng.int(0, 50), rng.int(120, H - 2), rng.int(8, 11), '#2a6a1c', '#7ac848');
  for (let i = 0; i < 10; i++) sparkle(ctx, rng.int(60, 200), rng.int(70, H - 4), '#dff4ff');
}

/** @param {CanvasRenderingContext2D} ctx @param {Rng} rng */
function quarry(ctx, rng) {
  const W = SCENE_W, H = SCENE_H;
  gradient(ctx, 0, 0, W, 50, ['#7aa8d8', '#a8c8e8', '#e8e0d0'], 8);
  for (let i = 0; i < 4; i++) cloud(ctx, rng.int(0, W), rng.int(6, 22), rng.pick([1, 2]), '#ffffff', '#d8dce8');
  // terraced rock faces, stepping down toward the front
  const tiers = [[18, 30, ['#5d5a64', '#7d7a84', '#9d9aa4']], [34, 30, ['#55525c', '#75727c', '#95929c']], [52, 28, ['#4d4a54', '#6d6a74', '#8d8a94']]];
  for (const [y, h, c] of /** @type {[number, number, string[]][]} */ (tiers)) {
    let x = -rng.int(0, 20);
    while (x < W) {
      const bw = rng.int(14, 30), top = y + rng.int(-4, 4);
      R(ctx, x, top, bw, h + 20, K);
      R(ctx, x + 1, top + 1, bw - 2, h + 20, c[1]);
      R(ctx, x + 1, top + 1, bw - 2, 2, c[2]);
      R(ctx, x + 1, top + 3, 2, h + 18, c[2]);
      R(ctx, x + bw - 4, top + 3, 3, h + 18, c[0]);
      for (let k = 0; k < 4; k++) R(ctx, x + rng.int(3, bw - 4), top + rng.int(5, h), rng.int(2, 6), 1, c[0]);
      if (rng.chance(0.4)) R(ctx, x + rng.int(3, bw - 6), top + rng.int(6, h - 4), 1, rng.int(4, 9), c[0]);
      x += bw - 1;
    }
  }
  // the pit floor
  gradient(ctx, 0, 74, W, H - 74, ['#a8885a', '#8a6a42', '#6a5032'], 6);
  speckle(ctx, rng, 76, H - 1, 600, ['#c0a070', '#7a5a38', '#5a4228', '#9a7a52'], 2);
  for (let i = 0; i < 70; i++) { const x = rng.int(0, W), y = rng.int(78, H - 2); R(ctx, x, y, 2, 1, '#4a4252'); R(ctx, x, y - 1, 1, 1, '#8a8296'); }
  // a timber crane with rope and hook, scaffolds and ladders
  const wood = ['#24160f', '#5a3a20', '#8a5c33', '#a8763f'];
  const beam = (x, y, w, h) => { R(ctx, x - 1, y - 1, w + 2, h + 2, wood[0]); R(ctx, x, y, w, h, wood[2]); R(ctx, x, y, w, 1, wood[3]); };
  beam(204, 16, 4, 60); beam(170, 14, 50, 4);
  R(ctx, 176, 18, 1, 22, '#3a2a20'); R(ctx, 174, 40, 5, 3, '#545060'); R(ctx, 176, 43, 2, 3, '#716c7c');
  beam(196, 30, 18, 3);
  for (const [x, y, h] of [[90, 44, 30], [136, 50, 26]]) { beam(x, y, 3, h); beam(x + 14, y, 3, h); beam(x - 2, y, 21, 3); for (let r = y + 6; r < y + h; r += 5) R(ctx, x + 3, r, 11, 1, wood[3]); }
  // a lantern on a post at the left, glowing
  beam(16, 50, 3, 34); beam(16, 50, 10, 3);
  R(ctx, 22, 54, 7, 9, K); R(ctx, 23, 55, 5, 7, '#ffb444'); R(ctx, 24, 56, 3, 5, '#fff3b0'); R(ctx, 22, 53, 7, 1, '#545060');
  for (let r = 14; r > 0; r -= 2) disc(ctx, 25, 58, r, r, `rgba(255,190,90,${(0.05).toFixed(3)})`);
  // coal heap and a mine cart
  for (let i = 0; i < 40; i++) { const x = rng.int(0, 44), y = rng.int(100, H); R(ctx, x, y, rng.int(3, 6), rng.int(2, 4), rng.pick(['#1e1b22', '#2c2831', '#3d3844'])); R(ctx, x, y, 1, 1, '#716c7c'); }
  R(ctx, 226, 104, 26, 14, K); R(ctx, 227, 105, 24, 11, '#6d4527'); R(ctx, 227, 105, 24, 2, '#a9743f');
  for (let i = 0; i < 4; i++) R(ctx, 229 + i * 6, 107, 1, 9, '#3a2416');
  disc(ctx, 232, 119, 3, 3, K); disc(ctx, 246, 119, 3, 3, K); R(ctx, 232, 119, 1, 1, '#716c7c'); R(ctx, 246, 119, 1, 1, '#716c7c');
  for (let i = 0; i < 8; i++) R(ctx, 228 + rng.int(0, 20), 102 + rng.int(0, 2), 3, 2, rng.pick(['#3d3844', '#545060']));
  rock(ctx, rng, 60, 118, 22, 12, RSTONE);
  rock(ctx, rng, 190, 126, 18, 10, RSTONE);
  rock(ctx, rng, 120, 130, 30, 14, RSTONE);
  crystals(ctx, rng, 72, 120, 3); crystals(ctx, rng, 134, 132, 4);
  bush(ctx, rng, 248, 78, 9, SHRUB, null); bush(ctx, rng, 4, 80, 8, SHRUB, null);
  for (let i = 0; i < 12; i++) sparkle(ctx, rng.int(40, W - 30), rng.int(80, H - 4), rng.pick(['#fff3d0', '#bfefff']));
}

/** @param {CanvasRenderingContext2D} ctx @param {Rng} rng */
function moonfen(ctx, rng) {
  const W = SCENE_W, H = SCENE_H;
  gradient(ctx, 0, 0, W, 76, ['#070a1a', '#121a3a', '#2a2a5a', '#3a3a6a'], 10);
  for (let i = 0; i < 70; i++) R(ctx, rng.int(0, W), rng.int(0, 56), 1, 1, rng.pick(['#c9b7ff', '#ffffff', '#8fa8e0']));
  for (let i = 0; i < 5; i++) { const x = rng.int(0, W), y = rng.int(0, 40); R(ctx, x - 1, y, 3, 1, '#c9d8ff'); R(ctx, x, y - 1, 1, 3, '#c9d8ff'); }
  // the moon
  disc(ctx, 50, 20, 9, 9, 'rgba(200,220,255,0.12)'); R(ctx, 44, 14, 12, 12, '#e8f0ff'); R(ctx, 44, 14, 12, 1, '#ffffff'); R(ctx, 50, 18, 3, 3, '#c0d0f0'); R(ctx, 46, 22, 2, 2, '#c0d0f0');
  treeLine(ctx, rng, 62, 14, '#141c34', null);
  treeLine(ctx, rng, 70, 12, '#0f1828', null);
  gradient(ctx, 0, 70, W, H - 70, ['#16261e', '#0f1c16', '#0a140f'], 5);
  // channels of black water with cyan glints and reflected stars
  for (let k = 0; k < 3; k++) {
    let cx = rng.int(30, W - 30);
    for (let y = 76 + k * 22; y < H; y++) {
      cx += Math.sin(y * 0.2 + k) * 1.2;
      const w = 14 + (y - 76) * 0.4;
      R(ctx, cx - w / 2, y, w, 1, '#0a1a2a');
      if (rng.chance(0.35)) R(ctx, cx - w / 2 + rng.int(0, w), y, rng.int(1, 4), 1, rng.pick(['#2f8aa8', '#5fd4e8', '#1a4a6a']));
    }
  }
  // willows with dangling moss
  for (const [x, cy] of [[20, 30], [104, 36], [196, 28], [244, 40]]) {
    trunk(ctx, rng, x, cy, 86, 6, ['#05080a', '#1a1612', '#2a221a', '#3a3024']);
    canopy(ctx, rng, x + 3, cy, 18, ['#050a08', '#0f2018', '#1a3a28', '#2a5a3a', '#5fd4b4']);
    for (let i = 0; i < 20; i++) { const vx = x + 3 + rng.int(-18, 18), vy = cy + rng.int(0, 8), len = rng.int(10, 30); for (let k = 0; k < len; k++) R(ctx, vx, vy + k, 1, 1, k % 4 ? '#1f4a34' : '#3f8a5a'); }
  }
  // mossy islands, stone cairns, crystals, reeds and night flowers
  for (let i = 0; i < 8; i++) { const x = rng.int(0, W), y = rng.int(84, H - 4); disc(ctx, x, y, rng.int(8, 14), 3, '#1f3a24'); speckle(ctx, rng, y - 2, y + 1, 10, ['#3f7a3a', '#2a5a2a']); }
  for (const [x, y] of [[66, 88], [150, 98], [222, 92]]) {
    for (let j = 0; j < 3; j++) { R(ctx, x - 5 + j, y - j * 4 - 4, 10 - j * 2, 4, K); R(ctx, x - 4 + j, y - j * 4 - 3, 8 - j * 2, 3, '#4a4a5a'); R(ctx, x - 4 + j, y - j * 4 - 3, 8 - j * 2, 1, '#6a6a7a'); }
    R(ctx, x - 5, y, 10, 1, '#5fd4e8');
  }
  for (const [x, y] of [[36, 98], [180, 86], [128, 120]]) for (let j = 0; j < 3; j++) { const h = rng.int(6, 14), cx = x + j * 4 - 4; R(ctx, cx - 1, y - h, 3, h, '#3a2a6a'); R(ctx, cx, y - h, 1, h, '#c9b7ff'); R(ctx, cx + 1, y - h + 2, 1, h - 2, '#8c6cff'); }
  for (let i = 0; i < 30; i++) { const x = rng.int(0, W), y = rng.int(84, H), h = rng.int(6, 12); R(ctx, x, y - h, 1, h, '#2a4a2a'); if (rng.chance(0.3)) { R(ctx, x - 1, y - h, 3, 2, '#8c6cff'); R(ctx, x, y - h - 1, 1, 1, '#c9b7ff'); } }
  // glowing toadstools
  for (const [x, y, sz] of [[14, 132, 2], [22, 136, 1], [92, 128, 2], [206, 138, 2], [216, 140, 1]]) {
    for (let r = 8; r > 0; r -= 2) disc(ctx, x, y - 4, r, r, 'rgba(95,212,232,0.05)');
    mushroom(ctx, x, y, sz, ['#0a2a3a', '#2fa8c8', '#8ff0ff', '#e9fbff']);
  }
  for (let i = 0; i < 14; i++) sparkle(ctx, rng.int(4, W - 4), rng.int(70, H - 4), rng.pick(['#8fe0ff', '#c9b7ff']));
}

/** @param {CanvasRenderingContext2D} ctx @param {Rng} rng */
function crags(ctx, rng) {
  const W = SCENE_W, H = SCENE_H;
  gradient(ctx, 0, 0, W, 72, ['#2a0f12', '#6a2418', '#c0501f', '#e88a3a'], 10);
  for (let i = 0; i < 5; i++) { const x = rng.int(0, W), y = rng.int(4, 30); disc(ctx, x, y, rng.int(10, 20), rng.int(3, 6), 'rgba(40,20,20,0.35)'); }
  // volcanic peaks with lava runs
  ridge(ctx, rng, 40, 14, 1.4, 90, '#3a1a18');
  ridge(ctx, rng, 56, 10, 1.1, 96, '#2a1210');
  for (let k = 0; k < 4; k++) {
    let x = rng.int(20, W - 20);
    for (let y = rng.int(40, 56); y < 96; y++) { x += rng.range(-1, 1); R(ctx, x, y, 2, 1, y % 3 ? '#ff7a1c' : '#ffb444'); }
  }
  gradient(ctx, 0, 78, W, H - 78, ['#3a1c16', '#2a1210', '#1a0a08'], 5);
  speckle(ctx, rng, 80, H - 1, 500, ['#4a2a20', '#1a0a08', '#5a3226'], 3);
  // lava pools and cracks
  for (let i = 0; i < 4; i++) { const x = rng.int(20, W - 20), y = rng.int(96, H - 8); disc(ctx, x, y, rng.int(8, 16), 3, '#c2410f'); disc(ctx, x, y, rng.int(4, 8), 1, '#ffb444'); }
  for (let i = 0; i < 10; i++) { let x = rng.int(0, W), y = rng.int(84, H); for (let k = 0; k < 12; k++) { R(ctx, x, y, 1, 1, '#ff7a1c'); x += rng.int(-1, 1); y += 1; } }
  // obsidian rocks
  for (let i = 0; i < 6; i++) rock(ctx, rng, rng.int(-6, W - 20), rng.int(88, H - 14), rng.int(14, 26), rng.int(8, 14), ['#05030a', '#140c18', '#241828', '#3a2a3e', '#6a4a7a']);
  rock(ctx, rng, -6, 120, 44, 24, ['#05030a', '#1a1018', '#2a1e28', '#443244', '#7a5a8a']);
  rock(ctx, rng, 212, 124, 48, 20, ['#05030a', '#1a1018', '#2a1e28', '#443244', '#7a5a8a']);
  // fire-glass growing from the stone, and dead thorn bushes
  for (const [x, y] of [[18, 124], [232, 128], [140, 104]]) for (let j = 0; j < 3; j++) { const h = rng.int(5, 11), cx = x + j * 4 - 4; R(ctx, cx - 1, y - h, 3, h, '#4a0f08'); R(ctx, cx, y - h, 1, h, '#ffb444'); R(ctx, cx + 1, y - h + 2, 1, h - 2, '#ff7a1c'); }
  for (const [x, y] of [[70, 96], [190, 92]]) for (let k = 0; k < 7; k++) { let bx = x, by = y; const a = -Math.PI / 2 + (k - 3) * 0.35; for (let i = 0; i < 10; i++) { R(ctx, bx, by, 1, 1, '#2a1410'); bx += Math.cos(a) * 1.1; by += Math.sin(a); } }
  for (let i = 0; i < 16; i++) sparkle(ctx, rng.int(4, W - 4), rng.int(60, H - 4), rng.pick(['#ffb444', '#ff7a1c']), '#fff3b0');
}

const PAINTERS = { forest, meadow, river, quarry, moonfen, crags };
/** Each region composed from its sprite atlas, once that has loaded, over its backdrop colour. */
const BACKDROP = { forest: '#2f6a4a', river: '#6aa8e0', quarry: '#9aa6c0', moonfen: '#1a2a4a', crags: '#6a2418' };
const SPRITE_PAINTERS = { forest: forestSprites, meadow: meadowSprites, river: riverSprites, quarry: quarrySprites, moonfen: moonfenSprites, crags: cragsSprites };

/**
 * Paint a region's static panorama into a 256×144 context. Each region is
 * composed from its sprite atlas once that has loaded (procedural until
 * then); `avoid` lists the deposits' boxes, which its props keep clear of.
 * @param {CanvasRenderingContext2D} ctx @param {string} region @param {string} seed @param {{x0:number, y0:number, x1:number, y1:number}[]} [avoid]
 */
export function paintRegion(ctx, region, seed, avoid = []) {
  const rng = new Rng(`scene2:${seed}:${region}`);
  const id = PAINTERS[region] ? region : 'forest';
  if (REGION_ATLAS[id].ready) {
    // the far colour behind the keyed bands, should a gap in them show through
    if (BACKDROP[id]) R(ctx, 0, 0, SCENE_W, SCENE_H, BACKDROP[id]);
    SPRITE_PAINTERS[id](ctx, rng, avoid);
  }
  else PAINTERS[id](ctx, rng);
  // a dark frame line so the panel reads as a painting
  R(ctx, 0, 0, SCENE_W, 1, 'rgba(0,0,0,0.35)');
  R(ctx, 0, SCENE_H - 1, SCENE_W, 1, 'rgba(0,0,0,0.35)');
}

/**
 * Animated overlay (wisps, birds, butterflies, ripples, embers) drawn each frame.
 * @param {CanvasRenderingContext2D} ctx @param {string} region @param {number} t seconds
 */
export function animateRegion(ctx, region, t) {
  const W = SCENE_W, H = SCENE_H;
  if (region === 'moonfen') {
    for (let i = 0; i < 7; i++) {
      const x = Math.round(W * (0.08 + i * 0.13) + Math.sin(t * 0.7 + i * 2) * 10), y = Math.round(H * (0.5 + 0.06 * (i % 3)) + Math.sin(t * 1.3 + i) * 6);
      for (let r = 6; r > 0; r -= 2) disc(ctx, x, y, r, r, 'rgba(95,212,232,0.06)');
      R(ctx, x - 1, y - 2, 2, 4, '#8fe0ff'); R(ctx, x - 1, y, 2, 2, '#e9fbff'); R(ctx, x, y - 4 + Math.round(Math.sin(t * 8 + i)), 1, 2, '#5fd4e8');
    }
  } else if (region === 'forest' || region === 'meadow' || region === 'river') {
    // the meadow's birds are the pack's, two wingbeats apart
    if (region === 'meadow' && MEADOW.ready) for (let i = 0; i < 2; i++) {
      const x = ((t * (6 + i * 2) + i * 130) % (W + 20)) - 10, y = H * (0.1 + i * 0.12) + Math.sin(t * 1.5 + i) * 2;
      MEADOW.draw(ctx, Math.sin(t * 7 + i * 2) > 0 ? 'bird_1' : 'bird_3', x, y);
    }
    else for (let i = 0; i < 3; i++) {
      const x = ((t * (8 + i * 3) + i * 80) % (W + 20)) - 10, y = H * (0.12 + i * 0.06) + Math.sin(t * 3 + i) * 2;
      const up = Math.sin(t * 10 + i) > 0 ? 1 : 0;
      R(ctx, x, y, 1, 1, '#24160f'); R(ctx, x - 1, y - up, 1, 1, '#24160f'); R(ctx, x + 1, y - up, 1, 1, '#24160f'); R(ctx, x - 2, y - up * 2 + 1, 1, 1, '#24160f'); R(ctx, x + 2, y - up * 2 + 1, 1, 1, '#24160f');
    }
    if (region === 'meadow') for (let i = 0; i < 4; i++) {
      const x = W * (0.2 + i * 0.2) + Math.sin(t * 0.9 + i * 3) * 18, y = H * 0.66 + Math.sin(t * 1.7 + i) * 8, open = Math.sin(t * 14 + i) > 0;
      const c = ['#ffe58a', '#ff9fc7', '#ffffff', '#c9b7ff'][i];
      R(ctx, x - (open ? 2 : 1), y, open ? 2 : 1, 2, c); R(ctx, x + 1, y, open ? 2 : 1, 2, c); R(ctx, x, y, 1, 2, K);
    }
    if (region === 'forest') for (let i = 0; i < 10; i++) {
      const x = (i * 37 + Math.sin(t * 0.5 + i) * 6) % W, y = 40 + ((i * 29 + t * 4) % 60);
      if (Math.sin(t * 2 + i * 1.7) > 0.3) R(ctx, x, y, 1, 1, '#fff6c0');
    }
    // glints drifting down the river (across the sprite scene, winding down the painted one)
    if (region === 'river' && REGION_ATLAS.river.ready) for (let i = 0; i < 8; i++) {
      const x = ((t * (5 + i % 3) + i * 37) % (W + 8)) - 4, y = 98 + ((i * 5) % 14) + Math.round(Math.sin(t * 2 + i));
      R(ctx, x, y, 3, 1, '#dff4ff');
    }
    else if (region === 'river') for (let i = 0; i < 8; i++) {
      const y = 70 + ((t * 8 + i * 9) % (H - 70)), tt = (y - 62) / (H - 62), x = 70 + tt * 110 + Math.sin(y * 0.11) * 8 + Math.sin(t * 2 + i) * 6;
      R(ctx, x, y, 3, 1, '#dff4ff');
    }
  } else if (region === 'crags') {
    for (let i = 0; i < 12; i++) {
      const y = H * 0.75 - ((t * 12 + i * 11) % 60), x = W * (0.05 + i * 0.08) + Math.sin(t + i) * 4;
      R(ctx, x, y, 1, 1, i % 3 ? '#ffb444' : '#ff7a1c');
    }
  } else if (region === 'quarry') {
    for (let i = 0; i < 6; i++) {
      const x = (i * 47 + t * 6) % W, y = 60 + Math.sin(t * 0.8 + i) * 10 + i * 6;
      R(ctx, x, y, 1, 1, 'rgba(255,240,210,0.6)');
    }
    // the painted lantern flickers (the sprite scene's lanterns are part of the crane and the lamp post)
    const flick = 0.7 + 0.3 * Math.sin(t * 9);
    if (!REGION_ATLAS.quarry.ready) R(ctx, 24, 56, 3, 5, `rgba(255,243,176,${flick.toFixed(2)})`);
  }
}
