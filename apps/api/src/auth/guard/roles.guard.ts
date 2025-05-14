import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const user = req.user;
    if (!user || !user.userPermissions || user.userPermissions.length === 0) {
      throw new ForbiddenException('User permissions not found');
    }

    const userRoles = user.userPermissions.map((p: { role: any }) => p.role);
    const hasRole = userRoles.some((role: string) =>
      requiredRoles.includes(role),
    );
    if (!hasRole) {
      throw new ForbiddenException('You do not have access');
    }

    return true;
  }
}
