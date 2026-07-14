/**
 * A small, categorized error hierarchy for the Proceq sync. Categorizing errors
 * lets callers log with the right severity and decide retryability without
 * string-matching messages. Every error carries structured `context` so logs
 * can identify the technician / measurement / batch involved.
 *
 * These wrap failures at the sync package's own boundaries (export polling,
 * cycle abort, config validation). The deeper pipeline keeps its existing
 * try/catch semantics; nothing here changes what is caught or retried.
 */

export type ErrorContext = Record<string, unknown>;

/** Base for every error raised by the sync package. */
export abstract class ProceqSyncError extends Error {
  /** Whether retrying the same operation could plausibly succeed. */
  abstract readonly retryable: boolean;

  constructor(
    message: string,
    readonly context: ErrorContext = {},
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = new.target.name;
    if (options?.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
    // Preserve prototype chain when compiled to ES5-ish targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Invalid configuration / input detected before doing any work. */
export class ProceqValidationError extends ProceqSyncError {
  readonly retryable = false;
}

/** A technician's token is missing/rejected and needs human re-authorization. */
export class ProceqAuthError extends ProceqSyncError {
  readonly retryable = false;
}

/** Proceq returned an unexpected/failed API response. */
export class ProceqApiError extends ProceqSyncError {
  readonly retryable = true;
}

/** Proceq signalled rate limiting (HTTP 429). Retryable after a backoff. */
export class ProceqRateLimitError extends ProceqSyncError {
  readonly retryable = true;
}

/** A database read/write failed. */
export class ProceqDatabaseError extends ProceqSyncError {
  readonly retryable = true;
}

/** An export batch did not complete within {@link EXPORT_TIMEOUT_MS}. */
export class ProceqExportTimeoutError extends ProceqSyncError {
  readonly retryable = true;
}

/** Work was cancelled because the cycle's AbortController fired (§5.3). */
export class ProceqCycleAbortedError extends ProceqSyncError {
  readonly retryable = true;
}

/** True when an unknown error was raised by an aborted AbortSignal / axios. */
export function isAbortError(error: unknown): boolean {
  if (error instanceof ProceqCycleAbortedError) return true;
  const e = error as { name?: string; code?: string } | null;
  return (
    !!e &&
    (e.name === 'AbortError' ||
      e.name === 'CanceledError' ||
      e.code === 'ERR_CANCELED' ||
      e.code === 'ABORT_ERR')
  );
}

/** Normalizes any thrown value to an Error for consistent logging. */
export function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
