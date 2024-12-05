import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { PositionInRing } from './interface/positionInRing-data';
import { Location } from './interface/location-data';

@Resolver('Location')
export class LocationPositionsInRingResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('positionsInRing')
  async getPositionsInRingOfLocation(
    @Parent() location: Location,
  ): Promise<PositionInRing[]> {
    const positionsInRing = await this.prisma.positionInRing.findMany({
      where: {
        locationId: location.id,
      },
    });

    return positionsInRing;
  }
}
