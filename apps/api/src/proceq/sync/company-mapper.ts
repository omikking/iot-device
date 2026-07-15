import {
  CompanyBucket,
  MeasurementSummaryItem,
  StatusChangeNotification,
} from './sync.types';

/**
 * Cycle-scoped, company-keyed accumulator (§5.2).
 *
 * Every `syncAllMeasurements` call in a cycle folds its results into ONE shared
 * mapper, so results are grouped per company across the whole cycle rather than
 * per export-batch/technician. At cycle end the scheduler flushes the mapper,
 * yielding exactly one consolidated measurement-completion email per company
 * (Flow 1) plus one alert per alarmed status change (Flow 2).
 *
 * The mapper only accumulates — plan validation, recipient resolution and the
 * actual send stay in the communication layer, invoked at flush time.
 *
 * Not injectable: a fresh instance is created per cycle so state never leaks
 * between cycles (a discarded/aborted cycle simply drops its mapper).
 */
export class CompanyMapper {
  private readonly buckets = new Map<string, CompanyBucket>();

  /** Records a completed (measured) measurement for a company. */
  addMeasured(companyId: string, item: MeasurementSummaryItem): void {
    this.bucket(companyId).measured.push(item);
  }

  /** Records an in-progress (not-measured) measurement for a company. */
  addNotMeasured(companyId: string, item: MeasurementSummaryItem): void {
    this.bucket(companyId).notMeasured.push(item);
  }

  /** Records a status-change alert for a company (Flow 2 material). */
  addStatusChange(change: StatusChangeNotification): void {
    this.bucket(change.companyId).statusChanges.push(change);
  }

  /** All accumulated company buckets (iteration order = first-seen order). */
  getBuckets(): CompanyBucket[] {
    return [...this.buckets.values()];
  }

  /** Number of distinct companies that accumulated at least one entry. */
  get companyCount(): number {
    return this.buckets.size;
  }

  /** Total status changes across all companies (for the cycle summary). */
  get statusChangeCount(): number {
    let count = 0;
    for (const bucket of this.buckets.values()) {
      count += bucket.statusChanges.length;
    }
    return count;
  }

  isEmpty(): boolean {
    return this.buckets.size === 0;
  }

  private bucket(companyId: string): CompanyBucket {
    let bucket = this.buckets.get(companyId);
    if (!bucket) {
      bucket = {
        companyId,
        measured: [],
        notMeasured: [],
        statusChanges: [],
      };
      this.buckets.set(companyId, bucket);
    }
    return bucket;
  }
}

/**
 * The mutable state threaded through a single cycle: the shared company mapper
 * and the cycle's abort signal (§5.3). Passed into every `syncAllMeasurements`
 * call so technicians accumulate into one mapper and observe one cancellation.
 */
export interface CycleContext {
  cycleId: string;
  mapper: CompanyMapper;
  signal: AbortSignal;
}
