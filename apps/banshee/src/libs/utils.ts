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
