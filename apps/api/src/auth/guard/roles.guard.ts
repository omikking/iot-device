// apps/api/src/auth/guard/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { resolveCompanyId } from 'src/utils/resolveCompanyId';
import {
  APPS_KEY,
  PRISMA_MODEL_KEY,
  ROLES_KEY,
} from '../decorators/roles.decorator';
import { Application, Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  // This guard checks if a user has permission to make a query/mutation towards a company
  // Finds which companyId it's requesting towards
  // Also checks if specific role is needed etc.

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Support both GraphQL and REST
    const gqlContext = GqlExecutionContext.create(context);

    const isGraphQL =
      !!gqlContext.getContext().req || !!gqlContext.getContext().user;

    // TODO IMPLEMENT THIS
    const application: Application = isGraphQL
      ? gqlContext.getContext().application
      : context.switchToHttp().getRequest().application;

    const args = gqlContext.getArgs();

    // Get user data
    const user = isGraphQL
      ? gqlContext.getContext().req.user
      : context.switchToHttp().getRequest().user; // TODO check if user really exists there or should be req.user

    // Bypass everything for SANDVIK ADMINS
    if (user?.globalRole === Role.SANDVIK_ADMIN) {
      return true;
    }

    if (!user || !user.id) {
      throw new UnauthorizedException();
    }

    // Get required roles from metadata, such as Role.COMPANY_ADMIN
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (
      requiredRoles &&
      requiredRoles.length === 1 &&
      requiredRoles[0] === Role.SANDVIK_ADMIN
    ) {
      throw new ForbiddenException(
        'Only Sandvik Admin can perform this action.',
      );
    }

    // Get required apps from metadata, such as Application.PULL_TEST
    const requiredApps = this.reflector.getAllAndOverride<Application[]>(
      APPS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (
      requiredApps &&
      requiredApps.length > 0 &&
      !requiredApps.includes(application)
    ) {
      throw new ForbiddenException(
        'This operation is not allowed for this application.',
      );
    }

    // Get which model it should look after to find companyId
    const modelKey = this.reflector.getAllAndOverride<string>(
      PRISMA_MODEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    // TODO here for now, this is here to not block the resolvers that are not specified.
    // Should fix so these resolvers are not using this guard
    if (!modelKey) {
      return true;
      // throw new ForbiddenException('Model key is missing, include in resolver');
    }

    // Securely resolve companyId
    const companyId = await resolveCompanyId(this.prisma, args, modelKey);

    if (!companyId) {
      throw new ForbiddenException('No company id found in context');
    }

    // Check user's permission for this company including roles and apps if specified
    const hasRole = await this.prisma.userPermission.findFirst({
      where: {
        userId: user.id,
        companyId,
        // Check if user has any of the required roles
        ...(requiredRoles && requiredRoles.length > 0
          ? { role: { in: requiredRoles } }
          : {}),
        // Check if user has the required app access
        ...(requiredApps && requiredApps.length > 0
          ? { appsAccess: { has: application } }
          : {}),
      },
    });

    if (!hasRole) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
