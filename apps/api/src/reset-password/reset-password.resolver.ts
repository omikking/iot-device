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
    @Args('requestPasswordResetInput')
    requestPasswordResetInput: RequestPasswordResetInput,
  ): Promise<boolean> {
    return this.resetPasswordService.requestPasswordReset(
      requestPasswordResetInput,
    );
  }

  @Mutation(() => Boolean)
  async validateResetToken(
    @Args('validateResetTokenInput')
    validateResetTokenInput: ValidateResetTokenInput,
  ): Promise<boolean> {
    return this.resetPasswordService.validateResetToken(
      validateResetTokenInput,
    );
  }

  @Mutation(() => Boolean)
  async confirmPasswordReset(
    @Args('confirmPasswordResetInput')
    confirmPasswordResetInput: ConfirmPasswordResetInput,
  ): Promise<boolean> {
    return this.resetPasswordService.confirmPasswordReset(
      confirmPasswordResetInput,
    );
  }
}
