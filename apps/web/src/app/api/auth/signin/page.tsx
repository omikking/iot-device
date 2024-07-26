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
  Link,
  Text,
} from '@gsp/ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { LucideLogIn } from 'lucide-react';

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
      <Headline as="h1" variant={'xl'} color={'foreground'}>
        Welcome to Ground Support Web! 🦄
      </Headline>

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
            <div className="flex items-center gap-2 pb-5 pt-1">
              <Text variant={'xs'} color={'foreground'}>
                Forgot your password? {/* Will lead to a reset page later */}
              </Text>

              <Link
                isUnderline
                href="https://www.google.se"
                color={'foreground'}
              >
                <Text variant={'xs'} color={'foreground'}>
                  Click here to reset.
                </Text>
              </Link>
            </div>
            <Button variant="primary" size={'large'} isWide type="submit">
              <LucideLogIn size={'20'} />
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
