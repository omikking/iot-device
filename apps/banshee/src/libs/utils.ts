import { responses } from '@/app/uitexts/responses';
import { showAlertToast } from '@gsp/ui-banshee';
import { CombinedError } from 'urql';
import { BoltType } from '@/gql/graphql';
import {
  sortProceqDataAscending,
  sortReadingsAscending,
} from '@/libs/latest-measurement';

// Accepts the 24-hour "HH:mm" the UI now writes, and still the "h:mm AM/PM" it
// used to, so a form seeded from a value stored before the switch keeps
// parsing. Whitespace before the period is optional and may be a non-breaking
// space, which is what some browsers/ICU versions emit for locale-formatted
// times.
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
    hours =
      period === 'PM'
        ? rawHours === 12
          ? 12
          : rawHours + 12
        : rawHours === 12
          ? 0
          : rawHours;
  } else if (rawHours > 23) {
    return null;
  }

  return { hours, minutes };
}

/**
 * Formats hours (0-23) and minutes as the canonical 24-hour "HH:mm" string —
 * the clock the rest of the UI writes times on, see `measurement-date.ts`.
 * Built by hand rather than via toLocaleTimeString so the result never depends
 * on the browser locale.
 */
export function formatTimeOfDay(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Formats a date's local time as the canonical "HH:mm" string. */
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
      title: 'Validation error',
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
  name?: string | null;
  serialNumber?: string | null;
  site?: { siteName?: string | null } | null;
  drive?: { driveName?: string | null } | null;
  level?: { levelName?: string | null } | null;
  location?: { locationName?: string | null } | null;
  comment?: string | null;
  proceqData?: readonly BansheeCsvProceqData[] | null;
}

const BANSHEE_CSV_HEADERS = [
  'Banshee Name',
  'Serial Number',
  'Site',
  'Drive',
  'Level',
  'Location',
  'Comment',
  'Created Timestamp',
  'Total Elongation (mm)',
  'Status',
];

/** Builds the flattened banshee CSV string (same format used by Export CSV). */
export function buildBansheeCsv(data: readonly BansheeCsvRow[]): string {
  const csvRows: string[] = [BANSHEE_CSV_HEADERS.join(',')];

  data.forEach((request) => {
    const name = request.name ?? '';
    const serialNumber = request.serialNumber ?? '';
    const siteName = request.site?.siteName ?? '';
    const driveName = request.drive?.driveName ?? '';
    const levelName = request.level?.levelName ?? '';
    const locationName = request.location?.locationName ?? '';
    const comment = request.comment ?? '';

    // Oldest measurement first, readings in acquisition order, so the export
    // never depends on the order the API happened to return.
    sortProceqDataAscending(request.proceqData).forEach((proceq) => {
      const createdTimestamp = proceq.createdTimestamp
        ? new Date(proceq.createdTimestamp).toISOString()
        : '';

      sortReadingsAscending(proceq.readings).forEach((reading) => {
        const elongation = reading.elongation ?? '';
        const readingStatus = reading.status ?? '';

        const row = [
          name,
          serialNumber,
          siteName,
          driveName,
          levelName,
          locationName,
          comment,
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
 * The established display notation for each bolt type, matching what the
 * pull-test app renders (`convertBoltType` in apps/pull-test/src/libs/utils.ts).
 *
 * An explicit table rather than something derived from the token structure: the
 * underscores do not encode where a decimal point belongs (`1_8` -> `1.8`), that
 * the trailing `M` is a lowercase unit, that a diameter takes `Ø`, or where the
 * family separators go. `Record<BoltType, string>` keeps this exhaustive — adding
 * an enum value fails the build until it is given a label here.
 */
const BOLT_TYPE_LABELS: Record<BoltType, string> = {
  [BoltType.D47Md_1_8M]: 'D47 MD - 1.8 m',
  [BoltType.D47Md_2_1M]: 'D47 MD - 2.1 m',
  [BoltType.D47Md_2_4M]: 'D47 MD - 2.4 m',
  [BoltType.D47Md_3_0M]: 'D47 MD - 3.0 m',
  [BoltType.D47Md_3_8M]: 'D47 MD - 3.8 m',
  [BoltType.D47Mdx_1_8M]: 'D47 MDX - 1.8 m',
  [BoltType.D47Mdx_2_1M]: 'D47 MDX - 2.1 m',
  [BoltType.D47Mdx_2_4M]: 'D47 MDX - 2.4 m',
  [BoltType.D47Mdx_3_0M]: 'D47 MDX - 3.0 m',
  [BoltType.D47Mdx_3_8M]: 'D47 MDX - 3.8 m',
  [BoltType.D47Mdx_4_0M]: 'D47 MDX - 4.0 m',
  [BoltType.D39Mdx_1_8M]: 'D39 MDX - 1.8 m',
  [BoltType.D39Mdx_2_1M]: 'D39 MDX - 2.1 m',
  [BoltType.D39Mdx_2_4M]: 'D39 MDX - 2.4 m',
  [BoltType.D39Mdx_3_0M]: 'D39 MDX - 3.0 m',
  [BoltType.D47MdxPegBolt_1_8M]: 'D47 MDX - Peg Bolt - 1.8 m',
  [BoltType.D47MdxPegBolt_2_1M]: 'D47 MDX - Peg Bolt - 2.1 m',
  [BoltType.D47MdxPegBolt_2_4M]: 'D47 MDX - Peg Bolt - 2.4 m',
  [BoltType.D47MdxPegBolt_3_0M]: 'D47 MDX - Peg Bolt - 3.0 m',
  [BoltType.D39MdxPegBolt_1_8M]: 'D39 MDX - Peg Bolt - 1.8 m',
  [BoltType.D39MdxPegBolt_2_1M]: 'D39 MDX - Peg Bolt - 2.1 m',
  [BoltType.D39MdxPegBolt_2_4M]: 'D39 MDX - Peg Bolt - 2.4 m',
  [BoltType.D39MdxPegBolt_3_0M]: 'D39 MDX - Peg Bolt - 3.0 m',
  [BoltType.D47MdPegBolt_1_8M]: 'D47 MD - Peg Bolt - 1.8 m',
  [BoltType.D47MdPegBolt_2_1M]: 'D47 MD - Peg Bolt - 2.1 m',
  [BoltType.D47MdPegBolt_2_4M]: 'D47 MD - Peg Bolt - 2.4 m',
  [BoltType.D47MdPegBolt_3_0M]: 'D47 MD - Peg Bolt - 3.0 m',
  [BoltType.FrictionBolt_47Mm]: 'Friction Bolt Ø47 mm',
  [BoltType.FrictionBolt_47Mm_1_8M]: 'Friction Bolt Ø47 mm - 1.8 m',
  [BoltType.FrictionBolt_47Mm_2_1M]: 'Friction Bolt Ø47 mm - 2.1 m',
  [BoltType.FrictionBolt_47Mm_2_4M]: 'Friction Bolt Ø47 mm - 2.4 m',
  [BoltType.FrictionBolt_47Mm_3_0M]: 'Friction Bolt Ø47 mm - 3.0 m',
  [BoltType.FrictionBolt_39Mm]: 'Friction Bolt Ø39 mm',
  [BoltType.FrictionBolt_33Mm]: 'Friction Bolt Ø33 mm',
  [BoltType.SpiralFrictionBolt]: 'Spiral Friction Bolt',
  [BoltType.KinlocBolt]: 'Kinloc Bolt',
  [BoltType.KinlocBoltIndie]: 'Kinloc Bolt Indie',
};

/**
 * Renders a bolt type as its display label (`D47_MD_1_8_M` -> `D47 MD - 1.8 m`).
 * An unrecognised value is passed through as-is rather than mangled.
 */
export function formatBoltType(boltType: string | null | undefined): string {
  if (!boltType) return 'N/A';

  return BOLT_TYPE_LABELS[boltType as BoltType] ?? boltType;
}

export function toSentenceCase(value: string | null | undefined): string {
  if (!value) return '';

  const words = value.toLowerCase().split('_').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
