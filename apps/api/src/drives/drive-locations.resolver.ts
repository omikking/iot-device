import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Drive } from './interface/drive-data';
import { Location } from './interface/location-data';

@Resolver('Drive')
export class DriveLocationsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('locations')
  async getLocationsOfDrive(@Parent() drive: Drive): Promise<Location[]> {
    const locations = await this.prisma.location.findMany({
      where: {
        driveId: drive.id,
      },
    });

    return locations;
  }
}
