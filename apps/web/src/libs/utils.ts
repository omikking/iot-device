import { responses } from '@/app/uitexts/responses';
import { Application, Role } from '@/gql/graphql';
import { showAlertToast } from '@gsp/ui';
import { Session } from 'next-auth';
import { CombinedError } from 'urql';

// Function to capitalize the first letter of a word
export const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

// Function to format date from timestamp
export const formattedDate = (timestamp: Date | number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// Function to get application name based on enum
export const getAppName = (app: Application): string => {
  const applicationNames = {
    [Application.PullTest]: 'Pull Test',
    [Application.PullTestTechnician]: 'Pull Test Technician',
    [Application.Banshee]: 'Banshee',
  };
  return applicationNames[app];
};

// Function to check if the user is a Company Admin
export const isCompanyAdmin = (
  userPermissions: Session['user']['userPermissions'] | undefined,
  companyId: string,
): boolean => {
  if (!userPermissions) {
    return false;
  }

  return userPermissions.some(
    (permission) =>
      permission.role === Role.CompanyAdmin &&
      permission.companyId === companyId,
  );
};

// Function to check if the user is a Sandvik Technician for the company
export const isSandvikTechnician = (
  userPermissions: Session['user']['userPermissions'] | undefined,
  companyId: string,
): boolean => {
  if (!userPermissions) {
    return false;
  }

  return userPermissions.some(
    (permission) =>
      permission.role === Role.SandvikTechnician &&
      permission.companyId === companyId,
  );
};

// Function to check if the user is a Company User for the company
export const isCompanyUser = (
  userPermissions: Session['user']['userPermissions'] | undefined,
  companyId: string,
): boolean => {
  if (!userPermissions) {
    return false;
  }

  return userPermissions.some(
    (permission) =>
      permission.role === Role.CompanyUser &&
      permission.companyId === companyId,
  );
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
