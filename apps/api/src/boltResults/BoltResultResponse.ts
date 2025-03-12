import { ObjectType, Field, Int } from '@nestjs/graphql';
import * as GraphQLTypes from '../graphql-types';

@ObjectType()
export class BoltResultResponse {
  @Field(() => Int)
  totalRecords: number;

  @Field(() => [GraphQLTypes.BoltResult])
  results: GraphQLTypes.BoltResult[];
}
