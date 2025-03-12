import { ObjectType, Field, Int } from '@nestjs/graphql';
import * as GraphQLTypes from '../graphql-types'; // Use namespace import

@ObjectType()
export class BoltResultsResponse {
  @Field(() => [GraphQLTypes.BoltResult]) // Use the namespace import
  results: GraphQLTypes.BoltResult[];

  @Field(() => Int)
  totalCount: number;
}
