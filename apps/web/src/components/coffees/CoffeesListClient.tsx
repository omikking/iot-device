'use client';
import React from 'react';
import { useQuery, gql } from 'urql';

const GET_COFFEES_QUERY = gql`
  query GetCoffees {
    coffees {
      id
      name
      brand
      flavors {
        name
      }
    }
  }
`;

function CoffeesListClient() {
  // const [{ data, fetching, error }] = useQuery({ query: CoffeesQuery });
  const [result, reexecuteQuery] = useQuery({
    query: GET_COFFEES_QUERY,
    // requestPolicy: 'cache-only',
  });

  const { data, fetching, error } = result;

  // console.log('error: ', error);
  // console.log('DATA: ', data);
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      <h2 className="text-sm">Client GetCoffees / CoffeesListClient </h2>
      {data?.coffees.map(({ id, name, brand }: any) => (
        <div key={id}>
          <p>{`${name} by ${brand}`}</p>
        </div>
      ))}
    </div>
  );
}

export default CoffeesListClient;
