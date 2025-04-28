import { Module } from '@nestjs/common';
import { EnumResolver } from './enum.resolver';

@Module({
  providers: [EnumResolver],
})
export class EnumModule {}
