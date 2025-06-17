// mail-response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MailResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
