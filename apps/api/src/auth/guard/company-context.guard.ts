import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

// Order: It must be placed in this specific order when combining all three.
// @UseGuards(JwtGuard, CompanyContextGuard, PermissionGuard)

// CompanyContextGuard provides the companyId the user is trying to access, into a context to be used in PermissionGuard etc.
@Injectable()
export class CompanyContextGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  // This logic finds the companyId from the input arguments of the GraphQL resolver.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();
    const info = ctx.getInfo();
    const fieldName = info.fieldName;

    let companyId = null;

    console.log('Resolver name:', info.fieldName); // Keep for logging purposes
    console.log(args);

    // 1 - Check if companyId is provided
    if (
      fieldName === 'company' ||
      fieldName === 'updateCompany' ||
      fieldName === 'removeCompany'
    ) {
      companyId = args.id;
    }

    // 2 - Check if companyId is directly provided in the args
    if (typeof args.companyId === 'string') {
      companyId = args.companyId;
    }

    // 3 - Dynamically check ALL input objects for companyId
    if (!companyId) {
      for (const [, value] of Object.entries(args)) {
        if (
          value &&
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value) &&
          'companyId' in value
        ) {
          companyId = (value as { companyId: string }).companyId;
          break;
        }
      }
    }

    // 4 - Handle resource ID lookups with a more robust approach
    if (!companyId && args.id) {
      const info = ctx.getInfo();
      const fieldName = info.fieldName; // ex: 'updateSite'

      // Extract resource type from handler name
      // findOne, createSite, updateSite -> "Site"
      const resourceMatches = fieldName.match(
        /(?:find|create|update|remove)([A-Z][a-zA-Z0-9]*)$/,
      );

      const resourceType = resourceMatches ? resourceMatches[1] : fieldName;

      if (resourceType) {
        try {
          // Dynamic lookup based on resource type
          // This uses the pattern that your Prisma models follow the same naming as your handlers
          const resourceKey =
            resourceType.charAt(0).toLowerCase() + resourceType.slice(1);

          const resourceModel =
            this.prisma[resourceKey as keyof typeof this.prisma];

          if (
            resourceModel &&
            typeof (resourceModel as any).findFirst === 'function'
          ) {
            const resource = await (resourceModel as any).findFirst({
              where: { id: args.id },
              select: { companyId: true },
            });
            companyId = resource?.companyId;
          }
        } catch (error) {
          console.log(error); // Keep for logging purposes
          throw new ForbiddenException(
            `Access denied: Unable to find companyId for context for ${resourceType}`,
          );
        }
      }
    }

    // Set companyId in context for PermissionGuard to use to know what company the user is accessing
    if (companyId) {
      ctx.getContext().companyId = companyId;
    }

    return true;
  }
}
