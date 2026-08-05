import { responses } from '@/app/uitexts/responses';
import { showAlertToast } from '@gsp/ui-core';
import { CombinedError } from 'urql';

type NestJsValidationError = {
  message?: string | string[];
};

type GraphQLErrorExtensions = {
  code?: string;
  title?: string;
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  originalError?: NestJsValidationError;
};

/**
 * Surfaces a urql error as a toast. Returns true when an error was handled so
 * callers can bail out of rendering.
 */
export const handleGraphQLErrors = (error: CombinedError | undefined) => {
  if (!error?.graphQLErrors?.length) {
    return false;
  }

  const graphQLError = error.graphQLErrors[0];
  const extensions =
    graphQLError.extensions as unknown as GraphQLErrorExtensions;

  // Expired/invalid token. This reaches the UI only when the token refresh in
  // UrqlProvider has already failed, so all that's left is to tell the user.
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

  // Validation errors from the backend.
  if (
    extensions?.code === 'BAD_REQUEST' &&
    extensions?.originalError?.message
  ) {
    const validationErrors = extensions.originalError.message;
    const errorMessage = Array.isArray(validationErrors)
      ? validationErrors.join(', ')
      : validationErrors;

    showAlertToast({
      title: responses.validationError_title,
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

  // Never show an empty toast — always fall back to a generic message.
  showAlertToast({
    title: responses.genericError_title,
    description: extensions?.message || responses.genericError_message,
    variant: 'error',
  });
  return true;
};
