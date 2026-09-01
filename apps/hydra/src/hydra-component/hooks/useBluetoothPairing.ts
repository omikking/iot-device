import { useCallback, useState } from 'react';

/**
 * Wraps the Web Bluetooth device picker. Kept separate from any
 * GraphQL/persistence concern so the pairing flow stays testable and
 * reusable independent of what happens after a device pairs.
 */
export function useBluetoothPairing() {
  const [isPairing, setIsPairing] = useState(false);

  const pair = useCallback(async (): Promise<BluetoothDevice | null> => {
    if (!navigator.bluetooth) {
      console.warn('Web Bluetooth is not supported in this browser.');
      return null;
    }

    setIsPairing(true);
    try {
      return await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });
    } catch {
      // User cancelled the picker or Bluetooth is unavailable — no further action.
      return null;
    } finally {
      setIsPairing(false);
    }
  }, []);

  return { pair, isPairing };
}
