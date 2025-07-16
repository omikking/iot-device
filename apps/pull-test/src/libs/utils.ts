import { Application, BoltResult } from '@/gql/graphql';
import { showAlertToast } from '@gsp/ui';
import { CombinedError } from 'urql';

// Function to get application name based on enum
export const getAppName = (app: Application): string => {
  const applicationNames = {
    [Application.PullTest]: 'Pull Test',
    [Application.PullTestOperator]: 'Pull Test Operator',
    [Application.Banshee]: 'Banshee',
  };
  return applicationNames[app];
};

// Function to capitalize the first letter of a string
export const capitalizeFirstLetter = (
  text: string | null | undefined,
): string => {
  if (!text) return 'N/A';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Function to generate bolt specifications
export const generateBoltSpecifications = (
  boltData: BoltResult,
  names: {
    siteName?: string;
    levelName?: string;
    driveName?: string;
    locationName?: string;
  },
) => {
  return [
    {
      title: 'Site',
      text: names.siteName || 'N/A',
    },
    {
      title: 'Bolt',
      text: boltData.boltNumber?.toString() || 'N/A',
    },
    {
      title: 'Bolt type',
      text: boltData.boltType || 'N/A',
    },
    {
      title: 'Level',
      text: names.levelName || 'N/A',
    },
    {
      title: 'Drive',
      text: names.driveName || 'N/A',
    },
    {
      title: 'Location',
      text: names.locationName || 'N/A',
    },
    {
      title: 'Position in ring',
      text: boltData.positionInRing.replaceAll('_', '-') || 'N/A',
    },
    {
      title: 'Result',
      text: capitalizeFirstLetter(boltData.result) || 'N/A',
    },
    {
      title: 'Abort Reason',
      text:
        capitalizeFirstLetter(boltData.abortReason).replaceAll('_', ' ') ||
        'N/A',
    },
  ];
};

// Function to handle GraphQL errors
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

  // Validation errors from backend
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
