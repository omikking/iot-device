import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OpticboltResolver } from './opticbolt.resolver';
import { OpticboltService } from './opticbolt.service';

@Module({
  imports: [PrismaModule],
  providers: [OpticboltResolver, OpticboltService],
  exports: [OpticboltService],
})
export class OpticboltModule {}
