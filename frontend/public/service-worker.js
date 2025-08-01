// public/service-worker.js

const CACHE_NAME = "my-app-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/favicon.ico",
  // añade aquí rutas estáticas que quieras cachear
];

self.addEventListener("install", (event) => {
  // Instalamos el SW y precacheamos las URLs
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  // Limpiamos caches antiguas
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});

self.addEventListener("fetch", (event) => {
  // Respondemos con cache first, fallback a red
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
