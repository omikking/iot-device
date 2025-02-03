import { cacheExchange, createClient, fetchExchange } from 'urql/core';
import { graphql } from '@/gql';
import { registerUrql } from '@urql/next/rsc';

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
  const result = await getClient().query(GET_COMPANIES, {}).toPromise();

  return result.data?.companies ?? [];
}
