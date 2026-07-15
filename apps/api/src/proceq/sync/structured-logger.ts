import { Logger } from '@nestjs/common';

export type LogContext = Record<string, unknown>;

/**
 * Canonical event names for the sync pipeline. Using a fixed vocabulary keeps
 * logs greppable and lets downstream tooling key off `event=...`.
 */
export const SyncEvent = {
  CYCLE_START: 'cycle.start',
  CYCLE_END: 'cycle.end',
  CYCLE_SUMMARY: 'cycle.summary',
  CYCLE_SKIP: 'cycle.skip',
  CYCLE_WATCHDOG: 'cycle.watchdog',
  CYCLE_ABORTED: 'cycle.aborted',
  SCHEDULER_REGISTERED: 'scheduler.registered',
  SCHEDULER_DISABLED: 'scheduler.disabled',
  TECHNICIAN_START: 'technician.start',
  TECHNICIAN_FINISH: 'technician.finish',
  TECHNICIAN_SKIP: 'technician.skip',
  TECHNICIAN_FAIL: 'technician.fail',
  SLOT_ALLOCATE: 'window.slot.allocate',
  SLOT_RELEASE: 'window.slot.release',
  API_REQUEST: 'api.request',
  API_RESPONSE: 'api.response',
  PAGINATION: 'pagination',
  DIFF: 'diff',
  BATCH: 'batch',
  EXPORT_CREATE: 'export.create',
  EXPORT_POLL: 'export.poll',
  DOWNLOAD: 'download',
  EXTRACTION: 'extraction',
  UPSERT: 'db.upsert',
  NOTIFY_AGGREGATE: 'notify.aggregate',
  NOTIFY_DISPATCH: 'notify.dispatch',
  RETRY: 'retry',
  RECOVERY: 'recovery',
  WARNING: 'warning',
  FAILURE: 'failure',
} as const;

export type SyncEventName = (typeof SyncEvent)[keyof typeof SyncEvent];

/** Serializes an event plus context into a single structured, greppable line. */
export function formatEvent(event: string, ctx: LogContext = {}): string {
  const parts = Object.entries(ctx)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const rendered =
        typeof value === 'object' ? JSON.stringify(value) : String(value);
      return `${key}=${rendered}`;
    });
  return [`event=${event}`, ...parts].join(' ');
}

/**
 * Thin wrapper over the Nest {@link Logger} that emits structured event lines
 * and carries a base context (e.g. `{ cycleId }` or `{ cycleId, technician }`)
 * so every child log is self-identifying without repeating boilerplate.
 */
export class StructuredLogger {
  constructor(
    private readonly logger: Logger,
    private readonly base: LogContext = {},
  ) {}

  /** Derives a logger that inherits this one's context plus `ctx`. */
  child(ctx: LogContext): StructuredLogger {
    return new StructuredLogger(this.logger, { ...this.base, ...ctx });
  }

  log(event: SyncEventName | string, ctx: LogContext = {}): void {
    this.logger.log(formatEvent(event, { ...this.base, ...ctx }));
  }

  warn(event: SyncEventName | string, ctx: LogContext = {}): void {
    this.logger.warn(formatEvent(event, { ...this.base, ...ctx }));
  }

  error(event: SyncEventName | string, ctx: LogContext = {}): void {
    this.logger.error(formatEvent(event, { ...this.base, ...ctx }));
  }

  debug(event: SyncEventName | string, ctx: LogContext = {}): void {
    this.logger.debug(formatEvent(event, { ...this.base, ...ctx }));
  }
}
