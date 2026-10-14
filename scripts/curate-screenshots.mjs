// Copies a curated set of screenshots from the latest browser-test run
// (test-results/screenshots/) into docs/screenshots/, downscaling 2× phone
// captures to CSS-pixel size so the repository stays small.
//   npm run test:browser && node scripts/curate-screenshots.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SRC = path.resolve('test-results', 'screenshots');
const DST = path.resolve('docs', 'screenshots');
const PROFILES = ['desktop', 'phone-portrait', 'phone-landscape', 'tablet'];
const ROOMS = ['counter', 'garden', 'testing', 'book'];
/** source name → published name */
const PICK = {
  ...Object.fromEntries(PROFILES.flatMap((p) => [[`${p}-shop`, `room-${p}-brew`], ...ROOMS.map((r) => [`${p}-room-${r}`, `room-${p}-${r}`])])),
  ...Object.fromEntries([
    'desktop-menu', 'desktop-guided-garden', 'desktop-guided-toad', 'desktop-guided-vial', 'desktop-guided-haggle', 'desktop-guided-sold',
    'desktop-certified-vial', 'desktop-complaint', 'desktop-salamander-flame', 'desktop-garden-harvested',
    'desktop-layers', 'desktop-powder', 'desktop-frozen', 'desktop-crushed', 'desktop-fire', 'desktop-long-run', 'desktop-shop-equipment',
    'phone-portrait-menu', 'phone-portrait-guided-toad', 'phone-portrait-guided-haggle', 'phone-portrait-coach-garden', 'phone-portrait-complaint',
    'phone-portrait-salamander-flame', 'phone-portrait-ingredient-panel', 'phone-portrait-layers', 'phone-portrait-crushed', 'phone-portrait-fire',
    'phone-landscape-guided-haggle', 'phone-landscape-salamander-flame',
  ].map((n) => [n, n])),
};

fs.mkdirSync(DST, { recursive: true });
let n = 0;
for (const [name, out] of Object.entries(PICK)) {
  const from = path.join(SRC, name + '.png');
  if (!fs.existsSync(from)) { console.log('missing', name); continue; }
  const to = path.join(DST, out + '.png');
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
