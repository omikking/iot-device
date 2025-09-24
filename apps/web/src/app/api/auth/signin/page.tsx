'use client';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Role } from '@/gql/graphql';
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
  Anchor,
  Text,
  showAlertToast,
} from '@gsp/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { LucideLogIn } from 'lucide-react';
import Link from 'next/link';
import { responses } from '@/app/uitexts/responses';
import {
  SignInFormValues,
  signInFormSchema,
} from '@/components/schemas/SignInFormSchema';
import { placeholder } from '@/app/uitexts/placeholder';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      // TODO: Re-test and re-enable callbackUrl logic
      // const callbackUrl = searchParams.get('callbackUrl');
      // if (callbackUrl) {
      //   router.push(callbackUrl);
      // } else {
      //   const isAdmin = session.user.globalRole === Role.SandvikAdmin;
      //   const redirectTo = isAdmin
      //     ? '/administration-portal'
      //     : '/select-company';
      //   router.push(redirectTo);
      // }
      const isAdmin = session.user.globalRole === Role.SandvikAdmin;
      const redirectTo = isAdmin ? '/administration-portal' : '/select-company';
      router.push(redirectTo);
    }
  }, [status, router, searchParams]);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
    },
  });

  const handleSignIn = async (values: SignInFormValues) => {
    setIsLoading(true);

    await signIn('credentials', {
      email: values.emailAddress,
      password: values.password,
      redirect: false,
    })
      // Backend errors
      .then((result) => {
        if (!result?.ok && result?.error) {
          const errorData = JSON.parse(result.error);

          showAlertToast({
            title: errorData?.title,
            description: errorData?.message,
            variant: errorData?.type || 'error',
          });
        }
      })
      // Fallback error
      .catch(() => {
        showAlertToast({
          title: responses.signInFailed,
          description: responses.contactSupportError,
          variant: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formValues = form.watch();
  const isAnyFieldEmpty = !formValues.emailAddress || !formValues.password;

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-1 min-h-[calc(100vh-64px)]">
      <Headline as="h1" variant="xl" color="foreground" className="text-center">
        Ground Support Platform
      </Headline>

      <div className="min-w-96 h-96 flex flex-col items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => handleSignIn(e))}
            className="w-full flex flex-col gap-8"
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
            <div>
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
              <div className="flex items-center gap-2 pt-4 pb-2">
                <Text variant="small" color="foreground">
                  Forgot your password?
                </Text>
                <Text variant="small" color="accent">
                  <Link href="/api/auth/reset-password" passHref legacyBehavior>
                    <Anchor isUnderline color="accent">
                      Click here to reset.
                    </Anchor>
                  </Link>
                </Text>
              </div>
            </div>
            <Button
              variant="primary"
              size="large"
              isWide
              type="submit"
              isLoading={isLoading}
              disabled={isAnyFieldEmpty}
            >
              {!isLoading && <LucideLogIn />}
              Login
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
