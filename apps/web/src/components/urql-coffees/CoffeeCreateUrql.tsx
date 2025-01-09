'use client';

// This component was created quickly and was rushed. Please do not take it as an example of best practices. Look at the documentation for the tools you are using.
// urql, graphql-codegen, react-hook-form, zod, and @gsp/ui (based on shadcn and radix primitives) are used in this component.

import { useMutation } from 'urql';
import { graphql } from '@/gql';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
} from '@gsp/ui';

const createCoffeeMutation = graphql(`
  mutation CreateCoffee($createCoffeeInput: CreateCoffeeInput!) {
    createCoffee(createCoffeeInput: $createCoffeeInput) {
      id
      name
      brand
      flavors {
        id
        name
      }
    }
  }
`);

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  flavors: z.array(z.string()).min(1, 'At least one flavor is required'),
});

export function CoffeeCreateUrql() {
  type FormData = z.infer<typeof schema>;
  const [result, createCoffee] = useMutation(createCoffeeMutation);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    createCoffee({ createCoffeeInput: data }).then((result) => {
      if (result.error) {
        console.error(result.error);
      } else {
        if (result.data) {
          console.log('Coffee created:', result.data.createCoffee);
        }
      }
    });
  };

  return (
    <div>
      <Headline variant="medium" as="h1" color="foreground">
        Add New Coffee
      </Headline>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter coffee name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter coffee brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="flavors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flavors</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter flavors separated by commas"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value
                        .split(',')
                        .map((flavor) => flavor.trim());
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="primary" size={'large'}>
            Add Coffee
          </Button>
        </form>
      </Form>
      {result.error && (
        <Text variant="medium" color="destructive">
          Error: {result.error.message}
        </Text>
      )}
      {result.data && (
        <Text variant="medium" color="foreground">
          Coffee created successfully!
        </Text>
      )}
    </div>
  );
}

export default CoffeeCreateUrql;
