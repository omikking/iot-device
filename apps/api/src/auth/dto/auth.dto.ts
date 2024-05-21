import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import type { ActiveUserData } from '../interfaces/active-user-data';
export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
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
