import { graphql } from '@/gql';
import { useMutation } from 'urql';

const deleteSitesMutation = graphql(`
  mutation DeleteSite($siteName: String!) {
    removeSite(id: $siteName) {
      id
      siteName
      address
    }
  }
`);

export const SitesDeleteUrql = () => {
  const [result, deleteSiteMutation] = useMutation(deleteSitesMutation);
  const deleteSite = async (siteName: string) => {
    const response = await deleteSiteMutation({ siteName });
    return response.data?.removeSite;
  };

  return {
    deleteSite,
    loading: result.fetching,
  };
};