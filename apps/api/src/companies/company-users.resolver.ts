import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from './interface/company-data';
import { User } from './interface/user-data';

@Resolver('Company')
export class CompanyUsersResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('users')
  async getUsersWithPermissionsOfCompany(
    @Parent() company: Company,
  ): Promise<User[]> {
    const userPermissions = await this.prisma.userPermission.findMany({
      where: {
        companyId: company.id,
      },
      include: {
        user: true,
      },
    });

    const users = userPermissions.map((permission) => {
      return {
        ...permission.user,
        userPermission: [permission],
      };
    });

    return users;
  }
}
