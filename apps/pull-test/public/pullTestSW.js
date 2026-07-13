/* pull-test/public/sw.js */

const SW_VERSION = "pull-test-v2";
const STATIC_CACHE = `${SW_VERSION}-static`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;
const GRAPHQL_CACHE = `${SW_VERSION}-graphql`;
const OFFLINE_URL = "/offline.html";

// Assets safe to pre-cache (adjust if you add/remove files)
const PRECACHE_URLS = ["/", OFFLINE_URL];

// On first install, take landing page and offline page right away so we
// always have something to show. skipWaiting means we don't hang around
// waiting for old tabs to close before taking over.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
    )
  );
});

// Clean up caches left behind by older versions of this SW.
// Anything not in our three known caches gets deleted.
// Then claim all open tabs so they switch to this SW straight away.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE, GRAPHQL_CACHE].includes(key))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// Turns a string into a short hex hash — used to build cache keys
// for GraphQL requests so we can store and look them up consistently.
async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Figures out a stable cache key for a GraphQL request.
// GET requests are keyed by URL, POST requests by their body (query + variables).
// We store them under /__sw__/graphql/ so they don't clash with real routes.
// Anything that isn't GET or POST we just skip caching entirely.
async function createGraphQLCacheKey(request) {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "POST") return { cacheable: false, key: null };

  const input = method === "GET" ? request.url : await request.clone().text();
  const hash = await sha256Hex(input);

  return { cacheable: true, key: new Request(`/__sw__/graphql/${hash}`) };
}

// Handles all GraphQL requests — always tries the network first.
// If the request succeeds we save a copy to the cache for later.
// If we're offline and have a cached version, serve that instead.
// If there's nothing cached either, return a proper GraphQL error
// shape with code OFFLINE so the UI can react to it gracefully.
async function handleGraphQL(request) {
  const { cacheable, key } = await createGraphQLCacheKey(request);
  const cache = await caches.open(GRAPHQL_CACHE);

  try {
    const networkResponse = await fetch(request);
    if (cacheable && key && networkResponse.ok) {
      await cache.put(key, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    if (cacheable && key) {
      const cached = await cache.match(key);
      if (cached) return cached;
    }

    const offlineMessage = cacheable
      ? "Offline and no cached GraphQL response is available."
      : "Offline and this GraphQL operation is not cacheable.";

    return new Response(
      JSON.stringify({
        data: null,
        errors: [
          {
            message: offlineMessage,
            extensions: { code: "OFFLINE" },
          },
        ],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Service-Worker": "graphql-offline-fallback",
        },
      }
    );
  }
}

// We store cached pages under /__sw__/pages/<path> rather than the real URL
// to avoid any accidental collision with the actual HTML responses in cache.
function createNavigationCacheKey(request) {
  const url = new URL(request.url);
  return new Request(`/__sw__/pages${url.pathname}${url.search}`);
}

// Every request goes through here. The rough order of what we do:
//   1. GraphQL  → network-first with cached fallback (see handleGraphQL)
//   2. Cross-origin or non-GET  → just let them through, we don't touch those
//   3. JS/CSS/images and Next static chunks  → serve cache immediately,
//      refresh in the background (stale-while-revalidate)
//   4. Pages  → try network first, fall back to cached version,
//      then the app shell, then the offline page, and finally a 503
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.pathname.endsWith("/graphql")) {
    event.respondWith(handleGraphQL(req));
    return;
  }

  // Only handle same-origin GET requests
  if (url.origin !== self.location.origin) return;

  // Ignore API and GraphQL calls (network-only behavior)
 // if (url.pathname.startsWith("/api")) return;

  // if (req.method !== "GET") return;

  // Static assets + Next build assets: stale-while-revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(req);
        const networkPromise = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => null);

        return cached || networkPromise || fetch(req);
      })()
    );
    return;
  }

  // Pages: network-first, fallback to cache, then offline page
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const navKey = req.mode === "navigate" ? createNavigationCacheKey(req) : null;
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200) {
          await cache.put(req, fresh.clone());
          if (navKey) {
            await cache.put(navKey, fresh.clone());
          }
        }
        return fresh;
      } catch {
        if (navKey) {
          const cachedNav = await cache.match(navKey);
          if (cachedNav) return cachedNav;
        }

        // Check all caches so install-time pre-cached entries (like "/") can be used.
        const cached = await caches.match(req);
        if (cached) return cached;

        // Only navigation requests should fall back to app shell/offline page.
        if (req.mode === "navigate") {
          const appShell = await caches.match("/");
          if (appShell) return appShell;

          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;

          return new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        }

        // Non-navigation requests should not receive offline HTML.
        return new Response("Offline resource unavailable", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }
    })()
  );
});