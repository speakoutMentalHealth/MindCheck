// /MindCheck/sw.js
const CACHE_VERSION = 'mc-v6'; // bump when you change this file
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  './',
  './manifest.webmanifest',
  './favicon.png',
  './icons/apple-touch-icon.png'
];

// ---- helpers ----
function isHTMLRequest(req) {
  const url = new URL(req.url);
  const accept = req.headers.get('accept') || '';
  // treat navigation and HTML requests as HTML
  return req.mode === 'navigate' || accept.includes('text/html') || url.pathname.endsWith('.html');
}

// ---- install: pre-cache some static assets (not index.html) ----
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(RUNTIME_CACHE).then((c) => c.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

// ---- activate: delete old caches ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== RUNTIME_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ---- fetch strategy ----
// - Only handle same-origin GET requests.
// - HTML: network-first so new index.html shows immediately.
// - Other assets: cache-first with network fallback.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // let non-GET pass through (important for POST/OPTIONS to Apps Script)
  if (req.method !== 'GET') return;

  // only manage same-origin files; don't touch 3rd-party (e.g., plausible, GAS)
  if (url.origin !== location.origin) return;

  // HTML: Network-first
  if (isHTMLRequest(req)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          // fallback to cached page (maybe './')
          const cached = await caches.match(req) || await caches.match('./');
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // Non-HTML: Cache-first
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, res.clone());
        return res;
      } catch {
        // nothing cached, give up
        return Response.error();
      }
    })()
  );
});
