import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { errorTexts } from 'src/errorTexts/errorTexts';

export class JwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req; // Extract request from GraphQL context
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Authenticate first: this is what populates `req.user` via JwtStrategy.
    const authenticated = (await super.canActivate(context)) as boolean;
    if (!authenticated) return false;

    const user = this.getRequest(context)?.user;

    if (user?.isDeleted === true) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_ACCOUNT_DEACTIVATED',
          title: errorTexts.userAccountDeactivatedTitle,
          message: errorTexts.userAccountDeactivatedMessage,
        },
      });
    }

    return true;
  }
}
