import { clientsClaim, skipWaiting } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
  cleanupOutdatedCaches,
  matchPrecache,
  precacheAndRoute,
} from "workbox-precaching";
import { registerRoute, setDefaultHandler } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { CacheFirst, NetworkFirst } from "workbox-strategies";

const SW_VERSION = "pull-test-v16";
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;
const OFFLINE_URL = "/offline.html";
const ORIGIN = location.origin;

// Activate updated workers immediately and take control of open clients.
skipWaiting();
clientsClaim();

// Precache the offline fallback page.
precacheAndRoute([
  { url: "/", revision: SW_VERSION },
  { url: OFFLINE_URL, revision: SW_VERSION },
]);

// Remove outdated Workbox precaches that no longer match current revision data.
cleanupOutdatedCaches();

// Remove older versioned runtime caches to prevent storage growth over releases.
self.addEventListener("activate", (event) => {
  (event as Event & { waitUntil: (promise: Promise<unknown>) => void }).waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const obsoleteRuntimeCaches = cacheNames.filter(
        (cacheName) =>
          cacheName.endsWith("-runtime") && cacheName !== RUNTIME_CACHE,
      );

      await Promise.all(
        obsoleteRuntimeCaches.map((cacheName) => caches.delete(cacheName)),
      );
    })(),
  );
});

// Cache key for full navigation URL (path + query).
function createNavigationCacheKey(request: Request): string {
  const url = new URL(request.url);
  return `${ORIGIN}/__sw__/pages${url.pathname}${url.search}`;
}

// Writes to cache should never break online responses.
async function safeCachePut(
  cache: Cache,
  key: RequestInfo | URL,
  response: Response,
): Promise<void> {
  try {
    await cache.put(key, response);
  } catch {
    // Ignore non-cacheable response errors and keep serving network response.
  }
}

// Fallback key for navigation path only.
function createNavigationPathOnlyCacheKey(request: Request): string {
  const url = new URL(request.url);
  return `${ORIGIN}/__sw__/pages${url.pathname}`;
}

// Avoid caching auth/worker utility routes as page shells.
function isCacheableNavigationPath(pathname: string): boolean {
  return (
    !pathname.startsWith("/api/auth") &&
    pathname !== OFFLINE_URL &&
    pathname !== "/workbox_pulltest.js" &&
    pathname !== "/pullTestSW.js"
  );
}

// Normalize volatile RSC params to improve cache hit rate.
function createRscCacheKey(request: Request): string {
  const url = new URL(request.url);
  // Next.js app-router adds volatile params; remove them for stable keys.
  url.searchParams.delete("_rsc");
  url.searchParams.delete("__nextDataReq");
  url.searchParams.delete("__flight__");
  return `${ORIGIN}/__sw__/rsc${url.pathname}${url.search}`;
}

// Cache Next.js RSC payloads with normalized keys.
registerRoute(
  ({ request, url }) => {
    if (request.method !== "GET" || url.origin !== ORIGIN) {
      return false;
    }

    return (
      url.searchParams.has("_rsc") ||
      url.searchParams.has("__nextDataReq") ||
      request.headers.get("RSC") === "1"
    );
  },
  async ({ request }) => {
    const cache = await caches.open(RUNTIME_CACHE);
    const key = createRscCacheKey(request);

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await safeCachePut(cache, key, networkResponse.clone());
      }
      return networkResponse;
    } catch {
      const cached = await cache.match(key);
      if (cached) {
        return cached;
      }

      return new Response("Offline resource unavailable", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
);

// Cache static assets first so JS/CSS/fonts/images are available offline.
registerRoute(
  ({ url }) =>
    url.origin === ORIGIN &&
    (url.pathname.startsWith("/_next/static/") ||
      /\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/.test(url.pathname)),
  new CacheFirst({
    cacheName: RUNTIME_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Use network-first for HTML navigation and fall back to cache offline.
registerRoute(
  ({ request, url }) =>
    url.origin === ORIGIN && request.mode === "navigate",
  async ({ request }) => {
    const cache = await caches.open(RUNTIME_CACHE);
    const requestUrl = new URL(request.url);
    const canCacheNavigation = isCacheableNavigationPath(requestUrl.pathname);
    const navKey = createNavigationCacheKey(request);
    const navPathOnlyKey = createNavigationPathOnlyCacheKey(request);

    try {
      const fresh = await fetch(request);
      if (fresh && fresh.status === 200 && canCacheNavigation) {
        await Promise.all([
          safeCachePut(cache, request, fresh.clone()),
          safeCachePut(cache, navKey, fresh.clone()),
          safeCachePut(cache, navPathOnlyKey, fresh.clone()),
        ]);
      }
      return fresh;
    } catch {
      if (canCacheNavigation) {
        const cachedNav = await cache.match(navKey);
        if (cachedNav) {
          return cachedNav;
        }

        const cachedPathOnlyNav = await cache.match(navPathOnlyKey);
        if (cachedPathOnlyNav) {
          return cachedPathOnlyNav;
        }
      }

      const cached = await caches.match(request);
      if (cached) {
        return cached;
      }

      const homePage = await matchPrecache("/");
      if (homePage) {
        return homePage;
      }

      const offlinePage = await matchPrecache(OFFLINE_URL);
      if (offlinePage) {
        return offlinePage;
      }

      return new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
);

// Fallback for unmatched same-origin GET requests.
setDefaultHandler(
  new NetworkFirst({
    cacheName: RUNTIME_CACHE,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
    networkTimeoutSeconds: 10,
  })
);
