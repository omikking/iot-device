import { Module } from '@nestjs/common';
import { HazardsService } from './hazards.service';
import { HazardsResolver } from './hazards.resolver';

@Module({
  providers: [HazardsService, HazardsResolver],
})
export class HazardsModule {}
