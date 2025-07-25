import { Application, PrismaClient } from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

export async function hasAppAccessForCompany(
  prisma: PrismaClient,
  user: ActiveUserData,
  requiredApps: Application[],
  companyId?: string,
): Promise<boolean> {
  if (!companyId) {
    return false;
  }
  // Check user permission for the company and app(s)
  const hasPermission = Array.isArray(user.userPermissions)
    ? user.userPermissions.some(
        (permission) =>
          permission.companyId === companyId &&
          Array.isArray(permission.appsAccess) &&
          requiredApps.some((app) => permission.appsAccess.includes(app)),
      )
    : false;

  if (!hasPermission) {
    return false;
  }

  // Check company has an active plan for at least one of the required apps
  const hasActivePlan = await prisma.plan.findFirst({
    where: {
      companyId,
      applicationName: { in: requiredApps },
      OR: [{ expiringDate: null }, { expiringDate: { gt: new Date() } }],
    },
  });

  return !!hasActivePlan;
}
