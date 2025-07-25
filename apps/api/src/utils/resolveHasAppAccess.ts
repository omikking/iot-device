import { Application } from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

export function hasAppAccess(
  user: ActiveUserData,
  requiredApp: Application,
): boolean {
  return Array.isArray(user.userPermissions)
    ? user.userPermissions.some(
        (perm) =>
          Array.isArray(perm.appsAccess) &&
          perm.appsAccess.includes(requiredApp),
      )
    : false;
}
