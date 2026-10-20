const CACHE_PREFIX = "dropmind-shell-";
const CACHE_NAME = "dropmind-shell-v3";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/css/dropmind.css",
  "/js/app/dropmind-app.js",
  "/js/client/api-client.js",
  "/js/core/selection-manager.js",
  "/js/interaction/long-press.js",
  "/js/ui/icons.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/favicon-rounded.ico"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  if (
    url.origin !== self.location.origin ||
    url.pathname === "/api" ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  const networkResponse = fetch(event.request);

  // La rete resta la fonte primaria; la cache serve soltanto offline.
  event.waitUntil(
    networkResponse
      .then(response => {
        if (!response.ok) return;

        return caches
          .open(CACHE_NAME)
          .then(cache => cache.put(event.request, response.clone()));
      })
      .catch(() => undefined)
  );

  event.respondWith(
    networkResponse.catch(() =>
      caches.match(event.request).then(response => response || Response.error())
    )
  );
});
