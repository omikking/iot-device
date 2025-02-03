import React from 'react';
import { cacheExchange, createClient, fetchExchange } from 'urql/core';
import { graphql } from '@/gql';
import { registerUrql } from '@urql/next/rsc';

// types.ts
// type Company = {
//   id: string;
//   name: string;
// };

const GET_COMPANIES = graphql(`
  query getMeCompaniesSSR {
    companies {
      id
      name
    }
  }
`);

const makeClient = () => {
  return createClient({
    url: 'http://localhost:3333/graphql',
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: { cache: 'no-store' },
  });
};

export const { getClient } = registerUrql(makeClient);

export async function getCompanies() {
  const result = await getClient().query(GET_COMPANIES, {});

  if (result.error) {
    // throw new Error(result.error.message);
    return [];
  }

  return result.data?.companies;
}
