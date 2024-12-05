import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { PositionInRing } from './interface/positionInRing-data';
import { BoltResult } from './interface/boltResult-data';

@Resolver('PositionInRing')
export class PositionInRingBoltResultsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('boltResults')
  async getBoltResultsOfPositionInRing(
    @Parent() positionInRing: PositionInRing,
  ): Promise<BoltResult[]> {
    const boltResults = await this.prisma.boltResult.findMany({
      where: {
        positionInRingId: positionInRing.id,
      },
    });

    return boltResults;
  }
}
