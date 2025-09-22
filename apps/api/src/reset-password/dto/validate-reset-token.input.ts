import { IsEmail, IsString, MaxLength } from 'class-validator';

export class ValidateResetTokenInput {
  @IsString()
  token: string;

  @IsString()
  @IsEmail()
  @MaxLength(50)
  email: string;
}
