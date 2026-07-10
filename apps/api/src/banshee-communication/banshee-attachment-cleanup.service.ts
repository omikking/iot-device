import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Scheduled cleanup for Contact Us email attachments. Unlike order attachments
 * (which are never persisted), Contact Us files are written to disk under
 * `storage/banshee-email-attachments/<YYYY-MM-DD>/<bansheeEmailId>/`. This
 * service purges them once they are older than the retention window so local
 * storage doesn't grow unbounded.
 */
@Injectable()
export class BansheeAttachmentCleanupService {
  private readonly logger = new Logger(BansheeAttachmentCleanupService.name);

  /** Attachments are kept for this many days, then deleted. */
  private readonly RETENTION_DAYS = 7;

  /**
   * Root of the Contact Us attachment storage. Resolved the same way as
   * `BansheeCommunicationService.saveAttachments` (this service lives in the
   * same directory, so `__dirname` and the relative hops line up).
   */
  private readonly baseDir = join(
    __dirname,
    '..',
    '..',
    '..',
    'storage',
    'banshee-email-attachments',
  );

  /**
   * Runs daily at 02:00. Each upload day is its own `YYYY-MM-DD` folder, so a
   * folder added 7 days ago is removed on the 7th day — taking every file added
   * that day with it.
   */
  @Cron('0 0 2 * * *')
  async cleanupExpiredAttachments(): Promise<void> {
    const msPerDay = 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - this.RETENTION_DAYS * msPerDay;

    let dateFolders: string[];
    try {
      dateFolders = await fs.readdir(this.baseDir);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      // Nothing uploaded yet — the storage folder simply doesn't exist.
      if (err.code === 'ENOENT') return;
      this.logger.error(
        `Failed to read attachment storage directory: ${err.message}`,
      );
      return;
    }

    let removed = 0;
    for (const folder of dateFolders) {
      const folderPath = join(this.baseDir, folder);

      let stat: Awaited<ReturnType<typeof fs.stat>>;
      try {
        stat = await fs.stat(folderPath);
      } catch {
        continue;
      }
      if (!stat.isDirectory()) continue;

      const folderTime = this.resolveFolderTimestamp(folder, stat.mtimeMs);
      if (folderTime > cutoff) continue;

      try {
        await fs.rm(folderPath, { recursive: true, force: true });
        removed++;
        this.logger.log(
          `Removed expired Contact Us attachment folder: ${folder}`,
        );
      } catch (error) {
        const err = error as Error;
        this.logger.error(
          `Failed to remove attachment folder ${folder}: ${err.message}`,
        );
      }
    }

    if (removed > 0) {
      this.logger.log(
        `Contact Us attachment cleanup removed ${removed} expired date-folder(s)`,
      );
    }
  }

  /**
   * The folder name is the upload date (`YYYY-MM-DD`), parsed as UTC midnight.
   * Falls back to the filesystem mtime if the name isn't a valid date.
   */
  private resolveFolderTimestamp(
    folderName: string,
    fallbackMs: number,
  ): number {
    const parsed = Date.parse(folderName);
    return Number.isNaN(parsed) ? fallbackMs : parsed;
  }
}
