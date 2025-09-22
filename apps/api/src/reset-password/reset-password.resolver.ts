import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ResetPasswordService } from './reset-password.service';
import { RequestPasswordResetInput } from './dto/request-password-reset.input';
import { ConfirmPasswordResetInput } from './dto/confirm-password-reset.input';
import { ValidateResetTokenInput } from './dto/validate-reset-token.input';

@Resolver('ResetPassword')
export class ResetPasswordResolver {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Mutation(() => Boolean)
  async requestPasswordReset(
    @Args('input')
    input: RequestPasswordResetInput,
  ): Promise<boolean> {
    return this.resetPasswordService.requestPasswordReset(input);
  }

  @Mutation(() => Boolean)
  async validateResetToken(
    @Args('input')
    input: ValidateResetTokenInput,
  ): Promise<boolean> {
    return this.resetPasswordService.validateResetToken(input);
  }

  @Mutation(() => Boolean)
  async confirmPasswordReset(
    @Args('input')
    input: ConfirmPasswordResetInput,
  ): Promise<boolean> {
    return this.resetPasswordService.confirmPasswordReset(input);
  }
}
