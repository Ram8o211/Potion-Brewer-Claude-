// Service worker: cache-first offline support. The build script replaces
// the asset list and version; in development it simply caches as it goes.
const VERSION = '1.0.0-6546bb7324';
const ASSETS = ["./","app.8261900c61.js","assets/fonts/alchemist-pixel.ttf","assets/icons/icon-192.png","assets/icons/icon-512.png","index.html","manifest.webmanifest","styles/main.8d95830772.css"];
const CACHE = 'alchemist-shop-' + VERSION;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('alchemist-shop-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      // dev: network first (fresh code); release: cache first (instant offline)
      return VERSION === 'dev' ? net.then((r) => r || hit) : hit || net;
    }),
  );
});
