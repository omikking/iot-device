import { SyncDecision } from './sync.types';

/**
 * Decides whether a freshly-fetched Proceq measurement should be inserted,
 * reprocessed, or skipped, based purely on timestamps (§5.4 / Scenario 3).
 *
 * This is the single behavioural gap fix from the target design: the previous
 * code reprocessed on ANY timestamp difference (`!==`); the target reprocesses
 * only when the incoming record is **strictly newer** and skips stale/older
 * records.
 *
 * | In DB? | API `updatedAt` vs DB `updatedTimestamp` | Decision |
 * |--------|------------------------------------------|----------|
 * | No     | —                                        | NEW      |
 * | Yes    | strictly newer                           | UPDATED  |
 * | Yes    | equal                                    | SKIP     |
 * | Yes    | older / previous date                    | SKIP     |
 * | Yes    | undecidable (either timestamp missing)   | SKIP     |
 *
 * Pure and side-effect free so it is trivially unit-testable.
 */
export class TimestampComparator {
  /**
   * @param apiUpdatedAt         Proceq's `updatedAt` for the measurement (ISO
   *                             string) as returned by `getMeasurements`.
   * @param dbUpdatedTimestamp   The stored `ProceqData.updatedTimestamp`, or
   *                             `undefined` when the measurement is not in the
   *                             DB at all.
   */
  classify(
    apiUpdatedAt: string | null | undefined,
    dbUpdatedTimestamp: Date | null | undefined,
  ): SyncDecision {
    // Not present in the DB → brand new (3.1).
    if (dbUpdatedTimestamp === undefined) {
      return SyncDecision.NEW;
    }

    const apiTime = this.toTime(apiUpdatedAt);
    const dbTime =
      dbUpdatedTimestamp === null ? null : dbUpdatedTimestamp.getTime();

    // Undecidable comparison → keep what we already have (fail safe).
    if (apiTime === null || dbTime === null) {
      return SyncDecision.SKIP;
    }

    // Reprocess ONLY when the incoming record is strictly newer (3.2).
    return apiTime > dbTime ? SyncDecision.UPDATED : SyncDecision.SKIP;
  }

  private toTime(value: string | null | undefined): number | null {
    if (!value) return null;
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  }
}
