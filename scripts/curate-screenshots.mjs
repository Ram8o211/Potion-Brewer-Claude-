// Copies a curated set of screenshots from the latest browser-test run
// (test-results/screenshots/) into docs/screenshots/, downscaling 2× phone
// captures to CSS-pixel size so the repository stays small.
//   npm run test:browser && node scripts/curate-screenshots.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SRC = path.resolve('test-results', 'screenshots');
const DST = path.resolve('docs', 'screenshots');
const PICK = [
  'desktop-menu', 'desktop-shop', 'desktop-tutorial-poured', 'desktop-tutorial-stirred', 'desktop-tutorial-heated', 'desktop-tutorial-result',
  'desktop-layers', 'desktop-powder', 'desktop-stirred', 'desktop-frozen', 'desktop-crushed', 'desktop-fire', 'desktop-long-run',
  'desktop-shop-panel', 'desktop-shop-equipment', 'desktop-journal-panel', 'desktop-recipes-panel', 'desktop-sandbox',
  'phone-portrait-menu', 'phone-portrait-shop', 'phone-portrait-tutorial-stirred', 'phone-portrait-tutorial-result', 'phone-portrait-layers',
  'phone-portrait-crushed', 'phone-portrait-fire', 'phone-portrait-shop-panel', 'phone-portrait-journal-panel',
  'phone-landscape-shop', 'phone-landscape-tutorial-stirred', 'tablet-shop',
];

fs.mkdirSync(DST, { recursive: true });
let n = 0;
for (const name of PICK) {
  const from = path.join(SRC, name + '.png');
  if (!fs.existsSync(from)) { console.log('missing', name); continue; }
  const to = path.join(DST, name + '.png');
  const big = !name.startsWith('desktop');
  try {
    // Pillow is optional: fall back to a plain copy without it
    execFileSync('python3', ['-c', `from PIL import Image\nim=Image.open(${JSON.stringify(from)})\nim=im.resize((im.size[0]//2, im.size[1]//2), Image.NEAREST) if ${big ? 'True' : 'False'} else im\nim.save(${JSON.stringify(to)}, optimize=True)`], { stdio: 'ignore' });
  } catch {
    fs.copyFileSync(from, to);
  }
  n++;
}
console.log(`Copied ${n} screenshots to docs/screenshots/`);
