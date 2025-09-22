import {
  IsEmail,
  MinLength,
  Matches,
  MaxLength,
  IsString,
} from 'class-validator';
import { errorTexts } from 'src/errorTexts/errorTexts';

export class ConfirmPasswordResetInput {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  token: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @MaxLength(50)
  @MinLength(8, { message: errorTexts.userPasswordTooShort_message })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: errorTexts.userPasswordTooWeak_message,
  })
  newPassword: string;

  @IsString()
  @MaxLength(50)
  @MinLength(8, { message: errorTexts.userPasswordTooShort_message })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: errorTexts.userPasswordTooWeak_message,
  })
  confirmPassword: string;
}
