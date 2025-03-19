import { gql } from 'urql';

export const getUserQuery = gql`
  query {
    users(roles: "SANDVIK_TECHNICIAN") {
      id
      email
      fullName
      workPlace
      phoneNumber
      isGlobalVisibility
      globalRole
    }
  }
`;

export const removeTechnicianQuery = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id) {
      id
    }
  }
`;

export const editTechnician = gql`
  mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      email
      fullName
      workPlace
      phoneNumber
      globalRole
      isGlobalVisibility
    }
  }
`;
