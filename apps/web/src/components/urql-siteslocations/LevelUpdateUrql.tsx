import { graphql } from '@/gql';
import { useMutation } from 'urql';

type UpdateLevelInput = {
  levelName: string;
};

const updateLevelsMutation = graphql(`
  mutation updateLevel($id: String!, $updateLevelInput: UpdateLevelInput!) {
    updateLevel(id: $id, updateLevelInput: $updateLevelInput) {
      id
      levelName
    }
  }
`);

export const LevelUpdateUrql = () => {
  const [result, updateLevelMutation] = useMutation(updateLevelsMutation);

  const updateLevel = async (id: string, input: UpdateLevelInput) => {
    console.log('Updating level with:', { id, input });

    const response = await updateLevelMutation({
      id,
      updateLevelInput: input,
    });

    console.log('Mutation response:', response);

    if (response.error) {
      console.error('Mutation error:', response.error);
      throw response.error;
    }

    return response.data?.updateLevel;
  };

  return { updateLevel, result };
};
