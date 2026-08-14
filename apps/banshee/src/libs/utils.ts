import { responses } from '@/app/uitexts/responses';
import { showAlertToast } from '@gsp/ui-banshee';
import { CombinedError } from 'urql';
import {
  sortProceqDataAscending,
  sortReadingsAscending,
} from '@/libs/latest-measurement';

// Accepts "h:mm AM/PM" as well as bare 24-hour "HH:mm". Whitespace before the
// period is optional and may be a non-breaking space, which is what some
// browsers/ICU versions emit for locale-formatted times.
const TIME_OF_DAY_PATTERN = /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i;

/**
 * Parses a time-of-day string into hours (0-23) and minutes.
 * Returns null when the string is not a recognisable time.
 */
export function parseTimeOfDay(
  time: string,
): { hours: number; minutes: number } | null {
  const match = time.trim().match(TIME_OF_DAY_PATTERN);
  if (!match) return null;

  const rawHours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();

  if (minutes > 59) return null;

  let hours = rawHours;
  if (period) {
    if (rawHours < 1 || rawHours > 12) return null;
    hours = period === 'PM' ? (rawHours === 12 ? 12 : rawHours + 12) : rawHours === 12 ? 0 : rawHours;
  } else if (rawHours > 23) {
    return null;
  }

  return { hours, minutes };
}

/**
 * Formats hours (0-23) and minutes as the canonical "hh:mm AM/PM" string.
 * Built by hand rather than via toLocaleTimeString so the result never depends
 * on the browser locale (24-hour locales) or on ICU's AM/PM separator.
 */
export function formatTimeOfDay(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

/** Formats a date's local time as the canonical "hh:mm AM/PM" string. */
export function formatDateTimeOfDay(date: Date): string {
  return formatTimeOfDay(date.getHours(), date.getMinutes());
}

export function buildInstallationDateTime(
  installationDate: Date,
  installationTime: string,
): Date {
  const parsed = parseTimeOfDay(installationTime);
  const result = new Date(installationDate);
  if (parsed) {
    result.setHours(parsed.hours, parsed.minutes, 0, 0);
  }
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

  // Expired/invalid token. This reaches the UI only when the token refresh in
  // UrqlProvider has already failed, so all that's left is to tell the user.
  // These stock auth errors carry no custom title/message, which is exactly
  // why the old catch-all branch rendered an empty toast.
  if (extensions?.code === 'UNAUTHENTICATED') {
    showAlertToast({
      title: responses.sessionExpired_title,
      description: responses.sessionExpired_message,
      variant: 'error',
    });
    return true;
  }

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

  // Custom GraphQL errors that carry their own human-readable title.
  if (extensions?.title) {
    showAlertToast({
      title: extensions.title,
      description: extensions.message,
      variant: extensions.type || 'error',
    });
    return true;
  }

  // Fallback for any error without a mapped code or title. Never show an empty
  // toast — surface a generic message (plus the raw message if the backend
  // provided one) so the user always sees something meaningful.
  showAlertToast({
    title: responses.genericError_title,
    description: extensions?.message || responses.genericError_message,
    variant: 'error',
  });
  return true;
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
  readingIndex?: number | null;
  elongation?: number | null;
  status?: string | null;
}
export interface BansheeCsvProceqData {
  status?: string | null;
  createdTimestamp?: number | null;
  updatedTimestamp?: number | null;
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
  'Status',
  'Created Timestamp',
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

    // Oldest measurement first, readings in acquisition order, so the export
    // never depends on the order the API happened to return.
    sortProceqDataAscending(request.proceqData).forEach((proceq) => {
      const proceqStatus = proceq.status ?? '';
      const createdTimestamp = proceq.createdTimestamp
        ? new Date(proceq.createdTimestamp).toISOString()
        : '';

      sortReadingsAscending(proceq.readings).forEach((reading) => {
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

/**
 * Builds the banshee CSV and triggers a browser download. No-op for empty data.
 * Shared by every plot page so the export format/behaviour stays identical.
 */
export function downloadBansheeCsv(
  data: readonly BansheeCsvRow[],
  filename = 'banshee_data.csv',
): void {
  if (!data.length) return;

  const csvFile = buildBansheeCsvFile(data, filename);
  const url = URL.createObjectURL(csvFile);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

/**
 * Turns a raw enum-ish bolt type (e.g. `MD_split_set_38`) into a display label
 * (`MD Split Set 38`). Short parts are treated as abbreviations and uppercased.
 */
export function formatBoltType(boltType: string | null | undefined): string {
  if (!boltType) return 'N/A';

  return boltType
    .split('_')
    .map((part) => {
      // Keep numbers as-is
      if (/^\d+$/.test(part)) return part;

      // Uppercase short abbreviations like MD, HD, SS
      if (part.length <= 3) return part.toUpperCase();

      // Capitalize normal words
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');
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
