import {
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gsp/ui';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

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

  const options = [
    {
      id: '1',
      name: 'Elliot Anderson',
    },
    {
      id: '2',
      name: 'Darlene Anderson',
    },
    {
      id: '3',
      name: 'Tyrell Wellick',
    },
    {
      id: '4',
      name: 'Joanna Wellick',
    },
    {
      id: '5',
      name: 'Angela Moss',
    },
    {
      id: '6',
      name: 'Whiterose',
    },
    {
      id: '7',
      name: 'Felix Östergren',
    },
    {
      id: '8',
      name: 'Jimmy Nwadinkpa',
    },
  ];

  const [administrator, setAdministrator] = useState<string | undefined>(
    undefined,
  );

  const onHandleSelectAdministrator = (id: string) => {
    setAdministrator(id);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => console.log(e, 'company added'))}
        className="w-fit flex flex-row flex-wrap gap-6"
      >
        <FormField
          control={form.control}
          name="assignSandvikAdministrator"
          render={() => {
            return (
              <FormItem>
                <FormLabel>Assigned Sandvik administrator</FormLabel>
                <FormControl>
                  <Dropdown
                    id="person"
                    title="Select Sandvik administrator"
                    selectedId={administrator}
                    position="top"
                    options={options}
                    onSelect={onHandleSelectAdministrator}
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
