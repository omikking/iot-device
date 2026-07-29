import { useState, useEffect } from 'react';

// Extend the Window interface to handle the beforeinstallprompt event properly
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If app is successfully installed, hide the prompt
    window.addEventListener('appinstalled', () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 p-4 bg-surface border border-border rounded-xl shadow-card w-72">
      <div>
        <h3 className="font-semibold text-text">Install App</h3>
        <p className="text-sm text-subtext mt-1">
          Install the Cyclops application on your device for offline access and a native experience.
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 text-sm font-medium text-subtext hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
        >
          Not Now
        </button>
        <button
          onClick={handleInstallClick}
          className="px-4 py-1.5 text-sm font-medium text-surface bg-accent hover:bg-accent/90 rounded-lg shadow-sm transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}
