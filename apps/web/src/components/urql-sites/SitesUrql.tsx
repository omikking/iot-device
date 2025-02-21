import React from 'react';
import { cacheExchange, createClient, fetchExchange } from 'urql/core';
import { graphql } from '@/gql';
import { registerUrql } from '@urql/next/rsc';

const getSitesQuery = graphql(`
  query getSites {
    sites {
      siteName
      address
      postalCode
      city
      country
      companyId
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

const { getClient } = registerUrql(makeClient);

export default async function SitesUrql() {
  const result = await getClient().query(getSitesQuery, {});
  if (result.error) return <p>Error</p>;
}
