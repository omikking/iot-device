import { graphql } from '@/gql';
import { useMutation } from 'urql';

// Hook is not working
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

// The input type is defined in the GraphQL schema as:
type UpdateUserInput = {
  email?: string;
  fullName?: string;
  workPlace?: string;
  phoneNumber?: string;
  globalRole?: string;
  isGlobalVisibility?: boolean;
};

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

// We define the variables that the mutation will receive:
type UpdateUserVariables = {
  id: string;
  updateUserInput: UpdateUserInput;
};

export const useUpdateUser = () => {
  // We call the useMutation hook with the mutation we defined earlier:
  const [{ fetching, error, data }, updateUser] = useMutation<
    UpdateUserResult,
    UpdateUserVariables
  >(updateUsersMutation);

  // We define a function that will execute the mutation:
  const executeUpdate = async (id: string, input: UpdateUserInput) => {
    const result = await updateUser({ id, updateUserInput: input });
    return result.data?.updateUser;
  };

  return {
    updateUser: executeUpdate,
    fetching,
    error,
    data,
  };
};
