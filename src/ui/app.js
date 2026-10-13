// Application shell: settings, screen switching (menu ↔ laboratory ↔ free
// experiment), first-gesture audio unlock and error recovery.

import { h, btn, modal, toast, setOverlayRoot, setToastRoot, confirmDialog, clear } from './dom.js';
import { icon } from './icons.js';
import { audio } from '../audio/audio.js';
import { GameState } from '../game/state.js';
import { EQUIPMENT } from '../game/equipment.js';
import { loadGame, saveGame, hasSave, deleteSave, loadJSON, saveJSON, KEYS, storageAvailable } from '../game/persistence.js';
import { LabScreen } from './lab.js';
import { MenuScreen } from './menu.js';
import { openSettings, openHelp } from './panels.js';
import { Rng } from '../core/rng.js';

const DEFAULT_SETTINGS = { master: 0.8, sfx: 0.8, music: 0.35, musicOn: true, muted: false, quality: 'high', showFps: false };
const SEED_WORDS = ['amber', 'ashen', 'brine', 'copper', 'dusk', 'elder', 'fen', 'gloam', 'hollow', 'iron', 'juniper', 'kelp', 'lantern', 'moon', 'nettle', 'oak', 'pewter', 'quill', 'raven', 'sage', 'thorn', 'umber', 'vale', 'willow', 'wyrm', 'yarrow'];

export class App {
  /** @param {HTMLElement} root */
  constructor(root) {
    this.root = root;
    this.settings = loadJSON(KEYS.settings, { ...DEFAULT_SETTINGS });
    this.screen = null;
    setOverlayRoot(root);
    setToastRoot(root);
    this.applySettings();
    const unlock = () => {
      audio.unlock();
      audio.music(this.settings.musicOn && this.settings.music > 0);
    };
    root.addEventListener('pointerdown', unlock, { capture: true });
    root.addEventListener('keydown', unlock, { capture: true });
  }

  applySettings() {
    const s = this.settings;
    audio.setVolumes({ master: s.master, sfx: s.sfx, music: s.music, muted: s.muted });
  }

  saveSettings() {
    saveJSON(KEYS.settings, this.settings);
  }

  _swap(screen) {
    if (this.screen && this.screen.unmount) this.screen.unmount();
    clear(this.root);
    setToastRoot(this.root);
    this.screen = screen;
    screen.mount(this.root);
  }

  start() {
    this.showMenu();
    if (!storageAvailable()) toast('Saving unavailable', 'This browser mode blocks local storage, so progress cannot be saved.', 'lock', 6000);
  }

  showMenu() {
    this._swap(new MenuScreen(this));
  }

  continueGame() {
    const { state, error } = loadGame();
    if (error) toast('Save problem', error, 'scroll', 6000);
    if (state) this.startGame(state);
  }

  /** @param {GameState} state */
  startGame(state) {
    try {
      this._swap(new LabScreen(this, state));
    } catch (e) {
      console.error(e);
      toast('Could not start', String(e && e.message), 'close', 6000);
      this.showMenu();
    }
  }

  newGameDialog() {
    const rng = new Rng(Date.now() >>> 0);
    const seedIn = /** @type {HTMLInputElement} */ (h('input', { type: 'text', value: `${rng.pick(SEED_WORDS)}-${rng.pick(SEED_WORDS)}-${rng.int(10, 99)}`, maxlength: '32', 'aria-label': 'World seed' }));
    const tut = /** @type {HTMLInputElement} */ (h('input', { type: 'checkbox', 'aria-label': 'Play the tutorial' }));
    tut.checked = true;
    let m;
    const go = async () => {
      if (hasSave()) {
        const ok = await confirmDialog('Start a new shop?', 'Your current saved game will be replaced. Export it first from Settings if you want to keep it.', 'Start anew', 'danger');
        if (!ok) return;
      }
      const seed = seedIn.value.trim() || 'alchemy';
      const st = GameState.create(seed, { tutorial: tut.checked });
      deleteSave();
      saveGame(st);
      m.close();
      this.startGame(st);
    };
    m = modal({
      title: 'A New Shop',
      body: [
        h('div', { class: 'card parch' },
          h('div', { class: 'small', text: 'Every world has its own reagents, reactions and customers, generated from its seed. Share a seed to share a world.' }),
          h('label', { class: 'field' }, 'World seed', seedIn),
          h('div', { class: 'toggle-row' }, h('span', { text: 'Guided first brew (recommended)' }), tut)),
      ],
      foot: [btn('Open my shop', go, { cls: 'primary', icon: 'door', act: 'start-game' })],
    });
  }

  startSandbox() {
    const saved = loadJSON(KEYS.sandbox, null);
    const existing = loadGame().state;
    const seed = existing ? existing.seed : saved && saved.seed ? saved.seed : 'experiment';
    const st = GameState.create(seed, { tutorial: false });
    for (const id of st.world.ingredients) st.inventory[id] = Infinity;
    st.equipment = EQUIPMENT.map((e) => e.id);
    st.reputation = 99999;
    st.current = null;
    if (saved && saved.seed === seed && saved.cauldron) st.cauldron = saved.cauldron;
    this._swap(new LabScreen(this, st, { sandbox: true }));
    toast('Free Experiment', 'Unlimited reagents and every tool. Nothing here affects your shop.', 'flask', 4500);
  }

  openSettings() {
    openSettings(this, null);
  }
  openHelp() {
    openHelp();
  }
}

export { icon };
