import { z } from 'zod';

export const submitOrderFormSchema = z.object({
  orderComments: z
    .string()
    .max(100, 'Order comments must be less than 100 characters')
    .optional(),
});

export type SubmitOrderFormValues = z.infer<typeof submitOrderFormSchema>;
