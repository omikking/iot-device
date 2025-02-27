import { graphql } from '@/gql';
import { useMutation } from 'urql';

const removeAdministratorsMutation = graphql(`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id) {
      id
      email
      fullName
      workPlace
      phoneNumber
    }
  }
`);

export const AdministratorDeleteUrql = () => {
  const [result, removeUserMutation] = useMutation(
    removeAdministratorsMutation,
  );

  const removeUser = async (id: string) => {
    const response = await removeUserMutation({ id });

    return response.data?.removeUser;
  };

  return {
    removeUser,
    loading: result.fetching,
    error: result.error,
  };
};
