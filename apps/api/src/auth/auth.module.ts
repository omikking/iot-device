import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { RefreshTokenIdsStorage } from './refresh-token-storage';
import { InvitationModule } from '../invitation/invitation.module';

@Module({
  imports: [JwtModule.register({}), InvitationModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenIdsStorage],
})
export class AuthModule {}
