import NextAuth from 'next-auth';

import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: email;
      firstName: string;
    };
    tokens: {
      accessToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: number;
      email: string;
      firstName: string;
    };
    tokens: {
      accessToken: string;
    };
  }
}
