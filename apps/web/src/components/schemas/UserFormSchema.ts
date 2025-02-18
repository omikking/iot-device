import { Application, UserSchema } from '@/app/mock/mock';
import { z } from 'zod';

export type UserFormValues = {
  email?: string;
  technician?: string;
  userPermissions: {
    userId: string;
    role: UserSchema['userPermissions']['role'];
    appAccess: Application[];
  };
};

export const userFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Email must be valid.' })
      .min(2, { message: 'Email must be at least 2 characters.' })
      .max(50, { message: 'Email must be at most 50 characters.' })
      .optional(),
    technician: z.string().optional(),
    userPermissions: z.object({
      userId: z.string().optional(),
      role: z.enum(['User', 'Technician', 'Admin']),
      appAccess: z.array(
        z.enum(['PULL_TEST', 'PULL_TEST_OPERATOR', 'ULTRABOLTS', 'XCYCLOPS']),
      ),
    }),
  })
  .superRefine((data, ctx) => {
    const { role } = data.userPermissions;
    if (role === 'Technician') {
      if (!data.technician) {
        ctx.addIssue({
          path: ['technician'],
          message: 'Choose a technician.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
    if (role === 'User') {
      if (!data.email) {
        ctx.addIssue({
          path: ['email'],
          message: 'Email must be added.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
