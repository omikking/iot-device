import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GlobalRole, Role } from '@prisma/client';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const currentUser = ctx.getContext().req.user;
    const userId = ctx.getArgs().id;

    // Self-access always allowed
    if (userId === currentUser.id) {
      return true;
    }

    // Sandvik Admins can access any user
    if (currentUser.globalRole === GlobalRole.SANDVIK_ADMIN) {
      return true;
    }

    // TODO What is really needeed here?
    // Get companies where currentUser is a COMPANY_ADMIN
    const adminCompanies = await this.prisma.userPermission.findMany({
      where: {
        userId: currentUser.id,
        role: Role.COMPANY_ADMIN,
      },
      select: {
        companyId: true,
      },
    });

    const companyIds = adminCompanies.map((p) => p.companyId);

    if (companyIds.length === 0) {
      throw new ForbiddenException(errorTexts.permissionsDenied);
    }

    // Check if target user belongs to any of these companies
    const targetUserCompanyCount = await this.prisma.userPermission.count({
      where: {
        userId: userId,
        companyId: {
          in: companyIds,
        },
      },
    });

    if (targetUserCompanyCount === 0) {
      throw new ForbiddenException(errorTexts.permissionsDenied);
    }

    return true;
  }
}
