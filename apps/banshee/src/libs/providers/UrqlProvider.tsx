'use client';

import { useMemo, useRef } from 'react';
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';
import { getSession, signOut, useSession } from 'next-auth/react';

const SIGN_IN_URL = '/auth/signin';

const useClient = () => {
  const { data: session } = useSession();

  // Keep the latest access token in a ref so the (memoised) client and any
  // retried operations always read the freshest token. Rebuilding the client
  // whenever the token changes would throw away the urql cache, so we don't.
  const tokenRef = useRef<string | undefined>(session?.accessToken);
  tokenRef.current = session?.accessToken;

  return useMemo(() => {
    // This client manages all of our GraphQL requests and results.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : undefined;

    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL is not defined');
    }

    // Once we've decided the session is unrecoverable, this guard stops us
    // firing repeated refreshes/sign-outs while the redirect is in flight.
    let isSigningOut = false;

    const endSession = () => {
      if (isSigningOut) return;
      isSigningOut = true;
      tokenRef.current = undefined;
      signOut({ redirect: true, callbackUrl: SIGN_IN_URL });
    };

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
              const token = tokenRef.current;
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
                endSession();
                return true;
              }

              // Only an expired/invalid token is worth a refresh + retry.
              // FORBIDDEN means "authenticated but not permitted" — refreshing
              // won't help, so we let it flow through to handleGraphQLErrors,
              // which renders the "Access denied" message.
              return error.graphQLErrors.some(
                (e: { extensions?: { code?: string } }) =>
                  e.extensions?.code === 'UNAUTHENTICATED',
              );
            },
            async refreshAuth() {
              if (isSigningOut) return;

              // getSession() hits /api/auth/session, which runs NextAuth's jwt
              // callback — that callback refreshes the access token when it has
              // expired. urql then retries the failed operation with the token
              // we stash below.
              const refreshed = await getSession();

              if (
                refreshed?.accessToken &&
                refreshed.error !== 'RefreshAccessTokenError'
              ) {
                tokenRef.current = refreshed.accessToken;
                return;
              }

              // Refresh token missing/expired/rejected — nothing left to do
              // but end the session and send the user to sign in.
              endSession();
            },
          };
        }),
        fetchExchange,
      ],
    });
    return client;
    // Built once; the current token flows in through tokenRef, so we never
    // rebuild the client (and never drop its cache) when the token changes.
  }, []);
};

const UrqlProvider = ({ children }: React.PropsWithChildren) => {
  const client = useClient();
  return <Provider value={client}>{children}</Provider>;
};

export default UrqlProvider;
