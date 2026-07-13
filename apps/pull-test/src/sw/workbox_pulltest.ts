import { clientsClaim, skipWaiting } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { matchPrecache, precacheAndRoute } from "workbox-precaching";
import { registerRoute, setDefaultHandler } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

const SW_VERSION = "pull-test-v1";
const GRAPHQL_CACHE = `${SW_VERSION}-graphql`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;
const OFFLINE_URL = "/offline.html";
const ORIGIN = location.origin;

// Activate updated workers immediately and take control of open clients.
skipWaiting();
clientsClaim();

// Pre-cache core shell pages used for first paint and offline fallback.
precacheAndRoute([
  { url: "/", revision: SW_VERSION },
  { url: "/overview", revision: SW_VERSION },
  { url: OFFLINE_URL, revision: SW_VERSION },
]);

// Hashes text input to build stable cache keys for GraphQL requests.
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Converts GraphQL GET/POST requests into deterministic synthetic cache keys.
async function createGraphQLCacheKey(
  request: Request
): Promise<{ cacheable: boolean; key: Request | null }> {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "POST") {
    return { cacheable: false, key: null };
  }

  const input = method === "GET" ? request.url : await request.clone().text();
  const hash = await sha256Hex(input);
  return { cacheable: true, key: new Request(`/__sw__/graphql/${hash}`) };
}

// Builds a cache key that includes navigation path and query string.
function createNavigationCacheKey(request: Request): Request {
  const url = new URL(request.url);
  return new Request(`/__sw__/pages${url.pathname}${url.search}`);
}

// Builds a fallback cache key that uses only the navigation pathname.
function createNavigationPathOnlyCacheKey(request: Request): Request {
  const url = new URL(request.url);
  return new Request(`/__sw__/pages${url.pathname}`);
}

// Normalizes volatile RSC request params so cached responses are reusable.
function createRscCacheKey(request: Request): Request {
  const url = new URL(request.url);
  // Next.js app-router adds volatile query params; strip them for stable cache hits.
  url.searchParams.delete("_rsc");
  url.searchParams.delete("__nextDataReq");
  url.searchParams.delete("__flight__");
  return new Request(`/__sw__/rsc${url.pathname}${url.search}`);
}

// Applies network-first caching for GraphQL with offline GraphQL-shaped fallback.
async function handleGraphQL(request: Request): Promise<Response> {
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
      if (cached) {
        return cached;
      }
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

// Matches GraphQL endpoint requests routed through the app API.
const graphQLMatch = ({ url }: { url: URL }): boolean =>
  url.pathname.endsWith("/graphql");

// Handle GraphQL requests for both GET and POST methods.
registerRoute(graphQLMatch, ({ request }) => handleGraphQL(request), "GET");
registerRoute(graphQLMatch, ({ request }) => handleGraphQL(request), "POST");

// Cache Next.js RSC payloads with normalized keys for better offline reuse.
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
        await cache.put(key, networkResponse.clone());
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

// Cache static assets with stale-while-revalidate for fast repeat loads.
registerRoute(
  ({ url }) =>
    url.origin === ORIGIN &&
    (url.pathname.startsWith("/_next/static/") ||
      /\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/.test(url.pathname)),
  new StaleWhileRevalidate({
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

// Use network-first for pages and progressively fall back to cached alternatives.
registerRoute(
  ({ request, url }) =>
    url.origin === ORIGIN && request.mode === "navigate",
  async ({ request }) => {
    const cache = await caches.open(RUNTIME_CACHE);
    const navKey = createNavigationCacheKey(request);
    const navPathOnlyKey = createNavigationPathOnlyCacheKey(request);

    try {
      const fresh = await fetch(request);
      if (fresh && fresh.status === 200) {
        await cache.put(request, fresh.clone());
        await cache.put(navKey, fresh.clone());
        await cache.put(navPathOnlyKey, fresh.clone());
      }
      return fresh;
    } catch {
      const cachedNav = await cache.match(navKey);
      if (cachedNav) {
        return cachedNav;
      }

      const cachedPathOnlyNav = await cache.match(navPathOnlyKey);
      if (cachedPathOnlyNav) {
        return cachedPathOnlyNav;
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

// Fallback strategy for unmatched same-origin GET requests.
setDefaultHandler(
  new NetworkFirst({
    cacheName: RUNTIME_CACHE,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
    networkTimeoutSeconds: 10,
  })
);
