'use client';

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

// Make this query reusable since we are fetching roles and there are 4 different roles
const getAdminsQuery = graphql(`
  query getAdmins($roles: [String!]) {
    users(roles: $roles) {
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

export function useAdmins(roles: string[]) {
  const [result] = useQuery<IUsers>({
    query: getAdminsQuery,
    variables: { roles },
  });

  const { data, fetching, error } = result;

  const administrators = useMemo(() => {
    if (!data?.users) {
      return [] as IUser[];
    }
    return data.users;
  }, [data]);

  return { administrators, isLoading: fetching, error };
}
