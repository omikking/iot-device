import { Application, GlobalRole, PrismaClient } from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

export async function hasAppAccessForCompany(
  prisma: PrismaClient,
  user: ActiveUserData,
  requiredApps: Application[],
  companyId?: string,
): Promise<boolean> {
  if (user.globalRole === GlobalRole.SANDVIK_ADMIN) {
    return true;
  }

  if (!companyId) {
    return false;
  }

  // Check company has an active plan for at least one of the required apps
  const activePlans = await prisma.plan.findMany({
    where: {
      companyId,
      applicationName: { in: requiredApps },
      OR: [{ expiringDate: null }, { expiringDate: { gt: new Date() } }],
    },
  });

  const planNames = activePlans.map((plan) => plan.applicationName);

  // Check if user has permissions for the required apps in the specified company
  const hasPermission = Array.isArray(user.userPermissions)
    ? user.userPermissions.some(
        (permission) =>
          permission.companyId === companyId &&
          Array.isArray(permission.appsAccess) &&
          planNames.some((app) => permission.appsAccess.includes(app)),
      )
    : false;

  if (!hasPermission) {
    return false;
  }

  return !!activePlans;
}
