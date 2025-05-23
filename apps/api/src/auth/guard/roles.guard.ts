import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Application, Role, GlobalRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredApps = this.reflector.getAllAndOverride<Application[]>(
      'apps',
      [context.getHandler(), context.getClass()],
    );

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const user = req.user;

    if (!user || !user.userPermissions || user.userPermissions.length === 0) {
      throw new ForbiddenException('User permissions not found');
    }

    if (user.globalRole === GlobalRole.SANDVIK_ADMIN) {
      return true;
    }

    const hasAccess = user.userPermissions.some((permission: any) => {
      const roleMatches =
        !requiredRoles || requiredRoles.includes(permission.role);
      const appMatches =
        !requiredApps ||
        requiredApps.some((app) => (permission.appsAccess || []).includes(app));
      return roleMatches && appMatches;
    });

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access');
    }
    return true;
  }
}
