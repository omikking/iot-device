/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';
import { UUID } from 'crypto';
import { Application, Role } from '@/gql/graphql';

type UserData = {
  id: UUID;
  email: string;
  fullName: string;
  globalRole: Role;
  userPermissions?: {
    role: Role;
    companyId: UUID;
    appsAccess: Application[];
  }[];
};

type Tokens = {
  refreshToken: string;
  accessToken: string;
};

declare module 'next-auth/jwt' {
  interface JWT {
    userData: UserData;
    tokens: Tokens;
    error?: string;
  }
}

declare module 'next-auth' {
  interface User {
    user: UserData;
    tokens: Tokens;
    error?: string;
  }

  interface Session {
    user: UserData;
    accessToken: string;
    error?: string;
  }
}
