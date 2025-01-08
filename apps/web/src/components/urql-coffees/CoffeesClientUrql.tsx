/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

const getMeCoffeesDocument = graphql(`
  query getMeCoffees {
    coffees {
      id
      name
      brand
    }
  }
`);

function CoffeesClientUrql() {
  // const [{ data, fetching, error }] = useQuery({ query: getCoffeesDocument });
  const [result, reexecuteQuery] = useQuery({
    query: getMeCoffeesDocument,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      <h2 className="text-sm">Client Coffees List</h2>
      {data?.coffees.map(({ id, name, brand }) => (
        <div key={id}>
          <p>{`${name} by ${brand}`}</p>
        </div>
      ))}
    </div>
  );
}

export default CoffeesClientUrql;
