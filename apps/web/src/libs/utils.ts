import { showAlertToast } from '@gsp/ui';
import { CombinedError } from 'urql';

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
