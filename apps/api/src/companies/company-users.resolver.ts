import { Parent, ResolveField, Resolver, Context } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from './interface/company-data';
import { User } from './interface/user-data';

@Resolver('Company')
export class CompanyUsersResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('users')
  async getUsersWithPermissionsOfCompany(
    @Parent() company: Company,
    @Context() context: any,
  ): Promise<User[]> {
    context.companyId = company.id;

    // Get users with their permissions for this company only
    const userIds = await this.prisma.userPermission
      .findMany({
        where: {
          companyId: company.id,
        },
        select: {
          userId: true,
        },
      })
      .then((permissions) =>
        permissions.map((permission) => permission.userId),
      );

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
        isDeleted: false,
      },
    });

    return users;
  }
}
