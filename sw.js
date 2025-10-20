self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const CACHE = 'mc-v7';

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only cache GET requests
  if (req.method !== 'GET') return;

  // Navigations: network-first; fallback to cached index
  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
  if (isHTML) {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, clone));
        return res;
      });
    })
  );
});
