import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoltResult } from 'src/sites/interface/boltResult-data';
import { Level } from './interface/level-data';

@Resolver('Level')
export class LevelBoltResultsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('boltResults')
  async getBoltResultsOfLevel(@Parent() level: Level): Promise<BoltResult[]> {
    const boltResults = await this.prisma.boltResult.findMany({
      where: {
        levelId: level.id,
      },
    });

    return boltResults;
  }
}
