import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from './interface/company-data';

@Resolver('Company')
@UseGuards(JwtGuard, RolesGuard)
export class CompanyInvitationsResolver {
  constructor(private prisma: PrismaService) {}

  @Roles([Role.COMPANY_ADMIN], [], 'company')
  @ResolveField('pendingInvitations')
  async getPendingInvitations(@Parent() company: Company) {
    return this.prisma.invitation.findMany({
      where: {
        companyId: company.id,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
