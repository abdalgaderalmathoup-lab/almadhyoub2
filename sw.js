const CACHE_NAME = 'almadhyoub-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/js/app.js',
  '/js/auth.js',
  '/js/db.js',
  '/js/accounting.js',
  '/js/seed-accounts.js',
  '/js/money.js',
  '/js/parties.js',
  '/js/inventory.js',
  '/js/firebase-config.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firestore.googleapis.com') || e.request.url.includes('identitytoolkit')) {
    return; // لا تخزن طلبات Firebase في الكاش
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => caches.match('/index.html'));
    })
  );
});