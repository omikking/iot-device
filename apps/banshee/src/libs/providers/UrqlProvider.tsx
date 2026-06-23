'use client';

import { useMemo } from 'react';
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';
import { signOut, useSession } from 'next-auth/react';

const useClient = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const error = session?.error;

  return useMemo(() => {
    // This client manages all of our GraphQL requests and results.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : undefined;

    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL is not defined');
    }
    const client = new Client({
      url: apiUrl,
      // Apollo Server 4 blocks multipart/form-data (file upload) requests as
      // potential CSRF unless this preflight header is present. Sending it on
      // every request keeps CSRF protection enabled while allowing uploads.
      fetchOptions: {
        headers: {
          'apollo-require-preflight': 'true',
        },
      },
      exchanges: [
        cacheExchange,
        authExchange(async (utils) => {
          return {
            addAuthToOperation(operation) {
              if (!token) return operation;
              return utils.appendHeaders(operation, {
                Authorization: `Bearer ${token}`,
              });
            },
            didAuthError(error) {
              const hasUserDeactivatedError = error.graphQLErrors?.some(
                (e: { extensions?: { code?: string } }) =>
                  e.extensions?.code === 'USER_ACCOUNT_DEACTIVATED',
              );

              if (hasUserDeactivatedError) {
                setTimeout(() => {
                  signOut({ redirect: true, callbackUrl: '/auth/signin' });
                }, 100);
                return true;
              }

              return error.graphQLErrors.some(
                (e: { extensions?: { code?: string } }) =>
                  e.extensions?.code === 'FORBIDDEN' ||
                  e.extensions?.code === 'UNAUTHENTICATED',
              );
            },
            // NextAuth is responsible for refreshing the token, not urql.
            async refreshAuth() {
              // TODO: This needs more testing/work.
              if (error === 'RefreshAccessTokenError') {
                signOut();
              }
            },
          };
        }),
        fetchExchange,
      ],
    });
    return client;
  }, [token]);
};

const UrqlProvider = ({ children }: React.PropsWithChildren) => {
  const client = useClient();
  return <Provider value={client}>{children}</Provider>;
};

export default UrqlProvider;
