import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MailService } from './mail.service';

@Resolver()
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation('sendTestEmail') // match the name in schema
  async sendTestEmail(
    @Args('input') input: { email: string; username: string },
  ): Promise<{ success: boolean; message: string }> {
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
