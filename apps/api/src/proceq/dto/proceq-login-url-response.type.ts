import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ProceqLoginUrlResponse {
  @Field()
  url: string;
}
