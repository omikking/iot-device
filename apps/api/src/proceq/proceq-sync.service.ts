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
import {
  ExtractedProceqFields,
  ExtractedProceqReading,
  UserPhotoEntry,
  SyncResult,
  BoltConstants,
} from './interfaces/proceq-sync.interfaces';
import { BoltType, ProceqStatus } from '@prisma/client';

@Injectable()
export class ProceqSyncService {
  private readonly logger = new Logger(ProceqSyncService.name);
  private readonly BATCH_SIZE = 100;
  private readonly EXPORT_POLL_INTERVAL = 3000;
  private readonly EXPORT_TIMEOUT = 300000;

  private isSyncing = false;

  constructor(
    private readonly api: ProceqApiService,
    private readonly prisma: PrismaService,
    private readonly statsService: BansheeStatsService,
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
      rawDataZipId: null,
      rawDataZipPath: null,
      readings: extractedReadings,
      status: null,
    };
  }

  async syncAllMeasurements(): Promise<SyncResult> {
    if (this.isSyncing) {
      this.logger.debug('Sync already in progress, skipping');
      return {
        success: false,
        duration: 0,
        totalScanned: 0,
        newMeasurements: 0,
        updatedMeasurements: 0,
        failedBatches: 0,
      };
    }

    this.isSyncing = true;
    const startTime = Date.now();
    let failedBatches = 0;

    try {
      this.logger.log('Starting Proceq data synchronization');

      const size = this.BATCH_SIZE;
      const allNewMeasurementIds: string[] = [];
      let totalMeasurements = 0;

      const { data } = await this.api.getMeasurements(1, 1);
      this.logger.log(data.meta);
      const totalCount = data?.meta?.pagination?.totalCount || 0;
      const totalPages = Math.ceil(totalCount / size);

      this.logger.log(
        `Found ${totalCount} total measurements, ${totalPages} pages to process`,
      );

      const measurementTimestampMap = new Map<string, { created: string | null; updated: string | null }>();
      const allUpdatedMeasurementIds: string[] = [];

      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const { data } = await this.api.getMeasurements(currentPage, size);

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

        for (const m of measurements) {
          const dbUpdatedTimestamp = existingMap.get(m.id);

          if (dbUpdatedTimestamp === undefined) {
            allNewMeasurementIds.push(m.id);
          } else {
            const apiUpdatedAt = m.updatedAt || null;
            const apiUpdatedTimestamp = apiUpdatedAt
              ? new Date(apiUpdatedAt)
              : null;

            if (
              apiUpdatedTimestamp !== null &&
              dbUpdatedTimestamp !== null &&
              apiUpdatedTimestamp.getTime() !== dbUpdatedTimestamp.getTime()
            ) {
              allUpdatedMeasurementIds.push(m.id);
            }
          }
        }

        if (currentPage % 10 === 0 || currentPage === totalPages) {
          this.logger.log(
            `Processed page ${currentPage}/${totalPages}, found ${allNewMeasurementIds.length} new, ${allUpdatedMeasurementIds.length} updated measurements so far`,
          );
        }
      }

      this.logger.log(
        `Total measurements processed: ${totalMeasurements}, New: ${allNewMeasurementIds.length}, Updated: ${allUpdatedMeasurementIds.length}`,
      );

      const allMeasurementIdsToSync = [
        ...allNewMeasurementIds,
        ...allUpdatedMeasurementIds,
      ];

      if (allMeasurementIdsToSync.length > 0) {
        const adaptiveBatchSize = this.BATCH_SIZE;

        this.logger.log(
          `Starting batch processing with batch size ${adaptiveBatchSize} for ${allMeasurementIdsToSync.length} measurements (${allNewMeasurementIds.length} new, ${allUpdatedMeasurementIds.length} updated)`,
        );

        let processedCount = 0;

        for (
          let i = 0;
          i < allMeasurementIdsToSync.length;
          i += adaptiveBatchSize
        ) {
          const batch = allMeasurementIdsToSync.slice(i, i + adaptiveBatchSize);

          try {
            await this.processMeasurementsBatch(batch, measurementTimestampMap);
          } catch (error) {
            failedBatches++;
            this.logger.error(
              `Batch ${Math.floor(i / adaptiveBatchSize) + 1} failed, continuing with remaining batches: ${error.message}`,
            );
            continue;
          }

          processedCount += batch.length;
          const progress = (
            (processedCount / allMeasurementIdsToSync.length) *
            100
          ).toFixed(2);

          if (
            processedCount % (adaptiveBatchSize * 5) === 0 ||
            processedCount === allMeasurementIdsToSync.length
          ) {
            this.logger.log(
              `Progress: ${progress}% (${processedCount}/${allMeasurementIdsToSync.length})`,
            );
          }
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Sync completed in ${duration}ms. New: ${allNewMeasurementIds.length}, Updated: ${allUpdatedMeasurementIds.length}, Failed batches: ${failedBatches}`,
      );

      return {
        success: failedBatches === 0,
        duration,
        totalScanned: totalMeasurements,
        newMeasurements: allNewMeasurementIds.length,
        updatedMeasurements: allUpdatedMeasurementIds.length,
        failedBatches,
      };
    } catch (error) {
      this.logger.error('Proceq sync failed', error.stack || error.message);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  private async processMeasurementsBatch(
    ids: string[],
    measurementTimestampMap: Map<string, { created: string | null; updated: string | null }>,
  ): Promise<void> {
    if (!ids.length) return;

    try {
      const exportResponse = await this.api.exportMeasurementData(ids, 'json');
      const exportId = exportResponse.data.data.exportID;

      const startTime = Date.now();
      let exportStatus: string;

      do {
        await new Promise((resolve) =>
          setTimeout(resolve, this.EXPORT_POLL_INTERVAL),
        );

        if (Date.now() - startTime > this.EXPORT_TIMEOUT) {
          throw new Error(
            `Export timeout after ${this.EXPORT_TIMEOUT}ms for export ID: ${exportId}`,
          );
        }

        const statusResponse = await this.api.getExportStatus(exportId);
        exportStatus = statusResponse.data.data.status;

        if (exportStatus === 'completed') {
          const downloadUrl = statusResponse.data.data.url;
          const downloadPath = await downloadAndSaveFile(downloadUrl);

          await this.processExportArchive(downloadPath, ids, measurementTimestampMap);

          setImmediate(() => {
            this.logger.log(
              `Starting background attachment processing for ${ids.length} measurements`,
            );
            this.processAttachments(ids).catch((err) => {
              this.logger.error(
                `Background attachment processing failed for ${ids.length} measurements [${ids.slice(0, 3).join(',')}...]: ${err.message}`,
              );
            });
          });

          break;
        } else if (exportStatus === 'failed') {
          this.logger.error(
            `Export failed for batch with IDs: ${ids.slice(0, 5).join(',')}...`,
          );
          throw new Error('Export failed for batch');
        }
      } while (['pending', 'processing'].includes(exportStatus));
    } catch (error) {
      this.logger.error(
        `Failed to process batch with ${ids.length} measurements: ${error.message}`,
      );
      throw error;
    }
  }

  private async processAttachments(measurementIds: string[]): Promise<void> {
    const concurrencyLimit = 5;

    for (let i = 0; i < measurementIds.length; i += concurrencyLimit) {
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
              await this.api.getMeasurementAttachments(measurementId);
            const attachments = attachmentsResponse.data.data || [];

            if (!attachments.length) return;

            await Promise.allSettled(
              attachments.map(async (attachment: Record<string, any>) => {
                try {
                  const response = await this.api.downloadAttachment(
                    attachment.mID,
                    attachment.id,
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
                } catch (err) {
                  this.logger.warn(
                    `Failed to download attachment ${attachment.id} for measurement ${measurementId}: ${err.message}`,
                  );
                }
              }),
            );
          } catch (err) {
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
    measurementTimestampMap: Map<string, { created: string | null; updated: string | null }>,
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
          this.logger.error(
            `Failed to process log file ${logFile} for measurement ${measurementId}: ${error.message}`,
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

      for (const [baseFileName, indices] of baseFileNameToRecordIndices) {
        const bansheeRequest = bansheeBySerial.get(baseFileName);
        if (!bansheeRequest) {
          this.logger.warn(
            `No BansheeRequest found for serial ${baseFileName}, saving measurement without mapping`,
          );
        } else {
          for (const idx of indices) {
            (recordsToUpsert[idx] as any).bansheeRequestId =
              bansheeRequest.id;
          }
          bansheeRequestsToUpdate.push(bansheeRequest.id);
        }
      }
      const uniqueBoltTypes: BoltType[] = [
        ...new Set([
          BoltType.D47_MD_1_8_M,
          ...bansheeRequests
            .filter((b) => b.boltType)
            .map((b) => b.boltType),
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

      if (recordsToUpsert.length > 0) {
        await this.bulkUpsertProceqData(recordsToUpsert);
      }
      if (bansheeRequestsToUpdate.length > 0) {
        await this.prisma.bansheeRequest.updateMany({
          where: { id: { in: bansheeRequestsToUpdate } },
          data: { isProceqSynced: true },
        });
      }
    } catch (error) {
      this.logger.error(
        'Error processing export archive',
        error.stack || error.message,
      );
      throw error;
    }
  }

  private async bulkUpsertProceqData(
    records: ExtractedProceqFields[],
  ): Promise<void> {
    const chunkSize = 50;

    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
     //for event logs
      const measurementIds = chunk.map((r) => r.measurementId);
      const existingRecords = await this.prisma.proceqData.findMany({
        where: { measurementId: { in: measurementIds } },
        select: { measurementId: true, status: true, bansheeRequestId: true },
      });
      const existingStatusMap = new Map(
      existingRecords.map(e => [e.measurementId,
         { status: e.status, bansheeRequestId: e.bansheeRequestId }]),
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
        eventType: string; previousStatus: ProceqStatus; newStatus: ProceqStatus;
         measurementId: string; bansheeRequestId: string;
        createdAt: Date| null;
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
        }
      }

      if (eventLogs.length > 0) {
        await this.prisma.bansheeEventLog.createMany({ data: eventLogs });
        this.logger.log(`Created ${eventLogs.length} status change event logs`);
      }
    }
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
      bansheeRequests.map((b) => [b.serialNumber, { companyId: b.companyId, siteId: b.siteId }]),
    );

    const STATS_CONCURRENCY = 5;
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

        const boltType =
          recordBoltTypeMap.get(idx) || BoltType.D47_MD_1_8_M;
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
            (1 +
              (boltConstants.tempCoeff * (20 - temp)) / Math.pow(10, 6));

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
          record.status = readingStatuses[readingStatuses.length - 1].status as ProceqStatus;
        }
      } catch (error) {
        this.logger.warn(
          `Failed to compute status for measurement ${record.measurementId}: ${error.message}`,
        );
      }
    }
  }
}
