import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Headline,
  Input,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Switch,
  Text,
} from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideLayoutGrid, LucidePlus } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddUserModal = () => {
  const formSchema = z.object({
    role: z.enum(['admin', 'techinician', 'user']),
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    pullTestApp: z.boolean(),
    xCyclops: z.boolean(),
    ultrabots: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'user',
      pullTestApp: false,
      xCyclops: false,
      ultrabots: false,
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submit form', form.getValues());
  };

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle className="mb-10">Add user</ModalTitle>
      </ModalHeader>
      <Form {...form}>
        <div className="px-10 flex  gap-10">
          <div className="flex flex-row flex-wrap justify-between gap-10">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>* Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select role"
                        {...field}
                        className="w-[390px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          {/* RIGHT */}
          <div className="flex flex-col flex-grow">
            <div className="flex items-center p-4 border bg-main-white border-neutral-3">
              <div className="flex flex-grow items-center gap-2">
                <LucideLayoutGrid size={20} />
                <Headline color={'foreground'} as="h3" variant={'smallBold'}>
                  All apps
                </Headline>
              </div>
              <Switch checked />
            </div>
            <div className="flex items-center px-4 py-4 border-x border-b border-neutral-3">
              <Text
                variant="medium"
                color="foreground"
                className="flex flex-grow"
              >
                Pull Test
              </Text>
              <Switch checked />
            </div>
            <div className="flex items-center px-4 py-2 border-x border-b border-neutral-3">
              <Text
                variant="medium"
                color="foreground"
                className="flex flex-grow"
              >
                xCyclops
              </Text>
              <Switch checked />
            </div>
            <div className="flex items-center px-4 py-2 border-x border-b border-neutral-3">
              <Text
                variant="medium"
                color="foreground"
                className="flex flex-grow"
              >
                Ultrabots
              </Text>
              <Switch checked />
            </div>
          </div>
        </div>

        <form onSubmit={(e) => onSubmit(e)}>
          <ModalFooter className="px-10 pt-8 pb-6">
            <Button type="submit" size="large" variant="primary">
              <LucidePlus />
              Add user
            </Button>
          </ModalFooter>
        </form>
      </Form>
    </ModalContent>
  );
};
