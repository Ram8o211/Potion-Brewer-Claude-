// Berries, seed pods and fruiting plants (berry, bean, pepper, seed).
//
// Grammar: a woody little shrub or a leafy stem carrying the fruit — glossy
// berries in hanging bunches, segmented pods dangling from the leaf joints,
// tapering peppers curving down, or a dry umbel of ribbed seeds on spokes.
// Fruit outline, count, gloss and how they hang vary per world; ripe fruit
// is green and swells into the species' colour at maturity.

import { Model, stream, pick, leaf, marks, LEAF_SHAPES, ellipse, blade, PROFILES } from './common.js';

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
