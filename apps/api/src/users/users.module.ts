import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserUserPermissionsResolver } from './user-userPermissions.resolver';

@Module({
  providers: [UsersResolver, UsersService, UserUserPermissionsResolver],
})
export class UsersModule {}
