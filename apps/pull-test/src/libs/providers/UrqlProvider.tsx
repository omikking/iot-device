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
    const client = new Client({
      // TODO: set url to 'process.env.NEXT_PUBLIC_GRAPHQL_URL'
      url: 'http://localhost:3333/graphql',
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
              console.error('URQL Error Details:', {
                error,
                graphQLErrors: error.graphQLErrors,
                extensions: error.graphQLErrors?.map((e) => e.extensions),
              });

              // Check for user account deactivated error
              const hasUserDeactivatedError = error.graphQLErrors?.some(
                (e: { extensions?: { code?: string } }) =>
                  e.extensions?.code === 'USER_ACCOUNT_DEACTIVATED',
              );

              // If user account is deactivated, trigger logout immediately
              if (hasUserDeactivatedError) {
                console.log('User account deactivated, triggering logout');
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
