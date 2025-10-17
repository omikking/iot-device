import type { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';

// Cache to prevent duplicate refresh requests for the same token
const refreshCache = new Map<
  string,
  { promise: Promise<JWT>; timestamp: number }
>();

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/auth/refresh-tokens`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We could also refactor to send through Authorization header, but this works.
        body: JSON.stringify({ refreshToken: token.tokens.refreshToken }),
      },
    );

    const refreshedTokens: {
      accessToken: string;
      refreshToken: string;
    } = await response.json();

    if (!response.ok) {
      throw token;
    }

    return {
      ...token,
      tokens: {
        accessToken: refreshedTokens.accessToken,
        refreshToken: refreshedTokens.refreshToken,
      },
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;

        const response = await fetch(`${process.env.BACKEND_URL}/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();

          throw new Error(
            JSON.stringify({
              code: errorData.code,
              title: errorData.title,
              message: errorData.message,
              status: response.status,
            }),
          );
        }

        const user = (await response.json()) as User;
        return user;
      },
    }),
  ],

  pages: {
    signIn: '/api/auth/signin',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Clear cache when user signs in
        refreshCache.clear();
        return { ...token, ...user };
      }

      // Check if the refresh token has expired
      const refreshTokenDecoded = jwtDecode(token.tokens.refreshToken);
      const current = Math.floor(Date.now() / 1000);
      const refreshTokenExpired = (refreshTokenDecoded.exp ?? 0) < current;

      if (refreshTokenExpired) {
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }

      const { exp } = jwtDecode(token.tokens.accessToken);
      const isExpired = (exp ?? 0) < current;

      if (isExpired) {
        const cacheKey = token.tokens.refreshToken;

        // Return existing refresh promise if one is in progress
        let cachedEntry = refreshCache.get(cacheKey);

        if (!cachedEntry) {
          // Create new refresh promise and cache it
          const promise = refreshAccessToken(token);
          cachedEntry = { promise, timestamp: Date.now() };
          refreshCache.set(cacheKey, cachedEntry);

          // Auto-cleanup after cache duration
          setTimeout(() => refreshCache.delete(cacheKey), 5000);
        }

        return await cachedEntry.promise;
      }

      return token;
    },

    async session({ token, session }) {
      session.user = token.userData as Session['user'];
      session.accessToken = token.tokens.accessToken;
      session.error = token.error;
      return session;
    },
  },
};
