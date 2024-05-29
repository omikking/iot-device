'use client';
import {
  Card,
  Cube,
  Checkbox,
  Button,
  Input,
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
  Label,
} from '@gsp/ui';
import SignInButton from '../components/SignInButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// A thorough documentation of how the form works
// a schema for the form with validation rules
const formSchema = z.object({
  emailAdress: z
    .string()
    .email({ message: 'email must be a valid email address.' })
    .min(2, { message: 'email must be at least 2 characters.' })
    .max(50, { message: 'email must be at most 50 characters.' }),
  password: z
    .string()
    .min(3, { message: 'password must be at least 3 characters.' }),
});

export default function Page(): JSX.Element {
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values });
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAdress: '',
      password: '',
    },
  });
  return (
    <main className="flex flex-col items-center justify-around min-h-screen p-24">
      <h1 className="text-md">Welcome to Ground Support Web! 🚀</h1>

      <div className="flex flex-col md:flex-row max-w-md w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="emailAdress"
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
            <div>
              <Label>
                Forgot your password?{' '}
                <a className="underline" href="https://www.google.se">
                  Click here to reset.
                </a>
              </Label>
            </div>
            <Button type="submit" size={'lg'}>
              Login
            </Button>
            <SignInButton />
          </form>
        </Form>
      </div>
    </main>
  );
}
