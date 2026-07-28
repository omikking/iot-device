import { ProceqStatus } from '@prisma/client';

/**
 * The outcome of comparing a freshly-fetched measurement against what the DB
 * already holds (§5.4). Drives whether a measurement is exported/persisted.
 */
export enum SyncDecision {
  /** Not present in the DB — insert it. */
  NEW = 'NEW',
  /** Present, and the incoming record is strictly newer — reprocess it. */
  UPDATED = 'UPDATED',
  /** Present and equal, older, or undecidable — leave the stored row as-is. */
  SKIP = 'SKIP',
}

/**
 * A single measurement in the consolidated Flow 1 (measurement-completion)
 * summary. Structurally compatible with the email layer's
 * `ProceqMeasurementSummaryItem`, kept local so the sync package does not
 * depend on the email module's types.
 */
export interface MeasurementSummaryItem {
  serialNumber: string;
  bansheeName: string | null;
  measurementId: string;
  status: string;
}

/**
 * A Flow 2 (status-change) alert, fully resolved at accumulation time so the
 * cycle-end flush needs no further DB lookups. `activateNotifications` carries
 * the per-Banshee alarm toggle so the dispatcher can gate the send exactly as
 * the inline flow did.
 */
export interface StatusChangeNotification {
  companyId: string;
  serialNumber: string;
  bansheeName: string | null;
  measurementId: string;
  previousStatus: ProceqStatus;
  newStatus: ProceqStatus;
  activateNotifications: boolean;
}

/**
 * Cycle-scoped accumulator for one company (§5.2). Every technician in the
 * cycle folds its results into the shared bucket keyed by `companyId`, so a
 * company receives exactly one consolidated email per cycle.
 */
export interface CompanyBucket {
  companyId: string;
  measured: MeasurementSummaryItem[];
  notMeasured: MeasurementSummaryItem[];
  statusChanges: StatusChangeNotification[];
}

/**
 * Aggregate, cycle-level outcome numbers for the end-of-cycle summary log
 * (§8.6 observability). Purely descriptive — carries no control flow.
 */
export interface CycleSummary {
  cycleId: string;
  durationMs: number;
  techniciansAttempted: number;
  techniciansSucceeded: number;
  techniciansFailed: number;
  techniciansSkipped: number;
  newMeasurements: number;
  updatedMeasurements: number;
  failedBatches: number;
  companiesNotified: number;
  statusChanges: number;
  aborted: boolean;
}
