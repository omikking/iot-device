import { ObjectType, Field, Int } from '@nestjs/graphql';
import * as GraphQLTypes from '../graphql-types'; // Use wildcard import

@ObjectType()
export class BoltResultResponse {
  @Field(() => Int)
  totalRecords: number;

  @Field(() => [GraphQLTypes.BoltResult]) // Ensure BoltResult is correctly referenced
  results: GraphQLTypes.BoltResult[];
}
