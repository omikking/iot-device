/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';
import { UUID } from 'crypto';
import { Role } from '@/gql/graphql';

declare module 'next-auth/jwt' {
  interface JWT {
    userData: {
      id: UUID;
      email: string;
      fullName: string;
      globalRole: Role;
      isDeleted?: boolean;
      userPermissions?: {
        role: Role;
        companyId: UUID;
        appsAccess: Application[];
      }[];
    };
    tokens: {
      refreshToken: string;
      accessToken: string;
    };
    error?: string;
  }
}

declare module 'next-auth' {
  interface User {
    user: {
      id: UUID;
      email: string;
      fullName: string;
      globalRole: Role;
      isDeleted?: boolean;
      userPermissions?: {
        role: Role;
        companyId: UUID;
        appsAccess: Application[];
      }[];
    };
    tokens: {
      refreshToken: string;
      accessToken: string;
    };
    error?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: UUID;
      email: string;
      fullName: string;
      globalRole: Role;
      isDeleted?: boolean;
      userPermissions?: {
        role: Role;
        companyId: UUID;
        appsAccess: Application[];
      }[];
    };
    accessToken: string;
    error?: string;
  }
}
