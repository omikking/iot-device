import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth/next';
import type { User } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;

        console.log('username', email);
        console.log('password', password);

        const response = await fetch('http://localhost:3333/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Failed to sign in');

        const user: User = await response.json();

        console.log('user response json', user);
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      return token;
    },

    async session({ token, session }) {
      session.userData = token.userData;
      session.tokens = token.tokens;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
// const handler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
