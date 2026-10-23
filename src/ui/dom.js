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

/**
 * Small notification.
 * @param {string} title @param {string} [text] @param {string} [iconName] @param {number} [ms]
 */
export function toast(title, text = '', iconName = 'star', ms = 3200) {
  if (!toastBox) return;
  const t = h('div', { class: 'toast parch' }, icon(iconName), h('div', {}, h('b', { text: title }), text));
  toastBox.appendChild(t);
  while (toastBox.children.length > 4) toastBox.firstChild.remove();
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 320);
  }, ms);
}

/** Format coins. @param {number} v */
export function coins(v) {
  return (Math.round(v * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 });
}

/** @param {number} n @param {number} [max] */
export function starsText(n, max = 5) {
  return '★'.repeat(n) + '☆'.repeat(max - n);
}
