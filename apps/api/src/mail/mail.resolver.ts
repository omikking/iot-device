import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MailService } from './mail.service';
import { MailResponse } from './mail-response.dto';

@Resolver()
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(() => MailResponse)
  async sendTestEmail(
    @Args('input') input: { email: string; username: string },
  ): Promise<MailResponse> {
    try {
      return await this.mailService.sendWelcomeEmail(
        input.email,
        input.username,
      );
    } catch (error) {
      return {
        success: false,
        message: `An unexpected error occurred while sending the email to ${input.email}.`,
      };
    }
  }
}
