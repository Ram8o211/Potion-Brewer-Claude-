// Flowers and flowering plants (petal, flower, clover, spike, lily).
//
// Grammar: a rosette or stem leaves in the species' leaf shape, one to three
// stems, and on each a head built for its form — a ring of overlapping
// petals seen three-quarters on (cup and rose flowers), a composite of ray
// petals round a big disc or a prickly globe on a swollen cup (daisy and
// thistle kinds), a spike of whorled florets, a trumpet nodding on its
// stem, or trefoil leaves under ball-shaped heads (clovers). Petal count,
// outline, layering, tilt, markings and the centre vary per world; the
// species' colour and its alchemical tints stay.

import { Model, PROFILES, stream, pick, leaf, stemPts, marks, LEAF_SHAPES, blade, ellipse } from './common.js';

export function params(rng, d) {
  const t = d.tr, form = d.form;
  const petalShapes = ['round', 'ovate', 'spoon', 'heart', 'lance', 'wedge'];
  const w = petalShapes.map((s) => (s === 'heart' || s === 'round' ? 1 + t.round * 3 : s === 'lance' || s === 'wedge' ? 1 + t.sharp * 3 : 1));
  const kind = form === 'flower' ? rng.weighted(['daisy', 'thistle', 'aster'], [1, 1.4, 0.8])
    : form === 'petal' ? rng.weighted(['cup', 'rose', 'star'], [1.2, 1, 0.8])
      : form === 'spike' ? rng.weighted(['whorl', 'raceme'], [1, 1]) : form === 'lily' ? rng.weighted(['trumpet', 'star'], [1.5, 1]) : 'clover';
  return {
    kind,
    heads: d.id.rare ? rng.int(1, 2) : rng.int(1, 3),
    petals: kind === 'daisy' || kind === 'aster' ? rng.int(11, 16) : kind === 'trumpet' ? rng.int(5, 6) : rng.int(4, 8),
    petalShape: rng.weighted(petalShapes, w),
    petalLen: rng.range(0.85, 1.2),
    petalWide: rng.range(0.75, 1.25) * (1 + t.round * 0.2) * (1 - t.sharp * 0.2),
    layers: kind === 'rose' ? 2 : rng.next() < 0.25 ? 2 : 1,
    tilt: rng.range(0.5, 0.85),
    centre: rng.range(0.22, 0.38),
    petalMark: t.spots > 0.3 ? 'dots' : pick(rng, ['none', 'none', 'tip', 'stripe', 'eye']),
    leafShape: rng.weighted(LEAF_SHAPES, [1, 1 + t.sharp * 2, 1 + t.round * 2, 1 + t.round, 0.6, 0.7]),
    teeth: rng.next() < 0.45 + t.sharp * 0.3 ? rng.int(3, 7) : 0,
    leaves: rng.int(2, 4) + Math.round(t.lush * 2),
    basal: rng.next() < 0.5,
    bend: (rng.next() - 0.5) * 0.5,
    spread: rng.range(0.25, 0.55),
    nod: kind === 'trumpet' ? rng.range(0.3, 1.2) : 0,
  };
}

export function size(d) {
  const k = d.m.kind;
  if (k === 'clover') return { w: 20, h: 16 };
  if (k === 'whorl' || k === 'raceme') return { w: 16, h: 30 };
  if (k === 'thistle') return { w: 20, h: 28 };
  return { w: 22, h: 26 };
}

/**
 * A flower head at (x, y) of radius r.
 * @param {Model} m @param {any} d @param {number} x @param {number} y @param {number} r @param {{open?:number, view?:'side'|'front', seed?:number, drop?:number}} [o]
 */
export function head(m, d, x, y, r, o = {}) {
  const P = d.m, rng = stream(d, 'head' + (o.seed || 0)), open = o.open ?? 1;
  const kind = P.kind;
  if (open < 0.5) return bud(m, d, x, y, r, open);
  if (kind === 'thistle') return thistle(m, d, x, y, r, rng);
  if (kind === 'trumpet') return trumpet(m, d, x, y, r, rng, P.nod);
  if (kind === 'clover') return cloverHead(m, d, x, y, r * 0.8, rng);
  const tilt = o.view === 'front' ? Math.max(0.8, P.tilt) : P.tilt;
  const n = P.petals, prof = PROFILES[P.petalShape] || PROFILES.ovate;
  const rot = rng.next() * Math.PI;
  const len = r * P.petalLen * (kind === 'daisy' || kind === 'aster' ? 1 : 0.95);
  const wid = len * (kind === 'daisy' || kind === 'aster' ? 0.13 : 0.36) * P.petalWide * Math.min(1.15, 5.5 / n);
  const drop = o.drop || 0;
  const layers = [];
  for (let L = 0; L < P.layers; L++) {
    for (let i = 0; i < n; i++) {
      const a = rot + (i + L * 0.5) * (Math.PI * 2 / n) + (rng.next() - 0.5) * 0.15 * (1 + d.tr.asym * 3);
      const sl = (1 - L * 0.32) * (1 + (rng.next() - 0.5) * 0.12 * (1 + d.tr.asym * 3));
      if (drop && rng.next() < drop) continue;
      layers.push({ a, L, sl, back: Math.sin(a) < -0.15 });
    }
  }
  // the far petals first, then the near ones, the inner layer on top
  layers.sort((p, q) => p.L - q.L || (p.back === q.back ? 0 : p.back ? -1 : 1) || Math.sin(p.a) - Math.sin(q.a));
  for (const p of layers) {
    const dx = Math.cos(p.a), dy = Math.sin(p.a) * tilt, pl = len * p.sl * Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx);
    const ww = wid * (0.7 + 0.3 * Math.abs(Math.cos(p.a))) * (1 - p.L * 0.2);
    const mat = p.L ? 'main2' : 'main';
    m.poly(blade([x, y], ang, pl, ww, prof, { curl: kind === 'star' ? 0.3 : 0 }), mat, { shade: 'round', tone: p.back ? -0.12 : p.L ? 0.05 : 0 });
    const tip = /** @type {[number, number]} */ ([x + Math.cos(ang) * pl, y + Math.sin(ang) * pl]);
    if (P.petalMark === 'tip' && pl > 3) m.line([[x + Math.cos(ang) * pl * 0.7, y + Math.sin(ang) * pl * 0.7], tip], 'accent', { lum: 0.65 });
    if (P.petalMark === 'stripe' && pl > 3) m.line([[x + Math.cos(ang) * pl * 0.25, y + Math.sin(ang) * pl * 0.25], [x + Math.cos(ang) * pl * 0.75, y + Math.sin(ang) * pl * 0.75]], 'mark', { lum: 0.4 });
  }
  const cr = r * P.centre * (kind === 'daisy' || kind === 'aster' ? 1.3 : 1);
  if (P.petalMark === 'eye') m.ellipse(x, y, cr * 1.8, cr * 1.8 * tilt, 'accent', { tone: -0.05, noOutline: true });
  m.ellipse(x, y, cr, cr * Math.max(0.7, tilt), 'center', { tex: 1.6 });
  // seeds and stamens in the disc
  for (let i = 0; i < Math.round(cr * cr * 0.6); i++) m.dot(x + (rng.next() - 0.5) * cr * 1.4, y + (rng.next() - 0.5) * cr * 1.1, 'center', { lum: rng.next() < 0.5 ? 0.15 : 0.9 });
  if (P.petalMark === 'dots') for (let i = 0; i < 4; i++) { const a = rng.next() * Math.PI * 2; m.dot(x + Math.cos(a) * len * 0.55, y + Math.sin(a) * len * 0.55 * tilt, 'accent', { lum: 0.3 }); }
  marks(m, d, rng, x, y, len * 0.7, len * 0.7 * tilt);
  return m;
}

/** A closed bud (out of its hour, or still growing): sepals wrapped round a coloured tip. */
function bud(m, d, x, y, r, open) {
  const h = r * (1.1 + open), w = r * 0.55;
  m.poly(blade([x, y + r * 0.3], -Math.PI / 2, h, w, PROFILES.ovate), 'main', { shade: 'round', tone: -0.05 });
  m.poly(blade([x, y + r * 0.4], -Math.PI / 2 - 0.35, h * 0.62, w * 0.55, PROFILES.lance), 'leaf', { shade: 'fold' });
  m.poly(blade([x, y + r * 0.4], -Math.PI / 2 + 0.35, h * 0.62, w * 0.55, PROFILES.lance), 'leaf', { shade: 'fold', tone: -0.05 });
  return m;
}

/** A thistle: a swollen, scaled cup topped by a brush of florets. */
function thistle(m, d, x, y, r, rng) {
  const cw = r * 0.62, ch = r * 0.7;
  // the brush of florets
  const n = Math.round(r * 2.2);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / (n - 1) - 0.5) * 2.4 + (rng.next() - 0.5) * 0.12;
    const L = r * (0.85 + rng.next() * 0.35) * (Math.abs(a + Math.PI / 2) > 0.9 ? 0.8 : 1);
    m.stroke([[x, y - ch * 0.3], [x + Math.cos(a) * L, y - ch * 0.3 + Math.sin(a) * L]], [Math.max(1, r * 0.12), 0.8], i % 3 ? 'main' : 'main2', { tone: (i % 2 ? -0.12 : 0.08) + (Math.cos(a) > 0.2 ? -0.08 : 0), noOutline: true });
    if (i % 2) m.dot(x + Math.cos(a) * L, y - ch * 0.3 + Math.sin(a) * L, 'main', { lum: 0.95, clip: false });
  }
  // the cup, scaled like a pine cone, sharp at its edges
  m.poly(ellipse(x, y + ch * 0.15, cw, ch * 0.7), 'leaf', { shade: 'round' });
  for (let j = 0; j < 3; j++) for (let i = -2; i <= 2; i++) {
    const sx = x + i * cw * 0.38 + (j % 2) * cw * 0.19, sy = y - ch * 0.05 + j * ch * 0.25;
    m.dot(sx, sy, 'leaf', { lum: 0.85 });
  }
  if (d.tr.sharp > 0.2 || rng.next() < 0.7) for (const s of [-1, 1]) m.line([[x + s * cw, y + ch * 0.1], [x + s * (cw + r * 0.35), y - ch * 0.05]], 'leaf', { lum: 0.7, clip: false });
  marks(m, d, rng, x, y - ch * 0.4, r * 0.6, r * 0.5);
  return m;
}

/** A trumpet flower: a flared funnel on a nodding neck. */
function trumpet(m, d, x, y, r, rng, nod) {
  const ang = -Math.PI / 2 + nod, len = r * 1.5;
  const c = Math.cos(ang), s = Math.sin(ang);
  // the tube
  m.poly(blade([x, y], ang, len, r * 0.6, (t) => 0.35 + t * t * 0.75), 'main', { shade: 'round' });
  // the flared lip: petal tips curling back round the mouth
  const mx = x + c * len, my = y + s * len, P = d.m;
  for (let i = 0; i < P.petals; i++) {
    const a = ang + ((i / (P.petals - 1)) - 0.5) * 2.6;
    m.poly(blade([mx - c * r * 0.3, my - s * r * 0.3], a, r * 0.8, r * 0.38, PROFILES[P.petalShape] || PROFILES.lance, { curl: 0.6 * Math.sign(a - ang) }), i % 2 ? 'main2' : 'main', { tone: Math.abs(a - ang) > 0.9 ? -0.08 : 0.05 });
  }
  // the throat and stamens
  m.ellipse(mx, my, r * 0.28, r * 0.28, 'center', { shade: 'flat', tone: -0.25 });
  for (let i = 0; i < 3; i++) m.stroke([[mx, my], [mx + c * r * 0.6 + (i - 1) * r * 0.25, my + s * r * 0.6]], 0.8, 'center', { shade: 'flat', noOutline: true, tone: 0.2 });
  marks(m, d, rng, x + c * len * 0.5, y + s * len * 0.5, r * 0.5, r * 0.6);
  return m;
}

/** A clover head: a ball of tiny florets. */
function cloverHead(m, d, x, y, r, rng) {
  m.ellipse(x, y, r * 0.8, r * 0.85, 'main', { tex: 1.8 });
  for (let i = 0; i < r * r * 1.2; i++) {
    const a = rng.next() * Math.PI * 2, q = Math.sqrt(rng.next()) * r * 0.7;
    m.dot(x + Math.cos(a) * q, y + Math.sin(a) * q * 0.9, rng.next() < 0.5 ? 'main2' : 'main', { lum: rng.next() < 0.6 ? 0.85 : 0.25 });
  }
  marks(m, d, rng, x, y, r * 0.6, r * 0.6);
  return m;
}

/** A trefoil leaf (clovers): three heart leaflets with pale chevrons. */
function trefoil(m, d, x, y, r, rng, tone = 0) {
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i - 1) * 2.1 + (rng.next() - 0.5) * 0.2;
    m.poly(blade([x, y], a, r, r * 0.55, PROFILES.heart), 'leaf', { shade: 'fold', tone });
    m.dot(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, 'leaf', { lum: 0.95 });
  }
  return m;
}

/** The stems of a mature or ripe plant and where their heads sit. */
function layout(d, stage) {
  const P = d.m, rng = stream(d, 'layout'), H = d.size.h * (stage === 2 ? 1 : 0.7), W = d.size.w;
  const heads = stage === 2 ? P.heads : Math.max(1, P.heads - 1);
  const out = [];
  for (let i = 0; i < heads; i++) {
    const f = heads === 1 ? 0 : i / (heads - 1) - 0.5;
    const hh = H * (1 - Math.abs(f) * 0.35 - (i === 0 ? 0 : rng.next() * 0.15));
    out.push({ x: f * W * P.spread * 1.4 + (rng.next() - 0.5) * 2, y: -hh, bend: P.bend + f * 0.4, seed: i });
  }
  return out;
}

/** A spike of florets up the top of a stem (bee balm, lupins…). */
function spike(m, d, pts, stage, o, rng, k = 1) {
  const P = d.m;
  m.stroke(pts, [1.8 + d.tr.thick, 1.1], 'stem', { noOutline: true });
  const top = pts[pts.length - 1], n = stage === 2 ? 6 : 3, step = d.size.h * 0.07 * (k > 1 ? 0.7 : 1);
  for (let i = n - 1; i >= 0; i--) {
    const y = top[1] + i * step, w = k * (P.kind === 'whorl' ? 4.5 : 3.2) * (1 - (n - 1 - i) / (n + 3)) * (o.closed ? 0.6 : 1);
    const lit = stage === 2 && !o.closed;
    if (P.kind === 'whorl') {
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k - 2) * 0.7;
        m.stroke([[top[0], y], [top[0] + Math.cos(a) * w, y + Math.sin(a) * w * 0.7]], [1.6, 1], k % 2 ? 'main2' : 'main', { noOutline: true, tone: k === 0 || k === 4 ? -0.1 : 0.05 });
      }
      m.ellipse(top[0], y + 0.5, w * 0.45, 1.2, 'main', { tone: -0.15 });
    } else {
      m.ellipse(top[0] + (i % 2 ? 1 : -1), y, w * 0.55, w * 0.42, lit ? (i % 2 ? 'main' : 'main2') : 'leaf', { tone: lit ? 0 : 0.1 });
    }
  }
  marks(m, d, rng, top[0], top[1] + n * step * 0.5, 3, n * step * 0.5);
}

export function icon(d) {
  const m = new Model(), P = d.m, rng = stream(d, 'icon');
  if (P.kind === 'whorl' || P.kind === 'raceme') {
    const pts = stemPts(0, 0, 1, -26, 0.1);
    spike(m, d, pts, 2, {}, rng, 1.8);
    leaf(m, pts[3][0], pts[3][1], -Math.PI / 2 - 1.1, 7, 2.6, { shape: P.leafShape, teeth: P.teeth });
    leaf(m, pts[4][0], pts[4][1], -Math.PI / 2 + 1.1, 6, 2.4, { shape: P.leafShape, teeth: P.teeth, tone: -0.05 });
    return m.rotate(0.25);
  }
  if (P.kind === 'clover') {
    m.stroke([[0, 14], [2, 0]], 1.4, 'stem', { noOutline: true });
    trefoil(m, d, -4, 8, 7, rng);
    head(m, d, 2, -3, 9, { seed: 0 });
    return m;
  }
  m.stroke([[-4, 13], [-2, 6], [0, 0]], [2.4, 1.8], 'stem');
  leaf(m, -3, 9, -Math.PI + 0.5, 10, 3.8, { shape: P.leafShape, teeth: P.teeth });
  head(m, d, 0, 0, 13, { view: 'front', seed: 0 });
  return m;
}

export function piece(d, v) {
  const m = new Model(), P = d.m, rng = stream(d, 'piece' + v);
  if (v === 3 || P.kind === 'clover' && v === 2) {
    // a torn leafy sprig with a closed bud
    if (P.kind === 'clover') trefoil(m, d, 0, 2, 10, rng);
    else {
      leaf(m, 0, 0, -0.4, 14, 5, { shape: P.leafShape, teeth: P.teeth });
      leaf(m, 0, 0, -2.6, 12, 4.5, { shape: P.leafShape, teeth: P.teeth, tone: -0.05 });
    }
    head(m, d, 0, -2, 7, { open: 0.3 });
    return m;
  }
  if (P.kind === 'whorl' || P.kind === 'raceme') {
    // a broken-off length of the spike: florets, hardly any stem
    spike(m, d, [[0, 4], [0, -10 + v * 2]], 2, {}, rng, 1.8);
    return m.rotate(v * 0.6);
  }
  if (v === 2 && P.kind !== 'trumpet' && P.kind !== 'thistle') {
    // a few loose petals
    const prof = PROFILES[P.petalShape] || PROFILES.ovate;
    for (let i = 0; i < 3; i++) m.poly(blade([(i - 1) * 4, 4 - (i % 2) * 3], -Math.PI / 2 + (i - 1) * 0.5, 13, 13 * 0.36 * P.petalWide, prof), i === 1 ? 'main2' : 'main', { tone: i === 1 ? 0.05 : -0.05 });
    return m;
  }
  head(m, d, 0, 0, 12, { view: 'front', seed: v + 1, drop: v === 1 ? 0.3 : 0 });
  if (v === 1) m.rotate(0.9);
  return m;
}
