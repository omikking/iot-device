import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { getClient } from '../libs/ApolloClient';

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

async function Coffees() {
  const { data }: any = await getClient().query({ query: GET_COFFEES_QUERY });

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :</p>;

  console.log('DATA FROM RSC; COFFEEE: ', data);
  return (
    <div>
      {data?.coffees?.map(({ id, name, brand, flavors }) => (
        <div key={id}>
          <p>{`${name} by ${brand}`}</p>
          {flavors?.map(({ id, name }) => (
            // make new comp for flavors
            <div key={id}>
              <p>{name}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Coffees;
