import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Site } from './interface/site-data';
import { Level } from './interface/level-data';

@Resolver('Site')
export class SiteLevelsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('levels')
  async getLevelsOfSite(@Parent() site: Site): Promise<Level[]> {
    const levels = await this.prisma.level.findMany({
      where: {
        siteId: site.id,
      },
    });

    return levels;
  }
}
