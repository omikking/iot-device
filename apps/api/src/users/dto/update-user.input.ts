import { IsOptional, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { Role } from '@prisma/client';

export class UpdateUserInput extends GraphQLTypes.UpdateUserInput {
  @IsOptional()
  @Length(2, 35)
  email: string;

  @IsOptional()
  @Length(8, 35)
  hash: string;

  @IsOptional()
  @Length(2, 35)
  role: Role;

  @IsOptional()
  @Length(2, 35)
  fullname: string;

  @IsOptional()
  @Length(2, 35)
  workPlace: string;

  @IsOptional()
  @Length(2, 35)
  phoneNumber: string;

  @IsOptional()
  globalVisibility: boolean;
}
