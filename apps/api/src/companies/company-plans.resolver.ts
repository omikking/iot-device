import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from './interface/company-data';
import { Plan } from './interface/plan-data';

@Resolver('Company')
export class CompanyPlansResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('plans')
  async getPlansOfCompany(@Parent() company: Company): Promise<Plan[]> {
    const plans = await this.prisma.plan.findMany({
      where: {
        companyId: company.id,
      },
    });

    return plans;
  }
}
