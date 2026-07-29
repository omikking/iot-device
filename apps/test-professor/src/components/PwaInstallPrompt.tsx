import { useState, useEffect } from 'react';
import { saveToDB, loadFromDB } from '../hooks/useIndexedDB';

const PWA_DISMISS_KEY = 'pwa-install-dismissed';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function isInstalledPwa(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (isInstalledPwa()) return;

      const dismissed = await loadFromDB<boolean>(PWA_DISMISS_KEY);
      if (!cancelled && !dismissed) setReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const onInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [ready]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      await saveToDB(PWA_DISMISS_KEY, true);
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = async () => {
    await saveToDB(PWA_DISMISS_KEY, true);
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 p-4 bg-surface border border-border rounded-xl shadow-card w-72">
      <div>
        <h3 className="font-semibold text-text">Install Professor</h3>
        <p className="text-sm text-text-muted mt-1">
          Install the Professor app on your device for offline access, faster launch, and a native
          experience with Web Bluetooth.
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text hover:bg-surface-alt rounded-lg transition-colors"
        >
          Not Now
        </button>
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-4 py-1.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg shadow-sm transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}
