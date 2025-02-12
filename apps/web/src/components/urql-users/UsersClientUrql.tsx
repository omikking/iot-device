import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type IUser = {
  id: string;
  email: string;
  fullName: string;
  workPlace: string;
  phoneNumber: string;
  globalRole: boolean;
  isGlobalVisibility: boolean;
  userPermissions: UserPermission[];
};

type UserPermission = {
  id: string;
  userId: string;
  role:
    | 'COMPANY_USER'
    | 'COMPANY_ADMIN'
    | 'SANDVIK_TECHNICIAN'
    | 'SANDVIK_ADMIN';
  appsAccess: string[];
};

type IUsers = {
  users: IUser[];
};

const getUsersQuery = graphql(`
  query getCompanyUsers {
    users {
      id
      email
      fullName
      workPlace
      phoneNumber
      globalRole
      isGlobalVisibility
      userPermissions {
        id
        role
        appsAccess
      }
    }
  }
`);

export const useUsers = () => {
  const [result] = useQuery<IUsers>({
    query: getUsersQuery,
  });

  const { data, fetching, error } = result;

  const users = useMemo(() => {
    if (!data?.users) {
      return [] as IUser[];
    }
    return data.users;
  }, [data]);

  return { users, isLoading: fetching, error };
};
