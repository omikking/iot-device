import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ValidateResetTokenInput {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  token: string;

  @IsEmail()
  @MaxLength(50)
  email: string;
}
