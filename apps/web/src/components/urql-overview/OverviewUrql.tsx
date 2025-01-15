import React from 'react';
import { cacheExchange, createClient, fetchExchange } from 'urql/core';
import { graphql } from '@/gql';
import { registerUrql } from '@urql/next/rsc';

const getCompaniesQuery = graphql(`
  query getCompanies {
    companies {
      id
      name
      orgNumber
      address
      postalCode
      city
      country
      companyContactEmail
    }
  }
`);

const makeClient = () => {
  return createClient({
    url: 'http://localhost:3333/graphql',
    // What does this do?
    exchanges: [cacheExchange, fetchExchange],
    // TODO: Look into enabling cache and invalidating it from client components on updates.
    fetchOptions: { cache: 'no-store' },
  });
};

const { getClient } = registerUrql(makeClient);

export default async function CompaniesUrql() {
  const result = await getClient().query(getCompaniesQuery, {});
  if (result.error) return <p>Error</p>;

  console.log(result.data?.companies);
  return <div>Hello Companies!</div>;
}
