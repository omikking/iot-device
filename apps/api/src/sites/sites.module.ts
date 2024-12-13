import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesResolver } from './sites.resolver';
import { SiteLevelsResolver } from './site-levels.resolver';
import { SiteBoltResultsResolver } from './site-boltResults.resolver';

@Module({
  providers: [
    SitesService,
    SitesResolver,
    SiteLevelsResolver,
    SiteBoltResultsResolver,
  ],
})
export class SitesModule {}
