import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class HazardsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<GraphQLTypes.BoltResult[]> {
    const boltResults = this.prisma.boltResult.findMany({
      where: {
        OR: [{ isHazard: true }, { hazardCompletedDate: { isEmpty: false } }],
        site: {
          companyId,
        },
      },
    });

    return boltResults;
  }
}
