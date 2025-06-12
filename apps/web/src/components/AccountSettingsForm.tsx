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
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@/gql/graphql';
import { LucideCheckCircle } from 'lucide-react';

type AccountSettingsFormProps = {
  user: User;
};

const updateAccountUserMutation = graphql(`
  mutation updateAccountUser(
    $id: String!
    $updateUserInput: UpdateUserInput!
    $updatePasswordInput: UpdatePasswordInput
  ) {
    updateUser(
      id: $id
      updateUserInput: $updateUserInput
      updatePasswordInput: $updatePasswordInput
    ) {
      id
      email
      fullName
      workPlace
      phoneNumber
    }
  }
`);

export default function AccountSettingsForm({
  user,
}: AccountSettingsFormProps): JSX.Element {
  const [, updateAccountUser] = useMutation<UserAccountFormValues>(
    updateAccountUserMutation,
  );
  const settingsForm = useForm<UserAccountFormValues>({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: {
      email: user.email || '',
      fullName: user.fullName || '',
      workPlace: user.workPlace || '',
      phoneNumber: user.phoneNumber || '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<UserAccountFormValues> = async (data) => {
    const {
      email,
      fullName,
      workPlace,
      phoneNumber,
      oldPassword,
      newPassword,
      confirmPassword,
    } = data;

    const updateUserInput = {
      email,
      fullName,
      workPlace,
      phoneNumber,
    };

    const updatePasswordInput =
      oldPassword || newPassword || confirmPassword
        ? {
            oldPassword,
            newPassword,
            confirmPassword,
          }
        : undefined;

    const result = await updateAccountUser({
      id: user.id,
      updateUserInput,
      updatePasswordInput,
    });

    if (result.error) {
      console.error('Update failed:', result.error);
      // You can show an error toast here
    } else {
      console.log('User updated:', result.data);
      // You can show a success toast here
    }
  };

  const formValues = settingsForm.getValues();
  const isDirty = settingsForm.formState.isDirty;
  const isAnyFieldEmpty =
    !formValues.email ||
    !formValues.fullName ||
    !formValues.workPlace ||
    !formValues.phoneNumber 
    
  const isSubmitDisabled = isAnyFieldEmpty || !isDirty
  return (
    <Form {...settingsForm}>
      <form onSubmit={settingsForm.handleSubmit(onSubmit)}>
        <div className="w-full mt-4 mb-12 flex flex-col gap-16">
          <ContentHolder variant="general" headlineText="Account settings">
            {/* Email */}
            <FormField
              control={settingsForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email..."
                      className="min-w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={settingsForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your full name..."
                      className="min-w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Workplace */}
            <FormField
              control={settingsForm.control}
              name="workPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workplace</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your workplace..."
                      className="min-w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={settingsForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your phone number..."
                      className="min-w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ContentHolder>

          <ContentHolder variant="general" headlineText="Password">
            {/* Old Password */}
            <FormField
              control={settingsForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your old password..."
                      type="password"
                      className="min-w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={settingsForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your new password..."
                      type="password"
                      className="min-w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={settingsForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Confirm your password..."
                      type="password"
                      className="min-w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ContentHolder>
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={isSubmitDisabled}
          >
            <LucideCheckCircle />
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
