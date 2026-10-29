// Bark and woody materials (bark).
//
// Grammar: a gnarled sapling or pollarded stump whose bark is the harvest —
// ridged and fissured plates, papery peeling strips or smooth bark with
// lenticels — bearing a few leafy shoots (or weeping fronds) when mature;
// resinous species bead with glowing sap. The icon and the pieces are
// curled strips and plates of that bark.

import { Model, stream, pick, leaf, mound, marks, LEAF_SHAPES } from './common.js';

export function params(rng, d) {
  return {
    texture: pick(rng, ['ridged', 'plated', 'peeling', 'smooth']),
    habit: pick(rng, ['stump', 'sapling', 'pollard']),
    girth: rng.range(0.28, 0.38) * (1 + d.tr.thick * 0.25),
    lean: (rng.next() - 0.5) * 0.3,
    shoots: rng.int(2, 4),
    leafShape: rng.weighted(LEAF_SHAPES, [1, 1.3, 0.7, 0.5, 1.2, 0.4]),
    weep: d.id.region === 'river' || rng.next() < 0.2,
    resin: d.tr.warm > 0.3 || rng.next() < 0.25,
  };
}

export function size(d) { return { w: 22, h: 28 }; }

/** Bark texture over a rectangle-ish trunk area (x0..x1, y0..y1). */
function barkTexture(m, d, rng, x0, x1, y0, y1) {
  const P = d.m, w = x1 - x0;
  if (P.texture === 'ridged' || P.texture === 'plated') {
    for (let i = 0; i < Math.max(2, Math.round(w / 2.6)); i++) {
      let x = x0 + 1 + (i + 0.5) * ((w - 2) / Math.max(2, Math.round(w / 2.6)));
      const pts = [];
      for (let y = y0 + 1; y <= y1 - 1; y += 2) { pts.push([x, y]); x += (rng.next() - 0.5) * 1.2; }
      m.line(/** @type {any} */ (pts), 'wood', { lum: 0.06 });
      if (P.texture === 'plated') for (let y = y0 + 3; y < y1 - 2; y += 4 + rng.next() * 3) m.line([[x - 2, y], [x, y + 0.5]], 'wood', { lum: 0.08 });
    }
  } else if (P.texture === 'peeling') {
    for (let i = 0; i < w * 0.6; i++) { const x = x0 + rng.next() * w, y = y0 + rng.next() * (y1 - y0); m.line([[x, y], [x + 1.5, y + 0.5]], 'pale', { lum: 0.8 }); }
  } else {
    for (let i = 0; i < w * 0.5; i++) { const x = x0 + rng.next() * w, y = y0 + rng.next() * (y1 - y0); m.line([[x, y], [x + 1.5, y]], 'wood', { lum: 0.15 }); }
  }
  if (P.resin) for (let i = 0; i < 2; i++) { const x = x0 + w * (0.3 + rng.next() * 0.4), y = y0 + (y1 - y0) * (0.3 + rng.next() * 0.5); m.dot(x, y, 'accent', { lum: 0.85, glow: true }); m.dot(x, y + 1, 'accent', { lum: 0.5 }); }
  marks(m, d, rng, (x0 + x1) / 2, (y0 + y1) / 2, w * 0.4, (y1 - y0) * 0.35);
}

export function plant(d, stage, o = {}) {
  const m = new Model(), P = d.m, rng = stream(d, 'plant' + stage), H = d.size.h, W = d.size.w;
  mound(m, W * 0.85, stream(d, 'mound'));
  const g = [0.45, 0.75, 1][stage], tw = W * P.girth * (stage === 0 ? 0.7 : 1), th = H * (P.habit === 'stump' ? 0.5 : 0.75) * g;
  const lean = P.lean * th;
  // the trunk with flared roots
  const trunk = [[-tw / 2 - 2, 0], [-tw / 2, -th * 0.2], [-tw / 2 + lean, -th], [tw / 2 + lean, -th], [tw / 2, -th * 0.2], [tw / 2 + 2, 0]];
  m.poly(/** @type {any} */ (trunk), 'wood', { shade: 'round', tex: 1.4 });
  barkTexture(m, d, rng, -tw / 2 + 0.5, tw / 2 - 0.5, -th, -1);
  if (P.habit === 'stump' || P.habit === 'pollard') m.ellipse(lean, -th, tw / 2 + 0.5, 1.6, 'pale', { shade: 'flat', tone: 0.05 });
  // shoots and their leaves
  const shoots = stage === 0 ? 1 : stage === 1 ? Math.max(1, P.shoots - 1) : P.shoots;
  for (let i = 0; i < shoots; i++) {
    const f = shoots === 1 ? 0 : i / (shoots - 1) - 0.5, bx = lean + f * tw * 0.8, by = -th + 1;
    const ex = bx + f * W * 0.6, ey = by - H * 0.3 * g;
    m.stroke([[bx, by], [(bx + ex) / 2, by - H * 0.18 * g], [ex, ey]], [1.6, 1], 'wood', { noOutline: true });
    for (let k = 0; k < (P.weep ? 3 : 2); k++) {
      const a = P.weep ? Math.PI / 2 + (k - 1) * 0.35 + f : -Math.PI / 2 + (k ? 1 : -1) * 0.9 + f * 0.6;
      leaf(m, ex, ey, a, H * (P.weep ? 0.32 : 0.22) * g, H * (P.weep ? 0.05 : 0.08) * g, { shape: P.weep ? 'linear' : P.leafShape, tone: k ? -0.05 : 0.03 });
    }
  }
  return m;
}

/** A curled strip of bark: outer face with its texture, the pale inner face showing at the curl. */
function strip(m, d, rng, len, wid, curl) {
  const pts = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([-len / 2 + t * len, Math.sin(t * Math.PI) * curl - wid / 2]); }
  for (let i = 10; i >= 0; i--) { const t = i / 10; pts.push([-len / 2 + t * len, Math.sin(t * Math.PI) * curl + wid / 2]); }
  m.poly(/** @type {any} */ (pts), 'wood', { shade: 'round' });
  barkTexture(m, d, rng, -len / 2 + 1, len / 2 - 1, -wid / 2 + curl * 0.5, wid / 2 + curl * 0.5);
  // the inner face at the curled end
  m.poly([[len / 2 - 3, -wid / 2 + 1], [len / 2, -wid / 2], [len / 2, wid / 2], [len / 2 - 3, wid / 2 - 1]], 'pale', { shade: 'flat' });
}

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  strip(m, d, rng, 30, 11, 3);
  return m.rotate(-0.6);
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  strip(m, d, rng, [26, 20, 16, 22][v], [12, 13, 11, 9][v], [2, -1, 1, 3][v]);
  return m.rotate(v * 0.8);
}
