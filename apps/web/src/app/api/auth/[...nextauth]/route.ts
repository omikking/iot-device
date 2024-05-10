import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth/next';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;

        const { username, password } = credentials;

        const response = await fetch('http://localhost:3333/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (response.status == 401) {
          console.log(response.statusText);
          return null;
        }

        const user = await response.json();
        return user as any;
      },
    }),
  ],

  // callbacks: {
  //   async jwt(token, user) {
  //     if (user) {
  //       token.user = user;
  //     }
  //     return token;
  //   },
  //   async session(session, user) {
  //     session.user = user.user;
  //     return session;
  //   },
  // },
};

const handler = NextAuth(authOptions);
// const handler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
