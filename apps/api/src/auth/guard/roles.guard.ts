import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
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
import { errorTexts } from 'src/errorTexts/errorTexts';

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
    // Get required roles from metadata, such as Role.COMPANY_ADMIN
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Get required apps from metadata, such as Application.PULL_TEST
    const requiredApps = this.reflector.getAllAndOverride<Application[]>(
      APPS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Get prisma model
    const modelKey = this.reflector.getAllAndOverride<string>(
      PRISMA_MODEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If not provided, no rules, allow access
    if (!requiredRoles && !requiredApps && !modelKey) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const args = gqlContext.getArgs();

    // Get user data
    const req = gqlContext.getContext().req;
    const user = req && req.user;

    // Bypass everything for SANDVIK ADMINS
    if (user?.globalRole === Role.SANDVIK_ADMIN) {
      return true;
    }

    if (!user || !user.id) {
      throw new UnauthorizedException(errorTexts.authUserError_title);
    }

    // Check if user is soft deleted
    if (user.isDeleted === true) {
      throw new UserInputError('', {
        extensions: {
          code: errorTexts.userAccountDeactivatedCode,
          title: errorTexts.userAccountDeactivatedTitle,
          message: errorTexts.userAccountDeactivatedMessage,
        },
      });
    }

    if (
      requiredRoles &&
      requiredRoles.length === 1 &&
      requiredRoles[0] === Role.SANDVIK_ADMIN
    ) {
      throw new ForbiddenException(
        'Only Sandvik Admin can perform this action.',
      );
    }

    const companyId = await resolveCompanyId(this.prisma, args, modelKey);

    if (!companyId) {
      throw new ForbiddenException('No company id found in context');
    }

    if (requiredApps && requiredApps.length > 0) {
      const activePlan = await this.prisma.plan.findFirst({
        where: {
          companyId,
          applicationName: { in: requiredApps },
          // Plan is not expired (expiringDate is null or in the future)
          OR: [{ expiringDate: null }, { expiringDate: { gt: new Date() } }],
        },
      });

      if (!activePlan) {
        throw new ForbiddenException(
          'Company does not have an active plan for this application.',
        );
      }
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
          ? { appsAccess: { hasSome: requiredApps } }
          : {}),
      },
    });

    if (!hasRole) {
      throw new ForbiddenException(
        'Missing company access, role or app permission.',
      );
    }

    return true;
  }
}
