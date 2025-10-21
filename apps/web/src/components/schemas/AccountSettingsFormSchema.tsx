import { validations } from '@/app/uitexts/validations';
import { z } from 'zod';

export const updateAccountSettingsFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: validations.emailInvalid })
      .max(50, { message: validations.max50Chars('Email') })
      .optional(),
    fullName: z
      .string()
      .max(50, { message: validations.max50Chars('Full name') })
      .optional(),
    workPlace: z
      .string()
      .max(50, { message: validations.max50Chars('Work place') })
      .optional(),
    phoneNumber: z
      .string()
      .max(50, { message: validations.max50Chars('Phone number') })
      .optional(),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, { message: validations.passwordTooShort })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message: validations.passwordTooWeak,
        },
      )
      .optional()
      .or(z.literal('')),
    confirmPassword: z
      .string()
      .min(8, { message: validations.passwordTooShort })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message: validations.passwordTooWeak,
        },
      )
      .optional()
      .or(z.literal('')),
    originalEmail: z.string().optional(), // Track original email to detect changes
  })
  .refine(
    (data) => {
      if (!data.newPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    {
      message: validations.passwordsMismatch,
      path: ['confirmPassword'],
    },
  )
  .refine(
    (data) => {
      // If email is being changed, require oldPassword
      if (
        data.originalEmail &&
        data.email &&
        data.email !== data.originalEmail
      ) {
        return !!data.oldPassword && data.oldPassword.length > 0;
      }
      return true;
    },
    {
      message: 'Current password is required to change your email address',
      path: ['oldPassword'],
    },
  );

export type UpdateAccountSettingsFormSchemaValues = z.infer<
  typeof updateAccountSettingsFormSchema
>;
