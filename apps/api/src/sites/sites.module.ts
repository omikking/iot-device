import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesResolver } from './sites.resolver';

@Module({
  providers: [SitesService, SitesResolver],
})
export class SitesModule {}
