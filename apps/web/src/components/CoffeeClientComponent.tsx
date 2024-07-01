'use client';
import React from 'react';
import { useQuery, gql } from '@apollo/client';

// This is how we can fetch data from GraphQL on a client component! We use the regular docs useQuery, useSuspenseQuery etc...
// In a RSC (component without 'use client'), we will have to import the ApolloClient.tsx file and use the exported functions like getClient or query.
// It could look something like const {data} = await getClient.query(GET_COFFEES_QUERY).
// It could also look like const {data} = await query(GET_COFFEES_QUERY). (both do the same, query is a shortcut for getClient.query)
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

function CoffeeClientComponent() {
  const { loading, error, data } = useQuery(GET_COFFEES_QUERY);

  console.log('error: ', error);
  console.log('DATA: ', data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      <h2 className="text-sm">Client GetCoffees</h2>
      {data.coffees.map(({ id, name, brand }: any) => (
        <div key={id}>
          <p>{`${name} by ${brand}`}</p>
        </div>
      ))}
    </div>
  );
}

export default CoffeeClientComponent;
