import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import { LocationPositionsInRingResolver } from './location-positionsInRing.resolver';
import { LocationBoltResultsResolver } from './location-boltResults.resolver';

@Module({
  providers: [
    LocationsService,
    LocationsResolver,
    LocationPositionsInRingResolver,
    LocationBoltResultsResolver,
  ],
})
export class LocationsModule {}
