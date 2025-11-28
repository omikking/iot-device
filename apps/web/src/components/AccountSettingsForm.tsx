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
  showAlertToast,
} from '@gsp/ui';
import {
  UpdateAccountSettingsFormSchemaValues,
  updateAccountSettingsFormSchema,
} from './schemas/AccountSettingsFormSchema';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import React, { useState, type JSX } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@/gql/graphql';
import { LucideCheckCircle } from 'lucide-react';
import { handleGraphQLErrors } from '@/libs/utils';
import { responses } from '@/app/uitexts/responses';
import { placeholder } from '@/app/uitexts/placeholder';

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
  const [isLoading, setIsLoading] = useState(false);

  const [, updateAccountUser] =
    useMutation<UpdateAccountSettingsFormSchemaValues>(
      updateAccountUserMutation,
    );
  const settingsForm = useForm<UpdateAccountSettingsFormSchemaValues>({
    resolver: zodResolver(updateAccountSettingsFormSchema),
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

  const onSubmit: SubmitHandler<UpdateAccountSettingsFormSchemaValues> = async (
    data,
  ) => {
    setIsLoading(true);

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

    updateAccountUser({
      id: user.id,
      updateUserInput,
      updatePasswordInput,
    })
      .then((result) => {
        // Backend errors
        handleGraphQLErrors(result.error);

        // Success
        if (result.data) {
          showAlertToast({
            title: responses.settingsUpdateSuccess,
            variant: 'success',
          });
        }
      })
      // Fallback error
      .catch(() => {
        showAlertToast({
          title: responses.settingsUpdateFailed,
          description: responses.contactSupportError,
          variant: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formValues = settingsForm.getValues();
  const isDirty = settingsForm.formState.isDirty;
  const isAnyFieldEmpty =
    !formValues.email ||
    !formValues.fullName ||
    !formValues.workPlace ||
    !formValues.phoneNumber;

  const isSubmitDisabled = isAnyFieldEmpty || !isDirty;
  return (
    <Form {...settingsForm}>
      <form onSubmit={settingsForm.handleSubmit(onSubmit)} className="w-full">
        <div className="w-full mt-4 flex flex-col gap-20">
          <ContentHolder variant="general" headlineText="Account settings">
            {/* Email */}
            <FormField
              control={settingsForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="min-w-[31%]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder.emailPlaceholder}
                      autoComplete="email"
                      className="w-full"
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
                <FormItem className="min-w-[31%]">
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder.fullNamePlaceholder}
                      className="w-full"
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
                <FormItem className="min-w-[31%]">
                  <FormLabel>Work place</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder.workplacePlaceholder}
                      className="w-full"
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
                <FormItem className="min-w-[31%]">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder.phoneNumberPlaceholder}
                      className="w-full"
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
                <FormItem className="min-w-[31%]">
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder.currentPasswordPlaceholder}
                      type="password"
                      autoComplete="current-password"
                      className="w-full"
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
                <FormItem className="min-w-[31%]">
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder.newPasswordPlaceholder}
                      type="password"
                      autoComplete="new-password"
                      className="w-full"
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
                <FormItem className="min-w-[31%]">
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder.confirmPasswordPlaceholder}
                      type="password"
                      autoComplete="new-password"
                      className="w-full"
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
            isLoading={isLoading}
          >
            {!isLoading && <LucideCheckCircle />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
