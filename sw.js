/* ── LunaCal Service Worker v1.3 ── */
const CACHE = 'lunacal-v1.3';

/* On install: dynamically cache the page that triggered the SW */
self.addEventListener('install', function(e) {
  self.skipWaiting();
  const pageUrl = new URL('./', self.location).href;
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.add(pageUrl).catch(function() {
        // Fallback: just resolve so install completes
        return Promise.resolve();
      });
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
    })
  );
});
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});

/* On activate: clean old caches, claim clients */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all([
      caches.keys().then(function(keys) {
        return Promise.all(
          keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
        );
      }),
      clients.claim()
    ])
  );
});
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});

/* On fetch: cache-first, fallback to network, update cache in background */
self.addEventListener('fetch', function(e) {
  // Only handle same-origin GET requests
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin) &&
      !e.request.url.startsWith(self.location.origin.replace('https://','http://'))) return;

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      // Return cached response immediately if available
      if (cached) {
        // In the background, fetch the latest and update cache
        fetch(e.request).then(function(response) {
          if (response && response.ok) {
            caches.open(CACHE).then(function(cache) {
              cache.put(e.request, response);
            });
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
          }
        }).catch(function() { /* offline, cached version is fine */ });
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
        return cached;
      }
      // Not in cache — fetch from network
      return fetch(e.request).then(function(response) {
        if (!response || !response.ok) return response;
        var clone = response.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, clone);
        });
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
        return response;
      }).catch(function() {
        // Offline and not cached — return offline fallback
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
      });
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
    })
  );
});
/* ── Push notifications ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(ex) {}
  var title = data.title || 'Lunar Calendar';
  var options = {
    body: data.body || 'A festival is coming up!',
    icon: data.icon || './image.jpeg',
    badge: './image.jpeg',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
