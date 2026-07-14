import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as decompress from 'decompress';
import { Logger } from '@nestjs/common';

const logger = new Logger('DownloadFile');

/**
 * Downloads a zip from `downloadUrl`, extracts it under `proceq-logs/`, and
 * returns the extraction directory.
 *
 * An optional {@link AbortSignal} makes the download cancellable: it is passed
 * to the axios request and also watched during the stream-to-disk phase, so an
 * aborted cycle (§5.3 watchdog) tears down the in-flight download promptly
 * instead of holding the technician lock until the transfer finishes. A partial
 * file left behind by an aborted/failed transfer is best-effort cleaned up.
 */
export async function downloadAndSaveFile(
  downloadUrl: string,
  signal?: AbortSignal,
): Promise<string> {
  const logsDir = path.join(process.cwd(), 'proceq-logs');
  fs.mkdirSync(logsDir, { recursive: true });

  const fileName =
    path.basename(new URL(downloadUrl).pathname) || `export-${Date.now()}.zip`;

  const zipPath = path.join(logsDir, fileName);
  const extractPath = path.join(logsDir, path.parse(fileName).name);

  const response = await axios.get(downloadUrl, {
    responseType: 'stream',
    signal,
  });

  await new Promise<void>((resolve, reject) => {
    const writer = fs.createWriteStream(zipPath);

    const abortError = () =>
      signal?.reason instanceof Error
        ? signal.reason
        : new Error('Download aborted');

    const cleanup = () => {
      if (signal) signal.removeEventListener('abort', onAbort);
    };

    const fail = (error: unknown) => {
      cleanup();
      response.data.destroy();
      writer.destroy();
      // Best-effort removal of the partially written archive.
      fs.promises.unlink(zipPath).catch(() => undefined);
      reject(error instanceof Error ? error : new Error(String(error)));
    };

    function onAbort() {
      fail(abortError());
    }

    // Already aborted before streaming started — bail out immediately.
    if (signal?.aborted) {
      fail(abortError());
      return;
    }
    signal?.addEventListener('abort', onAbort, { once: true });

    // Both ends can error: the source stream (network / abort) and the writer
    // (disk). Handle each so the promise can never hang.
    response.data.on('error', fail);
    writer.on('error', fail);
    writer.on('finish', () => {
      cleanup();
      resolve();
    });

    response.data.pipe(writer);
  });

  // Extraction is not itself cancellable; a cycle aborted between the download
  // finishing and extraction starting should stop here rather than do more work.
  if (signal?.aborted) {
    throw signal.reason instanceof Error
      ? signal.reason
      : new Error('Download aborted before extraction');
  }

  await decompress(zipPath, extractPath);

  logger.log(`Extracted to ${extractPath}`);
  return extractPath;
}
