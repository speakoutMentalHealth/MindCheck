// sw.js (MindCheck folder)
const CACHE_NAME = 'mindcheck-v1';
// List the core files you want available offline
const OFFLINE_URLS = [
  './',                // resolves to /MindCheck/
  './index.html',
  './favicon.png',
  './privacy.html',    // include if you have it
  './terms.html'       // include if you have it
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Try cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
