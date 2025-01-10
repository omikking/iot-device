import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPermission } from './interface/userPermission-data';
import { User } from './interface/user-data';

@Resolver('User')
export class UserUserPermissionsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('userPermissions')
  async getUserPermissionsOfUser(
    @Parent() user: User,
  ): Promise<UserPermission[]> {
    const userPermissions = await this.prisma.userPermission.findMany({
      where: {
        userId: user.id,
      },
    });

    return userPermissions;
  }
}
