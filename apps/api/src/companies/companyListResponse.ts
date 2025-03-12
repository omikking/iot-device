import { ObjectType, Field, Int } from '@nestjs/graphql';
import * as GraphQLTypes from '../graphql-types';

@ObjectType()
export class CompanyListResponse {
  @Field(() => Int)
  totalRecords: number;

  @Field(() => [GraphQLTypes.Company])
  results: GraphQLTypes.Company[];
}
