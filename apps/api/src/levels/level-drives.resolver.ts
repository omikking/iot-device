import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Level } from 'src/sites/interface/levels-data';
import { Drive } from './interface/drive-data';

@Resolver('Level')
export class LevelDrivesResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('drives')
  async getDrivesOfLevel(@Parent() level: Level): Promise<Drive[]> {
    const drives = await this.prisma.drive.findMany({
      where: {
        levelId: level.id,
      },
    });

    return drives;
  }
}
