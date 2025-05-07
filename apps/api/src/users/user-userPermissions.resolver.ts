import { Parent, ResolveField, Resolver, Context } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPermission } from './interface/userPermission-data';
import { User } from './interface/user-data';

@Resolver('User')
export class UserUserPermissionsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('userPermissions')
  async getUserPermissionsOfUser(
    @Parent() user: User,
    @Context() context: any,
  ): Promise<UserPermission[]> {
    const companyId = context.companyId;

    // If we have a company context, filter by both user and company
    if (companyId) {
      return this.prisma.userPermission.findMany({
        where: {
          userId: user.id,
          companyId: companyId,
        },
      });
    }

    // Otherwise, get all permissions from all companies for this user
    return this.prisma.userPermission.findMany({
      where: {
        userId: user.id,
      },
    });
  }
}
