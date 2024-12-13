import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Drive } from './interface/drive-data';
import { BoltResult } from './interface/boltResult-data';

@Resolver('Drive')
export class DriveBoltResultsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('boltResults')
  async getBoltResultsOfDrive(@Parent() drive: Drive): Promise<BoltResult[]> {
    const boltResults = await this.prisma.boltResult.findMany({
      where: {
        driveId: drive.id,
      },
    });

    return boltResults;
  }
}
