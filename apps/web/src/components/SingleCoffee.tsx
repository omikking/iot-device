import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { getClient } from '../libs/ApolloClient';

//Should use the 'use client' hook to fetch data from GraphQL on a client component
//This way we can fetch data and render it on the client side

const GET_COFFEE_BY_ID = gql`
  query GetCoffeeWithID($id: ID!) {
    coffee(id: $id) {
      id
      name
      brand
      flavors {
        name
      }
    }
  }
`;

async function SingleCoffee({ params }: { params: { id: string } }) {
  const { data, loading, error }: any = await getClient().query({
    query: GET_COFFEE_BY_ID,
    variables: { id: params?.id },
  });
  console.log('DATA FROM SINGLE COFFEE: ', data);
  return (
    <div>
      {data && (
        <div>
          <p>{data.coffee.name}</p>
          <p>{data.coffee.brand}</p>
          {data.coffee.flavors.map(({ name }) => (
            <div key={name}>
              <p>{name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SingleCoffee;
