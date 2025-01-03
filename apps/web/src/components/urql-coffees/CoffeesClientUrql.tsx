/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useQuery, gql } from 'urql';

const GET_COFFEES_QUERY = gql`
  query {
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

function CoffeesClientUrql() {
  // const [{ data, fetching, error }] = useQuery({ query: CoffeesQuery });
  const [result, reexecuteQuery] = useQuery({
    query: GET_COFFEES_QUERY,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      <h2 className="text-sm">Client Coffees List</h2>
      {data?.coffees.map(({ id, name, brand }: any) => (
        <div key={id}>
          <p>{`${name} by ${brand}`}</p>
        </div>
      ))}
    </div>
  );
}

export default CoffeesClientUrql;
