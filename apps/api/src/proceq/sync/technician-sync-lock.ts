import { Injectable } from '@nestjs/common';

/**
 * Per-technician (per-`operatorEmail`) mutual-exclusion lock (§5.1, Scenario 9).
 *
 * Replaces the old service-wide `isSyncing` boolean, which allowed only ONE
 * technician to sync at a time across the whole app and would have collapsed
 * the concurrency window to 1. This lock instead guarantees only that the SAME
 * technician is never synced twice concurrently, while permitting many
 * different technicians to run in parallel.
 *
 * Deliberately in-process: a cycle runs inside a single Node process, so a
 * Set is sufficient and avoids the cost/complexity of a distributed lock.
 */
@Injectable()
export class TechnicianSyncLock {
  private readonly inFlight = new Set<string>();

  /**
   * Attempts to acquire the lock for a technician.
   * @returns `true` if acquired, `false` if that technician is already syncing.
   */
  tryAcquire(operatorEmail: string): boolean {
    if (this.inFlight.has(operatorEmail)) {
      return false;
    }
    this.inFlight.add(operatorEmail);
    return true;
  }

  /** Releases the lock. Safe to call even if not held (idempotent). */
  release(operatorEmail: string): void {
    this.inFlight.delete(operatorEmail);
  }

  isLocked(operatorEmail: string): boolean {
    return this.inFlight.has(operatorEmail);
  }

  /** Number of technicians currently holding the lock (diagnostics/tests). */
  get activeCount(): number {
    return this.inFlight.size;
  }
}
