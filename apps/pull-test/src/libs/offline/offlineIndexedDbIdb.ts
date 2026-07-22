import { DBSchema, IDBPDatabase, openDB } from 'idb';

const DB_NAME = 'pull-test-offline';
const DB_VERSION = 1;

export const BOLT_RESULTS_STORE = 'boltResults';
export const HAZARDS_STORE = 'hazards';
export const SNAPSHOTS_STORE = 'snapshots';

export const BOLT_RESULTS_COMPANY_SITE_INDEX = 'boltResultsCompanyIndex';
export const HAZARDS_COMPANY_INDEX = 'hazardsCompanyIndex';

type BoltResultStoredValue = {
  id: string;
  companySiteKey?: string;
  [key: string]: unknown;
};

type HazardStoredValue = {
  id: string;
  companyKey?: string;
  [key: string]: unknown;
};

type SnapshotStoredValue = {
  key: string;
  [key: string]: unknown;
};

interface OfflineDbSchema extends DBSchema {
  [BOLT_RESULTS_STORE]: {
    key: string;
    value: BoltResultStoredValue;
    indexes: {
      [BOLT_RESULTS_COMPANY_SITE_INDEX]: string;
    };
  };
  [HAZARDS_STORE]: {
    key: string;
    value: HazardStoredValue;
    indexes: {
      [HAZARDS_COMPANY_INDEX]: string;
    };
  };
  [SNAPSHOTS_STORE]: {
    key: string;
    value: SnapshotStoredValue;
  };
}

// Opens the IndexedDB database and ensures required stores/indexes exist before any offline read/write.
export function openOfflineDb(): Promise<IDBPDatabase<OfflineDbSchema>> {
  return openDB<OfflineDbSchema>(DB_NAME, DB_VERSION, {
    upgrade(db, _v1, _v2, transaction) {
      const boltResultsStore = db.objectStoreNames.contains(BOLT_RESULTS_STORE)
        ? transaction.objectStore(BOLT_RESULTS_STORE)
        : db.createObjectStore(BOLT_RESULTS_STORE, { keyPath: 'id' });

      if (
        boltResultsStore &&
        !boltResultsStore.indexNames.contains(BOLT_RESULTS_COMPANY_SITE_INDEX)
      ) {
        boltResultsStore.createIndex(
          BOLT_RESULTS_COMPANY_SITE_INDEX,
          'companySiteKey',
          {
            unique: false,
          },
        );
      }

      const hazardsStore = db.objectStoreNames.contains(HAZARDS_STORE)
        ? transaction.objectStore(HAZARDS_STORE)
        : db.createObjectStore(HAZARDS_STORE, { keyPath: 'id' });

      if (
        hazardsStore &&
        !hazardsStore.indexNames.contains(HAZARDS_COMPANY_INDEX)
      ) {
        hazardsStore.createIndex(HAZARDS_COMPANY_INDEX, 'companyKey', {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(SNAPSHOTS_STORE)) {
        db.createObjectStore(SNAPSHOTS_STORE, { keyPath: 'key' });
      }
    },
  });
}

// Reads all records for a specific index key to support fast indexed offline lookups.
export function getAllByIndex<T>(
  index: { getAll: (query?: any) => Promise<unknown[]> },
  key: IDBValidKey,
): Promise<T[]> {
  return index.getAll(key) as Promise<T[]>;
}

// Reads every record from a store so non-indexed fallback queries can still derive offline data.
export function getAllFromStore<T>(store: { getAll: () => Promise<unknown[]> }): Promise<T[]> {
  return store.getAll() as Promise<T[]>;
}

// Wraps IndexedDB put operations in a Promise so writes can be awaited in async flows.
export async function putValue(
  store: { put: (value: any, key?: any) => Promise<unknown> },
  value: unknown,
): Promise<void> {
  await store.put(value);
}
