import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ValidateResetTokenInput {
  @Field()
  token: string;

  @Field()
  email: string;
}
