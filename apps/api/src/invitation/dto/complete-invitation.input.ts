import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';

export class CompleteInvitationInput
  extends GraphQLTypes.CompleteInvitationInput
{
  @IsString()
  id: string;

  @IsString()
  token: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsString()
  @MinLength(8, { message: errorTexts.userPasswordTooShort_message })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: errorTexts.userPasswordTooWeak_message,
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  workPlace: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
