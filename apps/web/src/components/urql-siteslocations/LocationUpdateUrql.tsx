import { graphql } from '@/gql';
import { useMutation } from 'urql';

type UpdateLocationInput = {
  locationName: string;
};

const updateLocationsMutation = graphql(`
  mutation updateLocation(
    $id: String!
    $updateLocationInput: UpdateLocationInput!
  ) {
    updateLocation(id: $id, updateLocationInput: $updateLocationInput) {
      id
      locationName
    }
  }
`);

export const LocationUpdateUrql = () => {
  const [result, updateLocationMutation] = useMutation(updateLocationsMutation);

  const updateLocation = async (id: string, input: UpdateLocationInput) => {
    console.log('Updating location with:', { id, input });

    const response = await updateLocationMutation({
      id,
      updateLocationInput: input,
    });

    console.log('Mutation response:', response);

    if (response.error) {
      console.error('Mutation error:', response.error);
      throw response.error;
    }

    return response.data?.updateLocation;
  };

  return { updateLocation, result };
};
