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

  const getSchemaForStep = (step: number) => {
    switch (step) {
      case 1:
        return z.object({
          email: z.string().email({ message: 'Invalid email address' }),
        });
      case 2:
        return z.object({
          email: z.string(),
          code: z.string().min(6, { message: 'Code must be 6 characters' }),
        });
      case 3:
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
      default:
        throw new Error('Invalid step value');
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
    switch (step) {
      case 1:
        // TODO Integrate BE for sending verification code
        setStep(2);
        break;
      case 2:
        // TODO Integrate BE for verifying code
        setStep(3);
        break;
      case 3:
        console.log('Resetting password...');
        alert('Password Reset Successful');
        break;
      default:
        console.log('Unknown step');
        break;
    }
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
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
              <Button variant="primary" size="large" isWide type="submit">
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
              <Button variant="primary" size="large" isWide type="submit">
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
              <Button variant="primary" size="large" isWide type="submit">
                <>
                  <CircleCheckBig />
                  Confirm
                </>
              </Button>
            </>
          )}
        </form>
      </Form>
    </main>
  );
}
