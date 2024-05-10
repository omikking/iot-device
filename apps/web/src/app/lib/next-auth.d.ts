import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      firstName: string;
    };
    tokens: {
      accessToken: string;
    };
  }
}
