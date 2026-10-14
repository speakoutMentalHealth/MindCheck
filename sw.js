// MindCheck service worker: network-first navigation prevents outdated homepage releases.
const CACHE = 'mc-v9-visual-polish-20261014-milestones1';
const ASSETS = ['./','./index.html','./mc-theme.css','./mc-polish.css','./js/mindcheck-i18n.js','./js/mindcheck-journey.js','./mindcheck-journey.css','./js/mindcheck-smart-wellness.js','./mindcheck-smart-wellness.css','./js/mindcheck-milestones.js','./mindcheck-milestones.css','./mindcheck-sections-accessibility.css','./volunteers.html','./training-hub.html','./certificate.html','./verify.html','./resources.html','./monitoring.html','./privacy.html','./terms.html','./favicon.png','./manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('mc-') && key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) { const copy=response.clone(); event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy))); }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('./index.html')) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) { const copy=response.clone(); event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy))); }
    return response;
  })));
});
