'use client';

import { gql, useMutation } from '@apollo/client';
import { Button } from '@gsp/ui';

const CREATE_COFFEE_APOLLO = gql`
  mutation CreateCoffeeApollo($createCoffeeInput: CreateCoffeeInput!) {
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
`;

interface Coffee {
  id: string;
  name: string;
  brand: string;
  flavors: { id: string; name: string }[];
}

interface CreateCoffeeMutationResult {
  createCoffee: Coffee;
}

interface CreateCoffeeMutationVariables {
  createCoffeeInput: CreateCoffeeInput;
}

interface CreateCoffeeInput {
  name: string;
  brand: string;
  flavors: string[];
}

export default function CoffeeCreate() {
  // const [createCoffee, { data, loading, error }] = useMutation<
  const [createCoffee] = useMutation<
    CreateCoffeeMutationResult,
    CreateCoffeeMutationVariables
  >(CREATE_COFFEE_APOLLO);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const createCoffeeInput: CreateCoffeeInput = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      flavors: ['Arabia Spring', 'American Roundhouse'],
    };

    try {
      const result = await createCoffee({
        variables: { createCoffeeInput },
      });
      console.log('Coffee created:', result.data?.createCoffee);
    } catch (err) {
      console.error('Error creating Coffee:', err);
    }
  };

  return (
    <div>
      <h2 className="text-sm">Add Coffee</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Coffee name" required />
        <input name="brand" placeholder="Coffee brand" required />
        <Button size={'large'} variant={'primary'} type="submit">
          Create Coffee
        </Button>
      </form>
    </div>
  );
}
