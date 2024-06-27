'use client';

import { gql, useMutation } from '@apollo/client';

const CREATE_COFFEE = gql`
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

export default function CreateCoffeeForm() {
  const [createCoffee, { data, loading, error }] = useMutation<
    CreateCoffeeMutationResult,
    CreateCoffeeMutationVariables
  >(CREATE_COFFEE);

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
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Coffee name" required />
      <input name="brand" placeholder="Coffee brand" required />
      <button type="submit">Create Coffee</button>
    </form>
  );
}
