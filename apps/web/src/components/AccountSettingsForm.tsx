'use client';
import {
  Button,
  ContentHolder,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@gsp/ui';
import {
  UserAccountFormValues,
  accountSettingsFormSchema,
} from './schemas/AccountSettingsFormSchema';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import React from 'react';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@/gql/graphql';
import { LucideCheckCircle } from 'lucide-react';

type AccountSettingsFormProps = {
  user: User;
};

const updateAccountUserMutation = graphql(`
  mutation updateAccountUser($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      email
      fullName
      workPlace
      phoneNumber
      # oldPassword
      # newPassword
      # confirmPassword
    }
  }
`);

export default function AccountSettingsForm({
  user,
}: AccountSettingsFormProps): JSX.Element {
  //Will beu used later, so disabling eslint for now
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, updateAccountUser] = useMutation<UserAccountFormValues>(
    updateAccountUserMutation,
  );

  const settingsForm = useForm<UserAccountFormValues>({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: {
      email: user?.email || 'heyo@sup.com',
      fullName: user?.fullName || 'Jimmy-Cannon Nwadinkpa',
      workPlace: user?.workPlace || 'Edvirt AB',
      phoneNumber: user?.phoneNumber || '+46701234567',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<UserAccountFormValues> = (data) => {
    console.log('Data', data);
  };

  const formValues = settingsForm.getValues();

  const areAllFieldsEmpty =
    !formValues.email &&
    !formValues.fullName &&
    !formValues.workPlace &&
    !formValues.phoneNumber &&
    !formValues.oldPassword &&
    !formValues.newPassword &&
    !formValues.confirmPassword;

  return (
    <Form {...settingsForm}>
      <form onSubmit={settingsForm.handleSubmit(onSubmit)}>
        <div className="w-full mt-4 mb-12 flex flex-col gap-16">
          <ContentHolder variant="general" headlineText="Account settings">
            <FormField
              control={settingsForm.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem className=" ">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your email..."
                        className="min-w-[400px]"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={settingsForm.control}
              name="fullName"
              render={({ field }) => {
                return (
                  <FormItem className=" ">
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name..."
                        className="min-w-[400px]"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={settingsForm.control}
              name="workPlace"
              render={({ field }) => {
                return (
                  <FormItem className=" ">
                    <FormLabel>Workplace</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your workplace..."
                        className="min-w-[400px]"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={settingsForm.control}
              name="phoneNumber"
              render={({ field }) => {
                return (
                  <FormItem className=" ">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your phone number..."
                        className="min-w-[400px]"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </ContentHolder>
          <ContentHolder variant="general" headlineText="Password">
            <FormField
              control={settingsForm.control}
              name="oldPassword"
              render={({ field }) => {
                return (
                  <FormItem className=" ">
                    <FormLabel>Old password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your old password..."
                        type="password"
                        className="min-w-[400px]"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={settingsForm.control}
              name="newPassword"
              render={({ field }) => {
                return (
                  <FormItem className=" ">
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your new password..."
                        type="password"
                        className="min-w-[400px]"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={settingsForm.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem className=" ">
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Confirm your password..."
                        type="password"
                        className="min-w-[400px]"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </ContentHolder>
        </div>
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={areAllFieldsEmpty}
          >
            <LucideCheckCircle />
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
