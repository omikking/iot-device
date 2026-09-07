import { Module } from '@nestjs/common';
import { HydraBoltsService } from './hydra-bolts.service';
import { HydraBoltsResolver } from './hydra-bolts.resolver';
import { HydraBoltModule } from 'src/hydra-bolt/hydra-bolt.module';
import { OpticboltModule } from 'src/opticbolt/opticbolt.module';

@Module({
  imports: [HydraBoltModule, OpticboltModule],
  providers: [HydraBoltsService, HydraBoltsResolver],
})
export class HydraBoltsModule {}
