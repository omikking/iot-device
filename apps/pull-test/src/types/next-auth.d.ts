/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    userData: {
      id: number;
      email: string;
      fullName: string;
    };
    tokens: {
      refreshToken: string;
      accessToken: string;
    };
    error: string?;
  }
}

declare module 'next-auth' {
  interface User {
    userData: {
      id: number;
      email: string;
      fullName: string;
    };
    tokens: {
      refreshToken: string;
      accessToken: string;
    };
    error: string?;
  }
}

declare module 'next-auth' {
  interface Session {
    userData: {
      id: number;
      email: string;
      fullName: string;
    };
    accessToken: string;
    error: string?;
  }
}
