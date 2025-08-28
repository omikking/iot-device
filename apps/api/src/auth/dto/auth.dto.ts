import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import type { ActiveUserData } from '../interfaces/active-user-data';
export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
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
