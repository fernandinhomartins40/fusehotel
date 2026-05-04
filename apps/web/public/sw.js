const CACHE_NAME = 'fusehotel-pwa-v20260503-2';
const ASSETS = ['/manifest.webmanifest', '/icons/icon-192.svg', '/icons/icon-512.svg', '/favicon.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith('fusehotel-pwa-') && key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (event.request.method !== 'GET') {
    return;
  }

  if (!['http:', 'https:'].includes(requestUrl.protocol)) {
    return;
  }

  if (requestUrl.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const isNavigation = event.request.mode === 'navigate';
        const isBuildAsset = requestUrl.pathname.startsWith('/assets/');
        const isCoreAsset = ASSETS.includes(requestUrl.pathname);

        if (!isNavigation && (isBuildAsset || isCoreAsset)) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
