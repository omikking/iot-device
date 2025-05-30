import { z } from 'zod';

export type UserAccountFormValues = {
  email?: string;
  fullName?: string;
  workPlace?: string;
  phoneNumber?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export const accountSettingsFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Email must be valid.' })
      .min(2, { message: 'Email must be at least 2 characters.' })
      .max(50, { message: 'Email must be at most 50 characters.' })
      .optional(),
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters.' })
      .max(50, { message: 'Full name must be at most 50 characters.' })
      .optional(),
    workPlace: z.string().optional(),
    phoneNumber: z.string().optional(),
    oldPassword: z.string().optional(),
    //@TODO regex expreation for password?
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.newPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  );
