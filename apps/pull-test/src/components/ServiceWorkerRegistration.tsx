// Call this once on the client to register the service worker.

"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/workbox_pulltest.js")
      .then((registration) => {
        registration.update().catch(() => {
          // Ignore update check failures so initial registration still succeeds.
        });
      })
      .catch((error: unknown) => {
        console.error("Service worker registration failed", error);
      });
  }, []);

  return null;
}
