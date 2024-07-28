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

export const AdminForm = () => {
  // @TODO fix this later
  const formSchema = z.object({
    assignSandvikAdministrator: z.string(),
  });

  // to validate the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignSandvikAdministrator: '',
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
          name="assignSandvikAdministrator"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Assign Sandvik administrator</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Select administrator"
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
