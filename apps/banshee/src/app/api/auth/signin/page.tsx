'use client';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
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
} from '@gsp/ui-banshee';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { LucideLogIn } from 'lucide-react';
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
  console.log(session);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else {
        router.push(`${process.env.NEXT_PUBLIC_PORTAL_URL}/overview`);
      }
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
    <main className="ui-banshee-w-full ui-banshee-flex ui-banshee-flex-col ui-banshee-m-auto ui-banshee-items-center ui-banshee-py-28 ui-banshee-px-10 ui-banshee-gap-16 ui-banshee-bg-neutral-1 ui-banshee-min-h-[calc(100vh-64px)]">
      <Headline
        as="h1"
        variant="xl"
        color="foreground"
        className="ui-banshee-text-center"
      >
        Banshee
      </Headline>

      <div className="ui-banshee-min-w-96 ui-banshee-h-96 ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center">
        {errorMessage && (
          <div className="ui-banshee-w-full ui-banshee-mb-4 ui-banshee-p-3 ui-banshee-bg-red-100 ui-banshee-border ui-banshee-border-red-400 ui-banshee-rounded ui-banshee-text-red-700">
            <Text variant="small" color="foreground">
              {errorMessage}
            </Text>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => handleSignIn(e))}
            className="ui-banshee-w-full ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-8"
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
                        className="ui-banshee-w-full"
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
                          className="ui-banshee-w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <Button
              variant="primary"
              size="large"
              type="submit"
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
