// 🧠 SpeakOut MindCheck Service Worker — v4
const CACHE = 'mc-v4';  // bump this version when you add/edit files

// List all essential assets you want available offline
const ASSETS = [
  './',
  './index.html',
  './mc-theme.css',
  './resources.html',
  './volunteers.html',
  './training-hub.html',
  './favicon.png',
  './manifest.webmanifest'
];

// Install event: cache all required files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // activate immediately
});

// Activate event: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // take control of open pages
});

// Fetch event: serve from cache first, then network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
