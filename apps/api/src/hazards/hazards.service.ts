import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { hasAppAccessForCompany } from 'src/utils';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { Application } from '@prisma/client';

@Injectable()
export class HazardsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    user: ActiveUserData,
    companyId: string,
    allowedCompanyIds: string[],
    allowedApps: Application[],
  ): Promise<GraphQLTypes.BoltResult[]> {
    if (!allowedCompanyIds.includes(companyId)) {
      throw new ForbiddenException(errorTexts.permissionsDenied);
    }

    const hasAccess = await hasAppAccessForCompany(
      this.prisma,
      user,
      allowedApps,
      companyId,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'User missing access to this application for this company.',
      );
    }

    const hazardBoltResults = this.prisma.boltResult.findMany({
      where: {
        OR: [{ isHazard: true }, { hazardCompletedDate: { isEmpty: false } }],
        site: {
          companyId,
        },
      },
    });

    return hazardBoltResults;
  }
}
