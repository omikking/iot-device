import { z } from 'zod';

export const technicianFormSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters.' })
    .max(50, { message: 'Full name must be at most 50 characters.' }),
  company: z
    .string()
    .min(3, { message: 'Company must be at least 3 characters.' }),
  email: z
    .string()
    .email({ message: 'Email must be a valid email address.' })
    .min(2, { message: 'Email must be at least 2 characters.' })
    .max(50, { message: 'Email must be at most 50 characters.' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 numbers' }),
  isGlobal: z
    // Felinho: answer in PR comments
    // Is there a reason why we are using a string instead of boolean?
    // I have an issue with default values in forms when im using a string

    // .string({
    //   message: 'Please select the visibility of the technician.',
    // })
    // .transform((val) => val === 'true'),
    .boolean(),
});

// This creates the type from the schema
export type TechnicianFormValues = {
  fullName: string;
  company: string;
  email: string;
  phoneNumber: string;
  isGlobal: boolean;
};

// Or you can infer it directly from the schema:
//export type TechnicianFormValues = z.infer<typeof technicianFormSchema>;
