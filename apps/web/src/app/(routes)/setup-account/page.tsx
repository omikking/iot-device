'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
import { graphql } from '@/gql';
import { useQuery, useMutation } from 'urql';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LucideUserRoundCog } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';

const validateInvitationQuery = graphql(`
  query validateInvitation($id: String!, $token: String!) {
    validateInvitation(id: $id, token: $token) {
      valid
      reason
      invitation {
        id
        email
        companyId
        globalRole
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
    }
  }
`);

function getInvitationMessage(invitation: {
  companyId?: string | null;
  globalRole?: string | null;
}) {
  if (!invitation) return null;
  // Company invitations
  if (invitation.companyId && !invitation.globalRole) {
    return {
      headline: `You’re invited to join this company.`,
      subtext: 'Please complete your account setup to get started.',
    };
  }
  // Global invitations
  if (invitation.globalRole === 'SANDVIK_TECHNICIAN') {
    return {
      headline: `You’re invited to join Ground Support Platform as a technician.`,
      subtext: 'Please complete your account setup to get started.',
    };
  }
  if (invitation.globalRole === 'SANDVIK_ADMIN') {
    return {
      headline: `You’re invited to join Ground Support Platform as an administrator.`,
      subtext: 'Please complete your account setup to get started.',
    };
  }
  return null;
}

export default function Page(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';
  const token = searchParams.get('token') || '';

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [{ data, fetching, error: queryError }] = useQuery({
    query: validateInvitationQuery,
    variables: { id, token },
    pause: !id || !token,
  });

  const [{ fetching: mutating }, completeInvitation] = useMutation(
    completeInvitationMutation,
  );

  const invitation = data?.validateInvitation?.invitation;
  const valid = data?.validateInvitation?.valid;
  const reason = data?.validateInvitation?.reason;

  // Determine error message from backend reason
  useEffect(() => {
    if (queryError) {
      setError('Something went wrong. Please try again later.');
    } else if (data && !valid) {
      if (reason === 'expired') setError('This invitation has expired.');
      else if (reason === 'already_used')
        setError('This invitation has already been used.');
      else if (reason === 'invalid_token') setError('Invalid invitation link.');
      else setError('Invitation is not valid.');
    } else {
      setError(null);
    }
  }, [data, valid, reason, queryError]);

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

  // Prefill email if available
  useEffect(() => {
    // No company name available, so do not prefill workPlace
    // Optionally, prefill email if you want to show it elsewhere
  }, [invitation, setupForm]);

  const onSubmit: SubmitHandler<SetupAccountFormWithConfirmValues> = async (
    formData,
  ) => {
    setError(null);
    const input = {
      id,
      token,
      fullName: formData.fullName,
      password: formData.password,
      workPlace: formData.workPlace,
      phoneNumber: formData.phoneNumber,
    };
    const result = await completeInvitation({ input });
    if (result.error) {
      // Prefer backend error message if available
      setError(
        result.error.graphQLErrors?.[0]?.message ||
          'Failed to complete invitation.',
      );
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/'); // Redirect to dashboard or login, not going to work though
      }, 2000);
    }
  };

  const formValues = setupForm.watch();
  const isAnyFieldEmpty =
    !formValues.fullName ||
    !formValues.workPlace ||
    !formValues.phoneNumber ||
    !formValues.password ||
    !formValues.confirmPassword;

  if (fetching) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1">
        <Headline as="h1" variant="xl" color="foreground">
          Setup Account
        </Headline>
        <Text color="foreground" variant="medium">
          Loading invitation...
        </Text>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1">
        <Headline as="h1" variant="xl" color="foreground">
          Setup Account
        </Headline>
        <Text color="destructive" variant="medium">
          {error}
        </Text>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1">
        <Headline as="h1" variant="xl" color="foreground">
          Account Created
        </Headline>
        <Text color="foreground" variant="medium">
          Your account has been created. Redirecting...
        </Text>
      </main>
    );
  }

  const invitationMsg = invitation ? getInvitationMessage(invitation) : null;

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1">
      <Headline as="h1" variant="xl" color="foreground">
        Setup Account
      </Headline>
      <div className="flex flex-col gap-3 items-center">
        {invitationMsg && (
          <>
            <Headline as="h4" variant="small" color="foreground">
              {invitationMsg.headline}
            </Headline>
            <Text color={'foreground'} variant={'medium'}>
              {invitationMsg.subtext}
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
                    placeholder="email@example.com"
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
                        placeholder="Fill in your full name..."
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
                        placeholder="Fill in your workplace..."
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
                        placeholder="Fill in your password..."
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
                        placeholder="Fill in your password..."
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
              isLoading={mutating}
            >
              {!mutating && <LucideUserRoundCog />}
              Sign up
            </Button>
            {error && (
              <Text color="destructive" variant="medium" className="mt-4">
                {error}
              </Text>
            )}
          </div>
        </form>
      </Form>
    </main>
  );
}
