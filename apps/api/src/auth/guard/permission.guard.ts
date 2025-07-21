import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Application, GlobalRole, Role } from '@prisma/client';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { Reflector } from '@nestjs/core';

export const REQUIRED_ROLES_KEY = 'requiredRoles';
export const REQUIRED_APPS_KEY = 'requiredApps';
export const REQUIRE_COMPANY_ACCESS_KEY = 'requireCompanyAccess';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const currentUser = ctx.getContext().req.user;

    // Remove later
    const info = ctx.getInfo();
    console.log('Resolver name:', info.fieldName);

    if (!currentUser) {
      throw new ForbiddenException(errorTexts.userNotAuthenticated);
    }

    // SANDVIK_ADMIN bypass all checks
    if (currentUser.globalRole === GlobalRole.SANDVIK_ADMIN) {
      return true;
    }

    // Check if user has no permissions at all
    if (
      !currentUser.userPermissions ||
      currentUser.userPermissions.length === 0
    ) {
      throw new ForbiddenException(errorTexts.permissionsDenied);
    }

    // Get requirements from decorators
    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(REQUIRED_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const requiredApps =
      this.reflector.getAllAndOverride<Application[]>(REQUIRED_APPS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const requireCompanyAccess =
      this.reflector.getAllAndOverride<boolean>(REQUIRE_COMPANY_ACCESS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    let filteredPermissions = [...currentUser.userPermissions];

    // Filter by role if required
    if (requiredRoles.length > 0) {
      filteredPermissions = filteredPermissions.filter((permission) =>
        requiredRoles.includes(permission.role),
      );
    }

    // Check that user has access to company if required
    if (requireCompanyAccess) {
      // First try to get companyId from context (set by CompanyContextGuard)
      let companyId = ctx.getContext().companyId;

      if (!companyId) {
        // Fallback for direct company operations where ID is company ID
        const id = ctx.getArgs().id;
        if (id) {
          // For direct company operations
          companyId = id;
        } else {
          // No company ID found - deny access
          throw new ForbiddenException(errorTexts.permissionsDenied);
        }
      }
      // Now filter permissions by company
      filteredPermissions = filteredPermissions.filter(
        (permission) => permission.companyId === companyId,
      );
    }

    // Check if any filtered permission has the required app access if required
    const hasAccess = filteredPermissions.some((permission) => {
      return (
        requiredApps.length === 0 ||
        requiredApps.some((app) => (permission.appsAccess || []).includes(app))
      );
    });

    if (!hasAccess) {
      console.log('3');
      throw new ForbiddenException(errorTexts.permissionsDenied);
    }

    return true;
  }
}
