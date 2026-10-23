// Shop purchases, equipment, persistence (autosave/continue, export/import)
// and settings — through the real UI.
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, openGame, lab } from './helpers.mjs';

test.describe.configure({ mode: 'serial' });

test('buying reagents and equipment', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false });
  await page.click('[data-act=shop]');
  const buy = page.locator('.overlay [data-act^=buy-]:not([disabled])').first();
  const act = await buy.getAttribute('data-act');
  if (!act) throw new Error('no buy button');
  const [, id, ml] = /^buy-(.+)-(\d+)$/.exec(act) || [];
  const before = await lab(page, (l, a) => ({ coins: l.state.coins, stock: l.state.stock(a) }), id);
  await buy.click();
  const after = await lab(page, (l, a) => ({ coins: l.state.coins, stock: l.state.stock(a) }), id);
  expect(after.stock).toBe(before.stock + Number(ml));
  expect(after.coins).toBeLessThan(before.coins);
  await shot(page, info, 'shop-bought');
  // equipment: give enough coins, then buy the frost rune through the dialog
  await lab(page, (l) => { l.state.coins = 500; l.state.reputation = 70; });
  await page.click('[data-act=shop-tab-equipment]');
  await page.click('[data-act=equip-frostrune]');
  await page.locator('.overlay .modal-foot .btn', { hasText: 'Buy' }).last().click();
  await expect.poll(() => lab(page, (l) => l.state.has('frostrune'))).toBe(true);
  const plate = await lab(page, (l) => l.sim.furnace.minCool);
  expect(plate, 'the rune draws the plate far below freezing').toBeLessThan(-20);
  await shot(page, info, 'shop-equipment');
  expect(errors).toEqual([]);
});

test('progress survives a reload and Continue restores the shop', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'persist-test-7' });
  await lab(page, (l) => { l.state.coins = 77.5; l.state.day = 3; l.save(); });
  await page.reload();
  await page.waitForSelector('[data-act=continue]');
  await expect(page.locator('[data-act=continue]')).toContainText('Day 3');
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  const st = await lab(page, (l) => ({ coins: l.state.coins, day: l.state.day, seed: l.state.seed }));
  expect(st).toEqual({ coins: 77.5, day: 3, seed: 'persist-test-7' });
  expect(errors).toEqual([]);
});

test('the cauldron contents are saved with the game', async ({ page }) => {
  await newGame(page, { tutorial: false });
  const roles = await lab(page, (l) => l.state.world.roles);
  await page.click(`.jar[data-id="${roles.water}"]`);
  await page.click('[data-act=dose-100]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  await page.waitForTimeout(800);
  await lab(page, (l) => l.save());
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  await page.waitForTimeout(300);
  expect(await lab(page, (l) => l.sim.p.count * 5)).toBe(100);
});

test('export and import a save file', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'export-me-3' });
  await lab(page, (l) => { l.state.coins = 321; l.save(); });
  await page.click('[data-act=menu]');
  await page.click('[data-act=settings]');
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('[data-act=export]')]);
  const file = info.outputPath('save.json');
  await download.saveAs(file);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(json.seed).toBe('export-me-3');
  expect(json.coins).toBe(321);
  // change the game, then import the file back from the main menu
  await lab(page, (l) => { l.state.coins = 1; l.save(); });
  await page.goto('/index.html?nosw');
  await page.click('[data-act=menu-settings]');
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('.overlay [data-act=import]')]);
  await chooser.setFiles(file);
  await page.locator('.overlay .modal-foot .btn', { hasText: 'Import' }).last().click();
  await page.waitForSelector('canvas.view-canvas');
  expect(await lab(page, (l) => l.state.coins)).toBe(321);
  expect(errors).toEqual([]);
});

test('a damaged save falls back to the backup instead of crashing', async ({ page }) => {
  await newGame(page, { tutorial: false, seed: 'backup-1' });
  await lab(page, (l) => { l.state.coins = 50; l.save(); });
  // leave to the menu (saves again, so the backup is a good copy), then damage the save
  await page.evaluate(() => window.__alchemist.showMenu());
  await page.waitForSelector('[data-act=continue]');
  await page.evaluate(() => localStorage.setItem('alchemist-shop.save', '{broken'));
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  await expect(page.locator('.toast', { hasText: 'damaged' })).toBeVisible();
  expect(await lab(page, (l) => l.state.coins)).toBe(50);
});

test('settings persist across sessions', async ({ page }) => {
  await openGame(page);
  await page.click('[data-act=menu-settings]');
  await page.locator('input[aria-label="Mute everything"]').check();
  await page.locator('select[aria-label="Graphics quality"]').selectOption('low');
  await page.locator('.overlay .modal-head .btn').first().click();
  await page.reload();
  await page.click('[data-act=menu-settings]');
  await expect(page.locator('input[aria-label="Mute everything"]')).toBeChecked();
  await expect(page.locator('select[aria-label="Graphics quality"]')).toHaveValue('low');
});
