import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

export function getAllowedCompanyIds(user: ActiveUserData): string[] {
  return Array.isArray(user?.userPermissions)
    ? user.userPermissions
        .filter(
          (permission) =>
            permission && typeof permission.companyId === 'string',
        )
        .map((permission) => permission.companyId)
    : [];
}
