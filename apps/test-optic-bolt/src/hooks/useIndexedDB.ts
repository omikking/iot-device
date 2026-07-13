import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface OpticBoltDB extends DBSchema {
  opticBoltStore: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<OpticBoltDB>>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<OpticBoltDB>('optic-bolt-db', 1, {
      upgrade(db) {
        db.createObjectStore('opticBoltStore');
      },
    });
  }
  return dbPromise;
};

export const saveToDB = async (key: string, value: unknown) => {
  try {
    const db = await initDB();
    await db.put('opticBoltStore', value, key);
  } catch (error) {
    console.error('Failed to save to IndexedDB', error);
  }
};

export const loadFromDB = async <T>(key: string): Promise<T | null> => {
  try {
    const db = await initDB();
    const value = await db.get('opticBoltStore', key);
    return (value as T) ?? null;
  } catch (error) {
    console.error('Failed to load from IndexedDB', error);
    return null;
  }
};

export const CACHE_KEYS = {
  testResults: 'test-results',
  spectrums: (serialNumber: string) => `spectrums-${serialNumber}`,
  pwaDismiss: 'pwa-install-dismissed',
  hasSynced: 'has-synced',
  latestSyncTimestamp: 'latest-sync-timestamp',
} as const;

 