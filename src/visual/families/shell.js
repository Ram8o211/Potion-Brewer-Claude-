// Shells and scales (shell, scale).
//
// Grammar: bivalve shells lying half-buried — a fan or an oval valve with
// growth ridges radiating or ringing from the hinge, a nacreous lining where
// one gapes open — or shed scales lying overlapped on a stone, each a
// rounded plate with a raised keel and a bright rim. Outline, ribbing and
// how many lie together vary per world.

import { Model, stream, pick, rock, marks, blade, PROFILES } from './common.js';

export function params(rng, d) {
  return {
    outline: d.form === 'scale' ? pick(rng, ['round', 'spoon', 'wedge']) : pick(rng, ['round', 'ovate', 'spoon']),
    ribs: rng.int(4, 8),
    rings: rng.next() < 0.5,
    count: rng.int(2, 4),
    open: rng.next() < 0.6,
  };
}

export function size(d) { return { w: 22, h: 12 }; }

/** One valve or scale at (x, y), hinge at the bottom, pointing along ang. */
export function valve(m, d, rng, x, y, ang, len, tone = 0) {
  const P = d.m, prof = PROFILES[P.outline] || PROFILES.round;
  const c = Math.cos(ang), s = Math.sin(ang);
  m.poly(blade([x, y], ang, len, len * 0.55, prof), 'main', { shade: 'round', tone });
  if (P.rings || d.form === 'scale') {
    for (let k = 1; k <= 2; k++) {
      const f = k / 3;
      m.line([[x + c * len * f - s * len * 0.4 * f, y + s * len * f + c * len * 0.4 * f], [x + c * len * f + s * len * 0.4 * f, y + s * len * f - c * len * 0.4 * f]], 'main', { lum: 0.2 });
    }
  } else {
    for (let k = 0; k < P.ribs; k++) {
      const a = ang + ((k + 0.5) / P.ribs - 0.5) * 1.6;
      m.line([[x + c * 1.5, y + s * 1.5], [x + Math.cos(a) * len * 0.9, y + Math.sin(a) * len * 0.9]], 'main', { lum: k % 2 ? 0.25 : 0.75 });
    }
  }
  if (d.form === 'scale') m.line([[x + c * 1, y + s * 1], [x + c * len * 0.85, y + s * len * 0.85]], 'accent', { lum: 0.85, glow: d.tr.warm > 0.3 });
  m.glints.push([x + c * len * 0.6 - s * 1.5, y + s * len * 0.6 + c * 1.5]);
  marks(m, d, rng, x + c * len * 0.5, y + s * len * 0.5, len * 0.3, len * 0.25);
}

/** An open shell showing its nacre. */
function openShell(m, d, rng, x, y, len) {
  valve(m, d, rng, x, y, -Math.PI / 2 - 0.5, len, -0.05);
  m.poly(blade([x + 1, y], -Math.PI / 2 + 0.55, len * 0.92, len * 0.5, PROFILES[d.m.outline] || PROFILES.round), 'iris', { shade: 'round' });
  m.ellipse(x + len * 0.25, y - len * 0.45, 1.2, 1.2, 'pale', { shade: 'flat' });
}

export function plant(d, stage, o = {}) {
  const m = new Model(), P = d.m, rng = stream(d, 'plant' + stage), W = d.size.w, H = d.size.h;
  const g = [0.45, 0.75, 1][stage];
  if (d.form === 'scale') rock(m, 0, -H * 0.3, W * 0.45, H * 0.35, stream(d, 'host'));
  else m.ellipse(0, -0.5, W * 0.48, 2.2, 'soil', { shade: 'flat', noOutline: true, tone: 0.15 });
  const n = stage === 0 ? 1 : stage === 1 ? Math.max(1, P.count - 1) : P.count;
  for (let i = 0; i < n; i++) {
    const x = (n === 1 ? 0 : i / (n - 1) - 0.5) * W * 0.6, y = d.form === 'scale' ? -H * 0.45 : -0.5;
    const len = H * 0.95 * g * (i % 2 ? 0.8 : 1);
    if (d.form !== 'scale' && P.open && i === n - 1 && stage === 2) openShell(m, d, rng, x, y, len);
    else valve(m, d, rng, x, y, -Math.PI / 2 + (i - (n - 1) / 2) * 0.5, len, i % 2 ? -0.06 : 0);
  }
  return m;
}

export function icon(d) {
  const m = new Model(), rng = stream(d, 'icon');
  if (d.form === 'scale') { valve(m, d, rng, 4, 8, -Math.PI / 2 + 0.4, 16, -0.06); valve(m, d, rng, -4, 10, -Math.PI / 2 - 0.2, 20); return m; }
  if (d.m.open) openShell(m, d, rng, 0, 12, 22);
  else valve(m, d, rng, 0, 12, -Math.PI / 2, 24);
  return m;
}

export function piece(d, v) {
  const m = new Model(), rng = stream(d, 'piece' + v);
  if (v === 3 && d.form !== 'scale') { openShell(m, d, rng, 0, 10, 20); return m; }
  valve(m, d, rng, 0, 10, -Math.PI / 2 + (v - 1) * 0.6, 22 - v * 2);
  return m;
}
