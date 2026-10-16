// MindCheck service worker: network-first navigation prevents outdated homepage releases.
const CACHE = 'mc-v19-mood-wellness-20261016';
const ASSETS = ['./','./index.html','./mc-theme.css','./mindcheck-native-responsive.css','./assessment-interface.css','./mc-polish.css','./icons/apple-touch-icon.png','./icons/logo.png','./speakout-brand-unification.css','./speakout-subsections.css','./mindcheck-premium-layout.css','./mindcheck-premium-nav.css','./mindcheck-focused-app.css','./mindcheck-compact-header.css','./js/mindcheck-premium-nav.js','./js/mindcheck-standalone-nav.js','./js/mindcheck-uplift-translations.js','./js/mindcheck-i18n.js','./js/mindcheck-journey.js','./mindcheck-journey.css','./js/mindcheck-smart-wellness.js','./mindcheck-smart-wellness.css','./mindcheck-sections-accessibility.css','./volunteers.html','./training-hub.html','./certificate.html','./verify.html','./resources.html','./adhd.html','./assessment-centre.html','./audit-screening.html','./pcl5-screening.html','./trauma-awareness.html','./sleep-awareness.html','./suicide-support.html','./professional-assessments.html','./clinical-assessment-guide.html','./clinician-referral-preparation.html','./monitoring.html','./privacy.html','./terms.html','./favicon.png','./manifest.webmanifest'];
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
