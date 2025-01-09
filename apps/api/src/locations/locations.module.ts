import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import { LocationBoltResultsResolver } from './location-boltResults.resolver';

@Module({
  providers: [LocationsService, LocationsResolver, LocationBoltResultsResolver],
})
export class LocationsModule {}
