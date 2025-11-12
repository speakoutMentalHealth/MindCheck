// sw.js
const CACHE = 'mc-v5'; // bump
const ASSETS = [
  './',
  './index.html',
  './mc-theme.css',
  './volunteers.html',
  './training-hub.html',
  './certificate.html',
  './verify.html',          // ⬅️ add
  './resources.html',
  './monitoring.html',
  './privacy.html',
  './terms.html',
  './favicon.png',
  './manifest.webmanifest'
];


// Install
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate (clear old caches)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(cache => { if (req.method === 'GET' && res.ok) cache.put(req, copy); });
      return res;
    }).catch(()=> caches.match('./index.html')))
  );
});
