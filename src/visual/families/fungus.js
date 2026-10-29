// Mushrooms and fungi (cap, toadstool, bracket).
//
// Grammar: a cluster of one to four fruiting bodies of graded sizes, each a
// cap of its profile (convex, bell, conical, flat, umbonate) over a band of
// gills and a stem with or without a ring and a swollen foot — or, for
// bracket fungi, tiers of banded half-moon shelves on a stub of dead wood.
// Warts, scales, spots and the rim's colour follow the species.

import { Model, stream, pick, mound, marks, ellipse, lumpy } from './common.js';

export function params(rng, d) {
  const t = d.tr;
  return {
    profile: pick(rng, ['convex', 'bell', 'conical', 'flat', 'umbo']),
    count: d.form === 'bracket' ? rng.int(2, 4) : rng.int(1, 3) + (d.id.rare ? 0 : 1),
    stem: rng.range(0.55, 1) * (1 + t.thick * 0.3),
    ring: rng.next() < 0.5,
    warts: d.form === 'toadstool' ? 'warts' : t.spots > 0.25 ? 'spots' : pick(rng, ['none', 'scales', 'speckle', 'none']),
    rim: rng.next() < 0.5,
    bands: rng.int(2, 4),
    lean: (rng.next() - 0.5) * 0.4,
  };
}

export function size(d) { return d.form === 'bracket' ? { w: 22, h: 20 } : d.form === 'toadstool' ? { w: 22, h: 20 } : { w: 20, h: 18 }; }

/** One mushroom standing at (x, y) with cap radius r. */
export function mushroom(m, d, rng, x, y, r, tone = 0) {
  const P = d.m, sh = r * 1.25 * P.stem, lean = P.lean * r * 0.5;
  // stem with a swollen foot
  m.stroke([[x, y], [x + lean * 0.5, y - sh * 0.5], [x + lean, y - sh]], [r * 0.55, r * 0.42, r * 0.36], 'pale', { tone });
  if (P.ring && r > 3) m.ellipse(x + lean * 0.7, y - sh * 0.72, r * 0.35, r * 0.14, 'pale', { tone: tone + 0.1, shade: 'flat' });
  const cx = x + lean, cy = y - sh, depth = { convex: 0.65, bell: 0.85, conical: 1.1, flat: 0.35, umbo: 0.55 }[P.profile];
  // the gills: a darker band under the cap
  m.ellipse(cx, cy + 0.5, r * 0.92, Math.max(1, r * 0.22), 'gill', { shade: 'flat', tone: tone - 0.15 });
  // the cap
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, a = Math.PI + t * Math.PI;
    let ry = Math.sin(a) * r * depth;
    if (P.profile === 'conical') ry *= 1 - Math.abs(t - 0.5) * 0.6;
    if (P.profile === 'umbo' && Math.abs(t - 0.5) < 0.12) ry *= 1.25;
    pts.push([cx + Math.cos(a) * r, cy + ry]);
  }
  pts.push([cx + r * 0.9, cy + r * 0.12], [cx - r * 0.9, cy + r * 0.12]);
  m.poly(/** @type {any} */ (pts), 'main', { shade: 'round', tone });
  if (P.rim && r > 3) m.line([[cx - r * 0.9, cy], [cx + r * 0.9, cy]], 'main2', { lum: 0.75 });
  // warts, scales and spots
  const n = Math.round(r * (P.warts === 'warts' ? 1.2 : 0.9));
  for (let i = 0; i < n && P.warts !== 'none'; i++) {
    const a = Math.PI + 0.25 + rng.next() * (Math.PI - 0.5), q = 0.35 + rng.next() * 0.5;
    const wx = cx + Math.cos(a) * r * q, wy = cy + Math.sin(a) * r * depth * q;
    if (P.warts === 'warts') { m.dot(wx, wy, 'pale', { lum: 0.95 }); if (r > 4) m.dot(wx + 1, wy, 'pale', { lum: 0.7 }); }
    else if (P.warts === 'spots') m.dot(wx, wy, 'accent', { lum: 0.6 });
    else if (P.warts === 'scales') m.line([[wx, wy], [wx + 1, wy + 1]], 'main', { lum: 0.15 });
    else m.dot(wx, wy, 'main', { lum: 0.9 });
  }
  marks(m, d, rng, cx, cy - r * depth * 0.4, r * 0.7, r * depth * 0.4);
  m.glints.push([cx - r * 0.4, cy - r * depth * 0.6]);
}

/** A bracket shelf on wood at (x, y), sticking out to the right by w. */
function shelf(m, d, rng, x, y, w, tone = 0) {
  const P = d.m, h = w * 0.42;
  const pts = [];
  for (let i = 0; i <= 14; i++) { const a = -Math.PI / 2 + (i / 14) * Math.PI; pts.push([x + Math.cos(a) * w, y + Math.sin(a) * h * (a < 0 ? 0.9 : 0.45)]); }
  m.poly(/** @type {any} */ (pts), 'main', { shade: 'round', tone });
  // concentric growth bands, paler at the rim
  for (let b = 1; b <= P.bands; b++) {
    const f = b / (P.bands + 1), band = [];
    for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + 0.2 + (i / 10) * (Math.PI - 0.6); band.push([x + Math.cos(a) * w * f, y + Math.sin(a) * h * 0.9 * f]); }
    m.line(/** @type {any} */ (band), b === P.bands ? 'main2' : 'main', { lum: b === P.bands ? 0.85 : 0.2 });
  }
  m.line([[x, y + h * 0.4], [x + w * 0.9, y + h * 0.1]], 'gill', { lum: 0.6 });
  marks(m, d, rng, x + w * 0.4, y - h * 0.3, w * 0.35, h * 0.4);
}

/** A stub of dead wood. */
function stub(m, rng, x, h, w) {
  m.poly(lumpy(x, -h / 2, w / 2, h / 2 + 1, () => rng.next(), 0.08, 5), 'wood', { shade: 'round', tone: -0.05 });
  for (let i = 0; i < 3; i++) { const xx = x - w / 2 + 1 + (i + 0.5) * (w / 3); m.line([[xx, -h + 1], [xx + (rng.next() - 0.5) * 2, -1]], 'wood', { lum: 0.12 }); }
  m.ellipse(x, -h, w / 2, 1.4, 'wood', { shade: 'flat', tone: 0.15 });
}

export function plant(d, stage, o = {}) {
  const m = new Model(), P = d.m, rng = stream(d, 'plant' + stage), H = d.size.h, W = d.size.w;
  mound(m, W * 0.75, stream(d, 'mound'));
  if (d.form === 'bracket') {
    const sh = H * (stage === 0 ? 0.6 : 1);
    stub(m, rng, -W * 0.18, sh, W * 0.34);
    const n = stage === 0 ? 1 : stage === 1 ? Math.max(1, P.count - 1) : P.count;
    for (let i = 0; i < n; i++) shelf(m, d, rng, -W * 0.05, -sh * (0.3 + i * 0.25), W * (0.42 - i * 0.07) * (stage === 0 ? 0.45 : stage === 1 ? 0.75 : 1), i % 2 ? -0.05 : 0);
    return m;
  }
  if (stage === 0) {
    // pins: little round knobs just out of the ground
    for (let i = 0; i < 3; i++) mushroom(m, d, rng, (i - 1) * 3, 0, 1.4 + (i % 2) * 0.5);
    return m;
  }
  const g = stage === 1 ? 0.8 : 1, n = stage === 1 ? Math.max(1, P.count - 1) : P.count;
  const sizes = [1, 0.7, 0.55, 0.45].slice(0, n);
  // the small ones behind, the big one in front
  for (let i = n - 1; i >= 0; i--) {
    const x = i === 0 ? 0 : (i % 2 ? 1 : -1) * W * (0.22 + i * 0.07);
    mushroom(m, d, rng, x, i === 0 ? 0 : -1, W * 0.3 * g * sizes[i], i === 0 ? 0 : -0.06);
  }
  return m;
}

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  if (d.form === 'bracket') { shelf(m, d, rng, -10, 0, 22); shelf(m, d, rng, -10, 9, 15, -0.05); m.stroke([[-11, -10], [-11, 16]], 4, 'wood'); return m; }
  mushroom(m, d, rng, 7, 6, 6, -0.05);
  mushroom(m, d, rng, -3, 10, 11);
  return m;
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  if (d.form === 'bracket') { shelf(m, d, rng, 0, 0, 20 - v * 3); return m.rotate(v * 0.4); }
  if (v === 0) mushroom(m, d, rng, 0, 10, 10);
  else if (v === 1) { mushroom(m, d, rng, 0, 10, 9); m.rotate(1.3); }
  else if (v === 2) {
    // a broken-off cap, gills up
    m.ellipse(0, 0, 11, 5, 'main', {});
    m.ellipse(0, -1, 9, 3, 'gill', { shade: 'flat' });
    for (let i = -7; i <= 7; i += 2) m.line([[0, -1], [i, -2]], 'gill', { lum: 0.2 });
  } else { mushroom(m, d, rng, -4, 8, 6); mushroom(m, d, rng, 4, 8, 5, -0.05); }
  return m;
}

export { ellipse };
