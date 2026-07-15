import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProceqSyncService } from './proceq-sync.service';
import { ProceqSyncConfigService } from './sync/proceq-sync.config';
import { WindowedRunner, WindowOutcome } from './sync/windowed-runner';
import { ProceqNotificationDispatcher } from './sync/proceq-notification-dispatcher.service';
import { SyncResult } from './interfaces/proceq-sync.interfaces';
import { CompanyMapper, CycleContext } from './sync/company-mapper';
import {
  CYCLE_TIMEOUT_MS,
  PROCEQ_SYNC_CRON_NAME,
} from './sync/proceq-sync.constants';
import { StructuredLogger, SyncEvent } from './sync/structured-logger';
import { ProceqCycleAbortedError, toError } from './sync/errors';

/** The mutable bookkeeping for the one cycle that may be running at a time. */
interface ActiveCycle {
  id: string;
  startedAt: number;
  abortController: AbortController;
}

/**
 * Cron entrypoint and cycle orchestrator for the multi-technician Proceq sync
 * (§5.3). Responsibilities:
 *
 * - **Kill-switch & dynamic registration (§5.5):** the job is registered at
 *   startup via {@link SchedulerRegistry} — not the `@Cron` decorator — so the
 *   interval can come from validated config and registration can be skipped
 *   entirely when `PROCEQ_SYNC_DISABLED` is set.
 * - **Overlap guard (§5.3):** a tick that fires while a cycle is still running
 *   is skipped ("skip-to-next-boundary"), so cycles never overlap.
 * - **Watchdog (§5.3):** a cycle running for >= 60 min is force-expired
 *   (its {@link AbortController} fires) so a hung cycle can never block future
 *   cycles indefinitely.
 * - **Windowed run + flush:** technicians are processed through a bounded
 *   sliding window ({@link WindowedRunner}) that folds results into one
 *   cycle-scoped {@link CompanyMapper}, flushed once at cycle end.
 *
 * The scheduler owns scheduling and lifecycle only; per-technician sync logic
 * lives in {@link ProceqSyncService} and sending in
 * {@link ProceqNotificationDispatcher}, keeping each component independently
 * replaceable.
 */
@Injectable()
export class ProceqSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new StructuredLogger(
    new Logger(ProceqSchedulerService.name),
  );

  /** The single in-progress cycle, or `null` when idle. */
  private activeCycle: ActiveCycle | null = null;

  constructor(
    private readonly syncService: ProceqSyncService,
    private readonly prisma: PrismaService,
    private readonly config: ProceqSyncConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly windowedRunner: WindowedRunner,
    private readonly dispatcher: ProceqNotificationDispatcher,
  ) {}

  /**
   * Registers the cron job dynamically from validated config, unless the
   * kill-switch is on. A `@Cron(...)` decorator argument is evaluated at
   * class-definition time (before ConfigModule is ready), so dynamic
   * registration is required to honour the env-configured interval (§5.3).
   */
  onModuleInit(): void {
    if (this.config.isCronDisabled()) {
      this.log.warn(SyncEvent.SCHEDULER_DISABLED, {
        reason: 'PROCEQ_SYNC_DISABLED',
      });
      return;
    }

    const intervalMinutes = this.config.getIntervalMinutes();
    const windowSize = this.config.getWindowSize();
    const cronTime = this.config.buildCronExpression(intervalMinutes);

    const job = CronJob.from({
      cronTime,
      onTick: () => {
        // Fire-and-forget: ticks must keep arriving on wall-clock boundaries
        // regardless of whether the previous cycle has settled — the overlap
        // guard inside handleProceqSync decides what to do.
        void this.handleProceqSync();
      },
      start: false,
    });

    this.schedulerRegistry.addCronJob(PROCEQ_SYNC_CRON_NAME, job);
    job.start();

    this.log.log(SyncEvent.SCHEDULER_REGISTERED, {
      cronTime,
      intervalMinutes,
      windowSize,
      cycleTimeoutMs: CYCLE_TIMEOUT_MS,
    });
  }

  /** Deregisters the cron and aborts any in-flight cycle on shutdown (§8.7). */
  onModuleDestroy(): void {
    try {
      this.schedulerRegistry.deleteCronJob(PROCEQ_SYNC_CRON_NAME);
    } catch {
      // Never registered (disabled) — nothing to remove.
    }
    this.activeCycle?.abortController.abort(
      new ProceqCycleAbortedError('Application shutting down', {}),
    );
  }

  /**
   * One full cycle over all technicians. Public so an operator can trigger a
   * one-off pass manually even when the automatic cron is disabled (§5.5).
   */
  async handleProceqSync(): Promise<void> {
    const now = Date.now();
    const active = this.activeCycle;

    // Overlap guard + watchdog (§5.3, Scenarios 2 & 10).
    if (active) {
      const elapsedMs = now - active.startedAt;
      if (elapsedMs < CYCLE_TIMEOUT_MS) {
        this.log.warn(SyncEvent.CYCLE_SKIP, {
          activeCycleId: active.id,
          elapsedMs,
          reason: 'previous-cycle-running',
        });
        return;
      }
      // Watchdog: the previous cycle exceeded the cap — force-expire it so it
      // cannot block new cycles forever, then start a fresh cycle on this tick.
      this.log.error(SyncEvent.CYCLE_WATCHDOG, {
        staleCycleId: active.id,
        elapsedMs,
        timeoutMs: CYCLE_TIMEOUT_MS,
      });
      active.abortController.abort(
        new ProceqCycleAbortedError('Cycle exceeded watchdog timeout', {
          cycleId: active.id,
          elapsedMs,
        }),
      );
    }

    const cycle: ActiveCycle = {
      id: randomUUID(),
      startedAt: now,
      abortController: new AbortController(),
    };
    this.activeCycle = cycle;

    const cycleLog = this.log.child({ cycleId: cycle.id });
    const mapper = new CompanyMapper();

    try {
      const emails = (
        await this.prisma.proceqToken.findMany({
          select: { operatorEmail: true },
        })
      ).map((token) => token.operatorEmail);

      const windowSize = this.config.getWindowSize();
      cycleLog.log(SyncEvent.CYCLE_START, {
        technicians: emails.length,
        windowSize,
      });

      if (emails.length === 0) {
        return;
      }

      const ctx: CycleContext = {
        cycleId: cycle.id,
        mapper,
        signal: cycle.abortController.signal,
      };

      const outcomes = await this.windowedRunner.run(
        emails,
        (email) => this.syncService.syncAllMeasurements(email, ctx),
        {
          windowSize,
          signal: cycle.abortController.signal,
          onSlotAllocated: (email, index) =>
            cycleLog.log(SyncEvent.SLOT_ALLOCATE, { technician: email, index }),
          onSlotReleased: (outcome) =>
            cycleLog.log(SyncEvent.SLOT_RELEASE, {
              technician: outcome.item,
              status: outcome.status,
            }),
        },
      );

      // Watchdog abort: discard the (possibly partial) mapper — do NOT flush
      // its notifications (Scenario 10). Persisted rows are safe (idempotent
      // upserts); unfinished work is re-detected by the next cycle's diff.
      if (cycle.abortController.signal.aborted) {
        cycleLog.error(SyncEvent.CYCLE_ABORTED, {
          note: 'mapper-discarded',
        });
        return;
      }

      await this.dispatcher.flush(mapper, cycle.id);

      this.logCycleSummary(cycleLog, cycle, mapper, outcomes);
    } catch (error) {
      cycleLog.error(SyncEvent.FAILURE, {
        phase: 'cycle',
        message: toError(error).stack ?? toError(error).message,
      });
    } finally {
      cycleLog.log(SyncEvent.CYCLE_END, {
        durationMs: Date.now() - cycle.startedAt,
        aborted: cycle.abortController.signal.aborted,
      });
      // Race-safe release: only clear the flag if this cycle still owns it. A
      // zombie cycle that settles after being force-expired must not clear a
      // newer cycle that now owns the slot.
      if (this.activeCycle === cycle) {
        this.activeCycle = null;
      }
    }
  }

  /** Emits the per-cycle observability summary (§8.6). */
  private logCycleSummary(
    cycleLog: StructuredLogger,
    cycle: ActiveCycle,
    mapper: CompanyMapper,
    outcomes: Array<WindowOutcome<string, SyncResult>>,
  ): void {
    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    let newMeasurements = 0;
    let updatedMeasurements = 0;
    let failedBatches = 0;

    for (const outcome of outcomes) {
      const result = outcome.status === 'fulfilled' ? outcome.value : undefined;
      if (!result) {
        failed++;
        continue;
      }
      if (result.skipped) {
        skipped++;
        continue;
      }
      if (result.success) succeeded++;
      else failed++;
      newMeasurements += result.newMeasurements;
      updatedMeasurements += result.updatedMeasurements;
      failedBatches += result.failedBatches;
    }

    cycleLog.log(SyncEvent.CYCLE_SUMMARY, {
      durationMs: Date.now() - cycle.startedAt,
      techniciansAttempted: outcomes.length,
      techniciansSucceeded: succeeded,
      techniciansFailed: failed,
      techniciansSkipped: skipped,
      newMeasurements,
      updatedMeasurements,
      failedBatches,
      companiesNotified: mapper.companyCount,
      statusChanges: mapper.statusChangeCount,
    });
  }
}
