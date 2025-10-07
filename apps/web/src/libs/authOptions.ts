import type { Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';

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
    console.error(error);

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
        const data = await response.json();
        if (!response.ok) {
          /*const errorData = await response.json();

          throw new Error(
            JSON.stringify({
              code: errorData.code,
              title: errorData.title,
              message: errorData.message,
              status: response.status,
            }),
          );*/
          console.error('Sign-in failed:', data); // 🟢 CHANGED: log real error
          return null;
        }

        //const user = (await response.json()) as User;
        const returnedUser = {
          user: data.userData, // <- satisfies `user` property required by your User type
          id: data.userData.id,
          email: data.userData.email,
          name: data.userData.fullName,
          tokens: data.tokens,
          userData: data.userData,
        };
        console.log(
          'Authorize returning:',
          JSON.stringify(returnedUser, null, 2),
        );
        return returnedUser;
        //return user;
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token', //no "__Host-" prefix, since we're setting domain
      options: {
        httpOnly: true,
        sameSite: 'none', // must be "none" for cross-subdomain
        path: '/',
        secure: process.env.NODE_ENV === 'production', // must be true for HTTPS
        domain: process.env.COOKIE_DOMAIN, // will be .groundsupport.mining.sandvik
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: false,
        sameSite: 'none',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.COOKIE_DOMAIN,
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: false,
        sameSite: 'none',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.COOKIE_DOMAIN,
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
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
      return session;
    },
  },
};
