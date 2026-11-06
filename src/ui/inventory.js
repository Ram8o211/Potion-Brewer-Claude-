// The inventory: the whole storeroom as a grid of tiles, in a drawer laid
// over the cauldron so the quick shelf stays in reach. Sections by effect
// (each ingredient under its strongest one) are chosen from a row of tabs;
// within a section the rarest and strongest come first. Each tile carries a
// small rarity label and, under its icon, a stripe of its effects' colours
// (each as wide as its share of the ingredient's magic).
//
//   tap        put it on the quick shelf, or take it off
//   drag       onto the shelf, between the jars it should go between
//              (mouse at once; a finger holds still a moment first, so a
//              swipe still scrolls the grid)
//   long-press inspect (right-click with a mouse)
//
// A jar dragged from the shelf into the drawer goes back to the storeroom
// (lab.js bindJar).

import { h, btn, clear, keepScroll } from './dom.js';
import { icon } from './icons.js';
import { jarCanvas, openIngredient } from './panels.js';
import { inventoryGroups } from '../game/bench.js';
import { EFFECTS, EFFECT_BY_KEY } from '../alchemy/effects.js';
import { RARITY } from '../materials/rarity.js';
import { audio } from '../audio/audio.js';

/** A rarity's label on a tile. */
const RAR_SHORT = { common: 'COM', uncommon: 'UNC', rare: 'RARE', unique: 'UNIQ', legendary: 'LEG' };

/** A finger holds this long before a tile lifts; a press this long without moving inspects it. */
const LIFT_MS = 220, INSPECT_MS = 600;

/** @param {number} s */
function amount(s) {
  return !isFinite(s) ? '∞' : s >= 1000 ? (s / 1000).toFixed(1) + 'L' : String(Math.round(s));
}

/** @param {number[]} c sRGB 0..1 */
const rgb = (c) => `rgb(${c.map((x) => Math.round(x * 255)).join(',')})`;

/**
 * The stripe of an ingredient's effects: one segment per effect, as wide as its share.
 * @param {any} m
 */
function effectStripe(m) {
  /** @type {[import('../alchemy/effects.js').EffectDef, number][]} */
  const fx = m.remains ? [] : EFFECTS.map((e) => /** @type {[import('../alchemy/effects.js').EffectDef, number]} */ ([e, Math.abs(Number((m.effects || {})[e.key]) || 0)])).filter(([, v]) => v >= 1).sort((a, b) => b[1] - a[1]);
  const sum = fx.reduce((n, [, v]) => n + v, 0);
  const el = h('span', { class: 'inv-stripe' + (fx.length ? '' : m.remains ? ' unknown' : ' none') });
  for (const [e, v] of fx) el.appendChild(h('i', { style: { flexGrow: String(v / sum), background: rgb(e.color) } }));
  return el;
}

/** The words for a tile's tooltip and its screen-reader label. @param {any} m @param {number} s */
function describeTile(m, s) {
  const r = m.wild && m.wild.rarity ? RARITY[m.wild.rarity].label + (m.wild.arcane ? ', Arcane' : '') : '';
  const fx = m.remains ? 'effects unknown' : Object.entries(m.effects || {}).filter(([, v]) => Math.abs(Number(v)) >= 1).sort((a, b) => Math.abs(Number(b[1])) - Math.abs(Number(a[1])))
    .map(([k, v]) => `${EFFECT_BY_KEY[k].label} ${Math.round(Number(v))}`).join(', ') || 'no effect';
  return `${m.name}${r ? ` (${r})` : ''} — ${fx} — ${isFinite(s) ? Math.round(s) + ' ml' : 'bottomless'}`;
}

export class InventoryDrawer {
  /** @param {any} lab */
  constructor(lab) {
    this.lab = lab;
    this.section = 'all';
    this.showEmpty = false;
    this.open = false;
    this.tabs = h('div', { class: 'inv-tabs', role: 'tablist', 'aria-label': 'Sections by effect' });
    this.count = h('span', { class: 'inv-count' });
    this.tools = h('div', { class: 'inv-tools' });
    this.grid = h('div', { class: 'inv-grid' });
    this.closeBtn = btn('', () => this.toggle(false), { icon: 'close', cls: 'icon', title: 'Close the inventory (I)', act: 'inv-close' });
    this.el = h('section', { class: 'inv-drawer frame hidden', 'aria-label': 'Inventory' },
      h('div', { class: 'inv-top' }, h('h2', {}, icon('satchel', 'sm'), ' Inventory'), this.count, this.tools, this.closeBtn),
      this.tabs, this.grid);
    /** the tile being dragged @type {{id:string, ghost:HTMLElement, pid:number}|null} */
    this.drag = null;
    // a lifted tile stops the grid from scrolling under the finger
    this.grid.addEventListener('touchmove', (e) => { if (this.drag || this._lifted) e.preventDefault(); }, { passive: false });
  }

  /** Open or close it (only in the Brew room). @param {boolean} [on] */
  toggle(on = !this.open) {
    this.open = on;
    this.el.classList.toggle('hidden', !on);
    this.lab.el.classList.toggle('inv-open', on);
    if (on) this.render();
    else this.endDrag();
  }

  stock(id) {
    return this.lab.sandbox ? Infinity : this.lab.state.stock(id);
  }

  /** Redraw what it shows (after the shelf or the stores changed). */
  refresh() {
    if (this.open) this.render();
  }

  render() {
    const lab = this.lab, st = lab.state;
    const pool = lab.shelfPool();
    const held = pool.filter((id) => this.stock(id) > 0);
    const shown = this.showEmpty ? pool : held;
    const onShelf = st.bench.ids.filter((id) => pool.includes(id));
    const emptyOn = onShelf.filter((id) => !(this.stock(id) > 0));
    const groups = inventoryGroups(shown, st.lookup, 'effect');
    if (this.section !== 'all' && !groups.some((g) => g.key === this.section)) this.section = 'all';
    this.count.textContent = `${held.length} held · ${onShelf.length} on the shelf`;
    clear(this.tools).append(...[
      btn(this.showEmpty ? 'Hide empty' : 'Empty too', () => { this.showEmpty = !this.showEmpty; this.render(); }, { cls: this.showEmpty ? 'active' : '', title: 'Also show what you have run out of (and the shop’s reagents)', act: 'inv-empty' }),
      emptyOn.length ? btn('', () => { for (const id of emptyOn) lab.setOnShelf(id, false); this.render(); }, { icon: 'trash', cls: 'icon', title: 'Take the jars you have run out of off the shelf', act: 'inv-tidy' }) : null,
      onShelf.length ? btn('', () => { for (const id of onShelf) lab.setOnShelf(id, false); this.render(); }, { icon: 'minus', cls: 'icon', title: 'Clear the shelf: every jar back in the storeroom', act: 'inv-clear' }) : null,
    ].filter(Boolean));
    keepScroll(this.tabs, () => {
      clear(this.tabs);
      const tab = (key, label, ic, n) => {
        const b = h('button', { class: 'inv-tab' + (this.section === key ? ' active' : ''), role: 'tab', 'aria-selected': String(this.section === key), 'data-act': 'inv-sec-' + key, title: label },
          ic ? icon(ic, 'sm') : null, h('span', { class: 'inv-tab-lbl', text: key === 'all' ? 'All' : label.split(' ')[0] }), h('span', { class: 'inv-tab-n', text: String(n) }));
        const fx = EFFECT_BY_KEY[key];
        if (fx) b.style.setProperty('--fx', rgb(fx.color));
        b.addEventListener('click', () => { this.section = key; audio.play('select'); this.render(); this.grid.scrollTop = 0; });
        this.tabs.appendChild(b);
      };
      tab('all', 'All', 'satchel', shown.length);
      for (const g of groups) tab(g.key, g.label, g.icon, g.ids.length);
    });
    keepScroll(this.grid, () => {
      clear(this.grid);
      if (!shown.length) { this.grid.appendChild(h('div', { class: 'inv-empty-note small', text: 'The storeroom is empty. Gather in the Wilds, harvest the Garden or buy from the Shop.' })); return; }
      for (const g of groups) {
        if (this.section !== 'all' && g.key !== this.section) continue;
        if (this.section === 'all') this.grid.appendChild(h('div', { class: 'inv-head', 'data-group': g.key }, icon(g.icon, 'sm'), ` ${g.label}`));
        for (const id of g.ids) this.grid.appendChild(this.tile(id, g.key));
      }
    });
  }

  /** @param {string} id @param {string} group */
  tile(id, group) {
    const m = this.lab.state.lookup(id);
    const s = this.stock(id);
    const on = this.lab.onShelf(id);
    const w = m.wild && m.wild.rarity ? m.wild : null;
    const el = h('button', {
      class: 'inv-tile' + (on ? ' on' : '') + (s > 0 ? '' : ' empty') + (w && w.arcane ? ' arcane' : ''),
      'data-id': id, 'data-group': group, 'data-act': 'shelf-' + id,
      title: describeTile(m, s) + (on ? ' · on the shelf (tap to take it off)' : ' · tap or drag onto the shelf'),
      'aria-label': describeTile(m, s), 'aria-pressed': String(on),
    },
    w ? h('span', { class: `inv-rar r-${w.rarity}`, text: RAR_SHORT[w.rarity] || '' }) : null,
    h('span', { class: 'inv-stock', text: amount(s) }),
    jarCanvas(m, 18, 24),
    h('span', { class: 'inv-name', text: m.remains ? m.remains.short : m.name }),
    effectStripe(m),
    on ? h('span', { class: 'inv-on' }, icon('check', 'sm')) : null);
    this.bindTile(el, id);
    return el;
  }

  /** @param {HTMLElement} el @param {string} id */
  bindTile(el, id) {
    let pid = -1, sx = 0, sy = 0, timer = 0, inspect = 0, mode = /** @type {'idle'|'press'|'lifted'|'drag'|'done'|'tap'} */ ('idle'), mouse = false;
    const clearTimers = () => { clearTimeout(timer); clearTimeout(inspect); timer = 0; inspect = 0; };
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; mode = 'press'; mouse = e.pointerType === 'mouse';
      if (mouse) { try { el.setPointerCapture(pid); } catch { /* ignore */ } }
      else timer = /** @type {any} */ (setTimeout(() => { if (mode === 'press') { mode = 'lifted'; this._lifted = true; el.classList.add('lifted'); try { el.setPointerCapture(pid); } catch { /* ignore */ } } }, LIFT_MS));
      inspect = /** @type {any} */ (setTimeout(() => { if (mode === 'press' || mode === 'lifted') { mode = 'done'; this._lifted = false; el.classList.remove('lifted'); openIngredient(this.lab, id, () => this.refresh()); } }, INSPECT_MS));
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pid) return;
      const d = Math.hypot(e.clientX - sx, e.clientY - sy);
      if (mode === 'press' && d > 8) {
        if (mouse) this.startDrag(el, id, e); else { mode = 'idle'; clearTimers(); return; } // a finger that moves at once scrolls
        mode = 'drag'; clearTimers();
      } else if (mode === 'lifted' && d > 6) { this.startDrag(el, id, e); mode = 'drag'; clearTimers(); }
      if (mode === 'drag') this.moveDrag(e);
    });
    const end = (e) => {
      if (e.pointerId !== pid) return;
      clearTimers();
      this._lifted = false;
      el.classList.remove('lifted');
      if (mode === 'drag') { this.dropDrag(e); mode = 'done'; }
      else if (mode === 'press' || mode === 'lifted') mode = e.type === 'pointerup' ? 'tap' : 'idle';
      pid = -1;
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', (e) => { if (e.pointerId === pid && mode === 'drag') this.endDrag(); end(e); mode = 'idle'; });
    el.addEventListener('click', () => {
      const tap = mode === 'tap' || mode === 'idle';
      mode = 'idle';
      if (!tap) return;
      this.lab.setOnShelf(id, !this.lab.onShelf(id));
      audio.play('select');
      this.render();
    });
    el.addEventListener('contextmenu', (e) => { e.preventDefault(); clearTimers(); mode = 'done'; openIngredient(this.lab, id, () => this.refresh()); });
  }

  /** @param {HTMLElement} el @param {string} id @param {PointerEvent} e */
  startDrag(el, id, e) {
    this.endDrag();
    const pic = /** @type {HTMLCanvasElement|null} */ (el.querySelector('canvas'));
    const ghost = h('div', { class: 'inv-ghost' });
    if (pic) { const c = /** @type {HTMLCanvasElement} */ (pic.cloneNode()); /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')).drawImage(pic, 0, 0); ghost.appendChild(c); }
    document.body.appendChild(ghost);
    this.drag = { id, ghost, pid: e.pointerId };
    el.classList.add('dragging');
    this.lab.shelfWrap.classList.add('drop-target');
    audio.play('click');
  }

  /** @param {PointerEvent} e */
  moveDrag(e) {
    const d = this.drag;
    if (!d) return;
    d.ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    this.lab.shelfWrap.classList.toggle('drop-over', this.overShelf(e));
    this.markInsert(this.overShelf(e) ? this.insertAt(e) : -1);
  }

  /** @param {PointerEvent} e */
  dropDrag(e) {
    const d = this.drag;
    if (!d) return;
    if (this.overShelf(e)) {
      this.lab.setOnShelf(d.id, true, this.insertAt(e));
      audio.play('select');
    }
    this.endDrag();
    this.render();
  }

  endDrag() {
    const d = this.drag;
    this.drag = null;
    if (d) d.ghost.remove();
    for (const t of this.grid.querySelectorAll('.dragging')) t.classList.remove('dragging');
    this.lab.shelfWrap.classList.remove('drop-target', 'drop-over');
    this.markInsert(-1);
  }

  /** @param {{clientX:number, clientY:number}} e */
  overShelf(e) {
    const r = this.lab.shelfWrap.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }

  /** Is a point inside the open drawer? @param {{clientX:number, clientY:number}} e */
  contains(e) {
    if (!this.open) return false;
    const r = this.el.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }

  /** Where on the shelf a drop lands: the index among the jars shown (reading order). @param {{clientX:number, clientY:number}} e */
  insertAt(e) {
    const jars = [...this.lab.shelfEl.querySelectorAll('.jar')];
    for (const [k, j] of jars.entries()) {
      const r = j.getBoundingClientRect();
      if (e.clientY < r.top) return k;
      if (e.clientY <= r.bottom && e.clientX < r.left + r.width / 2) return k;
    }
    return jars.length;
  }

  /** Show where the jar would go. @param {number} at */
  markInsert(at) {
    const jars = [...this.lab.shelfEl.querySelectorAll('.jar')];
    jars.forEach((j, k) => { j.classList.toggle('ins-before', k === at); j.classList.toggle('ins-after', at === jars.length && k === jars.length - 1); });
  }
}
