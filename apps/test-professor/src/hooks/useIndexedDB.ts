import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface ProfessorDB extends DBSchema {
  professorStore: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<ProfessorDB>>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<ProfessorDB>('professor-db', 1, {
      upgrade(db) {
        db.createObjectStore('professorStore');
      },
    });
  }
  return dbPromise;
};

export const saveToDB = async (key: string, value: unknown) => {
  try {
    const db = await initDB();
    await db.put('professorStore', value, key);
  } catch (error) {
    console.error('Failed to save to IndexedDB', error);
  }
};

export const loadFromDB = async <T>(key: string): Promise<T | null> => {
  try {
    const db = await initDB();
    const value = await db.get('professorStore', key);
    return (value as T) ?? null;
  } catch (error) {
    console.error('Failed to load from IndexedDB', error);
    return null;
  }
};
