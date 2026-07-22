// Call this once on the client to register the service worker.

"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const handleControllerChange = () => {
      if (sessionStorage.getItem("pull-test-sw-reloaded") === "1") {
        return;
      }

      sessionStorage.setItem("pull-test-sw-reloaded", "1");
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

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

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
    };
  }, []);

  return null;
}
