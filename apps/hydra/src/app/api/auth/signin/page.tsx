'use client';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  LoadingSpinner,
} from '@gsp/ui-core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideLogIn } from 'lucide-react';
import { responses } from '@/app/uitexts/responses';
import {
  SignInFormValues,
  signInFormSchema,
} from '@/components/schemas/SignInFormSchema';
import { placeholder } from '@/app/uitexts/placeholder';
import { Role } from '@/gql/graphql';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else {
        const isAdmin = session.user.globalRole === Role.SandvikAdmin;
        const redirectTo = isAdmin
          ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/administration-portal`
          : `${process.env.NEXT_PUBLIC_PORTAL_URL}/select-company`;
        router.push(redirectTo);
      }
    }
  }, [status, session, router, searchParams]);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
    },
  });

  const handleSignIn = async (values: SignInFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    await signIn('credentials', {
      email: values.emailAddress,
      password: values.password,
      redirect: false,
    })
      .then((result) => {
        if (!result?.ok && result?.error) {
          try {
            const errorData = JSON.parse(result.error);
            setErrorMessage(errorData?.title || responses.signInFailed);
          } catch {
            setErrorMessage(responses.signInFailed);
          }
        }
      })
      .catch(() => {
        setErrorMessage(responses.contactSupportError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formValues = form.watch();
  const isAnyFieldEmpty = !formValues.emailAddress || !formValues.password;

  return (
    <main className="m-auto flex min-h-screen w-full flex-col items-center gap-16 bg-neutral-1 px-10 py-28">
      <Headline as="h1" variant="xl" color="foreground" className="text-center">
        Hydra
      </Headline>

      <div className="flex min-w-96 flex-col items-center">
        {errorMessage && (
          <div className="mb-4 w-full rounded border border-error bg-error-3 p-3">
            <Text variant="small" color="foreground">
              {errorMessage}
            </Text>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => handleSignIn(e))}
            className="flex w-full flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={placeholder.emailPlaceholder}
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={placeholder.passwordPlaceholder}
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              variant="primary"
              size="large"
              type="submit"
              disabled={isAnyFieldEmpty}
            >
              {isLoading ? <LoadingSpinner size={18} /> : <LucideLogIn />}
              Login
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
