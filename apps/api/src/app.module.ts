import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BoltModule } from './bolt/bolt.module';

@Module({
  imports: [AuthModule, UserModule, BoltModule],
})
export class AppModule {}
