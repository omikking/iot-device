import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProceqApiService } from './proceq-api.service';
import { downloadAndSaveFile } from 'src/utils/downloadFile';
import { join } from 'path';
import { promises as fs } from 'fs';
import * as decompress from 'decompress';
import * as fsNode from 'fs';
import * as archiver from 'archiver';
import { BansheeStatsService } from '../banshee-stats/banshee-stats.service';
import { BansheeOrderService } from '../banshee-order/banshee-order.service';
import {
  ExtractedProceqFields,
  ExtractedProceqReading,
  UserPhotoEntry,
  SyncResult,
  BoltConstants,
  ProceqStatusChangeInfo,
} from './interfaces/proceq-sync.interfaces';
import { BansheeRequest, BoltType, ProceqStatus } from '@prisma/client';
import {
  BATCH_SIZE,
  EXPORT_POLL_INTERVAL_MS,
  EXPORT_TIMEOUT_MS,
  ATTACHMENT_CONCURRENCY,
  UPSERT_CHUNK_SIZE,
  STATS_CONCURRENCY,
} from './sync/proceq-sync.constants';
import { CompanyMapper, CycleContext } from './sync/company-mapper';
import { TechnicianSyncLock } from './sync/technician-sync-lock';
import { TimestampComparator } from './sync/timestamp-comparator';
import { ProceqNotificationDispatcher } from './sync/proceq-notification-dispatcher.service';
import { MeasurementSummaryItem, SyncDecision } from './sync/sync.types';
import {
  StructuredLogger,
  SyncEvent,
  formatEvent,
} from './sync/structured-logger';
import {
  ErrorContext,
  ProceqApiError,
  ProceqCycleAbortedError,
  ProceqExportTimeoutError,
  isAbortError,
  toError,
} from './sync/errors';

@Injectable()
export class ProceqSyncService {
  private readonly logger = new Logger(ProceqSyncService.name);

  constructor(
    private readonly api: ProceqApiService,
    private readonly prisma: PrismaService,
    private readonly statsService: BansheeStatsService,
    private readonly orderService: BansheeOrderService,
    private readonly lock: TechnicianSyncLock,
    private readonly comparator: TimestampComparator,
    private readonly dispatcher: ProceqNotificationDispatcher,
  ) {}

  private extractProceqFields(
    payload: Record<string, any>,
    measurementId: string,
  ): ExtractedProceqFields {
    const isApiResponse = !!payload?.data;

    let measurement: Record<string, any>,
      readings: any[],
      settings: any[],
      logs: any[];

    if (isApiResponse) {
      measurement = payload?.data?.measurement || {};
      readings = payload?.data?.readings || [];
      settings = payload?.data?.settings || [];
      logs = payload?.data?.logs || [];
      measurementId = measurement.id || measurementId || '';
    } else {
      measurement = payload?.measurement || {};
      readings = payload?.readings || [];
      settings = payload?.settings || [];
      logs = payload?.logs || [];
      measurementId = measurementId || measurement.id || '';
    }

    let comment: string | null = null;
    const userPhotos: UserPhotoEntry[] = [];

    for (const log of logs) {
      if (!log?.type) continue;

      switch (log.type) {
        case 'userText':
          comment = log.content?.comment || null;
          break;
        case 'userPhoto':
          userPhotos.push({
            attachmentId: log.content?.attachmentId || null,
            attachmentName: log.content?.attachmentName || null,
          });
          break;
      }
    }

    const temperatureMatch = comment?.match(
      /temperature[\s:=]*(-?\d+(?:\.\d+)?)/i,
    );
    const temperature = temperatureMatch ? Number(temperatureMatch[1]) : null;

    const firstSetting =
      Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
    const settingsSetupFile =
      firstSetting?.content?.indicationStatus?.measurementSetupFile || null;

    const extractedReadings: ExtractedProceqReading[] = [];
    const readingsArray = Array.isArray(readings) ? readings : [];

    if (readingsArray.length === 0) {
      const evaluationJSON = settingsSetupFile?.evaluationJSON;
      const gate1 = evaluationJSON?.gate1 || null;

      extractedReadings.push({
        readingIndex: 0,
        indicationSetupFileName: settingsSetupFile?.name || null,
        measuringMode: settingsSetupFile?.measuringMode || null,
        frequency: settingsSetupFile?.frequency || null,
        gain: settingsSetupFile?.gain || null,
        voltage: settingsSetupFile?.voltage || null,
        sampleAveraging: settingsSetupFile?.sampleAveraging || null,
        damping: settingsSetupFile?.damping || null,
        analogueFilter: settingsSetupFile?.analogueFilter || null,
        zeroOffset: settingsSetupFile?.zeroOffset ?? null,
        velocity: settingsSetupFile?.velocity || null,
        level: gate1?.level || null,
        measurementLevel: gate1?.measurementLevel || null,
        referenceSamplingRate: gate1?.referenceSamplingRate || null,
        start: gate1?.start || null,
        width: gate1?.width || null,
        gate1MaximumAmplitude: null,
        gate1SoundPathDistance: null,
        gate1SoundPathDistanceInTimeUnit: null,
        elongation: null,
        status: null,
      });
    } else {
      for (let idx = 0; idx < readingsArray.length; idx++) {
        const reading = readingsArray[idx];
        const readingSetupFile = reading?.content?.indicationSetupFile || null;
        const readingToolBarOptions =
          reading?.content?.indicationSettings?.toolBarOptions || null;

        const evaluationJSON =
          readingSetupFile?.evaluationJSON || settingsSetupFile?.evaluationJSON;
        const gate1 = evaluationJSON?.gate1 || null;

        extractedReadings.push({
          readingIndex: idx,
          indicationSetupFileName:
            readingSetupFile?.name || settingsSetupFile?.name || null,
          measuringMode:
            readingSetupFile?.measuringMode ||
            settingsSetupFile?.measuringMode ||
            null,
          frequency:
            readingSetupFile?.frequency || settingsSetupFile?.frequency || null,
          gain: readingSetupFile?.gain || settingsSetupFile?.gain || null,
          voltage:
            readingSetupFile?.voltage || settingsSetupFile?.voltage || null,
          sampleAveraging:
            readingSetupFile?.sampleAveraging ||
            settingsSetupFile?.sampleAveraging ||
            null,
          damping:
            readingSetupFile?.damping || settingsSetupFile?.damping || null,
          analogueFilter:
            readingSetupFile?.analogueFilter ||
            settingsSetupFile?.analogueFilter ||
            null,
          zeroOffset:
            readingSetupFile?.zeroOffset ??
            settingsSetupFile?.zeroOffset ??
            null,
          velocity:
            readingSetupFile?.velocity || settingsSetupFile?.velocity || null,
          level: gate1?.level || null,
          measurementLevel: gate1?.measurementLevel || null,
          referenceSamplingRate: gate1?.referenceSamplingRate || null,
          start: gate1?.start || null,
          width: gate1?.width || null,
          gate1MaximumAmplitude:
            readingToolBarOptions?.gate1MaximumAmplitude || null,
          gate1SoundPathDistance:
            readingToolBarOptions?.gate1SoundPathDistance || null,
          gate1SoundPathDistanceInTimeUnit:
            readingToolBarOptions?.gate1SoundPathDistanceInTimeUnit || null,
          elongation: null,
          status: null,
        });
      }
    }

    const baseFileName =
      measurement.content?.info?.fileName ||
      measurement.name ||
      measurementId ||
      '';

    return {
      measurementId,
      fileName: baseFileName,
      operatorEmail: measurement.content?.info?.email || null,
      comments: comment || undefined,
      temperature:
        temperature !== null && !isNaN(temperature) ? temperature : null,
      userPhoto: userPhotos,
      createdTimestamp: null,
      updatedTimestamp: null,
      dueDate: null,
      rawDataZipId: null,
      rawDataZipPath: null,
      readings: extractedReadings,
      status: null,
    };
  }

  /**
   * Syncs one technician's Proceq measurements into the DB and folds the
   * results into the cycle's company mapper.
   *
   * Concurrency-safe across technicians: a per-technician lock (§5.1) prevents
   * the SAME operator from being synced twice at once while allowing different
   * operators to run in parallel inside the scheduler's window.
   *
   * @param email  The technician's `operatorEmail`.
   * @param ctx    The cycle context (shared mapper + abort signal). When
   *               omitted — e.g. a manual/administrative one-off run — a
   *               self-contained context is created and its mapper is flushed
   *               at the end so a direct call still sends emails.
   */
  async syncAllMeasurements(
    email: string,
    ctx?: CycleContext,
  ): Promise<SyncResult> {
    const standalone = !ctx;
    const context: CycleContext = ctx ?? {
      cycleId: `manual-${Date.now()}`,
      mapper: new CompanyMapper(),
      signal: new AbortController().signal,
    };
    const log = new StructuredLogger(this.logger, {
      cycleId: context.cycleId,
      technician: email,
    });

    // Per-technician lock (§5.1, Scenario 9).
    if (!this.lock.tryAcquire(email)) {
      log.warn(SyncEvent.TECHNICIAN_SKIP, { reason: 'already-in-flight' });
      return this.skipResult();
    }

    const startTime = Date.now();
    let failedBatches = 0;

    try {
      this.throwIfAborted(context.signal, { technician: email });
      log.log(SyncEvent.TECHNICIAN_START);

      const size = BATCH_SIZE;
      const allNewMeasurementIds: string[] = [];
      let totalMeasurements = 0;

      const { data } = await this.api.getMeasurements(
        email,
        1,
        1,
        context.signal,
      );
      const totalCount = data?.meta?.pagination?.totalCount || 0;
      const totalPages = Math.ceil(totalCount / size);

      log.log(SyncEvent.PAGINATION, { totalCount, totalPages });

      const measurementTimestampMap = new Map<
        string,
        { created: string | null; updated: string | null }
      >();
      const allUpdatedMeasurementIds: string[] = [];

      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        this.throwIfAborted(context.signal, {
          technician: email,
          page: currentPage,
        });

        const { data } = await this.api.getMeasurements(
          email,
          currentPage,
          size,
          context.signal,
        );

        const measurements = data.data || [];
        if (!measurements.length) break;

        totalMeasurements += measurements.length;

        const ids = measurements.map((m: Record<string, any>) => m.id);

        for (const m of measurements) {
          measurementTimestampMap.set(m.id, {
            created: m.createdAt || null,
            updated: m.updatedAt || null,
          });
        }

        const existing = await this.prisma.proceqData.findMany({
          where: { measurementId: { in: ids } },
          select: { measurementId: true, updatedTimestamp: true },
          take: ids.length,
        });

        const existingMap = new Map(
          existing.map((e) => [e.measurementId, e.updatedTimestamp]),
        );

        // Change detection (§5.4): NEW inserts, strictly-newer reprocesses,
        // equal/older/undecidable skips.
        for (const m of measurements) {
          const decision = this.comparator.classify(
            m.updatedAt ?? null,
            existingMap.get(m.id),
          );
          if (decision === SyncDecision.NEW) {
            allNewMeasurementIds.push(m.id);
          } else if (decision === SyncDecision.UPDATED) {
            allUpdatedMeasurementIds.push(m.id);
          }
        }

        if (currentPage % 10 === 0 || currentPage === totalPages) {
          log.log(SyncEvent.DIFF, {
            page: currentPage,
            totalPages,
            new: allNewMeasurementIds.length,
            updated: allUpdatedMeasurementIds.length,
          });
        }
      }

      log.log(SyncEvent.DIFF, {
        phase: 'complete',
        scanned: totalMeasurements,
        new: allNewMeasurementIds.length,
        updated: allUpdatedMeasurementIds.length,
      });

      const allMeasurementIdsToSync = [
        ...allNewMeasurementIds,
        ...allUpdatedMeasurementIds,
      ];

      if (allMeasurementIdsToSync.length > 0) {
        const adaptiveBatchSize = BATCH_SIZE;
        const totalBatches = Math.ceil(
          allMeasurementIdsToSync.length / adaptiveBatchSize,
        );
        let processedCount = 0;

        for (
          let i = 0;
          i < allMeasurementIdsToSync.length;
          i += adaptiveBatchSize
        ) {
          this.throwIfAborted(context.signal, { technician: email });

          const batchNumber = Math.floor(i / adaptiveBatchSize) + 1;
          const batch = allMeasurementIdsToSync.slice(i, i + adaptiveBatchSize);

          try {
            await this.processMeasurementsBatch(
              email,
              batch,
              measurementTimestampMap,
              context,
            );
          } catch (error) {
            // A cycle abort must stop this technician immediately; any other
            // batch failure is isolated so the remaining batches still run.
            if (isAbortError(error)) throw error;
            const err = toError(error);
            failedBatches++;
            log.error(SyncEvent.BATCH, {
              batchNumber,
              totalBatches,
              status: 'failed',
              size: batch.length,
              message: err.message,
            });
            continue;
          }

          processedCount += batch.length;
          log.log(SyncEvent.BATCH, {
            batchNumber,
            totalBatches,
            status: 'done',
            processed: processedCount,
            total: allMeasurementIdsToSync.length,
          });
        }
      }

      const duration = Date.now() - startTime;
      log.log(SyncEvent.TECHNICIAN_FINISH, {
        durationMs: duration,
        new: allNewMeasurementIds.length,
        updated: allUpdatedMeasurementIds.length,
        failedBatches,
      });

      // A manual/administrative one-off run owns its mapper and must send its
      // own emails; within a cycle the scheduler flushes once at the end.
      if (standalone) {
        await this.dispatcher.flush(context.mapper, context.cycleId);
      }

      return {
        success: failedBatches === 0,
        duration,
        totalScanned: totalMeasurements,
        newMeasurements: allNewMeasurementIds.length,
        updatedMeasurements: allUpdatedMeasurementIds.length,
        failedBatches,
      };
    } catch (error) {
      const err = toError(error);
      if (isAbortError(error)) {
        log.warn(SyncEvent.CYCLE_ABORTED, { message: err.message });
      } else {
        log.error(SyncEvent.FAILURE, { message: err.stack || err.message });
      }
      throw err;
    } finally {
      this.lock.release(email);
    }
  }

  /** The result returned when a technician is skipped (lock already held). */
  private skipResult(): SyncResult {
    return {
      success: false,
      duration: 0,
      totalScanned: 0,
      newMeasurements: 0,
      updatedMeasurements: 0,
      failedBatches: 0,
      skipped: true,
    };
  }

  /**
   * Throws {@link ProceqCycleAbortedError} if the cycle has been aborted.
   *
   * The message and cause are derived from `signal.reason` so the log reflects
   * the real abort source (watchdog timeout, app shutdown, or any explicit
   * reason) rather than a fixed, potentially-misleading string.
   */
  private throwIfAborted(
    signal: AbortSignal,
    context: ErrorContext = {},
  ): void {
    if (signal.aborted) {
      const reason = signal.reason;
      const message =
        reason instanceof Error ? reason.message : 'Proceq cycle aborted';
      throw new ProceqCycleAbortedError(message, context, { cause: reason });
    }
  }

  private async processMeasurementsBatch(
    email: string,
    ids: string[],
    measurementTimestampMap: Map<
      string,
      { created: string | null; updated: string | null }
    >,
    ctx: CycleContext,
  ): Promise<void> {
    if (!ids.length) return;

    const log = new StructuredLogger(this.logger, {
      cycleId: ctx.cycleId,
      technician: email,
    });

    try {
      this.throwIfAborted(ctx.signal, { technician: email });

      const exportResponse = await this.api.exportMeasurementData(
        email,
        ids,
        'json',
        ctx.signal,
      );
      const exportId = exportResponse.data.data.exportID;
      log.log(SyncEvent.EXPORT_CREATE, { exportId, measurements: ids.length });

      const startTime = Date.now();
      let exportStatus: string;

      do {
        await new Promise((resolve) =>
          setTimeout(resolve, EXPORT_POLL_INTERVAL_MS),
        );

        // Cancellation is checked between poll iterations so a watchdog abort
        // (§5.3) stops a long export promptly instead of at the 5-min cap.
        this.throwIfAborted(ctx.signal, { technician: email, exportId });

        if (Date.now() - startTime > EXPORT_TIMEOUT_MS) {
          throw new ProceqExportTimeoutError(
            `Export timeout after ${EXPORT_TIMEOUT_MS}ms`,
            { technician: email, exportId, measurements: ids.length },
          );
        }

        const statusResponse = await this.api.getExportStatus(
          email,
          exportId,
          ctx.signal,
        );
        exportStatus = statusResponse.data.data.status;
        log.debug(SyncEvent.EXPORT_POLL, { exportId, status: exportStatus });

        if (exportStatus === 'completed') {
          const downloadUrl = statusResponse.data.data.url;
          this.throwIfAborted(ctx.signal, { technician: email, exportId });
          const downloadPath = await downloadAndSaveFile(
            downloadUrl,
            ctx.signal,
          );
          log.log(SyncEvent.DOWNLOAD, { exportId, path: downloadPath });

          await this.processExportArchive(
            downloadPath,
            ids,
            measurementTimestampMap,
            ctx,
          );

          setImmediate(() => {
            log.log(SyncEvent.BATCH, {
              phase: 'attachments-start',
              measurements: ids.length,
            });
            this.processAttachments(email, ids, ctx.signal).catch((err) => {
              log.error(SyncEvent.WARNING, {
                phase: 'attachments',
                measurements: ids.length,
                sample: ids.slice(0, 3).join(','),
                message: toError(err).message,
              });
            });
          });

          break;
        } else if (exportStatus === 'failed') {
          throw new ProceqApiError('Export failed for batch', {
            technician: email,
            exportId,
            sample: ids.slice(0, 5).join(','),
          });
        }
      } while (['pending', 'processing'].includes(exportStatus));
    } catch (error) {
      const err = toError(error);
      if (isAbortError(error)) {
        log.warn(SyncEvent.CYCLE_ABORTED, {
          phase: 'batch',
          measurements: ids.length,
          message: err.message,
        });
      } else {
        log.error(SyncEvent.BATCH, {
          phase: 'process',
          status: 'error',
          size: ids.length,
          message: err.message,
        });
      }
      throw err;
    }
  }

  private async processAttachments(
    email: string,
    measurementIds: string[],
    signal?: AbortSignal,
  ): Promise<void> {
    const concurrencyLimit = ATTACHMENT_CONCURRENCY;

    for (let i = 0; i < measurementIds.length; i += concurrencyLimit) {
      if (signal?.aborted) return;
      const batch = measurementIds.slice(i, i + concurrencyLimit);

      await Promise.allSettled(
        batch.map(async (measurementId) => {
          try {
            const proceqDataRecord = await this.prisma.proceqData.findUnique({
              where: { measurementId },
              select: { id: true },
            });

            if (!proceqDataRecord) {
              this.logger.warn(
                `ProceqData not found for measurement ${measurementId}, skipping attachments`,
              );
              return;
            }

            const attachmentsResponse =
              await this.api.getMeasurementAttachments(
                email,
                measurementId,
                signal,
              );
            const attachments = attachmentsResponse.data.data || [];

            if (!attachments.length) return;

            await Promise.allSettled(
              attachments.map(async (attachment: Record<string, any>) => {
                try {
                  const response = await this.api.downloadAttachment(
                    email,
                    attachment.mID,
                    attachment.id,
                    signal,
                  );

                  const buffer = Buffer.from(response.data);
                  const savedFiles = await this.saveAttachment(
                    buffer,
                    measurementId,
                  );

                  for (const filePath of savedFiles) {
                    const fileName = filePath.split(/[\\/]/).pop() || 'unknown';
                    const ext = fileName.split('.').pop()?.toLowerCase() || '';
                    const fileType = this.getFileType(ext);
                    const stat = await fs.stat(filePath);

                    await this.prisma.proceqAttachment.upsert({
                      where: { attachmentId: attachment.id },
                      update: {
                        filePath,
                        fileName,
                        fileType,
                        fileSize: stat.size,
                      },
                      create: {
                        attachmentId: attachment.id,
                        fileName,
                        filePath,
                        fileType,
                        fileSize: stat.size,
                        attachmentType: fileType,
                        proceqDataId: proceqDataRecord.id,
                      },
                    });
                  }
                } catch (error) {
                  const err = error as Error;
                  this.logger.warn(
                    `Failed to download attachment ${attachment.id} for measurement ${measurementId}: ${err.message}`,
                  );
                }
              }),
            );
          } catch (error) {
            const err = error as Error;
            this.logger.warn(
              `Failed to fetch attachments for ${measurementId}: ${err.message}`,
            );
          }
        }),
      );
    }
  }

  private getFileType(extension: string): string {
    const imageExtensions = [
      'png',
      'jpg',
      'jpeg',
      'gif',
      'bmp',
      'webp',
      'tiff',
      'svg',
    ];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'];

    if (imageExtensions.includes(extension)) return 'image';
    if (audioExtensions.includes(extension)) return 'audio';
    return 'other';
  }

  private async saveAttachment(
    buffer: Buffer,
    measurementId: string,
  ): Promise<string[]> {
    const uploadDir = join(
      process.cwd(),
      'proceq-data',
      'attachments',
      measurementId,
    );
    await fs.mkdir(uploadDir, { recursive: true });

    let files: any[];
    try {
      files = await decompress(buffer, uploadDir);
    } catch (error) {
      this.logger.warn(
        `Failed to decompress attachment archive for measurement ${measurementId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return [];
    }

    const supportedExtensions = [
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.bmp',
      '.webp',
      '.mp3',
      '.wav',
      '.ogg',
      '.flac',
      '.aac',
      '.m4a',
    ];

    const savedFiles = files
      .filter((file: Record<string, any>) => {
        const lower = file.path.toLowerCase();
        return supportedExtensions.some((ext) => lower.endsWith(ext));
      })
      .map((file: Record<string, any>) => join(uploadDir, file.path));

    if (!savedFiles.length) {
      this.logger.warn(
        `No supported media files found in attachment archive for ${measurementId}`,
      );
    }

    return savedFiles;
  }

  private async processExportArchive(
    archivePath: string,
    measurementIds: string[],
    measurementTimestampMap: Map<
      string,
      { created: string | null; updated: string | null }
    >,
    ctx: CycleContext,
  ): Promise<void> {
    const extractedDir = archivePath;

    try {
      const jsonContainingDirs: string[] = [];

      const findJsonDirs = async (dir: string): Promise<void> => {
        const items = await fs.readdir(dir);
        const hasJson = items.some((item) => item.endsWith('.json'));
        if (hasJson) {
          jsonContainingDirs.push(dir);
          return;
        }
        for (const item of items) {
          const fullPath = join(dir, item);
          try {
            const itemStat = await fs.stat(fullPath);
            if (itemStat.isDirectory()) {
              await findJsonDirs(fullPath);
            }
          } catch {
            continue;
          }
        }
      };

      await findJsonDirs(extractedDir);

      this.logger.debug(
        `Found ${jsonContainingDirs.length} JSON-containing directories in export archive`,
      );

      const measurementDirMap = new Map<string, string>();

      for (const potentialDir of jsonContainingDirs) {
        try {
          const filesInDir = await fs.readdir(potentialDir);
          const jsonFiles = filesInDir.filter((file) => file.endsWith('.json'));

          if (jsonFiles.length > 0) {
            const firstJsonFile = join(potentialDir, jsonFiles[0]);
            const logContent = await fs.readFile(firstJsonFile, 'utf-8');
            const logData = JSON.parse(logContent);

            const isApiResponse = !!logData?.data;
            const logMeasurement = isApiResponse
              ? logData?.data?.measurement || {}
              : logData?.measurement || {};
            const logMeasurementId = isApiResponse
              ? logData?.data?.measurement?.id
              : logData?.measurement?.id;
            const logFileName =
              logMeasurement?.content?.info?.fileName ||
              logMeasurement?.name ||
              logMeasurementId;

            if (logMeasurementId)
              measurementDirMap.set(logMeasurementId, potentialDir);
            if (logFileName) measurementDirMap.set(logFileName, potentialDir);
          }
        } catch {
          continue;
        }
      }

      const recordsToUpsert: ExtractedProceqFields[] = [];
      const newMeasurementIds: string[] = [];
      const serialNumberMap = new Map<string, string>();
      const bansheeRequestsToUpdate: string[] = [];

      const baseFileNameToRecordIndices = new Map<string, number[]>();

      for (const measurementId of measurementIds) {
        const measurementDir = measurementDirMap.get(measurementId);

        if (!measurementDir) {
          this.logger.warn(
            `Measurement directory for ${measurementId} not found in export archive`,
          );
          continue;
        }

        const filesInDir = await fs.readdir(measurementDir);
        const logFiles = filesInDir.filter((file) => file.endsWith('.json'));

        if (logFiles.length === 0) {
          this.logger.warn(
            `No log files found for measurement ${measurementId}`,
          );
          continue;
        }

        const logFile = logFiles[0];
        const logFilePath = join(measurementDir, logFile);

        try {
          const logContent = await fs.readFile(logFilePath, 'utf-8');
          const logData = JSON.parse(logContent);

          const extracted = this.extractProceqFields(logData, measurementId);

          // Override timestamps with values from getMeasurements API
          const apiTimestamps = measurementTimestampMap.get(measurementId);
          if (apiTimestamps) {
            extracted.createdTimestamp = apiTimestamps.created
              ? new Date(apiTimestamps.created)
              : null;
            extracted.updatedTimestamp = apiTimestamps.updated
              ? new Date(apiTimestamps.updated)
              : null;

            // Append createdTimestamp to fileName
            if (extracted.createdTimestamp) {
              extracted.fileName = `${extracted.fileName}_${extracted.createdTimestamp.getTime().toString()}`;
            }
          }

          if (
            logData?.readings &&
            Array.isArray(logData.readings) &&
            logData.readings.length > 0
          ) {
            for (let rIdx = 0; rIdx < logData.readings.length; rIdx++) {
              const readingEntry = logData.readings[rIdx];
              if (readingEntry?.rawData) {
                const rawDataLabel =
                  logData.readings.length > 1
                    ? `${measurementId}_reading${rIdx}`
                    : measurementId;
                const rawDataZipPath = await this.saveRawDataAsZip(
                  readingEntry.rawData,
                  rawDataLabel,
                );
                if (rIdx === 0) {
                  extracted.rawDataZipPath = rawDataZipPath;
                  extracted.rawDataZipId = measurementId;
                }
              }
            }
          }

          const baseFileName =
            logData?.measurement?.content?.info?.fileName || measurementId;

          const recordIndex = recordsToUpsert.length;
          recordsToUpsert.push(extracted);
          newMeasurementIds.push(extracted.measurementId);
          serialNumberMap.set(extracted.measurementId, baseFileName);

          const indices = baseFileNameToRecordIndices.get(baseFileName) || [];
          indices.push(recordIndex);
          baseFileNameToRecordIndices.set(baseFileName, indices);
        } catch (error) {
          const err = error as Error;
          this.logger.error(
            `Failed to process log file ${logFile} for measurement ${measurementId}: ${err.message}`,
          );
        }
      }
      const uniqueSerialNumbers = [...baseFileNameToRecordIndices.keys()];
      const bansheeRequests =
        uniqueSerialNumbers.length > 0
          ? await this.prisma.bansheeRequest.findMany({
              where: { serialNumber: { in: uniqueSerialNumbers } },
            })
          : [];

      const bansheeBySerial = new Map(
        bansheeRequests.map((b) => [b.serialNumber, b]),
      );

      // Same requests keyed by id — used by the notification flows, which work
      // off the upserted records' bansheeRequestId.
      const bansheeRequestById = new Map(bansheeRequests.map((b) => [b.id, b]));

      for (const [baseFileName, indices] of baseFileNameToRecordIndices) {
        const bansheeRequest = bansheeBySerial.get(baseFileName);
        if (!bansheeRequest) {
          this.logger.warn(
            `No BansheeRequest found for serial ${baseFileName}, saving measurement without mapping`,
          );
        } else {
          for (const idx of indices) {
            recordsToUpsert[idx].bansheeRequestId = bansheeRequest.id;

            const updatedTs = recordsToUpsert[idx].updatedTimestamp;
            if (updatedTs && bansheeRequest.period) {
              const dueDate = new Date(updatedTs);
              dueDate.setMonth(dueDate.getMonth() + bansheeRequest.period);

              recordsToUpsert[idx].dueDate = dueDate;
            }
          }
          bansheeRequestsToUpdate.push(bansheeRequest.id);
        }
      }
      const uniqueBoltTypes: BoltType[] = [
        ...new Set([
          BoltType.D47_MD_1_8_M,
          ...bansheeRequests.filter((b) => b.boltType).map((b) => b.boltType),
        ]),
      ];

      const boltConstantsMap = new Map<string, BoltConstants>();
      const boltTypeConstants =
        await this.prisma.bansheeBoltTypeConstant.findMany({
          where: { boltType: { in: uniqueBoltTypes } },
        });
      boltTypeConstants.forEach((constant) => {
        boltConstantsMap.set(
          constant.boltType,
          constant as unknown as BoltConstants,
        );
      });
      this.computeStatusForRecords(
        recordsToUpsert,
        boltConstantsMap,
        bansheeBySerial,
        baseFileNameToRecordIndices,
      );

      await this.updateStatsForNewRecords(recordsToUpsert, serialNumberMap);

      let statusChanges: ProceqStatusChangeInfo[] = [];
      if (recordsToUpsert.length > 0) {
        statusChanges = await this.bulkUpsertProceqData(recordsToUpsert);
      }
      if (bansheeRequestsToUpdate.length > 0) {
        await this.prisma.bansheeRequest.updateMany({
          where: { id: { in: bansheeRequestsToUpdate } },
          data: { isProceqSynced: true },
        });
      }

      // Notification flows (Flow 1: measurement completion, Flow 2: status
      // change). Instead of sending inline per batch, this batch's events are
      // accumulated into the cycle-scoped company mapper (§5.2); the scheduler
      // flushes the mapper once, at cycle end, so a company receives a single
      // consolidated email per cycle. This service only detects events and
      // resolves the payloads (company, measured/not-measured, alarm toggle);
      // recipient resolution, plan validation and sending stay in the Banshee
      // communication layer, invoked at flush time.
      //
      // Accumulation is pure in-memory work but is still isolated so an
      // unexpected failure can never abort the surrounding sync batch. Order
      // fulfilment is unaffected by the mapper move: Flow 1/Flow 2 do not read
      // order-item state, so deferring the send does not change their content.
      try {
        this.accumulateNotifications(
          recordsToUpsert,
          statusChanges,
          bansheeRequestById,
          ctx,
        );
      } catch (error) {
        this.logger.error(
          formatEvent(SyncEvent.WARNING, {
            cycleId: ctx.cycleId,
            phase: 'notify-aggregate',
            message: toError(error).message,
          }),
        );
      }

      await this.processOrderFulfillment(recordsToUpsert);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        'Error processing export archive',
        err.stack || err.message,
      );
      throw err;
    }
  }

  private async bulkUpsertProceqData(
    records: ExtractedProceqFields[],
  ): Promise<ProceqStatusChangeInfo[]> {
    const chunkSize = UPSERT_CHUNK_SIZE;
    // Collected across chunks and returned so the status-change notification
    // flow can reuse the same comparison that writes BansheeEventLog rows.
    const statusChanges: ProceqStatusChangeInfo[] = [];

    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      //for event logs
      const measurementIds = chunk.map((r) => r.measurementId);
      const existingRecords = await this.prisma.proceqData.findMany({
        where: { measurementId: { in: measurementIds } },
        select: { measurementId: true, status: true, bansheeRequestId: true },
      });
      const existingStatusMap = new Map(
        existingRecords.map((e) => [
          e.measurementId,
          { status: e.status, bansheeRequestId: e.bansheeRequestId },
        ]),
      );

      const parentOps = chunk.map((record) =>
        this.prisma.proceqData.upsert({
          where: { measurementId: record.measurementId },
          update: {
            fileName: record.fileName,
            operatorEmail: record.operatorEmail,
            comments: record.comments,
            temperature: record.temperature,
            userPhoto: record.userPhoto as any,
            createdTimestamp: record.createdTimestamp,
            updatedTimestamp: record.updatedTimestamp,
            rawDataZipId: record.rawDataZipId,
            rawDataZipPath: record.rawDataZipPath,
            bansheeRequestId: record.bansheeRequestId,
            dueDate: record.dueDate,
            status: record.status || ProceqStatus.UNMEASURED,
          },
          create: {
            measurementId: record.measurementId,
            fileName: record.fileName,
            operatorEmail: record.operatorEmail,
            comments: record.comments,
            temperature: record.temperature,
            userPhoto: record.userPhoto as any,
            createdTimestamp: record.createdTimestamp,
            updatedTimestamp: record.updatedTimestamp,
            rawDataZipId: record.rawDataZipId,
            rawDataZipPath: record.rawDataZipPath,
            bansheeRequestId: record.bansheeRequestId,
            dueDate: record.dueDate,
            status: record.status || ProceqStatus.UNMEASURED,
          },
        }),
      );

      const upsertedParents = await this.prisma.$transaction(parentOps);

      const readingUpserts: any[] = [];
      for (let j = 0; j < chunk.length; j++) {
        const record = chunk[j];
        const parentId = upsertedParents[j].id;

        for (const reading of record.readings) {
          readingUpserts.push(
            this.prisma.proceqReading.upsert({
              where: {
                proceqDataId_readingIndex: {
                  proceqDataId: parentId,
                  readingIndex: reading.readingIndex,
                },
              },
              update: {
                indicationSetupFileName: reading.indicationSetupFileName,
                measuringMode: reading.measuringMode,
                frequency: reading.frequency,
                gain: reading.gain,
                voltage: reading.voltage,
                sampleAveraging: reading.sampleAveraging,
                damping: reading.damping,
                analogueFilter: reading.analogueFilter,
                zeroOffset: reading.zeroOffset,
                velocity: reading.velocity,
                level: reading.level,
                measurementLevel: reading.measurementLevel,
                referenceSamplingRate: reading.referenceSamplingRate,
                start: reading.start,
                width: reading.width,
                gate1MaximumAmplitude: reading.gate1MaximumAmplitude,
                gate1SoundPathDistance: reading.gate1SoundPathDistance,
                gate1SoundPathDistanceInTimeUnit:
                  reading.gate1SoundPathDistanceInTimeUnit,
                elongation: reading.elongation,
                status: reading.status || ProceqStatus.UNMEASURED,
              },
              create: {
                proceqData: {
                  connect: {
                    id: parentId,
                  },
                },
                readingIndex: reading.readingIndex,
                indicationSetupFileName: reading.indicationSetupFileName,
                measuringMode: reading.measuringMode,
                frequency: reading.frequency,
                gain: reading.gain,
                voltage: reading.voltage,
                sampleAveraging: reading.sampleAveraging,
                damping: reading.damping,
                analogueFilter: reading.analogueFilter,
                zeroOffset: reading.zeroOffset,
                velocity: reading.velocity,
                level: reading.level,
                measurementLevel: reading.measurementLevel,
                referenceSamplingRate: reading.referenceSamplingRate,
                start: reading.start,
                width: reading.width,
                gate1MaximumAmplitude: reading.gate1MaximumAmplitude,
                gate1SoundPathDistance: reading.gate1SoundPathDistance,
                gate1SoundPathDistanceInTimeUnit:
                  reading.gate1SoundPathDistanceInTimeUnit,
                elongation: reading.elongation,
                status: reading.status as ProceqStatus,
              },
            }),
          );
        }
      }

      if (readingUpserts.length > 0) {
        await this.prisma.$transaction(readingUpserts);
      }

      const eventLogs: Array<{
        eventType: string;
        previousStatus: ProceqStatus;
        newStatus: ProceqStatus;
        measurementId: string;
        bansheeRequestId: string;
        createdAt: Date | null;
      }> = [];

      for (const record of chunk) {
        const existing = existingStatusMap.get(record.measurementId);
        if (!existing || !existing.bansheeRequestId) continue;
        const oldStatus = existing.status;
        const newStatus = record.status || null;
        if (oldStatus && newStatus && oldStatus !== newStatus) {
          eventLogs.push({
            eventType: 'STATUS_CHANGE',
            previousStatus: oldStatus,
            newStatus: newStatus,
            createdAt: record?.updatedTimestamp,
            measurementId: record.measurementId,
            bansheeRequestId: existing.bansheeRequestId,
          });
          statusChanges.push({
            measurementId: record.measurementId,
            bansheeRequestId: existing.bansheeRequestId,
            previousStatus: oldStatus,
            newStatus: newStatus,
            changedAt: record?.updatedTimestamp ?? null,
          });
        }
      }

      if (eventLogs.length > 0) {
        await this.prisma.bansheeEventLog.createMany({ data: eventLogs });
        this.logger.log(`Created ${eventLogs.length} status change event logs`);
      }
    }
    return statusChanges;
  }

  private async updateStatsForNewRecords(
    records: ExtractedProceqFields[],
    serialNumberMap: Map<string, string>,
  ): Promise<void> {
    if (records.length === 0) return;

    const allSerialNumbers = [...new Set([...serialNumberMap.values()])];
    const bansheeRequests =
      allSerialNumbers.length > 0
        ? await this.prisma.bansheeRequest.findMany({
            where: { serialNumber: { in: allSerialNumbers } },
            select: { serialNumber: true, companyId: true, siteId: true },
          })
        : [];

    const bansheeMap = new Map(
      bansheeRequests.map((b) => [
        b.serialNumber,
        { companyId: b.companyId, siteId: b.siteId },
      ]),
    );

    for (let i = 0; i < records.length; i += STATS_CONCURRENCY) {
      const batch = records.slice(i, i + STATS_CONCURRENCY);

      await Promise.allSettled(
        batch.map((record) => {
          const serialNumber =
            serialNumberMap.get(record.measurementId) ||
            record.fileName.split('_')[0];
          const bansheeInfo = bansheeMap.get(serialNumber);
          const companyId = bansheeInfo?.companyId || '';
          const siteId = bansheeInfo?.siteId || '';

          return this.statsService.updateStatsForMeasurement(
            record.createdTimestamp,
            true,
            true,
            record.comments || '',
            siteId,
            companyId,
            'create',
          );
        }),
      );
    }
  }

  private async saveRawDataAsZip(
    rawData: unknown,
    measurementId: string,
  ): Promise<string> {
    const rawDataDir = join(process.cwd(), 'proceq-data', 'raw-data');
    await fs.mkdir(rawDataDir, { recursive: true });

    const rawDataJsonPath = join(rawDataDir, `${measurementId}_raw.json`);
    await fs.writeFile(rawDataJsonPath, JSON.stringify(rawData, null, 2));

    const zipPath = join(rawDataDir, `${measurementId}_raw.zip`);

    const output = fsNode.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const archiveComplete = new Promise<void>((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);
    });

    archive.pipe(output);
    archive.file(rawDataJsonPath, { name: `${measurementId}_raw.json` });
    await archive.finalize();
    await archiveComplete;

    return zipPath;
  }

  private computeStatusForRecords(
    records: ExtractedProceqFields[],
    boltConstantsMap: Map<string, BoltConstants>,
    bansheeBySerial: Map<string, { boltType: BoltType }>,
    baseFileNameToRecordIndices: Map<string, number[]>,
  ): void {
    const recordBoltTypeMap = new Map<number, BoltType>();
    for (const [baseFileName, indices] of baseFileNameToRecordIndices) {
      const banshee = bansheeBySerial.get(baseFileName);
      if (banshee?.boltType) {
        for (const idx of indices) {
          recordBoltTypeMap.set(idx, banshee.boltType);
        }
      }
    }

    for (let idx = 0; idx < records.length; idx++) {
      const record = records[idx];

      try {
        const commentsStr = record.comments
          ? String(record.comments).toLowerCase()
          : '';

        if (commentsStr.includes('broken')) {
          record.status = ProceqStatus.BROKEN;
          continue;
        }
        if (commentsStr.includes('not measurable')) {
          record.status = ProceqStatus.NOT_MEASURABLE;
          continue;
        }

        const validReadings = record.readings.filter(
          (r) => r.gate1SoundPathDistanceInTimeUnit != null,
        );

        if (validReadings.length === 0) {
          continue;
        }

        const boltType = recordBoltTypeMap.get(idx) || BoltType.D47_MD_1_8_M;
        const boltConstants =
          boltConstantsMap.get(boltType) ||
          boltConstantsMap.get(BoltType.D47_MD_1_8_M)!;

        const readingStatuses: {
          readingIndex: number;
          status: string;
        }[] = [];

        for (const reading of validReadings) {
          const L_UT =
            ((reading.gate1SoundPathDistanceInTimeUnit! *
              boltConstants.velocity) /
              2) *
            1000;
          const temp = record.temperature ?? 32;
          const L_UT_T =
            L_UT *
            boltConstants.tempCorrectionFactor *
            (1 + (boltConstants.tempCoeff * (20 - temp)) / Math.pow(10, 6));

          const L0 = boltConstants.nominalLength;

          let E_LUT_T_L: number;
          const diff = L_UT_T - L0;

          if (diff <= boltConstants.linearLimit) {
            E_LUT_T_L =
              boltConstants.quadCoeff1 * Math.pow(diff, 2) +
              boltConstants.linCoeff1 * diff;
          } else {
            E_LUT_T_L =
              boltConstants.quadCoeff2 * Math.pow(diff, 2) +
              boltConstants.linCoeff2 * diff -
              boltConstants.constTerm;
          }

          let readingStatus: ProceqStatus;
          if (E_LUT_T_L < boltConstants.elasticLimit) {
            readingStatus = ProceqStatus.ELASTIC;
          } else if (E_LUT_T_L <= boltConstants.lowPlasticLimit) {
            readingStatus = ProceqStatus.LOW_PLASTIC;
          } else {
            readingStatus = ProceqStatus.HIGH_PLASTIC;
          }

          reading.elongation = E_LUT_T_L;
          reading.status = readingStatus;
          readingStatuses.push({
            readingIndex: reading.readingIndex,
            status: readingStatus,
          });
        }

        if (readingStatuses.length > 0) {
          readingStatuses.sort((a, b) => a.readingIndex - b.readingIndex);
          record.status = readingStatuses[readingStatuses.length - 1]
            .status as ProceqStatus;
        }
      } catch (error) {
        const err = error as Error;
        this.logger.warn(
          `Failed to compute status for measurement ${record.measurementId}: ${err.message}`,
        );
      }
    }
  }

  /**
   * A Proceq record represents a completed measurement when either a reading
   * has a `gate1SoundPathDistanceInTimeUnit` value, or the comment marks it as
   * "Not measurable" or "Broken". Anything else is still in progress and does
   * not trigger order fulfillment.
   */
  private isMeasurementCompleted(record: ExtractedProceqFields): boolean {
    const hasMeasuredReading = record.readings.some(
      (reading) => reading.gate1SoundPathDistanceInTimeUnit != null,
    );

    const comment = (record.comments ?? '').toLowerCase();
    const hasTerminalComment =
      comment.includes('not measurable') || comment.includes('broken');

    return hasMeasuredReading || hasTerminalComment;
  }

  /**
   * Marks order items as fulfilled for any synced record that represents a
   * completed measurement and is mapped to a Banshee request. Records reaching
   * this point are already limited to new/updated measurements, and the order
   * service performs the update idempotently, so reprocessing the same record
   * never double-fulfills. The whole batch is rolled up in one transaction; a
   * failure is logged here so it cannot abort the surrounding sync batch.
   */
  private async processOrderFulfillment(
    records: ExtractedProceqFields[],
  ): Promise<void> {
    // One representative measurementId per Banshee request, for audit logging.
    const requestToMeasurement = new Map<string, string>();

    for (const record of records) {
      if (!record.bansheeRequestId) continue;
      if (!this.isMeasurementCompleted(record)) continue;
      if (!requestToMeasurement.has(record.bansheeRequestId)) {
        requestToMeasurement.set(record.bansheeRequestId, record.measurementId);
      }
    }

    if (requestToMeasurement.size === 0) return;

    const entries = [...requestToMeasurement].map(
      ([bansheeRequestId, measurementId]) => ({
        bansheeRequestId,
        measurementId,
      }),
    );

    try {
      await this.orderService.fulfillOrderItemsForBansheeRequests(entries);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Order fulfillment batch failed for ${entries.length} request(s): ${err.message}`,
      );
    }
  }

  // ================================================================================
  // NOTIFICATION ACCUMULATION (mapper)
  // ================================================================================

  /**
   * Folds this batch's notification events into the cycle-scoped company mapper
   * (§5.2). Nothing is sent here — the scheduler flushes the mapper once, at
   * cycle end, via {@link ProceqNotificationDispatcher}. This preserves the
   * exact classification and alarm gating of the previous inline flows while
   * moving consolidation from per-batch to per-cycle scope (so a company gets a
   * single email per cycle even when several technicians/batches touch it —
   * Scenario 8).
   *
   * - Flow 1: each mapped record is classified via `isMeasurementCompleted()`
   *   into the company's measured / not-measured lists. Records not mapped to a
   *   Banshee request have no company/recipients and are skipped (Scenario 6).
   * - Flow 2: each status change is resolved to a fully-formed alert carrying
   *   the per-Banshee `activateNotifications` alarm toggle, which the dispatcher
   *   uses to gate the send. Changes whose Banshee is unknown in this batch are
   *   skipped — identical to the previous inline behaviour.
   */
  private accumulateNotifications(
    records: ExtractedProceqFields[],
    statusChanges: ProceqStatusChangeInfo[],
    bansheeRequestById: Map<string, BansheeRequest>,
    ctx: CycleContext,
  ): void {
    let measured = 0;
    let notMeasured = 0;

    for (const record of records) {
      if (!record.bansheeRequestId) continue;
      const request = bansheeRequestById.get(record.bansheeRequestId);
      if (!request) continue;

      const item: MeasurementSummaryItem = {
        serialNumber: request.serialNumber,
        bansheeName: request.name,
        measurementId: record.measurementId,
        status: record.status ?? ProceqStatus.UNMEASURED,
      };

      if (this.isMeasurementCompleted(record)) {
        ctx.mapper.addMeasured(request.companyId, item);
        measured++;
      } else {
        ctx.mapper.addNotMeasured(request.companyId, item);
        notMeasured++;
      }
    }

    let changes = 0;
    for (const change of statusChanges) {
      const request = bansheeRequestById.get(change.bansheeRequestId);
      if (!request) continue;

      ctx.mapper.addStatusChange({
        companyId: request.companyId,
        serialNumber: request.serialNumber,
        bansheeName: request.name,
        measurementId: change.measurementId,
        previousStatus: change.previousStatus,
        newStatus: change.newStatus,
        // `activateNotifications` doubles as the alarm toggle (no separate
        // field in the schema); the dispatcher applies it as the Flow 2 gate.
        activateNotifications: !!request.activateNotifications,
      });
      changes++;
    }

    if (measured + notMeasured + changes > 0) {
      this.logger.log(
        formatEvent(SyncEvent.NOTIFY_AGGREGATE, {
          cycleId: ctx.cycleId,
          measured,
          notMeasured,
          statusChanges: changes,
        }),
      );
    }
  }
}
