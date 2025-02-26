import { graphql } from '@/gql';
import { useMutation } from 'urql';

const updateAdministratorsMutation = graphql(`
  mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      email
      fullName
      workPlace
      phoneNumber
      globalRole
      isGlobalVisibility
    }
  }
`);

type UpdateUserInput = {
  email?: string;
  fullName?: string;
  workPlace?: string;
  phoneNumber?: string;
  globalRole?: string;
  isGlobalVisibility?: boolean;
  // TODO update userPermission when its added
  // UserPermission will be added later
};

export const AdministratorUpdateUrql = () => {
  const [result, updateUserMutation] = useMutation(
    updateAdministratorsMutation,
  );

  // update the user with the id and the input
  const updateUser = async (id: string, input: UpdateUserInput) => {
    const response = await updateUserMutation({
      id,
      updateUserInput: input,
    });

    // return the updated user
    return response.data?.updateUser;
  };

  // return the updated user and the loading state
  return {
    updateUser,
    loading: result.fetching,
    error: result.error,
  };
};
