import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

export function getAllowedCompanyIds(user: ActiveUserData): string[] {
  return Array.isArray(user?.userPermissions)
    ? user.userPermissions
        .filter((p) => p && typeof p.companyId === 'string')
        .map((p) => p.companyId)
    : [];
}
