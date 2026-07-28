import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase, StoreNames } from 'idb';

interface OpticBoltDB extends DBSchema {
  opticBoltStore: {
    key: string;
    value: unknown;
  };
  hydraboltStore: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<OpticBoltDB>>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<OpticBoltDB>('optic-bolt-db', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('opticBoltStore')) {
          db.createObjectStore('opticBoltStore');
        }
        if (!db.objectStoreNames.contains('hydraboltStore')) {
          db.createObjectStore('hydraboltStore');
        }
      },
    });
  }
  return dbPromise;
};

export const saveToDB = async (
  key: string,
  value: unknown,
  storeName: StoreNames<OpticBoltDB> = 'opticBoltStore',
) => {
  try {
    const db = await initDB();
    await db.put(storeName, value, key);
  } catch (error) {
    console.error(`Failed to save to IndexedDB (${storeName})`, error);
  }
};

export const loadFromDB = async <T>(
  key: string,
  storeName: StoreNames<OpticBoltDB> = 'opticBoltStore',
): Promise<T | null> => {
  try {
    const db = await initDB();
    const value = await db.get(storeName, key);
    return (value as T) ?? null;
  } catch (error) {
    console.error(`Failed to load from IndexedDB (${storeName})`, error);
    return null;
  }
};

export const CACHE_KEYS = {
  testResults: 'test-results',
  spectrums: (serialNumber: string) => `spectrums-${serialNumber}`,
  hydrabolt: (partNumber: string) => `hydrabolt-${partNumber}`,
  pwaDismiss: 'pwa-install-dismissed',
  hasSynced: 'has-synced',
  latestSyncTimestamp: 'latest-sync-timestamp',
} as const; 