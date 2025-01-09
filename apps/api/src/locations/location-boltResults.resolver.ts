import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Location } from './interface/location-data';
import { BoltResult } from './interface/boltResult-data';

@Resolver('Location')
export class LocationBoltResultsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('boltResults')
  async getBoltResultsOfLocation(
    @Parent() location: Location,
  ): Promise<BoltResult[]> {
    const boltResults = await this.prisma.boltResult.findMany({
      where: {
        locationId: location.id,
      },
    });

    return boltResults;
  }
}
