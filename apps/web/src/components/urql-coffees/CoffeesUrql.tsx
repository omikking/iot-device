import React from 'react';
import { cacheExchange, createClient, fetchExchange } from 'urql/core';
import { graphql } from '@/gql';
import { registerUrql } from '@urql/next/rsc';

const getCoffeesQuery = graphql(`
  query getMeCoffees {
    coffees {
      id
      name
      brand
    }
  }
`);

const makeClient = () => {
  return createClient({
    url: 'http://localhost:3333/graphql',
    exchanges: [cacheExchange, fetchExchange],
    // TODO: Look into enabling cache and invalidating it from client components on updates.
    fetchOptions: { cache: 'no-store' },
  });
};

const { getClient } = registerUrql(makeClient);

export default async function CoffeesUrql() {
  const result = await getClient().query(getCoffeesQuery, {});

  if (result.error) return <p>Error</p>;

  return (
    <div>
      <h2 className="text-sm">RSC Coffees List</h2>
      <h3>This is rendered an RSC, aka a server component</h3>
      <ul>
        {result.data?.coffees.map(({ id, name, brand }) => (
          <li key={id}>{`${name} by ${brand}`}</li>
        ))}
      </ul>
    </div>
  );
}
