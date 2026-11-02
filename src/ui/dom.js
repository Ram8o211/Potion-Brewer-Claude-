// Tiny DOM toolkit: element builder, modal and toast helpers.

import { icon } from './icons.js';
import { audio } from '../audio/audio.js';

/**
 * Create an element. `attrs` keys: class, text, html, style (object), on* handlers, data-*, others as attributes.
 * @param {string} tag @param {any} [attrs] @param {...any} children
 * @returns {any}
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

/**
 * Button with optional icon.
 * @returns {HTMLButtonElement}
 */
export function btn(label, onClick, opts = {}) {
  const b = /** @type {HTMLButtonElement} */ (h('button', { class: 'btn ' + (opts.cls || ''), title: opts.title || label || '', 'aria-label': opts.title || label || '', 'data-act': opts.act || null }));
  if (opts.icon) b.appendChild(icon(opts.icon));
  if (label) b.appendChild(h('span', { class: opts.icon ? 'lbl' : '' }, label));
  b.addEventListener('click', (e) => {
    audio.play('click');
    onClick && onClick(e);
  });
  if (opts.disabled) b.disabled = true;
  return b;
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

/**
 * Rebuild what is inside `root` without anything jumping: a row of tabs or
 * a shelf rebuilt by a tap on one of its own buttons keeps where it was
 * scrolled to (emptied, it would fall back to its start), and so do the
 * panels scrolling round it. Rows are matched old to new by their classes;
 * a row of tabs then brings its active tab into view if it is out of it.
 * @template T @param {HTMLElement} root @param {() => T} fill @returns {T}
 */
export function keepScroll(root, fill) {
  /** @type {[HTMLElement, number, number][]} */
  const outer = [];
  for (let p = root.parentElement; p; p = p.parentElement) if (p.scrollTop || p.scrollLeft) outer.push([p, p.scrollLeft, p.scrollTop]);
  /** @type {Map<string, [number, number][]>} */
  const rows = new Map();
  const scrolled = (/** @type {Element} */ e) => e.scrollLeft || e.scrollTop;
  const keyOf = (/** @type {Element} */ e) => e.tagName + '.' + String(e.className).split(/\s+/).filter((c) => c && c !== 'active' && c !== 'collapsed').sort().join('.');
  for (const e of [root, ...root.querySelectorAll('*')]) if (scrolled(e)) {
    const k = keyOf(e);
    if (!rows.has(k)) rows.set(k, []);
    /** @type {[number, number][]} */ (rows.get(k)).push([e.scrollLeft, e.scrollTop]);
  }
  const out = fill();
  for (const [p, x, y] of outer) { p.scrollLeft = x; p.scrollTop = y; }
  if (rows.size) {
    /** @type {Map<string, number>} */
    const seen = new Map();
    for (const e of /** @type {HTMLElement[]} */ ([root, ...root.querySelectorAll('*')])) {
      const k = keyOf(e), list = rows.get(k);
      if (!list) continue;
      const i = seen.get(k) || 0;
      seen.set(k, i + 1);
      if (i >= list.length) continue;
      e.scrollLeft = list[i][0]; e.scrollTop = list[i][1];
    }
  }
  for (const row of /** @type {HTMLElement[]} */ ([...root.querySelectorAll('[role="tablist"]')])) reveal(row);
  return out;
}

/**
 * Scroll a sideways row just enough to show its active item.
 * @param {HTMLElement} row
 */
export function reveal(row) {
  const a = row.querySelector('.active');
  if (!a || row.scrollWidth <= row.clientWidth) return;
  const r = row.getBoundingClientRect(), b = a.getBoundingClientRect();
  if (b.left < r.left) row.scrollLeft -= r.left - b.left + 8;
  else if (b.right > r.right) row.scrollLeft += b.right - r.right + 8;
}

let overlayRoot = null;
/** @param {HTMLElement} root */
export function setOverlayRoot(root) {
  overlayRoot = root;
}

/**
 * Open a modal dialog. Returns {close, el, body}.
 * @param {{title:string, body?:HTMLElement|HTMLElement[], foot?:HTMLElement[], wide?:boolean, onClose?:()=>void, closable?:boolean, cls?:string}} o
 */
export function modal(o) {
  const body = h('div', { class: 'modal-body' }, o.body || []);
  const head = h('div', { class: 'modal-head' }, h('h2', { text: o.title }));
  const box = h('div', { class: 'modal frame ' + (o.wide ? 'wide ' : '') + (o.cls || ''), role: 'dialog', 'aria-label': o.title }, head, body);
  if (o.foot && o.foot.length) box.appendChild(h('div', { class: 'modal-foot' }, o.foot));
  const ov = h('div', { class: 'overlay' }, box);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    ov.remove();
    o.onClose && o.onClose();
  };
  if (o.closable !== false) {
    const x = btn('', close, { icon: 'close', cls: 'icon', title: 'Close' });
    head.appendChild(x);
    ov.addEventListener('pointerdown', (e) => {
      if (e.target === ov) close();
    });
  }
  (overlayRoot || document.body).appendChild(ov);
  return { close, el: box, body, head, overlay: ov };
}

/** Confirmation dialog. */
export function confirmDialog(title, text, okLabel = 'Yes', cls = 'primary') {
  return new Promise((resolve) => {
    let m;
    const ok = btn(okLabel, () => { resolve(true); m.close(); }, { cls });
    const no = btn('Cancel', () => { resolve(false); m.close(); });
    m = modal({ title, body: h('div', { class: 'card parch', text }), foot: [no, ok], onClose: () => resolve(false) });
  });
}

let toastBox = null;
/** @param {HTMLElement} root */
export function setToastRoot(root) {
  toastBox = h('div', { class: 'toasts', 'aria-live': 'polite' });
  root.appendChild(toastBox);
}

/** During the guided tour, notes appear under its strip rather than over it (call when the strip changes). */
export function placeToasts() {
  if (!toastBox || !toastBox.parentElement) return;
  const tour = document.querySelector('.tutor-slot .tutor');
  const top = tour ? tour.getBoundingClientRect().bottom - toastBox.parentElement.getBoundingClientRect().top + 6 : 0;
  toastBox.style.top = top > 0 ? `${Math.round(top)}px` : '';
}

/**
 * The game's notes, kept for the "recent notes" list (newest last).
 * @type {{title:string, text:string, icon:string, at:number}[]}
 */
const noteLog = [];
export const NOTE_LOG_MAX = 30;
/** @type {HTMLElement|null} */
let noteDock = null;
/** @type {any} */
let noteTimer = 0;

/**
 * Where notes go while a game is open: a dock in the top bar with its own
 * space, never over a control. Elsewhere (the title menu) notes float.
 * @param {HTMLElement|null} el
 */
export function setNoteDock(el) {
  noteDock = el;
}

/** The recent notes, newest first. */
export function recentNotes() {
  return noteLog.slice().reverse();
}

/**
 * Show a note in the dock: it lights up while fresh (longer for a longer
 * note), then stays there, dimmed, until the next one, so it can be read
 * without stopping. A note too long for its line scrolls through once.
 * @param {string} title @param {string} text @param {string} iconName @param {number} ms
 */
function dockNote(title, text, iconName, ms) {
  const d = /** @type {HTMLElement} */ (noteDock);
  const body = h('span', { class: 'note-body' }, h('b', { text: title }), text ? h('span', { class: 'note-text', text }) : null);
  const wrap = h('span', { class: 'note-clip' }, body);
  clear(d).append(icon(iconName, 'sm'), wrap);
  d.title = text ? `${title}: ${text}` : title;
  d.classList.remove('fresh', 'old', 'idle');
  void d.offsetWidth; // restart the light-up
  d.classList.add('fresh');
  const n = noteLog.length;
  const count = h('span', { class: 'note-count', text: String(n), title: 'Recent notes' });
  d.append(count);
  const read = Math.max(ms, 2200 + 55 * (title.length + text.length));
  // a line too short for the note: it scrolls through slowly once it has been seen
  requestAnimationFrame(() => {
    const over = body.scrollWidth - wrap.clientWidth;
    if (over > 4 && getComputedStyle(body).whiteSpace === 'nowrap') {
      body.style.setProperty('--note-shift', `${-over - 8}px`);
      body.style.setProperty('--note-time', `${Math.max(4, over / 34 + 3)}s`);
      body.classList.add('scroll');
    }
  });
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => { d.classList.remove('fresh'); d.classList.add('old'); }, read);
}

/**
 * Small notification.
 * @param {string} title @param {string} [text] @param {string} [iconName] @param {number} [ms]
 */
export function toast(title, text = '', iconName = 'star', ms = 3200) {
  noteLog.push({ title, text, icon: iconName, at: Date.now() });
  if (noteLog.length > NOTE_LOG_MAX) noteLog.splice(0, noteLog.length - NOTE_LOG_MAX);
  if (noteDock && noteDock.isConnected) { dockNote(title, text, iconName, ms); return; }
  if (!toastBox) return;
  placeToasts();
  const t = h('div', { class: 'toast parch' }, icon(iconName), h('div', {}, h('b', { text: title }), text));
  toastBox.appendChild(t);
  while (toastBox.children.length > 3) toastBox.firstChild.remove();
  const out = () => {
    if (t.classList.contains('out')) return;
    t.classList.add('out');
    setTimeout(() => t.remove(), 320);
  };
  setTimeout(out, ms);
}

/** Format coins. @param {number} v */
export function coins(v) {
  return (Math.round(v * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 });
}

/** @param {number} n @param {number} [max] */
export function starsText(n, max = 5) {
  return '★'.repeat(n) + '☆'.repeat(max - n);
}
