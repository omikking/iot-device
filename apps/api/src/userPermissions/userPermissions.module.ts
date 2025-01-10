import { Module } from '@nestjs/common';
import { UserPermissionsService } from './userPermissions.service';
import { UserPermissionsResolver } from './userPermissions.resolver';

@Module({
  providers: [UserPermissionsService, UserPermissionsResolver],
})
export class UserPermissionsModule {}
