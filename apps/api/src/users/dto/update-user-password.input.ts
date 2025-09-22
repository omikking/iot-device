import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';
export class UpdatePasswordInput extends GraphQLTypes.UpdatePasswordInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  oldPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @MinLength(8, { message: errorTexts.userPasswordTooShort_message })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: errorTexts.userPasswordTooWeak_message,
  })
  newPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @MinLength(8, { message: errorTexts.userPasswordTooShort_message })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: errorTexts.userPasswordTooWeak_message,
  })
  confirmPassword: string;
}
