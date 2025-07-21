import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

// Order: It must be placed in this specific order, so JwtGuard gets the user session data,
// CompanyContextGuard gets the companyId & adds into the context, and last it's used in PermissionGuard.
// @UseGuards(JwtGuard, CompanyContextGuard, PermissionGuard)

// CompanyContextGuard provides the companyId the user is trying to access, into a context to be used in PermissionGuard etc.
@Injectable()
export class CompanyContextGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  // This logic finds the companyId from the input arguments of the GraphQL resolver.
  // It checks all input objects for a companyId field, and if not found, it tries to look up the companyId based on the resource ID.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();
    let companyId = null;

    // 1 - Dynamically check ALL input objects for companyId
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

    // 2 - Handle resource ID lookups with a more robust approach
    if (!companyId && args.id) {
      const info = ctx.getInfo();
      const fieldName = info.fieldName; // ex: 'updateSite'

      // Extract resource type from handler name
      // findOne, createSite, updateSite -> "Site"
      const resourceMatches = fieldName.match(
        /(?:find|create|update|remove)([A-Z][a-z]+)/,
      );

      const resourceType = resourceMatches ? resourceMatches[1] : null;

      if (resourceType) {
        try {
          // Dynamic lookup based on resource type
          // This uses the pattern that your Prisma models follow the same naming as your handlers
          const resourceKey = resourceType.toLowerCase();

          const resourceModel =
            this.prisma[resourceKey as keyof typeof this.prisma];

          if (
            resourceModel &&
            typeof (resourceModel as any).findUnique === 'function'
          ) {
            const resource = await (resourceModel as any).findUnique({
              where: { id: args.id },
              select: { companyId: true },
            });
            companyId = resource?.companyId;
          }
        } catch (error) {
          throw new ForbiddenException(
            `Access denied: Unable to find companyId for context for ${resourceType}`,
          );
        }
      }
    }

    // 3 - Set companyId in context for PermissionGuard to use to know what company the user is accessing
    if (companyId) {
      ctx.getContext().companyId = companyId;
    }

    return true;
  }
}
