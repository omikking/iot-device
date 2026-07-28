import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HydraBoltResolver } from './hydra-bolt.resolver';
import { HydraBoltService } from './hydra-bolt.service';

@Module({
  imports: [PrismaModule],
  providers: [HydraBoltResolver, HydraBoltService],
  exports: [HydraBoltService],
})
export class HydraBoltModule {}
