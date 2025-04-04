'use client';
import { GoBack } from '@/components/GoBack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@gsp/ui';
import Link from 'next/link';

export default function Page() {
  const [step, setStep] = useState(1);
  // const [error, setError] = useState('');

  const getSchemaForStep = (step: number) => {
    if (step === 1) {
      return z.object({
        email: z.string().email({ message: 'Invalid email address' }),
      });
    } else if (step === 2) {
      return z.object({
        email: z.string(),
        code: z.string().min(6, { message: 'Code must be 6 characters' }),
      });
    } else {
      return z
        .object({
          email: z.string(),
          code: z.string(),
          newPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
          confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: 'Passwords must match',
          path: ['confirmPassword'],
        });
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchemaForStep(step)),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async () => {
    if (step === 1) {
      // TODO Integrate BE for sending verification code
      setStep(2);
    } else if (step === 2) {
      //TODO Integrate BE for verifying code
      setStep(3);
    } else {
      console.log('Resetting password...');
      alert('Password Reset Successful');
    }
  };

  const getButtonLabel = () => {
    switch (step) {
      case 1:
        return 'Send Code';
      case 2:
        return 'Verify Code';
      case 3:
        return (
          <>
            <CircleCheckBig />
            Confirm
          </>
        );
      default:
        return 'Next';
    }
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      <Headline as="h3" variant="xl" color="foreground">
        Forgot Password
      </Headline>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md flex flex-col gap-6"
        >
          {/* {error && (
            <Text variant="xs" color="destructive">
              {error}
            </Text>
          )} */}

          {step === 1 && (
            <>
              <div className="flex flex-col justify-center items-center px-14 text-center">
                <Text variant="small" color="foreground">
                  Enter your email and we will send you a link to reset your
                  password.
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
                        placeholder="Enter your email"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col justify-center items-center">
                <Text variant="small" color="foreground">
                  Enter the verification code.
                </Text>
                <span className="flex">
                  <Text variant="small" color="destructive">
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
                  &nbsp;
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
                    <FormLabel>Enter verification code</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter reset code"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 3 && (
            <>
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter new password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
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
                        placeholder="Confirm new password"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button variant="primary" size="large" isWide type="submit">
            {getButtonLabel()}
          </Button>
        </form>
      </Form>
    </main>
  );
}
