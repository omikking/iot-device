import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as decompress from 'decompress';
import { Logger } from '@nestjs/common';

const logger = new Logger('DownloadFile');

export async function downloadAndSaveFile(downloadUrl: string): Promise<string> {
  const logsDir = path.join(process.cwd(), 'logs');
  fs.mkdirSync(logsDir, { recursive: true });

  const fileName =
    path.basename(new URL(downloadUrl).pathname) || `export-${Date.now()}.zip`;

  const zipPath = path.join(logsDir, fileName);
  const extractPath = path.join(logsDir, path.parse(fileName).name);

  const response = await axios.get(downloadUrl, {
    responseType: 'stream',
  });

  await new Promise<void>((resolve, reject) => {
    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  await decompress(zipPath, extractPath);

  logger.log(`Extracted to ${extractPath}`);
  return extractPath;
}

