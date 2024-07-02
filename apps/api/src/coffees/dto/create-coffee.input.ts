import { IsArray, ValidateNested, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import * as GraphQLTypes from '../../graphql-types';

class FlavorInput {
  @IsString()
  @MinLength(3)
  name: string;
}

export class CreateCoffeeInput extends GraphQLTypes.CreateCoffeeInput {
  @MinLength(3)
  name: string;

  @MinLength(3)
  brand: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlavorInput)
  flavors: string[];
}
