import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth/next';

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

        if (response.status == 401) {
          console.log(response.statusText);
          return null;
        }

        if (!response.ok) {
          console.log('response not ok');
          return null;
        }

        const user = await response.json();

        console.log('user response json', user);
        console.log('response body', response.body);
        // console.log('response', response);
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

  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };
      console.log('token callback', token);
      console.log('user callback', user);

      return token;
    },

    async session(session, user) {
      console.log('session!!!', session);
      console.log('user', user);
      // session.user = user.user;
      // return session;
    },
  },
};

const handler = NextAuth(authOptions);
// const handler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
