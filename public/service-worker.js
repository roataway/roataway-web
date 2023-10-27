// public/service-worker.js
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache-name').then(function(cache) {
      return cache.addAll([
        '/static/js/bundle.js',
        '/index.html',
        // Add other assets to cache as needed
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
