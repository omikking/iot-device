import { graphql } from '@/gql';
import { useMutation } from 'urql';

const deleteUsersMutation = graphql(`
  mutation DeleteUser($id: String!) {
    removeUser(id: $id) {
      id
    }
  }
`);

export const UsersDeleteUrql = () => {
  const [result, deleteUserMutation] = useMutation(deleteUsersMutation);
  const deleteUser = async (id: string) => {
    const response = await deleteUserMutation({ id });
    return response.data?.removeUser;
  };

  return {
    deleteUser,
    loading: result.fetching,
  };
};
