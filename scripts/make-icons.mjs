// Generates the PWA icons (pixel-art cauldron) as PNGs. node scripts/make-icons.mjs
import fs from 'node:fs';
import { encodePng } from './lib/png.mjs';

const G = [
  '................................',
  '................................',
  '..............c..c..............',
  '.............cgc.cc.............',
  '..............cgc.c.............',
  '.........c.....cg.....c.........',
  '..........c...cgc....c..........',
  '................................',
  '......kkkkkkkkkkkkkkkkkkkk......',
  '.....kSSSSSSSSSSSSSSSSSSSSk.....',
  '....kSswwwwwwwwwwwwwwwwwwsSk....',
  '....kkkkkkkkkkkkkkkkkkkkkkkk....',
  '.....kggggggggglggggggggggk.....',
  '....kSgggglgggggggggglgggSSk....',
  '...kSSSggggggggggggggggggSSSk...',
  '..kSSsSSSSggggggggggggSSSSSSSk..',
  '..kSsSSSSSSSSSSSSSSSSSSSSSSSSk..',
  '.kSsSSSSSSSSSSSSSSSSSSSSSSSSSSk.',
  '.kSsSSSSSSSSSSSSSSSSSSSSSSSSSSk.',
  '.kSSSSSSSSSSSSSSSSSSSSSSSSSSSSk.',
  '.kSSSSSSSSSSSSSSSSSSSSSSSSSSSKk.',
  '..kSSSSSSSSSSSSSSSSSSSSSSSSSKk..',
  '..kKSSSSSSSSSSSSSSSSSSSSSSSKKk..',
  '...kKKSSSSSSSSSSSSSSSSSSSKKKk...',
  '....kkKKKKKKKKKKKKKKKKKKKKkk....',
  '.....kkk.kkkkkkkkkkkkkk.kkk.....',
  '.....kSk...o.oy.yo.o....kSk.....',
  '....kSSk..oyoyyoyyoyo...kSSk....',
  '....kkkk.oyyyywwyyyyyo..kkkk....',
  '.........ooyyyyyyyyyoo..........',
  '..........ooooooooooo...........',
  '................................',
];
const PAL = { '.': [28, 20, 34, 255], k: [18, 14, 20, 255], K: [40, 36, 46, 255], S: [62, 56, 70, 255], s: [110, 104, 122, 255], w: [150, 146, 160, 255], g: [110, 210, 120, 255], l: [210, 255, 200, 255], c: [180, 240, 190, 255], o: [255, 120, 30, 255], y: [255, 200, 70, 255] };

function render(size) {
  const n = 32, s = Math.floor(size / n), off = Math.floor((size - n * s) / 2);
  const img = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i++) img.set(PAL['.'], i * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const c = PAL[G[y][x]] || PAL['.'];
    for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) img.set(c, ((off + y * s + dy) * size + off + x * s + dx) * 4);
  }
  return encodePng(size, size, img);
}
fs.mkdirSync('assets/icons', { recursive: true });
for (const size of [192, 512]) fs.writeFileSync(`assets/icons/icon-${size}.png`, render(size));
console.log('icons written');
