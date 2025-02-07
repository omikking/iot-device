import { graphql } from '@/gql';
import { useMutation } from 'urql';

// createa a mutation to udpate a user with the id
const updateUsersMutation = graphql(`
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

// out mutationVariable
type UpdateUserInput = {
  email?: string;
  fullName?: string;
  workPlace?: string;
  phoneNumber?: string;
  globalRole?: string;
  isGlobalVisibility?: boolean;
  // UserPermission will be added later
};

// result of the update
type UpdateUserResult = {
  updateUser: {
    email: string;
    fullName: string;
    workPlace: string;
    phoneNumber: string;
    globalRole: string;
    isGlobalVisibility: boolean;
  };
};

export const UsersUpdateUrql = () => {
  // use the useMutation hook to update the user
  const [result, updateUserMutation] =
    useMutation<UpdateUserResult>(updateUsersMutation);

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
