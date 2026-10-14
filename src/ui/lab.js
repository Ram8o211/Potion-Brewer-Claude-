// The shop — the game's main screen.
//
// A mobile-first shell with a bottom tab bar (a left rail in landscape and on
// desktop) around five rooms:
//   Counter  the customer, their request, the sealed vial, haggling,
//            certification and returning customers
//   Brew     the cauldron: the live simulation, tools, fire, shelf
//   Garden   the well, plant beds and crystal beds that grow every ingredient
//   Testing  creatures that show a potion's magic; the Potion ID
//   Book     recipes, ingredients, journal, awards, sales
// The cauldron simulation keeps running whichever room is open (a fire left
// burning keeps burning), but it is only drawn while the Brew room is shown.
// This class owns the simulation, the renderer and input, the brew log and
// batch identity, and bottling into the sealed vial.

import { Simulation } from '../simulation/world.js';
import { PHASE, SIM } from '../simulation/constants.js';
import { snapshotSim, applySnapshot } from '../simulation/snapshot.js';
import { clampToInterior } from '../simulation/tools.js';
import { MAX_SPECIES } from '../reactions/species.js';
import { compatFactorT } from '../reactions/compatibility.js';
import { Renderer } from '../rendering/renderer.js';
import { drawPortrait } from '../rendering/portraits.js';
import { drawJar } from '../rendering/art.js';
import { rawSprite } from '../rendering/scenes.js';
import { measureParticles, tapSelection } from '../game/measure.js';
import { processEvent } from '../game/journal.js';
import { saveGame, saveJSON, KEYS } from '../game/persistence.js';
import { AutoBrewer } from '../game/autobrew.js';
import { RANKS } from '../game/equipment.js';
import { PROP_BY_KEY } from '../alchemy/magic.js';
import { rgbToHex } from '../core/color.js';
import { h, btn, clear, toast, coins, confirmDialog, setNoticeHost } from './dom.js';
import { icon, iconUrl } from './icons.js';
import { audio } from '../audio/audio.js';
import * as panels from './panels.js';
import { Tutorial } from './tutorial.js';
import { CounterView } from './views/counter.js';
import { GardenView } from './views/garden.js';
import { TestingView } from './views/testing.js';
import { BookView } from './views/book.js';

const TOOL_DEFS = [
  { id: 'spoon', label: 'Spoon', icon: 'spoon', key: '2' },
  { id: 'pestle', label: 'Pestle', icon: 'pestle', key: '3', needs: 'pestle' },
  { id: 'skimmer', label: 'Skim', icon: 'ladle', key: '4', needs: 'skimmer' },
  { id: 'pour', label: 'Pour', icon: 'pour', key: '1' },
];
export const VIEWS = [
  { id: 'counter', label: 'Counter', icon: 'stall', key: 'c' },
  { id: 'brew', label: 'Brew', icon: 'cauldron', key: 'v' },
  { id: 'garden', label: 'Garden', icon: 'seedling', key: 'g' },
  { id: 'testing', label: 'Testing', icon: 'toad', key: 't' },
  { id: 'book', label: 'Book', icon: 'book', key: 'j' },
];

export class LabScreen {
  /**
   * @param {import('./app.js').App} app
   * @param {import('../game/state.js').GameState} state
   * @param {{sandbox?: boolean}} [opts]
   */
  constructor(app, state, opts = {}) {
    this.app = app;
    this.state = state;
    this.sandbox = !!opts.sandbox;
    this.tool = 'spoon';
    this.selected = null;
    this.ground = false;
    this.speed = 1;
    this.pointer = { down: false, x: 0, y: 0, id: -1, wx: 0, wy: 0 };
    this.pourX = 0.3;
    this.lastPoured = {};
    this.bottling = null;
    this.thermal = false;
    this.autoStir = false;
    this.autoBrewer = null;
    this.time = 0;
    this.hudTimer = 0;
    this.tapTimer = 0;
    this.saveTimer = 0;
    this.mixTimer = 0;
    this.tapMl = 0;
    this.running = false;
    this.fpsAcc = { t: 0, n: 0, fps: 0 };
    /** frame timing for the performance overlay and the benchmark (ring of recent frames) */
    this.perf = { intervals: new Float32Array(600), work: new Float32Array(600), n: 0, physMs: 0, renderMs: 0 };
    this.stirLevel = 0;
    this.lastBoil = 0;
    this._raf = 0;
    this.view = 'brew';
    this.testSource = 'cauldron';
    this.awayWarned = 0;
  }

  // ------------------------------------------------------------------ setup
  mount(root) {
    this.root = root;
    const st = this.state;
    const cap = st.cap;
    this.cap = cap;
    this.sim = this.makeSim(cap.size);
    this._applyFurnaceCaps();
    if (st.cauldron) {
      try {
        applySnapshot(this.sim, st.cauldron, { lookup: st.lookup });
      } catch (e) {
        console.warn('Could not restore cauldron', e);
      }
    }
    this.buildDom();
    this.renderer = new Renderer(this.canvas);
    /** effective render quality: the setting, or — on 'auto' — what this device sustains */
    this.autoQuality = /** @type {'high'|'medium'|'low'} */ ('high');
    this.qualityCheck = { t: 0, slow: 0, frames: 0 };
    this.renderer.quality = this.effectiveQuality();
    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);
    this.resizeObs = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.resize()) : null;
    if (this.resizeObs) this.resizeObs.observe(this.stageEl);
    this.resize();
    this.bindInput();
    this.selectTool('spoon', true);
    if (!this.sandbox) {
      if (!st.current && !st.dayOver) this.bringCustomer(false);
      this.tutorial = new Tutorial(this);
      if (st.tutorial.active && !st.tutorial.done) this.tutorial.start();
    }
    this.showView(this.sandbox ? 'brew' : st.vial || (st.current && st.current.type === 'complaint') ? 'counter' : 'brew', true);
    this.refreshHud(true);
    this.running = true;
    this.lastT = performance.now();
    const loop = (t) => {
      if (!this.running) return;
      this._raf = requestAnimationFrame(loop);
      this.frame(t);
    };
    this._raf = requestAnimationFrame(loop);
    this.onVis = () => {
      if (document.hidden) this.save();
      else this.lastT = performance.now();
    };
    document.addEventListener('visibilitychange', this.onVis);
    this.onUnload = () => this.save();
    window.addEventListener('pagehide', this.onUnload);
    // Another tab (or the other copy of the game on the same site) saved the
    // shop: this tab's state is now stale, so stop saving and go back to the
    // menu, where Continue loads the newer save instead of overwriting it.
    this.saveBlocked = false;
    this.onStorage = (/** @type {StorageEvent} */ e) => {
      if (this.sandbox || e.key !== KEYS.save || this.saveBlocked) return;
      this.saveBlocked = true;
      this.app.showMenu();
      toast('Shop opened elsewhere', 'Saved from another tab. Press Continue to carry on here.', 'scroll', 7000);
    };
    window.addEventListener('storage', this.onStorage);
    audio.music(this.app.settings.music > 0 && this.app.settings.musicOn);
  }

  /** @param {string} size */
  makeSim(size) {
    const st = this.state;
    return new Simulation({ size, lookup: st.lookup, reactions: st.world.reactions });
  }

  unmount() {
    this.save();
    this.running = false;
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKey);
    document.removeEventListener('visibilitychange', this.onVis);
    window.removeEventListener('pagehide', this.onUnload);
    window.removeEventListener('storage', this.onStorage);
    if (this.resizeObs) this.resizeObs.disconnect();
    if (this.tutorial) this.tutorial.stop();
    audio.update({ fire: 0, stir: 0, pour: 0, boil: 0, cold: 0 }, 0);
    setNoticeHost(null);
    this.el.remove();
  }

  _applyFurnaceCaps() {
    const cap = this.state.cap;
    Object.assign(this.sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
  }

  /** Re-read capabilities after a purchase (and install a bigger cauldron). */
  refreshCapabilities() {
    const cap = this.state.cap;
    if (cap.size !== this.cap.size) {
      const snap = snapshotSim(this.sim, this.cap.size);
      const sim = this.makeSim(cap.size);
      applySnapshot(sim, snap, { lookup: this.state.lookup });
      this.sim = sim;
      toast('New cauldron installed', '', 'cauldron');
    }
    this.cap = cap;
    this._applyFurnaceCaps();
    this.buildTools();
    this.buildShelf();
    this.resize(true);
    this.refreshHud(true);
    for (const v of Object.values(this.views)) v.build();
  }

  // ------------------------------------------------------------------ DOM
  buildDom() {
    this.el = h('div', { class: 'screen lab', 'data-mode': this.sandbox ? 'sandbox' : 'game', 'data-view': 'brew' });
    // ---- top bar: menu · coins · rank · day · shop
    this.coinEl = h('span', { class: 'coins-val' });
    this.rankName = h('div', { class: 'rankname' });
    this.rankBar = h('i');
    this.dayEl = h('div', { class: 'day' });
    this.topbar = h('header', { class: 'topbar frame' },
      btn('', () => panels.openPause(this), { icon: 'menu', cls: 'icon', title: 'Menu (Esc)', act: 'menu' }),
      this.sandbox
        ? h('div', { class: 'stat' }, icon('flask'), h('span', { text: 'Free Experiment' }))
        : h('div', { class: 'stat', title: 'Coins' }, icon('coin'), this.coinEl),
      this.sandbox ? null : h('div', { class: 'rankrow' }, icon('star', 'rank-ico'), h('div', { class: 'stat rankbox' }, this.rankName, h('div', { class: 'bar' }, this.rankBar))),
      this.sandbox ? null : this.dayEl,
      this.notice = h('div', { class: 'notice', role: 'status', 'aria-live': 'polite' }),
      this.sandbox ? null : btn('', () => panels.openShop(this), { icon: 'bag', cls: 'icon', title: 'Guild shop (S)', act: 'shop' }),
    );
    setNoticeHost(this.notice);
    // the tutorial's coach bar has its own row: it never covers a control
    this.coach = h('div', { class: 'coach hidden', role: 'note', 'aria-live': 'polite' });
    // ---- brew room
    this.strip = h('div', { class: 'order-strip parch', role: 'button', tabindex: '0', 'aria-label': 'The request: open the counter' });
    this.strip.addEventListener('click', (e) => { if (!(/** @type {HTMLElement} */ (e.target)).closest('.btn')) this.showView('counter'); });
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'view-canvas', 'aria-label': 'Cauldron: drag to stir, hold to pour the selected ingredient' }));
    this.chips = h('div', { class: 'hud-chips' });
    this.bottleFab = btn('Bottle', () => this.startBottling(), { icon: 'bottle', cls: 'fab primary', title: 'Bottle the potion (B)', act: 'bottle' });
    this.infoFab = btn('', () => this.toggleBrewInfo(), { icon: 'scroll', cls: 'fab-mini icon', title: 'What is in the cauldron', act: 'brew-info' });
    this.brewPanel = h('div', { class: 'brew-panel parch hidden' });
    this.stageEl = h('main', { class: 'stage' }, this.canvas, this.chips, this.brewPanel, this.infoFab, this.sandbox ? null : this.bottleFab);
    this.furnaceInput = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: '-100', max: '100', step: '1', value: '0', 'aria-label': 'Fire and frost control' }));
    this.furnaceInput.addEventListener('input', () => {
      const v = Number(this.furnaceInput.value) / 100;
      this.setFurnace(Math.abs(v) < 0.06 ? 0 : v);
    });
    this.furnaceLabel = h('span', { class: 'flabel' });
    this.furnaceIcon = icon('flame');
    this.lidBtn = btn('', () => this.toggleLid(), { icon: 'lid', cls: 'icon', title: 'Lid on/off (L)', act: 'lid' });
    this.controls = h('section', { class: 'controls frame' },
      this.lidBtn,
      h('div', { class: 'furnace' }, this.furnaceIcon, this.furnaceInput, this.furnaceLabel),
    );
    this.toolsEl = h('div', { class: 'tools', role: 'toolbar', 'aria-label': 'Tools' });
    this.toolbar = h('nav', { class: 'toolbar frame' }, this.toolsEl);
    this.shelfEl = h('div', { class: 'shelf', role: 'listbox', 'aria-label': 'Ingredient shelf' });
    this.doseEl = h('div', { class: 'dose' });
    this.shelfWrap = h('div', { class: 'shelf-wrap frame' }, this.doseEl, this.shelfEl);
    this.brewView = h('section', { class: 'view view-brew', 'data-view': 'brew' },
      this.sandbox ? null : this.strip, this.stageEl, this.controls, this.toolbar, this.shelfWrap);
    // ---- other rooms
    this.views = { counter: new CounterView(this), garden: new GardenView(this), testing: new TestingView(this), book: new BookView(this) };
    this.viewsEl = h('div', { class: 'views' }, this.views.counter.el, this.brewView, this.views.garden.el, this.views.testing.el, this.views.book.el);
    // ---- tab bar
    this.tabEls = {};
    this.tabbar = h('nav', { class: 'tabbar frame', 'aria-label': 'Rooms' });
    for (const v of VIEWS) {
      if (this.sandbox && v.id === 'counter') continue;
      const badge = h('span', { class: 'badge hidden' });
      const b = h('button', { class: 'tab', 'data-act': 'tab-' + v.id, 'aria-label': v.label, title: `${v.label} (${v.key.toUpperCase()})` }, icon(v.icon), h('span', { class: 'tab-lbl', text: v.label }), badge);
      b.addEventListener('click', () => { audio.play('select'); this.showView(v.id); });
      this.tabEls[v.id] = { b, badge };
      this.tabbar.appendChild(b);
    }
    this.el.append(this.topbar, this.coach, this.viewsEl, this.tabbar);
    this.root.appendChild(this.el);
    this.buildTools();
    this.buildShelf();
    this.buildDose();
    for (const v of Object.values(this.views)) v.build();
  }

  /** Switch rooms. @param {string} id */
  showView(id, silent = false) {
    if (this.sandbox && id === 'counter') id = 'brew';
    this.view = id;
    this.el.setAttribute('data-view', id);
    for (const [k, t] of Object.entries(this.tabEls)) {
      t.b.classList.toggle('active', k === id);
      t.b.setAttribute('aria-current', k === id ? 'page' : 'false');
    }
    if (id !== 'brew') {
      if (this.sim.emitter.pouring && !(this.sim.emitter.active && this.sim.emitter.active.dose)) this.sim.emitter.stop();
      this.pointer.down = false;
      const t = this.sim.tool;
      if (t.active && !t.auto) t.setTarget(t.x, t.y, false);
    }
    const v = this.views[id];
    if (v) v.refresh();
    if (id === 'brew') requestAnimationFrame(() => this.resize());
    if (!silent) this.updateBadges();
    if (this.tutorial) this.tutorial.notify('view', id);
  }

  updateBadges() {
    const st = this.state;
    const set = (id, text) => {
      const t = this.tabEls[id];
      if (!t) return;
      t.badge.textContent = text || '';
      t.badge.classList.toggle('hidden', !text);
    };
    const visitor = st.current && !this.sandbox && this.view !== 'counter' && !this._seenCustomer;
    set('counter', st.current && st.current.type === 'complaint' && this.view !== 'counter' ? '!' : st.vial ? '1' : visitor ? '!' : '');
    let ripe = 0;
    if (!this.sandbox) for (const id of Object.keys(st.garden.beds)) { const s = st.bed(id); if (s && s.owned && s.growth >= 0.999) ripe++; }
    set('garden', ripe ? String(ripe) : '');
    if (this.view === 'counter') this._seenCustomer = true;
  }

  /** Dose buttons and the mortar switch sit above the shelf. */
  placeDose() {
    this.doseEl.classList.toggle('collapsed', this.tool !== 'pour' || !this.selected);
  }

  buildActions() {
    const a = this.actionsEl;
    if (!a) return;
    clear(a);
    const set = {};
    set.stir = btn('', () => {}, { icon: 'gear', cls: 'icon', title: this.state.has('stirrer') ? 'Clockwork stirrer on/off (A)' : 'Hold to stir automatically', act: 'autostir' });
    const startAuto = (e) => { e.preventDefault(); if (this.state.has('stirrer')) this.setAutoStir(!this.autoStir); else this.setAutoStir(true); };
    const stopAuto = () => { if (!this.state.has('stirrer')) this.setAutoStir(false); };
    set.stir.addEventListener('pointerdown', startAuto);
    set.stir.addEventListener('pointerup', stopAuto);
    set.stir.addEventListener('pointerleave', stopAuto);
    set.stir.addEventListener('pointercancel', stopAuto);
    set.speed = btn('1×', () => this.cycleSpeed(), { icon: 'speed', cls: 'icon', title: 'Time speed (F)', act: 'speed' });
    a.append(set.stir, set.speed);
    if (this.state.has('thermal') || this.sandbox) {
      set.thermal = btn('', () => this.toggleThermal(), { icon: 'monocle', cls: 'icon', title: 'Heat map (H)', act: 'thermal' });
      a.append(set.thermal);
    }
    a.append(btn('', () => this.emptyCauldron(), { icon: 'trash', cls: 'icon danger', title: 'Empty the cauldron', act: 'empty' }));
    this.actionSet = set;
    this.syncActions();
  }

  /** Reflect toggle states on the action buttons. */
  syncActions() {
    const lidOpen = !this.sim.cauldron.lidClosed;
    this.lidBtn.classList.toggle('active', lidOpen);
    this.lidBtn.title = lidOpen ? 'Lid open — tap to close (L)' : 'Lid closed — tap to open (L)';
    const set = this.actionSet;
    if (!set) return;
    set.stir.classList.toggle('active', this.autoStir);
    set.speed.classList.toggle('active', this.speed > 1);
    const l = set.speed.querySelector('.lbl');
    if (l) l.textContent = this.speed + '×';
    if (set.thermal) set.thermal.classList.toggle('active', this.thermal);
  }

  toggleThermal() {
    this.thermal = !this.thermal;
    this.syncActions();
  }

  buildTools() {
    const t = clear(this.toolsEl);
    this.toolBtns = {};
    for (const d of TOOL_DEFS) {
      if (d.needs && !this.state.has(d.needs) && !this.sandbox) continue;
      if (d.id === 'pour') continue; // pouring starts from the shelf
      const b = btn(d.label, () => this.selectTool(d.id), { icon: d.icon, title: `${d.label} (${d.key})`, act: 'tool-' + d.id });
      this.toolBtns[d.id] = b;
      t.appendChild(b);
    }
    t.appendChild(h('div', { class: 'sep' }));
    this.actionsEl = h('div', { class: 'acts' });
    t.appendChild(this.actionsEl);
    this.buildActions();
    if (this.tool) this.selectTool(this.tool, true);
  }

  /** The shelf: an ingredient appears once the shop can grow it or has some. */
  shelfIds() {
    const st = this.state;
    if (this.sandbox) return st.world.ingredients;
    const avail = st.availableSet();
    return st.world.ingredients.filter((id) => avail.has(id));
  }

  buildShelf() {
    const sh = clear(this.shelfEl);
    this.jarEls = {};
    const st = this.state;
    const ids = this.shelfIds();
    const labels = shelfLabels(ids.map((id) => st.lookup(id).name));
    for (const [n, id] of ids.entries()) {
      const m = st.lookup(id);
      let cv;
      if (m.form === 'solid') {
        cv = rawSprite(m.shape || 'stone', m.look || m.color);
        cv.classList.add('raw');
      } else {
        cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '15', height: '20' }));
        drawJar(cv.getContext('2d'), 1, 0, 13, 20, m.look || m.color, m.form);
      }
      const stock = h('span', { class: 'jstock' });
      const el = h('button', { class: 'jar' + (m.form === 'solid' ? ' stone' : ''), title: m.name, 'aria-label': m.name, 'data-id': id, role: 'option' }, stock, cv, h('span', { class: 'jname', text: labels[n] }));
      this.bindJar(el, id);
      this.jarEls[id] = { el, stock };
      sh.appendChild(el);
    }
    this.updateShelf();
  }

  /**
   * A jar: tap to pick it up, long-press to read its magic, or drag it
   * straight onto the cauldron to pour where you let the stream fall.
   * @param {HTMLElement} el @param {string} id
   */
  bindJar(el, id) {
    let pressTimer = 0, sx = 0, sy = 0, dragging = false, ghost = null, pid = -1, columns = false;
    const clearTimer = () => { if (pressTimer > 0) clearTimeout(pressTimer); };
    el.addEventListener('pointerdown', (e) => {
      sx = e.clientX; sy = e.clientY; dragging = false; pid = e.pointerId;
      columns = getComputedStyle(this.shelfEl).flexWrap === 'wrap';
      if (e.pointerType === 'mouse') { try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ } }
      pressTimer = /** @type {any} */ (setTimeout(() => { pressTimer = -1; panels.openIngredient(this, id); }, 550));
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pid || pressTimer === -1) return;
      const dy = sy - e.clientY, dx = Math.abs(e.clientX - sx);
      // Lift the jar with a drag across the shelf's scrolling direction, or
      // any drag that leaves the shelf. Along the shelf, the drag scrolls it.
      const sr = this.shelfEl.getBoundingClientRect();
      const outside = e.clientX < sr.left || e.clientX > sr.right || e.clientY < sr.top || e.clientY > sr.bottom;
      const across = columns ? dx > 14 && dx > Math.abs(dy) * 0.9 : dy > 14 && dy > dx * 0.9;
      if (!dragging && Math.hypot(dx, dy) > 16 && (across || outside)) {
        clearTimer(); pressTimer = 0;
        dragging = true;
        try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
        this.selectIngredient(id);
        ghost = h('div', { class: 'drag-ghost jar-ghost' }, el.querySelector('canvas').cloneNode(true));
        const c2 = ghost.querySelector('canvas');
        const src = el.querySelector('canvas');
        if (c2 && src) /** @type {CanvasRenderingContext2D} */ (/** @type {HTMLCanvasElement} */ (c2).getContext('2d')).drawImage(/** @type {HTMLCanvasElement} */ (src), 0, 0);
        document.body.appendChild(ghost);
      }
      if (dragging && ghost) {
        ghost.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 48}px)`;
        const r = this.canvas.getBoundingClientRect();
        const over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (over) {
          const [wx] = this.renderer.toWorld(e.clientX - r.left, e.clientY - r.top);
          if (!this.sim.emitter.pouring) this.startPour(wx);
          else { this.pourX = this.clampPourX(wx); this.sim.emitter.setX(this.pourX); }
        } else if (this.sim.emitter.pouring && !this.sim.emitter.active.dose) this.sim.emitter.stop();
      }
    });
    const end = (e) => {
      if (e.pointerId !== pid) return;
      clearTimer();
      if (dragging) {
        dragging = false;
        if (ghost) ghost.remove();
        ghost = null;
        if (this.sim.emitter.pouring && !this.sim.emitter.active.dose) this.sim.emitter.stop();
        pressTimer = -2;
      }
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('pointerleave', () => { if (!dragging) clearTimer(); });
    el.addEventListener('click', () => {
      if (pressTimer === -1 || pressTimer === -2) { pressTimer = 0; return; }
      this.selectIngredient(id);
    });
    el.addEventListener('contextmenu', (e) => { e.preventDefault(); panels.openIngredient(this, id); });
  }

  buildDose() {
    const d = clear(this.doseEl);
    this.groundBtn = btn('', () => { this.ground = !this.ground; this.syncGround(); audio.play('select'); }, { icon: 'mortar', cls: 'icon', title: 'Smash it to powder in the mortar first (G)', act: 'ground' });
    this.selIcon = h('span', { class: 'sel-ico' });
    d.append(this.selIcon);
    for (const ml of [10, 25, 50, 100]) d.append(btn(`${ml}`, () => this.pourDose(ml), { title: `Pour exactly ${ml} ml`, act: 'dose-' + ml }));
    d.append(this.groundBtn, btn('', () => panels.openIngredient(this, this.selected), { icon: 'eye', cls: 'icon', title: 'Its magic', act: 'sel-info' }));
    this.syncGround();
  }

  syncGround() {
    if (!this.groundBtn) return;
    const m = this.selected ? this.state.lookup(this.selected) : null;
    const can = !!m && m.form === 'solid' && (this.sandbox || this.state.has('mortar'));
    this.groundBtn.classList.toggle('hidden', !can);
    this.groundBtn.classList.toggle('active', can && this.ground);
    if (this.selIcon) {
      clear(this.selIcon);
      if (m) this.selIcon.append(h('span', { class: 'swatch', style: { background: rgbToHex(m.look || m.color) } }), h('span', { class: 'sel-name', text: m.name }));
    }
  }

  // ------------------------------------------------------------------ layout
  resize(force = false) {
    this.placeDose();
    const r = this.stageEl.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return;
    const st = this.state;
    const jars = st.world.ingredients.slice(0, 14).map((id) => ({ color: st.lookup(id).look || st.lookup(id).color, form: st.lookup(id).form === 'solid' ? 'powder' : st.lookup(id).form }));
    if (force) this.renderer._key = '';
    this.renderer.resize(Math.floor(r.width), Math.floor(r.height), this.sim.cauldron, jars, this.effectiveQuality());
    if (this.tutorial) this.tutorial.place();
  }

  /** @returns {'high'|'medium'|'low'} */
  effectiveQuality() {
    const q = this.app.settings.quality;
    return q === 'auto' || !q ? this.autoQuality : q;
  }

  /**
   * Automatic quality: if frames keep running over budget, step the
   * renderer down (high → medium → low). Checked about once a second.
   * @param {number} dt @param {number} workMs
   */
  adaptQuality(dt, workMs) {
    const qc = this.qualityCheck;
    qc.t += dt; qc.frames++;
    if (workMs > 15) qc.slow++;
    if (qc.t < 1.2) return;
    const slowShare = qc.slow / Math.max(1, qc.frames);
    qc.t = 0; qc.slow = 0; qc.frames = 0;
    if (this.app.settings.quality !== 'auto' || slowShare < 0.5 || this.autoQuality === 'low') return;
    this.autoQuality = this.autoQuality === 'high' ? 'medium' : 'low';
    this.resize(true);
  }

  // ------------------------------------------------------------------ input
  bindInput() {
    const cv = this.canvas;
    const pos = (e) => {
      const r = cv.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    cv.addEventListener('pointerdown', (e) => {
      if (this.pointer.down) return; // a second finger never fights the first
      audio.unlock();
      cv.setPointerCapture(e.pointerId);
      const [x, y] = pos(e);
      this.pointer = { down: true, x, y, id: e.pointerId, wx: 0, wy: 0 };
      this.pointerWorld();
      this.onPointerStart();
      e.preventDefault();
    });
    cv.addEventListener('pointermove', (e) => {
      const [x, y] = pos(e);
      if (this.pointer.down && e.pointerId !== this.pointer.id) return;
      this.pointer.x = x;
      this.pointer.y = y;
      this.pointerWorld();
      this.hover = !this.pointer.down && e.pointerType === 'mouse';
      if (this.pointer.down) this.onPointerMove();
      else if (this.hover) this.onHover();
    });
    const end = (e) => {
      if (!this.pointer.down || e.pointerId !== this.pointer.id) return;
      this.pointer.down = false;
      this.onPointerEnd();
    };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    cv.addEventListener('pointerleave', () => { this.hover = false; });
    cv.addEventListener('contextmenu', (e) => e.preventDefault());
    // no pinch-zoom, double-tap zoom or scroll bounce over the cauldron
    this.stageEl.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    this.stageEl.addEventListener('gesturestart', (e) => e.preventDefault());
    this.onKey = (e) => this.handleKey(e);
    window.addEventListener('keydown', this.onKey);
  }

  pointerWorld() {
    const [wx, wy] = this.renderer.toWorld(this.pointer.x, this.pointer.y);
    this.pointer.wx = wx;
    this.pointer.wy = wy;
  }

  onPointerStart() {
    const { wx, wy } = this.pointer;
    if (this.tool === 'pour') {
      if (!this.selected) { toast('Pick an ingredient', '', 'jar'); return; }
      this.startPour(wx);
    } else {
      this.setAutoStir(false);
      const [x, y] = clampToInterior(this.sim, wx, wy, 0.1);
      this.sim.tool.type = /** @type {any} */ (this.tool);
      this.sim.tool.setTarget(x, y, true);
    }
  }

  onPointerMove() {
    const { wx, wy } = this.pointer;
    if (this.tool === 'pour') {
      this.pourX = this.clampPourX(wx);
      this.sim.emitter.setX(this.pourX);
    } else {
      const [x, y] = clampToInterior(this.sim, wx, wy, 0.1);
      this.sim.tool.setTarget(x, y, true);
    }
  }

  onHover() {
    if (this.tool === 'spoon' || this.tool === 'pestle' || this.tool === 'skimmer') {
      const [x, y] = clampToInterior(this.sim, this.pointer.wx, this.pointer.wy, 0.1);
      if (!this.sim.tool.active) { this.sim.tool.x = x; this.sim.tool.y = y; this.sim.tool.tx = x; this.sim.tool.ty = y; }
    }
  }

  onPointerEnd() {
    if (this.tool === 'pour') {
      if (this.sim.emitter.pouring && !this.sim.emitter.active.dose) this.sim.emitter.stop();
    } else {
      const t = this.sim.tool;
      t.setTarget(t.x, t.y, false);
    }
  }

  handleKey(e) {
    if (e.target && /** @type {HTMLElement} */ (e.target).tagName === 'INPUT' && /** @type {any} */ (e.target).type !== 'range') return;
    if (document.querySelector('.overlay')) {
      if (e.key === 'Escape') { const x = /** @type {HTMLElement} */ (document.querySelector('.overlay .modal-head .btn')); if (x) x.click(); }
      return;
    }
    const k = e.key.toLowerCase();
    const view = VIEWS.find((v) => v.key === k);
    if (view && this.tabEls[view.id]) { this.showView(view.id); return; }
    const def = TOOL_DEFS.find((d) => d.key === k);
    if (def && (this.toolBtns[def.id] || def.id === 'pour')) { if (def.id === 'pour' && !this.selected) return; this.selectTool(def.id); return; }
    if (k === 'l') this.toggleLid();
    else if (k === 'f') this.cycleSpeed();
    else if (k === 'b' && !this.sandbox) this.startBottling();
    else if (k === 's' && !this.sandbox) panels.openShop(this);
    else if (k === 'r' && !this.sandbox) { this.showView('book'); this.views.book.open('recipes'); }
    else if (k === 'm') { this.ground = !this.ground; this.syncGround(); }
    else if (k === 'a') this.setAutoStir(!this.autoStir);
    else if (k === 'h' && (this.state.has('thermal') || this.sandbox)) this.toggleThermal();
    else if (k === 'escape') panels.openPause(this);
    else if (k === 'arrowup' || k === 'arrowright') { this.setFurnace(Math.min(1, this.sim.furnace.setting + 0.1)); }
    else if (k === 'arrowdown' || k === 'arrowleft') { this.setFurnace(Math.max(-1, this.sim.furnace.setting - 0.1)); }
    else if (k === '0') this.setFurnace(0);
  }

  // ------------------------------------------------------------------ actions
  selectTool(id, silent = false) {
    this.tool = id;
    for (const [k, b] of Object.entries(this.toolBtns || {})) b.classList.toggle('active', k === id);
    if (id === 'spoon' || id === 'pestle' || id === 'skimmer') this.sim.tool.type = /** @type {any} */ (id);
    if (id !== 'pour') {
      if (this.sim.emitter.pouring && !(this.sim.emitter.active && this.sim.emitter.active.dose)) this.sim.emitter.stop();
      for (const j of Object.values(this.jarEls || {})) j.el.classList.remove('selected');
      this.selected = null;
    }
    this.placeDose();
    this.syncGround();
    if (!silent) audio.play('select');
    if (this.tutorial) this.tutorial.notify('tool', id);
  }

  selectIngredient(id) {
    const m = this.state.lookup(id);
    if (this.selected !== id) this.ground = !!(m.form === 'solid' && (this.sandbox || this.state.has('mortar')));
    this.selectTool('pour', true);
    this.selected = id;
    for (const [k, j] of Object.entries(this.jarEls)) j.el.classList.toggle('selected', k === id);
    audio.play('select');
    this.placeDose();
    this.syncGround();
    if (this.tutorial) this.tutorial.notify('select', id);
  }

  clampPourX(x) {
    const m = this.sim.cauldron.mouth - 0.15;
    return Math.max(-m, Math.min(m, x));
  }

  canPour(id) {
    if (this.sandbox) return Infinity;
    return Math.floor(this.state.stock(id) / SIM.ML_PER_PARTICLE);
  }

  /** @param {number} x @param {number} [amount] particles @param {boolean} [ground] */
  startPour(x, amount, ground) {
    const id = this.selected;
    if (!id) return;
    const avail = this.canPour(id);
    if (avail <= 0) {
      audio.play('error');
      const m = this.state.lookup(id);
      toast(`No ${m.name} left`, 'Harvest more in the garden.', 'seedling');
      return;
    }
    if (this.sim.p.count >= this.sim.maxParticles - 2) {
      toast('The cauldron is full', '', 'cauldron');
      return;
    }
    this.pourX = this.clampPourX(x);
    const def = this.state.lookup(id);
    const n = Math.min(avail, amount ?? Infinity);
    const g = ground ?? (this.ground && def.form === 'solid' && (this.sandbox || this.state.has('mortar')));
    this.sim.emitter.start(def, { x: this.pourX, amount: n, ground: g });
    this.sim.emitter.active.dose = amount !== undefined;
    this.lastPoured[id] = this.sim.emitter.poured[id] || 0;
    this.pourGround = g;
    if (g) audio.play('crush');
    if (this.tutorial) this.tutorial.notify('pour', id);
  }

  pourDose(ml) {
    if (!this.selected) { toast('Pick an ingredient', '', 'jar'); return; }
    if (this.tool !== 'pour') this.selectTool('pour', true);
    this.startPour(this.pourX, Math.round(ml / SIM.ML_PER_PARTICLE));
  }

  /** Charge inventory for particles the emitter actually spawned. */
  accountPours() {
    const em = this.sim.emitter;
    for (const [id, total] of Object.entries(em.poured)) {
      const prev = this.lastPoured[id] || 0;
      const d = total - prev;
      if (d <= 0) continue;
      this.lastPoured[id] = total;
      const ml = d * SIM.ML_PER_PARTICLE;
      if (!this.sandbox) {
        this.state.consume(id, ml);
        if (this.state.stock(id) < SIM.ML_PER_PARTICLE && em.active && em.active.def.id === id) em.stop();
      }
      this.logPour(id, ml, !!(em.active ? em.active.form === 'powder' && em.active.def.form === 'solid' : this.pourGround));
    }
  }

  logPour(id, ml, ground = false) {
    const log = this.state.brewLog;
    if (this.sim.p.count <= Math.round(ml / SIM.ML_PER_PARTICLE) + 1 && !log.some((e) => e.type === 'pour')) this.state.newBatch();
    const last = log[log.length - 1];
    if (last && last.type === 'pour' && last.id === id && !!last.ground === ground) last.ml += ml;
    else log.push({ type: 'pour', id, ml, t: Math.round(this.sim.time), ground: ground || undefined });
    // something was added: earlier tests no longer describe this brew
    this.state.touchBatch();
  }

  setFurnace(v) {
    this.sim.furnace.setting = v;
    this.furnaceInput.value = String(Math.round(v * 100));
    if (this.tutorial) this.tutorial.notify('furnace', v);
  }

  toggleLid() {
    const c = this.sim.cauldron;
    c.lidClosed = !c.lidClosed;
    audio.play('lid');
    this.state.brewLog.push({ type: 'lid', closed: c.lidClosed, t: Math.round(this.sim.time) });
    this.refreshHud();
  }

  cycleSpeed() {
    this.speed = this.speed === 1 ? 2 : this.speed === 2 ? 4 : 1;
    this.syncActions();
  }

  setAutoStir(on) {
    if (this.autoStir === on) return;
    this.autoStir = on;
    const t = this.sim.tool;
    const upgraded = this.state.has('stirrer');
    t.auto = on;
    if (on) {
      t.type = 'spoon';
      const c = this.sim.cauldron;
      t.autoCenterX = 0;
      t.autoCenterY = c.depth - Math.min(0.75, c.depth * 0.3);
      t.autoRadius = upgraded ? c.belly * 0.55 : c.belly * 0.32;
      t.autoPhase = 0;
    } else {
      t.setTarget(t.x, t.y, false);
    }
    this.syncActions();
  }

  async emptyCauldron() {
    if (this.sim.p.count === 0) return;
    const ok = await confirmDialog('Empty the cauldron?', 'Everything in it is poured away.', 'Empty it', 'danger');
    if (!ok) return;
    this.sim.clear();
    this.state.brewLog = [];
    this.state.newBatch();
    this.lastPoured = {};
    audio.play('splash');
    this.views.testing.refresh();
    this.save();
  }

  // ------------------------------------------------------------------ customers
  bringCustomer(withSound = true) {
    const st = this.state;
    if (this.sandbox) return;
    const c = st.nextCustomer();
    if (c && withSound) audio.play(c.type === 'complaint' ? 'fail' : 'bell');
    this._seenCustomer = false;
    this.refreshCustomer();
    if (this.views) this.views.counter.refresh();
    this.updateBadges();
  }

  /** The request strip above the cauldron: who, and what magic they want. */
  refreshCustomer() {
    if (this.sandbox) return;
    const st = this.state;
    const el = clear(this.strip);
    const com = st.current;
    el.classList.toggle('empty', !com || com.type !== 'order');
    if (!com) {
      el.append(h('div', { class: 'strip-empty' }, icon(st.dayOver ? 'sun' : 'door'), h('span', { class: 'small', text: st.dayOver ? 'Day over' : 'No customer' })));
      return;
    }
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait' }));
    drawPortrait(portrait, com.customer.portrait, com.type === 'complaint' ? 'unhappy' : 'neutral');
    if (com.type === 'complaint') {
      el.append(portrait, h('div', { class: 'strip-main' }, h('div', { class: 'req-chips' }, h('span', { class: 'req-chip bad' }, icon('refund', 'sm'), icon(PROP_BY_KEY[com.complaint.key].icon, 'sm'), icon(com.complaint.how === 'weak' ? 'down' : 'warn', 'sm')))));
      return;
    }
    el.append(portrait, h('div', { class: 'strip-main' }, panels.reqChips(com.requirements)));
  }

  async decline() {
    const ok = await confirmDialog('Send the customer away?', '', 'Send away', 'danger');
    if (!ok) return;
    this.state.declineCustomer();
    this.refreshCustomer();
    this.views.counter.refresh();
    setTimeout(() => this.bringCustomer(true), 700);
  }

  endDay() {
    const summary = this.state.endDay();
    this.save();
    panels.showDaySummary(this, summary, () => {
      const relief = this.state.claimRelief();
      if (relief) toast('Guild stipend', `+${relief} coins`, 'coin', 4000);
      this.buildShelf();
      this.bringCustomer(true);
      this.refreshHud(true);
      this.views.garden.refresh();
      this.views.testing.refresh();
    });
  }

  // ------------------------------------------------------------------ bottling → vial
  startBottling() {
    if (this.sandbox || this.bottling) return;
    const st = this.state;
    if (st.vial) { toast('A vial is waiting', 'Sell or empty it first.', 'bottle'); this.showView('counter'); return; }
    const com = st.current && st.current.type === 'order' ? st.current : null;
    const n = com ? com.bottleN : 20;
    const sel = tapSelection(this.sim, n);
    if (sel.length < 1) { toast('Nothing to bottle', '', 'flask'); audio.play('error'); return; }
    const m = measureParticles(this.sim, sel);
    this.sim.emitter.stop();
    this.setAutoStir(false);
    this.bottling = { total: sel.length, removed: 0, progress: 0, color: m.color, measurement: m, n, t: 0, batch: { ...st.batch } };
    audio.play('glass');
    if (this.tutorial) this.tutorial.notify('bottle');
  }

  stepBottling(dt) {
    const b = this.bottling;
    if (!b) return;
    b.t += dt;
    const target = Math.min(b.total, Math.ceil(b.total * Math.min(1, b.t / 1.4)));
    const k = target - b.removed;
    if (k > 0) {
      const sel = tapSelection(this.sim, k).sort((a, c) => c - a);
      for (const i of sel) this.sim.removeParticle(i);
      b.removed += k;
    }
    b.progress = b.removed / Math.max(1, b.n);
    if (b.t > 1.8) this.finishBottling();
  }

  finishBottling() {
    const b = this.bottling;
    this.bottling = null;
    const st = this.state;
    // the label is the Potion ID written for this batch (if any)
    const id = st.idCard && st.idCard.batchId === b.batch.id ? st.idCard : null;
    st.vial = {
      id: 'v' + Date.now().toString(36),
      ml: b.measurement.ml,
      m: b.measurement,
      batchId: b.batch.id,
      rev: b.batch.rev,
      label: id ? { values: { ...id.values }, stale: (id.rev ?? 0) !== b.batch.rev } : null,
      certified: null,
      parts: this.batchParts(),
      day: st.day,
      recipe: this.recipeDraft(b.measurement),
    };
    if (this.sim.p.count === 0) { st.brewLog = []; st.newBatch(); this.lastPoured = {}; }
    audio.play('glass');
    this.save();
    this.showView('counter');
    this.updateBadges();
  }

  discardVial() {
    this.state.vial = null;
    audio.play('splash');
    this.save();
    this.views.counter.refresh();
    this.updateBadges();
  }

  /** Return the vial's potion to the cauldron (as liquid of its composition and magic state). */
  pourBackVial() {
    const st = this.state;
    const v = st.vial;
    if (!v) return;
    const sim = this.sim;
    const n = Math.floor(v.ml / SIM.ML_PER_PARTICLE);
    const ids = Object.keys(v.m.composition);
    const total = Object.values(v.m.composition).reduce((a, b) => a + b, 0) || 1;
    if (sim.p.count + n > sim.maxParticles) { toast('No room', 'The cauldron is too full.', 'cauldron'); return; }
    let made = 0;
    for (let k = 0; k < n; k++) {
      const x = (sim.rand() - 0.5) * sim.cauldron.mouth;
      const i = sim.addParticle(st.lookup(ids[0]), x, 0.15 + sim.rand() * 0.25, PHASE.LIQUID, v.m.temperature);
      if (i < 0) break;
      sim.p.comp.fill(0, i * MAX_SPECIES, (i + 1) * MAX_SPECIES);
      for (const id of ids) {
        const def = st.lookup(id);
        if (!def) continue;
        const s = sim.slotFor(def);
        if (s >= 0) sim.p.comp[i * MAX_SPECIES + s] += v.m.composition[id] / total;
      }
      sim.p.vig[i] = v.m.vig ?? 1;
      sim.p.ss[i] = v.m.ss ?? 0;
      sim.p.stp[i] = v.m.steep ?? -300;
      sim.p.dirty[i] = 1;
      made++;
    }
    // it is the same batch only if the cauldron still holds that batch
    if (st.batch.id !== v.batchId) st.newBatch();
    st.touchBatch();
    st.vial = null;
    audio.play('splash');
    toast('Poured back', `${made * SIM.ML_PER_PARTICLE} ml`, 'pour');
    this.save();
    this.views.counter.refresh();
    this.showView('brew');
  }

  /** Build a recipe description from the brew log + the measured result. */
  recipeDraft(m) {
    const st = this.state;
    const agg = [];
    for (const e of st.brewLog) {
      if (e.type !== 'pour') continue;
      const last = agg[agg.length - 1];
      if (last && last.id === e.id && !!last.ground === !!e.ground) last.ml += e.ml;
      else agg.push({ id: e.id, ml: e.ml, ground: e.ground || undefined });
    }
    const stats = st.brewLog.find((e) => e.type === 'stats') || {};
    const com = st.current && st.current.type === 'order' ? st.current : null;
    return {
      name: com ? com.potionName : 'Experiment',
      ingredients: agg,
      maxTemp: Math.round(stats.maxT ?? m.temperature),
      minTemp: Math.round(stats.minT ?? m.temperature),
      serveTemp: Math.round(m.temperature),
      stirSeconds: Math.round(stats.stir || 0),
      crushed: !!stats.crushed,
      color: m.color,
      day: st.day,
    };
  }

  /** Track temperatures / stirring for the recipe log. */
  trackBrew(dt) {
    const log = this.state.brewLog;
    let s = log.find((e) => e.type === 'stats');
    if (!s) { s = { type: 'stats', maxT: -1e9, minT: 1e9, stir: 0, crushed: false }; log.push(s); }
    const p = this.sim.p;
    if (p.count === 0) return;
    let T = 0, n = 0;
    for (let i = 0; i < p.count; i += 3) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
    if (n) {
      T /= n;
      s.maxT = Math.max(s.maxT, T);
      s.minT = Math.min(s.minT, T);
    }
    const t = this.sim.tool;
    if (t.active && t.type === 'spoon' && t.speed > 0.2) s.stir += dt;
    if (t.active && t.type === 'pestle') s.crushed = true;
  }

  announce(e) {
    if (e.type === 'achievement') {
      toast(e.name, `+${e.reward}`, 'trophy', 3600);
      audio.play('fanfare');
    } else if (e.type === 'rank') {
      toast(`Rank: ${e.name}`, 'New beds, customers and equipment.', 'charter', 5000);
      audio.play('fanfare');
      this.buildShelf();
      this.views.garden.refresh();
    }
  }

  // ------------------------------------------------------------------ testing support
  /** Millilitres the tap could deliver now. */
  tapAvailable() {
    const p = this.sim.p;
    let n = 0;
    for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS && p.phase[i] !== PHASE.SOLID) n++;
    return n * SIM.ML_PER_PARTICLE;
  }

  /** What has been poured into this batch. */
  batchParts() {
    const out = [];
    for (const e of this.state.brewLog) if (e.type === 'pour') {
      const last = out.find((x) => x.id === e.id);
      if (last) last.ml += e.ml; else out.push({ id: e.id, ml: e.ml });
    }
    return out;
  }

  /**
   * Draw a dose from the cauldron tap: the particles leave the cauldron.
   * @param {number} ml
   */
  drawDose(ml) {
    const n = Math.max(1, Math.round(ml / SIM.ML_PER_PARTICLE));
    const sel = tapSelection(this.sim, n);
    if (!sel.length) return null;
    const m = measureParticles(this.sim, sel);
    for (const i of sel.slice().sort((a, b) => b - a)) this.sim.removeParticle(i);
    if (this.sim.p.count === 0) { this.state.brewLog = []; this.lastPoured = {}; }
    audio.play('glass');
    return { dose: m, ml: sel.length * SIM.ML_PER_PARTICLE };
  }

  /** Split a dose off the sealed vial (its contents are uniform). @param {number} ml */
  vialDose(ml) {
    const v = this.state.vial;
    if (!v || v.ml < 1) return null;
    const take = Math.min(ml, v.ml);
    v.ml -= take;
    const r = { dose: v.m, ml: take, batchId: v.batchId, rev: v.rev };
    if (v.ml < 1) {
      this.state.vial = null;
      toast('The vial is empty', '', 'bottle');
    }
    return r;
  }

  // ------------------------------------------------------------------ HUD
  toggleBrewInfo() {
    this.brewPanel.classList.toggle('hidden');
    this.updateBrewPanel(true);
  }

  /** What has gone into the cauldron: swatches and millilitres, nothing more. */
  updateBrewPanel(force = false) {
    const el = this.brewPanel;
    if (!el || (el.classList.contains('hidden') && !force)) return;
    const st = this.state;
    clear(el);
    const parts = this.batchParts();
    el.append(h('div', { class: 'row' }, icon('cauldron'), h('b', { text: `${this.sim.p.count * SIM.ML_PER_PARTICLE} ml` }), h('span', { class: 'spacer' }), btn('', () => this.toggleBrewInfo(), { icon: 'close', cls: 'icon', title: 'Close' })));
    if (!parts.length) { el.append(h('div', { class: 'small muted', text: '—' })); return; }
    for (const p of parts) {
      const m = st.lookup(p.id);
      if (!m) continue;
      el.append(h('div', { class: 'row small poured' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.look || m.color) } }), h('span', { class: 'pname', text: m.name }), h('span', { class: 'spacer' }), h('b', { text: `${Math.round(p.ml)}` })));
    }
  }

  refreshHud(full = false) {
    const st = this.state;
    if (!this.sandbox) {
      this.coinEl.textContent = coins(st.coins);
      this.coinEl.classList.toggle('neg', st.coins < 0);
      const r = st.rank, next = RANKS[r + 1];
      this.rankName.textContent = RANKS[r].name;
      const prog = next ? (st.reputation - RANKS[r].rep) / (next.rep - RANKS[r].rep) : 1;
      this.rankBar.style.width = Math.round(Math.min(1, prog) * 100) + '%';
      this.rankBar.parentElement.title = `${RANKS[r].name} · ${st.reputation}${next ? ' / ' + next.rep : ''}`;
      const ev = st.marketEvent;
      const dayKey = `${st.day}|${st.customerIndex}|${st.current ? st.current.type : ''}|${st.customersPerDay}|${ev.key}`;
      if (dayKey !== this._dayKey) {
        this._dayKey = dayKey;
        const seen = Math.min(st.customerIndex + (st.current && st.current.type === 'order' ? 1 : 0), st.customersPerDay);
        this.dayEl.title = `Day ${st.day} · customer ${seen} of ${st.customersPerDay}`;
        clear(this.dayEl).append(...[icon('sun', 'sm'), h('span', { text: `${st.day}` }), icon('stall', 'sm'), h('span', { class: 'muted', text: `${seen}/${st.customersPerDay}` }), ev.key !== 'none' ? h('span', { class: 'event', title: ev.name }, icon(ev.icon, 'sm')) : null].filter(Boolean));
      }
    }
    this.syncActions();
    const f = this.sim.furnace.setting;
    const c = this.sim.cauldron;
    this.furnaceLabel.textContent = `${Math.round(c.bottomTemperature())}°`;
    this.furnaceLabel.title = f > 0.02 ? `Fire ${Math.round(f * 100)}%` : f < -0.02 ? `Frost ${Math.round(-f * 100)}%` : 'Off';
    const want = iconUrl(f < -0.02 ? 'snow' : 'flame');
    if (this.furnaceIcon.src !== want) this.furnaceIcon.src = want;
    if (full) this.updateShelf();
    this.updateChips();
  }

  updateShelf() {
    if (!this.jarEls) return;
    for (const [id, j] of Object.entries(this.jarEls)) {
      const s = this.sandbox ? Infinity : this.state.stock(id);
      j.stock.textContent = isFinite(s) ? (s >= 1000 ? (s / 1000).toFixed(1) + 'L' : String(Math.round(s))) : '∞';
      j.el.classList.toggle('empty', s < SIM.ML_PER_PARTICLE);
    }
  }

  updateChips() {
    const c = clear(this.chips);
    const sim = this.sim;
    const p = sim.p;
    let T = 0, n = 0;
    for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
    c.append(h('div', { class: 'chip', title: 'In the cauldron (ml)' }, icon('flask', 'sm'), ` ${p.count * SIM.ML_PER_PARTICLE}`));
    if (n) c.append(h('div', { class: 'chip', title: 'Mean temperature' }, icon('thermo', 'sm'), ` ${Math.round(T / n)}°`));
    if (this.autoBrewer) c.append(h('div', { class: 'chip', title: this.autoBrewer.status }, icon('homunculus', 'sm'), ' …'));
    if (this.app.settings.showFps) c.append(h('div', { class: 'chip', text: `${this.fpsAcc.fps} fps · ${sim.stats.stepMs.toFixed(1)} ms · ${p.count}` }));
  }

  // ------------------------------------------------------------------ frame loop
  frame(t) {
    const tw0 = performance.now();
    const pf = this.perf;
    pf.intervals[pf.n % 600] = t - this.lastT;
    let dt = (t - this.lastT) / 1000;
    // battery saver: draw at 30 fps (physics still integrates real time)
    const battery = this.effectiveQuality() === 'low' && this.app.settings.quality === 'low';
    if (battery && dt < 1 / 34) return;
    this.lastT = t;
    if (dt > 0.1) dt = 0.1;
    this.time += dt;
    const fa = this.fpsAcc;
    fa.t += dt; fa.n++;
    if (fa.t >= 1) { fa.fps = Math.round(fa.n / fa.t); fa.t = 0; fa.n = 0; }
    const modalOpen = !!document.querySelector('.overlay');
    const sim = this.sim;
    const brewing = this.view === 'brew';
    // physics (keeps running in every room so brews keep evolving)
    if (this.autoBrewer) {
      const n = Math.min(12, Math.round((dt * this.speed) / SIM.DT));
      for (let k = 0; k < n; k++) {
        this.autoBrewer.tick();
        sim.step();
        if (this.autoBrewer.done) { toast('Homunculus done', '', 'homunculus'); this.autoBrewer = null; this.setFurnace(0); break; }
      }
      this.accountPours();
    } else {
      // physics gets what is left of a ~30 fps frame after rendering (8–22 ms):
      // fast devices run in real time at 60 fps, slow ones keep a playable
      // frame rate and let the brew run in slow motion rather than stall
      const cap = this.speed > 1 ? 10 : 6;
      const budget = Math.max(8, Math.min(22, 30 - (brewing ? this.perf.renderMs : 2)));
      const maxSteps = Math.max(1, Math.min(cap, Math.floor(budget / Math.max(0.3, sim.stats.stepMs || 1))));
      sim.advance(dt, this.speed, maxSteps);
      this.accountPours();
    }
    const tw1 = performance.now();
    this.stepBottling(dt);
    this.trackBrew(dt);
    if (sim.events.length) {
      const evs = sim.events.splice(0);
      for (const e of evs) this.handleSimEvent(e);
    }
    // periodic UI
    this.hudTimer += dt;
    this.tapTimer += dt;
    this.saveTimer += dt;
    this.mixTimer += dt;
    if (this.hudTimer > 0.25) { this.hudTimer = 0; this.refreshHud(); this.updateShelf(); this.updateBrewPanel(); this.checkAway(); this.recoverSkimmed(); }
    if (this.tapTimer > 0.5 && !this.bottling) { this.tapTimer = 0; this.tapMl = this.tapAvailable(); if (this.bottleFab) this.bottleFab.disabled = this.tapMl < SIM.ML_PER_PARTICLE; }
    if (this.mixTimer > 2) { this.mixTimer = 0; this.detectMixing(); }
    if (this.saveTimer > 15) { this.saveTimer = 0; this.save(); }
    if (this.tutorial) this.tutorial.update();
    // audio levels
    const tool = sim.tool;
    const stirTarget = tool.active && tool.type !== 'skimmer' ? Math.min(1, tool.speed / 2.5) : 0;
    this.stirLevel += (stirTarget - this.stirLevel) * Math.min(1, dt * 10);
    if (sim.steps % 30 === 0) { let boiling = 0; for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === PHASE.GAS && sim.nCond[i] >= 3) boiling++; this.lastBoil = boiling; }
    const audible = brewing ? 1 : 0.35;
    audio.update({ fire: Math.max(0, sim.furnace.setting) * audible, cold: Math.max(0, -sim.furnace.setting) * audible, stir: this.stirLevel, pour: sim.emitter.pouring ? 1 : 0, boil: Math.min(1, this.lastBoil / 30) * audible }, dt);
    // render only the room that is visible
    const tw2 = performance.now();
    if (brewing) {
      const em = sim.emitter;
      this.renderer.render({
        sim,
        time: this.time,
        dt: modalOpen ? dt * 0.5 : dt,
        pour: { active: em.pouring, x: em.active ? em.active.x : this.pourX, def: em.active ? em.active.def : null },
        tool: { type: tool.type, x: tool.x, y: tool.y, active: tool.active },
        toolHover: this.hover && (this.tool === 'spoon' || this.tool === 'pestle' || this.tool === 'skimmer'),
        bottling: this.bottling ? { progress: this.bottling.progress, color: this.bottling.color } : null,
        showBottle: !this.sandbox && !this.state.vial,
        probe: null,
        thermal: this.thermal,
        alembic: false,
        receiver: null,
        stirrer: this.state.has('stirrer') && this.autoStir,
      });
    } else if (this.views[this.view] && this.views[this.view].frame) {
      this.views[this.view].frame(dt);
    }
    const tw3 = performance.now();
    pf.work[pf.n % 600] = tw3 - tw0;
    if (brewing) this.adaptQuality(dt, tw3 - tw0);
    pf.n++;
    pf.physMs = pf.physMs * 0.95 + (tw1 - tw0) * 0.05;
    if (brewing) pf.renderMs = pf.renderMs * 0.95 + (tw3 - tw2) * 0.05;
  }

  /** Warn when the brew boils, burns or fades while the player is in another room. */
  checkAway() {
    if (this.view === 'brew') return;
    const sim = this.sim;
    if (this.time - this.awayWarned < 20) return;
    let gas = 0, burn = 0;
    for (let i = 0; i < sim.p.count; i++) { if (sim.p.phase[i] === PHASE.GAS) gas++; if (sim.p.burn[i] > 0.3) burn++; }
    const fading = sim.stats.faded > 3;
    if (burn > 2 || fading || (gas > 6 && sim.furnace.setting > 0.05)) {
      this.awayWarned = this.time;
      toast(burn > 2 ? 'Something is burning!' : fading ? 'The magic is fading!' : 'The cauldron is boiling', 'The fire is still lit.', 'flame', 4000);
    }
  }

  /** Frame-time statistics over the last (up to) 600 frames. */
  perfReport() {
    const pf = this.perf;
    const m = Math.min(pf.n, 600);
    const iv = Array.from(pf.intervals.slice(0, m)).sort((a, b) => a - b);
    const wk = Array.from(pf.work.slice(0, m)).sort((a, b) => a - b);
    const q = (a, f) => (a.length ? a[Math.min(a.length - 1, Math.floor(a.length * f))] : 0);
    const mean = iv.reduce((a, b) => a + b, 0) / Math.max(1, m);
    return {
      frames: m,
      fps: mean > 0 ? 1000 / mean : 0,
      intervalP50: q(iv, 0.5), intervalP95: q(iv, 0.95), intervalP99: q(iv, 0.99),
      workP50: q(wk, 0.5), workP95: q(wk, 0.95),
      physMs: pf.physMs, renderMs: pf.renderMs, stepMs: this.sim.stats.stepMs,
      particles: this.sim.p.count,
    };
  }

  handleSimEvent(e) {
    if (this.view === 'brew') this.renderer.onEvent(e);
    switch (e.type) {
      case 'crush': if (Math.random() < 0.5) audio.play('crush'); break;
      case 'ignite': audio.play('ignite'); break;
      case 'transmute': if (Math.random() < 0.3) audio.play('reaction'); break;
      case 'phase': if (e.to === 'solid' && Math.random() < 0.15) audio.play('freeze'); break;
      case 'full': toast('The cauldron is full', '', 'cauldron'); break;
    }
    if (this.sandbox) return;
    const r = processEvent(this.state, e);
    for (const entry of r.entries) {
      toast(entry.title, '', entry.kind === 'magic' ? 'eye' : 'scroll', 3200);
      audio.play('discover');
    }
    for (const a of r.achievements) this.announce(a);
  }

  /**
   * Notice liquids that keep apart while cold sitting in layers, and the
   * moment heat blends them (journal).
   */
  detectMixing() {
    if (this.sandbox) return;
    const sim = this.sim, p = sim.p, sp = sim.species;
    const liquids = [];
    for (let s = 0; s < sp.count; s++) if (sp.defs[s] && sp.defs[s].form === 'liquid' && sp.magW[s] >= 0) liquids.push(s);
    for (let a = 0; a < liquids.length; a++) for (let b = a + 1; b < liquids.length; b++) {
      const A = liquids[a], B = liquids[b];
      if (compatFactorT(sp.compatA[A], sp.compatB[A], sp.compatA[B], sp.compatB[B], 20) > 0.2) continue;
      let both = 0, onlyA = 0, onlyB = 0;
      for (let i = 0; i < p.count; i++) {
        const fa = p.comp[i * MAX_SPECIES + A], fb = p.comp[i * MAX_SPECIES + B];
        if (fa > 0.25 && fb > 0.25) both++;
        else if (fa > 0.8) onlyA++;
        else if (fb > 0.8) onlyB++;
      }
      const ids = [sp.defs[A].id, sp.defs[B].id].sort();
      if (both >= 10) this.handleSimEvent({ type: 'heatmix', a: ids[0], b: ids[1] });
      else if (onlyA >= 10 && onlyB >= 10) this.handleSimEvent({ type: 'layers', a: ids[0], b: ids[1] });
    }
  }

  /** Run a saved recipe with the homunculus. */
  startHomunculus(recipe) {
    const plan = {
      ingredients: recipe.ingredients.map((i) => ({ id: i.id, n: Math.round(i.ml / SIM.ML_PER_PARTICLE), ground: i.ground })),
      heatTo: recipe.maxTemp, coolTo: recipe.minTemp, serveTemp: recipe.serveTemp, knead: recipe.stirSeconds > 12, crush: recipe.crushed, hold: 12,
    };
    this.autoBrewer = new AutoBrewer(this.sim, plan, this.state.lookup, {
      onPour: (id, n) => this.sandbox || this.state.stock(id) >= n * SIM.ML_PER_PARTICLE,
      onPoured: (id, n, ground) => { this.pourGround = ground; },
    });
    toast('The homunculus gets to work', recipe.name, 'homunculus');
  }

  /** Skimmed matter that is nearly pure goes back on the shelf. */
  recoverSkimmed() {
    const rec = this.sim.tool.recovered;
    const st = this.state;
    let any = 0;
    for (const [id, n] of Object.entries(rec)) {
      if (n <= 0) continue;
      rec[id] = 0;
      if (this.sandbox || !st.world.ingredients.includes(id) || !isFinite(st.stock(id))) continue;
      const ml = n * SIM.ML_PER_PARTICLE;
      const room = Math.max(0, st.cap.storage - st.stock(id));
      const back = Math.min(ml, room);
      if (back > 0) { st.inventory[id] = st.stock(id) + back; any += back; }
    }
    if (any) {
      this.updateShelf();
      if (this.time - (this._recToast || -99) > 4) { this._recToast = this.time; toast('Recovered', `+${any} ml`, 'ladle', 2200); }
    }
  }

  save() {
    if (this.saveBlocked) return;
    if (this.sandbox) {
      saveJSON(KEYS.sandbox, { seed: this.state.seed, cauldron: snapshotSim(this.sim, this.cap.size), lab: this.state.lab });
      return;
    }
    this.state.cauldron = snapshotSim(this.sim, this.cap.size);
    saveGame(this.state);
  }
}

/**
 * Short jar labels: the last word of each name, or the first word where two
 * ingredients would otherwise share a label.
 * @param {string[]} names
 */
function shelfLabels(names) {
  const last = names.map((nm) => nm.split(' ').slice(-1)[0]);
  return names.map((nm, i) => {
    if (last.filter((l) => l === last[i]).length < 2) return last[i];
    const words = nm.split(' ');
    return words.length > 1 ? words[0] : nm;
  });
}
