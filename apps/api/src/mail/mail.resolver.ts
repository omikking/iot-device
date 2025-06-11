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
    await this.mailService.sendWelcomeEmail(input.email, input.username);

    return {
      success: true,
      message: `Test email sent to ${input.email}`,
    };
  }
}
