import { Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { Role } from '@prisma/client';

export class CreateUserInput extends GraphQLTypes.CreateUserInput {
  @Length(2, 35)
  email: string;

  @Length(8, 35)
  hash: string;

  @Length(2, 35)
  role: Role;

  @Length(2, 35)
  fullname: string;

  @Length(2, 35)
  workPlace: string;

  @Length(2, 35)
  phoneNumber: string;

  globalVisibility: boolean;
}
