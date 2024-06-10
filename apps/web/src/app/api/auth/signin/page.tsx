'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from '@gsp/ui';

export default function SignIn() {
  const [error, setError] = useState('');

  const router = useRouter();

  // constraint for email & password fields
  const formSchema = z.object({
    emailAddress: z
      .string()
      .email({ message: 'email must be a valid email address.' })
      .min(2, { message: 'email must be at least 2 characters.' })
      .max(50, { message: 'email must be at most 50 characters.' }),
    password: z
      .string()
      .min(3, { message: 'password must be at least 3 characters.' }),
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
    <div className="mx-10 flex flex-col items-center justify-evenly p-24 gap-20">
      <h1 className="text-md">Welcome to Ground Support Web! 🦄</h1>
      <div className="min-w-96 h-96 flex flex-col items-center">
        {error && <p>{error}</p>}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => handleSignIn(e))}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" {...field} />
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
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="pb-8 pt-2">
              <Label>
                Forgot your password? {/* Will lead to a reset page later */}
                <a className="underline" href="https://www.google.se">
                  Click here to reset.
                </a>
              </Label>
            </div>
            <Button className="bg-white" type="submit" size={'lg'}>
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
