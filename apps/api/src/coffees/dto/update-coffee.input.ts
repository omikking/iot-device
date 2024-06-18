import * as GraphQLTypes from '../../graphql-types';
import { MinLength, IsOptional } from 'class-validator';

export class UpdateCoffeeInput extends GraphQLTypes.UpdateCoffeeInput {
  @IsOptional()
  @MinLength(3)
  name: string;

  @IsOptional()
  @MinLength(3)
  brand: string;

  @IsOptional()
  @MinLength(3)
  flavors: string[];
}
