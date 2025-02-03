import { cacheExchange, createClient, fetchExchange } from 'urql';

const client = createClient({
  url: 'http://localhost:3333/graphql',
  exchanges: [cacheExchange, fetchExchange],
  // Disabled for now to avoid caching issues
  fetchOptions: { cache: 'no-store' },
});

const COMPANIES_QUERY = `
  query GetCompanies {
    companies {
      id
      name
    }
  }
`;

export async function getCompanies() {
  const result = await client.query(COMPANIES_QUERY, {}).toPromise();
  return result.data?.companies ?? [];
}
