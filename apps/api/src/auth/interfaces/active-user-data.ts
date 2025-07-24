import { Application } from '@prisma/client';

export interface ActiveUserData {
  id: string;
  email: string;
  fullName: string;
  globalRole: string | null;
  userPermissions?: {
    role: string;
    companyId: string;
    appsAccess: Application[];
  }[];
}
