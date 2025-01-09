// This file is an example on how to query GraphQL from a client component

// A component is a client component when it includes 'use client' at the top.
// A component is also rendered as a client component when it is imported to a parent component/page that has 'use client', even when itself does not contain 'use client'
// Please look into client component vs server component (RSC) in Next.js if you are unsure about the differences between the two.

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
  // const [result, reexecuteQuery] = useQuery({
  //   query: getMeCoffeesDocument,
  // });

  // const { data, fetching, error } = result;
  const [{ data, fetching, error }] = useQuery({ query: getMeCoffeesDocument });

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
