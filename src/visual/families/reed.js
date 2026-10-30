// Reeds and grasses (reed).
//
// Grammar: a clump of long arching blades and, on taller stalks, the
// flowering heads — velvet cattail cylinders, feathery plumes or nodding
// tassels. Blade count, arch, head form and spikelet tip vary per world.

import { Model, stream, pick, marks, blade, PROFILES } from './common.js';

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

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  // a cut bunch: three stalks fanned out, heads up, a blade behind them
  m.poly(blade([0, 16], -Math.PI / 2 - 0.45, 24, 2, PROFILES.linear, { curl: -0.3 }), 'leaf', { shade: 'fold' });
  for (let i = -1; i <= 1; i++) {
    const tx = i * 7, ty = -6 + Math.abs(i) * 4;
    m.stroke([[i * 1.5, 16], [tx, ty]], 2, 'stem', { noOutline: true });
    headAt(m, d, rng, tx, ty - 9, 2.4, true);
  }
  return m;
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
