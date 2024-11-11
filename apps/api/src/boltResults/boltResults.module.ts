import { Module } from '@nestjs/common';
import { BoltResultsResolver } from './boltResults.resolver';
import { BoltResultsService } from './boltResults.service';

@Module({
  providers: [BoltResultsResolver, BoltResultsService],
})
export class BoltResultsModule {}
