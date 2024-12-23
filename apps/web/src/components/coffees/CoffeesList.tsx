/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { gql } from '@apollo/client';
import { getClient } from '../../libs/ApolloClient';

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

async function CoffeesList() {
  const { data }: any = await getClient().query({
    query: GET_COFFEES_QUERY,
  });

  // console.log('RSC Coffee: ', data);
  return (
    <div>
      <h2 className="text-sm">RSC GetCoffees / CoffeesList</h2>
      {data?.coffees?.map(({ id, name, brand, flavors }: any) => (
        <div
          key={id}
          className={
            id % 2 === 0
              ? 'bg-gray-100 border-b-2 border-gray-800'
              : 'bg-gray-200 border-b-2 border-gray-800'
          }
        >
          <p>{`${name} by ${brand}`}</p>
          <p>
            Flavours:{' '}
            {flavors?.map(({ name }: any, index: number) => (
              <span key={index} className="text-xs">
                {name}
                {flavors.length - 1 === index ? '' : ', '}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CoffeesList;
