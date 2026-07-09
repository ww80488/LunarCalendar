/* ── LunaCal Service Worker v1.6 ── */
const CACHE = 'lunacal-v1.6';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        './',
        './css/variables.css',
        './css/style.css',
        './css/bigtext.css',
        './js/core.js',
        './js/ui.js',
        './js/init.js',
        './lunar.svg',
        './manifest.json'
      ]).catch(function() { /* ignore */ });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all([
      caches.keys().then(function(keys) {
        return Promise.all(
          keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.open(CACHE).then(function(cache) {
      return cache.match(e.request).then(function(resp) {
        return resp || fetch(e.request).then(function(fetchResp) {
          cache.put(e.request, fetchResp.clone());
          return fetchResp;
        });
      }).catch(function() {
        return fetch(e.request);
      });
    })
  );
});
