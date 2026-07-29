import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class ContactUsInput extends GraphQLTypes.BansheeContactUsInput {
  @IsUUID()
  companyId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  message!: string;
}
