import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from './interface/company-data';
import { UserPermission } from './interface/userPermission-data';

@Resolver('Company')
export class CompanyUserPermissionsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('userPermissions')
  async getUserPermissionsOfCompany(
    @Parent() company: Company,
  ): Promise<UserPermission[]> {
    const userPermissions = await this.prisma.userPermission.findMany({
      where: {
        companyId: company.id,
      },
    });

    console.log('Fetched userPermissions:', userPermissions);

    return userPermissions;
  }
}
