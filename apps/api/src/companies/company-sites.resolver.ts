import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from './interface/company-data';
import { Site } from './interface/site-data';

@Resolver('Company')
export class CompanySitesResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('sites')
  async getSitesOfCompany(@Parent() company: Company): Promise<Site[]> {
    const sites = await this.prisma.site.findMany({
      where: {
        companyId: company.id,
      },
    });

    return sites;
  }
}
