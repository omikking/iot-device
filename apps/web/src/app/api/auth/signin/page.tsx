'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
} from '@gsp/ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { LucideLogIn } from 'lucide-react';
import Link from 'next/link';

export default function SignIn() {
  const [error, setError] = useState('');

  const router = useRouter();

  // constraint for email & password fields
  const formSchema = z.object({
    emailAddress: z
      .string()
      .email({ message: 'Email must be a valid email address.' })
      .min(2, { message: 'Email must be at least 2 characters.' })
      .max(50, { message: 'Email must be at most 50 characters.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
  });

  // to validate the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
    },
  });

  const handleSignIn = async (values: z.infer<typeof formSchema>) => {
    const result = await signIn('credentials', {
      email: values.emailAddress,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };
  const { data: session, status } = useSession();

  console.log('Session from sign in page: ', session);
  console.log('Status from sign in page: ', status);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-1 min-h-[calc(100vh-64px)]">
      {/* @TODO is this page ground support platform login only or login for all apps? */}
      <Headline as="h1" variant="xl" color="foreground">
        Ground Support Platform
      </Headline>

      <div className="min-w-96 h-96 flex flex-col items-center">
        {/* @TODO fix better displaying of this error later */}
        {error && (
          <Text variant="xs" color="destructive">
            {error}
          </Text>
        )}
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
                        placeholder="Enter email"
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
                          placeholder="Enter password"
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
                  Forgot your password? {/* Will lead to a reset page later */}
                </Text>

                <Text variant="small" color="foreground">
                  <Link href="https://www.google.se" passHref legacyBehavior>
                    <Anchor isUnderline color="foreground">
                      Click here to reset.
                    </Anchor>
                  </Link>
                </Text>
              </div>
            </div>
            <Button variant="primary" size="large" isWide type="submit">
              <LucideLogIn />
              Login
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
