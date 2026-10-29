// Reeds and grasses (reed).
//
// Grammar: a clump of long arching blades and, on taller stalks, the
// flowering heads — velvet cattail cylinders, feathery plumes or nodding
// tassels. Blade count, arch, head form and spikelet tip vary per world.

import { Model, stream, pick, mound, marks, blade, PROFILES, stemPts } from './common.js';

export function params(rng, d) {
  return {
    head: rng.weighted(['cattail', 'plume', 'tassel'], [1.4, 1, 0.8]),
    blades: rng.int(5, 8) + Math.round(d.tr.lush * 2),
    stalks: rng.int(2, 3),
    arch: rng.range(0.4, 1.1),
    tip: rng.next() < 0.6,
  };
}

export function size(d) { return { w: 18, h: 34 }; }

/** A flowering head at the top of a stalk. */
function headAt(m, d, rng, x, y, s, ripe) {
  const P = d.m;
  if (P.head === 'cattail') {
    m.ellipse(x, y + 3.5 * s, 1.5 * s, 3.6 * s, ripe ? 'main' : 'leaf', { tex: 1.5 });
    if (P.tip) m.line([[x, y - 0.5 * s], [x, y - 2.5 * s]], 'stem', { lum: 0.6, clip: false });
  } else if (P.head === 'plume') {
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.28;
      m.stroke([[x, y + 4 * s], [x + Math.cos(a) * 3 * s, y + 4 * s + Math.sin(a) * 6 * s]], [1.4, 0.7], ripe ? (i % 2 ? 'main' : 'main2') : 'leaf', { noOutline: true, tone: i < 3 ? 0.06 : -0.06 });
    }
  } else {
    for (let i = 0; i < 4; i++) m.stroke([[x, y], [x + (i - 1.5) * 1.5 * s, y + (2 + i % 2) * s], [x + (i - 1.5) * 2 * s, y + 5 * s]], [1.2, 0.8], ripe ? 'main' : 'leaf', { noOutline: true, tone: i % 2 ? -0.05 : 0.05 });
  }
  marks(m, d, rng, x, y + 3 * s, 1.5 * s, 3 * s);
  m.glints.push([x - 0.5, y + 1.5 * s]);
}

/** A long blade arching from (x, 0). */
function bladeAt(m, d, x, len, ang, arch, tone) {
  m.poly(blade([x, 0], ang, len, Math.max(1, len * 0.06), PROFILES.linear, { curl: arch }), 'leaf', { shade: 'fold', tone });
}

export function plant(d, stage, o = {}) {
  const m = new Model(), P = d.m, rng = stream(d, 'plant' + stage), H = d.size.h, W = d.size.w;
  mound(m, W * 0.7, stream(d, 'mound'));
  const g = [0.35, 0.7, 1][stage];
  const n = Math.round(P.blades * (stage === 0 ? 0.5 : stage === 1 ? 0.8 : 1));
  for (let i = 0; i < n; i++) {
    const f = (i + 0.5) / n - 0.5;
    bladeAt(m, d, f * W * 0.3, H * g * (0.6 + rng.next() * 0.35), -Math.PI / 2 + f * 0.9, f * P.arch * (1 + d.tr.droop), i % 2 ? -0.05 : 0.04);
  }
  if (stage > 0) for (let s = 0; s < (stage === 1 ? 1 : P.stalks); s++) {
    const x = (s - (P.stalks - 1) / 2) * 3, top = -H * g * (0.95 + s * 0.05);
    m.stroke(stemPts(x * 0.5, 0, x, top, 0.05), [1.4 + d.tr.thick * 0.5, 1], 'stem', { noOutline: true });
    headAt(m, d, rng, x, top, stage === 2 ? 1.1 : 0.8, stage === 2 && !o.closed);
  }
  return m;
}

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  m.stroke([[0, 22], [0, -6]], 2, 'stem');
  m.poly(blade([0, 20], -Math.PI / 2 - 0.25, 22, 1.6, PROFILES.linear, { curl: -0.4 }), 'leaf', { shade: 'fold' });
  headAt(m, d, rng, 0, -12, 2.2, true);
  return m.rotate(0.45);
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  if (v < 2) { headAt(m, d, rng, 0, -8, 2.4 - v * 0.4, true); m.stroke([[0, -8], [0, -12]], 1.6, 'stem', { noOutline: true }); }
  else {
    // a bundle of cut stalks and blades
    for (let i = 0; i < 3; i++) m.stroke([[-8, -3 + i * 3], [8, -5 + i * 3]], 2.4, i === 1 ? 'stem' : 'leaf', {});
  }
  return m.rotate(v * 0.7);
}

export { pick };
