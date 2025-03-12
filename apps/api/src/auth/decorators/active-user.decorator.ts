import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { ActiveUserData } from '../interfaces/active-user-data';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    let user: ActiveUserData | undefined;

    if (ctx.getType() === 'http') {
      // Extract user from HTTP request (for REST APIs)
      const request = ctx.switchToHttp().getRequest();
      user = request.user as ActiveUserData;
    } else {
      // Extract user from GraphQL request
      const gqlContext = GqlExecutionContext.create(ctx);
      user = gqlContext.getContext().req.user as ActiveUserData;
    }

    return field ? user?.[field] : user;
  },
);
