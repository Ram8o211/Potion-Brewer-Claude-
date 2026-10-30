// Mosses and lichens (moss).
//
// Grammar: a cushion of moss mounded over a stone — bumpy, crowded with
// tiny shoots and topped with the stalked capsules of its spores — or a
// lichen spreading in lobed, frilled rosettes across the rock with little
// cup-shaped fruiting bodies. Which one a species grows as depends on the
// world; how lush, how pale and how it glimmers follows its magic.

import { Model, stream, pick, rock, marks, lumpy } from './common.js';

export function params(rng, d) {
  return {
    kind: d.tr.glow > 0.35 ? rng.weighted(['lichen', 'cushion'], [2, 1]) : rng.weighted(['cushion', 'lichen'], [2, 1]),
    lobes: rng.int(5, 9),
    capsules: rng.int(3, 7),
    stone: rng.range(0.55, 0.8),
    drape: rng.next() < 0.5,
  };
}

export function size(d) { return { w: 24, h: 13 }; }

/** A moss cushion or lichen over (cx, cy) of half-width r. */
export function growth(m, d, rng, cx, cy, r, amount = 1) {
  const P = d.m;
  if (P.kind === 'cushion') {
    const n = Math.max(2, Math.round(r * 0.8 * amount));
    for (let i = 0; i < n; i++) {
      const x = cx + (i / Math.max(1, n - 1) - 0.5) * r * 1.4, y = cy - Math.sin((i / Math.max(1, n - 1)) * Math.PI) * r * 0.25;
      m.poly(lumpy(x, y, r * 0.42, r * 0.32, () => rng.next(), 0.25, 6), 'main', { shade: 'round', tex: 1.6, tone: i % 2 ? -0.05 : 0.03 });
    }
    // drooping strands over the stone
    if (P.drape) for (let i = 0; i < r * 0.6; i++) { const x = cx + (rng.next() - 0.5) * r * 1.4; m.line([[x, cy], [x, cy + 1 + rng.next() * r * 0.3]], 'main', { lum: 0.3, clip: false }); }
    // spore capsules on fine stalks
    if (amount >= 1) for (let i = 0; i < P.capsules; i++) {
      const x = cx + (rng.next() - 0.5) * r * 1.2, y = cy - r * 0.25 - rng.next() * 2, hgt = 2 + rng.next() * r * 0.35;
      m.line([[x, y], [x + 0.5, y - hgt]], 'stem', { lum: 0.6, clip: false });
      m.dot(x + 0.5, y - hgt - 0.5, 'accent', { lum: 0.7, clip: false, glow: d.tr.glow > 0.3 });
    }
  } else {
    // lichen: frilled lobes spreading from a centre
    for (let i = 0; i < P.lobes * amount; i++) {
      const a = Math.PI + (i / Math.max(1, P.lobes - 1)) * Math.PI + (rng.next() - 0.5) * 0.3;
      const L = r * (0.5 + rng.next() * 0.45);
      const x = cx + Math.cos(a) * L * 0.6, y = cy + Math.sin(a) * L * 0.35;
      m.poly(lumpy(x, y, L * 0.38, L * 0.26, () => rng.next(), 0.35, 5), i % 2 ? 'main' : 'main2', { shade: 'round', tone: i % 3 ? 0 : -0.06 });
    }
    // cup-shaped fruiting bodies
    if (amount >= 1) for (let i = 0; i < Math.round(P.capsules / 2); i++) {
      const x = cx + (rng.next() - 0.5) * r, y = cy - r * 0.15 - rng.next() * r * 0.2;
      m.ellipse(x, y, 1.6, 1.1, 'accent', { shade: 'flat', glow: d.tr.glow > 0.3 });
      m.dot(x, y, 'accent', { lum: 0.15 });
    }
  }
  marks(m, d, rng, cx, cy - r * 0.15, r * 0.7, r * 0.25);
  m.glints.push([cx - r * 0.3, cy - r * 0.3]);
}

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  rock(m, 0, 6, 13, 7, stream(d, 'stone'));
  growth(m, d, rng, 0, 0, 15, 1);
  return m;
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  // torn-off clumps (moss lifts away with a little grit under it)
  if (v === 3) rock(m, 0, 4, 9, 5, rng);
  growth(m, d, rng, 0, v === 3 ? -1 : 2, 16 - v * 2, 1);
  return m.rotate((v - 1.5) * 0.3);
}

export { pick };
