// Entry point.
import { App } from './ui/app.js';

const root = document.getElementById('app');
const app = new App(root);
/** @type {any} */ (window).__alchemist = app;
app.start();

// Offline support (installable PWA). Only on http(s) — not when opened from file://.
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !/[?&]nosw/.test(location.search)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
