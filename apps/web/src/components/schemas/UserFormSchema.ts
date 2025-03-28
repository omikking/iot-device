import { z } from 'zod';
// import { UserPermission } from '@/gql/graphql';

export type UserFormValues = {
  email?: string;
  technician?: string;
  userPermissions: [
    {
      userId: string;
      role: string;
      // appsAccess: [
      //   'PULL_TEST' | 'PULL_TEST_OPERATOR' | 'ULTRABOLTS' | 'XCYCLOPS',
      // ];
      appsAccess: Array<
        'PULL_TEST' | 'PULL_TEST_OPERATOR' | 'ULTRABOLTS' | 'XCYCLOPS'
      >;
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
    technician: z.string().optional(),
    userPermissions: z.array(
      z.object({
        userId: z.string().optional(),
        role: z.enum([
          'COMPANY_USER',
          'SANDVIK_TECHINICIAN',
          'SANDVIK_ADMIN',
          'COMPANY_ADMIN',
        ]),
        appsAccess: z.array(
          z.enum(['PULL_TEST', 'PULL_TEST_OPERATOR', 'ULTRABOLTS', 'XCYCLOPS']),
        ),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    // const { role } = data.userPermissions;
    const { role } = data.userPermissions[0];
    if (role === 'SANDVIK_TECHINICIAN') {
      if (!data.technician) {
        ctx.addIssue({
          path: ['technician'],
          message: 'Choose a technician.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
    if (role === 'COMPANY_USER') {
      if (!data.email) {
        ctx.addIssue({
          path: ['email'],
          message: 'Email must be added.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
