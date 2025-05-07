import { z } from 'zod';
import { Application, Role } from '@/gql/graphql';

// TODO we should not use this?
export type UserFormValues = {
  email?: string;
  technician?: string;
  userPermissions: [
    {
      userId?: string;
      role: string;
      appsAccess: Application[];
    },
  ];
};

export const userFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Email must be valid.' })
      .min(2, { message: 'Email must be at least 2 characters.' })
      .max(50, { message: 'Email must be at most 50 characters.' })
      .optional(),
    technician: z.string({ message: 'dawawdaw' }).optional(),
    userPermissions: z.array(
      z.object({
        userId: z.string().optional(),
        role: z.enum(
          [Role.CompanyUser, Role.CompanyAdmin, Role.SandvikTechnician],
          { message: 'Role must be selected.' },
        ),
        appsAccess: z.array(
          z.enum([
            Application.PullTest,
            Application.PullTestOperator,
            Application.Ultrabolts,
            Application.Xcyclops,
          ]),
        ),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const { role } = data.userPermissions[0];
    if (role === Role.SandvikTechnician) {
      if (!data.technician) {
        ctx.addIssue({
          path: ['technician'],
          message: 'Choose a technician.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
    if (role !== Role.SandvikTechnician) {
      if (!data.email) {
        ctx.addIssue({
          path: ['email'],
          message: 'Email must be added.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
