import { Type } from 'class-transformer';
import * as GraphQLTypes from '../../graphql-types';
import {
  MinLength,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class FlavorInput {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;
}
export class UpdateCoffeeInput extends GraphQLTypes.UpdateCoffeeInput {
  @IsOptional()
  @MinLength(3)
  @IsString()
  name?: string | null;

  @IsOptional()
  @MinLength(3)
  @IsString()
  brand?: string | null;

  @IsOptional()
  @MinLength(3)
  @ValidateNested({ each: true })
  @Type(() => FlavorInput)
  flavors?: string[] | null;
}
