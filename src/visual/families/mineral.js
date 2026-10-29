// Stones, ores and mineral deposits (stone, nugget, powder, crust).
//
// Grammar: rounded nodules and boulders half-sunk in the ground, banded
// with strata (chalk) or broken with shell-like fracture faces (flint);
// heavy metallic lumps with hard specular glints (ores); a heap of loose
// glittering grains spilling from a seam (powders); or a crust of fine
// needles and flakes blooming over a rock (salts). Lump count, roundness,
// banding, fracture and glitter vary per world.

import { Model, stream, pick, rock, marks, lumpy, polygon } from './common.js';

export function params(rng, d) {
  return {
    lumps: rng.int(2, 4),
    round: d.tr.chalky > 0.3 ? rng.range(0.6, 0.9) : rng.range(0.15, 0.6),
    strata: rng.next() < 0.5 + d.tr.chalky * 0.4,
    fracture: rng.next() < 0.5 + d.tr.sharp * 0.4,
    glitter: rng.int(3, 8),
    needles: rng.int(6, 11),
    flat: rng.range(0.55, 0.8),
  };
}

export function size(d) {
  if (d.form === 'powder') return { w: 22, h: 12 };
  if (d.form === 'crust') return { w: 22, h: 16 };
  return { w: 22, h: 14 };
}

/** One lump of the mineral at (cx, cy) of radius r. */
export function lump(m, d, rng, cx, cy, r, tone = 0, flat = d.m.flat) {
  const P = { ...d.m, flat }, metal = d.form === 'nugget';
  const pts = P.round > 0.45 || metal ? lumpy(cx, cy, r, r * P.flat, () => rng.next(), metal ? 0.3 : 0.15, metal ? 7 : 5) : polygon(cx, cy, r, 6, rng.next(), () => rng.next(), 0.5, P.flat);
  m.poly(pts, 'main', { shade: 'round', tone, tex: metal ? 0.6 : 1.3 });
  if (P.strata && !metal) for (let k = 1; k <= 2; k++) { const y = cy - r * P.flat * 0.5 + k * r * P.flat * 0.35; m.line([[cx - r * 0.8, y], [cx + r * 0.8, y + (rng.next() - 0.5) * 1.5]], 'main2', { lum: 0.8 }); }
  if (P.fracture && !metal && r > 3) {
    // a shell-like fracture face, lighter, with a curved rib
    m.poly([[cx - r * 0.2, cy - r * P.flat * 0.7], [cx + r * 0.55, cy - r * P.flat * 0.4], [cx + r * 0.2, cy + r * P.flat * 0.1]], 'main2', { shade: 'facet', lum: 0.85 });
    m.line([[cx, cy - r * P.flat * 0.4], [cx + r * 0.3, cy - r * P.flat * 0.2]], 'main2', { lum: 0.45 });
  }
  if (metal) for (let k = 0; k < 2; k++) { const x = cx - r * 0.4 + rng.next() * r * 0.5, y = cy - r * P.flat * 0.4; m.dot(x, y, 'pale', { lum: 1 }); m.glints.push([x, y]); }
  marks(m, d, rng, cx, cy, r * 0.6, r * P.flat * 0.6);
}

/** A heap of loose grains with glitter. */
function heap(m, d, rng, w, h, amount) {
  const P = d.m;
  const pts = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14, x = (t - 0.5) * w; pts.push([x, -Math.pow(Math.sin(t * Math.PI), 0.8) * h * (0.85 + rng.next() * 0.3)]); }
  m.poly(/** @type {any} */ (pts), 'main', { shade: 'round', tex: 2 });
  for (let i = 0; i < P.glitter * amount * 2; i++) {
    const x = (rng.next() - 0.5) * w * 0.8, y = -rng.next() * h * 0.7;
    m.dot(x, y, rng.next() < 0.5 ? 'pale' : 'main', { lum: 0.98 });
    if (i % 3 === 0) m.glints.push([x, y]);
  }
  // grains spilled at the foot
  for (let i = 0; i < 5; i++) m.dot((rng.next() - 0.5) * w * 1.2, -0.5, 'main', { lum: 0.4, clip: false });
  marks(m, d, rng, 0, -h * 0.4, w * 0.3, h * 0.3);
}

/** A bloom of needles and flakes. */
function bloom(m, d, rng, cx, cy, r, amount) {
  const P = d.m, n = Math.max(2, Math.round(P.needles * amount));
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + ((i / Math.max(1, n - 1)) - 0.5) * 2.4 + (rng.next() - 0.5) * 0.3;
    const L = r * (0.5 + rng.next() * 0.5) * amount + 1;
    m.stroke([[cx, cy], [cx + Math.cos(a) * L, cy + Math.sin(a) * L]], [1.8, 0.8], i % 2 ? 'main' : 'pale', { tone: Math.cos(a) < 0 ? 0.08 : -0.06, noOutline: true });
    if (i % 3 === 0) m.glints.push([cx + Math.cos(a) * L, cy + Math.sin(a) * L]);
  }
}

export function plant(d, stage, o = {}) {
  const m = new Model(), P = d.m, rng = stream(d, 'plant' + stage), W = d.size.w, H = d.size.h;
  const g = [0.4, 0.7, 1][stage];
  if (d.form === 'powder') {
    rock(m, -W * 0.25, -H * 0.4, W * 0.3, H * 0.4, stream(d, 'host'), 'rock', -0.05);
    heap(m, d, rng, W * 0.9 * g, H * 0.7 * g + 1, g);
    return m;
  }
  if (d.form === 'crust') {
    rock(m, 0, -H * 0.35, W * 0.45, H * 0.35, stream(d, 'host'));
    for (let k = 0; k < (stage === 2 ? 3 : stage === 1 ? 2 : 1); k++) bloom(m, d, rng, (k - 1) * W * 0.22, -H * 0.55, H * 0.6, g);
    return m;
  }
  // lumps sunk in the ground, the biggest in front
  const n = stage === 0 ? 1 : stage === 1 ? Math.max(1, P.lumps - 1) : P.lumps;
  for (let i = n - 1; i >= 0; i--) {
    const r = W * 0.26 * g * (i === 0 ? 1 : 0.7 - i * 0.1);
    lump(m, d, rng, i === 0 ? 0 : (i % 2 ? 1 : -1) * W * 0.28, -r * P.flat * 0.7 - (i ? 1 : 0), r, i ? -0.06 : 0);
  }
  return m;
}

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  if (d.form === 'powder') { heap(m, d, rng, 30, 14, 1); return m; }
  if (d.form === 'crust') { rock(m, 0, 4, 13, 7, stream(d, 'host')); bloom(m, d, rng, -4, 0, 12, 1); bloom(m, d, rng, 5, 1, 10, 1); return m; }
  lump(m, d, rng, 6, 4, 7, -0.06);
  lump(m, d, rng, -3, 0, 11);
  return m;
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  if (d.form === 'crust') { bloom(m, d, rng, 0, 8, 16, 1); return m.rotate(v * 0.8); }
  // a whole pebble or lump: compact and roundish, so it rolls like one
  lump(m, d, rng, 0, 0, 14 - v * 1.5, 0, Math.max(0.85, d.m.flat));
  return m.rotate(v * 0.7);
}

export { pick };
