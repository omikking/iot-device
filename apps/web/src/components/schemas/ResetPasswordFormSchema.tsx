import { validations } from '@/app/uitexts/validations';
import { z } from 'zod';

export const resetPasswordSendOTP = z.object({
  email: z.string().email({ message: validations.emailInvalid }),
});

export const resetPasswordValidateOTP = z.object({
  email: z.string().email({ message: validations.emailInvalid }),
  code: z
    .string()
    .min(6, { message: validations.invalidOTP })
    .max(6, { message: validations.invalidOTP }),
});

export const resetPasswordResetPassword = z
  .object({
    email: z.string(),
    code: z.string(),
    newPassword: z
      .string()
      .min(8, { message: validations.passwordTooShort })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message: validations.passwordTooWeak,
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: validations.passwordsMismatch,
    path: ['confirmPassword'],
  });

export type ResetPasswordSendOTP = z.infer<typeof resetPasswordSendOTP>;
export type ResetPasswordValidateOTP = z.infer<typeof resetPasswordValidateOTP>;
export type ResetPasswordResetPassword = z.infer<
  typeof resetPasswordResetPassword
>;
