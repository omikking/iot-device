import type { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';

let refreshPromise: Promise<JWT> | null = null;

// here is a fucking problem
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
    // console.error(
    //   'LOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOL',
    //   error,
    // );

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
      if (user) return { ...token, ...user };

      const { exp } = jwtDecode(token.tokens.accessToken);
      const current = Math.floor(Date.now() / 1000);
      const isExpired = (exp ?? 0) < current;

      if (isExpired) {
        console.log('Expired token, refreshing...');
        console.log('Before refresh:', jwtDecode(token.tokens.refreshToken));

        try {
          if (!refreshPromise) {
            refreshPromise = refreshAccessToken(token);
          }
          const refreshedSession = await refreshPromise;
          console.log(
            'After refresh:',
            jwtDecode(refreshedSession.tokens.refreshToken),
          );
          return refreshedSession;
        } finally {
          refreshPromise = null;
        }
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
