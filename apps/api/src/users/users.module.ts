import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserUserPermissionsResolver } from './user-userPermissions.resolver';
import { RefreshTokenIdsStorage } from 'src/auth/refresh-token-storage';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    UserUserPermissionsResolver,
    RefreshTokenIdsStorage,
  ],
})
export class UsersModule {}
