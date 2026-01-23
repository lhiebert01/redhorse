// Red Horse Oracle - Service Worker
// v2: Fixed caching issue - don't cache JS chunks
const CACHE_NAME = 'red-horse-oracle-v2';

// Files to cache for offline/fast loading
// Only cache static images, NOT pages or JS
const STATIC_ASSETS = [
  '/assets/Fire-Horse-2026-Chart-v3.jpeg',
  '/assets/Year-of-the-Horse-2026-v2.jpeg',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls
  if (event.request.url.includes('/api/')) return;

  // IMPORTANT: Skip Next.js chunks and pages to prevent caching issues
  if (event.request.url.includes('/_next/')) return;
  if (event.request.url.includes('.js')) return;
  if (event.request.url.includes('.json')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Only cache images in /assets/ folder
        if (
          event.request.url.includes('/assets/') &&
          event.request.destination === 'image'
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      });
    })
  );
});
