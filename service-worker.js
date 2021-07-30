const CACHE = '8d72703af46ebec84472ab7c825b4d66d9261b4447a4701e1e40df7d597ea674'
const PRECACHE_URLS = [
  '/assets/nunito-v16-latin-ext_latin-700_6e483e301899a8ab59b328ae7f155c29.woff',
  '/assets/nunito-v16-latin-ext_latin-700_7ba344b9011888663eea78e71fc1af79.woff2',
  '/assets/open-sans-v18-latin-ext_latin-700_5717b08cf679657595d0383d291a04c3.woff2',
  '/assets/open-sans-v18-latin-ext_latin-regular_b7b7c77b83e9d67f6756aa2716f35eba.woff',
  '/assets/open-sans-v18-latin-ext_latin-regular_be21e759f9abd15b8cef68d92cedc081.woff2',
  '/external-stylesheets.css',
  '/index.html',
  '/index.js',
  '/manifest.webmanifest'
]

// On install precache all static resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache =>
        Promise.all(
          PRECACHE_URLS.map(url =>
            cache
              .add(url)
              .catch(error => console.log(`Could not cache: ${url} - ${error}!`))
          )
        )
      )
      .then(() => self.skipWaiting())
  )
})

// On activate remove all unused caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => cacheNames.filter(cacheName => cacheName !== CACHE))
      .then(cachesToDelete =>
        Promise.all(
          cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const url = event.request.url
  const origin = self.location.origin
  const isSameOrigin = url.startsWith(origin)

  let response = null

  // If we are on the same origin
  if (isSameOrigin) {
    // Try to get the response from the cache, and if not available
    // fall back to the "index.html" file.
    response =
      caches
        .match(event.request)
        .then(cachedResponse => cachedResponse || caches.match('/index.html'))
  } else {
    response = fetch(event.request)
  }

  response
    .then(actualResponse => event.respondWith(actualResponse))
})
