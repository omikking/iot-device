import { graphql } from '@/gql';
import { useMutation } from 'urql';

const createLevelsMutation = graphql(`
  mutation createLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
      levelName
      siteId
    }
  }
`);

export const LevelCreateUrql = () => {
  const [result, createLevelMutation] = useMutation(createLevelsMutation);

  //   const createLevel = async (input: CreateLevelInput) => {
  //     console.log('Creating level with:', input);

  //     const response = await createLevelMutation({
  //       createLevelInput: input,
  //     });

  //     console.log('Mutation response:', response);

  //     if (response.error) {
  //       console.error('Mutation error:', response.error);
  //       throw response.error;
  //     }

  //     return response.data?.createLevel;
  //   };

  return { createLevelMutation, result };
};
