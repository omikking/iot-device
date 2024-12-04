import { Module } from '@nestjs/common';
import { DrivesService } from './drives.service';
import { DrivesResolver } from './drives.resolver';

@Module({
  providers: [DrivesService, DrivesResolver]
})
export class DrivesModule {}
