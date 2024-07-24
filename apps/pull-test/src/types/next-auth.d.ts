import NextAuth from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';

export declare module 'next-auth/jwt' {
  interface JWT {
    userData: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
    tokens: {
      refreshToken: string;
      accessToken: string;
    };
    error: string?;
  }
}

export declare module 'next-auth' {
  interface User {
    userData: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
    tokens: {
      refreshToken: string;
      accessToken: string;
    };
    error: string?;
  }
}

export declare module 'next-auth' {
  interface Session {
    userData: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
    accessToken: string;
    error: string?;
  }
}
