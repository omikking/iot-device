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
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
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
  );

export type UpdateAccountSettingsFormSchemaValues = z.infer<
  typeof updateAccountSettingsFormSchema
>;
