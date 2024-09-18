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
} from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucidePlus } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddSiteModal = () => {
  const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    adress: z
      .string()
      .min(2, { message: 'Adress must be at least 2 characters.' }),
    passCriteria: z
      .string()
      .min(2, { message: 'Pass criteria must be at least 2 characters.' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      adress: '',
    },
  });

  const onSubmit = () => {
    console.log('submit form', form.getValues());
  };

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle>Add Site</ModalTitle>
      </ModalHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => onSubmit())}>
          <div className="flex flex-col px-10 pt-10">
            <div className="flex flex-row justify-between pb-10">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>* Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in name..."
                          {...field}
                          className="w-[390px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="adress"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>* Adress</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in adress..."
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
            <Headline as="h3" color="foreground" variant="smallBold">
              Props.appName Settings
            </Headline>
            <div className="flex flex-row justify-between pt-5">
              <FormField
                control={form.control}
                name="passCriteria"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>* Pass criteria</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in pass criteria..."
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
          </div>
          <ModalFooter className="ui-px-10 ui-py-6">
            <Button type="submit" size="large" variant="primary">
              <LucidePlus />
              Add Site
            </Button>
          </ModalFooter>
        </form>
      </Form>
    </ModalContent>
  );
};
