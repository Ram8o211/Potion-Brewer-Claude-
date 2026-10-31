// Crystals and glassy shards (crystal, shard).
//
// Grammar: prisms growing out of a host rock — each a column with a pointed
// termination, cut into a lit, a middle and a shadowed facet with brighter
// tip faces, flecked with inclusions — clustered in a fan, a druse or a
// single leaning spire; or, for volcanic and storm glass, angular blades and
// splinters with glossy streaks and fracture lines. Arrangement, number,
// slenderness, growth direction and inner colour vary per world.

import { Model, stream, pick, rock, marks } from './common.js';

export function params(rng, d) {
  return {
    habit: d.form === 'shard' ? pick(rng, ['splinters', 'blades', 'spire']) : pick(rng, ['fan', 'druse', 'spire', 'fan']),
    count: rng.int(3, 6),
    slender: rng.range(0.22, 0.36) * (1 - d.tr.sharp * 0.2) * (1 + d.tr.thick * 0.2),
    tipLen: rng.range(0.22, 0.4) * (1 + d.tr.sharp * 0.4),
    lean: (rng.next() - 0.5) * 0.5,
    inclusions: rng.int(1, 3),
    cracks: d.form === 'shard' ? rng.int(1, 3) : 0,
    rock: rng.range(0.4, 0.6),
  };
}

export function size(d) { return { w: 20, h: 22 }; }

/** One prism from (x, y) along `ang` (radians), `len` long and `wid` wide. */
export function prism(m, d, rng, x, y, ang, len, wid, tone = 0) {
  const c = Math.cos(ang), s = Math.sin(ang), px = -s, py = c, P = d.m;
  const tip = len * P.tipLen, body = len - tip;
  const at = (u, v) => /** @type {[number, number]} */ ([x + c * u + px * v, y + s * u + py * v]);
  const hw = wid / 2;
  if (d.form === 'shard') {
    // an angular blade: an irregular, sharp quadrilateral with a glossy streak
    const a = at(0, -hw), b = at(len * 0.7, -hw * 0.6), t = at(len, (rng.next() - 0.5) * hw), e = at(len * 0.5, hw);
    m.poly([a, b, t], 'crystal', { shade: 'facet', lum: 0.72 + tone });
    m.poly([a, t, e, at(0, hw)], 'crystal', { shade: 'facet', lum: 0.35 + tone });
    m.line([at(len * 0.15, -hw * 0.3), at(len * 0.85, -hw * 0.15)], 'crystal', { lum: 0.98 });
    for (let i = 0; i < P.cracks; i++) { const u = len * (0.2 + rng.next() * 0.5); m.line([at(u, -hw * 0.8), at(u + 2, 0), at(u + 1, hw * 0.7)], 'iris', { lum: 0.7 }); }
    m.glints.push(at(len * 0.95, 0));
    return;
  }
  // three body facets and two tip faces
  m.poly([at(0, -hw), at(body, -hw), at(body + tip * 0.15, -hw * 0.35), at(0, -hw * 0.35)], 'crystal', { shade: 'facet', lum: 0.78 + tone });
  m.poly([at(0, -hw * 0.35), at(body + tip * 0.15, -hw * 0.35), at(body + tip * 0.15, hw * 0.3), at(0, hw * 0.3)], 'crystal', { shade: 'facet', lum: 0.55 + tone });
  m.poly([at(0, hw * 0.3), at(body + tip * 0.15, hw * 0.3), at(body, hw), at(0, hw)], 'crystal', { shade: 'facet', lum: 0.28 + tone });
  m.poly([at(body, -hw), at(len, 0), at(body + tip * 0.15, hw * 0.3), at(body + tip * 0.15, -hw * 0.35)], 'crystal', { shade: 'facet', lum: 0.95 + tone });
  m.poly([at(body + tip * 0.15, hw * 0.3), at(len, 0), at(body, hw)], 'crystal', { shade: 'facet', lum: 0.45 + tone });
  // the bright ridge between the lit and middle faces running up into the apex, and the shadowed edge of the far face
  m.line([at(len * 0.18, -hw * 0.35), at(body + tip * 0.15, -hw * 0.35), at(len, 0)], 'crystal', { lum: 1 });
  m.line([at(len * 0.25, hw * 0.3), at(body + tip * 0.15, hw * 0.3)], 'crystal', { lum: 0.4 });
  // a luminous heart down the middle of a glowing one
  if (d.tr.glow > 0.1) m.line([at(body * 0.3, 0), at(body * 0.9, 0)], 'glow', { lum: 0.9, glow: true });
  // inclusions and the iridescent heart of the stone
  for (let i = 0; i < P.inclusions; i++) {
    const u = body * (0.2 + rng.next() * 0.6), v = (rng.next() - 0.5) * hw;
    m.line([at(u, v), at(u + body * 0.15, v + 0.5)], d.tr.irid > 0.3 ? 'iris' : 'crystal', { lum: 0.95 });
  }
  if (d.tr.glow > 0.3) m.dot(...at(body * 0.5, 0), 'glow', { lum: 0.95, glow: true });
  m.glints.push(at(len * 0.97, 0), at(body * 0.6, -hw * 0.7));
}

/** A cluster on a host rock at (0, 0); amount 0..1 scales how much has grown. */
function cluster(m, d, rng, W, H, amount, seedRock = true) {
  const P = d.m;
  if (seedRock) rock(m, 0, -H * 0.12, W * P.rock, H * 0.16, stream(d, 'host'));
  const n = Math.max(1, Math.round(P.count * amount));
  const items = [];
  for (let i = 0; i < n; i++) {
    const f = n === 1 ? 0 : i / (n - 1) - 0.5;
    const spread = P.habit === 'spire' ? 0.35 : P.habit === 'druse' ? 1.6 : P.habit === 'splinters' ? 1.4 : 1.1;
    const ang = -Math.PI / 2 + f * spread + P.lean * 0.5 + (rng.next() - 0.5) * 0.25;
    const main = Math.abs(f) < 0.2 || n === 1;
    const len = H * amount * (main ? 0.95 : 0.55 + rng.next() * 0.3) * (P.habit === 'druse' ? 0.6 : 1);
    items.push({ x: f * W * 0.45, y: -H * 0.15, ang, len, wid: Math.max(2, len * P.slender * (main ? 1.1 : 0.9)), main });
  }
  // the short side crystals behind the main ones
  items.sort((a, b) => a.len - b.len);
  for (const it of items) prism(m, d, rng, it.x, it.y, it.ang, it.len, it.wid, it.main ? 0 : -0.06);
  marks(m, d, rng, 0, -H * 0.5, W * 0.3, H * 0.3);
}

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  cluster(m, d, rng, 26, 30, 1);
  return m;
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  // loose crystals and broken shards, the same facets and colour
  if (v === 3) { prism(m, d, rng, -6, 4, -1.2, 18, 7); prism(m, d, rng, 0, 6, -0.6, 14, 6, -0.05); return m; }
  prism(m, d, rng, 0, 0, -0.6 + v * 0.9, 24 - v * 3, 9 - v);
  return m;
}
