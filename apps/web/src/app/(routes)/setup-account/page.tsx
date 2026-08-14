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
  LoadingSpinner,
  Text,
  showAlertToast,
} from '@gsp/ui';
import {
  SetupAccountFormWithConfirmValues,
  setupAccountFormWithConfirmSchema,
} from '@/components/schemas/SetupAccountFormSchema';
import { graphql } from '@/gql';
import { useQuery, useMutation } from 'urql';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LucideAlertCircle, LucideUserRoundCog } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { Role } from '@/gql/graphql';
import { handleGraphQLErrors } from '@/libs/utils';
import { responses } from '@/app/uitexts/responses';
import { placeholder } from '@/app/uitexts/placeholder';

const validateInvitationQuery = graphql(`
  query validateInvitation($id: String!, $token: String!) {
    validateInvitation(id: $id, token: $token) {
      valid
      reason
      invitation {
        id
        email
        companyId
        companyName
        globalRole
        role
        expiresAt
        used
      }
    }
  }
`);

const completeInvitationMutation = graphql(`
  mutation completeInvitation($input: CompleteInvitationInput!) {
    completeInvitation(input: $input) {
      id
      email
      fullName
      globalRole
    }
  }
`);

const getInvitationMessage = (role: Role, companyName?: string) => {
  const invitationMessage = {
    [Role.SandvikAdmin]: {
      companyName: 'Ground Support Platform',
      role: 'as an administrator.',
    },
    [Role.SandvikTechnician]: {
      companyName: 'Ground Support Platform',
      role: 'as a technician.',
    },
    [Role.CompanyAdmin]: {
      companyName: `${companyName}`,
      role: 'as an administrator.',
    },
    [Role.CompanyUser]: {
      companyName: `${companyName}.`,
      role: undefined,
    },
  };
  return invitationMessage[role];
};

export default function Page(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';
  const token = searchParams.get('token') || '';

  const [{ data, fetching, error: validateInviteError }] = useQuery({
    query: validateInvitationQuery,
    variables: { id, token },
    pause: !id || !token,
  });

  const [{ fetching: invitationLoading }, completeInvitation] = useMutation(
    completeInvitationMutation,
  );

  const { invitation } = data?.validateInvitation || {};

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

  const onSubmit: SubmitHandler<SetupAccountFormWithConfirmValues> = async (
    formData,
  ) => {
    const input = {
      id,
      token,
      fullName: formData.fullName,
      password: formData.password,
      workPlace: formData.workPlace,
      phoneNumber: formData.phoneNumber,
    };

    completeInvitation({ input })
      .then((result) => {
        // Backend errors
        handleGraphQLErrors(result.error);

        // Handle success
        if (result.data) {
          showAlertToast({
            title: responses.createAccountSetupSuccess,
            variant: 'success',
          });
          setTimeout(() => {
            router.push('/api/auth/signin');
          }, 200);
        }
      })
      .catch(() => {
        showAlertToast({
          title: responses.failedToSetupAccountError,
          description: responses.contactSupportError,
          variant: 'error',
        });
      });
  };

  const formValues = setupForm.watch();
  const isAnyFieldEmpty =
    !formValues.fullName ||
    !formValues.workPlace ||
    !formValues.password ||
    !formValues.confirmPassword;

  const invitationMessage = invitation
    ? getInvitationMessage(
        (invitation.globalRole as Role) || (invitation.role as Role),
        invitation.companyName || undefined,
      )
    : null;

  if (fetching) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1">
        <Headline as="h1" variant="xl" color="foreground">
          Setup Account
        </Headline>
        <Text color="foreground" variant="medium" className="flex gap-3">
          <LoadingSpinner />
          Loading invitation...
        </Text>
      </main>
    );
  }

  if (validateInviteError) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1">
        <Headline as="h1" variant="xl" color="foreground">
          Setup Account
        </Headline>
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2 items-center">
            <LucideAlertCircle size={20} className="text-error" />
            <Headline as="h4" variant="medium" color="destructive">
              {
                validateInviteError.graphQLErrors[0]?.extensions
                  ?.title as string
              }
            </Headline>
          </div>
          <Text variant="medium" color="foreground">
            {
              validateInviteError.graphQLErrors[0]?.extensions
                ?.message as string
            }
          </Text>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1">
      <Headline as="h1" variant="xl" color="foreground">
        Setup Account
      </Headline>

      <div className="flex flex-col gap-3 items-center">
        {invitationMessage && (
          <>
            <Headline
              as="h4"
              variant="small"
              color="foreground"
              className="flex gap-1.5"
            >
              You’re invited to join
              <Headline isBold as="span" variant="small" color="foreground">
                {invitationMessage.companyName}
              </Headline>
              {invitationMessage.role}
            </Headline>
            <Text color={'foreground'} variant={'medium'}>
              Please complete your account setup to get started.
            </Text>
          </>
        )}
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
                    value={invitation?.email || ''}
                    className="w-96"
                  />
                </FormControl>
              </FormItem>
              <FormField
                control={setupForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={placeholder.fullNamePlaceholder}
                        className="w-96"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row flex-wrap justify-between gap-8">
              <FormField
                control={setupForm.control}
                name="workPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workplace</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={placeholder.workplacePlaceholder}
                        className="w-96"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={setupForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={placeholder.phoneNumberPlaceholder}
                        className="w-96"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row flex-wrap justify-between gap-8">
              <FormField
                control={setupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={placeholder.passwordPlaceholder}
                        className="w-96"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={setupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={placeholder.passwordPlaceholder}
                        className="w-96"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <hr className="w-[120%] mb-12 mt-16 border-neutral-2 -ml-[10%]" />
          <div className="flex flex-col mx-auto max-w-[400px]">
            <Button
              type="submit"
              variant="primary"
              size="large"
              isWide
              disabled={isAnyFieldEmpty}
              isLoading={invitationLoading}
            >
              {!invitationLoading && <LucideUserRoundCog />}
              Sign up
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
