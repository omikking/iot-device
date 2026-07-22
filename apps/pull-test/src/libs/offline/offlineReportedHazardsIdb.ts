import { BoltResult } from '@/gql/graphql';
import {
  HAZARDS_COMPANY_INDEX,
  HAZARDS_STORE,
  SNAPSHOTS_STORE,
  getAllByIndex,
  openOfflineDb,
  putValue,
} from '@/libs/offline/offlineIndexedDbIdb';
import { sortByMeasuredAtDesc } from '@/libs/offline/offlineBoltResultsIdb';

type StoredHazardResult = BoltResult & {
  companyId: string;
  companyKey: string;
  measuredAtMs: number;
};

export type OfflineHazardsPayload = {
  hazards: BoltResult[];
};

type OfflineHazardsSnapshot = {
  key: string;
  companyId: string;
  syncedAt: number;
  recordCount: number;
};

function buildHazardsSnapshotKey(companyId: string): string {
  return `hazards::${companyId}`;
}

function isReportedHazardRow(
  entry: Pick<BoltResult, 'isHazard' | 'hazardCompletedDate'>,
): boolean {
  if (entry.isHazard) {
    return true;
  }

  if (Array.isArray(entry.hazardCompletedDate)) {
    return entry.hazardCompletedDate.length > 0;
  }

  return Boolean(entry.hazardCompletedDate);
}

export async function saveOfflineHazardsSnapshots(
  companyId: string,
  hazards: BoltResult[],
): Promise<void> {
  const db = await openOfflineDb();

  try {
    const tx = db.transaction([HAZARDS_STORE, SNAPSHOTS_STORE], 'readwrite');
    const hazardsStore = tx.objectStore(HAZARDS_STORE);
    const snapshotsStore = tx.objectStore(SNAPSHOTS_STORE);

    await Promise.all(
      hazards.map((entry) => {
        const measuredAtMs = new Date(
          entry.measuredAt as string | number | Date,
        ).getTime();

        const stored: StoredHazardResult = {
          ...entry,
          companyId,
          companyKey: companyId,
          measuredAtMs,
        };

        return putValue(hazardsStore, stored);
      }),
    );

    const snapshot: OfflineHazardsSnapshot = {
      key: buildHazardsSnapshotKey(companyId),
      companyId,
      syncedAt: Date.now(),
      recordCount: hazards.length,
    };
    await putValue(snapshotsStore, snapshot);

    await tx.done;
  } finally {
    db.close();
  }
}

export async function hasOfflineHazardsSnapshot(companyId: string): Promise<boolean> {
  const db = await openOfflineDb();

  try {
    const tx = db.transaction([SNAPSHOTS_STORE], 'readonly');
    const store = tx.objectStore(SNAPSHOTS_STORE);
    const snapshot = await store.get(buildHazardsSnapshotKey(companyId));
    await tx.done;
    return !!snapshot;
  } finally {
    db.close();
  }
}

export async function queryOfflineHazardsByCompany(
  companyId: string,
): Promise<OfflineHazardsPayload | null> {
  const db = await openOfflineDb();

  let rows: StoredHazardResult[];

  try {
    const tx = db.transaction([HAZARDS_STORE], 'readonly');
    const store = tx.objectStore(HAZARDS_STORE);
    const index = store.index(HAZARDS_COMPANY_INDEX);

    rows = await getAllByIndex<StoredHazardResult>(index, companyId);
    await tx.done;
  } finally {
    db.close();
  }

  const hazards = rows
    .filter(isReportedHazardRow)
    .sort(sortByMeasuredAtDesc)
    .map(
      ({
        companyId: _companyId,
        companyKey: _companyKey,
        measuredAtMs: _measuredAtMs,
        ...boltResult
      }) => boltResult as BoltResult,
    );

  if (!hazards.length) {
    return null;
  }

  return { hazards };
}
