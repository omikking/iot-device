import * as GraphQLTypes from '../../graphql-types';
import {
  MinLength,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class UpdateCoffeeInput extends GraphQLTypes.UpdateCoffeeInput {
  @IsOptional()
  @MinLength(3)
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(3)
  brand?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  flavors: string[] | null;
}
