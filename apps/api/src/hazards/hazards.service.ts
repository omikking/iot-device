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

  //   async updateCompleteHazard(
  //     id: string,
  //     hazardCompletedDate: Date,
  //   ): Promise<GraphQLTypes.BoltResult> {
  //     const updatedBoltResult = await this.prisma.boltResult.update({
  //       where: { id },
  //       data: {
  //         isHazard: false,
  //         hazardCompletedDate: hazardCompletedDate,
  //       }
  //     })
  //   }
}
