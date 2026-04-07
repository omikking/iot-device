'use client';
import { GoBack } from '@/components/GoBack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordSendOTP,
  resetPasswordValidateOTP,
  resetPasswordResetPassword,
  ResetPasswordSendOTP,
  ResetPasswordValidateOTP,
  ResetPasswordResetPassword,
} from '@/components/schemas/ResetPasswordFormSchema';
import { CircleCheckBig } from 'lucide-react';
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Headline,
  Input,
  Text,
  Anchor,
  showAlertToast,
} from '@gsp/ui';
import {
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables,
  ValidateResetTokenMutation,
  ValidateResetTokenMutationVariables,
  ConfirmPasswordResetMutation,
  ConfirmPasswordResetMutationVariables,
} from '@/gql/graphql';
import Link from 'next/link';
import { useMutation } from 'urql';
import { graphql } from '@/gql';
import { useRouter } from 'next/navigation';
import { handleGraphQLErrors } from '@/libs/utils';
import { responses } from '@/app/uitexts/responses';
import { placeholder } from '@/app/uitexts/placeholder';

const requestPasswordResetMutation = graphql(`
  mutation requestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input)
  }
`);

const validateResetTokenMutation = graphql(`
  mutation validateResetToken($input: ValidateResetTokenInput!) {
    validateResetToken(input: $input)
  }
`);

const confirmPasswordResetMutation = graphql(`
  mutation confirmPasswordReset($input: ConfirmPasswordResetInput!) {
    confirmPasswordReset(input: $input)
  }
`);

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [, requestPasswordReset] = useMutation<
    RequestPasswordResetMutation,
    RequestPasswordResetMutationVariables
  >(requestPasswordResetMutation);

  const [, validateResetToken] = useMutation<
    ValidateResetTokenMutation,
    ValidateResetTokenMutationVariables
  >(validateResetTokenMutation);

  const [, confirmPasswordReset] = useMutation<
    ConfirmPasswordResetMutation,
    ConfirmPasswordResetMutationVariables
  >(confirmPasswordResetMutation);

  const formStep1 = useForm<ResetPasswordSendOTP>({
    resolver: zodResolver(resetPasswordSendOTP),
    defaultValues: {
      email: '',
    },
  });

  const formStep2 = useForm<ResetPasswordValidateOTP>({
    resolver: zodResolver(resetPasswordValidateOTP),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const formStep3 = useForm<ResetPasswordResetPassword>({
    resolver: zodResolver(resetPasswordResetPassword),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitStep1 = async (data: ResetPasswordSendOTP) => {
    setIsLoading(true);

    requestPasswordReset({
      input: { email: data.email },
    })
      .then((result) => {
        // Backend errors
        handleGraphQLErrors(result.error);

        // Success
        if (result.data) {
          formStep2.setValue('email', data.email);
          setStep(2);

          showAlertToast({
            title: responses.resetPasswordEmailSent,
            variant: 'success',
          });
        }
      })
      // Fallback error
      .catch(() => {
        showAlertToast({
          title: responses.resetPasswordEmailFailed,
          description: responses.contactSupportError,
          variant: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmitStep2 = async (data: ResetPasswordValidateOTP) => {
    setIsLoading(true);

    validateResetToken({
      input: {
        email: data.email,
        token: data.code,
      },
    })
      .then((result) => {
        // Backend errors
        handleGraphQLErrors(result.error);

        // Success
        if (result.data) {
          formStep3.setValue('email', data.email);
          formStep3.setValue('code', data.code);
          setStep(3);

          showAlertToast({
            title: responses.resetPasswordCodeVerifiedSuccess,
            variant: 'success',
          });
        }
      })
      // Fallback error
      .catch(() => {
        showAlertToast({
          title: responses.resetPasswordCodeFailed,
          description: responses.contactSupportError,
          variant: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmitStep3 = async (data: ResetPasswordResetPassword) => {
    setIsLoading(true);

    confirmPasswordReset({
      input: {
        email: data.email,
        token: data.code,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
    })
      .then((result) => {
        // Backend errors
        handleGraphQLErrors(result.error);

        // Success
        if (result.data) {
          showAlertToast({
            title: responses.resetPasswordSuccess,
            variant: 'success',
          });
        }
        setTimeout(() => {
          router.push('/api/auth/signin');
        }, 1000);
      })
      // Fallback error
      .catch(() => {
        showAlertToast({
          title: responses.resetPasswordFailed,
          description: responses.contactSupportError,
          variant: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-1 min-h-[calc(100vh-64px)]">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Forgot Password
      </Headline>

      {step === 1 && (
        <Form {...formStep1}>
          <form
            onSubmit={formStep1.handleSubmit(onSubmitStep1)}
            className="w-full max-w-md flex flex-col gap-6"
          >
            <div className="flex flex-col justify-center items-center px-14 text-center">
              <Text variant="medium" color="foreground">
                Enter your email and we will send you a verification code to
                reset your password.
              </Text>
            </div>
            <FormField
              control={formStep1.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={placeholder.emailPlaceholder}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="primary"
              size="large"
              isWide
              type="submit"
              isLoading={isLoading}
            >
              Send Code
            </Button>
          </form>
        </Form>
      )}

      {step === 2 && (
        <Form {...formStep2}>
          <form
            onSubmit={formStep2.handleSubmit(onSubmitStep2)}
            className="w-full max-w-md flex flex-col gap-6"
          >
            <div className="flex flex-col justify-center items-center">
              <Text variant="medium" color="foreground">
                Enter the verification code.
              </Text>
              <span className="flex">
                <Text variant="small" color="destructive" className="mr-1">
                  <Anchor asChild isUnderline color="destructive">
                    <Link href="/api/auth/reset-password">Resend</Link>
                  </Anchor>
                </Text>
                <Text variant="small" color="foreground">
                  code if you didn&apos;t receive it.
                </Text>
              </span>
            </div>
            <FormField
              control={formStep2.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={placeholder.verificationCodePlaceholder}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="primary"
              size="large"
              isWide
              type="submit"
              isLoading={isLoading}
            >
              Verify Code
            </Button>
          </form>
        </Form>
      )}

      {step === 3 && (
        <Form {...formStep3}>
          <form
            onSubmit={formStep3.handleSubmit(onSubmitStep3)}
            className="w-full max-w-md flex flex-col gap-6"
          >
            <FormField
              control={formStep3.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={placeholder.newPasswordPlaceholder}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formStep3.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={placeholder.confirmPasswordPlaceholder}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="primary"
              size="large"
              isWide
              type="submit"
              isLoading={isLoading}
            >
              <CircleCheckBig />
              Confirm
            </Button>
          </form>
        </Form>
      )}
    </main>
  );
}
