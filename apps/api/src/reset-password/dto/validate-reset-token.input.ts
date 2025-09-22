import { IsEmail, IsString, MaxLength } from 'class-validator';

export class ValidateResetTokenInput {
  @IsString()
  token: string;

  @IsEmail()
  @MaxLength(50)
  email: string;
}
