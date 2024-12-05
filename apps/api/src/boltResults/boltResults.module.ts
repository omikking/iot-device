import { Module } from '@nestjs/common';
import { BoltResultsService } from './boltResults.service';
import { BoltResultsResolver } from './boltResults.resolver';

@Module({
  providers: [BoltResultsService, BoltResultsResolver],
})
export class BoltResultsModule {}
