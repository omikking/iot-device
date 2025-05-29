import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConfirmPasswordResetInput {
  @Field()
  token: string;

  @Field()
  email: string;

  @Field()
  newPassword: string;

  @Field()
  confirmPassword: string;
}
