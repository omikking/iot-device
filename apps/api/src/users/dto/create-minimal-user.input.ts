import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMinimalUserInput {
  @Field()
  email: string;
}
