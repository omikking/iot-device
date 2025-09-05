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
              console.error('URQL Error', error);
              return error.graphQLErrors.some(
                (e) => e.extensions?.code === 'FORBIDDEN' || 'UNAUTHENTICATED',
              );
            },
            // NextAuth is responsible for refreshing the token, not urql.
            async refreshAuth() {
              // TODO: This needs more testing/work.
              // if (error === 'RefreshAccessTokenError') {
              //   signOut();
              // }
              console.log('URQL refreshAuth called!');
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
