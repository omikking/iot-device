import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GlobalRole, UserPermission } from '@prisma/client';

// Checks what companies they have access to
// Used for queries that returns lists of data (ex: sites, users), but only for the companies the user has access to
@Injectable()
export class CompaniesAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    const user = ctx.req.user;

    if (!user) {
      return false;
    }

    // Admins can access all companies
    if (user.globalRole === GlobalRole.SANDVIK_ADMIN) {
      ctx.allowedCompanyIds = null; // no filter
      ctx.isSandvikAdmin = true;
      return true;
    }

    // For other users, collect allowed company IDs from permissions
    const userPermissions: UserPermission[] = user.userPermissions || [];
    ctx.allowedCompanyIds = userPermissions.map(
      (permission) => permission.companyId,
    );
    ctx.isSandvikAdmin = false;

    // Deny access if user has no companies
    return ctx.allowedCompanyIds.length > 0;
  }
}
