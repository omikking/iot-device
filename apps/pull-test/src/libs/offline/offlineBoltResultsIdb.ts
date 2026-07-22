import { BoltResult } from '@/gql/graphql';
import {
  BOLT_RESULTS_COMPANY_SITE_INDEX,
  BOLT_RESULTS_STORE,
  SNAPSHOTS_STORE,
  getAllByIndex,
  getAllFromStore,
  openOfflineDb,
  putValue,
} from '@/libs/offline/offlineIndexedDbIdb';

type ResultFilter = 'PASS' | 'FAIL' | 'ABORT';

export type OfflineBoltResultsQuery = {
  companyId: string;
  siteId: string;
  levelId?: string;
  driveId?: string;
  locationId?: string;
  result?: ResultFilter[];
  isHazard?: boolean;
  withImage?: boolean;
  withComment?: boolean;
  startDate?: Date;
  endDate?: Date;
  offset?: number;
  limit?: number;
};

type SnapshotScope = {
  companyId: string;
  siteId: string;
  startDate?: Date;
  endDate?: Date;
};

type StoredBoltResult = BoltResult & {
  companyId: string;
  companySiteKey: string;
  hasImage: boolean;
  hasComment: boolean;
  measuredAtMs: number;
};

type OfflineSnapshot = {
  key: string;
  companyId: string;
  siteId: string;
  startDate: string | null;
  endDate: string | null;
  syncedAt: number;
};

export type OfflineBoltResultsPayload = {
  totalRecords: number;
  failedCount: number;
  hazardCount: number;
  passedCount: number;
  averageTons: number | null;
  results: BoltResult[];
};

export type OfflineCompanyHierarchy = {
  company: {
    id: string;
    name: string;
    sites: Array<{
      id: string;
      name: string;
      levels: Array<{
        id: string;
        name: string;
        drives: Array<{
          id: string;
          name: string;
          locations: Array<{
            id: string;
            name: string;
          }>;
        }>;
      }>;
    }>;
  } | null;
};

function buildCompanySiteKey(companyId: string, siteId: string): string {
  return `${companyId}::${siteId}`;
}

function toFiniteNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePeakLoads(peakLoad: unknown): number[] {
  if (!Array.isArray(peakLoad)) {
    return [];
  }

  return peakLoad
    .map((entry) => toFiniteNumber(entry))
    .filter((entry): entry is number => entry !== null);
}

function matchesDateRange(
  measuredAt: unknown,
  startDate?: Date,
  endDate?: Date,
): boolean {
  if (!startDate || !endDate) {
    return true;
  }

  const measuredAtDate = new Date(measuredAt as string | number | Date);
  if (Number.isNaN(measuredAtDate.getTime())) {
    return false;
  }

  return measuredAtDate >= startDate && measuredAtDate <= endDate;
}

export function sortByMeasuredAtDesc(
  a: { measuredAtMs: number },
  b: { measuredAtMs: number },
): number {
  return b.measuredAtMs - a.measuredAtMs;
}

function computeAverageTons(results: StoredBoltResult[]): number | null {
  const peakLoads = results.flatMap((entry) => normalizePeakLoads(entry.peakLoad));

  if (peakLoads.length === 0) {
    return null;
  }

  const sum = peakLoads.reduce((acc, load) => acc + load, 0);
  return Math.round(sum / peakLoads.length);
}

function toBoltResult(entry: StoredBoltResult): BoltResult {
  const {
    companyId: _companyId,
    companySiteKey: _companySiteKey,
    hasImage: _hasImage,
    hasComment: _hasComment,
    measuredAtMs: _measuredAtMs,
    ...boltResult
  } = entry;

  return boltResult;
}

export async function saveOfflineBoltResultSnapshot(
  scope: SnapshotScope,
  results: BoltResult[],
): Promise<void> {
  const companySiteKey = buildCompanySiteKey(scope.companyId, scope.siteId);
  const db = await openOfflineDb();

  try {
    const tx = db.transaction([BOLT_RESULTS_STORE, SNAPSHOTS_STORE], 'readwrite');
    const boltResultsStore = tx.objectStore(BOLT_RESULTS_STORE);
    const snapshotsStore = tx.objectStore(SNAPSHOTS_STORE);

    await Promise.all(
      results.map((entry) => {
        const stored: StoredBoltResult = {
          ...entry,
          companyId: scope.companyId,
          companySiteKey,
          hasImage: entry.image != null,
          hasComment: entry.comment != null,
          measuredAtMs: new Date(entry.measuredAt as string | number | Date).getTime(),
        };
        return putValue(boltResultsStore, stored);
      }),
    );

    const snapshot: OfflineSnapshot = {
      key: companySiteKey,
      companyId: scope.companyId,
      siteId: scope.siteId,
      startDate: scope.startDate ? new Date(scope.startDate).toISOString() : null,
      endDate: scope.endDate ? new Date(scope.endDate).toISOString() : null,
      syncedAt: Date.now(),
    };
    await putValue(snapshotsStore, snapshot);

    await tx.done;
  } finally {
    db.close();
  }
}

/*

export async function hasOfflineSnapshot(scope: SnapshotScope): Promise<boolean> {
  const db = await openOfflineDb();
  const key = buildCompanySiteKey(scope.companyId, scope.siteId);

  try {
    const tx = db.transaction([SNAPSHOTS_STORE], 'readonly');
    const store = tx.objectStore(SNAPSHOTS_STORE);
    const snapshotKey = await store.getKey(key);
    await tx.done;
    return !!snapshotKey;
  } finally {
    db.close();
  }
}
  */

export async function queryOfflineBoltResults(
  query: OfflineBoltResultsQuery,
): Promise<OfflineBoltResultsPayload | null> {
  const companySiteKey = buildCompanySiteKey(query.companyId, query.siteId);
  const db = await openOfflineDb();

  let rows: StoredBoltResult[];

  try {
    const tx = db.transaction([BOLT_RESULTS_STORE], 'readonly');
    const store = tx.objectStore(BOLT_RESULTS_STORE);
    const index = store.index(BOLT_RESULTS_COMPANY_SITE_INDEX);
    rows = await getAllByIndex<StoredBoltResult>(index, companySiteKey);
    await tx.done;
  } finally {
    db.close();
  }

  if (!rows.length) {
    return null;
  }

  const resultFilter = query.result?.length ? new Set(query.result) : null;

  const filtered = rows
    .filter((entry) => {
      if (query.levelId && entry.levelId !== query.levelId) {
        return false;
      }
      if (query.driveId && entry.driveId !== query.driveId) {
        return false;
      }
      if (query.locationId && entry.locationId !== query.locationId) {
        return false;
      }
      if (resultFilter && !resultFilter.has(entry.result as ResultFilter)) {
        return false;
      }
      if (typeof query.isHazard === 'boolean' && entry.isHazard !== query.isHazard) {
        return false;
      }
      if (query.withImage === true && !entry.hasImage) {
        return false;
      }
      if (query.withComment === true && !entry.hasComment) {
        return false;
      }

      return matchesDateRange(entry.measuredAt, query.startDate, query.endDate);
    })
    .sort(sortByMeasuredAtDesc);

  const totalRecords = filtered.length;
  const failedCount = filtered.filter((entry) => entry.result === 'FAIL').length;
  const passedCount = filtered.filter((entry) => entry.result === 'PASS').length;
  const hazardCount = filtered.filter((entry) => entry.isHazard === true).length;
  const averageTons = computeAverageTons(filtered);

  const offset = query.offset ?? 0;
  const limit = query.limit ?? totalRecords;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    totalRecords,
    failedCount,
    passedCount,
    hazardCount,
    averageTons,
    results: paginated.map(toBoltResult),
  };
}

export async function queryOfflineCompanyHierarchy(
  companyId: string,
): Promise<OfflineCompanyHierarchy | null> {
  const db = await openOfflineDb();

  let rows: StoredBoltResult[];

  try {
    const tx = db.transaction([BOLT_RESULTS_STORE], 'readonly');
    const store = tx.objectStore(BOLT_RESULTS_STORE);
    rows = await getAllFromStore<StoredBoltResult>(store);
    await tx.done;
  } finally {
    db.close();
  }

  const companyRows = rows.filter((entry) => entry.companyId === companyId);
  if (!companyRows.length) {
    return null;
  }

  const siteMap = new Map<
    string,
    {
      id: string;
      name: string;
      levelsMap: Map<
        string,
        {
          id: string;
          name: string;
          drivesMap: Map<
            string,
            {
              id: string;
              name: string;
              locationsMap: Map<string, { id: string; name: string }>;
            }
          >;
        }
      >;
    }
  >();

  for (const row of companyRows) {
    if (!row.siteId || !row.levelId || !row.driveId || !row.locationId) {
      continue;
    }

    const siteName = row.site?.siteName ?? row.siteId;
    const levelName = row.level?.levelName ?? row.levelId;
    const driveName = row.drive?.driveName ?? row.driveId;
    const locationName = row.location?.locationName ?? row.locationId;

    if (!siteMap.has(row.siteId)) {
      siteMap.set(row.siteId, {
        id: row.siteId,
        name: siteName,
        levelsMap: new Map(),
      });
    }

    const siteEntry = siteMap.get(row.siteId);
    if (!siteEntry) {
      continue;
    }

    if (!siteEntry.levelsMap.has(row.levelId)) {
      siteEntry.levelsMap.set(row.levelId, {
        id: row.levelId,
        name: levelName,
        drivesMap: new Map(),
      });
    }

    const levelEntry = siteEntry.levelsMap.get(row.levelId);
    if (!levelEntry) {
      continue;
    }

    if (!levelEntry.drivesMap.has(row.driveId)) {
      levelEntry.drivesMap.set(row.driveId, {
        id: row.driveId,
        name: driveName,
        locationsMap: new Map(),
      });
    }

    const driveEntry = levelEntry.drivesMap.get(row.driveId);
    if (!driveEntry) {
      continue;
    }

    if (!driveEntry.locationsMap.has(row.locationId)) {
      driveEntry.locationsMap.set(row.locationId, {
        id: row.locationId,
        name: locationName,
      });
    }
  }

  const sites = Array.from(siteMap.values()).map((siteEntry) => ({
    id: siteEntry.id,
    name: siteEntry.name,
    levels: Array.from(siteEntry.levelsMap.values()).map((levelEntry) => ({
      id: levelEntry.id,
      name: levelEntry.name,
      drives: Array.from(levelEntry.drivesMap.values()).map((driveEntry) => ({
        id: driveEntry.id,
        name: driveEntry.name,
        locations: Array.from(driveEntry.locationsMap.values()),
      })),
    })),
  }));

  return {
    company: {
      id: companyId,
      name: '',
      sites,
    },
  };
}
