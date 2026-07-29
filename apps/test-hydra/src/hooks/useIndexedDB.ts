import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface HydraDB extends DBSchema {
  hydraStore: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<HydraDB>>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<HydraDB>('hydra-db', 1, {
      upgrade(db) {
        db.createObjectStore('hydraStore');
      },
    });
  }
  return dbPromise;
};

export const saveToDB = async (key: string, value: unknown) => {
  try {
    const db = await initDB();
    await db.put('hydraStore', value, key);
  } catch (error) {
    console.error('Failed to save to IndexedDB', error);
  }
};

export const loadFromDB = async <T>(key: string): Promise<T | null> => {
  try {
    const db = await initDB();
    const value = await db.get('hydraStore', key);
    return (value as T) ?? null;
  } catch (error) {
    console.error('Failed to load from IndexedDB', error);
    return null;
  }
};
