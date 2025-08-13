import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from './interface/company-data';

@Resolver('Company')
export class CompanyInvitationsResolver {
  constructor(private prisma: PrismaService) {}

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
