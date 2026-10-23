// MindCheck service worker: network-first navigation prevents outdated homepage releases.
const CACHE = 'mc-v43-calm-studio-20261023';
const ASSETS = ['./js/compact-home.js?v=20261023-calm','./css/calm-studio.css?v=20261023-calm','./js/calm-studio-copy.js?v=20261023-calm','./js/calm-studio.js?v=20261023-calm','./js/mindcheck-smart-wellness.js?v=20261023-calm','./js/breathing-studio-copy.js?v=20261023-calm','./js/install-app.js','./js/install-app.js?v=20261023-locale-startup','./css/mindcheck-visual-system.css','./js/mindcheck-visual-system.js','./css/compact-home.css','./js/compact-home-copy.js','./js/compact-home.js','./js/compact-home.js?v=20261023-locale-startup','./js/breathing-studio-copy.js','./css/breathing-studio.css','./js/assessment-centre-translations.js','./js/wellness-interface-translations.js','./js/mindcheck-page-locales.js','./js/mindcheck-page-locales.js?v=20261023-locale-startup','./css/language-switch.css','./js/language-switch.js','./js/mindcheck-analytics-config.js','./js/mindcheck-analytics.js','./css/training-centre.css','./js/training-centre.js','./become-a-counsellor.html','./css/counsellor-pathway.css','./js/counsellor-pathway.js','./js/mindcheck-calm-interactions.js','./','./index.html','./offline.html','./mc-theme.css','./mindcheck-native-responsive.css','./mindcheck-calm-experience.css','./mindcheck-synced-breathing.css','./mindcheck-signature-dashboard.css','./mindcheck-front-door.css','./mindcheck-live-wellness.css','./mindcheck-minimal-front.css','./mindcheck-live-experience.css','./assessment-interface.css','./mc-polish.css','./icons/apple-touch-icon.png','./icons/logo.png','./speakout-brand-unification.css','./speakout-subsections.css','./mindcheck-premium-layout.css','./mindcheck-premium-nav.css','./mindcheck-focused-app.css','./mindcheck-compact-header.css','./js/mindcheck-premium-nav.js','./js/mindcheck-standalone-nav.js','./js/mindcheck-uplift-translations.js','./js/mindcheck-i18n.js','./js/mindcheck-i18n.js?v=20261023-locale-startup','./js/mindcheck-journey.js','./js/mindcheck-journey.js?v=20261023-locale-startup','./mindcheck-journey.css','./js/mindcheck-smart-wellness.js','./js/mindcheck-smart-wellness.js?v=20261023-locale-startup','./mindcheck-smart-wellness.css','./mindcheck-sections-accessibility.css','./volunteers.html','./training-hub.html','./certificate.html','./verify.html','./resources.html','./adhd.html','./assessment-centre.html','./audit-screening.html','./pcl5-screening.html','./trauma-awareness.html','./sleep-awareness.html','./suicide-support.html','./professional-assessments.html','./clinical-assessment-guide.html','./clinician-referral-preparation.html','./monitoring.html','./privacy.html','./terms.html','./favicon.png','./manifest.webmanifest'];
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
    }).catch(async () => (await caches.match(request)) || (await caches.match('./offline.html')) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) { const copy=response.clone(); event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy))); }
    return response;
  })));
});
