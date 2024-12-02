import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { SitesResolver } from './sites.resolver';

@Module({
  providers: [SitesService, SitesResolver],
  controllers: [SitesController]
})
export class SitesModule {}
