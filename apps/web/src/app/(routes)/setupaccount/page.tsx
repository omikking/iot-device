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
import {
  SetupAccountFormWithConfirmValues,
  setupAccountFormWithConfirmSchema,
} from '@/components/schemas/SetupAccountFormSchema';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { useForm } from 'react-hook-form';
import { LucideUserRoundCog } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

const getUserWithPermissionsQuery = graphql(`
  query getUserWithPermissions($id: String!) {
    user(id: $id) {
      id
      email
      fullName
      workPlace
      phoneNumber
      userPermissions {
        id
        role
        companyId
      }
    }
  }
`);

export default function Page(): JSX.Element {
  //Values that will be passed somehow, hardcoded for now
  const tempTestId = '87506bef-5283-44d8-ab42-a668ea616975';
  const companyId = '316a80e7-a02d-4098-bd65-fb770aad2a4f';

  const [{ data: userData }] = useQuery({
    query: getUserWithPermissionsQuery,
    variables: { id: tempTestId },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const companyPermission = userData?.user?.userPermissions?.find(
    (permission) => permission.companyId === companyId,
  );

  const userRole = companyPermission?.role;

  const invitationRoleTitle = () => {
    switch (userRole) {
      case 'SANDVIK_ADMIN':
        return (
          <Headline as="h4" variant="small" color="foreground">
            You're invited to join
            <Headline variant="medium" color={'foreground'} as="span" isBold>
              {` Ground Support Platform `}
            </Headline>
            as an administrator.
          </Headline>
        );
      case 'SANDVIK_TECHNICIAN':
        return (
          <Headline as="h4" variant="small" color="foreground">
            You're invited to join
            <Headline variant="medium" color={'foreground'} as="span" isBold>
              {` Ground Support Platform `}
            </Headline>
            as a technician.
          </Headline>
        );
      case 'COMPANY_ADMIN':
        return (
          <Headline as="h4" variant="small" color="foreground">
            You're invited to join
            <Headline variant="medium" color={'foreground'} as="span" isBold>
              {` ${userData?.user?.workPlace} `}
            </Headline>
            as an administrator.
          </Headline>
        );
      case 'COMPANY_USER':
        return (
          <Headline as="h4" variant="small" color="foreground">
            You're invited to join
            <Headline variant="medium" color={'foreground'} as="span" isBold>
              {` ${userData?.user?.workPlace}. `}
            </Headline>
          </Headline>
        );
      default:
        return '';
    }
  };

  const setupForm = useForm<SetupAccountFormWithConfirmValues>({
    resolver: zodResolver(setupAccountFormWithConfirmSchema),
    defaultValues: {
      fullName: '',
      workPlace: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SetupAccountFormWithConfirmValues) => {
    console.log('Data from setup form: ', data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...submissionData } = data;
    console.log('Data from setup form: ', submissionData);
  };

  const formValues = setupForm.watch();

  const isAnyFieldEmty =
    !formValues.fullName ||
    !formValues.workPlace ||
    !formValues.phoneNumber ||
    !formValues.password ||
    !formValues.confirmPassword;

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1">
      <Headline as="h1" variant="xl" color="foreground">
        Setup Account
      </Headline>
      <div className="flex flex-col gap-3 items-center">
        {invitationRoleTitle()}

        <Text color={'foreground'} variant={'medium'}>
          Please complete your account setup to get started.
        </Text>
      </div>
      <Form {...setupForm}>
        <form onSubmit={setupForm.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-row flex-wrap justify-between gap-12">
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
          </div>
          <hr className="w-[120%] mb-12 mt-16 border-neutral-2 -ml-[10%]" />
          <div className="flex justify-center">
            <Button
              className="min-w-[400px]"
              type="submit"
              variant="primary"
              size="large"
              disabled={isAnyFieldEmty}
            >
              <LucideUserRoundCog /> Sign up
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
