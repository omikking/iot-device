import { Module } from '@nestjs/common';
import { PositionInRingBoltResultsResolver } from './positionInRing-boltResults.resolver';
import { PositionsInRingService } from './positionsInRing.service';
import { PositionsInRingResolver } from './positionsInRing.resolver';

@Module({
  providers: [
    PositionsInRingService,
    PositionsInRingResolver,
    PositionInRingBoltResultsResolver,
  ],
})
export class PositionsInRingModule {}
