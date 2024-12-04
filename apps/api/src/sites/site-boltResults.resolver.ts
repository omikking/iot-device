import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Site } from './interface/site-data';
import { BoltResult } from './interface/boltResult-data';

@Resolver('Site')
export class SiteBoltResultsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('boltResults')
  async getBoltResultsOfSite(@Parent() site: Site): Promise<BoltResult[]> {
    const boltResults = await this.prisma.boltResult.findMany({
      where: {
        siteId: site.id,
      },
    });

    return boltResults;
  }
}
