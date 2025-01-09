// This file is an example on how to query GraphQL from a client component

// A component is a client component when it includes 'use client' at the top.
// A component is also rendered as a client component when it is imported to a parent component/page that has 'use client', even when itself does not contain 'use client'
// Please look into client component vs server component (RSC) in Next.js if you are unsure about the differences between the two.

// See https://commerce.nearform.com/open-source/urql/docs/basics/react-preact/ for docs
// Only difference from their example is that we use graphql-codegen for TypeScript typings, so we use import { graphql } from '@/gql'; instead of import { gql } from 'urql';
// More docs on graphql-codegen can be found in https://commerce.nearform.com/open-source/urql/docs/basics/typescript-integration/ and https://the-guild.dev/graphql/codegen/docs/guides/react-vue

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
      <ul>
        {data?.coffees.map(({ id, name, brand }) => (
          <li key={id}>{`${name} by ${brand}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default CoffeesClientUrql;
