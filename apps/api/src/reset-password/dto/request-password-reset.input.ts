import { IsEmail, MaxLength } from 'class-validator';

export class RequestPasswordResetInput {
  @IsEmail()
  @MaxLength(50)
  email: string;
}
