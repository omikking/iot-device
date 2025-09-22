import { IsEmail } from 'class-validator';

export class RequestPasswordResetInput {
  @IsEmail()
  email: string;
}
