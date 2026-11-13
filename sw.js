const CACHE_NAME = 'almadhyoub-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './app.js',
  './auth.js',
  './db.js',
  './accounting.js',
  './seed-accounts.js',
  './money.js',
  './parties.js',
  './inventory.js',
  './firebase-config.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firestore.googleapis.com') || e.request.url.includes('identitytoolkit')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
