import { responses } from '@/app/uitexts/responses';
import { showAlertToast } from '@gsp/ui-banshee';
import { CombinedError } from 'urql';

export function buildInstallationDateTime(
  installationDate: Date,
  installationTime: string,
): Date {
  const [timeStr, period] = installationTime.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);
  const isPM = period === 'PM';
  const adjustedHours = isPM
    ? hours === 12
      ? 12
      : hours + 12
    : hours === 12
      ? 0
      : hours;

  const result = new Date(installationDate);
  result.setHours(adjustedHours, minutes, 0, 0);
  return result;
}

export function parseCoordinates(raw: unknown): {
  x: string;
  y: string;
  z: string;
} {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (parsed) {
      return {
        x: parsed.x?.toString() ?? '0',
        y: parsed.y?.toString() ?? '0',
        z: parsed.z?.toString() ?? '0',
      };
    }
  } catch (e) {
    console.error('Error parsing coordinates:', e);
  }
  return { x: '0', y: '0', z: '0' };
}

interface NestJsValidationError {
  message: string | string[];
  statusCode?: number;
  error?: string;
  [key: string]: unknown;
}

export interface GraphQLErrorExtensions {
  code?: string;
  title: string;
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  originalError?: NestJsValidationError;
}

export const handleGraphQLErrors = (error: CombinedError | undefined) => {
  if (!error?.graphQLErrors?.length) {
    return false;
  }

  const graphQLError = error.graphQLErrors[0];
  const extensions =
    graphQLError.extensions as unknown as GraphQLErrorExtensions;

  if (extensions?.code === 'FORBIDDEN') {
    showAlertToast({
      title: responses.accessDeniedError_title,
      description: responses.accessDeniedError_message,
      variant: 'error',
    });
    return true;
  }

  // Validation custom errors from backend
  if (
    extensions?.code === 'BAD_REQUEST' &&
    extensions?.originalError?.message
  ) {
    const validationErrors = extensions.originalError.message;
    const errorMessage = Array.isArray(validationErrors)
      ? validationErrors.join(', ')
      : validationErrors;

    showAlertToast({
      title: 'Validation Error',
      description: errorMessage,
      variant: 'error',
    });
    return true;
  }

  // Custom GraphQL errors
  if (extensions) {
    showAlertToast({
      title: extensions.title,
      description: extensions.message,
      variant: extensions.type || 'error',
    });
    return true;
  }
};

/** Converts a base64 data URL (e.g. from chart export) into a File for upload. */
export function dataUrlToFile(dataUrl: string, filename: string): File {
  const [meta, base64] = dataUrl.split(',');
  const mime = meta.match(/:(.*?);/)?.[1] ?? 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

/** Minimal shape needed to build the banshee CSV. Shared across plot pages. */
export interface BansheeCsvReading {
  elongation?: number | null;
  status?: string | null;
}
export interface BansheeCsvProceqData {
  status?: string | null;
  createdTimestamp?: number | null;
  readings?: readonly BansheeCsvReading[] | null;
}
export interface BansheeCsvRow {
  serialNumber?: string | null;
  site?: { siteName?: string | null } | null;
  drive?: { driveName?: string | null } | null;
  level?: { levelName?: string | null } | null;
  location?: { locationName?: string | null } | null;
  comment?: string | null;
  proceqData?: readonly BansheeCsvProceqData[] | null;
}

const BANSHEE_CSV_HEADERS = [
  'Serial Number',
  'Site Name',
  'Drive Name',
  'Level Name',
  'Location Name',
  'Comment',
  'Proceq Status',
  'Proceq Created Timestamp',
  'Reading Elongation',
  'Reading Status',
];

/** Builds the flattened banshee CSV string (same format used by Export CSV). */
export function buildBansheeCsv(data: readonly BansheeCsvRow[]): string {
  const csvRows: string[] = [BANSHEE_CSV_HEADERS.join(',')];

  data.forEach((request) => {
    const serialNumber = request.serialNumber ?? '';
    const siteName = request.site?.siteName ?? '';
    const driveName = request.drive?.driveName ?? '';
    const levelName = request.level?.levelName ?? '';
    const locationName = request.location?.locationName ?? '';
    const comment = request.comment ?? '';

    request.proceqData?.forEach((proceq) => {
      const proceqStatus = proceq.status ?? '';
      const createdTimestamp = proceq.createdTimestamp
        ? new Date(proceq.createdTimestamp).toISOString()
        : '';

      proceq.readings?.forEach((reading) => {
        const elongation = reading.elongation ?? '';
        const readingStatus = reading.status ?? '';

        const row = [
          serialNumber,
          siteName,
          driveName,
          levelName,
          locationName,
          comment,
          proceqStatus,
          createdTimestamp,
          elongation,
          readingStatus,
        ]
          .map((v) => JSON.stringify(v))
          .join(',');

        csvRows.push(row);
      });
    });
  });

  return csvRows.join('\n');
}

/** Builds a CSV File suitable for upload/sharing. */
export function buildBansheeCsvFile(
  data: readonly BansheeCsvRow[],
  filename = 'banshee_data.csv',
): File {
  return new File([buildBansheeCsv(data)], filename, {
    type: 'text/csv;charset=utf-8;',
  });
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDateTime(dt: string | null | undefined): string {
  if (!dt) return 'N/A';
  try {
    return new Date(dt).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dt;
  }
}