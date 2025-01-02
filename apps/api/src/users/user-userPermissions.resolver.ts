import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './interface/user-data';
import { User } from './interface/user-data';

@Resolver('User')
export class UserUserPermissionsResolver {
  constructor(private prisma: PrismaService) {}

  // TODO fix logic here. This is not correct.
  @ResolveField('users')
  async getUserPermissionsOfUser(@Parent() user: User): Promise<User[]> {
    const userPermissions = await this.prisma.userPermission.findMany({
      where: {
        userId: user.id,
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
