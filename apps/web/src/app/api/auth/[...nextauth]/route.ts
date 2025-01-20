import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth/next';
import type { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';
import { UUID } from 'crypto';

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
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const authOptions: NextAuthOptions = {
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

        if (!response.ok) throw new Error('Failed to sign in');

        const user = (await response.json()) as User;
        return user;
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
  },

  callbacks: {
    async jwt({ token, user }) {
      console.log('dawdawdawd');
      if (user) return { ...token, ...user };

      const { exp } = jwtDecode(token.tokens.accessToken);
      const current = Math.floor(Date.now() / 1000);
      const isExpired = (exp ?? 0) < current;

      if (isExpired) {
        return refreshAccessToken(token);
      }

      return token;
    },

    async session({ token, session }) {
      session.user = token.userData as Session['user'];
      session.accessToken = token.tokens.accessToken;
      session.error = token.error;
      // TODO: Backend integration
      session.company = {
        id: (process.env.TEMP_COMPANY_ID as UUID) || '404',
        name: 'Default Company Name',
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
