import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { ActiveUserData } from '../interfaces/active-user-data';
import { errorTexts } from 'src/errorTexts/errorTexts';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(8, { message: errorTexts.userPasswordTooShort_message })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: errorTexts.userPasswordTooWeak_message,
  })
  password: string;

  @IsString()
  @MaxLength(50)
  fullName: string;

  @IsString()
  @MaxLength(50)
  workPlace: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phoneNumber?: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(8, { message: errorTexts.userPasswordTooShort_message })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: errorTexts.userPasswordTooWeak_message,
  })
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class TokensDto {
  accessToken: string;
}

export class SignInResponseDto {
  tokens: TokensDto;
  userData: ActiveUserData;
}
