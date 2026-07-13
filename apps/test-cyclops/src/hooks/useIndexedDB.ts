import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface CyclopsDB extends DBSchema {
  cyclopsStore: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<CyclopsDB>>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<CyclopsDB>('cyclops-db', 1, {
      upgrade(db:any) {
        db.createObjectStore('cyclopsStore');
      },
    });
  }
  return dbPromise;
};

export const saveToDB = async (key: string, value: any) => {
  try {
    const db = await initDB();
    await db.put('cyclopsStore', value, key);
  } catch (error) {
    console.error('Failed to save to IndexedDB', error);
  }
};

export const loadFromDB = async <T>(key: string): Promise<T | null> => {
  try {
    const db = await initDB();
    const value = await db.get('cyclopsStore', key);
    return value as T;
  } catch (error) {
    console.error('Failed to load from IndexedDB', error);
    return null;
  }
};
