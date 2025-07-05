const CACHE_NAME = 'titans-gym-v1';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/style.min.css',
    '/optimized/muscleguy.webp',
    '/optimized/muscleguy.jpg',
    '/optimized/logo.webp',
    '/optimized/logo.png',
    '/optimized/sam-sulek.webp',
    '/optimized/sam-sulek.jpg'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // Fallback for when offline
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});