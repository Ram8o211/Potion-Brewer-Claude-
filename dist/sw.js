// Service worker: cache-first offline support. The build script replaces
// the asset list and version; in development it simply caches as it goes.
const VERSION = '2.3.0-ac8f6e9f1c';
const ASSETS = ["./","app.0fe4b67ddb.js","assets/atlases/growth-exotic.json","assets/atlases/growth-exotic.png","assets/atlases/growth-natural.json","assets/atlases/growth-natural.png","assets/atlases/ingredients-arcane-exotic.json","assets/atlases/ingredients-arcane-exotic.png","assets/atlases/ingredients-arcane-natural.json","assets/atlases/ingredients-arcane-natural.png","assets/atlases/ingredients-exotic-flora.json","assets/atlases/ingredients-exotic-flora.png","assets/atlases/ingredients-exotic-fungi-minerals.json","assets/atlases/ingredients-exotic-fungi-minerals.png","assets/atlases/ingredients-natural-flora.json","assets/atlases/ingredients-natural-flora.png","assets/atlases/ingredients-natural-fungi-minerals.json","assets/atlases/ingredients-natural-fungi-minerals.png","assets/atlases/manifest.json","assets/atlases/seeds.json","assets/atlases/seeds.png","assets/fonts/alchemist-pixel.ttf","assets/icons/icon-192.png","assets/icons/icon-512.png","assets/ui/button/gray.png","assets/ui/button/green-dark.png","assets/ui/button/green.png","assets/ui/button/purple-dark.png","assets/ui/button/purple.png","assets/ui/button/red.png","assets/ui/button/tan.png","assets/ui/button/wood-gold.png","assets/ui/button/wood.png","assets/ui/chip/coin.png","assets/ui/chip/gold.png","assets/ui/form/checkbox-on.png","assets/ui/form/checkbox.png","assets/ui/header/brand.png","assets/ui/header/vine.png","assets/ui/header/wood-2.png","assets/ui/header/wood.png","assets/ui/icon/awaken.png","assets/ui/icon/bag.png","assets/ui/icon/book.png","assets/ui/icon/bottle.png","assets/ui/icon/bubbles.png","assets/ui/icon/cauldron.png","assets/ui/icon/check.png","assets/ui/icon/clock.png","assets/ui/icon/close.png","assets/ui/icon/coin.png","assets/ui/icon/door.png","assets/ui/icon/drop.png","assets/ui/icon/dropper.png","assets/ui/icon/flame.png","assets/ui/icon/flask.png","assets/ui/icon/gear.png","assets/ui/icon/gem.png","assets/ui/icon/heart.png","assets/ui/icon/help.png","assets/ui/icon/jar.png","assets/ui/icon/leaf.png","assets/ui/icon/minus.png","assets/ui/icon/plus.png","assets/ui/icon/scroll.png","assets/ui/icon/seedling.png","assets/ui/icon/shroom.png","assets/ui/icon/skull.png","assets/ui/icon/snow.png","assets/ui/icon/spark.png","assets/ui/icon/stall.png","assets/ui/icon/star.png","assets/ui/icon/stone.png","assets/ui/icon/swirl.png","assets/ui/icon/trash.png","assets/ui/icon/tree.png","assets/ui/icon/trophy.png","assets/ui/panel/dark-wide.png","assets/ui/panel/dark.png","assets/ui/panel/frame-dark.png","assets/ui/panel/parch.png","assets/ui/panel/wood-vine.png","assets/ui/plot/brown.png","assets/ui/plot/fungal.png","assets/ui/plot/stone.png","assets/ui/plot/water.png","assets/ui/slot/bottle-outline.png","assets/ui/slot/dark.png","assets/ui/slot/gold.png","assets/ui/slot/purple.png","assets/ui/slot/wood.png","assets/ui/tab/blank-on.png","assets/ui/tab/blank.png","index.html","manifest.webmanifest","styles/main.bb02713f36.css"];
// The origin may be shared — <owner>.github.io hosts every Pages site of an
// account, and a branch deploy exposes this game both at the root and at
// /dist/ — so cache names carry this worker's scope, and each worker only
// reads and cleans up its own caches.
const PREFIX = 'alchemist-shop:' + self.registration.scope + ':';
const CACHE = PREFIX + VERSION;
const LEGACY = 'alchemist-shop-'; // cache names used before scoping

self.addEventListener('install', (e) => {
  // 'reload' bypasses the browser's HTTP cache: static hosts such as GitHub
  // Pages let files be cached for minutes, and precaching a stale index.html
  // next to a new bundle would pin the old version
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => (k.startsWith(PREFIX) && k !== CACHE) || k.startsWith(LEGACY)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then((c) => c.match(req, { ignoreSearch: true })).then((hit) => {
      // revalidate with the server (a 304 when unchanged) rather than trusting the HTTP cache
      const net = fetch(req, { cache: 'no-cache' }).then((res) => {
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
