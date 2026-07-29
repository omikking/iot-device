import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  INTERVAL_MAX_MINUTES,
  INTERVAL_MIN_MINUTES,
  ProceqSyncDefaults,
  ProceqSyncEnv,
  WINDOW_MIN_SIZE,
} from './proceq-sync.constants';

/**
 * Resolves and validates the scheduler's environment-backed configuration
 * (§5.5). All parsing/clamping rules live here so the scheduler stays free of
 * env-string handling and the effective values can be unit-tested in isolation:
 *
 * - `PROCEQ_SYNC_DISABLED` — disabled by default (a missing value counts as
 *   disabled). Only `'true'`/`'1'` keep it disabled; set it to `'false'`
 *   (or `'0'`) to enable. Any other/unrecognized value is treated as enabled.
 * - `PROCEQ_SYNC_WINDOW_SIZE` — integer floored at 1; non-numeric/invalid falls
 *   back to the default.
 * - `PROCEQ_SYNC_INTERVAL_MINUTES` — integer clamped to 1..60; non-numeric/
 *   invalid falls back to the default.
 */
@Injectable()
export class ProceqSyncConfigService {
  constructor(private readonly config: ConfigService) {}

  /**
   * Whether the automatic cronjob must NOT be registered. Defaults to `true`
   * (disabled) so headless sync is always a deliberate opt-in per environment.
   */
  isCronDisabled(): boolean {
    const raw = String(
      this.config.get(ProceqSyncEnv.DISABLED) ??
        String(ProceqSyncDefaults.DISABLED),
    )
      .trim()
      .toLowerCase();
    return raw === 'true' || raw === '1';
  }

  /**
   * Max technicians processed concurrently within a cycle. Floored at 1 so a
   * bad value can never stall the pool entirely.
   */
  getWindowSize(): number {
    const parsed = Math.trunc(
      Number(this.config.get(ProceqSyncEnv.WINDOW_SIZE)),
    );
    const effective =
      Number.isFinite(parsed) && parsed > 0
        ? parsed
        : ProceqSyncDefaults.WINDOW_SIZE;
    return Math.max(WINDOW_MIN_SIZE, effective);
  }

  /** Cron cadence in minutes, clamped to the supported 1..60 range. */
  getIntervalMinutes(): number {
    const parsed = Math.trunc(
      Number(this.config.get(ProceqSyncEnv.INTERVAL_MINUTES)),
    );
    const effective =
      Number.isFinite(parsed) && parsed > 0
        ? parsed
        : ProceqSyncDefaults.INTERVAL_MINUTES;
    return Math.min(
      INTERVAL_MAX_MINUTES,
      Math.max(INTERVAL_MIN_MINUTES, effective),
    );
  }

  /**
   * Cron expression that fires on wall-clock minutes divisible by `minutes`
   * within each hour (§5.3). For values that do not divide 60 evenly the last
   * gap in the hour is shorter — acceptable for this use case.
   */
  buildCronExpression(minutes: number): string {
    return `0 */${minutes} * * * *`;
  }
}
