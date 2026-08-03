import { Module } from '@nestjs/common';
import { HydraBoltsService } from './hydra-bolts.service';
import { HydraBoltsResolver } from './hydra-bolts.resolver';

@Module({
  providers: [HydraBoltsService, HydraBoltsResolver],
})
export class HydraBoltsModule {}
