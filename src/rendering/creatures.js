// The testing room's creatures, drawn in their cages at a low art
// resolution (shown with nearest-neighbour upscaling).
//
// A creature never tells the player a number. Each shows its properties in
// its own visual language, all of it measured against the cage itself:
//   • a notched post on the left (ten notches, a long one every five) marks
//     heights from the straw (nothing) to the top of the cage (everything);
//   • countable things — leaves, hearts, bubbles, embers, snowflakes — come
//     one per ten points, the last one smaller when the remainder is small.
//
//   Moss Toad   vitality: leaves sprout on its back · charm: hearts rise ·
//               bane: toxic bubbles, a sickly tint
//   Salamander  ardor: a flame rising up the post · frost: ice climbing the
//               right-hand post
//   Moon Moth   levity: it floats up along the post · charm: hearts trail ·
//               bane: dust falls from its wings
//   Mandrake    vitality: its stem grows up the stake · ardor: embers ·
//               frost: snowflakes · bane: bubbles
//   Wisp        levity: it rises · vitality: its glow swells · charm: hearts

export const CAGE_W = 64;
export const CAGE_H = 72;
const FLOOR = 64;
const TOP = 8;
const SPAN = FLOOR - TOP;

/** @param {CanvasRenderingContext2D} ctx */
function R(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

/** Height (y) of a level 0..100 on the cage scale. @param {number} v */
export function levelY(v) {
  return FLOOR - (Math.max(0, Math.min(100, v)) / 100) * SPAN;
}

/** @param {number} t seconds since the dose @returns {number} 0..1 how strongly the reaction shows */
export function reactionAmount(t) {
  if (t < 0) return 0;
  if (t < 1.4) { const u = t / 1.4; return u * u * (3 - 2 * u); }
  if (t < 8) return 1;
  if (t < 10) { const u = (t - 8) / 2; return 1 - u * u * (3 - 2 * u); }
  return 0;
}

/** How many countable objects a level shows, and the size of the last (0..1). @param {number} v */
function counted(v) {
  const n = Math.floor(v / 10);
  const rest = (v - n * 10) / 10;
  return rest >= 0.25 ? { n: n + 1, last: rest } : { n, last: 1 };
}

function heart(ctx, x, y, s = 1, col = '#ff5aa8') {
  if (s < 0.6) { R(ctx, x + 1, y + 1, 2, 2, col); return; }
  R(ctx, x, y, 2, 1, col); R(ctx, x + 3, y, 2, 1, col);
  R(ctx, x, y + 1, 5, 1, col); R(ctx, x + 1, y + 2, 3, 1, col); R(ctx, x + 2, y + 3, 1, 1, col);
  R(ctx, x, y, 1, 1, '#ffc7dd');
}
function leaf(ctx, x, y, s = 1) {
  if (s < 0.6) { R(ctx, x + 1, y + 1, 2, 2, '#7dc24a'); return; }
  R(ctx, x + 1, y, 2, 1, '#9fe06a'); R(ctx, x, y + 1, 4, 2, '#7dc24a'); R(ctx, x + 1, y + 3, 2, 1, '#3a6e24');
}
function bubble(ctx, x, y, s = 1) {
  const r = s < 0.6 ? 1 : 2;
  R(ctx, x, y, r + 1, r + 1, '#9fbf2a'); R(ctx, x, y, 1, 1, '#e6f08a');
  if (r > 1) R(ctx, x + 1, y + 2, 2, 1, '#5a7a1a');
}
function ember(ctx, x, y, s = 1) {
  R(ctx, x, y, s < 0.6 ? 1 : 2, s < 0.6 ? 1 : 2, '#ffb444'); R(ctx, x, y, 1, 1, '#fff0b0');
}
function flake(ctx, x, y, s = 1) {
  if (s < 0.6) { R(ctx, x + 1, y + 1, 1, 1, '#dff4ff'); return; }
  R(ctx, x + 1, y, 1, 3, '#dff4ff'); R(ctx, x, y + 1, 3, 1, '#dff4ff');
}

/** Lay out `v` countable objects in a column (two wide), bottom up. */
function column(ctx, x, yBottom, v, draw, t, wobble = 0.6) {
  const c = counted(v);
  for (let i = 0; i < c.n; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const ox = x + col * 7 + Math.round(Math.sin(t * 2 + i) * wobble);
    const oy = yBottom - row * 6;
    draw(ctx, ox, oy, i === c.n - 1 ? c.last : 1);
  }
}

/** The cage: back wall, straw, the notched post. */
function cage(ctx, id, t) {
  const W = CAGE_W, H = CAGE_H;
  const back = id === 'wisp' ? ['#1e2433', '#252c3d'] : id === 'salamander' ? ['#3a2a24', '#45322a'] : ['#3a3024', '#43382a'];
  for (let y = 0; y < H; y++) R(ctx, 0, y, W, 1, y % 8 < 4 ? back[0] : back[1]);
  // bars
  for (let x = 2; x < W; x += 12) R(ctx, x, 0, 1, H, 'rgba(0,0,0,0.25)');
  // floor
  if (id === 'sprout') { R(ctx, 18, FLOOR, 28, H - FLOOR, '#7a3c1f'); R(ctx, 16, FLOOR, 32, 2, '#a8582a'); }
  else if (id === 'salamander') { R(ctx, 0, FLOOR, W, H - FLOOR, '#4a4252'); R(ctx, 0, FLOOR, W, 1, '#73697b'); }
  else { R(ctx, 0, FLOOR, W, H - FLOOR, '#8b5a31'); for (let x = 1; x < W; x += 3) R(ctx, x, FLOOR - 1, 2, 1, '#c2a678'); }
  // the measuring post (left) — ten notches, a long one every five
  R(ctx, 3, TOP - 2, 2, SPAN + 3, '#6d4527');
  R(ctx, 3, TOP - 2, 1, SPAN + 3, '#a9743f');
  for (let k = 0; k <= 10; k++) {
    const y = Math.round(levelY(k * 10));
    R(ctx, 5, y, k % 5 === 0 ? 4 : 2, 1, k % 5 === 0 ? '#ffe39a' : '#c2a678');
  }
  if (id === 'salamander') {
    // a second post on the right for the ice
    R(ctx, W - 5, TOP - 2, 2, SPAN + 3, '#4a6a8a');
    for (let k = 0; k <= 10; k++) {
      const y = Math.round(levelY(k * 10));
      R(ctx, W - (k % 5 === 0 ? 9 : 7), y, k % 5 === 0 ? 4 : 2, 1, k % 5 === 0 ? '#dff4ff' : '#8fc7f2');
    }
  }
  void t;
}

/**
 * Draw a creature in its cage, reacting to a dose.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} id
 * @param {{alive:boolean, health:number}} st
 * @param {number} t seconds (idle animation)
 * @param {{levels:Record<string, number>, age:number}|null} reaction what the last dose showed and how long ago
 */
export function drawCreature(ctx, id, st, t, reaction) {
  ctx.clearRect(0, 0, CAGE_W, CAGE_H);
  cage(ctx, id, t);
  const a = reaction ? reactionAmount(reaction.age) : 0;
  const L = (k) => (reaction && reaction.levels[k] ? reaction.levels[k] * a : 0);
  if (!st.alive) { dead(ctx, id); return; }
  const bob = Math.round(Math.sin(t * 2.2) * 0.8);
  const weak = st.health < 35;
  switch (id) {
    case 'toad': toad(ctx, t, bob, L('vitality'), L('charm'), L('bane'), weak); break;
    case 'salamander': salamander(ctx, t, bob, L('ardor'), L('frost'), weak); break;
    case 'moth': moth(ctx, t, L('levity'), L('charm'), L('bane'), weak); break;
    case 'sprout': sprout(ctx, t, L('vitality'), L('ardor'), L('frost'), L('bane'), weak); break;
    case 'wisp': wisp(ctx, t, L('levity'), L('vitality'), L('charm')); break;
  }
  if (reaction && reaction.age >= 0 && reaction.age < 0.35) {
    ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - reaction.age / 0.35)})`;
    ctx.fillRect(0, 0, CAGE_W, CAGE_H);
  }
}

function mixHex(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
}

function toad(ctx, t, bob, vit, charm, bane, weak) {
  const sick = Math.min(1, bane / 60);
  const body = mixHex('#5f9e3a', '#8a8a2a', sick), dark = mixHex('#3a6e24', '#5a4a1a', sick), belly = '#d8d08a';
  const cx = 32, by = FLOOR - 1 + bob;
  const puff = 1 + Math.min(0.15, vit / 600);
  const ell = (x, y, rx, ry, c) => { for (let yy = -ry; yy <= ry; yy++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(ctx, x - w, y + yy, w * 2 + 1, 1, c); } };
  ell(cx, by - 6, Math.round(11 * puff) + 1, Math.round(6 * puff) + 1, '#1a1218');
  ell(cx, by - 6, Math.round(11 * puff), Math.round(6 * puff), body);
  ell(cx, by - 3, Math.round(8 * puff), 2, belly);
  ell(cx - 6, by - 12, 3, 3, '#1a1218'); ell(cx + 6, by - 12, 3, 3, '#1a1218');
  ell(cx - 6, by - 12, 2, 2, '#fff6e0'); ell(cx + 6, by - 12, 2, 2, '#fff6e0');
  R(ctx, cx - 6, by - 12 + (weak ? 1 : 0), 1, 1, '#1a1218'); R(ctx, cx + 6, by - 12 + (weak ? 1 : 0), 1, 1, '#1a1218');
  R(ctx, cx - 4, by - 7, 8, 1, dark);
  R(ctx, cx - 13, by - 1, 4, 2, dark); R(ctx, cx + 9, by - 1, 4, 2, dark);
  // vitality: leaves sprout above it, four to a row, one per ten
  const c = counted(vit);
  for (let i = 0; i < c.n; i++) {
    const lx = 26 + (i % 4) * 4.5, ly = by - 22 - Math.floor(i / 4) * 6 + Math.round(Math.sin(t * 2 + i) * 0.5);
    leaf(ctx, lx, ly, i === c.n - 1 ? c.last : 1);
    if (Math.floor(i / 4) === 0) R(ctx, lx + 1, ly + 4, 1, by - 12 - (ly + 4), '#3a6e24');
  }
  // charm: hearts rise in a column on the left
  column(ctx, 12, 40, charm, (g, x, y, s) => heart(g, x, y, s), t);
  // bane: bubbles in a column on the right
  column(ctx, 44, 40, bane, bubble, t, 1);
}

function salamander(ctx, t, bob, ardor, frost, weak) {
  const ice = frost;
  const cx = 30, by = FLOOR - 1;
  // ice climbs from the floor to the frost level, against the right post
  if (ice > 0.5) {
    const top = Math.round(levelY(ice));
    ctx.fillStyle = 'rgba(170,220,255,0.55)';
    ctx.fillRect(14, top, CAGE_W - 22, FLOOR - top);
    R(ctx, 14, top, CAGE_W - 22, 1, '#dff4ff');
    for (let y = top + 3; y < FLOOR; y += 6) R(ctx, 18 + ((y * 7) % 30), y, 3, 1, '#ffffff');
  }
  // the salamander
  const body = weak ? '#a8582a' : '#e2702a', spots = '#ffd75a', k = '#1a1218';
  const sway = Math.round(Math.sin(t * 3) * 1);
  R(ctx, cx - 14, by - 4 + bob, 26, 5, k);
  R(ctx, cx - 13, by - 3 + bob, 24, 3, body);
  R(ctx, cx + 10, by - 6 + bob, 7, 6, k); R(ctx, cx + 11, by - 5 + bob, 5, 4, body); R(ctx, cx + 14, by - 4 + bob, 1, 1, k);
  R(ctx, cx - 20 + sway, by - 2 + bob, 8, 2, k); R(ctx, cx - 19 + sway, by - 2 + bob, 6, 1, body);
  for (let i = 0; i < 4; i++) R(ctx, cx - 10 + i * 6, by - 3 + bob, 2, 1, spots);
  R(ctx, cx - 9, by + 1, 2, 1, k); R(ctx, cx + 5, by + 1, 2, 1, k);
  // ardor: a flame from its back up to the ardor level, against the left post
  if (ardor > 0.5) {
    const top = levelY(ardor);
    const base = by - 4 + bob;
    for (let y = Math.round(top); y < base; y++) {
      const u = (y - top) / Math.max(1, base - top);
      const w = Math.max(1, Math.round(2 + u * 7 + Math.sin(t * 12 + y * 0.7) * 1.2));
      const col = u < 0.2 ? '#fff0b0' : u < 0.55 ? '#ffb444' : '#ff7a1c';
      R(ctx, cx - 2 - w / 2 + Math.sin(t * 9 + y * 0.4) * 1.2, y, w, 1, col);
    }
  }
}

function moth(ctx, t, lev, charm, bane, weak) {
  // it rests on the straw, and rises to its levity on the post
  const y = Math.round(levelY(lev) - 3 + Math.sin(t * 4) * (lev > 2 ? 0.8 : 0));
  const x = 30 + Math.round(Math.sin(t * 1.3) * 2);
  const flap = Math.sin(t * (lev > 2 ? 14 : 3)) > 0 ? 1 : 0;
  const droop = weak || bane > 30 ? 2 : 0;
  const wing = bane > 20 ? '#b8b0a0' : '#e8dcff', wing2 = bane > 20 ? '#8a826a' : '#a678ff';
  R(ctx, x - 9, y - 4 + droop - flap, 8, 5, '#1a1218'); R(ctx, x - 8, y - 3 + droop - flap, 6, 3, wing); R(ctx, x - 7, y - 2 + droop - flap, 2, 1, wing2);
  R(ctx, x + 2, y - 4 + droop - flap, 8, 5, '#1a1218'); R(ctx, x + 3, y - 3 + droop - flap, 6, 3, wing); R(ctx, x + 6, y - 2 + droop - flap, 2, 1, wing2);
  R(ctx, x - 1, y - 4, 3, 7, '#1a1218'); R(ctx, x, y - 3, 1, 5, '#c2a678');
  R(ctx, x - 2, y - 7, 1, 3, '#1a1218'); R(ctx, x + 2, y - 7, 1, 3, '#1a1218');
  // charm: a column of hearts on the right
  column(ctx, 48, 52, charm, (g, xx, yy, s) => heart(g, xx, yy, s), t);
  // bane: dust falling from the wings, one mote per ten
  const c = counted(bane);
  for (let i = 0; i < c.n; i++) {
    const fy = y + 3 + ((t * 9 + i * 7) % Math.max(4, FLOOR - y - 3));
    R(ctx, x - 6 + (i * 5) % 14, fy, i === c.n - 1 && c.last < 0.6 ? 1 : 2, 1, '#9fbf2a');
  }
}

function sprout(ctx, t, vit, ardor, frost, bane, weak) {
  // the stem grows up the stake to its vitality (a seedling at rest)
  const h = Math.max(8, FLOOR - levelY(Math.max(10, vit)));
  const top = FLOOR - h;
  const sway = Math.round(Math.sin(t * 1.5) * 1);
  const wilt = Math.min(1, bane / 50) * 0.6 + (weak ? 0.3 : 0);
  const leafC = mixHex('#5fae3a', '#b8a83a', wilt), stem = '#335224';
  R(ctx, 31 + sway, top, 2, h, stem);
  const n = Math.max(1, Math.floor(h / 7));
  for (let i = 0; i < n; i++) {
    const ly = top + 3 + i * 7, side = i % 2 ? 1 : -1;
    const dx = side < 0 ? -6 : 3;
    R(ctx, 32 + sway + dx, ly + (wilt > 0.4 ? 1 : 0), 5, 2, leafC);
  }
  R(ctx, 29 + sway, top - 3, 6, 3, '#9fe06a');
  // the mandrake's little face peeks from the soil
  R(ctx, 28, FLOOR + 2, 8, 4, '#c8a06a'); R(ctx, 30, FLOOR + 3, 1, 1, '#1a1218'); R(ctx, 33, FLOOR + 3, 1, 1, '#1a1218');
  // ardor embers (left), frost flakes (right), bane bubbles (far right)
  column(ctx, 11, 54, ardor, ember, t, 0.8);
  column(ctx, 42, 54, frost, flake, t, 0.4);
  column(ctx, 52, 30, bane, bubble, t, 0.8);
}

function wisp(ctx, t, lev, vit, charm) {
  const y = Math.round(levelY(Math.max(8, lev)) + Math.sin(t * 2.5) * 1);
  const x = 32 + Math.round(Math.sin(t * 1.1) * 3);
  // vitality swells its golden-green glow
  const r = 3 + Math.round(vit / 12);
  ctx.fillStyle = `rgba(180,255,160,${0.12 + Math.min(0.4, vit / 150)})`;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  const pulse = 0.7 + 0.3 * Math.sin(t * 3);
  R(ctx, x - 3, y - 3, 6, 6, `rgba(143,224,255,${pulse})`);
  R(ctx, x - 1, y - 1, 3, 3, '#ffffff');
  column(ctx, 48, 52, charm, (g, xx, yy, s) => heart(g, xx, yy, s), t);
}

function dead(ctx, id) {
  const g = '#6a6272', k = '#1a1218';
  if (id === 'sprout') { R(ctx, 31, FLOOR - 10, 2, 10, '#5a4330'); R(ctx, 26, FLOOR - 6, 6, 1, '#5a4330'); return; }
  if (id === 'wisp') { R(ctx, 30, FLOOR - 4, 4, 2, '#3a3341'); return; }
  if (id === 'moth') { R(ctx, 24, FLOOR - 2, 14, 2, g); R(ctx, 30, FLOOR - 3, 2, 1, k); return; }
  R(ctx, 18, FLOOR - 6, 26, 6, g); R(ctx, 20, FLOOR - 5, 1, 1, k); R(ctx, 24, FLOOR - 5, 1, 1, k);
}
