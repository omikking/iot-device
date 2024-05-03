import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // We could use switch to RPC, Ws (websocket) as well!a
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
