import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@gsp/ui';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const CompanyDetailsForm = () => {
  // @TODO fix this later
  const formSchema = z.object({
    companyName: z
      .string()
      .min(10, { message: 'Must be 10 numbers.' })
      .max(10, { message: 'Must be 10 numbers.' }),
    fullContactName: z.string(),
    organisationNumber: z.string(),
    country: z.string(),
    city: z.string(),
    address: z.string(),
  });

  // to validate the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      fullContactName: '',
      organisationNumber: '',
      country: '',
      city: '',
      address: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => console.log(e, 'company added'))}
        className="w-fit flex flex-row flex-wrap gap-6"
      >
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Company name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter company name..."
                    {...field}
                    className="w-[400px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="fullContactName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Full contact name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter full contact name..."
                    {...field}
                    className="w-[400px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="organisationNumber"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Organisation number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter organisation number..."
                    {...field}
                    className="w-[400px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter country..."
                    {...field}
                    className="w-[400px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter city..."
                    {...field}
                    className="w-[400px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address..."
                    {...field}
                    className="w-[400px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};
