/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';
import { UUID } from 'crypto';

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: UUID;
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
    user: {
      id: UUID;
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
    user: {
      id: UUID;
      email: string;
      fullName: string;
      globalRole: string;
    };
    // TODO: Backend integration
    company: {
      id: UUID;
      name: string;
    };
    accessToken: string;
    error: string?;
  }
}
