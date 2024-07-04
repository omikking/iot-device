import { ArrayNotEmpty, IsArray, IsString, MinLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateCoffeeInput extends GraphQLTypes.CreateCoffeeInput {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  brand: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  flavors: string[];
}
