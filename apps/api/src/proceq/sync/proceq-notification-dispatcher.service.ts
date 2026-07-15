import { Injectable, Logger } from '@nestjs/common';
import { BansheeCommunicationService } from '../../banshee-communication/banshee-communication.service';
import { CompanyMapper } from './company-mapper';
import { NOTIFICATION_CONCURRENCY } from './proceq-sync.constants';
import { StructuredLogger, SyncEvent } from './structured-logger';
import { toError } from './errors';

/**
 * Flushes the cycle's {@link CompanyMapper} into customer emails (§5.2).
 *
 * This is the ONLY place notifications are sent — the sync engine merely
 * accumulates. Flushing at cycle end (once the window drains) is what turns the
 * old "one email per company per batch/technician" into "one email per company
 * per cycle", eliminating duplicate emails when several technicians or batches
 * touch the same company (Scenario 8).
 *
 * The actual send — plan validation, recipient resolution, delivery — stays in
 * {@link BansheeCommunicationService}; this dispatcher only decides *what* to
 * send and drives bounded concurrency. Every send is isolated in its own
 * try/catch so one company's failure never blocks the rest of the flush.
 */
@Injectable()
export class ProceqNotificationDispatcher {
  private readonly nestLogger = new Logger(ProceqNotificationDispatcher.name);

  constructor(
    private readonly communicationService: BansheeCommunicationService,
  ) {}

  /**
   * Dispatches all accumulated notifications for a cycle.
   *
   * - Flow 1: one consolidated measurement-completion summary per company.
   * - Flow 2: one status-change alert per change whose Banshee has the alarm
   *   toggle (`activateNotifications`) enabled.
   */
  async flush(mapper: CompanyMapper, cycleId: string): Promise<void> {
    const logger = new StructuredLogger(this.nestLogger, { cycleId });

    if (mapper.isEmpty()) {
      logger.log(SyncEvent.NOTIFY_DISPATCH, { companies: 0, statusChanges: 0 });
      return;
    }

    const buckets = mapper.getBuckets();
    const totalStatusChanges = mapper.statusChangeCount;

    logger.log(SyncEvent.NOTIFY_DISPATCH, {
      phase: 'begin',
      companies: buckets.length,
      statusChanges: totalStatusChanges,
    });

    // Flow 1 — measurement completion summaries (one per company).
    await this.dispatchInBatches(
      buckets.filter(
        (bucket) => bucket.measured.length + bucket.notMeasured.length > 0,
      ),
      async (bucket) => {
        try {
          await this.communicationService.shareProceqMeasurementInsights({
            companyId: bucket.companyId,
            measured: bucket.measured,
            notMeasured: bucket.notMeasured,
          });
        } catch (error) {
          logger.error(SyncEvent.FAILURE, {
            flow: 'measurement-insights',
            companyId: bucket.companyId,
            message: toError(error).message,
          });
        }
      },
    );

    // Flow 2 — status-change alerts (one per alarmed change), flattened across
    // companies. Alarm gating mirrors the previous inline behaviour exactly.
    const alarmedChanges = buckets
      .flatMap((bucket) => bucket.statusChanges)
      .filter((change) => change.activateNotifications);

    await this.dispatchInBatches(alarmedChanges, async (change) => {
      try {
        await this.communicationService.shareProceqStatusChange({
          companyId: change.companyId,
          serialNumber: change.serialNumber,
          bansheeName: change.bansheeName,
          measurementId: change.measurementId,
          previousStatus: change.previousStatus,
          newStatus: change.newStatus,
        });
      } catch (error) {
        logger.error(SyncEvent.FAILURE, {
          flow: 'status-change',
          measurementId: change.measurementId,
          message: toError(error).message,
        });
      }
    });

    logger.log(SyncEvent.NOTIFY_DISPATCH, {
      phase: 'end',
      companies: buckets.length,
      alarmedStatusChanges: alarmedChanges.length,
    });
  }

  /** Runs `handler` over `items` in bounded-concurrency batches. */
  private async dispatchInBatches<T>(
    items: T[],
    handler: (item: T) => Promise<void>,
  ): Promise<void> {
    for (let i = 0; i < items.length; i += NOTIFICATION_CONCURRENCY) {
      const batch = items.slice(i, i + NOTIFICATION_CONCURRENCY);
      await Promise.allSettled(batch.map(handler));
    }
  }
}
