import { Injectable } from '@nestjs/common';

/** Per-item outcome, mirroring `Promise.allSettled` but preserving the item. */
export interface WindowOutcome<T, R> {
  item: T;
  index: number;
  status: 'fulfilled' | 'rejected';
  value?: R;
  reason?: unknown;
}

export interface WindowRunOptions<T, R> {
  /** Max items processed concurrently. Floored at 1 by the caller (§5.1). */
  windowSize: number;
  /** When aborted, no further items are pulled into freed slots. */
  signal?: AbortSignal;
  /** Fired when a slot begins processing an item (window slot allocation). */
  onSlotAllocated?: (item: T, index: number) => void;
  /** Fired when a slot frees, regardless of success/failure (slot release). */
  onSlotReleased?: (outcome: WindowOutcome<T, R>) => void;
}

/**
 * A bounded-concurrency sliding-window worker pool (§5.1).
 *
 * Exactly `min(windowSize, items.length)` workers start; each worker, on
 * finishing an item, immediately pulls the next unclaimed index — so the pool
 * keeps `windowSize` items in flight until the queue drains, rather than
 * running in fixed barriers. A failure in one item is isolated (recorded as a
 * `rejected` outcome) and never stops the other in-flight items or the pool.
 *
 * With `windowSize = 1` this degenerates to strict sequential processing in
 * index order — the required lower-bound test configuration.
 *
 * Generic and side-effect free (beyond the callbacks), so it is reusable and
 * unit-testable independently of Proceq.
 */
@Injectable()
export class WindowedRunner {
  async run<T, R>(
    items: readonly T[],
    worker: (item: T, index: number) => Promise<R>,
    options: WindowRunOptions<T, R>,
  ): Promise<Array<WindowOutcome<T, R>>> {
    const total = items.length;
    const outcomes = new Array<WindowOutcome<T, R>>(total);
    const workerCount = Math.min(Math.max(1, options.windowSize), total);

    if (total === 0) return [];

    let cursor = 0;

    const runNext = async (): Promise<void> => {
      // Stop feeding new items once the cycle has been aborted; items already
      // in flight settle on their own (their own signal handling applies).
      while (cursor < total && !options.signal?.aborted) {
        const index = cursor++;
        const item = items[index];

        options.onSlotAllocated?.(item, index);

        let outcome: WindowOutcome<T, R>;
        try {
          const value = await worker(item, index);
          outcome = { item, index, status: 'fulfilled', value };
        } catch (reason) {
          // Isolation: record and continue — one item's failure must never
          // interrupt the others or stop the pool (Gap 8, Scenario 1).
          outcome = { item, index, status: 'rejected', reason };
        }

        outcomes[index] = outcome;
        options.onSlotReleased?.(outcome);
      }
    };

    await Promise.all(Array.from({ length: workerCount }, () => runNext()));

    // Compact any holes left when abort stopped the pull loop early.
    return outcomes.filter((outcome) => outcome !== undefined);
  }
}
