import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';

@Injectable()
export class HazardsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    allowedCompanyIds: string[] | null,
    isSandvikAdmin: boolean,
    companyId: string,
  ): Promise<GraphQLTypes.BoltResult[]> {
    if (!isSandvikAdmin) {
      if (!allowedCompanyIds || !allowedCompanyIds.includes(companyId)) {
        throw new ForbiddenException(errorTexts.permissionsDenied);
      }
    }

    return this.prisma.boltResult.findMany({
      where: {
        OR: [{ isHazard: true }, { hazardCompletedDate: { isEmpty: false } }],
        site: {
          companyId,
        },
      },
    });
  }
}
