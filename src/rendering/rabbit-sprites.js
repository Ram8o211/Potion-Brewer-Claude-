// Moon Rabbits from the painted Rabbits Atlas (assets/rabbits/atlas.png,
// built by scripts/make-rabbits.py): the idle and hop cycles, the natural
// coats, two frames for every level of strength, venom, love,
// transformation, acid and fire, and a death for each. Every frame is the
// top 48 × 34 of a rabbit frame (feet on row 33), so it drops into
// drawRabbit's frame in place of the procedural body.
//
// The sheet paints one white rabbit with brown spots; each rabbit wears its
// own coat: the pixels the build marked as fur (by their alpha) are repainted
// in look.coat and the spots in look.coat2 (or in the coat, a shade deeper,
// for a solid coat), each by its brightness, one recoloured copy of the sheet
// per coat.
//
// The sheet has one ear shape: lop, half-lop and short-eared rabbits wear its
// upright ears. What the atlas cannot show (grown traits, the hutch's loaf, rear and flop poses, a collapse, frost, arcana and the rest of the
// channels as the main effect) stays procedural: rabbitFrame says null and
// rabbit.js paints the rabbit as before. Until the sheet has loaded, and in
// Node, every rabbit is procedural.

import { ATLAS_URL, FRAMES, COAT_ALPHA, COAT_V } from './rabbit-atlas.js';
import { MARK_INDEX } from '../game/colony.js';

/** The channels the atlas paints, the strongest first on a tie. */
export const ATLAS_CHANNELS = ['fire', 'toxicity', 'acid', 'transformation', 'love', 'strength'];
/** Cause of death → its death frame (the rest lie as the plain dead rabbit). @type {Record<string, string>} */
const DEATH_FRAME = { fire: 'fire_dead', poison: 'toxicity_dead', acid: 'acid_dead', love: 'love_dead', change: 'transformation_dead' };

/** @param {any} v */
const lvl = (v) => (v >= 3 ? 3 : v >= 2 ? 2 : v >= 1 ? 1 : 0);
/** @param {number} v @param {number} m */
const mod = (v, m) => ((v % m) + m) % m;

/**
 * The atlas frame a rabbit is drawn with now, and the channel it paints (whose
 * procedural overlay is then left out), or null to paint it procedurally.
 * Pure: a function of the look, the snapshot, the pose and the time.
 * @param {any} look RabbitLook @param {any} snap RabbitSnap
 * @param {{pose:string, t:number, air?:boolean}} o pose as rabbitPose says, seconds, off the ground
 * @returns {{name:string, channel:string|null} | null}
 */
export function rabbitFrame(look, snap, o) {
  if (!look || !snap) return null;
  if (Array.isArray(snap.traits) && snap.traits.length) return null;
  const pre = snap.stage === 'kit' ? 'kit_' : '';
  const has = (/** @type {string} */ n) => (FRAMES[pre + n] ? pre + n : null);
  if (o.pose === 'dead') {
    const n = has(DEATH_FRAME[snap.cause] || 'dead');
    return n ? { name: n, channel: null } : null;
  }
  const lv = Array.isArray(snap.lv) ? snap.lv : [];
  /** @param {string} ch */
  const L = (ch) => lvl(lv[MARK_INDEX[ch]]);
  let ch = null, best = 0;
  for (const c of ATLAS_CHANNELS) if (L(c) > best) { ch = c; best = L(c); }
  // a frozen rabbit, or one poisoned or worn down into a slump, is the procedural one
  if (L('frost') === 3) return null;
  if (o.pose === 'sick' && !(ch === 'toxicity' && best >= 2)) return null;
  if (o.pose !== 'idle' && o.pose !== 'sick') return null;
  const seed = (look.seed >>> 0) || 1, t = Number(o.t) || 0;
  if (ch) {
    // venom's second frame is the rabbit sunk on its side: one or the other, by the rabbit;
    // the other effects flicker between their two frames
    const i = ch === 'toxicity' ? seed & 1 : Math.floor(mod(t * 2.5 + (seed % 5) * 0.2, 2));
    const n = has(`${ch}_${best}_${i}`);
    return n ? { name: n, channel: ch } : null;
  }
  if (o.air) return { name: /** @type {string} */ (has(`hop_${Math.floor(mod(t * 10, 4))}`)), channel: null };
  if (!pre && (look.pattern === 'dutch' || look.pattern === 'hooded')) return { name: 'dutch', channel: null };
  if (!pre && look.pattern === 'solid') return { name: 'white', channel: null };
  return { name: /** @type {string} */ (has(`idle_${Math.floor(mod(t * 2.2 + (seed % 7) * 0.3, 4))}`)), channel: null };
}

// ------------------------------------------------------------------ the sheet and its coats

/** @type {HTMLImageElement | null} */
let img = null;
let loading = false;
/** recoloured sheets by coat key @type {Map<string, any>} */
const COATS = new Map();
const COATS_MAX = 24;

/** Start loading the sheet (once; nothing without a DOM). */
export function loadRabbitAtlas() {
  if (loading || typeof Image === 'undefined' || typeof document === 'undefined') return;
  loading = true;
  const im = new Image();
  im.onload = () => { img = im; };
  im.src = ATLAS_URL;
}

/** Whether the atlas can be drawn. */
export const rabbitAtlasReady = () => !!img;

/** @param {any} v @param {number[]} fb @returns {number[]} */
const rgb = (v, fb) => (Array.isArray(v) && v.length >= 3 ? [0, 1, 2].map((i) => Math.max(0, Math.min(1, +v[i] || 0))) : fb);

/**
 * The sheet with its fur in look.coat and its spots in look.coat2 (or the
 * coat for a solid one), made once per coat.
 * @param {any} look
 */
function coatSheet(look) {
  const coat = rgb(look.coat, [0.93, 0.89, 0.82]);
  const solid = look.pattern === 'solid';
  const spot = solid ? coat.map((c) => c * 0.86) : rgb(look.coat2, [0.36, 0.24, 0.18]);
  const key = coat.concat(spot).map((c) => Math.round(c * 255)).join(',');
  let cv = COATS.get(key);
  if (cv) return cv;
  if (!img) return null;
  cv = document.createElement('canvas');
  cv.width = img.width; cv.height = img.height;
  const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d', { willReadFrequently: true }));
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, cv.width, cv.height), d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3], fur = a === COAT_ALPHA.fur;
    if (!fur && a !== COAT_ALPHA.spot) continue;
    const c = fur ? coat : spot, k = Math.max(d[i], d[i + 1], d[i + 2]) / 255 / (fur ? COAT_V.fur : COAT_V.spot);
    // brightness 1 is the coat as rolled; a light shade above it lifts it toward white (highlights stay highlights)
    for (let j = 0; j < 3; j++) d[i + j] = Math.round(255 * Math.min(1, k <= 1 ? c[j] * k : c[j] + (1 - c[j]) * (k - 1) * 0.6));
    d[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  COATS.set(key, cv);
  if (COATS.size > COATS_MAX) COATS.delete(COATS.keys().next().value);
  return cv;
}

/**
 * Draw a frame in the rabbit's coat with its top-left at (x, y) of a 48-wide
 * rabbit frame, mirrored inside that frame to face left.
 * @param {CanvasRenderingContext2D} ctx @param {any} look @param {string} name @param {number} x @param {number} y @param {boolean} mirror
 * @returns {boolean} whether it was drawn
 */
export function drawRabbitFrame(ctx, look, name, x, y, mirror) {
  // the Dutch rabbit is dark with a white band: its coat is the dark, its pattern colour the band
  const f = FRAMES[name], sheet = f && coatSheet(name === 'dutch' ? { ...look, coat: look.coat2, coat2: look.coat } : look);
  if (!f || !sheet) return false;
  const [sx, sy, w, h] = f;
  if (mirror) {
    ctx.save();
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(sheet, sx, sy, w, h, 0, 0, w, h);
    ctx.restore();
  } else ctx.drawImage(sheet, sx, sy, w, h, x, y, w, h);
  return true;
}
