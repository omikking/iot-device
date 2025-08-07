import { Application, GlobalRole, Role } from '@prisma/client';

export interface ActiveUserData {
  id: string;
  email: string;
  fullName: string;
  globalRole: GlobalRole | null;
  userPermissions?: {
    role: Role;
    companyId: string;
    appsAccess: Application[];
  }[];
}
