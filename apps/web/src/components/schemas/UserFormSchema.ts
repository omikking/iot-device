import { z } from 'zod';

export const userFormSchema = z.object({
  id: z.string(),
  fullName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  email: z
    .string()
    .email({ message: 'Email must be a valid email address.' })
    .min(2, { message: 'Email must be at least 2 characters.' })
    .max(50, { message: 'Email must be at most 50 characters.' }),
  phoneNumber: z.string().optional(),
  workPlace: z.string().optional(),
  globalRole: z.boolean().optional(),
  isGlobalVisibility: z.boolean().optional(),
  userPermissions: z.object({
    id: z.string(),
    role: z.enum(['User', 'Technician', 'Admin']),
    appsAccess: z.array(
      z.enum(['PULL_TEST', 'PULL_TEST_OPERATOR', 'ULTRABOLTS', 'XCYCLOPS']),
    ),
  }),
});

export type UserFormValues = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  workPlace?: string;
  globalRole?: boolean;
  isGlobalVisibility?: boolean;
  userPermissions: {
    id: string;
    role: 'User' | 'Technician' | 'Admin';
    appAccess: (
      | 'PULL_TEST'
      | 'PULL_TEST_OPERATOR'
      | 'ULTRABOLTS'
      | 'XCYCLOPS'
    )[];
  };
};
