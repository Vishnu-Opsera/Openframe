const CACHE_NAME = 'openframe-shell-0.1.0'
const ALLOW_LIST = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/sw.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ALLOW_LIST)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith('openframe-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (!ALLOW_LIST.includes(url.pathname)) {
    return
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  )
})
