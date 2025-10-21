const CACHE_NAME = 'quickeats-cache-v1';
const urlsToCache = [
  'index.html',
  'cart.html',
  'settings.html',
  'app.js',
  'manifest.json',
  'images/icon-192.png',
  'images/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
