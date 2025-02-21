import { graphql } from '@/gql';
import { useMutation } from 'urql';

export const deleteSitesMutation = graphql(`
  mutation deleteSite($id: String!) {
    removeSite(id: $id) {
      id
      siteName
      address
      postalCode
      city
      country
      companyId
    }
  }
`);


export const SitesDeleteUrql = () => {
  const [result, deleteSiteMutation] = useMutation(deleteSitesMutation);
  const deleteSite = async (id: string) => {
    const response = await deleteSiteMutation({ id });
    return response.data?.removeSite;
  };

  return {
    deleteSite,
    loading: result.fetching,
  };
};

// export const useSites = () => {
//   const [result] = useQuery<ISites>({
//     query: getSitesQuery,
//   });

//   const { data, fetching, error } = result;

//   const sites = useMemo(() => {
//     if (!data?.sites) {
//       return [] as ISite[];
//     }
//     return data.sites;
//   }, [data]);

//   return { sites, isLoading: fetching, error };
// };