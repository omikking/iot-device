'use client';
import { GoBack } from '@/components/GoBack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordSendOTP,
  resetPasswordValidateOTP,
  resetPasswordResetPassword,
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
  mutation requestPasswordReset(
    $requestPasswordResetInput: RequestPasswordResetInput!
  ) {
    requestPasswordReset(requestPasswordResetInput: $requestPasswordResetInput)
  }
`);

const validateResetTokenMutation = graphql(`
  mutation validateResetToken(
    $validateResetTokenInput: ValidateResetTokenInput!
  ) {
    validateResetToken(validateResetTokenInput: $validateResetTokenInput)
  }
`);

const confirmPasswordResetMutation = graphql(`
  mutation confirmPasswordReset(
    $confirmPasswordResetInput: ConfirmPasswordResetInput!
  ) {
    confirmPasswordReset(confirmPasswordResetInput: $confirmPasswordResetInput)
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

  const form = useForm({
    resolver: zodResolver(
      step === 1
        ? resetPasswordSendOTP
        : step === 2
          ? resetPasswordValidateOTP
          : resetPasswordResetPassword,
    ),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordResetPassword) => {
    setIsLoading(true);

    if (step === 1) {
      requestPasswordReset({
        requestPasswordResetInput: { email: data.email },
      })
        .then((result) => {
          // Backend errors
          handleGraphQLErrors(result.error);

          // Success
          if (result.data) {
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
    }

    if (step === 2) {
      validateResetToken({
        validateResetTokenInput: {
          email: data.email,
          token: data.code,
        },
      })
        .then((result) => {
          // Backend errors
          handleGraphQLErrors(result.error);

          // Success
          if (result.data) {
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
    }

    if (step === 3) {
      confirmPasswordReset({
        confirmPasswordResetInput: {
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
          router.push('/api/auth/signin');
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
    }
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-1 min-h-[calc(100vh-64px)]">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Forgot Password
      </Headline>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md flex flex-col gap-6"
        >
          {step === 1 && (
            <>
              <div className="flex flex-col justify-center items-center px-14 text-center">
                <Text variant="medium" color="foreground">
                  Enter your email and we will send you a verification code to
                  reset your password.
                </Text>
              </div>
              <FormField
                control={form.control}
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
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col justify-center items-center">
                <Text variant="medium" color="foreground">
                  Enter the verification code.
                </Text>
                <span className="flex">
                  <Text variant="small" color="destructive" className="mr-1">
                    <Link
                      href="/api/auth/reset-password"
                      passHref
                      legacyBehavior
                    >
                      <Anchor isUnderline color="destructive">
                        Resend
                      </Anchor>
                    </Link>
                  </Text>
                  <Text variant="small" color="foreground">
                    code if you didn't receive it.
                  </Text>
                </span>
              </div>
              <FormField
                control={form.control}
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
            </>
          )}

          {step === 3 && (
            <>
              <FormField
                control={form.control}
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
                control={form.control}
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
            </>
          )}
        </form>
      </Form>
    </main>
  );
}
