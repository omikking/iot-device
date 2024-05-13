import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
export class TokensDto {
  accessToken: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export class SignInResponseDto {
  tokens: TokensDto;
  userData: UserResponseDto;
}
