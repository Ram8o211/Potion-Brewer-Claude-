// Local persistence: autosave to localStorage with a rolling backup, explicit
// export/import of save files, and graceful handling of unavailable or
// corrupted storage.

import { GameState } from './state.js';

export const KEYS = {
  save: 'alchemist-shop.save',
  backup: 'alchemist-shop.save.backup',
  settings: 'alchemist-shop.settings',
  sandbox: 'alchemist-shop.sandbox',
};

/** @returns {Storage|null} */
function store() {
  try {
    const s = globalThis.localStorage;
    const k = '__t';
    s.setItem(k, '1');
    s.removeItem(k);
    return s;
  } catch {
    return null;
  }
}

export function storageAvailable() {
  return !!store();
}

/**
 * Save the game. Returns true on success.
 * @param {GameState} state
 */
export function saveGame(state) {
  const s = store();
  if (!s) return false;
  try {
    const json = JSON.stringify(state.toJSON());
    const prev = s.getItem(KEYS.save);
    if (prev) {
      try {
        JSON.parse(prev); // only keep a valid previous save as backup
        s.setItem(KEYS.backup, prev);
      } catch {
        /* ignore corrupt previous */
      }
    }
    s.setItem(KEYS.save, json);
    return true;
  } catch (e) {
    // quota exceeded: retry without the cauldron snapshot
    try {
      const data = state.toJSON();
      data.cauldron = null;
      s.setItem(KEYS.save, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }
}

/** @returns {{state: GameState|null, error: string|null, recovered?: boolean}} */
export function loadGame() {
  const s = store();
  if (!s) return { state: null, error: 'Local storage is unavailable in this browser mode.' };
  const raw = s.getItem(KEYS.save);
  if (!raw) return { state: null, error: null };
  try {
    return { state: GameState.fromJSON(JSON.parse(raw)), error: null };
  } catch (e) {
    const bak = s.getItem(KEYS.backup);
    if (bak) {
      try {
        return { state: GameState.fromJSON(JSON.parse(bak)), error: 'Your save was damaged; the previous autosave was restored.', recovered: true };
      } catch {
        /* fall through */
      }
    }
    return { state: null, error: 'Your save could not be read (' + (e && e.message ? e.message : 'unknown error') + ').' };
  }
}

export function hasSave() {
  const s = store();
  return !!(s && s.getItem(KEYS.save));
}

export function deleteSave() {
  const s = store();
  if (!s) return;
  s.removeItem(KEYS.save);
  s.removeItem(KEYS.backup);
}

/** Trigger a download of the save as a JSON file. @param {GameState} state */
export function exportSave(state) {
  const json = JSON.stringify(state.toJSON(), null, 0);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `alchemists-shop-${state.seed}-day${state.day}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Parse an imported save file's text. Throws with a readable message on failure.
 * @param {string} text
 */
export function parseImport(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('That file is not a valid save (not JSON).');
  }
  return GameState.fromJSON(raw);
}

export function loadJSON(key, fallback) {
  const s = store();
  if (!s) return fallback;
  try {
    const v = s.getItem(key);
    return v ? { ...fallback, ...JSON.parse(v) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  const s = store();
  if (!s) return false;
  try {
    s.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key) {
  const s = store();
  if (s) s.removeItem(key);
}
