import { IsEmail, IsString } from 'class-validator';

export class RequestPasswordResetInput {
  @IsString()
  @IsEmail()
  email: string;
}
