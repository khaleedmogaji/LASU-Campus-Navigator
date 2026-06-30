const CACHE_NAME = 'lasu-map-cache-v10';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

function normalizeUrl(requestUrl) {
  const url = new URL(requestUrl);
  if (url.hostname.includes('basemaps.cartocdn.com')) {
    url.hostname = 'a.basemaps.cartocdn.com';
  }
  return url.toString();
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Only intercept GET requests and http/https protocols
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 2. Bypass same-origin assets on localhost/127.0.0.1 to prevent breaking Vite dev server HMR
  if (url.origin === self.location.origin && (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1')) {
    return;
  }

  // Cache map tiles (Google and CartoDB)
  if (url.hostname.includes('cartocdn.com') || url.hostname.includes('google.com')) {
    const normalizedUrl = normalizeUrl(event.request.url);
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(normalizedUrl).then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(normalizedUrl, networkResponse.clone());
            }
            return networkResponse;
          }).catch((err) => {
            console.error('Fetch failed for tile: ', event.request.url, err);
            return null;
          });
        })
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok && (url.origin === self.location.origin)) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        }).catch((err) => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          throw err;
        });
      })
    );
  }
});

// Convert coordinates to tile numbers
function lon2tile(lon, zoom) {
  return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
}
function lat2tile(lat, zoom) {
  return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_TILES') {
    precacheTiles(event.source, event.data.bounds, event.data.zooms);
  }
});

async function precacheTiles(client, bounds, zooms) {
  // Generate URLs list
  const urls = [];
  
  // Add static resources that we want to ensure are cached
  const staticAssets = [
    '/',
    '/index.html',
    '/manifest.json',
    '/senate-building.png',
    '/education.png',
    '/management-sciences.png',
    '/mba-complex.png',
    '/buba-marwa-auditorium.png',
    '/welcome-bg.png'
  ];
  
  staticAssets.forEach(asset => urls.push({ url: asset, isTile: false }));

  // Generate tiles urls
  for (const z of zooms) {
    const xMin = Math.min(lon2tile(bounds.lonMin, z), lon2tile(bounds.lonMax, z));
    const xMax = Math.max(lon2tile(bounds.lonMin, z), lon2tile(bounds.lonMax, z));
    const yMin = Math.min(lat2tile(bounds.latMin, z), lat2tile(bounds.latMax, z));
    const yMax = Math.max(lat2tile(bounds.latMin, z), lat2tile(bounds.latMax, z));
    
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        urls.push({
          url: `https://a.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png`,
          isTile: true
        });
      }
    }
  }

  // Download and cache with concurrency
  try {
    const cache = await caches.open(CACHE_NAME);
    let completed = 0;
    const total = urls.length;
    const maxConcurrency = 6;
    let index = 0;

    async function worker() {
      while (index < total) {
        const currentIdx = index++;
        const item = urls[currentIdx];
        try {
          const response = await fetch(item.url, { cache: 'reload' });
          if (response.ok) {
            const targetUrl = item.isTile ? normalizeUrl(item.url) : item.url;
            await cache.put(targetUrl, response);
          }
        } catch (err) {
          console.warn(`Failed to cache: ${item.url}`, err);
        }
        completed++;
        
        // Post progress back to the page
        const progress = Math.round((completed / total) * 100);
        client.postMessage({
          type: 'PRECACHE_PROGRESS',
          progress: progress,
          completed: completed,
          total: total
        });
      }
    }

    const workers = [];
    for (let i = 0; i < Math.min(maxConcurrency, total); i++) {
      workers.push(worker());
    }
    await Promise.all(workers);
    
    client.postMessage({
      type: 'PRECACHE_PROGRESS',
      progress: 100,
      completed: total,
      total: total
    });
  } catch (error) {
    console.error('Error in precacheTiles:', error);
    client.postMessage({
      type: 'PRECACHE_ERROR',
      error: error.message
    });
  }
}
