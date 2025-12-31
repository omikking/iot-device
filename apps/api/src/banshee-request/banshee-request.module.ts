import { Module } from '@nestjs/common';
import { BansheeRequestsService } from './banshee-request.service';
import { BansheeRequestsResolver } from './banshee-request.resolver';

@Module({
  providers: [BansheeRequestsService, BansheeRequestsResolver],
})
export class BansheeRequestModule {}
