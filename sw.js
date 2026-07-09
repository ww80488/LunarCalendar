/* ── LunaCal Service Worker v1.8 ── */
const CACHE = 'lunacal-v1.8';

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
  var url=new URL(e.request.url);
  var isHTML=e.request.headers.get('Accept')?e.request.headers.get('Accept').indexOf('text/html')>=0:false;
  var isSameOrigin=e.request.url.indexOf(self.location.origin)===0;
  var isGET=e.request.method==='GET';

  if(isHTML&&isSameOrigin){
    // Network-first for HTML: always try network, fall back to cache
    e.respondWith(
      fetch(e.request).then(function(resp){
        if(resp.ok){
          return caches.open(CACHE).then(function(cache){
            cache.put(e.request,resp.clone());
            // Also cache /index.html variant if navigating to /
            if(url.pathname==='/'||url.pathname===''){
              var idxReq=new Request('./index.html');
              cache.put(idxReq,resp.clone());
            }
            return resp;
          });
        }
        throw new Error('Response not OK');
      }).catch(function(){
        return caches.match(e.request).then(function(cached){
          // Fallback: try /index.html as well
          return cached||caches.match('./index.html');
        });
      })
    );
  }else{
    // Cache-first for static assets
    e.respondWith(
      caches.match(e.request).then(function(cached){
        var fetchPromise=fetch(e.request).then(function(fetchResp){
          // Only cache successful same-origin GET requests
          if(fetchResp.ok&&isSameOrigin&&isGET){
            caches.open(CACHE).then(function(cache){cache.put(e.request,fetchResp.clone());});
          }
          return fetchResp;
        });
        return cached||fetchPromise;
      }).catch(function(){
        return fetch(e.request);
      })
    );
  }
});
