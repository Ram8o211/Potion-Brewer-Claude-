// Procedural 32×32 pixel-art customer portraits: head shape, skin, eyes,
// hair or headwear by occupation, beard, glasses, outfit, and an expression
// that changes with how pleased the customer is.

import { Rng } from '../core/rng.js';

const S = 32;

/** @param {number[]} c @param {number} f */
const shade = (c, f) => `rgb(${Math.round(Math.min(255, c[0] * 255 * f))},${Math.round(Math.min(255, c[1] * 255 * f))},${Math.round(Math.min(255, c[2] * 255 * f))})`;

/**
 * Draw a portrait into a canvas (32×32 logical pixels).
 * @param {HTMLCanvasElement} canvas
 * @param {any} pt portrait params
 * @param {'neutral'|'happy'|'unhappy'} [mood]
 */
export function drawPortrait(canvas, pt, mood = 'neutral') {
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  const rng = new Rng(pt.seed || 1);
  const P = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  // backdrop: warm tavern glow
  P(0, 0, S, S, '#2a1f2e');
  for (let y = 0; y < S; y += 4) P(0, y, S, 1, '#251b29');
  P(0, 22, S, 10, '#3a2a24');
  const skin = pt.skin, hair = pt.hair, out = pt.outfit;
  // shoulders / outfit
  P(4, 25, 24, 7, shade(out, 1));
  P(4, 25, 24, 1, shade(out, 1.25));
  P(14, 25, 4, 7, shade(out, 0.75));
  if (pt.apron) { P(10, 27, 12, 5, '#d8cfb8'); P(10, 27, 12, 1, '#efe6d0'); }
  // neck
  P(13, 21, 6, 4, shade(skin, 0.85));
  // head
  const wide = rng.int(0, 2);
  const hx = 9 - wide, hw = 14 + wide * 2;
  P(hx + 1, 7, hw - 2, 15, shade(skin, 1));
  P(hx, 9, hw, 11, shade(skin, 1));
  P(hx + 1, 21, hw - 2, 1, shade(skin, 0.8));
  P(hx + hw - 2, 9, 2, 11, shade(skin, 0.88)); // side shading
  // ears
  P(hx - 1, 13, 1, 3, shade(skin, 0.85));
  P(hx + hw, 13, 1, 3, shade(skin, 0.85));
  // eyes
  const ey = 13;
  const e = pt.eyes || [0.2, 0.3, 0.5];
  P(12, ey, 3, 2, '#f4efe6');
  P(18, ey, 3, 2, '#f4efe6');
  P(13, ey, 2, 2, shade(e, 1));
  P(19, ey, 2, 2, shade(e, 1));
  P(13, ey, 1, 1, '#120c10');
  P(19, ey, 1, 1, '#120c10');
  // brows
  const browC = shade(hair, 0.8);
  const browY = mood === 'unhappy' ? ey - 2 : ey - 2;
  P(12, browY, 3, 1, browC);
  P(18, browY, 3, 1, browC);
  if (mood === 'unhappy') { P(14, browY + 1, 1, 1, browC); P(18, browY + 1, 1, 1, browC); }
  // nose
  P(16, 15, 1, 3, shade(skin, 0.78));
  P(15, 17, 2, 1, shade(skin, 0.78));
  // mouth
  const my = 19;
  if (mood === 'happy') { P(13, my, 7, 1, '#6a2a2a'); P(12, my - 1, 1, 1, '#6a2a2a'); P(20, my - 1, 1, 1, '#6a2a2a'); P(14, my + 1, 5, 1, '#8a3a3a'); }
  else if (mood === 'unhappy') { P(13, my + 1, 7, 1, '#6a2a2a'); P(12, my + 2, 1, 1, '#6a2a2a'); P(20, my + 2, 1, 1, '#6a2a2a'); }
  else P(14, my, 5, 1, '#6a2a2a');
  // age lines
  if (pt.age > 0.7) { P(11, 16, 1, 2, shade(skin, 0.8)); P(21, 16, 1, 2, shade(skin, 0.8)); }
  // beard
  if (pt.beard) {
    const bc = shade(hair, 1);
    P(hx + 1, 17, hw - 2, 5, bc);
    P(hx + 2, 22, hw - 4, 2, bc);
    P(14, 19, 5, 1, mood === 'happy' ? '#6a2a2a' : shade(hair, 0.7));
    P(hx + 1, 17, 1, 3, shade(hair, 0.8));
  }
  // glasses
  if (pt.glasses) {
    ctx.strokeStyle = '#d8b65c';
    ctx.lineWidth = 1;
    ctx.strokeRect(11.5, ey - 0.5, 4, 3);
    ctx.strokeRect(17.5, ey - 0.5, 4, 3);
    P(15, ey, 3, 1, '#d8b65c');
  }
  // hair / hats
  const hc = shade(hair, 1), hd = shade(hair, 0.75);
  const hat = pt.hat;
  const hairTop = () => { P(hx, 6, hw, 4, hc); P(hx - 1, 8, 2, 6, hc); P(hx + hw - 1, 8, 2, 6, hd); P(hx + 2, 5, hw - 4, 1, hc); };
  switch (hat) {
    case 'straw':
      hairTop();
      P(hx - 4, 7, hw + 8, 2, '#d8b65c'); P(hx - 4, 7, hw + 8, 1, '#efd27a');
      P(hx + 1, 3, hw - 2, 4, '#d8b65c'); P(hx + 1, 6, hw - 2, 1, '#8a3a2a');
      break;
    case 'cap':
      hairTop();
      P(hx, 4, hw, 4, '#5a4a6a'); P(hx + hw - 2, 7, 5, 1, '#5a4a6a');
      break;
    case 'feather':
      hairTop();
      P(hx - 1, 4, hw + 2, 4, '#7a2a5a'); P(hx - 1, 4, hw + 2, 1, '#9a3a7a');
      P(hx + hw - 2, 0, 2, 5, '#e8e0a0'); P(hx + hw - 1, 0, 1, 2, '#ffffff');
      break;
    case 'hood':
      P(hx - 2, 4, hw + 4, 6, shade(out, 0.9)); P(hx - 2, 9, 3, 13, shade(out, 0.9)); P(hx + hw - 1, 9, 3, 13, shade(out, 0.8));
      P(hx, 4, hw, 1, shade(out, 1.2));
      break;
    case 'helm':
      P(hx - 1, 4, hw + 2, 8, '#8a8a96'); P(hx - 1, 4, hw + 2, 1, '#b8b8c4'); P(15, 7, 2, 7, '#6a6a76');
      P(hx - 1, 11, 2, 5, '#8a8a96'); P(hx + hw - 1, 11, 2, 5, '#6a6a76');
      break;
    case 'wide':
      hairTop();
      P(hx - 5, 7, hw + 10, 2, '#4a3a2a'); P(hx + 1, 2, hw - 2, 5, '#4a3a2a'); P(hx + 1, 5, hw - 2, 1, '#8a6a3a');
      break;
    case 'witch':
      P(hx - 1, 8, 2, 12, hc); P(hx + hw - 1, 8, 2, 12, hd);
      P(hx - 5, 7, hw + 10, 2, '#1e2a1e'); P(hx + 2, 3, hw - 4, 4, '#1e2a1e'); P(hx + 4, 0, hw - 8, 3, '#1e2a1e'); P(hx + 7, -1, 3, 2, '#1e2a1e');
      P(hx + 2, 6, hw - 4, 1, '#7a3aa8');
      break;
    case 'bandana':
      hairTop();
      P(hx, 5, hw, 3, '#a8302a'); P(hx + hw, 6, 3, 2, '#a8302a');
      break;
    case 'crown':
      hairTop();
      P(hx + 1, 3, hw - 2, 3, '#e8b45c'); P(hx + 1, 1, 2, 2, '#e8b45c'); P(15, 1, 2, 2, '#e8b45c'); P(hx + hw - 3, 1, 2, 2, '#e8b45c');
      P(15, 4, 2, 1, '#e0402c');
      break;
    case 'wizard':
      P(hx - 1, 8, 2, 8, '#d8d8e0'); P(hx + hw - 1, 8, 2, 8, '#b8b8c0');
      P(hx - 3, 7, hw + 6, 2, '#3a2a7a'); P(hx + 1, 3, hw - 2, 4, '#3a2a7a'); P(hx + 4, 0, hw - 8, 3, '#3a2a7a');
      P(hx + 3, 4, 1, 1, '#ffe39a'); P(hx + hw - 5, 2, 1, 1, '#ffe39a');
      break;
    default:
      hairTop();
      if (rng.chance(0.5)) P(hx - 1, 8, 2, 10, hc);
  }
}
