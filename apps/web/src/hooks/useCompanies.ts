import { useQuery } from 'urql';

const COMPANIES_QUERY = `
  query GetCompanies {
    companies {
      id
      name
    }
  }
`;

export function useCompanies() {
  const [result] = useQuery({
    query: COMPANIES_QUERY,
  });

  return {
    companies: result.data?.companies,
    isLoading: result.fetching,
    error: result.error,
  };
}
