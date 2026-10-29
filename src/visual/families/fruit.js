// Berries, seed pods and fruiting plants (berry, bean, pepper, seed).
//
// Grammar: a woody little shrub or a leafy stem carrying the fruit — glossy
// berries in hanging bunches, segmented pods dangling from the leaf joints,
// tapering peppers curving down, or a dry umbel of ribbed seeds on spokes.
// Fruit outline, count, gloss and how they hang vary per world; ripe fruit
// is green and swells into the species' colour at maturity.

import { Model, stream, pick, leaf, stemPts, sprout, mound, marks, LEAF_SHAPES, ellipse, blade, PROFILES } from './common.js';

export function params(rng, d) {
  const t = d.tr;
  return {
    bunch: rng.int(3, 6),
    bunches: rng.int(2, 3),
    fruitR: rng.range(0.85, 1.2) * (1 + t.round * 0.15),
    leafShape: rng.weighted(LEAF_SHAPES, [1, 1, 1 + t.round, 0.6, 0.5, 0.6]),
    teeth: rng.next() < 0.3 ? rng.int(3, 6) : 0,
    curve: rng.range(0.2, 0.8) * (rng.next() < 0.5 ? -1 : 1),
    segments: rng.int(3, 5),
    rays: rng.int(5, 8),
    woody: rng.next() < 0.6,
  };
}

export function size(d) {
  if (d.form === 'seed') return { w: 20, h: 28 };
  if (d.form === 'bean') return { w: 22, h: 24 };
  return { w: 22, h: 22 };
}

/** One fruit at (x, y) hanging from its stalk; ripe=false draws it green and small. */
export function fruit(m, d, rng, x, y, s, ripe = true, ang = Math.PI / 2) {
  const P = d.m, mat = ripe ? 'main' : 'leaf', k = ripe ? 1 : 0.7;
  if (d.form === 'berry') {
    const r = 1.6 * s * P.fruitR * k;
    m.ellipse(x, y, r, r, mat, {});
    if (r > 1.6) m.dot(x - r * 0.4, y - r * 0.4, mat, { lum: 1 });
    if (r > 3) m.dot(x + r * 0.2, y + r * 0.5, 'accent', { lum: 0.4 });
  } else if (d.form === 'pepper') {
    const L = 5 * s * P.fruitR * k;
    m.poly(blade([x, y], ang + P.curve * 0.3, L, L * 0.32, PROFILES.needle, { curl: P.curve }), mat, { shade: 'round' });
    m.stroke([[x, y - 1], [x, y + 0.5]], 1.2, 'stem', { noOutline: true });
    if (L > 4) m.glints.push([x - 0.5, y + L * 0.3]);
  } else if (d.form === 'bean') {
    const L = 6 * s * P.fruitR * k, c = Math.cos(ang), sn = Math.sin(ang);
    m.poly(blade([x, y], ang, L, L * 0.2, (t) => 0.55 + 0.45 * Math.abs(Math.sin(t * Math.PI * P.segments)) * (t < 0.92 ? 1 : (1 - t) / 0.08), { curl: P.curve * 0.5 }), mat, { shade: 'round' });
    for (let i = 1; i < P.segments; i++) m.dot(x + c * L * (i / P.segments), y + sn * L * (i / P.segments), mat, { lum: 0.2 });
  } else {
    // a ribbed seed
    m.ellipse(x, y, 1.2 * s * k, 1.7 * s * k, ripe ? 'main' : 'leaf', {});
    m.line([[x, y - 1.4 * s * k], [x, y + 1.4 * s * k]], mat, { lum: 0.2 });
  }
}

/** A dry umbel: spokes from a stem top, each ending in a cluster of seeds. */
function umbel(m, d, rng, x, y, r, ripe, s = 1) {
  const P = d.m;
  for (let i = 0; i < P.rays; i++) {
    const a = -Math.PI / 2 + ((i / (P.rays - 1)) - 0.5) * 2.4;
    const ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r * 0.55;
    // a ripe umbel has dried to the colour of its seeds
    m.line([[x, y], [ex, ey]], ripe ? 'main' : 'stem', { lum: 0.4, clip: false });
    for (let k = 0; k < (s > 1 ? 4 : 3); k++) fruit(m, d, rng, ex + ((k % 3) - 1) * 1.5 * s, ey - (k % 2) * s - (k > 2 ? 2 * s : 0), (ripe ? 1 : 0.75) * s, ripe);
  }
  marks(m, d, rng, x, y - r * 0.4, r * 0.8, r * 0.4);
}

export function plant(d, stage, o = {}) {
  const m = new Model(), P = d.m, rng = stream(d, 'plant' + stage), H = d.size.h, W = d.size.w;
  mound(m, W * 0.7, stream(d, 'mound'));
  if (stage === 0) return sprout(m, d, Math.max(4, H * 0.3), { shape: P.leafShape, teeth: P.teeth });
  const g = stage === 1 ? 0.7 : 1, ripe = stage === 2;
  if (d.form === 'seed') {
    const pts = stemPts(0, 0, (rng.next() - 0.5) * 3, -H * g, 0.1);
    m.stroke(pts, [2 + d.tr.thick, 1.1], 'stem', { noOutline: true });
    // the spotted stem of the hemlocks
    if (d.tr.droop > 0.3 || d.tr.spots > 0.2) for (let i = 2; i < pts.length - 2; i += 2) m.dot(pts[i][0], pts[i][1], 'accent', { lum: 0.3 });
    for (let j = 2; j < pts.length - 3; j += 3) leaf(m, pts[j][0], pts[j][1], -Math.PI / 2 + (j % 2 ? 1.2 : -1.2), H * 0.3 * g, H * 0.06, { shape: 'lance', teeth: 7, tone: j % 2 ? -0.05 : 0 });
    const top = pts[pts.length - 1];
    umbel(m, d, rng, top[0], top[1], W * 0.55 * g, ripe, 1.3);
    return m;
  }
  // a little shrub: woody stems fanning out, leaves at their joints, fruit hanging below
  const stems = P.woody ? 3 : 2;
  for (let b = 0; b < stems; b++) {
    const f = b / (stems - 1) - 0.5;
    const tx = f * W * 0.8 * g, ty = -H * g * (1 - Math.abs(f) * 0.4);
    const pts = stemPts(0, 0, tx, ty, f * 0.6);
    m.stroke(pts, [2 + d.tr.thick * 1.5, 1], P.woody ? 'wood' : 'stem', { noOutline: true });
    for (let j = 3; j < pts.length; j += 2) leaf(m, pts[j][0], pts[j][1], -Math.PI / 2 + (j % 4 === 1 ? 1 : -1) * (1 + rng.next() * 0.4) + f, H * 0.32 * g, H * 0.12 * g, { shape: P.leafShape, teeth: P.teeth, tone: j % 4 === 1 ? -0.05 : 0.04 });
  }
  // the fruit, in front
  const n = (stage === 1 ? 1 : P.bunches) * (d.form === 'berry' ? 1 : 1);
  for (let b = 0; b < n; b++) {
    const x = ((b + 0.5) / n - 0.5) * W * 0.7, y = -H * (0.35 + 0.3 * (b % 2)) * g;
    if (d.form === 'berry') {
      m.line([[x, y - 3], [x, y]], 'stem', { lum: 0.5, clip: false });
      for (let k = 0; k < (ripe ? P.bunch : 2); k++) fruit(m, d, rng, x + ((k % 3) - 1) * 2.6, y + Math.floor(k / 3) * 2.6 + (k % 2), 1, ripe);
    } else for (let k = 0; k < (ripe ? 2 : 1); k++) fruit(m, d, rng, x + k * 3, y, ripe ? 1 : 0.7, ripe);
  }
  marks(m, d, rng, 0, -H * 0.45, W * 0.3, H * 0.25);
  return m;
}

export function icon(d) {
  const m = new Model(), P = d.m, rng = stream(d, 'icon');
  if (d.form === 'seed') {
    // a close-up of the seed head: a dome of fat ribbed seeds on short dry spokes
    m.stroke([[0, 14], [0, 4]], 2, 'main', { noOutline: true });
    const spots = [[-9, 2], [-4, -2], [2, -3], [8, 1], [-6, 7], [0, 4], [6, 7]];
    for (const [x, y] of spots) m.line([[0, 6], [x, y]], 'main', { lum: 0.35, clip: false });
    for (const [x, y] of spots) fruit(m, d, rng, x, y, 2.6, true);
    return m;
  }
  // the fruit is the ingredient: a small twig and leaf, the fruit large in front
  m.stroke([[-8, -10], [0, -7], [5, -11]], 1.6, P.woody ? 'wood' : 'stem');
  leaf(m, 1, -8, -0.8, 8, 3, { shape: P.leafShape, teeth: P.teeth });
  if (d.form === 'berry') {
    for (let k = 0; k < Math.max(5, P.bunch); k++) fruit(m, d, rng, -4 + (k % 3) * 4.4, -2 + Math.floor(k / 3) * 4.2 + (k % 2), 1.7, true);
  } else for (let k = 0; k < 2; k++) fruit(m, d, rng, -5 + k * 8, -7, 2.9, true, Math.PI / 2 + (k - 0.5) * 0.4);
  return m;
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  if (d.form === 'seed') { for (let k = 0; k < 4; k++) fruit(m, d, rng, (k % 2) * 4 - 2, Math.floor(k / 2) * 5 - 2, 2.4, true); return m.rotate(v * 0.5); }
  if (d.form === 'berry') {
    const n = [4, 3, 2, 1][v];
    for (let k = 0; k < n; k++) fruit(m, d, rng, (k % 2) * 5 - 2, Math.floor(k / 2) * 5 - 2, 2.2, true);
    if (v < 2) m.line([[0, -7], [1, -3]], 'stem', { lum: 0.4, clip: false });
    return m;
  }
  fruit(m, d, rng, 0, -6, 2.6 - v * 0.2, true, Math.PI / 2 + (v - 1.5) * 0.4);
  return m;
}

export { pick, ellipse };
