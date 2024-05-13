import NextAuth from 'next-auth';

import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';
declare module 'next-auth' {
  interface Session {
    userData: {
      id: number;
      email: email;
      firstName: string;
      lastName: string;
    };
    tokens: {
      accessToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userData: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
    tokens: {
      accessToken: string;
    };
  }
}
