'use client';
import React from 'react';
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
  Text,
} from '@gsp/ui';
import { useSession } from 'next-auth/react';
import {
  SetupAccountFormValues,
  SetupAccountFormWithConfirmValues,
  setupAccountFormSchema,
  setupAccountFormWithConfirmSchema,
} from '@/components/schemas/SetupAccountFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideUserRoundCog } from 'lucide-react';

// type SetupAccountFormProps = {
//   userForm: SetupAccountFormReturn<SetupAccountFormValues>
// }

export default function Page(): JSX.Element {
  const { data: session } = useSession();

  // const setupForm = useForm<SetupAccountFormValues>({
  const setupForm = useForm<SetupAccountFormWithConfirmValues>({
    // resolver: zodResolver(setupAccountFormSchema),
    resolver: zodResolver(setupAccountFormWithConfirmSchema),
    defaultValues: {
      fullName: '',
      workPlace: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  // const onSubmit = async (data: SetupAccountFormValues) => {
  const onSubmit = async (data: SetupAccountFormWithConfirmValues) => {
    console.log('Data from setup form: ', data);
    const { confirmPassword, ...submissionData } = data;
    console.log('Data from setup form: ', submissionData);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-10 bg-neutral-1">
      <Headline as="h1" variant="xl" color="foreground">
        Setup Account
      </Headline>
      <div className="flex flex-col gap-1 items-center">
        <Headline as="h4" variant="small" color="foreground">
          You're invited to join Garpenberg AB as an administrator.
        </Headline>

        <Text color={'foreground'} variant={'medium'}>
          Please complete your account setup to get started.
        </Text>
      </div>
      <Form {...setupForm}>
        <form onSubmit={setupForm.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-row flex-wrap justify-between gap-8">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    placeholder="meme@meme.com..."
                    className="w-96"
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={setupForm.control}
                name="fullName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in your full name..."
                          className="w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex flex-row flex-wrap justify-between gap-8">
              <FormField
                control={setupForm.control}
                name="workPlace"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Workplace</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in your workplace..."
                          className="w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={setupForm.control}
                name="phoneNumber"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in your phone number..."
                          className="w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex flex-row flex-wrap justify-between gap-8">
              <FormField
                control={setupForm.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Fill in your password..."
                          className="w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Fill in your password..."
                    className="w-96"
                  />
                </FormControl>
              </FormItem> */}
              <FormField
                control={setupForm.control}
                name="confirmPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Fill in your password..."
                          className="w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <hr className="w-full my-8 mx-auto border-neutral-2" />
            <div className="flex justify-center">
              <Button
                className="min-w-96"
                type="submit"
                variant="primary"
                size="large"
              >
                <LucideUserRoundCog /> Sign up
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
