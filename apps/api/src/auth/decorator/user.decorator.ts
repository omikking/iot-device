import { ExecutionContext, createParamDecorator } from '@nestjs/common';

interface User {
  [key: string]: any; // Allow indexing with string, use usermodel?
}

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // We could use switch to RPC, Ws (websocket) as well!
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    if (data) {
      return user[data];
    }
    return user;
  },
);
