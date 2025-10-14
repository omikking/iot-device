import { z } from 'zod';
import { Application, Role } from '@/gql/graphql';
import { validations } from '@/app/uitexts/validations';

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
      .email({ message: validations.emailInvalid })
      .max(50, { message: validations.max50Chars('Email') })
      .optional(),
    technician: z.string().optional(),
    userPermissions: z.array(
      z.object({
        userId: z.string().optional(),
        role: z.enum(
          [Role.CompanyUser, Role.CompanyAdmin, Role.SandvikTechnician],
          { message: validations.roleRequired },
        ),
        appsAccess: z.array(
          z.enum([
            Application.PullTest,
            Application.PullTestTechnician,
            // Application.Banshee,
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
          message: validations.technicianRequired,
          code: z.ZodIssueCode.custom,
        });
      }
    }
    if (role !== Role.SandvikTechnician) {
      if (!data.email) {
        ctx.addIssue({
          path: ['email'],
          message: validations.emailRequired,
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
