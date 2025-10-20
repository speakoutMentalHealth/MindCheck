// /MindCheck/sw.js
const CACHE_VERSION = 'mc-v5';               // bump this to force an update
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  './',                     // scope root
  './manifest.webmanifest',
  './favicon.png',
  './icons/apple-touch-icon.png'
];

// Install: pre-cache a few static files (NOT index.html)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(RUNTIME_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== RUNTIME_CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch:
// - HTML: NETWORK-FIRST (so new index.html shows immediately)
// - Other: CACHE-FIRST with network fallback
self.addEventListener('fetch', event => {
  const req = event.request;
  // Let non-GET (POST/OPTIONS) pass through untouched
  if (req.method !== 'GET') return;
  // (… your GET cache logic …)
});

  if (isHTML) {
    event.respondWith(
      fetch(req).then((res) => {
        const resClone = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, resClone));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const resClone = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, resClone));
        return res;
      }).catch(() => cached);
    })
  );
});
