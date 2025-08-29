import { IsEmail, IsNotEmpty } from 'class-validator';

export class ValidateResetTokenInput {
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
