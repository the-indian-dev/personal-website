const CACHE_NAME = 'personal-website-v1';
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/assets/durga.webp',
  '/assets/durga-mobile.webp',
  '/assets/wave.webp',
  '/assets/emoji.webp',
  '/assets/game.webp',
  '/assets/om.webp',
  '/assets/flag.webp',
  '/assets/heart.webp',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@900&display=swap',
  'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js',
  'https://unicons.iconscout.com/release/v4.0.0/css/line.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});