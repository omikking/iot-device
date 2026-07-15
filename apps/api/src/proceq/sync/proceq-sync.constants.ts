/**
 * Central tunables and configuration keys for the Proceq multi-technician
 * windowed sync. Values marked "fixed" are intentionally constants (see §5.5 of
 * docs/multiple-technician-proceq-flow.md); the env-backed knobs are resolved
 * and validated by {@link ProceqSyncConfigService}.
 */

/** Environment variable names that tune the scheduler (§5.5). */
export const ProceqSyncEnv = {
  /** Kill-switch for the automatic cronjob. Off (disabled) by default. */
  DISABLED: 'PROCEQ_SYNC_DISABLED',
  /** Max technicians synced concurrently within a cycle (integer >= 1). */
  WINDOW_SIZE: 'PROCEQ_SYNC_WINDOW_SIZE',
  /** Cron cadence in minutes (integer 1..60). */
  INTERVAL_MINUTES: 'PROCEQ_SYNC_INTERVAL_MINUTES',
} as const;

/** Defaults applied when an env value is missing or invalid (§5.5). */
export const ProceqSyncDefaults = {
  /** Sync is opt-in per environment — disabled unless explicitly enabled. */
  DISABLED: true,
  WINDOW_SIZE: 5,
  INTERVAL_MINUTES: 10,
} as const;

/** Bounds enforced on the env-configurable interval (§5.3, §5.5). */
export const INTERVAL_MIN_MINUTES = 1;
export const INTERVAL_MAX_MINUTES = 60;
/** Floor for the concurrency window so a bad value can never stall the pool. */
export const WINDOW_MIN_SIZE = 1;

/**
 * Watchdog cap on a single cycle (§5.3). Deliberately equal to the maximum
 * configurable interval and intentionally NOT an env var: it is a safety
 * backstop, and setting it below the interval or export timeouts could cause
 * overlapping work.
 */
export const CYCLE_TIMEOUT_MS = 60 * 60 * 1000; // 60 min

/** Measurements per export request / diff page (§4.4). */
export const BATCH_SIZE = 100;
/** Poll cadence for export status (§4.4). */
export const EXPORT_POLL_INTERVAL_MS = 3_000;
/** Max wait per export batch before throwing (§4.4). */
export const EXPORT_TIMEOUT_MS = 300_000; // 5 min

/** Rows per upsert transaction in {@link ProceqSyncService.bulkUpsertProceqData}. */
export const UPSERT_CHUNK_SIZE = 50;
/** Inner concurrency for background attachment processing (§5.1 caveat). */
export const ATTACHMENT_CONCURRENCY = 5;
/** Inner concurrency for per-measurement stats roll-up. */
export const STATS_CONCURRENCY = 5;
/** Inner concurrency for per-company notification dispatch. */
export const NOTIFICATION_CONCURRENCY = 5;

/** Stable name under which the cron job is registered in SchedulerRegistry. */
export const PROCEQ_SYNC_CRON_NAME = 'proceq-sync';
