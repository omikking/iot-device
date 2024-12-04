import { Module } from '@nestjs/common';
import { DrivesService } from './drives.service';
import { DrivesResolver } from './drives.resolver';
import { DriveLocationsResolver } from './drive-locations.resolver';
import { DriveBoltResultsResolver } from './drive-boltResults.resolver';

@Module({
  providers: [
    DrivesService,
    DrivesResolver,
    DriveLocationsResolver,
    DriveBoltResultsResolver,
  ],
})
export class DrivesModule {}
