import type { Session, User } from 'next-auth';
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
          console.error('Signin error:', data);
          throw new Error(
            JSON.stringify({
              code: data?.code,
              title: data?.title,
              message: data?.message ?? 'Sign-in failed',
              status: response.status,
            }),
          );
        }

        const user = (await response.json()) as User;
        return user;
        // Build object that matches your `User` interface exactly
        // const userObj = {
        //   user: {
        //     id: data.userData.id,
        //     email: data.userData.email,
        //     fullName: data.userData.fullName,
        //     globalRole: data.userData.globalRole,
        //     userPermissions: data.userData.userPermissions,
        //   },
        //   // id: data.userData.id,
        //   // email: data.userData.email,
        //   // fullName: data.userData.fullName,
        //   // globalRole: data.userData.globalRole,
        //   // userPermissions: data.userData.userPermissions,
        //   tokens: {
        //     accessToken: data.tokens?.accessToken,
        //     refreshToken: data.tokens?.refreshToken,
        //   },
        // };

        // // Return as any (or as User) so NextAuth accepts it at runtime
        // return userObj as unknown as User;
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token', // no "__Host-" prefix (so domain can be set)
      options: {
        httpOnly: true,
        sameSite: 'none', // must be "none" for cross-subdomain cookies
        path: '/',
        secure: process.env.NODE_ENV === 'production', // must be true for HTTPS
        domain: process.env.COOKIE_DOMAIN, // set to ".groundsupport.mining.sandvik"
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
      console.log('session callback token:', JSON.stringify(token));
      session.user = token.userData as Session['user'];
      session.accessToken = token.tokens.accessToken;
      session.error = token.error;
      return session;
    },
  },
};
