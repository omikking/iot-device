import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { ActiveUserData } from '../interfaces/active-user-data';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    // We could use switch to RPC, Ws (websocket) as well!
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user as ActiveUserData | undefined;

    return field ? user?.[field] : user;
  },
);
